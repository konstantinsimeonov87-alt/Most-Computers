'use strict';
/**
 * Тестове за Admin PIN защита (js/admin.js)
 * Покрива: openAdminPage — PIN валидация, window._adminUnlocked
 */

// ── глобали, нужни на admin.js ────────────────────────────────────────────────
global.showToast   = jest.fn();
global.fmtBgn      = (bgn) => Number(bgn).toFixed(2) + ' лв.';
global.fmtEur      = (bgn) => (bgn / 1.95583).toFixed(2) + ' €';
global.EUR_RATE    = 1.95583;
global.products    = [];
global.cart        = [];
global.currentUser = null;
// Функции от app.js, използвани в admin.js при DOMContentLoaded (не се изпълнява в Jest)
global.renderRecentlyViewed = jest.fn();
global.closeDropdown        = jest.fn();
global.close404             = jest.fn();
global.openProductModal     = jest.fn();

const { openAdminPage, closeAdminPage } = require('../../js/admin.js');

function setupAdminDOM() {
  document.body.innerHTML = `<div id="adminPage"></div>`;
}

// ── openAdminPage — PIN валидация ─────────────────────────────────────────────
describe('openAdminPage — PIN защита', () => {
  beforeEach(() => {
    setupAdminDOM();
    global.showToast.mockClear();
    delete window._adminUnlocked;
    delete window._adminScriptLoaded;
    sessionStorage.clear();
  });

  test('грешен PIN — adminPage остава затворен', () => {
    global.prompt = jest.fn().mockReturnValue('0000');
    openAdminPage();
    expect(document.getElementById('adminPage').classList.contains('open')).toBe(false);
  });

  test('грешен PIN — показва toast с грешка', () => {
    global.prompt = jest.fn().mockReturnValue('wrong');
    sessionStorage.clear();
    openAdminPage();
    expect(global.showToast).toHaveBeenCalledWith(expect.stringContaining('❌ Грешен PIN!'));
  });

  test('правилен PIN (1234) — adminPage се отваря', () => {
    global.prompt = jest.fn().mockReturnValue('1234');
    openAdminPage();
    expect(document.getElementById('adminPage').classList.contains('open')).toBe(true);
  });

  test('правилен PIN — window._adminUnlocked се задава на true', () => {
    global.prompt = jest.fn().mockReturnValue('1234');
    openAdminPage();
    expect(window._adminUnlocked).toBe(true);
  });

  test('null (затваряне на prompt) — adminPage остава затворен', () => {
    global.prompt = jest.fn().mockReturnValue(null);
    openAdminPage();
    expect(document.getElementById('adminPage').classList.contains('open')).toBe(false);
  });

  test('вече отключен (_adminUnlocked = true) — не пита за PIN', () => {
    window._adminUnlocked = true;
    global.prompt = jest.fn();
    openAdminPage();
    expect(global.prompt).not.toHaveBeenCalled();
    expect(document.getElementById('adminPage').classList.contains('open')).toBe(true);
  });
});

