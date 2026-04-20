// Script: parse RAM XML → JS data snippet
// Usage: node scripts/parse-ram.js
const fs = require('fs');
const path = require('path');

const EUR_RATE = 1.95583;
const START_ID = 581;

const brandMap = {
  'KINGSTON': 'Kingston', 'ADATA': 'ADATA', 'TEAM': 'TeamGroup',
  'KINGSPEC': 'KingSpec', 'DYNACARD': 'Dynacard', 'SAMSUNG': 'Samsung',
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
  const m = block.match(new RegExp(`<property name="${name}"[^>]*>([^<]*)<\\/property>`));
  return m ? m[1].trim() : '';
}

function normCapacity(raw) {
  if (!raw) return '';
  // Normalize: "16GB", "16 GB", "16G", "16G (1x16GB)", "32GB (2x16GB)" → "16 GB" / "32 GB (Kit)"
  const kitM = raw.match(/\((\d+)x/i);
  const numM = raw.match(/^(\d+)/);
  if (!numM) return raw;
  const num = numM[1];
  const isKit = kitM ? ` (${kitM[1]}×)` : '';
  return `${num} GB${isKit}`;
}

function normSpeed(raw) {
  if (!raw) return '';
  const n = raw.toString().replace(/\s*MHz\s*/i, '').trim();
  return n ? `${n} MHz` : '';
}

function normType(raw) {
  if (!raw) return 'DDR4';
  const r = raw.toUpperCase();
  if (/DDR5/.test(r)) return 'DDR5';
  if (/DDR4/.test(r)) return 'DDR4';
  if (/DDR3L/.test(r)) return 'DDR3L';
  if (/DDR3/.test(r)) return 'DDR3';
  return raw;
}

function isSODIMM(block, name) {
  const ff = getProp(block, 'Form factor').toUpperCase();
  return /SO.?DIMM|SODIMM/i.test(ff) || /SO.?DIMM|SODIMM/i.test(name);
}

function getBrand(mfrRaw, name, sku) {
  if (brandMap[mfrRaw]) return brandMap[mfrRaw];
  if (mfrRaw === 'OTHER' || mfrRaw === '_NONAME') {
    if (/CRUCIAL/i.test(name) || /^CT\d/i.test(sku || '')) return 'Crucial';
    if (/CORSAIR/i.test(name)) return 'Corsair';
    if (/G\.?SKILL/i.test(name)) return 'G.Skill';
    if (/PATRIOT/i.test(name)) return 'Patriot';
    if (/HYNIX/i.test(name)) return 'Hynix';
    if (/MICRON/i.test(name)) return 'Micron';
    return 'Generic';
  }
  return mfrRaw;
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
    const mfrRaw = mfrMatch ? mfrMatch[1] : 'OTHER';
    const rawEan = extractBetween(block, '<EAN>', '</EAN>');
    const sku = extractBetween(block, '<PartNumber>', '</PartNumber>');
    const imgMatch = block.match(/<pictureUrl>([^<]+)<\/pictureUrl>/);
    const img = imgMatch ? imgMatch[1] : null;
    const stock = status.includes('наличност');
    const priceBGN = Math.round(price * EUR_RATE);

    const brand = getBrand(mfrRaw, name, sku);
    const isSo = isSODIMM(block, name);

    // Extract specs from properties
    const rawType = getProp(block, 'Type');
    const rawCap = getProp(block, 'Capacity');
    const rawSpeed = getProp(block, 'Speed');
    const rawCas = getProp(block, 'CAS latency');
    const rawVolt = getProp(block, 'Voltage');

    // Also try searchStringParts for missing data
    let ssType = '', ssCap = '', ssSpeed = '';
    const dr = /<description name="([^"]+)">([^<]+)<\/description>/g;
    let dm;
    while ((dm = dr.exec(block)) !== null) {
      const attr = dm[1];
      if (/^\d+GB$/i.test(attr)) ssCap = attr.replace(/GB/i, ' GB');
      else if (/DDR[345]/i.test(attr) && !/(MHZ|DESKTOP|LAPTOP)/i.test(attr)) ssType = attr;
      else if (/^\d{3,5}MHZ$/i.test(attr)) ssSpeed = attr.replace(/MHZ/i, ' MHz');
    }

    const type = normType(rawType || ssType);
    const capacity = normCapacity(rawCap || ssCap);
    const speed = normSpeed(rawSpeed || ssSpeed);
    const formFactor = isSo ? 'SO-DIMM' : 'DIMM';

    const specs = {};
    specs['Тип'] = type;
    if (capacity) specs['Капацитет'] = capacity;
    if (speed) specs['Честота'] = speed;
    if (rawCas) specs['Латентност'] = rawCas.replace(/^CL/, 'CL');
    specs['Форм фактор'] = formFactor;
    if (rawVolt) specs['Напрежение'] = rawVolt;

    // Emoji: SO-DIMM = 💻, DDR5 = 🟣, DDR4 = 🟢, DDR3 = 🟡
    const emoji = isSo ? '💻' : (type.includes('5') ? '🟣' : (type.includes('3') ? '🟡' : '🟢'));

    // Clean display name
    const displayName = name.replace(/\s+/g, ' ').trim();

    // Description
    const desc = `${brand} ${displayName} — ${type} ${formFactor}${speed ? ' ' + speed : ''}${capacity ? ', ' + capacity : ''}${rawCas ? ', ' + rawCas : ''}.`;

    products.push({ xmlId, name: displayName, brand, sku, ean: eanClean(rawEan), img, stock, price: priceBGN, specs, desc, emoji });
  }
  return products;
}

