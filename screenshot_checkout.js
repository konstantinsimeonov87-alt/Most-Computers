const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto('http://localhost:3333');
  await p.evaluate(() => {
    localStorage.setItem('mc_cart', JSON.stringify([{id:38, qty:1}]));
  });
  await p.reload();
  await p.waitForTimeout(2000);
  await p.evaluate(() => {
    const el = document.getElementById('checkoutPage');
    if (el) el.classList.add('open');
  });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: 'checkout_result.png', fullPage: true });
  await b.close();
  console.log('done');
})();
