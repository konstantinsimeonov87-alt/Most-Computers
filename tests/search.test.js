'use strict';
/**
 * Тестове за търсене (js/search.js)
 * Покрива: highlightMatch, searchProducts, queryType, saveRecentSearch
 */

// ── DOM и глобали нужни при зареждане на search.js ───────────────────────────
document.body.innerHTML = `
  <input id="searchInput" />
  <div   id="searchDropdown"></div>
  <div   id="searchBar"></div>
  <select id="searchCat"><option value="">Всички</option></select>
`;

global.openProductModal         = jest.fn();
global.closeProductModalDirect  = jest.fn();
global.showToast                = jest.fn();
global.makeCard                 = () => '';
global.showSearchResultsPage    = jest.fn();
global.srpCurrentQuery          = '';
global.srpCurrentCatFilter      = '';
global.srpPriceMinVal           = 0;
global.srpPriceMaxVal           = 5000;
// normalizeCat stub — maps normalized cats to themselves (products.js now uses normalized values)
global.normalizeCat = (cat) => cat || 'accessories';

const PRODUCTS = [
  { id: 1, name: 'Sony WH-1000XM6', brand: 'Sony',    cat: 'peripherals', price: 449,  old: 549,  badge: 'sale', emoji: '🎧', rating: 4.9, rv: 124, sku: 'MC-SONY-WH1000XM6', ean: '4548736132283', specs: { driver: '40mm', freq: '4Hz-40kHz' }, desc: 'Безжични слушалки с шумопотискане' },
  { id: 2, name: 'iPhone 16 Pro Max', brand: 'Apple', cat: 'phones',      price: 2599, old: null, badge: 'new',  emoji: '📱', rating: 4.8, rv: 89,  sku: 'MC-APPLE-IP16PROMAX', ean: '0194253715474', specs: { display: '6.9"', chip: 'A18 Pro' }, desc: 'Apple флагман 2024' },
  { id: 3, name: 'Samsung 55" TV',   brand: 'Samsung',cat: 'accessories', price: 1799, old: 2199, badge: 'sale', emoji: '📺', rating: 4.7, rv: 56,  sku: 'MC-SAM-55QLED',      ean: '8806094914500', specs: { size: '55"', res: '4K' },         desc: 'QLED телевизор' },
];

global.products = [...PRODUCTS];

const {
  highlightMatch, searchProducts, queryType, saveRecentSearch, _resetRecentSearches,
} = require('../../js/search.js');

// ── highlightMatch ────────────────────────────────────────────────────────────
describe('highlightMatch', () => {
  test('обвива съвпадението в <mark>', () => {
    expect(highlightMatch('Sony WH-1000XM6', 'sony')).toBe('<mark>Sony</mark> WH-1000XM6');
  });

  test('нечувствителен към регистър', () => {
    expect(highlightMatch('iPhone 16 Pro Max', 'IPHONE')).toContain('<mark>');
  });

  test('без query — връща оригиналния текст', () => {
    expect(highlightMatch('Samsung TV', '')).toBe('Samsung TV');
  });

  test('null/undefined query — връща оригиналния текст', () => {
    expect(highlightMatch('Samsung TV', null)).toBe('Samsung TV');
  });

  test('escapeва специални regex символи в query', () => {
    expect(() => highlightMatch('цена: 10 лв.', '10 лв.')).not.toThrow();
    expect(highlightMatch('цена: 10 лв.', '10 лв.')).toContain('<mark>10 лв.</mark>');
  });

  test('маркира всички срещания', () => {
    const result = highlightMatch('Sony Sony Sony', 'Sony');
    expect((result.match(/<mark>/g) || []).length).toBe(3);
  });
});

