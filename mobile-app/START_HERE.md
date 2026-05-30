
# 🎯 START HERE - Your Complete Setup Guide

**Ready to create your mobile app? Follow these exact steps:**

---

## ⚡ Quick Overview

You have everything you need to build an APK! Just follow 7 simple steps:

1. Update your Vercel URL *(2 minutes)*
2. Create app assets *(15 minutes)*
3. Install dependencies *(3 minutes)*
4. Test locally *(5 minutes)*
5. Setup Expo account *(5 minutes)*
6. Build APK *(20 minutes)*
7. Test on device *(10 minutes)*

**Total time: ~1 hour**

---

## 📋 Before You Start

Make sure you have:
- ✅ Node.js installed (v18+)
- ✅ Your Vercel deployment URL ready
- ✅ Android device for testing (or use emulator)

**Check Node.js version:**
```bash
node --version
# Should show v18.0.0 or higher
```

Don't have Node.js? Download from: https://nodejs.org

---

## 🚀 Step-by-Step Instructions

### STEP 1: Update Your Configuration

**File to edit:** `mobile-app/App.js`

1. Open the file in your code editor
2. Find line 12 (look for `WEB_APP_URL`)
3. Replace with your actual Vercel URL:

```javascript
// Before:
const WEB_APP_URL = 'https://reclaim-connect.vercel.app';

// After:
const WEB_APP_URL = 'https://your-actual-site.vercel.app';
```

⚠️ **IMPORTANT**: 
- Remove any trailing slash (/)
- Use HTTPS (not HTTP)
- Make sure the URL works in a browser first

**Verify secrets match:**
- Line 9 in `mobile-app/App.js` should be: `const APP_SECRET = 'reclaim_app_2024_secure';`
- Line 35 in `src/main.jsx` should be: `const APP_SECRET = 'reclaim_app_2024_secure';`

These MUST be identical!

---

### STEP 2: Create App Assets

You need 4 image files. Choose one of these methods:

#### Method A: Quick Placeholder (For Testing)

```bash
cd mobile-app
node create-placeholder-assets.js
```

This creates SVG files. Convert them to PNG:
- Visit https://svgtopng.com
- Upload each SVG
- Download as PNG with these sizes:
  - icon.png → 1024×1024
  - adaptive-icon.png → 1024×1024
  - splash.png → 1284×2778
  - favicon.png → 48×48

#### Method B: Use Canva (Recommended)

1. Go to https://www.canva.com
2. Create custom size designs:
   - 1024×1024 for icon and adaptive-icon
   - 1284×2778 for splash
   - 48×48 for favicon
3. Use dark background: #0B1014
4. Add "Reclaim" text or simple logo
5. Download as PNG
6. Place in `mobile-app/assets/` folder

#### Method C: Hire a Designer

Quick & affordable:
- Fiverr: $5-20 for app icon package
- Search: "mobile app icon design"
- Provide brand colors and name

**Verify assets exist:**
```bash
ls mobile-app/assets/
# Should show: icon.png, adaptive-icon.png, splash.png, favicon.png
```

See `mobile-app/assets/README.md` for detailed instructions.

---

### STEP 3: Install Dependencies

```bash
cd mobile-app
npm install
```

This installs:
- Expo SDK
- React Native
- WebView component
- All other dependencies

**Expected output:**
```
added 850 packages in 45s
```

Takes 2-3 minutes depending on internet speed.

---

### STEP 4: Test Locally

```bash
npm start
```

This starts the Expo development server.

**You'll see:**
- QR code in terminal
- Instructions to press 'a' for Android or 'i' for iOS
- Metro bundler status

**Test on your phone:**

1. Install **Expo Go** app:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Open Expo Go and scan the QR code

3. App should open and show your web app content

**✅ Success looks like:**
- App opens in Expo Go
- Shows your actual web content (NOT the download screen)
- All features work
- Can navigate using back button

**❌ If you see download screen:**
- APP_SECRET doesn't match between files
- Fix and try again

**Press Ctrl+C in terminal when done testing**

---

### STEP 5: Setup Expo Account

If you don't have an Expo account:
1. Visit https://expo.dev/signup
2. Create free account
3. Verify email

**Install EAS CLI:**
```bash
npm install -g eas-cli
```

**Login:**
```bash
eas login
```

Enter your Expo credentials.

