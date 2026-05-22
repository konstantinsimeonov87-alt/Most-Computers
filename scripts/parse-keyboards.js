// Script: parse Keyboards XML → JS data snippet
// Usage: node scripts/parse-keyboards.js
const fs = require('fs');
const path = require('path');

const EUR_RATE = 1.95583;
const START_ID = 1230;

const brandMap = {
  'A4': 'A4Tech', 'LOGITECH': 'Logitech', 'MSI': 'MSI', 'ASUS': 'ASUS',
  'LENOVO': 'Lenovo', 'ACER': 'Acer', 'ADATA': 'ADATA', 'OMEGA': 'Omega',
  'XPG': 'XPG',
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

    const mfrMatch = block.match(/<manufacturer[^>]*>([^<]+)<\/manufacturer>/);
    const mfrRaw = mfrMatch ? mfrMatch[1] : '';
    const brand = brandMap[mfrRaw] || mfrRaw || 'Generic';

    const rawEan = extractBetween(block, '<EAN>', '</EAN>');
    const sku = extractBetween(block, '<PartNumber>', '</PartNumber>');
    const imgMatch = block.match(/<pictureUrl>([^<]+)<\/pictureUrl>/);
    const img = imgMatch ? imgMatch[1] : null;
    const stock = status.includes('наличност');
    const priceBGN = Math.round(price * EUR_RATE);

    const attrs = getAttrs(block);
    const nameUp = name.toUpperCase();

    // ── Specs ────────────────────────────────────────────────────────────────
    const specs = {};

    // Connection type
    const isBT = attrs.includes('BT');
    const isWL = attrs.includes('WL') || attrs.includes('WL_BT');
    const isWired = attrs.includes('WIRED') || (!isBT && !isWL);
    if (isBT && isWL) specs['Връзка'] = 'Безжична + Bluetooth';
    else if (isBT) specs['Връзка'] = 'Bluetooth';
    else if (isWL) specs['Връзка'] = 'Безжична';
    else specs['Връзка'] = 'Кабелна';

    // Layout
    if (attrs.includes('BG')) specs['Подредба'] = 'BG (Кирилица)';
    else if (/\bUS\b/.test(nameUp) || /US$/.test(nameUp.trim())) specs['Подредба'] = 'US';

    // Switch type
    if (attrs.includes('MECHANICAL') || /MECH/i.test(name)) specs['Тип'] = 'Механична';
    else specs['Тип'] = 'Мембранна';

    // Backlight
    if (attrs.includes('RGB') || /RGB/i.test(name)) specs['Подсветка'] = 'RGB';
    else if (attrs.includes('KBLIGHT') || /BACKLIT|LIGHT/i.test(name)) specs['Подсветка'] = 'Да';

    // Combo
    if (attrs.includes('COMBO')) specs['Комплект'] = '+ мишка';

    // Emoji
    const isGaming = /GAMING|GAME|GK|VIGOR|BLOODY|XPG|RGB/i.test(name) || attrs.includes('RGB') || attrs.includes('MECHANICAL');
    const emoji = isGaming ? '🎮' : '⌨';

    const displayName = name.replace(/\s+/g, ' ').trim();
    const connStr = specs['Връзка'] || '';
    const typeStr = specs['Тип'] || '';
    const desc = `${brand} ${displayName} — клавиатура${typeStr ? ' ' + typeStr.toLowerCase() : ''}${connStr ? ', ' + connStr.toLowerCase() : ''}${specs['Подредба'] ? ', ' + specs['Подредба'] : ''}.`;

    products.push({ xmlId, name: displayName, brand, sku, ean: eanClean(rawEan), img, stock, price: priceBGN, specs, desc, emoji });
  }
  return products;
}

const xml = fs.readFileSync(path.join(__dirname, '../tmp_keyboards.xml'), 'utf8');
const parsed = parseProducts(xml);
console.log(`Total: ${parsed.length}`);

const byBrand = {};
parsed.forEach(p => byBrand[p.brand] = (byBrand[p.brand]||0)+1);
console.log('By brand:', byBrand);

const byConn = {};
parsed.forEach(p => byConn[p.specs['Връзка']||'?'] = (byConn[p.specs['Връзка']||'?']||0)+1);
console.log('By connection:', byConn);

let js = `  // ── Keyboard Import — 2026-04-21 — categoryId=10 (Most BG) — ${parsed.length} клавиатури ──\n`;
parsed.forEach((p, i) => {
  const id = START_ID + i;
  const specsStr = JSON.stringify(p.specs).replace(/"/g, "'");
  const imgStr = p.img ? `'${p.img}'` : 'null';
  const eanStr = p.ean ? `'${p.ean}'` : 'null';
  const nameEsc = p.name.replace(/'/g, "\\'");
  const skuEsc = (p.sku||'').replace(/'/g, "\\'");
  const descEsc = p.desc.replace(/'/g, "\\'").substring(0, 150);
  js += `  {id:${id},name:'${nameEsc}',brand:'${p.brand}',cat:'peripherals',subcat:'keyboard',\n`;
  js += `   price:${p.price},old:null,pct:null,badge:null,emoji:'${p.emoji}',sku:'${skuEsc}',ean:${eanStr},\n`;
  js += `   specs:${specsStr},\n`;
  js += `   rating:4.2,rv:0,reviews:[],\n`;
  js += `   desc:'${descEsc}',\n`;
  js += `   img:${imgStr},stock:${p.stock}},\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../tmp_keyboards_snippet.js'), js);
console.log('Written to tmp_keyboards_snippet.js');
parsed.slice(0,3).forEach((p,i) => console.log(START_ID+i, p.emoji, p.name.substring(0,50), p.price+'лв', p.stock?'✅':'📦'));
parsed.slice(-3).forEach((p,i) => console.log(START_ID+parsed.length-3+i, p.emoji, p.name.substring(0,50), p.price+'лв'));
