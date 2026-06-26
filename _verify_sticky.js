const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('JS ERROR:', e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'verify_sticky_top.png' });

  // Scroll down past toolbar
  await page.evaluate(() => {
    const cp = document.getElementById('catPage');
    if (cp) cp.scrollTop = 400;
  });
  await page.waitForTimeout(500);

  const barInfo = await page.evaluate(() => {
    const bar = document.getElementById('cpStickyBar');
    return {
      className: bar ? bar.className : 'NOT FOUND',
      display: bar ? getComputedStyle(bar).display : 'N/A'
    };
  });
  console.log('StickyBar after scroll:', barInfo);

  await page.screenshot({ path: 'verify_sticky_scroll.png' });
  await br.close();
})();
