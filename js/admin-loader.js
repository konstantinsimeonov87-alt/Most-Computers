// ── Lazy Admin Loader ────────────────────────────────────────────────────────
// admin.js (144 KB) се зарежда само когато потребителят отвори admin панела.
// Стубовете по-долу се заменят автоматично от реалните функции след зареждане.

let _adminLoaded = false;
let _adminLoading = false;
const _adminQueue = [];

function _loadAdminScript(cb) {
  if (_adminLoaded) { if (cb) cb(); return; }
  if (cb) _adminQueue.push(cb);
  if (_adminLoading) return;
  _adminLoading = true;
  const s = document.createElement('script');
  s.src = 'js/admin.js?v=' + (typeof SW_VERSION !== 'undefined' ? SW_VERSION : Date.now());
  s.onload = () => {
    _adminLoaded = true;
    _adminLoading = false;
    _adminQueue.splice(0).forEach(fn => fn());
  };
  s.onerror = () => {
    _adminLoading = false;
    showToast('⚠️ Грешка при зареждане на Admin панела');
  };
  document.head.appendChild(s);
}

// Stub — заменя се от реалната функция в admin.js след зареждане
function openAdminPage() {
  _loadAdminScript(() => {
    if (typeof openAdminPage === 'function') openAdminPage();
  });
}

// Stub — нужен на ui.js преди admin.js да се зареди
function closeAdminPage() {
  const page = document.getElementById('adminPage');
  if (page) page.style.display = 'none';
  document.body.style.overflow = '';
}
