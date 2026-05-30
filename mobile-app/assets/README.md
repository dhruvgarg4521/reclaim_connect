
# Assets Folder

This folder contains the required image assets for the React Native app.

## Required Files

You need to create the following image files in this folder:

### 1. **icon.png** (1024x1024 pixels)
- Main app icon
- Square format
- PNG format
- This will be your app's icon on the device

### 2. **adaptive-icon.png** (1024x1024 pixels)
- Android adaptive icon
- Square format
- PNG format
- Used for Android devices

### 3. **splash.png** (1284x2778 pixels)
- Splash screen image
- Vertical/portrait format
- PNG format
- Shown when app is launching

### 4. **favicon.png** (48x48 pixels)
- Small icon for web version
- Square format
- PNG format

## How to Create These Images

### Option 1: Use Canva (Recommended for beginners)
1. Go to https://www.canva.com
2. Create a custom size project
3. Design your icon with:
   - App name "Reclaim"
   - Dark background (#0B1014)
   - Simple, meaningful imagery
4. Download as PNG in the required sizes

### Option 2: Use Online Tools
1. **Icon Generator**: https://www.appicon.co
2. **Splash Screen Generator**: https://www.pgyer.com/tools/splash
3. Upload a base design and generate all sizes

### Option 3: Use Design Software
- Adobe Photoshop
- Figma
- Sketch
- GIMP (free)

## Quick Placeholder Creation

For testing purposes, you can create simple colored squares:

```bash
# If you have ImageMagick installed:
convert -size 1024x1024 xc:#0B1014 -pointsize 100 -fill white \
  -gravity center -annotate +0+0 "Reclaim" icon.png

convert -size 1024x1024 xc:#0B1014 -pointsize 100 -fill white \
  -gravity center -annotate +0+0 "Reclaim" adaptive-icon.png

convert -size 1284x2778 xc:#0B1014 -pointsize 150 -fill white \
  -gravity center -annotate +0+0 "Reclaim" splash.png

convert -size 48x48 xc:#0B1014 favicon.png
```

## Design Guidelines

### Color Scheme
- Primary: #0B1014 (Dark background)
- Accent: #4CAF50 (Green for growth/recovery)
- Text: White/Light gray

### Icon Design Tips
1. Keep it simple and recognizable
2. Use high contrast
3. Test at small sizes (it should be clear at 48x48)
4. Avoid too much text
5. Consider using symbolic imagery:
   - Lotus flower (purity, rebirth)
   - Flame (transformation)
   - Sunrise (new beginning)
   - Shield (protection)

### Splash Screen Tips
1. Center your logo/text
2. Use dark background to match app
3. Avoid too much detail
4. Keep loading time in mind

## Verification

After creating the files, verify:
- [ ] All 4 files exist in this folder
- [ ] File names match exactly (case-sensitive)
- [ ] Files are PNG format
- [ ] Sizes match requirements
- [ ] Images look good on dark background

## Next Steps

Once you have all the assets:
1. Place them in this folder
2. Test the app: `npm start` in mobile-app folder
3. Build APK: `eas build --platform android`

## Need Help?

If you're stuck:
1. Use Canva's free templates for app icons
2. Search "app icon generator" for online tools
3. Hire a designer on Fiverr ($5-20) for professional icons
4. Ask in the project's support channels
