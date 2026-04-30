// ===== CURRENCY =====
let EUR_RATE;
try { EUR_RATE = parseFloat(localStorage.getItem('eurRate')); } catch(e) {}
if (!EUR_RATE || isNaN(EUR_RATE)) EUR_RATE = 1.95583;
function toEur(bgn) { return bgn / EUR_RATE; }
function fmtEur(bgn) { return toEur(bgn).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €'; }
function fmtBgn(bgn) { return bgn.toLocaleString('bg-BG', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' лв.'; }
// Primary display: EUR bold, BGN muted below
function fmtPrice(bgn, saleCls='') {
  return `<span class="price-eur-main${saleCls ? ' '+saleCls : ''}">${fmtEur(bgn)}</span><span class="price-bgn-sub">${fmtBgn(bgn)}</span>`;
}
// Inline dual: "2.30 € / 4.49 лв."
function fmtDual(bgn) { return `${fmtEur(bgn)} / ${fmtBgn(bgn)}`; }

// Единен речник на категориите — canonical + legacy ключове
const CAT_LABELS = {
  all:'Всички продукти',
  laptops:'Лаптопи', desktops:'Настолни компютри', components:'Компоненти',
  peripherals:'Периферия', network:'Мрежово оборудване', storage:'Сървъри и сторидж',
  software:'Софтуер', accessories:'Аксесоари',
  sale:'Промоции', new:'Нови продукти',
  // Legacy ключове
  laptop:'Лаптопи', desktop:'Десктопи', gaming:'Гейминг',
  audio:'Аудио', mobile:'Телефони', tablet:'Таблети',
  tv:'Телевизори', camera:'Фотоапарати', smart:'Смарт устройства',
  print:'Принтери', acc:'Аксесоари', monitor:'Монитори',
};

// HTML escape — използвай навсякъде преди вмъкване на user input в innerHTML
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EUR_RATE, toEur, fmtEur, fmtBgn, fmtPrice, fmtDual, escHtml };
}


function starsHTML(r){return '★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));}

function makeCard(p,small=false){
  const save=p.old?Math.round(((p.old-p.price)/p.old)*100):0;
  const _eName = escHtml(p.name);
  const imgHtml = p.img
    ? `<img class="product-img-real" src="${escHtml(p.img)}" alt="${_eName}" itemprop="image" loading="lazy" width="300" height="300" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${p.emoji}</span>`
    : `<span class="product-img-emoji">${p.emoji}</span>`;
  return `<article class="product-card pos-rel" itemscope itemtype="https://schema.org/Product">
    <div class="product-badge-wrap">
      ${p.badge==='sale'?'<span class="badge badge-sale">Промо</span>':''}
      ${p.badge==='new'?'<span class="badge badge-new">Ново</span>':''}
      ${p.badge==='hot'?'<span class="badge badge-hot">Горещо</span>':''}
      ${p.pct>0?`<span class="badge badge-pct">-${p.pct}%</span>`:''}
      ${p.stock===false?'<span class="badge badge-oos">Изчерпан</span>':''}
    </div>
    <button class="product-wishlist" id="wl-${p.id}" type="button" onclick="toggleWishlist(${p.id},event)" title="Добави в любими" aria-label="Добави в любими"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart"/></svg></button>
    <a href="?product=${p.id}" class="product-img-wrap${small?' small':''}" onclick="openProductPage(${p.id});return false;" style="cursor:pointer;" aria-label="${_eName}" itemprop="url">
      ${imgHtml}
    </a>
    <div class="product-body">
      <div class="product-brand" itemprop="brand">${escHtml(p.brand)}</div>
      <h3 class="product-name" itemprop="name"><a href="?product=${p.id}" onclick="openProductPage(${p.id});return false;" style="color:inherit;text-decoration:none;">${_eName}</a></h3>
      <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating} (${p.rv})</span></div>
      <div class="product-footer">
        <div class="price-row">
          <div class="price-current${p.badge==='sale'?' sale':''}" itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="priceCurrency" content="EUR"><link itemprop="availability" href="${p.stock===false?'https://schema.org/OutOfStock':'https://schema.org/InStock'}"><span itemprop="price" content="${p.price}">${fmtPrice(p.price, p.badge==='sale'?'sale':'')}</span></div>
          ${p.old?`<div class="price-old">${fmtEur(p.old)}</div><div class="price-save">-${save}%</div>`:''}
        </div>
        ${p.stock!==false?`<div class="card-delivery-hint">📦 Доставка до 2 работни дни</div>`:''}
        ${p.stock!==false?`<div class="card-warranty">🛡 2г. гаранция</div>`:''}
        <button type="button" class="add-cart-btn" id="cb-${p.id}" onclick="addToCart(${p.id})" ${p.stock===false?'disabled':''}><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> ${p.stock===false?'Изчерпан':'Добави в кошница'}</button>
        <div class="row-gap-6 card-secondary-btns" style="margin-top:6px;">
          <button type="button" class="card-sec-btn product-quick-view-btn" onclick="openProductPage(${p.id})" title="Бърз преглед"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-eye"/></svg><span class="card-sec-btn-label">Преглед</span></button>
          <button type="button" class="card-sec-btn" onclick="openQuickOrder(${p.id})" title="Бърза поръчка"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-bolt"/></svg><span class="card-sec-btn-label">Бърза поръчка</span></button>
          <button type="button" class="card-sec-btn" id="cmp-btn-${p.id}" onclick="toggleCompare(${p.id},!compareList.includes(${p.id}))" title="Сравни"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-compare"/></svg><span class="card-sec-btn-label">Сравни</span></button>
        </div>
      </div>
    </div>
  </article>`;
}


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
  document.querySelectorAll('.section-wrap:not(#featured), .banner-row, .promo-strip, .hp-cats-grid, .sfb-block').forEach(el => {
    el.classList.add('sa-el');
    obs.observe(el);
  });
}

// ===== BACK TO TOP =====
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToFeatured() { document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }); }
function scrollToSale()     { document.getElementById('sale')?.scrollIntoView({ behavior: 'smooth' }); }

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
  const saved = localStorage.getItem('mc_dark');
  if(saved === '1') document.body.classList.add('dark');
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
  { cat:'laptops',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-laptop"/></svg>', name:'Лаптопи' },
  { cat:'desktops',    icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-desktop"/></svg>', name:'Настолни компютри' },
  { cat:'components',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-cpu"/></svg>', name:'Компоненти' },
  { cat:'peripherals', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-mouse"/></svg>', name:'Периферия' },
  { cat:'network',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-wifi"/></svg>', name:'Мрежово оборудване' },
  { cat:'storage',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-storage"/></svg>', name:'Сървъри и сторидж' },
  { cat:'software',    icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-tag"/></svg>', name:'Софтуер' },
  { cat:'accessories', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-truck"/></svg>', name:'Аксесоари' },
];
const megaBrands = ['Intel', 'ASUS', 'Acer', 'Microsoft', 'Lenovo', 'Gigabyte', 'LG', 'HP', 'ADATA', 'Sapphire', 'Tenda', 'Kingston', 'Seagate', 'AMD', 'Seasonic', 'ASRock', 'Repotec', 'Realme', 'MSI', 'Tuncmatik', 'Palit', 'Nokia', 'Dynac', 'Cooler Master', 'Fractal', 'NZXT', 'Canon', 'Fnatic', 'GeIL', 'FSP Group', 'Omega', 'Inform UPS', 'QNAP', 'D-Link', 'AV Tech', 'HyperX', 'Anker'];

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
    'cookieModalBackdrop','pwaIosModal','comparePage',
    'authBackdrop','checkoutPage','blogPage','servicePage',
    'deliveryPage','contactsPage','aboutPage','myOrdersPage'
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



// ===== XSS ESCAPE HELPER =====
function _esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ===== GALLERY STATE =====
let galleryImages = [], galleryIdx = 0;

function getProductImages(p) {
  const imgs = [];
  const seen = new Set();

  // Use gallery[] array if present (from XML import), else fall back to img
  const sources = (Array.isArray(p.gallery) && p.gallery.length)
    ? p.gallery
    : (p.img ? [p.img] : []);

  sources.forEach((src, i) => {
    if (src && !seen.has(src)) {
      seen.add(src);
      imgs.push({ src, label: i === 0 ? 'Основна' : `Изглед ${i + 1}` });
    }
  });

  // Always add emoji fallback as last "image"
  imgs.push({ src: null, emoji: p.emoji, label: 'Икона' });
  return imgs;
}

function renderGallery(p, idx=0) {
  galleryImages = getProductImages(p);
  galleryIdx = Math.min(idx, galleryImages.length - 1);
  const imgEl = document.getElementById('modalImg');
  const emojiEl = document.getElementById('modalEmoji');
  const thumbsEl = document.getElementById('modalThumbs');
  const cur = galleryImages[galleryIdx];

  // Show/hide nav arrows
  const prev = document.getElementById('modalNavPrev');
  const next = document.getElementById('modalNavNext');
  if (prev) prev.style.display = galleryImages.length > 1 ? '' : 'none';
  if (next) next.style.display = galleryImages.length > 1 ? '' : 'none';

  // Main image
  if (cur.src) {
    imgEl.style.display = 'block'; emojiEl.style.display = 'none';
    imgEl.src = cur.src; imgEl.alt = p.name;
    imgEl.classList.add('img-loaded');
    imgEl.onerror = () => {
      imgEl.style.display='none'; emojiEl.style.display='block';
      emojiEl.textContent = p.emoji;
      // Remove this thumb from gallery
      galleryImages[galleryIdx] = { src:null, emoji:p.emoji, label:'Икона' };
      renderThumbs(p);
    };
  } else {
    imgEl.style.display = 'none'; emojiEl.style.display = 'block';
    emojiEl.textContent = cur.emoji || p.emoji;
  }
  renderThumbs(p);
}

function renderThumbs(p) {
  const thumbsEl = document.getElementById('modalThumbs');
  if (!thumbsEl || galleryImages.length <= 1) { if(thumbsEl) thumbsEl.innerHTML=''; return; }
  thumbsEl.innerHTML = galleryImages.map((img, i) =>
    `<div class="modal-thumb ${i===galleryIdx?'active':''}" onclick="switchGalleryImg(${i})">
      ${img.src
        ? `<img src="${img.src}" alt="${p.name}" onerror="this.parentElement.style.display='none'">`
        : `<span class="modal-thumb-emoji">${img.emoji||p.emoji}</span>`}
    </div>`
  ).join('');
}

function switchGalleryImg(idx) {
  const p = products.find(x=>x.id===modalProductId); if(!p) return;
  const imgEl = document.getElementById('modalImg');
  imgEl.classList.add('fading');
  setTimeout(() => {
    galleryIdx = idx;
    renderGallery(p, idx);
    imgEl.classList.remove('fading');
  }, 200);
}

function galleryNav(dir) {
  const total = galleryImages.length;
  switchGalleryImg((galleryIdx + dir + total) % total);
}

function openProductModal(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  modalProductId=id;modalQtyVal=1;

  // Track recently viewed
  addToRecentlyViewed(id);

  // Gallery
  renderGallery(p, 0);

  document.getElementById('modalBrand').textContent=p.brand;
  document.getElementById('modalName').textContent=p.name;
  document.getElementById('modalStars').textContent=starsHTML(p.rating);
  document.getElementById('modalRv').textContent=`${p.rating} (${p.rv} ревюта)`;
  const pe=document.getElementById('modalPrice');
  pe.innerHTML=fmtPrice(p.price, p.badge==='sale'?'sale':'');
  pe.className='modal-price'+(p.badge==='sale'?' sale':'');
  const oe=document.getElementById('modalOld'),se=document.getElementById('modalSave');
  if(p.old){oe.textContent=fmtEur(p.old)+' / '+fmtBgn(p.old);se.textContent='-'+Math.round((p.old-p.price)/p.old*100)+'%';se.style.display='';}else{oe.textContent='';se.style.display='none';}
  document.getElementById('modalMonthly').innerHTML='';
  document.getElementById('modalQty').textContent='1';
  document.getElementById('modalSpecs').innerHTML=Object.keys(p.specs).slice(0,4).map(k=>`<div class="spec-chip"><div class="spec-chip-key">${_esc(k)}</div><div class="spec-chip-val">${_esc(p.specs[k])}</div></div>`).join('');
  let b='';if(p.badge==='sale')b+='<span class="badge badge-sale">Промо</span>';if(p.badge==='new')b+='<span class="badge badge-new">Ново</span>';if(p.badge==='hot')b+='<span class="badge badge-hot">Горещо</span>';
  document.getElementById('modalBadges').innerHTML=b;
  document.getElementById('modalDesc').textContent=p.desc;
  var _el_modalSpecsFull=document.getElementById('modalSpecsFull'); if(_el_modalSpecsFull) _el_modalSpecsFull.innerHTML =
    `<div class="spec-chip"><div class="spec-chip-key">SKU</div><div class="spec-chip-val mono-12">${_esc(p.sku)}</div></div>` +
    `<div class="spec-chip"><div class="spec-chip-key">EAN</div><div class="spec-chip-val mono-12">${_esc(p.ean)}</div></div>` +
    Object.entries(p.specs).map(([k,v])=>`<div class="spec-chip"><div class="spec-chip-key">${_esc(k)}</div><div class="spec-chip-val">${_esc(v)}</div></div>`).join('');
  document.getElementById('modalReviews').innerHTML=p.reviews.map(r=>`<div class="review-item"><div class="review-header"><span class="review-name">${_esc(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_esc(r.date)}</span></div><div class="review-text">${_esc(r.text)}</div></div>`).join('');
  switchTab('desc');
  document.getElementById('productModalBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeProductModal(e){if(e.target===e.currentTarget)closeProductModalDirect();}
function closeProductModalDirect(){
  document.getElementById('productModalBackdrop').classList.remove('open');
  document.body.style.overflow='';
  // Restore title if no category page is open
  if (!document.getElementById('catPage')?.classList.contains('open') && !document.getElementById('pdpBackdrop')?.classList.contains('open')) {
    document.title = 'Most Computers — Техника и Електроника';
  }
}
function switchTab(tab){
  document.querySelectorAll('.modal-tab').forEach((t,i)=>t.classList.toggle('active',['desc','specs','reviews'][i]===tab));
  document.querySelectorAll('.modal-tab-content').forEach(c=>c.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
}
function changeModalQty(d){modalQtyVal=Math.max(1,modalQtyVal+d);document.getElementById('modalQty').textContent=modalQtyVal;}
function addFromModal(){
  if(!modalProductId)return;const p=products.find(x=>x.id===modalProductId);if(!p)return;
  const ex=cart.find(x=>x.id===modalProductId);if(ex){ex.qty+=modalQtyVal;}else{cart.push({...p,qty:modalQtyVal});}
  updateCart();const btn=document.getElementById('modalAddBtn');
  btn.innerHTML='✓ Добавен!';btn.style.background='var(--new)';
  setTimeout(()=>{btn.innerHTML='🛒 Добави в кошница';btn.style.background='';},2000);
  showToast(`✓ ${p.name.substring(0,32)}... добавен!`);
}

// COMPARE
function toggleCompare(id,checked){
  if(checked){
    const p = products.find(x=>x.id===id);
    if(compareList.length>0){
      const firstCat = products.find(x=>x.id===compareList[0])?.cat;
      if(p.cat !== firstCat){ showToast('⚠️ Можеш да сравняваш само продукти от една и съща категория!'); return; }
    }
    if(compareList.length>=3){showToast('Максимум 3 продукта за сравнение!');return;}
    if(!compareList.includes(id))compareList.push(id);
  }
  else{compareList=compareList.filter(x=>x!==id);}
  // Update button visual state
  const btn=document.getElementById('cmp-btn-'+id);
  if(btn) btn.style.background=compareList.includes(id)?'var(--primary-light)':'var(--bg)';
  updateCompareBar();
}
function updateCompareBar(){
  const bar=document.getElementById('compareBar');
  const preview=document.getElementById('comparePreview');
  const cnt=document.getElementById('compareCnt');
  if(compareList.length===0){bar.classList.remove('visible');return;}
  bar.classList.add('visible');
  if(cnt) cnt.textContent=compareList.length;
  let html='';
  for(let i=0;i<3;i++){
    if(i<compareList.length){const p=products.find(x=>x.id===compareList[i]);if(!p){compareList.splice(i,1);updateCompareBar();return;}html+=`<div class="compare-slot filled"><span class="compare-slot-emoji">${p.emoji}</span><span class="compare-slot-name">${p.name.length>22?p.name.slice(0,22)+'…':p.name}</span><button type="button" class="compare-slot-remove" onclick="removeCompare(${p.id})">×</button></div>`;}
    else html+=`<div class="compare-slot"><span style="color:rgba(255,255,255,0.4);font-size:11px;">+ Добави продукт</span></div>`;
  }
  if(preview) preview.innerHTML=html;
}

function openComparePage(){
  if(compareList.length<2){showToast('Избери поне 2 продукта за сравнение!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('Избери поне 2 налични продукта!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs||{})))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));
  let html=`<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">`;
  html+=`<thead><tr><th style="text-align:left;padding:12px;background:var(--bg2);border-radius:8px 0 0 0;">Продукт</th>`;
  prods.forEach(p=>html+=`<td style="padding:16px;text-align:center;background:var(--bg2);border-left:1px solid var(--border);"><span style="font-size:36px;display:block;margin-bottom:8px;">${p.emoji}</span><div style="font-weight:800;font-size:14px;margin-bottom:4px;">${p.name}</div><div style="font-size:18px;font-weight:900;color:var(--primary);">${fmtEur(p.price)}</div><div style="font-size:11px;color:var(--muted);">${fmtBgn(p.price)}</div><button type="button" onclick="addToCart(${p.id})" style="margin-top:10px;background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;">🛒 Добави</button></td>`);
  html+=`</tr></thead><tbody>`;
  html+=`<tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Цена</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.price===minP?'background:var(--primary-light);font-weight:800;color:var(--primary);':''}">${fmtEur(p.price)}</td>`);
  html+=`</tr><tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Рейтинг</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.rating===maxR?'background:var(--primary-light);font-weight:800;':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;
  allKeys.forEach(k=>{
    html+=`<tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);color:var(--muted);font-weight:600;">${k}</th>`;
    prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);">${(p.specs||{})[k]||'—'}</td>`);
    html+=`</tr>`;
  });
  html+=`</tbody></table></div>`;
  document.getElementById('compareTable').innerHTML=html;
  document.getElementById('comparePage').style.display='block';
  document.body.style.overflow='hidden';
}
function removeCompare(id){compareList=compareList.filter(x=>x!==id);const btn=document.getElementById('cmp-btn-'+id);if(btn)btn.style.background='var(--bg)';updateCompareBar();}
function clearCompare(){compareList.forEach(id=>{const cb=document.getElementById('cmp-'+id);if(cb)cb.checked=false;});compareList=[];updateCompareBar();}
function openCompareModal(){
  if(compareList.length<2){showToast('Избери поне 2 продукта!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('Избери поне 2 налични продукта!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs)))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));
  let html=`<thead><tr><th>Продукт</th>`;
  prods.forEach(p=>html+=`<td class="cmp-product-header"><span class="cmp-emoji">${p.emoji}</span><div class="cmp-name">${p.name}</div><div class="cmp-price">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></div><button type="button" class="cmp-add-btn" onclick="addToCart(${p.id})">🛒 Добави</button></td>`);
  html+=`</tr></thead><tbody><tr><th>Цена</th>`;
  prods.forEach(p=>html+=`<td class="${p.price===minP?'cmp-highlight':''}">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></td>`);
  html+=`</tr><tr><th>Рейтинг</th>`;
  prods.forEach(p=>html+=`<td class="${p.rating===maxR?'cmp-highlight':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;
  allKeys.forEach(k=>{html+=`<tr><th>${_esc(k)}</th>`;prods.forEach(p=>html+=`<td>${_esc(p.specs[k]||'—')}</td>`);html+=`</tr>`;});
  html+=`</tbody>`;
  document.getElementById('compareTableModal').innerHTML=html;
  document.getElementById('compareModalBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeCompareModal(e){if(e.target===e.currentTarget)closeCompareModalDirect();}
function closeCompareModalDirect(){document.getElementById('compareModalBackdrop').classList.remove('open');document.body.style.overflow='';}

// QUICK ORDER
function openQuickOrder(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  quickOrderProductId=id;
  document.getElementById('qoEmoji').textContent=p.emoji;
  document.getElementById('qoName').textContent=p.name;
  document.getElementById('qoPrice').textContent=fmtEur(p.price)+' / '+fmtBgn(p.price);
  document.getElementById('qoFormWrap').style.display='';
  document.getElementById('qoSuccess').classList.remove('show');
  ['qoName2','qoPhone','qoCity','qoAddr','qoNote'].forEach(fid=>{const el=document.getElementById(fid);if(el){el.value='';el.classList.remove('error');}});
  document.getElementById('quickOrderBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeQuickOrder(e){if(e.target===e.currentTarget)closeQuickOrderDirect();}
function closeQuickOrderDirect(){document.getElementById('quickOrderBackdrop').classList.remove('open');document.body.style.overflow='';}
function selectDelivery(el){document.querySelectorAll('.qo-delivery-opt').forEach(o=>o.classList.remove('selected'));el.classList.add('selected');}
function submitQuickOrder(){
  let ok=true;
  ['qoName2','qoPhone','qoCity','qoAddr'].forEach(fid=>{const el=document.getElementById(fid);if(!el.value.trim()){el.classList.add('error');ok=false;}else el.classList.remove('error');});
  if(!ok){showToast('Попълни всички задължителни полета!');return;}
  document.getElementById('qoFormWrap').style.display='none';
  document.getElementById('qoSuccess').classList.add('show');
  showToast('Поръчката е изпратена успешно!');
  setTimeout(closeQuickOrderDirect,4000);
}

// SLIDER
let currentSlide=0;
const slides=document.querySelectorAll('.slide'),dots=document.querySelectorAll('.dot');
function goSlide(n){if(!slides.length||!slides[n])return;slides[currentSlide].classList.remove('active');dots[currentSlide].classList.remove('active');dots[currentSlide].removeAttribute('aria-current');currentSlide=n;slides[currentSlide].classList.add('active');dots[currentSlide].classList.add('active');dots[currentSlide].setAttribute('aria-current','true');}
let _heroSliderIv=null;
if(slides.length){if(_heroSliderIv)clearInterval(_heroSliderIv);_heroSliderIv=setInterval(()=>goSlide((currentSlide+1)%slides.length),5000);}

// SALE SLIDE COUNTDOWN — counts down to end of day
(function(){
  const el = document.getElementById('saleCountdown');
  if(!el) return;
  function update(){
    const now = new Date();
    const eod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const diff = Math.max(0, Math.floor((eod - now) / 1000));
    const h = String(Math.floor(diff / 3600)).padStart(2,'0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2,'0');
    const s = String(diff % 60).padStart(2,'0');
    el.innerHTML = `⏱ Офертата изтича след <b>${h}:${m}:${s}</b>`;
  }
  update();
  setInterval(update, 1000);
})();

// COUNTDOWN — persistent across page reloads via localStorage
(function(){
  const DURATION = 4*3600; // 4 hours flash sale window
  let endTs = 0;
  try { endTs = parseInt(localStorage.getItem('mc_flash_end')||'0'); } catch(e) {}
  if(!endTs || Date.now() > endTs) {
    endTs = Date.now() + DURATION*1000;
    try { localStorage.setItem('mc_flash_end', endTs); } catch(e) {}
  }
  function tick(){
    let totalSecs = Math.max(0, Math.floor((endTs - Date.now())/1000));
    const th=document.getElementById('th'),tm=document.getElementById('tm'),ts=document.getElementById('ts');
    if(th) th.textContent=String(Math.floor(totalSecs/3600)).padStart(2,'0');
    if(tm) tm.textContent=String(Math.floor((totalSecs%3600)/60)).padStart(2,'0');
    if(ts) ts.textContent=String(totalSecs%60).padStart(2,'0');
    if(totalSecs===0){ localStorage.removeItem('mc_flash_end'); }
  }
  tick();
  if(window._countdownIv)clearInterval(window._countdownIv);
  window._countdownIv=setInterval(tick,1000);
})();

// TOAST
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2800);}


// CART
function saveCart() { try { localStorage.setItem('mc_cart', JSON.stringify(cart.map(x => ({ id: x.id, qty: x.qty })))); } catch (e) { } }
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('mc_cart') || '[]');
    if (saved.length) { cart = saved.map(x => { const p = products.find(p => p.id === x.id); return p ? { ...p, qty: x.qty } : null; }).filter(Boolean); updateCart(); }
  } catch (e) { }
}

function addToCart(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  const ex = cart.find(x => x.id === id); if (ex) { ex.qty++; } else { cart.push({ ...p, qty: 1 }); }
  updateCart(); saveCart();
  const btn = document.getElementById('cb-' + id);
  if (btn) { btn.classList.add('added'); btn.innerHTML = '✓ Добавен'; btn.disabled = true; setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави в кошница'; btn.disabled = false; }, 1200); }
  (function showCartToast(prod) {
    var ct = document.getElementById('cartToast');
    if (!ct) { showToast('✓ ' + prod.name.substring(0, 32) + '… добавен!'); return; }
    document.getElementById('cartToastEmoji').textContent = prod.emoji || '🛒';
    document.getElementById('cartToastMsg').textContent = prod.name.substring(0, 36) + (prod.name.length > 36 ? '…' : '') + ' добавен!';
    ct.classList.add('show');
    clearTimeout(ct._timer);
    ct._timer = setTimeout(function() { ct.classList.remove('show'); }, 3500);
  })(p);
  if (!document.getElementById('recPanel')) showRecommended(p);
}

function showRecommended(p) {
  const inCart = new Set(cart.map(x => x.id));
  let recs = products.filter(x => x.id !== p.id && x.cat === p.cat && !inCart.has(x.id));
  if (recs.length < 2) recs = products.filter(x => x.id !== p.id && !inCart.has(x.id));
  recs = recs.slice(0, 3);
  if (!recs.length) return;

  const panel = document.createElement('div');
  panel.id = 'recPanel';
  panel.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:2000;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:14px 16px;max-width:300px;width:calc(100vw - 40px);box-shadow:0 8px 32px rgba(0,0,0,0.18);opacity:0;transform:translateY(10px);transition:opacity 0.25s,transform 0.25s;';
  panel.innerHTML = `
    <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px;">Клиентите купуват и…</div>
    ${recs.map(r => `
      <div onclick="openProductPage(${r.id})" style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer;">
        <div style="font-size:22px;min-width:34px;text-align:center;">${r.emoji}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name.length > 32 ? r.name.substring(0, 32) + '…' : r.name}</div>
          <div style="font-size:12px;color:var(--primary);font-weight:700;">${fmtEur(r.price)}</div>
        </div>
        <button type="button" onclick="event.stopPropagation();addToCart(${r.id})" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;cursor:pointer;white-space:nowrap;font-family:'Outfit',sans-serif;font-weight:700;">+</button>
      </div>`).join('')}
    <button type="button" onclick="document.getElementById('recPanel').remove()" style="width:100%;margin-top:8px;background:none;border:none;color:var(--muted);font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;padding:4px;">Затвори ×</button>`;
  document.body.appendChild(panel);
  requestAnimationFrame(() => { panel.style.opacity = '1'; panel.style.transform = 'translateY(0)'; });
  panel._t = setTimeout(() => { panel.style.opacity = '0'; setTimeout(() => panel.remove(), 280); }, 8000);
}
function addToCartById(id) { addToCart(id); }
const FREE_SHIP_BGN = Math.round(100 * EUR_RATE * 100) / 100; // 100 EUR в лева

// Social proof counter — random-ish but deterministic per day so it feels real
(function initCartSocialProof() {
  const sp = document.getElementById('cartSocialProof');
  const txt = document.getElementById('cartSpText');
  if (!sp || !txt) return;
  // Seed by day so number changes daily but stays stable per session
  const seed = Math.floor(Date.now() / 86400000);
  const n = 28 + (seed % 41); // 28–68
  txt.textContent = `${n} души поръчаха от нас днес`;
  sp.style.display = '';
})();
function updateCart() {
  const count = cart.reduce((s, x) => s + x.qty, 0), total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const badge = document.getElementById('cartBadge'); if (badge) badge.textContent = count;
  const cartTotalEl = document.getElementById('cartTotal'); if (cartTotalEl) cartTotalEl.textContent = fmtEur(total) + ' / ' + fmtBgn(total);
  // sync PDP mini-header cart badge
  const pdpB = document.getElementById('pdpMhdrCartBadge');
  if (pdpB) { pdpB.textContent = count; pdpB.style.display = count > 0 ? '' : 'none'; }
  // sync bottom nav badges (two nav bars exist — update all)
  document.querySelectorAll('#bnCartBadge, #bnCartBadge2').forEach(bnB => {
    bnB.textContent = count; bnB.classList.toggle('show', count > 0);
  });
  const body = document.getElementById('cartBody');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty-msg"><div class="ce-icon"><svg width="44" height="44" class="svg-ic" aria-hidden="true" style="opacity:.25"><use href="#ic-cart"/></svg></div><p>Кошницата е празна.<br>Добави продукти!</p></div>';
    // Return focus to cart icon button when cart becomes empty and panel is open
    const panel = document.getElementById('cartPanel');
    if (panel && panel.classList.contains('open')) { const cartBtn = document.querySelector('[onclick*="toggleCart"]') || document.querySelector('#cartIcon'); if (cartBtn) cartBtn.focus(); }
    return;
  }
  let html = cart.map(x => `<div class="cart-item-row"><div class="ci-emoji">${escHtml(x.emoji || '')}</div><div class="ci-details"><div class="ci-name">${escHtml(x.name || '')}</div><div class="ci-price">${fmtEur(x.price * x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price * x.qty)}</span></div><div class="ci-qty"><button type="button" class="qty-btn" onclick="changeQty(${x.id},-1)">−</button><span class="qty-num">${x.qty}</span><button type="button" class="qty-btn" onclick="changeQty(${x.id},1)">+</button></div></div><button type="button" class="ci-remove" onclick="removeFromCart(${x.id})">×</button></div>`).join('');
  // Free shipping progress bar + delivery row
  const pct = Math.min(100, (total / FREE_SHIP_BGN) * 100);
  const deliveryRow = document.getElementById('cartDeliveryRow');
  const deliveryVal = document.getElementById('cartDeliveryVal');
  if (total >= FREE_SHIP_BGN) {
    html += `<div class="cart-ship-bar"><div class="cart-ship-msg ship-free">🎉 Имаш безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="transform:scaleX(1)"></div></div></div>`;
    if (deliveryRow) deliveryRow.style.display = 'none';
  } else {
    const remEur = ((FREE_SHIP_BGN - total) / EUR_RATE).toFixed(2);
    html += `<div class="cart-ship-bar"><div class="cart-ship-msg">Добави още <strong>${remEur} €</strong> за безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="transform:scaleX(${(pct / 100).toFixed(3)})"></div></div></div>`;
    if (deliveryRow) deliveryRow.style.display = 'flex';
    if (deliveryVal) deliveryVal.textContent = (5.99 / EUR_RATE).toFixed(2) + ' €';
  }
  // COD fee notice — always visible so no surprise at checkout
  html += `<div style="font-size:11px;color:var(--muted);padding:6px 10px;background:var(--bg2);border-radius:6px;margin-top:6px;">
    💳 Карта/превод — без такса &nbsp;|&nbsp; 📦 Наложен платеж — +0.77 €
  </div>`;
  // Promo code hint — show when no promo applied and subtotal ≥ 80 лв.
  if (!promoApplied && total >= Math.round(40 * EUR_RATE)) {
    html += `<div class="cart-promo-hint" onclick="handleCheckout()" title="Приложи при поръчка">
      🎁 Имаш промо код? <strong>MOSTCOMP10</strong> дава <strong>-10%</strong> от поръчката!
    </div>`;
  }
  // Recently viewed not in cart
  try {
    const rvIds = JSON.parse(localStorage.getItem('mc_rv') || '[]');
    const inCart = new Set(cart.map(x => x.id));
    const rvItems = rvIds.map(id => products.find(p => p.id === id)).filter(p => p && !inCart.has(p.id)).slice(0, 3);
    if (rvItems.length) {
      html += `<div class="cart-rv-section"><div class="cart-rv-title">Забрави ли нещо?</div><div class="cart-rv-list">${rvItems.map(p => `<div class="cart-rv-item"><div class="cart-rv-emoji">${escHtml(p.emoji || '')}</div><div class="cart-rv-info"><div class="cart-rv-name">${escHtml(p.name.length > 28 ? p.name.substring(0, 28) + '…' : p.name)}</div><div class="cart-rv-price">${fmtEur(p.price)}</div></div><button type="button" class="cart-rv-add" onclick="addToCart(${p.id})" title="Добави">+</button></div>`).join('')}</div></div>`;
    }
  } catch (e) { }
  body.innerHTML = html;
  // Sidebar upsell — show 2 products from cart categories not already in cart
  const upsellEl = document.getElementById('cartUpsell');
  if (upsellEl) {
    const inCart = new Set(cart.map(x => x.id));
    const cats = cart.map(x => x.cat);
    let upsellProds = products.filter(x => !inCart.has(x.id) && cats.includes(x.cat) && x.stock !== false).sort((a, b) => (b.rv || 0) - (a.rv || 0)).slice(0, 2);
    if (!upsellProds.length) upsellProds = products.filter(x => !inCart.has(x.id) && x.stock !== false).sort((a, b) => (b.rv || 0) - (a.rv || 0)).slice(0, 2);
    if (upsellProds.length) {
      upsellEl.style.display = '';
      upsellEl.innerHTML = `<div class="cart-upsell-title">⚡ Може да те заинтересува</div><div class="cart-upsell-items">${upsellProds.map(p => `<div class="cu-item"><div class="cu-emoji">${escHtml(p.emoji || '')}</div><div class="cu-info"><div class="cu-name">${escHtml(p.name.length > 30 ? p.name.substring(0, 30) + '…' : p.name)}</div><div class="cu-price">${fmtEur(p.price)}</div></div><button type="button" class="cu-add" onclick="addToCart(${p.id})" title="Добави в кошницата">+</button></div>`).join('')}</div>`;
    } else {
      upsellEl.style.display = 'none';
    }
  }
  // Sync cart page if open
  if (typeof renderCartPageSummary === 'function' && document.getElementById('cartPage')?.style.display !== 'none') { renderCartPageSummary(); }
}
function changeQty(id, d) { const i = cart.find(x => x.id === id); if (!i) return; i.qty += d; if (i.qty <= 0) cart = cart.filter(x => x.id !== id); updateCart(); saveCart(); }
function removeFromCart(id) {
  const removed = cart.find(x => x.id === id);
  cart = cart.filter(x => x.id !== id);
  updateCart(); saveCart();
  if (!removed) return;
  // Undo toast
  const t = document.getElementById('toast');
  if (!t) return;
  clearTimeout(t._timer);
  t.innerHTML = '';
  const _rSpan = document.createElement('span');
  _rSpan.textContent = removed.name.substring(0, 28) + '… премахнат. ';
  const _rBtn = document.createElement('button');
  _rBtn.type = 'button'; _rBtn.onclick = undoRemoveCart;
  _rBtn.style.cssText = 'margin-left:8px;background:rgba(255,255,255,0.25);border:none;border-radius:5px;padding:2px 8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;color:#fff;';
  _rBtn.textContent = 'Отмяна';
  t.appendChild(_rSpan); t.appendChild(_rBtn);
  t.classList.add('show');
  t._undoItem = removed;
  t._timer = setTimeout(() => { t.classList.remove('show'); t._undoItem = null; }, 4500);
}
function undoRemoveCart() {
  const t = document.getElementById('toast');
  if (!t || !t._undoItem) return;
  const item = t._undoItem;
  t._undoItem = null;
  clearTimeout(t._timer);
  t.classList.remove('show');
  const ex = cart.find(x => x.id === item.id);
  if (ex) { ex.qty += item.qty; } else { cart.push(item); }
  updateCart(); saveCart();
  showToast('✓ ' + item.name.substring(0, 28) + '… върнат в кошницата');
}
function toggleCart() { document.getElementById('cartOverlay').classList.toggle('open'); document.getElementById('cartPanel').classList.toggle('open'); }
// ===== CHECKOUT & THANK YOU =====
let ckDeliveryIdx = 0;
let ckDeliveryCosts = [5.99, 4.99, 0];
let ckDeliveryNames = ['Еконт', 'Еконт', 'Вземи от магазин'];
let ckPaymentType = 'card';
let promoApplied = false;

function handleCheckout() {
  if (cart.length === 0) { showToast('Добави продукти в кошницата!'); return; }
  // Pre-fill from logged-in user
  if (currentUser) {
    document.getElementById('ckFirst').value = currentUser.firstName || '';
    document.getElementById('ckLast').value = currentUser.lastName || '';
    document.getElementById('ckEmail').value = currentUser.email || '';
    document.getElementById('ckPhone').value = currentUser.phone || '';
  }
  // Restore saved address
  try {
    const sa = JSON.parse(localStorage.getItem('mc_saved_addr') || 'null');
    if (sa) {
      if (sa.phone && !document.getElementById('ckPhone').value) document.getElementById('ckPhone').value = sa.phone;
      if (sa.city) document.getElementById('ckCity').value = sa.city;
      if (sa.addr) document.getElementById('ckAddr').value = sa.addr;
      if (sa.zip) document.getElementById('ckZip').value = sa.zip;
    }
  } catch (e) { }
  renderOrderSummary();
  document.getElementById('checkoutPage').classList.add('open');
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = 'hidden';
  showCheckoutStep(1);
  // Clear previous validation states
  document.querySelectorAll('#checkoutPage .ck-input').forEach(el => el.classList.remove('error', 'valid'));
  // Populate estimated delivery dates
  const fmt = d => d.toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' });
  const now = new Date();
  const workDay = (d, n) => { let c = new Date(d); let added = 0; while (added < n) { c.setDate(c.getDate() + 1); if (c.getDay() !== 0 && c.getDay() !== 6) added++; } return c; };
  const d0 = document.getElementById('delivDate0'); if (d0) d0.textContent = '· до ' + fmt(workDay(now, 2));
  const d1 = document.getElementById('delivDate1'); if (d1) d1.textContent = '· до ' + fmt(workDay(now, 3));
  const d2 = document.getElementById('delivDate2'); if (d2) d2.textContent = '· готово днес';
}

function closeCheckoutPage() {
  document.getElementById('checkoutPage').classList.remove('open');
  document.body.style.overflow = '';
}

function renderOrderSummary() {
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const savings = cart.reduce((s, x) => s + (x.old ? (x.old - x.price) * x.qty : 0), 0);
  const delivery = ckDeliveryCosts[ckDeliveryIdx];
  const codFee = ckPaymentType === 'cod' ? 1.50 : 0;
  const promoDisc = promoApplied ? subtotal * ((promoDiscountPct || 10) / 100) : 0;
  const total = subtotal + delivery + codFee - promoDisc;

  document.getElementById('osSummaryItems').innerHTML = cart.map(x => `
    <div class="os-item">
      <div class="os-emoji">${escHtml(x.emoji || '')}</div>
      <div class="os-item-info">
        <div class="os-item-name">${escHtml(x.name || '')}</div>
        <div class="os-qty-ctrl">
          <button type="button" class="os-qty-btn" onclick="osChangeQty(${x.id},-1)">−</button>
          <span class="os-qty-num">${x.qty}</span>
          <button type="button" class="os-qty-btn" onclick="osChangeQty(${x.id},1)">+</button>
        </div>
      </div>
      <div class="os-item-price">${fmtEur(x.price * x.qty)}<span class="text-10-muted-block">${fmtBgn(x.price * x.qty)}</span></div>
    </div>`).join('');

  document.getElementById('osSubtotal').textContent = fmtEur(subtotal) + ' / ' + fmtBgn(subtotal);
  document.getElementById('osDelivery').textContent = delivery === 0 ? 'Безплатно' : fmtEur(delivery) + ' / ' + fmtBgn(delivery);
  document.getElementById('osTotal').textContent = fmtEur(total) + ' / ' + fmtBgn(total);

  const saveRow = document.getElementById('osSaveRow');
  if (savings > 0) { saveRow.style.display = ''; document.getElementById('osSave').textContent = '-' + fmtEur(savings) + ' / ' + fmtBgn(savings); }
  else saveRow.style.display = 'none';

  const promoRow = document.getElementById('osPromoRow');
  if (promoApplied) { promoRow.style.display = ''; document.getElementById('osPromoAmt').textContent = '-' + fmtEur(promoDisc) + ' / ' + fmtBgn(promoDisc); }
  else promoRow.style.display = 'none';
}

function selectCheckoutMode(mode) {
  const guestOpt = document.getElementById('ckModeGuest');
  const loginOpt = document.getElementById('ckModeLogin');
  const guestRadio = document.getElementById('ckModeGuestRadio');
  const loginRadio = document.getElementById('ckModeLoginRadio');
  if (mode === 'guest') {
    guestOpt?.classList.add('selected');
    loginOpt?.classList.remove('selected');
    guestRadio?.classList.add('checked');
    loginRadio?.classList.remove('checked');
    guestOpt?.setAttribute('aria-checked', 'true');
    loginOpt?.setAttribute('aria-checked', 'false');
  } else {
    loginOpt?.classList.add('selected');
    guestOpt?.classList.remove('selected');
    loginRadio?.classList.add('checked');
    guestRadio?.classList.remove('checked');
    loginOpt?.setAttribute('aria-checked', 'true');
    guestOpt?.setAttribute('aria-checked', 'false');
    if (typeof openAuthModal === 'function') openAuthModal('login');
  }
}

function osChangeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCart();
  saveCart();
  renderOrderSummary();
}

function selectDeliveryCk(el, idx) {
  document.querySelectorAll('#checkoutPage .delivery-opt').forEach(o => {
    o.classList.remove('selected');
    o.setAttribute('aria-checked', 'false');
    o.setAttribute('tabindex', '-1');
  });
  el.classList.add('selected');
  el.setAttribute('aria-checked', 'true');
  el.setAttribute('tabindex', '0');
  ckDeliveryIdx = idx;
  renderOrderSummary();
  // Show/hide Econt office field and address section based on delivery type
  const officeRow = document.getElementById('ckEcontOfficeRow');
  const addrSection = document.getElementById('ckAddressSection');
  const isPickup = idx === 2;
  if (officeRow) officeRow.style.display = isPickup ? 'none' : '';
  if (addrSection) addrSection.style.display = isPickup ? 'none' : '';
}

function selectPayment(el, type) {
  document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  ckPaymentType = type;
  document.getElementById('cardFields').classList.toggle('show', type === 'card');
  renderOrderSummary();
}

function formatCardNum(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
  el.value = v;
}

let promoDiscountPct = 10; // set by applyPromo based on matched code

function applyPromo(codeArg) {
  const inputEl = document.getElementById('promoInput');
  const code = (codeArg || (inputEl ? inputEl.value : '')).trim().toUpperCase();

  // Load admin-managed codes from localStorage, fallback to built-in
  let codes = [{ code: 'MOSTCOMP10', discount: 10, active: true }];
  try {
    const stored = JSON.parse(localStorage.getItem('mc_promo_codes') || '[]');
    if (stored.length) codes = stored;
  } catch (e) { }

  const match = codes.find(c => c.code === code && c.active !== false);
  if (match) {
    promoApplied = true;
    promoDiscountPct = match.discount || 10;
    // Increment use counter
    try {
      const stored = JSON.parse(localStorage.getItem('mc_promo_codes') || '[]');
      const mc = stored.find(c => c.code === code);
      if (mc) { mc.uses = (mc.uses || 0) + 1; localStorage.setItem('mc_promo_codes', JSON.stringify(stored)); }
    } catch (e) { }
    if (inputEl) { document.getElementById('promoOk').classList.add('show'); inputEl.disabled = true; }
    renderOrderSummary();
    showToast(`✓ Промо код приложен — -${promoDiscountPct}%!`);
  } else {
    showToast('Невалиден промо код!');
    if (inputEl) { inputEl.classList.add('error'); setTimeout(() => inputEl.classList.remove('error'), 1500); }
  }
}

function showCheckoutStep(n) {
  [1, 2, 3].forEach(i => {
    const card = document.getElementById('ck-step' + i);
    if (card) card.style.display = i === n ? '' : 'none';
  });
  updateCheckoutSteps(n);
  const page = document.getElementById('checkoutPage');
  if (page) page.scrollTo({ top: 0, behavior: 'smooth' });
  // Auto-focus first empty required input in the new step
  setTimeout(() => {
    const card = document.getElementById('ck-step' + n);
    if (!card) return;
    const inputs = card.querySelectorAll('input.ck-input:not([disabled])');
    const firstEmpty = Array.from(inputs).find(el => !el.value.trim() && el.offsetParent !== null);
    if (firstEmpty) firstEmpty.focus();
  }, 120);
}

function ckNextStep(current) {
  if (!validateCkStep(current)) return;
  showCheckoutStep(current + 1);
}

function validateCkStep(step) {
  if (step === 1) {
    let valid = true;
    ['ckFirst', 'ckLast'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid', 'true'); valid = false; }
      else if (el) el.setAttribute('aria-invalid', 'false');
    });
    const email = document.getElementById('ckEmail');
    if (email && (!email.value.trim() || !email.value.includes('@'))) {
      email.classList.add('error'); email.classList.remove('valid'); email.setAttribute('aria-invalid', 'true'); valid = false;
    } else if (email) { email.setAttribute('aria-invalid', 'false'); }
    const phone = document.getElementById('ckPhone');
    if (phone) { ckValidatePhone(phone); if (phone.classList.contains('error')) valid = false; }
    if (!valid) showToast('⚠️ Попълни всички задължителни полета!');
    return valid;
  }
  if (step === 2) {
    let valid = true;
    if (ckDeliveryIdx === 2) return true; // pickup — no address needed
    // Validate Econt office if Econt selected
    const officeEl = document.getElementById('ckEcontOffice');
    if (officeEl && !officeEl.classList.contains('is-hidden')) {
      if (!officeEl.value.trim()) { officeEl.classList.add('error'); officeEl.classList.remove('valid'); officeEl.setAttribute('aria-invalid', 'true'); valid = false; }
      else { officeEl.classList.remove('error'); officeEl.classList.add('valid'); officeEl.setAttribute('aria-invalid', 'false'); }
    }
    ['ckCity', 'ckAddr'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid', 'true'); valid = false; }
      else if (el) { el.classList.remove('error'); el.setAttribute('aria-invalid', 'false'); }
    });
    if (!valid) showToast('⚠️ Попълни адреса за доставка!');
    return valid;
  }
  return true;
}

function _ckSetError(el, msg) {
  const errEl = el.id ? document.getElementById(el.id + '-err') : null;
  if (errEl) errEl.textContent = msg || '';
}

function ckValidateField(el) {
  if (!el.value.trim()) {
    el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid', 'true');
    _ckSetError(el, 'Полето е задължително.');
  } else {
    el.classList.remove('error'); el.classList.add('valid'); el.setAttribute('aria-invalid', 'false');
    _ckSetError(el, '');
  }
}

function ckValidateEmail(el) {
  const ok = el.value.trim() && el.value.includes('@') && el.value.includes('.');
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', !!ok);
  el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  _ckSetError(el, ok ? '' : 'Въведи валиден имейл адрес.');
}

// BG phone: 08xx, 09xx, +359 8xx, 00359 8xx — at least 10 digits
function ckValidatePhone(el) {
  const raw = el.value.replace(/[\s\-().]/g, '');
  const ok = /^(\+359|00359|0)[89]\d{8}$/.test(raw) || /^[1-9]\d{9,}$/.test(raw);
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', ok);
  el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  _ckSetError(el, ok ? '' : 'Въведи валиден телефон (напр. 0888 123 456).');
}

// Auto-format phone as user types: 0888 123 456
function ckFormatPhone(el) {
  let v = el.value.replace(/[^\d+]/g, '');
  if (v.startsWith('+')) {
    // keep international prefix as-is
  } else if (v.length > 4) {
    v = v.substring(0, 4) + ' ' + v.substring(4, 7) + (v.length > 7 ? ' ' + v.substring(7, 11) : '');
  }
  el.value = v;
}

function updateCheckoutSteps(active) {
  [1, 2, 3].forEach(n => {
    const step = document.getElementById('cs' + n);
    const num = document.getElementById('csn' + n);
    if (!step) return;
    step.classList.remove('active', 'done');
    if (n < active) {
      step.classList.add('done');
      if (num) num.textContent = '✓';
      step.style.cursor = 'pointer';
      step.onclick = () => showCheckoutStep(n);
    } else if (n === active) {
      step.classList.add('active');
      step.style.cursor = '';
      step.onclick = null;
    } else {
      if (num) num.textContent = n;
      step.style.cursor = '';
      step.onclick = null;
    }
  });
}

function submitOrder() {
  // Validate required fields — skip city/address for pickup (ckDeliveryIdx === 2)
  const isPickup = ckDeliveryIdx === 2;
  const required = [
    ['ckFirst', 'Ime'], ['ckLast', 'Familiya'], ['ckEmail', 'Email'], ['ckPhone', 'Telefon'],
    ...(!isPickup ? [['ckCity', 'Grad'], ['ckAddr', 'Adres']] : [])
  ];
  let valid = true;
  required.forEach(([id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) { el.classList.add('error'); el.setAttribute('aria-invalid', 'true'); valid = false; }
    else { el.classList.remove('error'); el.setAttribute('aria-invalid', 'false'); }
  });
  if (ckPaymentType === 'card') {
    ['ckCardNum', 'ckCardName', 'ckCardExp', 'ckCardCvv'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) { el.classList.add('error'); el.setAttribute('aria-invalid', 'true'); valid = false; }
      else { el.classList.remove('error'); el.setAttribute('aria-invalid', 'false'); }
    });
  }
  if (!valid) { showToast('Моля попълни всички задължителни полета!'); return; }

  // Loading state
  const submitBtn = document.querySelector('.os-submit');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span class="ck-spinner"></span> Обработва се…'; }

  // Animate steps
  updateCheckoutSteps(2);
  setTimeout(() => updateCheckoutSteps(3), 400);
  setTimeout(() => {
    // Build order data — sequential number based on existing order count
    let _prevOrders = [];
    try { _prevOrders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) { }
    const orderNum = 'MC-' + String(_prevOrders.length + 1).padStart(6, '0');
    const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const delivery = ckDeliveryCosts[ckDeliveryIdx];
    const codFee = ckPaymentType === 'cod' ? 1.50 : 0;
    const promoDisc = promoApplied ? subtotal * ((promoDiscountPct || 10) / 100) : 0;
    const total = subtotal + delivery + codFee - promoDisc;
    const payNames = { card: 'Карта', cod: 'Наложен платеж', bank: 'Банков превод' };
    const now = new Date();
    const delivDays = ckDeliveryIdx === 2 ? 0 : ckDeliveryIdx === 1 ? 3 : 2;
    const _addWorkDays = (d, n) => { let c = new Date(d); let added = 0; while (added < n) { c.setDate(c.getDate() + 1); if (c.getDay() !== 0 && c.getDay() !== 6) added++; } return c; };
    const delivDate = delivDays > 0 ? _addWorkDays(now, delivDays) : now;
    const fmt = d => d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' });

    // Populate thank-you page
    const _set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const _setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
    _set('tyOrderNum', orderNum);
    _set('tyEmail', document.getElementById('ckEmail').value);
    _set('tyDeliveryDate', ckDeliveryIdx === 2 ? 'При вземане от магазин' : fmt(delivDate));
    _set('tyPayment', payNames[ckPaymentType]);
    _set('tyName', document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value);
    _set('tyPhone', document.getElementById('ckPhone').value);
    const _isPickup = ckDeliveryIdx === 2;
    const _econtOffice = (document.getElementById('ckEcontOffice') || {}).value || '';
    _set('tyCity', _isPickup ? 'София (магазин)' : document.getElementById('ckCity').value);
    _set('tyAddr', _isPickup ? 'бул. „Шипченски проход" бл.240' : (_econtOffice ? 'Офис: ' + _econtOffice + ', ' : '') + document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''));
    _set('tyCourier', ckDeliveryNames[ckDeliveryIdx]);
    _set('tyNote', document.getElementById('ckNote').value || '—');
    _set('tyTimestamp', now.toLocaleString('bg-BG'));
    _set('tyDeliveryDateLine', ckDeliveryIdx === 2 ? 'Готова за вземане' : 'Очаквана: ' + fmt(delivDate));
    _set('tySubtotal', fmtEur(subtotal) + ' / ' + fmtBgn(subtotal));
    _set('tyDeliveryCost', delivery === 0 ? 'Безплатно' : fmtEur(delivery) + ' / ' + fmtBgn(delivery));
    _set('tyTotal', fmtEur(total) + ' / ' + fmtBgn(total));
    if (promoApplied) {
      const tyPromoRow = document.getElementById('tyPromoRow'); if (tyPromoRow) tyPromoRow.style.display = '';
      _set('tyPromoAmt', '-' + fmtEur(promoDisc) + ' / ' + fmtBgn(promoDisc));
    }
    _setHTML('tyItems', cart.map(x => `
      <div class="ty-item">
        <div class="ty-item-emoji">${escHtml(x.emoji || '')}</div>
        <div class="ty-item-info">
          <div class="ty-item-name">${escHtml(x.name || '')}</div>
          <div class="ty-item-meta">${escHtml(x.brand || '')} · Количество: ${Number(x.qty) || 0}</div>
        </div>
        <div class="ty-item-price">${fmtEur(x.price * x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price * x.qty)}</span></div>
      </div>`).join(''));

    // Save order to localStorage
    const orderData = {
      num: orderNum,
      customer: document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value,
      email: document.getElementById('ckEmail').value,
      phone: document.getElementById('ckPhone').value,
      city: _isPickup ? 'София (магазин)' : document.getElementById('ckCity').value,
      addr: _isPickup ? 'бул. „Шипченски проход" бл.240' : (_econtOffice ? 'Офис: ' + _econtOffice + ', ' : '') + document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''),
      note: document.getElementById('ckNote').value || '',
      items: cart.map(x => x.name + ' ×' + x.qty).join(', '),
      itemsData: cart.map(x => ({ id: x.id, name: x.name, brand: x.brand, emoji: x.emoji, price: x.price, qty: x.qty })),
      subtotal, delivery, total,
      payment: ckPaymentType,
      deliveryType: ckDeliveryNames[ckDeliveryIdx],
      status: 'pending',
      date: now.toLocaleDateString('bg-BG'),
      ts: now.getTime(),
      b2b: (document.getElementById('ckIsB2B') || {}).checked ? {
        firma: (document.getElementById('ckFirma') || {}).value || '',
        eik:   (document.getElementById('ckEIK')   || {}).value || '',
        vat:   (document.getElementById('ckVAT')   || {}).value || '',
        mol:   (document.getElementById('ckMOL')   || {}).value || '',
      } : null
    };
    try {
      _prevOrders.unshift(orderData);
      localStorage.setItem('mc_orders', JSON.stringify(_prevOrders.slice(0, 200)));
    } catch (e) { }
    // Записване в Supabase (реална база данни)
    if (typeof saveOrderToSupabase === 'function') {
      saveOrderToSupabase(orderData).catch(e => console.error('Supabase save failed:', e));
    }
    // Save address for next order
    try {
      localStorage.setItem('mc_saved_addr', JSON.stringify({
        phone: document.getElementById('ckPhone').value,
        city: document.getElementById('ckCity').value,
        addr: document.getElementById('ckAddr').value,
        zip: document.getElementById('ckZip').value,
      }));
    } catch (e) { }

    // Show thank-you page, clear cart
    closeCheckoutPage();
    document.getElementById('thankyouPage').classList.add('open');
    cart = [];
    updateCart(); saveCart();
    promoApplied = false;
  }, 800);
}

function closeThankyouPage() {
  document.getElementById('thankyouPage').classList.remove('open');
  document.body.style.overflow = '';
}

function printInvoice(num) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) { }
  const o = num ? orders.find(x => x.num === num) : orders[0];
  if (!o) { showToast('⚠️ Няма данни за поръчката'); return; }

  const subtotalNoVat = (o.subtotal / 1.2).toFixed(2);
  const vatAmt = (o.subtotal - subtotalNoVat).toFixed(2);
  const invNum = 'ФК-' + o.num.replace('MC-', '');
  const date = new Date(o.ts || Date.now()).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const payLabel = o.payment === 'card' ? 'Банкова карта' : o.payment === 'cod' ? 'Наложен платеж' : 'Банков превод';
  const delivLabel = o.delivery === 0 ? 'Безплатна' : (Number(o.delivery) / EUR_RATE).toFixed(2) + ' €';

  const rows = (o.itemsData || []).map((x, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escHtml(x.name||'')}</td>
      <td style="text-align:center">${x.qty}</td>
      <td style="text-align:right">${toEur(x.price / 1.2).toFixed(2)} €</td>
      <td style="text-align:right">20%</td>
      <td style="text-align:right">${toEur(x.price * x.qty).toFixed(2)} €</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="UTF-8">
<title>Фактура ${invNum} — Most Computers</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#1a1a1a;padding:40px;max-width:820px;margin:auto}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #bd1105}
  .hdr-logo{font-size:22px;font-weight:900;color:#bd1105;letter-spacing:-0.5px}
  .hdr-logo span{color:#1a1a1a}
  .hdr-company{font-size:11px;color:#555;line-height:1.7;margin-top:4px}
  .hdr-right{text-align:right}
  .hdr-right h1{font-size:30px;font-weight:900;letter-spacing:-1px;color:#1a1a1a}
  .hdr-right .meta{font-size:11px;color:#555;margin-top:4px;line-height:1.7}
  .parties{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
  .party{background:#f8f9fa;border-radius:8px;padding:14px 16px;border-left:3px solid #bd1105}
  .party-lbl{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#bd1105;margin-bottom:6px}
  .party-val{font-size:12px;line-height:1.8;color:#1a1a1a}
  table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11.5px}
  thead tr{background:#1a1a1a;color:#fff}
  th{padding:8px 10px;text-align:left;font-weight:700;font-size:11px}
  td{padding:7px 10px;border-bottom:1px solid #e5e7eb}
  tr:nth-child(even) td{background:#f9fafb}
  .totals-wrap{display:flex;justify-content:flex-end;margin-bottom:24px}
  .totals{width:300px}
  .tot-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #e5e7eb;font-size:12px}
  .tot-row.vat{color:#555}
  .tot-row.final{font-weight:800;font-size:15px;border-top:2px solid #1a1a1a;border-bottom:none;padding-top:10px;margin-top:4px;color:#bd1105}
  .payment-info{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;font-size:11.5px;margin-bottom:32px;color:#166534}
  .legal{font-size:10px;color:#9ca3af;text-align:center;margin-top:24px;line-height:1.6;border-top:1px solid #e5e7eb;padding-top:12px}
  @media print{body{padding:20px}@page{margin:1.5cm}}
</style>
</head>
<body>

<div class="hdr">
  <div>
    <div class="hdr-logo">Most <span>Computers</span></div>
    <div class="hdr-company">
      Most Computers ЕООД &nbsp;|&nbsp; ЕИК: 203000000<br>
      ДДС №: BG203000000<br>
      бул. „Шипченски проход" бл.240, 1111 София<br>
      тел.: +359 2 919 1823 &nbsp;|&nbsp; office@mostcomputers.bg
    </div>
  </div>
  <div class="hdr-right">
    <h1>ФАКТУРА</h1>
    <div class="meta">
      № ${invNum}<br>
      Дата: ${date}<br>
      Поръчка: ${o.num}
    </div>
  </div>
</div>

<div class="parties">
  <div class="party">
    <div class="party-lbl">Продавач</div>
    <div class="party-val">
      <strong>Most Computers ЕООД</strong><br>
      ЕИК: 203000000<br>
      ДДС №: BG203000000<br>
      бул. „Шипченски проход" бл.240<br>
      1111 София, България
    </div>
  </div>
  <div class="party">
    <div class="party-lbl">${o.b2b ? 'Купувач (фирма)' : 'Клиент / Получател'}</div>
    <div class="party-val">
      ${o.b2b ? `<strong>${o.b2b.firma || '—'}</strong><br>ЕИК: ${o.b2b.eik || '—'}<br>${o.b2b.vat ? 'ДДС №: ' + o.b2b.vat + '<br>' : ''}${o.b2b.mol ? 'МОЛ: ' + o.b2b.mol + '<br>' : ''}` : `<strong>${o.customer || '—'}</strong><br>`}
      ${o.addr ? o.addr + '<br>' : ''}
      ${o.city || ''}<br>
      тел.: ${o.phone || '—'}
    </div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th style="width:28px">№</th>
      <th>Описание на стоката / услугата</th>
      <th style="width:42px;text-align:center">Бр.</th>
      <th style="width:110px;text-align:right">Ед.цена без ДДС</th>
      <th style="width:60px;text-align:right">ДДС %</th>
      <th style="width:110px;text-align:right">Сума с ДДС</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
    <tr>
      <td colspan="5" style="text-align:right;font-size:11px;color:#555">Доставка (${o.deliveryType || 'Куриер'})</td>
      <td style="text-align:right">${delivLabel}</td>
    </tr>
  </tbody>
</table>

<div class="totals-wrap">
  <div class="totals">
    <div class="tot-row"><span>Данъчна основа (без ДДС):</span><span>${(Number(subtotalNoVat)/EUR_RATE).toFixed(2)} €</span></div>
    <div class="tot-row vat"><span>ДДС 20%:</span><span>${(Number(vatAmt)/EUR_RATE).toFixed(2)} €</span></div>
    <div class="tot-row"><span>Доставка:</span><span>${delivLabel}</span></div>
    <div class="tot-row final"><span>ОБЩО ДЪЛЖИМО:</span><span>${(Number(o.total)/EUR_RATE).toFixed(2)} €</span></div>
  </div>
</div>

<div class="payment-info">
  ✅ Начин на плащане: <strong>${payLabel}</strong>
  ${o.payment === 'bank' ? ' &nbsp;|&nbsp; IBAN: BG…  BIC: …  Most Computers ЕООД' : ''}
  &nbsp;|&nbsp; Плащането е извършено.
</div>

<div class="legal">
  Фактурата е издадена на ${date} от Most Computers ЕООД — регистрирано по ЗДДС лице.<br>
  Валидна е без подпис и печат по чл. 6, ал. 1 от Наредба № Н-18 / 13.12.2006 г.
</div>

</body>
</html>`;

  const w = window.open('', '_blank', 'width=860,height=950,scrollbars=yes');
  if (!w) { showToast('⚠️ Разреши pop-up прозорците в браузъра'); return; }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
}

function toggleB2BFields(cb) {
  const el = document.getElementById('ckB2BFields');
  if (el) el.style.display = cb.checked ? '' : 'none';
}

// MOBILE MENU
function toggleMobMenu() {
  const overlay = document.getElementById('mobOverlay');
  const drawer = document.getElementById('mobDrawer');
  const isOpen = drawer.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMobMenu() {
  document.getElementById('mobOverlay').classList.remove('open');
  document.getElementById('mobDrawer').classList.remove('open');
  document.body.style.overflow = '';
}
function handleMobSearch() {
  const q = document.getElementById('mobSearchInput').value.trim();
  if (q) {
    document.getElementById('searchInput').value = q;
    toggleMobMenu();
    showSearchResultsPage(q);
  }
}

// ===== CART PAGE =====
function openCartPage() {
  // Close drawer if open
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');

  renderCartPage();
  const page = document.getElementById('cartPage');
  if (page) { page.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeCartPage() {
  const page = document.getElementById('cartPage');
  if (page) { page.style.display = 'none'; }
  document.body.style.overflow = '';
}

function renderCartPage() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const countEl = document.getElementById('cpItemCount');
  if (countEl) countEl.textContent = count + ' бр.';

  const itemsEl = document.getElementById('cpItems');
  const emptyEl = document.getElementById('cpEmpty');
  const promoRow = document.getElementById('cpPromoRow');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (promoRow) promoRow.style.display = 'none';
    renderCartPageSummary();
    renderCartPageUpsell();
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (promoRow) promoRow.style.display = '';

  itemsEl.innerHTML = cart.map(x => {
    const save = x.old ? Math.round(((x.old - x.price) / x.old) * 100) : 0;
    const badgeHtml = x.badge === 'sale'
      ? `<span class="cp-badge cp-badge-sale">Промо -${save}%</span>`
      : x.badge === 'new' ? `<span class="cp-badge cp-badge-new">Ново</span>`
        : x.badge === 'hot' ? `<span class="cp-badge cp-badge-hot">Горещо</span>` : '';

    const imgHtml = x.img
      ? `<img src="${x.img}" alt="${x.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="cp-item-emoji is-hidden">${x.emoji}</span>`
      : `<span class="cp-item-emoji">${x.emoji}</span>`;

    return `<div class="cp-card">
      <div class="cp-item-thumb">${imgHtml}</div>
      <div class="cp-item-info">
        <div class="cp-item-brand">${x.brand}</div>
        <div class="cp-item-name">${x.name}</div>
        <div class="cp-item-sku">${x.sku || ''}</div>
        <div class="cp-item-badges">${badgeHtml}</div>
      </div>
      <div class="cp-item-right">
        <div class="cp-item-prices">
          ${x.old ? `<div class="cp-item-old">${fmtEur(x.old)}</div>` : ''}
          <div class="cp-item-price">${fmtEur(x.price * x.qty)}</div>
          <div class="cp-item-bgn">${fmtBgn(x.price * x.qty)}</div>
        </div>
        <div class="cp-qty-wrap">
          <button class="cp-qty-btn" onclick="cpChangeQty(${x.id},-1)">−</button>
          <span class="cp-qty-val">${x.qty}</span>
          <button class="cp-qty-btn" onclick="cpChangeQty(${x.id},1)">+</button>
        </div>
        <button class="cp-remove-btn" onclick="cpRemoveItem(${x.id})" title="Премахни">×</button>
      </div>
    </div>`;
  }).join('');

  renderCartPageSummary();
  renderCartPageUpsell();
}

function renderCartPageSummary() {
  const el = document.getElementById('cpSummary');
  if (!el) return;
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const savings = cart.reduce((s, x) => s + (x.old ? (x.old - x.price) * x.qty : 0), 0);
  const delivery = subtotal >= FREE_SHIP_BGN ? 0 : Math.round(9.99 * EUR_RATE * 100) / 100;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px 0;font-size:13px;">Добави продукти в кошницата</div>';
    return;
  }

  el.innerHTML = `
    <div class="cp-sum-row"><span>Продукти (${cart.reduce((s, x) => s + x.qty, 0)} бр.)</span><span>${fmtEur(subtotal)}<small>${fmtBgn(subtotal)}</small></span></div>
    ${savings > 0 ? `<div class="cp-sum-row cp-sum-save"><span>✓ Спестяваш</span><span>−${fmtEur(savings)}</span></div>` : ''}
    <div class="cp-sum-row"><span>Доставка</span><span>${delivery === 0 ? '<b style="color:var(--accent2)">Безплатна</b>' : fmtEur(delivery)}</span></div>
    <div class="cp-sum-row"><span>ДДС (вкл.)</span><span>${fmtEur(total * 0.2)}</span></div>
    <hr class="cp-sum-divider">
    <div class="cp-sum-row cp-sum-total"><span>Общо</span><span>${fmtEur(total)}<small>${fmtBgn(total)}</small></span></div>
    ${subtotal < FREE_SHIP_BGN ? `<div class="cp-ship-hint">Добави още <b>${fmtEur(FREE_SHIP_BGN - subtotal)}</b> за безплатна доставка</div>` : ''}`;
}

function renderCartPageUpsell() {
  const el = document.getElementById('cpUpsell');
  if (!el) return;
  const inCart = new Set(cart.map(x => x.id));
  const cats = cart.map(x => x.cat);
  let recs = products.filter(p => !inCart.has(p.id) && cats.includes(p.cat)).slice(0, 3);
  if (recs.length < 2) recs = products.filter(p => !inCart.has(p.id)).slice(0, 3);
  if (!recs.length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="cp-upsell-header">⚡ Може да те заинтересува</div>
    ${recs.map(p => `
      <div class="cp-upsell-item" onclick="openProductPage(${p.id});closeCartPage()">
        <div class="cp-upsell-emoji">${p.emoji}</div>
        <div class="cp-upsell-info">
          <div class="cp-upsell-name">${p.name.length > 40 ? p.name.substring(0, 40) + '…' : p.name}</div>
          <div class="cp-upsell-price">${fmtEur(p.price)} / ${fmtBgn(p.price)}</div>
        </div>
        <button class="cp-upsell-add" onclick="event.stopPropagation();cpAddUpsell(${p.id})">+ Добави</button>
      </div>`).join('')}`;
}

function cpChangeQty(id, d) {
  changeQty(id, d);
  renderCartPage();
}

function cpRemoveItem(id) {
  removeFromCart(id);
  renderCartPage();
}

function cpAddUpsell(id) {
  addToCart(id);
  renderCartPage();
}

function cpClearCart() {
  if (!cart.length) return;
  if (!confirm('Изчисти цялата кошница?')) return;
  cart = [];
  updateCart(); saveCart();
  renderCartPage();
}

function cpApplyPromo() {
  const input = document.getElementById('cpPromoInput');
  if (!input || !input.value.trim()) return;
  applyPromo(input.value.trim());
}

function cpGoCheckout() {
  closeCartPage();
  handleCheckout();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addToCart, removeFromCart, changeQty,
    applyPromo, renderOrderSummary, formatCardNum, formatExpiry,
    _resetCheckout: () => { ckDeliveryIdx = 0; ckPaymentType = 'card'; promoApplied = false; },
    _setDelivery: (idx) => { ckDeliveryIdx = idx; },
    _setPayment: (type) => { ckPaymentType = type; },
  };
}

// ===== LIVE SEARCH SYSTEM =====
let recentSearches = [];
try { recentSearches = JSON.parse(localStorage.getItem('mc_recent') || '[]'); } catch(e) { localStorage.removeItem('mc_recent'); }
let searchFocusIdx = -1;
let searchDebounce = null;
let _srpQuery = ''; // current SRP query — never embed user input in HTML attributes

const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const searchBar = document.getElementById('searchBar');

function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function normStr(s) {
  return String(s).toLowerCase()
    .replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
    .replace(/[òóôõö]/g,'o').replace(/[ùúûü]/g,'u').replace(/[ñ]/g,'n');
}

// Levenshtein distance for fuzzy matching
function _levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i-1] === b[j-1] ? row[j-1] : 1 + Math.min(row[j-1], row[j], prev);
      row[j-1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

// Check if query token fuzzy-matches any word in text (1 typo tolerance per 4 chars)
function _fuzzyTokenMatch(token, text) {
  const maxDist = token.length <= 4 ? 1 : token.length <= 7 ? 1 : 2;
  const words = text.split(/\s+/);
  return words.some(w => {
    if (w.length < token.length - maxDist) return false;
    if (w.includes(token)) return true;
    return _levenshtein(token, w.substring(0, token.length + maxDist)) <= maxDist;
  });
}

function matchesQuery(p, q) {
  try {
    const ql = q.toLowerCase();
    // EAN exact (numeric only)
    if (/^\d{8,14}$/.test(q)) return !!(p.ean && p.ean.includes(q));
    // Original field-by-field includes (preserves all existing behaviour)
    const basic =
      p.name.toLowerCase().includes(ql) ||
      p.brand.toLowerCase().includes(ql) ||
      (p.sku  && p.sku.toLowerCase().includes(ql)) ||
      (p.ean  && p.ean.includes(q)) ||
      (p.desc && p.desc.toLowerCase().includes(ql)) ||
      Object.values(p.specs||{}).some(v => String(v).toLowerCase().includes(ql));
    if (basic) return true;
    // Multi-word fallback: all words must appear across all fields combined
    const allFields = normStr([
      p.name, p.brand, p.sku||'', p.ean||'', p.desc||'',
      ...Object.values(p.specs||{})
    ].join(' '));
    if (q.includes(' ')) {
      if (q.split(/\s+/).filter(Boolean).every(w => allFields.includes(normStr(w)))) return true;
    }
    // Fuzzy fallback: each query token must fuzzy-match something in allFields
    if (q.length >= 3) {
      const tokens = normStr(q).split(/\s+/).filter(t => t.length >= 3);
      if (tokens.length > 0 && tokens.every(t => _fuzzyTokenMatch(t, allFields))) return true;
    }
    return false;
  } catch(e) { return false; }
}

function searchProducts(query, cat) {
  const q = query.trim();
  if (!q) return [];
  const catFilter = cat && cat !== 'all' ? cat : '';
  return products.filter(p => (!catFilter || normalizeCat(p.cat) === catFilter) && matchesQuery(p, q));
}

// Detect if query looks like SKU or EAN
function queryType(q) {
  if (/^\d{8,14}$/.test(q.trim())) return 'ean';
  if (/^mc-/i.test(q.trim())) return 'sku';
  return 'text';
}

function renderDropdown(query) {
  if (!searchDropdown || !searchBar) return;
  const cat = '';
  const results = searchProducts(query, cat);
  const q = query.trim();
  const qtype = queryType(q);

  if (!q) {
    // Show recent searches + hint chips
    const hints = recentSearches.length === 0
      ? `<div class="sd-section-title">💡 Можеш да търсиш по</div>
         <div class="sd-recent">
           <div class="sd-recent-chip" onclick="void(0)">📝 Име / марка</div>
           <div class="sd-recent-chip" onclick="void(0)">🔖 SKU (напр. MC-SONY-WH1000XM6)</div>
           <div class="sd-recent-chip" onclick="void(0)">📦 EAN баркод (13 цифри)</div>
         </div>`
      : `<div class="sd-section-title">🕐 Последни търсения</div>
         <div class="sd-recent">
           ${recentSearches.map((s,i) => `
             <div class="sd-recent-chip" data-recent-search="${escHtml(s)}">
               🔍 ${escHtml(s)}
               <button type="button" class="sd-recent-remove" onclick="removeRecent(event,${i})">×</button>
             </div>`).join('')}
         </div>
         <div class="sd-section-title">💡 Търси и по</div>
         <div class="sd-recent">
           <div class="sd-recent-chip cursor-default">🔖 SKU код</div>
           <div class="sd-recent-chip cursor-default">📦 EAN баркод</div>
         </div>`;
    searchDropdown.innerHTML = hints;
    searchDropdown.classList.add('open');
    searchBar.classList.add('active');
    return;
  }

  if (results.length === 0) {
    let hint = '';
    if (qtype === 'ean') hint = '<div class="sd-empty-sub">Търсенето по EAN не намери продукт с баркод <strong>' + escHtml(q) + '</strong></div>';
    else if (qtype === 'sku') hint = '<div class="sd-empty-sub">Търсенето по SKU не намери продукт с код <strong>' + escHtml(q) + '</strong></div>';
    else hint = '<div class="sd-empty-sub">Провери правописа или опитай с SKU / EAN баркод</div>';
    searchDropdown.innerHTML = `
      <div class="sd-empty">
        <div class="sd-empty-icon">🔍</div>
        <div class="sd-empty-text">Няма резултати за "<strong>${escHtml(q)}</strong>"</div>
        ${hint}
      </div>`;
    searchDropdown.classList.add('open');
    searchBar.classList.add('active');
    return;
  }

  const shown = results.slice(0, 6);
  // Section title differs by query type
  const sectionTitle = qtype === 'ean'
    ? `📦 EAN резултат (${results.length})`
    : qtype === 'sku'
    ? `🔖 SKU резултат (${results.length})`
    : `🛍 Продукти (${results.length})`;

  searchDropdown.innerHTML = `
    <div class="sd-section-title">${sectionTitle}</div>
    ${shown.map((p, i) => {
      const save = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : 0;
      let badgeHtml = '';
      if (p.badge === 'sale') badgeHtml = `<span class="sd-badge-small sd-badge-sale">-${save}%</span>`;
      else if (p.badge === 'new') badgeHtml = `<span class="sd-badge-small sd-badge-new">Ново</span>`;
      else if (p.badge === 'hot') badgeHtml = `<span class="sd-badge-small sd-badge-hot">Горещо</span>`;
      // Highlight SKU/EAN if that's what matched
      const skuMatch = p.sku && p.sku.toLowerCase().includes(q.toLowerCase());
      const eanMatch = p.ean && p.ean.includes(q);
      const extraMeta = skuMatch
        ? `<span class="text-primary-strong">🔖 ${highlightMatch(p.sku, q)}</span>`
        : eanMatch
        ? `<span class="text-primary-strong">📦 EAN: ${highlightMatch(p.ean, q)}</span>`
        : `<span>SKU: ${p.sku}</span>`;
      return `
        <div class="sd-result" data-idx="${i}" onclick="selectSearchResult(${p.id})">
          <div class="sd-emoji">${p.emoji}</div>
          <div class="sd-info">
            <div class="sd-name">${highlightMatch(escHtml(p.name), q)}</div>
            <div class="sd-meta">
              <span class="sd-brand">${escHtml(p.brand)}</span>
              ${extraMeta}
            </div>
          </div>
          ${badgeHtml}
          <div class="sd-price">${fmtEur(p.price)}<span class="text-10-muted-block">${fmtBgn(p.price)}</span></div>
        </div>`;
    }).join('')}
    ${results.length > 6 ? `
      <div class="sd-footer">
        <span class="sd-footer-count">Показани ${shown.length} от ${results.length}</span>
        <button type="button" class="sd-footer-btn" onclick="doFullSearch()">Виж всички резултати →</button>
      </div>` : ''}`;
  searchDropdown.classList.add('open');
  searchBar.classList.add('active');
  searchFocusIdx = -1;
}

function selectSearchResult(id) {
  saveRecentSearch(searchInput.value.trim());
  closeSearchDropdown();
  openProductPage(id);
}

function doFullSearch() {
  const q = searchInput.value.trim();
  if (!q) return;
  saveRecentSearch(q);
  closeSearchDropdown();
  showSearchResultsPage(q);
}

function showSearchResultsPage(query) {
  // Reset price filter state
  srpCurrentQuery = query; srpCurrentCatFilter = ''; srpPriceMinVal = 0; srpPriceMaxVal = 5000;

  const cat = '';
  let results = searchProducts(query, cat);
  const page = document.getElementById('searchResultsPage');
  document.getElementById('srpQuery').textContent = `"${query}"`;
  document.getElementById('srpCount').textContent = `${results.length} резултата`;
  // Breadcrumb
  const srpBc = document.getElementById('srpBreadcrumb');
  if (srpBc) {
    srpBc.innerHTML = '<span class="srp-bc-item" onclick="closeSearchPage()">Начало</span><span class="srp-bc-sep">›</span><span class="srp-bc-item">Търсене</span><span class="srp-bc-sep">›</span><span class="srp-bc-current"></span>';
    srpBc.querySelector('.srp-bc-current').textContent = query;
  }

  // Category filter pills for SRP — store query in module var, never embed user input in HTML attributes
  _srpQuery = query;
  const cats = [...new Set(results.map(p => p.cat))];
  const catLabels = {phones:'Телефони и таблети',laptops:'Лаптопи',desktops:'Десктопи',gaming:'Гейминг',monitors:'Монитори',components:'Компоненти',peripherals:'Периферия',network:'Мрежа',storage:'Съхранение',accessories:'Аксесоари',software:'Софтуер'};
  var _el_srpFilters=document.getElementById('srpFilters'); if(_el_srpFilters) _el_srpFilters.innerHTML = `
    <button type="button" class="srp-filter-pill active" data-cat="" onclick="srpFilter(this,'')">Всички (${results.length})</button>
    ${cats.map(c => `<button type="button" class="srp-filter-pill" data-cat="${escHtml(c)}" onclick="srpFilter(this,'${escHtml(c)}')">${escHtml(catLabels[c]||c)} (${results.filter(p=>p.cat===c).length})</button>`).join('')}
  `;

  // Show & reset price slider
  const pf = document.getElementById('srpPriceFilter');
  if (pf) pf.style.display = '';
  const mn = document.getElementById('priceMin'), mx = document.getElementById('priceMax');
  if (mn) mn.value = 0; if (mx) mx.value = 5000;
  const pv = document.getElementById('srpPriceVals'); if (pv) pv.textContent = '0 лв. — 5 000 лв.';
  const rng = document.getElementById('sliderRange'); if (rng){ rng.style.left='0%'; rng.style.width='100%'; }

  renderSRPGrid(results, query);
  page.classList.add('open');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function renderSRPGrid(results, query) {
  const grid = document.getElementById('srpGrid');
  if (results.length === 0) {
    const popular = products.slice(0, 4);
    grid.innerHTML = `
      <div class="srp-no-results">
        <div class="nri">🔍</div>
        <h3>Няма намерени продукти</h3>
        <p>Опитай с различна дума или разгледай популярните търсения:</p>
        <div class="srp-suggestions">
          ${['лаптоп','слушалки','телефон','таблет','камера'].map(s =>
            `<button type="button" class="srp-suggestion" onclick="document.getElementById('searchInput').value='${s}';showSearchResultsPage('${s}')">${s}</button>`
          ).join('')}
        </div>
      </div>
      <div style="margin-top:32px;">
        <div style="font-size:16px;font-weight:800;margin-bottom:16px;">Популярни продукти</div>
        <div class="srp-grid">${popular.map(p => makeCard(p)).join('')}</div>
      </div>`;
  } else {
    grid.innerHTML = `<div class="srp-grid">${results.map(p => makeCard(p)).join('')}</div>`;
  }
}

function srpFilter(btn, cat) {
  document.querySelectorAll('.srp-filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const results = searchProducts(_srpQuery, cat);
  document.getElementById('srpCount').textContent = `${results.length} резултата`;
  renderSRPGrid(results, _srpQuery);
}

function closeSearchPage() {
  document.getElementById('searchResultsPage').classList.remove('open');
  document.body.style.overflow = '';
}

function closeSearchDropdown() {
  if (searchDropdown) searchDropdown.classList.remove('open');
  if (searchBar) searchBar.classList.remove('active');
  searchFocusIdx = -1;
}

function saveRecentSearch(q) {
  if (!q) return;
  recentSearches = [q, ...recentSearches.filter(s => s !== q)].slice(0, 6);
  try { localStorage.setItem('mc_recent', JSON.stringify(recentSearches)); } catch(e) {}
}

function removeRecent(e, idx) {
  e.stopPropagation();
  recentSearches.splice(idx, 1);
  try { localStorage.setItem('mc_recent', JSON.stringify(recentSearches)); } catch(e) {}
  renderDropdown('');
}

function applyRecentSearch(q) {
  searchInput.value = q;
  renderDropdown(q);
  setTimeout(doFullSearch, 100);
}

// Keyboard navigation in dropdown
if (searchInput) {
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => renderDropdown(searchInput.value), 180);
  });

  searchInput.addEventListener('keydown', e => {
    const items = searchDropdown ? searchDropdown.querySelectorAll('.sd-result') : [];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      searchFocusIdx = Math.min(searchFocusIdx + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('focused', i === searchFocusIdx));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      searchFocusIdx = Math.max(searchFocusIdx - 1, -1);
      items.forEach((el, i) => el.classList.toggle('focused', i === searchFocusIdx));
    } else if (e.key === 'Enter') {
      if (searchFocusIdx >= 0 && items[searchFocusIdx]) {
        items[searchFocusIdx].click();
      } else {
        doFullSearch();
      }
    } else if (e.key === 'Escape') {
      closeSearchDropdown();
      searchInput.blur();
    }
  });

  searchInput.addEventListener('focus', () => renderDropdown(searchInput.value));
}

document.addEventListener('click', e => {
  // Safe delegation for recent search chips (avoids XSS via inline onclick)
  const chip = e.target.closest('[data-recent-search]');
  if (chip && !e.target.closest('.sd-recent-remove')) {
    applyRecentSearch(chip.dataset.recentSearch);
    return;
  }
  if (!e.target.closest('.search-wrap')) closeSearchDropdown();
});

// ===== KEYBOARD SHORTCUT: / or Ctrl+K focuses search =====
document.addEventListener('keydown', e => {
  if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) &&
      !e.target.matches('input,textarea,select,[contenteditable]')) {
    e.preventDefault();
    const si = document.getElementById('searchInput');
    if (si) { si.focus(); si.select(); }
  }
});

function handleSearch() { doFullSearch(); }
function subscribeNL() {
  const input = document.getElementById('nlEmail') || document.getElementById('tyNlEmail');
  const v = input?.value?.trim() || '';
  if (!v || !v.includes('@') || !v.includes('.')) { showToast('Въведи валиден имейл!'); return; }
  try {
    const subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]');
    if (!subs.includes(v)) { subs.push(v); localStorage.setItem('mc_newsletter', JSON.stringify(subs)); }
  } catch(e) {}
  showToast('✓ Абониран успешно! Ще получаваш най-добрите оферти.');
  if (input) input.value = '';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    highlightMatch, searchProducts, queryType, saveRecentSearch,
    _resetRecentSearches: () => { recentSearches = []; },
  };
}


// ===== AUTH SYSTEM =====
let currentUser = null;

// Demo users — client-side only prototype auth (replace with server-side in production)
const demoUsers = [
  { email: 'test@test.bg', password: 'demo-only', firstName: 'Иван', lastName: 'Петров', phone: '0888123456' }
];

function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
  resetAuthForms();
  document.getElementById('authBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAuthModal(e) { if (e.target === e.currentTarget) closeAuthModalDirect(); }
function closeAuthModalDirect() { document.getElementById('authBackdrop').classList.remove('open'); document.body.style.overflow = ''; }

function switchAuthTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('formLogin').classList.toggle('active', tab === 'login');
  document.getElementById('formRegister').classList.toggle('active', tab === 'register');
  document.getElementById('formForgot').classList.toggle('active', tab === 'forgot');
  document.getElementById('authSuccess').classList.remove('show');
  const subs = { login: 'Влез в своя профил', register: 'Създай нов акаунт безплатно', forgot: 'Нулиране на парола' };
  document.getElementById('authHeaderSub').textContent = subs[tab] || '';
}

function showForgotPw() { switchAuthTab('forgot'); document.getElementById('tabLogin').classList.remove('active'); document.getElementById('tabRegister').classList.remove('active'); }

function resetAuthForms() {
  ['loginEmail','loginPassword','regFirstName','regLastName','regEmail','regPhone','regPassword','regPassword2','forgotEmail'].forEach(id => { const el = document.getElementById(id); if (el) { el.value = ''; el.classList.remove('error'); } });
  document.getElementById('loginError').classList.remove('show');
  document.getElementById('registerError').classList.remove('show');
  document.getElementById('authSuccess').classList.remove('show');
  document.getElementById('pwFill').style.width = '0';
  document.getElementById('pwText').textContent = '';
}

function togglePwVis(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
}

function checkPwStrength(val) {
  const fill = document.getElementById('pwFill');
  const text = document.getElementById('pwText');
  if (!val) { fill.style.width = '0'; text.textContent = ''; return; }
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { w: '20%', c: '#ff3d00', t: 'Много слаба' },
    { w: '40%', c: '#ff6b00', t: 'Слаба' },
    { w: '60%', c: '#fbbf24', t: 'Средна' },
    { w: '80%', c: '#00c853', t: 'Силна' },
    { w: '100%', c: '#00a843', t: 'Много силна 💪' },
  ];
  const l = levels[Math.min(score - 1, 4)] || levels[0];
  fill.style.width = l.w; fill.style.background = l.c;
  text.textContent = l.t; text.style.color = l.c;
}

function _authErr(id, msg) {
  const el = document.getElementById(id + '-err');
  if (el) el.textContent = msg || '';
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.classList.remove('show');
  let valid = true;
  if (!email || !email.includes('@')) {
    document.getElementById('loginEmail').classList.add('error');
    _authErr('loginEmail', 'Въведи валиден имейл адрес.');
    valid = false;
  } else {
    document.getElementById('loginEmail').classList.remove('error');
    _authErr('loginEmail', '');
  }
  if (!pass) {
    document.getElementById('loginPassword').classList.add('error');
    _authErr('loginPassword', 'Паролата е задължителна.');
    valid = false;
  } else {
    document.getElementById('loginPassword').classList.remove('error');
    _authErr('loginPassword', '');
  }
  if (!valid) return;
  const user = demoUsers.find(u => u.email === email && u.password === pass);
  if (!user) {
    errEl.classList.add('show');
    document.getElementById('loginPassword').classList.add('error');
    _authErr('loginPassword', 'Грешен имейл или парола.');
    return;
  }
  loginSuccess(user);
}

function handleRegister() {
  const fn = document.getElementById('regFirstName').value.trim();
  const ln = document.getElementById('regLastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pw = document.getElementById('regPassword').value;
  const pw2 = document.getElementById('regPassword2').value;
  const errEl = document.getElementById('registerError');
  errEl.classList.remove('show');
  let valid = true;
  const fieldChecks = [
    ['regFirstName', fn.length > 0, 'Името е задължително.'],
    ['regLastName', ln.length > 0, 'Фамилията е задължителна.'],
    ['regEmail', email.includes('@'), 'Въведи валиден имейл адрес.'],
    ['regPassword', pw.length >= 6, 'Паролата трябва да е поне 6 символа.'],
    ['regPassword2', pw === pw2 && pw.length >= 6, pw !== pw2 ? 'Паролите не съвпадат.' : 'Повтори паролата.'],
  ];
  fieldChecks.forEach(([id, ok, msg]) => {
    document.getElementById(id).classList.toggle('error', !ok);
    _authErr(id, ok ? '' : msg);
    if (!ok) valid = false;
  });
  if (!valid) { errEl.textContent = pw !== pw2 ? '⚠ Паролите не съвпадат!' : '⚠ Моля провери данните!'; errEl.classList.add('show'); return; }
  if (demoUsers.find(u => u.email === email)) {
    errEl.textContent = '⚠ Имейлът вече е регистриран!'; errEl.classList.add('show');
    document.getElementById('regEmail').classList.add('error');
    _authErr('regEmail', 'Този имейл вече е регистриран.');
    return;
  }
  const newUser = { email, password: pw, firstName: fn, lastName: ln, phone: document.getElementById('regPhone').value };
  demoUsers.push(newUser);
  registerSuccess(newUser);
}

function handleForgot() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email.includes('@')) {
    document.getElementById('forgotEmail').classList.add('error');
    _authErr('forgotEmail', 'Въведи валиден имейл адрес.');
    return;
  }
  document.getElementById('forgotEmail').classList.remove('error');
  _authErr('forgotEmail', '');
  showAuthSuccess('📧', 'Имейлът е изпратен!', `Провери ${email} за линк за нулиране на паролата.`);
}

function socialLogin(provider) {
  const mockUser = { email: `user@${provider.toLowerCase()}.com`, firstName: 'Потребител', lastName: provider, phone: '' };
  loginSuccess(mockUser);
}

function loginSuccess(user) {
  currentUser = user;
  showAuthSuccess('🎉', `Добре дошъл, ${user.firstName}!`, 'Влезе успешно в профила си.');
  setTimeout(() => { closeAuthModalDirect(); updateAuthUI(); }, 1800);
}

function registerSuccess(user) {
  currentUser = user;
  showAuthSuccess('🎊', 'Акаунтът е създаден!', `Добре дошъл, ${user.firstName}! Можеш да пазаруваш веднага.`);
  setTimeout(() => { closeAuthModalDirect(); updateAuthUI(); }, 2000);
}

function showAuthSuccess(icon, title, text) {
  ['formLogin','formRegister','formForgot'].forEach(id => { const f = document.getElementById(id); if(f) f.classList.remove('active'); });
  document.getElementById('authSuccessIcon').textContent = icon;
  document.getElementById('authSuccessTitle').textContent = title;
  document.getElementById('authSuccessText').textContent = text;
  document.getElementById('authSuccess').classList.add('show');
}

function updateAuthUI() {
  const topLogin = document.getElementById('topbarLogin');
  const topReg = document.getElementById('topbarRegister');
  const profileBtn = document.getElementById('profileBtn');
  const profileLabel = document.getElementById('profileLabel');
  const profileIcon = document.getElementById('profileIcon');
  if (currentUser) {
    const initials = (currentUser.firstName[0] + (currentUser.lastName ? currentUser.lastName[0] : '')).toUpperCase();
    if (topLogin) topLogin.style.display = 'none';
    if (topReg) topReg.style.display = 'none';
    if (profileBtn) profileBtn.style.display = '';
    if (profileLabel) profileLabel.textContent = currentUser.firstName;
    if (profileIcon) profileIcon.innerHTML = `<div class="hdr-btn-avatar">${escHtml(initials)}</div>`;
    const pdAvatar = document.getElementById('pdAvatar'); if (pdAvatar) pdAvatar.textContent = initials;
    const pdName = document.getElementById('pdName'); if (pdName) pdName.textContent = `${currentUser.firstName} ${currentUser.lastName || ''}`.trim();
    const pdEmail = document.getElementById('pdEmail'); if (pdEmail) pdEmail.textContent = currentUser.email;
    showToast(`👋 Добре дошъл, ${currentUser.firstName}!`);
  } else {
    if (topLogin) topLogin.style.display = '';
    if (topReg) topReg.style.display = '';
    if (profileBtn) profileBtn.style.display = 'none';
    const pdAvatar = document.getElementById('pdAvatar'); if (pdAvatar) pdAvatar.textContent = '?';
    const pdName = document.getElementById('pdName'); if (pdName) pdName.textContent = 'Гост';
    const pdEmail = document.getElementById('pdEmail'); if (pdEmail) pdEmail.textContent = '—';
  }
}

function handleProfileClick() {
  if (currentUser) {
    document.getElementById('profileDropdown').classList.toggle('open');
  } else {
    openAuthModal('login');
  }
}

function closeDropdown() {
  document.getElementById('profileDropdown').classList.remove('open');
}

function handleLogout() {
  currentUser = null;
  closeDropdown();
  updateAuthUI();
  showToast('Излязохте успешно от профила.');
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  const wrap = document.querySelector('.profile-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) closeDropdown();
});

// ===== WISHLIST =====
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem('mc_wishlist') || '[]'); } catch(e) {}

function toggleWishlist(id, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    showToast('❤ Добавено в любими!');
  } else {
    wishlist.splice(idx, 1);
    showToast('♡ Премахнато от любими');
  }
  try { localStorage.setItem('mc_wishlist', JSON.stringify(wishlist)); } catch(err){}
  updateWishlistUI();
  // Update specific button if visible
  const btn = document.getElementById('wl-' + id);
  if (btn) {
    btn.innerHTML = wishlist.includes(id)
      ? '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart-fill"/></svg>'
      : '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart"/></svg>';
    btn.classList.toggle('wishlisted', wishlist.includes(id));
    // Brief pointer-events block to prevent accidental double-tap
    btn.style.pointerEvents = 'none';
    setTimeout(() => { btn.style.pointerEvents = ''; }, 400);
  }
  // Refresh wishlist page if open
  if (document.getElementById('wishlistPage').classList.contains('open')) renderWishlistGrid();
}

function updateWishlistUI() {
  const count = wishlist.length;
  // Header badge
  const hdrBadge = document.getElementById('wlHdrBadge');
  if (hdrBadge) { hdrBadge.textContent = count; hdrBadge.style.display = count > 0 ? 'flex' : 'none'; }
  const hdrIcon = document.getElementById('wlHdrIcon');
  if (hdrIcon) hdrIcon.textContent = count > 0 ? '❤' : '♡';
  // Bottom nav badges (two nav bars exist — update all)
  document.querySelectorAll('#bnWishBadge, #bnWishBadge2').forEach(bnBadge => {
    bnBadge.textContent = count; bnBadge.classList.toggle('show', count > 0);
  });
  // Wishlist count label
  const cl = document.getElementById('wishlistCount');
  if (cl) cl.textContent = count + (count === 1 ? ' продукт' : ' продукта');
}

function openWishlist() {
  renderWishlistGrid();
  document.getElementById('wishlistPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  setBottomNavActive('bn-wish');
}
function closeWishlist() {
  document.getElementById('wishlistPage').classList.remove('open');
  document.body.style.overflow = '';
  setBottomNavActive('bn-home');
}

function renderWishlistGrid() {
  const grid = document.getElementById('wishlistGrid');
  const count = document.getElementById('wishlistCount');
  if (wishlist.length === 0) {
    grid.innerHTML = `<div class="wishlist-empty">
      <div class="wishlist-empty-icon">♡</div>
      <h3>Нямаш любими продукти</h3>
      <p>Кликни на сърчицето на продукт,<br>за да го добавиш в любими.</p>
      <button type="button" class="wishlist-empty-btn" onclick="closeWishlist()">← Разгледай продуктите</button>
    </div>`;
  } else {
    const prods = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
    count.textContent = prods.length + (prods.length === 1 ? ' продукт' : ' продукта');
    // Add-all button before the grid
    const addAllHtml = `<div class="wl-add-all-row"><button type="button" class="wl-add-all-btn" onclick="addAllWishlistToCart()"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави всички в кошницата (${prods.length})</button></div>`;
    grid.innerHTML = addAllHtml + `<div class="wishlist-grid">${prods.map(p => {
      const save = p.old ? Math.round(((p.old-p.price)/p.old)*100) : 0;
      const _wlName = escHtml(p.name);
      const imgHtml = p.img
        ? `<img class="product-img-real" src="${escHtml(p.img)}" alt="${_wlName}" loading="lazy" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${escHtml(p.emoji)}</span>`
        : `<span class="product-img-emoji">${escHtml(p.emoji)}</span>`;
      return `<div class="product-card pos-rel">
        <button type="button" class="wishlist-remove-btn" onclick="toggleWishlist(${p.id},{stopPropagation:()=>{}})" title="Премахни">×</button>
        <div class="product-img-wrap cursor-pointer" onclick="openProductPage(${p.id});closeWishlist();">${imgHtml}</div>
        <div class="product-body">
          <div class="product-brand">${escHtml(p.brand)}</div>
          <div class="product-name">${_wlName}</div>
          <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating}</span></div>
          <div class="product-footer">
            <div class="price-row">
              <div class="price-current${p.badge==='sale'?' sale':''}">${fmtPrice(p.price,p.badge==='sale'?'sale':'')}</div>
              ${p.old?`<div class="price-save">-${save}%</div>`:''}
            </div>
            <button type="button" class="add-cart-btn" onclick="addToCart(${p.id})">🛒 Добави в кошница</button>
          </div>
        </div>
      </div>`;
    }).join('')}</div>`;
  }
}


function addAllWishlistToCart() {
  const prods = wishlist.map(id => products.find(p => p.id === id)).filter(p => p && p.stock !== false);
  if (!prods.length) { showToast('⚠️ Няма налични продукти в любими!'); return; }
  prods.forEach(p => {
    const ex = cart.find(x => x.id === p.id);
    if (ex) ex.qty++; else cart.push({...p, qty: 1});
  });
  updateCart(); saveCart();
  showToast(`🛒 ${prods.length} продукта добавени в кошницата!`);
}

// ===== MY ORDERS PAGE =====
function openMyOrders() {
  renderMyOrders();
  document.getElementById('myOrdersPage').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMyOrders() {
  document.getElementById('myOrdersPage').classList.remove('open');
  document.body.style.overflow = '';
}

function renderMyOrders() {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
  const grid = document.getElementById('myOrdersGrid');
  if (!grid) return;

  if (orders.length === 0) {
    grid.innerHTML = `
      <div class="mo-empty">
        <div class="mo-empty-icon">📦</div>
        <p class="mo-empty-text">Нямаш поръчки все още.<br>Разгледай нашите продукти!</p>
        <button type="button" class="mo-empty-btn" data-action="closeMyOrders">Към магазина →</button>
      </div>`;
    return;
  }

  const statusLabels = { pending:'⏳ Изчаква', processing:'⚙ Обработва се', shipped:'🚚 Изпратена', delivered:'✅ Доставена', cancelled:'❌ Отказана' };
  const statusClass  = { pending:'mo-st-pending', processing:'mo-st-processing', shipped:'mo-st-shipped', delivered:'mo-st-delivered', cancelled:'mo-st-cancelled' };

  grid.innerHTML = orders.map(o => {
    const _oNum = escHtml(o.num || '');
    const _oDate = escHtml(o.date || '');
    const _oDel = escHtml(o.deliveryType || '—');
    const _oStatus = escHtml(statusLabels[o.status] || o.status || '');
    const _oStatusCls = statusClass[o.status] || 'mo-st-pending';
    const items = (o.itemsData || []).map(x =>
      `<div class="mo-item-row">
        <span class="mo-item-emoji">${escHtml(x.emoji||'📦')}</span>
        <div class="mo-item-info">
          <div class="mo-item-name">${escHtml(x.name||'')}</div>
          <div class="mo-item-meta">${escHtml(x.brand||'')} · ×${Number(x.qty)||0}</div>
        </div>
        <div class="mo-item-price">${fmtEur(x.price * x.qty)}</div>
      </div>`
    ).join('');
    return `
      <div class="mo-card">
        <div class="mo-card-header">
          <div>
            <div class="mo-card-num">${_oNum}</div>
            <div class="mo-card-date">${_oDate}</div>
          </div>
          <span class="mo-status ${_oStatusCls}">${_oStatus}</span>
        </div>
        <div class="mo-card-items">${items}</div>
        <div class="mo-card-footer">
          <span class="mo-card-delivery">🚚 ${_oDel}</span>
          <div class="mo-card-total">
            <span class="mo-card-total-label">Общо:</span>
            <span class="mo-card-total-val">${fmtEur(o.total)} <span class="mo-card-total-bgn">/ ${fmtBgn(o.total)}</span></span>
          </div>
          <button type="button" class="mo-print-btn" onclick="printOrder(${JSON.stringify(o.num||'')})" title="Принтирай поръчката">
            <svg width="14" height="14" class="svg-ic" aria-hidden="true"><use href="#ic-printer"/></svg> Принтирай
          </button>
        </div>
      </div>`;
  }).join('');
}

function printOrder(num) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
  const o = orders.find(x => x.num === num);
  if (!o) { showToast('Поръчката не е намерена'); return; }
  const statusLabels = { pending:'Изчаква', processing:'Обработва се', shipped:'Изпратена', delivered:'Доставена', cancelled:'Отказана', paid:'Платена' };
  const statusColors = { pending:'#f59e0b', paid:'#10b981', shipped:'#6366f1', delivered:'#10b981', cancelled:'#ef4444' };
  const delivery = o.delivery || 0;
  const subtotal = o.subtotal || (o.total - delivery);
  const _h = s => escHtml(String(s||''));
  const payLabel = o.payment==='card'?'Карта':o.payment==='cod'?'Наложен платеж':'Банков превод';
  const items = (o.itemsData && o.itemsData.length)
    ? o.itemsData.map(x => `<tr><td>${_h(x.emoji||'')}${_h(x.name||'')}</td><td>${_h(x.brand||'')}</td><td style="text-align:center;">×${Number(x.qty)||0}</td><td style="text-align:right;font-weight:700;">${((x.price*x.qty)/1.95583).toFixed(2)} €<br><span style="font-size:10px;color:#6b7280;">${(x.price*x.qty).toFixed(2)} лв.</span></td></tr>`).join('')
    : `<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:16px;">${_h(o.items||'—')}</td></tr>`;
  const win = window.open('', '_blank', 'width=760,height=700');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(`<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8">
    <title>Фактура ${_h(o.num)} — Most Computers</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Segoe UI',Arial,sans-serif;background:#f8f9fa;color:#1f2937;font-size:13px;padding:0}
      .page{max-width:700px;margin:0 auto;background:#fff;min-height:100vh;padding:40px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:2px solid #e5e7eb;margin-bottom:28px}
      .logo{font-size:22px;font-weight:900;color:#111;letter-spacing:-0.5px}
      .logo span{color:#6366f1}
      .logo-sub{font-size:11px;color:#9ca3af;margin-top:3px}
      .inv-meta{text-align:right}
      .inv-num{font-size:18px;font-weight:800;color:#6366f1}
      .inv-date{font-size:11px;color:#9ca3af;margin-top:4px}
      .status-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;margin-top:6px;color:#fff;background:${statusColors[o.status]||'#6b7280'}}
      .section{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
      .box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px}
      .box-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:10px}
      .box-val{font-size:13px;color:#1f2937;line-height:1.7}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      thead th{background:#f3f4f6;padding:10px 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;text-align:left;border-bottom:2px solid #e5e7eb}
      tbody td{padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;vertical-align:top}
      tbody tr:last-child td{border-bottom:none}
      .totals{margin-left:auto;max-width:280px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px}
      .tot-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#6b7280}
      .tot-row.grand{font-size:16px;font-weight:800;color:#1f2937;border-top:2px solid #e5e7eb;margin-top:8px;padding-top:12px}
      .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:11px;color:#9ca3af}
      @media print{body{background:#fff}.page{padding:24px;box-shadow:none}button{display:none!important}}
      .print-btn{display:block;margin:0 auto 20px;padding:10px 28px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Segoe UI',sans-serif}
    </style></head><body>
    <div class="page">
      <button class="print-btn" onclick="window.print()">🖨 Принтирай фактурата</button>
      <div class="header">
        <div>
          <div class="logo">Most <span>Computers</span></div>
          <div class="logo-sub">mostcomputers.bg &nbsp;·&nbsp; office@mostcomputers.bg</div>
        </div>
        <div class="inv-meta">
          <div class="inv-num">Поръчка ${_h(o.num)}</div>
          <div class="inv-date">Дата: ${_h(o.date)}</div>
          <div class="inv-date">Доставка: ${_h(o.deliveryType||'—')} &nbsp;·&nbsp; Плащане: ${_h(payLabel)}</div>
          <div><span class="status-badge">${_h(statusLabels[o.status]||o.status)}</span></div>
        </div>
      </div>
      <div class="section">
        <div class="box">
          <div class="box-title">Клиент</div>
          <div class="box-val">
            <strong>${_h(o.customer||'—')}</strong><br>
            ${_h(o.email||'')}<br>
            ${_h(o.phone||'')}
          </div>
        </div>
        <div class="box">
          <div class="box-title">Адрес за доставка</div>
          <div class="box-val">
            ${_h(o.city||'—')}, ${_h(o.addr||'')}<br>
            ${o.zip ? 'ПК ' + _h(o.zip) : ''}
          </div>
        </div>
      </div>
      <table>
        <thead><tr><th>Продукт</th><th>Марка</th><th style="text-align:center">Бр.</th><th style="text-align:right">Сума</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
      <div class="totals">
        <div class="tot-row"><span>Продукти</span><span>${(subtotal/1.95583).toFixed(2)} €</span></div>
        <div class="tot-row"><span>Доставка</span><span>${delivery===0?'Безплатно':(delivery/1.95583).toFixed(2)+' €'}</span></div>
        <div class="tot-row grand"><span>Общо</span><span>${(o.total/1.95583).toFixed(2)} € / ${o.total.toFixed(2)} лв.</span></div>
      </div>
      <div class="footer">
        <span>Most Computers ЕООД &nbsp;·&nbsp; ЕИК 123456789</span>
        <span>Генерирано: ${new Date().toLocaleString('bg-BG')}</span>
      </div>
    </div>
    </body></html>`);
  win.document.close();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toggleWishlist, _resetWishlist: () => { wishlist = []; } };
}

// ===== RECENTLY VIEWED =====
let recentlyViewed = [];
try { recentlyViewed = JSON.parse(localStorage.getItem('mc_rv') || '[]'); } catch(e) {}

function addToRecentlyViewed(id) {
  recentlyViewed = [id, ...recentlyViewed.filter(x=>x!==id)].slice(0, 10);
  try { localStorage.setItem('mc_rv', JSON.stringify(recentlyViewed)); } catch(e){}
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const section = document.getElementById('recentlyViewedSection');
  const scroll = document.getElementById('rvScroll');
  if (!section || !scroll) return;
  const items = recentlyViewed.map(id => products.find(p=>p.id===id)).filter(Boolean);
  if (items.length < 2) { section.style.display='none'; return; }
  section.style.display = '';
  scroll.innerHTML = items.map(p => `
    <div class="rv-card" onclick="openProductPage(${p.id})">
      ${p.img
        ? `<img class="rv-card-img" src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="rv-card-emoji is-hidden">${p.emoji}</span>`
        : `<span class="rv-card-emoji">${p.emoji}</span>`}
      <div class="rv-card-name">${p.name}</div>
      <div class="rv-card-price">${fmtEur(p.price)}</div>
    </div>`).join('');
}

function clearRecentlyViewed() {
  recentlyViewed = [];
  try { localStorage.removeItem('mc_rv'); } catch(e){}
  const section = document.getElementById('recentlyViewedSection');
  if (section) section.style.display = 'none';
  showToast('🗑 История изчистена');
}

// Init recently viewed on load
// renderRecentlyViewed called in DOMContentLoaded


// ── Canonical category normalization ─────────────────────────────────────────
// Maps any cat value (old-style or XML-imported) → one of the 11 canonical cats:
// laptops | desktops | gaming | components | monitors | peripherals | phones | network | storage | software | accessories
function normalizeCat(cat) {
  const m = {
    laptop:'laptops',    laptops:'laptops',
    desktop:'desktops',  desktops:'desktops',
    gaming:'gaming',     game:'gaming',
    components:'components', component:'components',
    monitor:'monitors',  monitors:'monitors',  display:'monitors',
    audio:'peripherals', camera:'peripherals',
    print:'peripherals', peripherals:'peripherals',
    phone:'phones',      phones:'phones',      mobile:'phones',
    tablet:'phones',     smartphones:'phones',
    tv:'accessories',    smart:'accessories',
    network:'network',
    storage:'storage',   nas:'storage',
    software:'software',
    acc:'accessories',   accessories:'accessories', accessory:'accessories',
  };
  return m[(cat||'').toLowerCase()] || 'accessories';
}

let _filterCache = null;
function _invalidateFilterCache(){ _filterCache = null; }
function getFilteredSorted(){
  const _cacheKey = JSON.stringify([currentFilter, currentSort, currentSubcat,
    typeof advFilterBrands!=='undefined'?[...advFilterBrands]:[],
    typeof advFilterRating!=='undefined'?advFilterRating:0,
    typeof advFilterSaleOnly!=='undefined'?advFilterSaleOnly:false,
    typeof advFilterNewOnly!=='undefined'?advFilterNewOnly:false,
    typeof advFilterStockOnly!=='undefined'?advFilterStockOnly:false,
    typeof advPriceMin!=='undefined'?advPriceMin:0,
    typeof advPriceMax!=='undefined'?advPriceMax:2000,
    typeof catSpecActiveFilters!=='undefined'?JSON.stringify(Object.fromEntries(Object.entries(catSpecActiveFilters).map(([k,v])=>[k,[...v]]))):'{}',
  ]);
  if (_filterCache && _filterCache.key === _cacheKey) return _filterCache.list;
  let list=(currentFilter==='all'?[...products]:products.filter(p=>normalizeCat(p.cat)===currentFilter)).filter(p=>p.stock!==false);
  // Subcat filter
  if(typeof matchesSubcat==='function' && currentSubcat && currentSubcat!=='all')
    list=list.filter(p=>matchesSubcat(p, currentSubcat));
  // Category-specific spec filters
  if(typeof matchesCatSpec==='function')
    list=list.filter(p=>matchesCatSpec(p));
  // Sort
  if(currentSort==='bestseller')list.sort((a,b)=>(b.rating*Math.log1p(b.rv||1))-(a.rating*Math.log1p(a.rv||1)));
  else if(currentSort==='price-asc')list.sort((a,b)=>a.price-b.price);
  else if(currentSort==='price-desc')list.sort((a,b)=>b.price-a.price);
  else if(currentSort==='rating')list.sort((a,b)=>b.rating-a.rating);
  else if(currentSort==='discount')list.sort((a,b)=>b.pct-a.pct);
  // Advanced sidebar filters
  if(typeof advFilterBrands!=='undefined' && advFilterBrands.size>0) list=list.filter(p=>advFilterBrands.has(p.brand));
  if(typeof advFilterRating!=='undefined' && advFilterRating>0) list=list.filter(p=>p.rating>=advFilterRating);
  if(typeof advFilterSaleOnly!=='undefined' && advFilterSaleOnly) list=list.filter(p=>p.badge==='sale');
  if(typeof advFilterNewOnly!=='undefined'  && advFilterNewOnly)  list=list.filter(p=>p.badge==='new'||p.badge==='hot');
  if(typeof advFilterStockOnly!=='undefined' && advFilterStockOnly) list=list.filter(p=>p.stock!==false&&p.stock!==0);
  // Price range filter (EUR)
  if(typeof advPriceMin!=='undefined' && (advPriceMin>0 || advPriceMax<(_sbPriceAbsMax||2000))){
    const _rate=typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583;
    list=list.filter(p=>{ const eur=p.price/_rate; return eur>=advPriceMin && eur<=advPriceMax; });
  }
  _filterCache = { key: _cacheKey, list };
  return list;
}
let topGridPage = 1;
const TOP_PAGE_SIZE = 12;

function applyFilter(btn,cat){
  document.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter=cat;
  currentSubcat='all';
  topGridPage=1;
  // Show subcategory pills
  if(typeof renderSubcatBar==='function') renderSubcatBar(cat);
  // Show category-specific filters in sidebar
  if(typeof renderCatSpecFilters==='function'){
    if(cat==='all') hideCatSpecFilters();
    else renderCatSpecFilters(cat);
  }
  // Breadcrumb
  if(typeof bcOnFilterCat==='function') bcOnFilterCat(cat);
  updateSidebarFiltersVisibility();
  renderTopGrid();
}
function applySort(val){currentSort=val;topGridPage=1;renderTopGrid();}
function _ensureTopSortBar() {
  if (document.getElementById('topSortBar')) return;
  const grid = document.getElementById('topGrid');
  if (!grid) return;
  const bar = document.createElement('div');
  bar.id = 'topSortBar';
  bar.className = 'top-sort-bar';
  bar.innerHTML = `<span class="top-sort-label">Сортирай:</span>
    <select class="sort-select" id="topSortSelect" onchange="applySort(this.value)">
      <option value="bestseller">🏆 Най-продавани</option>
      <option value="price-asc">Цена ↑</option>
      <option value="price-desc">Цена ↓</option>
      <option value="rating">⭐ Рейтинг</option>
      <option value="discount">% Отстъпка</option>
    </select>
    <span class="top-sort-count" id="topSortCount"></span>`;
  grid.before(bar);
}

function goToPage(n) {
  topGridPage = n;
  renderTopGrid();
  const grid = document.getElementById('topGrid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function _buildPagination(current, total) {
  if (total <= 1) return '';
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('…');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('…');
    pages.push(total);
  }
  const btn = (p) => p === '…'
    ? `<span class="pg-ellipsis">…</span>`
    : `<button type="button" class="pg-btn${p === current ? ' active' : ''}" onclick="goToPage(${p})">${p}</button>`;
  return `<div class="pagination-bar" style="grid-column:1/-1;">
    <button type="button" class="pg-btn pg-prev" onclick="goToPage(${current - 1})"${current === 1 ? ' disabled' : ''}>‹</button>
    ${pages.map(btn).join('')}
    <button type="button" class="pg-btn pg-next" onclick="goToPage(${current + 1})"${current === total ? ' disabled' : ''}>›</button>
    <span class="pg-info">${(current - 1) * TOP_PAGE_SIZE + 1}–${Math.min(current * TOP_PAGE_SIZE, _filterCache && _filterCache.list ? _filterCache.list.length : current * TOP_PAGE_SIZE)} от <strong id="pgTotal"></strong></span>
  </div>`;
}

function renderTopGrid(){
  _ensureTopSortBar();
  const list = getFilteredSorted();
  const totalPages = Math.max(1, Math.ceil(list.length / TOP_PAGE_SIZE));
  if (topGridPage > totalPages) topGridPage = totalPages;
  const grid = document.getElementById('topGrid');
  if (typeof showSkeletons === 'function') showSkeletons('topGrid', 8);
  const from = (topGridPage - 1) * TOP_PAGE_SIZE;
  const shown = list.slice(from, from + TOP_PAGE_SIZE);
  // Sync sort select
  const sel = document.getElementById('topSortSelect'); if (sel) sel.value = currentSort;
  // Update count
  const cnt = document.getElementById('topSortCount'); if (cnt) cnt.textContent = list.length + ' продукта';
  grid.innerHTML = list.length === 0
    ? `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);">
        <div style="font-size:48px;margin-bottom:12px;">🔍</div>
        <div style="font-size:16px;font-weight:700;color:var(--text);">Няма продукти в тази категория</div>
        <div style="font-size:13px;margin-top:6px;">Опитай да смениш филтъра или добави продукти от Admin панела.</div>
      </div>`
    : shown.map(p => makeCard(p)).join('') + _buildPagination(topGridPage, totalPages);
  const pgTotal = document.getElementById('pgTotal'); if (pgTotal) pgTotal.textContent = list.length;
  const rc = document.getElementById('resultsCount'); if (rc) rc.textContent = list.length + ' продукта';
  compareList.forEach(id => { const cb = document.getElementById('cmp-' + id); if (cb) cb.checked = true; });
  updateLiveCount(list.length);
}
function updateSidebarFiltersVisibility() {
  const el = document.getElementById('sidebarFilters');
  if (!el) return;
  const active = currentFilter && currentFilter !== 'all';
  el.classList.toggle('visible', active);
}

function renderGrids(){
  const _inStock = p => p.stock !== false;
  const _flashProds=[...products].filter(p=>_inStock(p)&&p.old&&p.pct>0).sort((a,b)=>b.pct-a.pct).slice(0,5);
  const flashSection=document.getElementById('sale');
  if(flashSection) flashSection.style.display=_flashProds.length?'':'none';
  const fg=document.getElementById('flashGrid'); if(fg) fg.innerHTML=_flashProds.map(p=>makeCard(p,true)).join('');
  renderTopGrid();
  // Bestsellers grid — top rated products not tied to discounts
  const bg=document.getElementById('bestsellersGrid');
  if(bg){
    const _best=[...products].filter(p=>_inStock(p)).sort((a,b)=>(b.rating*Math.log1p(b.rv||1))-(a.rating*Math.log1p(a.rv||1))).slice(0,5);
    bg.innerHTML=_best.map(p=>makeCard(p,true)).join('');
    const bs=document.getElementById('bestsellersSection');
    if(bs) bs.style.display=_best.length?'':'none';
  }
  // Slide 1 — cheapest flash-sale product
  const _s1Prods = [...products].filter(p=>_inStock(p)&&p.old&&p.pct>0).sort((a,b)=>a.price-b.price);
  const _s1el = document.getElementById('slide1Price');
  if(_s1Prods.length && _s1el) {
    const _s1min = _s1Prods[0], _s1max = _s1Prods[_s1Prods.length-1];
    _s1el.innerHTML = `от <b>${(_s1min.price/EUR_RATE).toFixed(2)} €</b> / ${_s1min.price} лв. <small>вместо ${(_s1min.old/EUR_RATE).toFixed(2)} € / ${_s1min.old} лв.</small>`;
  }
  // Slide 2 — sync price from products array (id:1600 = MSI Katana 15)
  const _s2 = products.find(p=>p.id===1600);
  const _s2el = document.getElementById('slide2Price');
  if(_s2 && _s2el) _s2el.innerHTML = `${(_s2.price/EUR_RATE).toFixed(2)} € / ${_s2.price} лв. <small>с ДДС</small>`;
  // Slide 4 — sync price from products array (id:1884 = Lenovo Legion Pro 7 RTX 5090)
  const _s4 = products.find(p=>p.id===1884);
  const _s4el = document.getElementById('slide4Price');
  if(_s4 && _s4el) _s4el.innerHTML = `${(_s4.price/EUR_RATE).toFixed(2)} € / ${_s4.price} лв. <small>с ДДС</small>`;
  const ng=document.getElementById('newGrid'); if(ng) ng.innerHTML=products.filter(p=>_inStock(p)&&p.badge==='new').concat(products.filter(p=>_inStock(p)&&p.badge==='hot')).slice(0,5).map(p=>makeCard(p,true)).join('');
  // Promo strip — update free delivery threshold with current EUR rate
  const _freeDelEur = 100;
  const _freeDelBgn = (Math.round(_freeDelEur * EUR_RATE * 100) / 100).toFixed(2);
  document.querySelectorAll('.promo-free-del').forEach((el, i) => {
    const prefix = i === 0
      ? `<svg width="14" height="14" class="svg-ic" aria-hidden="true"><use href="#ic-truck"/></svg> `
      : '🚚 ';
    el.innerHTML = prefix + `Безплатна доставка над ${_freeDelEur} € / ${_freeDelBgn} лв.`;
  });
  renderHeroPanel();
  renderPromoBanner();
  updateWishlistUI();
  if(typeof initLazyImages==='function') initLazyImages();
  if(typeof renderHpCats==='function') renderHpCats();
}

function renderHeroPanel(){
  const panel = document.getElementById('heroRightPanel');
  if(!panel) return;
  const byScore = [...products].sort((a,b)=>(b.rating*(b.rv||1))-(a.rating*(a.rv||1)));
  const picks = [
    { p: byScore[0], label:'⭐ Препоръчано', cls:'mini-promo-recommended' },
    { p: byScore.find(p=>p.badge==='sale'), label:'🔥 Бестселър', cls:'mini-promo-bestseller' },
    { p: [...products].filter(p=>p.badge==='new'||p.badge==='hot')[0], label:'🆕 Ново', cls:'mini-promo-new' },
  ];
  panel.innerHTML = picks.filter(x=>x.p).map(({p,label,cls})=>`
    <div class="mini-promo ${cls}">
      <div class="mini-promo-emoji">${p.emoji}</div>
      <div class="mini-promo-text">
        <div class="mini-promo-label">${label}</div>
        <div class="mini-promo-name">${p.name.length>32?p.name.slice(0,32)+'…':p.name}</div>
        ${p.old?`<div class="mini-promo-old">${(p.old/EUR_RATE).toFixed(2)} € / ${p.old} лв.</div>`:''}
        <div class="mini-promo-price">${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв.</div>
      </div>
      <button type="button" class="mini-promo-view" onclick="event.stopPropagation();openProductPage(${p.id})">Виж →</button>
    </div>`).join('');
}

function renderPromoBanner(){
  const banner = document.getElementById('promoBanner');
  if(!banner) return;
  // Top new product + top sale product
  const newP  = [...products].filter(p=>p.badge==='new'||p.badge==='hot').sort((a,b)=>b.rating-a.rating)[0];
  const saleP = [...products].filter(p=>p.badge==='sale').sort((a,b)=>b.pct-a.pct)[0];
  if(!newP||!saleP) return;
  const themes = [
    { p:newP,  cls:'blue', badge:`🆕 Ново`,      sub: newP.desc  ? newP.desc.slice(0,80)+'…'  : newP.name },
    { p:saleP, cls:'dark', badge:`🔥 -${saleP.pct}%`, sub: saleP.desc ? saleP.desc.slice(0,80)+'…' : saleP.name },
  ];
  banner.innerHTML = themes.map(({p,cls,badge,sub})=>`
    <div class="promo-half ${cls}">
      <span class="badge">${badge}</span>
      <h3>${p.name.length>36?p.name.slice(0,36)+'…':p.name}</h3>
      <p>${sub}</p>
      <div class="promo-price">${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв.</div>
      <button type="button" class="promo-btn" onclick="addToCart(${p.id})">Добави в кошница +</button>
      <div class="promo-emoji">${p.emoji}</div>
    </div>`).join('');
}


// ===== PRICE SLIDER =====
let srpPriceMinVal=0, srpPriceMaxVal=5000, srpCurrentQuery='', srpCurrentCatFilter='';
function updatePriceSlider(){
  const mn = document.getElementById('priceMin'), mx = document.getElementById('priceMax');
  if(!mn||!mx) return;
  let minV=parseInt(mn.value), maxV=parseInt(mx.value);
  if(isNaN(minV)) minV=0; if(isNaN(maxV)) maxV=5000;
  if(minV > maxV-50){ minV=maxV-50; mn.value=minV; }
  srpPriceMinVal=minV; srpPriceMaxVal=maxV;
  const srpVals=document.getElementById('srpPriceVals'); if(srpVals) srpVals.textContent = fmtBgn(minV) + ' — ' + fmtBgn(maxV);
  const rng = document.getElementById('sliderRange');
  if(rng){ rng.style.left=(minV/5000*100)+'%'; rng.style.width=((maxV-minV)/5000*100)+'%'; }
  let res = searchProducts(srpCurrentQuery, srpCurrentCatFilter).filter(p => p.price>=minV && p.price<=maxV);
  const srpCnt=document.getElementById('srpCount'); if(srpCnt) srpCnt.textContent = res.length + ' резултата';
  renderSRPGrid(res, srpCurrentQuery);
}
// price slider integrated into showSearchResultsPage directly


// ===== ADVANCED SIDEBAR FILTERS =====
let advFilterBrands = new Set();
let advFilterRating = 0;
let advFilterSaleOnly = false;
let advFilterNewOnly = false;
let advFilterStockOnly = false;



function initSidebarFilters() {
  // Dynamic brand list from actual products, sorted by count desc
  const EXCLUDE_BRANDS = new Set(['Apple','Samsung','Sony','TP-Link','Bose','Xiaomi','Google','Dell','Philips','JBL','GoPro','WD','Anker','_NONAME']);
  const brandCounts = {};
  products.forEach(p => { if(p.brand) brandCounts[p.brand] = (brandCounts[p.brand]||0) + 1; });
  const ALL_BRANDS = Object.entries(brandCounts)
    .filter(([b]) => !EXCLUDE_BRANDS.has(b))
    .sort((a,b) => b[1]-a[1])
    .map(([b]) => b);
  const el = document.getElementById('brandFilterList');
  if (el) {
    el.innerHTML = ALL_BRANDS.map(b => {
      const c = brandCounts[b];
      const esc = b.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const jsEsc = b.replace(/\\/g,'\\\\').replace(/'/g,"\\'"); // escape for JS string literal
      return `<label class="brand-filter-item">
        <input type="checkbox" value="${esc}" onchange="toggleBrandFilter('${jsEsc}',this.checked)">
        <span>${esc}</span>
        <span class="brand-count">${c}</span>
      </label>`;
    }).join('');
  }
  // Rating counts
  const rc = (min) => products.filter(p=>p.rating>=min).length;
  const r0 = document.getElementById('rc-0'); if(r0) r0.textContent = products.length;
  const r45 = document.getElementById('rc-45'); if(r45) r45.textContent = rc(4.5);
  const r40 = document.getElementById('rc-40'); if(r40) r40.textContent = rc(4.0);
  const r30 = document.getElementById('rc-30'); if(r30) r30.textContent = rc(3.0);
  // Dynamic price range from actual products
  if (products.length > 0) {
    const prices = products.map(p => p.price / (typeof EUR_RATE !== 'undefined' ? EUR_RATE : 1.96)).filter(v => v > 0);
    if (prices.length > 0) {
      const rawMax = Math.max(...prices);
      _sbPriceAbsMax = Math.ceil(rawMax / 100) * 100; // round up to nearest 100€
      advPriceMax = _sbPriceAbsMax;
      const mnEl = document.getElementById('sbPriceMin');
      const mxEl = document.getElementById('sbPriceMax');
      if (mnEl) { mnEl.max = _sbPriceAbsMax; mnEl.value = 0; }
      if (mxEl) { mxEl.max = _sbPriceAbsMax; mxEl.value = _sbPriceAbsMax; }
      const vals = document.getElementById('sbPriceVals');
      if (vals) vals.textContent = 'Всички цени';
    }
  }
  // Price group counts
  initPriceGroupCounts();
  // Init live count
  updateLiveCount(products.length);
  // Init slider track
  const rng = document.getElementById('sbSliderRange');
  if(rng){rng.style.left='0%';rng.style.width='100%';}
}

// Initialize UI actions


function toggleSfb(id) {
  const body = document.getElementById(id);
  const arrow = document.getElementById(id+'-arrow');
  if (!body) return;
  const isOpen = body.classList.toggle('open');
  if (arrow) arrow.classList.toggle('open', isOpen);
}

function toggleBrandFilter(brand, checked) {
  if (checked) advFilterBrands.add(brand);
  else advFilterBrands.delete(brand);
  applyAdvFilters();
}

function applyAdvFilters() {
  advFilterRating = parseFloat(document.querySelector('input[name="ratingFilter"]:checked')?.value||'0');
  advFilterSaleOnly = document.getElementById('saleOnlyToggle')?.checked||false;
  advFilterNewOnly  = document.getElementById('newOnlyToggle')?.checked||false;
  advFilterStockOnly = document.getElementById('stockOnlyToggle')?.checked||false;
  topGridPage = 1;
  renderTopGrid();
  updateActiveFiltersBar();
  // Update live count
  const filtered = getFilteredSorted();
  updateLiveCount(filtered.length);
}

// Store active filter removers by index to avoid closure serialization
window._afRemove = [];
function updateActiveFiltersBar() {
  const bar = document.getElementById('activeFiltersBar');
  const chips = document.getElementById('activeFilterChips');
  if (!bar || !chips) return;
  window._afRemove = [];
  const active = [];
  // Category chip
  const _catLabels = { phones:'📱 Телефони', laptops:'💻 Лаптопи', desktops:'🖥 Настолни', gaming:'🎮 Гейминг', monitors:'🖥 Монитори', components:'⚙️ Компоненти', peripherals:'🖱 Периферия', network:'📡 Мрежово', storage:'💾 Сторидж', software:'📀 Софтуер', accessories:'🎒 Аксесоари' };
  if (currentFilter && currentFilter !== 'all') {
    const idx = window._afRemove.length;
    window._afRemove.push(() => {
      currentFilter = 'all';
      currentSubcat = 'all';
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      const allPill = document.querySelector('.filter-pill:first-of-type');
      if (allPill) allPill.classList.add('active');
      if (typeof renderSubcatBar === 'function') renderSubcatBar('all');
      if (typeof hideCatSpecFilters === 'function') hideCatSpecFilters();
      if (typeof bcOnFilterCat === 'function') bcOnFilterCat('all');
      topGridPage = 1;
      renderTopGrid();
      updateURL();
      updateActiveFiltersBar();
    });
    active.push({ label: _catLabels[currentFilter] || currentFilter, idx });
  }
  advFilterBrands.forEach(b => {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const cb=document.querySelector(`input[type=checkbox][value="${CSS.escape(b)}"]`); if(cb) cb.checked=false; advFilterBrands.delete(b); applyAdvFilters(); });
    active.push({ label: '🏷 '+b, idx });
  });
  if (advFilterRating > 0) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const r=document.querySelector('input[name="ratingFilter"][value="0"]'); if(r) r.checked=true; applyAdvFilters(); });
    active.push({ label:`⭐ ${advFilterRating}+`, idx });
  }
  if (advFilterSaleOnly) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const el=document.getElementById('saleOnlyToggle'); if(el) el.checked=false; applyAdvFilters(); });
    active.push({ label:'🔥 Само намалени', idx });
  }
  if (advFilterNewOnly) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const el=document.getElementById('newOnlyToggle'); if(el) el.checked=false; applyAdvFilters(); });
    active.push({ label:'🆕 Само нови', idx });
  }
  if (advFilterStockOnly) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const el=document.getElementById('stockOnlyToggle'); if(el) el.checked=false; applyAdvFilters(); });
    active.push({ label:'✓ В наличност', idx });
  }
  if (typeof advPriceMin!=='undefined' && (advPriceMin>0||advPriceMax<2000)) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { setPriceGroup(0,2000,'pg-all'); applyAdvFilters(); });
    active.push({ label:`💰 ${advPriceMin}€–${advPriceMax}€`, idx });
  }
  if (active.length === 0) { bar.classList.remove('show'); return; }
  bar.classList.add('show');
  chips.innerHTML = active.map(f =>
    `<span class="active-filter-chip" onclick="window._afRemove[${f.idx}]&&window._afRemove[${f.idx}]()">${f.label} ✕</span>`
  ).join('');
}

function resetAllFilters() {
  // Reset subcategory
  currentSubcat = 'all';
  if (typeof catSpecActiveFilters !== 'undefined') catSpecActiveFilters = {};
  const subcatBar = document.getElementById('subcatBar');
  if (subcatBar) { subcatBar.classList.remove('visible'); subcatBar.innerHTML = ''; }
  if (typeof hideCatSpecFilters === 'function') hideCatSpecFilters();
  document.querySelectorAll('#catSpecFiltersInner input[type=checkbox]').forEach(cb => cb.checked = false);
  advFilterBrands.clear();
  advFilterRating = 0;
  document.querySelectorAll('#brandFilterList input').forEach(c=>c.checked=false);
  const r0 = document.querySelector('input[name="ratingFilter"][value="0"]'); if(r0) r0.checked=true;
  const st = document.getElementById('stockOnlyToggle'); if(st) st.checked=false;
  const sa = document.getElementById('saleOnlyToggle'); if(sa) sa.checked=false;
  const nw = document.getElementById('newOnlyToggle'); if(nw) nw.checked=false;
  advFilterSaleOnly=false; advFilterNewOnly=false; advFilterStockOnly=false;
  // Reset price
  setPriceGroup(0, _sbPriceAbsMax || 2000, 'pg-all');
  clearBrandSearch();
  applyAdvFilters();
  // Clear URL params
  if (typeof updateURL === 'function') updateURL();
  updateSidebarFiltersVisibility();
}

// Adv filters applied inside getFilteredSorted directly (no override needed)

// Override filterCat to scroll + filter
function filterCat(cat) {
  const pill = document.querySelector(`.filter-pill[onclick*="'${cat}'"]`);
  if (pill) { applyFilter(pill, cat); }
  else { currentFilter = cat; currentSubcat = 'all'; renderTopGrid(); updateURL(); updateActiveFiltersBar(); }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
  if (typeof bcOnFilterCat === 'function') bcOnFilterCat(cat);
  // Dynamic meta
  if (typeof setPageMeta === 'function' && cat && cat !== 'all') {
    const label = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] : cat;
    setPageMeta(
      label + ' — Most Computers',
      'Купи ' + label + ' онлайн от Most Computers. Най-добри цени, гаранция, бърза доставка.'
    );
  } else if (typeof restorePageMeta === 'function' && (!cat || cat === 'all')) {
    restorePageMeta();
  }
  if (typeof injectCategoryItemList === 'function') injectCategoryItemList(cat);
}

// Init on load
// initSidebarFilters called in DOMContentLoaded

// Export for tests/environment detection

// syncFiltersToUrl е псевдоним на updateURL() — дефинирана по-долу в файла
function syncFiltersToUrl() { if (typeof updateURL === 'function') updateURL(); }

// ===== SIDEBAR PRICE SLIDER =====
let advPriceMin = 0, advPriceMax = 2000, activePriceGroup = 'pg-all';
let _sbPriceAbsMax = 2000; // обновява се динамично от initSidebarFilters
// EUR_RATE comes from currency.js

function updateSbSlider() {
  const mn = document.getElementById('sbPriceMin');
  const mx = document.getElementById('sbPriceMax');
  if (!mn || !mx) return;
  let minV = parseFloat(mn.value), maxV = parseFloat(mx.value);
  if (minV > maxV - 10) { minV = maxV - 10; mn.value = minV; }
  advPriceMin = minV; advPriceMax = maxV;

  // Update track fill
  const _absMax1 = _sbPriceAbsMax || 2000;
  const pct1 = (minV/_absMax1)*100, pct2 = (maxV/_absMax1)*100;
  const rng = document.getElementById('sbSliderRange');
  if (rng) { rng.style.left = pct1+'%'; rng.style.width = (pct2-pct1)+'%'; }

  // Update label
  const vals = document.getElementById('sbPriceVals');
  if (vals) vals.textContent = `${minV} € — ${maxV} €`;

  // Deactivate price group buttons
  document.querySelectorAll('.price-group-btn').forEach(b => b.classList.remove('active'));
  activePriceGroup = null;

  applyAdvFilters();
}

function setPriceGroup(minEur, maxEur, groupId) {
  advPriceMin = minEur; advPriceMax = maxEur;
  activePriceGroup = groupId;

  // Update sliders
  const mn = document.getElementById('sbPriceMin');
  const mx = document.getElementById('sbPriceMax');
  if (mn) mn.value = minEur;
  if (mx) mx.value = maxEur;

  // Update track
  const _absMax2 = _sbPriceAbsMax || 2000;
  const pct1 = (minEur/_absMax2)*100, pct2 = (maxEur/_absMax2)*100;
  const rng = document.getElementById('sbSliderRange');
  if (rng) { rng.style.left=pct1+'%'; rng.style.width=(pct2-pct1)+'%'; }

  // Update label
  const vals = document.getElementById('sbPriceVals');
  if (vals) vals.textContent = minEur === 0 && maxEur >= _sbPriceAbsMax ? 'Всички цени' : `${minEur} € — ${maxEur} €`;

  // Highlight active group
  document.querySelectorAll('.price-group-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(groupId);
  if (btn) btn.classList.add('active');

  applyAdvFilters();
}

function initPriceGroupCounts() {
  const ranges = [
    { id:'pgc-all', min:0,   max:999999 },
    { id:'pgc-1',   min:0,   max:102 },
    { id:'pgc-2',   min:102, max:256 },
    { id:'pgc-3',   min:256, max:511 },
    { id:'pgc-4',   min:511, max:999999 },
  ];
  ranges.forEach(r => {
    const el = document.getElementById(r.id);
    if (el) el.textContent = products.filter(p => {
      const eur = p.price / EUR_RATE;
      return eur >= r.min && eur < r.max;
    }).length;
  });
}

// ===== BRAND FUZZY SEARCH =====
function filterBrandList(query) {
  const q = query.trim().toLowerCase();
  const items = document.querySelectorAll('#brandFilterList .brand-filter-item');
  const clearBtn = document.getElementById('brandSearchClear');
  const noRes = document.getElementById('brandNoResults');
  if (clearBtn) clearBtn.classList.toggle('show', q.length > 0);

  let visCount = 0;
  items.forEach(item => {
    const brand = item.querySelector('span')?.textContent?.toLowerCase() || '';
    // Fuzzy: all query chars appear in order in brand name
    let matches = true;
    if (q.length > 0) {
      let bi = 0;
      for (let qi = 0; qi < q.length; qi++) {
        const found = brand.indexOf(q[qi], bi);
        if (found === -1) { matches = false; break; }
        bi = found + 1;
      }
      // Highlight match
      if (matches) {
        const span = item.querySelector('span');
        if (span) {
          const orig = span.dataset.orig || span.textContent;
          span.dataset.orig = orig;
          // Simple highlight: bold matching chars
          let result = '', bi2 = 0, origLow = orig.toLowerCase();
          for (let qi = 0; qi < q.length; qi++) {
            const found = origLow.indexOf(q[qi], bi2);
            if (found === -1) break;
            result += orig.slice(bi2, found) + `<mark style="background:var(--primary-light);color:var(--primary);border-radius:2px;padding:0 1px;">${orig[found]}</mark>`;
            bi2 = found + 1;
          }
          result += orig.slice(bi2);
          span.innerHTML = result;
        }
      }
    } else {
      // Clear highlights
      const span = item.querySelector('span');
      if (span && span.dataset.orig) { span.textContent = span.dataset.orig; }
    }
    item.style.display = matches ? '' : 'none';
    if (matches) visCount++;
  });

  if (noRes) noRes.classList.toggle('show', visCount === 0 && q.length > 0);
}

function clearBrandSearch() {
  const inp = document.getElementById('brandSearch');
  if (inp) { inp.value = ''; filterBrandList(''); inp.focus(); }
}

// ===== LIVE RESULTS COUNT =====
function updateLiveCount(count) {
  const total = products.length;
  const numEl = document.getElementById('srcNum');
  const barEl = document.getElementById('srcBarFill');
  if (numEl) numEl.textContent = count;
  if (barEl) barEl.style.width = total > 0 ? Math.round((count/total)*100)+'%' : '0%';
}



// ===== SUBCATEGORIES & CATEGORY-SPECIFIC FILTERS =====

let currentSubcat = 'all'; // subcat filter value
let catSpecActiveFilters = {}; // { specKey: Set(values) }

// Subcategory definitions
const SUBCATS = {
  phones: [
    { id: 'smartphone',   label: '📱 Смартфони' },
    { id: 'tablet',       label: '📟 Таблети' },
    { id: 'smartwatch',   label: '⌚ Смарт часовници' },
  ],
  laptops: [
    { id: 'work',         label: '💼 За работа' },
    { id: 'gaming_l',     label: '🎮 За гейминг' },
    { id: 'ultrabook',    label: '✈ Ултрабуци' },
    { id: 'budget',       label: '💰 Бюджетни' },
    { id: 'convertible',  label: '🔄 2-в-1' },
    { id: 'for_students', label: '🎓 За студенти' },
    { id: 'for_devs',     label: '👨‍💻 За програмисти' },
    { id: 'for_design',   label: '🎨 За дизайнери' },
    { id: 'for_gaming',   label: '🕹 За игри' },
  ],
  desktops: [
    { id: 'office_pc',    label: '💼 Офис компютри' },
    { id: 'workstation',  label: '🔬 Workstation' },
    { id: 'aio',          label: '🖥 All-in-One' },
    { id: 'mac_desktop',  label: '🍎 Mac' },
  ],
  gaming: [
    { id: 'gaming_laptop_s', label: '💻 Геймърски лаптопи' },
    { id: 'gaming_pc_s',     label: '🖥 Геймърски конфигурации' },
    { id: 'gaming_mouse',    label: '🖱 Геймърски мишки' },
    { id: 'gaming_kb',       label: '⌨ Геймърски клавиатури' },
    { id: 'gaming_headset',  label: '🎧 Геймърски слушалки' },
  ],
  monitors: [
    { id: 'gaming_mon',   label: '🎮 Gaming 144Hz+' },
    { id: 'mon_4k',       label: '🔭 4K / UHD' },
    { id: 'oled_mon',     label: '✨ OLED' },
    { id: 'ultrawide',    label: '↔️ UltraWide' },
    { id: 'office_mon',   label: '💼 Офис монитори' },
    { id: 'tv',           label: '📺 Телевизори' },
  ],
  components: [
    { id: 'cpu',         label: '⚙ Процесори' },
    { id: 'gpu',         label: '🎮 Видео карти' },
    { id: 'ram',         label: '🧠 RAM памет' },
    { id: 'ssd_hdd',     label: '💿 SSD / HDD дискове' },
    { id: 'ssd',         label: '💿 SSD / NVMe' },
    { id: 'hdd',         label: '💾 HDD дискове' },
    { id: 'motherboard', label: '🔩 Дънни платки' },
    { id: 'psu',         label: '⚡ Захранвания' },
    { id: 'case_cooling',label: '❄ Кутии и охлаждане' },
    { id: 'case',        label: '🗄 Кутии' },
    { id: 'cooling',     label: '❄ Охлаждане' },
  ],
  peripherals: [
    { id: 'keyboard',     label: '⌨ Клавиатури' },
    { id: 'mouse',        label: '🖱 Мишки' },
    { id: 'headphones',   label: '🎧 Слушалки' },
    { id: 'webcam',       label: '📷 Уеб камери' },
    { id: 'printer',      label: '🖨 Принтери' },
  ],
  network: [
    { id: 'router',   label: '📡 Рутери' },
    { id: 'mesh',     label: '🕸️ Mesh системи' },
    { id: 'switch',   label: '🔀 Суичове' },
    { id: 'ap',       label: '📶 Access Points' },
    { id: 'adapter',  label: '🔌 WiFi адаптери' },
    { id: 'outdoor',  label: '🏔️ Outdoor CPE' },
    { id: 'sfp',      label: '🔗 SFP модули' },
    { id: 'cable',    label: '🔗 Мрежови кабели' },
  ],
  storage: [
    { id: 'nas',          label: '🗄 NAS устройства' },
    { id: 'server',       label: '🖥 Сървъри' },
    { id: 'ext_drive',    label: '💾 Външни дискове' },
    { id: 'flash',        label: '📱 Флаш памет' },
  ],
  accessories: [
    { id: 'projector',    label: '🎥 Проектори' },
    { id: 'smart_dev',    label: '⌚ Смарт устройства' },
    { id: 'chair',        label: '🪑 Gaming столове' },
    { id: 'controller',   label: '🎮 Контролери' },
    { id: 'hub',          label: '🔌 USB хъбове и зарядни' },
    { id: 'bag',          label: '🎒 Чанти и калъфи' },
    { id: 'av',           label: '🔊 Тонколони и AV' },
  ],
};

// Mega-menu flyout data: category → columns → items
const MEGA_MENU = {
  phones: [
    { title: 'Смартфони', id: 'smartphone', items: ['Apple iPhone', 'Samsung Galaxy', 'Google Pixel', 'Xiaomi'] },
    { title: 'Таблети', id: 'tablet', items: ['Apple iPad', 'Samsung Galaxy Tab', 'Android таблети'] },
    { title: 'Смарт часовници', id: 'smartwatch', items: ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'Fitbit'] },
  ],
  laptops: [
    { title: 'По предназначение', id: 'work', items: ['За работа', 'За гейминг', 'Ултрабуци', 'Workstation'] },
    { title: 'По марка', id: 'ultrabook', items: ['Apple MacBook', 'Dell XPS', 'ASUS ROG', 'Lenovo ThinkPad', 'HP EliteBook'] },
    { title: 'По бюджет', id: 'budget', items: ['До 500 €', '500–800 €', '800–1500 €', '1500 €+'] },
    { title: 'Use-case', id: 'for_students', items: ['За студенти', 'За програмисти', 'За дизайнери', 'За игри'] },
  ],
  desktops: [
    { title: 'Офис и Workstation', id: 'office_pc', items: ['Офис компютри', 'Workstation', 'Mac Mini / iMac', 'All-in-One'] },
    { title: 'По марка', id: 'mac_desktop', items: ['Apple', 'ASUS', 'Dell', 'HP', 'Lenovo'] },
  ],
  gaming: [
    { title: 'Геймърски лаптопи', id: 'gaming_laptop_s', items: ['ASUS ROG', 'Razer Blade', 'MSI Titan', 'Lenovo Legion'] },
    { title: 'Геймърски PC', id: 'gaming_pc_s', items: ['RTX 4070', 'RTX 4080 / 4090', 'AMD Radeon RX 7000', 'Готови конфигурации'] },
    { title: 'Периферия', id: 'gaming_mouse', items: ['Геймърски мишки', 'Механични клавиатури', 'Геймърски слушалки'] },
  ],
  monitors: [
    { title: 'Gaming монитори', id: 'gaming_mon', items: ['144Hz FHD', '144Hz QHD', '165Hz', '240Hz', '360Hz', 'G-Sync / FreeSync'] },
    { title: 'По резолюция', id: 'mon_4k', items: ['4K UHD 3840×2160', 'QHD 2560×1440', 'Full HD 1920×1080', 'WUXGA 1920×1200'] },
    { title: 'По технология', id: 'oled_mon', items: ['OLED монитори', 'IPS панели', 'VA панели', 'UltraWide 21:9', 'Curved'] },
    { title: 'Телевизори', id: 'tv', items: ['Smart TV 24-27"', 'Smart TV 32"', 'Smart TV 40-55"', 'QLED TV', '4K UHD TV'] },
  ],
  components: [
    { title: 'Процесори', id: 'cpu', items: ['Intel Core i5/i7/i9', 'Intel Core Ultra', 'AMD Ryzen 5/7/9', 'AMD Threadripper'] },
    { title: 'Видео карти', id: 'gpu', items: ['NVIDIA GeForce RTX 40', 'AMD Radeon RX 7000', 'Работни карти'] },
    { title: 'Памет', id: 'ram', items: ['DDR5 RAM', 'DDR4 RAM', 'SO-DIMM лаптоп'] },
    { title: 'Дискове', id: 'ssd_hdd', items: ['SSD M.2 NVMe', 'SSD SATA', 'HDD 2.5"', 'HDD 3.5"'] },
    { title: 'Дъно и корпус', id: 'motherboard', items: ['Intel LGA1851', 'Intel LGA1700', 'AMD AM5', 'AMD AM4', 'Захранвания', 'Кутии'] },
  ],
  peripherals: [
    { title: 'Въвеждане', id: 'keyboard', items: ['Механични клавиатури', 'Офис мишки', 'Trackpad', 'Геймпадове'] },
    { title: 'Аудио и видео', id: 'headphones', items: ['Слушалки', 'Тонколони', 'Уеб камери', 'Принтери'] },
  ],
  network: [
    { title: 'Рутери', id: 'router', items: ['WiFi 7', 'WiFi 6E', 'WiFi 6', 'Gaming рутери', 'ADSL/VDSL', '4G LTE'] },
    { title: 'Mesh и AP', id: 'mesh', items: ['Mesh системи', 'Asus ZenWiFi', 'Tenda Nova/MW', 'Access Points', 'Range Extenders'] },
    { title: 'Суичове', id: 'switch', items: ['5 порта', '8 порта', '16 порта', '24+ порта', 'PoE суичове', 'Managed'] },
    { title: 'Адаптери и SFP', id: 'adapter', items: ['USB WiFi адаптери', 'USB LAN адаптери', '2.5G / 10G карти', 'SFP модули', 'Outdoor CPE'] },
  ],
  storage: [
    { title: 'Сторидж', id: 'nas', items: ['NAS устройства', 'Сървъри', 'Rack системи'] },
    { title: 'Носители', id: 'ext_drive', items: ['Портативни SSD', 'Портативни HDD', 'USB Flash', 'SD карти'] },
  ],
  accessories: [
    { title: 'Проектори', id: 'projector', items: ['Full HD проектори', '4K проектори', 'Лазерни проектори', 'Мини проектори', 'Бизнес проектори'] },
    { title: 'Смарт устройства', id: 'smart_dev', items: ['Смарт часовници', 'Фитнес тракери', 'Смарт говорители', 'Смарт лампи', 'Умен дом'] },
    { title: 'Gaming аксесоари', id: 'chair', items: ['Gaming столове', 'Контролери', 'Геймпадове', 'Рулета и джойстици'] },
    { title: 'Аксесоари', id: 'hub', items: ['USB хъбове', 'Зарядни устройства', 'Чанти за лаптоп', 'Тонколони'] },
  ],
};

// Category-specific spec filters

const CAT_SPEC_FILTERS = {
  phones: [
    { key: 'OS',       label: '📱 Операционна система', values: ['iOS','Android'] },
    { key: 'RAM',      label: '🧠 RAM',                 values: ['6 GB','8 GB','12 GB','16 GB'] },
    { key: 'Storage',  label: '💾 Памет',               values: ['128 GB','256 GB','512 GB','1 TB'] },
    { key: 'Display',  label: '📐 Диагонал',            values: ['6"','6.1"','6.7"','11"','13"'] },
  ],
  gaming: [
    { key: 'Type',  label: '📦 Тип',                    values: ['Лаптоп','Настолен','Мишка','Клавиатура','Слушалки'] },
    { key: 'GPU',   label: '🎮 Видео карта',            values: ['RTX 4060','RTX 4070','RTX 4080','RTX 4090','RX 7900'] },
    { key: 'RAM',   label: '🧠 Оперативна памет',       values: ['16 GB','32 GB','64 GB'] },
  ],
  monitors: [
    { key: 'Панел',     label: '🖥 Тип панел',  values: ['IPS','VA','OLED','TN'] },
    { key: 'Резолюция', label: '🔍 Резолюция',  values: ['FHD 1920×1080','QHD 2560×1440','4K 3840×2160','WUXGA 1920×1200','UltraWide'] },
    { key: 'Честота',   label: '⚡ Честота',     values: ['60Hz','75Hz','100Hz','120Hz','144Hz','165Hz','180Hz','240Hz','360Hz'] },
    { key: 'Размер',    label: '📐 Диагонал',   values: ['23"','24"','27"','31.5"','32"','34"','40"+'] },
  ],
  laptops: [
    { key: 'CPU',     label: '💻 Процесор',            values: ['Intel Core i5','Intel Core i7','Intel Core i9','Intel Core Ultra','AMD Ryzen 5','AMD Ryzen 7','AMD Ryzen 9'] },
    { key: 'RAM',     label: '🧠 Оперативна памет',    values: ['8 GB','16 GB','24 GB','32 GB','64 GB'] },
    { key: 'GPU',     label: '🎮 Видео карта',         values: ['RTX 4050','RTX 4060','RTX 4070','RTX 4080','RTX 4090','Integrated'] },
    { key: 'Display', label: '📐 Диагонал',            values: ['13"','14"','15.6"','16"','17"'] },
    { key: 'OS',      label: '🪟 Операционна система', values: ['Windows 11','macOS','Linux','Без OS'] },
  ],
  desktops: [
    { key: 'CPU',     label: '💻 Процесор',            values: ['Intel Core i5','Intel Core i7','Intel Core i9','AMD Ryzen 7','AMD Ryzen 9'] },
    { key: 'RAM',     label: '🧠 Оперативна памет',    values: ['16 GB','32 GB','64 GB','128 GB'] },
    { key: 'GPU',     label: '🎮 Видео карта',         values: ['RTX 4070','RTX 4080','RTX 4090','AMD Radeon','Интегрирана'] },
    { key: 'OS',      label: '🪟 Операционна система', values: ['Windows 11','macOS','Без OS'] },
  ],
  components: [
    { key: 'Тип',      label: '📦 Тип компонент',     values: ['Процесор','Видеокарта','Дънна платка','RAM','SSD NVMe','HDD','Захранване','Кутия','Охлаждане'] },
    { key: 'Brand',    label: '🏷 Производител',      values: ['Intel','AMD','ASUS','MSI','Gigabyte','ASRock','Sapphire','Palit','PowerColor','Zotac'] },
    { key: 'Socket',   label: '🔩 Сокет / Слот',      values: ['LGA1851','LGA1700','LGA1200','AM5','AM4','DDR5','DDR4','PCIe 5.0','PCIe 4.0'] },
    { key: 'TDP',      label: '🌡 TDP / Мощност',     values: ['35 W','45 W','65 W','95 W','105 W','125 W','165 W','250 W','320 W'] },
  ],
  peripherals: [
    { key: 'Type',        label: '📦 Тип',             values: ['Монитор','Клавиатура','Мишка','Слушалки','Уеб камера','Принтер'] },
    { key: 'Resolution',  label: '🔍 Резолюция',       values: ['Full HD 1080p','QHD 1440p','4K UHD','Ultra-Wide'] },
    { key: 'RefreshRate', label: '⚡ Честота',         values: ['60 Hz','144 Hz','165 Hz','240 Hz+','360 Hz'] },
    { key: 'Panel',       label: '🖥 Тип панел',       values: ['IPS','VA','OLED','Mini-LED'] },
    { key: 'Connection',  label: '🔗 Връзка',          values: ['USB','Bluetooth','Безжична','2.4GHz'] },
  ],
  network: [
    { key: 'WiFi',  label: '📡 WiFi стандарт', values: ['WiFi 4','WiFi 5','WiFi 6','WiFi 6E','WiFi 7'] },
    { key: 'Ports', label: '🔌 Портове',        values: ['4 порта','5 порта','8 порта','16 порта','24 порта','PoE'] },
    { key: 'Type',  label: '📦 Тип устройство', values: ['Рутер','Mesh нод','Суич','Access Point','USB адаптер','Outdoor CPE','SFP модул','Кабел'] },
  ],
  storage: [
    { key: 'Type',      label: '💾 Тип',               values: ['NAS','Сървър','Портативен SSD','Портативен HDD','USB Flash','SD карта'] },
    { key: 'Capacity',  label: '📦 Капацитет',         values: ['256 GB','512 GB','1 TB','2 TB','4 TB','8 TB+'] },
    { key: 'Interface', label: '🔌 Интерфейс',         values: ['USB-C','USB-A','Thunderbolt','Ethernet'] },
  ],
  accessories: [
    { key: 'Тип',       label: '⚙ Вид аксесоар',         values: ['Проектор','Смарт часовник','Фитнес тракер','Gaming стол','Контролер','USB хъб','Чанта'] },
    { key: 'Резолюция', label: '🔍 Резолюция (проектор)', values: ['4K UHD','Full HD','WXGA','XGA','SVGA'] },
    { key: 'WiFi',      label: '📡 WiFi',                 values: ['Да'] },
    { key: 'Връзка',    label: '📡 Връзка',               values: ['Bluetooth','Безжична','Кабелна'] },
  ],
};

// Subcat-specific spec filters (shown when a subcat pill is active)
const SUBCAT_SPEC_FILTERS = {
  cpu: [
    { key: 'Серия',    label: '📋 Серия',                values: ['Ryzen 9','Ryzen 7','Ryzen 5','Ryzen 3','Core i9','Core i7','Core i5','Core i3','Core Ultra'] },
    { key: 'Сокет',   label: '🔩 Сокет',                values: ['LGA1851','LGA1700','LGA1200','AM5','AM4'] },
    { key: 'Ядра',    label: '🧮 Брой ядра',            values: ['4 ядра','6 ядра','8 ядра','10 ядра','12 ядра','16 ядра','20 ядра','24 ядра'] },
    { key: 'TDP',     label: '🌡 TDP',                  values: ['35 W','45 W','65 W','95 W','105 W','125 W','170 W'] },
    { key: 'iGPU',    label: '🖥 Интегрирана графика',  values: ['С iGPU','Без iGPU'] },
    { key: 'Опаковка',label: '📦 Опаковка',             values: ['BOX','TRAY','MPK'] },
  ],
  gpu: [
    { key: 'Памет', label: '💾 Видео памет',  values: ['4 GB','6 GB','8 GB','10 GB','12 GB','16 GB','24 GB'] },
    { key: 'Слот',  label: '🔌 Интерфейс',   values: ['PCI-E 5.0','PCI-E 4.0','PCI-E 3.0'] },
  ],
  motherboard: [
    { key: 'Сокет',       label: '🔩 Сокет',       values: ['AM5','AM4','LGA1851','LGA1700','LGA1200'] },
    { key: 'Форм фактор', label: '📐 Форм фактор', values: ['ATX','Micro-ATX','Mini-ITX'] },
    { key: 'Памет',       label: '🧠 Вид RAM',      values: ['DDR5','DDR4'] },
    { key: 'WiFi',        label: '📡 WiFi',         values: ['WiFi 7','WiFi 6E','WiFi 6'] },
  ],
  ram: [
    { key: 'Тип',        label: '💾 Тип памет',    values: ['DDR5','DDR4','DDR3','DDR3L'] },
    { key: 'Капацитет',  label: '📦 Капацитет',    values: ['8 GB','16 GB','32 GB','64 GB'] },
    { key: 'Честота',    label: '⚡ Честота',       values: ['3200 MHz','3600 MHz','4800 MHz','5200 MHz','5600 MHz','6000 MHz','6400 MHz'] },
    { key: 'Форм фактор',label: '💻 Форм фактор',  values: ['DIMM','SO-DIMM'] },
  ],
  ssd: [
    { key: 'Интерфейс',  label: '🔌 Интерфейс',    values: ['NVMe PCIe Gen4','NVMe PCIe Gen3','SATA III'] },
    { key: 'Капацитет',  label: '📦 Капацитет',    values: ['120 GB','240 GB','250 GB','256 GB','480 GB','500 GB','512 GB','1 TB','2 TB','4 TB'] },
    { key: 'Форм фактор',label: '📐 Форм фактор',  values: ['M.2 2280','M.2 2242','2.5"'] },
  ],
  hdd: [
    { key: 'Капацитет',  label: '📦 Капацитет',    values: ['500 GB','1 TB','2 TB','4 TB','6 TB','8 TB','10 TB'] },
    { key: 'RPM',        label: '🌀 RPM',           values: ['5400','7200'] },
    { key: 'Форм фактор',label: '📐 Форм фактор',  values: ['3.5"','2.5"'] },
  ],
  keyboard: [
    { key: 'Връзка',    label: '📡 Връзка',         values: ['Кабелна','Безжична','Bluetooth'] },
    { key: 'Тип',       label: '⌨ Тип превключвател', values: ['Механична','Мембранна'] },
    { key: 'Подредба',  label: '🌐 Подредба',       values: ['BG (Кирилица)','US'] },
    { key: 'Подсветка', label: '💡 Подсветка',      values: ['RGB','Да'] },
  ],
  mouse: [
    { key: 'Връзка',  label: '📡 Връзка',           values: ['Кабелна','Безжична','Bluetooth','Безжична + BT'] },
    { key: 'Сензор',  label: '🎯 Сензор',           values: ['Оптичен','Лазерен'] },
    { key: 'Gaming',  label: '🎮 Gaming',            values: ['Да'] },
  ],
  headphones: [
    { key: 'Тип',      label: '🎧 Тип',              values: ['Слушалки','Тапи','Тонколони'] },
    { key: 'Връзка',   label: '📡 Връзка',           values: ['Кабелна','Bluetooth','Кабелна + BT'] },
    { key: 'Микрофон', label: '🎙 Микрофон',         values: ['Да'] },
    { key: 'Gaming',   label: '🎮 Gaming',            values: ['Да'] },
  ],
  projector: [
    { key: 'Резолюция', label: '🔍 Резолюция',       values: ['4K UHD','Full HD','WXGA','XGA','SVGA'] },
    { key: 'Яркост',    label: '💡 Яркост',          values: ['1000 lm','1500 lm','3000 lm','3500 lm','4000 lm','4500 lm','5000 lm','6000 lm'] },
    { key: 'Тип',       label: '⚙ Технология',       values: ['Лазерен','LED','DLP'] },
    { key: 'WiFi',      label: '📡 WiFi',             values: ['Да'] },
  ],
  chair: [
    { key: 'Материал', label: '🪑 Материал', values: ['Mesh','Плат'] },
  ],
  controller: [
    { key: 'Връзка', label: '📡 Връзка', values: ['Безжичен','Кабелен'] },
  ],
  smart_dev: [
    { key: 'Тип',    label: '⌚ Вид устройство',  values: ['Смарт часовник','Фитнес тракер','Смарт говорител','Таблет'] },
    { key: 'Връзка', label: '📡 Свързаност',      values: ['Bluetooth','WiFi','4G/LTE'] },
    { key: 'ОС',     label: '💻 Операционна система', values: ['Android','Wear OS','iOS','Независима'] },
  ],
  // Monitor subcats
  gaming_mon: [
    { key: 'Честота',   label: '⚡ Честота',     values: ['144Hz','165Hz','180Hz','200Hz','240Hz','360Hz'] },
    { key: 'Панел',     label: '🖥 Панел',        values: ['IPS','VA','OLED','TN'] },
    { key: 'Резолюция', label: '🔍 Резолюция',   values: ['FHD 1920×1080','QHD 2560×1440','4K 3840×2160'] },
    { key: 'Размер',    label: '📐 Диагонал',     values: ['24"','27"','32"','34"'] },
  ],
  mon_4k: [
    { key: 'Размер',    label: '📐 Диагонал',    values: ['27"','32"','34"','40"+'] },
    { key: 'Панел',     label: '🖥 Панел',        values: ['IPS','VA','OLED'] },
    { key: 'Честота',   label: '⚡ Честота',      values: ['60Hz','120Hz','144Hz','160Hz'] },
  ],
  oled_mon: [
    { key: 'Размер',    label: '📐 Диагонал',    values: ['27"','34"','45"','49"'] },
    { key: 'Честота',   label: '⚡ Честота',      values: ['120Hz','144Hz','165Hz','240Hz'] },
    { key: 'Резолюция', label: '🔍 Резолюция',   values: ['FHD 1920×1080','QHD 2560×1440','4K 3840×2160','UltraWide'] },
  ],
  office_mon: [
    { key: 'Размер',    label: '📐 Диагонал',    values: ['23"','24"','27"','32"'] },
    { key: 'Панел',     label: '🖥 Панел',        values: ['IPS','VA'] },
    { key: 'Резолюция', label: '🔍 Резолюция',   values: ['FHD 1920×1080','QHD 2560×1440','WUXGA 1920×1200'] },
  ],
  tv: [
    { key: 'Размер',    label: '📐 Диагонал',    values: ['24"','27"','32"','40"','43"','50"','55"'] },
    { key: 'Резолюция', label: '🔍 Резолюция',   values: ['Full HD','4K UHD','QLED'] },
  ],
  // Network subcats
  router: [
    { key: 'WiFi',  label: '📡 WiFi стандарт', values: ['WiFi 7','WiFi 6E','WiFi 6','WiFi 5','4G LTE'] },
    { key: 'Band',  label: '📻 Диапазони',      values: ['Tri-band','Dual-band','Single-band'] },
    { key: 'Speed', label: '⚡ Скорост',         values: ['AXE7800+','AX6000+','AX3000+','AX1800','AC1200','AC1000'] },
  ],
  mesh: [
    { key: 'WiFi',  label: '📡 WiFi стандарт', values: ['WiFi 7','WiFi 6E','WiFi 6','WiFi 5'] },
    { key: 'Pack',  label: '📦 Брой нодове',   values: ['1 нод','2 нода','3 нода'] },
    { key: 'Band',  label: '📻 Диапазони',      values: ['Tri-band','Dual-band'] },
  ],
  switch: [
    { key: 'Ports', label: '🔌 Брой портове', values: ['4 порта','5 порта','8 порта','16 порта','24 порта'] },
    { key: 'Speed', label: '⚡ Скорост',        values: ['Gigabit','Fast Ethernet (100M)','10 Gigabit'] },
    { key: 'PoE',   label: '⚡ PoE захранване', values: ['PoE','PoE+'] },
  ],
  adapter: [
    { key: 'Type',  label: '📦 Тип',         values: ['USB WiFi','USB Ethernet','PCIe карта','Bluetooth'] },
    { key: 'Speed', label: '⚡ Скорост',      values: ['300 Mbps','650 Mbps','900 Mbps','2.5 Gbps','10 Gbps'] },
    { key: 'WiFi',  label: '📡 WiFi',         values: ['WiFi 6','WiFi 5','WiFi 4'] },
  ],
};

function renderSubcatBar(cat) {
  const bar = document.getElementById('subcatBar');
  if (!bar) return;
  const subs = SUBCATS[cat];
  if (!subs || !subs.length) {
    bar.classList.remove('visible');
    bar.innerHTML = '';
    currentSubcat = 'all';
    return;
  }
  bar.classList.add('visible');
  bar.innerHTML =
    `<button type="button" class="subcat-pill active" onclick="applySubcat('all', this)">Всички</button>` +
    subs.map(s =>
      `<button type="button" class="subcat-pill" onclick="applySubcat('${s.id}', this)">${s.label}</button>`
    ).join('');
  currentSubcat = 'all';
}

function applySubcat(id, btn) {
  currentSubcat = id;
  document.querySelectorAll('.subcat-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (typeof renderCatSpecFilters === 'function' && currentFilter && currentFilter !== 'all')
    renderCatSpecFilters(currentFilter, id);
  renderTopGrid();
}

function renderCatSpecFilters(cat, subcat) {
  const block = document.getElementById('catSpecFilterBlock');
  const inner = document.getElementById('catSpecFiltersInner');
  const title = document.getElementById('catSpecTitle');
  if (!block || !inner) return;

  catSpecActiveFilters = {};
  let specs = (subcat && subcat !== 'all' && SUBCAT_SPEC_FILTERS[subcat])
    ? SUBCAT_SPEC_FILTERS[subcat]
    : CAT_SPEC_FILTERS[cat];
  if (cat === 'components') specs = [];
  if (!specs || !specs.length) {
    block.style.display = 'none';
    return;
  }

  const subcatLabels = { cpu:'Процесори', gpu:'Видео карти', motherboard:'Дънни платки', ram:'RAM памет', ssd:'SSD / NVMe', hdd:'HDD дискове' };
  const titleText = (subcat && subcat !== 'all' && subcatLabels[subcat])
    ? `⚙ ${subcatLabels[subcat]} — филтри`
    : `⚙ ${CAT_LABELS[cat] || cat} — филтри`;
  if (title) title.textContent = titleText;

  inner.innerHTML = specs.map(spec => `
    <div class="csf-block">
      <div class="csf-title">${spec.label}</div>
      <div class="csf-options">
        ${spec.values.map(val => `
          <label class="csf-opt">
            <input type="checkbox" onchange="toggleCatSpecFilter('${spec.key}', '${val}', this.checked)">
            <span>${val}</span>
          </label>`).join('')}
      </div>
    </div>`).join('');

  block.style.display = '';
}

function toggleCatSpecFilter(key, val, checked) {
  if (!catSpecActiveFilters[key]) catSpecActiveFilters[key] = new Set();
  if (checked) catSpecActiveFilters[key].add(val);
  else {
    catSpecActiveFilters[key].delete(val);
    if (!catSpecActiveFilters[key].size) delete catSpecActiveFilters[key];
  }
  renderTopGrid();
}

function hideCatSpecFilters() {
  const block = document.getElementById('catSpecFilterBlock');
  if (block) block.style.display = 'none';
  catSpecActiveFilters = {};
}

// Subcat filtering logic — maps subcat ID to product spec matching
function matchesSubcat(p, subcat) {
  if (subcat === 'all') return true;
  if (p.subcat === subcat) return true;

  // Products with a known component subcat: block cross-subcat false positives.
  // Broad name-based rules (e.g. ' w ' matching CPUs for psu, 'ddr4' matching CPUs for ram)
  // would otherwise show wrong products. Products without p.subcat fall through to name-based rules.
  const _knownCompSubcats = ['cpu','gpu','ram','ssd','hdd','motherboard','psu','case','cooling'];
  const _compGroups = { ssd_hdd: ['ssd','hdd'], case_cooling: ['case','cooling'] };
  if (_knownCompSubcats.includes(p.subcat)) {
    const groupMembers = _compGroups[subcat];
    if (groupMembers) return groupMembers.includes(p.subcat); // ssd_hdd, case_cooling
    if (_knownCompSubcats.includes(subcat)) return false;     // wrong component type
  }

  const name  = (p.name  || '').toLowerCase();
  const desc  = (p.desc  || '').toLowerCase();
  const brand = (p.brand || '').toLowerCase();
  const specsStr = Object.values(p.specs || {}).join(' ').toLowerCase();
  const all = name + ' ' + desc + ' ' + specsStr;

  const rules = {
    // Phones
    smartphone:      () => all.includes('iphone') || all.includes('galaxy s') || all.includes('pixel') || all.includes('xiaomi') || all.includes('смартфон') || (p.emoji === '📱'),
    tablet:          () => all.includes('ipad') || all.includes('galaxy tab') || all.includes('таблет') || all.includes('tablet') || (p.emoji === '📟'),
    smartwatch:      () => all.includes('watch') || all.includes('часов') || all.includes('band') || (p.emoji === '⌚'),
    // Laptops
    work:          () => all.includes('business') || all.includes('thinkpad') || all.includes('latitude') || all.includes('elitebook') || all.includes('бизнес') || all.includes('xps'),
    gaming_l:      () => all.includes('gaming') || all.includes('rog') || all.includes('rtx') || all.includes('геймърски') || all.includes('republic of gamers'),
    ultrabook:     () => all.includes('ultra') || all.includes('air') || all.includes('slim') || p.price < 3000,
    budget:        () => (p.price / (typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583)) < 500,
    convertible:   () => all.includes('2-in-1') || all.includes('2 в 1') || all.includes('convertible') || all.includes('flip') || all.includes('surface pro') || all.includes('yoga'),
    for_students:  () => (p.price / (typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583)) < 700 || all.includes('student') || all.includes('студент') || all.includes('chromebook'),
    for_devs:      () => all.includes('thinkpad') || all.includes('xps') || all.includes('macbook pro') || all.includes('linux') || all.includes('програмист'),
    for_design:    () => all.includes('macbook') || all.includes('design') || all.includes('creator') || all.includes('дизайн') || all.includes('retina') || all.includes('4k display'),
    for_gaming:    () => all.includes('gaming') || all.includes('rtx') || all.includes('rog') || all.includes('rx 6') || all.includes('rx 7'),
    // Desktops
    office_pc:     () => all.includes('office') || all.includes('офис') || all.includes('business') || (p.price/(typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583) < 800 && !all.includes('gaming')),
    workstation:   () => all.includes('workstation') || all.includes('xeon') || all.includes('quadro') || p.price > 4000,
    aio:           () => all.includes('all-in-one') || all.includes('aio') || all.includes('imac') || all.includes('моноблок'),
    mac_desktop:   () => brand === 'apple' || all.includes('mac mini') || all.includes('imac') || all.includes('mac studio') || all.includes('mac pro'),
    // Gaming
    gaming_laptop_s: () => all.includes('laptop') || all.includes('лаптоп') || all.includes('notebook') || (p.emoji === '💻'),
    gaming_pc_s:     () => all.includes('desktop') || all.includes('настолен') || all.includes('tower') || all.includes('gaming desktop') || (p.emoji === '🖥' && !all.includes('monitor')),
    gaming_mouse:    () => all.includes('mouse') || all.includes('мишк') || (p.emoji === '🖱'),
    gaming_kb:       () => all.includes('keyboard') || all.includes('клавиатур') || (p.emoji === '⌨'),
    gaming_headset:  () => all.includes('headset') || all.includes('headphone') || all.includes('слушалк') || (p.emoji === '🎧'),
    // Monitors
    tv:         () => p.subcat === 'tv' || all.includes(' tv ') || all.match(/^tv /) || all.includes('qled') || all.includes('smart tv') || all.includes('телевизор'),
    gaming_mon: () => p.subcat === 'gaming_mon' || (all.includes('hz') && parseInt(all.match(/(\d+)hz/)?.[1]||0) >= 144),
    mon_4k:     () => p.subcat === 'mon_4k' || all.includes('4k') || all.includes('uhd') || all.includes('3840') || all.includes('4к'),
    ultrawide:  () => p.subcat === 'ultrawide' || all.includes('ultrawide') || all.includes('ultra-wide') || all.includes('21:9') || all.includes('32:9'),
    oled_mon:   () => p.subcat === 'oled_mon' || all.includes('oled'),
    office_mon: () => p.subcat === 'office_mon' || (!all.includes('gaming') && !all.includes('oled') && !all.includes(' tv ') && (p.price / (typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583)) < 600),
    monitor:    () => (normalizeCat(p.cat) === 'peripherals' || p.cat === 'monitors') && (all.includes('монитор') || all.includes('monitor') || (all.includes('hz') && (all.includes('ips') || all.includes('oled') || all.includes('va') || all.includes('qhd') || all.includes('4k') || all.includes('1440')))),
    // Components
    cpu:           () => all.includes('процесор') || all.includes('processor') || all.includes('cpu') || all.includes('ryzen') || all.includes('core i') || all.includes('core ultra'),
    gpu:           () => all.includes('видеокарт') || all.includes('gpu') || all.includes('geforce') || all.includes('radeon') || all.includes('rtx') || all.includes('rx 6') || all.includes('rx 7') || all.includes('arc'),
    ram:           () => all.includes(' ram') || all.includes('памет') || all.includes('ddr4') || all.includes('ddr5') || all.includes('dimm') || all.includes('sodimm'),
    ssd_hdd:       () => p.subcat === 'ssd' || p.subcat === 'hdd' || all.includes('ssd') || all.includes('hdd') || all.includes('nvme') || all.includes('диск'),
    ssd:           () => all.includes('ssd') || all.includes('nvme') || all.includes('m.2') || all.includes('solid state'),
    hdd:           () => (all.includes('hdd') || all.includes('hard drive') || all.includes('твърд диск') || all.includes(' hd ')) && !all.includes('ssd') && !all.includes('nvme'),
    motherboard:   () => all.includes('дънна') || all.includes('motherboard') || all.includes('mainboard') || all.includes('платка'),
    psu:           () => all.includes('захранван') || all.includes('psu') || all.includes('power supply') || all.includes('watt'),
    gaming_pc:     () => all.includes('desktop') || all.includes('настолен') || all.includes('tower') || all.includes('gaming desktop') || (p.emoji === '🖥' && !all.includes('monitor')),
    case_cooling:  () => all.includes('кутия') || all.includes('chassis') || all.includes('case') || all.includes('охлади') || all.includes('cooler') || all.includes('cooling'),
    case:          () => all.includes('кутия') || all.includes('chassis') || (all.includes('case') && !all.includes('cooler') && !all.includes('cooling')),
    cooling:       () => all.includes('охлади') || all.includes('cooler') || all.includes('cooling') || all.includes('fan') || all.includes('вентилатор') || all.includes('water cool') || all.includes('aio cooler'),
    // Peripherals
    keyboard:      () => all.includes('клавиатур') || all.includes('keyboard'),
    mouse:         () => all.includes('мишк') || all.includes('mouse') || all.includes('trackpad'),
    headphones:    () => all.includes('слушалк') || all.includes('headphone') || all.includes('headset') || all.includes('earphone') || all.includes('earbud'),
    webcam:        () => all.includes('webcam') || all.includes('уеб камер') || all.includes('web camera'),
    printer:       () => all.includes('принтер') || all.includes('printer') || all.includes('лазер') || all.includes('laser') || all.includes('mfp'),
    // Network
    router:        () => all.includes('router') || all.includes('рутер') || all.includes('wi-fi') || all.includes('4g lte') || /dsl-n\d+u/i.test(all),
    switch:        () => all.includes('switch') || all.includes('суич'),
    ap:            () => all.includes('access point') || all.includes(' i24 ') || all.includes('точка за достъп') || (all.includes('hotspot') && !all.includes('router')),
    mesh:          () => all.includes('mesh') || all.includes('zenwifi') || all.includes('nova mw') || all.includes('expertwifi') || all.includes('range extend') || all.includes('deco') || all.includes('orbi'),
    adapter:       () => (all.includes('usb') && (all.includes('wifi') || all.includes('wi-fi') || all.includes('bluetooth') || all.includes('lan') || all.includes('adapter') || all.includes('wireless'))) || all.includes('usb-bt') || all.includes('xg-c100') || all.includes('usb-c2500') || all.includes('dwa-'),
    sfp:           () => all.includes('sfp') || all.includes('gbic') || all.includes('mini-gbic') || all.includes('exp module') || all.includes('mod-gm') || all.includes('mod-fm') || all.includes('mod-mg') || all.includes('aoc-e10'),
    outdoor:       () => all.includes('outdoor') || all.includes('cpe') || all.includes('ptp') || /\bo[136]\b/.test(all),
    cable:         () => (p.cat === 'network') && (all.includes('utp') || all.includes('ftp') || all.includes('patch cab') || all.includes('305m') || (all.includes('100m') && all.includes('cat'))),
    // Storage
    nas:           () => all.includes('nas') || all.includes('network attached') || all.includes('qnap') || all.includes('synology'),
    server:        () => all.includes('сървър') || all.includes('server') || all.includes('rack'),
    ext_drive:     () => all.includes('portable') || all.includes('портативен') || all.includes('external') || all.includes('външен'),
    flash:         () => all.includes('usb flash') || all.includes('флаш') || all.includes('sd card') || all.includes('microsd') || all.includes('sd карт'),
    // Accessories
    bag:           () => all.includes('чант') || all.includes('bag') || all.includes('backpack') || all.includes('case') || all.includes('sleeve'),
    cable:         () => all.includes('кабел') || all.includes('cable') || all.includes('cord') || all.includes('зарядн') || all.includes('charger'),
    hub:           () => all.includes('hub') || all.includes('хъб') || all.includes('dock') || all.includes('adapter') || all.includes('адаптер'),
    smart_dev:     () => all.includes('watch') || all.includes('часов') || all.includes('band') || all.includes('smart home') || all.includes('умен') || all.includes('hue') || all.includes('смарт'),
    mobile_acc:    () => (p.name||'').toLowerCase().includes('phone') || all.includes('iphone') || all.includes('samsung galaxy') || all.includes('xiaomi') || all.includes('ipad') || all.includes('tablet'),
    av:            () => all.includes('тонколон') || all.includes('speaker') || all.includes('телевизор') || all.includes('tv') || all.includes('camera') || all.includes('фото') || all.includes('gopro'),
  };

  const fn = rules[subcat];
  return fn ? fn() : true;
}

// Cat-spec filter matching
function matchesCatSpec(p) {
  const keys = Object.keys(catSpecActiveFilters);
  if (!keys.length) return true;
  const specsStr = Object.values(p.specs || {}).join(' ');
  const all = (p.name + ' ' + p.desc + ' ' + specsStr).toLowerCase().replace(/\s+/g, ' ');
  const allNorm = all.replace(/\s/g, '');
  return keys.every(key => {
    const vals = catSpecActiveFilters[key];
    if (key === 'Тип') {
      const typeMap = {
        'процесор':'cpu','видеокарта':'gpu','дънна платка':'motherboard',
        'ram':'ram','ssd nvme':'ssd','ssd sata':'ssd','hdd':'hdd',
        'захранване':'psu','кутия':'case','охлаждане':'cooling',
      };
      return [...vals].some(v => {
        const sub = typeMap[v.toLowerCase()];
        return sub ? (p.subcat === sub) : all.includes(v.toLowerCase());
      });
    }
    // CPU Series — extracted from product name
    if (key === 'Серия') {
      const n = (p.name || '').toUpperCase();
      const getSeries = () => {
        if (/CORE ULTRA/i.test(n)) return 'Core Ultra';
        if (/RYZEN\s*9|R9-/i.test(n)) return 'Ryzen 9';
        if (/RYZEN\s*7|R7-/i.test(n)) return 'Ryzen 7';
        if (/RYZEN\s*5|R5-/i.test(n)) return 'Ryzen 5';
        if (/RYZEN\s*3|R3-/i.test(n)) return 'Ryzen 3';
        if (/I9-|CORE I9/i.test(n)) return 'Core i9';
        if (/I7-|CORE I7/i.test(n)) return 'Core i7';
        if (/I5-|CORE I5/i.test(n)) return 'Core i5';
        if (/I3-|CORE I3/i.test(n)) return 'Core i3';
        return '';
      };
      const series = getSeries();
      return [...vals].some(v => v === series);
    }
    // Integrated GPU filter
    if (key === 'iGPU') {
      const hasIgpu = !!((p.specs || {})['Интегрирана графика']);
      return [...vals].some(v => v === 'С iGPU' ? hasIgpu : !hasIgpu);
    }
    // Package type — BOX / TRAY / MPK from product name
    if (key === 'Опаковка') {
      return [...vals].some(v => new RegExp(v, 'i').test(p.name || ''));
    }
    // Cores — "N ядра" filter values matched against numeric spec
    if (key === 'Ядра') {
      const coreNum = ((p.specs || {})['Ядра'] || '').trim();
      return [...vals].some(v => coreNum === (v.match(/^(\d+)/)?.[1] || ''));
    }
    // Form factor — exact match to avoid 'ATX' matching 'Micro-ATX'
    if (key === 'Форм фактор') {
      const ff = ((p.specs || {})['Форм фактор'] || '').toLowerCase();
      return [...vals].some(v => ff === v.toLowerCase());
    }
    // Direct spec lookup with substring (handles FCLGA1700 matching LGA1700)
    const specVal = ((p.specs || {})[key] || '').toLowerCase();
    if (specVal) return [...vals].some(v => specVal.includes(v.toLowerCase()));
    // Fallback: full-text search with whitespace normalization
    return [...vals].some(v => all.includes(v.toLowerCase()) || allNorm.includes(v.toLowerCase().replace(/\s/g, '')));
  });
}


// ===== 1. URL PARAMS FOR FILTERS =====
function updateURL() {
  const params = new URLSearchParams();
  if (currentFilter !== 'all') params.set('cat', currentFilter);
  if (typeof currentSubcat !== 'undefined' && currentSubcat && currentSubcat !== 'all') params.set('sub', currentSubcat);
  if (currentSort !== 'bestseller') params.set('sort', currentSort);
  if (advFilterBrands.size > 0) params.set('brand', [...advFilterBrands].join(','));
  if (advFilterRating > 0) params.set('rating', advFilterRating);
  if (advFilterSaleOnly) params.set('sale', '1');
  if (advFilterNewOnly) params.set('new', '1');
  if (advFilterStockOnly) params.set('stock', '1');
  if (advPriceMin > 0) params.set('priceMin', advPriceMin);
  if (advPriceMax < (_sbPriceAbsMax || 2000)) params.set('priceMax', advPriceMax);
  if (modalProductId) params.set('product', modalProductId);
  const qs = params.toString();
  const newUrl = qs ? `${location.pathname}?${qs}` : location.pathname;
  history.replaceState(null, '', newUrl);
}

// Allowed canonical categories + sort values — used to validate URL params before querySelector
const _VALID_CATS = new Set(['all','laptops','desktops','gaming','components','monitors','peripherals','phones','network','storage','software','accessories']);
const _VALID_SORTS = new Set(['bestseller','price-asc','price-desc','rating','discount','new']);

function readURLParams() {
  const params = new URLSearchParams(location.search);
  if (params.get('cat') && params.get('cat') !== 'all') {
    const rawCat = params.get('cat');
    currentFilter = _VALID_CATS.has(rawCat) ? rawCat : normalizeCat(rawCat);
    // Find pill by data-cat attribute (safe) or by iterating
    const pill = document.querySelector(`.filter-pill[data-cat="${currentFilter}"]`) ||
      [...document.querySelectorAll('.filter-pill')].find(b => b.dataset.cat === currentFilter);
    if (pill) { document.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active')); pill.classList.add('active'); }
  }
  if (params.get('sort')) {
    const rawSort = params.get('sort');
    if (_VALID_SORTS.has(rawSort)) { currentSort = rawSort; const sel = document.querySelector('.sort-select'); if(sel) sel.value = currentSort; }
  }
  if (params.get('brand')) {
    params.get('brand').split(',').forEach(b => {
      if (!b || b.length > 60) return; // basic sanity check
      advFilterBrands.add(b);
      // Use safe attribute match via iteration instead of querySelector template literal
      const inputs = document.querySelectorAll('#brandFilterList input[type="checkbox"]');
      inputs.forEach(cb => { if (cb.value === b) cb.checked = true; });
    });
  }
  if (params.get('rating')) { advFilterRating = parseFloat(params.get('rating')); const rb = document.querySelector(`input[name="ratingFilter"][value="${advFilterRating}"]`); if(rb) rb.checked=true; }
  if (params.get('sale') === '1') { advFilterSaleOnly=true; const el=document.getElementById('saleOnlyToggle'); if(el) el.checked=true; }
  if (params.get('new') === '1') { advFilterNewOnly=true; const el=document.getElementById('newOnlyToggle'); if(el) el.checked=true; }
  if (params.get('sub')) { currentSubcat = params.get('sub').replace(/[^a-z0-9_-]/gi, ''); } // strip special chars
  if (params.get('stock') === '1') { advFilterStockOnly=true; const el=document.getElementById('stockOnlyToggle'); if(el) el.checked=true; }
  if (params.get('priceMin')) { advPriceMin=parseFloat(params.get('priceMin')); const el=document.getElementById('sbPriceMin'); if(el) el.value=advPriceMin; }
  if (params.get('priceMax')) { advPriceMax=parseFloat(params.get('priceMax')); const el=document.getElementById('sbPriceMax'); if(el) el.value=advPriceMax; }
  // Re-render grid with all restored params
  const needsRender = params.has('cat') || params.has('sort') || params.has('brand') ||
                      params.has('rating') || params.has('sale') || params.has('new') ||
                      params.has('priceMin') || params.has('priceMax');
  if (needsRender) {
    // Show subcat bar and cat-spec filters if a category is active
    if (currentFilter !== 'all') {
      if (typeof renderSubcatBar === 'function') renderSubcatBar(currentFilter);
      // Activate subcat pill if ?sub= param was present (safe iteration, no template literal in selector)
      if (currentSubcat && currentSubcat !== 'all') {
        const subPills = document.querySelectorAll('.subcat-pill');
        subPills.forEach(p => {
          if (p.dataset.sub === currentSubcat || (p.dataset.cat === currentSubcat)) {
            document.querySelectorAll('.subcat-pill').forEach(x => x.classList.remove('active'));
            p.classList.add('active');
          }
        });
      }
      if (typeof renderCatSpecFilters === 'function') renderCatSpecFilters(currentFilter);
      if (typeof bcOnFilterCat === 'function') bcOnFilterCat(currentFilter);
    }
    updateSidebarFiltersVisibility();
    renderTopGrid();
    updateActiveFiltersBar();
  }
  if (params.get('product')) { setTimeout(()=>openProductPage(parseInt(params.get('product'))),400); }
}

// URL + skeleton + carousel hooks — using var to avoid redeclaration
var _urlHooked = false;
if (!_urlHooked) {
  _urlHooked = true;

  var _baseApplyFilter = applyFilter;
  applyFilter = function(btn, cat) { _baseApplyFilter(btn, cat); updateURL(); updateActiveFiltersBar(); };

  var _baseApplySort = applySort;
  applySort = function(val) { _baseApplySort(val); updateURL(); };

  var _baseApplyAdvFilters = applyAdvFilters;
  applyAdvFilters = function() { _baseApplyAdvFilters(); updateURL(); };

  var _baseOpenProductModal = openProductModal;
  openProductModal = function(id) {
    _baseOpenProductModal(id);
    renderRelated(id);
    renderAlsoBought(id);
    updatePdpShipBar();
    updateURL();
    document.dispatchEvent(new CustomEvent('mc:productopen', {detail: id}));
  };

  var _baseCloseProductModalDirect = closeProductModalDirect;
  closeProductModalDirect = function() {
    _baseCloseProductModalDirect();
    // Keep body locked if cat-page or pdp still open
    if (document.getElementById('catPage')?.classList.contains('open') ||
        document.getElementById('pdpBackdrop')?.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    }
    const params = new URLSearchParams(location.search);
    params.delete('product');
    const qs = params.toString();
    history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname);
  };
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getFilteredSorted, normalizeCat, advFilterBrands, renderGrids, syncFiltersToUrl };
}

// ===== MEGA MENU =====
let _megaMenuTimer = null;
let _megaMenuOpen = false;
let _megaMenuScrollHandler = null;
let _megaMenuActiveCat = null;

// On touch devices: first tap opens menu, second tap navigates
function megaMenuTouchHandler(catEl, cat, event) {
  const hasMega = MEGA_MENU[cat] && MEGA_MENU[cat].length;
  if (!hasMega) return; // no mega menu — let click through normally
  if (_megaMenuActiveCat === cat && _megaMenuOpen) return; // second tap — let openCatPage run
  event.preventDefault();
  event.stopPropagation();
  megaMenuOpen(catEl, cat);
}

function megaMenuOpen(catEl, cat) {
  clearTimeout(_megaMenuTimer);
  const data = MEGA_MENU[cat];
  const menu = document.getElementById('megaMenu');
  if (!menu) return;

  if (!data || !data.length) {
    megaMenuClose();
    return;
  }

  // Highlight active cat item
  document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('mega-active'));
  catEl.classList.add('mega-active');
  _megaMenuActiveCat = cat;

  // Position: right of the sidebar, aligned to top of cat item
  function reposition() {
    const rect = catEl.getBoundingClientRect();
    const sidebarRect = catEl.closest('.sidebar-categories').getBoundingClientRect();
    menu.style.top = rect.top + 'px';
    menu.style.left = (sidebarRect.right - 1) + 'px';
  }
  reposition();

  // Close on scroll
  if (_megaMenuScrollHandler) window.removeEventListener('scroll', _megaMenuScrollHandler, true);
  _megaMenuScrollHandler = () => { megaMenuCloseDirect(); };
  window.addEventListener('scroll', _megaMenuScrollHandler, { capture: true, once: true });

  // Header row
  const catLabel = (typeof CAT_META !== 'undefined' && CAT_META[cat]) ? CAT_META[cat].label.toUpperCase() : cat.toUpperCase();
  const header = `<div class="mega-header"><span class="mega-header-all" onclick="openCatPage('${cat}')">ВСИЧКИ ${catLabel} ›</span></div>`;

  // Render columns
  const cols = data.map(col => `
    <div class="mega-col">
      <div class="mega-col-title" onclick="openCatPage('${cat}','${col.id}')">${col.title}</div>
      ${col.items.map(item => `<span class="mega-item" onclick="openCatPage('${cat}','${col.id}')">${item}</span>`).join('')}
      <span class="mega-item mega-item-all" onclick="openCatPage('${cat}')">Всички</span>
    </div>
  `).join('');

  menu.innerHTML = header + `<div class="mega-cols">${cols}</div>`;

  menu.classList.add('open');
  _megaMenuOpen = true;
}

function megaMenuClose() {
  _megaMenuTimer = setTimeout(() => megaMenuCloseDirect(), 120);
}

function megaMenuCloseDirect() {
  clearTimeout(_megaMenuTimer);
  const menu = document.getElementById('megaMenu');
  if (menu) menu.classList.remove('open');
  document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('mega-active'));
  _megaMenuOpen = false;
  _megaMenuActiveCat = null;
  if (_megaMenuScrollHandler) {
    window.removeEventListener('scroll', _megaMenuScrollHandler, true);
    _megaMenuScrollHandler = null;
  }
}

// Close mega menu on tap outside (touch devices)
document.addEventListener('touchstart', e => {
  if (!_megaMenuOpen) return;
  const menu = document.getElementById('megaMenu');
  if (!menu) return;
  if (!menu.contains(e.target) && !e.target.closest('.cat-item')) {
    megaMenuCloseDirect();
  }
}, { passive: true });

function megaMenuKeepOpen() {
  clearTimeout(_megaMenuTimer);
}

function applySubcatById(id) {
  setTimeout(() => {
    // catPage is open — use cpApplySubcat
    if (document.getElementById('catPage')?.classList.contains('open')) {
      const pill = document.querySelector(`#cpSubcatBar .subcat-pill[onclick*="'${id}'"]`);
      if (pill) { pill.click(); }
      else if (typeof cpApplySubcat === 'function') cpApplySubcat(id, null);
      return;
    }
    // Homepage subcat bar
    const pill = document.querySelector(`#subcatBar .subcat-pill[onclick*="'${id}'"]`);
    if (pill) { pill.click(); }
  }, 150);
}

// ===== ORDER TRACKER =====
const fakeOrders = {
  'MC-TEST01': {
    num: 'MC-TEST01', name: 'Sony WH-1000XM6 Безжични слушалки',
    date: '07.03.2026 14:23', dest: 'София, ул. Витоша 15',
    courier: 'Еконт', courierNum: 'EKT-8821-2026-BG',
    status: 'В доставка',
    steps: [
      { icon:'✓', title:'Поръчката е получена', sub:'Потвърдена и платена успешно', time:'07.03.2026 14:23', state:'done' },
      { icon:'✓', title:'Обработва се', sub:'Продуктите са подготвени за изпращане', time:'07.03.2026 15:45', state:'done' },
      { icon:'✓', title:'Предадена на куриера', sub:'Еконт е получил пратката', time:'08.03.2026 09:12', state:'done' },
      { icon:'🚚', title:'В доставка', sub:'Пратката е на път към вас', time:'09.03.2026 08:30', state:'active' },
      { icon:'🏠', title:'Доставена', sub:'Очаквана дата: 09.03.2026', time:'', state:'' },
    ]
  },
  'MC-TEST02': {
    num: 'MC-TEST02', name: 'MacBook Pro 16" M4 Pro + Apple Watch Ultra 2',
    date: '05.03.2026 11:05', dest: 'Пловдив, бул. България 88',
    courier: 'Еконт', courierNum: 'ECO-5523781-BG',
    status: '✓ Доставена',
    steps: [
      { icon:'✓', title:'Поръчката е получена', sub:'Потвърдена и платена успешно', time:'05.03.2026 11:05', state:'done' },
      { icon:'✓', title:'Обработва се', sub:'Продуктите са подготвени', time:'05.03.2026 13:22', state:'done' },
      { icon:'✓', title:'Предадена на куриера', sub:'Еконт е получил пратката', time:'06.03.2026 10:00', state:'done' },
      { icon:'✓', title:'В доставка', sub:'Пратката е пристигнала в Пловдив', time:'07.03.2026 09:15', state:'done' },
      { icon:'✓', title:'Доставена', sub:'Получена от клиента', time:'07.03.2026 14:40', state:'done' },
    ]
  },
};

function openOrderTracker(prefillNum) {
  document.getElementById('orderTrackerPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('otResult').classList.remove('show');
  document.getElementById('otError').classList.remove('show');
  if (prefillNum) {
    document.getElementById('otInput').value = prefillNum;
    setTimeout(trackOrder, 300);
  } else {
    document.getElementById('otInput').value = '';
  }
}

function closeOrderTracker() {
  document.getElementById('orderTrackerPage').classList.remove('open');
  document.body.style.overflow = '';
}

const _otStatusMap   = { pending:1, processing:2, shipped:3, delivered:4, cancelled:1 };
const _otStatusLabel = { pending:'Изчаква потвърждение', processing:'Обработва се', shipped:'В доставка', delivered:'Доставена', cancelled:'Отказана' };
const _otStepTitles  = [
  { title:'Поръчката е получена', sub:'Потвърдена успешно' },
  { title:'Обработва се',         sub:'Очаквано завършване: до 2 часа' },
  { title:'Предадена на куриера', sub:'Ще получиш известие' },
  { title:'В доставка',           sub:'' },
  { title:'Доставена',            sub:'' },
];
function _otBuildSteps(activeStep, firstTime) {
  return _otStepTitles.map((s, i) => ({
    ...s,
    time:  i === 0 ? firstTime : '',
    icon:  i < activeStep ? '✓' : '○',
    state: i < activeStep ? 'done' : i === activeStep ? 'active' : ''
  }));
}

function trackOrder() {
  const num = document.getElementById('otInput').value.trim().toUpperCase();
  const result = document.getElementById('otResult');
  const error = document.getElementById('otError');
  result.classList.remove('show');
  error.classList.remove('show');

  // 1. Check demo/fake orders
  let order = fakeOrders[num];

  // 2. Check real saved orders from localStorage
  if (!order) {
    try {
      const saved = JSON.parse(localStorage.getItem('mc_orders') || '[]');
      const real = saved.find(o => o.num === num);
      if (real) {
        const activeStep = _otStatusMap[real.status] ?? 1;
        order = {
          num: real.num,
          name: real.items || real.customer,
          date: real.date,
          dest: (real.city ? real.city + ', ' : '') + (real.addr || ''),
          courier: 'Еконт',
          courierNum: 'EKT-' + real.num.replace('MC-','').slice(0,6) + '-BG',
          status: _otStatusLabel[real.status] || real.status,
          steps: _otBuildSteps(activeStep, real.date)
        };
      }
    } catch(e) {}
  }

  // 3. Generic fallback for unrecognised MC- numbers
  if (!order && num.startsWith('MC-') && num.length >= 8) {
    const now = new Date().toLocaleString('bg-BG');
    order = {
      num, name: 'Most Computers поръчка',
      date: now, dest: 'Адрес на доставка',
      courier: 'Еконт', courierNum: 'EKT-' + Math.random().toString().slice(2,8) + '-BG',
      status: 'Обработва се',
      steps: _otBuildSteps(1, now)
    };
  }

  if (!order) { error.classList.add('show'); return; }

  document.getElementById('otOrderNum').textContent = 'Поръчка № ' + order.num;
  document.getElementById('otOrderName').textContent = order.name;
  document.getElementById('otOrderDate').textContent = 'Поръчана на: ' + order.date;
  document.getElementById('otStatusBadge').textContent = order.status;
  document.getElementById('otDestVal').textContent = order.dest;
  document.getElementById('otCourierName').textContent = order.courier;
  document.getElementById('otCourierNum').textContent = 'Товарителница: ' + order.courierNum;
  document.getElementById('otCourierIcon').textContent = order.courier === 'Еконт' ? 'EKT' : 'SPD';

  var _el_otTimeline=document.getElementById('otTimeline'); if(_el_otTimeline) _el_otTimeline.innerHTML = order.steps.map(s => `
    <div class="ot-step ${s.state}">
      <div class="ot-dot">${s.state==='done'?'✓':s.state==='active'?s.icon:s.icon}</div>
      <div class="ot-step-content">
        <div class="ot-step-title">${s.title}</div>
        <div class="ot-step-sub">${s.sub}</div>
        ${s.time ? `<div class="ot-step-time">${s.time}</div>` : ''}
      </div>
    </div>`).join('');

  result.classList.add('show');
}

function closeCheckoutPageAndTrack() {
  const orderNum = document.getElementById('tyOrderNum')?.textContent;
  closeThankyouPage();
  if (!orderNum || orderNum.trim() === 'MC-') { setTimeout(() => openOrderTracker(''), 300); return; }
  setTimeout(() => openOrderTracker('MC-' + orderNum.replace('MC-','').trim()), 300);
}



// ===== PWA =====
(function() {
  // 1. Generate SVG icon as data URL
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="115" fill="#bd1105"/>
    <text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text>
    <text x="256" y="430" font-size="72" font-family="Arial" font-weight="900" text-anchor="middle" fill="white">MC</text>
  </svg>`;
  const iconUrl = 'data:image/svg+xml,' + encodeURIComponent(iconSvg);

  // Apply apple-touch-icon
  const appleIcon = document.getElementById('pwaAppleIcon');
  if (appleIcon) { appleIcon.rel='apple-touch-icon'; appleIcon.href=iconUrl; }

  // 2. Generate and inject manifest via Blob URL
  const manifest = {
    name: 'Most Computers',
    short_name: 'Most Computers',
    description: 'Онлайн магазин за електроника',
    start_url: './',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#bd1105',
    lang: 'bg',
    icons: [
      { src: iconUrl, sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
      { src: iconUrl, sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
    ],
    screenshots: [],
    categories: ['shopping', 'electronics'],
  };
  try {
    const blob = new Blob([JSON.stringify(manifest)], {type:'application/json'});
    const manifestUrl = URL.createObjectURL(blob);
    const manifestLink = document.getElementById('pwaManifest');
    if (manifestLink) manifestLink.href = manifestUrl;
  } catch(e) {}

  // 3. Service Worker — registers when hosted on HTTPS
  // (Blob URLs not supported for SW — browser security restriction)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => { console.log('MC SW ✓', reg.scope); window._mcSwReg = reg; })
      .catch(err => console.warn('MC SW:', err.message));
  }

  // 4. Install prompt logic
  let deferredPrompt = null;
  const banner = document.getElementById('pwaBanner');
  const dismissed = localStorage.getItem('mc_pwa_dismissed');
  const installed = localStorage.getItem('mc_pwa_installed');

  if (installed || dismissed) return; // already handled

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  // avoid errors during testing where matchMedia may be undefined
  const isInStandalone = window.navigator.standalone === true
    || (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches);

  if (isInStandalone) return; // already installed

  if (isIos) {
    // Show iOS instructions after 4s
    setTimeout(() => { if (banner) banner.classList.add('show'); }, 4000);
    window.__pwaIsIos = true;
  } else {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(() => { if (banner) banner.classList.add('show'); }, 3000);
    });
    window.__pwaPrompt = () => deferredPrompt;
  }
})();

function pwaInstall() {
  if (window.__pwaIsIos) {
    document.getElementById('pwaBanner').classList.remove('show');
    document.getElementById('pwaIosModal').classList.add('open');
    return;
  }
  const prompt = window.__pwaPrompt?.();
  if (prompt) {
    prompt.prompt();
    prompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        localStorage.setItem('mc_pwa_installed', '1');
        showToast('✓ Most Computers е инсталиран!');
      }
      document.getElementById('pwaBanner').classList.remove('show');
    });
  } else {
    // Fallback: show iOS style instructions
    document.getElementById('pwaBanner').classList.remove('show');
    document.getElementById('pwaIosModal').classList.add('open');
  }
}

function pwaDismiss() {
  document.getElementById('pwaBanner').classList.remove('show');
  localStorage.setItem('mc_pwa_dismissed', '1');
}

// helper called from data-action to scroll modal to top
function scrollProductModalTop() {
  const modal = document.getElementById('productModal');
  if (modal) modal.scrollTo({top:0,behavior:'smooth'});
}

function closePwaIos() {
  document.getElementById('pwaIosModal').classList.remove('open');
}



// ===== PUSH NOTIFICATIONS =====
async function requestPushPermission() {
  if (!('Notification' in window)) {
    showToast('⚠️ Браузърът ти не поддържа известия');
    return;
  }
  if (Notification.permission === 'granted') {
    showToast('✓ Известията вече са активирани!');
    return;
  }
  if (Notification.permission === 'denied') {
    showToast('⚠️ Известията са блокирани в браузъра');
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    showToast('🔔 Ще получаваш известия за горещи оферти!');
    localStorage.setItem('mc_push_granted', '1');
    // Demo: send a test notification after 3s
    setTimeout(() => {
      new Notification('Most Computers 🔥', {
        body: 'Добре дошъл! Следи за ексклузивни оферти.',
        icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text></svg>'),
        tag: 'mc-welcome'
      });
    }, 3000);
  } else {
    showToast('Известията не са активирани');
  }
}

function sendPromoNotification(title, body, url) {
  if (Notification.permission !== 'granted') return;
  const n = new Notification(title || 'Most Computers 🔥', {
    body: body || 'Нова оферта те очаква!',
    icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text></svg>'),
    tag: 'mc-promo',
    renotify: true
  });
  if (url) n.addEventListener('click', () => window.focus());
}

// Auto-show push opt-in after 30s (only once)
setTimeout(() => {
  if (localStorage.getItem('mc_push_granted')) return;
  if (localStorage.getItem('mc_push_dismissed')) return;
  if (!('Notification' in window) || Notification.permission !== 'default') return;
  const banner = document.getElementById('pushOptInBanner');
  if (banner) banner.classList.add('show');
}, 30000);

function dismissPushBanner() {
  const banner = document.getElementById('pushOptInBanner');
  if (banner) banner.classList.remove('show');
  localStorage.setItem('mc_push_dismissed', '1');
}



// ── Lazy Admin Loader ────────────────────────────────────────────────────────
// admin.js (144 KB) се зарежда само когато потребителят отвори admin панела.
// Стубовете по-долу се заменят автоматично от реалните функции след зареждане.

let _adminLoaded = false;
let _adminLoading = false;
const _adminQueue = [];

function _loadAdminScript(cb) {
  if (_adminLoaded) { if (cb) cb(); return; }
  if (cb) _adminQueue.push(cb);
  if (_adminLoading) return;
  _adminLoading = true;
  const s = document.createElement('script');
  s.src = 'js/admin.js?v=' + (typeof SW_VERSION !== 'undefined' ? SW_VERSION : Date.now());
  s.onload = () => {
    _adminLoaded = true;
    _adminLoading = false;
    _adminQueue.splice(0).forEach(fn => fn());
  };
  s.onerror = () => {
    _adminLoading = false;
    showToast('⚠️ Грешка при зареждане на Admin панела');
  };
  document.head.appendChild(s);
}

// Stub — заменя се от реалната функция в admin.js след зареждане
function openAdminPage() {
  _loadAdminScript(() => {
    if (typeof openAdminPage === 'function') openAdminPage();
  });
}

// Stub — нужен на ui.js преди admin.js да се зареди
function closeAdminPage() {
  const page = document.getElementById('adminPage');
  if (page) page.style.display = 'none';
  document.body.style.overflow = '';
}

// ===== PRODUCT PAGE =====
let pdpProductId = null;
let pdpQtyVal    = 1;
let pdpGallery   = [];
let pdpGalleryIdx = 0;


let _pdpScrollY = 0;
function openProductPage(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  // Save scroll position only when not inside catPage (catPage has its own scroll)
  if (!document.getElementById('catPage')?.classList.contains('open')) {
    _pdpScrollY = window.scrollY || document.documentElement.scrollTop;
  }
  // Hide main sr-only H1 so only the product H1 is active for screen readers
  const mainH1 = document.querySelector('main h1.sr-only');
  if (mainH1) mainH1.setAttribute('aria-hidden', 'true');
  pdpProductId = id;
  pdpQtyVal = 1;
  addToRecentlyViewed(id);

  // Breadcrumb (inline — no wrapper needed)
  const _bcCatLabel = (typeof CAT_LABELS !== 'undefined' ? CAT_LABELS[p.cat] : null) || p.cat;
  if (typeof bcSet === 'function') {
    const _bcCatFn = () => {
      closeProductPage();
      filterCat(p.cat);
      bcSet([{ label: _bcCatLabel, fn: _bcCatFn }]);
    };
    bcSet([
      { label: _bcCatLabel, url: `https://mostcomputers.bg/?cat=${p.cat}`, fn: _bcCatFn },
      { label: p.name, url: `https://mostcomputers.bg/?product=${p.id}`, fn: null }
    ]);
  }
  document.title = p.name + ' | Most Computers';

  // SEO — Dynamic meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} — ${p.brand} | Цена: ${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв. Купи онлайн от Most Computers.`;
    metaDesc.setAttribute('content', descText);
  }

  // Open Graph tags
  function setOG(prop, val) {
    let tag = document.querySelector(`meta[property="${prop}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', prop); document.head.appendChild(tag); }
    tag.setAttribute('content', val);
  }
  function setOGName(name, val) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', name); document.head.appendChild(tag); }
    tag.setAttribute('content', val);
  }
  setOG('og:title',       p.name + ' | Most Computers');
  setOG('og:description', p.desc ? p.desc.substring(0,200) : `${p.name} от ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €`);
  setOG('og:image',       p.img || 'https://mostcomputers.bg/og-default.jpg');
  setOG('og:url',         window.location.href);
  setOG('og:type',        'product');
  setOG('og:site_name',   'Most Computers');
  setOG('product:price:amount',   (p.price/EUR_RATE).toFixed(2));
  setOG('product:price:currency', 'EUR');
  setOGName('twitter:card',        'summary_large_image');
  setOGName('twitter:title',       p.name + ' | Most Computers');
  setOGName('twitter:description', p.desc ? p.desc.substring(0,200) : `${p.brand} — ${p.name}`);
  setOGName('twitter:image',       p.img || '');
  const _canonical = document.querySelector('link[rel="canonical"]');
  if (_canonical) _canonical.setAttribute('href', `https://mostcomputers.bg/?product=${p.id}`);

  // Badges
  let b = '';
  if (p.badge==='sale') b += '<span class="badge badge-sale">Промо</span>';
  if (p.badge==='new')  b += '<span class="badge badge-new">Ново</span>';
  if (p.badge==='hot')  b += '<span class="badge badge-hot">Горещо</span>';
  var _el_pdpBadges=document.getElementById('pdpBadges'); if(_el_pdpBadges) _el_pdpBadges.innerHTML = b;

  // Brand / Name / Rating
  document.getElementById('pdpBrand').textContent = p.brand || '';
  document.getElementById('pdpName').textContent  = p.name;
  document.getElementById('pdpStars').innerHTML   = starsHTML(p.rating);
  document.getElementById('pdpRv').textContent    = `${p.rating} (${p.rv} ревюта)`;

  // Price
  const priceBgn = p.price;
  const prEl = document.getElementById('pdpPrice');
  prEl.textContent = fmtEur(priceBgn);
  prEl.className   = 'pdp-price-main' + (p.badge==='sale' ? ' sale' : '');
  document.getElementById('pdpPriceEur').textContent = `${fmtBgn(priceBgn)}`;

  const oldRow = document.getElementById('pdpOldRow');
  if (p.old) {
    document.getElementById('pdpOld').textContent = fmtEur(p.old) + ' / ' + fmtBgn(p.old);
    document.getElementById('pdpSave').textContent = '-' + Math.round((p.old-p.price)/p.old*100) + '%';
    oldRow.style.display = 'flex';
  } else {
    oldRow.style.display = 'none';
  }
  var _el_pdpMonthly=document.getElementById('pdpMonthly');
  if(_el_pdpMonthly){
    if(p.price>=999){
      const mo=Math.ceil(p.price/12);
      _el_pdpMonthly.innerHTML=`<span>или от <strong>${mo.toFixed(2)} лв./мес.</strong> на 12 вноски</span>`;
      _el_pdpMonthly.style.display='';
    } else {
      _el_pdpMonthly.innerHTML='';
      _el_pdpMonthly.style.display='none';
    }
  }

  // Stock
  const inStock = p.stock !== false;
  const stockEl = document.getElementById('pdpStock');
  stockEl.className = 'pdp-stock ' + (inStock ? 'in' : 'out');
  const stockNum = typeof p.stock === 'number' && p.stock > 0 ? p.stock : null;
  let stockTxt = 'Изчерпан';
  if (inStock) {
    stockTxt = '✓ В наличност';
  }
  document.getElementById('pdpStockTxt').textContent = stockTxt;
  // Show/hide back-in-stock notify button
  const bisBtn = document.getElementById('pdpNotifyStock');
  if (bisBtn) bisBtn.style.display = inStock ? 'none' : 'flex';
  const pdpAddBtn = document.getElementById('pdpAddBtn');
  if (pdpAddBtn) { pdpAddBtn.disabled = !inStock; pdpAddBtn.style.opacity = inStock ? '' : '0.4'; }
  // Restore BIS subscription state
  if (!inStock) {
    const savedBisEmail = localStorage.getItem('mc_bis_' + id);
    const notifyForm = document.getElementById('pdpNotifyForm');
    const notifySuccess = document.getElementById('pdpNotifySuccess');
    const notifyEmail = document.getElementById('pdpNotifyEmail');
    if (savedBisEmail && notifyForm && notifySuccess) {
      notifyForm.style.display = 'none';
      notifySuccess.style.display = 'block';
      notifySuccess.textContent = `✓ Ще те уведомим на ${savedBisEmail} веднага щом продуктът е наличен!`;
    } else if (notifyForm && notifySuccess) {
      notifyForm.style.display = '';
      notifySuccess.style.display = 'none';
      if (notifyEmail) notifyEmail.value = '';
    }
  }

  // Quick specs hidden
  const specs = p.specs || {};
  var _el_pdpQuickSpecs=document.getElementById('pdpQuickSpecs'); if(_el_pdpQuickSpecs) _el_pdpQuickSpecs.innerHTML = '';

  // Qty
  document.getElementById('pdpQty').textContent = '1';

  // Wishlist btn
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) wishBtn.innerHTML = wishlist.includes(id) ? '❤ В любими' : '♡ Добави в желания';

  // Meta
  document.getElementById('pdpSku').textContent     = p.sku  || '—';
  document.getElementById('pdpEan').textContent     = p.ean  || p.sku || '—';
  document.getElementById('pdpWarranty').textContent = specs['Warranty'] || specs['Гаранция'] || specs['warrantyInMonths'] || '24 месеца';

  // ── Gallery ──
  pdpGallery = [];
  if (p.gallery && p.gallery.length) {
    pdpGallery = p.gallery;
  } else if (p.img) {
    pdpGallery = [p.img];
  }
  pdpGalleryIdx = 0;
  // Show skeleton while image loads
  const _imgWrap = document.querySelector('.pdp-main-img-wrap');
  if (_imgWrap) _imgWrap.classList.add('img-loading');
  pdpRenderGallery();
  const _mainImg = document.getElementById('pdpMainImg');
  if (_mainImg) {
    const _removeLoading = function(){ if(_imgWrap) _imgWrap.classList.remove('img-loading'); };
    _mainImg.addEventListener('load', _removeLoading, { once: true });
    _mainImg.addEventListener('error', _removeLoading, { once: true });
    if (_mainImg.complete) _removeLoading();
  }

  // ── Full specs table ──
  const tbody = document.getElementById('pdpSpecsTbody');
  if (tbody) {
    let specRows = `<tr><td>SKU / Part Number</td><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.sku||'—'}</td></tr>`;
    if (p.ean) specRows += `<tr><td>EAN / Баркод</td><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.ean}</td></tr>`;
    const _se = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    specRows += Object.entries(specs).map(([k,v]) => `<tr><td>${_se(k)}</td><td>${_se(v)}</td></tr>`).join('');
    tbody.innerHTML = specRows || '<tr><td colspan="2" style="color:var(--muted);text-align:center;padding:24px;">Няма данни за спецификации.</td></tr>';
  }

  // ── Description (HTML) ──
  const htmlContent = document.getElementById('pdpHtmlContent');
  if (htmlContent) {
    if (p.htmlDesc) {
      // htmlDesc is admin-authored HTML — kept as-is (trusted source)
      htmlContent.innerHTML = p.htmlDesc;
    } else if (p.desc) {
      // p.desc may come from XML — render as plain text to prevent XSS
      htmlContent.innerHTML = '';
      const para = document.createElement('p');
      para.style.cssText = 'font-size:14px;line-height:1.8;color:var(--text2);';
      para.textContent = p.desc;
      htmlContent.appendChild(para);
    } else {
      htmlContent.innerHTML = '<p style="color:var(--muted);font-size:13px;">Няма добавено описание за този продукт.</p>';
    }
  }

  // ── Video ──
  const videoWrap = document.getElementById('pdpVideoWrap');
  if (p.videoUrl) {
    pdpRenderVideo(p.videoUrl, videoWrap);
  } else {
    videoWrap.innerHTML = `<div class="pdp-video-placeholder"><span>▶</span><div style="font-size:13px;color:var(--muted);">Няма добавено видео за този продукт.</div></div>`;
  }

  // ── Reviews ──
  const revEl = document.getElementById('pdpReviews');
  // Build merged review list without mutating the shared product object
  let displayRevs = p.reviews ? [...p.reviews] : [];
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    const userRevs = saved[id] || [];
    if (userRevs.length) {
      const existingKeys = new Set(displayRevs.map(r => r.name + '|' + r.date));
      userRevs.forEach(r => {
        if (!existingKeys.has(r.name + '|' + r.date)) displayRevs.unshift(r);
      });
    }
  } catch(e) {}
  // Show only approved reviews publicly; pending ones need admin approval
  const publicRevs = displayRevs.filter(r => !r.pending);
  if (typeof pdpRenderRatingBreakdown === 'function') pdpRenderRatingBreakdown(publicRevs);
  if (publicRevs.length) {
    const _esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    revEl.innerHTML = publicRevs.map(r =>
      `<div class="review-item"><div class="review-header"><span class="review-name">${_esc(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_esc(r.date)}</span></div><div class="review-text">${_esc(r.text)}</div></div>`
    ).join('');
  } else {
    revEl.innerHTML = '<p style="color:var(--muted);font-size:13px;">Все още няма ревюта за този продукт.</p>';
  }

  // ── Vendor ──
  const vendorDiv = document.getElementById('pdpVendorContent');
  if (vendorDiv) {
    if (p.vendorUrl) {
      vendorDiv.innerHTML = `
        <p style="font-size:13px;color:var(--text2);margin-bottom:12px;">Посетете официалния сайт на производителя за повече информация.</p>
        <a class="pdp-vendor-link" href="${p.vendorUrl}" target="_blank" rel="noopener">
          🌐 <span>Официален сайт — ${p.brand || 'Производител'}</span>
          <span style="margin-left:auto;font-size:11px;color:var(--muted);">↗</span>
        </a>`;
    } else {
      vendorDiv.innerHTML = '<p style="color:var(--muted);font-size:13px;">Няма добавен линк към производителя.</p>';
    }
  }

  // Show reviews tab by default if product has reviews, otherwise specs
  const _hasPublicRevs = (p.reviews || []).filter(r => !r.pending).length > 0
    || (() => { try { return (JSON.parse(localStorage.getItem('mc_reviews') || '{}')[p.id] || []).length > 0; } catch(e) { return false; } })();
  pdpSwitchTab(_hasPublicRevs ? 'reviews' : 'specs');
  pdpUpdateStickyBar(p);
  pdpShowViewers(p);
  pdpRenderSparkline(p);
  pdpInitDeliveryTimer();
  pdpRenderBundle(p);
  pdpRenderRelated(p);
  pdpRenderRvCarousel();
  pdpInitZoom();
  pdpInitSwipe();
  pdpInitTabsScroll();
  // Sidebar disabled — specs already shown in main tab
  if (typeof pdpInitPinch === 'function') pdpInitPinch();
  if (typeof _pdpCompareReset === 'function') _pdpCompareReset();
  document.getElementById('pdpBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('pdpBackdrop').scrollTop = 0;

  // ── Structured Data (Product + BreadcrumbList) ──
  const _avgRating = p.rating || 0;
  const _rvCount   = p.rv    || 0;
  const _schemaId  = 'pdpJsonLd';
  let _schemaTag   = document.getElementById(_schemaId);
  if (!_schemaTag) {
    _schemaTag = document.createElement('script');
    _schemaTag.type = 'application/ld+json';
    _schemaTag.id   = _schemaId;
    document.head.appendChild(_schemaTag);
  }
  const _catLabel = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[p.cat]) ? CAT_LABELS[p.cat] : p.cat;
  const _priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const _images = Array.isArray(p.gallery) && p.gallery.length ? p.gallery : (p.img ? [p.img] : []);
  const _productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.name,
    "image": _images,
    "description": p.desc || p.name,
    "brand": { "@type": "Brand", "name": p.brand || '' },
    "sku": p.sku || '',
    ...(p.ean ? { "gtin13": p.ean } : {}),
    "offers": {
      "@type": "Offer",
      "url": `${location.origin}/?product=${p.id}`,
      "priceCurrency": "BGN",
      "price": p.price,
      "priceValidUntil": _priceValidUntil,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": p.stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Most Computers" }
    },
    ...(_avgRating && _rvCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": _avgRating,
        "reviewCount": _rvCount,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {})
  };
  if (Array.isArray(p.reviews) && p.reviews.length > 0) {
    _productSchema.review = p.reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": r.date,
      "reviewBody": r.text,
      "reviewRating": { "@type": "Rating", "ratingValue": r.stars, "bestRating": 5, "worstRating": 1 }
    }));
  }
  _schemaTag.textContent = JSON.stringify([
    _productSchema,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Начало", "item": window.location.origin + "/" },
        { "@type": "ListItem", "position": 2, "name": _catLabel, "item": window.location.origin + "/?cat=" + p.cat },
        { "@type": "ListItem", "position": 3, "name": p.name }
      ]
    }
  ]);
}

function closeProductPage() {
  pdpSearchDropClose();
  const _st = document.getElementById('pdpScrollTop');
  if (_st) _st.style.display = 'none';
  // Restore main H1 visibility for screen readers
  const mainH1 = document.querySelector('main h1.sr-only');
  if (mainH1) mainH1.removeAttribute('aria-hidden');
  document.getElementById('pdpBackdrop').classList.remove('open');
  // Keep body locked if cat-page is still open
  if (!document.getElementById('catPage')?.classList.contains('open')) {
    document.body.style.overflow = '';
    // Restore scroll position
    requestAnimationFrame(() => window.scrollTo(0, _pdpScrollY));
  }
  // Stop any video
  const videoWrap = document.getElementById('pdpVideoWrap');
  if (videoWrap) {
    const iframe = videoWrap.querySelector('iframe');
    if (iframe) iframe.src = iframe.src;
  }
  // Breadcrumb — pop back to category if present
  document.title = 'Most Computers | Онлайн магазин за компютри и компоненти';
  // Reset meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'Most Computers – онлайн магазин за компютри, компоненти, монитори, периферия и мрежово оборудване.');
  // Reset OG
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | Онлайн магазин за компютри и компоненти');
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', 'https://mostcomputers.bg/og-default.jpg');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/');
  if (typeof bcSet === 'function') {
    if (_bcTrail.length >= 2) {
      bcSet([_bcTrail[0]]);
    } else {
      bcSet([]);
    }
  }
}

function pdpSwitchTab(tab) {
  document.querySelectorAll('.pdp-tab').forEach(t => {
    const action = t.getAttribute('data-action') || t.getAttribute('onclick') || '';
    t.classList.toggle('active', action.includes(`'${tab}'`));
  });
  document.querySelectorAll('.pdp-tab-content').forEach(c => c.classList.remove('active'));
  const el = document.getElementById(`pdp-tab-${tab}`);
  if (el) el.classList.add('active');
  // Re-read reviews from localStorage every time the tab is opened
  if (tab === 'reviews' && pdpProductId != null) {
    const p = products.find(x => x.id === pdpProductId);
    const revEl = document.getElementById('pdpReviews');
    if (!p || !revEl) return;
    let displayRevs = p.reviews ? [...p.reviews] : [];
    try {
      const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
      const userRevs = saved[pdpProductId] || [];
      const existingKeys = new Set(displayRevs.map(r => r.name + '|' + r.date));
      userRevs.forEach(r => { if (!existingKeys.has(r.name + '|' + r.date)) displayRevs.unshift(r); });
    } catch(e) {}
    const publicRevs = displayRevs.filter(r => !r.pending);
    if (typeof pdpRenderRatingBreakdown === 'function') pdpRenderRatingBreakdown(publicRevs);
    const _escR = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    revEl.innerHTML = publicRevs.length
      ? publicRevs.map(r => `<div class="review-item"><div class="review-header"><span class="review-name">${_escR(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_escR(r.date)}</span></div><div class="review-text">${_escR(r.text)}</div></div>`).join('')
      : '<p style="color:var(--muted);font-size:13px;">Все още няма ревюта за този продукт.</p>';
  }
}

function pdpRenderGallery() {
  const mainImg   = document.getElementById('pdpMainImg');
  const mainEmoji = document.getElementById('pdpMainEmoji');
  const thumbsEl  = document.getElementById('pdpThumbs');
  const p = products.find(x => x.id === pdpProductId);
  if (!p) return;

  if (pdpGallery.length && pdpGallery[pdpGalleryIdx]) {
    mainImg.src = pdpGallery[pdpGalleryIdx];
    mainImg.alt = p.name;
    mainImg.style.display = '';
    mainEmoji.style.display = 'none';
    mainImg.onerror = function() {
      this.style.display = 'none';
      mainEmoji.style.display = '';
      mainEmoji.textContent = p.emoji || '🖥';
      this.onerror = null;
    };
  } else {
    mainImg.style.display = 'none';
    mainEmoji.style.display = '';
    mainEmoji.textContent = p.emoji || '🖥';
  }

  if (pdpGallery.length > 1) {
    thumbsEl.innerHTML = pdpGallery.map((url, i) =>
      `<div class="pdp-thumb ${i===pdpGalleryIdx?'active':''}" onclick="pdpGallerySet(${i})">
        <img src="${url}" alt="" onerror="this.style.display='none'">
      </div>`
    ).join('');
  } else {
    thumbsEl.innerHTML = '';
  }
}

function pdpGalleryNav(dir) {
  if (!pdpGallery.length) return;
  pdpGalleryIdx = (pdpGalleryIdx + dir + pdpGallery.length) % pdpGallery.length;
  pdpRenderGallery();
}

function pdpGallerySet(i) {
  pdpGalleryIdx = i;
  pdpRenderGallery();
}

function pdpRenderVideo(url, wrap) {
  let embedUrl = url;
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) embedUrl = `https://player.vimeo.com/video/${vmMatch[1]}`;

  const isEmbed = embedUrl !== url || url.includes('embed') || url.includes('youtube') || url.includes('vimeo');
  if (isEmbed || url.startsWith('http')) {
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      wrap.innerHTML = `<video controls><source src="${url}"></video>`;
    } else {
      wrap.innerHTML = `<iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  } else {
    wrap.innerHTML = `<div class="pdp-video-placeholder"><span>▶</span><div style="font-size:13px;color:var(--muted);">Невалиден видео линк.</div></div>`;
  }
}

function pdpChangeQty(d) {
  pdpQtyVal = Math.max(1, pdpQtyVal + d);
  // Sync all qty displays (main page, sticky bar, bottom sheet)
  ['pdpQty', 'pdpStickyQty', 'pdpBsQty'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = pdpQtyVal;
  });
}

function pdpAddToCart() {
  if (!pdpProductId) return;
  const p = products.find(x => x.id === pdpProductId);
  if (!p) return;
  const ex = cart.find(x => x.id === pdpProductId);
  if (ex) { ex.qty += pdpQtyVal; } else { cart.push({...p, qty: pdpQtyVal}); }
  updateCart();
  if (typeof saveCart === 'function') saveCart();
  // Visual feedback on ALL add-to-cart buttons (main, sticky bar, bottom sheet)
  const addBtns = [
    document.getElementById('pdpAddBtn'),
    document.querySelector('#pdpStickyBar .pdp-sticky-atc'),
    document.querySelector('#pdpBottomSheet .pdp-add-btn'),
  ];
  addBtns.forEach(btn => {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Добавен!';
    btn.style.background = 'var(--accent2)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
  });
  showToast(`✓ ${p.name.substring(0,32)}… добавен в кошницата!`);
  // Reveal checkout shortcut buttons
  const ckBtn = document.getElementById('pdpCheckoutBtn');
  if (ckBtn) ckBtn.style.display = '';
  const stickyBtn = document.getElementById('pdpStickyCheckoutBtn');
  if (stickyBtn) stickyBtn.style.display = '';
}

function pdpCopyProductLink() {
  const url = location.origin + location.pathname + '?product=' + pdpProductId;
  navigator.clipboard.writeText(url).then(() => showToast('🔗 Линкът е копиран!')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    showToast('🔗 Линкът е копиран!');
  });
}

function pdpShareFacebook() {
  const url = encodeURIComponent(location.origin + location.pathname + '?product=' + pdpProductId);
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'width=600,height=400');
}

function pdpShareViber() {
  const p = products.find(x => x.id === pdpProductId);
  const url = location.origin + location.pathname + '?product=' + pdpProductId;
  const text = encodeURIComponent((p ? p.name + ' — ' : '') + url);
  window.open('viber://forward?text=' + text, '_blank');
}

function pdpToggleWish() {
  if (!pdpProductId) return;
  toggleWishlist(pdpProductId, null);
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) wishBtn.innerHTML = wishlist.includes(pdpProductId) ? '❤ В любими' : '♡ Добави в желания';
}



// ===== 2. MODAL SKELETON =====
function showModalSkeleton() {
  const backdrop = document.getElementById('productModalBackdrop');
  const gallery = document.getElementById('modalGallery');
  const info = document.querySelector('.modal-info');
  if (!backdrop || !gallery || !info) return;

  gallery.innerHTML = `<div class="modal-skeleton"><div class="modal-sk-img"></div></div>`;
  info.innerHTML = `
    <div class="modal-skeleton" style="padding:8px 0;">
      <div class="modal-sk-badge" style="width:70px;height:18px;border-radius:9px;background:var(--bg2);margin-bottom:10px;"></div>
      <div class="modal-sk-title" style="width:90%;height:22px;border-radius:6px;background:var(--bg2);margin-bottom:8px;"></div>
      <div class="modal-sk-title" style="width:60%;height:14px;border-radius:6px;background:var(--bg2);margin-bottom:16px;"></div>
      <div class="modal-sk-price"></div>
      <div class="modal-sk-line" style="width:100%;margin-top:16px;"></div>
      <div class="modal-sk-line" style="width:85%;"></div>
      <div class="modal-sk-line" style="width:70%;"></div>
      <div class="modal-sk-btn"></div>
      <div class="modal-sk-btn" style="margin-top:8px;opacity:.5;"></div>
    </div>`;

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ===== 3. GALLERY SWIPE =====
(function initGallerySwipe() {
  let startX = 0, startY = 0;
  document.addEventListener('touchstart', e => {
    const gallery = e.target.closest('.modal-gallery');
    if (!gallery) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const gallery = e.target.closest('.modal-gallery');
    if (!gallery) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      galleryNav(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
})();


// ===== FREE SHIPPING BAR (QW-08) =====
function updatePdpShipBar() {
  const bar = document.getElementById('pdpShipBar');
  const txt = document.getElementById('pdpShipBarText');
  const fill = document.getElementById('pdpShipBarFill');
  if (!bar || !txt || !fill) return;
  const FREE_SHIP_EUR = 100;
  let cartTotal = 0;
  try {
    const cart = JSON.parse(localStorage.getItem('mc_cart') || '[]');
    cartTotal = cart.reduce((s, i) => {
      const pr = products.find(x => x.id === i.id);
      return s + (pr ? pr.price * i.qty : 0);
    }, 0);
  } catch(e) {}
  const cartEur = cartTotal / EUR_RATE;
  const pct = Math.min(100, Math.round(cartEur / FREE_SHIP_EUR * 100));
  fill.style.width = pct + '%';
  if (cartEur >= FREE_SHIP_EUR) {
    txt.innerHTML = '✅ Имаш безплатна доставка!';
    fill.style.background = 'var(--success, #22c55e)';
  } else {
    const need = (FREE_SHIP_EUR - cartEur).toFixed(2);
    txt.innerHTML = `🚚 Добави още <b>${need} €</b> за безплатна доставка`;
    fill.style.background = 'var(--primary)';
  }
  bar.style.display = '';
}

// ===== ALSO BOUGHT (QW-06) =====
function renderAlsoBought(currentId) {
  const section = document.getElementById('alsoBoughtSection');
  const track = document.getElementById('alsoBoughtTrack');
  if (!section || !track) return;
  let topIds = [];
  try {
    const log = JSON.parse(localStorage.getItem('mc_analytics_log') || '[]');
    const freq = {};
    log.filter(e => e.event === 'add_to_cart' && e.id !== currentId)
       .forEach(e => { freq[e.id] = (freq[e.id] || 0) + 1; });
    topIds = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>parseInt(id));
  } catch(e) {}
  // Fallback: top rated from same category
  if (topIds.length < 2) {
    const p = products.find(x => x.id === currentId);
    const catTop = p ? [...products].filter(x => x.id !== currentId && x.cat === p.cat)
      .sort((a,b) => b.rating - a.rating).slice(0,4).map(x=>x.id) : [];
    topIds = [...new Set([...topIds, ...catTop])].slice(0,4);
  }
  const items = topIds.map(id => products.find(x=>x.id===id)).filter(Boolean);
  if (items.length < 2) { section.style.display = 'none'; return; }
  track.innerHTML = items.map(r => `
    <div class="related-card" onclick="openProductModal(${r.id})">
      <span class="related-card-emoji">${escHtml(r.emoji||'')}</span>
      <div class="related-card-name">${escHtml(r.name)}</div>
      <div class="related-card-price">${fmtEur(r.price)}</div>
    </div>`).join('');
  section.style.display = '';
}

// ===== 4. RELATED CAROUSEL =====
let relatedOffset = 0;
function renderRelated(currentId) {
  const p = products.find(x => x.id === currentId);
  if (!p) return;
  // Same subcat, similar price (±35%); fallback to same cat; fallback to all
  let related = products.filter(x => x.id !== currentId && x.subcat && x.subcat === p.subcat
    && Math.abs(x.price - p.price) / p.price <= 0.35);
  if (related.length < 3) related = products.filter(x => x.id !== currentId && x.cat === p.cat);
  if (related.length < 3) related = products.filter(x => x.id !== currentId);
  related = related.slice(0, 8);

  const track = document.getElementById('relatedTrack');
  if (!track) return;
  relatedOffset = 0;
  track.style.transform = 'translateX(0)';
  track.innerHTML = related.map(r => `
    <div class="related-card" onclick="openProductModal(${r.id})">
      <span class="related-card-emoji">${escHtml(r.emoji||'')}</span>
      <div class="related-card-name">${escHtml(r.name)}</div>
      <div class="related-card-price">${fmtEur(r.price)}</div>
    </div>`).join('');
  updateRelatedNav(related.length);
}

function relatedNav(dir) {
  const track = document.getElementById('relatedTrack');
  const wrap = document.getElementById('relatedWrap');
  if (!track || !wrap) return;
  const cardW = 152; // 140px + 12px gap
  const visible = Math.floor(wrap.offsetWidth / cardW);
  const total = track.children.length;
  const maxOffset = Math.max(0, total - visible);
  relatedOffset = Math.max(0, Math.min(maxOffset, relatedOffset + dir));
  track.style.transform = `translateX(-${relatedOffset * cardW}px)`;
  updateRelatedNav(total);
}

function updateRelatedNav(total) {
  const wrap = document.getElementById('relatedWrap');
  const cardW = 152;
  const visible = wrap ? Math.floor(wrap.offsetWidth / cardW) : 3;
  const prevBtn = document.getElementById('relatedPrev');
  const nextBtn = document.getElementById('relatedNext');
  if (prevBtn) prevBtn.classList.toggle('hidden', relatedOffset === 0);
  if (nextBtn) nextBtn.classList.toggle('hidden', relatedOffset >= total - visible);
}


// ===== 🖼 IMAGE ZOOM =====
(function initImageZoom() {
  document.addEventListener('mousemove', e => {
    const wrap = e.target.closest('.modal-gallery-zoom');
    if (!wrap) return;
    const img = wrap.querySelector('.modal-main-img');
    if (!img || img.style.display === 'none') return;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    wrap.style.setProperty('--zoom-x', x + '%');
    wrap.style.setProperty('--zoom-y', y + '%');
  });

  // Touch zoom toggle (mobile double-tap)
  let lastTap = 0;
  document.addEventListener('touchend', e => {
    const wrap = e.target.closest('.modal-gallery-zoom');
    if (!wrap) return;
    const now = Date.now();
    if (now - lastTap < 300) {
      wrap.classList.toggle('zoomed');
      e.preventDefault();
    }
    lastTap = now;
  }, { passive: false });
})();


// ===== BACK IN STOCK =====
function submitNotifyStock() {
  const email = document.getElementById('pdpNotifyEmail')?.value.trim();
  if (!email || !email.includes('@')) { showToast('⚠️ Въведи валиден имейл'); return; }
  // Save to localStorage
  const key = 'mc_bis_' + pdpProductId;
  localStorage.setItem(key, email);
  document.getElementById('pdpNotifyForm').style.display = 'none';
  document.getElementById('pdpNotifySuccess').style.display = 'block';
  showToast('📬 Ще те уведомим при наличност!');
}

// ===== STICKY ADD-TO-CART =====
(function() {
  function initStickyBar() {
    const backdrop = document.getElementById('pdpBackdrop');
    if (!backdrop) return;
    let ticking = false;
    backdrop.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const bar = document.getElementById('pdpStickyBar');
          const addBtn = document.getElementById('pdpAddBtn');
          if (!bar || !addBtn) { ticking = false; return; }
          const rect = addBtn.getBoundingClientRect();
          const show = rect.bottom < 0;
          bar.classList.toggle('visible', show);
          // Sync qty
          const qtyMain = document.getElementById('pdpQty');
          const qtySticky = document.getElementById('pdpStickyQty');
          if (qtyMain && qtySticky) qtySticky.textContent = qtyMain.textContent;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  document.addEventListener('DOMContentLoaded', initStickyBar);
})();

function pdpUpdateStickyBar(p) {
  const nameEl = document.getElementById('pdpStickyName');
  const priceEl = document.getElementById('pdpStickyPrice');
  if (nameEl) nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = fmtEur(p.price) + ' / ' + fmtBgn(p.price);
}

// QW-02: Viewers counter — seeded by product id for consistency per session
function pdpShowViewers(p) {
  let el = document.getElementById('pdpViewers');
  if (!el) return;
  const n = 3 + ((p.id * 7 + Math.floor(Date.now() / 600000)) % 10);
  el.textContent = `👀 ${n} човека разглеждат в момента`;
  el.style.display = '';
}

// QW-05: Share product
function pdpShare(p) {
  const url = location.origin + location.pathname + '?product=' + p.id;
  if (navigator.share) {
    navigator.share({ title: p.name, text: p.brand + ' ' + p.name + ' — ' + fmtEur(p.price), url }).catch(() => {});
  } else {
    try { navigator.clipboard.writeText(url); showToast('🔗 Линкът е копиран!'); } catch(e) { showToast('🔗 ' + url); }
  }
}

// M-08: Price history sparkline
function pdpRenderSparkline(p) {
  const canvas = document.getElementById('pdpSparkline');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 120, H = canvas.height = 36;
  // Generate 6-month fake history seeded by product id
  const points = [];
  let cur = p.price;
  for (let i = 5; i >= 0; i--) {
    const seed = (p.id * 31 + i * 17) % 100;
    const delta = (seed - 50) / 50 * 0.08; // ±8%
    points.push(Math.round(cur * (1 + delta)));
  }
  points.push(p.price);
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * W);
  const ys = points.map(v => H - 4 - ((v - min) / range) * (H - 8));
  ctx.clearRect(0, 0, W, H);
  ctx.beginPath();
  ctx.moveTo(xs[0], ys[0]);
  for (let i = 1; i < xs.length; i++) ctx.lineTo(xs[i], ys[i]);
  ctx.strokeStyle = p.price <= points[0] ? '#16a34a' : '#bd1105';
  ctx.lineWidth = 1.8;
  ctx.stroke();
  // Current price dot
  ctx.beginPath();
  ctx.arc(xs[xs.length-1], ys[ys.length-1], 3, 0, Math.PI*2);
  ctx.fillStyle = p.price <= points[0] ? '#16a34a' : '#bd1105';
  ctx.fill();
  const sparkWrap = document.getElementById('pdpSparkWrap');
  if (sparkWrap) sparkWrap.style.display = '';
}

// ===== RECENTLY DISCOUNTED =====
function renderRecentlyDiscounted() {
  const el = document.getElementById('recentlyDiscountedGrid');
  if (!el) return;
  const discounted = products
    .filter(p => p.stock !== false && p.old && p.old > p.price)
    .sort((a,b) => ((b.old-b.price)/b.old) - ((a.old-a.price)/a.old))
    .slice(0, 5);
  if (!discounted.length) { el.closest('.section-wrap')?.remove(); return; }
  el.innerHTML = discounted.map(p => makeCard(p)).join('');
  updateWishlistUI();
}


// ===== REVIEW FORM =====
let rfStarVal = 0;

function rfSetStar(n) {
  rfStarVal = n;
  const labels = ['Ужасно', 'Лошо', 'Средно', 'Добро', 'Отлично'];
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = labels[n - 1] || '';
  document.querySelectorAll('.rf-star').forEach(s => {
    s.style.color = parseInt(s.dataset.v) <= n ? '#fbbf24' : '';
  });
}

function submitPdpReview() {
  const name = document.getElementById('rfName')?.value.trim();
  const text = document.getElementById('rfText')?.value.trim();
  if (!name) { showToast('⚠️ Въведи твоето ime'); return; }
  if (!rfStarVal) { showToast('⚠️ Избери рейтинг'); return; }
  if (!text || text.length < 10) { showToast('⚠️ Ревюто трябва да е поне 10 символа'); return; }

  const review = {
    name,
    stars: rfStarVal,
    text,
    date: new Date().toLocaleDateString('bg-BG'),
    pending: true,
    productId: pdpProductId,
  };

  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (!saved[pdpProductId]) saved[pdpProductId] = [];
    saved[pdpProductId].unshift(review);
    localStorage.setItem('mc_reviews', JSON.stringify(saved));
  } catch(e) {}

  // Reset form
  document.getElementById('rfName').value = '';
  document.getElementById('rfText').value = '';
  rfStarVal = 0;
  document.querySelectorAll('.rf-star').forEach(s => s.style.color = '');
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = 'Избери рейтинг';

  showToast('✅ Ревюто е изпратено и ще бъде публикувано след преглед!');
}


// ===== PDP subheader search =====
let _pdpSrchIdx = -1;
let _pdpSrchResults = [];
let _pdpSrchTimer = null;

function pdpSearchLive(q) {
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = q ? '' : 'none';
  clearTimeout(_pdpSrchTimer);
  if (!q.trim()) { pdpSearchDropClose(); return; }
  _pdpSrchTimer = setTimeout(() => _pdpSrchRender(q.trim()), 220);
}

function _pdpSrchRender(q) {
  const drop = document.getElementById('pdpSearchDrop');
  if (!drop) return;

  _pdpSrchResults = typeof searchProducts === 'function'
    ? searchProducts(q, '').slice(0, 7)
    : [];
  _pdpSrchIdx = -1;

  if (!_pdpSrchResults.length) {
    drop.innerHTML = `<div class="pdp-drop-empty">Няма намерени продукти за <strong>${escHtml(q)}</strong></div>`;
    drop.style.display = '';
    return;
  }

  drop.innerHTML = _pdpSrchResults.map((p, i) => {
    const price = typeof formatPrice === 'function' ? formatPrice(p.price) : p.price + ' лв.';
    const img = p.img
      ? `<img src="${escHtml(p.img)}" alt="" class="pdp-drop-img" loading="lazy">`
      : `<span class="pdp-drop-emoji">${escHtml(p.emoji || '📦')}</span>`;
    return `<div class="pdp-drop-item" role="option" data-idx="${i}" onmousedown="pdpSearchPick(${i})">
      <div class="pdp-drop-thumb">${img}</div>
      <div class="pdp-drop-info">
        <div class="pdp-drop-name">${escHtml(p.name)}</div>
        <div class="pdp-drop-price">${price}</div>
      </div>
    </div>`;
  }).join('') +
  `<div class="pdp-drop-all" onmousedown="pdpSearchGo(document.getElementById('pdpSearchInput').value)">
    Виж всички резултати за „${escHtml(q)}" →
  </div>`;

  drop.style.display = '';
}

function pdpSearchPick(idx) {
  const p = _pdpSrchResults[idx];
  if (!p) return;
  pdpSearchDropClose();
  const inp = document.getElementById('pdpSearchInput');
  if (inp) inp.value = '';
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = 'none';
  openProductPage(p.id);
}

function pdpSearchGo(q) {
  q = (q || '').trim();
  if (!q) return;
  pdpSearchDropClose();
  closeProductPage();
  const inp = document.getElementById('searchInput');
  if (inp) { inp.value = q; }
  if (typeof showSearchResultsPage === 'function') showSearchResultsPage(q);
}

function pdpSearchClear() {
  const inp = document.getElementById('pdpSearchInput');
  if (inp) { inp.value = ''; inp.focus(); }
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = 'none';
  pdpSearchDropClose();
}

function pdpSearchDropClose() {
  const drop = document.getElementById('pdpSearchDrop');
  if (drop) drop.style.display = 'none';
  _pdpSrchIdx = -1;
}

function pdpSearchKey(e) {
  const drop = document.getElementById('pdpSearchDrop');
  const items = drop ? drop.querySelectorAll('.pdp-drop-item') : [];
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _pdpSrchIdx = Math.min(_pdpSrchIdx + 1, items.length - 1);
    _pdpSrchHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _pdpSrchIdx = Math.max(_pdpSrchIdx - 1, -1);
    _pdpSrchHighlight(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (_pdpSrchIdx >= 0 && items[_pdpSrchIdx]) {
      pdpSearchPick(Number(items[_pdpSrchIdx].dataset.idx));
    } else {
      pdpSearchGo(e.target.value);
    }
  } else if (e.key === 'Escape') {
    pdpSearchClear();
  }
}

function _pdpSrchHighlight(items) {
  items.forEach((el, i) => el.classList.toggle('active', i === _pdpSrchIdx));
}

// Close PDP search dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('#pdpShSearch') && !e.target.closest('#pdpSearchDrop')) {
    pdpSearchDropClose();
  }
});

// ===== BUNDLE OFFER =====
function pdpRenderBundle(p) {
  const wrap = document.getElementById('pdpBundle');
  if (!wrap) return;
  if (!p.bundle || !p.bundle.length) { wrap.style.display = 'none'; return; }

  const bundleProds = p.bundle.map(id => products.find(x => x.id === id)).filter(Boolean);
  if (!bundleProds.length) { wrap.style.display = 'none'; return; }

  const disc = p.bundleDiscount || 10;
  const allProds = [p, ...bundleProds];
  const totalFull = allProds.reduce((s, x) => s + x.price, 0);
  const totalDisc = Math.round(totalFull * (1 - disc / 100));
  const saving = totalFull - totalDisc;

  const _esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const itemsHtml = allProds.map((x, i) => `
    <div class="bundle-item" onclick="openProductPage(${x.id})">
      <div class="bundle-emoji">${x.emoji}</div>
      <div class="bundle-info">
        <div class="bundle-item-name">${_esc(x.name.length > 40 ? x.name.slice(0,40)+'…' : x.name)}</div>
        <div class="bundle-item-price">${fmtEur(x.price)}</div>
      </div>
    </div>
    ${i < allProds.length - 1 ? '<div class="bundle-plus">+</div>' : ''}
  `).join('');

  wrap.innerHTML = `
    <div class="bundle-section">
      <div class="bundle-header">
        <span class="bundle-tag">🎁 Купи заедно</span>
        <span class="bundle-save-badge">Спести ${fmtEur(saving)}</span>
      </div>
      <div class="bundle-items">${itemsHtml}</div>
      <div class="bundle-footer">
        <div class="bundle-totals">
          <span class="bundle-old-total">${fmtEur(totalFull)}</span>
          <span class="bundle-new-total">${fmtEur(totalDisc)}</span>
          <span class="bundle-disc-label">-${disc}% при комплект</span>
        </div>
        <button type="button" class="bundle-add-btn" onclick="pdpAddBundle(${JSON.stringify(allProds.map(x=>x.id))})">
          🛒 Добави всички в кошницата
        </button>
      </div>
    </div>`;
  wrap.style.display = '';
}

function pdpAddBundle(ids) {
  ids.forEach(id => { if (typeof addToCart === 'function') addToCart(id); });
  showToast('✅ Комплектът е добавен в кошницата!');
}

// ===== PDP UX ENHANCEMENTS =====

// ── LIGHTBOX ──
function pdpLbOpen() {
  var img = document.getElementById('pdpMainImg');
  if (!img || !img.src || img.style.display === 'none') return;
  var lb = document.getElementById('pdpLightbox');
  var lbImg = document.getElementById('pdpLbImg');
  if (!lb || !lbImg) return;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbImg.style.setProperty('--lb-scale', '1');
  lb.style.display = 'flex';
  document.addEventListener('keydown', _pdpLbKey);
}
function pdpLbClose() {
  var lb = document.getElementById('pdpLightbox');
  if (lb) lb.style.display = 'none';
  document.removeEventListener('keydown', _pdpLbKey);
}
function pdpLbNav(dir) {
  pdpGalleryNav(dir);
  var img = document.getElementById('pdpMainImg');
  var lbImg = document.getElementById('pdpLbImg');
  if (img && lbImg) lbImg.src = img.src;
}
function _pdpLbKey(e) {
  if (e.key === 'Escape') pdpLbClose();
  if (e.key === 'ArrowLeft') pdpLbNav(-1);
  if (e.key === 'ArrowRight') pdpLbNav(1);
}
// Wheel zoom
(function() {
  document.addEventListener('wheel', function(e) {
    var lb = document.getElementById('pdpLightbox');
    if (!lb || lb.style.display === 'none') return;
    e.preventDefault();
    var lbImg = document.getElementById('pdpLbImg');
    var cur = parseFloat(lbImg.style.getPropertyValue('--lb-scale') || '1');
    var next = Math.min(4, Math.max(1, cur - e.deltaY * 0.003));
    lbImg.style.setProperty('--lb-scale', next);
  }, { passive: false });
})();

// Scroll-to-top button visibility + action
function pdpGoToTop() {
  var b = document.getElementById('pdpBackdrop');
  if (!b) return;
  b.scrollTop = 0;
}
(function() {
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop) return;
  backdrop.addEventListener('scroll', function() {
    var btn = document.getElementById('pdpScrollTop');
    if (!btn) return;
    var show = backdrop.scrollTop > 400;
    btn.style.display = show ? '' : 'none';
  }, { passive: true });
  // wire button via JS (works on both click and touch)
  var _wireBtn = function() {
    var btn = document.getElementById('pdpScrollTop');
    if (!btn) return;
    btn.addEventListener('click', pdpGoToTop);
    btn.addEventListener('touchstart', function(e) { e.preventDefault(); pdpGoToTop(); }, { passive: false });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _wireBtn);
  } else {
    _wireBtn();
  }
})();

// 1. DELIVERY TIMER
function pdpInitDeliveryTimer() {
  const el = document.getElementById('pdpDeliveryMsg');
  const cd = document.getElementById('pdpDeliveryCd');
  if (!el) return;
  clearInterval(pdpInitDeliveryTimer._iv);

  function update() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;
    if (isWeekend) {
      el.innerHTML = 'Поръчай сега и получи в <strong>понеделник</strong>';
      if (cd) cd.textContent = '';
      return;
    }
    // Cutoff: 16:30 = 16h 30m
    const cutoffSec = 16 * 3600 + 30 * 60;
    const nowSec = h * 3600 + m * 60 + now.getSeconds();
    if (nowSec < cutoffSec) {
      const secLeft = cutoffSec - nowSec;
      const hh = Math.floor(secLeft / 3600);
      const mm = String(Math.floor((secLeft % 3600) / 60)).padStart(2, '0');
      const ss = String(secLeft % 60).padStart(2, '0');
      el.innerHTML = 'Поръчай до <strong>16:30 ч.</strong> и получи <strong>утре</strong>';
      if (cd) cd.textContent = '(остават ' + hh + ':' + mm + ':' + ss + ')';
    } else {
      el.innerHTML = 'Поръчай сега — изпращаме <strong>утре</strong>';
      if (cd) cd.textContent = '';
    }
  }
  update();
  pdpInitDeliveryTimer._iv = setInterval(update, 1000);
}

// 2. RATING BREAKDOWN
function pdpRenderRatingBreakdown(revs) {
  const wrap = document.getElementById('pdpRvBreakdown');
  if (!wrap) return;
  if (!revs || !revs.length) { wrap.style.display = 'none'; return; }
  const counts = [0, 0, 0, 0, 0];
  revs.forEach(function(r) {
    const i = Math.min(4, Math.max(0, Math.round(r.stars) - 1));
    counts[i]++;
  });
  const avg = (revs.reduce(function(s, r) { return s + r.stars; }, 0) / revs.length).toFixed(1);
  const total = revs.length;
  var barsHtml = '';
  [5,4,3,2,1].forEach(function(s) {
    var c = counts[s-1];
    var pct = total ? Math.round(c / total * 100) : 0;
    barsHtml += '<div class="pdp-rvb-row">' +
      '<span class="pdp-rvb-lbl">' + s + ' ★</span>' +
      '<div class="pdp-rvb-bar"><div class="pdp-rvb-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="pdp-rvb-num">' + c + '</span>' +
      '</div>';
  });
  wrap.innerHTML = '<div class="pdp-rvb">' +
    '<div class="pdp-rvb-avg">' +
      '<div class="pdp-rvb-big">' + avg + '</div>' +
      '<div class="pdp-rvb-stars">' + starsHTML(parseFloat(avg)) + '</div>' +
      '<div class="pdp-rvb-count">' + total + ' ревют' + (total === 1 ? 'о' : 'а') + '</div>' +
    '</div>' +
    '<div class="pdp-rvb-bars">' + barsHtml + '</div>' +
  '</div>';
  wrap.style.display = '';
}

// 3. IMAGE ZOOM
function pdpInitZoom() {
  const wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap) return;
  // Remove previous listeners via flag
  if (wrap._zoomInited) {
    wrap.removeEventListener('mousemove', wrap._zoomMove);
    wrap.removeEventListener('mouseleave', wrap._zoomLeave);
  }
  wrap._zoomMove = function(e) {
    const img = document.getElementById('pdpMainImg');
    if (!img || img.style.display === 'none') return;
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    img.style.transformOrigin = x + '% ' + y + '%';
    img.style.transform = 'scale(2.2)';
    wrap.style.cursor = 'zoom-in';
  };
  wrap._zoomLeave = function() {
    const img = document.getElementById('pdpMainImg');
    if (!img) return;
    img.style.transform = '';
    img.style.transformOrigin = 'center center';
  };
  wrap.addEventListener('mousemove', wrap._zoomMove);
  wrap.addEventListener('mouseleave', wrap._zoomLeave);
  wrap._zoomInited = true;
}

// 4. MOBILE SWIPE
function pdpInitSwipe() {
  const wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap || wrap._swipeInited) return;
  var sx = 0;
  wrap.addEventListener('touchstart', function(e) {
    sx = e.touches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) {
      pdpGalleryNav(dx < 0 ? 1 : -1);
      wrap.classList.remove('swipe-bounce');
      void wrap.offsetWidth; // reflow to restart animation
      wrap.classList.add('swipe-bounce');
      setTimeout(function(){ wrap.classList.remove('swipe-bounce'); }, 320);
    }
  }, { passive: true });
  wrap._swipeInited = true;
}

// 5. TABS SCROLL SYNC
var _pdpTabsObs = null;
function pdpInitTabsScroll() {
  if (_pdpTabsObs) { _pdpTabsObs.disconnect(); _pdpTabsObs = null; }
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop || !('IntersectionObserver' in window)) return;
  var tabs = ['specs','desc','video','reviews','vendor'];
  _pdpTabsObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var tab = entry.target.id.replace('pdp-tab-', '');
        document.querySelectorAll('.pdp-tab').forEach(function(t) {
          var act = t.getAttribute('data-action') || '';
          t.classList.toggle('active', act.indexOf("'" + tab + "'") !== -1);
        });
      }
    });
  }, { root: backdrop, rootMargin: '-10% 0px -75% 0px', threshold: 0 });
  tabs.forEach(function(t) {
    var el = document.getElementById('pdp-tab-' + t);
    if (el) _pdpTabsObs.observe(el);
  });
}

// 6. SPECS SEARCH/FILTER
function pdpFilterSpecs(q) {
  var rows = document.querySelectorAll('#pdpSpecsTbody tr');
  var ql = q.toLowerCase().trim();
  rows.forEach(function(row) {
    row.style.display = (!ql || row.textContent.toLowerCase().indexOf(ql) !== -1) ? '' : 'none';
  });
  var noRes = document.getElementById('pdpSpecsNoResult');
  var visible = Array.from(rows).some(function(r) { return r.style.display !== 'none'; });
  if (noRes) noRes.style.display = (ql && !visible) ? '' : 'none';
}

// 7. RELATED PRODUCTS CAROUSEL
function pdpRenderRelated(p) {
  var section = document.getElementById('pdpRelated');
  var scroll  = document.getElementById('pdpRelatedScroll');
  var title   = document.getElementById('pdpRelatedTitle');
  if (!section || !scroll) return;
  var all = (typeof products !== 'undefined') ? products : [];
  var related = all.filter(function(x) { return x.id !== p.id && x.cat === p.cat; })
    .sort(function() { return Math.random() - 0.5; })
    .slice(0, 14);
  if (related.length < 2) { section.style.display = 'none'; return; }
  if (title) {
    var catLabel = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[p.cat]) ? CAT_LABELS[p.cat] : '';
    title.textContent = catLabel ? ('Подобни — ' + catLabel) : 'Подобни продукти';
  }
  scroll.innerHTML = related.map(_pdpCarCard).join('');
  section.style.display = '';
}

// 8. RECENTLY VIEWED CAROUSEL IN PDP
function pdpRenderRvCarousel() {
  var section = document.getElementById('pdpRvSection');
  var scroll  = document.getElementById('pdpRvCarousel');
  if (!section || !scroll) return;
  var rv = [];
  try { rv = JSON.parse(localStorage.getItem('mc_rv') || '[]'); } catch(e) {}
  var all = (typeof products !== 'undefined') ? products : [];
  var items = rv.map(function(id) { return all.find(function(p) { return p.id === id; }); })
    .filter(Boolean).slice(0, 14);
  if (items.length < 2) { section.style.display = 'none'; return; }
  scroll.innerHTML = items.map(_pdpCarCard).join('');
  section.style.display = '';
}

// Shared carousel card renderer
function _pdpCarCard(p) {
  var price = (typeof fmtEur === 'function') ? fmtEur(p.price) : (p.price + ' лв.');
  var thumb = p.img
    ? '<img class="pdp-car-img" src="' + p.img + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
    : '';
  var emoji = '<span class="pdp-car-emoji"' + (p.img ? ' style="display:none"' : '') + '>' + (p.emoji || '📦') + '</span>';
  var stars = p.rating ? '<div class="pdp-car-stars">' + starsHTML(p.rating) + '</div>' : '';
  var badge = p.badge === 'sale' ? '<span class="pdp-car-badge">Промо</span>'
    : p.badge === 'new' ? '<span class="pdp-car-badge pdp-car-badge-new">Ново</span>' : '';
  return '<div class="pdp-car-card" onclick="openProductPage(' + p.id + ')">' +
    '<div class="pdp-car-thumb">' + badge + thumb + emoji + '</div>' +
    '<div class="pdp-car-info">' +
      '<div class="pdp-car-name">' + (typeof _esc === 'function' ? _esc(p.name) : escHtml(p.name)) + '</div>' +
      stars +
      '<div class="pdp-car-price">' + price + '</div>' +
    '</div>' +
  '</div>';
}

// Carousel scroll helper
function pdpCarScroll(id, dir) {
  var el = document.getElementById(id);
  if (el) el.scrollBy({ left: dir * 230, behavior: 'smooth' });
}

// ===== 9. STICKY SPECS SIDEBAR =====
function pdpRenderSpecsSidebar(p) {
  var sb = document.getElementById('pdpSpecsSidebar');
  if (!sb) return;
  var specs = p.specs || {};
  var keys = Object.keys(specs).slice(0, 10);
  if (!keys.length) { sb.style.display = 'none'; return; }
  var rows = keys.map(function(k) {
    var _e = typeof _esc === 'function' ? _esc : escHtml;
    return '<tr><td class="pdp-sb-key">' + _e(k) + '</td><td class="pdp-sb-val">' + _e(specs[k]) + '</td></tr>';
  }).join('');
  sb.innerHTML =
    '<div class="pdp-sb-title">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' +
      ' Основни характеристики' +
    '</div>' +
    '<table class="pdp-sb-table"><tbody>' + rows + '</tbody></table>' +
    '<button type="button" class="pdp-sb-more" onclick="pdpSwitchTab(\'specs\');document.getElementById(\'pdp-tab-specs\').scrollIntoView({behavior:\'smooth\'})">Виж всички →</button>';
  sb.style.display = '';
}

// ===== 10. PRINT / PDF =====
function pdpPrintSpecs() {
  var p = (typeof products !== 'undefined') ? products.find(function(x) { return x.id === pdpProductId; }) : null;
  if (!p) return;
  var specs = p.specs || {};
  var _ep = function(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var rows = Object.keys(specs).map(function(k) {
    return '<tr><td style="padding:7px 12px;font-weight:600;color:#444;width:38%;border-bottom:1px solid #eee;">' + _ep(k) +
           '</td><td style="padding:7px 12px;border-bottom:1px solid #eee;">' + _ep(specs[k]) + '</td></tr>';
  }).join('');
  var win = window.open('', '_blank', 'width=800,height=700');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(
    '<!DOCTYPE html><html><head><title>' + _ep(p.name) + ' — Характеристики</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a;}h1{font-size:20px;margin-bottom:4px;}' +
    '.sub{color:#888;font-size:13px;margin-bottom:24px;}table{width:100%;border-collapse:collapse;}' +
    'tr:nth-child(even){background:#f9f9f9;}' +
    '@media print{button{display:none!important;}}' +
    '</style></head><body>' +
    '<h1>' + _ep(p.name) + '</h1>' +
    '<div class="sub">' + _ep(p.brand || '') + (p.sku ? ' · SKU: ' + _ep(p.sku) : '') + '</div>' +
    '<table><tbody>' + rows + '</tbody></table>' +
    '<br><button onclick="window.print()" style="padding:10px 22px;background:#bd1105;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🖨 Принтирай</button>' +
    '</body></html>'
  );
  win.document.close();
}

// ===== 11. COMPARE BUTTON IN PDP =====
function pdpToggleCompare() {
  var btn = document.getElementById('pdpCompareBtn');
  if (!pdpProductId || typeof toggleCompare !== 'function') return;
  var isActive = btn && btn.classList.contains('active');
  toggleCompare(pdpProductId, !isActive);
  if (btn) {
    if (!isActive) {
      btn.innerHTML = btn.innerHTML.replace('Сравни', 'Сравнено ✓');
      btn.classList.add('active');
    } else {
      btn.innerHTML = btn.innerHTML.replace('Сравнено ✓', 'Сравни');
      btn.classList.remove('active');
    }
  }
}

// Reset compare button state when new product opens
var _pdpCompareReset = function() {
  var btn = document.getElementById('pdpCompareBtn');
  if (!btn) return;
  btn.classList.remove('active');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Сравни';
};

// ===== 12. MOBILE BOTTOM SHEET =====
var _pdpBsVisible = false;

function pdpBsOpen(p) {
  var sheet = document.getElementById('pdpBottomSheet');
  var overlay = document.getElementById('pdpBsOverlay');
  if (!sheet || !p) return;
  // Populate
  var nameEl = document.getElementById('pdpBsName');
  var priceEl = document.getElementById('pdpBsPrice');
  var thumbEl = document.getElementById('pdpBsThumb');
  if (nameEl) nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = (typeof fmtEur === 'function') ? fmtEur(p.price) : p.price + ' лв.';
  if (thumbEl) {
    thumbEl.innerHTML = p.img
      ? '<img src="' + p.img + '" style="width:44px;height:44px;object-fit:contain;border-radius:6px;">'
      : '<span style="font-size:28px;">' + (p.emoji || '📦') + '</span>';
  }
  sheet.classList.add('open');
  if (overlay) { overlay.style.display = ''; }
  _pdpBsVisible = true;
}

function pdpBsClose() {
  var sheet = document.getElementById('pdpBottomSheet');
  var overlay = document.getElementById('pdpBsOverlay');
  if (sheet) sheet.classList.remove('open');
  if (overlay) overlay.style.display = 'none';
  _pdpBsVisible = false;
}

// Show bottom sheet when add button scrolls out of view (mobile only)
(function() {
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop) return;
  backdrop.addEventListener('scroll', function() {
    if (window.innerWidth > 768) return;
    var addBtn = document.getElementById('pdpAddBtn');
    if (!addBtn) return;
    var rect = addBtn.getBoundingClientRect();
    var outOfView = rect.bottom < 0 || rect.top > window.innerHeight;
    var sheet = document.getElementById('pdpBottomSheet');
    if (!sheet) return;
    if (outOfView && !sheet.classList.contains('open')) {
      var p = (typeof products !== 'undefined' && pdpProductId != null)
        ? products.find(function(x) { return x.id === pdpProductId; }) : null;
      if (p) pdpBsOpen(p);
    } else if (!outOfView && sheet.classList.contains('open')) {
      pdpBsClose();
    }
  }, { passive: true });
})();

// Sync bottom sheet qty display
var _origPdpChangeQty = typeof pdpChangeQty === 'function' ? pdpChangeQty : null;

// ===== 13. PINCH-TO-ZOOM =====
function pdpInitPinch() {
  var wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap || wrap._pinchInited) return;
  var startDist = 0, curScale = 1;

  wrap.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      startDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  wrap.addEventListener('touchmove', function(e) {
    if (e.touches.length !== 2) return;
    var dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    var img = document.getElementById('pdpMainImg');
    if (!img || img.style.display === 'none') return;
    curScale = Math.min(Math.max(dist / startDist, 1), 3.5);
    img.style.transform = 'scale(' + curScale + ')';
  }, { passive: true });

  wrap.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
      // reset after short delay
      setTimeout(function() {
        var img = document.getElementById('pdpMainImg');
        if (img) { img.style.transform = ''; curScale = 1; }
      }, 300);
    }
  }, { passive: true });

  wrap._pinchInited = true;
}

// ===== BREADCRUMBS =====
// State: array of {label, action}  — action is a function or null for current
let _bcTrail = []; // [{label, fn}]

// BC_CAT_LABELS → вж. глобалния CAT_LABELS в currency.js
const BC_CAT_LABELS = CAT_LABELS;

function bcRender() {
  const inner = document.getElementById('bcInner');
  if (!inner) return;

  // Always start with Home
  const crumbs = [{ label: 'Начало', fn: () => { closeProductPage(); bcSet([]); } }, ..._bcTrail];

  window._bcFns = window._bcFns || {};
  const html = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep    = i > 0 ? '<span class="bc-sep" aria-hidden="true">›</span>' : '';
    if (isLast) {
      return `${sep}<div class="bc-item current" aria-current="page"><span title="${c.label}">${c.label}</span></div>`;
    }
    window._bcFns[i] = c.fn;
    return `${sep}<div class="bc-item"><button type="button" onclick="if(window._bcFns[${i}])window._bcFns[${i}]()">${c.label}</button></div>`;
  }).join('');

  inner.innerHTML = html;

  // Mirror into PDP subheader breadcrumb
  const pdpBc = document.getElementById('pdpBcInner');
  if (pdpBc) pdpBc.innerHTML = html;

  // JSON-LD structured data
  const ldCrumbs = crumbs.map((c, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": c.label,
    "item": c.url || (i === 0 ? 'https://mostcomputers.bg/' : window.location.href.split('?')[0])
  }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": ldCrumbs
  };
  const ldEl = document.getElementById('bcJsonLd');
  if (ldEl) ldEl.textContent = JSON.stringify(ld, null, 2);
}

function bcSet(trail) {
  _bcTrail = trail;
  bcRender();
}

function bcPush(label, fn) {
  _bcTrail.push({ label, fn });
  bcRender();
}

function bcPopTo(idx) {
  _bcTrail = _bcTrail.slice(0, idx);
  bcRender();
}

// ── Hook into navigation events ──

// Category filter
function bcOnFilterCat(cat) {
  if (cat === 'all') {
    bcSet([]);
  } else {
    const label = BC_CAT_LABELS[cat] || cat;
    const url = `https://mostcomputers.bg/?cat=${cat}`;
    bcSet([{
      label,
      url,
      fn: () => { filterCat(cat); bcSet([{ label, url, fn: () => filterCat(cat) }]); }
    }]);
  }
}

// Product page open
// breadcrumb hooks are inlined in openProductPage and closeProductPage

// Search results
function bcOnSearch(query) {
  bcSet([{ label: `Търсене: „${query}"`, fn: null }]);
}

// Blog / Service / Delivery pages
function bcOnPage(label) {
  bcSet([{ label, fn: null }]);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  bcRender(); // renders just "Начало"
});



// ===== ItemList schema for category pages =====
function injectCategoryItemList(cat) {
  let el = document.getElementById('category-jsonld');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'category-jsonld'; document.head.appendChild(el); }
  if (!cat || cat === 'all') { el.textContent = ''; return; }
  const list = (typeof getFilteredSorted === 'function')
    ? getFilteredSorted().slice(0, 20)
    : (typeof products !== 'undefined' ? products.filter(p => p.cat === cat).slice(0, 20) : []);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] + ' — Most Computers' : cat,
    "url": `https://mostcomputers.bg/?cat=${cat}`,
    "numberOfItems": list.length,
    "itemListElement": list.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://mostcomputers.bg/?product=${p.id}`,
      "name": p.name
    }))
  };
  el.textContent = JSON.stringify(schema);
}

// ===== 5. JSON-LD STRUCTURED DATA =====
function injectProductSchema(p) {
  let el = document.getElementById('product-jsonld');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'product-jsonld'; document.head.appendChild(el); }
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0] : (p.img || null);
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.name,
    "brand": { "@type": "Brand", "name": p.brand },
    "sku": p.sku,
    "gtin13": p.ean,
    "description": p.desc,
    ...(imgSrc ? { "image": [imgSrc] } : {}),
    "offers": {
      "@type": "Offer",
      "url": `${location.href.split('?')[0]}?product=${p.id}`,
      "priceCurrency": "BGN",
      "price": p.price,
      "priceValidUntil": priceValidUntil,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": p.stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Most Computers" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating,
      "reviewCount": p.rv,
      "bestRating": 5,
      "worstRating": 1
    }
  };
  if (Array.isArray(p.reviews) && p.reviews.length > 0) {
    schema.review = p.reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": r.date,
      "reviewBody": r.text,
      "reviewRating": { "@type": "Rating", "ratingValue": r.stars, "bestRating": 5, "worstRating": 1 }
    }));
  }
  el.textContent = JSON.stringify(schema);
}

// JSON-LD injected via mc:productopen event (fired in openProductModal)
document.addEventListener('mc:productopen', e => {
  const p = products.find(x => x.id === e.detail);
  if (!p) return;
  injectProductSchema(p);
  document.title = p.name + ' | Most Computers';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} — ${p.brand} | Цена: ${(p.price/EUR_RATE).toFixed(2)} €. Купи онлайн от Most Computers.`;
    metaDesc.setAttribute('content', descText);
  }
  // Update Open Graph meta tags for social sharing
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', p.name + ' | Most Computers');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 200) + (p.desc.length > 200 ? '…' : '')
      : `${p.name} — ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €. Купи онлайн от Most Computers.`;
    ogDesc.setAttribute('content', descText);
  }
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) {
    const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0]
      : (p.img || 'https://mostcomputers.bg/og-default.jpg');
    ogImg.setAttribute('content', imgSrc);
  }
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://mostcomputers.bg/?product=${p.id}`);
  const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0]
    : (p.img || 'https://mostcomputers.bg/og-default.jpg');
  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.setAttribute('content', imgSrc);
  // og:type → product
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'product');
  // og:image:alt
  const ogImgAlt = document.querySelector('meta[property="og:image:alt"]');
  if (ogImgAlt) ogImgAlt.setAttribute('content', p.name + ' — Most Computers');
  // Twitter title + description
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', p.name + ' | Most Computers');
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) {
    const d = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} — ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €.`;
    twDesc.setAttribute('content', d);
  }
  // Canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://mostcomputers.bg/?product=${p.id}`);
});

// ===== 6. SITEMAP GENERATOR =====
function generateSitemap() {
  const base = 'https://mostcomputers.bg';
  const today = new Date().toISOString().split('T')[0];
  const staticPages = [
    { url: '/', priority: '1.0', freq: 'daily' },
    { url: '/?cat=laptops', priority: '0.9', freq: 'weekly' },
    { url: '/?cat=desktops', priority: '0.9', freq: 'weekly' },
    { url: '/?cat=components', priority: '0.8', freq: 'weekly' },
    { url: '/?cat=peripherals', priority: '0.8', freq: 'weekly' },
    { url: '/?cat=network', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=storage', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=accessories', priority: '0.7', freq: 'weekly' },
  ];
  const productPages = products.map(p => ({
    url: `/?product=${p.id}`,
    priority: '0.8',
    freq: 'monthly'
  }));
  const allPages = [...staticPages, ...productPages];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allPages.map(pg => `  <url>\n    <loc>${base}${pg.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${pg.freq}</changefreq>\n    <priority>${pg.priority}</priority>\n  </url>`).join('\n') +
    `\n</urlset>`;

  // Download as file
  const blob = new Blob([xml], { type: 'application/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sitemap.xml';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('✓ sitemap.xml изтеглен успешно!');
}

// Init URL params on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(readURLParams, 100);
});



// ===== EMAIL PROTECTION =====
function epClick(el) {
  const u = el.dataset.u, d = el.dataset.d;
  const addr = u + '@' + d;
  // Activate mailto on the parent <a> if present, otherwise open directly
  const link = el.closest('a') || el;
  link.href = 'mailto:' + addr;
}
// Also handle direct span clicks
document.addEventListener('click', e => {
  const ep = e.target.closest('.ep');
  if (ep) {
    e.preventDefault();
    const addr = ep.dataset.u + '@' + ep.dataset.d;
    location.href = 'mailto:' + addr;
  }
});



// ===== 📲 SHARE PRODUCT (Web Share API) =====
function shareProduct() {
  const p = products.find(x => x.id === modalProductId);
  if (!p) return;
  const url = location.origin + location.pathname + '?product=' + p.id;
  const title = p.name + ' — Most Computers';
  const text = p.name + ' от ' + p.brand + ' — ' + (p.price / EUR_RATE).toFixed(2) + ' €';

  if (navigator.share) {
    navigator.share({ title, text, url })
      .catch(() => {}); // user cancelled — silent
  } else {
    // Fallback: показваме popup с линка
    document.getElementById('shareUrl').textContent = url;
    document.getElementById('shareFallback').classList.add('open');
    // Auto-close след 8 сек
    clearTimeout(window._shareTimer);
    window._shareTimer = setTimeout(closeShareFallback, 8000);
  }
}

function copyShareUrl() {
  const url = document.getElementById('shareUrl').textContent;
  navigator.clipboard.writeText(url).then(() => {
    const el = document.getElementById('shareUrl');
    const orig = el.textContent;
    el.textContent = '✓ Копирано!';
    setTimeout(() => { el.textContent = orig; }, 1800);
  }).catch(() => {
    // Fallback за по-стари браузъри
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✓ Линкът е копиран!');
    closeShareFallback();
  });
}

function closeShareFallback() {
  document.getElementById('shareFallback').classList.remove('open');
}

// Close share fallback on backdrop click
document.addEventListener('click', e => {
  const fb = document.getElementById('shareFallback');
  if (fb && fb.classList.contains('open') && !fb.contains(e.target)) {
    closeShareFallback();
  }
});


// ═══════════════════════════════════════
// CATEGORY META
// ═══════════════════════════════════════
const CAT_META = {
  phones:     { emoji:'📱', icon:'ic-phone',      label:'Телефони и таблети',   sub:'Смартфони, Таблети, Смарт часовници', badge:null },
  laptops:    { emoji:'💻', icon:'ic-laptop',     label:'Лаптопи',              sub:'За работа, Гейминг, Ултрабуци', badge:null },
  desktops:   { emoji:'🖥', icon:'ic-desktop',    label:'Настолни компютри',    sub:'Офис, Workstation, All-in-One', badge:null },
  gaming:     { emoji:'🎮', icon:'ic-gamepad',    label:'Гейминг',              sub:'Gaming лаптопи, PC, Мишки, Клавиатури', badge:'hot' },
  monitors:   { emoji:'🖥', icon:'ic-monitor',    label:'Монитори',             sub:'Gaming 144Hz+, 4K, OLED, UltraWide', badge:null },
  components: { emoji:'⚙️', icon:'ic-cpu',        label:'Компоненти',           sub:'CPU, GPU, RAM, SSD/HDD, Дъна', badge:null },
  peripherals:{ emoji:'🖱', icon:'ic-mouse',      label:'Периферия',            sub:'Клавиатури, Мишки, Слушалки, Камери', badge:null },
  network:    { emoji:'📡', icon:'ic-wifi',       label:'Мрежово оборудване',   sub:'Рутери, Суичове, Mesh, AP', badge:null },
  storage:    { emoji:'💾', icon:'ic-storage',    label:'Сървъри и сторидж',    sub:'NAS, Сървъри, Външни дискове', badge:null },
  accessories:{ emoji:'🎒', icon:'ic-mouse',      label:'Аксесоари',            sub:'Чанти, Кабели, Smart Home, TV', badge:null },
  new:        { emoji:'🆕', icon:'ic-star',       label:'Нови продукти',        sub:'Пресни пристигания', badge:'NEW' },
  sale:       { emoji:'%',  icon:'ic-tag',        label:'Намаления',            sub:'До -60% на избрани продукти', badge:'SALE' },
};
const HP_CAT_ORDER = ['laptops','desktops','components','monitors','peripherals','network','storage','accessories'];

// ═══════════════════════════════════════
// RENDER HOMEPAGE CATEGORY CARDS (kept for fallback)
// ═══════════════════════════════════════
function renderHpCats() {
  const grid = document.getElementById('hpCatsGrid');
  if (!grid) return;
  grid.innerHTML = HP_CAT_ORDER.map(cat => {
    const m = CAT_META[cat];
    const count = products.filter(p => p.cat === cat).length;
    return `
      <div class="hp-cat-card" onclick="openCatPage('${cat}')" role="button" tabindex="0" aria-label="Разгледай ${m.label}" onkeydown="if(event.key==='Enter'||event.key===' ')openCatPage('${cat}')">
        ${m.badge ? `<span class="hp-cat-badge">${m.badge}</span>` : ''}
        <span class="hp-cat-icon"><svg width="36" height="36" aria-hidden="true"><use href="#${m.icon}"/></svg></span>
        <div class="hp-cat-name">${m.label}</div>
        <div class="hp-cat-count">${count > 0 ? count + ' продукта' : ''}</div>
      </div>`;
  }).join('');
}

// ═══════════════════════════════════════
// RENDER HOMEPAGE SUBCATEGORY STRIP
// ═══════════════════════════════════════
const HP_SUBCATS = [
  { cat:'laptops',    id:'gaming_l',    label:'Gaming лаптопи',        icon:'🎮', trending:true  },
  { cat:'components', id:'gpu',         label:'Видеокарти',            icon:'🎴', trending:true  },
  { cat:'monitors',   id:'gaming_mon',   label:'Gaming монитори',       icon:'🎮', trending:true  },
  { cat:'monitors',   id:'oled_mon',    label:'OLED монитори',         icon:'✨', trending:true  },
  { cat:'gaming',     id:'gaming_pc_s', label:'Gaming PC',             icon:'🕹'                },
  { cat:'components', id:'cpu',         label:'Процесори',             icon:'⚡'                },
  { cat:'laptops',    id:'ultrabook',   label:'Ултрабуци',             icon:'💼'                },
  { cat:'peripherals',id:'keyboard',    label:'Клавиатури',            icon:'⌨️'               },
  { cat:'network',    id:'router',      label:'Рутери',                icon:'📡'                },
  { cat:'network',    id:'mesh',        label:'Mesh Wi-Fi системи',    icon:'🕸️'               },
  { cat:'network',    id:'adapter',     label:'Wi-Fi адаптери',        icon:'🔌'                },
  { cat:'storage',    id:'nas',         label:'NAS / Сторидж',         icon:'💾'                },
  { cat:'laptops',    id:'for_students',label:'Студентски лаптопи',    icon:'🎓'                },
  { cat:'peripherals',id:'mouse',       label:'Геймърски мишки',       icon:'🖱'                },
  { cat:'peripherals',id:'webcam',      label:'Уеб камери',            icon:'📸'                },
  { cat:'components', id:'ram',         label:'RAM памет',             icon:'🧠'                },
  { cat:'components', id:'ssd_hdd',     label:'SSD дискове',           icon:'💿'                },
  { cat:'desktops',   id:'workstation', label:'Работни станции',       icon:'🖥'                },
  { cat:'peripherals',id:'headphones',  label:'Слушалки',              icon:'🎧'                },
  { cat:'network',    id:'switch',      label:'Суичове',               icon:'🔀'                },
  { cat:'accessories',id:'hub',         label:'USB хъбове',            icon:'🔌'                },
  { cat:'components', id:'psu',         label:'Захранвания',           icon:'🔋'                },
  { cat:'laptops',    id:'for_design',  label:'За дизайн',             icon:'🎨'                },
  { cat:'peripherals',id:'printer',     label:'Принтери',              icon:'🖨'                },
  { cat:'components', id:'case_cooling',label:'Кутии и охлаждане',     icon:'❄️'               },
];

const HP_SUBCATS_VISIBLE = 10;

function renderHpSubcatsStrip() {
  const wrap = document.getElementById('hpCatsGrid');
  if (!wrap) return;
  const pills = HP_SUBCATS.map((s, i) => {
    const count = (typeof matchesSubcat === 'function')
      ? products.filter(p => p.cat === s.cat && matchesSubcat(p, s.id)).length
      : products.filter(p => p.cat === s.cat).length;
    const hidden = i >= HP_SUBCATS_VISIBLE ? ' hp-subcat-hidden' : '';
    return `<button type="button" class="hp-subcat-pill${hidden}" data-cattype="${s.cat}" onclick="openCatPage('${s.cat}');applySubcatById('${s.id}')" aria-label="${s.label}">
      ${s.trending ? '<span class="hp-subcat-trend">🔥</span>' : ''}
      <span class="hp-subcat-pill-icon">${s.icon}</span>
      <span class="hp-subcat-pill-label">${s.label}</span>
      ${count > 0 ? `<span class="hp-subcat-pill-count">${count}</span>` : ''}
    </button>`;
  }).join('');
  const remaining = HP_SUBCATS.length - HP_SUBCATS_VISIBLE;
  const moreBtn = remaining > 0
    ? `<button type="button" class="hp-subcat-more" onclick="hpShowMoreSubcats(this)">+ ${remaining} още ▾</button>`
    : '';
  wrap.innerHTML = pills + moreBtn;
}

function hpShowMoreSubcats(btn) {
  document.querySelectorAll('#hpCatsGrid .hp-subcat-hidden').forEach(el => el.classList.remove('hp-subcat-hidden'));
  btn.remove();
}

// ═══════════════════════════════════════
// CATEGORY PAGE STATE
// ═══════════════════════════════════════
let cpCat = 'all';
let cpSort = 'bestseller';
let cpPriceMin = 0, cpPriceMax = 2000;
let cpBrands = new Set();
let cpRating = 0;
let cpSaleOnly = false, cpNewOnly = false, cpStockOnly = false;
let cpSpecFilters = {};
let cpSubcat = 'all';

let _catPageScrollY = 0;
function openCatPage(cat, preSubcat) {
  _catPageScrollY = window.scrollY || document.documentElement.scrollTop;
  cpCat = cat;
  cpSort = 'bestseller';
  cpPriceMin = 0; cpPriceMax = 2000;
  cpBrands = new Set();
  cpRating = 0; cpSaleOnly = false; cpNewOnly = false; cpStockOnly = false;
  cpSpecFilters = {};

  cpSubcat = preSubcat || 'all';

  const m = CAT_META[cat] || { emoji:'🗂', label: cat, sub:'' };
  const cpEmoji = document.getElementById('cpEmoji');
  const cpTitle = document.getElementById('cpTitle');
  const cpSubtitle = document.getElementById('cpSubtitle');
  if (cpEmoji) cpEmoji.textContent = m.emoji;
  if (cpTitle) cpTitle.textContent = m.label;
  if (cpSubtitle) cpSubtitle.textContent = m.sub;

  // Build sidebar HTML
  buildCpSidebar(cat);
  // Build subcat bar
  cpRenderSubcatBar(cat);

  // Highlight pre-selected subcat pill if provided
  if (preSubcat && preSubcat !== 'all') {
    document.querySelectorAll('#cpSubcatBar .subcat-pill').forEach(p => p.classList.remove('active'));
    const activePill = document.querySelector(`#cpSubcatBar .subcat-pill[onclick*="'${preSubcat}'"]`);
    if (activePill) activePill.classList.add('active');
  }

  // Update SEO
  const _catDesc = m.label + ' — ' + m.sub + '. Купи онлайн от Most Computers.';
  setPageMeta(m.label + ' | Most Computers', _catDesc);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://mostcomputers.bg/?cat=${cat}`);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://mostcomputers.bg/?cat=${cat}`);

  // Open page first so grid element is visible, then render
  document.getElementById('catPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  try{history.pushState({ catPage: cat }, '', '?cat=' + cat);}catch(e){}
  // Render after page is shown
  cpRenderGrid();
}

function closeCatPage() {
  // Close any open product page or modal first
  const pdp = document.getElementById('pdpBackdrop');
  if (pdp && pdp.classList.contains('open')) pdp.classList.remove('open');
  const modal = document.getElementById('productModalBackdrop');
  if (modal && modal.classList.contains('open')) modal.classList.remove('open');
  document.getElementById('catPage').classList.remove('open');
  document.body.style.overflow = '';
  restorePageMeta();
  // Restore Open Graph extras
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | Лаптопи, Телефони, Телевизори — От 1997 г.');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', 'Most Computers — специализиран магазин за електроника от 1997 г. Смартфони, лаптопи, телевизори от Apple, Samsung, Sony. Безплатна доставка над 100 €.');
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', 'https://mostcomputers.bg/og-default.jpg');
  const ogImgAlt = document.querySelector('meta[property="og:image:alt"]');
  if (ogImgAlt) ogImgAlt.setAttribute('content', 'Most Computers — магазин за електроника от 1997 г.');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://mostcomputers.bg/');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', 'Most Computers | Електроника от 1997 г.');
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', 'Лаптопи, Телефони, Телевизори, Аудио и аксесоари от Apple, Samsung, Sony. Безплатна доставка над 100 €.');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/');
  try{history.pushState({}, '', location.pathname);}catch(e){}
  // Restore scroll position
  requestAnimationFrame(() => window.scrollTo(0, _catPageScrollY));
}

// Back button support
window.addEventListener('popstate', e => {
  // If we navigated back to a cat page state, keep or re-open it
  if (e.state?.catPage) {
    const pg = document.getElementById('catPage');
    if (pg && !pg.classList.contains('open')) {
      openCatPage(e.state.catPage);
    }
  } else {
    // Navigated back to homepage
    const pg = document.getElementById('catPage');
    if (pg) pg.classList.remove('open');
    const pdp = document.getElementById('pdpBackdrop');
    if (pdp) pdp.classList.remove('open');
    const modal = document.getElementById('productModalBackdrop');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ═══════════════════════════════════════
// BUILD CAT PAGE SIDEBAR
// ═══════════════════════════════════════
function buildCpSidebar(cat) {
  const sb = document.getElementById('cpSidebar');
  if (!sb) return;

  const catProds = cat === 'all' ? products : products.filter(p =>
    normalizeCat(p.cat) === cat || (cat === 'new' && p.badge === 'new') || (cat === 'sale' && p.badge === 'sale'));
  const allBrands = [...new Set(products.map(p => p.brand))].sort();
  const brands = allBrands.filter(b => catProds.some(p => p.brand === b));
  const maxPrice = Math.max(...catProds.map(p => toEur(p.price)));
  const maxPriceRound = Math.min(2000, Math.ceil(maxPrice / 100) * 100);

  // ── Price block ──
  let html = `
    <div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
      <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">💰 Ценови диапазон</div>
      <div class="sidebar-price-slider">
        <div class="price-slider-header">
          <span style="font-size:11px;color:var(--muted);font-weight:600;">Диапазон (€):</span>
          <span class="price-slider-vals" id="cpPriceVals">0 € — ${maxPriceRound} €</span>
        </div>
        <div class="sb-slider-wrap">
          <div class="sb-slider-track"><div class="sb-slider-range" id="cpSliderRange"></div></div>
          <input type="range" class="sb-slider" id="cpPriceMinSlider" min="0" max="${maxPriceRound}" value="0" step="5" oninput="cpUpdateSlider()">
          <input type="range" class="sb-slider" id="cpPriceMaxSlider" min="0" max="${maxPriceRound}" value="${maxPriceRound}" step="5" oninput="cpUpdateSlider()">
        </div>
      </div>
    </div>`;

  // ── Availability toggles ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
    <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">📦 Наличност</div>
    <div class="stock-filter-list">
      <div class="stock-toggle-row">
        <span class="text-13">✅ Само налични</span>
        <label class="stock-toggle"><input type="checkbox" id="cpStockToggle" onchange="cpApplyFilters()"><span class="stock-slider-toggle"></span></label>
      </div>
      <div class="stock-toggle-row" style="margin-top:8px;">
        <span class="text-13">🔥 Само намалени</span>
        <label class="stock-toggle"><input type="checkbox" id="cpSaleToggle" onchange="cpApplyFilters()"><span class="stock-slider-toggle"></span></label>
      </div>
      <div class="stock-toggle-row" style="margin-top:8px;">
        <span class="text-13">🆕 Само нови</span>
        <label class="stock-toggle"><input type="checkbox" id="cpNewToggle" onchange="cpApplyFilters()"><span class="stock-slider-toggle"></span></label>
      </div>
    </div>
  </div>`;

  // ── Spec filters ──
  const specs = CAT_SPEC_FILTERS[cat];
  if (specs && specs.length) {
    specs.forEach(spec => {
      html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
        <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${spec.label}</div>
        <div style="display:flex;flex-direction:column;gap:4px;">`;
      spec.values.forEach(val => {
        html += `<label class="brand-filter-item" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" data-spec-key="${spec.key}" value="${val}" onchange="cpSpecChange(this)">
          <span style="flex:1;font-size:13px;">${val}</span>
        </label>`;
      });
      html += `</div></div>`;
    });
  }

  // ── Brands (collapsed by default) ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);">
    <div onclick="cpToggleBrands(this)" style="display:flex;align-items:center;justify-content:space-between;padding:16px;cursor:pointer;user-select:none;">
      <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin:0;">🏷 Марка</div>
      <span id="cpBrandArrow" style="color:var(--muted);font-size:13px;transition:transform .2s;">▾</span>
    </div>
    <div id="cpBrandBody" style="display:none;padding:0 16px 14px;">
      <input id="cpBrandSearch" placeholder="🔍  Търси марка..." oninput="cpFilterBrandList(this.value)" autocomplete="off" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);box-sizing:border-box;margin-bottom:8px;">
      <div class="brand-filter-list" id="cpBrandList" style="max-height:220px;overflow-y:auto;">`;
  brands.forEach(b => {
    const cnt = catProds.filter(p => p.brand === b).length;
    html += `<label class="brand-filter-item">
      <input type="checkbox" value="${b}" onchange="cpBrandChange(this)">
      <span style="flex:1;">${b}</span>
      <span class="brand-count">${cnt}</span>
    </label>`;
  });
  html += `</div></div></div>`;

  // ── Rating ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
    <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">⭐ Рейтинг</div>
    <div class="rating-filter-list">
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="0" checked onchange="cpRatingChange(this)"><span>Всички</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="4.5" onchange="cpRatingChange(this)"><span>★★★★★ 4.5+</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="4" onchange="cpRatingChange(this)"><span>★★★★☆ 4.0+</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="3" onchange="cpRatingChange(this)"><span>★★★☆☆ 3.0+</span></label>
    </div>
  </div>`;


  // ── Reset button ──
  html += `<div style="padding:12px 16px 16px;">
    <button type="button" onclick="cpResetFilters()" style="width:100%;background:none;border:1px solid var(--border);border-radius:8px;padding:9px;font-size:12px;font-weight:700;color:var(--text2);cursor:pointer;font-family:'Outfit',sans-serif;transition:all .18s;" onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">
      ✕ Изчисти всички филтри
    </button>
  </div>`;

  sb.innerHTML = html;
  cpUpdateSlider();
}

function cpUpdateSlider() {
  if (!document.getElementById('catPage')?.classList.contains('open')) return;
  const minEl = document.getElementById('cpPriceMinSlider');
  const maxEl = document.getElementById('cpPriceMaxSlider');
  const range = document.getElementById('cpSliderRange');
  const vals  = document.getElementById('cpPriceVals');
  if (!minEl || !maxEl) return;
  let lo = parseFloat(minEl.value), hi = parseFloat(maxEl.value);
  if (lo > hi) { [lo, hi] = [hi, lo]; }
  cpPriceMin = lo; cpPriceMax = hi;
  const max = parseFloat(maxEl.max);
  if (range) { range.style.left = (lo/max*100)+'%'; range.style.right = ((1-hi/max)*100)+'%'; }
  if (vals) vals.textContent = lo + ' € — ' + hi + ' €';
  cpRenderGrid();
}

function cpBrandChange(cb) {
  if (cb.checked) cpBrands.add(cb.value);
  else cpBrands.delete(cb.value);
  cpRenderGrid();
}

function cpRatingChange(rb) {
  cpRating = parseFloat(rb.value);
  cpRenderGrid();
}

function cpApplyFilters() {
  if (!document.getElementById('catPage')?.classList.contains('open')) return;
  cpStockOnly = document.getElementById('cpStockToggle')?.checked || false;
  cpSaleOnly = document.getElementById('cpSaleToggle')?.checked || false;
  cpNewOnly  = document.getElementById('cpNewToggle')?.checked || false;
  cpRenderGrid();
}

function cpApplySort(val) {
  cpSort = val;
  cpRenderGrid();
}

function cpSpecChange(cb) {
  const key = cb.dataset.specKey;
  const val = cb.value;
  if (!cpSpecFilters[key]) cpSpecFilters[key] = new Set();
  if (cb.checked) cpSpecFilters[key].add(val);
  else {
    cpSpecFilters[key].delete(val);
    if (!cpSpecFilters[key].size) delete cpSpecFilters[key];
  }
  cpRenderGrid();
}

function cpToggleBrands(header) {
  const body = document.getElementById('cpBrandBody');
  const arrow = document.getElementById('cpBrandArrow');
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
}

function cpFilterBrandList(q) {
  const items = document.querySelectorAll('#cpBrandList .brand-filter-item');
  const s = q.toLowerCase().trim();
  items.forEach(item => {
    const name = item.querySelector('span')?.textContent.toLowerCase() || '';
    item.style.display = (!s || name.includes(s)) ? '' : 'none';
  });
}

function cpResetFilters() {
  cpPriceMin = 0;
  cpSpecFilters = {};
  document.querySelectorAll('#cpSidebar input[data-spec-key]').forEach(cb => cb.checked = false);
  const maxEl = document.getElementById('cpPriceMaxSlider');
  cpPriceMax = maxEl ? parseFloat(maxEl.max) : _cpMaxEur;
  cpBrands = new Set();
  cpRating = 0; cpSaleOnly = false; cpNewOnly = false;
  if (document.getElementById('cpPriceMinSlider')) document.getElementById('cpPriceMinSlider').value = 0;
  if (maxEl) maxEl.value = cpPriceMax;
  document.querySelectorAll('#cpBrandList input[type=checkbox]').forEach(c => c.checked = false);
  const r0 = document.querySelector('input[name="cpRating"][value="0"]');
  if (r0) r0.checked = true;
  const sk = document.getElementById('cpStockToggle'); if (sk) sk.checked = false;
  const st = document.getElementById('cpSaleToggle'); if (st) st.checked = false;
  const nt = document.getElementById('cpNewToggle'); if (nt) nt.checked = false;
  cpSubcat = 'all';
  cpUpdateSlider();
  cpRenderGrid();
  cpRenderSubcatBar(cpCat);
}

// ═══════════════════════════════════════
// SUBCAT BAR IN CAT PAGE
// ═══════════════════════════════════════
function cpRenderSubcatBar(cat) {
  const bar = document.getElementById('cpSubcatBar');
  if (!bar) return;
  const subs = typeof SUBCATS !== 'undefined' ? SUBCATS[cat] : null;
  if (!subs || !subs.length) { bar.innerHTML = ''; bar.style.display = 'none'; return; }
  bar.style.display = '';
  bar.innerHTML =
    `<button type="button" class="subcat-pill active" onclick="cpApplySubcat('all',this)">Всички</button>` +
    subs.map(s =>
      `<button type="button" class="subcat-pill" onclick="cpApplySubcat('${s.id}',this)">${s.label}</button>`
    ).join('');
}

function cpApplySubcat(id, btn) {
  cpSubcat = id;
  document.querySelectorAll('#cpSubcatBar .subcat-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  cpRenderGrid();
}

// ═══════════════════════════════════════
// RENDER CAT PAGE GRID
// ═══════════════════════════════════════
function cpGetFiltered() {
  let list = products.slice();
  // category filter
  if (cpCat === 'new') list = list.filter(p => p.badge === 'new');
  else if (cpCat === 'sale') list = list.filter(p => p.badge === 'sale');
  else if (cpCat !== 'all') list = list.filter(p => normalizeCat(p.cat) === cpCat);
  // subcat filter
  if (cpSubcat && cpSubcat !== 'all' && typeof matchesSubcat === 'function')
    list = list.filter(p => matchesSubcat(p, cpSubcat));
  // price
  list = list.filter(p => { const e = toEur(p.price); return e >= cpPriceMin && e <= cpPriceMax; });
  // brands
  if (cpBrands.size > 0) list = list.filter(p => cpBrands.has(p.brand));
  // rating
  if (cpRating > 0) list = list.filter(p => p.rating >= cpRating);
  // toggles
  if (cpStockOnly) list = list.filter(p => p.stock !== false);
  if (cpSaleOnly) list = list.filter(p => p.badge === 'sale' || p.old);
  if (cpNewOnly)  list = list.filter(p => p.badge === 'new');
  // Spec filters
  const _типToSubcat = {'процесор':'cpu','видеокарта':'gpu','дънна платка':'motherboard','ram':'ram','ssd nvme':'ssd','hdd':'hdd','захранване':'psu','кутия':'case','охлаждане':'cooling'};
  Object.entries(cpSpecFilters).forEach(([key, vals]) => {
    if (!vals || !vals.size) return;
    // 'Тип' filter for components maps label → subcat
    if (key === 'Тип') {
      const subcats = [...vals].map(v => _типToSubcat[v.toLowerCase()]).filter(Boolean);
      if (subcats.length) { list = list.filter(p => subcats.includes(p.subcat)); return; }
    }
    list = list.filter(p => {
      const sv = p.specs[key] || p.specs[Object.keys(p.specs).find(k => k.toLowerCase() === key.toLowerCase()) || ''] || '';
      if (sv) return [...vals].some(v => sv.toString().toLowerCase().includes(v.toLowerCase()));
      // Fallback: search through all spec values + name + desc (handles Cyrillic keys)
      const allText = (p.name + ' ' + (p.desc||'') + ' ' + Object.values(p.specs||{}).join(' ')).toLowerCase();
      return [...vals].some(v => allText.includes(v.toLowerCase()));
    });
  });
  // sort
  if (cpSort === 'price-asc') list.sort((a,b) => a.price - b.price);
  else if (cpSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  else if (cpSort === 'rating') list.sort((a,b) => b.rating - a.rating);
  else if (cpSort === 'discount') list.sort((a,b) => (b.old ? (b.old-b.price)/b.old : 0) - (a.old ? (a.old-a.price)/a.old : 0));
  else list.sort((a,b) => (b.rv||0) - (a.rv||0)); // bestseller default
  return list;
}

function cpRenderGrid() {
  const grid = document.getElementById('cpGrid');
  const count = document.getElementById('cpResultsCount');
  if (!grid) return;
  const list = cpGetFiltered();
  if (count) count.textContent = list.length + ' продукта';
  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);">
      <div style="font-size:48px;margin-bottom:12px;">🔍</div>
      <div style="font-size:16px;font-weight:700;">Няма продукти по тези критерии</div>
      <button type="button" onclick="cpResetFilters()" style="margin-top:14px;background:var(--primary);color:#fff;border:none;padding:10px 22px;border-radius:9px;font-weight:700;font-size:13px;cursor:pointer;font-family:'Outfit',sans-serif;">Изчисти филтрите</button>
    </div>`;
    return;
  }
  grid.innerHTML = list.map(p => makeCard(p)).join('');
}

// ═══════════════════════════════════════
// MOBILE SIDEBAR DRAWER
// ═══════════════════════════════════════
function cpOpenSidebar() {
  document.getElementById('cpSidebar')?.classList.add('open');
  document.getElementById('cpSidebarOverlay')?.classList.add('open');
}
function cpCloseSidebar() {
  document.getElementById('cpSidebar')?.classList.remove('open');
  document.getElementById('cpSidebarOverlay')?.classList.remove('open');
}

// ═══════════════════════════════════════
// DYNAMIC META TAGS
// Updates <title> and <meta description> when a category / page opens.
// Call setPageMeta(title, description) — pass null to restore defaults.
// ═══════════════════════════════════════
const _defaultTitle = document.title;
const _defaultDesc  = (document.querySelector('meta[name="description"]') || {}).content || '';

function setPageMeta(title, description) {
  document.title = title || _defaultTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description || _defaultDesc);
  // OG tags
  const og = document.querySelector('meta[property="og:title"]');
  if (og) og.setAttribute('content', title || _defaultTitle);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description || _defaultDesc);
}

function restorePageMeta() { setPageMeta(_defaultTitle, _defaultDesc); }

// ═══════════════════════════════════════
// INIT HP CATS on DOMContentLoaded
// ═══════════════════════════════════════


// ===== BLOG / SERVICE / DELIVERY PAGES =====
const blogPosts = [
  { emoji:'💻', cat:'Ревю', title:'MacBook Pro M4 Pro — Worth It?', date:'07 Март 2026', read:'5 мин', summary:'Тествахме новия MacBook Pro M4 Pro в реални условия — видео монтаж, код и gaming. Ето резултатите.' },
  { emoji:'📱', cat:'Сравнение', title:'iPhone 16 Pro Max vs Samsung S25 Ultra', date:'03 Март 2026', read:'7 мин', summary:'Двата флагмана се срещат в директен дуел. Камера, дисплей, батерия — кой печели?' },
  { emoji:'🎧', cat:'Топ 5', title:'Най-добри безжични слушалки за 2026', date:'28 Фев 2026', read:'4 мин', summary:'Sony, Bose, Apple — кои слушалки дават най-добро качество за парите си?' },
  { emoji:'🖥', cat:'Съвети', title:'Как да изберем монитор за работа от вкъщи', date:'22 Фев 2026', read:'6 мин', summary:'4K или 1440p? IPS или OLED? Пълен наръчник за правилния избор.' },
  { emoji:'🔋', cat:'Съвети', title:'10 начина да удължим живота на батерията', date:'15 Фев 2026', read:'3 мин', summary:'Простите навици, които могат да удвоят живота на батерията на твоя телефон или лаптоп.' },
  { emoji:'🏠', cat:'Smart Home', title:'Как да изградим умен дом за под 500 лв.', date:'10 Фев 2026', read:'8 мин', summary:'Philips Hue, смарт контакти, гласов асистент — пълна система без да се разоряваме.' },
];

const reviewPosts = [
  { emoji:'⭐', title:'Sony WH-1000XM6 — 9.4/10', sub:'Най-добрите ANC слушалки на пазара' },
  { emoji:'⭐', title:'ASUS ROG Zephyrus G16 — 9.1/10', sub:'Мощ и стил в тънко тяло' },
  { emoji:'⭐', title:'Samsung S95C OLED — 9.6/10', sub:'Безкомпромисен телевизор' },
  { emoji:'⭐', title:'iPad Pro M4 — 8.8/10', sub:'Лаптоп в тялото на таблет' },
];

function openBlogPage() {
  const grid = document.getElementById('blogGrid');
  if (grid) grid.innerHTML = blogPosts.map(p => `
    <div style="background:var(--white);border-radius:14px;border:1px solid var(--border);overflow:hidden;cursor:pointer;transition:all .22s;box-shadow:var(--shadow-card);"
         onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-hover)'"
         onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow-card)'"
         onclick="showToast('📰 Статията се зарежда...')">
      <div style="background:linear-gradient(135deg,var(--primary-light),var(--bg2));height:120px;display:flex;align-items:center;justify-content:center;font-size:52px;">${p.emoji}</div>
      <div style="padding:16px 18px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="background:var(--primary-light);color:var(--primary);font-size:10px;font-weight:800;padding:2px 8px;border-radius:10px;letter-spacing:.05em;">${p.cat}</span>
          <span class="text-11-muted">${p.date}</span>
          <span style="font-size:11px;color:var(--muted);margin-left:auto;">📖 ${p.read}</span>
        </div>
        <div style="font-size:15px;font-weight:800;margin-bottom:8px;line-height:1.3;">${p.title}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6;">${p.summary}</div>
        <div style="margin-top:12px;font-size:12px;color:var(--primary);font-weight:700;">Прочети повече →</div>
      </div>
    </div>`).join('');
  const rGrid = document.getElementById('reviewsGrid');
  if (rGrid) rGrid.innerHTML = reviewPosts.map(r => `
    <div class="megamenu-cat-card" onclick="showToast('📝 Ревюто се зарежда...')" style="flex-direction:row;text-align:left;gap:14px;">
      <div style="font-size:28px;">${r.emoji}</div>
      <div><div style="font-size:13px;font-weight:800;">${r.title}</div><div style="font-size:11px;color:var(--muted);margin-top:3px;">${r.sub}</div></div>
    </div>`).join('');
  document.getElementById('blogPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Блог — Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Блог');
  try { history.pushState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
}
function closeBlogPage() {
  document.getElementById('blogPage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function openServicePage() {
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Сервизен център — Most Computers', 'Сертифициран сервиз за лаптопи, компютри и електроника. Диагностика, ремонт и гаранционно обслужване в Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Сервизен център');
  try { history.pushState({ page: 'service' }, '', '?page=service'); } catch(e) {}
}
function closeServicePage() {
  document.getElementById('servicePage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function openDeliveryPage() {
  document.getElementById('deliveryPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Доставка и плащане — Most Computers', 'Безплатна доставка при поръчки над 100 €. Доставяме с куриер в рамките на 1-3 работни дни в цяла България.');
  if (typeof bcOnPage === 'function') bcOnPage('Доставка и плащане');
  try { history.pushState({ page: 'delivery' }, '', '?page=delivery'); } catch(e) {}
}
function closeDeliveryPage() {
  document.getElementById('deliveryPage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function filterCatScroll(type) {
  if (type === 'sale') {
    document.querySelectorAll('.filter-pill').forEach(p => {
      if (p.textContent.includes('Промо') || p.textContent.includes('sale')) p.click();
    });
  }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
}


// ===== CONTACTS PAGE =====
function openContactsPage() {
  document.getElementById('contactsPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  checkOpenNow();
  // Update URL
  try{history.pushState({page:'contacts'}, '', '?page=contacts');}catch(e){}
}

function closeContactsPage() {
  document.getElementById('contactsPage').classList.remove('open');
  document.body.style.overflow = '';
  try{history.pushState(null, '', window.location.pathname);}catch(e){}
}

function switchDirTab(type, btn) {
  document.querySelectorAll('.dir-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dir-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById('dir-' + type);
  if (el) el.classList.add('active');
}

function copyAddress() {
  const addr = 'бул. Шипченски проход бл.240, ж.к. Гео Милев, 1111 София';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(addr).then(() => showToast('📋 Адресът е копиран!')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = addr; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 Адресът е копиран!');
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = addr; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('📋 Адресът е копиран!');
  }
}

function copyPlusCode() {
  const code = 'M9H5+XJ Sofia';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => showToast('📍 Plus Code е копиран!')).catch(() => showToast('Plus Code: M9H5+XJ Sofia'));
  } else {
    showToast('Plus Code: M9H5+XJ Sofia');
  }
}

function checkOpenNow() {
  const badge = document.getElementById('openNowBadge');
  if (!badge) return;
  const now = new Date();
  const day  = now.getDay(); // 0=Sun, 1=Mon, 6=Sat
  const h    = now.getHours();
  const m    = now.getMinutes();
  const time = h * 60 + m;

  let isOpen = false;
  // Mon-Fri 09:30-18:30
  if (day >= 1 && day <= 5 && time >= 570 && time < 1110) isOpen = true;
  // Sat 10:00-14:00
  if (day === 6 && time >= 600 && time < 840) isOpen = true;

  // Highlight today in table
  const rows = document.querySelectorAll('#hoursTable tr');
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // table row index for each JS day
  rows.forEach(r => r.style.fontWeight = '');
  if (rows[dayMap[day]]) {
    rows[dayMap[day]].style.background = 'var(--primary-light)';
    rows[dayMap[day]].style.borderRadius = '6px';
  }

  badge.innerHTML = isOpen
    ? '<span style="display:inline-flex;align-items:center;gap:6px;background:#e8f9ed;color:#1a7f37;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#34c759;display:inline-block;"></span> Отворено сега</span>'
    : '<span style="display:inline-flex;align-items:center;gap:6px;background:#fef2f2;color:#dc2626;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span> Затворено</span>';
}



// ===== REVIEW FORM =====
let rfRating = 0;
function rfSetStar(v) {
  rfRating = v;
  const labels = ['', 'Лошо', 'Незадоволително', 'Добро', 'Много добро', 'Отлично'];
  document.querySelectorAll('.rf-star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.v) <= v);
    s.style.color = parseInt(s.dataset.v) <= v ? '#fbbf24' : '';
  });
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = labels[v] || '';
}
function submitPdpReview() {
  const name = document.getElementById('rfName')?.value.trim();
  const text = document.getElementById('rfText')?.value.trim();
  if (!name) { showToast('⚠️ Въведи своето име'); return; }
  if (!rfRating) { showToast('⚠️ Избери рейтинг'); return; }
  if (!text || text.length < 10) { showToast('⚠️ Ревюто трябва да е поне 10 символа'); return; }

  const now = new Date();
  const dateStr = now.toLocaleDateString('bg-BG', { day:'2-digit', month:'2-digit', year:'numeric' });
  const newRev = { name, stars: rfRating, text, date: dateStr, pending: true, productId: pdpProductId };

  // Persist to localStorage — pending until admin approves
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (!saved[pdpProductId]) saved[pdpProductId] = [];
    saved[pdpProductId].unshift(newRev);
    localStorage.setItem('mc_reviews', JSON.stringify(saved));
  } catch(e) {}

  // Reset form
  document.getElementById('rfName').value = '';
  document.getElementById('rfText').value = '';
  rfRating = 0;
  document.querySelectorAll('.rf-star').forEach(s => { s.classList.remove('active'); s.style.color = ''; });
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = 'Избери рейтинг';
  showToast('✅ Ревюто е изпратено и ще бъде публикувано след преглед!');
}


// ===== ABOUT PAGE =====
function openAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('За нас — Most Computers', 'Most Computers — над 27 години опит в продажбата на компютри и електроника. Специализиран магазин в центъра на София.');
  if (typeof bcOnPage === 'function') bcOnPage('За нас');
  try{history.pushState({ page: 'about' }, '', '?page=about');}catch(e){}
}
function closeAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  page.classList.remove('open');
  setTimeout(() => { page.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try{history.pushState(null, '', window.location.pathname);}catch(e){}
}

// renderHpSubcatsStrip and renderRecentlyDiscounted are called
// directly in main.js — no DOMContentLoaded wrapper needed here
// (deferred scripts run before DOMContentLoaded, so the handler
//  would cause a redundant second render on every page load).

// migrate any remaining inline onclick attributes into data-action
function migrateInlineClickHandlers() {
  document.querySelectorAll('[onclick]').forEach(el => {
    const code = el.getAttribute('onclick');
    if (!code) return;
    if (code.includes('this.')) return; // skip — requires DOM context
    // remove return false and trim
    let action = code.replace(/return\s+false;?/g, '').trim();
    // strip trailing parentheses for simple calls
    action = action.replace(/\(\)\s*;?$/, '');
    el.dataset.action = action;
    el.removeAttribute('onclick');
  });

  // Remove redundant onkeydown handlers that only simulate click for keyboard users
  document.querySelectorAll('[onkeydown]').forEach(el => {
    const code = el.getAttribute('onkeydown');
    if (!code) return;
    // if the handler just triggers click on Enter/Space (handled by our keyboard handler), drop it
    if (/this\.click\(\)/.test(code)) {
      el.removeAttribute('onkeydown');
    }
  });
}

// parse and execute a data-action string
function runActionString(str, event, button) {
  if (!str) return;
  str.split(';').forEach(cmd => {
    cmd = cmd.trim();
    if (!cmd) return;
    // Handle functionName('arg') / functionName(123) call syntax
    const callMatch = cmd.match(/^(\w+)\((.*)\)$/);
    if (callMatch) {
      const fn = window[callMatch[1]];
      if (typeof fn === 'function') {
        const argsStr = callMatch[2].trim();
        const args = argsStr
          ? argsStr.split(',').map(a => {
              const wasQuoted = /^['"`]/.test(a.trim());
              a = a.trim().replace(/^['"`]|['"`]$/g, '');
              if (!wasQuoted) {
                if (a === 'this' || a === 'self') return button;
                if (a === 'event') return event;
                if (!isNaN(a) && a !== '') return Number(a);
              }
              return a;
            })
          : [];
        fn.apply(null, args);
      }
      return;
    }
    // Colon syntax: functionName:arg1,arg2
    const [fnName, ...rawArgs] = cmd.split(':');
    const fn = window[fnName];
    if (typeof fn === 'function') {
      let args = [];
      if (rawArgs.length) {
        args = rawArgs.join(':').split(',').map(a => {
          a = a.trim();
          if (a === 'event') return event;
          if (a === 'this' || a === 'self') return button;
          if (a === '') return '';
          if (!isNaN(a)) return Number(a);
          return a;
        });
      }
      fn.apply(null, args);
    }
  });
}

let _dataActionsInited = false;
function initDataActions() {
  if (_dataActionsInited) return;
  _dataActionsInited = true;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    runActionString(button.dataset.action, event, button);
  });

  // Keyboard support for focusable action elements
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(clickEvent);
  });

  migrateInlineClickHandlers();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    migrateInlineClickHandlers,
    runActionString,
    initDataActions,
  };
}

// ===== ERROR BOUNDARY =====
function _isNetworkErr(val) {
  const s = val ? String(val.message || val) : '';
  return /fetch|network|NetworkError|Failed to fetch|Load failed|ERR_/i.test(s);
}
window.onerror = function(msg, src, line, col, err) {
  console.error('[MC Error]', msg, src, line, col, err);
  if (typeof showToast === 'function' && !_isNetworkErr(msg) && !_isNetworkErr(err)) {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
  return true;
};
window.addEventListener('unhandledrejection', function(e) {
  console.error('[MC Unhandled Promise]', e.reason);
  if (typeof showToast === 'function' && !_isNetworkErr(e.reason)) {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
});

// ===== INIT ALL =====
initCookies();
initBackToTop();
updateWishlistUI();

// renderGrids called in DOMContentLoaded
function openContactPage() { openContactsPage(); }

function closeContactPage() {
  document.getElementById('contactsPage').classList.remove('open');
  document.body.style.overflow = '';
}
function submitContactForm() {
  const name    = document.getElementById('cfName');
  const email   = document.getElementById('cfEmail');
  const subject = document.getElementById('cfSubject');
  const message = document.getElementById('cfMessage');
  const consent = document.getElementById('cfConsent');
  let valid = true;
  [name, email, subject, message].forEach(el => {
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });
  if (!email.value.includes('@')) { email.classList.add('error'); valid = false; }
  if (!consent.checked) { showToast('Трябва да се съгласиш с условията!'); valid = false; }
  if (!valid) { showToast('Моля попълни всички задължителни полета!'); return; }
  document.getElementById('cfFormWrap').style.display = 'none';
  document.getElementById('cfSuccess').classList.add('show');
  showToast('✅ Запитването е изпратено успешно!');
}


// ===== CATEGORY NORMALIZATION =====
// Source data in data.js already uses canonical cat values (migrated 2026-04-15).
// This map remains as a safety net for products loaded from localStorage or external feeds.
const _CAT_MIGRATE = {
  laptop:'laptops', desktop:'desktops', monitor:'monitors',
  mobile:'phones', tablet:'phones', tv:'accessories',
  audio:'peripherals', camera:'peripherals', print:'peripherals',
  smart:'accessories', acc:'accessories',
};
products.forEach(p => { if (_CAT_MIGRATE[p.cat]) p.cat = _CAT_MIGRATE[p.cat]; });

// Gaming laptops → laptops (not desktops) — safety for mislabeled imports
products.forEach(p => {
  if (p.cat === 'desktops') {
    const n = (p.name + ' ' + (p.desc || '')).toLowerCase();
    if (n.includes('laptop') || n.includes('notebook') || n.includes('лаптоп') || n.includes('macbook')) p.cat = 'laptops';
  }
});

// Speakers/soundbars → accessories (headphones stay in peripherals)
products.forEach(p => {
  if (p.cat === 'peripherals') {
    const n = (p.name + ' ' + (p.desc || '')).toLowerCase();
    if (n.includes('тонколон') || n.includes('speaker') || n.includes('soundbar')) p.cat = 'accessories';
  }
});

// ===== NORMALIZE BADGE / PCT FOR RESTORED PRODUCTS =====
// Products restored from localStorage (XML feed) have old:null, pct:0, badge:''.
// Restore old/pct/badge from the static snapshot (_staticProductsMap from data.js).
products.forEach(p => {
  const orig = _staticProductsMap[p.id];
  if (orig) {
    if (!p.old && orig.old)        p.old   = orig.old;
    if (!(p.pct > 0) && orig.pct > 0) p.pct = orig.pct;
    if (!p.badge && orig.badge)    p.badge = orig.badge;
  }
  // Fallback: compute pct/badge from old vs price if still missing
  if (p.old && p.old > p.price && !(p.pct > 0)) {
    p.pct = Math.round((1 - p.price / p.old) * 100);
  }
  if (!p.badge && p.pct > 0) {
    p.badge = 'sale';
  }
});

// All scripts are deferred — DOM is ready, call directly
initDataActions();
initSidebarFilters();
renderGrids();
loadCart();
// renderHpCats already called inside renderGrids()
renderRecentlyDiscounted();
renderRecentlyViewed();
initSectionAnimations();
initScrollAnimations();

// QW-06: Clickable brands bar
(function() {
  document.querySelectorAll('.brand-name').forEach(function(el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function() {
      var brand = el.textContent.trim();
      document.getElementById('searchInput') && (document.getElementById('searchInput').value = brand);
      showSearchResultsPage(brand);
    });
  });
})();

// 404 popular products grid
(function() {
  const g = document.getElementById('err404Grid');
  if (!g) return;
  const top4 = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  g.innerHTML = top4.map(p => `<div class="err-popular-card" onclick="close404();openProductModal(${p.id})"><div class="err-popular-emoji">${escHtml(p.emoji||'')}</div><div><div class="err-popular-name">${escHtml((p.name||'').substring(0,22))}…</div><div class="err-popular-price">${fmtEur(p.price)}</div></div></div>`).join('');
})();


// ===== ANALYTICS — Most Computers =====
// GA4 + Meta Pixel + dev console
// Load order: after main.js (last) so all functions are defined
// ======================================

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────────────
  const IS_DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const GA4_ID = 'G-XXXXXXXXXX'; // замени с реален Measurement ID от GA4
  const FB_PIXEL = ''; // опционален Meta Pixel ID

  // ── Core trackEvent ──────────────────────────────────────────────────────────
  function trackEvent(eventName, data) {
    const payload = Object.assign({ timestamp: Date.now() }, data || {});

    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, payload);
    }

    // Meta Pixel
    if (typeof fbq === 'function' && FB_PIXEL) {
      fbq('trackCustom', eventName, payload);
    }

    // Dev console
    if (IS_DEV) {
      console.log('%c[Analytics]%c ' + eventName, 'color:#bd1105;font-weight:700', 'color:inherit', payload);
    }

    // LocalStorage event log (capped at 200 entries — for debugging & simple analytics)
    try {
      const log = JSON.parse(localStorage.getItem('mc_analytics_log') || '[]');
      log.unshift({ event: eventName, data: payload });
      if (log.length > 200) log.length = 200;
      localStorage.setItem('mc_analytics_log', JSON.stringify(log));
    } catch (_) {}
  }

  // ── page_view ────────────────────────────────────────────────────────────────
  function trackPageView() {
    trackEvent('page_view', {
      page_title: document.title,
      page_location: location.href,
      referrer: document.referrer || '(direct)'
    });
  }

  // ── view_product ─────────────────────────────────────────────────────────────
  function hookOpenProductPage() {
    const _orig = window.openProductPage;
    if (typeof _orig !== 'function') return;
    window.openProductPage = function (id) {
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        trackEvent('view_product', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          brand: p.brand || '',
          currency: 'BGN'
        });
        // GA4 standard ecommerce
        if (typeof gtag === 'function') {
          gtag('event', 'view_item', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price }]
          });
        }
      }
      return result;
    };
  }

  // ── add_to_cart ───────────────────────────────────────────────────────────────
  function hookAddToCart() {
    const _orig = window.addToCart;
    if (typeof _orig !== 'function') return;
    window.addToCart = function (id) {
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        trackEvent('add_to_cart', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          brand: p.brand || '',
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'add_to_cart', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price, quantity: 1 }]
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'AddToCart', { content_ids: [p.id], content_name: p.name, value: p.price, currency: 'BGN' });
        }
      }
      return result;
    };
  }

  // ── remove_from_cart ─────────────────────────────────────────────────────────
  function hookRemoveFromCart() {
    const _orig = window.removeFromCart;
    if (typeof _orig !== 'function') return;
    window.removeFromCart = function (id) {
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      const result = _orig.apply(this, arguments);
      if (p) {
        trackEvent('remove_from_cart', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'remove_from_cart', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price }]
          });
        }
      }
      return result;
    };
  }

  // ── add_to_wishlist / remove_from_wishlist ────────────────────────────────────
  function hookToggleWishlist() {
    const _orig = window.toggleWishlist;
    if (typeof _orig !== 'function') return;
    window.toggleWishlist = function (id, e) {
      const wishlistBefore = (typeof wishlist !== 'undefined') ? wishlist.slice() : [];
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        const wasInWishlist = wishlistBefore.indexOf(id) !== -1;
        const eventName = wasInWishlist ? 'remove_from_wishlist' : 'add_to_wishlist';
        trackEvent(eventName, {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          currency: 'BGN'
        });
        if (!wasInWishlist && typeof fbq === 'function') {
          fbq('track', 'AddToWishlist', { content_ids: [p.id], content_name: p.name, value: p.price, currency: 'BGN' });
        }
      }
      return result;
    };
  }

  // ── begin_checkout ───────────────────────────────────────────────────────────
  function hookToggleCart() {
    const _orig = window.toggleCart;
    if (typeof _orig !== 'function') return;
    window.toggleCart = function () {
      const result = _orig.apply(this, arguments);
      const cartEl = document.getElementById('cartPanel');
      const isOpening = cartEl && cartEl.classList.contains('open');
      if (isOpening && typeof cart !== 'undefined' && cart.length > 0) {
        const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
        trackEvent('view_cart', {
          cart_total: Math.round(total * 100) / 100,
          item_count: cart.reduce((s, x) => s + x.qty, 0),
          currency: 'BGN'
        });
      }
      return result;
    };
  }

  function hookShowCheckoutStep() {
    const _orig = window.showCheckoutStep;
    if (typeof _orig !== 'function') return;
    window.showCheckoutStep = function (n) {
      const result = _orig.apply(this, arguments);
      if (n === 1 && typeof cart !== 'undefined') {
        const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
        const items = cart.map(x => ({ item_id: String(x.id), item_name: x.name, price: x.price, quantity: x.qty }));
        trackEvent('begin_checkout', {
          cart_total: Math.round(total * 100) / 100,
          item_count: cart.reduce((s, x) => s + x.qty, 0),
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'begin_checkout', { currency: 'BGN', value: total, items });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'InitiateCheckout', { value: total, currency: 'BGN', num_items: items.length });
        }
      }
      return result;
    };
  }

  // ── apply_promo ──────────────────────────────────────────────────────────────
  function hookApplyPromo() {
    const _orig = window.applyPromo;
    if (typeof _orig !== 'function') return;
    window.applyPromo = function (codeArg) {
      const codeBefore = typeof promoApplied !== 'undefined' ? promoApplied : false;
      const result = _orig.apply(this, arguments);
      const codeAfter = typeof promoApplied !== 'undefined' ? promoApplied : false;
      const code = (codeArg || '').trim().toUpperCase();
      if (!codeBefore && codeAfter) {
        const total = (typeof cart !== 'undefined') ? cart.reduce((s, x) => s + x.price * x.qty, 0) : 0;
        trackEvent('apply_promo', {
          promo_code: code,
          discount_pct: 10,
          discount_amount: Math.round(total * 0.10 * 100) / 100,
          currency: 'BGN'
        });
      } else if (!codeAfter && code) {
        trackEvent('promo_failed', { promo_code: code });
      }
      return result;
    };
  }

  // ── purchase ─────────────────────────────────────────────────────────────────
  function hookSubmitOrder() {
    const _orig = window.submitOrder;
    if (typeof _orig !== 'function') return;
    window.submitOrder = function () {
      // Snapshot cart before submit clears it
      const cartSnapshot = (typeof cart !== 'undefined') ? cart.map(x => ({
        item_id: String(x.id),
        item_name: x.name,
        item_category: x.cat,
        price: x.price,
        quantity: x.qty
      })) : [];
      const subtotal = cartSnapshot.reduce((s, x) => s + x.price * x.quantity, 0);
      const promo = (typeof promoApplied !== 'undefined' && promoApplied) ? subtotal * 0.10 : 0;
      const delivery = (typeof ckDeliveryCosts !== 'undefined' && typeof ckDeliveryIdx !== 'undefined')
        ? ckDeliveryCosts[ckDeliveryIdx] : 0;
      const total = Math.round((subtotal - promo + delivery) * 100) / 100;

      const result = _orig.apply(this, arguments);

      // Fire after a tick (submitOrder has a setTimeout internally)
      setTimeout(function () {
        const orderNumEl = document.getElementById('tyOrderNum');
        const orderNum = orderNumEl ? orderNumEl.textContent : 'unknown';
        trackEvent('purchase', {
          transaction_id: orderNum,
          value: total,
          subtotal: Math.round(subtotal * 100) / 100,
          discount: Math.round(promo * 100) / 100,
          shipping: delivery,
          currency: 'BGN',
          payment_method: (typeof ckPaymentType !== 'undefined') ? ckPaymentType : 'unknown',
          item_count: cartSnapshot.reduce((s, x) => s + x.quantity, 0)
        });
        if (typeof gtag === 'function') {
          gtag('event', 'purchase', {
            transaction_id: orderNum,
            currency: 'BGN',
            value: total,
            shipping: delivery,
            coupon: (typeof promoApplied !== 'undefined' && promoApplied) ? 'MOSTCOMP10' : '',
            items: cartSnapshot
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Purchase', { value: total, currency: 'BGN', num_items: cartSnapshot.length });
        }
      }, 600);

      return result;
    };
  }

  // ── search ───────────────────────────────────────────────────────────────────
  function hookSearch() {
    const _origFull = window.doFullSearch;
    if (typeof _origFull === 'function') {
      window.doFullSearch = function () {
        const q = (document.getElementById('searchInput') || {}).value || '';
        const result = _origFull.apply(this, arguments);
        if (q.trim()) {
          // Results count available after render — approximate with DOM query
          setTimeout(function () {
            const count = document.querySelectorAll('.srp-card').length;
            trackEvent('search', {
              search_term: q.trim(),
              results_count: count
            });
            if (typeof gtag === 'function') {
              gtag('event', 'search', { search_term: q.trim() });
            }
            // Track zero-result searches separately
            if (count === 0) {
              trackEvent('search_no_results', { search_term: q.trim() });
            }
          }, 200);
        }
        return result;
      };
    }
  }

  // ── view_category ─────────────────────────────────────────────────────────────
  function hookFilterCat() {
    const _orig = window.filterCat;
    if (typeof _orig !== 'function') return;
    window.filterCat = function (cat) {
      const result = _orig.apply(this, arguments);
      const label = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] : cat;
      trackEvent('view_category', {
        category: cat,
        category_label: label
      });
      return result;
    };
  }

  // ── Init: wire up all hooks ───────────────────────────────────────────────────
  function init() {
    hookOpenProductPage();
    hookAddToCart();
    hookRemoveFromCart();
    hookToggleWishlist();
    hookToggleCart();
    hookShowCheckoutStep();
    hookApplyPromo();
    hookSubmitOrder();
    hookSearch();
    hookFilterCat();
    trackPageView();

    if (IS_DEV) {
      console.log('%c[Analytics] Initialized — hooks active', 'color:#34c759;font-weight:700');
    }
  }

  // Run after DOM + app.js are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded already fired — defer one tick so app.js globals are set
    setTimeout(init, 0);
  }

  // ── Public API ───────────────────────────────────────────────────────────────
  window.mcTrack = trackEvent;
  window.mcAnalyticsLog = function () {
    try { return JSON.parse(localStorage.getItem('mc_analytics_log') || '[]'); } catch (_) { return []; }
  };
})();
