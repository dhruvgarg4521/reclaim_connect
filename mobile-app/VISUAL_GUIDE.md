
# 📱 Visual Setup Guide - Reclaim Mobile App

A picture-based guide for those who prefer visual instructions.

---

## 🎯 The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Web App (Vercel)  ←→  Mobile App (React Native Wrapper)   │
│                                                             │
│  ┌──────────────┐       ┌──────────────────────────────┐  │
│  │  Your Web    │       │  WebView loads web app       │  │
│  │  App Code    │  →→   │  + Passes token             │  │
│  │  (src/)      │       │  + Native shell             │  │
│  └──────────────┘       └──────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagram

### Mobile App User Experience:
```
User opens app
     ↓
App starts
     ↓
WebView loads with token:
https://your-site.vercel.app?app_token=SECRET
     ↓
Web app checks token
     ↓
Token matches ✅
     ↓
Show full app interface
     ↓
User uses app normally
```

### Web Browser User Experience:
```
User visits URL in browser
     ↓
https://your-site.vercel.app
     ↓
Web app checks for token
     ↓
No token found ❌
     ↓
Show download screen:
┌──────────────────────┐
│  Download Our App    │
│  [QR Code]          │
│  [Download Button]   │
└──────────────────────┘
```

---

## 📂 File Structure Visualization

```
Your-Project/
│
├── 📁 src/                          ← Your web app
│   ├── main.jsx                     ← Contains APP_SECRET
│   ├── config.js
│   └── styles.css
│
├── 📁 mobile-app/                   ← NEW! Mobile wrapper
│   │
│   ├── 📱 App.js                    ← Main mobile code
│   │   └── Contains:
│   │       • APP_SECRET (must match src/main.jsx)
│   │       • WEB_APP_URL (your Vercel URL)
│   │       • WebView configuration
│   │
│   ├── ⚙️ app.json                  ← App settings
│   │   └── Contains:
│   │       • App name: "Reclaim"
│   │       • Package: com.reclaim.app
│   │       • Icon/splash paths
│   │
│   ├── 🔧 eas.json                  ← Build config
│   │   └── Contains:
│   │       • Development profile
│   │       • Preview profile
│   │       • Production profile
│   │
│   ├── 📦 package.json              ← Dependencies
│   │
│   ├── 📁 assets/                   ← App images
│   │   ├── icon.png                 (1024×1024) ⚠️ CREATE THIS
│   │   ├── adaptive-icon.png        (1024×1024) ⚠️ CREATE THIS
│   │   ├── splash.png               (1284×2778) ⚠️ CREATE THIS
│   │   └── favicon.png              (48×48)     ⚠️ CREATE THIS
│   │
│   └── 📚 Documentation/
│       ├── START_HERE.md            ← Read first!
│       ├── GETTING_STARTED.md
│       ├── BUILD_APK.md
│       ├── SETUP_GUIDE.md
│       ├── README.md
│       ├── QUICK_START.txt
│       ├── INDEX.md
│       └── VISUAL_GUIDE.md          ← You are here
│
└── 📄 MOBILE_APP_SUMMARY.md         ← Overview at root
```

---

## ⚙️ Configuration Flow

```
Step 1: Update App.js
┌─────────────────────────────────────┐
│ File: mobile-app/App.js (line 12)  │
│                                     │
│ const WEB_APP_URL =                 │
│   'https://YOUR-SITE.vercel.app';  │ ← Change this!
│                                     │
└─────────────────────────────────────┘

Step 2: Verify secrets match
┌─────────────────────────────────────┐
│ mobile-app/App.js (line 9)         │
│ const APP_SECRET =                  │
│   'reclaim_app_2024_secure';       │
└─────────────────────────────────────┘
         ↕ MUST MATCH ↕
┌─────────────────────────────────────┐
│ src/main.jsx (line 35)             │
│ const APP_SECRET =                  │
│   'reclaim_app_2024_secure';       │
└─────────────────────────────────────┘
```

---

## 🎨 Asset Requirements Visual

