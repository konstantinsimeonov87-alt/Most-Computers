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
global.escHtml = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

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
  submitOrder,
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

// ── submitOrder helpers ────────────────────────────────────────────────────────
function setupSubmitDOM() {
  document.body.innerHTML = `
    <span id="cartBadge"></span><span id="cartTotal"></span>
    <span id="bnCartBadge"></span><div id="cartBody"></div>
    <div id="osSummaryItems"></div><span id="osSubtotal"></span>
    <span id="osDelivery"></span><span id="osTotal"></span>
    <div id="osSaveRow"></div><span id="osSave"></span>
    <div id="osPromoRow"></div><span id="osPromoAmt"></span>
    <input id="promoInput" value=""><div id="promoOk"></div>
    <div id="cs1" class="active"><span id="csn1">1</span></div>
    <div id="cs2"><span id="csn2">2</span></div>
    <div id="cs3"><span id="csn3">3</span></div>
    <div id="ck-step1"></div>
    <div id="ck-step2" style="display:none"></div>
    <div id="ck-step3" style="display:none"></div>
    <button class="os-submit">Потвърди поръчката</button>
    <input id="ckFirst" class="ck-input" value="">
    <input id="ckLast"  class="ck-input" value="">
    <input id="ckEmail" class="ck-input" value="">
    <input id="ckPhone" class="ck-input" value="">
    <input id="ckCity"  class="ck-input" value="">
    <input id="ckAddr"  class="ck-input" value="">
    <input id="ckZip"   class="ck-input" value="">
    <input id="ckNote"  class="ck-input" value="">
    <input id="ckEcontOffice" value="">
    <input id="ckSaveAddr" type="checkbox">
    <input id="ckIsB2B"   type="checkbox">
    <input id="ckFirma"   value=""><input id="ckEIK" value="">
    <input id="ckVAT"     value=""><input id="ckMOL" value="">
    <div id="checkoutPage" class="open"></div>
    <div id="thankyouPage"></div>
    <span id="tyOrderNum"></span><span id="tyEmail"></span>
    <span id="tyDeliveryDate"></span><span id="tyPayment"></span>
    <span id="tyName"></span><span id="tyPhone"></span>
    <span id="tyCity"></span><span id="tyAddr"></span>
    <span id="tyCourier"></span><span id="tyNote"></span>
    <span id="tyTimestamp"></span><span id="tyDeliveryDateLine"></span>
    <span id="tySubtotal"></span><span id="tyDeliveryCost"></span>
    <span id="tyTotal"></span><div id="tyItems"></div>
    <div id="tyPromoRow" style="display:none"></div><span id="tyPromoAmt"></span>
  `;
  document.getElementById('checkoutPage').scrollTo = jest.fn();
}

function fillForm(overrides = {}) {
  const vals = {
    ckFirst: 'Иван', ckLast: 'Иванов',
    ckEmail: 'test@test.com', ckPhone: '0888123456',
    ckCity: 'София', ckAddr: 'ул. Тест 1', ckZip: '1000',
    ...overrides,
  };
  Object.entries(vals).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}

