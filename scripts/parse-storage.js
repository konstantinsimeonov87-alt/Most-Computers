// Script: parse Storage XML (HDD + SSD) → JS data snippet
// Usage: node scripts/parse-storage.js
const fs = require('fs');
const path = require('path');

const EUR_RATE = 1.95583;
const START_ID = 796;

const brandMap = {
  'SG': 'Seagate', 'KINGSPEC': 'KingSpec', 'KINGSTON': 'Kingston',
  'TEAM': 'TeamGroup', 'MSI': 'MSI', 'ADATA': 'ADATA',
  'DYNACARD': 'Dynacard', 'EMTEC': 'Emtec', 'TOSHIBA': 'Toshiba',
  'SM': 'Supermicro', 'OTHER': null,
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
  const re = new RegExp(`<property name="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>([^<]*)<\\/property>`, 'i');
  const m = block.match(re);
  // Also try with trailing space in name (some properties have "Interface ")
  if (!m) {
    const re2 = new RegExp(`<property name="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*"[^>]*>([^<]*)<\\/property>`, 'i');
    const m2 = block.match(re2);
    return m2 ? m2[1].trim() : '';
  }
  return m[1].trim();
}

function normCapacity(raw) {
  if (!raw) return '';
  // "1 TB" → "1 TB", "256GB" → "256 GB", "500GB" → "500 GB"
  const m = raw.match(/^(\d+(?:\.\d+)?)\s*(GB|TB)/i);
  if (!m) return raw.trim();
  return `${m[1]} ${m[2].toUpperCase()}`;
}

function detectSubcat(block, name, searchstring) {
  const n = name.toUpperCase();
  const ss = (searchstring || '').toUpperCase();
  const b = block.toUpperCase();

  // NVMe/M.2 PCIe → ssd
  if (/NVMe|M2_PCI|M\.2.*PCIE|PCIE.*M\.2|M2.*PCIE|PCIE.*M2/i.test(b)) return 'ssd';
  if (/M2\s*PCIE|M2\.PCIE|NX-\d+|SPATIUM|CARDEA/i.test(n)) return 'ssd';

  // SSD SATA → ssd
  if (/SSD/i.test(ss) || /SSD/i.test(n)) return 'ssd';
  if (/KINGSPEC P[34]-\d+/i.test(n)) return 'ssd'; // KingSpec P3/P4 are SATA SSDs

  // 2.5" HDDs (5400/7200 RPM in name)
  if (/5400|7200/i.test(n) && /SATA/i.test(n)) return 'hdd';
  if (/2\.5.*SATA.*\d{3,4}G/i.test(n) || /\d{3,4}G.*2\.5/i.test(n)) return 'hdd';

  // HDD: has RPM property or 3.5/HDD in searchstring
  if (/HDD/i.test(ss) || getProp(block, 'HDD rpm') || /RPM|3\.5.*INCH|3\.5``/i.test(b)) return 'hdd';

  return null; // unknown / skip
}

function detectInterface(block, name, searchstring) {
  const b = block + ' ' + name + ' ' + (searchstring || '');
  if (/M2_PCI-E_GEN4|PCIE.?4|PCIe.*Gen.*4|GEN4|NV5000|NV3500|NV2000|MP44|MP34|T-FORCE.*GEN4/i.test(b)) return 'NVMe PCIe Gen4';
  if (/M2_PCI-E_GEN3|PCIE.?3|PCIe.*Gen.*3|GEN3|NVMe|M2.*PCIE|PCIE.*M2|NX-\d+|SPATIUM M371/i.test(b)) return 'NVMe PCIe Gen3';
  if (/M\.2|M2\s*2280|M2\s*2242/i.test(b)) return 'NVMe PCIe Gen3'; // M.2 without gen = Gen3
  if (/SAS\s+\d+G|7\.2K SAS|SAS/i.test(b)) return 'SAS';
  if (/SATA3|SATA.*6Gb|SATA.*Rev\.3|SATA.*3|P[34]-\d+/i.test(b)) return 'SATA III'; // KingSpec P3/P4 = SATA III
  if (/SATA/i.test(b)) return 'SATA';
  return '';
}

