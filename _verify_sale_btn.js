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
  await page.waitForTimeout(1500);
  await page.evaluate(() => { if(window.openCatPage) window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);
  const eyeBtn = await page.$('#cpGrid .product-quick-view-btn');
  if (eyeBtn) { await eyeBtn.click(); await page.waitForTimeout(2000); }

  // Scroll to show secondary actions
  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) el.scrollTo({ top: 600, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'verify_sale_btn.png' });
  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
