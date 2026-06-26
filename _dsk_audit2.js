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

  // 1. Homepage top
  await page.screenshot({ path: 'dsk2_home_top.png' });

  // 2. Hero mid
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk2_home_mid.png' });

  // 3. Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'dsk2_footer.png' });

  // 4. Megamenu
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.openMegamenu && window.openMegamenu());
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'dsk2_megamenu.png' });

  // 5. Category page
  await page.evaluate(() => window.closeMegamenu && window.closeMegamenu());
  await page.waitForTimeout(300);
  await page.evaluate(() => window.openCatPage && window.openCatPage('components'));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'dsk2_catpage.png' });

  // 6. Category page cards
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk2_catpage_cards.png' });

  // 7. PDP via JS click
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.product-card');
    if (cards[0]) cards[0].click();
  });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: 'dsk2_pdp_top.png' });

  // 8. PDP specs/tabs
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk2_pdp_specs.png' });

  // 9. PDP related products
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk2_pdp_related.png' });

  // 10. Cart with item — use JS to add
  await page.evaluate(() => {
    window.closeProductPage && window.closeProductPage();
    window.closeCatPage && window.closeCatPage();
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  // Click add-to-cart via JS to avoid intercept issue
  await page.evaluate(() => {
    const btn = document.querySelector('.add-cart-btn');
    if (btn) btn.click();
  });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.closeCatPage && window.closeCatPage());
  await page.waitForTimeout(400);
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'dsk2_cart_with_item.png' });

  console.log('JS Errors:', jsErrors);
  console.log('Audit 2 done');
  await br.close();
})();
