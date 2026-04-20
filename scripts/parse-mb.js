// Script: parse motherboards XML → JS data snippet
// Usage: node scripts/parse-mb.js
const fs = require('fs');
const path = require('path');

const EUR_RATE = 1.95583;
const START_ID = 50; // existing products: 1-49

const brandMap = {
  'ASROCK': 'ASRock',
  'GIGABYTE': 'Gigabyte',
  'MSI': 'MSI',
  'ASUS': 'ASUS',
  'SAPPHIRE': 'Sapphire',
};

function ean(raw) {
  if (!raw) return null;
  const clean = raw.trim().replace(/\s/g, '');
  return /^\d{8,14}$/.test(clean) ? clean : null;
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
    const block = m[2];
    const xmlId = m[1];
    const name = extractBetween(block, '<name>', '</name>');
    const status = extractBetween(block, '<product_status>', '</product_status>');
    const priceStr = extractBetween(block, '<price>', '</price>');
    const price = parseFloat(priceStr);
    if (!price || price === 0) continue; // skip zero-price
    const mfr = extractBetween(block, '<manufacturer id="', '</manufacturer>').replace(/^[^>]*>/, '');
    // manufacturer field: <manufacturer id="6">ASROCK</manufacturer> — get text after >
    const mfrMatch = block.match(/<manufacturer[^>]*>([^<]+)<\/manufacturer>/);
    const brand = brandMap[mfrMatch ? mfrMatch[1] : ''] || (mfrMatch ? mfrMatch[1] : 'Unknown');
    const rawEan = extractBetween(block, '<EAN>', '</EAN>');
    const sku = extractBetween(block, '<PartNumber>', '</PartNumber>');
    // first image
    const imgMatch = block.match(/<pictureUrl>([^<]+)<\/pictureUrl>/);
    const img = imgMatch ? imgMatch[1] : null;
    const stock = status.includes('наличност');
    const priceBGN = Math.round(price * EUR_RATE);

    // specs from searchStringParts — use name attr for clean key mapping
    const specs = {};
    const descRe = /<description name="([^"]+)">([^<]+)<\/description>/g;
    const vidOuts = [];
    let dm;
    while ((dm = descRe.exec(block)) !== null) {
      const attr = dm[1]; // e.g. "4xDDR5", "HDMI", "mATX"
      const text = dm[2];
      const valMatch = text.match(/ - (.+)$/);
      const val = valMatch ? valMatch[1].trim() : attr;
      const a = attr.toUpperCase();
      if (/^(ASROCK|GIGABYTE|MSI|ASUS|SAPPHIRE)$/.test(a)) continue;
      if (/^(\d+)x?(DDR[45])/.test(attr)) { const rm = attr.match(/^(\d+)x?(DDR[45])/i); specs['Памет'] = rm[1]+'× '+rm[2]; }
      else if (/x?DDR[45]/.test(attr)) { specs['Памет'] = val; }
      else if (/^\d*xSATA/.test(attr)) { specs['SATA3'] = attr.replace(/x/i,'×'); }
      else if (/^RAID$/.test(a)) { specs['RAID'] = 'Да'; }
      else if (/^(HDMI|DVI|VGA|DP|DISPLAYPORT)/.test(a)) { vidOuts.push(attr.toUpperCase()); }
      else if (/^\d*xM\.?2/.test(attr) || /^\d*XM2/.test(a)) { specs['M.2'] = val.replace(/M\.2 slot/gi,'').replace(/броя/gi,'×').trim(); }
      else if (/xPCIEx16/i.test(attr)) { specs['PCIe x16'] = attr.replace(/x(?=PCIEx)/i,'×'); }
      else if (/xPCIEx[14]/i.test(attr)) { specs['PCIe x1'] = (specs['PCIe x1']||'') + attr; }
      else if (/2\.5G/i.test(attr)) { specs['LAN'] = '2.5 Gigabit'; }
      else if (/GLAN/i.test(attr)) { if (!specs['LAN']) specs['LAN'] = 'Gigabit'; }
      else if (/WIFI6E|WF6E/i.test(attr)) { specs['WiFi'] = 'WiFi 6E'; }
      else if (/WIFI7|WF7/i.test(attr)) { specs['WiFi'] = 'WiFi 7'; }
      else if (/WIFI6|WF6/i.test(attr)) { specs['WiFi'] = 'WiFi 6'; }
      else if (/WIFI|WF/i.test(attr)) { specs['WiFi'] = 'WiFi'; }
      else if (/^BT|BLUETOOTH/i.test(attr)) { specs['Bluetooth'] = val; }
      else if (/USB3\.2/i.test(attr)) { specs['USB'] = 'USB 3.2 Gen2'; }
      else if (/^(MATX|MICRO.?ATX)/i.test(attr)) { specs['Форм фактор'] = 'Micro-ATX'; }
      else if (/^MITX|MINI.?ITX/i.test(attr)) { specs['Форм фактор'] = 'Mini-ITX'; }
      else if (/^ATX$/i.test(attr)) { specs['Форм фактор'] = 'ATX'; }
      else if (/^(B[0-9]+|A[0-9]+|X[0-9]+|Z[0-9]+|H[0-9]+)$/i.test(attr)) { specs['Чипсет'] = 'AMD/Intel ' + attr.toUpperCase(); }
      else if (/^(AM4|AM5|LGA\d+)$/i.test(attr)) { specs['Сокет'] = attr.toUpperCase(); }
    }
    if (vidOuts.length) specs['Изходи'] = vidOuts.join(' / ');
    if (!specs['Форм фактор']) {
      if (/ITX/i.test(name)) specs['Форм фактор'] = 'Mini-ITX';
      else if (/\bM\b/.test(name) || /MICRO/i.test(name)) specs['Форм фактор'] = 'Micro-ATX';
      else specs['Форм фактор'] = 'ATX';
    }

    // detect socket from name
    let socket = 'AM4';
    if (/AM5/i.test(name)) socket = 'AM5';
    else if (/LGA1851/i.test(name) || /\/1851/i.test(name)) socket = 'LGA1851';
    else if (/LGA1700/i.test(name) || /\/1700/i.test(name) || /D4.*1700/i.test(name)) socket = 'LGA1700';
    else if (/LGA1200/i.test(name) || /\/1200/i.test(name)) socket = 'LGA1200';
    else if (/(X670|B650|B840|B850|X870|A620)/i.test(name)) socket = 'AM5';
    else if (/(H610|B760|Z790|H810|B860|Z890|H510|B660)/i.test(name)) socket = 'LGA1700';
    if (!specs['Socket'] && !specs['Сокет']) specs['Сокет'] = socket;

    // desc
    const desc = `${brand} ${name.replace(/\s*\/\s*AM[45]|\s*\/\s*LGA\d+/i, '').trim()} — дънна платка ${socket}. Цена: ${priceBGN} лв.`;

    products.push({ xmlId, name, brand, sku, ean: ean(rawEan), img, stock, price: priceBGN, specs });
  }
  return products;
}

