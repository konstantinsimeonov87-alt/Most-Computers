const fs = require('fs');
const xml = fs.readFileSync(__dirname + '/../tmp_flash_feed.xml', 'utf8');
const EUR_RATE = 1.95583;

function getVal(body, tag) {
  const re = new RegExp('<' + tag + '[^>]*>([^<]*)</' + tag + '>');
  const m = body.match(re);
  return m ? m[1].trim() : '';
}

function getProp(body, name) {
  const re = new RegExp('<property name="' + name + '"[^>]*>([^<]*)</property>');
  const m = body.match(re);
  return m ? m[1].trim() : '';
}

function getImg(body) {
  const m = body.match(/<pictureUrl>([^<]+)<\/pictureUrl>/);
  return m ? m[1].trim() : '';
}

function classify(name) {
  const n = name.toUpperCase();
  if (n.includes('WFS-SDC') || n.includes('WFS-U') || n.includes('READER') || n.includes('WORKFL')) return 'card_reader';
  if (n.includes(' CF ') || n.includes('CF CARD')) return 'cf_card';
  if (n.includes('SDMIC') || n.includes('SDXCM') || n.includes('MICROSD')) return 'microsd';
  if ((n.match(/\bSD\b/) || n.includes('SDCS') || n.includes('SDCG') || n.includes('SDS') || n.includes('SDG')) && !n.includes('USB') && !n.includes('SDMIC') && !n.includes('SDXCM')) return 'sd_card';
  return 'usb_flash';
}

const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const productRe = /<product id="(\d+)">([\s\S]*?)<\/product>/g;
let m;
const products = [];
let nextId = 3764;

while ((m = productRe.exec(xml)) !== null) {
  const pid = m[1];
  const body = m[2];

  const inStock = getVal(body, 'product_status') === 'В наличност';
  const name = getVal(body, 'name');
  const priceEUR = parseFloat(getVal(body, 'price')) || 0;
  const priceBGN = Math.round(priceEUR * EUR_RATE * 100) / 100;

  const brandRaw = getVal(body, 'manufacturer');
  const brand = brandRaw.charAt(0).toUpperCase() + brandRaw.slice(1).toLowerCase();
  const sku = getVal(body, 'PartNumber') || null;
  const ean = getVal(body, 'EAN') || null;
  const warrantyM = parseInt(getVal(body, 'warrantyInMonths')) || 0;

  const imgUrl = getImg(body);
  const imgMatch = imgUrl.match(/imageFileData\/(\d+)\./);
  const imgId = imgMatch ? imgMatch[1] : '';
  const img = imgId ? './images/products/' + imgId + '.webp' : null;

  const capacity = getProp(body, 'Capacity');
  const iface = getProp(body, 'Interface');
  const readSpeed = getProp(body, 'Read speed') || getProp(body, 'Reading speed') || '';
  const writeSpeed = getProp(body, 'Write speed') || getProp(body, 'Writing speed') || '';
  const color = getProp(body, 'Color');

  const subcat = classify(name);
  const emojiMap = { usb_flash: '💾', microsd: '📱', sd_card: '📷', cf_card: '📷', card_reader: '🔌' };

  const specs = {};
  if (capacity) specs['Капацитет'] = capacity;
  if (iface) specs['Интерфейс'] = iface;
  if (readSpeed) specs['Скорост четене'] = readSpeed;
  if (writeSpeed) specs['Скорост запис'] = writeSpeed;
  if (color) specs['Цвят'] = color;
  if (warrantyM) specs['Гаранция'] = (warrantyM / 12) + ' год.';

  products.push({ id: nextId++, vendorId: parseInt(pid), name, brand, subcat, price: priceBGN, img, sku, ean, specs, inStock, emoji: emojiMap[subcat] || '💾' });
}

const lines = products.map(function(p) {
  const specsEntries = Object.keys(p.specs).map(k => "'" + esc(k) + "':'" + esc(p.specs[k]) + "'").join(',');
  const skuStr = p.sku ? "'" + esc(p.sku) + "'" : 'null';
  const eanStr = p.ean ? "'" + p.ean + "'" : 'null';
  const imgStr = p.img ? "'" + p.img + "'" : 'null';
  return "  {id:" + p.id + ",vendorId:" + p.vendorId + ",name:'" + esc(p.name) + "',brand:'" + p.brand + "',cat:'storage',subcat:'" + p.subcat + "',price:" + p.price + ",old:null,pct:null,emoji:'" + p.emoji + "',img:" + imgStr + ",sku:" + skuStr + ",ean:" + eanStr + ",specs:{" + specsEntries + "},rating:4.2,rv:0,reviews:[],inStock:" + p.inStock + ",badge:null,desc:''}";
});

const today = new Date().toISOString().slice(0, 10);
const snippet = '\n// Migration: ' + today + ' — ' + products.length + ' флаш памети от portal.mostbg.com categoryId=19\nproducts.push(\n' + lines.join(',\n') + '\n);\n';

fs.writeFileSync(__dirname + '/../tmp_flash_snippet.js', snippet);
console.log('Generated ' + products.length + ' products');

const imgIds = products.filter(function(p) { return p.img; }).map(function(p) {
  const mm = p.img.match(/(\d+)\.webp/);
  return mm ? mm[1] : null;
}).filter(Boolean);
fs.writeFileSync(__dirname + '/../tmp_flash_img_ids.txt', imgIds.join(','));
console.log(imgIds.length + ' images to convert');
