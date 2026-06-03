export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    !firebaseConfig.apiKey.startsWith('replace_'),
);

export const appConfig = {
  telegramChannelUrl: import.meta.env.VITE_TELEGRAM_CHANNEL_URL || 'https://t.me/',
  googleOauthProvider: import.meta.env.VITE_GOOGLE_OAUTH_PROVIDER || 'firebase',
  googleOauthClientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '',
  googleOauthRedirectUri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI || '',
  firebase: firebaseConfig,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export const isGoogleSignInReady = isFirebaseConfigured || Boolean(appConfig.googleOauthClientId);
export const isSupabaseReady = Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey);
