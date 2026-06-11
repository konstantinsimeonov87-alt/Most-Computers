// Lazy bundle initialization - runs after app-lazy.js loads
// blogPosts (pages.js) is only available after lazy load - re-render hero panel so blog widget appears
// Calls functions deferred from main.js (cart badge was shown inline; full init runs here)
(function () {
  if (typeof renderHeroRightPanel === 'function') renderHeroRightPanel();
  if (typeof loadCart === 'function') loadCart();
  if (typeof _initFloatPill === 'function') _initFloatPill();
  if (typeof renderRecentlyDiscounted === 'function') {
    var el = document.getElementById('recentlyDiscountedGrid');
    if (el) renderRecentlyDiscounted();
  }
  // Replay any calls that arrived before lazy bundle finished loading
  if (typeof _drainLazyQueue === 'function') _drainLazyQueue();

  // URL + modal hooks that depend on lazy-bundle functions.
  // openProductModal and closeProductModalDirect are in gallery.js (lazy), so these
  // patches must run here, not in filters.js (critical).
  if (typeof openProductModal === 'function' && !openProductModal._lazyPatched) {
    var _baseOpenProductModal = openProductModal;
    openProductModal = function(id) {
      _baseOpenProductModal(id);
      if (typeof renderRelated === 'function') renderRelated(id);
      if (typeof renderAlsoBought === 'function') renderAlsoBought(id);
      if (typeof updatePdpShipBar === 'function') updatePdpShipBar();
      if (typeof updateURL === 'function') updateURL();
      document.dispatchEvent(new CustomEvent('mc:productopen', {detail: id}));
    };
    openProductModal._lazyPatched = true;
  }

  // Open admin panel directly via ?admin=1 (no login required)
  if (new URLSearchParams(location.search).get('admin') === '1') {
    if (typeof openAdminPage === 'function') openAdminPage();
  }

  if (typeof closeProductModalDirect === 'function' && !closeProductModalDirect._lazyPatched) {
    var _baseCloseProductModalDirect = closeProductModalDirect;
    closeProductModalDirect = function() {
      _baseCloseProductModalDirect();
      if (document.getElementById('catPage')?.classList.contains('open') ||
          document.getElementById('pdpBackdrop')?.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      }
      var params = new URLSearchParams(location.search);
      params.delete('product');
      var qs = params.toString();
      history.replaceState(null, '', qs ? (location.pathname + '?' + qs) : location.pathname);
    };
    closeProductModalDirect._lazyPatched = true;
  }
}());
