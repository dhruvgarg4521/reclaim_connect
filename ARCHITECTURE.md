
# Reclaim - System Architecture

## Overview

This document explains how the app-only access protection works and how the React Native wrapper integrates with the web application.

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     USER ACCESS FLOW                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐                           ┌──────────────┐
│   Web User   │                           │   App User   │
│ (No Token)   │                           │ (Has Token)  │
└──────┬───────┘                           └──────┬───────┘
       │                                          │
       │ Opens: https://site.com                  │ Opens: App
       │                                          │
       ▼                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Web Application                           │
│                  (Vercel Hosted)                             │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Authentication Check (src/main.jsx)                   │  │
│  │                                                       │  │
│  │ 1. Check URL param: ?app_token=SECRET                │  │
│  │ 2. Check localStorage: AUTH_KEY                      │  │
│  │                                                       │  │
│  │    ✗ No token                  ✓ Valid token        │  │
│  │         │                           │                │  │
│  │         ▼                           ▼                │  │
│  │  ┌──────────────┐          ┌──────────────┐         │  │
│  │  │   Download   │          │  Full App    │         │  │
│  │  │    Screen    │          │  Experience  │         │  │
│  │  │              │          │              │         │  │
│  │  │ • QR Code    │          │ • Home       │         │  │
│  │  │ • Play Store │          │ • Pledge     │         │  │
│  │  │ • Features   │          │ • AI Guide   │         │  │
│  │  └──────────────┘          │ • Meditate   │         │  │
│  │                            │ • All Features│         │  │
│  │                            └──────────────┘         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
       │                                          │
       │                                          │
       ▼                                          ▼
 Scans QR Code                              Saves auth
 Downloads App                            in localStorage
```

## Authentication Flow

### 1. Web User Flow (No Token)

```javascript
// User opens: https://your-site.vercel.app

// src/main.jsx checks:
const params = new URLSearchParams(window.location.search);
const urlToken = params.get('app_token'); // null
const storedAuth = localStorage.getItem(AUTH_KEY); // null

// Result: isAuthorized = false
// Shows: DownloadAppScreen component
```

**DownloadAppScreen shows:**
- App branding and tagline
- QR code linking to Play Store
- "Get it on Google Play" button
- Feature highlights
- "App-only experience" message

### 2. App User Flow (With Token)

```javascript
// React Native WebView loads:
// https://your-site.vercel.app?app_token=reclaim_app_2024_secure

// src/main.jsx checks:
const urlToken = params.get('app_token'); // 'reclaim_app_2024_secure'

// Validates:
if (urlToken === APP_SECRET) {
  localStorage.setItem(AUTH_KEY, 'true'); // Persist authorization
  setIsAuthorized(true);
  // Clean URL (remove token)
  window.history.replaceState({}, document.title, window.location.pathname);
}

// Result: isAuthorized = true
// Shows: Full App component with all features
```

**User sees:**
- Complete Reclaim application
- All tabs (Home, Pledge, AI, Meditate, More)
- Full functionality
- No download screen

## File Structure

```
project-root/
├── src/
│   ├── main.jsx              # Web app with auth logic
│   ├── styles.css            # Includes download screen styles
│   └── config.js             # App configuration
│
├── mobile-app/               # React Native wrapper
│   ├── App.js               # WebView with token injection
│   ├── app.json             # Expo configuration
│   ├── package.json         # Dependencies
│   ├── eas.json             # Build configuration
│   ├── README.md            # Detailed documentation
│   ├── SETUP_GUIDE.md       # Step-by-step setup
│   └── QUICK_START.txt      # Quick reference guide
│
├── index.html               # Web app entry point
├── package.json             # Web app dependencies
└── ARCHITECTURE.md          # This file
```

## Security Implementation

### Secret Token

The secret token provides basic access control:

```javascript
// Web App (src/main.jsx)
const APP_SECRET = 'reclaim_app_2024_secure';
const AUTH_KEY = 'reclaim-app-authorized';

// Mobile App (mobile-app/App.js)
const APP_SECRET = 'reclaim_app_2024_secure'; // MUST MATCH
const WEB_APP_URL = 'https://your-site.vercel.app';

// WebView loads:
source={{ uri: `${WEB_APP_URL}?app_token=${APP_SECRET}` }}
```

### Authorization Persistence

```javascript
// After successful auth, token stored in localStorage:
localStorage.setItem(AUTH_KEY, 'true');

// Future visits check storage:
const storedAuth = localStorage.getItem(AUTH_KEY);
if (storedAuth === 'true') {
  setIsAuthorized(true); // No token needed again
}
```

### URL Cleanup

```javascript
// After successful auth, token removed from URL:
window.history.replaceState({}, document.title, window.location.pathname);

// URL changes from:
// https://site.com?app_token=secret
// To:
// https://site.com