function detectFormFactor(block, name, searchstring, subcat) {
  const b = block + ' ' + name + ' ' + (searchstring || '');
  if (/M\.2\s*2280|M2\s*2280|2280/i.test(b)) return 'M.2 2280';
  if (/M\.2\s*2242|2242/i.test(b)) return 'M.2 2242';
  if (/M\.2/i.test(b) && subcat === 'ssd') return 'M.2';
  if (/3\.5/i.test(b)) return '3.5"';
  if (/2\.5/i.test(b)) return '2.5"';
  return subcat === 'hdd' ? '3.5"' : '';
}

function getBrand(mfrRaw, name) {
  if (brandMap[mfrRaw] !== undefined) {
    if (brandMap[mfrRaw]) return brandMap[mfrRaw];
    // OTHER — detect from name
    if (/SEAGATE/i.test(name)) return 'Seagate';
    if (/WD|WESTERN DIGITAL/i.test(name)) return 'WD';
    if (/TOSHIBA/i.test(name)) return 'Toshiba';
    if (/SAMSUNG/i.test(name)) return 'Samsung';
    return 'Generic';
  }
  return mfrRaw || 'Generic';
}

function cleanName(name, brand) {
  return name
    .replace(/\s+/g, ' ')
    .replace(/\/\//g, '/')
    .trim();
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

    // Skip external drives, NAS, cages
    if (/^EXT /i.test(name) || /QNAP/i.test(name) || /CAGE/i.test(name)) continue;
    // Skip Supermicro cage (SM MCP-*)
    if (/^SM MCP-/i.test(name)) continue;
    // Skip external SSDs (Kingston/TeamGroup/MSI/ADATA/Emtec EXT SSD)
    if (/\bEXT\s+SSD\b/i.test(name)) continue;

    const mfrMatch = block.match(/<manufacturer[^>]*>([^<]+)<\/manufacturer>/);
    const mfrRaw = mfrMatch ? mfrMatch[1] : 'OTHER';
    const rawEan = extractBetween(block, '<EAN>', '</EAN>');
    const sku = extractBetween(block, '<PartNumber>', '</PartNumber>');
    const imgMatch = block.match(/<pictureUrl>([^<]+)<\/pictureUrl>/);
    const img = imgMatch ? imgMatch[1] : null;
    const stock = status.includes('наличност');
    const priceBGN = Math.round(price * EUR_RATE);
    const searchstring = extractBetween(block, '<searchstring>', '</searchstring>');

    const subcat = detectSubcat(block, name, searchstring);
    if (!subcat) {
      console.warn('SKIP (unknown type):', name);
      continue;
    }

    const brand = getBrand(mfrRaw, name);
    const displayName = cleanName(name, brand);

    // Specs
    const specs = {};
    const rawCap = getProp(block, 'Capacity');
    const capacity = normCapacity(rawCap || (() => {
      // fallback: extract from name/searchstring
      const cm = (name + ' ' + searchstring).match(/(\d+(?:\.\d+)?)\s*(GB|TB)/i);
      return cm ? cm[0] : '';
    })());

    if (capacity) specs['Капацитет'] = capacity;

    const iface = detectInterface(block, name, searchstring);
    if (iface) specs['Интерфейс'] = iface;

    const ff = detectFormFactor(block, name, searchstring, subcat);
    if (ff) specs['Форм фактор'] = ff;

    if (subcat === 'hdd') {
      const rpm = getProp(block, 'HDD rpm') || (() => {
        const rm = (name + ' ' + searchstring).match(/RPM(\d{4})|(\d{4})RPM/i);
        return rm ? (rm[1] || rm[2]) : '';
      })();
      if (rpm) specs['RPM'] = rpm;

      const cache = getProp(block, 'Cache') || (() => {
        const cm = searchstring.match(/(\d+MB)\s*$/i);
        return cm ? cm[1] : '';
      })();
      if (cache) specs['Кеш'] = cache;
    }

    if (subcat === 'ssd') {
      const perf = getProp(block, 'Performance');
      if (perf) {
        const readM = perf.match(/Read\s+(\d+)\s*MB\/s/i);
        const writeM = perf.match(/Write\s+(\d+)\s*MB\/s/i);
        if (readM) specs['Четене'] = readM[1] + ' MB/s';
        if (writeM) specs['Писане'] = writeM[1] + ' MB/s';
      }
    }

    // Emoji
    const isNVMe = (iface || '').includes('NVMe');
    const emoji = subcat === 'hdd' ? '🖴' : (isNVMe ? '⚡' : '💾');

    // Description
    const capStr = capacity ? capacity : '';
    const ifaceStr = iface ? iface : '';
    const desc = `${brand} ${displayName} — ${subcat === 'hdd' ? 'хард диск' : (isNVMe ? 'NVMe SSD' : 'SSD')}${capStr ? ' ' + capStr : ''}${ifaceStr ? ', ' + ifaceStr : ''}${ff ? ', ' + ff : ''}.`;

    products.push({ xmlId, name: displayName, brand, sku, ean: eanClean(rawEan), img, stock, price: priceBGN, specs, desc, emoji, subcat });
  }
  return products;
}

