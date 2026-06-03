'use strict';
/**
 * fetch-promotions.js — изтегля промо XML от portal.mostbg.com
 * и генерира js/promotions-data.js с var promoProducts = [...]
 *
 * Usage: node scripts/fetch-promotions.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const XML_URL   = 'https://portal.mostbg.com/api/product/xml/promotions?currency=EUR';
const OUT_FILE  = path.join(__dirname, '../js/promotions-data.js');

// Portal category → site cat/subcat mapping
const CAT_MAP = {
  'GSM':        { cat: 'phones',      subFn: gsmSubcat },
  'NOTEBOOK':   { cat: 'laptops',     subFn: notebookSubcat },
  'PRINTER':    { cat: 'printers',    subFn: printerSubcat },
  'CARTRIDGE':  { cat: 'consumables', subFn: () => 'cartridge' },
  'MONITOR':    { cat: 'monitors',    subFn: monitorSubcat },
  'VIDEO CARD': { cat: 'components',  subFn: () => 'gpu' },
  'MAIN BOARD': { cat: 'components',  subFn: () => 'motherboard' },
  'CPU':        { cat: 'components',  subFn: () => 'cpu' },
  'RAM':        { cat: 'components',  subFn: () => 'ram' },
  'HDD':        { cat: 'storage',     subFn: () => 'hdd' },
  'FLASH':      { cat: 'storage',     subFn: () => 'usb' },
  'LAN':        { cat: 'network',     subFn: networkSubcat },
  'CASE':       { cat: 'components',  subFn: caseSubcat },
  'FAN':        { cat: 'components',  subFn: () => 'cooling' },
  'MOUSE':      { cat: 'peripherals', subFn: () => 'mouse' },
  'M - MEDIA':  { cat: 'monitors',    subFn: () => 'projector' },
  'UPS':        { cat: 'ups',         subFn: () => 'ups' },
  'COMPUTER':   { cat: 'desktops',    subFn: () => 'mini_pc' },
  'HP':         { cat: 'consumables', subFn: () => 'cartridge' },
  'HP_':        { cat: 'consumables', subFn: () => 'cartridge' },
};

function gsmSubcat(name) {
  return /5G/i.test(name) ? 'smartphone_5g' : 'smartphone';
}

function notebookSubcat(name) {
  if (/PRESTIGE|CUBI|THIN.*AI|EVO/i.test(name)) return 'business_laptop';
  return 'gaming_laptop';
}

function printerSubcat(name) {
  if (/\bG\d{3,4}\b/i.test(name)) return 'inkjet_tank';
  return 'inkjet';
}

function monitorSubcat(name) {
  if (/TV\s*\d|QLED|UHD.*TV|STREEMING/i.test(name)) return 'tv';
  return 'monitor';
}

function networkSubcat(name) {
  if (/4G|5G|LTE|HOTSPOT|MOBILE/i.test(name)) return 'mobile_router';
  if (/ROUTER|ROUT/i.test(name)) return 'router';
  if (/EXTEND|RANGE/i.test(name)) return 'extender';
  return 'adapter';
}

function caseSubcat(name) {
  if (/\bPSU\b|MAG A\d|MAG M\d|MPG A\d|MEG A\d|KYBER|PYLON|CORE REACTOR|WHISPER|XPG.*\d{3}[BG]/i.test(name)) return 'psu';
  return 'case';
}

function fetchXml() {
  return new Promise((resolve, reject) => {
    const req = https.get(XML_URL, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function escJs(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function parseProducts(xml) {
  const products = [];
  const re = /<product[\s\S]*?<\/product>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[0];

    const idM     = block.match(/<product[^>]*\sid="(\d+)"/i) || block.match(/id="(\d+)"/i);
    const nameM   = block.match(/<name>([\s\S]*?)<\/name>/i);
    const priceM  = block.match(/<price>([\d.]+)<\/price>/i);
    const catM    = block.match(/<category[^>]*>([\s\S]*?)<\/category>/i);
    const mfgM    = block.match(/<manufacturer[^>]*>([\s\S]*?)<\/manufacturer>/i);
    const skuM    = block.match(/<PartNumber>([\s\S]*?)<\/PartNumber>/i);
    const eanM    = block.match(/<EAN>([\s\S]*?)<\/EAN>/i);
    const wtyM    = block.match(/<warrantyInMonths>(\d+)<\/warrantyInMonths>/i);
    const statusM = block.match(/<product_status>([\s\S]*?)<\/product_status>/i);
    const galleryM = block.match(/<gallery>([\s\S]*?)<\/gallery>/i);
    const imgM    = galleryM ? galleryM[1].match(/<pictureUrl>([\s\S]*?)<\/pictureUrl>/i) : null;

    if (!idM || !nameM || !priceM) continue;

    const id     = parseInt(idM[1], 10);
    const name   = nameM[1].trim();
    const price  = parseFloat(priceM[1]);
    const catRaw = (catM ? catM[1].trim() : '').toUpperCase();
    const brand  = mfgM ? mfgM[1].trim() : '';
    const sku    = skuM ? skuM[1].trim().split('/')[0].trim() : '';
    const ean    = eanM ? eanM[1].trim().replace(/\s.*/,'') : '';
    const wty    = wtyM ? parseInt(wtyM[1]) : 24;
    const status = statusM ? statusM[1].trim() : '';
    const img    = imgM ? imgM[1].trim() : '';

    // in-stock detection
    const inStock = !/обадете/i.test(status);

    const mapping = CAT_MAP[catRaw];
    if (!mapping) {
      console.warn(`  ⚠ Unknown category "${catRaw}" for product ${id} — ${name}`);
      continue;
    }

    const subcat = mapping.subFn(name);

    products.push({
      id, name, brand,
      cat: mapping.cat,
      subcat,
      price,
      sku,
      ean,
      warrantyMonths: wty,
      badge: 'promo',
      stock: inStock,
      img: img || null,
    });
  }
  return products;
}

