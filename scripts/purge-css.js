/**
 * PurgeCSS step — run by build.js
 * Usage: node scripts/purge-css.js <input.css> <output.css> <root-dir>
 *
 * Removes unused CSS rules based on index.html + js/*.js content.
 * Source styles.css is never modified — only the output file is written.
 */
const { PurgeCSS } = require('purgecss');
const path = require('path');
const fs = require('fs');

const [,, inputCss, outputCss, rootDir] = process.argv;
if (!inputCss || !outputCss || !rootDir) {
  console.error('Usage: node purge-css.js <input> <output> <rootDir>');
  process.exit(1);
}

// PurgeCSS glob requires forward slashes (even on Windows)
const fwd = p => p.replace(/\\/g, '/');

new PurgeCSS().purge({
  content: [
    fwd(path.join(rootDir, 'index.html')),
    fwd(path.join(rootDir, 'js', '*.js')),
    fwd(path.join(rootDir, 'products.js'))
  ],
  css: [inputCss],
  safelist: {
    standard: [
      /^(open|active|show|is-|has-|anim|fading|error|valid|dark|loading|slide|fade|sticky|fixed|collapsed|selected|disabled|checked|focused|skeleton|spin|pulse|shine|shimmer|bounce|wave|flip|zoom|rotate|img-loading)/
    ],
    deep: [/open$/, /active$/, /show$/, /loading$/, /error$/, /valid$/, /visible$/, /hidden$/],
    greedy: [/^anim/, /^is-/, /^has-/]
  }
}).then(result => {
  const purgedCss = result[0].css;
  fs.writeFileSync(outputCss, purgedCss, 'utf8');
  const before = fs.statSync(inputCss).size;
  const after = Buffer.byteLength(purgedCss, 'utf8');
  process.stdout.write(`${(before / 1024).toFixed(1)}->${(after / 1024).toFixed(1)}KB(-${((before - after) / 1024).toFixed(1)}KB)\n`);
}).catch(err => {
  console.error('PurgeCSS error:', err.message);
  process.exit(1);
});
