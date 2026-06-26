const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);

  // Direct click on hamburger
  await page.click('.mob-menu-btn');
  await page.waitForTimeout(800);

  // Check what opened
  const drawerState = await page.evaluate(() => {
    const candidates = document.querySelectorAll('[class*="drawer"],[class*="mob-nav"],[id*="drawer"],[id*="menu"],[id*="nav"]');
    return [...candidates].map(el => ({ id: el.id, cls: el.className.substring(0,60), visible: el.offsetParent !== null, scroll: el.scrollHeight }));
  });
  console.log('Drawer candidates:', JSON.stringify(drawerState));

  await page.screenshot({ path: 'drawer2_top.png' });

  // Try scrolling all candidates
  await page.evaluate(() => {
    const c = [...document.querySelectorAll('[class*="drawer"],[id*="drawer"],[id*="mob-nav"],[class*="mob-nav"]')];
    c.forEach(el => { if (el.offsetParent) el.scrollTop = 400; });
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'drawer2_mid.png' });

  await br.close();
})();
