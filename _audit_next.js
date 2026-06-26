const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('ERR:', e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(700);

  // PDP sheet
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  await page.click('#cpGrid .product-card');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'next_pdp.png' });

  // Filters sidebar
  await page.evaluate(() => document.getElementById('prodPreviewSheet')?.classList.remove('open'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'next_catpage.png' });

  // Click Филтри button
  const filterBtn = await page.$('.cp-filter-btn, [onclick*="filter"], button:has-text("Филтри")');
  if (filterBtn) {
    await filterBtn.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: 'next_filters.png' });
  } else {
    console.log('No filter button found');
    await page.screenshot({ path: 'next_filters.png' });
  }

  await br.close();
})();
