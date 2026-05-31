import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { appConfig, isFirebaseConfigured } from './config';

let app = null;
let auth = null;

function getFirebaseAuth() {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = initializeApp(appConfig.firebase);
    auth = getAuth(app);
  }
  return auth;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  const existing = document.querySelector('script[data-google-identity]');
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Sign-In')), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });
}

export function shouldUseGoogleRedirect() {
  const ua = navigator.userAgent || '';
  return (
    window.__RECLAIM_WEBVIEW__ === true ||
    typeof window.ReactNativeWebView !== 'undefined' ||
    /;\swv\)/i.test(ua) ||
    /WebView/i.test(ua)
  );
}

export function getGoogleOAuthRedirectUri() {
  const configured = appConfig.googleOauthRedirectUri.trim();
  if (configured) return configured;

  // Must match Google Cloud "Authorized redirect URIs" exactly (no trailing slash).
  return window.location.origin;
}

function mapGoogleProfile(profile) {
  return {
    uid: profile.sub,
    name: profile.name || 'Google User',
    email: profile.email || '',
    photoURL: profile.picture || '',
    provider: 'google',
    signedInAt: new Date().toISOString(),
  };
}

async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google profile');
  }

  const profile = await response.json();
  return mapGoogleProfile(profile);
}

function signInWithGoogleGisRedirect(clientId) {
  const redirectUri = getGoogleOAuthRedirectUri();
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'token');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('include_granted_scopes', 'true');
  authUrl.searchParams.set('prompt', 'select_account');

  const authUrlString = authUrl.toString();

  if (window.ReactNativeWebView?.postMessage) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'GOOGLE_OAUTH_START',
        authUrl: authUrlString,
        redirectUri,
      }),
    );
    return;
  }

  window.location.assign(authUrlString);
}

async function signInWithGoogleGisPopup(clientId) {
  await loadGoogleIdentityServices();

  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error_description || tokenResponse.error));
          return;
        }

        try {
          resolve(await fetchGoogleProfile(tokenResponse.access_token));
        } catch (error) {
          reject(error);
        }
      },
    });

    client.requestAccessToken({ prompt: 'select_account' });
  });
}

async function signInWithGoogleGis(clientId) {
  if (shouldUseGoogleRedirect()) {
    signInWithGoogleGisRedirect(clientId);
    return null;
  }

  return signInWithGoogleGisPopup(clientId);
}

export async function completeGisRedirectSignIn() {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const error = params.get('error');

  if (!accessToken && !error) return null;

  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState({}, document.title, cleanUrl);

  if (error) {
    throw new Error(params.get('error_description') || error);
  }

  return fetchGoogleProfile(accessToken);
}

async function signInWithFirebaseGoogle() {
  const authInstance = getFirebaseAuth();
  if (!authInstance) return null;

  if (shouldUseGoogleRedirect()) {
    await signInWithRedirect(authInstance, googleProvider);
    return null;
  }

  const result = await signInWithPopup(authInstance, googleProvider);
  return mapFirebaseUser(result.user);
}

export async function signInWithGoogle() {
  if (isFirebaseConfigured) {
    return signInWithFirebaseGoogle();
  }

  if (appConfig.googleOauthClientId) {
    return signInWithGoogleGis(appConfig.googleOauthClientId);
  }

  throw new Error(
    'Google sign-in is not configured. Add VITE_GOOGLE_OAUTH_CLIENT_ID or full VITE_FIREBASE_* values to .env.local, then restart the dev server.',
  );
}

export async function completeGoogleRedirectSignIn() {
  const authInstance = getFirebaseAuth();
  if (!authInstance) return null;

  const result = await getRedirectResult(authInstance);
  return result?.user ? mapFirebaseUser(result.user) : null;
}

export async function completeRedirectSignIn() {
  if (isFirebaseConfigured) {
    return completeGoogleRedirectSignIn();
  }

  if (appConfig.googleOauthClientId) {
    return completeGisRedirectSignIn();
  }

  return null;
}

export async function firebaseSignOut() {
  const authInstance = getFirebaseAuth();
  if (authInstance) {
    await signOut(authInstance);
  }
}

export function subscribeToAuthChanges(callback) {
  const authInstance = getFirebaseAuth();
  if (!authInstance) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(authInstance, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
}

export function mapFirebaseUser(user) {
  return {
    uid: user.uid,
    name: user.displayName || 'Google User',
    email: user.email || '',
    photoURL: user.photoURL || '',
    provider: 'firebase',
    signedInAt: new Date().toISOString(),
  };
}

export { isFirebaseConfigured };
