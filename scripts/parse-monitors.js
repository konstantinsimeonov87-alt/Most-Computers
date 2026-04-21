// Script: parse Monitors XML → JS data snippet
// Usage: node scripts/parse-monitors.js
const fs = require('fs');
const path = require('path');

const EUR_RATE = 1.95583;
const START_ID = 973;

const brandMap = {
  'ACER': 'Acer', 'LG': 'LG', 'LENOVO': 'Lenovo', 'MSI': 'MSI',
  'ASROCK': 'ASRock', 'KOORUI': 'Koorui', 'THOMSON': 'Thomson', 'ASUS': 'ASUS',
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
  const re = new RegExp(`<property name="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*"[^>]*>([^<]*)`, 'i');
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

// Extract description name attrs from searchStringParts
function getDescAttrs(block) {
  const attrs = [];
  const re = /<description name="([^"]+)">/g;
  let m;
  while ((m = re.exec(block)) !== null) attrs.push(m[1]);
  return attrs;
}

function normResolution(raw) {
  if (!raw) return '';
  // Remove commas in numbers: "2,560 x 1,440" → "2560 x 1440"
  const r = raw.trim().replace(/(\d),(\d{3})/g, '$1$2').replace(/\s+/g, ' ').replace(/[×x]/g, '×').replace(/\s*[xX×]\s*/g, '×');
  // Normalize pixel dimensions
  if (/3840.*2160|4K|UHD/i.test(r)) return '3840×2160 (4K)';
  if (/5120.*2160/i.test(r)) return '5120×2160 (5K2K)';
  if (/5120.*1440/i.test(r)) return '5120×1440 (Dual QHD)';
  if (/UWQHD|3440.*1440/i.test(r)) return '3440×1440 (UW-QHD)';
  if (/2560.*1080/i.test(r)) return '2560×1080 (UW-FHD)';
  if (/2560.*1440|QHD|WQHD/i.test(r)) return '2560×1440 (QHD)';
  if (/1920.*1200|WUXGA/i.test(r)) return '1920×1200 (WUXGA)';
  if (/1920.*1080|FHD|Full HD/i.test(r)) return '1920×1080 (FHD)';
  if (/1366.*768/i.test(r)) return '1366×768 (HD)';
  if (/1280.*1024/i.test(r)) return '1280×1024 (SXGA)';
  if (/2048.*1536/i.test(r)) return '2048×1536';
  if (/2560.*2880/i.test(r)) return '2560×2880';
  if (/3840.*1600/i.test(r)) return '3840×1600 (UW-4K)';
  return r;
}

function normHz(raw) {
  if (!raw) return '';
  const m = raw.match(/(\d+)\s*Hz/i);
  return m ? m[1] + ' Hz' : '';
}

function normMs(raw) {
  if (!raw) return '';
  const m = raw.match(/([\d.]+)\s*ms/i);
  return m ? m[1] + 'ms' : '';
}

