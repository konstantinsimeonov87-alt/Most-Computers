const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('JS ERR:', e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  await page.evaluate(() => { window.addToCart(window.products[0].id); window.addToCart(window.products[3].id); });
  await page.waitForTimeout(300);

  // Force open both overlay and panel
  await page.evaluate(() => {
    document.querySelector('.cart-panel').classList.add('open');
    document.querySelector('.cart-overlay').classList.add('open');
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: '_cart_open.png' });
  await page.evaluate(() => document.querySelector('.cart-panel').scrollTop = 300);
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_cart_scroll.png' });
  await br.close();
})();
