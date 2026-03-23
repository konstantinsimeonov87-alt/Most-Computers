#!/usr/bin/env node
// build.js — Most Computers build script
// Usage: node build.js
// - Concatenates js/ source files → app.js
// - Bumps Service Worker cache version automatically

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = __dirname;

// ── JS bundle ────────────────────────────────────────────────────────────────
const JS_ORDER = [
  'currency','data','cards','ui','gallery','cart','search','auth',
  'recently-viewed','filters','order-tracker','pwa','product-page',
  'pdp-ux','seo','pages','actions','main'
];

const ADMIN_STUB = `
// ===== ADMIN (LAZY LOADED) =====
function _doOpenAdmin() {
  document.getElementById('adminPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof adminUpdateOrdersBadge === 'function') adminUpdateOrdersBadge();
  if (typeof adminShowTab === 'function') adminShowTab('dashboard');
}
function openAdminPage() {
  if (!window._adminUnlocked) {
    const pin = prompt('Въведи PIN за достъп до администрацията:');
    if (pin !== '1234') { showToast('❌ Грешен PIN!'); return; }
    window._adminUnlocked = true;
  }
  if (window._adminScriptLoaded) { _doOpenAdmin(); return; }
  const s = document.createElement('script');
  s.src = 'js/admin.js';
  s.onload = () => { window._adminScriptLoaded = true; _doOpenAdmin(); };
  s.onerror = () => showToast('❌ Грешка при зареждане на Admin.');
  document.head.appendChild(s);
}
function closeAdminPage() {
  const p = document.getElementById('adminPage');
  if (p) { p.classList.remove('open'); }
  document.body.style.overflow = '';
}
`;

const bundle = JS_ORDER
  .map(f => fs.readFileSync(path.join(ROOT, 'js', f + '.js'), 'utf8'))
  .join('\n') + ADMIN_STUB;

fs.writeFileSync(path.join(ROOT, 'app.js'), bundle, 'utf8');

const gzSize = zlib.gzipSync(bundle).length;
console.log(`✓ app.js  ${Math.round(bundle.length / 1024)}KB raw  /  ${Math.round(gzSize / 1024)}KB gzip`);

// ── SW version bump ───────────────────────────────────────────────────────────
const swPath = path.join(ROOT, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');

const match = sw.match(/const CACHE = 'mc-v(\d+)'/);
if (match) {
  const oldVer = parseInt(match[1]);
  const newVer = oldVer + 1;
  sw = sw.replace(`mc-v${oldVer}`, `mc-v${newVer}`);
  sw = sw.replace(/\/\/ Most Computers — Service Worker v\d+/, `// Most Computers — Service Worker v${newVer}`);
  fs.writeFileSync(swPath, sw, 'utf8');
  console.log(`✓ sw.js   mc-v${oldVer} → mc-v${newVer}`);
} else {
  console.log('⚠ sw.js  версията не е намерена');
}

console.log('\nBuild completed!');
