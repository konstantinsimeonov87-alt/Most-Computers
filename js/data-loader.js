(function () {
  window.products = [];
  window._productsReady = false;
  var _cbs = [];

  window._whenProducts = function (fn) {
    if (window._productsReady) fn();
    else _cbs.push(fn);
  };

  // Inject data.js as an async script so it doesn't block DOMContentLoaded.
  // Browser downloads it immediately (preload hint in <head>), executes async.
  var s = document.createElement('script');
  s.src = 'data.js?v=00000000';
  s.onload = function () {
    window._productsReady = true;
    _cbs.splice(0).forEach(function (fn) { fn(); });
  };
  document.head.appendChild(s);
}());
