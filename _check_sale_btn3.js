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
  if (eyeBtn) {
    await eyeBtn.click();
    await page.waitForTimeout(2000);
  }

  await page.screenshot({ path: 'sale_sec_actions.png' });

  // Get styles of all sec buttons
  const info = await page.evaluate(() => {
    const btns = document.querySelectorAll('.pdp-sec-btn');
    return Array.from(btns).map(btn => {
      const cs = getComputedStyle(btn);
      return {
        text: btn.textContent.trim(),
        className: btn.className,
        background: cs.background,
        backgroundColor: cs.backgroundColor,
        border: cs.border,
        borderColor: cs.borderColor,
        color: cs.color,
        display: cs.display,
      };
    });
  });
  console.log(JSON.stringify(info, null, 2));

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
