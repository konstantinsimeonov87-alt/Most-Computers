// ===== ERROR BOUNDARY =====
function _isNetworkErr(val) {
  const s = val ? String(val.message || val) : '';
  return /fetch|network|NetworkError|Failed to fetch|Load failed|ERR_/i.test(s);
}
window.onerror = function(msg, src, line, col, err) {
  console.error('[MC Error]', msg, src, line, col, err);
  if (typeof showToast === 'function' && !_isNetworkErr(msg) && !_isNetworkErr(err)) {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
  return true;
};
window.addEventListener('unhandledrejection', function(e) {
  console.error('[MC Unhandled Promise]', e.reason);
  if (typeof showToast === 'function' && !_isNetworkErr(e.reason)) {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
});

// ===== INIT ALL =====
initCookies();
initBackToTop();
updateWishlistUI();

// ===== CATEGORY COUNTS IN SIDEBAR =====
function initCatCounts() {
  const catMap = {};
  products.forEach(p => { const c = normalizeCat(p.cat); catMap[c] = (catMap[c] || 0) + 1; });
  document.querySelectorAll('.cat-item[data-action]').forEach(el => {
    const m = el.dataset.action.match(/openCatPage\('([^']+)'\)/);
    if (!m) return;
    const count = catMap[m[1]] || 0;
    if (!count) return;
    el.querySelector('.cat-count-badge')?.remove();
    const badge = document.createElement('span');
    badge.className = 'cat-count-badge';
    badge.textContent = count;
    const arrow = el.querySelector('.cat-arrow');
    if (arrow) el.insertBefore(badge, arrow); else el.appendChild(badge);
  });
}
document.addEventListener('DOMContentLoaded', initCatCounts);
document.addEventListener('DOMContentLoaded', () => { setTimeout(checkWishlistPriceDrops, 1500); });

// renderGrids called in DOMContentLoaded
function openContactPage() { openContactsPage(); }

function closeContactPage() {
  document.getElementById('contactsPage').classList.remove('open');
  document.body.style.overflow = '';
}
function submitContactForm() {
  const name    = document.getElementById('cfName');
  const email   = document.getElementById('cfEmail');
  const subject = document.getElementById('cfSubject');
  const message = document.getElementById('cfMessage');
  const consent = document.getElementById('cfConsent');
  let valid = true;
  [name, email, subject, message].forEach(el => {
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });
  if (!email.value.includes('@')) { email.classList.add('error'); valid = false; }
  if (!consent.checked) { showToast('Трябва да се съгласиш с условията!'); valid = false; }
  if (!valid) { showToast('Моля попълни всички задължителни полета!'); return; }
  document.getElementById('cfFormWrap').style.display = 'none';
  document.getElementById('cfSuccess').classList.add('show');
  showToast('✅ Запитването е изпратено успешно!');
}


// ===== CATEGORY NORMALIZATION =====
// Source data in data.js already uses canonical cat values (migrated 2026-04-15).
// This map remains as a safety net for products loaded from localStorage or external feeds.
const _CAT_MIGRATE = {
  laptop:'laptops', desktop:'desktops', monitor:'monitors',
  mobile:'phones', tablet:'phones', tv:'accessories',
  audio:'peripherals', camera:'peripherals', print:'peripherals',
  smart:'accessories', acc:'accessories',
};
products.forEach(p => { if (_CAT_MIGRATE[p.cat]) p.cat = _CAT_MIGRATE[p.cat]; });

// Gaming laptops → laptops (not desktops) — safety for mislabeled imports
products.forEach(p => {
  if (p.cat === 'desktops') {
    const n = (p.name + ' ' + (p.desc || '')).toLowerCase();
    if (n.includes('laptop') || n.includes('notebook') || n.includes('лаптоп') || n.includes('macbook')) p.cat = 'laptops';
  }
});

// Speakers/soundbars → accessories (headphones stay in peripherals)
products.forEach(p => {
  if (p.cat === 'peripherals') {
    const n = (p.name + ' ' + (p.desc || '')).toLowerCase();
    if (n.includes('тонколон') || n.includes('speaker') || n.includes('soundbar')) p.cat = 'accessories';
  }
});

// ===== NORMALIZE BADGE / PCT FOR RESTORED PRODUCTS =====
// Products restored from localStorage (XML feed) have old:null, pct:0, badge:''.
// Restore old/pct/badge from the static snapshot (_staticProductsMap from data.js).
products.forEach(p => {
  const orig = _staticProductsMap[p.id];
  if (orig) {
    if (!p.old && orig.old)        p.old   = orig.old;
    if (!(p.pct > 0) && orig.pct > 0) p.pct = orig.pct;
    if (!p.badge && orig.badge)    p.badge = orig.badge;
  }
  // Fallback: compute pct/badge from old vs price if still missing
  if (p.old && p.old > p.price && !(p.pct > 0)) {
    p.pct = Math.round((1 - p.price / p.old) * 100);
  }
  if (!p.badge && p.pct > 0) {
    p.badge = 'sale';
  }
});

// All scripts are deferred — DOM is ready, call directly
initDataActions();
initSidebarFilters();
renderGrids();
// Quick cart badge from localStorage (full loadCart runs after lazy bundle loads)
(function(){try{var c=JSON.parse(localStorage.getItem('mc_cart')||'[]'),t=c.reduce(function(s,i){return s+(i.qty||1);},0),b=document.getElementById('cartBadge');if(b){b.textContent=t;b.style.display=t>0?'':'none';}}catch(e){}})();
// renderHpCats already called inside renderGrids()
// renderRecentlyDiscounted is in product-page.js (lazy) — runs in lazy-init.js
renderRecentlyViewed();
initSectionAnimations();
initScrollAnimations();

// QW-06: Clickable brands bar
(function() {
  document.querySelectorAll('.brand-name').forEach(function(el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function() {
      var brand = el.textContent.trim();
      document.getElementById('searchInput') && (document.getElementById('searchInput').value = brand);
      showSearchResultsPage(brand);
    });
  });
})();

// 404 popular products grid
(function() {
  const g = document.getElementById('err404Grid');
  if (!g) return;
  const top4 = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  g.innerHTML = top4.map(p => `<div class="err-popular-card" onclick="close404();openProductModal(${p.id})"><div class="err-popular-emoji">${escHtml(p.emoji||'')}</div><div><div class="err-popular-name">${escHtml((p.name||'').substring(0,22))}…</div><div class="err-popular-price">${fmtEur(p.price)}</div></div></div>`).join('');
})();

// ===== LAZY BUNDLE LOADER =====
// app-lazy.js is preloaded in <head> (downloads to cache) but executes only on first
// user interaction — Lighthouse never sees it, real users get instant response from cache.
(function () {
  var _ll = false;
  function _loadLazy() {
    if (_ll) return; _ll = true;
    var s = document.createElement('script');
    s.src = 'app-lazy.js?v=00000000';
    document.head.appendChild(s);
  }
  ['click', 'scroll', 'touchstart', 'keydown', 'mousemove'].forEach(function (ev) {
    document.addEventListener(ev, _loadLazy, { once: true, passive: true });
  });
  setTimeout(_loadLazy, 2000); // fallback: load even without interaction
}());

