const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Verify C1: "Най-продавани" cards visible
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'dsk_verify_footer.png' });

  // Verify C2/C3: Megamenu no 0-product items
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.openMegamenu && window.openMegamenu());
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'dsk_verify_megamenu.png' });

  // Verify C4: PDP gallery
  await page.evaluate(() => { window.closeMegamenu && window.closeMegamenu(); window.openCatPage && window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);
  const card = await page.$('#cpGrid .product-card, #cpGrid .card');
  if (card) {
    try { await card.click({ timeout: 5000 }); } catch(e) {}
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'dsk_verify_pdp.png' });

  // Verify C5: Cart empty state — no total shown
  await page.evaluate(() => { window.closeProductPage && window.closeProductPage(); window.closeCatPage && window.closeCatPage(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'dsk_verify_cart.png' });

  console.log('JS_ERRORS:', JSON.stringify(jsErrors));
  await br.close();
})();
