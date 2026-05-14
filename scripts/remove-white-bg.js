#!/usr/bin/env node
/**
 * Remove white/near-white background from product images via edge flood-fill.
 * Usage:
 *   node scripts/remove-white-bg.js [file1.webp file2.webp ...]
 *   node scripts/remove-white-bg.js --all          (all images/products/*.webp)
 *   node scripts/remove-white-bg.js --ids=628,729  (by product ID)
 *
 * Strategy: BFS flood-fill from every edge pixel.
 * Only pixels connected to the edge that are "white-enough" are made transparent.
 * Preserves white logos/highlights inside the product silhouette.
 */

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const THRESHOLD  = 235;   // R,G,B each >= this → white-enough
const TOLERANCE  = 18;    // softer threshold for fringe pixels
const IMG_DIR    = path.join(__dirname, '../images/products');
const CONCURRENT = 8;

async function removeBg(filePath) {
  // Read into buffer so sharp never holds the file open
  const inputBuf = fs.readFileSync(filePath);

  const { data, info } = await sharp(inputBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const ch = 4;
  const visited = new Uint8Array(width * height);
  const queue   = [];

  const pxWhite = (x, y, thr) => {
    const i = (y * width + x) * ch;
    return data[i] >= thr && data[i + 1] >= thr && data[i + 2] >= thr;
  };

  // Seed: all edge pixels that are white-enough
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      if (!visited[y * width + x] && pxWhite(x, y, THRESHOLD)) {
        visited[y * width + x] = 1; queue.push(x, y);
      }
    }
  }
  for (let y = 1; y < height - 1; y++) {
    for (const x of [0, width - 1]) {
      if (!visited[y * width + x] && pxWhite(x, y, THRESHOLD)) {
        visited[y * width + x] = 1; queue.push(x, y);
      }
    }
  }

  // BFS 4-connected flood fill
  let qi = 0;
  while (qi < queue.length) {
    const x = queue[qi++];
    const y = queue[qi++];
    data[(y * width + x) * ch + 3] = 0;

    for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const ni = ny * width + nx;
      if (visited[ni]) continue;
      if (pxWhite(nx, ny, THRESHOLD - TOLERANCE)) {
        visited[ni] = 1; queue.push(nx, ny);
      }
    }
  }

  const outBuf = await sharp(Buffer.from(data), { raw: { width, height, channels: ch } })
    .webp({ quality: 85 })
    .toBuffer();

  fs.writeFileSync(filePath, outBuf);
}

async function pool(files, concurrency) {
  let i = 0, ok = 0, err = 0;
  const total = files.length;

  async function worker() {
    while (i < files.length) {
      const f = files[i++];
      try {
        await removeBg(f);
        ok++;
        if (ok % 50 === 0 || ok === total) process.stdout.write(`\r${ok}/${total} done…`);
      } catch (e) {
        err++;
        console.error(`\n❌ ${path.basename(f)}: ${e.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  process.stdout.write('\n');
  return { ok, err };
}

async function main() {
  const args = process.argv.slice(2);
  let files = [];

  if (args.includes('--all')) {
    files = fs.readdirSync(IMG_DIR)
      .filter(f => f.endsWith('.webp'))
      .map(f => path.join(IMG_DIR, f));
  } else {
    const idsArg = args.find(a => a.startsWith('--ids='));
    if (idsArg) {
      const src = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8')
        .replace(/^export\s+/m, '');
      eval(src);
      for (const pid of idsArg.slice(6).split(',').map(Number)) {
        const p = products.find(x => x.id === pid);
        if (!p || !p.img) { console.warn(`⚠ product ${pid} not found`); continue; }
        files.push(path.join(__dirname, '..', p.img.replace(/^\.\//, '')));
      }
    } else {
      files = args.map(a => path.resolve(a));
    }
  }

  if (!files.length) {
    console.error('Usage:\n  node scripts/remove-white-bg.js <file.webp ...>\n  node scripts/remove-white-bg.js --all\n  node scripts/remove-white-bg.js --ids=628,729');
    process.exit(1);
  }

  console.log(`Processing ${files.length} image(s) with concurrency=${CONCURRENT}…`);
  const { ok, err } = await pool(files, CONCURRENT);
  console.log(`Done: ${ok} OK${err ? `, ${err} errors` : ''}`);
}

main();
