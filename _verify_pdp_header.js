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

  // Open laptops, then click a product
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  await page.click('#cpGrid .product-card');
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'verify_pdp_top.png' });

  // Scroll down
  await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop');
    if (bd) bd.scrollTop = 500;
    else window.scrollBy(0, 500);
  });
  await page.waitForTimeout(400);

  const hdrInfo = await page.evaluate(() => {
    const h = document.querySelector('.pdp-mhdr');
    return h ? { position: getComputedStyle(h).position, top: getComputedStyle(h).top } : null;
  });
  console.log('pdp-mhdr computed:', hdrInfo);

  await page.screenshot({ path: 'verify_pdp_scroll.png' });
  await br.close();
})();
