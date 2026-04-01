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

// All scripts are deferred — DOM is ready, call directly
initDataActions();
initSidebarFilters();
renderGrids();
loadCart();
renderHpCats();
renderRecentlyDiscounted();
initSectionAnimations();
initScrollAnimations();
