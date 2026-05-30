
import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const APP_SECRET = 'reclaim_app_2024_secure'; // Must match the secret in your web app
const WEB_APP_URL = 'https://your-vercel-site.vercel.app'; // Replace with your actual Vercel URL

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
        allowsBackForwardNavigationGestures={true}
        // Android specific
        mixedContentMode="always"
        // iOS specific
        bounces={false}
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
