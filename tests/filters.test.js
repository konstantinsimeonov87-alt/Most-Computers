'use strict';
/**
 * Тестове за филтриране и сортиране (js/filters.js)
 * Покрива: getFilteredSorted — категория, сортиране, марки
 */

const PRODUCTS = [
  { id: 1, name: 'Sony WH-1000XM6',   price: 449,  old: 549,  badge: 'sale', pct: 18, brand: 'Sony',    cat: 'audio',  rating: 4.9, rv: 124 },
  { id: 2, name: 'iPhone 16 Pro Max', price: 2599, old: null,  badge: 'new',  pct: 0,  brand: 'Apple',   cat: 'mobile', rating: 4.8, rv: 89  },
  { id: 3, name: 'Samsung 55" TV',    price: 1799, old: 2199,  badge: 'sale', pct: 18, brand: 'Samsung', cat: 'tv',     rating: 4.7, rv: 56  },
  { id: 4, name: 'Logitech MX Master',price: 159,  old: 189,   badge: 'sale', pct: 16, brand: 'Logitech',cat: 'acc',    rating: 4.8, rv: 312 },
  { id: 5, name: 'ASUS ROG Zephyrus', price: 3799, old: 4299,  badge: 'sale', pct: 12, brand: 'ASUS',   cat: 'gaming', rating: 4.9, rv: 54  },
  { id: 6, name: 'Dell XPS 15',       price: 3299, old: null,  badge: 'hot',  pct: 0,  brand: 'Dell',    cat: 'laptop', rating: 4.8, rv: 41  },
];

// ── глобали, нужни на filters.js ─────────────────────────────────────────────
// Dummy DOM functions (renderTopGrid и updateLiveCount изискват DOM)
global.makeCard             = () => '';
global.updateWishlistUI     = jest.fn();
global.updateLiveCount      = jest.fn();
global.showSkeletons        = jest.fn();
// URL-params hook ги чете при зареждане на модула
global.openProductModal     = jest.fn();
global.closeProductModalDirect = jest.fn();

const { getFilteredSorted, advFilterBrands, renderGrids } = require('../../js/filters.js');

function resetGlobals() {
  global.products       = [...PRODUCTS];
  global.currentFilter  = 'all';
  global.currentSort    = 'bestseller';
  // currentSubcat е деклариран в filters.js — пропускаме (guard typeof matchesSubcat)
  advFilterBrands.clear();
  global.advFilterRating   = 0;
  global.advFilterSaleOnly = false;
  global.advFilterNewOnly  = false;
  global.advPriceMin       = 0;
  global.advPriceMax       = 2000;
}

describe('getFilteredSorted — категория', () => {
  beforeEach(resetGlobals);

  test('връща всички продукти при filter="all"', () => {
    const result = getFilteredSorted();
    expect(result).toHaveLength(PRODUCTS.length);
  });

  test('филтрира само audio продукти', () => {
    global.currentFilter = 'audio';
    const result = getFilteredSorted();
    expect(result).toHaveLength(1);
    expect(result[0].cat).toBe('audio');
  });

  test('филтрира само mobile продукти', () => {
    global.currentFilter = 'mobile';
    const result = getFilteredSorted();
    expect(result.every(p => p.cat === 'mobile')).toBe(true);
  });

  test('връща празен масив за несъществуваща категория', () => {
    global.currentFilter = 'nonexistent';
    expect(getFilteredSorted()).toHaveLength(0);
  });
});

