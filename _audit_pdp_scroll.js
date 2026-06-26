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
  await page.waitForTimeout(1500);

  // Open laptops category
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1200);

  // Click first product to open full PDP
  const cards = await page.$$('#cpGrid .product-card, #cpGrid .card');
  if (cards.length > 0) {
    // First click opens preview sheet
    await cards[0].click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'pdp_s0_preview.png' });

    // Click "Всички детайли" to open full PDP
    await page.click('text=Всички детайли, .pdp-all-btn, [data-action*="openProductPage"], .pp-all-details').catch(async () => {
      // Try by text
      const detailsBtn = await page.$('button:has-text("Всички детайли"), a:has-text("Всички детайли")');
      if (detailsBtn) await detailsBtn.click();
    });
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: 'pdp_s1_top.png' });

  // Scroll down gradually
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'pdp_s2_300.png' });

  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'pdp_s3_600.png' });

  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'pdp_s4_1000.png' });

  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'pdp_s5_1500.png' });

  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'pdp_s6_2100.png' });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'pdp_s7_bottom.png' });

  if (jsErrors.length) console.log('JS ERRORS:', jsErrors.join('\n'));
  else console.log('No JS errors');

  // Check layout width of product page container
  const widthInfo = await page.evaluate(() => {
    const pdp = document.querySelector('.product-page, .pdp-page, #productPage, .pp-page');
    const body = document.body;
    return {
      bodyWidth: body.scrollWidth,
      bodyClientWidth: body.clientWidth,
      viewportWidth: window.innerWidth,
      pdpEl: pdp ? pdp.className : 'not found',
      pdpScrollWidth: pdp ? pdp.scrollWidth : null,
      pdpClientWidth: pdp ? pdp.clientWidth : null,
      horizontalOverflow: body.scrollWidth > window.innerWidth
    };
  });
  console.log('Layout info:', JSON.stringify(widthInfo, null, 2));

  console.log('PDP scroll audit done');
  await br.close();
})();