// ── closeAdminPage ────────────────────────────────────────────────────────────
describe('closeAdminPage', () => {
  beforeEach(() => {
    setupAdminDOM();
    window._adminUnlocked = true;
    document.getElementById('adminPage').classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  test('премахва класа open от adminPage', () => {
    closeAdminPage();
    expect(document.getElementById('adminPage').classList.contains('open')).toBe(false);
  });

  test('възстановява body overflow', () => {
    closeAdminPage();
    expect(document.body.style.overflow).toBe('');
  });
});

// ── inferSubcat — автоматично определяне на подкатегория ─────────────────────
const { inferSubcat, mapCatGeneric, XML_FEED_CAT_MAP } = require('../../js/admin.js');

describe('inferSubcat — лаптопи', () => {
  test('gaming лаптоп → gaming_l', () => {
    expect(inferSubcat('ASUS ROG Gaming Laptop', 'laptops')).toBe('gaming_l');
  });
  test('ROG лаптоп → gaming_l', () => {
    expect(inferSubcat('ASUS ROG Zephyrus G16', 'laptops')).toBe('gaming_l');
  });
  test('ultrabook → ultrabook', () => {
    expect(inferSubcat('ASUS ZenBook Ultra Slim 14"', 'laptops')).toBe('ultrabook');
  });
  test('обикновен лаптоп → work_l', () => {
    expect(inferSubcat('HP Pavilion 15 Business', 'laptops')).toBe('work_l');
  });
});

describe('inferSubcat — телефони', () => {
  test('смартфон → smartphone', () => {
    expect(inferSubcat('iPhone 16 Pro Max', 'phones')).toBe('smartphone');
  });
  test('таблет (tablet) → tablet', () => {
    expect(inferSubcat('Samsung Galaxy Tab S10', 'phones')).toBe('tablet');
  });
  test('iPad → tablet', () => {
    expect(inferSubcat('Apple iPad Pro 12.9"', 'phones')).toBe('tablet');
  });
  test('smartwatch → smartwatch', () => {
    expect(inferSubcat('Apple Watch Series 10', 'phones')).toBe('smartwatch');
  });
});

describe('inferSubcat — гейминг', () => {
  test('gaming мишка → gaming_mouse', () => {
    expect(inferSubcat('Logitech G502 X Gaming Mouse', 'gaming')).toBe('gaming_mouse');
  });
  test('gaming клавиатура → gaming_kb', () => {
    expect(inferSubcat('Corsair K100 RGB Keyboard', 'gaming')).toBe('gaming_kb');
  });
  test('gaming headset → gaming_headset', () => {
    expect(inferSubcat('HyperX Cloud 3 Gaming Headset', 'gaming')).toBe('gaming_headset');
  });
  test('gaming laptop в gaming кат → gaming_laptop_s', () => {
    expect(inferSubcat('MSI Titan Gaming Laptop', 'gaming')).toBe('gaming_laptop_s');
  });
  test('gaming PC → gaming_pc_s', () => {
    expect(inferSubcat('ASUS ROG G22CH Gaming Desktop', 'gaming')).toBe('gaming_pc_s');
  });
});

describe('inferSubcat — монитори', () => {
  test('gaming монитор (144Hz) → gaming_mon', () => {
    expect(inferSubcat('ASUS ROG Swift 144Hz 27"', 'monitors')).toBe('gaming_mon');
  });
  test('4K монитор → mon_4k', () => {
    expect(inferSubcat('LG UltraFine 4K 32"', 'monitors')).toBe('mon_4k');
  });
  test('ultrawide → ultrawide', () => {
    expect(inferSubcat('LG UltraWide 34" Curved', 'monitors')).toBe('ultrawide');
  });
  test('OLED монитор → oled_mon', () => {
    expect(inferSubcat('Samsung Odyssey OLED G8', 'monitors')).toBe('oled_mon');
  });
  test('обикновен монитор → office_mon', () => {
    expect(inferSubcat('Dell 24" Office Monitor', 'monitors')).toBe('office_mon');
  });
});

describe('XML_FEED_CAT_MAP — categoryId маппинг', () => {
  test('id 21 → laptops', () => expect(XML_FEED_CAT_MAP['21']).toBe('laptops'));
  test('id 22 → phones',  () => expect(XML_FEED_CAT_MAP['22']).toBe('phones'));
  test('id 23 → phones',  () => expect(XML_FEED_CAT_MAP['23']).toBe('phones'));
  test('id 24 → monitors',() => expect(XML_FEED_CAT_MAP['24']).toBe('monitors'));
  test('id 25 → peripherals', () => expect(XML_FEED_CAT_MAP['25']).toBe('peripherals'));
  test('id 26 → network', () => expect(XML_FEED_CAT_MAP['26']).toBe('network'));
  test('id 27 → accessories', () => expect(XML_FEED_CAT_MAP['27']).toBe('accessories'));
});

describe('mapCatGeneric — текстови маппинг', () => {
  test('NOTEBOOK → laptops', () => expect(mapCatGeneric('NOTEBOOK')).toBe('laptops'));
  test('PHONE → phones',    () => expect(mapCatGeneric('PHONE')).toBe('phones'));
  test('МОНИТОР → monitors',() => expect(mapCatGeneric('МОНИТОР')).toBe('monitors'));
  test('GAMING → gaming',   () => expect(mapCatGeneric('GAMING LAPTOP')).toBe('gaming'));
  test('GAMING MONITOR → monitors', () => expect(mapCatGeneric('GAMING MONITOR')).toBe('monitors'));
  test('непознат → null',   () => expect(mapCatGeneric('НЕПОЗНАТО XYZ')).toBeNull());
});
