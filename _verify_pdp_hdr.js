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
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.openProdPreview(2077));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.openProductPage(2077));
  await page.waitForTimeout(1800);
  const info = await page.evaluate(() => {
    const h = document.querySelector('.pdp-mhdr');
    return h ? getComputedStyle(h).display : 'NOT FOUND';
  });
  console.log('pdp-mhdr display:', info);
  await page.screenshot({ path: 'verify_pdp_hdr_hidden.png' });
  await br.close();
})();
