'use strict';
/**
 * fill-mb-descriptions.js
 * Fetch MB XML (cat 2), extract <properties> per product,
 * build real Bulgarian descriptions, update js/data.js.
 * Usage: node scripts/fill-mb-descriptions.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const DATA_FILE = path.join(__dirname, '../js/data.js');

function fetchXml() {
  return new Promise((resolve, reject) => {
    const url = 'https://portal.mostbg.com/api/product/xml/categoryId=2?currency=EUR';
    https.get(url, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    }).on('error', reject).setTimeout(30000, function() { this.destroy(); reject(new Error('Timeout')); });
  });
}

function parseXml(xml) {
  // Returns Map<sku -> {ean, warrantyMonths, props{}, searchstring}>
  const map = new Map();
  const re = /<product id="[^"]*">([\s\S]*?)<\/product>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const get = tag => { const r = block.match(new RegExp(`<${tag}>([^<]*)<\/${tag}>`)); return r ? r[1].trim() : ''; };
    const sku = get('PartNumber');
    const ean = get('EAN');
    const warrantyMonths = get('warrantyInMonths');
    const searchstring = get('searchstring');

    const props = {};
    const pr = /<property name="([^"]+)"[^>]*>([\s\S]*?)<\/property>/g;
    let pm;
    while ((pm = pr.exec(block)) !== null) {
      props[pm[1].trim()] = pm[2].trim().replace(/\s*;\s*/g, '; ');
    }

    const entry = { ean, warrantyMonths, props, searchstring };
    if (sku) map.set(sku, entry);
    if (ean) map.set('EAN:' + ean, entry);
  }
  return map;
}

function buildDesc(name, brand, data) {
  const p = data.props;
  const ss = (data.searchstring || '').toUpperCase();
  const w = data.warrantyMonths;

  // Socket
  let socket = 'AM4';
  if (/AM5/i.test(name)) socket = 'AM5';
  else if (/LGA1851/i.test(name)) socket = 'LGA1851';
  else if (/LGA1700/i.test(name)) socket = 'LGA1700';
  else if (/LGA1200/i.test(name)) socket = 'LGA1200';
  else if (/(X670|B650|B840|B850|X870|A620)/i.test(name)) socket = 'AM5';
  else if (/(H610|B760|Z790|B860|Z890|H510|B660)/i.test(name)) socket = 'LGA1700';

  // Form factor
  const ff = p['Form factor'] || '';
  let formFactor = 'ATX';
  if (/Mini.?ITX|mITX/i.test(ff + name)) formFactor = 'Mini-ITX';
  else if (/Micro.?ATX|mATX|MATX/i.test(ff + name) || /\bM\b/.test(name)) formFactor = 'Micro-ATX';

  // Chipset
  const chipset = (p['Chipset'] || '').replace(/\s+/g, ' ').split(';')[0].trim();

  // Clean name — strip trailing socket suffix and leading brand prefix
  let cleanName = name.replace(/\s*\/\s*(AM[45]|LGA\d+)/i, '').trim();
  const brandUpper = brand.toUpperCase();
  if (cleanName.toUpperCase().startsWith(brandUpper + ' ')) cleanName = cleanName.slice(brand.length + 1).trim();

  const parts = [];

  // --- Sentence 1: intro ---
  parts.push(`${brand} ${cleanName} е ${formFactor} дънна платка за процесори ${socket}${chipset ? ' с чипсет ' + chipset : ''}.`);

  // --- Sentence 2: memory ---
  const mem = p['Memory type'] || '';
  if (mem) {
    const ddr    = mem.match(/(DDR[45])/i);
    const slots  = mem.match(/(\d+)\s*x\s*DDR[45]/i);
    const maxCap = mem.match(/[Mm]ax\.\s*capacity[^:]*:\s*(\d+\s*GB)/i);
    const maxSpd = mem.match(/up to\s*(\d{4,5})\+?\s*\(OC\)/i);
    if (ddr && slots) {
      let s = `Поддържа ${slots[1]}× ${ddr[1]}`;
      if (maxCap) s += `, до ${maxCap[1]}`;
      if (maxSpd) s += `, честоти до ${ddr[1]}-${maxSpd[1]}+`;
      parts.push(s + '.');
    }
  }

  // --- Sentence 3: storage ---
  const storage = p['Storage'] || '';
  if (storage) {
    // Count M.2 slots
    const m2blocks = [...storage.matchAll(/(\d+)\s*x\s*(?:Blazing |Hyper |Ultra )?M\.2/gi)];
    const totalM2 = m2blocks.reduce((s, x) => s + parseInt(x[1]), 0);
    const hasGen5 = /Gen5/i.test(storage);
    const sataM   = storage.match(/(\d+)\s*x\s*SATA3/gi);
    const totalSata = sataM ? sataM.reduce((s, x) => s + parseInt(x.match(/\d+/)[0]), 0) : 0;
    const hasRaid = /RAID/i.test(storage);

    let s = '';
    if (totalM2) s += `${totalM2} M.2 слота${hasGen5 ? ' (вкл. PCIe Gen5x4)' : ''}`;
    if (totalSata) s += (s ? ', ' : '') + `${totalSata}× SATA3${hasRaid ? ' с RAID' : ''}`;
    if (s) parts.push(`Включва ${s}.`);
  }

  // --- Sentence 4: PCIe slot ---
  const exp = p['Expansion slots'] || '';
  if (/PCIe 5\.0 x16/i.test(exp)) parts.push('Слот за видеокарта PCIe 5.0 x16.');

  // --- Sentence 5: rear I/O highlights ---
  const io = p['Rear panel I/O'] || '';
  const lan = p['Lan'] || p['LAN'] || '';
  const audio = p['Audio'] || '';

  const ioParts = [];
  // HDMI version
  const hdmiM = io.match(/HDMI\s*([\d.]+)/i);
  if (hdmiM) ioParts.push(`HDMI ${hdmiM[1]}`);
  // USB Gen2
  if (/USB 3\.2 Gen2/i.test(io)) ioParts.push('USB 3.2 Gen2');
  // LAN speed
  if (/2\.5\s*Gigabit|2500/i.test(lan)) ioParts.push('2.5G LAN');
  else if (/Gigabit|1000/i.test(lan)) ioParts.push('1G LAN');
  // Audio
  if (/7\.1/i.test(audio)) ioParts.push('7.1 HD аудио');
  else if (/5\.1/i.test(audio)) ioParts.push('5.1 HD аудио');

  // WiFi
  if (/WIFI7|WF7/i.test(ss) || /WiFi 7/i.test(exp + p['Wireless'] || '')) ioParts.push('WiFi 7');
  else if (/WIFI6E|WF6E/i.test(ss)) ioParts.push('WiFi 6E');
  else if (/WIFI6|WF6/i.test(ss)) ioParts.push('WiFi 6');

  if (ioParts.length) parts.push(`Заден панел: ${ioParts.join(', ')}.`);

  // --- Sentence 6: warranty ---
  if (w && w !== '24') parts.push(`Гаранция ${w} месеца.`);

  return parts.join(' ');
}

