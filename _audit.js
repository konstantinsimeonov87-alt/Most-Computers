const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();

  // --- DESKTOP 1280px ---
  const desk = await browser.newPage();
  await desk.setViewportSize({ width: 1280, height: 800 });
  await desk.goto('http://localhost:3333/', { waitUntil: 'networkidle' });

  // Home
  await desk.screenshot({ path: 'screenshot_desktop_home.png' });
  console.log('Desktop home OK');

  // Footer — scroll all the way
  await desk.evaluate(() => window.scrollTo(0, 99999));
  await desk.waitForTimeout(800);
  await desk.screenshot({ path: 'screenshot_desktop_footer.png' });
  console.log('Desktop footer OK');

  // Contacts — click via JS
  await desk.evaluate(() => window.scrollTo(0, 0));
  await desk.waitForTimeout(300);
  await desk.evaluate(() => {
    if (typeof openContactsPage === 'function') openContactsPage();
  });
  await desk.waitForTimeout(1200);
  await desk.screenshot({ path: 'screenshot_desktop_contacts.png' });
  console.log('Desktop contacts OK');

  // Search
  await desk.goto('http://localhost:3333/', { waitUntil: 'networkidle' });
  const si = await desk.$('#searchInput');
  if (si) {
    await si.click();
    await si.type('лаптоп');
    await desk.waitForTimeout(900);
    await desk.screenshot({ path: 'screenshot_desktop_search.png' });
    console.log('Desktop search dropdown OK');

    // Clear and search XSS test
    await si.fill('<script>alert(1)</script>');
    await desk.waitForTimeout(600);
    await desk.screenshot({ path: 'screenshot_desktop_search_xss.png' });
    console.log('Desktop search XSS test OK');
  }
  await desk.close();

  // --- MOBILE 375px ---
  const mob = await browser.newPage();
  await mob.setViewportSize({ width: 375, height: 812 });
  await mob.goto('http://localhost:3333/', { waitUntil: 'networkidle' });
  await mob.screenshot({ path: 'screenshot_mobile_home.png' });
  console.log('Mobile home OK');

  // Mobile footer — full page scroll
  await mob.evaluate(() => window.scrollTo(0, 99999));
  await mob.waitForTimeout(1000);
  await mob.screenshot({ path: 'screenshot_mobile_footer.png' });
  console.log('Mobile footer OK');

  // Hamburger
  await mob.evaluate(() => window.scrollTo(0, 0));
  await mob.waitForTimeout(400);
  // Try all possible selectors
  for (const sel of ['.hdr-menu-btn', '.hamburger', 'button.nav-open', '[data-action="menu"]', '.mobile-menu-btn']) {
    const el = await mob.$(sel);
    if (el) {
      await el.click();
      await mob.waitForTimeout(700);
      await mob.screenshot({ path: 'screenshot_mobile_menu.png' });
      console.log('Mobile menu opened with:', sel);
      // Close
      await mob.keyboard.press('Escape');
      await mob.waitForTimeout(400);
      break;
    }
  }
  // If no burger found, take screenshot of header area
  const menuShot = await mob.$('screenshot_mobile_menu.png');
  if (!menuShot) {
    await mob.screenshot({ path: 'screenshot_mobile_header.png', clip: { x: 0, y: 0, width: 375, height: 80 } });
    console.log('Mobile header screenshot (no burger found)');
  }

  // Mobile contacts
  await mob.evaluate(() => {
    if (typeof openContactsPage === 'function') openContactsPage();
  });
  await mob.waitForTimeout(1200);
  await mob.screenshot({ path: 'screenshot_mobile_contacts.png' });
  console.log('Mobile contacts OK');

  await mob.close();
  await browser.close();
  console.log('=== All done ===');
})().catch(e => { console.error(e.message); process.exit(1); });
