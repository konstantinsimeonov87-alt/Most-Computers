'use strict';
/**
 * Тестове за wishlist (js/auth.js)
 * Покрива: toggleWishlist — добавяне, премахване, localStorage
 */

// ── глобали, нужни на auth.js ────────────────────────────────────────────────
global.showToast = jest.fn();

// auth.js изисква DOM елементи в updateWishlistUI — задаваме ги минимално
function setupWishlistDOM() {
  document.body.innerHTML = `
    <span id="wlHdrBadge"></span>
    <span id="wlHdrIcon">♡</span>
    <span id="bnWishBadge" class=""></span>
    <span id="wishlistCount"></span>
    <div  id="wishlistPage"></div>
  `;
}

const { toggleWishlist, _resetWishlist } = require('../../js/auth.js');

// Фиктивно събитие — toggleWishlist извиква e.stopPropagation()
const fakeEvent = { stopPropagation: jest.fn() };

beforeEach(() => {
  setupWishlistDOM();
  localStorage.clear();
  _resetWishlist(); // нулира вътрешния масив в модула
});

describe('toggleWishlist — добавяне', () => {
  test('добавя продукт в localStorage', () => {
    toggleWishlist(1, fakeEvent);
    const saved = JSON.parse(localStorage.getItem('mc_wishlist'));
    expect(saved).toContain(1);
  });

  test('добавя два различни продукта', () => {
    toggleWishlist(1, fakeEvent);
    toggleWishlist(2, fakeEvent);
    const saved = JSON.parse(localStorage.getItem('mc_wishlist'));
    expect(saved).toContain(1);
    expect(saved).toContain(2);
    expect(saved).toHaveLength(2);
  });

  test('показва toast при добавяне', () => {
    toggleWishlist(1, fakeEvent);
    expect(global.showToast).toHaveBeenCalledWith(expect.stringContaining('Добавено'));
  });
});

describe('toggleWishlist — премахване', () => {
  test('премахва вече добавен продукт', () => {
    toggleWishlist(1, fakeEvent); // добавяме
    toggleWishlist(1, fakeEvent); // премахваме
    const saved = JSON.parse(localStorage.getItem('mc_wishlist'));
    expect(saved).not.toContain(1);
    expect(saved).toHaveLength(0);
  });

  test('показва toast при премахване', () => {
    toggleWishlist(1, fakeEvent); // добавяме
    jest.clearAllMocks();
    toggleWishlist(1, fakeEvent); // премахваме
    expect(global.showToast).toHaveBeenCalledWith(expect.stringContaining('Премахнато'));
  });

  test('не засяга другите продукти в wishlist', () => {
    toggleWishlist(1, fakeEvent);
    toggleWishlist(2, fakeEvent);
    toggleWishlist(1, fakeEvent); // премахваме само 1
    const saved = JSON.parse(localStorage.getItem('mc_wishlist'));
    expect(saved).not.toContain(1);
    expect(saved).toContain(2);
  });
});

describe('toggleWishlist — DOM', () => {
  test('обновява wlHdrIcon при добавяне', () => {
    toggleWishlist(1, fakeEvent);
    expect(document.getElementById('wlHdrIcon').textContent).toBe('❤');
  });

  test('обновява wlHdrBadge с правилния брой', () => {
    toggleWishlist(1, fakeEvent);
    toggleWishlist(2, fakeEvent);
    expect(document.getElementById('wlHdrBadge').textContent).toBe('2');
  });
});