function normSize(raw) {
  if (!raw) return '';
  const m = raw.match(/([\d.]+)/);
  return m ? m[1] + '"' : '';
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

    // Skip accessories (monitor arms, stands)
    if (/^DESK MOUNT/i.test(name)) continue;

    const mfrMatch = block.match(/<manufacturer[^>]*>([^<]+)<\/manufacturer>/);
    const mfrRaw = mfrMatch ? mfrMatch[1] : '';
    const brand = brandMap[mfrRaw] || mfrRaw || 'Unknown';

    const rawEan = extractBetween(block, '<EAN>', '</EAN>');
    const sku = extractBetween(block, '<PartNumber>', '</PartNumber>');
    const imgMatch = block.match(/<pictureUrl>([^<]+)<\/pictureUrl>/);
    const img = imgMatch ? imgMatch[1] : null;
    const stock = status.includes('наличност');
    const priceBGN = Math.round(price * EUR_RATE);

    const attrs = getDescAttrs(block);
    const searchstring = extractBetween(block, '<searchstring>', '</searchstring>');

    // ── Specs extraction ─────────────────────────────────────────────────────

    // Screen size — from property or from name prefix or searchstring
    let rawSize = getProp(block, 'Screen size');
    if (!rawSize) {
      // Try description attr like "24", "27", "32" (standalone number)
      const sizeAttr = attrs.find(a => /^\d{2}$/.test(a));
      if (sizeAttr) rawSize = sizeAttr + '"';
      // Try from name: leading number "27 LG..." or "ASUS 24.1..."
      if (!rawSize) {
        const nm = name.match(/^(\d{2}(?:\.\d)?)\s+[A-Z]|[A-Z]+\s+(\d{2}(?:\.\d)?)\s+[A-Z]/);
        if (nm) rawSize = (nm[1] || nm[2]) + '"';
      }
    }
    const size = normSize(rawSize);

    // Panel type — from property → description attrs → searchstring
    let panel = '';
    const screenType = getProp(block, 'Screen type');
    const allText = screenType + ' ' + attrs.join(' ') + ' ' + searchstring;
    if (/OLED/i.test(allText)) panel = 'OLED';
    else if (/QLED/i.test(allText)) panel = 'QLED';
    else if (/IPS/i.test(allText)) panel = 'IPS';
    else if (/\bVA\b/i.test(allText)) panel = 'VA';
    else if (/\bTN\b/i.test(allText)) panel = 'TN';

    // Resolution — from property → description attrs → searchstring
    let rawRes = getProp(block, 'Screen resolution');
    if (!rawRes) {
      const resAttr = attrs.find(a => /^(FHD|QHD|WQHD|WUXGA|UWQHD|4K|UHD|2K|UW)$/i.test(a));
      if (resAttr) rawRes = resAttr;
    }
    if (!rawRes) {
      // Searchstring: "FHD", "QHD", "4K", "UWQHD"
      const ssRes = searchstring.match(/\b(FHD|QHD|WQHD|WUXGA|UWQHD|4K UHD|4K|UHD|2K)\b/i);
      if (ssRes) rawRes = ssRes[1];
    }
    const resolution = normResolution(rawRes || '');

    // Refresh rate — from property → description attrs → searchstring text
    let rawHz = getProp(block, 'Refresh rate');
    if (!rawHz) {
      // Description attrs (decode &lt; entity)
      const hzAttr = attrs.find(a => /^\d+Hz$/i.test(a.replace(/&lt;/g,'<').replace(/&gt;/g,'>')));
      if (hzAttr) rawHz = hzAttr;
    }
    if (!rawHz) {
      // Searchstring text: "200Hz", "144Hz"
      const ssHz = searchstring.match(/(\d+)Hz/i);
      if (ssHz) rawHz = ssHz[0];
    }
    // <100Hz means 60Hz display
    if (rawHz && /^[<&]/.test(rawHz)) rawHz = '60Hz';
    const hz = normHz(rawHz);

    // Response time — from property → description attrs → searchstring
    let rawMs = getProp(block, 'Response time');
    if (!rawMs) {
      const msAttr = attrs.find(a => /^[\d.]+ms$/i.test(a));
      if (msAttr) rawMs = msAttr;
    }
    if (!rawMs) {
      const ssMs = searchstring.match(/([\d.]+)ms/i);
      if (ssMs) rawMs = ssMs[0];
    }
    const resp = normMs(rawMs);

    // Curved — from name or searchstring
    const curved = /CURVED|CURVE/i.test(name + ' ' + searchstring);

    // Speakers / audio
    const audio = attrs.includes('AUDIO') || /Speaker/i.test(getProp(block, 'Audio') || '') || /AUDIO/i.test(searchstring);

    // ── Build specs object ────────────────────────────────────────────────────
    const specs = {};
    if (size) specs['Размер'] = size;
    if (panel) specs['Панел'] = panel;
    if (resolution) specs['Резолюция'] = resolution;
    if (hz) specs['Честота'] = hz;
    if (resp) specs['Отклик'] = resp;
    if (curved) specs['Curved'] = 'Да';
    if (audio) specs['Тонколони'] = 'Да';

    // Emoji
    const hzNum = parseInt(hz) || 0;
    const is4K = /4K|3840/.test(resolution);
    const isOled = panel === 'OLED';
    const isGaming = hzNum >= 144 || /gaming|MAG|G-SYNC|FREESYNC/i.test(name);
    const emoji = isOled ? '✨' : (is4K ? '🔲' : (isGaming ? '🎮' : '🖥'));

    // Display name — clean up
    const displayName = name.replace(/\s+/g, ' ').trim();

    // Description
    const desc = `${brand} ${displayName} — ${size ? size + ' монитор' : 'монитор'}${panel ? ', ' + panel : ''}${resolution ? ', ' + resolution : ''}${hz ? ', ' + hz : ''}.`;

    products.push({
      xmlId, name: displayName, brand, sku, ean: eanClean(rawEan),
      img, stock, price: priceBGN, specs, desc, emoji,
    });
  }
  return products;
}

