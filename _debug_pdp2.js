const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);

  const info = await page.evaluate(() => {
    const card = document.querySelector('#cpGrid .product-card');
    return {
      cardExists: !!card,
      cardOnclick: card?.getAttribute('onclick'),
      cardStyle: card?.getAttribute('style'),
      openProdPreviewType: typeof window.openProdPreview,
      prodPreviewSheetExists: !!document.getElementById('prodPreviewSheet'),
      prodPreviewSheetClass: document.getElementById('prodPreviewSheet')?.className,
    };
  });
  console.log(JSON.stringify(info, null, 2));

  // Try calling directly
  await page.evaluate(() => {
    const card = document.querySelector('#cpGrid .product-card');
    const id = parseInt(card?.getAttribute('onclick')?.match(/\d+/)?.[0]);
    console.log('Calling openProdPreview with id:', id);
    if (id) window.openProdPreview(id);
  });
  await page.waitForTimeout(1000);
  const afterDirect = await page.evaluate(() => ({
    pdpOpen: document.getElementById('prodPreviewSheet')?.classList.contains('open'),
    pdpClass: document.getElementById('prodPreviewSheet')?.className
  }));
  console.log('After direct call:', JSON.stringify(afterDirect));

  console.log('JS errors:', errors);
  await br.close();
})();
