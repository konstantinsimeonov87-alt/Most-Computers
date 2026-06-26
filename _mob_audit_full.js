const { chromium } = require('playwright');
const path = require('path');
const OUT = 'c:/Users/user/Desktop/New folder/';

(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();

  // Capture JS errors
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('[console.error] ' + m.text()); });

  // 1. Homepage top
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: OUT + 'mob_audit_home_top.png', fullPage: false });
  console.log('✓ home_top');

  // 2. Homepage mid (scroll 500px)
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: OUT + 'mob_audit_home_mid.png', fullPage: false });
  console.log('✓ home_mid');

  // 3. Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: OUT + 'mob_audit_home_footer.png', fullPage: false });
  console.log('✓ home_footer');

  // 4. Categories overlay
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.evaluate(() => window.openMobCatsPage && window.openMobCatsPage());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + 'mob_audit_cats_overlay.png', fullPage: false });
  console.log('✓ cats_overlay');

  // 5. Category page (laptops)
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: OUT + 'mob_audit_cat_page.png', fullPage: false });
  console.log('✓ cat_page');

  // 6. Product modal
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  try {
    await page.click('.product-card', { timeout: 5000 });
    await page.waitForTimeout(1500);
  } catch(e) {
    // try opening laptops first
    await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
    await page.waitForTimeout(2000);
    await page.click('.product-card', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: OUT + 'mob_audit_pdp.png', fullPage: false });
  console.log('✓ pdp');

  // 7. Cart
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  try {
    await page.click('#bn-cart', { timeout: 3000 });
  } catch(e) {
    await page.evaluate(() => {
      const el = document.getElementById('bn-cart') || document.querySelector('[data-action="cart"]');
      if (el) el.click();
    });
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + 'mob_audit_cart.png', fullPage: false });
  console.log('✓ cart');

  // 8. Search
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.focusSearch && window.focusSearch());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: OUT + 'mob_audit_search.png', fullPage: false });
  console.log('✓ search');

  // 9. Wishlist
  await page.evaluate(() => window.openWishlist && window.openWishlist());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + 'mob_audit_wishlist.png', fullPage: false });
  console.log('✓ wishlist');

  // 10. Auth modal
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.openAuth && window.openAuth());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + 'mob_audit_auth.png', fullPage: false });
  console.log('✓ auth');

  console.log('\nJS ERRORS:', JSON.stringify(errors, null, 2));
  await br.close();
})();