const xml = fs.readFileSync(path.join(__dirname, '../tmp_ram.xml'), 'utf8');
const parsed = parseProducts(xml);

console.log(`Total parsed: ${parsed.length}`);

// Brand breakdown
const brands = {};
parsed.forEach(p => brands[p.brand] = (brands[p.brand]||0)+1);
console.log('Brands:', JSON.stringify(Object.entries(brands).sort((a,b)=>b[1]-a[1]).slice(0,10).reduce((o,[k,v])=>({...o,[k]:v}),{})));

// Type breakdown
const types = {};
parsed.forEach(p => types[p.specs['Тип']] = (types[p.specs['Тип']]||0)+1);
console.log('Types:', JSON.stringify(types));

// SO-DIMM count
const soCount = parsed.filter(p => p.specs['Форм фактор'] === 'SO-DIMM').length;
console.log('SO-DIMM:', soCount, '| DIMM:', parsed.length - soCount);

// Generate JS snippet
let js = `  // ── RAM Import — 2026-04-20 — categoryId=4 (Most BG) — ${parsed.length} памети ──\n`;
parsed.forEach((p, i) => {
  const id = START_ID + i;
  const specsStr = JSON.stringify(p.specs).replace(/"/g, "'");
  const imgStr = p.img ? `'${p.img}'` : 'null';
  const eanStr = p.ean ? `'${p.ean}'` : 'null';
  const nameEsc = p.name.replace(/'/g, "\\'");
  const skuEsc = (p.sku||'').replace(/'/g, "\\'");
  const descEsc = p.desc.replace(/'/g, "\\'").substring(0, 150);
  js += `  {id:${id},name:'${nameEsc}',brand:'${p.brand}',cat:'components',subcat:'ram',\n`;
  js += `   price:${p.price},old:null,pct:null,badge:null,emoji:'${p.emoji}',sku:'${skuEsc}',ean:${eanStr},\n`;
  js += `   specs:${specsStr},\n`;
  js += `   rating:4.4,rv:0,reviews:[],\n`;
  js += `   desc:'${descEsc}',\n`;
  js += `   img:${imgStr},stock:${p.stock}},\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../tmp_ram_snippet.js'), js);
console.log('Written to tmp_ram_snippet.js');
parsed.slice(0, 3).forEach((p, i) => console.log(START_ID+i, p.name, p.price+'лв', p.stock?'✅':'📦'));
parsed.slice(-3).forEach((p, i) => console.log(START_ID+parsed.length-3+i, p.name, p.price+'лв'));
