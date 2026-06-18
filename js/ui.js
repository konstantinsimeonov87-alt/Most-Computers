// ===== SKELETON LOADING =====
function showSkeletons(containerId, count=8) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const sk = () => `<div class="skeleton-card">
    <div class="skeleton sk-img"></div>
    <div class="sk-body">
      <div class="skeleton sk-brand"></div>
      <div class="skeleton sk-title"></div>
      <div class="skeleton sk-title2"></div>
      <div class="skeleton sk-stars"></div>
      <div class="skeleton sk-price"></div>
      <div class="skeleton sk-btn"></div>
    </div>
  </div>`;
  el.innerHTML = `<div class="products-row">${Array(count).fill(0).map(sk).join('')}</div>`;
}

// ===== COOKIE BANNER =====
function initCookies() {
  try { if (!localStorage.getItem('mc_cookies_set')) {
    setTimeout(() => document.getElementById('cookieBanner').classList.add('show'), 1200);
  } } catch(e) {}
}
function acceptCookies() {
  try { localStorage.setItem('mc_cookies_set', 'all'); } catch(e) {}
  hideCookieBanner();
  showToast('🍪 Бисквитките са приети');
}
function declineCookies() {
  try { localStorage.setItem('mc_cookies_set', 'essential'); } catch(e) {}
  hideCookieBanner();
}
function hideCookieBanner() {
  document.getElementById('cookieBanner').classList.remove('show');
}
function openCookieSettings() {
  document.getElementById('cookieModalBackdrop').classList.add('open');
}
function closeCookieSettings(e) {
  if (e.target === e.currentTarget) closeCookieSettingsDirect();
}
function closeCookieSettingsDirect() {
  document.getElementById('cookieModalBackdrop').classList.remove('open');
}
function saveCookieSettings() {
  const prefs = {
    analytics: document.getElementById('ck-analytics')?.checked || false,
    marketing: document.getElementById('ck-marketing')?.checked || false,
    functional: document.getElementById('ck-functional')?.checked || false,
  };
  try { localStorage.setItem('mc_cookies_set', JSON.stringify(prefs)); } catch(e) {}
  closeCookieSettingsDirect();
  hideCookieBanner();
  showToast('⚙ Настройките са запазени');
}

// ===== SCROLL ANIMATIONS =====
function initSectionAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('sa-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.section-wrap:not(#featured):not(#sale), .banner-row, .promo-strip, .hp-cats-grid, .sfb-block').forEach(el => {
    el.classList.add('sa-el');
    obs.observe(el);
  });
}

// ===== BACK TO TOP =====
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToFeatured() { document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }); }
function scrollToSale()     { document.getElementById('sale')?.scrollIntoView({ behavior: 'smooth' }); }

function switchMobTab(tab) {
  if (window.innerWidth > 768) return;
  document.querySelectorAll('.mob-hp-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
    t.setAttribute('aria-selected', t.dataset.tab === tab ? 'true' : 'false');
  });
  const map = { sale: 'sale', new: 'newSection', bestsellers: 'bestsellersSection' };
  const banners = [document.getElementById('promoSplitBanner'), document.getElementById('promoBanner')];
  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('mob-tab-hidden', key !== tab);
  });
  banners.forEach(el => { if (el) el.classList.toggle('mob-tab-hidden', tab !== 'sale'); });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
}

// ===== FOOTER ACCORDION (MOBILE) =====
function initFooterAccordion() {
  if (window.innerWidth > 768) return;
  document.querySelectorAll('.footer-col-title').forEach(title => {
    title.addEventListener('click', () => {
      title.closest('.footer-col').classList.toggle('expanded');
    });
  });
}
initFooterAccordion();
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.querySelectorAll('.footer-col').forEach(c => c.classList.add('expanded'));
  }
});

// ===== BOTTOM NAV =====
function setBottomNavActive(id) {
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  if (id) document.getElementById(id)?.classList.add('active');
}
window.addEventListener('popstate', () => setBottomNavActive(''));

