// scripts/fetch-monitor-specs.js
// Fetches monitor specs from portal.mostbg.com (categoryId=8).
// Extracts panel, resolution, Hz, sync tech, HDR, stand, interfaces, aspect ratio.
// Matches by EAN or PartNumber, writes new spec fields into js/data.js.
//
// Usage:
//   node scripts/fetch-monitor-specs.js          → dry run, prints results
//   node scripts/fetch-monitor-specs.js --apply  → writes into js/data.js

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');
const vm    = require('vm');

// ─── Load products ────────────────────────────────────────────────────────────
const _ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8'), _ctx);
const { products } = _ctx;

const monitors = products.filter(p => p.cat === 'monitors');
console.log(`\n🖥  ${monitors.length} монитора в data.js`);

// ─── Fetch XML ────────────────────────────────────────────────────────────────
function fetchXml() {
  return new Promise((resolve, reject) => {
    const url = 'https://portal.mostbg.com/api/product/xml/categoryId=8?currency=EUR';
    const req = https.get(url, res => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ─── XML helpers ──────────────────────────────────────────────────────────────
function tag(block, name) {
  return (block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i')) || [])[1]?.trim() || '';
}

function prop(block, name) {
  const re = new RegExp(`<property[^>]*name="${name}"[^>]*>([\\s\\S]*?)<\\/property>`, 'i');
  return (block.match(re) || [])[1]?.trim() || '';
}

// Returns Set of description name= values for this product
function descNames(block) {
  const s = new Set();
  const re = /<description name="([^"]+)"/g;
  let m;
  while ((m = re.exec(block)) !== null) s.add(m[1].toUpperCase());
  return s;
}

// ─── Parse one XML product block → spec patch object ─────────────────────────
function parseMonitorBlock(block) {
  const flags = descNames(block);
  const ss    = tag(block, 'searchstring').toUpperCase();
  const patch = {};

  // Panel type — canonical name
  if      (flags.has('OLED'))            patch.Панел = 'OLED';
  else if (flags.has('QLED'))            patch.Панел = 'QLED';
  else if (flags.has('NANOIPS'))         patch.Панел = 'Nano IPS';
  else if (flags.has('AH-IPS'))          patch.Панел = 'IPS';
  else if (flags.has('IPS'))             patch.Панел = 'IPS';
  else if (flags.has('VA'))              patch.Панел = 'VA';
  else if (flags.has('TN'))              patch.Панел = 'TN';

  // Resolution — canonical code
  if      (flags.has('UW-DQHD'))         patch.Резолюция = '5120×1440 (UW-DQHD)';
  else if (flags.has('UHD_4K'))          patch.Резолюция = '3840×2160 (4K)';
  else if (flags.has('WQHD+'))           patch.Резолюция = '3840×1600 (UW-4K)';
  else if (flags.has('UW-QHD') || flags.has('UWQHD'))  patch.Резолюция = '3440×1440 (UW-QHD)';
  else if (flags.has('SDQHD'))           patch.Резолюция = '2560×2880 (SDQHD)';
  else if (flags.has('WQHD'))            patch.Резолюция = '2560×1440 (QHD)';
  else if (flags.has('UW-FHD') || flags.has('UW-UXGA')) patch.Резолюция = '2560×1080 (UW-FHD)';
  else if (flags.has('QHD'))             patch.Резолюция = '2560×1440 (QHD)';
  else if (flags.has('WUXGA'))           patch.Резолюция = '1920×1200 (WUXGA)';
  else if (flags.has('FHD'))             patch.Резолюция = '1920×1080 (FHD)';
  else if (flags.has('QXGA'))            patch.Резолюция = '2048×1536 (QXGA)';
  else if (flags.has('HD'))              patch.Резолюция = '1280×720 (HD)';
  else if (flags.has('SXGA'))            patch.Резолюция = '1280×1024 (SXGA)';

  // Refresh rate — from description name like "144Hz" or property
  const hzDesc = [...flags].find(f => /^\d+HZ$/.test(f));
  const hzProp = prop(block, 'Refresh rate').replace(/\s/g, '');
  if (hzDesc)                            patch.Честота = parseInt(hzDesc) + ' Hz';
  else if (hzProp)                       patch.Честота = parseInt(hzProp) + ' Hz';

  // Screen size — from description name like "27" or "31.5" or property
  const sizeDesc = [...flags].find(f => /^[\d.]+$/.test(f) && parseFloat(f) >= 10 && parseFloat(f) <= 100);
  const sizeProp = prop(block, 'Screen size').replace(/[^\d.]/g, '');
  if (sizeProp)                          patch.Размер  = parseFloat(sizeProp) + '"';
  else if (sizeDesc)                     patch.Размер  = parseFloat(sizeDesc) + '"';

  // Sync technology
  const syncProp = prop(block, 'Sync technology').toLowerCase();
  const hasFreesync = flags.has('FREESYNC') || /freesync/i.test(syncProp);
  const hasGsync    = /g.?sync/i.test(syncProp) || ss.includes('GSYNC') || ss.includes('G-SYNC');
  if (hasFreesync && hasGsync)           patch.Sync = 'FreeSync+G-Sync';
  else if (hasFreesync)                  patch.Sync = 'FreeSync';
  else if (hasGsync)                     patch.Sync = 'G-Sync';

  // HDR
  if (flags.has('HDR'))                  patch.HDR = 'Да';

  // Stand features
  if (flags.has('PIVOT'))                patch.Pivot = 'Да';
  const mechProp = prop(block, 'Mechanical design').toLowerCase();
  if (flags.has('SWIVEL') || /swivel.*yes/i.test(mechProp))  patch.Swivel = 'Да';
  if (/height.*yes|lift.*yes|ergonomic.*height/i.test(mechProp)) patch.HeightAdj = 'Да';

  // Interfaces
  if (flags.has('HDMI') || ss.includes('HDMI'))         patch.HDMI = 'Да';
  if (flags.has('DP')   || ss.includes(' DP '))         patch.DP   = 'Да';
  if (ss.includes('USB-C') || ss.includes('USBC') || /usb.?c/i.test(prop(block, 'I/O'))) patch.USBC = 'Да';

  // Aspect ratio
  const ratioFlags = ['16:9','16:10','21:9','32:9','4:3','5:4','16:18'];
  const matchedRatio = ratioFlags.find(r => flags.has(r));
  if (matchedRatio)                      patch.Ratio = matchedRatio;

  // Curved
  if (flags.has('CURVED'))               patch.Curved = 'Да';

  return patch;
}

// ─── Build lookup from XML ────────────────────────────────────────────────────
async function buildLookup() {
  console.log('⏳ Зареждам XML от portal.mostbg.com (categoryId=8)…');
  const xml = await fetchXml();
  const blocks = xml.match(/<product[\s\S]*?<\/product>/g) || [];
  console.log(`📦 ${blocks.length} продукта в XML\n`);

  const byEan  = new Map();
  const byPart = new Map();

  for (const b of blocks) {
    const ean  = tag(b, 'EAN').replace(/\s/g, '');
    const part = tag(b, 'PartNumber').replace(/\s/g, '').toUpperCase();
    const data = parseMonitorBlock(b);

    if (ean  && /^\d{8,14}$/.test(ean))  byEan.set(ean, data);
    if (part && part.length >= 6)         byPart.set(part, data);
  }

  console.log(`🗺  ${byEan.size} по EAN, ${byPart.size} по PartNumber`);
  return { byEan, byPart };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const { byEan, byPart } = await buildLookup();

  // Fields NOT to overwrite — already handled by filter handlers via normalization
  const SKIP_IF_EXISTS = new Set(['Панел','Резолюция','Честота','Размер']);

  const results = {};  // id → patch

  for (const p of monitors) {
    const ean  = String(p.ean  || '').replace(/\s/g, '');
    const part = String(p.sku  || '').replace(/\s/g, '').toUpperCase();

    let patch = null;
    if (ean  && byEan.has(ean))   patch = byEan.get(ean);
    if (!patch && part && byPart.has(part)) patch = byPart.get(part);
    if (!patch) continue;

    // Only insert new fields — never overwrite existing spec values
    const filtered = {};
    for (const [k, v] of Object.entries(patch)) {
      const existing = (p.specs || {})[k];
      if (!existing && !SKIP_IF_EXISTS.has(k)) filtered[k] = v;
    }
    if (Object.keys(filtered).length === 0) continue;

    results[p.id] = filtered;

    const label = `[${String(p.id).padStart(4)}] ${(p.brand + ' | ' + p.name).slice(0, 55).padEnd(55)}`;
    const summary = Object.entries(filtered).map(([k,v]) => `${k}=${v}`).join('; ');
    console.log(`${label} ✅ ${summary}`);
  }

  const found = Object.keys(results).length;
  console.log(`\n─────────────────────────────────────────────────────────`);
  console.log(`✅ Обогатени: ${found} / ${monitors.length} монитора`);

  if (!found) return;

  const outPath = path.join(__dirname, 'monitor-specs-results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n💾 Записано в ${outPath}`);

  if (!process.argv.includes('--apply')) {
    console.log('\n💡 Пусни с --apply за да запишеш в js/data.js');
    return;
  }

  // ── Patch data.js ──────────────────────────────────────────────────────────
  let src = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
  let patched = 0;

  for (const [idStr, patch] of Object.entries(results)) {
    const id    = parseInt(idStr);
    const idPos = src.indexOf(`id:${id},`);
    if (idPos === -1) continue;

    const specsPos = src.indexOf('specs:{', idPos);
    if (specsPos === -1) continue;

    const insertAt = specsPos + 'specs:{'.length;

    for (const [k, v] of Object.entries(patch)) {
      // Skip if field already present
      if (src.slice(insertAt, insertAt + 400).includes(`'${k}':`)) continue;
      const esc = v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      src = src.slice(0, insertAt) + `'${k}':'${esc}',` + src.slice(insertAt);
    }
    patched++;
  }

  fs.writeFileSync(path.join(__dirname, '../js/data.js'), src, 'utf8');
  console.log(`\n✅ Патчнати ${patched} продукта в js/data.js`);
  console.log('▶  Пусни: node build.js');
}

main().catch(console.error);
