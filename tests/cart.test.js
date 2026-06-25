'use strict';
/**
 * Тестове за количка (js/cart.js)
 * Покрива: addToCart, removeFromCart, changeQty
 */

// ── глобали, нужни на cart.js ────────────────────────────────────────────────
global.EUR_RATE = 1.95583;
const EUR_RATE = global.EUR_RATE;
global.fmtEur = (bgn) => (bgn / EUR_RATE).toFixed(2) + ' €';
global.fmtBgn = (bgn) => Number(bgn).toFixed(2) + ' лв.';
global.showToast = jest.fn();
global.currentUser = null;
global.escHtml = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const PRODUCTS = [
  { id: 1, name: 'Sony WH-1000XM6', price: 449, old: 549, badge: 'sale', pct: 18, emoji: '🎧', brand: 'Sony', cat: 'audio', rating: 4.9, rv: 124 },
  { id: 2, name: 'iPhone 16 Pro Max', price: 2599, old: null, badge: 'new', pct: 0,  emoji: '📱', brand: 'Apple', cat: 'mobile', rating: 4.8, rv: 89  },
];

function setupCartDOM() {
  document.body.innerHTML = `
    <span  id="cartBadge"></span>
    <span  id="cartTotal"></span>
    <span  id="bnCartBadge" class=""></span>
    <div   id="cartBody"></div>
  `;
}

const { addToCart, removeFromCart, changeQty, updateFloatPill, loadCart, saveCart, undoRemoveCart } = require('../../js/cart.js');

// ── addToCart ────────────────────────────────────────────────────────────────
describe('addToCart', () => {
  beforeEach(() => {
    setupCartDOM();
    global.products = [...PRODUCTS];
    global.cart = [];
  });

  test('добавя нов продукт в количката', () => {
    addToCart(1);
    expect(global.cart).toHaveLength(1);
    expect(global.cart[0].id).toBe(1);
    expect(global.cart[0].qty).toBe(1);
  });

  test('увеличава qty при повторно добавяне на същия продукт', () => {
    addToCart(1);
    addToCart(1);
    expect(global.cart).toHaveLength(1);
    expect(global.cart[0].qty).toBe(2);
  });

  test('добавя различни продукти като отделни редове', () => {
    addToCart(1);
    addToCart(2);
    expect(global.cart).toHaveLength(2);
  });

  test('игнорира непознат id', () => {
    addToCart(999);
    expect(global.cart).toHaveLength(0);
  });

  test('обновява cartBadge', () => {
    addToCart(1);
    addToCart(2);
    expect(document.getElementById('cartBadge').textContent).toBe('2');
  });

  test('копира данните на продукта в количката', () => {
    addToCart(1);
    expect(global.cart[0].name).toBe('Sony WH-1000XM6');
    expect(global.cart[0].price).toBe(449);
  });
});

// ── removeFromCart ───────────────────────────────────────────────────────────
describe('removeFromCart', () => {
  beforeEach(() => {
    setupCartDOM();
    global.products = [...PRODUCTS];
    global.cart = [
      { ...PRODUCTS[0], qty: 1 },
      { ...PRODUCTS[1], qty: 2 },
    ];
  });

  test('премахва правилния продукт', () => {
    removeFromCart(1);
    expect(global.cart).toHaveLength(1);
    expect(global.cart[0].id).toBe(2);
  });

  test('не хвърля грешка при непознат id', () => {
    expect(() => removeFromCart(999)).not.toThrow();
    expect(global.cart).toHaveLength(2);
  });

  test('обновява cartBadge след премахване', () => {
    removeFromCart(2);
    expect(document.getElementById('cartBadge').textContent).toBe('1');
  });
});

// ── changeQty ────────────────────────────────────────────────────────────────
describe('changeQty', () => {
  beforeEach(() => {
    setupCartDOM();
    global.products = [...PRODUCTS];
    global.cart = [{ ...PRODUCTS[0], qty: 2 }];
  });

  test('увеличава количеството', () => {
    changeQty(1, 1);
    expect(global.cart[0].qty).toBe(3);
  });

  test('намалява количеството', () => {
    changeQty(1, -1);
    expect(global.cart[0].qty).toBe(1);
  });

  test('премахва продукта когато qty падне до 0', () => {
    changeQty(1, -2);
    expect(global.cart).toHaveLength(0);
  });

  test('игнорира непознат id', () => {
    changeQty(999, 1);
    expect(global.cart[0].qty).toBe(2); // непроменено
  });
});

