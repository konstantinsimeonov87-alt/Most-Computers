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
  await page.waitForTimeout(5000); // wait for lazy bundle

  // Confirm lazy bundle loaded (real openProductPage)
  const isReal = await page.evaluate(() => window.openProductPage.toString().includes('pdpBackdrop') || window.openProductPage.toString().includes('pdpProductId'));
  console.log('Real openProductPage loaded:', isReal);

  // Open catPage and click a product via JS
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(2000);

  // Click product card via JS evaluate (avoids overlay interference)
  await page.evaluate(() => {
    const card = document.querySelector('#cpGrid .product-card');
    if (card) card.click();
  });
  await page.waitForTimeout(2000);

  const pdpOpen = await page.evaluate(() => document.getElementById('pdpBackdrop')?.classList.contains('open'));
  console.log('PDP is open:', pdpOpen);

  if (!pdpOpen) {
    // Fallback: open first product directly
    await page.evaluate(() => {
      const p = window.products && window.products.find(x => x.cat === 'laptops');
      if (p) window.openProductPage(p.id);
    });
    await page.waitForTimeout(2000);
  }

  const pdpOpen2 = await page.evaluate(() => document.getElementById('pdpBackdrop')?.classList.contains('open'));
  console.log('PDP open (final):', pdpOpen2);

  // Screenshot with PDP open
  await page.screenshot({ path: '_verify_back_button_mobile.png' });

  // Check back button
  const btnInfo = await page.evaluate(() => {
    const b = document.querySelector('.pdp-back-btn');
    if (!b) return { found: false };
    const s = getComputedStyle(b);
    return { found: true, display: s.display, vis: s.visibility, text: b.textContent.trim() };
  });
  console.log('Back button info:', JSON.stringify(btnInfo));

  // Click back button
  if (pdpOpen2 && btnInfo.found) {
    await page.evaluate(() => document.querySelector('.pdp-back-btn').click());
    await page.waitForTimeout(1000);
    const pdpClosed = !await page.evaluate(() => document.getElementById('pdpBackdrop')?.classList.contains('open'));
    console.log('PDP closed after Назад:', pdpClosed);
    await page.screenshot({ path: '_verify_after_back_click.png' });
    console.log(pdpClosed ? 'PASS: Back button works' : 'FAIL: PDP still open');
  } else {
    console.log('SKIP: PDP not open or button not found');
  }

  console.log('JS errors:', jsErrors);
  await br.close();
})();
