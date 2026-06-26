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

  // Home
  await page.screenshot({ path: 'sprint_after_home.png' });

  // Header
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'sprint_after_header.png', clip: { x: 0, y: 0, width: 390, height: 120 } });

  // Categories page
  await page.evaluate(() => window.openMobCatsPage && window.openMobCatsPage());
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'sprint_after_cats.png' });
  await page.evaluate(() => window.closeMobCatsPage && window.closeMobCatsPage());
  await page.waitForTimeout(300);

  // Category page (laptops) + active filter chips
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'sprint_after_catpage.png' });

  // Filter sidebar
  await page.evaluate(() => window.cpOpenSidebar && window.cpOpenSidebar());
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'sprint_after_filter_sidebar.png' });

  if (jsErrors.length) console.log('JS ERRORS:', jsErrors);
  else console.log('No JS errors');
  console.log('After screenshots done');
  await br.close();
})();
