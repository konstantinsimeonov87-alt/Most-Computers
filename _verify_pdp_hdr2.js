const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });

  // Trigger lazy bundle with a click
  await page.click('body');
  await page.waitForTimeout(1500);

  // Navigate to laptops and open a product
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);

  // Click first product card to trigger preview
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });
  await page.evaluate(() => window.openProdPreview(2077));
  await page.waitForTimeout(800);

  // Open full PDP
  await page.evaluate(() => window.openProductPage(2077));
  await page.waitForTimeout(2000);

  const isOpen = await page.evaluate(() =>
    document.getElementById('pdpBackdrop')?.classList.contains('open')
  );
  console.log('PDP open:', isOpen);

  const hdrDisplay = await page.evaluate(() => {
    const h = document.querySelector('.pdp-mhdr');
    return h ? getComputedStyle(h).display : 'NOT FOUND';
  });
  console.log('pdp-mhdr display:', hdrDisplay);

  await page.screenshot({ path: 'verify_pdp_clean.png' });
  await br.close();
})();
