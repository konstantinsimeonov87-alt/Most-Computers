'use strict';
/**
 * update-images.js — попълва снимки в js/data.js от Most BG XML gallery
 *
 * Правила:
 *  - Взима ВСИЧКИ <pictureUrl> от <gallery> и ги записва в gallery:[...]
 *  - img:'...' се попълва с първата снимка (за обратна съвместимост)
 *  - Игнорира <promo><pictureUrl> и <promoGroup>
 *  - Пропуска URL-и с PL_ (промо банери)
 *
 * Употреба:
 *   node scripts/update-images.js               ← само img:null продукти
 *   node scripts/update-images.js --all         ← всички продукти (презапис img + gallery)
 *   node scripts/update-images.js --gallery-all ← добавя/обновява gallery[] за ВСИЧКИ (img не се пипа)
 *   node scripts/update-images.js --dry-run     ← само показва, не записва
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const DATA_FILE    = path.join(__dirname, '../js/data.js');
const FORCE_ALL    = process.argv.includes('--all');
const GALLERY_ALL  = process.argv.includes('--gallery-all');
const DRY_RUN      = process.argv.includes('--dry-run');

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
 * Builds a map: SKU/EAN/name → string[] of all valid gallery image URLs
 * Only extracts <pictureUrl> from INSIDE <gallery>…</gallery>
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
    const allGoodUrls = [];
    while ((uM = urlRe.exec(gallerySection)) !== null) {
      const url = uM[1].trim();
      if (!isPromoUrl(url)) allGoodUrls.push(url);
    }
    if (!allGoodUrls.length) continue;

    const sku = skuM ? skuM[1].trim() : null;
    const ean = eanM ? eanM[1].trim() : null;

    if (sku)  map.set(sku, allGoodUrls);
    if (ean)  map.set('EAN:' + ean, allGoodUrls);
    // SKU-prefix fallback: same model family, sibling variant (first-wins, 6-char prefix)
    if (sku && sku.length >= 6) {
      const pfx = sku.substring(0, 6);
      if (!map.has('SKUPFX:' + pfx)) map.set('SKUPFX:' + pfx, allGoodUrls);
    }
    if (nameM) {
      const fullName = nameM[1].trim().toLowerCase();
      map.set('NAME:' + fullName, allGoodUrls);
      let baseName = fullName.replace(/\s*\/\s*\S+$/, '').trim();
      if (baseName === fullName) {
        baseName = fullName.replace(/\s+[a-z0-9\-]{5,}$/i, '').trim();
      }
      if (baseName && baseName !== fullName) map.set('BASE:' + baseName, allGoodUrls);

      let crossKey = fullName;
      crossKey = crossKey.replace(/\s*\/\s*\S+$/, '').trim();
      let prev;
      do {
        prev = crossKey;
        crossKey = crossKey.replace(/-[a-z0-9]{2,}$/gi, '').trim();
      } while (crossKey !== prev && crossKey.length > 0);
      const xTokens = crossKey.split(/\s+/);
      if (xTokens.length >= 4) {
        const last = xTokens[xTokens.length - 1];
        if (/^[a-z]{1,3}[0-9][a-z0-9]*$/i.test(last)) {
          crossKey = xTokens.slice(0, -1).join(' ').trim();
        }
      }
      if (crossKey && crossKey !== fullName && crossKey !== baseName && crossKey.includes(' ')) {
        if (!map.has('CROSS:' + crossKey)) map.set('CROSS:' + crossKey, allGoodUrls);
      }
    }
  }
  return map;
}

/** Serialise a gallery array into data.js inline format */
function serializeGallery(urls) {
  return `gallery:[${urls.map(u => `'${u}'`).join(',')}]`;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('🖼  update-images.js — Most BG gallery image sync');
  console.log(`📅 ${new Date().toISOString()}`);
  if (FORCE_ALL)   console.log('⚡ Mode: --all (overwrite img + gallery)');
  if (GALLERY_ALL) console.log('🖼  Mode: --gallery-all (only add/update gallery[], img unchanged)');
  if (DRY_RUN)     console.log('🔍 Mode: --dry-run (no writes)');

  // Build combined SKU/EAN → []urls map from all categories
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

    const hasImg     = /\bimg:'[^']+'/.test(block);
    const hasGallery = /\bgallery:\[/.test(block);

    if (GALLERY_ALL) {
      // --gallery-all: only update gallery[], never touch img
      // Use exact matches only (SKU or EAN) to avoid wrong images for siblings
      const skuM = block.match(/\bsku:'([^']+)'/);
      const eanM = block.match(/\bean:'(\d{8,14})'/);
      let newUrls = null;
      if (skuM && imageMap.has(skuM[1]))              newUrls = imageMap.get(skuM[1]);
      if (!newUrls && eanM && imageMap.has('EAN:' + eanM[1])) newUrls = imageMap.get('EAN:' + eanM[1]);
      if (!newUrls) { notFound++; continue; }

      const newGalleryStr = serializeGallery(newUrls);
      // Check if gallery already identical
      const existingGalleryM = block.match(/\bgallery:\[([^\]]*)\]/);
      if (existingGalleryM && existingGalleryM[0] === newGalleryStr) { skipped++; continue; }

      let newBlock = block;
      if (hasGallery) {
        // Replace existing gallery
        newBlock = newBlock.replace(/\bgallery:\[[^\]]*\]/, newGalleryStr);
      } else if (hasImg) {
        // Insert gallery right after img:'...'
        newBlock = newBlock.replace(/(\bimg:'[^']+')/, `$1,${newGalleryStr}`);
      } else {
        notFound++; continue;
      }

      if (!DRY_RUN) src = src.slice(0, start) + newBlock + src.slice(end);
      const name = (block.match(/\bname:'([^']+)'/) || [])[1] || positions[i].id;
      console.log(`  🖼  ${name} → ${newUrls.length} снимк${newUrls.length === 1 ? 'a' : 'и'}`);
      updated++;
      continue;
    }

    // Normal mode: only process img:null (or all with --all)
    if (hasImg && !FORCE_ALL) { skipped++; continue; }

    // Find images via SKU, EAN, or product name
    const skuM  = block.match(/\bsku:'([^']+)'/);
    const eanM  = block.match(/\bean:'(\d{8,14})'/);
    const nameM = block.match(/\bname:'([^']+)'/);
    let newUrls = null;
    let isExactMatch = false;

    if (skuM && imageMap.has(skuM[1]))                { newUrls = imageMap.get(skuM[1]); isExactMatch = true; }
    if (!newUrls && eanM && imageMap.has('EAN:' + eanM[1])) { newUrls = imageMap.get('EAN:' + eanM[1]); isExactMatch = true; }
    if (!newUrls && skuM && skuM[1].length >= 6) {
      const pfx = skuM[1].substring(0, 6);
      if (imageMap.has('SKUPFX:' + pfx)) newUrls = imageMap.get('SKUPFX:' + pfx);
    }
    if (!newUrls && nameM) {
      const n = nameM[1].trim().toLowerCase();
      if (imageMap.has('NAME:' + n))                   { newUrls = imageMap.get('NAME:' + n); isExactMatch = true; }
      if (!newUrls) {
        const base = n.replace(/\s*\/\s*\S+$/, '').trim();
        if (base && imageMap.has('BASE:' + base))       newUrls = imageMap.get('BASE:' + base);
      }
      if (!newUrls) {
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
          newUrls = imageMap.get('CROSS:' + crossKey);
        }
      }
    }

    if (!newUrls) { notFound++; continue; }

    const firstUrl = newUrls[0];

    // Build new img string
    const oldImgStr  = hasImg ? block.match(/\bimg:'[^']+'/) [0] : 'img:null';
    const newImgStr  = `img:'${firstUrl}'`;
    if (oldImgStr === newImgStr && hasGallery) { skipped++; continue; }

    // Replace img field
    let newBlock = block.replace(oldImgStr, newImgStr);

    // Add/update gallery only for exact matches (not siblings/cross-variants, to avoid mixing images)
    if (isExactMatch && newUrls.length >= 1) {
      const newGalleryStr = serializeGallery(newUrls);
      if (hasGallery) {
        newBlock = newBlock.replace(/\bgallery:\[[^\]]*\]/, newGalleryStr);
      } else {
        newBlock = newBlock.replace(newImgStr, `${newImgStr},${newGalleryStr}`);
      }
    }

    if (!DRY_RUN) src = src.slice(0, start) + newBlock + src.slice(end);

    const name = (block.match(/\bname:'([^']+)'/) || [])[1] || positions[i].id;
    const galleryInfo = (isExactMatch && newUrls.length > 1) ? ` [${newUrls.length} снимки]` : '';
    console.log(`  ✅ ${name} → ${firstUrl.split('/').pop()}${galleryInfo}`);
    updated++;
  }

  console.log(`\n✅ Updated: ${updated} products`);
  console.log(`⏭  Skipped: ${skipped}`);
  console.log(`⚪ Not found in XML: ${notFound}`);

  if (!DRY_RUN && updated > 0) {
    fs.writeFileSync(DATA_FILE, src);
    console.log('\n📝 js/data.js updated. Run: node build.js');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
