'use strict';
/**
 * Тестове за checkout (js/cart.js)
 * Покрива: applyPromo, renderOrderSummary, formatCardNum, formatExpiry
 */

// ── глобали, нужни на cart.js ────────────────────────────────────────────────
global.EUR_RATE = 1.95583;
const EUR_RATE = global.EUR_RATE;
global.fmtEur = (bgn) => (bgn / EUR_RATE).toFixed(2) + ' €';
global.fmtBgn = (bgn) => Number(bgn).toFixed(2) + ' лв.';
global.showToast  = jest.fn();
global.currentUser = null;

// Примерен продукт
const PRODUCT = { id: 1, name: 'Sony WH-1000XM6', price: 449, old: 549, badge: 'sale', emoji: '🎧', brand: 'Sony', cat: 'audio', rating: 4.9, rv: 124 };

function setupDOM() {
  document.body.innerHTML = `
    <!-- DOM за updateCart (изисква се при зареждане на cart.js) -->
    <span id="cartBadge"></span>
    <span id="cartTotal"></span>
    <span id="bnCartBadge"></span>
    <div  id="cartBody"></div>

    <!-- DOM за renderOrderSummary -->
    <div  id="osSummaryItems"></div>
    <span id="osSubtotal"></span>
    <span id="osDelivery"></span>
    <span id="osTotal"></span>
    <div  id="osSaveRow"></div>
    <span id="osSave"></span>
    <div  id="osPromoRow"></div>
    <span id="osPromoAmt"></span>

    <!-- DOM за applyPromo -->
    <input id="promoInput" value="">
    <div   id="promoOk"></div>
  `;
}

const {
  applyPromo, renderOrderSummary, formatCardNum, formatExpiry,
  _resetCheckout, _setDelivery, _setPayment,
} = require('../../js/cart.js');

// ── applyPromo ───────────────────────────────────────────────────────────────
describe('applyPromo', () => {
  beforeEach(() => {
    setupDOM();
    global.products = [PRODUCT];
    global.cart = [{ ...PRODUCT, qty: 1 }];
    _resetCheckout();
    jest.clearAllMocks();
  });

  test('приема кода MOSTCOMP10 и показва потвърждение', () => {
    document.getElementById('promoInput').value = 'MOSTCOMP10';
    applyPromo();
    expect(document.getElementById('promoOk').classList.contains('show')).toBe(true);
  });

  test('кодът е нечувствителен към регистър', () => {
    document.getElementById('promoInput').value = 'mostcomp10';
    applyPromo();
    expect(document.getElementById('promoOk').classList.contains('show')).toBe(true);
  });

  test('показва toast при успех', () => {
    document.getElementById('promoInput').value = 'MOSTCOMP10';
    applyPromo();
    expect(global.showToast).toHaveBeenCalledWith(expect.stringContaining('10%'));
  });

  test('невалиден код не активира промото', () => {
    document.getElementById('promoInput').value = 'GRЕШЕН';
    applyPromo();
    expect(document.getElementById('promoOk').classList.contains('show')).toBe(false);
  });

  test('невалиден код показва съобщение за грешка', () => {
    document.getElementById('promoInput').value = 'WRONG';
    applyPromo();
    expect(global.showToast).toHaveBeenCalledWith(expect.stringContaining('Невалиден'));
  });

  test('приетият код деактивира input полето', () => {
    document.getElementById('promoInput').value = 'MOSTCOMP10';
    applyPromo();
    expect(document.getElementById('promoInput').disabled).toBe(true);
  });
});

