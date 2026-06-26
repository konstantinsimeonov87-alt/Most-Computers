const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('JS ERROR:', e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Open laptops cat
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);

  // Get first product id from the grid
  const prodId = await page.evaluate(() => {
    const card = document.querySelector('#cpGrid .product-card');
    if (card) return card.getAttribute('onclick') || card.dataset.id || '';
    return '';
  });
  console.log('Card onclick:', prodId);

  // Open preview then click "Всички детайли"
  await page.click('#cpGrid .product-card');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_pdp_f1.png' });

  // Click "Всички детайли" button in preview
  const detailBtn = await page.$('.pp-details-btn, [onclick*="openProductPage"]');
  if (detailBtn) {
    await detailBtn.click();
  } else {
    // Try evaluate
    await page.evaluate(() => {
      const btn = document.querySelector('#prodPreviewSheet a, #prodPreviewSheet button');
      console.log('Available buttons:', document.querySelector('#prodPreviewSheet')?.innerHTML?.substring(0, 200));
    });
    const pdpId = await page.evaluate(() => window._ppProductId);
    console.log('PDP product id from preview:', pdpId);
    await page.evaluate(id => window.openProductPage(id), pdpId);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'verify_pdp_f2.png' });

  // Scroll down
  await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop');
    if (bd) bd.scrollTop = 600;
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'verify_pdp_f3_scroll.png' });

  const hdrInfo = await page.evaluate(() => {
    const h = document.querySelector('.pdp-mhdr');
    if (!h) return 'NOT FOUND';
    const rect = h.getBoundingClientRect();
    return { position: getComputedStyle(h).position, rectTop: Math.round(rect.top) };
  });
  console.log('pdp-mhdr:', hdrInfo);

  await br.close();
})();
