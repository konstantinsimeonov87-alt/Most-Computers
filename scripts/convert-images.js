'use strict';
/**
 * convert-images.js — downloads product images from portal.mostbg.com,
 * converts them to WebP, and updates js/data.js with local paths.
 *
 * Usage:
 *   node scripts/convert-images.js              ← all in-stock products
 *   node scripts/convert-images.js --ids 46543,44490  ← specific image IDs
 *   node scripts/convert-images.js --dry-run    ← preview only, no downloads
 *   node scripts/convert-images.js --all        ← all products (stock + no-stock)
 *
 * Output: images/products/<id>.webp
 * Updates data.js: img:'https://portal.mostbg.com/...' → img:'./images/products/<id>.webp'
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const DATA_FILE   = path.join(__dirname, '../js/data.js');
const OUT_DIR     = path.join(__dirname, '../images/products');
const DRY_RUN     = process.argv.includes('--dry-run');
const FORCE_ALL   = process.argv.includes('--all');
const IDS_ARG     = process.argv.find(a => a.startsWith('--ids='));
const SPECIFIC_IDS = IDS_ARG ? IDS_ARG.replace('--ids=', '').split(',').map(s => s.trim()) : null;

const WEBP_SIZE   = 300; // px — card display size
const CONCURRENCY = 4;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function download(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

async function convertOne({ id, url }) {
  const outFile = path.join(OUT_DIR, `${id}.webp`);
  if (fs.existsSync(outFile) && !FORCE_ALL) return { id, status: 'skipped' };
  if (DRY_RUN) return { id, status: 'dry-run' };
  try {
    const buf = await download(url);
    await sharp(buf)
      .resize(WEBP_SIZE, WEBP_SIZE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outFile);
    return { id, status: 'ok', bytes: fs.statSync(outFile).size };
  } catch (e) {
    return { id, status: 'error', msg: e.message };
  }
}

async function pool(tasks, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const task = tasks[i++];
      const r = await convertOne(task);
      results.push(r);
      const icon = r.status === 'ok' ? '✅' : r.status === 'skipped' ? '⏭' : r.status === 'dry-run' ? '🔍' : '❌';
      const extra = r.status === 'ok' ? ` (${Math.round(r.bytes/1024)}KB)` : r.msg ? ` — ${r.msg}` : '';
      process.stdout.write(`${icon} ${r.id}${extra}\n`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  console.log('🖼  convert-images.js — portal.mostbg.com → WebP');
  console.log(`📅 ${new Date().toISOString()}`);
  if (DRY_RUN) console.log('🔍 Dry-run mode — no files written');

  const src = fs.readFileSync(DATA_FILE, 'utf8');

  // Extract all portal.mostbg.com image references
  const urlRe = /img:'(https:\/\/portal\.mostbg\.com\/api\/images\/imageFileData\/(\d+)\.[a-z]+)'/g;
  const tasks = [];
  const seen = new Set();
  let m;
  while ((m = urlRe.exec(src)) !== null) {
    const [, url, id] = m;
    if (seen.has(id)) continue;
    seen.add(id);
    // Filter: specific IDs requested
    if (SPECIFIC_IDS && !SPECIFIC_IDS.includes(id)) continue;
    // Filter: stock only (unless --all or specific IDs)
    if (!SPECIFIC_IDS && !FORCE_ALL) {
      // Find stock:true in proximity after this img
      const ctx = src.slice(m.index, m.index + 200);
      if (!/stock:true/.test(ctx)) continue;
    }
    tasks.push({ id, url });
  }

  console.log(`\n📦 Images to process: ${tasks.length}\n`);
  if (tasks.length === 0) { console.log('Nothing to do.'); return; }

  const results = await pool(tasks, CONCURRENCY);

  const ok      = results.filter(r => r.status === 'ok');
  const skipped = results.filter(r => r.status === 'skipped');
  const errors  = results.filter(r => r.status === 'error');

  console.log(`\n✅ Converted: ${ok.length}`);
  console.log(`⏭  Skipped:   ${skipped.length}`);
  console.log(`❌ Errors:    ${errors.length}`);

  if (ok.length > 0 && !DRY_RUN) {
    // Update data.js — replace portal URLs with local paths
    let updated = src;
    for (const { id } of ok) {
      const re = new RegExp(`img:'https://portal\\.mostbg\\.com/api/images/imageFileData/${id}\\.[a-z]+'`, 'g');
      updated = updated.replace(re, `img:'./images/products/${id}.webp'`);
    }
    if (updated !== src) {
      fs.writeFileSync(DATA_FILE, updated);
      console.log(`\n📝 js/data.js updated — ${ok.length} paths changed to local WebP`);
      console.log('   Run: node build.js');
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
