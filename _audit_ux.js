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

  // 1. Homepage — top
  await page.screenshot({ path: 'ux_01_home_top.png' });

  // 2. Homepage — scroll to hero CTA
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'ux_02_home_hero.png' });

  // 3. Homepage — flash deals + cards
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'ux_03_home_cards.png' });

  // 4. Homepage — bottom / footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'ux_04_home_footer.png' });

  // 5. Cats overlay
  await page.evaluate(() => window.scrollTo(0,0));
  await page.evaluate(() => window.openMobCatsPage && window.openMobCatsPage());
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'ux_05_cats.png' });
  await page.evaluate(() => window.closeMobCatsPage && window.closeMobCatsPage());
  await page.waitForTimeout(300);

  // 6. Drawer — scroll to show auth
  await page.evaluate(() => window.toggleMobMenu());
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ux_06_drawer_top.png' });
  await page.evaluate(() => {
    const body = document.querySelector('.mob-drawer-body');
    if (body) body.scrollTop = body.scrollHeight;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'ux_07_drawer_bot.png' });
  await page.evaluate(() => window.closeMobMenu());
  await page.waitForTimeout(300);

  // 7. Catpage
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'ux_08_catpage.png' });

  // 8. PDP preview
  await page.evaluate(() => window.openProdPreview(2077));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'ux_09_preview.png' });

  // 9. Full PDP — top
  await page.evaluate(() => window.openProductPage(2077));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'ux_10_pdp_top.png' });

  // 10. Full PDP — mid (price, ATC)
  await page.evaluate(() => { const bd = document.getElementById('pdpBackdrop'); if(bd) bd.scrollTop = 400; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'ux_11_pdp_atc.png' });

  // 11. Full PDP — specs/reviews
  await page.evaluate(() => { const bd = document.getElementById('pdpBackdrop'); if(bd) bd.scrollTop = 900; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'ux_12_pdp_specs.png' });

  // 12. Cart
  await page.evaluate(() => {
    window.closeProductPage && window.closeProductPage();
    window.closeProdPreview && window.closeProdPreview();
    window.closeCatPage && window.closeCatPage();
    const bs = document.getElementById('pdpBottomSheet');
    if (bs) bs.classList.remove('open');
  });
  await page.waitForTimeout(400);
  await page.click('#bn-cart');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'ux_13_cart.png' });

  console.log('JS errors:', jsErrors.length ? jsErrors : 'none');
  await br.close();
})();
