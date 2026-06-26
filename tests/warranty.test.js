'use strict';
/**
 * Тестове за warrantyPage (js/pages.js)
 * Покрива: openWarrantyPage, closeWarrantyPage, URL routing, OGU download link
 */

// ── глобали ──────────────────────────────────────────────────────────────────
global.setPageMeta   = jest.fn();
global.restorePageMeta = jest.fn();
global.bcOnPage      = jest.fn();
global.bcSet         = jest.fn();

// history mock — spy on window.history (jsdom owns window.history, global override doesn't work)
let pushStateMock;
beforeAll(() => {
  pushStateMock = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
});
afterAll(() => { pushStateMock.mockRestore(); });

// ── DOM setup ────────────────────────────────────────────────────────────────
function setupDOM() {
  document.body.innerHTML = `
    <div class="megamenu-page" id="warrantyPage">
      <div class="megamenu-topbar">
        <button id="warrantyBack"></button>
        <nav id="warrantyBc"></nav>
      </div>
      <div id="warrantyHero">
        <a id="oguDownloadLink" href="/ogu-most-computers.html" download="OGU_Most_Computers.html">Свали ОГУ</a>
      </div>
    </div>
    <footer>
      <a id="footerWarrantyLink" data-action="openWarrantyPage">Гаранция</a>
    </footer>
  `;
}

// ── load pages.js ─────────────────────────────────────────────────────────────
// pages.js uses _setPgBc which queries DOM → setup first
setupDOM();

// Stub _setPgBc (defined inside pages.js scope) – not exported, but we test
// open/close via their side effects on classList and history
const {
  openWarrantyPage,
  closeWarrantyPage,
} = require('../../js/pages.js');

// ── Helpers ──────────────────────────────────────────────────────────────────
function getPage() { return document.getElementById('warrantyPage'); }

// ─────────────────────────────────────────────────────────────────────────────
describe('openWarrantyPage()', () => {

  beforeEach(() => {
    setupDOM();
    document.body.style.overflow = '';
    getPage().classList.remove('open');
    jest.clearAllMocks();
  });

  test('добавя клас "open" към warrantyPage', () => {
    openWarrantyPage();
    expect(getPage().classList.contains('open')).toBe(true);
  });

  test('задава overflow:hidden на body', () => {
    openWarrantyPage();
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('извиква setPageMeta с правилното заглавие', () => {
    openWarrantyPage();
    expect(global.setPageMeta).toHaveBeenCalledWith(
      expect.stringContaining('Гаранционни условия'),
      expect.stringContaining('Общи гаранционни условия')
    );
  });

  test('извиква bcOnPage("Гаранционни условия")', () => {
    openWarrantyPage();
    expect(global.bcOnPage).toHaveBeenCalledWith('Гаранционни условия');
  });

  test('pushState добавя ?page=warranty в URL', () => {
    openWarrantyPage();
    expect(pushStateMock).toHaveBeenCalledWith(
      { page: 'warranty' },
      '',
      '?page=warranty'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('closeWarrantyPage()', () => {

  beforeEach(() => {
    setupDOM();
    getPage().classList.add('open');
    document.body.style.overflow = 'hidden';
    jest.clearAllMocks();
  });

  test('премахва клас "open" от warrantyPage', () => {
    closeWarrantyPage();
    expect(getPage().classList.contains('open')).toBe(false);
  });

  test('възстановява overflow на body', () => {
    closeWarrantyPage();
    expect(document.body.style.overflow).toBe('');
  });

  test('извиква restorePageMeta', () => {
    closeWarrantyPage();
    expect(global.restorePageMeta).toHaveBeenCalled();
  });

  test('извиква bcSet с празен масив', () => {
    closeWarrantyPage();
    expect(global.bcSet).toHaveBeenCalledWith([]);
  });

  test('pushState връща към / (без параметри)', () => {
    closeWarrantyPage();
    expect(pushStateMock).toHaveBeenCalledWith(null, '', window.location.pathname);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('warrantyPage DOM структура', () => {

  beforeEach(() => { setupDOM(); });

  test('#warrantyPage елементът съществува в DOM', () => {
    expect(document.getElementById('warrantyPage')).not.toBeNull();
  });

  test('ОГУ download линкът сочи към /ogu-most-computers.html', () => {
    const link = document.getElementById('oguDownloadLink');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('/ogu-most-computers.html');
  });

  test('ОГУ download линкът има download атрибут', () => {
    const link = document.getElementById('oguDownloadLink');
    expect(link.hasAttribute('download')).toBe(true);
  });

  test('footer "Гаранция" линкът отваря warrantyPage (data-action)', () => {
    const link = document.getElementById('footerWarrantyLink');
    expect(link.dataset.action).toBe('openWarrantyPage');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('toggle warrantyPage (open→close→open)', () => {

  beforeEach(() => {
    setupDOM();
    document.body.style.overflow = '';
    jest.clearAllMocks();
  });

  test('отваряне след затваряне работи коректно', () => {
    openWarrantyPage();
    expect(getPage().classList.contains('open')).toBe(true);
    closeWarrantyPage();
    expect(getPage().classList.contains('open')).toBe(false);
    openWarrantyPage();
    expect(getPage().classList.contains('open')).toBe(true);
  });

  test('двойно отваряне не чупи state', () => {
    openWarrantyPage();
    openWarrantyPage();
    expect(getPage().classList.contains('open')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
  });
});
