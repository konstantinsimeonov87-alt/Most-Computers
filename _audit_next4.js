const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(800);

  // 1. Drawer - find how it opens
  const drawerInfo = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button,a,[onclick],[data-action]')].slice(0,200);
    const found = btns.filter(b => {
      const s = (b.getAttribute('onclick') || b.getAttribute('data-action') || b.className || '').toLowerCase();
      return s.includes('drawer') || s.includes('menu') || s.includes('nav');
    });
    return found.map(b => ({ tag: b.tagName, cls: b.className.substring(0,40), action: b.getAttribute('data-action') || b.getAttribute('onclick') || '' })).slice(0,10);
  });
  console.log('Drawer buttons:', JSON.stringify(drawerInfo));

  // 2. Open drawer via first match
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('[data-action*="Menu"],[data-action*="menu"],[data-action*="Drawer"],[data-action*="drawer"]')][0];
    if (b) b.click();
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'audit_drawer.png' });
  await page.evaluate(() => {
    const d = document.querySelector('.mob-drawer,.side-drawer,#mobDrawer,[class*="drawer"]');
    if (d) d.scrollTop = 300;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'audit_drawer_mid.png' });

  // 3. Full PDP - open product page directly
  await page.evaluate(() => {
    // Close any open overlays
    document.querySelectorAll('.open').forEach(el => {
      if (el.id && (el.id.includes('drawer') || el.id.includes('Drawer') || el.id.includes('mob'))) el.classList.remove('open');
    });
    document.body.style.overflow = '';
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.openCatPage('laptops'));
  await page.waitForTimeout(1800);

  // Get first product ID
  const firstId = await page.evaluate(() => {
    const card = document.querySelector('#cpGrid .product-card');
    const m = card?.getAttribute('onclick')?.match(/\d+/);
    return m ? parseInt(m[0]) : null;
  });
  console.log('First product ID:', firstId);

  if (firstId) {
    // Remove toast if blocking
    await page.evaluate(() => { const t = document.getElementById('toast'); if(t) t.style.display='none'; });
    await page.evaluate((id) => window.openProductPage && window.openProductPage(id), firstId);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'audit_pdp_full.png' });
    // Scroll inside PDP
    await page.evaluate(() => {
      const p = document.querySelector('#pdpPage,.pdp-page,#productPage,.product-page,[class*="pdp"]');
      if (p) p.scrollTop = 500;
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'audit_pdp_mid.png' });
  }

  console.log('JS errors:', errors);
  await br.close();
})();
