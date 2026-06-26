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

  // Open a category page first
  await page.evaluate(() => window.openCatPage && window.openCatPage('laptops'));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '_sprint_catpage.png' });

  // Click on a product card
  const card = await page.$('#cpGrid .product-card');
  if (card) {
    await card.click();
    await page.waitForTimeout(1200);
  } else {
    const card2 = await page.$('.product-card');
    if (card2) {
      await card2.click();
      await page.waitForTimeout(1200);
    }
  }
  await page.screenshot({ path: '_sprint_pdp.png' });

  // Check PDP structure
  const pdpInfo = await page.evaluate(() => {
    const pdp = document.querySelector('#product-page, .product-page, #pdp');
    if (!pdp) return { found: false };

    const backBtns = pdp.querySelectorAll('[data-action], .back-btn, .pdp-back, button');
    const backInfo = Array.from(backBtns).map(el => ({
      tag: el.tagName,
      classes: el.className,
      action: el.dataset.action,
      text: el.textContent.trim().substring(0, 50)
    }));

    const breadcrumb = pdp.querySelector('.breadcrumb, .breadcrumbs, nav[aria-label]');

    return {
      found: true,
      pdpId: pdp.id,
      pdpClasses: pdp.className,
      backButtons: backInfo,
      hasBreadcrumb: !!breadcrumb,
      breadcrumbHTML: breadcrumb ? breadcrumb.outerHTML.substring(0, 300) : null,
      firstChildHTML: pdp.innerHTML.substring(0, 500)
    };
  });

  console.log('PDP Info:', JSON.stringify(pdpInfo, null, 2));
  console.log('JS errors:', jsErrors);
  await br.close();
})();
