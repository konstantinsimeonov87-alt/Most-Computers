const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Screenshot just the tabs area
  const wrap = await page.$('.mob-hp-tabs-wrap');
  const box = wrap ? await wrap.boundingBox() : null;
  console.log('tabs-wrap box:', JSON.stringify(box));
  if (box) {
    await page.screenshot({ path: '_verify_tabs_row.png', clip: { x: 0, y: box.y - 2, width: 390, height: box.height + 4 } });
  }
  await page.screenshot({ path: '_verify_tabs_full.png', clip: { x: 0, y: 0, width: 390, height: 300 } });
  await br.close();
})();
