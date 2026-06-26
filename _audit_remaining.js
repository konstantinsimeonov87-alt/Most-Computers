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

  // 1. Drawer bottom (auth button)
  await page.click('.mob-menu-btn');
  await page.waitForTimeout(600);
  const drawer = await page.$('#mobDrawer');
  if (drawer) {
    await page.evaluate(() => { document.getElementById('mobDrawer').scrollTop = 9999; });
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: 'audit_drawer_auth.png' });

  // 2. Subcat chips in laptops category
  await page.evaluate(() => closeMobMenu());
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(2000);
  const subcatInfo = await page.evaluate(() => {
    const bar = document.getElementById('cpSubcatBar');
    return { display: bar?.style.display, className: bar?.className, childCount: bar?.children.length, innerHTML: bar?.innerHTML.substring(0,200) };
  });
  console.log('Subcat bar:', JSON.stringify(subcatInfo));
  await page.screenshot({ path: 'audit_catpage_subcat.png' });

  // 3. Wishlist from bottom nav
  await page.evaluate(() => window.closeCatPage && window.closeCatPage());
  await page.waitForTimeout(300);
  await page.click('#bn-wish');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'audit_wishlist.png' });

  // 4. Profile from bottom nav
  await page.evaluate(() => { document.querySelector('#wishlistPage')?.classList.remove('open'); document.body.style.overflow = ''; });
  await page.waitForTimeout(300);
  const profileBtn = await page.$('[id="bn-profile"], .bn-item:last-child');
  if (profileBtn) { await profileBtn.click(); await page.waitForTimeout(700); }
  await page.screenshot({ path: 'audit_profile.png' });

  console.log('JS errors:', errors);
  await br.close();
})();
