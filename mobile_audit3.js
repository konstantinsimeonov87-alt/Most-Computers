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

  // CART - add product first then open
  console.log('Cart: adding product and opening...');
  await page.evaluate(() => {
    // Find first product and add to cart
    const addBtn = document.querySelector('[onclick*="addToCart"], .add-to-cart, [data-action="add-cart"]');
    if (addBtn) addBtn.click();
  });
  await page.waitForTimeout(500);

  // Click the big red cart button in bottom nav
  await page.evaluate(() => {
    // Try to find cart toggle in bottom nav
    const btns = [...document.querySelectorAll('button, a')];
    const cartBtn = btns.find(b => b.textContent.includes('кошниц') || b.getAttribute('aria-label')?.includes('cart') ||
      b.className?.includes('cart') || b.id?.includes('cart'));
    if (cartBtn) { console.log('found cart btn:', cartBtn.outerHTML.substring(0,100)); cartBtn.click(); }
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_05b_cart.png' });

  // Reset
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // SEARCH
  console.log('Search overlay...');
  await page.evaluate(() => window.focusSearch());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'audit_06b_search.png' });

  // Type something in search
  await page.keyboard.type('лаптоп');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_06c_search_results.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // AUTH
  console.log('Auth modal...');
  await page.evaluate(() => window.openAuthModal());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_09b_auth.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // QUICK ORDER
  console.log('Quick order...');
  await page.evaluate(() => window.openQuickOrder && window.openQuickOrder());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_10b_quick_order.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // PROFILE PAGE
  console.log('Profile page...');
  await page.evaluate(() => window.openProfilePage && window.openProfilePage());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_11_profile.png' });

  console.log('Done!');
  await br.close();
})();
