
import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleSheet, SafeAreaView, StatusBar, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

/**
 * IMPORTANT: Update these constants before building your APK
 */

// Must match APP_SECRET in src/main.jsx of your web app
const APP_SECRET = 'reclaim_app_2024_secure';

// Must match VITE_GOOGLE_OAUTH_REDIRECT_URI on Vercel (no trailing slash)
const GOOGLE_OAUTH_REDIRECT_URI = 'https://reclaim-connect.vercel.app';

// TODO: Replace with your actual Vercel deployment URL (remove trailing slash!)
const WEB_APP_URL = 'https://reclaim-connect.vercel.app';

WebBrowser.maybeCompleteAuthSession();

const WEBVIEW_BOOTSTRAP_SCRIPT = `
  window.__RECLAIM_WEBVIEW__ = true;
  true;
`;

function isGoogleOAuthUrl(url) {
  return (
    url.includes('accounts.google.com/o/oauth2') ||
    url.includes('accounts.google.com/signin') ||
    url.includes('accounts.google.com/v3/signin')
  );
}

export default function App() {
  const webViewRef = useRef(null);

  const finishOAuthInWebView = useCallback((returnUrl) => {
    if (!returnUrl || !webViewRef.current) return;

    webViewRef.current.injectJavaScript(`
      (function() {
        if (window.__reclaimHandleOAuthReturn) {
          window.__reclaimHandleOAuthReturn(${JSON.stringify(returnUrl)});
        } else {
          window.location.replace(${JSON.stringify(returnUrl)});
        }
      })();
      true;
    `);
  }, []);

  const openGoogleOAuthInSystemBrowser = useCallback(
    async (authUrl) => {
      try {
        const result = await WebBrowser.openAuthSessionAsync(
          authUrl,
          GOOGLE_OAUTH_REDIRECT_URI,
        );

        if (result.type === 'success' && result.url) {
          finishOAuthInWebView(result.url);
          return;
        }

        if (result.type === 'cancel') {
          return;
        }

        Alert.alert('Sign-in failed', 'Google sign-in did not complete. Please try again.');
      } catch (error) {
        Alert.alert('Sign-in failed', error?.message || 'Google sign-in failed.');
      }
    },
    [finishOAuthInWebView],
  );

  const handleWebViewMessage = useCallback(
    (event) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'GOOGLE_OAUTH_START' && data.authUrl) {
          openGoogleOAuthInSystemBrowser(data.authUrl);
        }
      } catch {
        // Ignore non-JSON messages from the web app.
      }
    },
    [openGoogleOAuthInSystemBrowser],
  );

  const shouldStartLoad = useCallback(
    (request) => {
      if (isGoogleOAuthUrl(request.url)) {
        openGoogleOAuthInSystemBrowser(request.url);
        return false;
      }
      return true;
    },
    [openGoogleOAuthInSystemBrowser],
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert(
      'Connection Error',
      'Failed to load the app. Please check your internet connection.',
      [{ text: 'Retry', onPress: () => webViewRef.current?.reload() }],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1014" />
      <WebView
        ref={webViewRef}
        source={{
          uri: `${WEB_APP_URL}?app_token=${APP_SECRET}`,
        }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        onShouldStartLoadWithRequest={shouldStartLoad}
        onError={handleError}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        setSupportMultipleWindows={false}
        javaScriptCanOpenWindowsAutomatically={false}
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
