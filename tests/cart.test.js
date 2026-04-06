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

const { addToCart, removeFromCart, changeQty } = require('../../js/cart.js');

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
    addToCart(99); // 15 лв. → трябват 195.58 - 15 = 180.58 лв. още
    expect(document.getElementById('cartBody').innerHTML).toContain('180.58 лв.');
  });
});
