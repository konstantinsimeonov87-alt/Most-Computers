'use strict';
/**
 * Тестове за валута (js/currency.js)
 * Покрива: toEur, fmtEur, fmtBgn, fmtPrice, fmtDual
 */

const { EUR_RATE, toEur, fmtEur, fmtBgn, fmtPrice, fmtDual } = require('../../js/currency.js');

// ── toEur ────────────────────────────────────────────────────────────────────
describe('toEur', () => {
  test('1 EUR = 1.95583 BGN (фиксиран курс)', () => {
    expect(toEur(EUR_RATE)).toBeCloseTo(1.0, 5);
  });

  test('0 BGN = 0 EUR', () => {
    expect(toEur(0)).toBe(0);
  });

  test('конвертира 449 лв. правилно', () => {
    expect(toEur(449)).toBeCloseTo(449 / EUR_RATE, 5);
  });

  test('конвертира 1000 лв. правилно', () => {
    expect(toEur(1000)).toBeCloseTo(1000 / EUR_RATE, 5);
  });
});

// ── fmtEur ───────────────────────────────────────────────────────────────────
describe('fmtEur', () => {
  test('завършва с " €"', () => {
    expect(fmtEur(449)).toMatch(/ €$/);
  });

  test('резултатът съдържа числова стойност', () => {
    const result = fmtEur(449);
    // Премахваме " €" и проверяваме дали остатъкът е число с 2 дес. знака
    const numStr = result.replace(' €', '').replace(/\s/g, '');
    expect(parseFloat(numStr.replace(',', '.'))).toBeCloseTo(449 / EUR_RATE, 1);
  });

  test('форматира 0 лв. → "0,00 €" или "0.00 €"', () => {
    const result = fmtEur(0);
    expect(result).toMatch(/^0[,.]00 €$/);
  });

  test('fmtEur(EUR_RATE) е приблизително "1,00 €"', () => {
    const result = fmtEur(EUR_RATE);
    expect(result).toMatch(/^1[,.]00 €$/);
  });
});

// ── fmtBgn ───────────────────────────────────────────────────────────────────
// Deprecated utility - no longer used for display anywhere (site is EUR-only),
// but the raw BGN formatting logic itself must still work correctly.
describe('fmtBgn (deprecated, unused for display)', () => {
  test('завършва с " лв."', () => {
    expect(fmtBgn(449)).toMatch(/ лв\.$/);
  });

  test('fmtBgn(0) → "0,00 лв." или "0.00 лв."', () => {
    const result = fmtBgn(0);
    expect(result).toMatch(/^0[,.]00 лв\.$/);
  });

  test('fmtBgn(10) съдържа "10"', () => {
    expect(fmtBgn(10)).toContain('10');
  });

  test('fmtBgn(1000) съдържа "1" и "000"', () => {
    // Locale може да използва разделител на хилядите (1.000 или 1,000)
    const result = fmtBgn(1000);
    expect(result).toContain('1');
    expect(result).toContain('000');
  });
});

// ── fmtPrice ─────────────────────────────────────────────────────────────────
describe('fmtPrice', () => {
  test('съдържа EUR стойността (primary)', () => {
    expect(fmtPrice(449)).toContain('price-eur-main');
  });

  test('съдържа VAT-included hint (без BGN)', () => {
    expect(fmtPrice(449)).toContain('price-vat-sub');
  });

  test('съдържа EUR стойността', () => {
    expect(fmtPrice(449)).toContain('€');
  });

  test('НЕ съдържа BGN стойност', () => {
    expect(fmtPrice(449)).not.toContain('лв.');
  });

  test('без saleCls — class е точно "price-eur-main"', () => {
    expect(fmtPrice(100)).toContain('class="price-eur-main"');
    expect(fmtPrice(100)).not.toContain('class="price-eur-main ');
  });

  test('с saleCls — добавя се към class на price-eur-main', () => {
    expect(fmtPrice(100, 'sale')).toContain('class="price-eur-main sale"');
  });

  test('връща валиден HTML string', () => {
    const html = fmtPrice(449);
    expect(html).toMatch(/^<span.*>.*<\/span><span.*>.*<\/span>$/s);
  });
});

// ── fmtDual ──────────────────────────────────────────────────────────────────
// Historically formatted "EUR / BGN"; now EUR-only (name kept for compatibility
// with existing call sites).
describe('fmtDual', () => {
  test('съдържа EUR стойността', () => {
    expect(fmtDual(449)).toContain('€');
  });

  test('НЕ съдържа BGN стойност', () => {
    expect(fmtDual(449)).not.toContain('лв.');
  });

  test('равно на fmtEur', () => {
    expect(fmtDual(449)).toBe(fmtEur(449));
  });
});
