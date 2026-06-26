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

  // Open cat page
  await page.evaluate(() => { if(window.openCatPage) window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);

  // Open full PDP via eye icon
  const eyeBtn = await page.$('#cpGrid .product-quick-view-btn');
  if (eyeBtn) {
    await eyeBtn.click();
    await page.waitForTimeout(2000);
  }

  // PDP top
  await page.screenshot({ path: 'now_pdp_top.png' });

  // PDP scrolled to specs
  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) el.scrollTo({ top: 2000, behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'now_pdp_specs.png' });

  // PDP scrolled to end (recently viewed)
  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) el.scrollTo({ top: 99999, behavior: 'instant' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'now_pdp_end.png' });

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
