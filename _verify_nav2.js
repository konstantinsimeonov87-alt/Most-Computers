const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });
  await page.screenshot({ path: 'vnav2_home.png' });
  await page.click('#bn-cats');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'vnav2_catsheet.png' });
  await page.evaluate(() => { const s = document.getElementById('catSheet'); const o = document.getElementById('catSheetOverlay'); if(s) s.classList.remove('open'); if(o) o.classList.remove('open'); document.body.style.overflow = ''; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'vnav2_home2.png' });
  await br.close();
  console.log('done');
})();
