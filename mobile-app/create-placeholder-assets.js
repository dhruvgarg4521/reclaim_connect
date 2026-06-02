/**
 * App icon / asset generator for EAS / Expo builds.
 *
 * Source: assets/logo-source.png (logo on black background).
 * The black background is trimmed and the rounded-square corners are made
 * transparent, so launcher icons show the white logo with NO black box.
 *
 * Creates: icon.png, adaptive-icon.png, splash.png, favicon.png
 *
 * Usage: npm run create-assets
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');
const SOURCE = path.join(assetsDir, 'logo-source.png');
const FALLBACK_SOURCE = path.join(__dirname, '..', 'public', 'reclaim-logo.png');

const ICON_BG = { r: 255, g: 255, b: 255, alpha: 1 };
const SPLASH_BG = { r: 11, g: 16, b: 20, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

function roundedMaskSvg(size, radius) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>` +
      `</svg>`,
  );
}

function resolveSource() {
  if (fs.existsSync(SOURCE)) return SOURCE;
  if (fs.existsSync(FALLBACK_SOURCE)) return FALLBACK_SOURCE;
  return null;
}

/**
 * Trim the black border off the source logo and round the corners to
 * transparent so no black squircle edges remain. Returns a square PNG buffer.
 */
async function getCleanLogo(size) {
  const src = resolveSource();
  if (!src) throw new Error('No logo source found (assets/logo-source.png).');

  // Work at higher resolution, then trim the solid black border.
  const work = Math.max(size, 1024);
  const trimmed = await sharp(src)
    .trim({ background: '#000000', threshold: 45 })
    .resize(work, work, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer();

  // The trimmed box still includes the soft dark drop-shadow halo around the
  // white squircle. Crop inward past the halo so only the white logo remains.
  const inset = Math.round(work * 0.085);
  const cropped = await sharp(trimmed)
    .extract({ left: inset, top: inset, width: work - inset * 2, height: work - inset * 2 })
    .resize(size, size, { fit: 'fill' })
    .png()
    .toBuffer();

  // Round corners to match the squircle so any residual edge is cut to transparent.
  const radius = Math.round(size * 0.2);
  return sharp(cropped)
    .composite([{ input: roundedMaskSvg(size, radius), blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function composeOnCanvas(logoBuffer, canvasW, canvasH, background, filename) {
  const outPath = path.join(assetsDir, filename);
  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logoBuffer, gravity: 'center' }])
    .png()
    .toFile(outPath);

  const { size } = fs.statSync(outPath);
  console.log(`✅ ${filename} (${canvasW}x${canvasH}, ${(size / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('🎨 Generating app icons from logo-source.png...\n');

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // iOS / main icon: white background, logo fills most of the square.
  const iconLogo = await composeReady(1004);
  await composeOnCanvas(iconLogo, 1024, 1024, ICON_BG, 'icon.png');

  // Android adaptive foreground: transparent bg, logo in the safe zone (~70%).
  const adaptiveLogo = await composeReady(720);
  await composeOnCanvas(adaptiveLogo, 1024, 1024, TRANSPARENT, 'adaptive-icon.png');

  // Splash: logo centered on the dark brand background.
  const splashLogo = await composeReady(760);
  await composeOnCanvas(splashLogo, 1284, 2778, SPLASH_BG, 'splash.png');

  // Favicon
  const favLogo = await composeReady(46);
  await composeOnCanvas(favLogo, 48, 48, ICON_BG, 'favicon.png');

  console.log('\n✨ Done! Icons written to mobile-app/assets/\n');
}

async function composeReady(size) {
  return getCleanLogo(size);
}

main().catch((error) => {
  console.error('❌ Error creating assets:', error.message);
  process.exit(1);
});
