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

  // Open cat page and click eye icon to open full PDP
  await page.evaluate(() => { if(window.openCatPage) window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);
  const eyeBtn = await page.$('#cpGrid .product-quick-view-btn');
  if (eyeBtn) {
    await eyeBtn.click();
    await page.waitForTimeout(1500);
  }

  // Check state at top of PDP
  const info = await page.evaluate(() => {
    const btn = document.getElementById('pdpAddBtn');
    const bar = document.getElementById('pdpStickyBar');
    const backdrop = document.getElementById('pdpBackdrop');
    return {
      barVisible: bar ? bar.classList.contains('visible') : null,
      btnBottom: btn ? btn.getBoundingClientRect().bottom : null,
      backdropVisible: backdrop ? window.getComputedStyle(backdrop).visibility : null,
    };
  });
  console.log('PDP at top:', JSON.stringify(info));
  await page.screenshot({ path: 'vsticky_top.png' });

  // Scroll via JS scrollTop
  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) {
      el.scrollTo({ top: 1200, behavior: 'instant' });
      el.dispatchEvent(new Event('scroll'));
    }
  });
  await page.waitForTimeout(800);
  const info2 = await page.evaluate(() => {
    const btn = document.getElementById('pdpAddBtn');
    const bar = document.getElementById('pdpStickyBar');
    return {
      barVisible: bar ? bar.classList.contains('visible') : null,
      btnBottom: btn ? btn.getBoundingClientRect().bottom : null,
    };
  });
  console.log('After scroll 1200:', JSON.stringify(info2));
  await page.screenshot({ path: 'vsticky_scroll1.png' });

  // Scroll much further
  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) {
      el.scrollTo({ top: 4000, behavior: 'instant' });
      el.dispatchEvent(new Event('scroll'));
    }
  });
  await page.waitForTimeout(800);
  const info3 = await page.evaluate(() => {
    const bar = document.getElementById('pdpStickyBar');
    return { barVisible: bar ? bar.classList.contains('visible') : null };
  });
  console.log('After scroll 4000 (specs):', JSON.stringify(info3));
  await page.screenshot({ path: 'vsticky_scroll2.png' });

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
