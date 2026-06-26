const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.addToCart(window.products[0].id));
  await page.waitForTimeout(200);

  // Use data-action dispatch
  await page.evaluate(() => {
    const btn = document.querySelector('[data-action="handleCheckout"]');
    if (btn) { btn.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });
  await page.waitForTimeout(2500);

  const ckInfo = await page.evaluate(() => {
    const ck = document.querySelector('.checkout-page');
    if (!ck) return null;
    const s = getComputedStyle(ck);
    return { class: ck.className, display: s.display, visibility: s.visibility, opacity: s.opacity, transform: s.transform };
  });
  console.log('checkout:', JSON.stringify(ckInfo));

  await page.evaluate(() => {
    const ck = document.querySelector('.checkout-page');
    if (ck) { ck.style.cssText = 'position:fixed!important;inset:0!important;z-index:99999!important;overflow:auto!important;background:#fff!important;opacity:1!important;transform:none!important;visibility:visible!important;display:block!important'; }
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '_vf_ck_top.png' });
  await page.evaluate(() => { const ck = document.querySelector('.checkout-page'); if(ck) ck.scrollTop = 380; });
  await page.waitForTimeout(300);
  await page.screenshot({ path: '_vf_ck_form.png' });
  await br.close();
})();
