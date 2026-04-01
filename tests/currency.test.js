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
describe('fmtBgn', () => {
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
  test('съдържа BGN стойността (primary)', () => {
    expect(fmtPrice(449)).toContain('price-bgn-main');
  });

  test('съдържа EUR стойността (secondary)', () => {
    expect(fmtPrice(449)).toContain('price-eur-sub');
  });

  test('съдържа EUR стойността', () => {
    expect(fmtPrice(449)).toContain('€');
  });

  test('съдържа BGN стойността', () => {
    expect(fmtPrice(449)).toContain('лв.');
  });

  test('без saleCls — class е точно "price-bgn-main"', () => {
    expect(fmtPrice(100)).toContain('class="price-bgn-main"');
    expect(fmtPrice(100)).not.toContain('class="price-bgn-main ');
  });

  test('с saleCls — добавя се към class на price-bgn-main', () => {
    expect(fmtPrice(100, 'sale')).toContain('class="price-bgn-main sale"');
  });

  test('връща валиден HTML string', () => {
    const html = fmtPrice(449);
    expect(html).toMatch(/^<span.*>.*<\/span><span.*>.*<\/span>$/s);
  });
});

// ── fmtDual ──────────────────────────────────────────────────────────────────
describe('fmtDual', () => {
  test('съдържа " / " като разделител', () => {
    expect(fmtDual(449)).toContain(' / ');
  });

  test('съдържа EUR стойността', () => {
    expect(fmtDual(449)).toContain('€');
  });

  test('съдържа BGN стойността', () => {
    expect(fmtDual(449)).toContain('лв.');
  });

  test('EUR е преди BGN', () => {
    const result = fmtDual(449);
    expect(result.indexOf('€')).toBeLessThan(result.indexOf('лв.'));
  });
});