const xml = fs.readFileSync(path.join(__dirname, '../tmp_storage.xml'), 'utf8');
const parsed = parseProducts(xml);

console.log(`\nTotal parsed: ${parsed.length}`);

// Breakdown
const bySubcat = {};
parsed.forEach(p => bySubcat[p.subcat] = (bySubcat[p.subcat]||0)+1);
console.log('By subcat:', bySubcat);

const byBrand = {};
parsed.forEach(p => byBrand[p.brand] = (byBrand[p.brand]||0)+1);
console.log('By brand:', JSON.stringify(Object.entries(byBrand).sort((a,b)=>b[1]-a[1]).reduce((o,[k,v])=>({...o,[k]:v}),{})));

const byIface = {};
parsed.forEach(p => byIface[p.specs['Интерфейс']||'(none)'] = (byIface[p.specs['Интерфейс']||'(none)']||0)+1);
console.log('By interface:', byIface);

// Generate JS snippet
let js = `  // ── Storage Import — 2026-04-21 — categoryId=1 (Most BG) — ${parsed.length} устройства (HDD + SSD) ──\n`;
parsed.forEach((p, i) => {
  const id = START_ID + i;
  const specsStr = JSON.stringify(p.specs).replace(/"/g, "'");
  const imgStr = p.img ? `'${p.img}'` : 'null';
  const eanStr = p.ean ? `'${p.ean}'` : 'null';
  const nameEsc = p.name.replace(/'/g, "\\'");
  const skuEsc = (p.sku || '').replace(/'/g, "\\'");
  const descEsc = p.desc.replace(/'/g, "\\'").substring(0, 150);
  js += `  {id:${id},name:'${nameEsc}',brand:'${p.brand}',cat:'components',subcat:'${p.subcat}',\n`;
  js += `   price:${p.price},old:null,pct:null,badge:null,emoji:'${p.emoji}',sku:'${skuEsc}',ean:${eanStr},\n`;
  js += `   specs:${specsStr},\n`;
  js += `   rating:4.3,rv:0,reviews:[],\n`;
  js += `   desc:'${descEsc}',\n`;
  js += `   img:${imgStr},stock:${p.stock}},\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../tmp_storage_snippet.js'), js);
console.log('Written to tmp_storage_snippet.js');
parsed.slice(0, 5).forEach((p, i) => console.log(START_ID+i, p.subcat, p.name.substring(0,50), p.price+'лв', p.stock?'✅':'📦'));
parsed.slice(-3).forEach((p, i) => console.log(START_ID+parsed.length-3+i, p.subcat, p.name.substring(0,50), p.price+'лв'));
