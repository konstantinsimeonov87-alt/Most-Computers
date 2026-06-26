const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('ERR:', e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Cart
  await page.evaluate(() => window.addToCart(window.products[0].id));
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    document.querySelector('.cart-panel').classList.add('open');
    document.querySelector('.cart-overlay').classList.add('open');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '_vf_cart.png' });

  // Checkout
  await page.evaluate(() => {
    document.querySelector('.cart-panel').classList.remove('open');
    document.querySelector('.cart-overlay').classList.remove('open');
    window.handleCheckout && window.handleCheckout();
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '_vf_checkout_top.png' });
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_vf_checkout_form.png' });

  await br.close();
})();