// ── submitOrder — валидация ────────────────────────────────────────────────────
describe('submitOrder — валидация на формата', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupSubmitDOM();
    global.products = [PRODUCT];
    global.cart = [{ ...PRODUCT, qty: 1 }];
    _resetCheckout();
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  test('не показва грешка при пълна форма и непразна кошница', () => {
    fillForm();
    submitOrder();
    jest.runAllTimers();
    const toastMsgs = global.showToast.mock.calls.map(c => c[0]);
    expect(toastMsgs.every(m => !m.includes('задължителни'))).toBe(true);
  });

  test('спира при липсващо ckFirst и маркира полето с error', () => {
    fillForm({ ckFirst: '' });
    submitOrder();
    expect(document.getElementById('ckFirst').classList.contains('error')).toBe(true);
    expect(global.showToast).toHaveBeenCalledWith(expect.stringContaining('задължителни'));
  });

  test('спира при липсващ ckEmail', () => {
    fillForm({ ckEmail: '' });
    submitOrder();
    expect(document.getElementById('ckEmail').classList.contains('error')).toBe(true);
    expect(global.showToast).toHaveBeenCalledWith(expect.stringContaining('задължителни'));
  });

  test('спира при липсващ ckCity при доставка до адрес (idx=0)', () => {
    fillForm({ ckCity: '' });
    submitOrder();
    expect(document.getElementById('ckCity').classList.contains('error')).toBe(true);
    expect(global.showToast).toHaveBeenCalledWith(expect.stringContaining('задължителни'));
  });

  test('минава без ckCity при вземане от магазин (idx=2)', () => {
    _setDelivery(2);
    fillForm({ ckCity: '', ckAddr: '' });
    submitOrder();
    jest.runAllTimers();
    const toastMsgs = global.showToast.mock.calls.map(c => c[0]);
    expect(toastMsgs.every(m => !m.includes('задължителни'))).toBe(true);
  });

  test('минава без ckAddr при вземане от магазин (idx=2)', () => {
    _setDelivery(2);
    fillForm({ ckAddr: '' });
    submitOrder();
    jest.runAllTimers();
    const toastMsgs = global.showToast.mock.calls.map(c => c[0]);
    expect(toastMsgs.every(m => !m.includes('задължителни'))).toBe(true);
  });
});

// ── submitOrder — генерира поръчка ────────────────────────────────────────────
describe('submitOrder — генерира поръчка', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupSubmitDOM();
    global.products = [PRODUCT];
    global.cart = [{ ...PRODUCT, qty: 1 }];
    _resetCheckout();
    fillForm();
    jest.clearAllMocks();
    localStorage.clear();
  });
  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  test('записва поръчка в localStorage mc_orders', () => {
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders.length).toBe(1);
  });

  test('orderNum започва с MC-', () => {
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].num).toMatch(/^MC-/);
  });

  test('total = subtotal + delivery при card + idx=0', () => {
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].total).toBeCloseTo(449 + 5.99, 1);
  });

  test('total включва COD такса при cod плащане', () => {
    _setPayment('cod');
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].total).toBeCloseTo(449 + 5.99 + 1.50, 1);
  });

  test('delivery = 0 при вземане от магазин (idx=2)', () => {
    _setDelivery(2);
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].delivery).toBe(0);
  });

  test('поръчката съдържа email от формата', () => {
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].email).toBe('test@test.com');
  });

  test('itemsData съдържа правилния продукт с qty', () => {
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].itemsData[0].id).toBe(PRODUCT.id);
    expect(orders[0].itemsData[0].qty).toBe(1);
  });

  test('cart се изчиства след успешна поръчка', () => {
    submitOrder();
    jest.runAllTimers();
    expect(global.cart).toHaveLength(0);
  });
});