// ── renderOrderSummary ───────────────────────────────────────────────────────
describe('renderOrderSummary — изчисления', () => {
  beforeEach(() => {
    setupDOM();
    global.products = [PRODUCT];
    _resetCheckout(); // ckDeliveryIdx=0, ckPaymentType='card', promoApplied=false
  });

  test('изчислява subtotal за 1 бр.', () => {
    global.cart = [{ ...PRODUCT, qty: 1 }]; // 449 лв
    renderOrderSummary();
    const text = document.getElementById('osSubtotal').textContent;
    expect(text).toContain((449 / EUR_RATE).toFixed(2)); // ≈ 229.57 €
  });

  test('изчислява subtotal за 2 бр.', () => {
    global.cart = [{ ...PRODUCT, qty: 2 }]; // 898 лв
    renderOrderSummary();
    const text = document.getElementById('osSubtotal').textContent;
    expect(text).toContain((898 / EUR_RATE).toFixed(2)); // ≈ 459.13 €
  });

  test('прибавя доставка при ckDeliveryIdx=0', () => {
    global.cart = [{ ...PRODUCT, qty: 1 }]; // 449 лв + 5.99 лв доставка
    renderOrderSummary();
    const total = document.getElementById('osTotal').textContent;
    const expected = ((449 + 5.99) / EUR_RATE).toFixed(2);
    expect(total).toContain(expected); // ≈ 232.63 €
  });

  test('показва "Безплатно" при вземане от магазин (idx=2)', () => {
    global.cart = [{ ...PRODUCT, qty: 1 }];
    _setDelivery(2);
    renderOrderSummary();
    expect(document.getElementById('osDelivery').textContent).toBe('Безплатно');
  });

  test('прибавя COD такса 1.50 лв при наложен платеж', () => {
    global.cart = [{ ...PRODUCT, qty: 1 }]; // 449 лв
    _setPayment('cod');
    renderOrderSummary();
    const total = document.getElementById('osTotal').textContent;
    const expected = ((449 + 5.99 + 1.50) / EUR_RATE).toFixed(2);
    expect(total).toContain(expected); // ≈ 233.40 €
  });

  test('прилага 10% промо отстъпка', () => {
    global.cart = [{ ...PRODUCT, qty: 1 }]; // 449 лв → 10% = 44.9 лв
    document.getElementById('promoInput').value = 'MOSTCOMP10';
    applyPromo(); // sets promoApplied=true
    renderOrderSummary();
    const promoText = document.getElementById('osPromoAmt').textContent;
    expect(promoText).toContain((44.9 / EUR_RATE).toFixed(2)); // ≈ 22.96 €
  });

  test('показва спестена сума при намален продукт', () => {
    global.cart = [{ ...PRODUCT, qty: 1 }]; // old=549, price=449 → savings=100 лв
    renderOrderSummary();
    const saveText = document.getElementById('osSave').textContent;
    expect(saveText).toContain((100 / EUR_RATE).toFixed(2)); // ≈ 51.13 €
  });

  test('skрие реда за спестявания при продукт без стара цена', () => {
    const noOldPrice = { ...PRODUCT, old: null, qty: 1 };
    global.cart = [noOldPrice];
    renderOrderSummary();
    expect(document.getElementById('osSaveRow').style.display).toBe('none');
  });
});

// ── formatCardNum ────────────────────────────────────────────────────────────
describe('formatCardNum', () => {
  test('форматира 16 цифри с интервали на всеки 4', () => {
    const el = document.createElement('input');
    el.value = '1234567890123456';
    formatCardNum(el);
    expect(el.value).toBe('1234 5678 9012 3456');
  });

  test('премахва нецифрени символи', () => {
    const el = document.createElement('input');
    el.value = '1234-5678-9012-3456';
    formatCardNum(el);
    expect(el.value).toBe('1234 5678 9012 3456');
  });

  test('ограничава до 16 цифри', () => {
    const el = document.createElement('input');
    el.value = '12345678901234567890';
    formatCardNum(el);
    expect(el.value).toBe('1234 5678 9012 3456');
  });
});

// ── formatExpiry ─────────────────────────────────────────────────────────────
describe('formatExpiry', () => {
  test('форматира 4 цифри като MM/YY', () => {
    const el = document.createElement('input');
    el.value = '1225';
    formatExpiry(el);
    expect(el.value).toBe('12/25');
  });

  test('добавя "/" след 2 цифри (месец)', () => {
    const el = document.createElement('input');
    el.value = '12';
    formatExpiry(el);
    expect(el.value).toBe('12/');
  });

  test('премахва нецифрени символи', () => {
    const el = document.createElement('input');
    el.value = '12/25';
    formatExpiry(el);
    expect(el.value).toBe('12/25');
  });
});
