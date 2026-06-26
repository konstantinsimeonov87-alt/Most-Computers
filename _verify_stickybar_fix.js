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

  // Check sticky bar state at PDP top
  const info = await page.evaluate(() => {
    const bar = document.getElementById('pdpStickyBar');
    const bs = document.getElementById('pdpBottomSheet');
    const thumb = document.getElementById('pdpStickyThumb');
    return {
      stickyVisible: bar ? bar.classList.contains('visible') : null,
      stickyBottom: bar ? getComputedStyle(bar).bottom : null,
      bsOpen: bs ? bs.classList.contains('open') : null,
      thumbHasImg: thumb ? thumb.innerHTML.includes('<img') : false,
    };
  });
  console.log('PDP top:', JSON.stringify(info));
  await page.screenshot({ path: 'fix_sticky_top.png' });

  // Scroll to middle
  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) el.scrollTo({ top: 1500, behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'fix_sticky_mid.png' });

  // Scroll to end
  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) el.scrollTo({ top: 99999, behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  const info2 = await page.evaluate(() => {
    const bar = document.getElementById('pdpStickyBar');
    return { stickyVisible: bar ? bar.classList.contains('visible') : null };
  });
  console.log('PDP end:', JSON.stringify(info2));
  await page.screenshot({ path: 'fix_sticky_end.png' });

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
