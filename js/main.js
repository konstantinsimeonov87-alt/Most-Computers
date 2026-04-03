// ===== ERROR BOUNDARY =====
window.onerror = function(msg, src, line, col, err) {
  console.error('[MC Error]', msg, src, line, col, err);
  if (typeof showToast === 'function') {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
  return true; // prevent default browser error
};
window.addEventListener('unhandledrejection', function(e) {
  console.error('[MC Unhandled Promise]', e.reason);
  if (typeof showToast === 'function') {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
});

// ===== INIT ALL =====
initCookies();
initBackToTop();
updateWishlistUI();

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


// ===== CATEGORY ARCHITECTURE MIGRATION =====
// Category architecture migration
const _CAT_MIGRATE = {
  laptop:'laptops', desktop:'desktops',
  monitor:'peripherals', gaming:'desktops',
  mobile:'accessories', tablet:'accessories',
  tv:'accessories', audio:'peripherals',
  camera:'accessories', print:'peripherals',
  smart:'accessories', network:'network',
  storage:'storage', acc:'accessories',
  components:'components'
};
products.forEach(p => { if(_CAT_MIGRATE[p.cat]) p.cat = _CAT_MIGRATE[p.cat]; });

// Gaming laptops → laptops (not desktops)
products.forEach(p => {
  if(p.cat === 'desktops') {
    const n = (p.name+' '+(p.desc||'')).toLowerCase();
    if(n.includes('laptop') || n.includes('notebook') || n.includes('лаптоп') || n.includes('macbook')) p.cat = 'laptops';
  }
});

// Audio speakers → accessories, headphones stay in peripherals
products.forEach(p => {
  if(p.cat === 'peripherals') {
    const n = (p.name+' '+(p.desc||'')).toLowerCase();
    if(n.includes('тонколон') || n.includes('speaker') || n.includes('soundbar')) p.cat = 'accessories';
  }
});

// ===== NORMALIZE BADGE / PCT FOR RESTORED PRODUCTS =====
// Products restored from localStorage (XML feed) have pct:0 and no badge.
// Recompute them so flash-sale, special-offers and new-products sections render correctly.
products.forEach(p => {
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
loadCart();
renderHpSubcatsStrip();
renderRecentlyDiscounted();
renderRecentlyViewed();
initSectionAnimations();
initScrollAnimations();

// 404 popular products grid
(function() {
  const g = document.getElementById('err404Grid');
  if (!g) return;
  const top4 = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  g.innerHTML = top4.map(p => `<div class="err-popular-card" onclick="close404();openProductModal(${p.id})"><div class="err-popular-emoji">${p.emoji}</div><div><div class="err-popular-name">${p.name.substring(0,22)}…</div><div class="err-popular-price">${p.price} лв.</div></div></div>`).join('');
})();

// Admin panel button — lazy-loads js/admin.js on first click
(function() {
  const pdDivider = document.querySelector('.pd-divider');
  if (!pdDivider) return;
  const adminBtn = document.createElement('button');
  adminBtn.type = 'button';
  adminBtn.className = 'pd-item';
  adminBtn.innerHTML = '<span class="pd-icon">🔐</span>Admin панел';
  adminBtn.onclick = function() {
    closeDropdown();
    if (window._adminScriptLoaded) { openAdminPage(); return; }
    window._adminScriptLoaded = true;
    const s = document.createElement('script');
    s.src = 'js/admin.js';
    s.onerror = function() {
      window._adminScriptLoaded = false;
      showToast('⚠️ Грешка при зареждане на Admin панела.');
    };
    s.onload = function() { openAdminPage(); };
    document.head.appendChild(s);
  };
  pdDivider.parentNode.insertBefore(adminBtn, pdDivider);
})();
