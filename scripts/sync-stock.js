'use strict';
/**
 * sync-stock.js — обновява наличностите в js/data.js от Most BG XML feed-ове
 * Пуска се от GitHub Actions на всеки 2 часа.
 * Може да се пусне и ръчно: node scripts/sync-stock.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../js/data.js');

// Всички Most BG XML категории, от които сме импортирали продукти
const CATEGORIES = [
  { id: 1,  name: 'HDD/SSD' },
  { id: 2,  name: 'Motherboards' },
  { id: 3,  name: 'CPU' },
  { id: 4,  name: 'RAM' },
  { id: 8,  name: 'Monitors' },
  { id: 9,  name: 'Cases/PSU' },
  { id: 10, name: 'Keyboards' },
  { id: 11, name: 'Mice' },
  { id: 21, name: 'Laptops' },
  { id: 22, name: 'Multimedia' },
  { id: 32, name: 'Phones' },
  { id: 34, name: 'Desktops' },
];

// Статуси, които означават "налично"
const IN_STOCK_STATUSES = ['в наличност', 'в наличност.', 'available', 'in stock'];

function fetchXml(categoryId) {
  return new Promise((resolve, reject) => {
    const url = `https://portal.mostbg.com/api/product/xml/categoryId=${categoryId}?currency=EUR`;
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout cat ${categoryId}`)); });
  });
}

function parseStockMap(xml) {
  // Returns Map<sku, boolean> — true = in stock
  const map = new Map();
  const productRe = /<product[\s\S]*?<\/product>/g;
  let m;
  while ((m = productRe.exec(xml)) !== null) {
    const block = m[0];
    const skuMatch = block.match(/<PartNumber>(.*?)<\/PartNumber>/i);
    const statusMatch = block.match(/<product_status>(.*?)<\/product_status>/i);
    const eanMatch = block.match(/<EAN>(.*?)<\/EAN>/i);
    if (!skuMatch) continue;
    const sku = skuMatch[1].trim();
    const status = (statusMatch ? statusMatch[1] : '').trim().toLowerCase();
    const inStock = IN_STOCK_STATUSES.some(s => status.includes(s));
    if (sku) map.set(sku, inStock);
    // Also index by EAN if it looks like a real EAN (8-14 digits)
    if (eanMatch) {
      const ean = eanMatch[1].trim();
      if (/^\d{8,14}$/.test(ean)) map.set('EAN:' + ean, inStock);
    }
  }
  return map;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('🔄 sync-stock.js — Most BG XML stock sync');
  console.log(`📅 ${new Date().toISOString()}`);

  // Build a combined SKU→stock map from all categories
  const stockMap = new Map();
  for (const cat of CATEGORIES) {
    try {
      process.stdout.write(`  Fetching cat ${cat.id} (${cat.name})... `);
      const xml = await fetchXml(cat.id);
      const catMap = parseStockMap(xml);
      catMap.forEach((v, k) => stockMap.set(k, v));
      console.log(`${catMap.size} products`);
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
    await sleep(400);
  }

  console.log(`\n📦 Total SKUs from XML: ${stockMap.size}`);

  // Load current data.js
  let src = fs.readFileSync(DATA_FILE, 'utf8');

  // For each product in data.js, find its SKU/EAN and update stock
  let updated = 0, notFound = 0;

  // Split into product blocks by id
  const idPositions = [];
  const idRe = /\{id:(\d+),/g;
  let m;
  while ((m = idRe.exec(src)) !== null) {
    idPositions.push({ id: m[1], start: m.index });
  }

  // Process in reverse order so positions don't shift
  for (let i = idPositions.length - 1; i >= 0; i--) {
    const start = idPositions[i].start;
    const end = i + 1 < idPositions.length ? idPositions[i + 1].start : src.length;
    const block = src.slice(start, end);

    const skuMatch = block.match(/\bsku:'([^']+)'/);
    const eanMatch = block.match(/\bean:'(\d{8,14})'/);

    let inStock = null;
    if (skuMatch && stockMap.has(skuMatch[1])) {
      inStock = stockMap.get(skuMatch[1]);
    } else if (eanMatch && stockMap.has('EAN:' + eanMatch[1])) {
      inStock = stockMap.get('EAN:' + eanMatch[1]);
    }

    if (inStock === null) { notFound++; continue; }

    const newStockStr = inStock ? 'stock:true' : 'stock:false';
    const oldStockMatch = block.match(/\bstock:(true|false)\b/);
    if (!oldStockMatch) continue;

    const oldStockStr = 'stock:' + oldStockMatch[1];
    if (oldStockStr === newStockStr) continue; // no change

    // Replace only within this product block
    const blockNew = block.replace(/\bstock:(true|false)\b/, newStockStr);
    src = src.slice(0, start) + blockNew + src.slice(end);
    updated++;
  }

  fs.writeFileSync(DATA_FILE, src);
  console.log(`\n✅ Updated: ${updated} products`);
  console.log(`⚪ Not in XML (kept as-is): ${notFound} products`);

  if (updated === 0) {
    console.log('No changes — skip rebuild.');
    process.exit(0);
  }

  console.log('\n🔨 Run: node build.js');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