function openMobCatsPage() {
  const el = document.getElementById('mobCatsPage');
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  setBottomNavActive('bn-cats');
}
function closeMobCatsPage() {
  const el = document.getElementById('mobCatsPage');
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
  setBottomNavActive('');
}

function closePagesGoHome() {
  ['wishlistPage','contactPage','searchResultsPage','checkoutPage','thankyouPage','myOrdersPage'].forEach(id => {
    document.getElementById(id)?.classList.remove('open');
  });
  document.body.style.overflow = '';
  setBottomNavActive('');
  window.scrollTo({top:0,behavior:'smooth'});
}
function focusSearch() {
  const inp = document.getElementById('searchInput');
  if (inp) {
    inp.scrollIntoView({behavior:'smooth',block:'center'});
    inp.focus({ preventScroll: true });
  }
  document.body.classList.add('search-open');
  let bd = document.getElementById('searchBackdrop');
  if (!bd && window.innerWidth <= 768) {
    bd = document.createElement('div');
    bd.id = 'searchBackdrop';
    document.body.appendChild(bd);
    bd.addEventListener('click', () => { if (typeof closeSearchDropdown === 'function') closeSearchDropdown(); });
  }
  if (bd) bd.style.display = 'block';
  setBottomNavActive('bn-search');
}
// Sync bottom nav cart badge with main cart
const _origUpdateCart = typeof updateCart !== 'undefined' ? updateCart : null;
function syncBnCartBadge() {
  const count = cart.reduce((s,x)=>s+x.qty,0);
  document.querySelectorAll('#bnCartBadge').forEach(badge => {
    badge.textContent = count; badge.classList.toggle('show', count>0);
  });
}


// ===== DARK MODE =====
(function(){
  try {
    const saved = localStorage.getItem('mc_dark');
    if(saved === '1') document.body.classList.add('dark');
  } catch(e) {}
})();
function _applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  // Also keep body.dark for backward-compat with existing CSS rules
  document.body ? document.body.classList.toggle('dark', dark) : null;
  const dmIcon = document.getElementById('dmIcon');
  if (dmIcon) dmIcon.innerHTML = dark
    ? '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-sun"/></svg>'
    : '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-moon"/></svg>';
}
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = !isDark;
  _applyTheme(next);
  try { localStorage.setItem('mc_dark', next ? '1' : '0'); } catch(e) {}
  showToast(next ? '🌙 Тъмен режим включен' : '☀️ Светъл режим');
}
// Restore saved theme on load (before first paint flicker)
(function () {
  let saved = '0';
  try { saved = localStorage.getItem('mc_dark') || '0'; } catch(e) {}
  if (saved === '1') _applyTheme(true);
})();

try { localStorage.removeItem('mc_lang'); } catch(e){}



// ===== LAZY IMAGE LOADING =====
function initLazyImages(){
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          const img = e.target;
          if(img.dataset.src){ img.src=img.dataset.src; img.removeAttribute('data-src'); }
          img.addEventListener('load', () => img.classList.add('img-loaded'), {once:true});
          img.addEventListener('error', () => { img.style.display='none'; const em=img.nextElementSibling; if(em) em.style.display='block'; }, {once:true});
          obs.unobserve(img);
        }
      });
    }, {rootMargin:'200px 0px'});
    document.querySelectorAll('.product-img-real').forEach(img => {
      img.addEventListener('load', () => img.classList.add('img-loaded'), {once:true});
      if(img.complete && img.naturalWidth>0) img.classList.add('img-loaded');
      obs.observe(img);
    });
  } else {
    document.querySelectorAll('.product-img-real').forEach(img => img.classList.add('img-loaded'));
  }
}
setTimeout(initLazyImages, 900);

