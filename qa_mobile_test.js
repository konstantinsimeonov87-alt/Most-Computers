const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);

  // test1 - chips gradient
  await page.screenshot({ path: 'C:/Users/user/Desktop/New folder/test1_chips_gradient.png', clip: {x:0, y:260, width:390, height:80} });

  // test2 - card btn
  await page.evaluate(() => window.scrollBy(0,500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/Desktop/New folder/test2_card_btn.png', clip: {x:0, y:300, width:390, height:200} });

  // test3 - wishlist
  await page.evaluate(() => { window.scrollTo(0,0); window.openWishlist && window.openWishlist(); });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/user/Desktop/New folder/test3_wishlist.png' });

  // test4 - search with backdrop
  await page.evaluate(() => { if(document.getElementById('wishlistPage')) { const wp = document.getElementById('wishlistPage'); wp.style.display='none'; } window.focusSearch && window.focusSearch(); });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/user/Desktop/New folder/test4_search.png' });

  // test5 - categories overlay
  await page.evaluate(() => { window.openMobCatsPage && window.openMobCatsPage(); });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/user/Desktop/New folder/test5_cats.png' });

  // test6 - empty cart - force close cats page by directly removing class, bypass setBottomNavActive bug
  await page.evaluate(() => {
    const el = document.getElementById('mobCatsPage');
    if (el) el.classList.remove('open');
    document.body.style.overflow = '';
    // don't call setBottomNavActive to avoid the '#' selector bug
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => { try { window.toggleCart && window.toggleCart(); } catch(e){} });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/user/Desktop/New folder/test6_cart_empty.png' });

  // test7 - auth modal - close cart first then open auth
  await page.evaluate(() => { try { window.toggleCart && window.toggleCart(); } catch(e){} });
  await page.waitForTimeout(300);
  await page.evaluate(() => { try { window.openAuthModal && window.openAuthModal('login'); } catch(e){} });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/user/Desktop/New folder/test7_auth.png' });

  await br.close();
  console.log('Done!');
})();
