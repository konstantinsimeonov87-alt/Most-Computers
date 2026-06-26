const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('ERR:', e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(1500);

  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1200);
  await page.click('#cpGrid .product-card:first-child, #cpGrid .card:first-child');
  await page.waitForTimeout(800);

  // open full PDP via JS
  const opened = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button,a')].find(b => b.textContent.includes('Всички детайли'));
    if (btn) { btn.click(); return 'ok'; }
    return 'not found';
  });
  await page.waitForTimeout(1200);

  // scroll backdrop to 0
  await page.evaluate(() => { const b = document.querySelector('.pdp-backdrop'); if(b) b.scrollTop=0; });
  await page.screenshot({ path:'pdp_now_top.png' });

  await page.evaluate(() => { const b = document.querySelector('.pdp-backdrop'); if(b) b.scrollTop=340; });
  await page.waitForTimeout(200);
  await page.screenshot({ path:'pdp_now_mid.png' });

  await page.evaluate(() => { const b = document.querySelector('.pdp-backdrop'); if(b) b.scrollTop=750; });
  await page.waitForTimeout(200);
  await page.screenshot({ path:'pdp_now_bot.png' });

  await page.evaluate(() => { const b = document.querySelector('.pdp-backdrop'); if(b) b.scrollTop=9999; });
  await page.waitForTimeout(200);
  await page.screenshot({ path:'pdp_now_end.png' });

  console.log('opened:', opened);
  console.log('done');
  await br.close();
})();
