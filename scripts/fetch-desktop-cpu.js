// scripts/fetch-desktop-cpu.js
// Fetches CPU info for desktops from portal.mostbg.com (categoryId=34).
// Matches by EAN or PartNumber, extracts <property name="CPU model">.
//
// Usage:
//   node scripts/fetch-desktop-cpu.js          → dry run, prints results
//   node scripts/fetch-desktop-cpu.js --apply  → writes Процесор into data.js

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');
const vm    = require('vm');

// ─── Load products ────────────────────────────────────────────────────────────
const _ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8'), _ctx);
const { products } = _ctx;

const desktops = products.filter(p => p.cat === 'desktops');
const TARGETS  = desktops.filter(p => !p.specs?.Процесор);
console.log(`\n🖥  ${desktops.length} десктопа в data.js`);
console.log(`🔍 ${TARGETS.length} без поле Процесор\n`);

// ─── Fetch XML from portal ────────────────────────────────────────────────────
function fetchXml() {
  return new Promise((resolve, reject) => {
    const url = 'https://portal.mostbg.com/api/product/xml/categoryId=34?currency=EUR';
    const req = https.get(url, res => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ─── Parse one XML <product> block ───────────────────────────────────────────
function tag(block, name) {
  return (block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i')) || [])[1]?.trim() || '';
}

function prop(block, name) {
  const re = new RegExp(`<property[^>]*name="${name}"[^>]*>([\\s\\S]*?)<\\/property>`, 'i');
  return (block.match(re) || [])[1]?.trim() || '';
}

// Normalize CPU string: keep only the key part
function normalizeCpu(raw) {
  // "Intel® Core™ i5-13420H, 8C (4P + 4E) / 12T, P-core..." → "Intel Core i5-13420H"
  const clean = raw.replace(/[®™©]/g, '').replace(/\s+/g, ' ').trim();
  // Trim after the model number (stop at comma or extra specs)
  const m = clean.match(/^(Intel\s+Core\s+(?:Ultra\s+)?[A-Za-z0-9- ]+?)\s*[,;(]/i)
         || clean.match(/^(AMD\s+Ryzen\s+[A-Za-z0-9 ]+?)\s*[,;(]/i)
         || clean.match(/^(Intel\s+N\d{3,4}[A-Z]?)/i)
         || clean.match(/^(Intel\s+Celeron\s+[A-Z0-9]+)/i)
         || clean.match(/^(AMD\s+\w+\s+\w+)/i);
  return m ? m[1].trim() : clean.split(',')[0].trim();
}

// ─── Build lookup map from XML ────────────────────────────────────────────────
async function buildLookup() {
  console.log('⏳ Зареждам XML от portal.mostbg.com…');
  const xml = await fetchXml();
  const blocks = xml.match(/<product[\s\S]*?<\/product>/g) || [];
  console.log(`📦 ${blocks.length} продукта в XML\n`);

  // Map: ean → cpu, partNumber → cpu
  const byEan  = new Map();
  const byPart = new Map();

  for (const block of blocks) {
    const cpuRaw = prop(block, 'CPU model');
    if (!cpuRaw) continue;

    const cpu  = normalizeCpu(cpuRaw);
    const ean  = tag(block, 'EAN').replace(/\s/g, '');
    const part = tag(block, 'PartNumber').replace(/\s/g, '').toUpperCase();

    if (ean  && /^\d{8,14}$/.test(ean))  byEan.set(ean, cpu);
    if (part && part.length >= 6)         byPart.set(part, cpu);
  }

  console.log(`🗺  Намерени CPU данни: ${byEan.size} по EAN, ${byPart.size} по PartNumber`);
  return { byEan, byPart };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const { byEan, byPart } = await buildLookup();

  const results = {};  // id → cpu

  for (const p of TARGETS) {
    const ean  = (p.ean  || '').replace(/\s/g, '');
    const part = (p.sku  || '').replace(/\s/g, '').toUpperCase();

    let cpu = null;
    let via = '';

    if (ean && byEan.has(ean))   { cpu = byEan.get(ean);   via = 'EAN'; }
    if (!cpu && part && byPart.has(part)) { cpu = byPart.get(part); via = 'SKU'; }

    const label = `[${String(p.id).padStart(4)}] ${(p.brand + ' | ' + p.name).slice(0, 52).padEnd(52)}`;
    if (cpu) {
      results[p.id] = cpu;
      console.log(`${label} ✅ [${via}] ${cpu}`);
    } else {
      console.log(`${label} ❌`);
    }
  }

  const found = Object.keys(results).length;
  console.log(`\n─────────────────────────────────────────────────────────`);
  console.log(`✅ Намерени: ${found} / ${TARGETS.length}`);

  if (!found) return;

  // Save JSON results
  const outPath = path.join(__dirname, 'desktop-cpu-results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n💾 Записано в ${outPath}`);

  // Patch data.js if --apply
  if (process.argv.includes('--apply')) {
    let src = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
    let patched = 0;

    for (const [idStr, cpu] of Object.entries(results)) {
      const id = parseInt(idStr);
      const idPos = src.indexOf(`id:${id},`);
      if (idPos === -1) continue;

      const specsPos = src.indexOf('specs:{', idPos);
      if (specsPos === -1) continue;

      const insertAt = specsPos + 'specs:{'.length;
      // Don't double-patch
      if (src.slice(insertAt, insertAt + 15).includes('Процесор')) continue;

      const escaped = cpu.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      src = src.slice(0, insertAt) + `'Процесор':'${escaped}',` + src.slice(insertAt);
      patched++;
    }

    fs.writeFileSync(path.join(__dirname, '../js/data.js'), src, 'utf8');
    console.log(`\n✅ Патчнати ${patched} продукта в data.js`);
    console.log('▶  Пусни: node build.js');
  } else {
    console.log('\n💡 Пусни с --apply за да запишеш в data.js');
  }
}

main().catch(console.error);
