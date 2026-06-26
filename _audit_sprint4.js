const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });

  // 1. Homepage top
  await page.screenshot({ path: 's4_01_home_top.png' });

  // 2. Homepage scroll mid
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 's4_02_home_mid.png' });

  // 3. Mob cats overlay
  await page.evaluate(() => window.scrollTo(0,0));
  await page.evaluate(() => window.openMobCatsPage && window.openMobCatsPage());
  await page.waitForTimeout(600);
  await page.screenshot({ path: 's4_03_cats.png' });

  // 4. Drawer menu
  await page.evaluate(() => window.closeMobCatsPage && window.closeMobCatsPage());
  await page.waitForTimeout(300);
  await page.evaluate(() => window.toggleMobMenu());
  await page.waitForTimeout(500);
  await page.screenshot({ path: 's4_04_drawer_top.png' });
  // scroll drawer to bottom
  await page.evaluate(() => {
    const d = document.getElementById('mobDrawer');
    if (d) d.scrollTop = d.scrollHeight;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 's4_05_drawer_bot.png' });
  await page.evaluate(() => window.closeMobMenu());
  await page.waitForTimeout(300);

  // 5. Category page
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 's4_06_catpage_top.png' });
  // scroll catpage
  await page.evaluate(() => { const cp = document.getElementById('catPage'); if(cp) cp.scrollTop = 500; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 's4_07_catpage_scroll.png' });

  // 6. PDP preview (bottom sheet)
  await page.evaluate(() => { const cp = document.getElementById('catPage'); if(cp) cp.scrollTop = 0; });
  await page.evaluate(() => window.openProdPreview(2077));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 's4_08_pdp_preview.png' });

  // 7. Full PDP
  await page.evaluate(() => window.openProductPage(2077));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 's4_09_pdp_top.png' });
  await page.evaluate(() => { const bd = document.getElementById('pdpBackdrop'); if(bd) bd.scrollTop = 500; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 's4_10_pdp_mid.png' });
  await page.evaluate(() => { const bd = document.getElementById('pdpBackdrop'); if(bd) bd.scrollTop = 0; });

  // 8. Close all overlays, open cart
  await page.evaluate(() => {
    window.closeProductPage && window.closeProductPage();
    window.closeProdPreview && window.closeProdPreview();
    window.closeCatPage && window.closeCatPage();
  });
  await page.waitForTimeout(500);
  await page.click('#bn-cart');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 's4_11_cart.png' });
  await page.evaluate(() => window.toggleCart && window.toggleCart());
  await page.waitForTimeout(300);

  // 9. Search
  await page.click('#bn-search');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 's4_12_search.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 10. Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 's4_13_footer.png' });

  console.log('JS errors:', JSON.stringify(jsErrors));
  await br.close();
})();
