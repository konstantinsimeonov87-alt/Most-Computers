const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Homepage — breadcrumb (should not show or show only "Начало")
  await page.screenshot({ path: 'bc_home.png', clip: { x: 0, y: 55, width: 1440, height: 60 } });

  // 2. Category page breadcrumb
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'bc_catpage.png', clip: { x: 0, y: 55, width: 1440, height: 60 } });

  // 3. PDP breadcrumb — click first product
  const card = await page.$('#cpGrid .product-card, #cpGrid .card');
  if (card) {
    try { await card.click({ timeout: 5000 }); } catch(e) {}
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'bc_pdp.png', clip: { x: 0, y: 55, width: 1440, height: 60 } });

  // Also full PDP screenshot for context
  await page.screenshot({ path: 'bc_pdp_full.png' });

  // 4. PDP breadcrumb text content
  const bcText = await page.evaluate(() => {
    const bc = document.querySelector('.breadcrumb, [aria-label="breadcrumb"], .pdp-breadcrumb, nav.breadcrumb');
    return bc ? bc.innerText.trim() : 'BREADCRUMB NOT FOUND';
  });
  console.log('PDP breadcrumb text:', bcText);

  // 5. Navigate to another category
  await page.evaluate(() => { window.closeProductPage && window.closeProductPage(); window.openCatPage && window.openCatPage('components'); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'bc_catpage2.png', clip: { x: 0, y: 55, width: 1440, height: 60 } });

  // 6. Click product from components
  const card2 = await page.$('#cpGrid .product-card, #cpGrid .card');
  if (card2) {
    try { await card2.click({ timeout: 5000 }); } catch(e) {}
  }
  await page.waitForTimeout(1200);
  const bcText2 = await page.evaluate(() => {
    const bc = document.querySelector('.breadcrumb, [aria-label="breadcrumb"], .pdp-breadcrumb, nav.breadcrumb');
    return bc ? bc.innerText.trim() : 'BREADCRUMB NOT FOUND';
  });
  console.log('PDP2 (components) breadcrumb text:', bcText2);
  await page.screenshot({ path: 'bc_pdp2.png', clip: { x: 0, y: 55, width: 1440, height: 60 } });

  console.log('JS_ERRORS:', JSON.stringify(jsErrors));
  await br.close();
})();
