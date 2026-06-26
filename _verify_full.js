const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);

  // Trigger lazy load via scroll
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  // V1 - Homepage (check grid icon for Категории in bottom nav)
  await page.screenshot({ path: 'verify_v1_home.png' });

  // V2 - Category page
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'verify_v2_catpage.png' });

  // V3 - PDP
  await page.click('#cpGrid .product-card');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'verify_v3_pdp.png' });

  // V4 - Footer (cookie bar vs bottom nav)
  await page.evaluate(() => { document.getElementById('prodPreviewSheet')?.classList.remove('open'); });
  await page.evaluate(() => { if(window.closeCatPage) window.closeCatPage(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_v4_footer.png' });

  console.log('JS errors:', errors);
  await br.close();
})();
