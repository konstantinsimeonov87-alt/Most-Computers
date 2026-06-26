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

  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Log all available global functions
  const globals = await page.evaluate(() => {
    return Object.keys(window).filter(k => typeof window[k] === 'function' &&
      ['cart','Cart','toggle','Toggle','search','Search','auth','Auth','drawer','Drawer','wish','Wish','quick','Quick','modal','Modal','open','Open'].some(kw => k.includes(kw))
    ).sort();
  });
  console.log('Available global functions:', globals);

  // Check which elements exist in DOM
  const elements = await page.evaluate(() => {
    const ids = ['cart', 'cart-panel', 'cart-drawer', 'cart-sidebar', 'search-overlay', 'search-modal',
                 'auth-modal', 'login-modal', 'quick-order', 'drawer', 'mobile-menu'];
    return ids.map(id => ({
      id,
      exists: !!document.getElementById(id),
      classes: document.getElementById(id)?.className || ''
    })).filter(x => x.exists);
  });
  console.log('DOM elements:', JSON.stringify(elements, null, 2));

  // Find all modals/overlays
  const overlays = await page.evaluate(() => {
    return [...document.querySelectorAll('[id]')]
      .filter(el => {
        const style = window.getComputedStyle(el);
        return el.id && (el.id.includes('cart') || el.id.includes('search') || el.id.includes('auth') ||
               el.id.includes('modal') || el.id.includes('drawer') || el.id.includes('wish'));
      })
      .map(el => ({ id: el.id, class: el.className.substring(0,80), tag: el.tagName }));
  });
  console.log('Overlays/modals found:', JSON.stringify(overlays, null, 2));

  // Try to open cart by clicking the cart icon in nav
  console.log('\n--- Trying cart icon click ---');
  const cartIcon = await page.$('#cart-btn, .cart-btn, [data-action="cart"], nav .cart');
  if (cartIcon) {
    await cartIcon.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'audit_cart_click.png' });
    console.log('Cart icon clicked');
  }

  // Try bottom nav cart button
  const bottomNav = await page.$$('nav button, footer button, .bottom-nav button, .tab-bar button');
  console.log('Bottom nav buttons found:', bottomNav.length);

  // Screenshot the bottom nav area
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // Click the cart in bottom nav (the big red circle)
  try {
    const cartNavBtn = await page.$('.bottom-nav .cart, #bottom-cart, [aria-label*="кошница"], [aria-label*="cart"]');
    if (cartNavBtn) {
      await cartNavBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'audit_cart_bottom_nav.png' });
    }
  } catch(e) { console.log(e.message); }

  // Try evaluate with all toggle functions
  const fns = await page.evaluate(() => Object.keys(window).filter(k => typeof window[k] === 'function').sort());
  console.log('\nAll window functions (first 50):', fns.slice(0,50));

  await br.close();
})();