// ── queryType ────────────────────────────────────────────────────────────────
describe('queryType', () => {
  test('разпознава EAN (13 цифри)', () => {
    expect(queryType('4548736132283')).toBe('ean');
  });

  test('разпознава EAN (8 цифри)', () => {
    expect(queryType('12345678')).toBe('ean');
  });

  test('разпознава EAN (14 цифри)', () => {
    expect(queryType('12345678901234')).toBe('ean');
  });

  test('7 цифри НЕ са EAN', () => {
    expect(queryType('1234567')).toBe('text');
  });

  test('15 цифри НЕ са EAN', () => {
    expect(queryType('123456789012345')).toBe('text');
  });

  test('разпознава SKU (започва с mc-)', () => {
    expect(queryType('mc-sony-wh1000xm6')).toBe('sku');
  });

  test('SKU е нечувствителен към регистър (MC-)', () => {
    expect(queryType('MC-APPLE-IP16')).toBe('sku');
  });

  test('обикновен текст → "text"', () => {
    expect(queryType('слушалки')).toBe('text');
  });

  test('марка → "text"', () => {
    expect(queryType('Samsung')).toBe('text');
  });
});

// ── searchProducts ────────────────────────────────────────────────────────────
describe('searchProducts — основно', () => {
  beforeEach(() => { global.products = [...PRODUCTS]; });

  test('празна заявка → []', () => {
    expect(searchProducts('', '')).toHaveLength(0);
  });

  test('само интервали → []', () => {
    expect(searchProducts('   ', '')).toHaveLength(0);
  });

  test('търси по name', () => {
    const r = searchProducts('Sony', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('търси по brand', () => {
    const r = searchProducts('Apple', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(2);
  });

  test('нечувствителен към регистър', () => {
    expect(searchProducts('SAMSUNG', '')).toHaveLength(1);
    expect(searchProducts('samsung', '')).toHaveLength(1);
  });

  test('търси по SKU', () => {
    const r = searchProducts('MC-SONY-WH1000XM6', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('търси по EAN', () => {
    const r = searchProducts('4548736132283', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('търси по specs', () => {
    const r = searchProducts('A18 Pro', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(2);
  });

  test('търси по desc', () => {
    const r = searchProducts('шумопотискане', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('несъществуваща заявка → []', () => {
    expect(searchProducts('xyznonsense', '')).toHaveLength(0);
  });
});

describe('searchProducts — филтър по категория', () => {
  beforeEach(() => { global.products = [...PRODUCTS]; });

  test('филтрира само "peripherals" продукти', () => {
    const r = searchProducts('Sony', 'peripherals');
    expect(r).toHaveLength(1);
    expect(r[0].cat).toBe('peripherals');
  });

  test('правилна категория, грешна — връща []', () => {
    const r = searchProducts('Sony', 'phones');
    expect(r).toHaveLength(0);
  });

  test('без категория (empty string) — не филтрира', () => {
    const r = searchProducts('a', ''); // 'a' е в Samsung, Apple...
    expect(r.length).toBeGreaterThan(1);
  });
});

// ── saveRecentSearch ──────────────────────────────────────────────────────────
describe('saveRecentSearch', () => {
  beforeEach(() => {
    localStorage.clear();
    _resetRecentSearches();
  });

  test('записва заявката в localStorage', () => {
    saveRecentSearch('слушалки');
    const saved = JSON.parse(localStorage.getItem('mc_recent'));
    expect(saved).toContain('слушалки');
  });

  test('дедуплицира — повторна заявка не се дублира', () => {
    saveRecentSearch('слушалки');
    saveRecentSearch('слушалки');
    const saved = JSON.parse(localStorage.getItem('mc_recent'));
    expect(saved.filter(s => s === 'слушалки')).toHaveLength(1);
  });

  test('новата заявка е първа', () => {
    saveRecentSearch('лаптоп');
    saveRecentSearch('телефон');
    const saved = JSON.parse(localStorage.getItem('mc_recent'));
    expect(saved[0]).toBe('телефон');
  });

  test('пази максимум 6 заявки', () => {
    ['a','b','c','d','e','f','g'].forEach(q => saveRecentSearch(q));
    const saved = JSON.parse(localStorage.getItem('mc_recent'));
    expect(saved).toHaveLength(6);
  });

  test('празен string не се записва', () => {
    saveRecentSearch('');
    expect(localStorage.getItem('mc_recent')).toBeNull();
  });
});