**Configure project:**
```bash
cd mobile-app
eas build:configure
```

This will:
- Link your project to Expo
- Generate a project ID
- Update `app.json` automatically

Answer the prompts:
- Project name: `reclaim-app` (or your preference)
- Bundle identifier: Use default or customize

---

### STEP 6: Build APK

**Start the build:**
```bash
eas build --platform android --profile production
```

**What happens:**
1. ✅ Your code uploads to Expo servers
2. ✅ Build environment initializes
3. ✅ Android APK compiles (takes 15-25 minutes ☕)
4. ✅ You get a download link

**While waiting:**
- Terminal shows progress updates
- Check build status: https://expo.dev → Projects → Your Project → Builds
- You'll get an email when complete

**When complete, you'll see:**
```
✔ Build finished.

🤖 Android app:
https://expo.dev/artifacts/eas/YOUR_BUILD_ID.apk

📱 Install and run:
https://expo.dev/accounts/YOUR_USERNAME/projects/reclaim-app/builds/BUILD_ID
```

**Copy and save these links!**

---

### STEP 7: Test the APK

**Download APK:**
1. Click the download link from Step 6
2. APK downloads to your computer (~30-50 MB)

**Transfer to Android device:**

**Option A - Email:**
- Email APK to yourself
- Open email on phone
- Download APK

**Option B - Google Drive:**
- Upload APK to Drive
- Open Drive on phone
- Download APK

**Option C - USB Cable:**
- Connect phone to computer
- Copy APK to phone storage
- Use file manager to find it

**Install APK:**

1. **Enable Unknown Sources** (if not already):
   - Settings → Security → Unknown Sources → Enable
   - Or: Settings → Apps → Install Unknown Apps → Enable for browser/Files

2. **Tap the APK file** to install

3. **Open the app**

**Test everything:**

✅ **App Testing Checklist:**
- [ ] App installs successfully
- [ ] Icon shows on home screen
- [ ] Splash screen displays
- [ ] App opens without crash
- [ ] Shows your web content (NOT download screen)
- [ ] All features work as expected
- [ ] Back button works correctly
- [ ] Handles no internet connection (try airplane mode)
- [ ] App feels smooth and responsive

✅ **Web Browser Testing:**
- [ ] Open your Vercel URL in Chrome (on phone or computer)
- [ ] Should show "Download App" screen
- [ ] QR code visible
- [ ] Download button works

**If all checks pass: 🎉 SUCCESS! Your app is ready!**

---

## 🎊 What's Next?

### Option 1: Share Directly (Easiest)

Perfect for friends, family, small groups:

1. Upload APK to:
   - Google Drive
   - Dropbox
   - Your website

2. Share link with users

3. They download and install

**Pros:** Instant, free, no approval needed  
**Cons:** Users must enable "Unknown Sources"

---

### Option 2: Publish to Play Store (Professional)

Reach millions of users through official channel:

**Requirements:**
- Google Play Developer account ($25 one-time fee)
- Privacy policy URL
- Store listing (screenshots, description)
- 1-7 days review time

**Quick steps:**
1. Create account at https://play.google.com/console
2. Pay $25 registration fee
3. Create app listing
4. Prepare assets (512×512 icon, screenshots, etc.)
5. Submit with: `eas submit --platform android`
6. Wait for Google review
7. App goes live!

See `mobile-app/README.md` for complete Play Store guide.

---

### Option 3: Beta Test First (Recommended)

Test with real users before public release:

1. Build preview version:
   ```bash
   eas build --platform android --profile preview
   ```

2. Share with 5-10 beta testers

3. Gather feedback:
   - What works well?
   - What's confusing?
   - Any bugs or crashes?

4. Fix issues

5. Build production & publish

---

## 📱 Updating Your App

### Web App Updates (Instant)
When you update your web app on Vercel:
- ✅ Changes appear immediately in mobile app
- ✅ No rebuild needed
- ✅ No user action required
- ✅ Just refresh the web content

### App Wrapper Updates (Requires rebuild)
If you change `App.js` or mobile app code:

1. Update version in `app.json`:
   ```json
   {
     "version": "1.0.1",
     "android": {
       "versionCode": 2
     }
   }
   ```

2. Build new APK:
   ```bash
   eas build --platform android --profile production
   ```

3. Distribute new APK to users

---

