
# 🚀 Getting Started - Reclaim Mobile App

Your complete guide to going from code to APK in under 1 hour!

## 📱 What You're Building

A React Native wrapper that:
- ✅ Loads your Vercel web app inside a native mobile shell
- ✅ Passes authentication token automatically (app-only access)
- ✅ Shows download screen to web browser users
- ✅ Works offline with proper error handling
- ✅ Provides native Android experience

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Update configuration | 5 min |
| Create assets | 15 min |
| Install & test locally | 10 min |
| Setup Expo account | 5 min |
| Build APK | 20-30 min |
| Test on device | 10 min |
| **Total** | **~1 hour** |

---

## 🎯 Quick Start Path

### 1️⃣ Update Configuration (5 minutes)

**File: `mobile-app/App.js`**

Find line 12 and update with your actual Vercel URL:

```javascript
const WEB_APP_URL = 'https://your-actual-site.vercel.app';
```

⚠️ **Important**:
- Remove trailing slash: ❌ `.../` → ✅ `...app`
- Use HTTPS (not HTTP)
- Verify URL works in browser first

**Verify the secret matches**:
- Line 9 in `mobile-app/App.js`: `const APP_SECRET = 'reclaim_app_2024_secure';`
- Line 35 in `src/main.jsx`: `const APP_SECRET = 'reclaim_app_2024_secure';`

These **MUST** match exactly!

### 2️⃣ Create Assets (15 minutes)

You need 4 PNG images in `mobile-app/assets/`:

#### Quick Option - Generate Placeholders:

```bash
cd mobile-app
node create-placeholder-assets.js
```

This creates SVG placeholders. Convert to PNG using:
- Online: https://svgtopng.com
- Or use ImageMagick (if installed)

#### Better Option - Use Canva:

1. Visit https://www.canva.com
2. Create custom sizes:
   - **icon.png**: 1024×1024
   - **adaptive-icon.png**: 1024×1024  
   - **splash.png**: 1284×2778
   - **favicon.png**: 48×48

3. Design tips:
   - Use dark background (#0B1014)
   - Keep text minimal
   - Use simple, clear imagery
   - Test at small size

4. Download as PNG and place in `mobile-app/assets/`

**Verify assets:**
```bash
ls mobile-app/assets/
# Should show: icon.png, adaptive-icon.png, splash.png, favicon.png
```

### 3️⃣ Install Dependencies (3 minutes)

```bash
cd mobile-app
npm install
```

Expected output:
```
added 850 packages in 45s
```

### 4️⃣ Test Locally (10 minutes)

Start the development server:
```bash
npm start
```

You'll see:
- QR code in terminal
- Metro bundler running
- Options to open on Android/iOS

**Test on your phone:**
1. Install "Expo Go" from Play Store
2. Scan QR code with Expo Go
3. App should open and load your web app
4. ✅ Verify: Shows actual app content (not download screen)

**Common issues at this stage:**

❌ Shows download screen in app
→ Check APP_SECRET matches in both files

❌ WebView shows error
→ Check WEB_APP_URL is correct and site is live

❌ Can't connect to dev server
→ Ensure phone and computer on same WiFi

### 5️⃣ Setup Expo (5 minutes)

Install EAS CLI:
```bash
npm install -g eas-cli
```

Login to Expo:
```bash
eas login
```

Don't have an account? Create one at https://expo.dev/signup (it's free!)

Configure project:
```bash
cd mobile-app
eas build:configure
```

This will:
- Create/link Expo project
- Generate project ID
- Update `app.json`

### 6️⃣ Build APK (20-30 minutes)

```bash
eas build --platform android --profile production
```

What happens:
1. Code uploads to Expo servers
2. Android build environment starts
3. APK compiles (this takes time ☕)
4. You get download link

**Monitor progress:**
- Check terminal for status updates
- Or visit: https://expo.dev (login and view builds)
- You'll get email when complete

**Expected output:**
```
✔ Build finished.

🤖 Android app:
https://expo.dev/artifacts/eas/ABC123XYZ.apk

📱 Install on device:
https://expo.dev/accounts/USERNAME/projects/reclaim-app/builds/BUILD_ID
```

### 7️⃣ Test APK (10 minutes)

1. **Download APK**: Click the link from build output
2. **Transfer to phone**: 
   - Email to yourself
   - Upload to Google Drive
   - Use USB cable
3. **Install**:
   - Enable "Unknown Sources" in Android settings
   - Tap APK file to install
4. **Test thoroughly**:

**Testing checklist:**
- [ ] App installs without errors
- [ ] Opens successfully
- [ ] Shows your web app (not download screen)
- [ ] All features work
- [ ] Back button navigates correctly
- [ ] Handles no internet gracefully
- [ ] Icon looks good on home screen
- [ ] Splash screen displays

5. **Test web browser**: Open your Vercel URL in Chrome
   - [ ] Should show "Download App" screen
   - [ ] QR code visible
   - [ ] Download button works

✅ If all checks pass, you're done!

---

## 🎓 What Just Happened?

You created a **hybrid app** that:
1. Uses React Native to create native shell
2. Loads your web app in a WebView
3. Automatically passes authentication token
4. Blocks direct web access (shows download screen)
5. Packages everything as an APK

