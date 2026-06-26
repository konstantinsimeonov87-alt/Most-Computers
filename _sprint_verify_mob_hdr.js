const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('JS ERROR:', e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const p = window.products && window.products.find(x => x.cat === 'laptops');
    if (p) window.openProductPage(p.id);
  });
  await page.waitForTimeout(3000);

  const pdpOpen = await page.evaluate(() => document.getElementById('pdpBackdrop')?.classList.contains('open'));
  console.log('PDP open:', pdpOpen);

  // Screenshot header area
  await page.screenshot({ path: '_verify_mob_hdr_top.png', clip: { x: 0, y: 0, width: 390, height: 60 } });
  await page.screenshot({ path: '_verify_mob_hdr_full.png' });

  // Check header elements
  const hdrInfo = await page.evaluate(() => {
    const hdr = document.querySelector('.pdp-mob-hdr');
    if (!hdr) return { found: false };
    const s = getComputedStyle(hdr);
    const brand = document.getElementById('pdpMobBrand');
    const name  = document.getElementById('pdpMobName');
    const wish  = document.getElementById('pdpMobWishBtn');
    const cart  = document.querySelector('.pdp-mob-cart');
    const badge = document.getElementById('pdpMobCartBadge');
    const back  = document.querySelector('.pdp-mob-back');
    const oldBtn = document.querySelector('.pdp-back-btn');
    return {
      found: true,
      display: s.display,
      height: hdr.getBoundingClientRect().height,
      brand: brand?.textContent,
      name: name?.textContent?.substring(0, 40),
      wishDisplay: wish ? getComputedStyle(wish).display : 'not found',
      cartDisplay: cart ? getComputedStyle(cart).display : 'not found',
      badgeText: badge?.textContent,
      backDisplay: back ? getComputedStyle(back).display : 'not found',
      oldBtnDisplay: oldBtn ? getComputedStyle(oldBtn).display : 'not found'
    };
  });
  console.log('Header info:', JSON.stringify(hdrInfo, null, 2));

  await br.close();
})();
