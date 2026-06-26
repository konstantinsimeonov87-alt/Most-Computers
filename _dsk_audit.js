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

  // Homepage — top
  await page.screenshot({ path: 'dsk_home_top.png' });

  // Homepage — mid
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk_home_mid.png' });

  // Homepage — footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk_home_footer.png' });

  // Megamenu
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.openMegamenu && window.openMegamenu());
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'dsk_megamenu.png' });

  // Category page — sidebar + grid
  await page.evaluate(() => { window.closeMegamenu && window.closeMegamenu(); window.openCatPage && window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'dsk_catpage.png' });

  // Category page — scroll
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk_catpage_grid.png' });

  // PDP
  await page.evaluate(() => window.scrollTo(0, 0));
  const card = await page.$('#cpGrid .product-card, #cpGrid .card');
  if (card) {
    try { await card.click({ timeout: 5000 }); } catch(e) { console.log('card click failed:', e.message.split('\n')[0]); }
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'dsk_pdp.png' });

  // PDP mid
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dsk_pdp_mid.png' });

  // Cart sidebar
  await page.evaluate(() => { window.closeProductPage && window.closeProductPage(); window.closeCatPage && window.closeCatPage(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'dsk_cart.png' });

  // Close cart, open search
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(300);
  try {
    const searchBtn = await page.$('[data-action="focusSearch"]');
    if (searchBtn) { await searchBtn.click({ timeout: 3000, force: true }); }
    else {
      await page.evaluate(() => {
        const btn = document.querySelector('[data-action="focusSearch"]');
        if (btn) btn.click();
      });
    }
  } catch(e) { console.log('search click skipped:', e.message.split('\n')[0]); }
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'dsk_search.png' });

  console.log('JS_ERRORS:', JSON.stringify(jsErrors));
  await br.close();
})();
