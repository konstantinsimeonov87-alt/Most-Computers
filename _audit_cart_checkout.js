const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Add a product directly
  const added = await page.evaluate(() => {
    if (window.products && window.products.length > 0) {
      window.addToCart(window.products[0].id);
      return window.products[0].id;
    }
    return null;
  });
  console.log('added product:', added);
  await page.waitForTimeout(500);

  // Open cart
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '_cart_top.png' });

  const cartVisible = await page.evaluate(() => {
    const el = document.querySelector('.cart-panel, .cart-drawer, #cartDrawer, .cart-overlay, [class*="cart"]');
    return el ? { class: el.className, display: getComputedStyle(el).display } : null;
  });
  console.log('cart el:', JSON.stringify(cartVisible));

  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_cart_mid.png' });

  // Checkout
  await page.evaluate(() => window.handleCheckout && window.handleCheckout());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '_checkout_top.png' });
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_checkout_mid.png' });
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_checkout_bot.png' });

  console.log('JS errors:', JSON.stringify(jsErrors));
  await br.close();
})();
