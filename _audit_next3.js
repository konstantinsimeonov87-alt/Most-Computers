const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(800);

  // 1. Drawer меню
  await page.evaluate(() => window.scrollTo(0,0));
  await page.waitForTimeout(200);
  const menuBtn = await page.$('.mob-menu-btn, .hamburger, [onclick*="openMenu"], [onclick*="openDrawer"], [data-action*="openMenu"]');
  if (menuBtn) { await menuBtn.click(); await page.waitForTimeout(600); }
  else { await page.evaluate(() => { const b = [...document.querySelectorAll('button,a')].find(x => x.getAttribute('onclick')?.includes('Menu') || x.getAttribute('data-action')?.includes('Menu')); b?.click(); }); await page.waitForTimeout(600); }
  await page.screenshot({ path: 'audit_drawer.png' });

  // 2. Drawer scrolled
  await page.evaluate(() => { const d = document.querySelector('.mob-drawer, #mobDrawer, .side-drawer, [class*="drawer"]'); if(d) d.scrollTop = 400; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit_drawer_scroll.png' });

  // 3. Full PDP page
  await page.evaluate(() => { const d = document.querySelector('.mob-drawer, #mobDrawer'); if(d) d.classList.remove('open'); document.body.style.overflow=''; });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);
  await page.click('#cpGrid .product-card');
  await page.waitForTimeout(1200);
  // Click "Всички детайли"
  await page.click('#ppDetailsBtn');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit_pdp_full.png' });
  await page.evaluate(() => { const el = document.querySelector('#pdpPage, #productPage, .pdp-page, .product-page'); if(el) el.scrollTop = 400; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit_pdp_full_mid.png' });

  await br.close();
})();