describe('getFilteredSorted — сортиране', () => {
  beforeEach(resetGlobals);

  test('price-asc: цените са нарастващи', () => {
    global.currentSort = 'price-asc';
    const prices = getFilteredSorted().map(p => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('price-desc: цените са намаляващи', () => {
    global.currentSort = 'price-desc';
    const prices = getFilteredSorted().map(p => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('rating: рейтингите са намаляващи', () => {
    global.currentSort = 'rating';
    const ratings = getFilteredSorted().map(p => p.rating);
    for (let i = 1; i < ratings.length; i++) {
      expect(ratings[i]).toBeLessThanOrEqual(ratings[i - 1]);
    }
  });

  test('discount: отстъпките са намаляващи', () => {
    global.currentSort = 'discount';
    const pcts = getFilteredSorted().map(p => p.pct);
    for (let i = 1; i < pcts.length; i++) {
      expect(pcts[i]).toBeLessThanOrEqual(pcts[i - 1]);
    }
  });

  test('bestseller: резултатите са наредени', () => {
    global.currentSort = 'bestseller';
    const result = getFilteredSorted();
    // Просто проверяваме, че не хвърля и връща правилния брой
    expect(result).toHaveLength(PRODUCTS.length);
  });
});

describe('getFilteredSorted — марка филтър', () => {
  beforeEach(resetGlobals);

  test('филтрира само Sony продукти', () => {
    advFilterBrands.add('Sony');
    const result = getFilteredSorted();
    expect(result).toHaveLength(1);
    expect(result[0].brand).toBe('Sony');
  });

  test('филтрира по две марки', () => {
    advFilterBrands.add('Sony');
    advFilterBrands.add('Apple');
    const result = getFilteredSorted();
    expect(result).toHaveLength(2);
    result.forEach(p => expect(['Sony', 'Apple']).toContain(p.brand));
  });

  test('празен Set не филтрира', () => {
    // advFilterBrands е вече clear() от resetGlobals
    expect(getFilteredSorted()).toHaveLength(PRODUCTS.length);
  });
});

// ── renderGrids — скриване на секции при липса на продукти ───────────────────
describe('renderGrids — видимост на секции', () => {
  function setupGridDOM() {
    document.body.innerHTML = `
      <div id="sale" class="flash-sale-section"></div>
      <div id="flashGrid"></div>
      <div id="topGrid"></div>
      <div class="section-wrap">
        <div id="specialGrid"></div>
        <div id="specialGridMore" style="display:none"></div>
      </div>
      <div id="newGrid"></div>
      <span id="topSortCount"></span>
      <span id="resultsCount"></span>
    `;
  }

  beforeEach(() => {
    setupGridDOM();
    global.topGridPage = 1;
    global.currentSort = 'bestseller';
    global.currentFilter = 'all';
    advFilterBrands.clear();
    global.advFilterRating = 0;
    global.advFilterSaleOnly = false;
    global.advFilterNewOnly = false;
    global.advPriceMin = 0;
    global.advPriceMax = 99999;
    global.compareList = new Set();
    global.EUR_RATE = 1.95583;
    global.fmtEur = (n) => (n / 1.95583).toFixed(2) + ' €';
    global.fmtBgn = (n) => n + ' лв.';
    global.renderHeroPanel = jest.fn();
    global.renderPromoBanner = jest.fn();
    global.initLazyImages = jest.fn();
    global.renderHpCats = jest.fn();
    global.products = [...PRODUCTS];
  });

  test('Flash Sale секцията се крие при 0 продукти с намаление', () => {
    global.products = PRODUCTS.filter(p => !p.old);
    renderGrids();
    expect(document.getElementById('sale').style.display).toBe('none');
  });

  test('Flash Sale секцията се показва при продукти с намаление', () => {
    global.products = [...PRODUCTS];
    renderGrids();
    expect(document.getElementById('sale').style.display).not.toBe('none');
  });

  test('Специални оферти секцията се крие при 0 sale продукти', () => {
    global.products = PRODUCTS.filter(p => p.badge !== 'sale');
    renderGrids();
    expect(document.getElementById('specialGrid').closest('.section-wrap').style.display).toBe('none');
  });

  test('Специални оферти се показва при sale продукти', () => {
    global.products = [...PRODUCTS];
    renderGrids();
    expect(document.getElementById('specialGrid').closest('.section-wrap').style.display).not.toBe('none');
  });
});
