// scripts/check-filter-coverage.js
// Checks which products fall outside the defined CAT_SPEC_FILTERS / SUBCAT_SPEC_FILTERS.
// Run after any product import to catch new values that need new filter options.
//
// Usage:  node scripts/check-filter-coverage.js
//         node scripts/check-filter-coverage.js --cat=laptops
//         node scripts/check-filter-coverage.js --cat=desktops --verbose

'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const CAT_ARG = (args.find(a => a.startsWith('--cat=')) || '').replace('--cat=', '') || null;
const VERBOSE = args.includes('--verbose') || args.includes('-v');

// ─── Load data ────────────────────────────────────────────────────────────────
const dataCtx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8'), dataCtx);
const { products } = dataCtx;

// Load filters.js — extract CAT_SPEC_FILTERS + SUBCAT_SPEC_FILTERS
// by slicing from their declaration to the balanced closing };
function extractConst(src, name) {
  const start = src.indexOf(`const ${name} = {`);
  if (start === -1) return null;
  const objStart = src.indexOf('{', start);
  let depth = 0, i = objStart;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) break; }
  }
  // eval the isolated object literal
  try {
    return (new Function(`return ${src.slice(objStart, i + 1)};`))();
  } catch { return null; }
}

const filterSrc         = fs.readFileSync(path.join(__dirname, '../js/filters.js'), 'utf8');
const CAT_SPEC_FILTERS    = extractConst(filterSrc, 'CAT_SPEC_FILTERS')    || {};
const SUBCAT_SPEC_FILTERS = extractConst(filterSrc, 'SUBCAT_SPEC_FILTERS') || {};

// ─── Matchers — mirror matchesCatSpec logic ───────────────────────────────────
// Returns the canonical "bucket" a product falls into for a given filter key,
// or null if the spec is missing/irrelevant.

