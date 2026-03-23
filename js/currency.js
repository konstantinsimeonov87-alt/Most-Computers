// ===== CURRENCY =====
let EUR_RATE = parseFloat(localStorage.getItem('eurRate')) || 1.95583; // 1 EUR = x BGN
function toEur(bgn) { return bgn / EUR_RATE; }
function fmtEur(bgn) { return toEur(bgn).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €'; }
function fmtBgn(bgn) { return bgn.toLocaleString('bg-BG', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' лв.'; }
// Primary display: EUR bold, BGN muted below
function fmtPrice(bgn, saleCls='') {
  return `<span class="price-eur${saleCls ? ' '+saleCls : ''}">${fmtEur(bgn)}</span><span class="price-bgn">${fmtBgn(bgn)}</span>`;
}
// Inline dual: "2.30 € / 4.49 лв."
function fmtDual(bgn) { return `${fmtEur(bgn)} / ${fmtBgn(bgn)}`; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EUR_RATE, toEur, fmtEur, fmtBgn, fmtPrice, fmtDual };
}
