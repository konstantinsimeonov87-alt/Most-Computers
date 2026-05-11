'use strict';
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const IDS_FILE = path.join(__dirname, '../tmp_flash_img_ids.txt');
const XML_FILE = path.join(__dirname, '../tmp_flash_feed.xml');
const OUT_DIR  = path.join(__dirname, '../images/products');

const ids = fs.readFileSync(IDS_FILE, 'utf8').split(',').map(s => s.trim()).filter(Boolean);

// Build ID -> URL map from XML
const xml = fs.readFileSync(XML_FILE, 'utf8');
const urlMap = {};
const re = /<pictureUrl>(https:\/\/portal\.mostbg\.com\/api\/images\/imageFileData\/(\d+)\.[^<]+)<\/pictureUrl>/g;
let m;
while ((m = re.exec(xml)) !== null) {
  urlMap[m[2]] = m[1];
}

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function processOne(id) {
  const outPath = path.join(OUT_DIR, id + '.webp');
  if (fs.existsSync(outPath)) return { id, status: 'skipped' };

  const url = urlMap[id];
  if (!url) return { id, status: 'no_url' };

  try {
    const buf = await download(url);
    await sharp(buf).resize(300, 300, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(outPath);
    return { id, status: 'ok' };
  } catch (e) {
    return { id, status: 'error', err: e.message };
  }
}

async function pool(items, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const item = items[i++];
      results.push(await processOne(item));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  console.log('🖼  Downloading ' + ids.length + ' flash product images...');
  const results = await pool(ids, 5);
  const ok      = results.filter(r => r.status === 'ok').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors  = results.filter(r => r.status === 'error');
  const noUrl   = results.filter(r => r.status === 'no_url').length;
  console.log('✅ Downloaded:', ok);
  console.log('⏭  Skipped (exist):', skipped);
  console.log('❓ No URL found:', noUrl);
  if (errors.length) {
    console.log('❌ Errors:', errors.length);
    errors.forEach(e => console.log('  ', e.id, e.err));
  }
}

main().catch(console.error);
