// ===== ANALYTICS — Most Computers =====
// GA4 + Meta Pixel + dev console
// Load order: after main.js (last) so all functions are defined
// ======================================

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────────────
  const IS_DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const GA4_ID = 'G-XXXXXXXXXX'; // замени с реален Measurement ID от GA4
  const FB_PIXEL = ''; // опционален Meta Pixel ID

  // ── Core trackEvent ──────────────────────────────────────────────────────────
  function trackEvent(eventName, data) {
    const payload = Object.assign({ timestamp: Date.now() }, data || {});

    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, payload);
    }

    // Meta Pixel
    if (typeof fbq === 'function' && FB_PIXEL) {
      fbq('trackCustom', eventName, payload);
    }

    // Dev console
    if (IS_DEV) {
      console.log('%c[Analytics]%c ' + eventName, 'color:#bd1105;font-weight:700', 'color:inherit', payload);
    }

    // LocalStorage event log (capped at 200 entries — for debugging & simple analytics)
    try {
      const log = JSON.parse(localStorage.getItem('mc_analytics_log') || '[]');
      log.unshift({ event: eventName, data: payload });
      if (log.length > 200) log.length = 200;
      localStorage.setItem('mc_analytics_log', JSON.stringify(log));
    } catch (_) {}
  }

  // ── page_view ────────────────────────────────────────────────────────────────
  function trackPageView() {
    trackEvent('page_view', {
      page_title: document.title,
      page_location: location.href,
      referrer: document.referrer || '(direct)'
    });
  }

  // ── view_product ─────────────────────────────────────────────────────────────
  function hookOpenProductPage() {
    const _orig = window.openProductPage;
    if (typeof _orig !== 'function') return;
    window.openProductPage = function (id) {
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        trackEvent('view_product', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          brand: p.brand || '',
          currency: 'BGN'
        });
        // GA4 standard ecommerce
        if (typeof gtag === 'function') {
          gtag('event', 'view_item', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price }]
          });
        }
      }
      return result;
    };
  }

  // ── add_to_cart ───────────────────────────────────────────────────────────────
  function hookAddToCart() {
    const _orig = window.addToCart;
    if (typeof _orig !== 'function') return;
    window.addToCart = function (id) {
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        trackEvent('add_to_cart', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          brand: p.brand || '',
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'add_to_cart', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price, quantity: 1 }]
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'AddToCart', { content_ids: [p.id], content_name: p.name, value: p.price, currency: 'BGN' });
        }
      }
      return result;
    };
  }

  // ── remove_from_cart ─────────────────────────────────────────────────────────
  function hookRemoveFromCart() {
    const _orig = window.removeFromCart;
    if (typeof _orig !== 'function') return;
    window.removeFromCart = function (id) {
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      const result = _orig.apply(this, arguments);
      if (p) {
        trackEvent('remove_from_cart', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'remove_from_cart', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price }]
          });
        }
      }
      return result;
    };
  }

  // ── add_to_wishlist / remove_from_wishlist ────────────────────────────────────
  function hookToggleWishlist() {
    const _orig = window.toggleWishlist;
    if (typeof _orig !== 'function') return;
    window.toggleWishlist = function (id, e) {
      const wishlistBefore = (typeof wishlist !== 'undefined') ? wishlist.slice() : [];
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        const wasInWishlist = wishlistBefore.indexOf(id) !== -1;
        const eventName = wasInWishlist ? 'remove_from_wishlist' : 'add_to_wishlist';
        trackEvent(eventName, {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          currency: 'BGN'
        });
        if (!wasInWishlist && typeof fbq === 'function') {
          fbq('track', 'AddToWishlist', { content_ids: [p.id], content_name: p.name, value: p.price, currency: 'BGN' });
        }
      }
      return result;
    };
  }

  // ── begin_checkout ───────────────────────────────────────────────────────────
  function hookToggleCart() {
    const _orig = window.toggleCart;
    if (typeof _orig !== 'function') return;
    window.toggleCart = function () {
      const result = _orig.apply(this, arguments);
      const cartEl = document.getElementById('cartPanel');
      const isOpening = cartEl && cartEl.classList.contains('open');
      if (isOpening && typeof cart !== 'undefined' && cart.length > 0) {
        const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
        trackEvent('view_cart', {
          cart_total: Math.round(total * 100) / 100,
          item_count: cart.reduce((s, x) => s + x.qty, 0),
          currency: 'BGN'
        });
      }
      return result;
    };
  }

  function hookShowCheckoutStep() {
    const _orig = window.showCheckoutStep;
    if (typeof _orig !== 'function') return;
    window.showCheckoutStep = function (n) {
      const result = _orig.apply(this, arguments);
      if (n === 1 && typeof cart !== 'undefined') {
        const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
        const items = cart.map(x => ({ item_id: String(x.id), item_name: x.name, price: x.price, quantity: x.qty }));
        trackEvent('begin_checkout', {
          cart_total: Math.round(total * 100) / 100,
          item_count: cart.reduce((s, x) => s + x.qty, 0),
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'begin_checkout', { currency: 'BGN', value: total, items });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'InitiateCheckout', { value: total, currency: 'BGN', num_items: items.length });
        }
      }
      return result;
    };
  }

  // ── apply_promo ──────────────────────────────────────────────────────────────
  function hookApplyPromo() {
    const _orig = window.applyPromo;
    if (typeof _orig !== 'function') return;
    window.applyPromo = function (codeArg) {
      const codeBefore = typeof promoApplied !== 'undefined' ? promoApplied : false;
      const result = _orig.apply(this, arguments);
      const codeAfter = typeof promoApplied !== 'undefined' ? promoApplied : false;
      const code = (codeArg || '').trim().toUpperCase();
      if (!codeBefore && codeAfter) {
        const total = (typeof cart !== 'undefined') ? cart.reduce((s, x) => s + x.price * x.qty, 0) : 0;
        trackEvent('apply_promo', {
          promo_code: code,
          discount_pct: 10,
          discount_amount: Math.round(total * 0.10 * 100) / 100,
          currency: 'BGN'
        });
      } else if (!codeAfter && code) {
        trackEvent('promo_failed', { promo_code: code });
      }
      return result;
    };
  }

  // ── purchase ─────────────────────────────────────────────────────────────────
  function hookSubmitOrder() {
    const _orig = window.submitOrder;
    if (typeof _orig !== 'function') return;
    window.submitOrder = function () {
      // Snapshot cart before submit clears it
      const cartSnapshot = (typeof cart !== 'undefined') ? cart.map(x => ({
        item_id: String(x.id),
        item_name: x.name,
        item_category: x.cat,
        price: x.price,
        quantity: x.qty
      })) : [];
      const subtotal = cartSnapshot.reduce((s, x) => s + x.price * x.quantity, 0);
      const promo = (typeof promoApplied !== 'undefined' && promoApplied) ? subtotal * 0.10 : 0;
      const delivery = (typeof ckDeliveryCosts !== 'undefined' && typeof ckDeliveryIdx !== 'undefined')
        ? ckDeliveryCosts[ckDeliveryIdx] : 0;
      const total = Math.round((subtotal - promo + delivery) * 100) / 100;

      const result = _orig.apply(this, arguments);

      // Fire after a tick (submitOrder has a setTimeout internally)
      setTimeout(function () {
        const orderNumEl = document.getElementById('tyOrderNum');
        const orderNum = orderNumEl ? orderNumEl.textContent : 'unknown';
        trackEvent('purchase', {
          transaction_id: orderNum,
          value: total,
          subtotal: Math.round(subtotal * 100) / 100,
          discount: Math.round(promo * 100) / 100,
          shipping: delivery,
          currency: 'BGN',
          payment_method: (typeof ckPaymentType !== 'undefined') ? ckPaymentType : 'unknown',
          item_count: cartSnapshot.reduce((s, x) => s + x.quantity, 0)
        });
        if (typeof gtag === 'function') {
          gtag('event', 'purchase', {
            transaction_id: orderNum,
            currency: 'BGN',
            value: total,
            shipping: delivery,
            coupon: (typeof promoApplied !== 'undefined' && promoApplied) ? 'MOSTCOMP10' : '',
            items: cartSnapshot
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Purchase', { value: total, currency: 'BGN', num_items: cartSnapshot.length });
        }
      }, 600);

      return result;
    };
  }

  // ── search ───────────────────────────────────────────────────────────────────
  function hookSearch() {
    const _origFull = window.doFullSearch;
    if (typeof _origFull === 'function') {
      window.doFullSearch = function () {
        const q = (document.getElementById('searchInput') || {}).value || '';
        const result = _origFull.apply(this, arguments);
        if (q.trim()) {
          // Results count available after render — approximate with DOM query
          setTimeout(function () {
            const count = document.querySelectorAll('.srp-card').length;
            trackEvent('search', {
              search_term: q.trim(),
              results_count: count
            });
            if (typeof gtag === 'function') {
              gtag('event', 'search', { search_term: q.trim() });
            }
            // Track zero-result searches separately
            if (count === 0) {
              trackEvent('search_no_results', { search_term: q.trim() });
            }
          }, 200);
        }
        return result;
      };
    }
  }

  // ── view_category ─────────────────────────────────────────────────────────────
  function hookFilterCat() {
    const _orig = window.filterCat;
    if (typeof _orig !== 'function') return;
    window.filterCat = function (cat) {
      const result = _orig.apply(this, arguments);
      const label = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] : cat;
      trackEvent('view_category', {
        category: cat,
        category_label: label
      });
      return result;
    };
  }

  // ── Init: wire up all hooks ───────────────────────────────────────────────────
  function init() {
    hookOpenProductPage();
    hookAddToCart();
    hookRemoveFromCart();
    hookToggleWishlist();
    hookToggleCart();
    hookShowCheckoutStep();
    hookApplyPromo();
    hookSubmitOrder();
    hookSearch();
    hookFilterCat();
    trackPageView();

    if (IS_DEV) {
      console.log('%c[Analytics] Initialized — hooks active', 'color:#34c759;font-weight:700');
    }
  }

  // Run after DOM + app.js are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded already fired — defer one tick so app.js globals are set
    setTimeout(init, 0);
  }

  // ── Public API ───────────────────────────────────────────────────────────────
  window.mcTrack = trackEvent;
  window.mcAnalyticsLog = function () {
    try { return JSON.parse(localStorage.getItem('mc_analytics_log') || '[]'); } catch (_) { return []; }
  };
})();
