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

  // Lazy-load product descriptions (data-details.js) after first interaction or 4s
  (function() {
    function _loadDesc() {
      if (window._descLoaded) return;
      window._descLoaded = true;
      var s = document.createElement('script');
      var coreTag = document.querySelector('script[src*="data-core.js"]') || document.querySelector('script[src*="data-slim.js"]');
      var ver = coreTag ? (coreTag.src.match(/\?v=(\d+)/) || [])[1] || '' : '';
      s.src = 'data-details.js' + (ver ? '?v=' + ver : '');
      s.onload = function() {
        if (typeof products !== 'undefined') {
          products.forEach(function(p) {
            if (!p.desc && window.productDesc && window.productDesc[p.id]) p.desc = window.productDesc[p.id];
            if (!p.ean && window.productEan && window.productEan[p.id]) p.ean = window.productEan[p.id];
            if (!p.gallery && window.productGallery && window.productGallery[p.id]) p.gallery = window.productGallery[p.id];
            if (!p.specs && window.productSpecs && window.productSpecs[p.id]) p.specs = window.productSpecs[p.id];
            if (!p.sku && window.productSku && window.productSku[p.id]) p.sku = window.productSku[p.id];
          });
          // If product page is already open, update description + EAN + SKU + gallery + specs in DOM
          if (typeof pdpProductId !== 'undefined' && pdpProductId) {
            var _p = products.find(function(x) { return x.id === pdpProductId; });
            if (_p) {
              var _el = document.getElementById('pdpHtmlContent');
              if (_p.desc && _el && _el.querySelector('p[style*="color:var(--muted)"]')) {
                _el.innerHTML = '';
                var _para = document.createElement('p');
                _para.style.cssText = 'font-size:14px;line-height:1.8;color:var(--text2);';
                _para.textContent = _p.desc;
                _el.appendChild(_para);
              }
              var _skuEl = document.getElementById('pdpSku');
              if (_p.sku && _skuEl && _skuEl.textContent === '-') {
                _skuEl.textContent = _p.sku;
              }
              var _eanEl = document.getElementById('pdpEan');
              if (_p.ean && _eanEl && (_eanEl.textContent === '-' || _eanEl.textContent === _p.sku)) {
                _eanEl.textContent = _p.ean;
              }
              // Gallery arrived late - re-render the thumbnail strip + main image
              if (_p.gallery && _p.gallery.length > 1 && typeof pdpRenderGallery === 'function') {
                pdpGallery = _p.gallery;
                pdpGalleryIdx = 0;
                pdpRenderGallery();
              }
              // Specs table arrived late - re-render now that specs/sku/ean are available
              // (the table always shows at least a SKU row, so there is no reliable "empty" markup to detect)
              var _tbody = document.getElementById('pdpSpecsTbody');
              if (_p.specs && Object.keys(_p.specs).length && _tbody) {
                var _se = function(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
                var specRows = '<tr><th scope="row">SKU / Part Number</th><td style="font-family:\'JetBrains Mono\',monospace;font-size:12px;">' + (_p.sku||'-') + '</td></tr>';
                if (_p.ean) specRows += '<tr><th scope="row">EAN / Баркод</th><td style="font-family:\'JetBrains Mono\',monospace;font-size:12px;">' + _p.ean + '</td></tr>';
                specRows += Object.entries(_p.specs).filter(function(e) { var s = String(e[1]||'').trim(); return s && s.toLowerCase() !== 'none'; }).map(function(e) { return '<tr><th scope="row">' + _se(e[0]) + '</th><td>' + _se(e[1]) + '</td></tr>'; }).join('');
                _tbody.innerHTML = specRows;
                var _warrEl = document.getElementById('pdpWarranty');
                var _w = _p.specs['Warranty'] || _p.specs['Гаранция'] || _p.specs['warrantyInMonths'];
                if (_w && _warrEl && _warrEl.textContent === '24 месеца') _warrEl.textContent = _w;
              }
            }
          }
        }
      };
      document.head.appendChild(s);
    }
    setTimeout(_loadDesc, 4000);
    ['mousemove', 'scroll', 'touchstart', 'keydown'].forEach(function(ev) {
      document.addEventListener(ev, function h() { _loadDesc(); document.removeEventListener(ev, h); }, {once: true, passive: true});
    });
  }());

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
