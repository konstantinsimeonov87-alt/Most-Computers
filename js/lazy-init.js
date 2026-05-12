// Lazy bundle initialization — runs after app-lazy.js loads
// Calls functions deferred from main.js (cart badge was shown inline; full init runs here)
(function () {
  if (typeof loadCart === 'function') loadCart();
  if (typeof renderRecentlyDiscounted === 'function') {
    var el = document.getElementById('recentlyDiscountedGrid');
    if (el) renderRecentlyDiscounted();
  }
}());
