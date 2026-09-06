// One-off generator for Android launcher icons (and public PWA icons) from Pic/Png/01.png.
// Usage: node scripts/generate-android-icons.mjs
// Requires: sharp (devDependency)
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Raster source artwork (271x220, non-square) — padded onto a white square canvas.
const sourcePath = path.join(repoRoot, 'Pic', 'Png', '01.png');
const publicDir = path.join(repoRoot, 'public');
const resDir = path.join(repoRoot, 'android', 'app', 'src', 'main', 'res');

// The artwork occupies ~92% of the square canvas so it is not clipped.
const SOURCE_SCALE = 0.92;

// [density, legacy launcher size, adaptive foreground canvas size]
const DENSITIES = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
];

// Fraction of the adaptive-icon canvas the icon may occupy (safe zone padding).
const FOREGROUND_ICON_RATIO = 0.62;

/** Fit the source artwork (contained, centered, ~92% scale) onto an opaque white square canvas of `size`. */
async function renderSquareIcon(size) {
  const inner = Math.round(size * SOURCE_SCALE);
  const artwork = await sharp(sourcePath)
    .resize(inner, inner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  const offset = Math.round((size - inner) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([{ input: artwork, left: offset, top: offset }])
    .png()
    .toBuffer();
}

/** Circular mask used to crop round launcher icons (outside becomes transparent). */
function circleMask(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`
  );
}

// Public PWA icons (square, white background).
for (const size of [192, 512]) {
  const icon = await renderSquareIcon(size);
  await sharp(icon).toFile(path.join(publicDir, `icon-${size}.png`));
  console.log(`public: icon-${size}.png ${size}x${size}`);
}

async function writeLegacyIcons(density, size) {
  const dir = path.join(resDir, `mipmap-${density}`);
  await mkdir(dir, { recursive: true });

  const flattened = await renderSquareIcon(size);
  await sharp(flattened).toFile(path.join(dir, 'ic_launcher.png'));

  await sharp(flattened)
    .composite([{ input: circleMask(size), blend: 'dest-in' }])
    .png()
    .toFile(path.join(dir, 'ic_launcher_round.png'));
}

async function writeForegroundIcon(density, canvas) {
  const dir = path.join(resDir, `mipmap-${density}`);
  await mkdir(dir, { recursive: true });

  const iconSize = Math.round(canvas * FOREGROUND_ICON_RATIO);
  const offset = Math.round((canvas - iconSize) / 2);
  const icon = await renderSquareIcon(iconSize);

  await sharp({
    create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: icon, left: offset, top: offset }])
    .png()
    .toFile(path.join(dir, 'ic_launcher_foreground.png'));
}

const ADAPTIVE_ICON_XML =
  `<?xml version="1.0" encoding="utf-8"?>\n` +
  `<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n` +
  `    <background android:drawable="@color/ic_launcher_background"/>\n` +
  `    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n` +
  `</adaptive-icon>\n`;

async function writeAdaptiveXml() {
  const dir = path.join(resDir, 'mipmap-anydpi-v26');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'ic_launcher.xml'), ADAPTIVE_ICON_XML, 'utf8');
  await writeFile(path.join(dir, 'ic_launcher_round.xml'), ADAPTIVE_ICON_XML, 'utf8');

  const valuesDir = path.join(resDir, 'values');
  await mkdir(valuesDir, { recursive: true });
  await writeFile(
    path.join(valuesDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#FFFFFF</color>\n</resources>\n`,
    'utf8'
  );
}

for (const [density, legacySize, foregroundCanvas] of DENSITIES) {
  await writeLegacyIcons(density, legacySize);
  await writeForegroundIcon(density, foregroundCanvas);
  console.log(`mipmap-${density}: ic_launcher.png ${legacySize}x${legacySize}, ic_launcher_round.png ${legacySize}x${legacySize}, ic_launcher_foreground.png ${foregroundCanvas}x${foregroundCanvas}`);
}
await writeAdaptiveXml();
console.log('mipmap-anydpi-v26: ic_launcher.xml, ic_launcher_round.xml');
console.log('values: ic_launcher_background.xml (#FFFFFF)');
console.log('Done.');