async function main() {
  console.log('Fetching MB XML from portal...');
  const xml = await fetchXml();
  const xmlMap = parseXml(xml);
  console.log(`Parsed ${xmlMap.size / 2} products from XML`);

  let data = fs.readFileSync(DATA_FILE, 'utf8');

  // Find all motherboard entries and patch their desc
  const mbRe = /\{id:(\d+),name:'([^']*)',brand:'([^']*)',cat:'[^']*',subcat:'motherboard'[\s\S]*?desc:'([^']*)',([\s\S]*?)\}/g;
  let updated = 0, skipped = 0, notFound = 0;

  data = data.replace(mbRe, (full, id, name, brand, oldDesc, rest) => {
    // Extract SKU from the match
    const skuM = full.match(/sku:'([^']*)'/);
    const eanM = full.match(/ean:'([^']*)'/);
    const sku = skuM ? skuM[1] : '';
    const ean = eanM ? eanM[1] : '';

    const xmlData = xmlMap.get(sku) || (ean ? xmlMap.get('EAN:' + ean) : null);

    if (!xmlData || Object.keys(xmlData.props).length === 0) {
      notFound++;
      return full; // leave unchanged
    }

    const newDesc = buildDesc(name, brand, xmlData);
    if (!newDesc || newDesc.length < 30) {
      skipped++;
      return full;
    }

    // Escape single quotes in desc
    const escapedDesc = newDesc.replace(/'/g, "\\'");
    updated++;
    return full.replace(/desc:'[^']*'/, `desc:'${escapedDesc}'`);
  });

  fs.writeFileSync(DATA_FILE, data, 'utf8');
  console.log(`Done: ${updated} updated, ${skipped} skipped (short desc), ${notFound} not found in XML`);
}

main().catch(e => { console.error(e); process.exit(1); });
