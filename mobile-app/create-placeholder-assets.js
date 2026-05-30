
/**
 * Quick Placeholder Asset Generator
 * 
 * This script creates simple placeholder images for testing your app.
 * Replace these with professional designs before publishing to Play Store.
 * 
 * Usage: node create-placeholder-assets.js
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Creating placeholder assets for testing...\n');

const assetsDir = path.join(__dirname, 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
  console.log('✅ Created assets directory');
}

// Create SVG files that can be used as placeholders
const createSVGIcon = (size, filename) => {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0B1014"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/10}" 
        fill="#4CAF50" text-anchor="middle" dominant-baseline="middle">
    Reclaim
  </text>
</svg>`;
  
  fs.writeFileSync(path.join(assetsDir, filename), svg);
  console.log(`✅ Created ${filename} (${size}x${size})`);
};

const createSVGSplash = () => {
  const svg = `<svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
  <rect width="1284" height="2778" fill="#0B1014"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="120" 
        fill="#4CAF50" text-anchor="middle" dominant-baseline="middle">
    Reclaim
  </text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="60" 
        fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" opacity="0.7">
    Path to Freedom
  </text>
</svg>`;
  
  fs.writeFileSync(path.join(assetsDir, 'splash.svg'), svg);
  console.log('✅ Created splash.svg (1284x2778)');
};

// Note about PNG conversion
console.log('\n📝 Note: Created SVG files as placeholders.');
console.log('\nTo convert to PNG (required for app):');
console.log('\nOption 1 - Online converter:');
console.log('  1. Visit https://svgtopng.com');
console.log('  2. Upload each SVG file');
console.log('  3. Download as PNG with correct dimensions');
console.log('\nOption 2 - ImageMagick (if installed):');
console.log('  convert assets/icon.svg -resize 1024x1024 assets/icon.png');
console.log('  convert assets/adaptive-icon.svg -resize 1024x1024 assets/adaptive-icon.png');
console.log('  convert assets/splash.svg -resize 1284x2778 assets/splash.png');
console.log('  convert assets/favicon.svg -resize 48x48 assets/favicon.png');
console.log('\nOption 3 - Use Canva or Figma to create proper designs');
console.log('\n⚠️  Remember: Replace these placeholders with professional designs before publishing!\n');

// Create the SVG files
try {
  createSVGIcon(1024, 'icon.svg');
  createSVGIcon(1024, 'adaptive-icon.svg');
  createSVGIcon(48, 'favicon.svg');
  createSVGSplash();
  
  console.log('\n✨ Success! Placeholder SVG files created in mobile-app/assets/');
  console.log('\n🔄 Next steps:');
  console.log('  1. Convert SVG files to PNG (see instructions above)');
  console.log('  2. Test your app: npm start');
  console.log('  3. Build APK: eas build --platform android\n');
} catch (error) {
  console.error('❌ Error creating assets:', error);
  process.exit(1);
}
