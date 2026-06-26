const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });
  // Bottom nav before opening
  await page.screenshot({ path: 'vmenu_home.png' });
  // Click the new bn-menu button
  await page.click('#bn-menu');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'vmenu_drawer_top.png' });
  // Scroll to see categories in drawer
  await page.evaluate(() => { const b = document.querySelector('.mob-drawer-body'); if(b) b.scrollTop = 300; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'vmenu_drawer_cats.png' });
  await br.close();
  console.log('done');
})();
