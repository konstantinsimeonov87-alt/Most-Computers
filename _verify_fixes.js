const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('JS ERROR:', e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Full cats page - check Софтуер card
  await page.evaluate(() => window.openMobCatsPage && window.openMobCatsPage());
  await page.waitForTimeout(600);
  // Scroll to bottom to see Софтуер
  await page.evaluate(() => document.querySelector('.mob-cats-page').scrollTo(0, 9999));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'fix_cats_bottom.png' });
  await page.evaluate(() => window.closeMobCatsPage && window.closeMobCatsPage());
  await page.waitForTimeout(300);

  // Catpage — check subcat fade
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'fix_catpage_subcat.png', clip: { x: 0, y: 40, width: 390, height: 120 } });

  console.log('Verify done');
  await br.close();
})();
