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
  if (!localStorage.getItem('mc_cookies_set')) {
    setTimeout(() => document.getElementById('cookieBanner').classList.add('show'), 1200);
  }
}
function acceptCookies() {
  localStorage.setItem('mc_cookies_set', 'all');
  hideCookieBanner();
  showToast('🍪 Бисквитките са приети');
}
function declineCookies() {
  localStorage.setItem('mc_cookies_set', 'essential');
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
  localStorage.setItem('mc_cookies_set', JSON.stringify(prefs));
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
  document.querySelectorAll('.section-wrap, .banner-row, .promo-strip, .hp-cats-grid, .sfb-block').forEach(el => {
    el.classList.add('sa-el');
    obs.observe(el);
  });
}

// ===== BACK TO TOP =====
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
}

// ===== BOTTOM NAV =====
function setBottomNavActive(id) {
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#' + id).forEach(el => el.classList.add('active'));
}
function closePagesGoHome() {
  ['wishlistPage','contactPage','searchResultsPage','checkoutPage','thankyouPage','myOrdersPage'].forEach(id => {
    document.getElementById(id)?.classList.remove('open');
  });
  document.body.style.overflow = '';
  setBottomNavActive('bn-home');
  window.scrollTo({top:0,behavior:'smooth'});
}
function focusSearch() {
  const inp = document.getElementById('searchInput');
  if (inp) { inp.focus(); inp.scrollIntoView({behavior:'smooth',block:'center'}); }
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
  // On mobile screens, always force light mode and clear any saved dark preference
  if (window.innerWidth <= 768) {
    document.body.classList.remove('dark');
    try { localStorage.setItem('mc_dark', '0'); } catch(e){}
    return;
  }
  const saved = localStorage.getItem('mc_dark');
  if(saved === '1') document.body.classList.add('dark');
})();
function toggleDarkMode(){
  // Dark mode not available on mobile
  if (window.innerWidth <= 768) {
    showToast('☀️ Тъмният режим не е наличен на мобилно');
    return;
  }
  const dark = document.body.classList.toggle('dark');
  const dmIcon = document.getElementById('dmIcon');
  if (dmIcon) dmIcon.innerHTML = dark
    ? '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-sun"/></svg>'
    : '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-moon"/></svg>';
  try { localStorage.setItem('mc_dark', dark ? '1' : '0'); } catch(e){}
  showToast(dark ? '🌙 Тъмен режим включен' : '☀️ Светъл режим');
}
(function(){
  const dark = document.body.classList.contains('dark');
  const ic = document.getElementById('dmIcon');
  if (ic) ic.innerHTML = dark
    ? '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-sun"/></svg>'
    : '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-moon"/></svg>';
})();

try { localStorage.removeItem('mc_lang'); } catch(e){}

// ===== LIVE CHAT =====
let chatOpen = false;
setTimeout(() => { const dot = document.getElementById('chatDot'); if(dot) dot.style.display = 'block'; }, 5000);
function toggleChat(){
  chatOpen = !chatOpen;
  document.getElementById('liveChatPopup').classList.toggle('show', chatOpen);
  const ic = document.getElementById('chatBtnIcon'); if(ic) ic.textContent = chatOpen ? '×' : '💬';
  const dot = document.getElementById('chatDot'); if(dot && chatOpen) dot.style.display = 'none';
}
document.addEventListener('click', e => {
  if(chatOpen && !e.target.closest('#liveChatWrap')){
    chatOpen = false;
    document.getElementById('liveChatPopup').classList.remove('show');
    const ic = document.getElementById('chatBtnIcon'); if(ic) ic.textContent = '💬';
  }
});


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



// ===== MEGAMENU =====
const megaCategories = [
  { cat:'laptop',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-laptop"/></svg>', name:'Лаптопи и компютри' },
  { cat:'mobile',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-phone"/></svg>', name:'Телефони' },
  { cat:'tablet',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-tablet"/></svg>', name:'Таблети' },
  { cat:'audio',   icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-headphones"/></svg>', name:'Аудио и слушалки' },
  { cat:'tv',      icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-tv"/></svg>', name:'Телевизори' },
  { cat:'camera',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-camera"/></svg>', name:'Фотоапарати' },
  { cat:'gaming',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-gamepad"/></svg>', name:'Гейминг' },
  { cat:'smart',   icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-watch"/></svg>', name:'Смарт устройства' },
  { cat:'network', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-wifi"/></svg>', name:'Мрежово оборудване' },
  { cat:'print',   icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-printer"/></svg>', name:'Принтери' },
  { cat:'acc',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-mouse"/></svg>', name:'Аксесоари' },
];
const megaBrands = ['Intel', 'ASUS', 'Acer', 'Microsoft', 'Lenovo', 'Gigabyte', 'LG', 'HP', 'ADATA', 'Sapphire', 'Tenda', 'Kingston', 'Seagate', 'AMD', 'Seasonic', 'ASRock', 'Repotec', 'Realme', 'MSI', 'Tuncmatik', 'Palit', 'Nokia', 'Dynac', 'Cooler Master', 'Fractal', 'NZXT', 'Canon', 'Fnatic', 'GeIL', 'FSP Group', 'Omega', 'Inform UPS', 'QNAP', 'D-Link', 'AV Tech'];

function openMegamenu() {
  // Render cats
  const catsEl = document.getElementById('megamenuCats');
  if (!catsEl) return;
  catsEl.innerHTML = megaCategories.map(c => {
    const count = products.filter(p=>p.cat===c.cat).length;
    return `<div class="megamenu-cat-card" onclick="megaFilterCat('${c.cat}')">
      <div class="megamenu-cat-icon">${c.icon}</div>
      <div class="megamenu-cat-name">${c.name}</div>
      <div class="megamenu-cat-count">${count} продукта</div>
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
  // Apply filter on main page
  const pill = document.querySelector(`.filter-pill[onclick*="'${cat}'"]`);
  if (pill) { applyFilter(pill, cat); document.getElementById('featured').scrollIntoView({behavior:'smooth'}); }
  else { showSearchResultsPage(cat); }
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
    'cookieModalBackdrop','pwaIosModal','comparePage'
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


