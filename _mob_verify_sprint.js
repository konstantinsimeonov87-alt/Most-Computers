const { chromium } = require('playwright');
const OUT = 'c:/Users/user/Desktop/New folder/';

(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // 1. Home tabs - verify "Топ продукти"
  await page.screenshot({ path: OUT + 'sprint_verify_home.png' });
  console.log('✓ home (check tab label)');

  // 2. Categories overlay - verify "% Намаления" without hardcoded %
  await page.evaluate(() => window.openMobCatsPage && window.openMobCatsPage());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: OUT + 'sprint_verify_cats.png' });
  console.log('✓ cats overlay (check % Намаления label)');

  // 3. Category page + subcat mask
  await page.evaluate(() => { window.closeMobCatsPage && window.closeMobCatsPage(); window.openCatPage && window.openCatPage('laptops'); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: OUT + 'sprint_verify_catpage.png' });
  console.log('✓ cat page (check subcat pills)');

  // 4. Wishlist empty state
  await page.evaluate(() => { window.closeCatPage && window.closeCatPage(); window.openWishlist && window.openWishlist(); });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: OUT + 'sprint_verify_wishlist.png' });
  console.log('✓ wishlist (check vertical centering)');

  // 5. Auth modal - verify openAuth works
  await page.evaluate(() => { window.closeWishlist && window.closeWishlist(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.openAuth && window.openAuth());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: OUT + 'sprint_verify_auth.png' });
  console.log('✓ auth modal (check openAuth works)');

  // 6. Cart - verify via data-action button
  await page.evaluate(() => { window.closeAuthModal && window.closeAuthModal(); });
  await page.waitForTimeout(500);
  const cartBtn = await page.$('[data-action="toggleCart"]');
  if (cartBtn) { await cartBtn.click(); await page.waitForTimeout(1000); }
  await page.screenshot({ path: OUT + 'sprint_verify_cart.png' });
  console.log('✓ cart overlay');

  console.log('\nJS ERRORS:', errors.length ? errors : 'none');
  await br.close();
})();
