
# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Configure App Settings

Edit [`App.js`](./App.js) and update:

```javascript
const APP_SECRET = 'reclaim_app_2024_secure'; // Must match src/main.jsx
const WEB_APP_URL = 'https://your-actual-vercel-site.vercel.app';
```

### 3. Create Assets Folder

Create a folder called `assets` in the `mobile-app` directory and add these files:

```
mobile-app/
  assets/
    icon.png (1024x1024 - App icon)
    adaptive-icon.png (1024x1024 - Android adaptive icon)
    splash.png (1284x2778 - Splash screen)
    favicon.png (48x48 - Web favicon)
```

You can create simple placeholder images for testing using any design tool.

### 4. Create .gitignore File

Create a file named `.gitignore` in the `mobile-app` folder with this content:

```
# Dependencies
node_modules/

# Expo
.expo/
.expo-shared/
dist/
web-build/

# Build artifacts
*.apk
*.aab
*.ipa

# Service account keys (IMPORTANT - Never commit!)
service-account.json
google-services.json

# Environment files
.env
.env.local
.env.production

# Native
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo
```

### 5. Test Locally

```bash
# Start development server
npm start

# Scan QR code with Expo Go app on your phone
# Or press 'a' to open in Android emulator
```

### 6. Build APK

First, install EAS CLI globally:

```bash
npm install -g eas-cli
```

Login to Expo:

```bash
eas login
```

Configure the project:

```bash
eas build:configure
```

Build the APK:

```bash
eas build --platform android --profile production
```

Wait for build to complete (10-20 minutes). You'll get a download link for the APK.

### 7. Test APK

1. Download the APK from the link provided
2. Install on your Android device
3. Open the app and verify it shows your web app (not the download screen)
4. Open the web app in a browser and verify it shows the download screen

## Important Security Notes

⚠️ **NEVER commit these files to public repositories:**
- `service-account.json` (Google Play service account key)
- Any `.env` files with secrets
- Keystore files (`.jks`, `.keystore`)

✅ **Always keep in sync:**
- `APP_SECRET` in `mobile-app/App.js`
- `APP_SECRET` in `src/main.jsx` (web app)

## Verification Checklist

Before submitting to Play Store:

- [ ] App loads web app correctly with token
- [ ] Web browser shows download screen (no token)
- [ ] Back button works correctly in app
- [ ] Internet connection error handling works
- [ ] App icon and name are correct
- [ ] Privacy policy URL is valid
- [ ] All store listing content is ready
- [ ] App version numbers are updated

## Quick Commands Reference

```bash
# Development
npm start                    # Start dev server
npm run android             # Run on Android

# Building
eas build -p android        # Build for Android
eas build -p android --profile preview  # Build preview APK

# Submitting
eas submit -p android       # Submit to Play Store

# Debugging
expo doctor                 # Check for issues
eas build:list             # List all builds
```

## Common Issues & Solutions

**Issue**: App shows download screen
**Solution**: Check that APP_SECRET matches in both apps

**Issue**: Build fails
**Solution**: 
- Run `expo doctor` to check for issues
- Ensure all files in `app.json` exist
- Check that package.json has correct versions

**Issue**: Can't submit to Play Store
**Solution**:
- Ensure you have a valid service-account.json
- Check that package name is unique
- Verify all Play Console sections are complete

## Need Help?

Check the full [`README.md`](./README.md) for detailed instructions on:
- Setting up Google Play Console
- Creating store assets
- Publishing process
- Troubleshooting

## What's Next?

After setup:
1. Build and test APK locally
2. Create Google Play Developer account ($25)
3. Set up store listing
4. Submit app for review
5. Update QR code with Play Store link once live
