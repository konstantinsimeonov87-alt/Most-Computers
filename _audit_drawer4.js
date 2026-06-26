const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.click('.mob-menu-btn');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'drawer_open.png' });

  const info = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const visible = [];
    for (const el of all) {
      if (el.offsetWidth > 300 && el.offsetHeight > 400 && el.tagName !== 'HTML' && el.tagName !== 'BODY') {
        visible.push(el.tagName + '#' + (el.id||'') + '.' + (String(el.className).split(' ')[0]||''));
      }
    }
    return visible.slice(0,15);
  });
  console.log('Large visible elements:', info);
  await br.close();
})();