### Icon (1024×1024)
```
┌─────────────────┐
│                 │
│                 │
│    [RECLAIM]    │  ← Your app name or logo
│                 │     Keep it simple!
│                 │
└─────────────────┘
1024px × 1024px
Background: #0B1014 (dark)
```

### Splash Screen (1284×2778)
```
┌───────────┐
│           │
│           │
│           │
│           │
│  [LOGO]   │  ← Centered branding
│           │
│  Loading  │  ← Optional text
│           │
│           │
│           │
│           │
└───────────┘
Portrait mode
1284px × 2778px
```

### Adaptive Icon (1024×1024)
```
┌─────────────────┐
│  ╔═══════════╗  │  ← Android will
│  ║           ║  │     crop this to
│  ║  [LOGO]   ║  │     circle/square
│  ║           ║  │     depending on
│  ╚═══════════╝  │     device theme
└─────────────────┘
Safe area in center
1024px × 1024px
```

---

## 🔨 Build Process Visualization

```
Your Code
    ↓
npm install
    ↓
Local Testing (npm start)
    ↓
Expo Go App ← Scan QR code
    ↓
Works? → Yes → Continue
    ↓
eas build:configure
    ↓
Links to Expo Account
    ↓
eas build --platform android
    ↓
┌──────────────────────────────┐
│  Expo Cloud Build Service    │
│                              │
│  1. Upload code ✓            │
│  2. Create Android env ✓     │
│  3. Install dependencies ✓   │
│  4. Compile native code ✓    │
│  5. Generate APK ✓           │
│                              │
│  ⏱️ Takes 15-25 minutes      │
└──────────────────────────────┘
    ↓
Download APK
    ↓
Install on device
    ↓
Test thoroughly
    ↓
Distribute to users! 🎉
```

---

## 🎯 Success Checklist Visual

```
┌────────────────────────────────────────────┐
│  BEFORE BUILDING                           │
│                                            │
│  ☐ Node.js installed                      │
│  ☐ Expo account created                   │
│  ☐ WEB_APP_URL updated                    │
│  ☐ APP_SECRET verified to match          │
│  ☐ All 4 assets created                   │
│  ☐ Dependencies installed                 │
│  ☐ Tested in Expo Go                      │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  AFTER BUILDING                            │
│                                            │
│  ☐ APK downloaded                         │
│  ☐ Installed on device                    │
│  ☐ App opens correctly                    │
│  ☐ Shows web content (not download)       │
│  ☐ All features work                      │
│  ☐ Back button works                      │
│  ☐ Error handling works                   │
│  ☐ Ready to distribute                    │
└────────────────────────────────────────────┘
```

---

## 📱 Screen Flow

### What Users See:

```
1. App Launch
┌─────────────────┐
│                 │
│   [SPLASH]      │  ← Your splash screen
│   Reclaim       │     (1-2 seconds)
│                 │
└─────────────────┘

2. Loading
┌─────────────────┐
│  ⏳ Loading...  │  ← WebView loads
│                 │     your web app
└─────────────────┘

3. Your App
┌─────────────────┐
│  [Your Web App] │  ← Full functionality
│                 │     No download screen
│  [Content]      │     Everything works
│                 │
└─────────────────┘
```

---

## 🌐 Authentication Visual

```
Mobile App Request:
┌──────────────────────────────────────────┐
│ URL with token:                          │
│ https://site.com?app_token=SECRET123     │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Web App Checks:                          │
│ Is app_token === APP_SECRET?            │
└──────────────────────────────────────────┘
            ↓
      ✅ YES → Show App
      ❌ NO  → Show Download Screen

Browser Request:
┌──────────────────────────────────────────┐
│ URL without token:                       │
│ https://site.com                         │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│ Web App Checks:                          │
│ Is app_token present?                    │
└──────────────────────────────────────────┘
            ↓
      ❌ NO → Show Download Screen
```

---

## 🛠️ Terminal Commands Visual

