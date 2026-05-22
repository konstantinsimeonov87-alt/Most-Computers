/**
 * split-app-modules.js
 * Разбива ../app.js на отделни модули в ../js/
 * Usage: node split-app-modules.js
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const root    = path.join(__dirname, '..');
const srcFile = path.join(root, 'app.js');
const outDir  = path.join(root, 'js');

const rawLines = fs.readFileSync(srcFile, 'utf8').split('\n');

/** Взима редове [start, end] (1-базирани, включително) */
function slice(start, end) {
  return rawLines.slice(start - 1, end).join('\n');
}

/** Конкатенира няколко диапазона с празен ред между тях */
function concat(...ranges) {
  return ranges.map(([s, e]) => slice(s, e)).join('\n\n');
}

// ─────────────────────────────────────────────
//  Дефиниция на модулите: { fileName: [[start,end], ...] }
// ─────────────────────────────────────────────
const modules = {

  // Валутни помощни функции
  'currency.js': [
    [1, 12],
  ],

  // Масив с продукти + споделено състояние (cart, compareList, и т.н.)
  'data.js': [
    [13, 85],
  ],

  // starsHTML + makeCard
  'cards.js': [
    [86, 127],
  ],

  // Количка + Checkout + Thank-you страница
  'cart.js': [
    [194, 424],
  ],

  // Галерия (слайдер, countdown, quick-order) + showToast
  'gallery.js': [
    [425, 658],
  ],

  // Live търсене
  'search.js': [
    [659, 940],
  ],

  // Автентикация + Wishlist
  'auth.js': [
    [941, 1222],
  ],

  // UI компоненти: skeleton, cookie, back-to-top, bottom-nav,
  //   dark mode, live chat, lazy images, hero swipe, megamenu, 404
  'ui.js': [
    [1223, 1314],  // skeleton + cookie + back-to-top + bottom-nav
    [1346, 1386],  // dark mode + live chat
    [1404, 1442],  // lazy image loading + touch swipe
    [1480, 1544],  // megamenu
    [2554, 2564],  // 404 page
  ],

  // Скорошно разгледани продукти
  'recently-viewed.js': [
    [1443, 1479],
  ],

  // Проследяване на поръчка
  'order-tracker.js': [
    [1545, 1653],
  ],

  // PWA инсталация + Push нотификации
  'pwa.js': [
    [1654, 1768],
    [5048, 5105],
  ],

  // Статични информационни страници (блог, услуги, доставка, контакти, отзиви, за нас)
  'pages.js': [
    [1769, 1847],  // blog / service / delivery
    [5106, 5180],  // contacts
    [5181, 5219],  // review form
    [5282, 5304],  // about page
  ],

  // Всички филтри: пилюли, страничен панел, цена, марки, подкатегории, URL параметри
  'filters.js': [
    [128,  193],   // getFilteredSorted, applyFilter, applySort, renderTopGrid, renderGrids
    [1387, 1403],  // price slider (SRP)
    [1848, 1854],  // ADVANCED SIDEBAR FILTERS header + variables
    [1923, 1955],  // initSidebarFilters
    [1960, 2042],  // toggleSfb, toggleBrandFilter, applyAdvFilters, resetAllFilters, filterCat
    [2565, 2701],  // sidebar price slider + brand fuzzy search + live results count
    [4063, 4420],  // subcategories, cat-specific filters + URL params
  ],

  // data-action система: migrate, runActionString, initDataActions
  'actions.js': [
    [1855, 1922],  // migrateInlineClickHandlers + runActionString + initDataActions
    [2043, 2049],  // module.exports (за съвместимост с тестовете)
  ],

  // Admin панел + продуктов редактор + XML инструменти
  'admin.js': [
    [2051, 2553],  // admin panel
    [2702, 2912],  // admin product editor
    [2913, 3238],  // XML import / export
    [3239, 3567],  // XML auto-update engine
    [3983, 4062],  // multi-feed manager
  ],

  // Страница на продукт: PDP, modal skeleton, gallery swipe,
  //   related carousel, image zoom, back-in-stock, sticky cart, recently discounted
  'product-page.js': [
    [3568, 3889],  // product page
    [4421, 4466],  // modal skeleton + gallery swipe
    [4467, 4512],  // related carousel
    [4611, 4638],  // image zoom
    [5220, 5281],  // back in stock + sticky add-to-cart + recently discounted
  ],

  // SEO: breadcrumbs, JSON-LD, sitemap, email protection, share
  'seo.js': [
    [3890, 3982],  // breadcrumbs
    [4513, 4591],  // JSON-LD + sitemap generator
    [4592, 4610],  // email protection
    [4639, 5047],  // share product (Web Share API)
  ],

  // Инициализация: INIT ALL + DOMContentLoaded handlers
  'main.js': [
    [1315, 1345],  // INIT ALL (initCookies, initBackToTop, updateWishlistUI)
    [1956, 1959],  // DOMContentLoaded → initDataActions + initSidebarFilters
    [5301, 5304],  // DOMContentLoaded → renderHpCats + renderRecentlyDiscounted
  ],
};

// ─────────────────────────────────────────────
//  Ред на зареждане в HTML (dependency order)
// ─────────────────────────────────────────────
const loadOrder = [
  'currency.js',
  'data.js',
  'cards.js',
  'ui.js',
  'gallery.js',
  'cart.js',
  'search.js',
  'auth.js',
  'recently-viewed.js',
  'filters.js',
  'order-tracker.js',
  'pwa.js',
  'admin.js',
  'product-page.js',
  'seo.js',
  'pages.js',
  'actions.js',
  'main.js',
];

// ─────────────────────────────────────────────
//  Запис на файловете
// ─────────────────────────────────────────────
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

for (const [fileName, ranges] of Object.entries(modules)) {
  const content = ranges.map(([s, e]) => slice(s, e)).join('\n\n');
  const outPath = path.join(outDir, fileName);
  fs.writeFileSync(outPath, content + '\n', 'utf8');
  const lines = content.split('\n').length;
  console.log(`✅  js/${fileName.padEnd(20)} (${lines} реда от ${ranges.length} диапазон${ranges.length > 1 ? 'а' : ''})`);
}

// ─────────────────────────────────────────────
//  Генериране на <script> тагове за HTML
// ─────────────────────────────────────────────
const scriptTags = loadOrder
  .map(f => `<script src="js/${f}" defer></script>`)
  .join('\n');

console.log('\n─────────────────────────────────────────────');
console.log('Замести в index.html.html:');
console.log('  <script src="app.js" defer></script>');
console.log('с:');
console.log(scriptTags);
console.log('─────────────────────────────────────────────');

// Запиши loadOrder в отделен файл за справка
fs.writeFileSync(
  path.join(outDir, '_load-order.txt'),
  loadOrder.map(f => `js/${f}`).join('\n') + '\n',
  'utf8'
);
console.log('\n✅  js/_load-order.txt записан.');
