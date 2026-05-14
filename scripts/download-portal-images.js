'use strict';
/**
 * Download portal.mostbg.com product images, convert to WebP at 300×300,
 * save to images/products/{id}.webp, and update data.js to use local paths.
 *
 * Usage: node scripts/download-portal-images.js [--limit N] [--concurrency N]
 */
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const DATA_FILE  = path.join(__dirname, '../js/data.js');
const IMG_DIR    = path.join(__dirname, '../images/products');
const CONCURRENCY = parseInt(process.argv.find(a => a.startsWith('--concurrency='))?.split('=')[1] || '8', 10);
const LIMIT       = parseInt(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] || '0', 10);
const DRY_RUN     = process.argv.includes('--dry-run');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuf(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode} for ${url}`)); }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
  });
}

async function processOne(id, ext) {
  const outPath = path.join(IMG_DIR, `${id}.webp`);
  if (fs.existsSync(outPath)) return 'skip';
  const url = `https://portal.mostbg.com/api/images/imageFileData/${id}.${ext}`;
  try {
    const buf = await fetchBuf(url);
    await sharp(buf)
      .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);
    return 'ok';
  } catch (e) {
    return `err:${e.message.slice(0, 60)}`;
  }
}

async function run() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  // Collect all unique portal image IDs from data.js
  const src = fs.readFileSync(DATA_FILE, 'utf8');
  const re  = /portal\.mostbg\.com\/api\/images\/imageFileData\/(\d+)\.(png|jpe?g|webp)/g;
  const targets = new Map(); // id → ext
  let m;
  while ((m = re.exec(src)) !== null) {
    if (!targets.has(m[1])) targets.set(m[1], m[2] === 'jpeg' ? 'jpeg' : 'png');
  }

  let list = [...targets.entries()].filter(([id]) => !fs.existsSync(path.join(IMG_DIR, `${id}.webp`)));
  console.log(`Portal images to download: ${list.length} (${targets.size} total, ${targets.size - list.length} already local)`);
  if (LIMIT > 0) { list = list.slice(0, LIMIT); console.log(`Limited to first ${LIMIT}`); }
  if (DRY_RUN) { console.log('Dry run — exiting'); return; }

  let ok = 0, skip = 0, errors = 0, done = 0;
  const total = list.length;

  async function worker(items) {
    for (const [id, ext] of items) {
      const result = await processOne(id, ext);
      done++;
      if (result === 'ok') ok++;
      else if (result === 'skip') skip++;
      else { errors++; if (errors <= 10) console.warn(`  WARN ${id}: ${result}`); }
      if (done % 50 === 0 || done === total) {
        process.stdout.write(`\r  Progress: ${done}/${total} — ok:${ok} skip:${skip} err:${errors}   `);
      }
      await sleep(50); // gentle rate limit
    }
  }

  // Chunk list for concurrency
  const chunkSize = Math.ceil(list.length / CONCURRENCY);
  const chunks = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    const chunk = list.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length) chunks.push(chunk);
  }

  await Promise.all(chunks.map(worker));
  console.log(`\n\nDone. Downloaded: ${ok}, Skipped: ${skip}, Errors: ${errors}`);

  if (ok === 0) { console.log('Nothing new to update in data.js'); return; }

  // Update data.js — replace portal URLs with local paths for newly downloaded images
  const existing = new Set(
    fs.readdirSync(IMG_DIR).filter(f => f.endsWith('.webp')).map(f => f.replace('.webp', ''))
  );
  let updated = fs.readFileSync(DATA_FILE, 'utf8');
  let replaced = 0;
  updated = updated.replace(
    /'(https?:\/\/portal\.mostbg\.com\/api\/images\/imageFileData\/(\d+)\.[a-z]+)'/g,
    (match, url, id) => {
      if (existing.has(id)) { replaced++; return `'./images/products/${id}.webp'`; }
      return match;
    }
  );
  fs.writeFileSync(DATA_FILE, updated);
  console.log(`Updated data.js: ${replaced} portal URLs → local WebP paths`);
  console.log('Next: node build.js && git add -A && git commit ...');
}

run().catch(e => { console.error(e); process.exit(1); });
