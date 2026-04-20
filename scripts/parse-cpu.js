// Script: parse CPU XML → JS data snippet
// Usage: node scripts/parse-cpu.js
const fs = require('fs');
const path = require('path');

const EUR_RATE = 1.95583;
const START_ID = 398; // existing products: 1-397

const brandMap = { 'INTEL': 'Intel', 'AMD': 'AMD', 'SM': 'Supermicro' };

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
    const brand = brandMap[mfrMatch ? mfrMatch[1] : ''] || (mfrMatch ? mfrMatch[1] : 'Unknown');
    const rawEan = extractBetween(block, '<EAN>', '</EAN>');
    const sku = extractBetween(block, '<PartNumber>', '</PartNumber>');
    const imgMatch = block.match(/<pictureUrl>([^<]+)<\/pictureUrl>/);
    const img = imgMatch ? imgMatch[1] : null;
    const stock = status.includes('наличност');
    const priceBGN = Math.round(price * EUR_RATE);

    // Extract specs from <properties>
    const specs = {};
    const propRe = /<property name="([^"]+)"[^>]*>([^<]*)<\/property>/g;
    let pm;
    while ((pm = propRe.exec(block)) !== null) {
      const key = pm[1].trim();
      const val = pm[2].trim();
      if (!val || key === 'Vendor_url' || key === 'Warranty') continue;
      // Shorten key names
      const keyMap = {
        'Socket': 'Сокет', 'Number of cores': 'Ядра', 'Threads': 'Нишки',
        'Frequency': 'Честота', 'Cache': 'Кеш', 'TDP': 'TDP',
        'Memory specification': 'Памет', 'Graphics': 'Интегрирана графика',
        'Boost Frequency': 'Boost честота', 'Base Frequency': 'Базова честота',
        'L3 Cache': 'L3 кеш', 'L2 Cache': 'L2 кеш', 'Series': 'Серия',
        'Architecture': 'Архитектура', 'Unlocked': 'Отключен',
      };
      const cleanKey = keyMap[key] || key;
      // Shorten long values
      let cleanVal = val
        .replace(/Processor Base Frequency:\s*/i, '')
        .replace(/Max Memory Size \(dependent on memory type\):/i, 'Макс:')
        .replace(/; Memory Types:/i, ' | Тип:')
        .replace(/; Max # of Memory Channels:/i, ' | Канали:')
        .replace(/; Max Memory Bandwidth:/i, ' | Честота:')
        .replace(/Intel® Smart Cache/i, 'Smart Cache')
        .replace(/Intel® /ig, '')
        .substring(0, 80);
      specs[cleanKey] = cleanVal;
    }

    // Fallback: parse searchStringParts if properties mostly empty
    if (Object.keys(specs).length < 3) {
      const descRe = /<description name="([^"]+)">([^<]+)<\/description>/g;
      let dm;
      while ((dm = descRe.exec(block)) !== null) {
        const attr = dm[1];
        const text = dm[2];
        const valM = text.match(/ - (.+)$/);
        const val = valM ? valM[1].trim() : '';
        if (!val) continue;
        if (/GHZ/i.test(attr)) specs['Честота'] = val;
        else if (/CORES/i.test(attr)) specs['Ядра'] = val;
        else if (/LGA|AM[45]|TR\d/i.test(attr)) specs['Сокет'] = val;
        else if (/TDP|[0-9]+W/.test(attr)) specs['TDP'] = val;
        else if (/CACHE/i.test(attr)) specs['Кеш'] = val;
      }
    }

    // Clean up the product name for display
    const displayName = name
      .replace(/\s+/g, ' ')
      .replace(/\s*\/BOX\s*/i, ' BOX')
      .replace(/\s*\/TRAY\s*/i, ' TRAY')
      .replace(/\s*\/MPK\s*/i, ' MPK')
      .replace(/\s*\/LGA\d+\s*/i, '')
      .replace(/\s*\/AM[45]\s*/i, '')
      .replace(/\s*\/1[0-9]{3}\s*/i, '')
      .replace(/\s+/g, ' ').trim();

    // Full product name with brand prefix
    const fullName = brand === 'Intel' || brand === 'AMD'
      ? displayName.startsWith(brand.toUpperCase()) ? displayName : `${brand.toUpperCase()} ${displayName}`
      : `${brand} ${displayName}`;

    // Description
    const socket = specs['Сокет'] || '';
    const cores = specs['Ядра'] || '';
    const freq = specs['Честота'] || '';
    const desc = `${brand} ${displayName}${socket ? ' — сокет ' + socket : ''}${cores ? ', ' + cores + ' ядра' : ''}${freq ? ', ' + freq : ''}.`;

    // Emoji
    const emoji = brand === 'AMD' ? '🔴' : '🔵';

    products.push({ xmlId, name: fullName, brand, sku, ean: eanClean(rawEan), img, stock, price: priceBGN, specs, desc, emoji });
  }
  return products;
}

const xml = fs.readFileSync(path.join(__dirname, '../tmp_cpu.xml'), 'utf8');
const parsed = parseProducts(xml);

console.log(`Total parsed: ${parsed.length}`);

// Generate JS snippet
let js = `  // ── CPU Import — 2026-04-20 — categoryId=3 (Most BG) — ${parsed.length} процесора ──\n`;
parsed.forEach((p, i) => {
  const id = START_ID + i;
  const specsStr = JSON.stringify(p.specs).replace(/"/g, "'");
  const imgStr = p.img ? `'${p.img}'` : 'null';
  const eanStr = p.ean ? `'${p.ean}'` : 'null';
  const nameEsc = p.name.replace(/'/g, "\\'");
  const skuEsc = p.sku.replace(/'/g, "\\'");
  const descEsc = p.desc.replace(/'/g, "\\'").substring(0, 120);
  js += `  {id:${id},name:'${nameEsc}',brand:'${p.brand}',cat:'components',subcat:'cpu',\n`;
  js += `   price:${p.price},old:null,pct:null,badge:null,emoji:'${p.emoji}',sku:'${skuEsc}',ean:${eanStr},\n`;
  js += `   specs:${specsStr},\n`;
  js += `   rating:4.5,rv:0,reviews:[],\n`;
  js += `   desc:'${descEsc}',\n`;
  js += `   img:${imgStr},stock:${p.stock}},\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../tmp_cpu_snippet.js'), js);
console.log('Written to tmp_cpu_snippet.js');

// Sample output
parsed.slice(0,3).forEach((p,i) => console.log(START_ID+i, p.name, p.price+'лв', p.stock?'✅':'📦'));
parsed.slice(-3).forEach((p,i) => console.log(START_ID+parsed.length-3+i, p.name, p.price+'лв'));
