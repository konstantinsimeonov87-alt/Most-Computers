'use strict';
/**
 * update-images.js — попълва липсващи снимки в js/data.js от Most BG XML gallery
 *
 * Правила:
 *  - Взима САМО <pictureUrl> от вътрешността на <gallery> секцията
 *  - Игнорира <promo><pictureUrl> и <promoGroup>
 *  - Пропуска всяка URL, която съдържа PL_ (промо банери)
 *  - Не презаписва продукти, които вече имат img (само img:null)
 *
 * Употреба:
 *   node scripts/update-images.js            ← само img:null продукти
 *   node scripts/update-images.js --all      ← всички продукти (презапис)
 *   node scripts/update-images.js --dry-run  ← само показва, не записва
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const DATA_FILE  = path.join(__dirname, '../js/data.js');
const FORCE_ALL  = process.argv.includes('--all');
const DRY_RUN    = process.argv.includes('--dry-run');

const CATEGORIES = [
  { id: 1,  name: 'HDD/SSD' },
  { id: 2,  name: 'Motherboards' },
  { id: 3,  name: 'CPU' },
  { id: 4,  name: 'RAM' },
  { id: 8,  name: 'Monitors' },
  { id: 9,  name: 'Cases/PSU' },
  { id: 10, name: 'Keyboards' },
  { id: 11, name: 'Mice' },
  { id: 12, name: 'Printers' },
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

function isPromoUrl(url) {
  return !url ||
    url.includes('/PL_') ||
    url.includes('PL_4') ||
    url.includes('promotionGroup') ||
    url.toLowerCase().includes('promo') ||
    url.includes('/img/ProductInfo/');
}

/**
 * Builds a map: SKU/EAN → first valid gallery image URL
 * Only extracts <pictureUrl> from INSIDE <gallery>…</gallery>
 */
function parseImageMap(xml) {
  const map = new Map();
  const productRe = /<product[\s\S]*?<\/product>/g;
  let m;
  while ((m = productRe.exec(xml)) !== null) {
    const block = m[0];

    const skuM   = block.match(/<PartNumber>(.*?)<\/PartNumber>/i);
    const eanM   = block.match(/<EAN>(\d{8,14})<\/EAN>/i);
    if (!skuM && !eanM) continue;

    const sku = skuM ? skuM[1].trim() : null;
    const ean = eanM ? eanM[1].trim() : null;

    // Extract ONLY the <gallery> section — ignore everything outside it
    const galleryM = block.match(/<gallery>([\s\S]*?)<\/gallery>/i);
    if (!galleryM) continue;

    const gallerySection = galleryM[1];
    const urlRe = /<pictureUrl>(.*?)<\/pictureUrl>/gi;
    let uM;
    let firstGoodUrl = null;
    while ((uM = urlRe.exec(gallerySection)) !== null) {
      const url = uM[1].trim();
      if (!isPromoUrl(url)) { firstGoodUrl = url; break; }
    }
    if (!firstGoodUrl) continue;

    if (sku)              map.set(sku, firstGoodUrl);
    if (ean)              map.set('EAN:' + ean, firstGoodUrl);
  }
  return map;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('🖼  update-images.js — Most BG gallery image sync');
  console.log(`📅 ${new Date().toISOString()}`);
  if (FORCE_ALL) console.log('⚡ Mode: --all (overwrite existing images)');
  if (DRY_RUN)  console.log('🔍 Mode: --dry-run (no writes)');

  // Build combined SKU/EAN → image map from all categories
  const imageMap = new Map();
  for (const cat of CATEGORIES) {
    try {
      process.stdout.write(`  Fetching cat ${cat.id} (${cat.name})... `);
      const xml = await fetchXml(cat.id);
      const catMap = parseImageMap(xml);
      catMap.forEach((v, k) => imageMap.set(k, v));
      console.log(`${catMap.size} with images`);
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
    await sleep(300);
  }

  console.log(`\n📦 Total SKUs with gallery images: ${imageMap.size}`);

  let src = fs.readFileSync(DATA_FILE, 'utf8');

  // Parse product block positions
  const idRe = /\{id:(\d+),/g;
  const positions = [];
  let m;
  while ((m = idRe.exec(src)) !== null) positions.push({ id: m[1], start: m.index });

  let updated = 0, skipped = 0, notFound = 0;

  // Process in reverse so positions stay valid
  for (let i = positions.length - 1; i >= 0; i--) {
    const start = positions[i].start;
    const end   = i + 1 < positions.length ? positions[i + 1].start : src.length;
    const block = src.slice(start, end);

    // Skip if already has a good image (unless --all)
    const hasImg = /\bimg:'[^']+'/.test(block);
    if (hasImg && !FORCE_ALL) { skipped++; continue; }

    // Skip if existing image is already a valid (non-promo) URL
    if (hasImg && FORCE_ALL) {
      const existingUrl = (block.match(/\bimg:'([^']+)'/) || [])[1];
      if (existingUrl && !isPromoUrl(existingUrl)) { skipped++; continue; }
    }

    // Find image via SKU or EAN
    const skuM = block.match(/\bsku:'([^']+)'/);
    const eanM = block.match(/\bean:'(\d{8,14})'/);
    let newUrl = null;
    if (skuM && imageMap.has(skuM[1]))           newUrl = imageMap.get(skuM[1]);
    else if (eanM && imageMap.has('EAN:' + eanM[1])) newUrl = imageMap.get('EAN:' + eanM[1]);

    if (!newUrl) { notFound++; continue; }

    // Replace img:null or img:'old-promo-url'
    const oldImgStr = hasImg ? block.match(/\bimg:'[^']+'/) [0] : 'img:null';
    const newImgStr = `img:'${newUrl}'`;
    if (oldImgStr === newImgStr) { skipped++; continue; }

    const newBlock = block.replace(oldImgStr, newImgStr);
    if (!DRY_RUN) src = src.slice(0, start) + newBlock + src.slice(end);

    const name = (block.match(/\bname:'([^']+)'/) || [])[1] || positions[i].id;
    console.log(`  ✅ ${name} → ${newUrl.split('/').pop()}`);
    updated++;
  }

  console.log(`\n✅ Updated: ${updated} products`);
  console.log(`⏭  Skipped (already had image): ${skipped}`);
  console.log(`⚪ Not found in XML: ${notFound}`);

  if (!DRY_RUN && updated > 0) {
    fs.writeFileSync(DATA_FILE, src);
    console.log('\n📝 js/data.js updated. Run: node build.js');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
