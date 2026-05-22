'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../js/data.js');

function fetchXml(catId) {
  return new Promise((resolve, reject) => {
    const url = `https://portal.mostbg.com/api/product/xml/categoryId=${catId}?currency=EUR`;
    const req = https.get(url, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function isPromoUrl(url) {
  return !url || url.includes('/PL_') || url.includes('PL_4') ||
    url.toLowerCase().includes('promo') || url.includes('/img/ProductInfo/');
}

function esc(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function main() {
  const xml = await fetchXml(16);
  const blocks = xml.match(/<product[\s\S]*?<\/product>/g) || [];
  console.log('Total XML blocks:', blocks.length);

  const SKIP_BRANDS = new Set(['ENERGIZER', 'ADATA', 'MELICONI', 'LENOVO']);
  const SKIP_KW = ['POWER BANK', 'CHARGER', 'AA BAT', 'AAA BAT', 'LITH BATT', 'ALC BATT',
    'CR2032', 'CAR CHRG', 'WL CHARGER', 'SNMP MANAGER'];

  let nextId = 3695;
  const lines = [];

  for (const block of blocks) {
    const nameRaw = (block.match(/<name>(.*?)<\/name>/i) || [])[1]?.trim() || '';
    const brandRaw = (block.match(/<manufacturer[^>]*>(.*?)<\/manufacturer>/i) || [])[1]?.trim() || '';
    const sku = (block.match(/<PartNumber>(.*?)<\/PartNumber>/i) || [])[1]?.trim() || '';
    const eanRaw = (block.match(/<EAN>(.*?)<\/EAN>/i) || [])[1]?.trim() || '';
    const ean = /^\d{8,14}$/.test(eanRaw) ? eanRaw : '';
    const priceEur = parseFloat((block.match(/<price>([\d.]+)<\/price>/i) || [])[1] || '0');
    const price = Math.round(priceEur * 1.95583 * 100) / 100;

    const brand = brandRaw || nameRaw.split(' ')[0];
    if (SKIP_BRANDS.has(brand.toUpperCase())) continue;
    if (SKIP_KW.some(k => nameRaw.toUpperCase().includes(k))) continue;

    // Clean duplicate brand prefix: "FORTRON FORTRON FP600" → "FORTRON FP600"
    const bup = brand.toUpperCase();
    let name = nameRaw;
    if (name.toUpperCase().startsWith(bup + ' ' + bup + ' ')) {
      name = brand + ' ' + name.slice(bup.length * 2 + 2);
    }

    const gallery = (block.match(/<gallery>([\s\S]*?)<\/gallery>/i) || [])[1] || '';
    const urlM = gallery.match(/<pictureUrl>(.*?)<\/pictureUrl>/i);
    const img = urlM && !isPromoUrl(urlM[1]) ? urlM[1].trim() : null;

    const nl = nameRaw.toLowerCase();
    const isOnline = nl.includes('online') || nl.includes('on-line') || nl.includes('sinus') ||
      nl.includes('dsp') || nl.includes('powerup') || nl.includes('ultra one') ||
      nl.includes('pure sin') || nl.includes('eufo') || nl.includes('clippers') ||
      nl.includes('champ') || nl.includes('modultech') || nl.includes('newtech pro');
    const isBattery = brand.toUpperCase() === 'SUNLIGHT' ||
      (nl.includes('12v') && nl.includes('ah')) ||
      nl.includes('batt pack') || nl.includes('bat cabinet') ||
      (sku.toLowerCase().startsWith('fsp') && nl.includes('battery'));

    let subcat;
    if (isBattery) subcat = 'ups_battery';
    else if (isOnline) subcat = 'ups_server';
    else {
      const kvaM = nl.match(/([\d.]+)\s*kva/);
      const vaM = nl.match(/([\d]+)\s*va/);
      const va = kvaM ? parseFloat(kvaM[1]) * 1000 : (vaM ? parseInt(vaM[1]) : 0);
      subcat = va >= 1000 ? 'ups_office' : 'ups_home';
    }

    const specs = {};
    const vaM2 = nameRaw.match(/([\d.]+)\s*(KVA|VA)/i);
    if (vaM2) specs['Мощност'] = vaM2[0].toUpperCase().replace(/\s+/, '');
    specs['Тип'] = isOnline
      ? 'Онлайн / Чиста синусоида'
      : (isBattery ? 'Резервна батерия' : 'Линейно-интерактивен');
    if (!isBattery && (nl.includes('usb') || sku.toLowerCase().includes('du')))
      specs['Свързаност'] = 'USB';
    if (nl.includes('avr')) specs['AVR'] = 'Да';

    const specsStr = Object.entries(specs)
      .map(([k, v]) => `'${esc(k)}':'${esc(v)}'`).join(',');
    const imgStr = img ? `'${img}'` : 'null';
    const desc = esc(name + (vaM2 ? ' — ' + vaM2[0].toUpperCase().replace(/\s+/, '') : '') + ', ' + brand);

    lines.push(`  {id:${nextId},name:'${esc(name)}',brand:'${esc(brand)}',cat:'ups',subcat:'${subcat}',price:${price},old:null,pct:null,badge:null,emoji:'⚡',sku:'${esc(sku)}',ean:'${ean}',specs:{${specsStr}},rating:4.5,rv:0,reviews:[],desc:'${desc}',img:${imgStr},stock:true},`);
    nextId++;
  }

  console.log('Products to import:', lines.length);
  const src = fs.readFileSync(DATA_FILE, 'utf8');
  const insertPoint = src.lastIndexOf('];');
  const snippet = `\n// UPS устройства — ${new Date().toISOString().split('T')[0]}\n` +
    lines.join('\n') + '\n';
  const newSrc = src.slice(0, insertPoint) + snippet + src.slice(insertPoint);
  fs.writeFileSync(DATA_FILE, newSrc);
  console.log('✅ data.js updated. Run: node build.js');
}

main().catch(e => { console.error(e); process.exit(1); });
