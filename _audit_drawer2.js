const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);

  // Dismiss toast if present
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) { t.className = ''; t.style.display = 'none'; } });
  await page.waitForTimeout(200);

  // Open drawer via hamburger
  await page.evaluate(() => {
    const b = document.querySelector('.mob-menu-btn,[data-action="toggleMobMenu"]');
    if (b) b.click();
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'drawer_top.png' });

  // Scroll drawer
  await page.evaluate(() => {
    const d = document.querySelector('.mob-drawer,#mobDrawer,.side-drawer,[class*="mob-nav"]');
    console.log('Drawer el:', d?.className, d?.id);
    if (d) d.scrollTop = 300;
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'drawer_mid.png' });

  await page.evaluate(() => {
    const d = document.querySelector('.mob-drawer,#mobDrawer,.side-drawer,[class*="mob-nav"]');
    if (d) d.scrollTop = 700;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'drawer_bot.png' });

  await br.close();
})();
