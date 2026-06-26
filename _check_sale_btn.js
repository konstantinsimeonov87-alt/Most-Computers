const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Open laptops category
  await page.evaluate(() => { if(window.openCatPage) window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'sale_btn_catpage.png' });

  // Open filters/sidebar if there is one
  const filterBtn = await page.$('[data-action="toggleFilters"], .filter-toggle, #filterToggle, .filters-btn');
  if (filterBtn) {
    await filterBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'sale_btn_filters.png' });
  }

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
