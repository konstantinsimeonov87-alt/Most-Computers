const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const mob = await browser.newPage();
  await mob.setViewportSize({ width: 375, height: 812 });
  await mob.goto('http://localhost:3333/', { waitUntil: 'networkidle' });

  // Test bottom nav - Categories
  await mob.click('#bn-cats');
  await mob.waitForTimeout(800);
  await mob.screenshot({ path: 'screenshot_mobile_categories.png' });
  console.log('Mobile categories OK');

  // Test bottom nav - Search
  await mob.click('#bn-search');
  await mob.waitForTimeout(600);
  const si = await mob.$('#searchInput');
  if (si) {
    await si.type('лаптоп');
    await mob.waitForTimeout(700);
  }
  await mob.screenshot({ path: 'screenshot_mobile_search.png' });
  console.log('Mobile search OK');

  // Test cart add on mobile
  await mob.goto('http://localhost:3333/', { waitUntil: 'networkidle' });
  await mob.waitForTimeout(500);
  const addBtn = await mob.$('[onclick*="addToCart"]');
  if (addBtn) {
    await addBtn.click();
    await mob.waitForTimeout(500);
    await mob.screenshot({ path: 'screenshot_mobile_cart_add.png' });
    console.log('Mobile cart add OK');
    await mob.click('#bn-cart');
    await mob.waitForTimeout(700);
    await mob.screenshot({ path: 'screenshot_mobile_cart_open.png' });
    console.log('Mobile cart open OK');
  } else {
    console.log('Add to cart button not found');
  }

  await mob.close();
  await browser.close();
  console.log('=== Done ===');
})().catch(e => { console.error(e.message); process.exit(1); });
