// Script: parse Mice XML → JS data snippet
// Usage: node scripts/parse-mice.js
const fs = require('fs');
const path = require('path');

const EUR_RATE = 1.95583;
const START_ID = 1305; // after 75 keyboards (1230-1304)

const brandMap = {
  'A4': 'A4Tech', 'LOGITECH': 'Logitech', 'COOLERMASTER': 'Cooler Master',
  'DISNEY': 'Disney', 'OMEGA': 'Omega', 'MSI': 'MSI', 'ACER': 'Acer',
  'ASUS': 'ASUS', 'SWEEX': 'Sweex', 'FNATIC': 'Fnatic',
  'GENIUS': 'Genius', 'MICROSOFT': 'Microsoft', 'LENOVO': 'Lenovo',
  'CIRKUITPLANET': 'Cirkuit Planet',
};

function eanClean(raw) {
  if (!raw) return null;
  const c = raw.trim().replace(/\s/g, '');
  return /^\d{8,14}$/.test(c) ? c : null;
}

function extractBetween(str, open, close) {
  const s = str.indexOf(open);
  if (s < 0) return '';
  const e = str.indexOf(close, s + open.length);
  return e < 0 ? '' : str.substring(s + open.length, e).trim();
}

function getProp(block, name) {
  const re = new RegExp(`<property name="${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\s*"[^>]*>([^<]*)`, 'i');
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function getAttrs(block) {
  return [...block.matchAll(/<description name="([^"]+)">/g)].map(m => m[1]);
}

function parseProducts(xml) {
  const products = [];
  const re = /<product id="(\d+)">([\s\S]*?)<\/product>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const [, xmlId, block] = m;
    const name = extractBetween(block, '<name>', '</name>');
    const status = extractBetween(block, '<product_status>', '</product_status>');
    const price = parseFloat(extractBetween(block, '<price>', '</price>'));
    if (!price) continue;

    const attrs = getAttrs(block);
    const nameUp = name.toUpperCase();

    // Skip pure mouse pads by name pattern
    if (/MOUSEPAD|MOUSE[\s\-+]?PAD|MUSE[\s\-+]?PAD/i.test(name)) {
      console.log('SKIP (mousepad):', name); continue;
    }
    // Skip pad-only if attrs has PAD/PAD_GAMING and no mouse sensor/connection
    const hasMouseAttr = attrs.some(a => ['WIRED','WL','BT','WL_BT','OPTICAL','LASER','GAMING'].includes(a));
    const isPadOnly = attrs.some(a => ['PAD','PAD_GAMING'].includes(a)) && !hasMouseAttr;
    if (isPadOnly) { console.log('SKIP (pad-only):', name); continue; }

    const mfrMatch = block.match(/<manufacturer[^>]*>([^<]+)<\/manufacturer>/);
    const mfrRaw = mfrMatch ? mfrMatch[1] : '';
    const brand = brandMap[mfrRaw] || mfrRaw || 'Generic';

    const rawEan = extractBetween(block, '<EAN>', '</EAN>');
    const sku = extractBetween(block, '<PartNumber>', '</PartNumber>');
    const imgMatch = block.match(/<pictureUrl>([^<]+)<\/pictureUrl>/);
    const img = imgMatch ? imgMatch[1] : null;
    const stock = status.includes('наличност');
    const priceBGN = Math.round(price * EUR_RATE);

    // ── Specs ────────────────────────────────────────────────────────────────
    const specs = {};

    // Connection — attrs first, then name fallback
    const isBT  = attrs.includes('BT') || attrs.includes('WL_BT') || /\bBT\b|BLUETOOTH|BT\b/i.test(nameUp);
    const isWL  = attrs.includes('WL') || attrs.includes('WL_BT') || /\bWL\b|WIRELESS/i.test(nameUp);
    if (isBT && isWL) specs['Връзка'] = 'Безжична + BT';
    else if (isBT)   specs['Връзка'] = 'Bluetooth';
    else if (isWL)   specs['Връзка'] = 'Безжична';
    else             specs['Връзка'] = 'Кабелна';

    // Sensor
    if (attrs.includes('LASER')) specs['Сензор'] = 'Лазерен';
    else                          specs['Сензор'] = 'Оптичен';

    // DPI from property
    const dpi = getProp(block, 'Movement resolution');
    if (dpi && /dpi/i.test(dpi)) specs['DPI'] = dpi.replace(/\s+/g,' ').substring(0,30);

    // Gaming
    if (attrs.includes('GAMING') || /GAMING|GAME|BLOODY|FNATIC|PREDATOR/i.test(name))
      specs['Gaming'] = 'Да';

    // Bundle with pad
    if (attrs.includes('PAD') || attrs.includes('PAD_GAMING')) specs['Комплект'] = '+ подложка';
    if (attrs.includes('BUNDLE')) specs['Комплект'] = 'Комплект';

    // Emoji
    const isGaming = !!specs['Gaming'];
    const isWireless = isWL || isBT;
    const emoji = isGaming ? '🎮' : (isWireless ? '🖱' : '🖱');

    const displayName = name.replace(/\s+/g, ' ').trim();
    const connStr = specs['Връзка'] || '';
    const desc = `${brand} ${displayName} — мишка${connStr ? ', ' + connStr.toLowerCase() : ''}${specs['Gaming'] ? ', Gaming' : ''}${specs['DPI'] ? ', ' + specs['DPI'] : ''}.`;

    products.push({ xmlId, name: displayName, brand, sku, ean: eanClean(rawEan), img, stock, price: priceBGN, specs, desc, emoji });
  }
  return products;
}

