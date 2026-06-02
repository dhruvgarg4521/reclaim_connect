
import React, { useCallback, useEffect, useRef } from 'react';
import { Linking, Platform, StyleSheet, SafeAreaView, StatusBar, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

const APP_SECRET = 'reclaim_app_2024_secure';

const GOOGLE_CLIENT_ID =
  '369715680831-9i7v8fjnk9gqckm272k29rk73n45gf60.apps.googleusercontent.com';

// Sent to Google (https only — registered in Google Cloud redirect URIs).
const GOOGLE_REDIRECT_URI = 'https://reclaim-connect.vercel.app/oauth-callback.html';

// The callback page bounces to this custom scheme so the OS can return to the app.
const APP_RETURN_URL = 'com.reclaim.app://oauth';

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

function hasOAuthToken(url) {
  return (
    typeof url === 'string' &&
    (url.startsWith(APP_RETURN_URL) || url.includes('/oauth-callback.html')) &&
    (url.includes('access_token=') || url.includes('error='))
  );
}

function buildGoogleAuthUrl(clientId) {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'token');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('include_granted_scopes', 'true');
  authUrl.searchParams.set('prompt', 'select_account');
  return authUrl.toString();
}

export default function App() {
  const webViewRef = useRef(null);
  const oauthInFlight = useRef(false);

  const finishOAuthInWebView = useCallback((returnUrl) => {
    if (!returnUrl || !webViewRef.current) return;

    webViewRef.current.injectJavaScript(`
      (function() {
        if (window.__reclaimHandleOAuthReturn) {
          window.__reclaimHandleOAuthReturn(${JSON.stringify(returnUrl)});
        } else {
          window.location.replace(${JSON.stringify(WEB_APP_URL + '?app_token=' + APP_SECRET)});
        }
      })();
      true;
    `);
  }, []);

  const openGoogleOAuthInSystemBrowser = useCallback(
    async (clientId) => {
      if (oauthInFlight.current) return;
      oauthInFlight.current = true;

      try {
        const authUrl = buildGoogleAuthUrl(clientId || GOOGLE_CLIENT_ID);

        const result = await WebBrowser.openAuthSessionAsync(authUrl, APP_RETURN_URL, {
          showInRecents: false,
        });

        if (result.type === 'success' && result.url) {
          finishOAuthInWebView(result.url);
          return;
        }

        // type 'cancel'/'dismiss' — user closed the browser, do nothing.
      } catch (error) {
        Alert.alert('Sign-in failed', error?.message || 'Google sign-in failed.');
      } finally {
        oauthInFlight.current = false;
      }
    },
    [finishOAuthInWebView],
  );

  const handleDeepLink = useCallback(
    (url) => {
      if (hasOAuthToken(url)) {
        finishOAuthInWebView(url);
      }
    },
    [finishOAuthInWebView],
  );

  const handleWebViewMessage = useCallback(
    (event) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'GOOGLE_OAUTH_START') {
          openGoogleOAuthInSystemBrowser(data.clientId || GOOGLE_CLIENT_ID);
        } else if (data.type === 'GOOGLE_OAUTH_RESULT' && data.hash) {
          finishOAuthInWebView(`${APP_RETURN_URL}${data.hash}`);
        }
      } catch {
        // Ignore non-JSON messages from the web app.
      }
    },
    [finishOAuthInWebView, openGoogleOAuthInSystemBrowser],
  );

  const shouldStartLoad = useCallback(
    (request) => {
      if (hasOAuthToken(request.url)) {
        finishOAuthInWebView(request.url);
        return false;
      }
      if (isGoogleOAuthUrl(request.url)) {
        openGoogleOAuthInSystemBrowser(GOOGLE_CLIENT_ID);
        return false;
      }
      return true;
    },
    [finishOAuthInWebView, openGoogleOAuthInSystemBrowser],
  );

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, [handleDeepLink]);

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
        originWhitelist={['https://*', 'http://*', 'com.reclaim.app://*']}
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
