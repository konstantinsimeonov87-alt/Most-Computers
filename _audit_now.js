const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Home top
  await page.screenshot({ path: 'now_home_top.png' });

  // Home mid (scroll)
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'now_home_mid.png' });

  // Home footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'now_home_footer.png' });

  // Categories page
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.openMobCatsPage && window.openMobCatsPage());
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'now_cats.png' });
  // Scroll down to see rest of cats
  await page.evaluate(() => document.querySelector('.mob-cats-page').scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'now_cats_bottom.png' });
  await page.evaluate(() => window.closeMobCatsPage && window.closeMobCatsPage());
  await page.waitForTimeout(300);

  // Category page
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'now_catpage.png' });

  // PDP modal
  await page.click('#cpGrid .product-card, #cpGrid .card').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'now_pdp.png' });
  await page.evaluate(() => { window.closeProductPage && window.closeProductPage(); window.closeCatPage && window.closeCatPage(); });
  await page.waitForTimeout(400);

  // Cart
  await page.click('#bn-cart, [data-action="toggleCart"]').catch(() => {});
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'now_cart.png' });

  // Menu drawer
  await page.evaluate(() => { window.toggleCart && window.toggleCart(); });
  await page.waitForTimeout(300);
  await page.click('.mob-menu-btn, [data-action="toggleMobMenu"]').catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'now_drawer.png' });

  if (jsErrors.length) console.log('JS ERRORS:', jsErrors.join('\n'));
  else console.log('No JS errors');
  console.log('Audit done');
  await br.close();
})();