## 🆘 Common Issues & Solutions

### ❌ "App shows download screen instead of content"

**Cause:** Token authentication not working

**Fix:**
1. Check `APP_SECRET` matches in both files:
   - `mobile-app/App.js` line 9
   - `src/main.jsx` line 35
2. Ensure URL has no trailing slash
3. Clear app data: Settings → Apps → Reclaim → Clear Data
4. Reinstall app

---

### ❌ "Build failed"

**Cause:** Missing files or configuration errors

**Fix:**
```bash
# Check all assets exist
ls mobile-app/assets/
# Should show: icon.png, adaptive-icon.png, splash.png, favicon.png

# Validate app.json
cd mobile-app
cat app.json | jq .

# Run diagnostics
expo doctor
```

---

### ❌ "WebView won't load"

**Cause:** Network or URL issues

**Fix:**
1. Check internet connection
2. Verify Vercel site is live (open in browser)
3. Ensure URL in App.js is correct
4. Use HTTPS (not HTTP)
5. Remove trailing slash from URL

---

### ❌ "Can't install APK on phone"

**Cause:** Security settings block installation

**Fix:**
1. Enable "Unknown Sources":
   - Settings → Security → Unknown Sources
   - Or: Settings → Apps → Special Access → Install Unknown Apps

2. If still blocked:
   - Try installing from Files app instead of browser
   - Check if device is managed by organization
   - Try different Android device

---

### ❌ "Build taking too long"

**Normal:** Builds take 15-25 minutes

**Too long:** If >30 minutes:
1. Check https://expo.dev → Builds for status
2. If stuck, cancel and retry:
   ```bash
   # Cancel build
   eas build:list
   # Find the stuck build ID and cancel on website
   
   # Start new build
   eas build --platform android --profile production
   ```

---

## 📚 Documentation Files

Your `mobile-app/` folder contains complete documentation:

| File | Purpose | When to Read |
|------|---------|-------------|
| **START_HERE.md** (this file) | Quick start guide | Read first! |
| **GETTING_STARTED.md** | Comprehensive setup | Need more detail |
| **BUILD_APK.md** | Detailed build instructions | Troubleshooting builds |
| **README.md** | Complete documentation | Publishing to Play Store |
| **SETUP_GUIDE.md** | Step-by-step walkthrough | Alternative guide |
| **QUICK_START.txt** | Terminal-friendly reference | Quick commands |
| **assets/README.md** | Asset creation guide | Creating images |

---

## 💰 Cost Summary

| Item | Cost |
|------|------|
| Development | FREE |
| Expo Builds (limited) | FREE |
| Expo Builds (unlimited) | $29/month (optional) |
| Google Play Developer | $25 one-time (optional) |
| **Minimum Total** | **$0** |

You can create and test APK completely free!

---

## ✅ Final Checklist

Before sharing your app with others:

### Technical
- [ ] APK installs on Android device
- [ ] App loads and displays web content
- [ ] Token authentication works (no download screen in app)
- [ ] Web browser shows download screen correctly
- [ ] Back button navigation works
- [ ] Error handling works (test airplane mode)
- [ ] No crashes or freezes

### User Experience
- [ ] Icon looks good on home screen
- [ ] Splash screen displays correctly
- [ ] App name is correct
- [ ] All features work as expected
- [ ] Loading is reasonably fast
- [ ] UI is clear and usable

### Testing
- [ ] Tested on multiple Android devices
- [ ] Tested with different internet speeds
- [ ] Tested all key features thoroughly
- [ ] Got feedback from beta testers

### Documentation
- [ ] README updated with current info
- [ ] Privacy policy created (if publishing)
- [ ] Support contact info ready
- [ ] App store listing prepared (if publishing)

---

## 🎉 Congratulations!

You're all set! Just follow the 7 steps above and you'll have your APK ready.

**Remember:**
1. Update WEB_APP_URL in App.js
2. Create 4 PNG assets
3. Install dependencies
4. Test locally
5. Setup Expo
6. Build APK
7. Test on device

**Need help?** Check the other documentation files or visit:
- Expo Forums: https://forums.expo.dev
- React Native Docs: https://reactnative.dev
- EAS Build Docs: https://docs.expo.dev/build/introduction/

**Good luck with your app! 🚀**

---

*Last updated: Setup complete and ready to build!*
