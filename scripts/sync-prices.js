'use strict';
/**
 * sync-prices.js — следи ценови намаления и обновява old/pct/badge в js/data.js
 *
 * При ПЪРВО пускане: изгражда baseline от текущите XML цени (нищо не се маркира).
 * При СЛЕДВАЩИ пускания: ако цена е паднала с ≥ MIN_DROP_PCT% спрямо baseline →
 *   обновява price, old, pct, badge в data.js.
 * Ако цена се е вдигнала → обновява baseline, маха old/pct/badge.
 *
 * price-history.json се commit-ва в repo-то и персистира между runs.
 *
 * Usage: node scripts/sync-prices.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const DATA_FILE    = path.join(__dirname, '../js/data.js');
const HISTORY_FILE = path.join(__dirname, '../price-history.json');
const EUR_RATE     = 1.95583;
const MIN_DROP_PCT = 5; // минимален % спад, за да се покаже като sale

const CATEGORIES = [
  { id: 1,  name: 'HDD/SSD' },
  { id: 2,  name: 'Motherboards' },
  { id: 3,  name: 'CPU' },
  { id: 4,  name: 'RAM' },
  { id: 7,  name: 'GPU' },
  { id: 8,  name: 'Monitors' },
  { id: 9,  name: 'Cases/PSU' },
  { id: 10, name: 'Keyboards' },
  { id: 11, name: 'Mice' },
  { id: 12, name: 'Printers' },
  { id: 15, name: 'Network' },
  { id: 16, name: 'UPS' },
  { id: 19, name: 'Flash/USB' },
  { id: 21, name: 'Laptops' },
  { id: 22, name: 'Multimedia' },
  { id: 32, name: 'Phones' },
  { id: 34, name: 'Desktops' },
];

function fetchXml(categoryId) {
  return new Promise((resolve, reject) => {
    const url = `https://portal.mostbg.com/api/product/xml/categoryId=${categoryId}?currency=EUR`;
    const req = https.get(url, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout cat ${categoryId}`)); });
  });
}

function parsePriceMap(xml) {
  // Returns Map<key, priceBGN> — keyed by SKU and 'EAN:xxx'
  const map = new Map();
  const re = /<product[\s\S]*?<\/product>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[0];
    const skuM   = block.match(/<PartNumber>(.*?)<\/PartNumber>/i);
    const eanM   = block.match(/<EAN>(\d{8,14})<\/EAN>/i);
    const priceM = block.match(/<price>([\d.]+)<\/price>/i);
    if (!priceM) continue;
    const priceBGN = Math.round(parseFloat(priceM[1]) * EUR_RATE * 1.2 * 100) / 100;
    if (skuM && skuM[1].trim()) map.set(skuM[1].trim(), priceBGN);
    if (eanM)                   map.set('EAN:' + eanM[1].trim(), priceBGN);
  }
  return map;
}

function loadHistory() {
  try { return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); }
  catch { return {}; }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('💰 sync-prices.js — Most BG price drop tracker');
  console.log(`📅 ${new Date().toISOString()}\n`);

  const history    = loadHistory();
  const today      = new Date().toISOString().slice(0, 10);
  const isFirstRun = Object.keys(history).length === 0;
  if (isFirstRun) console.log('⚡ First run — building price baseline (no changes to data.js today)\n');

  // ── 1. Fetch prices from all XML categories ─────────────────────────────
  const priceMap = new Map();
  for (const cat of CATEGORIES) {
    try {
      process.stdout.write(`  Fetching cat ${cat.id} (${cat.name})... `);
      const xml = await fetchXml(cat.id);
      const m   = parsePriceMap(xml);
      m.forEach((v, k) => priceMap.set(k, v));
      console.log(`${m.size} products`);
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
    await sleep(400);
  }
  console.log(`\n📦 Total from XML: ${priceMap.size} SKU/EAN entries\n`);

  // ── 2. Load js/data.js and locate product blocks ─────────────────────────
  let src = fs.readFileSync(DATA_FILE, 'utf8');

  const idRe      = /\{id:\d+,/g;
  const positions = [];
  let m;
  while ((m = idRe.exec(src)) !== null) positions.push(m.index);

  let markedSale = 0, cleared = 0, initialized = 0;

  // ── 3. Process in reverse (preserves string offsets) ─────────────────────
  for (let i = positions.length - 1; i >= 0; i--) {
    const start = positions[i];
    const end   = i + 1 < positions.length ? positions[i + 1] : src.length;
    const block = src.slice(start, end);

    const skuM = block.match(/\bsku:'([^']+)'/);
    const eanM = block.match(/\bean:'(\d{8,14})'/);

    let xmlPrice = null;
    let key      = null;
    if (skuM && priceMap.has(skuM[1]))          { xmlPrice = priceMap.get(skuM[1]);          key = skuM[1]; }
    else if (eanM && priceMap.has('EAN:'+eanM[1])) { xmlPrice = priceMap.get('EAN:'+eanM[1]); key = 'EAN:'+eanM[1]; }
    if (xmlPrice === null) continue;

    // ── Init baseline on first encounter, then fall through to compare ───
    if (!history[key]) {
      const oldM   = block.match(/\bold:(\d[\d.]*)/);
      const priceM = block.match(/\bprice:(\d[\d.]*)/);
      history[key] = {
        baseline: oldM ? parseFloat(oldM[1]) : (priceM ? parseFloat(priceM[1]) : xmlPrice),
        date: today,
      };
      initialized++;
      // fall through — compare xmlPrice against the just-set baseline
    }

    const { baseline } = history[key];
    const dropPct = Math.round((1 - xmlPrice / baseline) * 100);

    if (dropPct >= MIN_DROP_PCT) {
      // ── Price dropped — mark as sale ──────────────────────────────────
      const oldVal = Math.round(baseline * 100) / 100;
      const newBlock = block
        .replace(/\bprice:\d[\d.]*/, `price:${xmlPrice}`)
        .replace(/\bold:(null|\d[\d.]*)/, `old:${oldVal}`)
        .replace(/\bpct:(null|\d+)/, `pct:${dropPct}`)
        .replace(/\bbadge:(null|'[^']*')/, `badge:'sale'`);
      if (newBlock !== block) {
        src = src.slice(0, start) + newBlock + src.slice(end);
        markedSale++;
        const nameM = block.match(/\bname:'([^']+)'/);
        console.log(`  🔥 SALE: ${nameM ? nameM[1].slice(0,40) : key}  ${baseline} → ${xmlPrice} BGN (-${dropPct}%)`);
      }
    } else if (xmlPrice > baseline * 1.01) {
      // ── Price rose (>1% buffer) — update baseline, clear discount ────
      history[key] = { baseline: xmlPrice, date: today };
      const hasDiscount = /\bold:\d[\d.]*/.test(block);
      if (hasDiscount) {
        const newBlock = block
          .replace(/\bprice:\d[\d.]*/, `price:${xmlPrice}`)
          .replace(/\bold:\d[\d.]*/, 'old:null')
          .replace(/\bpct:\d+/, 'pct:null')
          .replace(/\bbadge:'sale'/, "badge:null");
        if (newBlock !== block) {
          src = src.slice(0, start) + newBlock + src.slice(end);
          cleared++;
          const nameM = block.match(/\bname:'([^']+)'/);
          console.log(`  ↑ Cleared: ${nameM ? nameM[1].slice(0,40) : key}  new baseline ${xmlPrice} BGN`);
        }
      }
    }
    // Else: price unchanged or minor fluctuation — no action
  }

  // ── 4. Persist ────────────────────────────────────────────────────────────
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  fs.writeFileSync(DATA_FILE, src);

  console.log(`\n✅ Initialized: ${initialized} | Sale: ${markedSale} | Cleared: ${cleared}`);

  if (markedSale + cleared === 0) {
    console.log('No price changes — skipping rebuild.');
    process.exit(0);
  }
  console.log('\n🔨 Run: node build.js');
}

main().catch(e => { console.error(e); process.exit(1); });
