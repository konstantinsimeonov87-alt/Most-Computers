// Generates all required Expo assets for Most Computers app
// Run from project root: node mobile/generate-assets.js

const sharp = require('../node_modules/sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'assets');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const DARK  = '#0f172a';
const DARK2 = '#1e293b';
const RED   = '#bd1105';
const RED2  = '#e8150a';
const WHITE = '#ffffff';

// ── SVG builders ──────────────────────────────────────────────────────────────

function iconSvg(size) {
  const r   = size * 0.22;
  const cx  = size / 2;
  const mw  = size * 0.52;
  const mh  = mw * 0.68;
  const mx  = cx - mw / 2;
  const my  = cx - mh * 0.58;
  const legY1 = my + mh;
  const legY2 = legY1 + mw * 0.17;
  const baseW = mw * 0.44;
  const sw  = size * 0.028;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${DARK2}"/>
      <stop offset="100%" stop-color="${DARK}"/>
    </linearGradient>
    <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${RED2}"/>
      <stop offset="100%" stop-color="${RED}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <ellipse cx="${cx}" cy="${my + mh*0.5}" rx="${mw*0.56}" ry="${mh*0.46}"
           fill="${RED}" opacity="0.13"/>
  <rect x="${mx}" y="${my}" width="${mw}" height="${mh}"
        rx="${size*0.03}" fill="none" stroke="${WHITE}" stroke-width="${sw}" opacity="0.95"/>
  <rect x="${mx + sw*0.5}" y="${my + sw*0.5}"
        width="${mw - sw}" height="${mh - sw}"
        rx="${size*0.025}" fill="${WHITE}" opacity="0.05"/>
  <line x1="${cx}" y1="${legY1}" x2="${cx}" y2="${legY2}"
        stroke="${WHITE}" stroke-width="${sw}" stroke-linecap="round" opacity="0.9"/>
  <line x1="${cx - baseW/2}" y1="${legY2}" x2="${cx + baseW/2}" y2="${legY2}"
        stroke="${WHITE}" stroke-width="${sw}" stroke-linecap="round" opacity="0.9"/>
  <text x="${cx}" y="${my + mh*0.535}"
        font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900"
        font-size="${mw * 0.44}" fill="${WHITE}"
        text-anchor="middle" dominant-baseline="middle">MC</text>
  <rect x="${cx - mw*0.22}" y="${legY2 + size*0.02}"
        width="${mw * 0.44}" height="${size*0.018}"
        rx="${size*0.009}" fill="url(#rg)"/>
</svg>`;
}

function splashSvg(w, h) {
  const cx    = w / 2;
  const logoY = h * 0.40;
  const mw    = w * 0.30;
  const mh    = mw * 0.68;
  const mx    = cx - mw / 2;
  const my    = logoY - mh * 0.52;
  const legY1 = my + mh;
  const legY2 = legY1 + mw * 0.17;
  const baseW = mw * 0.44;
  const sw    = w * 0.022;

  const gridLines = Array.from({length: 14}, (_, i) => {
    const y = h * 0.02 + i * (h * 0.072);
    return `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${WHITE}" stroke-width="0.8" opacity="0.025"/>`;
  }).join('');

  const dots = [-2,-1,0,1,2].map((i, idx) => {
    const isCenter = idx === 2;
    return `<circle cx="${cx + i*w*0.045}" cy="${h*0.915}" r="${w*(isCenter ? 0.013 : 0.007)}" fill="${isCenter ? RED : WHITE}" opacity="${isCenter ? 0.9 : 0.18}"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${DARK2}"/>
      <stop offset="100%" stop-color="${DARK}"/>
    </linearGradient>
    <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${RED2}"/>
      <stop offset="100%" stop-color="${RED}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${RED}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${RED}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${gridLines}
  <ellipse cx="${cx}" cy="${logoY}" rx="${w*0.40}" ry="${w*0.40}" fill="url(#glow)"/>
  <rect x="${mx}" y="${my}" width="${mw}" height="${mh}"
        rx="${w*0.025}" fill="none" stroke="${WHITE}" stroke-width="${sw}" opacity="0.95"/>
  <rect x="${mx + sw*0.5}" y="${my + sw*0.5}"
        width="${mw - sw}" height="${mh - sw}"
        rx="${w*0.02}" fill="${WHITE}" opacity="0.05"/>
  <line x1="${cx}" y1="${legY1}" x2="${cx}" y2="${legY2}"
        stroke="${WHITE}" stroke-width="${sw}" stroke-linecap="round" opacity="0.9"/>
  <line x1="${cx - baseW/2}" y1="${legY2}" x2="${cx + baseW/2}" y2="${legY2}"
        stroke="${WHITE}" stroke-width="${sw}" stroke-linecap="round" opacity="0.9"/>
  <text x="${cx}" y="${my + mh*0.535}"
        font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900"
        font-size="${mw * 0.44}" fill="${WHITE}"
        text-anchor="middle" dominant-baseline="middle">MC</text>
  <rect x="${cx - w*0.12}" y="${legY2 + w*0.032}" width="${w*0.24}" height="${w*0.014}"
        rx="${w*0.007}" fill="url(#rg)"/>
  <text x="${cx}" y="${h * 0.535}"
        font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900"
        font-size="${w * 0.082}" fill="${WHITE}"
        text-anchor="middle" dominant-baseline="middle">Most Computers</text>
  <text x="${cx}" y="${h * 0.584}"
        font-family="Arial,Helvetica,sans-serif" font-weight="300"
        font-size="${w * 0.034}" fill="rgba(148,163,184,1)"
        letter-spacing="2"
        text-anchor="middle" dominant-baseline="middle">ЕЛЕКТРОНИКА ЗА ВСЕКИ</text>
  ${dots}
</svg>`;
}

function notifSvg(size) {
  const cx = size / 2;
  const cy = size / 2;
  const mw = size * 0.78;
  const mh = mw * 0.68;
  const mx = cx - mw / 2;
  const my = cy - mh * 0.58;
  const legY1 = my + mh;
  const legY2 = legY1 + mw * 0.17;
  const baseW = mw * 0.44;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="${mx}" y="${my}" width="${mw}" height="${mh}"
        rx="${size*0.05}" fill="none" stroke="${WHITE}" stroke-width="${size*0.09}"/>
  <line x1="${cx}" y1="${legY1}" x2="${cx}" y2="${legY2}"
        stroke="${WHITE}" stroke-width="${size*0.09}" stroke-linecap="round"/>
  <line x1="${cx - baseW/2}" y1="${legY2}" x2="${cx + baseW/2}" y2="${legY2}"
        stroke="${WHITE}" stroke-width="${size*0.09}" stroke-linecap="round"/>
  <text x="${cx}" y="${my + mh*0.535}"
        font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900"
        font-size="${mw*0.42}" fill="${WHITE}"
        text-anchor="middle" dominant-baseline="middle">MC</text>
</svg>`;
}

// ── Generate ──────────────────────────────────────────────────────────────────

async function gen(svgStr, outFile, width, height) {
  await sharp(Buffer.from(svgStr))
    .resize(width, height)
    .png()
    .toFile(path.join(OUT, outFile));
  console.log(`  + assets/${outFile}  (${width}x${height})`);
}

(async () => {
  console.log('\nGenerating Most Computers premium assets...\n');
  await gen(iconSvg(1024),         'icon.png',              1024, 1024);
  await gen(iconSvg(1024),         'adaptive-icon.png',     1024, 1024);
  await gen(splashSvg(1284, 2778), 'splash.png',            1284, 2778);
  await gen(notifSvg(96),          'notification-icon.png',   96,   96);
  console.log('\nDone!\n');
})();
