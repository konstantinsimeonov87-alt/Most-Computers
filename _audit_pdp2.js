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

  // Click first product card to open preview
  await page.click('#cpGrid .product-card:first-child, #cpGrid .card:first-child');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'pdp2_preview.png' });

  // Click "Всички детайли" inside the preview sheet via JS (avoids backdrop intercept)
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector('.pp-all-details, [data-action*="openProductPage"]:not(.product-card), .prod-preview button[data-action]');
    if (btn) { btn.click(); return btn.textContent.trim(); }
    // fallback: find any button with Всички
    const allBtns = document.querySelectorAll('button, a');
    for (const b of allBtns) {
      if (b.textContent.includes('Всички')) { b.click(); return b.textContent.trim(); }
    }
    return 'not found';
  });
  console.log('Clicked button:', clicked);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'pdp2_s0_top.png' });

  // Measure img wrap position at scroll 0
  const info0 = await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop') || document.querySelector('.pdp-backdrop');
    const wrap = document.querySelector('.pdp-main-img-wrap');
    if (!bd || !wrap) return { error: 'elements not found', bdId: bd ? 'found' : 'null', wrapId: wrap ? 'found' : 'null' };
    const r = wrap.getBoundingClientRect();
    return {
      scrollTop: bd.scrollTop,
      imgWrapLeft: Math.round(r.left * 10) / 10,
      imgWrapRight: Math.round(r.right * 10) / 10,
      imgWrapWidth: Math.round(r.width * 10) / 10,
      imgWrapHeight: Math.round(r.height * 10) / 10,
      viewport: window.innerWidth,
      bdScrollHeight: bd.scrollHeight,
      bdClientHeight: bd.clientHeight,
    };
  });
  console.log('Scroll 0:', JSON.stringify(info0));

  // Scroll pdp-backdrop down 400px
  await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop') || document.querySelector('.pdp-backdrop');
    if (bd) bd.scrollTop = 400;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'pdp2_s1_400.png' });
  const info400 = await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop') || document.querySelector('.pdp-backdrop');
    const wrap = document.querySelector('.pdp-main-img-wrap');
    const r = wrap ? wrap.getBoundingClientRect() : null;
    return { scrollTop: bd ? bd.scrollTop : null, imgWrapLeft: r ? Math.round(r.left*10)/10 : null, imgWrapWidth: r ? Math.round(r.width*10)/10 : null };
  });
  console.log('Scroll 400:', JSON.stringify(info400));

  // Scroll 900px
  await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop') || document.querySelector('.pdp-backdrop');
    if (bd) bd.scrollTop = 900;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'pdp2_s2_900.png' });
  const info900 = await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop') || document.querySelector('.pdp-backdrop');
    const wrap = document.querySelector('.pdp-main-img-wrap');
    const r = wrap ? wrap.getBoundingClientRect() : null;
    return { scrollTop: bd ? bd.scrollTop : null, imgWrapLeft: r ? Math.round(r.left*10)/10 : null, imgWrapWidth: r ? Math.round(r.width*10)/10 : null };
  });
  console.log('Scroll 900:', JSON.stringify(info900));

  // Scroll back to top
  await page.evaluate(() => {
    const bd = document.getElementById('pdpBackdrop') || document.querySelector('.pdp-backdrop');
    if (bd) bd.scrollTop = 0;
  });
  await page.waitForTimeout(300);

  // Test gallery nav — click > button
  const navInfo = await page.evaluate(() => {
    const nav = document.querySelector('.pdp-gallery-nav');
    if (!nav) return { error: 'nav not found' };
    const r = nav.getBoundingClientRect();
    const btns = nav.querySelectorAll('button, .pdp-nav-btn');
    return {
      navLeft: Math.round(r.left*10)/10,
      navWidth: Math.round(r.width*10)/10,
      btnCount: btns.length,
    };
  });
  console.log('Gallery nav:', JSON.stringify(navInfo));

  // Take a screenshot of just the gallery area
  await page.screenshot({ path: 'pdp2_gallery_area.png', clip: { x: 0, y: 0, width: 390, height: 300 } });

  if (jsErrors.length) console.log('JS ERRORS:', jsErrors.join('\n'));
  else console.log('No JS errors');
  console.log('PDP audit done');
  await br.close();
})();
