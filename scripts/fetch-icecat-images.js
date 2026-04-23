'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');

const USER = 'konstantin87';
const PASS = 'makosi1324';
const DATA_FILE = path.join(__dirname, '../js/data.js');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { resolve(null); } });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  let src = fs.readFileSync(DATA_FILE, 'utf8');

  // Split into individual product blocks — each starts with {id:
  // We'll collect targets by scanning for id, ean, img:null
  const targets = [];

  // Match each product block (from {id: to the closing })
  // Strategy: find all id: values, then for each check EAN and img:null presence
  const idPositions = [];
  const idRe = /\{id:(\d+),/g;
  let m;
  while ((m = idRe.exec(src)) !== null) {
    idPositions.push({ id: m[1], start: m.index });
  }

  for (let i = 0; i < idPositions.length; i++) {
    const start = idPositions[i].start;
    const end = i + 1 < idPositions.length ? idPositions[i + 1].start : src.length;
    const block = src.slice(start, end);

    const hasNullImg = /\bimg:null\b/.test(block);
    if (!hasNullImg) continue;

    const eanMatch = block.match(/\bean:'([0-9]{8,14})'/);
    if (!eanMatch) continue;

    targets.push({ id: idPositions[i].id, ean: eanMatch[1] });
  }

  console.log(`Found ${targets.length} products with img:null + valid EAN`);
  if (targets.length === 0) { console.log('Nothing to do.'); return; }

  let found = 0, notFound = 0;

  for (let i = 0; i < targets.length; i++) {
    const { id, ean } = targets[i];
    const url = `https://live.icecat.biz/api/?UserName=${USER}&Password=${PASS}&Language=EN&GTIN=${ean}`;

    try {
      const json = await fetchJson(url);
      const img = json?.data?.Image?.Pic500x500 || json?.data?.Image?.LowPic || null;

      if (img) {
        // Find the product block again (src may have changed) and replace img:null
        const blockRe = new RegExp(`(\\{id:${id},[\\s\\S]*?)\\bimg:null\\b`);
        src = src.replace(blockRe, `$1img:'${img}'`);
        found++;
        process.stdout.write(`[${i+1}/${targets.length}] ✓ id:${id} EAN:${ean}\n`);
      } else {
        notFound++;
        process.stdout.write(`[${i+1}/${targets.length}] ✗ id:${id} EAN:${ean} — not in Icecat\n`);
      }
    } catch (e) {
      notFound++;
      process.stdout.write(`[${i+1}/${targets.length}] ! id:${id} EAN:${ean} — ${e.message}\n`);
    }

    await sleep(350); // ~3 req/sec
  }

  fs.writeFileSync(DATA_FILE, src);
  console.log(`\nDone. ✓ Found: ${found} | ✗ Not found: ${notFound}`);
}

main().catch(console.error);