// ===== TOUCH SWIPE FOR HERO =====
(function(){
  let sx=0;
  const slider = document.querySelector('.hero-slider');
  if(!slider) return;
  slider.addEventListener('touchstart', e => { sx=e.touches[0].clientX; }, {passive:true});
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const total = document.querySelectorAll('.slide').length;
    if(Math.abs(dx) > 50) goSlide(dx<0 ? (currentSlide+1)%total : (currentSlide-1+total)%total);
  }, {passive:true});
})();



// ===== SCROLL PROGRESS BAR =====
// CSS scroll-driven animation handles modern browsers (Chrome 115+, FF 127+, Safari 17.2+).
// JS fallback for older browsers caches docH to avoid scrollHeight reads every scroll event.
(function() {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  if (CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;
  var docH = 0;
  function cacheDocH() {
    docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  }
  requestAnimationFrame(cacheDocH);
  window.addEventListener('resize', cacheDocH, { passive: true });
  window.addEventListener('scroll', function() {
    if (!docH) return;
    var pct = Math.min(100, ((window.scrollY || document.documentElement.scrollTop) / docH) * 100);
    bar.style.width = pct.toFixed(1) + '%';
  }, { passive: true });
})();

// ===== MEGAMENU =====
const megaCategories = [
  { cat:'laptops',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-laptop"/></svg>', name:'Лаптопи' },
  { cat:'desktops',    icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-desktop"/></svg>', name:'Настолни компютри' },
  { cat:'components',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-cpu"/></svg>', name:'Компоненти' },
  { cat:'peripherals', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-mouse"/></svg>', name:'Периферия' },
  { cat:'network',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-wifi"/></svg>', name:'Мрежово оборудване' },
  { cat:'storage',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-storage"/></svg>', name:'Сървъри и сторидж' },
  { cat:'software',    icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-tag"/></svg>', name:'Софтуер' },
  { cat:'accessories', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-truck"/></svg>', name:'Аксесоари' },
];
const megaBrands = ['Intel', 'ASUS', 'Acer', 'Microsoft', 'Lenovo', 'Gigabyte', 'LG', 'ADATA', 'Sapphire', 'Tenda', 'Kingston', 'Seagate', 'AMD', 'Seasonic', 'ASRock', 'Repotec', 'Realme', 'MSI', 'Tuncmatik', 'Palit', 'Nokia', 'Cooler Master', 'Fractal', 'NZXT', 'Canon', 'Fnatic', 'FSP Group', 'Omega', 'Inform UPS', 'QNAP', 'D-Link', 'A4Tech', 'Logitech', 'TeamGroup', 'KingSpec', 'Kingston'];

const _compSubcats = [
  { id:'cpu',         label:'💻 Процесори' },
  { id:'gpu',         label:'🎮 Видео карти' },
  { id:'ram',         label:'🧠 RAM памет' },
  { id:'motherboard', label:'🔌 Дънни платки' },
  { id:'ssd',         label:'💾 SSD дискове' },
  { id:'hdd',         label:'🖴 HDD дискове' },
  { id:'case',        label:'🖥 Кутии' },
  { id:'psu',         label:'⚡ Захранвания' },
  { id:'cooling',     label:'❄ Охлаждане' },
];

function openMegamenu() {
  // Render cats
  const catsEl = document.getElementById('megamenuCats');
  if (!catsEl) return;
  catsEl.innerHTML = megaCategories.map(c => {
    const count = products.filter(p=>p.cat===c.cat||normalizeCat(p.cat)===c.cat).length;
    const isComp = c.cat === 'components';
    const subcatHtml = isComp ? `<div class="mega-comp-subcats" id="megaCompSubcats">${
      _compSubcats.map(s => {
        const sc = products.filter(p => (p.cat==='components'||normalizeCat(p.cat)==='components') && p.subcat===s.id).length;
        return sc > 0 ? `<span class="mega-comp-sub" onclick="event.stopPropagation();megaFilterCompSubcat('${s.id}')">${s.label} <em>${sc}</em></span>` : '';
      }).join('')
    }</div>` : '';
    return `<div class="megamenu-cat-card${isComp?' has-subcats':''}" onclick="megaFilterCat('${c.cat}')">
      <div class="megamenu-cat-icon">${c.icon}</div>
      <div class="megamenu-cat-name">${c.name}</div>
      <div class="megamenu-cat-count">${count} продукта</div>
      ${subcatHtml}
    </div>`;
  }).join('');

  // Render brands
  var _el_megamenuBrands=document.getElementById('megamenuBrands'); if(_el_megamenuBrands) _el_megamenuBrands.innerHTML = megaBrands.map(b => {
    const count = products.filter(p=>p.brand===b).length;
    return `<div class="megamenu-brand-card" onclick="megaFilterBrand('${b}')">
      <div>${b}</div>
      <div style="font-size:10px;color:var(--muted);margin-top:2px;">${count} продукта</div>
    </div>`;
  }).join('');

  // Render top featured
  const featured = [...products].sort((a,b)=>b.rating-a.rating).slice(0,4);
  var _el_megamenuFeatured=document.getElementById('megamenuFeatured'); if(_el_megamenuFeatured) _el_megamenuFeatured.innerHTML = featured.map(p => makeCard(p)).join('');

  document.getElementById('megamenuPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(initLazyImages, 200);
}

function closeMegamenu() {
  document.getElementById('megamenuPage').classList.remove('open');
  document.body.style.overflow = '';
}

function megaFilterCat(cat) {
  closeMegamenu();
  if (typeof openCatPage === 'function') openCatPage(cat);
  else filterCat(cat);
}

function megaFilterCompSubcat(subcat) {
  closeMegamenu();
  if (typeof openCatPage === 'function') openCatPage('components', subcat);
  else filterCat('components');
}

function megaFilterBrand(brand) {
  closeMegamenu();
  const si = document.getElementById('searchInput'); if(si) si.value = brand;
  showSearchResultsPage(brand);
}


// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement.isContentEditable) return;
  if (e.code === 'KeyS') {
    e.preventDefault();
    focusSearch();
  } else if (e.code === 'KeyC') {
    e.preventDefault();
    toggleCart();
  } else if (e.key === 'Escape') {
    const panels = [
      { id: 'cartPanel',            close: toggleCart },
      { id: 'pdpBackdrop',          close: closeProductPage },
      { id: 'productModalBackdrop', close: closeProductModalDirect },
      { id: 'searchResultsPage',    close: closeSearchPage },
      { id: 'wishlistPage',         close: () => { document.getElementById('wishlistPage').classList.remove('open'); document.body.style.overflow = ''; } },
      { id: 'megamenuPage',         close: closeMegamenu },
      { id: 'adminPage',            close: closeAdminPage },
      { id: 'comparePage',          close: closeComparePage, checkFn: el => el.style.display === 'block' },
      { id: 'catPage',              close: () => typeof closeCatPage === 'function' && closeCatPage() },
      { id: 'mobDrawer',            close: () => typeof closeMobMenu === 'function' && closeMobMenu(), checkFn: el => el.classList.contains('open') },
      { id: 'authBackdrop',         close: () => { document.getElementById('authBackdrop').classList.remove('open'); document.body.style.overflow = ''; } },
      { id: 'checkoutPage',         close: () => { if (typeof closeCheckoutPage === 'function') closeCheckoutPage(); else { document.getElementById('checkoutPage').classList.remove('open'); document.body.style.overflow = ''; } } },
      { id: 'blogPage',             close: () => typeof closeBlogPage === 'function' && closeBlogPage() },
      { id: 'servicePage',          close: () => typeof closeServicePage === 'function' && closeServicePage() },
      { id: 'deliveryPage',         close: () => typeof closeDeliveryPage === 'function' && closeDeliveryPage() },
      { id: 'contactsPage',         close: () => typeof closeContactsPage === 'function' && closeContactsPage() },
      { id: 'aboutPage',            close: () => typeof closeAboutPage === 'function' && closeAboutPage(), checkFn: el => el.classList.contains('open') },
      { id: 'myOrdersPage',         close: () => typeof closeMyOrders === 'function' && closeMyOrders() },
      { id: 'phoneOrderBackdrop',   close: () => typeof closePhoneOrder === 'function' && closePhoneOrder() },
      { id: 'prodPreviewBackdrop',  close: () => typeof closeProdPreview === 'function' && closeProdPreview() },
    ];
    for (const { id, close, checkFn } of panels) {
      const el = document.getElementById(id);
      const isOpen = el && (checkFn ? checkFn(el) : el.classList.contains('open'));
      if (isOpen) { close(); break; }
    }
  }
});


// ===== 404 PAGE =====
function open404() {
  document.getElementById('page404').classList.add('open');
  document.body.style.overflow='hidden';
}
function close404() {
  document.getElementById('page404').classList.remove('open');
  document.body.style.overflow='';
}


// ===== PRODUCT COMPARISON =====
// toggleCompare, clearCompare, openComparePage, _renderCompareBar and compareIds
// are defined in gallery.js (canonical version using global compareList from data.js).

function closeComparePage() {
  document.getElementById('comparePage').style.display = 'none';
  document.body.style.overflow = '';
}

// IDEA-16: Hero Right Panel - personalized widget
function renderHeroRightPanel() {
  var panel = document.getElementById('heroRightPanel');
  if (!panel) return;

  function _hrpItem(p, large) {
    var imgHtml = p.img
      ? '<img src="' + escHtml(p.img) + '" alt="" width="' + (large?44:32) + '" height="' + (large?44:32) + '" loading="lazy" style="width:' + (large?44:32) + 'px;height:' + (large?44:32) + 'px;object-fit:contain;border-radius:6px;" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'\'"><span style="font-size:' + (large?28:20) + 'px;display:none;">' + escHtml(p.emoji||'') + '</span>'
      : '<span style="font-size:' + (large?28:20) + 'px;">' + escHtml(p.emoji||'') + '</span>';
    return '<div class="hrp-item" style="cursor:pointer;" onclick="openProductPage(' + p.id + ')">' +
      '<div class="hrp-thumb">' + imgHtml + '</div>' +
      '<div class="hrp-item-info"><div class="hrp-item-name">' + escHtml((p.name||'').substring(0,32)) + (p.name.length>32?'…':'') + '</div>' +
      '<div class="hrp-item-price">' + fmtEur(p.price) + '</div></div></div>';
  }

  // Priority 1: Wishlist
  if (wishlist && wishlist.length > 0) {
    var wlProds = wishlist.slice(0,3).map(function(id){return products.find(function(x){return x.id===id;});}).filter(Boolean);
    if (wlProds.length) {
      panel.innerHTML = '<div class="hrp-widget">' +
        '<div class="hrp-title">❤ Твоите любими продукти</div>' +
        wlProds.map(function(p){return _hrpItem(p,false);}).join('') +
        '<button class="hrp-see-all" onclick="openWishlist()">Виж всички →</button></div>';
      return;
    }
  }

  // Priority 2: Blog posts (always fresh, never niche/irrelevant)
  if (typeof blogPosts !== 'undefined' && blogPosts.length) {
    var _blogCatIcon = { 'Ревю':'ic-star', 'Сравнение':'ic-compare', 'Топ 5':'ic-tag',
      'Съвети':'ic-info', 'Smart Home':'ic-home', 'Гейминг':'ic-gamepad' };
    var _svgIcon = function(id) {
      return '<svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#' + id + '"/></svg>';
    };
    var posts = blogPosts.slice(0, 3);
    var blogHtml = '<div class="hrp-widget">' +
      '<div class="hrp-title">' + _svgIcon('ic-globe') + ' От блога</div>';
    posts.forEach(function(post, i) {
      if (i > 0) blogHtml += '<div class="hrp-blog-divider"></div>';
      var iconId = _blogCatIcon[post.cat] || 'ic-info';
      blogHtml += '<div class="hrp-blog-item" onclick="openBlogPost(\'' + post.slug + '\')" role="button" tabindex="0">' +
        '<div class="hrp-blog-icon">' + _svgIcon(iconId) + '</div>' +
        '<div class="hrp-blog-info">' +
          '<div class="hrp-blog-cat">' + escHtml(post.cat) + '</div>' +
          '<div class="hrp-blog-title">' + escHtml(post.title) + '</div>' +
          '<div class="hrp-blog-meta"><span>' + escHtml(post.read) + '</span><span>·</span><span>' + escHtml((post.date||'').split(' ').slice(0,2).join(' ')) + '</span></div>' +
        '</div></div>';
    });
    blogHtml += '<button class="hrp-see-all" onclick="openBlogPage()">Виж още →</button></div>';
    panel.innerHTML = blogHtml;
    return;
  }

  // Priority 3: Top rated product
  var top = products.slice().sort(function(a,b){return (b.rating*Math.min(b.rv,500))-(a.rating*Math.min(a.rv,500));})[0];
  if (top) {
    panel.innerHTML = '<div class="hrp-widget">' +
      '<div class="hrp-title">🏆 Топ продукт</div>' +
      _hrpItem(top, true) +
      '<div class="hrp-stars">' + starsHTML(top.rating) + ' <span style="font-size:11px;color:var(--muted);">(' + top.rv + ' ревюта)</span></div></div>';
  }
}

// ===== MOBILE FILTER DRAWER =====
function toggleMobileFilters() {
  if (window.innerWidth > 1024) return;
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('mobile-open');
  sidebar.classList.toggle('mobile-open', !isOpen);
  if (overlay) overlay.classList.toggle('active', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}
function closeMobileFilters() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Swipe-to-close for mobile filter sidebar
(function() {
  let _sfStartX = 0;
  document.addEventListener('touchstart', function(e) {
    const sb = document.querySelector('.sidebar.mobile-open');
    if (sb && sb.contains(e.target)) _sfStartX = e.touches[0].clientX;
    else _sfStartX = 0;
  }, { passive: true });
  document.addEventListener('touchend', function(e) {
    if (!_sfStartX) return;
    const dx = _sfStartX - e.changedTouches[0].clientX;
    if (dx > 60) closeMobileFilters(); // swipe left → close
    _sfStartX = 0;
  }, { passive: true });
})();

// ===== FOCUS TRAP =====
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

let _trapStack = [];

function trapFocus(containerEl) {
  if (!containerEl) return;
  const prevFocus = document.activeElement;
  _trapStack.push({ el: containerEl, prevFocus });

  function onKeyDown(e) {
    if (e.key !== 'Tab') return;
    const focusable = [...containerEl.querySelectorAll(FOCUSABLE)].filter(el =>
      el.offsetParent !== null && !el.closest('[style*="display: none"]') && !el.closest('[style*="display:none"]')
    );
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  containerEl._trapHandler = onKeyDown;
  document.addEventListener('keydown', onKeyDown);
  const first = containerEl.querySelector(FOCUSABLE);
  if (first) setTimeout(() => first.focus(), 60);
}

function releaseFocus(containerEl) {
  if (!containerEl) return;
  if (containerEl._trapHandler) {
    document.removeEventListener('keydown', containerEl._trapHandler);
    delete containerEl._trapHandler;
  }
  const entry = _trapStack.findIndex(t => t.el === containerEl);
  if (entry !== -1) {
    const { prevFocus } = _trapStack[entry];
    _trapStack.splice(entry, 1);
    try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch(e) {}
  }
}

// Auto-hook modals: watch for open/close class changes
(function() {
  const MODAL_IDS = [
    'productModalBackdrop','compareModalBackdrop','quickOrderBackdrop',
    'pdpBackdrop','cartDrawer','searchResultsPage','wishlistPage',
    'cookieModalBackdrop','pwaIosModal','comparePage',
    'authBackdrop','checkoutPage','blogPage','servicePage',
    'deliveryPage','contactsPage','aboutPage','myOrdersPage',
    'phoneOrderBackdrop','prodPreviewSheet'
  ];
  function hookModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    new MutationObserver(() => {
      const isOpen = el.classList.contains('open') || el.classList.contains('active') || el.style.display === 'block';
      if (isOpen && !el._trapActive) { el._trapActive = true; trapFocus(el); }
      else if (!isOpen && el._trapActive) { el._trapActive = false; releaseFocus(el); }
    }).observe(el, { attributes: true, attributeFilter: ['class','style'] });
  }
  document.addEventListener('DOMContentLoaded', () => MODAL_IDS.forEach(hookModal));
})();

// ===== SCROLL ANIMATIONS =====
let _scrollAnimObs = null;
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  if (_scrollAnimObs) return; // already initialised
  _scrollAnimObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        _scrollAnimObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  function observeCards() {
    document.querySelectorAll('.product-card:not(.card-visible)').forEach(el => {
      if (!el.classList.contains('card-animate')) el.classList.add('card-animate');
      _scrollAnimObs.observe(el);
    });
  }
  observeCards();
  // Watch for dynamically added cards
  const mo = new MutationObserver(observeCards);
  mo.observe(document.body, { childList: true, subtree: true });
}



// ── Overlay search bars (catPage + megamenu topbars) ────────────────────────
// Single handler for all .overlay-search-input elements.
// Mobile: icon toggles the bar open/closed. Desktop: bar always visible.
(function () {
  function initOverlaySearch(wrap) {
    var iconBtn = wrap.querySelector('.overlay-search-icon-btn');
    var bar = wrap.querySelector('.overlay-search-bar');
    var input = wrap.querySelector('.overlay-search-input');
    var clearBtn = wrap.querySelector('.overlay-search-clear');
    if (!input) return;

    // Mobile toggle
    if (iconBtn) {
      iconBtn.addEventListener('click', function () {
        var isOpen = bar.classList.toggle('open');
        iconBtn.setAttribute('aria-expanded', isOpen);
        if (isOpen) { input.focus(); }
      });
    }

    var debounce;
    input.addEventListener('input', function () {
      var q = input.value.trim();
      clearBtn.style.display = q ? '' : 'none';
      clearTimeout(debounce);
      if (q.length >= 2) {
        debounce = setTimeout(function () {
          if (typeof showSearchResultsPage === 'function') showSearchResultsPage(q);
        }, 320);
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = input.value.trim();
        if (q && typeof showSearchResultsPage === 'function') showSearchResultsPage(q);
      }
      if (e.key === 'Escape') {
        input.value = '';
        clearBtn.style.display = 'none';
        bar.classList.remove('open');
        if (iconBtn) iconBtn.setAttribute('aria-expanded', 'false');
      }
    });

    clearBtn.addEventListener('click', function () {
      input.value = '';
      clearBtn.style.display = 'none';
      input.focus();
    });
  }

  document.querySelectorAll('.overlay-search-wrap').forEach(initOverlaySearch);
}());

// ── Sticky filter bar в catPage (мобилна) ───────────────────────────────────
(function () {
  var toolbar = null, stickyBar = null, catPageEl = null, obs = null;

  function initCpStickyBar() {
    if (window.innerWidth > 768) return;
    catPageEl = document.getElementById('catPage');
    toolbar = document.querySelector('.cat-page-toolbar');
    stickyBar = document.getElementById('cpStickyBar');
    if (!toolbar || !stickyBar || !catPageEl) return;
    if (obs) obs.disconnect();
    obs = new IntersectionObserver(function(entries) {
      var visible = entries[0].isIntersecting;
      stickyBar.classList.toggle('show', !visible);
      // Sync sort value
      var mainSort = document.getElementById('cpSort');
      var stickySort = document.getElementById('cpStickySort');
      if (mainSort && stickySort) stickySort.value = mainSort.value;
    }, { root: catPageEl, threshold: 0 });
    obs.observe(toolbar);
  }

  // Init when catPage opens
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action && btn.dataset.action.includes('openCatPage')) {
      setTimeout(initCpStickyBar, 100);
    }
  });

  // Also init on resize
  window.addEventListener('resize', function() {
    if (stickyBar) stickyBar.classList.remove('show');
    if (obs) { obs.disconnect(); obs = null; }
    setTimeout(initCpStickyBar, 100);
  });
}());

// ── Swipe-to-close за full-screen overlays (мобилна) ────────────────────────
(function () {
  var OVERLAYS = [
    { id: 'catPage',      close: function() { if (typeof closeCatPage === 'function') closeCatPage(); } },
    { id: 'blogPage',     close: function() { if (typeof closeBlogPage === 'function') closeBlogPage(); } },
    { id: 'servicePage',  close: function() { if (typeof closeServicePage === 'function') closeServicePage(); } },
    { id: 'deliveryPage', close: function() { if (typeof closeDeliveryPage === 'function') closeDeliveryPage(); } },
    { id: 'contactsPage', close: function() { if (typeof closeContactsPage === 'function') closeContactsPage(); } },
    { id: 'aboutPage',    close: function() { if (typeof closeAboutPage === 'function') closeAboutPage(); } },
  ];

  function initSwipeToClose(el, closeFn) {
    var startY = 0, startX = 0, dragging = false;
    el.addEventListener('touchstart', function(e) {
      if (window.innerWidth > 768) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      dragging = true;
    }, { passive: true });
    el.addEventListener('touchend', function(e) {
      if (!dragging || window.innerWidth > 768) return;
      dragging = false;
      var dy = e.changedTouches[0].clientY - startY;
      var dx = Math.abs(e.changedTouches[0].clientX - startX);
      if (dy > 80 && dx < 40) closeFn();
    }, { passive: true });
  }

  // Add drag handle to overlay topbars and init swipe
  OVERLAYS.forEach(function(cfg) {
    var el = document.getElementById(cfg.id);
    if (!el) return;
    // Insert drag handle as first child if not already present
    if (!el.querySelector('.swipe-handle')) {
      var handle = document.createElement('div');
      handle.className = 'swipe-handle';
      handle.setAttribute('aria-hidden', 'true');
      el.insertBefore(handle, el.firstChild);
    }
    initSwipeToClose(el, cfg.close);
  });
}());


// ===== MOBILE DRAWER MENU =====
function toggleMobMenu() {
  const overlay = document.getElementById('mobOverlay');
  const drawer = document.getElementById('mobDrawer');
  if (!drawer || !overlay) return;
  const isOpen = drawer.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  setBottomNavActive(isOpen ? 'bn-menu' : '');
  if (isOpen) {
    document.body.dataset.scrollY = window.scrollY;
    document.body.style.cssText += ';overflow:hidden;position:fixed;top:-' + window.scrollY + 'px;width:100%';
  } else {
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.cssText = document.body.style.cssText.replace(/overflow:[^;]+;position:fixed;top:[^;]+;width:[^;]+;?/g, '');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }
}
function closeMobMenu() {
  const overlay = document.getElementById('mobOverlay');
  const drawer = document.getElementById('mobDrawer');
  if (overlay) overlay.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
  setBottomNavActive('');
  const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
}

// ===== CATEGORY BOTTOM SHEET =====
function openCatSheet() {
  const sheet = document.getElementById('catSheet');
  const overlay = document.getElementById('catSheetOverlay');
  if (!sheet || !overlay) return;
  sheet.classList.add('open');
  overlay.classList.add('open');
  setBottomNavActive('bn-cats');
  document.body.style.overflow = 'hidden';
}
function closeCatSheet() {
  const sheet = document.getElementById('catSheet');
  const overlay = document.getElementById('catSheetOverlay');
  if (sheet) sheet.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  setBottomNavActive('');
  document.body.style.overflow = '';
}

// ===== HOME BUTTON =====
function goHome() {
  closeMobMenu();
  closeCatSheet();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setBottomNavActive('bn-home');
}
