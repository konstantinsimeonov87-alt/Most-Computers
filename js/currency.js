// ===== CURRENCY =====
let EUR_RATE;
try { EUR_RATE = parseFloat(localStorage.getItem('eurRate')); } catch(e) {}
if (!EUR_RATE || isNaN(EUR_RATE)) EUR_RATE = 1.95583;
function toEur(bgn) { return bgn / EUR_RATE; }
function fmtEur(bgn) { return toEur(bgn).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €'; }
function fmtBgn(bgn) { return bgn.toLocaleString('bg-BG', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' лв.'; }
// Primary display: BGN bold, EUR muted below
function fmtPrice(bgn, saleCls='') {
  return `<span class="price-bgn-main${saleCls ? ' '+saleCls : ''}">${fmtBgn(bgn)}</span><span class="price-eur-sub">${fmtEur(bgn)}</span>`;
}
// Inline dual: "2.30 € / 4.49 лв."
function fmtDual(bgn) { return `${fmtEur(bgn)} / ${fmtBgn(bgn)}`; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EUR_RATE, toEur, fmtEur, fmtBgn, fmtPrice, fmtDual };
}