// ── submitOrder — thank-you страница ──────────────────────────────────────────
describe('submitOrder — thank-you страница', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupSubmitDOM();
    global.products = [PRODUCT];
    global.cart = [{ ...PRODUCT, qty: 1 }];
    _resetCheckout();
    fillForm();
    jest.clearAllMocks();
    localStorage.clear();
  });
  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  test('tyOrderNum се попълва с MC- номер', () => {
    submitOrder();
    jest.runAllTimers();
    expect(document.getElementById('tyOrderNum').textContent).toMatch(/^MC-/);
  });

  test('tyEmail е от ckEmail полето', () => {
    submitOrder();
    jest.runAllTimers();
    expect(document.getElementById('tyEmail').textContent).toBe('test@test.com');
  });

  test('tyPayment е "Карта" при card', () => {
    submitOrder();
    jest.runAllTimers();
    expect(document.getElementById('tyPayment').textContent).toBe('Карта');
  });

  test('tyPayment е "Наложен платеж" при cod', () => {
    _setPayment('cod');
    submitOrder();
    jest.runAllTimers();
    expect(document.getElementById('tyPayment').textContent).toBe('Наложен платеж');
  });

  test('tyPayment е "Банков превод" при bank', () => {
    _setPayment('bank');
    submitOrder();
    jest.runAllTimers();
    expect(document.getElementById('tyPayment').textContent).toBe('Банков превод');
  });

  test('tyDeliveryDate е "При вземане от магазин" при idx=2', () => {
    _setDelivery(2);
    submitOrder();
    jest.runAllTimers();
    expect(document.getElementById('tyDeliveryDate').textContent).toBe('При вземане от магазин');
  });

  test('tyItems съдържа имената на продуктите', () => {
    submitOrder();
    jest.runAllTimers();
    expect(document.getElementById('tyItems').innerHTML).toContain(PRODUCT.name);
  });

  test('tyTotal съдържа сумата в евро', () => {
    submitOrder();
    jest.runAllTimers();
    const total = document.getElementById('tyTotal').textContent;
    const expectedEur = ((449 + 5.99) / EUR_RATE).toFixed(2);
    expect(total).toContain(expectedEur);
  });
});

// ── submitOrder — различни категории ──────────────────────────────────────────
const CAT_PRODUCTS = [
  { id: 10,  name: 'Palit RTX 4060 8GB GDDR6',      price: 589,     cat: 'components',  emoji: '🖥', brand: 'Palit',    rating: 4.5, rv: 10 },
  { id: 20,  name: 'MSI Raider GE78 i9-14900HX',    price: 6999.60, cat: 'laptops',     emoji: '💻', brand: 'MSI',      rating: 4.5, rv: 5 },
  { id: 30,  name: 'Realme Note 50 4G 128G Black',   price: 229.20,  cat: 'phones',      emoji: '📱', brand: 'Realme',   rating: 4.1, rv: 40 },
  { id: 40,  name: 'ASUS 27 VA27EHE Eye Care IPS',  price: 289,     cat: 'monitors',    emoji: '🖥', brand: 'Asus',     rating: 4.3, rv: 20 },
  { id: 50,  name: '32GB USB Adata C008',            price: 12.08,   cat: 'storage',     emoji: '💾', brand: 'Adata',    rating: 4.2, rv: 0 },
  { id: 60,  name: 'Omega KB-805 Mech USB Gaming',   price: 45,      cat: 'peripherals', emoji: '🖱', brand: 'Omega',    rating: 4.0, rv: 3 },
  { id: 70,  name: 'Canon Pixma G2410 AIO',          price: 316.85,  cat: 'printers',    emoji: '🖨', brand: 'Canon',    rating: 4.6, rv: 8 },
  { id: 80,  name: 'REPOTEC RPT-800DU 800VA UPS',    price: 108.80,  cat: 'ups',         emoji: '⚡', brand: 'Repotec',  rating: 4.5, rv: 0 },
  { id: 90,  name: 'Logitech BT Audio Receiver',     price: 19.99,   cat: 'accessories', emoji: '🎒', brand: 'Logitech', rating: 4.3, rv: 5 },
];

describe('submitOrder — различни категории продукти', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupSubmitDOM();
    global.products = CAT_PRODUCTS;
    _resetCheckout();
    jest.clearAllMocks();
    localStorage.clear();
  });
  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  CAT_PRODUCTS.forEach(prod => {
    test(`[${prod.cat}] поръчка записва правилен total (${prod.name.substring(0, 28)})`, () => {
      global.cart = [{ ...prod, qty: 1 }];
      fillForm();
      submitOrder();
      jest.runAllTimers();
      const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
      expect(orders[0]).toBeDefined();
      expect(orders[0].total).toBeCloseTo(prod.price + 5.99, 1);
      localStorage.clear();
    });

    test(`[${prod.cat}] id=${prod.id} записан в itemsData`, () => {
      global.cart = [{ ...prod, qty: 1 }];
      fillForm();
      submitOrder();
      jest.runAllTimers();
      const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
      expect(orders[0].itemsData[0].id).toBe(prod.id);
      localStorage.clear();
    });
  });
});

