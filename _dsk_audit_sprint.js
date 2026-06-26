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
  await page.screenshot({ path: 'dsk_home_top.png', fullPage: false });

  // 2. Homepage mid
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'dsk_home_mid.png', fullPage: false });

  // 3. Homepage footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'dsk_home_footer.png', fullPage: false });

  // 4. Megamenu
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.openMegamenu && window.openMegamenu());
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'dsk_megamenu.png', fullPage: false });

  // 5. Category page
  await page.evaluate(() => { window.closeMegamenu && window.closeMegamenu(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'dsk_catpage.png', fullPage: false });

  // 6. Category page grid
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'dsk_catpage_grid.png', fullPage: false });

  // 7. PDP
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const card = await page.$('#cpGrid .product-card, #cpGrid .card, .cat-card');
  if (card) {
    await card.click();
  } else {
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.product-card, .card, .cat-card');
      if (cards.length > 0) cards[0].click();
    });
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'dsk_pdp.png', fullPage: false });

  // 8. PDP mid
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'dsk_pdp_mid.png', fullPage: false });

  // 9. Cart sidebar
  await page.evaluate(() => {
    window.closeProductPage && window.closeProductPage();
    window.closeCatPage && window.closeCatPage();
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'dsk_cart.png', fullPage: false });

  // 10. Search overlay
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(400);
  try {
    const searchBtn = await page.$('.overlay-search-input, [data-action="focusSearch"], .search-btn, .header-search');
    if (searchBtn) {
      await searchBtn.click();
    } else {
      await page.evaluate(() => window.focusSearch && window.focusSearch());
    }
  } catch(e) {}
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'dsk_search.png', fullPage: false });

  console.log('JS Errors:', jsErrors);
  console.log('Screenshots done');
  await br.close();
})();
