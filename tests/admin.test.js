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
  });

  test('грешен PIN — adminPage остава затворен', () => {
    global.prompt = jest.fn().mockReturnValue('0000');
    openAdminPage();
    expect(document.getElementById('adminPage').classList.contains('open')).toBe(false);
  });

  test('грешен PIN — показва toast с грешка', () => {
    global.prompt = jest.fn().mockReturnValue('wrong');
    openAdminPage();
    expect(global.showToast).toHaveBeenCalledWith('❌ Грешен PIN!');
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
