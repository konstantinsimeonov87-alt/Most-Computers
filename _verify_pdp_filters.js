const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(700);

  // PDP sheet
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  await page.click('#cpGrid .product-card');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'v_pdp_new.png' });

  // Filters with close + apply
  await page.evaluate(() => document.getElementById('prodPreviewSheet')?.classList.remove('open'));
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Филтри') && b.className.includes('cp-filter-btn'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'v_filters_new.png' });

  await br.close();
})();