// ── submitOrder — смесена кошница ─────────────────────────────────────────────
describe('submitOrder — смесена кошница', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupSubmitDOM();
    global.products = CAT_PRODUCTS;
    _resetCheckout();
    fillForm();
    jest.clearAllMocks();
    localStorage.clear();
  });
  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  test('телефон + лаптоп — subtotal е сумата им', () => {
    const phone  = CAT_PRODUCTS.find(p => p.cat === 'phones');
    const laptop = CAT_PRODUCTS.find(p => p.cat === 'laptops');
    global.cart = [{ ...phone, qty: 1 }, { ...laptop, qty: 1 }];
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].subtotal).toBeCloseTo(phone.price + laptop.price, 1);
  });

  test('5 различни продукта — total включва всички + delivery', () => {
    const items = CAT_PRODUCTS.slice(0, 5).map(p => ({ ...p, qty: 1 }));
    global.cart = items;
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    const expectedSubtotal = items.reduce((s, x) => s + x.price, 0);
    expect(orders[0].subtotal).toBeCloseTo(expectedSubtotal, 1);
    expect(orders[0].total).toBeCloseTo(expectedSubtotal + 5.99, 1);
  });

  test('qty > 1 — subtotal = price × qty', () => {
    const prod = CAT_PRODUCTS[0];
    global.cart = [{ ...prod, qty: 3 }];
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].subtotal).toBeCloseTo(prod.price * 3, 1);
  });

  test('itemsData съдържа всички продукти от смесената кошница', () => {
    const items = CAT_PRODUCTS.slice(0, 3).map(p => ({ ...p, qty: 1 }));
    global.cart = items;
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].itemsData).toHaveLength(3);
    const ids = orders[0].itemsData.map(x => x.id);
    items.forEach(p => expect(ids).toContain(p.id));
  });
});

// ── submitOrder — ценови edge cases ───────────────────────────────────────────
describe('submitOrder — ценови edge cases', () => {
  const CHEAP = { id: 200, name: 'USB кабел 1м', price: 9, cat: 'accessories', emoji: '🔌', brand: 'Generic', rating: 4.0, rv: 0 };
  const LAPTOP = CAT_PRODUCTS.find(p => p.cat === 'laptops');

  beforeEach(() => {
    jest.useFakeTimers();
    setupSubmitDOM();
    global.products = [...CAT_PRODUCTS, CHEAP];
    _resetCheckout();
    fillForm();
    jest.clearAllMocks();
    localStorage.clear();
  });
  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  test('евтин аксесоар (9 лв ~ 4.60 €) — total е над нула', () => {
    global.cart = [{ ...CHEAP, qty: 1 }];
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].total).toBeGreaterThan(0);
    expect(orders[0].total).toBeCloseTo(CHEAP.price + 5.99, 1);
  });

  test('скъп лаптоп (6999.60 лв) — total > 7000 лв', () => {
    global.cart = [{ ...LAPTOP, qty: 1 }];
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].total).toBeGreaterThan(7000);
  });

  test('qty=10 — subtotal = price × 10', () => {
    global.cart = [{ ...CHEAP, qty: 10 }];
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    expect(orders[0].subtotal).toBeCloseTo(CHEAP.price * 10, 1);
  });

  test('promo 10% + COD такса — total е коректен', () => {
    document.getElementById('promoInput').value = 'MOSTCOMP10';
    applyPromo();
    _setPayment('cod');
    global.cart = [{ ...CHEAP, qty: 1 }];
    submitOrder();
    jest.runAllTimers();
    const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    const expected = CHEAP.price - CHEAP.price * 0.1 + 5.99 + 1.50;
    expect(orders[0].total).toBeCloseTo(expected, 1);
  });
});
