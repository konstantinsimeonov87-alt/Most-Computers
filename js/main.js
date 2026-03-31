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
  document.getElementById('contactPage').classList.remove('open');
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


// All scripts are deferred — DOM is ready, call directly
initDataActions();
initSidebarFilters();
renderGrids();
loadCart();
renderHpCats();
renderRecentlyDiscounted();
initSectionAnimations();
initScrollAnimations();
