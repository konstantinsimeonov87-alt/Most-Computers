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

  // Homepage top
  await page.screenshot({ path: 'sprint_home_top.png' });

  // Homepage mid
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'sprint_home_mid.png' });

  // Homepage bottom
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'sprint_home_bot.png' });

  // Categories overlay
  await page.evaluate(() => window.scrollTo(0,0));
  await page.evaluate(() => { if(window.openMobCatsPage) window.openMobCatsPage(); });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'sprint_cats.png' });

  // Category page - laptops
  await page.evaluate(() => { if(window.closeMobCatsPage) window.closeMobCatsPage(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => { if(window.openCatPage) window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'sprint_catpage.png' });

  // Category page scrolled
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'sprint_catpage_mid.png' });

  // PDP - click first card
  await page.evaluate(() => window.scrollTo(0,0));
  const card = await page.$('#cpGrid .product-card');
  if (!card) {
    const card2 = await page.$('#cpGrid .card');
    if (card2) { await card2.click(); await page.waitForTimeout(1200); }
  } else {
    await card.click();
    await page.waitForTimeout(1200);
  }
  await page.screenshot({ path: 'sprint_pdp.png' });

  // PDP scroll
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'sprint_pdp_mid.png' });

  // Close PDP/cat overlays and show cart
  await page.evaluate(() => {
    if(window.closeProductPage) window.closeProductPage();
    if(window.closeCatPage) window.closeCatPage();
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0,0));

  // Try clicking cart via JS
  await page.evaluate(() => { if(window.toggleCart) window.toggleCart(); });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'sprint_cart.png' });

  // Footer
  await page.evaluate(() => { if(window.toggleCart) window.toggleCart(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'sprint_footer.png' });

  console.log('JS Errors:', JSON.stringify(jsErrors));

  // Log bottom nav elements
  const bnIds = await page.evaluate(() => {
    const els = document.querySelectorAll('#bottom-nav [id], #bottom-nav [data-action]');
    return Array.from(els).map(el => el.id || el.getAttribute('data-action') || el.tagName);
  });
  console.log('Bottom nav elements:', JSON.stringify(bnIds));

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
