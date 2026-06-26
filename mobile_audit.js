const { chromium } = require('playwright');

(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const page = await ctx.newPage();

  // Helper to safely call a JS function
  async function tryEval(fn) {
    try { await page.evaluate(fn); } catch(e) { console.log('eval error:', e.message); }
  }

  // Helper to close any open overlay by pressing Escape
  async function closeOverlays() {
    try {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    } catch(e) {}
  }

  console.log('Loading homepage...');
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Homepage top
  console.log('1. Homepage top...');
  await page.screenshot({ path: 'audit_01_home_top.png', fullPage: false });

  // 2. Homepage mid - scroll 400px
  console.log('2. Homepage mid (scroll 400px)...');
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'audit_02_home_mid.png', fullPage: false });

  // 3. Homepage bottom / footer
  console.log('3. Homepage bottom / footer...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'audit_03_home_footer.png', fullPage: false });

  // Reset scroll
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // 4. Product modal - click first product card
  console.log('4. Product modal...');
  try {
    // Try different selectors for product card
    const selectors = ['.product-card', '.product-item', '[data-product-id]', '.grid-item', '.card'];
    let clicked = false;
    for (const sel of selectors) {
      const el = await page.$(sel);
      if (el) {
        await el.click();
        clicked = true;
        console.log(`  Clicked: ${sel}`);
        break;
      }
    }
    if (!clicked) {
      // Try clicking something that looks like a product
      await page.evaluate(() => {
        const links = [...document.querySelectorAll('a')];
        const productLink = links.find(a => a.href && (a.href.includes('product') || a.href.includes('?id=') || a.href.includes('/p/')));
        if (productLink) productLink.click();
      });
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'audit_04_product_modal.png', fullPage: false });
  } catch(e) {
    console.log('  Product modal error:', e.message);
    await page.screenshot({ path: 'audit_04_product_modal.png', fullPage: false });
  }
  await closeOverlays();

  // 5. Cart
  console.log('5. Cart...');
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  try {
    await tryEval(() => window.toggleCart && window.toggleCart());
    await page.waitForTimeout(1500);
    // Check if cart opened, if not try clicking cart icon
    const cartVisible = await page.evaluate(() => {
      const cart = document.querySelector('#cart, .cart-drawer, .cart-panel, [id*="cart"], [class*="cart-drawer"]');
      return cart && (cart.style.display !== 'none') && !cart.classList.contains('hidden');
    });
    if (!cartVisible) {
      const cartBtn = await page.$('[id*="cart-btn"], .cart-icon, [aria-label*="cart"], [aria-label*="кошница"]');
      if (cartBtn) await cartBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch(e) { console.log('  Cart error:', e.message); }
  await page.screenshot({ path: 'audit_05_cart.png', fullPage: false });
  await closeOverlays();

  // 6. Search overlay
  console.log('6. Search overlay...');
  await page.waitForTimeout(500);
  try {
    await tryEval(() => window.focusSearch && window.focusSearch());
    await page.waitForTimeout(1000);
    // If not opened, try clicking search icon
    const searchVisible = await page.evaluate(() => {
      const search = document.querySelector('#search-overlay, .search-overlay, [id*="search"]');
      return search && search.style.display !== 'none';
    });
    if (!searchVisible) {
      const searchBtn = await page.$('[aria-label*="search"], [aria-label*="търсене"], .search-btn, #search-btn');
      if (searchBtn) await searchBtn.click();
      await page.waitForTimeout(800);
    }
  } catch(e) { console.log('  Search error:', e.message); }
  await page.screenshot({ path: 'audit_06_search.png', fullPage: false });
  await closeOverlays();

  // 7. Mobile menu / drawer
  console.log('7. Mobile menu/drawer...');
  await page.waitForTimeout(500);
  try {
    await tryEval(() => {
      if (window.openMobCatsPage) window.openMobCatsPage();
      else if (window.toggleDrawer) window.toggleDrawer();
      else if (window.openDrawer) window.openDrawer();
    });
    await page.waitForTimeout(1500);
    // If not opened, try hamburger
    const drawerVisible = await page.evaluate(() => {
      const drawer = document.querySelector('.drawer, .mobile-menu, .sidebar, [id*="drawer"], [id*="mobile-menu"]');
      return drawer && drawer.style.display !== 'none' && !drawer.classList.contains('hidden');
    });
    if (!drawerVisible) {
      const hamburger = await page.$('.hamburger, .menu-toggle, [aria-label*="menu"], [aria-label*="меню"], #hamburger');
      if (hamburger) await hamburger.click();
      await page.waitForTimeout(800);
    }
  } catch(e) { console.log('  Drawer error:', e.message); }
  await page.screenshot({ path: 'audit_07_menu_drawer.png', fullPage: false });
  await closeOverlays();

  // 8. Wishlist
  console.log('8. Wishlist...');
  await page.waitForTimeout(500);
  try {
    await tryEval(() => window.openWishlist && window.openWishlist());
    await page.waitForTimeout(1500);
  } catch(e) { console.log('  Wishlist error:', e.message); }
  await page.screenshot({ path: 'audit_08_wishlist.png', fullPage: false });
  await closeOverlays();

  // 9. Auth modal
  console.log('9. Auth modal...');
  await page.waitForTimeout(500);
  try {
    await tryEval(() => window.openAuth && window.openAuth());
    await page.waitForTimeout(1500);
    const authVisible = await page.evaluate(() => {
      const auth = document.querySelector('#auth-modal, .auth-modal, [id*="auth"], [id*="login"]');
      return auth && auth.style.display !== 'none';
    });
    if (!authVisible) {
      const loginBtn = await page.$('[aria-label*="login"], [aria-label*="влез"], .login-btn, #login-btn');
      if (loginBtn) await loginBtn.click();
      await page.waitForTimeout(800);
    }
  } catch(e) { console.log('  Auth error:', e.message); }
  await page.screenshot({ path: 'audit_09_auth.png', fullPage: false });
  await closeOverlays();

  // 10. Quick order modal
  console.log('10. Quick order...');
  await page.waitForTimeout(500);
  try {
    await tryEval(() => {
      if (window.openQuickOrder) window.openQuickOrder();
      else if (window.quickOrder) window.quickOrder();
    });
    await page.waitForTimeout(1500);
  } catch(e) { console.log('  Quick order error:', e.message); }
  await page.screenshot({ path: 'audit_10_quick_order.png', fullPage: false });

  console.log('Done! All screenshots taken.');
  await br.close();
})();