// This prevents token from being visible in browser history
```

## React Native WebView Integration

### App.js Components

```javascript
export default function App() {
  const webViewRef = React.useRef(null);

  // Features:
  // 1. Token injection via URL parameter
  // 2. Back button handling for Android
  // 3. Error handling with retry
  // 4. Loading states
  // 5. JavaScript and storage enabled
  
  return (
    <WebView
      source={{ uri: `${WEB_APP_URL}?app_token=${APP_SECRET}` }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      cacheEnabled={true}
      // ... other props
    />
  );
}
```

### Key Features

1. **Token Injection**: Automatically adds token to URL
2. **Native Navigation**: Android back button support
3. **Offline Handling**: Shows error with retry option
4. **Storage**: Enables localStorage for web app
5. **Caching**: Improves performance

## Download Screen

### Design Features

- **Responsive Layout**: Adapts to all screen sizes
- **QR Code**: Dynamic generation via API
- **Store Button**: Direct link to Play Store
- **Feature List**: Shows app benefits
- **Brand Consistency**: Matches app theme (#FFCC80)

### CSS Styling

```css
.download-app-screen {
  background: linear-gradient(135deg, #0B1014 0%, #131920 100%);
  /* Centers content with full viewport height */
}

.qr-code-container {
  background: #FFFFFF; /* White background for QR */
  padding: 20px;
  border-radius: 12px;
}

.store-button {
  background: linear-gradient(135deg, #FFCC80 0%, #FFB347 100%);
  /* Golden gradient matching app theme */
}
```

## Deployment Workflow

### 1. Web App (Vercel)

```bash
# Deploy web app
git push origin main

# Vercel automatically deploys
# URL: https://your-project.vercel.app
```

### 2. Mobile App (Expo)

```bash
# Build APK
cd mobile-app
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

### 3. Update QR Code

After app is live on Play Store:

```javascript
// src/main.jsx - Update URLs (lines 169, 176)
const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.reclaim.app';
```

## Security Best Practices

### ✅ DO

1. **Keep secrets private**: Never commit `service-account.json`
2. **Use strong tokens**: Change default `APP_SECRET`
3. **Sync tokens**: Keep mobile and web secrets identical
4. **Use HTTPS**: Ensure Vercel site uses HTTPS
5. **Regular updates**: Keep dependencies updated

### ❌ DON'T

1. **Expose tokens**: Don't commit secrets to public repos
2. **Reuse tokens**: Use unique secrets per project
3. **Skip validation**: Always verify token matches
4. **Ignore updates**: Keep libraries up to date
5. **Share credentials**: Keep service account keys private

## Testing Checklist

### Web App Testing

- [ ] Open site in browser (should show download screen)
- [ ] Open with token URL (should show full app)
- [ ] Clear localStorage and reload (should show download screen)
- [ ] Click QR code (should be scannable)
- [ ] Click Play Store button (should have correct link)

### Mobile App Testing

- [ ] App opens successfully
- [ ] Shows full app (not download screen)
- [ ] All features work correctly
- [ ] Back button navigates within app
- [ ] Internet error shows retry option
- [ ] App icon displays correctly

### Integration Testing

- [ ] Token authentication works
- [ ] localStorage persists authorization
- [ ] URL cleanup removes token
- [ ] Web and mobile secrets match
- [ ] QR code links to correct app

## Troubleshooting

### App Shows Download Screen

**Cause**: Token mismatch or missing
**Fix**: Verify `APP_SECRET` matches in both apps

```javascript
// Check mobile-app/App.js
const APP_SECRET = 'reclaim_app_2024_secure';

// Check src/main.jsx
const APP_SECRET = 'reclaim_app_2024_secure';
```

### Web Shows Full App (Should Show Download)

**Cause**: Authorization stored in localStorage
**Fix**: Clear browser localStorage

```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### QR Code Not Working

**Cause**: Invalid Play Store URL
**Fix**: Update URL after app is published

```javascript
// src/main.jsx - Line 169
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('YOUR_PLAY_STORE_URL')}`;
```

## Performance Considerations

### Web App

- **Lazy Loading**: Components load on demand
- **Code Splitting**: Reduces initial bundle size
- **Asset Optimization**: Images and fonts optimized
- **Caching**: localStorage reduces API calls

### Mobile App

- **WebView Caching**: Enabled for faster loads
- **Network Optimization**: Handles offline gracefully
- **Memory Management**: WebView cleans up properly
- **Battery Efficiency**: Minimal background activity

## Future Enhancements

### Potential Improvements

1. **Enhanced Security**
   - JWT tokens instead of static secrets
   - OAuth 2.0 authentication
   - Rate limiting for web access

2. **Better UX**
   - Deep linking from QR code
   - Progressive web app (PWA) support
   - Offline mode for mobile app

3. **Analytics**
   - Track download screen visits
   - Monitor app usage metrics
   - A/B test download screen designs

4. **Monetization**
   - In-app purchases for premium features
   - Subscription management
   - Referral system

## Support Resources

- **Web App**: Vite + React documentation
- **Mobile App**: Expo + React Native docs
- **Deployment**: Vercel and Google Play Console
- **QR Codes**: QR Server API documentation

## Version History

- **v1.0.0**: Initial release with token-based auth
- App-only access with download screen
- React Native WebView wrapper
- Google Play Store integration ready

---

For detailed setup instructions, see:
- [`mobile-app/README.md`](mobile-app/README.md)
- [`mobile-app/SETUP_GUIDE.md`](mobile-app/SETUP_GUIDE.md)
- [`mobile-app/QUICK_START.txt`](mobile-app/QUICK_START.txt)
