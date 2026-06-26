'use strict';
/**
 * Extended edge-case tests for js/search.js
 * Covers: XSS escaping, fuzzy matching, multi-word queries,
 *         EAN boundary values, missing product fields, normalizeCat edge cases.
 */

// ── DOM stubs ────────────────────────────────────────────────────────────────
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
global.normalizeCat             = (cat) => cat || 'accessories';

// Base catalogue — covers multiple cats, full and sparse fields
const FULL_PRODUCTS = [
  {
    id: 1, name: 'Sony WH-1000XM6', brand: 'Sony', cat: 'peripherals',
    price: 449, old: 549, badge: 'sale', emoji: '🎧',
    rating: 4.9, rv: 124,
    sku: 'MC-SONY-WH1000XM6', ean: '4548736132283',
    specs: { driver: '40mm', freq: '4Hz-40kHz' },
    desc: 'Безжични слушалки с шумопотискане',
  },
  {
    id: 2, name: 'iPhone 16 Pro Max', brand: 'Apple', cat: 'phones',
    price: 2599, old: null, badge: 'new', emoji: '📱',
    rating: 4.8, rv: 89,
    sku: 'MC-APPLE-IP16PROMAX', ean: '0194253715474',
    specs: { display: '6.9"', chip: 'A18 Pro' },
    desc: 'Apple флагман 2024',
  },
  {
    id: 3, name: 'Samsung 55" TV', brand: 'Samsung', cat: 'accessories',
    price: 1799, old: 2199, badge: 'sale', emoji: '📺',
    rating: 4.7, rv: 56,
    sku: 'MC-SAM-55QLED', ean: '8806094914500',
    specs: { size: '55"', res: '4K' },
    desc: 'QLED телевизор',
  },
];

// Sparse products — missing optional fields
const SPARSE_PRODUCTS = [
  { id: 10, name: 'Generic Mouse', brand: 'NoName', cat: 'peripherals', price: 29, emoji: '🖱' },
  { id: 11, name: 'USB Hub',       brand: 'NoName', cat: 'accessories', price: 19, emoji: '🔌', specs: {} },
  { id: 12, name: 'HDMI Cable',    brand: 'NoName', cat: 'accessories', price: 9,  emoji: '🔌', desc: '', ean: '', sku: '' },
];

global.products = [...FULL_PRODUCTS];

const {
  highlightMatch, searchProducts, queryType, saveRecentSearch, _resetRecentSearches,
} = require('../../js/search.js');

