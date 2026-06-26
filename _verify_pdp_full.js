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

  // Open product page directly
  const firstId = await page.evaluate(() => products && products[0] && products[0].id);
  console.log('First product id:', firstId);
  await page.evaluate(id => window.openProductPage(id), firstId);
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'verify_pdp_h_top.png' });

  // Scroll down in PDP
  await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop');
    if (bd) bd.scrollTop = 600;
  });
  await page.waitForTimeout(400);

  const hdrInfo = await page.evaluate(() => {
    const h = document.querySelector('.pdp-mhdr');
    if (!h) return null;
    const rect = h.getBoundingClientRect();
    return {
      position: getComputedStyle(h).position,
      top: getComputedStyle(h).top,
      rectTop: Math.round(rect.top)
    };
  });
  console.log('pdp-mhdr after scroll:', hdrInfo);
  await page.screenshot({ path: 'verify_pdp_h_scroll.png' });
  await br.close();
})();
