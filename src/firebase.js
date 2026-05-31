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
    typeof window.ReactNativeWebView !== 'undefined' ||
    /;\swv\)/i.test(ua) ||
    /WebView/i.test(ua)
  );
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

async function signInWithGoogleGis(clientId) {
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
          const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch Google profile');
          }

          const profile = await response.json();
          resolve(mapGoogleProfile(profile));
        } catch (error) {
          reject(error);
        }
      },
    });

    client.requestAccessToken({ prompt: 'select_account' });
  });
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