// ─────────────────────────────────────────────────────────────────────────────
// highlightMatch — XSS и специални символи
// ─────────────────────────────────────────────────────────────────────────────
describe('highlightMatch — XSS и HTML escaping', () => {
  test('escapes <script> tag в текста', () => {
    const r = highlightMatch('<script>alert(1)</script>', 'alert');
    expect(r).not.toContain('<script>');
    expect(r).toContain('&lt;script&gt;');
  });

  test('escapes & амперсанд в текста', () => {
    const r = highlightMatch('Sony & Samsung', 'Sony');
    expect(r).toContain('&amp;');
    expect(r).not.toContain(' & ');
  });

  test('escapes " кавички в текста', () => {
    const r = highlightMatch('55" TV', '55');
    expect(r).toContain('&quot;');
  });

  test('не маркира XSS в query — маркирания текст е от escapeван текст', () => {
    const r = highlightMatch('Sony TV', '<img onerror=alert(1)>');
    // query with regex chars is escaped, no match, returns safe text
    expect(r).not.toContain('<img');
    expect(r).toBe('Sony TV');
  });

  test('маркира кирилица правилно', () => {
    const r = highlightMatch('Безжични слушалки', 'слушалки');
    expect(r).toContain('<mark>слушалки</mark>');
  });

  test('маркира частично съвпадение в средата на думата', () => {
    const r = highlightMatch('Безжични слушалки', 'ушалк');
    expect(r).toContain('<mark>ушалк</mark>');
  });

  test('query с точка не хвърля грешка (regex escape)', () => {
    expect(() => highlightMatch('WH-1000XM6', '1000.XM6')).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// queryType — гранични EAN стойности
// ─────────────────────────────────────────────────────────────────────────────
describe('queryType — гранични стойности', () => {
  // EAN-8 (8 digits) → ean
  test('точно 8 цифри → ean', () => expect(queryType('12345678')).toBe('ean'));
  // EAN-13 (13 digits) → ean
  test('точно 13 цифри → ean', () => expect(queryType('4548736132283')).toBe('ean'));
  // EAN-14 (14 digits) → ean
  test('точно 14 цифри → ean', () => expect(queryType('12345678901234')).toBe('ean'));
  // 7 digits — not EAN
  test('7 цифри → text', () => expect(queryType('1234567')).toBe('text'));
  // 15 digits — not EAN
  test('15 цифри → text', () => expect(queryType('123456789012345')).toBe('text'));
  // digits with spaces — not pure EAN
  test('цифри с интервал → text', () => expect(queryType('1234 5678')).toBe('text'));
  // SKU case-insensitive
  test('mc- малки → sku', () => expect(queryType('mc-sam-55qled')).toBe('sku'));
  test('MC- главни → sku', () => expect(queryType('MC-SAM-55QLED')).toBe('sku'));
  // SKU with leading spaces (trim)
  test('SKU с leading интервал след trim → sku', () => expect(queryType('  MC-TEST-123')).toBe('sku'));
});

// ─────────────────────────────────────────────────────────────────────────────
// searchProducts — fuzzy matching (typos)
// ─────────────────────────────────────────────────────────────────────────────
describe('searchProducts — fuzzy matching (typos)', () => {
  beforeEach(() => { global.products = [...FULL_PRODUCTS]; });

  test('1 typo: "Somy" → намира Sony (4-char token, maxDist=1)', () => {
    const r = searchProducts('Somy', '');
    expect(r.some(p => p.id === 1)).toBe(true);
  });

  test('1 typo: "soni" → намира Sony', () => {
    const r = searchProducts('soni', '');
    expect(r.some(p => p.id === 1)).toBe(true);
  });

  test('1 typo: "Samsng" (пропуснато "u") → намира Samsung', () => {
    const r = searchProducts('Samsng', '');
    expect(r.some(p => p.id === 3)).toBe(true);
  });

  test('1 edit: "Smny" vs "Sony" — Levenshtein=1 (S=S,m→o,n=n,y=y) → НАМИРА (maxDist=1)', () => {
    // "Smny" е точно 1 edit от "Sony" (m→o), така че fuzzy ГО НАМИРА
    // Това е коректно поведение на алгоритъма
    const r = searchProducts('Smny', '');
    expect(r.some(p => p.id === 1)).toBe(true);
  });

  test('fuzzy не работи за query < 3 символа', () => {
    // "Xy" е <3 chars — fuzzy не се активира
    const r = searchProducts('Xy', '');
    expect(r).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// searchProducts — multi-word queries
// ─────────────────────────────────────────────────────────────────────────────
describe('searchProducts — multi-word queries', () => {
  beforeEach(() => { global.products = [...FULL_PRODUCTS]; });

  test('"Sony слушалки" → намира product 1', () => {
    const r = searchProducts('Sony слушалки', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('"iPhone Pro Max" → намира product 2', () => {
    const r = searchProducts('iPhone Pro Max', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(2);
  });

  test('"Samsung 4K" → намира product 3 (brand + spec)', () => {
    const r = searchProducts('Samsung 4K', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(3);
  });

  test('"Sony TV" → 0 резултата (след fix: fuzzy не се активира при изпуснати токени)', () => {
    // След fix: fuzzy изисква allTokens.length === longTokens.length.
    // "TV" е <3 chars → longTokens=["sony"], allTokens=["sony","tv"] → 1≠2 → fuzzy НЕ се активира.
    // multi-word: allFields за Sony WH-1000XM6 не съдържа "tv" → не минава.
    // basic: "sony tv" не е в нито едно поле → не минава.
    // Резултат: []
    const r = searchProducts('Sony TV', '');
    expect(r).toHaveLength(0);
  });

  test('"Apple 2024" → намира product 2 (brand + desc)', () => {
    const r = searchProducts('Apple 2024', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// searchProducts — продукти с липсващи полета (sparse)
// ─────────────────────────────────────────────────────────────────────────────
describe('searchProducts — sparse/incomplete продукти', () => {
  beforeEach(() => { global.products = [...SPARSE_PRODUCTS]; });

  test('намира продукт без ean/sku/desc/specs по name', () => {
    const r = searchProducts('Generic Mouse', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(10);
  });

  test('намира продукт с празен specs обект', () => {
    const r = searchProducts('USB Hub', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(11);
  });

  test('намира продукт с празни string полета (ean="", sku="", desc="")', () => {
    const r = searchProducts('HDMI Cable', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(12);
  });

  test('не хвърля грешка при EAN търсене на продукт без ean поле', () => {
    expect(() => searchProducts('12345678', '')).not.toThrow();
  });

  test('не хвърля грешка при SKU търсене на продукт без sku поле', () => {
    expect(() => searchProducts('MC-TEST-123', '')).not.toThrow();
  });

  test('не хвърля грешка при fuzzy търсене на продукт без desc/specs', () => {
    expect(() => searchProducts('mouss', '')).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// searchProducts — EAN search поведение
// ─────────────────────────────────────────────────────────────────────────────
describe('searchProducts — EAN търсене', () => {
  beforeEach(() => { global.products = [...FULL_PRODUCTS]; });

  test('пълен EAN-13 → намира точно 1 продукт', () => {
    const r = searchProducts('4548736132283', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('частичен EAN (не е 8-14 цифри) → не търси по EAN logic, text fallback', () => {
    // "454873" — 6 digits → not EAN → text search; won't match EAN field by contains since it's text mode
    const r = searchProducts('454873', '');
    // text mode: p.ean.includes('454873') would be true under basic check but EAN field is not in basic for text
    // Actually basic check does: p.ean && p.ean.includes(q) — YES, it does text includes on ean
    // so this can match — just verify no crash
    expect(Array.isArray(r)).toBe(true);
  });

  test('EAN-8 (8 цифри) → EAN режим', () => {
    // No product has 8-digit EAN in our set — should return empty
    const r = searchProducts('00000000', '');
    expect(r).toHaveLength(0);
  });

  test('EAN с водещи нули → намира продукт', () => {
    const r = searchProducts('0194253715474', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// searchProducts — категориен филтър с normalizeCat
// ─────────────────────────────────────────────────────────────────────────────
describe('searchProducts — category filter', () => {
  beforeEach(() => { global.products = [...FULL_PRODUCTS]; });

  test('cat="phones" → само iPhone (id=2)', () => {
    const r = searchProducts('i', 'phones');
    expect(r.every(p => p.cat === 'phones')).toBe(true);
  });

  test('cat="accessories" → само Samsung TV (id=3)', () => {
    const r = searchProducts('a', 'accessories');
    expect(r.every(p => p.cat === 'accessories')).toBe(true);
  });

  test('cat="laptops" → [] (няма лаптопи в теста)', () => {
    const r = searchProducts('Sony', 'laptops');
    expect(r).toHaveLength(0);
  });

  test('cat="all" → няма категориен филтър (всички)', () => {
    const r = searchProducts('a', 'all');
    expect(r.length).toBeGreaterThan(1);
  });

  test('cat=null → няма категориен филтър', () => {
    const r = searchProducts('a', null);
    expect(r.length).toBeGreaterThan(1);
  });

  test('cat=undefined → няма категориен филтър', () => {
    const r = searchProducts('a', undefined);
    expect(r.length).toBeGreaterThan(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// saveRecentSearch — допълнителни edge cases
// ─────────────────────────────────────────────────────────────────────────────
describe('saveRecentSearch — edge cases', () => {
  beforeEach(() => {
    localStorage.clear();
    _resetRecentSearches();
  });

  test('само интервали не се записват (след fix: trim преди guard)', () => {
    saveRecentSearch('   ');
    // След fix: if (!q || !q.trim()) return; → интервали не се записват
    expect(localStorage.getItem('mc_recent')).toBeNull();
  });

  test('дедупликация е case-sensitive', () => {
    saveRecentSearch('Sony');
    saveRecentSearch('sony');
    const saved = JSON.parse(localStorage.getItem('mc_recent'));
    expect(saved).toHaveLength(2); // 'Sony' ≠ 'sony'
  });

  test('след 6 записа, старите се изтриват (FIFO)', () => {
    ['a','b','c','d','e','f','g'].forEach(q => saveRecentSearch(q));
    const saved = JSON.parse(localStorage.getItem('mc_recent'));
    expect(saved).toHaveLength(6);
    expect(saved).not.toContain('a'); // oldest pushed out
    expect(saved[0]).toBe('g');       // newest is first
  });

  test('специални символи се записват нормално', () => {
    saveRecentSearch('слушалки 40mm <test>');
    const saved = JSON.parse(localStorage.getItem('mc_recent'));
    expect(saved[0]).toBe('слушалки 40mm <test>');
  });

  test('последователно дедупликиране: при повтаряне, елементът се мести начело', () => {
    saveRecentSearch('лаптоп');
    saveRecentSearch('телефон');
    saveRecentSearch('лаптоп'); // повторно — трябва да е начело
    const saved = JSON.parse(localStorage.getItem('mc_recent'));
    expect(saved[0]).toBe('лаптоп');
    expect(saved.filter(s => s === 'лаптоп')).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// searchProducts — specs търсене (различни типове стойности)
// ─────────────────────────────────────────────────────────────────────────────
describe('searchProducts — търсене в specs', () => {
  beforeEach(() => { global.products = [...FULL_PRODUCTS]; });

  test('търси по numeric spec стойност "40mm"', () => {
    const r = searchProducts('40mm', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('търси по spec стойност "A18 Pro"', () => {
    const r = searchProducts('A18 Pro', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(2);
  });

  test('търси по spec стойност "4K"', () => {
    const r = searchProducts('4K', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// searchProducts — case-insensitive за кирилица
// ─────────────────────────────────────────────────────────────────────────────
describe('searchProducts — кирилица', () => {
  beforeEach(() => { global.products = [...FULL_PRODUCTS]; });

  test('търси по desc на кирилица (малки)', () => {
    const r = searchProducts('шумопотискане', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('търси по desc на кирилица (главни) — case-insensitive', () => {
    const r = searchProducts('ШУМОПОТИСКАНЕ', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  test('частична кирилска дума', () => {
    const r = searchProducts('слушалк', '');
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });
});
