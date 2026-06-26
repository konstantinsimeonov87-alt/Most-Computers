const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });
  // Home — bottom nav
  await page.screenshot({ path: 'vnav_home.png' });
  // Каталог → category sheet
  await page.click('#bn-cats');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'vnav_catsheet.png' });
  // Close sheet
  await page.click('#catSheetOverlay');
  await page.waitForTimeout(400);
  // Drawer (hamburger in header)
  await page.click('.mob-menu-btn');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'vnav_drawer.png' });
  await br.close();
  console.log('done');
})();
