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

  // Hide toast if visible
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });

  // Open preview
  await page.evaluate(() => window.openProdPreview(2077));
  await page.waitForTimeout(800);

  // Open full product page directly
  await page.evaluate(() => window.openProductPage(2077));
  await page.waitForTimeout(1500);

  // Screenshot - at top
  await page.screenshot({ path: 'verify_pdpfull_top.png' });

  // Scroll down in PDP backdrop
  await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop');
    if (bd) bd.scrollTop = 600;
  });
  await page.waitForTimeout(400);

  const hdrInfo = await page.evaluate(() => {
    const h = document.querySelector('.pdp-mhdr');
    if (!h) return 'NOT FOUND';
    const rect = h.getBoundingClientRect();
    return {
      position: getComputedStyle(h).position,
      rectTop: Math.round(rect.top),
      isVisible: rect.top >= 0 && rect.top < window.innerHeight
    };
  });
  console.log('pdp-mhdr after scroll down 600px:', hdrInfo);

  await page.screenshot({ path: 'verify_pdpfull_scroll.png' });
  await br.close();
})();
