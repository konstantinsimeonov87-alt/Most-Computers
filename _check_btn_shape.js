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

  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) el.scrollTo({ top: 500, behavior: 'instant' });
  });
  await page.waitForTimeout(400);

  const info = await page.evaluate(() => {
    const btns = document.querySelectorAll('.pdp-secondary-actions .pdp-sec-btn, .pdp-secondary-actions .pdp-price-alert-btn');
    return Array.from(btns).map(btn => {
      const cs = getComputedStyle(btn);
      const rect = btn.getBoundingClientRect();
      return {
        text: btn.textContent.trim().substring(0, 20),
        borderRadius: cs.borderRadius,
        height: rect.height,
        width: rect.width,
        flexDirection: cs.flexDirection,
        whiteSpace: cs.whiteSpace,
        padding: cs.padding,
      };
    });
  });
  console.log(JSON.stringify(info, null, 2));

  // Zoom in on just the secondary actions
  await page.screenshot({ path: 'shape_check.png', clip: { x: 0, y: 150, width: 390, height: 120 } });
  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
