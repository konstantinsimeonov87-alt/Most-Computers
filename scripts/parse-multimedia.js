// Script: parse Multimedia XML → JS data snippet
// Usage: node scripts/parse-multimedia.js
const fs = require('fs');
const path = require('path');

const EUR_RATE = 1.95583;
const START_ID = 1448;

const brandMap = {
  'LOGITECH': 'Logitech', 'A4': 'A4Tech', 'ACER': 'Acer', 'REALME': 'Realme',
  'FRACTAL DESIGN': 'Fractal Design', 'CREATIVE': 'Creative', 'LG': 'LG',
  'ASUS': 'ASUS', 'LENOVO': 'Lenovo', 'NOKIA': 'Nokia', 'DISNEY': 'Disney',
  'NZXT': 'NZXT', 'MELICONI': 'Meliconi', 'ADATA': 'ADATA',
  'CIRKUITPLANET': 'Cirkuit Planet', 'AOPEN': 'Aopen', 'IFROGZ': 'iFragz',
  'MSI': 'MSI',
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

// ── Product type classification ───────────────────────────────────────────────
function classify(attrs, name) {
  const n = name.toUpperCase();

  // Skip: projector accessories, old pouches, warranty, smart home, mic adapters
  if (attrs.includes('ACCESSORIES')) return null;
  if (attrs.includes('PROJECTION_SCREEN') || attrs.includes('PROJECTION_TRIPOD_SCREEN')) return null;
  if (attrs.includes('PROJECTOR_LAMP')) return null;
  if (attrs.includes('WIFI_RECEIVER')) return null;
  if (/WARR|WARRANTY|CARRY.IN/i.test(n)) return null;
  if (/POUCH|SILICON SKIN|SCREEN PROTEC|LEATHER POUCH/i.test(n)) return null;
  if (/SMART SCALE|SMART BULB|LED WI-FI/i.test(n)) return null;
  if (/CEILING MOUNT|CEILING.MOUNT/i.test(n)) return null;

  // Projectors
  if (attrs.includes('PROJECTOR') || /^PROJECTOR /i.test(n)) return { cat: 'accessories', subcat: 'projector' };

  // Audio — headsets, headphones, earphones, earbuds, speakers
  if (attrs.includes('HEADSET') || attrs.includes('EARPHONES') || attrs.includes('SPEAKERS')) return { cat: 'peripherals', subcat: 'headphones' };
  if (/HEADSET|HEADPHONE|HEARPHONE|EARPHONE|EAPHONE|EARBUDS|TWS|BUDS|SPEAKER|SP\//i.test(n)) return { cat: 'peripherals', subcat: 'headphones' };
  if ((attrs.includes('BLUETOOTH')||attrs.includes('BT')) && /EARPH|EAPH|EARBUDS|BUDS|HEADPH|SPEAKER/i.test(n)) return { cat: 'peripherals', subcat: 'headphones' };

  // Gaming chairs → accessories
  if (attrs.includes('CHAIR') || /GAMING CHAIR/i.test(n)) return { cat: 'accessories', subcat: 'chair' };

  // Controllers → accessories
  if (attrs.includes('CONTROLLER') || /CONTROLLER|CONTROLER/i.test(n)) return { cat: 'accessories', subcat: 'controller' };

  // BT audio receiver, presenter → accessories
  if (attrs.includes('PRESENTER')) return { cat: 'accessories', subcat: null };
  if (/BT AUDIO RECEIVER|AUDIO RECEIVER/i.test(n)) return { cat: 'accessories', subcat: null };

  // Streaming device (NZXT)
  if (/STREAMING/i.test(n)) return { cat: 'accessories', subcat: null };

  // Mic adapters (ASUS)
  if (/MIC ADAPT|NC MIC/i.test(n)) return { cat: 'accessories', subcat: null };

  // Wired earbuds
  if (/WIRED BUDS|WIRED.*EAR/i.test(n)) return { cat: 'peripherals', subcat: 'headphones' };

  // Remaining audio (BT speaker, etc.)
  if (attrs.includes('BT') || attrs.includes('BLUETOOTH')) {
    if (/SPEAKER/i.test(n)) return { cat: 'peripherals', subcat: 'headphones' };
  }

  return null; // unknown — skip
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
    const type = classify(attrs, name);
    if (!type) { console.log('SKIP:', name); continue; }

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
    const { cat, subcat } = type;

    if (subcat === 'headphones') {
      // Connection
      const isBT = attrs.includes('BT') || attrs.includes('BLUETOOTH') || /BT\b|BLUETOOTH|TWS|WIRELESS/i.test(name);
      const isWired = attrs.includes('WIRED') || attrs.includes('USB') || attrs.includes('USB-A') || attrs.includes('3.5MM');
      if (isBT && isWired) specs['Връзка'] = 'Кабелна + BT';
      else if (isBT)       specs['Връзка'] = 'Bluetooth';
      else                 specs['Връзка'] = 'Кабелна';

      if (attrs.includes('MIC') || /MIC\b|HEADSET/i.test(name)) specs['Микрофон'] = 'Да';
      if (attrs.includes('GAMING') || /GAMING/i.test(name)) specs['Gaming'] = 'Да';
      if (attrs.includes('SPEAKERS') || /SPEAKER/i.test(name)) specs['Тип'] = 'Тонколони';
      else if (attrs.includes('EARPHONES') || /EARPH|EARBUDS|TWS|BUDS/i.test(name)) specs['Тип'] = 'Тапи';
      else specs['Тип'] = 'Слушалки';

      // Wattage for speakers
      const wattAttr = attrs.find(a => /^\d+W$/.test(a));
      if (wattAttr && specs['Тип'] === 'Тонколони') specs['Мощност'] = wattAttr;
    }

    if (subcat === 'projector') {
      // Brightness
      const lumAttr = attrs.find(a => /^\d+LM$/.test(a));
      if (lumAttr) specs['Яркост'] = lumAttr.replace('LM', ' lm');
      // Resolution
      if (attrs.includes('UHD_4K') || /4K/i.test(name)) specs['Резолюция'] = '4K UHD';
      else if (attrs.includes('FHD') || /FHD|1080P/i.test(name)) specs['Резолюция'] = 'Full HD';
      else if (attrs.includes('WUXGA') || /WUXGA/i.test(name)) specs['Резолюция'] = 'WUXGA';
      else if (attrs.includes('WXGA') || /WXGA/i.test(name)) specs['Резолюция'] = 'WXGA';
      else if (attrs.includes('XGA') || /\bXGA\b/i.test(name)) specs['Резолюция'] = 'XGA';
      else if (attrs.includes('SVGA') || /SVGA/i.test(name)) specs['Резолюция'] = 'SVGA';
      // Type
      if (attrs.includes('LASER')) specs['Тип'] = 'Лазерен';
      else if (attrs.includes('LED')) specs['Тип'] = 'LED';
      else if (attrs.includes('DLP')) specs['Тип'] = 'DLP';
      // Throw
      if (attrs.includes('SHORT_THROW')) specs['Хвърляне'] = 'Кратко';
      // Connectivity
      if (attrs.includes('WIFI')) specs['WiFi'] = 'Да';
    }

    if (subcat === 'chair') {
      specs['Тип'] = 'Gaming стол';
      if (/MESH/i.test(name)) specs['Материал'] = 'Mesh';
      else if (/FABRIC/i.test(name)) specs['Материал'] = 'Плат';
    }

    if (subcat === 'controller') {
      const isWL = /WL\b|WIRELESS/i.test(name) || attrs.includes('WIRELESS');
      specs['Връзка'] = isWL ? 'Безжичен' : 'Кабелен';
      specs['Тип'] = 'Геймпад';
    }

    // Emoji
    const emoji = subcat === 'projector' ? '🎥'
      : subcat === 'chair' ? '🪑'
      : subcat === 'controller' ? '🎮'
      : (specs['Тип'] === 'Тонколони' ? '🔊' : (specs['Тип'] === 'Тапи' ? '🎵' : '🎧'));

    const displayName = name.replace(/\s+/g, ' ').trim();
    const desc = `${brand} ${displayName}${specs['Резолюция'] ? ' — проектор ' + specs['Резолюция'] : (specs['Тип'] ? ' — ' + specs['Тип'].toLowerCase() : '')}.`;

    const subcatStr = subcat || 'multimedia';
    products.push({ xmlId, name: displayName, brand, sku, ean: eanClean(rawEan), img, stock, price: priceBGN, specs, desc, emoji, cat, subcat: subcatStr });
  }
  return products;
}

const xml = fs.readFileSync(path.join(__dirname, '../tmp_multimedia.xml'), 'utf8');
const parsed = parseProducts(xml);

console.log(`\nTotal: ${parsed.length}`);
const byType = {};
parsed.forEach(p => { const k = p.cat+'/'+p.subcat; byType[k]=(byType[k]||0)+1; });
console.log('By type:', byType);
const byBrand = {};
parsed.forEach(p => byBrand[p.brand]=(byBrand[p.brand]||0)+1);
console.log('By brand:', JSON.stringify(Object.entries(byBrand).sort((a,b)=>b[1]-a[1]).reduce((o,[k,v])=>({...o,[k]:v}),{})));

let js = `  // ── Multimedia Import — 2026-04-21 — categoryId=22 (Most BG) — ${parsed.length} продукта ──\n`;
parsed.forEach((p, i) => {
  const id = START_ID + i;
  const specsStr = JSON.stringify(p.specs).replace(/"/g, "'");
  const imgStr = p.img ? `'${p.img}'` : 'null';
  const eanStr = p.ean ? `'${p.ean}'` : 'null';
  const nameEsc = p.name.replace(/'/g, "\\'");
  const skuEsc = (p.sku||'').replace(/'/g, "\\'");
  const descEsc = p.desc.replace(/'/g, "\\'").substring(0, 150);
  js += `  {id:${id},name:'${nameEsc}',brand:'${p.brand}',cat:'${p.cat}',subcat:'${p.subcat}',\n`;
  js += `   price:${p.price},old:null,pct:null,badge:null,emoji:'${p.emoji}',sku:'${skuEsc}',ean:${eanStr},\n`;
  js += `   specs:${specsStr},\n`;
  js += `   rating:4.2,rv:0,reviews:[],\n`;
  js += `   desc:'${descEsc}',\n`;
  js += `   img:${imgStr},stock:${p.stock}},\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../tmp_multimedia_snippet.js'), js);
console.log('Written to tmp_multimedia_snippet.js');
parsed.slice(0,3).forEach((p,i) => console.log(START_ID+i, p.emoji, p.subcat, p.name.substring(0,45), p.price+'лв', p.stock?'✅':'📦'));
parsed.slice(-3).forEach((p,i) => console.log(START_ID+parsed.length-3+i, p.emoji, p.subcat, p.name.substring(0,45), p.price+'лв'));
