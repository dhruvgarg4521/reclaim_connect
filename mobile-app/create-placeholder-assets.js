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
 * Extract only the "R" symbol, removing the white/lavender squircle container
 * so the mark sits directly on a transparent (later: white) background.
 *
 * Strategy:
 *   1. Trim black outer border.
 *   2. Crop bottom ~28% (RECLAIM text).
 *   3. Process raw pixels: make near-white pixels transparent, keeping only
 *      the coloured "R" mark (purple/blue) and its dark shadows.
 *   4. Resize and return as transparent PNG — caller composites on canvas.
 */
async function getCleanLogo(size) {
  const src = resolveSource();
  if (!src) throw new Error('No logo source found (assets/logo-source.png).');

  const WORK = 1200; // high-res work size for precision

  // ── Step 1: trim black outer border ─────────────────────────────
  const trimmedBuf = await sharp(src)
    .trim({ background: '#000000', threshold: 40 })
    .resize(WORK, WORK, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer();

  // ── Step 2: crop inward past the drop-shadow halo ────────────────
  const inset = Math.round(WORK * 0.07);
  const innerBuf = await sharp(trimmedBuf)
    .extract({ left: inset, top: inset, width: WORK - inset * 2, height: WORK - inset * 2 })
    .png()
    .toBuffer();

  // ── Step 3: crop off the RECLAIM text (bottom 28%) ───────────────
  const innerMeta = await sharp(innerBuf).metadata();
  const keepH = Math.round(innerMeta.height * 0.72);
  const rOnlyBuf = await sharp(innerBuf)
    .extract({ left: 0, top: 0, width: innerMeta.width, height: keepH })
    .ensureAlpha()
    .png()
    .toBuffer();

  // ── Step 4: remove near-white / lavender squircle background ─────
  // Process raw RGBA pixels: pixels where all RGB channels are > 210
  // are the white squircle container — make them transparent.
  // The "R" mark is purple/blue (B channel >> R, G < 200) and its
  // drop shadows are near-black — both are kept.
  const { data, info } = await sharp(rOnlyBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8ClampedArray(data.buffer);
  const W = info.width;
  const H = info.height;

  for (let i = 0; i < pixels.length; i += 4) {
    const pr = pixels[i];
    const pg = pixels[i + 1];
    const pb = pixels[i + 2];

    // Remove near-white / lavender squircle background.
    // The "R" mark is purple/blue so its pixels have: B is highest, R moderate, G lower.
    // We keep pixels that look like the R (coloured) or its core shadows (very dark).
    const col = (i / 4) % W;
    const row = Math.floor((i / 4) / W);

    // The "R" mark has strongly blue-shifted pixels (blue channel >> red/green).
    // The squircle's background and border strokes are neutral white/gray/lavender.
    // We use this to safely distinguish squircle from logo.
    const isStrongBlue = pb - pr > 35 || pb - pg > 35;

    // Near-white: squircle fill and fade zones (exempt strongly-blue R pixels).
    const isNearWhite = !isStrongBlue && pr > 185 && pg > 185 && pb > 185;

    // Corner drop-shadow artefacts from the squircle shape.
    const cornerZone = 0.20;
    const inCorner = (
      (col < W * cornerZone || col > W * (1 - cornerZone)) &&
      (row < H * cornerZone || row > H * (1 - cornerZone))
    );

    // Side-border stroke artefacts: thin vertical lines at the left/right edges
    // of the squircle. R starts at ~28% from the left so this zone is safe to clear.
    const inSideBorder = col < W * 0.25 || col > W * 0.75;
    const isSideBorderArtifact = inSideBorder && !isStrongBlue && (pr < 160 || pg < 160);

    if (isNearWhite || inCorner || isSideBorderArtifact) {
      pixels[i + 3] = 0; // transparent
    }
  }

  // ── Step 5: convert back to sharp + trim to the R mark's bounding box ──
  // Trimming transparent edges removes any squircle border artifacts that
  // slipped through the pixel pass — the R mark then fills the buffer cleanly.
  const cleanBuf = await sharp(Buffer.from(pixels.buffer), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  const trimmedClean = await sharp(cleanBuf)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 5 })
    .png()
    .toBuffer();

  // ── Step 6: resize to target size with padding ───────────────────
  // fit: 'contain' scales to fill ~80% of the icon so the R has breathing room.
  const inner = Math.round(size * 0.82);
  const padded = await sharp(trimmedClean)
    .resize(inner, inner, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer();

  // Embed on a full-size transparent canvas (centred).
  const offset = Math.round((size - inner) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background: TRANSPARENT },
  })
    .composite([{ input: padded, left: offset, top: offset }])
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

  // iOS / main icon: "R" on clean white square. 700px symbol gives breathing room.
  const iconLogo = await composeReady(700);
  await composeOnCanvas(iconLogo, 1024, 1024, ICON_BG, 'icon.png');

  // Android adaptive foreground: transparent canvas, R inside 66% safe zone.
  // Safe zone is ~680px on a 1024px canvas — use 580px to be comfortably inside.
  const adaptiveLogo = await composeReady(580);
  await composeOnCanvas(adaptiveLogo, 1024, 1024, TRANSPARENT, 'adaptive-icon.png');

  // Splash: "R" on dark brand background.
  const splashLogo = await composeReady(500);
  await composeOnCanvas(splashLogo, 1284, 2778, SPLASH_BG, 'splash.png');

  // Favicon
  const favLogo = await composeReady(38);
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