const xml = fs.readFileSync(path.join(__dirname, '../tmp_mb.xml'), 'utf8');
const parsed = parseProducts(xml);

// Skip already-imported (first 15 ASRock AM4) — those have xmlIds in imported list
const alreadyImported = new Set([
  '65781','63011','64687','65102','64691','64690','64692',
  '64689','64688','65101','65364','65100','66406','63113','69795'
]);
const newProducts = parsed.filter(p => !alreadyImported.has(p.xmlId));

console.log(`Total parsed: ${parsed.length}, skipping ${alreadyImported.size} already imported, new: ${newProducts.length}`);

// Generate JS
let js = '  // ── Motherboard Import (full) — 2026-04-20 — categoryId=2 — 350 дънни платки ──\n';
newProducts.forEach((p, i) => {
  const id = START_ID + i;
  const specsStr = JSON.stringify(p.specs).replace(/"/g, "'").replace(/'/g, "'").replace(/'/g, "'");
  const imgStr = p.img ? `'${p.img}'` : 'null';
  const eanStr = p.ean ? `'${p.ean}'` : 'null';
  const nameEsc = p.name.replace(/'/g, "\\'");
  const descEsc = `${p.brand} дънна платка ${p.name.replace(/'/g, "\\'").substring(0, 50)}`;
  js += `  {id:${id},name:'${nameEsc}',brand:'${p.brand}',cat:'components',subcat:'motherboard',\n`;
  js += `   price:${p.price},old:null,pct:null,badge:null,emoji:'⚙️',sku:'${p.sku.replace(/'/g,"\\'")}',ean:${eanStr},\n`;
  js += `   specs:${specsStr},\n`;
  js += `   rating:4.4,rv:0,reviews:[],\n`;
  js += `   desc:'${descEsc}.',\n`;
  js += `   img:${imgStr},stock:${p.stock}},\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../tmp_mb_snippet.js'), js);
console.log('Written to tmp_mb_snippet.js');
console.log('First 3 IDs:', newProducts.slice(0,3).map((p,i)=>({id:START_ID+i,name:p.name,price:p.price})));
console.log('Last 3 IDs:', newProducts.slice(-3).map((p,i)=>({id:START_ID+newProducts.length-3+i,name:p.name,price:p.price})));
