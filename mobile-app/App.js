
import React, { useEffect } from 'react';
import { Platform, StyleSheet, SafeAreaView, StatusBar, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * IMPORTANT: Update these constants before building your APK
 */

// Must match APP_SECRET in src/main.jsx of your web app
const APP_SECRET = 'reclaim_app_2024_secure';

// TODO: Replace with your actual Vercel deployment URL (remove trailing slash!)
const WEB_APP_URL = 'https://reclaim-connect.vercel.app';

const WEBVIEW_BOOTSTRAP_SCRIPT = `
  window.__RECLAIM_WEBVIEW__ = true;
  true;
`;

export default function App() {
  const webViewRef = React.useRef(null);

  useEffect(() => {
    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Prevent default back behavior
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);

  const handleNavigationStateChange = (navState) => {
    // Optional: Log navigation for debugging
    console.log('Current URL:', navState.url);
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert(
      'Connection Error',
      'Failed to load the app. Please check your internet connection.',
      [{ text: 'Retry', onPress: () => webViewRef.current?.reload() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#0B1014" 
      />
      <WebView
        ref={webViewRef}
        source={{ 
          uri: `${WEB_APP_URL}?app_token=${APP_SECRET}` 
        }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        setSupportMultipleWindows={false}
        javaScriptCanOpenWindowsAutomatically={true}
        injectedJavaScriptBeforeContentLoaded={WEBVIEW_BOOTSTRAP_SCRIPT}
        allowsBackForwardNavigationGestures={true}
        originWhitelist={['https://*', 'http://*']}
        mixedContentMode="always"
        bounces={false}
        {...Platform.select({
          android: {
            nestedScrollEnabled: true,
          },
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1014',
  },
  webview: {
    flex: 1,
  },
});
