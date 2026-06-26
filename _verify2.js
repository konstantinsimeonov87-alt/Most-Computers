const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);

  // Trigger scroll to load lazy bundle
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  // Open category page
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);

  // Check openProdPreview availability
  const fnType = await page.evaluate(() => typeof window.openProdPreview);
  console.log('openProdPreview type:', fnType);

  // Click product card
  const cards = await page.evaluate(() => document.querySelectorAll('#cpGrid .product-card').length);
  console.log('Cards:', cards);
  if (cards > 0) {
    await page.click('#cpGrid .product-card');
    await page.waitForTimeout(1500);
  }

  const pdpOpen = await page.evaluate(() => ({
    open: document.getElementById('prodPreviewSheet')?.classList.contains('open'),
    cls: document.getElementById('prodPreviewSheet')?.className
  }));
  console.log('PDP:', JSON.stringify(pdpOpen));
  await page.screenshot({ path: 'verify_pdp2.png' });

  console.log('JS errors:', errors);
  await br.close();
})();
