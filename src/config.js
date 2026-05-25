export const appConfig = {
  telegramChannelUrl: import.meta.env.VITE_TELEGRAM_CHANNEL_URL || 'https://t.me/',
  googleOauthProvider: import.meta.env.VITE_GOOGLE_OAUTH_PROVIDER || 'firebase',
  googleOauthClientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '',
};
