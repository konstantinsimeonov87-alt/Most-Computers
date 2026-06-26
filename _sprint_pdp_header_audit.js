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
  await page.waitForTimeout(5000);

  // Open catPage first, then click product via JS evaluate
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(2000);

  // Use the queued stub approach - it will drain when lazy bundle is ready
  // Then wait extra for lazy bundle
  await page.evaluate(() => {
    const p = window.products && window.products.find(x => x.cat === 'laptops');
    if (p) window.openProductPage(p.id);
  });
  await page.waitForTimeout(3000);

  const pdpOpen = await page.evaluate(() => document.getElementById('pdpBackdrop')?.classList.contains('open'));
  console.log('PDP open:', pdpOpen);

  if (pdpOpen) {
    // Full PDP screenshot
    await page.screenshot({ path: '_sprint_pdp_hdr_full.png' });
    // Top 150px only (header area)
    await page.screenshot({ path: '_sprint_pdp_hdr_top.png', clip: { x: 0, y: 0, width: 390, height: 150 } });

    // Check sticky bar too
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(500);
    await page.screenshot({ path: '_sprint_pdp_scroll.png' });
  } else {
    // just take homepage
    await page.screenshot({ path: '_sprint_pdp_hdr_full.png' });
    console.log('PDP still closed - screenshot of homepage taken');
  }

  await br.close();
})();