const xml = fs.readFileSync(path.join(__dirname, '../tmp_monitors.xml'), 'utf8');
const parsed = parseProducts(xml);

console.log(`Total parsed: ${parsed.length}`);

// Breakdown
const byBrand = {};
parsed.forEach(p => byBrand[p.brand] = (byBrand[p.brand]||0)+1);
console.log('By brand:', JSON.stringify(Object.entries(byBrand).sort((a,b)=>b[1]-a[1]).reduce((o,[k,v])=>({...o,[k]:v}),{})));

const byPanel = {};
parsed.forEach(p => byPanel[p.specs['Панел']||'(none)'] = (byPanel[p.specs['Панел']||'(none)']||0)+1);
console.log('By panel:', byPanel);

const byRes = {};
parsed.forEach(p => byRes[p.specs['Резолюция']||'(none)'] = (byRes[p.specs['Резолюция']||'(none)']||0)+1);
console.log('By resolution:', JSON.stringify(Object.entries(byRes).sort((a,b)=>b[1]-a[1]).reduce((o,[k,v])=>({...o,[k]:v}),{})));

const byHz = {};
parsed.forEach(p => byHz[p.specs['Честота']||'(none)'] = (byHz[p.specs['Честота']||'(none)']||0)+1);
console.log('By Hz:', JSON.stringify(Object.entries(byHz).sort((a,b)=>b[1]-a[1]).reduce((o,[k,v])=>({...o,[k]:v}),{})));

const missing = parsed.filter(p => !p.specs['Размер'] || !p.specs['Резолюция']);
console.log('Missing size or resolution:', missing.length, missing.slice(0,5).map(p=>p.name));

// Generate JS snippet
let js = `  // ── Monitor Import — 2026-04-21 — categoryId=8 (Most BG) — ${parsed.length} монитора ──\n`;
parsed.forEach((p, i) => {
  const id = START_ID + i;
  const specsStr = JSON.stringify(p.specs).replace(/"/g, "'");
  const imgStr = p.img ? `'${p.img}'` : 'null';
  const eanStr = p.ean ? `'${p.ean}'` : 'null';
  const nameEsc = p.name.replace(/'/g, "\\'");
  const skuEsc = (p.sku || '').replace(/'/g, "\\'");
  const descEsc = p.desc.replace(/'/g, "\\'").substring(0, 160);
  js += `  {id:${id},name:'${nameEsc}',brand:'${p.brand}',cat:'monitors',subcat:'monitor',\n`;
  js += `   price:${p.price},old:null,pct:null,badge:null,emoji:'${p.emoji}',sku:'${skuEsc}',ean:${eanStr},\n`;
  js += `   specs:${specsStr},\n`;
  js += `   rating:4.3,rv:0,reviews:[],\n`;
  js += `   desc:'${descEsc}',\n`;
  js += `   img:${imgStr},stock:${p.stock}},\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../tmp_monitors_snippet.js'), js);
console.log('Written to tmp_monitors_snippet.js');
parsed.slice(0, 3).forEach((p, i) => console.log(START_ID+i, p.emoji, p.name.substring(0,50), p.price+'лв', p.stock?'✅':'📦'));
parsed.slice(-3).forEach((p, i) => console.log(START_ID+parsed.length-3+i, p.emoji, p.name.substring(0,50), p.price+'лв'));