const xml = fs.readFileSync(path.join(__dirname, '../tmp_mice.xml'), 'utf8');
const parsed = parseProducts(xml);
console.log(`\nTotal: ${parsed.length}`);

const byBrand = {};
parsed.forEach(p => byBrand[p.brand] = (byBrand[p.brand]||0)+1);
console.log('By brand:', JSON.stringify(Object.entries(byBrand).sort((a,b)=>b[1]-a[1]).reduce((o,[k,v])=>({...o,[k]:v}),{})));

const byConn = {};
parsed.forEach(p => byConn[p.specs['Връзка']||'?'] = (byConn[p.specs['Връзка']||'?']||0)+1);
console.log('By connection:', byConn);

let js = `  // ── Mouse Import — 2026-04-21 — categoryId=11 (Most BG) — ${parsed.length} мишки ──\n`;
parsed.forEach((p, i) => {
  const id = START_ID + i;
  const specsStr = JSON.stringify(p.specs).replace(/"/g, "'");
  const imgStr = p.img ? `'${p.img}'` : 'null';
  const eanStr = p.ean ? `'${p.ean}'` : 'null';
  const nameEsc = p.name.replace(/'/g, "\\'");
  const skuEsc = (p.sku||'').replace(/'/g, "\\'");
  const descEsc = p.desc.replace(/'/g, "\\'").substring(0, 150);
  js += `  {id:${id},name:'${nameEsc}',brand:'${p.brand}',cat:'peripherals',subcat:'mouse',\n`;
  js += `   price:${p.price},old:null,pct:null,badge:null,emoji:'${p.emoji}',sku:'${skuEsc}',ean:${eanStr},\n`;
  js += `   specs:${specsStr},\n`;
  js += `   rating:4.2,rv:0,reviews:[],\n`;
  js += `   desc:'${descEsc}',\n`;
  js += `   img:${imgStr},stock:${p.stock}},\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../tmp_mice_snippet.js'), js);
console.log('Written to tmp_mice_snippet.js');
parsed.slice(0,3).forEach((p,i) => console.log(START_ID+i, p.emoji, p.name.substring(0,50), p.price+'лв', p.stock?'✅':'📦'));
parsed.slice(-3).forEach((p,i) => console.log(START_ID+parsed.length-3+i, p.emoji, p.name.substring(0,50), p.price+'лв'));
