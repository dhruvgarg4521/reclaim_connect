/**
 * Placeholder PNG asset generator for EAS / Expo builds.
 *
 * Creates: icon.png, adaptive-icon.png, splash.png, favicon.png
 *
 * Usage: npm run create-assets
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BG = '#0B1014';
const ACCENT = '#4CAF50';
const TEXT = '#FFFFFF';

const assetsDir = path.join(__dirname, 'assets');

function squareIconSvg(size, title, subtitle = '') {
  const titleSize = Math.round(size * 0.1);
  const subSize = Math.round(size * 0.045);
  const subY = subtitle ? '54%' : '50%';
  const subBlock = subtitle
    ? `<text x="50%" y="${subY}" font-family="Arial, Helvetica, sans-serif" font-size="${subSize}"
        fill="${TEXT}" text-anchor="middle" dominant-baseline="middle" opacity="0.75">${subtitle}</text>`
    : '';

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <text x="50%" y="50%" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}"
        fill="${ACCENT}" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${title}</text>
  ${subBlock}
</svg>`;
}

function splashSvg(width, height) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${BG}"/>
  <text x="50%" y="48%" font-family="Arial, Helvetica, sans-serif" font-size="120"
        fill="${ACCENT}" text-anchor="middle" dominant-baseline="middle" font-weight="bold">Reclaim</text>
  <text x="50%" y="54%" font-family="Arial, Helvetica, sans-serif" font-size="56"
        fill="${TEXT}" text-anchor="middle" dominant-baseline="middle" opacity="0.75">Path to Freedom</text>
</svg>`;
}

async function writePngFromSvg(svg, width, height, filename) {
  const outPath = path.join(assetsDir, filename);
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toFile(outPath);

  const { size } = fs.statSync(outPath);
  console.log(`✅ ${filename} (${width}x${height}, ${(size / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('🎨 Creating placeholder PNG assets...\n');

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log('✅ Created assets directory\n');
  }

  await writePngFromSvg(squareIconSvg(1024, 'Reclaim'), 1024, 1024, 'icon.png');
  await writePngFromSvg(squareIconSvg(1024, 'Reclaim'), 1024, 1024, 'adaptive-icon.png');
  await writePngFromSvg(splashSvg(1284, 2778), 1284, 2778, 'splash.png');
  await writePngFromSvg(squareIconSvg(48, 'R'), 48, 48, 'favicon.png');

  console.log('\n✨ Done! PNG files are in mobile-app/assets/');
  console.log('⚠️  Replace with final designs before Play Store release.\n');
}

main().catch((error) => {
  console.error('❌ Error creating assets:', error.message);
  process.exit(1);
});
