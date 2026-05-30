
# Reclaim - React Native Mobile App Wrapper

This React Native app wraps your Vercel-hosted web app in a mobile shell, providing app-only access with the secret token.

## Prerequisites

Before starting, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Expo CLI**: `npm install -g expo-cli`
4. **EAS CLI**: `npm install -g eas-cli`
5. **Expo Account**: Sign up at [expo.dev](https://expo.dev)

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Configure Your Web App URL

Open [`App.js`](./App.js) and update these constants:

```javascript
const APP_SECRET = 'reclaim_app_2024_secure'; // Must match web app secret
const WEB_APP_URL = 'https://your-actual-site.vercel.app'; // Your Vercel URL
```

### 3. Update App Configuration

Edit [`app.json`](./app.json):

```json
{
  "expo": {
    "name": "Reclaim",
    "android": {
      "package": "com.reclaim.app"  // Change if needed
    }
  }
}
```

### 4. Test Locally

```bash
# Start Expo development server
npm start

# Or run directly on Android
npm run android

# Or run on iOS
npm run ios
```

Scan the QR code with Expo Go app to test on your device.

## Building for Production

### Step 1: Create Expo Account & Project

```bash
# Login to Expo
eas login

# Initialize project
eas build:configure
```

Update [`app.json`](./app.json) with your project ID from Expo dashboard.

### Step 2: Build APK

```bash
# Build production APK
eas build --platform android --profile production

# Or build preview APK for testing
eas build --platform android --profile preview
```

The build process takes 10-20 minutes. Once complete, you'll get a download link for the APK.

### Step 3: Test the APK

1. Download the APK from the EAS build link
2. Install on your Android device
3. Verify the app loads your web app with the token
4. Test that web browser users see the download screen

## Publishing to Google Play Store

### Step 1: Create Google Play Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay the $25 one-time registration fee
3. Complete account setup

### Step 2: Create App Listing

1. Click "Create app" in Play Console
2. Fill in app details:
   - **App name**: Reclaim
   - **Default language**: English (India)
   - **App type**: App
   - **Category**: Health & Fitness
   - **Contact email**: Your email

### Step 3: Prepare Store Assets

Create these assets (you can use tools like Canva):

**Icon (512x512 PNG)**:
- Place in `assets/icon.png`
- Should represent your brand

**Feature Graphic (1024x500 PNG)**:
- Promotional banner for store listing

**Screenshots (minimum 2)**:
- Take screenshots of your app in action
- Recommended: 1080x1920 (phone portrait)

**Privacy Policy**:
- Create a privacy policy page
- Host it on your website or use a generator

### Step 4: Complete Store Listing

In Play Console, fill out:

1. **Store listing**:
   - App name: Reclaim
   - Short description: "Guruji's path to freedom and recovery"
   - Full description: Detailed app benefits
   - Upload icon, feature graphic, screenshots

2. **App content**:
   - Privacy policy URL
   - App category: Health & Fitness
   - Content rating questionnaire
   - Target audience: 18+

3. **Pricing & distribution**:
   - Free or Paid
   - Countries to distribute
   - Check "Content guidelines" box

### Step 5: Generate Service Account Key

```bash
# Follow steps in Play Console:
# Setup → API access → Create service account
# Download JSON key file
# Save as service-account.json in mobile-app folder
```

### Step 6: Submit to Play Store

```bash
# Build production APK/AAB
eas build --platform android --profile production

# After build completes, submit to Play Store
eas submit --platform android --profile production
```

Follow prompts to:
1. Select the build to submit
2. Confirm submission

### Step 7: Review Process

1. Google reviews your app (typically 1-7 days)
2. Check Play Console for review status
3. Address any issues if app is rejected
4. Once approved, app goes live!

## Post-Launch

### Update the QR Code

Once your app is live, update the QR code in your web app:

In [`src/main.jsx`](../src/main.jsx), line 169, replace with your actual Play Store URL:

```javascript
src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.reclaim.app')}`}
```

And in line 176:

```javascript
href="https://play.google.com/store/apps/details?id=com.reclaim.app"
```

### Update App Versions

When you make changes to the web app, no app update needed! The app will automatically load the latest web version.

To update the app wrapper itself:

1. Update version in [`app.json`](./app.json)
2. Build new APK: `eas build --platform android`
3. Submit update: `eas submit --platform android`

## Troubleshooting

### "WebView not loading"
- Check internet connection
- Verify `WEB_APP_URL` is correct
- Check if website is live on Vercel

### "Token not working"
- Ensure `APP_SECRET` matches in both web and mobile app
- Clear app data and reinstall

### "Build failed"
- Check `app.json` for typos
- Ensure all assets exist in `assets/` folder
- Run `expo doctor` to check for issues

### "Can't see download screen on web"
- Open web URL directly (without token) in incognito
- Clear localStorage in browser
- Check browser console for errors

## Security Notes

1. **Keep APP_SECRET private** - Don't commit it to public repos
2. **Use environment variables** for production secrets
3. **Enable HTTPS** - Ensure your Vercel site uses HTTPS
4. **Regularly update** - Keep dependencies updated

## Cost Breakdown

- **Expo Build**: Free (limited builds) or $29/month (unlimited)
- **Google Play Developer**: $25 one-time fee
- **No hosting costs** - Using Expo infrastructure

## Support

For issues with:
- **Expo/EAS**: [Expo Forums](https://forums.expo.dev)
- **Google Play**: [Play Console Help](https://support.google.com/googleplay)
- **React Native**: [React Native Docs](https://reactnative.dev)

## Next Steps

1. ✅ Test app locally with `npm start`
2. ✅ Build APK with `eas build`
3. ✅ Test APK on physical device
4. ✅ Create Play Console account
5. ✅ Prepare store assets
6. ✅ Submit to Google Play Store
7. ✅ Update QR code after app goes live

Good luck with your app launch! 🚀
