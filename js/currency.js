// ===== CURRENCY =====
let EUR_RATE;
try { EUR_RATE = parseFloat(localStorage.getItem('eurRate')); } catch(e) {}
if (!EUR_RATE || isNaN(EUR_RATE)) EUR_RATE = 1.95583;
function toEur(bgn) { return bgn / EUR_RATE; }
function fmtEur(bgn) { return toEur(bgn).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €'; }
// Deprecated: BGN is no longer displayed anywhere on the site (Bulgaria uses EUR).
// Kept as a harmless unused utility in case some external/legacy caller still needs raw BGN formatting.
function fmtBgn(bgn) { return bgn.toLocaleString('bg-BG', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' лв.'; }
// Primary display: EUR only, bold
function fmtPrice(bgn, saleCls='') {
  return `<span class="price-eur-main${saleCls ? ' '+saleCls : ''}">${fmtEur(bgn)}</span><span class="price-vat-sub">с вкл. ДДС</span>`;
}
// EUR only (name kept for backwards compatibility with existing call sites)
function fmtDual(bgn) { return fmtEur(bgn); }

// Единен речник на категориите - canonical + legacy ключове
const CAT_LABELS = {
  all:'Всички продукти',
  laptops:'Лаптопи', desktops:'Настолни компютри', components:'Компоненти',
  peripherals:'Периферия', audio:'Аудио и слушалки', cameras:'Камери', network:'Мрежово оборудване', storage:'Памет и съхранение',
  software:'Софтуер', accessories:'Аксесоари', consumables:'Консумативи',
  sale:'Промоции', new:'Нови продукти',
  // Legacy ключове
  laptop:'Лаптопи', desktop:'Настолни компютри', gaming:'Гейминг',
  mobile:'Телефони', tablet:'Таблети',
  tv:'Телевизори', camera:'Фотоапарати', smart:'Смарт устройства',
  print:'Принтери', acc:'Аксесоари', monitor:'Монитори',
};

// HTML escape - използвай навсякъде преди вмъкване на user input в innerHTML
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EUR_RATE, toEur, fmtEur, fmtBgn, fmtPrice, fmtDual, escHtml };
}

// Cache viewport width to avoid forced reflow (window.innerWidth triggers layout when DOM is dirty).
// Read once before any DOM mutations, then update lazily on resize.
let _cachedInnerWidth = (typeof window !== 'undefined') ? window.innerWidth : 1280;
if (typeof window !== 'undefined') {
  window.addEventListener('resize', function() {
    _cachedInnerWidth = window.innerWidth;
  }, { passive: true });
}
