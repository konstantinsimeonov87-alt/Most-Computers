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

  // V1: PDP - verify section dividers
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  await page.evaluate(() => { const c = document.querySelectorAll('.product-card'); if(c[0]) c[0].click(); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'dsk2_verify_pdp.png' });

  // V2: PDP scroll to see tabs
  await page.evaluate(() => { const pdp = document.querySelector('.pdp-backdrop,.pdp-wrap'); if(pdp) pdp.scrollTop = 500; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'dsk2_verify_pdp_tabs.png' });

  // V3: Cat page - verify subcat pills
  await page.evaluate(() => { window.closeProductPage && window.closeProductPage(); });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'dsk2_verify_catpage.png' });

  // V4: Homepage bestsellers - verify opacity
  await page.evaluate(() => { window.closeCatPage && window.closeCatPage(); });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 200));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'dsk2_verify_bestsellers.png' });

  // V5: Cart with item - verify no duplicate message
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  await page.evaluate(() => { const btn = document.querySelector('.add-cart-btn'); if(btn) btn.click(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => { window.closeCatPage && window.closeCatPage(); });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'dsk2_verify_cart.png' });

  console.log('JS Errors:', jsErrors);
  console.log('Verify 2 done');
  await br.close();
})();