async function main() {
  console.log('📡 Fetching promotions XML…');
  const xml = await fetchXml();
  console.log(`   Downloaded ${xml.length} bytes`);

  const products = parseProducts(xml);
  console.log(`   Parsed ${products.length} products`);

  // Stats
  const cats   = {};
  const brands = {};
  for (const p of products) {
    cats[p.cat]     = (cats[p.cat]   || 0) + 1;
    brands[p.brand] = (brands[p.brand] || 0) + 1;
  }
  console.log('   Categories:', JSON.stringify(cats));
  console.log('   Brands:', JSON.stringify(brands));

  // Serialize
  const lines = products.map(p => {
    const parts = [
      `id:${p.id}`,
      `name:'${escJs(p.name)}'`,
      `brand:'${escJs(p.brand)}'`,
      `cat:'${p.cat}'`,
      `subcat:'${p.subcat}'`,
      `price:${p.price}`,
    ];
    if (p.sku)              parts.push(`sku:'${escJs(p.sku)}'`);
    if (p.ean)              parts.push(`ean:'${escJs(p.ean)}'`);
    if (p.warrantyMonths)   parts.push(`warranty:${p.warrantyMonths}`);
    if (p.img)              parts.push(`img:'${escJs(p.img)}'`);
    parts.push(`badge:'promo'`);
    parts.push(`stock:${p.stock}`);
    return `  {${parts.join(',')}}`;
  });

  const output = [
    `// promotions-data.js — auto-generated by scripts/fetch-promotions.js`,
    `// Last updated: ${new Date().toISOString().slice(0,10)}`,
    `// ${products.length} products from portal.mostbg.com/api/product/xml/promotions`,
    `var promoProducts = [`,
    lines.join(',\n'),
    `];`,
  ].join('\n');

  fs.writeFileSync(OUT_FILE, output, 'utf8');
  console.log(`✅ Written ${OUT_FILE} (${Math.round(output.length/1024)}KB)`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
