const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });

  // 1. Drawer
  await page.click('.mob-menu-btn');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'v_drawer_top.png' });
  // Scroll drawer
  await page.evaluate(() => { const d = document.getElementById('mobDrawer'); if(d) d.scrollTop = 300; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'v_drawer_mid.png' });

  // 2. PDP - related products position
  await page.evaluate(() => { if(typeof closeMobMenu === 'function') closeMobMenu(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(700);
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  const firstId = await page.evaluate(() => {
    const c = document.querySelector('#cpGrid .product-card');
    return parseInt(c?.getAttribute('onclick')?.match(/\d+/)?.[0]);
  });
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });
  await page.evaluate((id) => { if(window.closeCatPage) window.closeCatPage(); setTimeout(() => window.openProductPage && window.openProductPage(id), 200); }, firstId);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'v_pdp_top.png' });
  await page.evaluate(() => {
    const p = document.querySelector('#pdpPage,.pdp-page,[id*="pdp"]');
    if(p) p.scrollTop = 600;
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'v_pdp_mid.png' });

  console.log('JS errors:', errors);
  await br.close();
})();