// ── FREE_SHIP_BGN = 200 ───────────────────────────────────────────────────────
describe('FREE_SHIP_BGN = 200', () => {
  const CHEAP = { id: 99, name: 'Кабел USB', price: 15, old: null, badge: null, pct: 0, emoji: '🔌', brand: 'Generic', cat: 'accessories', rating: 4.0, rv: 5 };

  beforeEach(() => {
    setupCartDOM();
    global.products = [...PRODUCTS, CHEAP];
    global.cart = [];
  });

  // FREE_SHIP_BGN = Math.round(100 * 1.95583 * 100) / 100 = 195.58 лв.
  test('под прага (< 195.58 лв.) показва хинт "за безплатна доставка!"', () => {
    addToCart(99); // 15 лв.
    const body = document.getElementById('cartBody').innerHTML;
    expect(body).toContain('за безплатна доставка!');
    expect(body).not.toContain('Имаш безплатна доставка!');
  });

  test('над прага (≥ 195.58 лв.) показва "Имаш безплатна доставка!"', () => {
    addToCart(1); // 449 лв.
    expect(document.getElementById('cartBody').innerHTML).toContain('Имаш безплатна доставка!');
  });

  test('точно на прага (195.58 лв.) показва "Имаш безплатна доставка!"', () => {
    const AT_THRESHOLD = { id: 98, name: 'Продукт 195.58', price: 195.58, old: null, badge: null, pct: 0, emoji: '📦', brand: 'Test', cat: 'acc', rating: 4.0, rv: 1 };
    global.products = [...PRODUCTS, AT_THRESHOLD];
    addToCart(98); // точно 195.58 лв.
    expect(document.getElementById('cartBody').innerHTML).toContain('Имаш безплатна доставка!');
  });

  test('хинтът показва точната оставаща сума', () => {
    addToCart(99); // 15 лв. → трябват (195.58 - 15) / 1.95583 ≈ 92.33 €
    const rem = ((195.58 - 15) / 1.95583).toFixed(2);
    expect(document.getElementById('cartBody').innerHTML).toContain(rem + ' €');
  });
});

// ── updateFloatPill qty controls ─────────────────────────────────────────────
describe('updateFloatPill qty controls', () => {

  function setupPillDOM() {
    document.body.innerHTML = `
      <span id="cartBadge"></span>
      <span id="cartTotal"></span>
      <span id="bnCartBadge"></span>
      <div id="cartBody"></div>
      <div id="cartPage" style="display:none"></div>
      <div id="checkoutPage"></div>
      <div id="cartPanel"></div>
      <div id="pdpBackdrop"></div>
      <div id="floatCartPill" class="fcp">
        <div id="floatCartDropdown" class="fcp-dropdown">
          <div id="floatCartItems" class="fcp-items"></div>
          <div class="fcp-footer">
            <button class="fcp-checkout-btn"></button>
          </div>
        </div>
        <button id="floatCartBtn" class="fcp-pill" aria-expanded="false">
          <span id="floatCartCount">0</span>
          <span class="fcp-label">продукта</span>
          <span id="floatCartTotal">0.00 €</span>
          <svg class="fcp-arrow"></svg>
        </button>
      </div>
      <button id="backToTop"></button>
    `;
  }

  beforeEach(() => {
    setupPillDOM();
    global.products = [...PRODUCTS];
    global.cart = [{ ...PRODUCTS[0], qty: 3 }];
    global.changeQty = changeQty;
    global.saveCart = jest.fn();
  });

  test('рендерира fcp-qty-btn бутони за всеки продукт', () => {
    updateFloatPill();
    const btns = document.querySelectorAll('.fcp-qty-btn');
    expect(btns.length).toBe(2); // − и + за един продукт
  });

  test('показва правилното количество в fcp-qty-num', () => {
    updateFloatPill();
    const num = document.querySelector('.fcp-qty-num');
    expect(num).not.toBeNull();
    expect(num.textContent).toBe('3');
  });

  test('рендерира fcp-item-foot с qty-ctrl и price', () => {
    updateFloatPill();
    const foot = document.querySelector('.fcp-item-foot');
    expect(foot).not.toBeNull();
    expect(foot.querySelector('.fcp-item-qty-ctrl')).not.toBeNull();
    expect(foot.querySelector('.fcp-item-price')).not.toBeNull();
  });

  test('− бутонът намалява qty при клик', () => {
    updateFloatPill();
    const minusBtn = document.querySelector('.fcp-qty-btn');
    minusBtn.click();
    expect(global.cart[0].qty).toBe(2);
  });

  test('+ бутонът увеличава qty при клик', () => {
    updateFloatPill();
    const plusBtn = document.querySelectorAll('.fcp-qty-btn')[1];
    plusBtn.click();
    expect(global.cart[0].qty).toBe(4);
  });

  test('при qty=1 клик − премахва продукта', () => {
    global.cart = [{ ...PRODUCTS[0], qty: 1 }];
    updateFloatPill();
    const minusBtn = document.querySelector('.fcp-qty-btn');
    minusBtn.click();
    expect(global.cart).toHaveLength(0);
  });

  test('× бутонът премахва продукта директно', () => {
    global.removeFromCart = removeFromCart;
    updateFloatPill();
    const removeBtn = document.querySelector('.fcp-remove-btn');
    expect(removeBtn).not.toBeNull();
    removeBtn.click();
    expect(global.cart).toHaveLength(0);
  });

  test('pill показва compact формат за суми ≥ 10000', () => {
    global.cart = [{ ...PRODUCTS[1], qty: 4 }]; // 4 × 2599 лв. = 10396 лв. → ~5316 €
    updateFloatPill();
    const totalText = document.getElementById('floatCartTotal').textContent;
    expect(totalText).not.toMatch(/,\d{2} €$/); // без центове
    expect(totalText).toMatch(/€$/);
  });
});