```
┌─────────────────────────────────────────────┐
│  📁 Navigate to mobile app folder           │
│  $ cd mobile-app                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📦 Install dependencies                    │
│  $ npm install                              │
│  → Creates node_modules/                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🧪 Test locally                            │
│  $ npm start                                │
│  → Shows QR code                            │
│  → Scan with Expo Go                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🔐 Login to Expo                           │
│  $ eas login                                │
│  → Enter credentials                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ⚙️ Configure project                       │
│  $ eas build:configure                      │
│  → Links to Expo account                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🏗️ Build APK                               │
│  $ eas build --platform android             │
│  → Uploads code                             │
│  → Builds APK (20 min)                      │
│  → Returns download link                    │
└─────────────────────────────────────────────┘
```

---

## 🎓 Quick Decision Tree

```
START: Want to build mobile app?
    │
    ├─→ YES → Continue below
    └─→ NO  → Not ready yet

Need to update web app URL?
    │
    ├─→ YES → Edit App.js line 12
    └─→ DONE → Already correct

Have app assets (icons)?
    │
    ├─→ YES → Continue
    └─→ NO  → Create 4 PNG files
              (Use Canva or script)

Installed dependencies?
    │
    ├─→ YES → Continue
    └─→ NO  → Run: npm install

Tested locally?
    │
    ├─→ YES → Continue
    └─→ NO  → Run: npm start
              Test in Expo Go

Have Expo account?
    │
    ├─→ YES → Continue
    └─→ NO  → Create at expo.dev

Ready to build APK?
    │
    ├─→ YES → Run: eas build
    └─→ NO  → Review docs first

BUILD COMPLETE → Test APK → Distribute! 🎉
```

---

## 💡 Pro Tips Visual

```
TIP #1: Test First, Build Later
┌──────────────────────────────────┐
│  Always test in Expo Go before  │
│  building APK. It's much faster │
│  to iterate and fix issues!     │
└──────────────────────────────────┘

TIP #2: Assets Can Wait
┌──────────────────────────────────┐
│  Use placeholder assets first.  │
│  Get APK working, then make     │
│  professional icons later.      │
└──────────────────────────────────┘

TIP #3: Web Updates = Instant
┌──────────────────────────────────┐
│  Changes to web app appear in   │
│  mobile app immediately.        │
│  No rebuild needed!             │
└──────────────────────────────────┘

TIP #4: Save Build URLs
┌──────────────────────────────────┐
│  Keep links to all your builds. │
│  Useful for sharing different   │
│  versions with testers.         │
└──────────────────────────────────┘
```

---

## 🎯 Your Path Forward

```
YOU ARE HERE: Setup Complete ✅
    │
    ▼
Read START_HERE.md
    │
    ▼
Follow 7 steps
    │
    ├─→ 1. Update URL
    ├─→ 2. Create assets
    ├─→ 3. Install deps
    ├─→ 4. Test locally
    ├─→ 5. Setup Expo
    ├─→ 6. Build APK
    └─→ 7. Test on device
    │
    ▼
SUCCESS! Have APK 🎉
    │
    ├─→ Share directly (free)
    │   └─→ Upload to Drive/Dropbox
    │
    └─→ Publish to Play Store ($25)
        └─→ Follow README.md guide
```

---

## 📞 Need Help?

```
┌────────────────────────────────────────┐
│  STEP 1: Check Documentation          │
│  → mobile-app/START_HERE.md           │
│  → mobile-app/INDEX.md                │
└────────────────────────────────────────┘
            ↓
┌────────────────────────────────────────┐
│  STEP 2: Troubleshooting Sections     │
│  → Each doc has "Common Issues"       │
│  → BUILD_APK.md has detailed fixes    │
└────────────────────────────────────────┘
            ↓
┌────────────────────────────────────────┐
│  STEP 3: Run Diagnostics              │
│  → expo doctor                         │
│  → Check build logs                    │
└────────────────────────────────────────┘
            ↓
┌────────────────────────────────────────┐
│  STEP 4: Community Help               │
│  → Expo Forums: forums.expo.dev       │
│  → Stack Overflow                      │
└────────────────────────────────────────┘
```

---

**Ready to start?** → Open [`START_HERE.md`](./START_HERE.md)

---

*Visual guide created for easier understanding*  
*For detailed text instructions, see other documentation files*
