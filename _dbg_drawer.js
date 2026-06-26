const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });

  const before = await page.evaluate(() => ({
    drawerExists: !!document.getElementById('mobDrawer'),
    overlayExists: !!document.getElementById('mobOverlay'),
    drawerClass: document.getElementById('mobDrawer')?.className,
    toggleType: typeof window.toggleMobMenu,
    btnExists: !!document.querySelector('.mob-menu-btn')
  }));
  console.log('Before click:', JSON.stringify(before));

  await page.click('.mob-menu-btn');
  await page.waitForTimeout(800);

  const after = await page.evaluate(() => ({
    drawerClass: document.getElementById('mobDrawer')?.className,
    overlayClass: document.getElementById('mobOverlay')?.className,
    bodyOverflow: document.body.style.overflow,
    bodyPosition: document.body.style.position
  }));
  console.log('After click:', JSON.stringify(after));
  console.log('JS errors:', errors);
  await page.screenshot({ path: 'dbg_drawer.png' });
  await br.close();
})();