// ── loadCart / saveCart — persistence ────────────────────────────────────────
describe('loadCart — persistence', () => {
  beforeEach(() => {
    setupCartDOM();
    global.products = [...PRODUCTS];
    global.cart = [];
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  test('зарежда запазена кошница от localStorage mc_cart', () => {
    localStorage.setItem('mc_cart', JSON.stringify([{ id: 1, qty: 3 }]));
    loadCart();
    expect(global.cart).toHaveLength(1);
    expect(global.cart[0].id).toBe(1);
    expect(global.cart[0].qty).toBe(3);
  });

  test('игнорира продукти с несъществуващо id', () => {
    localStorage.setItem('mc_cart', JSON.stringify([{ id: 999, qty: 1 }]));
    loadCart();
    expect(global.cart).toHaveLength(0);
  });

  test('при празен localStorage cart остава []', () => {
    loadCart();
    expect(global.cart).toHaveLength(0);
  });

  test('saveCart → loadCart запазва qty', () => {
    global.cart = [{ ...PRODUCTS[0], qty: 5 }];
    saveCart();
    global.cart = [];
    loadCart();
    expect(global.cart[0].qty).toBe(5);
  });
});

// ── undoRemoveCart ────────────────────────────────────────────────────────────
describe('undoRemoveCart', () => {
  function setupToastDOM() {
    document.body.innerHTML = `
      <span id="cartBadge"></span>
      <span id="cartTotal"></span>
      <span id="bnCartBadge"></span>
      <div id="cartBody"></div>
      <div id="toast" class="show"></div>
    `;
  }

  beforeEach(() => {
    setupToastDOM();
    global.products = [...PRODUCTS];
    global.cart = [];
    jest.clearAllMocks();
  });

  test('добавя обратно премахнат продукт', () => {
    global.cart = [];
    const toast = document.getElementById('toast');
    toast._undoItem = { ...PRODUCTS[0], qty: 1 };
    undoRemoveCart();
    expect(global.cart).toHaveLength(1);
    expect(global.cart[0].id).toBe(PRODUCTS[0].id);
  });

  test('при qty > 1 добавя qty-те обратно', () => {
    global.cart = [{ ...PRODUCTS[0], qty: 2 }];
    const toast = document.getElementById('toast');
    toast._undoItem = { ...PRODUCTS[0], qty: 3 };
    undoRemoveCart();
    expect(global.cart[0].qty).toBe(5);
  });

  test('без _undoItem не прави нищо', () => {
    global.cart = [];
    const toast = document.getElementById('toast');
    toast._undoItem = null;
    undoRemoveCart();
    expect(global.cart).toHaveLength(0);
  });
});
