const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Open cat page
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1500);

  // Click first product card
  await page.click('#cpGrid .product-card');
  await page.waitForTimeout(1000);

  // Click 'Всички детайли' button
  await page.click('.pp-details-btn');
  await page.waitForTimeout(2000);

  const pdpOpen = await page.evaluate(() => !!document.querySelector('.pdp-backdrop.open'));
  console.log('PDP open:', pdpOpen);

  // Top of PDP - header + gallery area
  await page.screenshot({ path: '_pdp_full_top.png', fullPage: false });

  // Scroll to action buttons area
  await page.evaluate(() => {
    const pdp = document.querySelector('.pdp-backdrop');
    if (pdp) pdp.scrollTop = 500;
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '_pdp_full_mid.png', fullPage: false });

  // Scroll more - specs area
  await page.evaluate(() => {
    const pdp = document.querySelector('.pdp-backdrop');
    if (pdp) pdp.scrollTop = 1000;
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '_pdp_full_spec.png', fullPage: false });

  // Scroll to bottom
  await page.evaluate(() => {
    const pdp = document.querySelector('.pdp-backdrop');
    if (pdp) pdp.scrollTop = pdp.scrollHeight;
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '_pdp_full_bot.png', fullPage: false });

  console.log('JS errors:', JSON.stringify(jsErrors));
  await br.close();
})();
