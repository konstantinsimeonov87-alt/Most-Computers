/**
 * Build Script for Most Computers
 * Minifies JS, CSS, HTML into a dist/ folder
 * 
 * Usage: node build.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// Colors for console output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(msg) { console.log(`${GREEN}✅${RESET} ${msg}`); }
function warn(msg) { console.log(`${YELLOW}⚠️${RESET} ${msg}`); }
function err(msg) { console.log(`${RED}❌${RESET} ${msg}`); }

console.log(`\n${BOLD}🚀 Most Computers — Production Build${RESET}\n`);

// 1. Clean dist/
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });
fs.mkdirSync(path.join(DIST, 'js'), { recursive: true });
log('Cleaned dist/ directory');

// 2. Run tests
try {
  console.log('\n📋 Running tests...');
  execSync('npx jest --no-coverage', { stdio: 'inherit', cwd: ROOT });
  log('All tests passed');
} catch (e) {
  err('Tests failed! Aborting build.');
  process.exit(1);
}

// 3. Bundle app.js (critical) + app-lazy.js (non-critical) from source files
console.log('\n📦 Bundling app.js (critical) + app-lazy.js (lazy)...');
const DATA_SRC = 'js/data.js';

// Critical bundle — needed for initial page render
const APP_SOURCES = [
  'js/currency.js', 'js/cards.js', 'js/ui.js',
  'js/recently-viewed.js', 'js/filters.js', 'js/seo.js',
  'js/actions.js', 'js/auth.js', 'js/order-tracker.js',
  'js/lazy-proxy.js',
  'js/data-loader.js',
  'js/main.js',
];

// Lazy bundle — loaded on first user interaction (Lighthouse never sees it)
const LAZY_SOURCES = [
  'js/gallery.js', 'js/cart.js', 'js/search.js',
  'js/product-page.js', 'js/pdp-ux.js', 'js/pages.js',
  'js/pwa.js', 'js/admin-loader.js', 'js/analytics.js',
  'js/lazy-init.js',
];

const today = new Date().toISOString().slice(0,10).replace(/-/g,'');

// Build critical bundle
let bundle = APP_SOURCES.map(f => {
  if (!fs.existsSync(path.join(ROOT, f))) { err(`MISSING source: ${f}`); process.exit(1); }
  return fs.readFileSync(path.join(ROOT, f), 'utf8');
}).join('\n');
// Stamp lazy version reference inside app.js (main.js lazy loader)
bundle = bundle.replace(/app-lazy\.js\?v=\d{8}/g, `app-lazy.js?v=${today}`);
// Stamp data.js version reference inside data-loader.js
bundle = bundle.replace(/data\.js\?v=\d{8}/g, `data.js?v=${today}`);
fs.writeFileSync(path.join(ROOT, 'app.js'), bundle);
log(`app.js bundled — ${(bundle.length/1024).toFixed(0)} KB from ${APP_SOURCES.length} files (critical path)`);

// Build lazy bundle
const lazyBundle = LAZY_SOURCES.map(f => {
  if (!fs.existsSync(path.join(ROOT, f))) { err(`MISSING lazy source: ${f}`); process.exit(1); }
  return fs.readFileSync(path.join(ROOT, f), 'utf8');
}).join('\n');
fs.writeFileSync(path.join(ROOT, 'app-lazy.js'), lazyBundle);
log(`app-lazy.js bundled — ${(lazyBundle.length/1024).toFixed(0)} KB from ${LAZY_SOURCES.length} files (deferred)`);

// 4a. Strip null/empty fields from data.js before minification
console.log('\n🧹 Stripping null fields from data.js...');
const tmpDataPath = path.join(ROOT, '_tmp_data_stripped.js');
{
  let dataContent = fs.readFileSync(path.join(ROOT, DATA_SRC), 'utf8');
  const beforeStrip = dataContent.length;
  dataContent = dataContent
    .replace(/,\s*old\s*:\s*null/g, '')
    .replace(/,\s*pct\s*:\s*null/g, '')
    .replace(/,\s*badge\s*:\s*null/g, '')
    .replace(/,\s*reviews\s*:\s*\[\]/g, '')
    .replace(/,\s*ean\s*:\s*null/g, '');
  fs.writeFileSync(tmpDataPath, dataContent);
  log(`data.js stripped: ${(beforeStrip/1024).toFixed(0)} KB → ${(dataContent.length/1024).toFixed(0)} KB (-${((beforeStrip-dataContent.length)/1024).toFixed(0)} KB)`);
}

// 4. Minify JavaScript
console.log('\n📦 Minifying JavaScript...');
const jsFiles = [
  { src: 'products.js',           dst: 'products.js' },
  { src: '_tmp_data_stripped.js', dst: 'data.js' },
  { src: 'app.js',                dst: 'app.js' },
  { src: 'app-lazy.js',           dst: 'app-lazy.js' },
  { src: 'js/admin.js',           dst: 'js/admin.js' },
];
jsFiles.forEach(({ src, dst }) => {
  const srcPath = path.join(ROOT, src);
  const dstPath = path.join(DIST, dst);
  if (!fs.existsSync(srcPath)) { warn(`Skipping ${src} (not found)`); return; }
  const before = fs.statSync(srcPath).size;
  try {
    execSync(`npx -y terser "${srcPath}" -o "${dstPath}" --compress --mangle`, { cwd: ROOT });
    const after = fs.statSync(dstPath).size;
    const pct = Math.round((1 - after / before) * 100);
    log(`${src}: ${(before/1024).toFixed(1)} KB → ${(after/1024).toFixed(1)} KB (${pct}% smaller)`);
  } catch (e) {
    warn(`Failed to minify ${src}, copying as-is`);
    fs.copyFileSync(srcPath, dstPath);
  }
});
// Clean up temp file
if (fs.existsSync(tmpDataPath)) fs.unlinkSync(tmpDataPath);

// 4. PurgeCSS + Minify CSS
console.log('\n🎨 Purging + Minifying CSS...');
const cssSrc = path.join(ROOT, 'styles.css');
const cssDst = path.join(DIST, 'styles.css');
if (fs.existsSync(cssSrc)) {
  const before = fs.statSync(cssSrc).size;
  const tmpPurged = path.join(DIST, '_purged.css');
  // Step 4a: PurgeCSS via separate script (keeps build.js synchronous)
  try {
    const result = execSync(
      `node "scripts/purge-css.js" "styles.css" "dist/_purged.css" "."`,
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    if (fs.existsSync(tmpPurged)) {
      log(`styles.css purged: ${result}`);
    }
  } catch (purgeErr) {
    warn('PurgeCSS failed, using original');
    if (fs.existsSync(tmpPurged)) fs.unlinkSync(tmpPurged);
  }
  // Step 4b: Minify (purged if available, else original)
  const cssMinfySrc = fs.existsSync(tmpPurged) ? tmpPurged : cssSrc;
  try {
    execSync(`npx -y clean-css-cli "${cssMinfySrc}" -o "${cssDst}"`, { cwd: ROOT });
    if (fs.existsSync(tmpPurged)) fs.unlinkSync(tmpPurged);
    const after = fs.statSync(cssDst).size;
    const pct = Math.round((1 - after / before) * 100);
    log(`styles.css minified: → ${(after/1024).toFixed(1)} KB (${pct}% vs original)`);
  } catch (e) {
    warn('Failed to minify CSS, copying as-is');
    fs.copyFileSync(cssSrc, cssDst);
  }
}

// 5. Process HTML — stamp versions + minify into dist/
console.log('\n📝 Processing HTML...');
{
  let htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  htmlSrc = htmlSrc.replace(/app\.js\?v=\d{8}/g, `app.js?v=${today}`);
  htmlSrc = htmlSrc.replace(/app-lazy\.js\?v=\d{8}/g, `app-lazy.js?v=${today}`);
  htmlSrc = htmlSrc.replace(/data\.js\?v=\d{8}/g, `data.js?v=${today}`);
  fs.writeFileSync(path.join(ROOT, 'index.html'), htmlSrc);
  // Minify for dist/
  const htmlDistPath = path.join(DIST, 'index.html');
  const htmlSrcPath = path.join(ROOT, '_tmp_index.html');
  fs.writeFileSync(htmlSrcPath, htmlSrc);
  const before = Buffer.byteLength(htmlSrc, 'utf8');
  try {
    execSync(
      `npx html-minifier-terser "${htmlSrcPath}" --output "${htmlDistPath}" ` +
      `--remove-comments --collapse-whitespace --remove-redundant-attributes ` +
      `--remove-empty-attributes --minify-css true --keep-closing-slash`,
      { cwd: ROOT }
    );
    fs.unlinkSync(htmlSrcPath);
    const after = fs.statSync(htmlDistPath).size;
    const pct = Math.round((1 - after / before) * 100);
    log(`index.html minified: ${(before/1024).toFixed(1)} KB → ${(after/1024).toFixed(1)} KB (${pct}% smaller)`);
  } catch (e) {
    warn('HTML minification failed, copying as-is: ' + e.message);
    if (fs.existsSync(htmlSrcPath)) fs.unlinkSync(htmlSrcPath);
    fs.writeFileSync(htmlDistPath, htmlSrc);
  }
}

// 6. Bump SW cache version and copy static assets
console.log('\n📁 Copying assets...');

// Auto-bump sw.js cache version on every build
const swPath = path.join(ROOT, 'sw.js');
if (fs.existsSync(swPath)) {
  const newVer = require('crypto').randomBytes(4).toString('hex');
  let swSrc = fs.readFileSync(swPath, 'utf8');
  swSrc = swSrc
    .replace(/\/\/ Most Computers — Service Worker [a-f0-9]+/, `// Most Computers — Service Worker ${newVer}`)
    .replace(/const CACHE = 'mc-[a-f0-9]+';/, `const CACHE = 'mc-${newVer}';`);
  fs.writeFileSync(swPath, swSrc);
  log(`sw.js cache version bumped → mc-${newVer}`);
}

['manifest.json', 'sw.js', 'robots.txt', 'og-default.jpg', '404.html'].forEach(f => {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, f));
    log(`Copied ${f}`);
  }
});

// 6a. Generate sitemap.xml dynamically from products.js + data.js
console.log('\n🗺️  Generating sitemap.xml...');
try {
  const prodSrc = fs.readFileSync(path.join(ROOT, 'products.js'), 'utf8');
  const dataSrc = fs.existsSync(path.join(ROOT, 'js/data.js'))
    ? fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8')
    : '';
  // Extract all unique categories from both files (single-quoted JS or double-quoted JSON)
  const catReSingle = /\bcat\s*:\s*'([^']+)'/g;
  const catReDouble = /"cat"\s*:\s*"([^"]+)"/g;
  const allCatMatches = [
    ...[...prodSrc.matchAll(catReSingle)].map(m => m[1]),
    ...[...dataSrc.matchAll(catReSingle)].map(m => m[1]),
    ...[...dataSrc.matchAll(catReDouble)].map(m => m[1]),
  ];
  const cats = [...new Set(allCatMatches)];
  // Subcat map — extend when new subcats are added to js/filters.js
  const SUBCATS = {
    laptop: ['gaming_laptop', 'ultrabook', 'chromebook', 'workstation'],
    consumables: ['laser_toner', 'inkjet'],
  };
  const BASE = 'https://mostcomputers.bg';
  const today = new Date().toISOString().split('T')[0];
  const staticUrls = [
    { loc: BASE + '/', priority: '1.0', freq: 'daily' },
    { loc: BASE + '/?page=about', priority: '0.7', freq: 'monthly' },
    { loc: BASE + '/?page=contacts', priority: '0.8', freq: 'monthly' },
    { loc: BASE + '/?page=blog', priority: '0.6', freq: 'weekly' },
    { loc: BASE + '/?page=service', priority: '0.7', freq: 'monthly' },
    { loc: BASE + '/?page=delivery', priority: '0.7', freq: 'monthly' },
  ];
  const catUrls = cats.map(c => ({ loc: BASE + `/?cat=${c}`, priority: '0.9', freq: 'daily' }));
  const subcatUrls = cats.flatMap(c =>
    (SUBCATS[c] || []).map(s => ({ loc: BASE + `/?cat=${c}&subcat=${s}`, priority: '0.5', freq: 'weekly' }))
  );
  // Extract product IDs for individual product URLs
  const productIds = [...prodSrc.matchAll(/\bid\s*:\s*(\d+)/g)].map(m => m[1]);
  const productUrls = productIds.map(id => ({ loc: BASE + `/?product=${id}`, priority: '0.8', freq: 'weekly' }));

  const allUrls = [...staticUrls, ...catUrls, ...subcatUrls, ...productUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    allUrls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')
  }\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  log(`sitemap.xml: ${allUrls.length} URLs (${staticUrls.length} static, ${catUrls.length} categories, ${productUrls.length} products)`);
} catch (sitemapErr) {
  warn('sitemap.xml generation failed: ' + sitemapErr.message);
  // Fallback: copy static sitemap
  const staticSm = path.join(ROOT, 'sitemap.xml');
  if (fs.existsSync(staticSm)) { fs.copyFileSync(staticSm, path.join(DIST, 'sitemap.xml')); log('Copied sitemap.xml (static fallback)'); }
}

// Copy supabase-client.js (not bundled in app.js — loaded separately)
const sbClientSrc = path.join(ROOT, 'js/supabase-client.js');
if (fs.existsSync(sbClientSrc)) {
  fs.copyFileSync(sbClientSrc, path.join(DIST, 'js/supabase-client.js'));
  log('Copied js/supabase-client.js');
}

// Copy images directory if exists
const imgDir = path.join(ROOT, 'images');
if (fs.existsSync(imgDir)) {
  fs.cpSync(imgDir, path.join(DIST, 'images'), { recursive: true });
  log('Copied images/');
}

// Copy icons directory (PWA app icons)
const iconsDir = path.join(ROOT, 'icons');
if (fs.existsSync(iconsDir)) {
  fs.cpSync(iconsDir, path.join(DIST, 'icons'), { recursive: true });
  log('Copied icons/');
}

// 7. Summary
console.log(`\n${BOLD}📊 Build Summary${RESET}`);
let totalSize = 0;
['app.js', 'products.js', 'styles.css', 'index.html'].forEach(f => {
  const fp = path.join(DIST, f);
  if (fs.existsSync(fp)) {
    const size = fs.statSync(fp).size;
    totalSize += size;
    console.log(`  ${f.padEnd(20)} ${(size/1024).toFixed(1)} KB`);
  }
});
console.log(`  ${'─'.repeat(35)}`);
console.log(`  ${'TOTAL'.padEnd(20)} ${(totalSize/1024).toFixed(1)} KB`);
console.log(`\n${GREEN}${BOLD}✅ Build complete!${RESET} Output in ${BOLD}dist/${RESET}`);
console.log(`   Run: ${YELLOW}npx http-server dist/ -p 3333 -c-1${RESET}\n`);
