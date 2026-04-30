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
  { id: 15, name: 'Network' },
  { id:  7, name: 'GPU' },
  { id: 14, name: 'Webcams' },
  { id: 19, name: 'Flash/USB' },
  { id: 33, name: 'Cooling' },
  { id: 16, name: 'UPS' },
  { id: 17, name: 'Scanners' },
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
 * Builds a map: SKU/EAN/name → first valid gallery image URL
 * Only extracts <pictureUrl> from INSIDE <gallery>…</gallery>
 * Also indexes by product name for fallback matching (handles regional SKU variants)
 */
function parseImageMap(xml) {
  const map = new Map();
  const productRe = /<product[\s\S]*?<\/product>/g;
  let m;
  while ((m = productRe.exec(xml)) !== null) {
    const block = m[0];

    const skuM  = block.match(/<PartNumber>(.*?)<\/PartNumber>/i);
    const eanM  = block.match(/<EAN>(\d{8,14})<\/EAN>/i);
    const nameM = block.match(/<name>(.*?)<\/name>/i);

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

    const sku = skuM ? skuM[1].trim() : null;
    const ean = eanM ? eanM[1].trim() : null;

    if (sku)  map.set(sku, firstGoodUrl);
    if (ean)  map.set('EAN:' + ean, firstGoodUrl);
    // SKU-prefix fallback: same model family, sibling variant (first-wins, 6-char prefix)
    if (sku && sku.length >= 6) {
      const pfx = sku.substring(0, 6);
      if (!map.has('SKUPFX:' + pfx)) map.set('SKUPFX:' + pfx, firstGoodUrl);
    }
    if (nameM) {
      const fullName = nameM[1].trim().toLowerCase();
      map.set('NAME:' + fullName, firstGoodUrl);
      // Index by base model name — handles two common XML name formats:
      //   "LENOVO LOQ 15IRX10 /83JE019ABM"  → strip "/CODE"
      //   "LENOVO LOQ 15IRX10  83JE00AABM"  → strip trailing " CODE"
      let baseName = fullName.replace(/\s*\/\s*\S+$/, '').trim();
      if (baseName === fullName) {
        // No slash — try stripping a trailing alphanumeric code (≥5 chars)
        baseName = fullName.replace(/\s+[a-z0-9\-]{5,}$/i, '').trim();
      }
      if (baseName && baseName !== fullName) map.set('BASE:' + baseName, firstGoodUrl);

      // Cross-variant fallback: strip all trailing dash-codes, then trailing
      // space-separated variant code, to find the bare model family.
      // e.g. "ASUS X1607QA-MB006W" → "asus x1607qa"
      //      "ACER EXTENSA EX215-23" → "acer extensa ex215"
      //      "MSI THIN 15 B12UCX-1467XBG" → "msi thin 15"
      let crossKey = fullName;
      // Strip trailing /CODE or / CODE
      crossKey = crossKey.replace(/\s*\/\s*\S+$/, '').trim();
      // Repeatedly strip trailing -code segments
      let prev;
      do {
        prev = crossKey;
        crossKey = crossKey.replace(/-[a-z0-9]{2,}$/gi, '').trim();
      } while (crossKey !== prev && crossKey.length > 0);
      // Strip trailing space-separated variant token when ≥4 tokens remain
      // (avoids stripping the model series name itself)
      const xTokens = crossKey.split(/\s+/);
      if (xTokens.length >= 4) {
        const last = xTokens[xTokens.length - 1];
        if (/^[a-z]{1,3}[0-9][a-z0-9]*$/i.test(last)) {
          crossKey = xTokens.slice(0, -1).join(' ').trim();
        }
      }
      // Only set CROSS: if it meaningfully differs from full/base name and is ≥2 words
      if (crossKey && crossKey !== fullName && crossKey !== baseName && crossKey.includes(' ')) {
        if (!map.has('CROSS:' + crossKey)) map.set('CROSS:' + crossKey, firstGoodUrl);
      }
    }
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
    // NOTE: --all truly overwrites ALL products from gallery — promo images can be
    // stored as imageFileData URLs that isPromoUrl() cannot detect by name alone.
    const hasImg = /\bimg:'[^']+'/.test(block);
    if (hasImg && !FORCE_ALL) { skipped++; continue; }

    // Find image via SKU, EAN, or product name (fallback for regional SKU variants)
    const skuM  = block.match(/\bsku:'([^']+)'/);
    const eanM  = block.match(/\bean:'(\d{8,14})'/);
    const nameM = block.match(/\bname:'([^']+)'/);
    let newUrl = null;
    if (skuM && imageMap.has(skuM[1]))                newUrl = imageMap.get(skuM[1]);
    if (!newUrl && eanM && imageMap.has('EAN:' + eanM[1])) newUrl = imageMap.get('EAN:' + eanM[1]);
    // SKU-prefix sibling: same model family, different variant
    if (!newUrl && skuM && skuM[1].length >= 6) {
      const pfx = skuM[1].substring(0, 6);
      if (imageMap.has('SKUPFX:' + pfx)) newUrl = imageMap.get('SKUPFX:' + pfx);
    }
    if (!newUrl && nameM) {
      const n = nameM[1].trim().toLowerCase();
      if (imageMap.has('NAME:' + n)) newUrl = imageMap.get('NAME:' + n);
      if (!newUrl) {
        const base = n.replace(/\s*\/\s*\S+$/, '').trim();
        if (base && imageMap.has('BASE:' + base)) newUrl = imageMap.get('BASE:' + base);
      }
      if (!newUrl) {
        // Cross-variant: same model family, different variant code
        let crossKey = n.replace(/\s*\/\s*\S+$/, '').trim();
        let prev;
        do { prev = crossKey; crossKey = crossKey.replace(/-[a-z0-9]{2,}$/gi, '').trim(); }
        while (crossKey !== prev && crossKey.length > 0);
        const xTok = crossKey.split(/\s+/);
        if (xTok.length >= 4) {
          const last = xTok[xTok.length - 1];
          if (/^[a-z]{1,3}[0-9][a-z0-9]*$/i.test(last)) crossKey = xTok.slice(0, -1).join(' ');
        }
        if (crossKey && crossKey !== n && crossKey.includes(' ') && imageMap.has('CROSS:' + crossKey)) {
          newUrl = imageMap.get('CROSS:' + crossKey);
        }
      }
    }

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
