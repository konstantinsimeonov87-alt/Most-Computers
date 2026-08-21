/**
 * minify-one.js — minifies a single JS file with terser's API in its own
 * fresh process. build.js's minify loop used to call terser in-process
 * (after running tests, bundling, and stripping data.js beforehand), which
 * silently dropped whole top-level functions from large files with no
 * error - a fresh process per file avoids whatever accumulated state
 * caused that, matching every isolated repro that minified correctly.
 *
 * Usage: node scripts/minify-one.js <srcPath> <dstPath> [--source-map=<url>]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const Terser = require('terser');

const [srcPath, dstPath, mapArg] = process.argv.slice(2);
if (!srcPath || !dstPath) {
  console.error('Usage: node minify-one.js <srcPath> <dstPath> [--source-map=<url>]');
  process.exit(1);
}

const mapUrl = mapArg && mapArg.startsWith('--source-map=') ? mapArg.slice('--source-map='.length) : null;

const code = fs.readFileSync(srcPath, 'utf8');
const options = { compress: true, mangle: true };
if (mapUrl) options.sourceMap = { url: mapUrl };

const result = Terser.minify_sync(code, options);
if (result.error) {
  console.error(result.error.message || String(result.error));
  process.exit(1);
}

fs.writeFileSync(dstPath, result.code);
if (mapUrl && result.map) {
  fs.writeFileSync(dstPath + '.map', result.map);
}
