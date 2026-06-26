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

  // V1: PDP - verify wider layout + info card treatment
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  // click via JS to avoid intercept issues
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.product-card');
    if (cards.length > 0) cards[0].click();
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'dsk_verify_pdp.png', fullPage: false });

  // V2: PDP mid - verify recs widget larger
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk_verify_pdp_recs.png', fullPage: false });

  // V3: Cat page - verify sidebar filter readability
  await page.evaluate(() => {
    window.closeProductPage && window.closeProductPage();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'dsk_verify_catpage.png', fullPage: false });

  // V4: Homepage + search bar - verify wider
  await page.evaluate(() => window.closeCatPage && window.closeCatPage());
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk_verify_search.png', fullPage: false });

  // V5: Cart empty state - verify centered
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'dsk_verify_cart.png', fullPage: false });

  console.log('JS Errors:', jsErrors);
  console.log('Verify screenshots done');
  await br.close();
})();
