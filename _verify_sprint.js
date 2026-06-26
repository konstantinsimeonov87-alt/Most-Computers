const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);

  // V1 - Homepage bottom nav (check grid icon for Категории)
  await page.screenshot({ path: 'verify_home.png' });

  // V2 - Category page + subcat bar
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'verify_catpage.png' });

  // V3 - PDP click test
  const cards = await page.evaluate(() => document.querySelectorAll('#cpGrid .product-card').length);
  console.log('Cards:', cards);
  if (cards > 0) {
    await page.click('#cpGrid .product-card');
    await page.waitForTimeout(1200);
  }
  const pdpOpen = await page.evaluate(() => document.getElementById('prodPreviewSheet')?.classList.contains('open'));
  console.log('PDP open:', pdpOpen);
  await page.screenshot({ path: 'verify_pdp.png' });

  // V4 - Footer (check cookie bar vs bottom nav)
  await page.evaluate(() => { if(window.closeProductSheet) window.closeProductSheet(); if(window.closeCatPage) window.closeCatPage(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_footer.png' });

  console.log('JS errors:', errors);
  await br.close();
})();
