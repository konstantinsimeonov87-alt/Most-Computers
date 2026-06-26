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
  await page.waitForTimeout(1500);

  await page.evaluate(() => { if(window.openCatPage) window.openCatPage('laptops'); });
  await page.waitForTimeout(1500);

  // Scroll the subcat bar to the right to see all pills
  await page.evaluate(() => {
    const bar = document.querySelector('.subcat-bar, .cat-chips, .filter-chips, [class*="subcat"]');
    if (bar) bar.scrollLeft = 500;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'sale_btn2_scrolled.png' });

  // Get all chip/pill info
  const chips = await page.evaluate(() => {
    const pills = document.querySelectorAll('.subcat-bar button, .subcat-bar a, .cat-chip, .filter-chip, [class*="subcat"] button');
    return Array.from(pills).map(el => ({
      text: el.textContent.trim(),
      className: el.className,
      tagName: el.tagName
    }));
  });
  console.log('Chips:', JSON.stringify(chips, null, 2));

  // Also check for sale-specific buttons
  const saleEls = await page.evaluate(() => {
    const all = document.querySelectorAll('button, a');
    return Array.from(all)
      .filter(el => el.textContent.includes('намаление') || el.textContent.includes('намал') || el.textContent.includes('Sale') || el.textContent.includes('оферт'))
      .map(el => ({ text: el.textContent.trim(), className: el.className }));
  });
  console.log('Sale elements:', JSON.stringify(saleEls, null, 2));

  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
