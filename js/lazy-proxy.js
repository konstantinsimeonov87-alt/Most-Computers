// Stubs for functions that live in app-lazy.js.
// Queues calls made before the lazy bundle finishes loading, then replays them.
// Must be included in the critical bundle (app.js) before main.js.
(function () {
  var _q = [];

  // Called by lazy-init.js immediately after app-lazy.js executes
  window._drainLazyQueue = function () {
    var items = _q.splice(0);
    items.forEach(function (item) {
      if (typeof window[item.fn] === 'function') {
        window[item.fn].apply(window, item.args);
      }
    });
  };

  function _stub(name) {
    window[name] = function () {
      _q.push({ fn: name, args: Array.prototype.slice.call(arguments) });
    };
  }

  _stub('openProductPage');
  _stub('openProductModal');
  _stub('addToCart');
  _stub('openQuickOrder');
  _stub('toggleCompare');
  _stub('showSearchResultsPage');
  _stub('openBlogPost');
}());
