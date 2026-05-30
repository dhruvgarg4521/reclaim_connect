
# 🚀 Build APK Instructions

Complete guide to building your Reclaim app APK from the React Native wrapper.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Expo account created at [expo.dev](https://expo.dev)
- [ ] Your Vercel deployment URL ready
- [ ] Android device for testing (or Android emulator)

## 🎯 Step-by-Step Guide

### Step 1: Update Configuration (5 minutes)

1. Open `mobile-app/App.js`
2. Update the `WEB_APP_URL` with your actual Vercel URL:

```javascript
const WEB_APP_URL = 'https://your-actual-site.vercel.app';
```

⚠️ **Important**: Remove any trailing slashes from the URL!

3. Verify the `APP_SECRET` matches your web app (it should already match):

```javascript
const APP_SECRET = 'reclaim_app_2024_secure';
```

### Step 2: Create Assets (15 minutes)

You need 4 image files in the `mobile-app/assets/` folder:

1. **icon.png** (1024x1024) - App icon
2. **adaptive-icon.png** (1024x1024) - Android icon
3. **splash.png** (1284x2778) - Splash screen
4. **favicon.png** (48x48) - Small icon

#### Quick Method - Download Template:
```bash
cd mobile-app/assets
# Use placeholder images for testing (replace with real images later)
```

For detailed asset creation instructions, see `mobile-app/assets/README.md`

### Step 3: Install Dependencies (3 minutes)

```bash
cd mobile-app
npm install
```

This installs:
- Expo SDK
- React Native
- React Native WebView
- Other dependencies

### Step 4: Test Locally (5 minutes)

```bash
npm start
```

This will:
1. Start the Expo development server
2. Show a QR code in your terminal
3. Provide options to run on Android/iOS

**To test on your phone:**
1. Install "Expo Go" app from Play Store
2. Scan the QR code
3. App should open and load your web app
4. Verify it shows the actual app (not the download screen)

**To test on Android emulator:**
```bash
npm run android
```

### Step 5: Setup Expo Account (5 minutes)

Install EAS CLI globally:
```bash
npm install -g eas-cli
```

Login to Expo:
```bash
eas login
```

Configure your project:
```bash
cd mobile-app
eas build:configure
```

This will:
- Link your project to Expo
- Generate a project ID
- Update `app.json` with your project details

### Step 6: Build Production APK (20-30 minutes)

Start the build:
```bash
eas build --platform android --profile production
```

What happens:
1. ✅ Code is uploaded to Expo servers
2. ✅ Build environment is prepared
3. ✅ APK is compiled (takes 15-20 minutes)
4. ✅ You get a download link

**Build Status:**
- Monitor progress at: https://expo.dev/accounts/YOUR_USERNAME/projects/reclaim-app/builds
- You'll receive email when build completes
- Download link is valid for 30 days

### Step 7: Test APK (10 minutes)

1. Download APK from the build link
2. Transfer to Android device
3. Enable "Install from Unknown Sources" in Android settings
4. Install the APK
5. Open the app

**Verify these work:**
- [ ] App opens successfully
- [ ] Shows your web app content (not download screen)
- [ ] Back button works
- [ ] Internet connection error handling works
- [ ] App looks good and loads fast

### Step 8: Test Web Detection

Open your Vercel URL in a browser (without the app):
- [ ] Should show the "Download App" screen
- [ ] QR code should be visible
- [ ] Download button should be visible

This confirms the app-only access is working!

## 🔄 Building Updates

When you update your web app, users automatically get the changes (no app update needed!).

To update the app wrapper itself:

1. Update version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
  }
}
```

2. Build new APK:
```bash
eas build --platform android --profile production
```

## 🐛 Troubleshooting

### "Build failed" error

**Solution 1**: Check all assets exist
```bash
ls mobile-app/assets/
# Should show: icon.png, adaptive-icon.png, splash.png, favicon.png
```

**Solution 2**: Verify app.json syntax
```bash
cd mobile-app
cat app.json | jq .  # Validates JSON syntax
```

**Solution 3**: Run diagnostics
```bash
expo doctor
```

### "App shows download screen"

This means the token isn't working. Check:

1. `APP_SECRET` matches in both files:
   - `mobile-app/App.js`
   - `src/main.jsx`

2. URL is correct in `App.js`:
   ```javascript
   const WEB_APP_URL = 'https://YOUR-SITE.vercel.app';
   ```

3. Clear app data and reinstall

### "WebView not loading"

**Check:**
1. Internet connection on device
2. Vercel site is live (visit in browser)
3. No trailing slash in URL
4. HTTPS is working

**Debug:**
```javascript
// Add to App.js to see errors
onError={(syntheticEvent) => {
  console.error('WebView error:', syntheticEvent.nativeEvent);
}}
```

### "Build stuck or taking too long"

- Builds typically take 15-25 minutes
- Check status at expo.dev
- If stuck >30 minutes, cancel and retry:
  ```bash
  eas build:list
  eas build --platform android --profile production
  ```

### "Can't install APK on device"

1. Enable "Unknown Sources" in Android settings:
   - Settings → Security → Unknown Sources
   - Or Settings → Apps → Special Access → Install unknown apps

2. If still blocked, your organization may restrict app installation

## 📱 Building for Different Profiles

### Development Build (for testing)
```bash
eas build --platform android --profile development
```
- Includes debugging tools
- Faster builds
- Larger file size

### Preview Build (for stakeholders)
```bash
eas build --platform android --profile preview
```
- Production-like
- Generates APK (not AAB)
- Good for sharing

### Production Build (for Play Store)
```bash
eas build --platform android --profile production
```
- Optimized and minified
- Can generate AAB for Play Store
- Smallest file size

## 🏪 Publishing to Play Store (Optional)

After testing your APK, you can publish to Google Play Store:

1. **Create Google Play Developer Account**
   - Cost: $25 one-time fee
   - Visit: https://play.google.com/console

2. **Generate App Bundle (AAB)**
   ```bash
   # Edit eas.json to change buildType from "apk" to "app-bundle"
   eas build --platform android --profile production
   ```

3. **Submit to Play Store**
   ```bash
   eas submit --platform android --profile production
   ```

4. **Update QR Code in Web App**
   - Once app is live on Play Store
   - Update `src/main.jsx` with Play Store link
   - Lines 169 and 176

See `mobile-app/README.md` for detailed Play Store publishing instructions.

## 💰 Cost Summary

- **Expo Builds**: 
  - Free tier: Limited builds per month
  - Paid: $29/month for unlimited builds
  
- **Google Play Store**: 
  - $25 one-time registration fee
  
- **Total to get started**: $0-25

## 📞 Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **Expo Forums**: https://forums.expo.dev
- **Build Troubleshooting**: https://docs.expo.dev/build/introduction/
- **React Native WebView**: https://github.com/react-native-webview/react-native-webview

## ✅ Final Checklist

Before considering the build complete:

- [ ] APK installs and runs on Android device
- [ ] App loads your Vercel web app correctly
- [ ] Token authentication is working (no download screen in app)
- [ ] Web browser shows download screen correctly
- [ ] Back button navigation works
- [ ] App handles no internet connection gracefully
- [ ] App icon and splash screen display correctly
- [ ] App name shows correctly on device
- [ ] All basic features of web app work in mobile

## 🎉 Success!

Once all checklist items pass, you have successfully:
1. ✅ Created a mobile app wrapper
2. ✅ Built a production APK
3. ✅ Tested on real device
4. ✅ Verified app-only access works

Next steps:
- Share APK with beta testers
- Gather feedback
- Optionally publish to Play Store
- Monitor user experience

---

**Need more help?** Check:
- `QUICK_START.txt` - Quick reference guide
- `SETUP_GUIDE.md` - Detailed setup steps
- `README.md` - Complete documentation
