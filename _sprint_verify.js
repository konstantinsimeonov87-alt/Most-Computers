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

  // V1: Category page - verify subcat pills (no label) + card sec buttons touch target
  await page.evaluate(() => { if(window.openCatPage) window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'verify_catpage.png' });

  // V2: PDP quick-view - verify larger thumbnail
  const card = await page.$('#cpGrid .product-card');
  if (card) { await card.click(); await page.waitForTimeout(1000); }
  await page.screenshot({ path: 'verify_pdp.png' });

  // V3: Cart empty state - verify flex centering
  await page.evaluate(() => {
    if(window.closeProductPage) window.closeProductPage();
    if(window.closeCatPage) window.closeCatPage();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => { if(window.toggleCart) window.toggleCart(); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'verify_cart.png' });

  // V4: Measure touch targets for card-sec-btn
  await page.evaluate(() => { if(window.toggleCart) window.toggleCart(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => { if(window.openCatPage) window.openCatPage('laptops'); });
  await page.waitForTimeout(1200);
  const cardSecBtnHeight = await page.evaluate(() => {
    const btn = document.querySelector('.card-sec-btn');
    return btn ? btn.getBoundingClientRect().height : null;
  });
  const wishlistHeight = await page.evaluate(() => {
    const btn = document.querySelector('.product-wishlist');
    return btn ? btn.getBoundingClientRect().height : null;
  });
  const ppImgWidth = await page.evaluate(() => {
    const img = document.querySelector('.pp-img');
    return img ? img.getBoundingClientRect().width : null;
  });
  const subcatLabel = await page.evaluate(() => {
    const bar = document.querySelector('.subcat-bar');
    if (!bar) return null;
    const before = window.getComputedStyle(bar, '::before');
    return before.getPropertyValue('display');
  });

  console.log('card-sec-btn height:', cardSecBtnHeight);
  console.log('product-wishlist height:', wishlistHeight);
  console.log('pp-img width (when open):', ppImgWidth);
  console.log('subcat-bar::before display:', subcatLabel);

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