**Key benefits:**
- ✅ No code duplication (one web app = both platforms)
- ✅ Updates automatically (web app changes reflect immediately)
- ✅ Native app experience (home screen icon, full screen)
- ✅ App store ready (can publish to Google Play)

---

## 📤 Next Steps

### Option A: Share APK Directly
Perfect for friends, family, or small groups.

1. Upload APK to Google Drive/Dropbox
2. Share link with users
3. They download and install
4. Done! ✅

**Pros**: Instant, no approval process, free
**Cons**: Users must allow "Unknown Sources"

### Option B: Publish to Google Play Store
Professional distribution to millions of users.

**Requirements:**
- Google Play Developer account ($25 one-time)
- Privacy policy
- Store listing (screenshots, description)
- 1-7 days review time

**Steps:**
1. Create developer account
2. Prepare store assets (see `README.md`)
3. Build AAB instead of APK:
   ```bash
   # Edit eas.json: change "apk" to "app-bundle"
   eas build --platform android
   ```
4. Submit to Play Store:
   ```bash
   eas submit --platform android
   ```

Full instructions in `README.md` → "Publishing to Google Play Store"

### Option C: Beta Testing (Recommended)
Test with real users before public release.

1. Build preview APK:
   ```bash
   eas build --platform android --profile preview
   ```
2. Share with beta testers
3. Gather feedback
4. Fix issues
5. Build production APK
6. Publish to Play Store

---

## 🆘 Troubleshooting

### Build Fails

**Error: "Assets not found"**
```bash
# Check assets exist
ls mobile-app/assets/
# Should show: icon.png, adaptive-icon.png, splash.png, favicon.png
```

**Error: "Invalid JSON in app.json"**
```bash
# Validate JSON syntax
cd mobile-app
cat app.json | jq .
```

**Error: "Build timed out"**
- Usually takes 15-25 minutes
- Check https://expo.dev for status
- If >30 min, cancel and retry

### App Shows Download Screen

This means authentication isn't working.

**Fix:**
1. Check APP_SECRET matches in both files:
   - `mobile-app/App.js` line 9
   - `src/main.jsx` line 35
2. Ensure URL is correct (no trailing slash!)
3. Clear app data and reinstall
4. Check localStorage in web app console

### WebView Won't Load

**Checklist:**
- [ ] Internet connection working?
- [ ] Vercel site is live? (check in browser)
- [ ] URL correct in App.js?
- [ ] HTTPS (not HTTP)?

**Debug:**
Add console logging to App.js:
```javascript
onNavigationStateChange={(navState) => {
  console.log('Current URL:', navState.url);
}}
```

### Can't Install APK

**On Android 8.0+:**
1. Settings → Security
2. Unknown Sources → Enable
3. Or: Settings → Apps → Special Access → Install unknown apps

**If blocked by organization:**
- Device may be managed (work phone)
- Contact IT department
- Or use personal device

---

## 💡 Pro Tips

### Tip 1: Update Only Web App
Changes to your web app (HTML/CSS/JS) appear immediately in the mobile app. No rebuild needed!

### Tip 2: Test in Expo Go First
Always test in Expo Go before building APK. Faster iteration cycle.

### Tip 3: Use Preview Builds
Build with `--profile preview` for testing. It's faster and creates APK directly.

### Tip 4: Version Control
Update version numbers in `app.json` for each release:
```json
{
  "version": "1.0.1",
  "android": { "versionCode": 2 }
}
```

### Tip 5: Monitor Builds
Save build URLs for reference:
- Development build: [link]
- Preview build: [link]  
- Production build: [link]

---

## 📚 Additional Resources

**In this folder:**
- `BUILD_APK.md` - Detailed build instructions
- `README.md` - Complete documentation
- `SETUP_GUIDE.md` - Step-by-step setup
- `QUICK_START.txt` - Quick reference

**External resources:**
- [Expo Documentation](https://docs.expo.dev)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)

---

## ✅ Success Checklist

Before sharing your app:

**Technical:**
- [ ] APK installs on Android device
- [ ] App loads web content correctly
- [ ] Token authentication working
- [ ] Web browser shows download screen
- [ ] Back button works
- [ ] Error handling works
- [ ] No crashes or freezes

**Polish:**
- [ ] Icon looks professional
- [ ] Splash screen displays correctly
- [ ] App name correct
- [ ] No typos in app content

**Testing:**
- [ ] Tested on multiple devices
- [ ] Tested with/without internet
- [ ] Tested all key features
- [ ] Got feedback from beta testers

**Ready for Play Store:**
- [ ] Privacy policy created
- [ ] Screenshots taken
- [ ] Store description written
- [ ] Developer account ready
- [ ] All legal requirements met

---

## 🎉 Congratulations!

You've successfully created a mobile app from your web app!

**What you accomplished:**
1. ✅ Set up React Native wrapper
2. ✅ Configured app-only authentication
3. ✅ Built production APK
4. ✅ Tested on real device
5. ✅ Ready for distribution

**Share your success:**
- Tweet about it
- Share APK with friends
- Get feedback from users
- Consider Play Store launch

**Questions or issues?**
- Check other markdown files in this folder
- Visit Expo forums: https://forums.expo.dev
- Open issue on project GitHub

---

**Built with ❤️ using Expo and React Native**
