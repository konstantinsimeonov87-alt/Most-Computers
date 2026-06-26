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

  // Open laptops category
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);

  const barInfo = await page.evaluate(() => {
    const bar = document.getElementById('cpSubcatBar');
    if (!bar) return { exists: false };
    return {
      exists: true,
      className: bar.className,
      display: getComputedStyle(bar).display,
      childCount: bar.children.length,
      pills: Array.from(bar.querySelectorAll('.subcat-pill')).map(b => b.textContent.trim())
    };
  });
  console.log('SubcatBar:', JSON.stringify(barInfo, null, 2));

  await page.screenshot({ path: 'verify_subcat.png' });
  await br.close();
})();
