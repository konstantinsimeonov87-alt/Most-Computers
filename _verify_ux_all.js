const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });
  await page.click('body');
  await page.waitForTimeout(1200);

  // PDP
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.openProdPreview(2077));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.openProductPage(2077));
  await page.waitForTimeout(2000);

  // UX-A: PDP image
  await page.screenshot({ path: 'vux_pdp_top.png' });

  // UX-B/C: scroll to actions
  await page.evaluate(() => { const bd = document.getElementById('pdpBackdrop'); if(bd) bd.scrollTop = 450; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'vux_pdp_actions.png' });

  // UX-D: scroll to related products
  await page.evaluate(() => { const bd = document.getElementById('pdpBackdrop'); if(bd) bd.scrollTop = 950; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'vux_pdp_recs.png' });

  // Cart empty
  await page.evaluate(() => { window.closeProductPage && window.closeProductPage(); const bs = document.getElementById('pdpBottomSheet'); if(bs) bs.classList.remove('open'); window.closeCatPage && window.closeCatPage(); });
  await page.waitForTimeout(400);
  await page.click('#bn-cart');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'vux_cart_empty.png' });

  await br.close();
})();