function bucketize(p, key) {
  const specs = p.specs || {};

  // ── Laptop ──
  if (key === '_laptop_brand') return p.brand || null;

  if (key === '_laptop_cpu') {
    const cpu = (specs['Процесор'] || p.name || '').toLowerCase();
    // "Alder Lake i5-..." / "Raptor Lake i7-..." / "Core i5-..." all covered
    if (/core\s*(™\s*)?i3|\bi3-\d/i.test(cpu))    return 'Core i3';
    if (/core\s*(™\s*)?i5|\bi5-\d|core\s+5\s+\d/i.test(cpu)) return 'Core i5';
    if (/core\s*(™\s*)?i7|\bi7-\d|core\s+7\s+\d/i.test(cpu)) return 'Core i7';
    if (/core\s*(™\s*)?i9|\bi9-\d/i.test(cpu))    return 'Core i9';
    if (/ultra\s*(™\s*)?5/i.test(cpu))             return 'Core Ultra 5';
    if (/ultra\s*(™\s*)?7/i.test(cpu))             return 'Core Ultra 7';
    if (/ultra\s*(™\s*)?9/i.test(cpu))             return 'Core Ultra 9';
    if (/ryzen\s*(™\s*)?ai\s*9/i.test(cpu))        return '(ryzen ai — OK)';
    if (/ryzen\s*(™\s*)?[39][\s\d]/i.test(cpu))    return 'Ryzen 9';
    if (/ryzen\s*(™\s*)?7/i.test(cpu))             return 'Ryzen 7';
    if (/ryzen\s*(™\s*)?5/i.test(cpu))             return 'Ryzen 5';
    if (/ryzen\s*(™\s*)?3/i.test(cpu))             return '(ryzen 3 — OK)';
    if (/athlon/i.test(cpu))                        return 'AMD Athlon';
    if (/celeron|n\d{4}/i.test(cpu))               return '(budget — OK)';
    return cpu ? '⚠ UNMATCHED: ' + cpu.slice(0, 40) : null;
  }

  if (key === '_laptop_ram') {
    const gb = parseInt((specs['RAM'] || '').replace(/\s/g, ''));
    return isNaN(gb) ? null : gb + ' GB';
  }

  if (key === '_laptop_ssd') {
    const ssd = (specs['SSD'] || '').trim().toUpperCase().replace(/\s/g, '');
    if (!ssd || ssd === 'N/A' || ssd === 'NONE') return null;
    if (ssd.endsWith('TB')) return Math.round(parseFloat(ssd)) + ' TB';
    if (ssd.endsWith('GB')) return parseInt(ssd) + ' GB';
    return ssd;
  }

  if (key === '_laptop_display') {
    const scr = (specs['Екран'] || '').toLowerCase();
    if (scr.includes('oled'))     return 'OLED';
    if (scr.includes('ips'))      return 'IPS';
    if (scr.includes('va'))       return 'VA';
    return scr ? '⚠ UNMATCHED: ' + scr.slice(0, 30) : null;
  }

  if (key === '_laptop_gpu') {
    const gpu = (specs['GPU'] || specs['Видеокарта'] || p.name || '').toLowerCase();
    if (/rtx.{0,3}50\d\d/i.test(gpu))             return 'RTX 50';
    if (/rtx.{0,3}40\d\d/i.test(gpu))             return 'RTX 40';
    if (/rtx.{0,3}30\d\d/i.test(gpu))             return 'RTX 30';
    if (/gtx/i.test(gpu))                          return 'GTX';
    if (/radeon\s*rx/i.test(gpu))                  return 'AMD Radeon RX';
    if (/iris|uhd|radeon\s*graphics|integrated/i.test(gpu)) return 'Интегрирана';
    return null;
  }

  if (key === '_laptop_os') {
    const os = (specs['ОС'] || '').toLowerCase();
    if (os.includes('windows 11'))              return 'Windows 11';
    if (os.includes('free dos') || os.includes('freedos') || os.includes('linux') || !os) return 'Free DOS / Linux';
    return os ? '⚠ UNMATCHED: ' + os.slice(0, 30) : null;
  }

  if (key === '_laptop_weight') {
    const kg = parseFloat((specs['Тегло'] || '').replace(/\s/g, '').replace(',', '.'));
    if (isNaN(kg)) return null;
    if (kg <= 1.5)           return 'До 1.5 кг';
    if (kg <= 2.0)           return '1.5 – 2 кг';
    return 'Над 2 кг';
  }

  if (key === '_laptop_hz') {
    const m = (specs['Екран'] || '').replace(/\s/g, '').match(/(\d+)hz/i);
    const hz = m ? parseInt(m[1]) : 0;
    if (hz === 0 || hz === 60)   return '60 Hz';
    if (hz >= 120 && hz < 140)   return '120 Hz';
    if (hz >= 140 && hz < 160)   return '144 Hz';
    if (hz >= 165)               return '165+ Hz';
    return hz + ' Hz (⚠ unmapped)';
  }

  if (key === '_laptop_screen') {
    const scr = (specs['Екран'] || '').toLowerCase();
    const m = scr.match(/([\d.]+)["″'']/);
    return m ? m[1] + '"' : null;
  }

  // ── Desktop ──
  if (key === '_desktop_brand') return p.brand || null;

  if (key === '_desktop_cpu') {
    const cpu = (specs['Процесор'] || '').replace(/[®™©]/g, ' ').toLowerCase();
    if (!cpu) return null;
    if (/\bi3[-\s\d]|core\s+i3|core\s+3\s+\d|with intel i3/i.test(cpu)) return 'Core i3';
    if (/\bi5[-\s\d]|core\s+i5|core\s+5\s+\d|with intel i5/i.test(cpu)) return 'Core i5';
    if (/\bi7[-\s\d]|core\s+i7|core\s+7\s+\d|with intel i7/i.test(cpu)) return 'Core i7';
    if (/\bi9[-\s\d]|core\s+i9/i.test(cpu))          return 'Core i9';
    if (/ultra\s*5[\s\d]/i.test(cpu))                 return 'Core Ultra 5';
    if (/ultra\s*7[\s\d]/i.test(cpu))                 return 'Core Ultra 7';
    if (/ultra\s*9[\s\d]/i.test(cpu))                 return 'Core Ultra 9';
    if (/ryzen\s*5[\s\d]/i.test(cpu))                 return 'Ryzen 5';
    if (/ryzen\s*7[\s\d]/i.test(cpu))                 return 'Ryzen 7';
    if (/ryzen\s*9[\s\d]/i.test(cpu))                 return 'Ryzen 9';
    if (/celeron|pentium|n\d{3}|athlon/i.test(cpu))   return '(budget — OK)';
    return '⚠ UNMATCHED: ' + cpu.slice(0, 40);
  }

  if (key === '_desktop_ram') {
    const gb = parseInt((specs['RAM'] || '').replace(/\s/g, ''));
    return isNaN(gb) ? null : gb + ' GB';
  }

  if (key === '_desktop_ssd') {
    const ssd = (specs['SSD'] || '').trim().toUpperCase().replace(/\s/g, '');
    if (!ssd || ssd === 'N/A' || ssd === 'NONE') return null;
    if (ssd.endsWith('TB')) return Math.round(parseFloat(ssd)) + ' TB';
    if (ssd.endsWith('GB')) return parseInt(ssd) + ' GB';
    return ssd;
  }

  if (key === '_desktop_gpu') {
    const gpu = (specs['GPU'] || '').toLowerCase();
    if (/rtx.{0,3}50\d\d/i.test(gpu))                  return 'RTX 50';
    if (/rtx.{0,3}40\d\d/i.test(gpu))                  return 'RTX 40';
    if (/rtx.{0,3}30\d\d/i.test(gpu))                  return 'RTX 30 (⚠ add?)';
    if (/intel.*uhd|intel.*iris|amd.*radeon.*graphics|integrated|uma/i.test(gpu)) return 'Интегрирана';
    return gpu ? '⚠ UNMATCHED: ' + gpu.slice(0, 40) : null;
  }

  if (key === '_desktop_os') {
    const os = (specs['ОС'] || '').toLowerCase();
    if (os.includes('windows 11'))                              return 'Windows 11';
    if (!os || os === 'none' || os === 'n/a' || os.includes('free dos') || os.includes('freedos')) return 'Без OS';
    return '⚠ UNMATCHED: ' + os.slice(0, 30);
  }

  // ── Monitor ──
  if (key === '_monitor_brand') return p.brand || null;
  if (key === '_monitor_panel') {
    const panel = (specs['Панел'] || '').toLowerCase();
    if (/\bips\b/i.test(panel))  return 'IPS';
    if (/\bva\b/i.test(panel))   return 'VA';
    if (/oled/i.test(panel))     return 'OLED';
    if (/\btn\b/i.test(panel))   return 'TN';
    if (/qled/i.test(panel))     return 'QLED';
    return panel ? '(unknown panel: ' + panel.slice(0, 20) + ')' : null;
  }
  if (key === '_monitor_hz') {
    const raw = (specs['Честота'] || '').replace(/\s/g, '');
    const hz = parseInt(raw);
    return isNaN(hz) ? null : hz + 'Hz';
  }
  if (key === '_monitor_res') {
    const r = (specs['Резолюция'] || '').toLowerCase();
    if (/1920.{0,3}1080|full\s*hd/i.test(r)) return 'FHD 1920×1080';
    if (/2560.{0,3}1440/i.test(r))           return 'QHD 2560×1440';
    if (/3840.{0,3}2160/i.test(r))           return '4K 3840×2160';
    if (/1920.{0,3}1200/i.test(r))           return 'WUXGA 1920×1200';
    if (/3440.{0,3}1440/i.test(r))           return 'UltraWide';
    return r ? '⚠ UNMATCHED: ' + r.slice(0, 30) : null;
  }
  if (key === '_monitor_size') {
    const raw = (specs['Размер'] || '').replace(/[^\d.,]/g, '').replace(',', '.');
    const inch = parseFloat(raw);
    if (isNaN(inch)) return null;
    if (inch <= 19)               return 'До 19"';
    if (inch > 19 && inch <= 23)  return '21"–23"';
    if (inch > 23 && inch <= 25)  return '23"–25"';
    if (inch > 25 && inch <= 27)  return '25"–27"';
    if (inch > 27 && inch <= 29)  return '27"–29"';
    return 'Над 29"';
  }
  if (key === '_monitor_gaming') {
    const sync = (specs.Sync || '');
    if (/freesync/i.test(sync) && /g.?sync/i.test(sync)) return '(FreeSync+G-Sync — OK)';
    if (/freesync/i.test(sync)) return 'FreeSync';
    if (/g.?sync/i.test(sync))  return 'G-Sync';
    if (specs.HDR === 'Да')     return 'HDR';
    if (specs.Curved)           return 'Curved';
    return null;
  }
  if (key === '_monitor_interface') {
    if (specs.HDMI === 'Да')  return 'HDMI';
    if (specs.DP   === 'Да')  return 'DisplayPort';
    if (specs.USBC === 'Да')  return 'USB-C';
    return null;
  }
  if (key === '_monitor_stand') {
    if (specs.Pivot  === 'Да') return 'Pivot';
    if (specs.Swivel === 'Да') return 'Swivel';
    return null;
  }

  // Direct spec key fallback
  return (specs[key] || '').trim() || null;
}

// ─── Coverage check ───────────────────────────────────────────────────────────
function checkCategory(cat, filters) {
  const catProducts = products.filter(p => p.cat === cat);
  if (!catProducts.length) return;

  let hasIssues = false;
  const issues = [];

  for (const { key, label, values } of filters) {
    const allowed = new Set(values);
    const unmatchedBuckets = {};  // bucket → [product names]
    const missingInFilter   = {};  // bucket → count (known but not in filter values)

    for (const p of catProducts) {
      const bucket = bucketize(p, key);
      if (bucket === null) continue;  // no spec data — skip

      if (bucket.startsWith('(')) continue;  // intentionally excluded (e.g. budget CPUs)

      if (!allowed.has(bucket)) {
        const group = bucket.startsWith('⚠') ? unmatchedBuckets : missingInFilter;
        (group[bucket] = group[bucket] || []).push(p.name.slice(0, 50));
      }
    }

    const allMissing = { ...unmatchedBuckets, ...missingInFilter };
    if (Object.keys(allMissing).length) {
      hasIssues = true;
      issues.push({ key, label, missing: allMissing });
    }
  }

  if (!hasIssues) {
    console.log(`  ✅ ${cat} — всички филтри покриват продуктите`);
    return;
  }

  console.log(`\n  ⚠  ${cat.toUpperCase()}`);
  for (const { key, label, missing } of issues) {
    console.log(`\n     ${label} [${key}]`);
    for (const [bucket, names] of Object.entries(missing)) {
      const isUnknown = bucket.startsWith('⚠');
      const tag = isUnknown ? '❓ непознат формат' : '➕ липсва в filter';
      console.log(`       ${tag}: ${bucket.replace('⚠ UNMATCHED: ', '')}`);
      if (VERBOSE) names.slice(0, 3).forEach(n => console.log(`           → ${n}`));
      else if (names.length) console.log(`           (${names.length} продукта — пусни --verbose за имена)`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log('\n📋 Most Computers — Filter Coverage Check');
console.log('==========================================\n');

const CATS_TO_CHECK = CAT_ARG ? [CAT_ARG] : Object.keys(CAT_SPEC_FILTERS);

let totalIssues = 0;

for (const cat of CATS_TO_CHECK) {
  const filters = CAT_SPEC_FILTERS[cat];
  if (!filters?.length) continue;

  if (VERBOSE) console.log(`\n── ${cat} ──`);
  checkCategory(cat, filters);
}

console.log('\n==========================================');
console.log('Съвети:');
console.log('  ➕ "липсва в filter" → добави стойността в js/filters.js → CAT_SPEC_FILTERS');
console.log('  ❓ "непознат формат" → провери данните или обнови handler-а в matchesCatSpec()');
console.log('  node scripts/check-filter-coverage.js --cat=laptops --verbose  (повече детайли)\n');
