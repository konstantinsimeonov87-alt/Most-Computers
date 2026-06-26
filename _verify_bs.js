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

  // Click eye icon to open full PDP
  const eyeBtn = await page.$('#cpGrid .product-quick-view-btn');
  if (eyeBtn) {
    await eyeBtn.click();
    await page.waitForTimeout(2000);
  }

  // Screenshot at top of PDP
  await page.screenshot({ path: 'vbs_top.png' });

  // Check bottom sheet visibility
  const bsInfo = await page.evaluate(() => {
    const sheet = document.getElementById('pdpBottomSheet');
    const backdrop = document.getElementById('pdpBackdrop');
    return {
      sheetOpen: sheet ? sheet.classList.contains('open') : null,
      backdropOpen: backdrop ? backdrop.classList.contains('open') : null,
    };
  });
  console.log('At PDP top:', JSON.stringify(bsInfo));

  // Scroll deep into specs
  await page.evaluate(() => {
    const el = document.getElementById('pdpBackdrop');
    if (el) {
      el.scrollTo({ top: 3000, behavior: 'instant' });
      el.dispatchEvent(new Event('scroll'));
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'vbs_scroll.png' });

  const bsInfo2 = await page.evaluate(() => {
    const sheet = document.getElementById('pdpBottomSheet');
    return { sheetOpen: sheet ? sheet.classList.contains('open') : null };
  });
  console.log('At deep scroll:', JSON.stringify(bsInfo2));

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
