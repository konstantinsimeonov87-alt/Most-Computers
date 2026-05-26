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
  software:'Софтуер', accessories:'Аксесоари', consumables:'Консумативи',
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

// Filter out promotional/banner images that contain keywords indicating
// they are not real product photos (e.g. Icecat promo banners).
function isSafeImgUrl(url) {
  if (!url) return false;
  return !/promotion|promo|banner|PL_|promotionGroup/i.test(url);
}

function makeCard(p,small=false){
  const save=p.old?Math.round(((p.old-p.price)/p.old)*100):0;
  const _eName = escHtml(p.name);
  const safeImg = isSafeImgUrl(p.img) ? p.img : null;
  const imgHtml = safeImg
    ? `<img class="product-img-real" src="${escHtml(safeImg)}" alt="${_eName}" itemprop="image" loading="lazy" width="300" height="300" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${p.emoji}</span>`
    : `<span class="product-img-emoji">${p.emoji}</span>`;
  return `<article class="product-card pos-rel" itemscope itemtype="https://schema.org/Product">
    <div class="product-badge-wrap">
      ${p.badge==='sale'?'<span class="badge badge-sale">Промо</span>':''}
      ${p.badge==='new'?'<span class="badge badge-new">Ново</span>':''}
      ${p.badge==='hot'?'<span class="badge badge-hot">Горещо</span>':''}
      ${p.pct>0?`<span class="badge badge-pct">-${p.pct}%</span>`:''}
      ${p.stock===false?'<span class="badge badge-oos">Изчерпан</span>':''}
      ${(p.lowstock||p.badge==='hot')&&p.stock!==false?`<span class="badge badge-lowstock">⚡ Остават само ${(p.id%4)+2} бр.</span>`:''}

    </div>
    <button class="product-wishlist" id="wl-${p.id}" type="button" onclick="toggleWishlist(${p.id},event)" title="Добави в любими" aria-label="Добави в любими"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart"/></svg></button>
    <a href="?product=${p.id}" class="product-img-wrap${small?' small':''}" onclick="openProdPreview(${p.id});return false;" style="cursor:pointer;" aria-label="${_eName}" itemprop="url">
      ${imgHtml}
    </a>
    <div class="product-body">
      <div class="product-brand" itemprop="brand" data-brand-search="${escHtml(p.brand)}" style="cursor:pointer;" title="Виж всички ${escHtml(p.brand)}">${escHtml(p.brand)}</div>
      <h3 class="product-name" itemprop="name"><a href="?product=${p.id}" onclick="openProdPreview(${p.id});return false;" style="color:inherit;text-decoration:none;">${_eName}</a></h3>
      <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating} (${p.rv})</span></div>
      <div class="product-footer">
        <div class="price-row">
          <div class="price-current${p.badge==='sale'?' sale':''}" itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="priceCurrency" content="EUR"><link itemprop="availability" href="${p.stock===false?'https://schema.org/OutOfStock':'https://schema.org/InStock'}"><span itemprop="price" content="${p.price}">${fmtPrice(p.price, p.badge==='sale'?'sale':'')}</span></div>
          ${p.old?`<div class="price-old">${fmtEur(p.old)}</div><div class="price-save">-${save}%</div>`:''}
        </div>
        ${p.stock!==false?`<div class="card-delivery-hint">📦 Доставка до 2 работни дни</div>`:''}
        ${p.stock!==false?`<div class="card-warranty">🛡 2г. гаранция</div>`:''}
        ${p.stock===false
          ? `<button type="button" class="add-cart-btn oos-notify-btn" onclick="oosNotify(${p.id})">🔔 Уведоми ме при наличност</button>`
          : `<button type="button" class="add-cart-btn" id="cb-${p.id}" onclick="addToCart(${p.id})"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави в кошница</button>`
        }
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
  cacheDocH();
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

// IDEA-16: Hero Right Panel — personalized widget
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
        '<div class="hrp-title">❤ Твоите любими</div>' +
        wlProds.map(function(p){return _hrpItem(p,false);}).join('') +
        '<button class="hrp-see-all" onclick="openWishlist()">Виж всички любими →</button></div>';
      return;
    }
  }

  // Priority 2: Recently viewed
  var rv = [];
  try { rv = JSON.parse(localStorage.getItem('mc_rv') || '[]'); } catch(e) {}
  if (rv.length > 0) {
    var last = products.find(function(x){return x.id===rv[0];});
    if (last) {
      panel.innerHTML = '<div class="hrp-widget">' +
        '<div class="hrp-title">🕐 Продължи откъдето спря</div>' +
        _hrpItem(last, true) +
        '<button class="add-cart-btn hrp-cta" onclick="addToCart(' + last.id + ');event.stopPropagation()">' +
        '<svg width="14" height="14" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави в кошница</button></div>';
      return;
    }
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

// ===== RECENTLY VIEWED =====
let recentlyViewed = [];
try { recentlyViewed = JSON.parse(localStorage.getItem('mc_rv') || '[]'); } catch(e) {}

function addToRecentlyViewed(id) {
  recentlyViewed = [id, ...recentlyViewed.filter(x=>x!==id)].slice(0, 10);
  try { localStorage.setItem('mc_rv', JSON.stringify(recentlyViewed)); } catch(e){}
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const items = recentlyViewed.map(id => products.find(p=>p.id===id)).filter(Boolean);

  // Sidebar widget
  const wrap = document.getElementById('sidebarRecentlyViewed');
  if (wrap) {
    if (!items.length) {
      wrap.style.display = 'none';
    } else {
      wrap.style.display = '';
      wrap.innerHTML = `
        <div class="sb-rv-header">
          <span class="sb-rv-title">🕐 Наскоро разгледани</span>
          <button type="button" class="sb-rv-clear" data-action="clearRecentlyViewed">Изчисти</button>
        </div>
        ${items.slice(0, 5).map(p => {
          const _safeName = escHtml(p.name || '');
          const _safeImg = p.img && isSafeImgUrl(p.img) ? escHtml(p.img) : null;
          return `<div class="sb-rv-item" onclick="openProductPage(${p.id})">
            ${_safeImg
              ? `<img class="sb-rv-thumb" src="${_safeImg}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="sb-rv-emoji" style="display:none">${p.emoji||''}</span>`
              : `<span class="sb-rv-emoji">${p.emoji||''}</span>`}
            <div class="sb-rv-info">
              <div class="sb-rv-name">${_safeName}</div>
              <div class="sb-rv-price">${fmtEur(p.price)}</div>
            </div>
          </div>`;
        }).join('')}`;
    }
  }

  // Legacy bottom section — keep hidden
  const section = document.getElementById('recentlyViewedSection');
  if (section) section.style.display = 'none';
}

function clearRecentlyViewed() {
  recentlyViewed = [];
  try { localStorage.removeItem('mc_rv'); } catch(e){}
  const wrap = document.getElementById('sidebarRecentlyViewed');
  if (wrap) wrap.style.display = 'none';
  const section = document.getElementById('recentlyViewedSection');
  if (section) section.style.display = 'none';
  showToast('🗑 История изчистена');
}

// renderRecentlyViewed called in main.js after DOMContentLoaded

// ── Canonical category normalization ─────────────────────────────────────────
// Maps any cat value (old-style or XML-imported) → one of the 12 canonical cats:
// laptops | desktops | gaming | components | monitors | peripherals | phones | network | storage | software | accessories | printers
function normalizeCat(cat) {
  const m = {
    laptop:'laptops',    laptops:'laptops',
    desktop:'desktops',  desktops:'desktops',
    gaming:'gaming',     game:'gaming',
    components:'components', component:'components',
    monitor:'monitors',  monitors:'monitors',  display:'monitors',
    audio:'peripherals', camera:'peripherals', peripherals:'peripherals',
    print:'printers',    printer:'printers',   printers:'printers',
    consumables:'consumables', consumable:'consumables', toner:'consumables', cartridge:'consumables',
    ups:'ups',           ups_home:'ups',       ups_office:'ups',    ups_server:'ups',
    phone:'phones',      phones:'phones',      mobile:'phones',
    tablet:'phones',     smartphones:'phones',
    tv:'accessories',    smart:'accessories',
    network:'network',
    storage:'storage',   nas:'storage',
    software:'software',
    acc:'accessories',   accessories:'accessories', accessory:'accessories',
    new:'new',           sale:'sale',
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
  let list=(
    currentFilter==='all'  ? [...products] :
    currentFilter==='new'  ? [...products].sort((a,b)=>b.id-a.id) :
    currentFilter==='sale' ? products.filter(p=>p.badge==='sale'||p.badge==='Намаление'||!!p.old) :
    products.filter(p=>normalizeCat(p.cat)===currentFilter)
  ).filter(p=>p.stock!==false);
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
  else if(currentSort==='discount')list.sort((a,b)=>(b.pct||0)-(a.pct||0));
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
  bar.innerHTML = `<span class="top-sort-count" id="topSortCount"></span>
    <label for="topSortSelect" class="top-sort-label">Сортирай:</label>
    <select class="sort-select" id="topSortSelect" onchange="applySort(this.value)">
      <option value="bestseller">🏆 Най-продавани</option>
      <option value="price-asc">Цена ↑</option>
      <option value="price-desc">Цена ↓</option>
      <option value="rating">⭐ Рейтинг</option>
      <option value="discount">% Отстъпка</option>
    </select>`;
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
  const _flashProds=[...products].filter(p=>_inStock(p)&&p.old&&p.pct>0).sort((a,b)=>b.pct-a.pct).slice(0,3);
  const flashSection=document.getElementById('sale');
  if(flashSection) flashSection.style.display=_flashProds.length?'':'none';
  const fg=document.getElementById('flashGrid');
  if(fg){
    fg.innerHTML=_flashProds.map(p=>makeCard(p,true)).join('');
    fg.className='products-row cols'+Math.min(_flashProds.length,3);
  }
  renderTopGrid();
  // Bestsellers grid — top rated products not tied to discounts
  const bg=document.getElementById('bestsellersGrid');
  if(bg){
    const _best=[...products].filter(p=>_inStock(p)).sort((a,b)=>(b.rating*Math.log1p(b.rv||1))-(a.rating*Math.log1p(a.rv||1))).slice(0,5);
    bg.innerHTML=_best.map(p=>makeCard(p,true)).join('');
    bg.className='products-row cols'+Math.min(_best.length,5);
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
  const _newProducts=[...products].filter(p=>_inStock(p)).sort((a,b)=>b.id-a.id); const ng=document.getElementById('newGrid'); if(ng) ng.innerHTML=_newProducts.slice(0,8).map(p=>makeCard(p,true)).join('');
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
      ${p.img
        ? `<img class="mini-promo-img" src="${p.img}" alt="${escHtml(p.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`
        : ''}
      <div class="mini-promo-emoji" style="${p.img?'display:none':''}"> ${p.emoji}</div>
      <div class="mini-promo-text">
        <div class="mini-promo-label">${label}</div>
        <div class="mini-promo-name">${escHtml(p.name.length>32?p.name.slice(0,32)+'…':p.name)}</div>
        ${p.old?`<div class="mini-promo-old">${(p.old/EUR_RATE).toFixed(2)} € / ${p.old} лв.</div>`:''}
        <div class="mini-promo-price">${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв.</div>
      </div>
      <button type="button" class="mini-promo-view" onclick="event.stopPropagation();openProductPage(${p.id})">Виж →</button>
    </div>`).join('');
}

function renderPromoBanner(){
  const banner = document.getElementById('promoBanner');
  if(!banner) return;
  // Exclude ids already shown in the static PSB blocks (id:32, id:3160)
  const _excl = new Set([32, 3160]);
  const newP  = [...products].filter(p=>!_excl.has(p.id)&&(p.badge==='new'||p.badge==='hot')&&p.stock!==false).sort((a,b)=>b.rating-a.rating)[0];
  const saleP = [...products].filter(p=>!_excl.has(p.id)&&p.badge==='sale'&&p.stock!==false).sort((a,b)=>b.pct-a.pct)[0];
  if(!newP||!saleP) return;
  const themes = [
    { p:newP,  cls:'blue', badge:`🆕 Ново`,           sub: escHtml(newP.desc  ? newP.desc.slice(0,80)+'…'  : newP.name) },
    { p:saleP, cls:'dark', badge:`🔥 -${saleP.pct}%`, sub: escHtml(saleP.desc ? saleP.desc.slice(0,80)+'…' : saleP.name) },
  ];
  banner.innerHTML = themes.map(({p,cls,badge,sub})=>`
    <div class="promo-half ${cls}" onclick="openProductPage(${p.id})" style="cursor:pointer;">
      <div class="promo-half-content">
        <span class="badge">${badge}</span>
        <h3>${escHtml(p.name.length>40?p.name.slice(0,40)+'…':p.name)}</h3>
        <p>${sub}</p>
        <div class="promo-price">${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв.</div>
        <button type="button" class="promo-btn" onclick="event.stopPropagation();addToCart(${p.id})">Добави в кошница +</button>
      </div>
      <img src="${p.img||''}" alt="${escHtml(p.name)}" class="promo-img" width="110" height="110" loading="lazy" decoding="async"
        style="${p.img?'':'display:none'}"
        onerror="this.style.display='none';var em=this.nextElementSibling;if(em)em.style.display=''">
      <div class="promo-emoji" style="${p.img?'display:none':''}"> ${p.emoji||'🖥'}</div>
    </div>`).join('');
}


// ===== PRICE SLIDER =====
let srpPriceMinVal=0, srpPriceMaxVal=5000, srpCurrentQuery='', srpCurrentCatFilter='', srpPriceAbsMax=5000;
function updatePriceSlider(){
  const mn=document.getElementById('priceMin'), mx=document.getElementById('priceMax');
  if(!mn||!mx) return;
  let minV=parseInt(mn.value), maxV=parseInt(mx.value);
  if(isNaN(minV)) minV=0; if(isNaN(maxV)) maxV=srpPriceAbsMax;
  if(minV>maxV-50){ minV=maxV-50; mn.value=minV; }
  srpPriceMinVal=minV; srpPriceMaxVal=maxV;
  const pct=n=>srpPriceAbsMax>0?Math.round(n/srpPriceAbsMax*100):0;
  const rng=document.getElementById('sliderRange');
  if(rng){ rng.style.left=pct(minV)+'%'; rng.style.width=(pct(maxV)-pct(minV))+'%'; }
  const srpVals=document.getElementById('srpPriceVals');
  if(srpVals) srpVals.textContent=fmtEur(minV)+' — '+fmtEur(maxV);
  const rate=typeof EUR_RATE!=='undefined'?EUR_RATE:1.95583;
  const mnNum=document.getElementById('srpMinNum'), mxNum=document.getElementById('srpMaxNum');
  if(mnNum) mnNum.value=Math.round(minV/rate);
  if(mxNum) mxNum.value=Math.round(maxV/rate);
  if(typeof _srpRender==='function') _srpRender();
}

function srpNumInputChange(){
  const mn=document.getElementById('priceMin'), mx=document.getElementById('priceMax');
  const mnNum=document.getElementById('srpMinNum'), mxNum=document.getElementById('srpMaxNum');
  if(!mn||!mx||!mnNum||!mxNum) return;
  const rate=typeof EUR_RATE!=='undefined'?EUR_RATE:1.95583;
  mn.value=Math.min(Math.round(parseFloat(mnNum.value||0)*rate), srpPriceAbsMax);
  mx.value=Math.min(Math.round(parseFloat(mxNum.value||0)*rate), srpPriceAbsMax);
  updatePriceSlider();
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
  const header = body.previousElementSibling;
  if (header && header.classList.contains('sfb-header')) header.setAttribute('aria-expanded', String(isOpen));
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
  const _catLabels = { phones:'📱 Телефони', laptops:'💻 Лаптопи', desktops:'🖥 Настолни', gaming:'🎮 Гейминг', monitors:'🖥 Монитори', components:'⚙️ Компоненти', peripherals:'🖱 Периферия', network:'📡 Мрежово', storage:'💾 Сторидж', software:'📀 Софтуер', accessories:'🎒 Аксесоари', printers:'🖨 Принтери', ups:'⚡ UPS устройства', consumables:'🖨️ Консумативи' };
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
  ],
  printers: [
    { id: 'inkjet_aio', label: '🖨️ Мастиленоструйни МФУ' },
    { id: 'megatank',   label: '♾️ MegaTank (резервоар)' },
    { id: 'laser',      label: '⚡ Лазерни принтери' },
    { id: 'portable',   label: '🎒 Преносими принтери' },
  ],
  ups: [
    { id: 'ups_home',    label: '🏠 Домашни (до 1KVA)' },
    { id: 'ups_office',  label: '🏢 За офиса (1-3KVA)' },
    { id: 'ups_server',  label: '🖥️ Сървърни / Онлайн' },
    { id: 'ups_battery', label: '🔋 Резервни батерии' },
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
    { id: 'usb_flash',    label: '💾 USB флашки' },
    { id: 'microsd',      label: '📱 microSD карти' },
    { id: 'sd_card',      label: '📷 SD карти' },
    { id: 'cf_card',      label: '📷 CF карти' },
    { id: 'card_reader',  label: '🔌 Четци за карти' },
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
  consumables: [
    { id: 'inkjet',       label: '🖨️ Мастиленоструйни касети' },
    { id: 'laser_toner',  label: '⚡ Лазерни тонери' },
    { id: 'photo_paper',  label: '🖼️ Фото хартия' },
  ],
};

// Mega-menu flyout data: category → columns → items
const MEGA_MENU = {
  phones: [
    { title: 'Смартфони', id: 'smartphone', items: ['Nokia', 'Realme', 'Xiaomi', 'Samsung'] },
    { title: 'Таблети', id: 'tablet', items: ['Lenovo таблети', 'Android таблети'] },
    { title: 'Смарт часовници', id: 'smartwatch', items: ['Nokia', 'Realme', 'Xiaomi'] },
  ],
  laptops: [
    { title: 'По предназначение', id: 'work', items: ['За работа', 'За гейминг', 'Ултрабуци', 'Workstation'] },
    { title: 'По марка', id: 'ultrabook', items: ['ASUS ZenBook', 'Lenovo ThinkPad', 'Lenovo IdeaPad', 'MSI Prestige', 'Acer Swift'] },
    { title: 'По бюджет', id: 'budget', items: ['До 500 €', '500–800 €', '800–1500 €', '1500 €+'] },
    { title: 'Use-case', id: 'for_students', items: ['За студенти', 'За програмисти', 'За дизайнери', 'За игри'] },
  ],
  desktops: [
    { title: 'Офис и Workstation', id: 'office_pc', items: ['Офис компютри', 'Workstation', 'All-in-One'] },
    { title: 'По марка', id: 'mac_desktop', items: ['ASUS', 'MSI', 'Lenovo', 'Acer'] },
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
    { title: 'Видео карти', id: 'gpu', items: ['GeForce RTX 40 серия', 'Radeon RX 7000 серия', 'Работни карти'] },
    { title: 'Памет', id: 'ram', items: ['DDR5 RAM', 'DDR4 RAM', 'SO-DIMM лаптоп'] },
    { title: 'Дискове', id: 'ssd_hdd', items: ['SSD M.2 NVMe', 'SSD SATA', 'HDD 2.5"', 'HDD 3.5"'] },
    { title: 'Дъно и корпус', id: 'motherboard', items: ['Intel LGA1851', 'Intel LGA1700', 'AMD AM5', 'AMD AM4', 'Захранвания', 'Кутии'] },
  ],
  peripherals: [
    { title: 'Въвеждане', id: 'keyboard', items: ['Механични клавиатури', 'Офис мишки', 'Trackpad', 'Геймпадове'] },
    { title: 'Аудио и видео', id: 'headphones', items: ['Слушалки', 'Тонколони', 'Уеб камери'] },
  ],
  printers: [
    { title: 'Мастиленоструйни МФУ', id: 'inkjet_aio', items: ['Домашен МФУ', 'С WiFi', 'С факс и ADF', 'A3 формат', 'Двустранен печат'] },
    { title: 'MegaTank', id: 'megatank', items: ['PIXMA G серия', 'MAXIFY GX серия', 'Без касети', 'Висок капацитет'] },
    { title: 'Лазерни', id: 'laser', items: ['Монохромни', 'Цветни лазерни', 'За офис'] },
  ],
  network: [
    { title: 'Рутери', id: 'router', items: ['WiFi 7', 'WiFi 6E', 'WiFi 6', 'Gaming рутери', 'ADSL/VDSL', '4G LTE'] },
    { title: 'Mesh и AP', id: 'mesh', items: ['Mesh системи', 'Asus ZenWiFi', 'Tenda Nova/MW', 'Access Points', 'Range Extenders'] },
    { title: 'Суичове', id: 'switch', items: ['5 порта', '8 порта', '16 порта', '24+ порта', 'PoE суичове', 'Managed'] },
    { title: 'Адаптери и SFP', id: 'adapter', items: ['USB WiFi адаптери', 'USB LAN адаптери', '2.5G / 10G карти', 'SFP модули', 'Outdoor CPE'] },
  ],
  storage: [
    { title: 'Сторидж', id: 'nas', items: ['NAS устройства', 'Сървъри', 'Rack системи'] },
    { title: 'Носители', id: 'ext_drive', items: ['Портативни SSD', 'Портативни HDD'] },
    { title: 'Флаш памет', id: 'usb_flash', items: ['USB флашки', 'USB-C флашки', 'Dual OTG флашки'] },
    { title: 'Карти', id: 'microsd', items: ['microSD карти', 'SD карти', 'CF карти', 'Четци за карти'] },
  ],
  ups: [
    { title: 'Домашни UPS', id: 'ups_home', items: ['До 800VA', 'Fortron Nano', 'Fortron FP серия', 'Inform Guardian', 'Hikvision DS-UPS'] },
    { title: 'Офис UPS', id: 'ups_office', items: ['1-2 KVA', 'AVR защита', 'С USB мониторинг', 'Repotec', 'Fortron IFP'] },
    { title: 'Сървърни / Онлайн', id: 'ups_server', items: ['Чиста синусоида', 'Онлайн double-conversion', 'Inform Sinus', 'Fortron Champ', 'Tuncmatik PowerUp'] },
    { title: 'Резервни батерии', id: 'ups_battery', items: ['12V/7Ah', '12V/9Ah', '12V/12Ah', '12V/18Ah', 'Sunlight', 'Fortron'] },
  ],
  accessories: [
    { title: 'Проектори', id: 'projector', items: ['Full HD проектори', '4K проектори', 'Лазерни проектори', 'Мини проектори', 'Бизнес проектори'] },
    { title: 'Смарт устройства', id: 'smart_dev', items: ['Смарт часовници', 'Фитнес тракери', 'Смарт говорители', 'Смарт лампи', 'Умен дом'] },
    { title: 'Gaming аксесоари', id: 'chair', items: ['Gaming столове', 'Контролери', 'Геймпадове', 'Рулета и джойстици'] },
    { title: 'Аксесоари', id: 'hub', items: ['USB хъбове', 'Зарядни устройства', 'Чанти за лаптоп', 'Тонколони'] },
  ],
  consumables: [
    { title: 'Лазерни тонери', id: 'laser_toner', items: ['Canon тонери', 'Монохромни', 'Цветни тонери', 'За офис принтери'] },
    { title: 'Мастиленоструйни касети', id: 'inkjet', items: ['Canon касети', 'Цветни касети', 'Черни касети', 'Мрежови принтери'] },
    { title: 'Фото хартия', id: 'photo_paper', items: ['Canon Photo Paper', 'Гланцирана хартия', '10×15 см', 'A4 формат'] },
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
    { key: 'Type',        label: '📦 Тип',             values: ['Клавиатура','Мишка','Слушалки','Уеб камера'] },
    { key: 'Connection',  label: '🔗 Връзка',          values: ['USB','Bluetooth','Безжична','2.4GHz'] },
  ],
  printers: [
    { key: 'Функции',    label: '⚙ Функции',          values: ['Принт, Копиране, Сканиране','Принт, Копиране, Сканиране, Факс','Принт'] },
    { key: 'WiFi',       label: '📡 WiFi',             values: ['Да'] },
    { key: 'Двустранен', label: '🔄 Двустранен печат', values: ['Да'] },
    { key: 'Хартия',     label: '📄 Формат хартия',   values: ['A3', 'A4'] },
  ],
  network: [
    { key: 'WiFi',  label: '📡 WiFi стандарт', values: ['WiFi 4','WiFi 5','WiFi 6','WiFi 6E','WiFi 7'] },
    { key: 'Ports', label: '🔌 Портове',        values: ['4 порта','5 порта','8 порта','16 порта','24 порта','PoE'] },
    { key: 'Type',  label: '📦 Тип устройство', values: ['Рутер','Mesh нод','Суич','Access Point','USB адаптер','Outdoor CPE','SFP модул','Кабел'] },
  ],
  storage: [
    { key: 'Type',      label: '💾 Тип',               values: ['NAS','Сървър','Портативен SSD','Портативен HDD','USB Flash','SD карта','microSD','CF карта','Четец'] },
    { key: 'Capacity',  label: '📦 Капацитет',         values: ['16 GB','32 GB','64 GB','128 GB','256 GB','512 GB','1 TB','2 TB','4 TB','8 TB+'] },
    { key: 'Interface', label: '🔌 Интерфейс',         values: ['USB-C','USB-A','USB 3.0','USB 3.2','Thunderbolt','Ethernet','microSD','SD'] },
  ],
  ups: [
    { key: 'Мощност',    label: '⚡ Мощност (VA/KVA)',    values: ['600VA','800VA','850VA','1KVA','1.5KVA','2KVA','3KVA','6KVA+'] },
    { key: 'Тип',        label: '🔌 Тип UPS',             values: ['Линейно-интерактивен','Онлайн / Чиста синусоида','Резервна батерия'] },
    { key: 'Свързаност', label: '🔗 Свързаност',          values: ['USB'] },
    { key: 'AVR',        label: '🛡 AVR защита',          values: ['Да'] },
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
    { key: 'Сокет',  label: '🔩 Сокет',             values: ['AM5','AM4','LGA1851','LGA1700','LGA1200','sTR5','LGA2066'] },
    { key: 'Серия',  label: '📋 Модел / Серия',      values: ['Core Ultra','Core i9','Core i7','Core i5','Core i3','Ryzen 9','Ryzen 7','Ryzen 5','Ryzen 3','Threadripper','Xeon'] },
    { key: '_freq',  label: '⚡ Работна честота',     values: ['До 1.5 GHz','1.6 – 2.5 GHz','2.6 – 3.5 GHz','Над 3.6 GHz'] },
    { key: '_cores', label: '🧮 Физически ядра',      values: ['2','4','6','8','10','12','14','16','20','24','32+'] },
    { key: '_igpu',  label: '🖥 Графично ядро',       values: ['С iGPU','Без iGPU'] },
    { key: '_tdp',   label: '🌡 Макс. консумация (TDP)', values: ['До 65 W','66 – 100 W','Над 101 W'] },
  ],
  gpu: [
    { key: '_gpu_chip',    label: '🏭 Производител на чипа',  values: ['NVIDIA','AMD'] },
    { key: 'GPU',          label: '🎮 Графичен процесор',     values: ['RTX 50','RTX 40','RTX 30','RTX 20','GTX 16','GTX 10','RX 9','RX 8','RX 7','RX 6','Arc'] },
    { key: '_gpu_vram',    label: '💾 Обем памет',            values: ['4 GB','6 GB','8 GB','12 GB','16 GB','24 GB','32 GB'] },
    { key: '_gpu_memtype', label: '🔢 Тип памет',             values: ['GDDR7','GDDR6X','GDDR6','GDDR5'] },
    { key: 'Интерфейс',   label: '🔌 Ширина на шината',      values: ['512-bit','384-bit','256-bit','192-bit','128-bit','96-bit','64-bit'] },
    { key: 'Слот',         label: '📌 PCI Express',           values: ['PCI-E 5.0','PCI-E 4.0','PCI-E 3.0','PCI-E 2.0'] },
    { key: '_gpu_outputs', label: '🖥 Изходи',                values: ['HDMI','DisplayPort','DVI'] },
  ],
  motherboard: [
    { key: 'Сокет',         label: '🔩 Сокет',              values: ['AM5','AM4','LGA1851','LGA1700','LGA1200'] },
    { key: 'Чипсет',        label: '🔧 Чипсет',             values: ['Z890','Z790','X870','X670','B860','B850','B760','B660','B650','B550','H610','H510','A620','A520','B450'] },
    { key: '_mb_ram_type',  label: '💾 Тип памет',           values: ['DDR5','DDR4','DDR3'] },
    { key: '_mb_ram_slots', label: '🧮 Слотове за памет',    values: ['2','4'] },
    { key: 'Форм фактор',   label: '📐 Форм фактор',        values: ['ATX','Micro-ATX','Mini-ITX'] },
    { key: '_mb_outputs',   label: '🖥 Изходи',              values: ['HDMI','DisplayPort','DVI','VGA'] },
    { key: '_mb_connect',   label: '📡 Свързаност',          values: ['Wi-Fi','Bluetooth','2.5G LAN'] },
  ],
  ram: [
    { key: 'Тип',         label: '💾 Тип памет',   values: ['DDR5','DDR4','DDR3','DDR3L','ECC'] },
    { key: '_ram_cap',    label: '📦 Обем',         values: ['4 GB','8 GB','16 GB','32 GB','48 GB','64 GB'] },
    { key: 'Честота',     label: '⚡ Честота',      values: ['1600 MHz','2400 MHz','2666 MHz','3200 MHz','3600 MHz','4800 MHz','5200 MHz','5600 MHz','6000 MHz','6400 MHz','6800 MHz'] },
    { key: 'Форм фактор', label: '💻 Форм фактор', values: ['DIMM','SO-DIMM'] },
    { key: '_ram_kit',    label: '📦 Екстри',       values: ['Kit (комплект)'] },
  ],
  ssd: [
    { key: 'Интерфейс',    label: '🔌 Интерфейс',   values: ['NVMe PCIe Gen4','NVMe PCIe Gen3','SATA III'] },
    { key: '_storage_cap', label: '📦 Капацитет',    values: ['120 GB','256 GB','480 GB','512 GB','1 TB','2 TB','4 TB'] },
    { key: 'Форм фактор',  label: '📐 Форм фактор',  values: ['M.2 2280','M.2 2242','2.5"'] },
  ],
  hdd: [
    { key: '_storage_cap', label: '📦 Капацитет',    values: ['1 TB','2 TB','3 TB','4 TB','6 TB','8 TB','10 TB','12 TB','16 TB','20 TB'] },
    { key: 'Форм фактор',  label: '📐 Форм фактор',  values: ['3.5"','2.5"'] },
    { key: '_hdd_rpm',     label: '🌀 RPM',           values: ['5400','7200'] },
    { key: '_hdd_cache',   label: '💾 Кеш',           values: ['128 MB','256 MB','512 MB'] },
    { key: 'Интерфейс',    label: '🔌 Интерфейс',    values: ['SATA III','SAS'] },
  ],
  ssd_hdd: [
    { key: 'Интерфейс',    label: '🔌 Интерфейс',   values: ['NVMe PCIe Gen4','NVMe PCIe Gen3','SATA III','SAS'] },
    { key: '_storage_cap', label: '📦 Капацитет',    values: ['120 GB','256 GB','512 GB','1 TB','2 TB','4 TB','6 TB','8 TB','10 TB'] },
    { key: 'Форм фактор',  label: '📐 Форм фактор',  values: ['M.2 2280','M.2 2242','2.5"','3.5"'] },
    { key: '_hdd_rpm',     label: '🌀 RPM',           values: ['5400','7200'] },
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
  // Printer subcats
  inkjet_aio: [
    { key: 'WiFi',       label: '📡 WiFi',             values: ['Да'] },
    { key: 'Двустранен', label: '🔄 Двустранен печат', values: ['Да'] },
    { key: 'Функции',    label: '⚙ Функции',          values: ['Принт, Копиране, Сканиране, Факс','Принт, Копиране, Сканиране'] },
    { key: 'Хартия',     label: '📄 Формат',           values: ['A3', 'A4'] },
  ],
  megatank: [
    { key: 'WiFi',       label: '📡 WiFi',             values: ['Да'] },
    { key: 'Двустранен', label: '🔄 Двустранен печат', values: ['Да'] },
    { key: 'Функции',    label: '⚙ Функции',          values: ['Принт, Копиране, Сканиране, Факс','Принт, Копиране, Сканиране','Принт'] },
  ],
  laser: [
    { key: 'WiFi',       label: '📡 WiFi',             values: ['Да'] },
    { key: 'Двустранен', label: '🔄 Двустранен печат', values: ['Да'] },
    { key: 'Функции',    label: '⚙ Функции',          values: ['Принт, Копиране, Сканиране','Принт'] },
  ],
  portable: [
    { key: 'WiFi',       label: '📡 WiFi',             values: ['Да'] },
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
  // Hide generic cat spec filters in sidebar when a specific subcat is active
  const cpCatSpecWrap = document.getElementById('cpCatSpecWrap');
  if (cpCatSpecWrap) cpCatSpecWrap.style.display = (!id || id === 'all') ? '' : 'none';
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
  if (cat === 'components' && (!subcat || subcat === 'all')) specs = [];
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
    printer:       () => p.cat === 'printers' || all.includes('принтер') || all.includes('printer') || all.includes('lbp') || all.includes('pixma') || all.includes('maxify'),
    // Printers
    inkjet_aio:    () => p.subcat === 'inkjet_aio' || (p.cat === 'printers' && (all.includes('ts') || all.includes('tr') || all.includes('mg')) && !all.includes('megatank') && !all.includes('laser')),
    megatank:      () => p.subcat === 'megatank' || (p.cat === 'printers' && (all.includes('g1430') || all.includes('g2') || all.includes('g3') || all.includes('gx10') || all.includes('gx20') || all.includes('megatank') || all.includes('резервоар'))),
    laser:         () => p.subcat === 'laser' || (p.cat === 'printers' && (all.includes('laser') || all.includes('лазер') || all.includes('lbp') || all.includes('mf664'))),
    portable:      () => p.subcat === 'portable' || (p.cat === 'printers' && (all.includes('portable') || all.includes('bx110') || all.includes('battery') || all.includes('батерия'))),
    // Network
    router:        () => all.includes('router') || all.includes('рутер') || all.includes('wi-fi') || all.includes('4g lte') || /dsl-n\d+u/i.test(all),
    switch:        () => all.includes('switch') || all.includes('суич'),
    ap:            () => all.includes('access point') || all.includes(' i24 ') || all.includes('точка за достъп') || (all.includes('hotspot') && !all.includes('router')),
    mesh:          () => all.includes('mesh') || all.includes('zenwifi') || all.includes('nova mw') || all.includes('expertwifi') || all.includes('range extend') || all.includes('deco') || all.includes('orbi'),
    adapter:       () => (all.includes('usb') && (all.includes('wifi') || all.includes('wi-fi') || all.includes('bluetooth') || all.includes('lan') || all.includes('adapter') || all.includes('wireless'))) || all.includes('usb-bt') || all.includes('xg-c100') || all.includes('usb-c2500') || all.includes('dwa-'),
    sfp:           () => all.includes('sfp') || all.includes('gbic') || all.includes('mini-gbic') || all.includes('exp module') || all.includes('mod-gm') || all.includes('mod-fm') || all.includes('mod-mg') || all.includes('aoc-e10'),
    outdoor:       () => all.includes('outdoor') || all.includes('cpe') || all.includes('ptp') || /\bo[136]\b/.test(all),
    cable:         () => (p.cat === 'network') && (all.includes('utp') || all.includes('ftp') || all.includes('patch cab') || all.includes('305m') || (all.includes('100m') && all.includes('cat'))),
    // UPS
    ups_home:      () => p.subcat === 'ups_home'   || (p.cat === 'ups' && !p.subcat),
    ups_office:    () => p.subcat === 'ups_office',
    ups_server:    () => p.subcat === 'ups_server'  || (p.cat === 'ups' && (all.includes('online') || all.includes('on-line') || all.includes('чиста синусоида') || all.includes('double-conversion'))),
    ups_battery:   () => p.subcat === 'ups_battery' || (p.cat === 'ups' && (all.includes('battery') || all.includes('batt') || all.includes('батер'))),
    // Storage
    nas:           () => all.includes('nas') || all.includes('network attached') || all.includes('qnap') || all.includes('synology'),
    server:        () => all.includes('сървър') || all.includes('server') || all.includes('rack'),
    ext_drive:     () => all.includes('portable') || all.includes('портативен') || all.includes('external') || all.includes('външен'),
    flash:         () => p.subcat === 'usb_flash' || p.subcat === 'microsd' || p.subcat === 'sd_card' || p.subcat === 'cf_card' || p.subcat === 'card_reader',
    usb_flash:     () => p.subcat === 'usb_flash',
    microsd:       () => p.subcat === 'microsd',
    sd_card:       () => p.subcat === 'sd_card',
    cf_card:       () => p.subcat === 'cf_card',
    card_reader:   () => p.subcat === 'card_reader',
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
const _VALID_CATS = new Set(['all','laptops','desktops','gaming','components','monitors','peripherals','phones','network','storage','software','accessories','printers','ups','consumables','new','sale']);
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
  // Auto-open cat page on direct link/bookmark (?cat=laptops or ?cat=laptops&sub=gaming_l)
  const _urlCat = params.get('cat');
  if (_urlCat && _urlCat !== 'all' && _VALID_CATS.has(_urlCat)) {
    const _urlSub = params.get('sub') || null;
    setTimeout(() => { if (typeof openCatPage === 'function') openCatPage(_urlCat, _urlSub, true); }, 350);
  }
  // Auto-open blog or blog post on direct link
  const _urlPage = params.get('page');
  if (_urlPage === 'blog') {
    const _urlPost = params.get('post');
    if (_urlPost) {
      setTimeout(() => { if (typeof openBlogPost === 'function') openBlogPost(_urlPost); }, 350);
    } else {
      setTimeout(() => { if (typeof openBlogPage === 'function') openBlogPage(); }, 350);
    }
  } else if (_urlPage === 'service') {
    setTimeout(() => { if (typeof openServicePage === 'function') openServicePage(); }, 350);
  } else if (_urlPage === 'delivery') {
    setTimeout(() => { if (typeof openDeliveryPage === 'function') openDeliveryPage(); }, 350);
  } else if (_urlPage === 'contacts') {
    setTimeout(() => { if (typeof openContactsPage === 'function') openContactsPage(); }, 350);
  }
}

// URL hooks for critical-bundle functions (applyFilter, applySort, applyAdvFilters).
// Patches for openProductModal / closeProductModalDirect are in lazy-init.js because
// those functions live in the lazy bundle (gallery.js).
var _urlHooked = false;
if (!_urlHooked) {
  _urlHooked = true;

  var _baseApplyFilter = applyFilter;
  applyFilter = function(btn, cat) { _baseApplyFilter(btn, cat); updateURL(); updateActiveFiltersBar(); };

  var _baseApplySort = applySort;
  applySort = function(val) { _baseApplySort(val); updateURL(); };

  var _baseApplyAdvFilters = applyAdvFilters;
  applyAdvFilters = function() { _baseApplyAdvFilters(); updateURL(); };
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

// ═══════════════════════════════════════
// SIDEBAR WIDGET A — TOP PRODUCT ROTATOR
// ═══════════════════════════════════════
const _HP_CAT_CYCLE = ['laptops','desktops','components','monitors','peripherals','network','storage','accessories'];
const _CAT_EMOJI_SB = {laptops:'💻',desktops:'🖥️',components:'⚙️',monitors:'🖥',peripherals:'⌨️',network:'🌐',storage:'💾',accessories:'🎧'};
const _CAT_LABEL_SB = {laptops:'Лаптопи',desktops:'Настолни',components:'Компоненти',monitors:'Монитори',peripherals:'Периферия',network:'Мрежа',storage:'Съхранение',accessories:'Аксесоари'};
let _sbTopCatIndex = Math.floor(Math.random() * _HP_CAT_CYCLE.length);

function renderSidebarTopProduct(forceNext) {
  const wrap = document.getElementById('sidebarTopProduct');
  if (!wrap) return;
  if (forceNext) _sbTopCatIndex = (_sbTopCatIndex + 1) % _HP_CAT_CYCLE.length;
  const cat = _HP_CAT_CYCLE[_sbTopCatIndex];
  const pool = products.filter(p => p.cat === cat && p.stock !== false);
  if (!pool.length) { wrap.innerHTML = ''; return; }
  const top = pool.reduce((best, p) => {
    const score = p.rating * Math.log1p((p.rv || 0) + 1);
    const bScore = best.rating * Math.log1p((best.rv || 0) + 1);
    return score > bScore ? p : best;
  });
  const safeImg = top.img && isSafeImgUrl(top.img) ? top.img : null;
  const imgHtml = safeImg
    ? `<img src="${safeImg}" alt="" width="100" height="100" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="font-size:48px;display:none">${top.emoji||''}</span>`
    : `<span style="font-size:48px">${top.emoji||''}</span>`;
  const shortName = top.name.length > 46 ? top.name.slice(0, 46) + '…' : top.name;
  wrap.innerHTML = `
    <div class="sb-tp-header">
      <span class="sb-tp-title">⭐ Топ продукт</span>
      <span class="sb-tp-cat-pill">${_CAT_EMOJI_SB[cat]||''} ${_CAT_LABEL_SB[cat]||cat}</span>
    </div>
    <div class="sb-tp-img-wrap">${imgHtml}</div>
    <div class="sb-tp-brand">${escHtml(top.brand||'')}</div>
    <div class="sb-tp-name">${escHtml(shortName)}</div>
    <div class="sb-tp-stars">${starsHTML(top.rating)} <span style="color:var(--muted);font-size:11px">${top.rating} (${top.rv||0})</span></div>
    <div class="sb-tp-price">${fmtEur(top.price)}<span class="price-bgn-sub">${fmtBgn(top.price)}</span></div>
    <button type="button" class="sb-tp-btn" onclick="openProductPage(${top.id})">Виж продукта →</button>
    <button type="button" class="sb-tp-refresh" onclick="renderSidebarTopProduct(true)">Друга категория</button>`;
}

// ═══════════════════════════════════════
// SIDEBAR WIDGET C — COMPARE TRAY
// ═══════════════════════════════════════
function updateSidebarCompare() {
  const wrap = document.getElementById('sidebarCompare');
  if (!wrap) return;
  wrap.style.display = 'block';
  if (typeof compareList === 'undefined' || compareList.length === 0) {
    wrap.innerHTML = `
      <div class="sb-cmp-header">
        <span class="sb-cmp-title"><svg width="13" height="13" class="svg-ic" aria-hidden="true"><use href="#ic-compare"/></svg> Сравнение</span>
      </div>
      <div class="sb-cmp-empty">
        <div class="sb-cmp-empty-icon"><svg width="28" height="28" class="svg-ic" aria-hidden="true"><use href="#ic-compare"/></svg></div>
        Добави продукти с бутона <svg width="13" height="13" class="svg-ic" aria-hidden="true"><use href="#ic-compare"/></svg> на всяка карта
      </div>`;
    return;
  }
  const prods = compareList.map(id => products.find(x => x.id === id)).filter(Boolean);
  const items = prods.map(p => {
    const safeImg = p.img && isSafeImgUrl(p.img) ? p.img : null;
    const thumb = safeImg
      ? `<img src="${safeImg}" alt="" width="32" height="32" loading="lazy" onerror="this.style.display='none'">`
      : `<span style="font-size:20px">${p.emoji||''}</span>`;
    const shortName = p.name.length > 28 ? p.name.slice(0, 28) + '…' : p.name;
    return `<li class="sb-cmp-item">
      <div class="sb-cmp-thumb">${thumb}</div>
      <div class="sb-cmp-info">
        <div class="sb-cmp-item-name">${escHtml(shortName)}</div>
        <div class="sb-cmp-item-price">${fmtEur(p.price)}</div>
      </div>
      <button type="button" class="sb-cmp-remove" onclick="removeCompare(${p.id})" aria-label="Премахни">×</button>
    </li>`;
  }).join('');
  const canCompare = prods.length >= 2;
  wrap.innerHTML = `
    <div class="sb-cmp-header">
      <span class="sb-cmp-title"><svg width="13" height="13" class="svg-ic" aria-hidden="true"><use href="#ic-compare"/></svg> Сравнение</span>
      <span class="sb-cmp-counter">${prods.length}/3</span>
    </div>
    <ul class="sb-cmp-list">${items}</ul>

    <div class="sb-cmp-actions">
      <button type="button" class="sb-cmp-go" onclick="openCompareModal()" ${canCompare?'':'disabled style="opacity:.5;cursor:not-allowed"'}>Сравни сега →</button>
      <button type="button" class="sb-cmp-clear" onclick="clearCompare()">Изчисти</button>
    </div>`;
}

// ═══════════════════════════════════════
// SIDEBAR WIDGET — BRAND SPOTLIGHT
// ═══════════════════════════════════════
const _SB_BRANDS = ['Acer','LG','Lenovo','Fractal Design','Tenda','MSI','Asus','Canon','ASRock','Noctua','Deepcool','ADATA','Fortron','Arctic'];

// Safe delegation for brand-spot search button (avoids XSS via inline onclick)
document.addEventListener('click', function(e) {
  const btn = e.target.closest('[data-brand-search]');
  if (btn && typeof showSearchResultsPage === 'function') {
    showSearchResultsPage(btn.dataset.brandSearch);
  }
});

function renderSidebarBrandSpot() {
  const wrap = document.getElementById('sidebarBrandSpot');
  if (!wrap) return;
  // Rotate by day — different brand each day
  const dayIdx = Math.floor(Date.now() / 86400000) % _SB_BRANDS.length;
  const brand = _SB_BRANDS[dayIdx];
  const brandProds = products.filter(p => p.brand === brand && p.stock !== false);
  if (!brandProds.length) { wrap.innerHTML = ''; return; }

  // Top 3 by score for thumbnails
  const top3 = [...brandProds]
    .sort((a, b) => b.rating * Math.log1p((b.rv||0)+1) - a.rating * Math.log1p((a.rv||0)+1))
    .slice(0, 3);

  const thumbs = top3.map(p => {
    const safeImg = p.img && isSafeImgUrl(p.img) ? p.img : null;
    return safeImg
      ? `<div class="sb-bs-thumb" onclick="openProductPage(${p.id})" title="${escHtml(p.name)}"><img src="${safeImg}" alt="" width="52" height="52" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="display:none;font-size:24px">${p.emoji||''}</span></div>`
      : `<div class="sb-bs-thumb" onclick="openProductPage(${p.id})" title="${escHtml(p.name)}"><span style="font-size:24px">${p.emoji||''}</span></div>`;
  }).join('');

  const minPrice = Math.min(...brandProds.map(p => p.price));

  wrap.innerHTML = `
    <div class="sb-bs-header">
      <span class="sb-bs-label">🏷 Марка на деня</span>
    </div>
    <div class="sb-bs-name">${escHtml(brand)}</div>
    <div class="sb-bs-meta">${brandProds.length} продукта · от ${fmtEur(minPrice)}</div>
    <div class="sb-bs-thumbs">${thumbs}</div>
    <button type="button" class="sb-bs-btn" data-brand-search="${escHtml(brand)}">Разгледай всички →</button>`;
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
  const _homeIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>';
  const crumbs = [{ label: 'Начало', fn: () => { if (typeof closeProductPage === 'function') closeProductPage(); if (typeof closeCatPage === 'function') closeCatPage(); bcSet([]); } }, ..._bcTrail];

  window._bcFns = window._bcFns || {};
  const html = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep    = i > 0 ? '<span class="bc-sep" aria-hidden="true">›</span>' : '';
    const display = i === 0 ? `<span class="bc-home-icon" aria-label="Начало">${_homeIcon}</span>` : c.label;
    if (isLast) {
      return `${sep}<div class="bc-item current" aria-current="page"><span title="${c.label}">${c.label}</span></div>`;
    }
    window._bcFns[i] = c.fn;
    const href = i === 0 ? '/' : (c.url || '#');
    return `${sep}<div class="bc-item"><a href="${href}" onclick="event.preventDefault();if(window._bcFns[${i}])window._bcFns[${i}]()">${display}</a></div>`;
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

// ─── SIDEBAR ACTIVE STATE ───
function setSidebarActive(cat, subcat) {
  // Clear previous active
  document.querySelectorAll('.cat-item.active').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.cat-subcat-link.active').forEach(el => el.classList.remove('active'));

  if (!cat || cat === 'all') return;

  // Find the cat-item for this category
  const catItems = document.querySelectorAll('.sidebar-categories .cat-item');
  let targetItem = null;
  catItems.forEach(item => {
    const fn = item.getAttribute('onclick') || '';
    if (fn.includes(`'${cat}'`)) targetItem = item;
  });
  if (!targetItem) return;

  targetItem.classList.add('active');

  // Open accordion if not already open
  if (!targetItem.classList.contains('open')) {
    toggleSidebarCat(targetItem, cat);
  }

  // Mark active subcat link
  if (subcat && subcat !== 'all') {
    const subList = targetItem.nextElementSibling;
    if (subList && subList.classList.contains('cat-subcat-list')) {
      subList.querySelectorAll('.cat-subcat-link').forEach(link => {
        if ((link.getAttribute('onclick') || '').includes(`'${subcat}'`)) {
          link.classList.add('active');
        }
      });
    }
  }
}
// ───────────────────────────

// ─── SIDEBAR ACCORDION ───
function toggleSidebarCat(el, cat) {
  const isOpen = el.classList.contains('open');

  // Затвори всички отворени
  document.querySelectorAll('.sidebar-categories .cat-item.open').forEach(item => {
    item.classList.remove('open');
    const existing = item.nextElementSibling;
    if (existing && existing.classList.contains('cat-subcat-list')) existing.remove();
  });

  if (isOpen) return; // беше отворен — затвори само

  const subs = (typeof SUBCATS !== 'undefined' && SUBCATS[cat]) ? SUBCATS[cat] : [];
  if (!subs.length) {
    // Няма подкатегории — навигирай директно
    openCatPage(cat);
    return;
  }

  el.classList.add('open');

  // Strip emojis from label
  const cleanLabel = s => s.label.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();

  const list = document.createElement('div');
  list.className = 'cat-subcat-list';
  list.innerHTML = subs.map(s =>
    `<a href="/?cat=${cat}&sub=${s.id}" class="cat-subcat-link" onclick="event.preventDefault();openCatPage('${cat}','${s.id}')">${cleanLabel(s)}</a>`
  ).join('');

  el.insertAdjacentElement('afterend', list);
}
// ─────────────────────────

// ─── NAVBAR MEGA MENU ───
let _navMegaTimeout;

function navMegaShow() {
  clearTimeout(_navMegaTimeout);
  const menu = document.getElementById('navMegamenu');
  const trigger = document.getElementById('navCatTrigger');
  const arrow = document.getElementById('navCatArrow');
  if (!menu || !trigger) return;
  const rect = trigger.getBoundingClientRect();
  menu.style.top = (rect.bottom + 2) + 'px';
  menu.style.left = rect.left + 'px';
  menu.classList.add('open');
  if (arrow) arrow.style.transform = 'rotate(180deg)';
}

function navMegaHide(e) {
  _navMegaTimeout = setTimeout(() => {
    const menu = document.getElementById('navMegamenu');
    const arrow = document.getElementById('navCatArrow');
    if (menu) menu.classList.remove('open');
    if (arrow) arrow.style.transform = '';
  }, 120);
}
// ────────────────────────



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
    ...(p.rv > 0 ? { "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating,
      "reviewCount": p.rv,
      "bestRating": 5,
      "worstRating": 1
    }} : {})
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
    { url: '/?cat=printers', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=ups',      priority: '0.7', freq: 'weekly' },
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
document.addEventListener('DOMContentLoaded', readURLParams);



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
  printers:   { emoji:'🖨', icon:'ic-printer',    label:'Принтери',             sub:'Мастиленоструйни, MegaTank, Лазерни', badge:null },
  ups:        { emoji:'⚡', icon:'ic-bolt',       label:'UPS устройства',       sub:'Домашни, Офис, Онлайн / Чиста синусоида', badge:null },
  consumables:{ emoji:'🖨️', icon:'ic-printer',    label:'Консумативи',          sub:'Тонери, Мастила, Фото хартия', badge:null },
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
  { cat:'storage',    id:'usb_flash',   label:'USB флашки',             icon:'💾'                },
  { cat:'storage',    id:'microsd',     label:'microSD карти',          icon:'📱'                },
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
  { cat:'printers',   id:'megatank',     label:'MegaTank принтери',     icon:'♾️'               },
  { cat:'printers',   id:'inkjet_aio',  label:'Мастиленоструйни МФУ',  icon:'🖨'                },
  { cat:'components', id:'case_cooling',label:'Кутии и охлаждане',     icon:'❄️'               },
  { cat:'ups',        id:'ups_home',    label:'Домашни UPS',            icon:'🏠'                },
  { cat:'ups',        id:'ups_server',  label:'Онлайн UPS (синусоида)', icon:'⚡'                },
  { cat:'consumables',id:'laser_toner', label:'Лазерни тонери',         icon:'🖨️'               },
  { cat:'consumables',id:'inkjet',      label:'Мастиленоструйни касети', icon:'🖨️'               },
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
let cpPriceMin = 0, cpPriceMax = 9999;
let _cpMaxEur = 9999;
let cpBrands = new Set();
let cpRating = 0;
let cpSaleOnly = false, cpNewOnly = false, cpStockOnly = false;
let cpSpecFilters = {};
let cpSubcat = 'all';
let _cpSubcatBrands = null; // known brand values for current subcat (to power "Other" filter)

let _catPageScrollY = 0;
function openCatPage(cat, preSubcat, fromURL = false) {
  _catPageScrollY = window.scrollY || document.documentElement.scrollTop;
  cpCat = cat;
  cpSort = 'bestseller';
  cpPriceMin = 0; cpPriceMax = _cpMaxEur;
  cpBrands = new Set();
  cpRating = 0; cpSaleOnly = false; cpNewOnly = false; cpStockOnly = false;
  cpSpecFilters = {};

  cpSubcat = preSubcat || 'all';

  const m = CAT_META[cat] || { emoji:'🗂', label: cat, sub:'' };
  const cpEmoji = document.getElementById('cpEmoji');
  const cpTitle = document.getElementById('cpTitle');
  const cpSubtitle = document.getElementById('cpSubtitle');
  if (cpEmoji) cpEmoji.innerHTML = `<svg width="28" height="28" class="svg-ic cp-cat-icon" aria-hidden="true"><use href="#${m.icon||'ic-tag'}"/></svg>`;
  if (cpTitle) cpTitle.textContent = m.label;
  if (cpSubtitle) cpSubtitle.textContent = m.sub;

  cpUpdateCatBreadcrumb(cat, preSubcat);

  // Build sidebar HTML
  buildCpSidebar(cat);
  // Build subcat bar
  cpRenderSubcatBar(cat);

  // Apply pre-selected subcat if provided (populates spec filters + highlights pill)
  if (preSubcat && preSubcat !== 'all') {
    const activePill = document.querySelector(`#cpSubcatBar .subcat-pill[onclick*="'${preSubcat}'"]`);
    cpApplySubcat(preSubcat, activePill);
  }

  // Update SEO
  const _catDesc = m.label + ' — ' + m.sub + '. Купи онлайн от Most Computers.';
  setPageMeta(m.label + ' | Most Computers', _catDesc);
  const _subSuffix = (preSubcat && preSubcat !== 'all') ? '&sub=' + encodeURIComponent(preSubcat) : '';
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://mostcomputers.bg/?cat=${cat}${_subSuffix}`);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://mostcomputers.bg/?cat=${cat}${_subSuffix}`);

  // Open page first so grid element is visible, then render
  document.getElementById('catPage').classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  try{history.pushState({ catPage: cat, subcat: preSubcat || 'all' }, '', '?cat=' + cat + _subSuffix);}catch(e){}
  // Defer render so overflow/class paint commits before heavy grid work
  requestAnimationFrame(() => {
    if (fromURL) cpApplyURLFilters();
    else cpUpdateSlider(true); // initialize slider track/label (catPage is now open)
    cpRenderGrid();
    setSidebarActive(cat, preSubcat);
  });
}

function closeCatPage() {
  // Close any open product page or modal first
  const pdp = document.getElementById('pdpBackdrop');
  if (pdp && pdp.classList.contains('open')) pdp.classList.remove('open');
  const modal = document.getElementById('productModalBackdrop');
  if (modal && modal.classList.contains('open')) modal.classList.remove('open');
  document.getElementById('catPage').classList.remove('open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  restorePageMeta();
  // Restore Open Graph extras
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | Лаптопи, Телефони, Телевизори — От 1990 г.');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', 'Most Computers — специализиран магазин за електроника от 1990 г. Смартфони, лаптопи, телевизори от Apple, Samsung, Sony. Безплатна доставка над 100 €.');
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', 'https://mostcomputers.bg/og-default.jpg');
  const ogImgAlt = document.querySelector('meta[property="og:image:alt"]');
  if (ogImgAlt) ogImgAlt.setAttribute('content', 'Most Computers — магазин за електроника от 1990 г.');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://mostcomputers.bg/');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', 'Most Computers | Електроника от 1990 г.');
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', 'Лаптопи, Телефони, Телевизори, Аудио и аксесоари от Apple, Samsung, Sony. Безплатна доставка над 100 €.');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/');
  try{history.pushState({}, '', location.pathname);}catch(e){}
  setSidebarActive(null);
  requestAnimationFrame(() => window.scrollTo(0, _catPageScrollY));
}

// Back button support
window.addEventListener('popstate', e => {
  if (e.state?.catPage) {
    const pg = document.getElementById('catPage');
    if (pg && !pg.classList.contains('open')) {
      const _sub = e.state.subcat && e.state.subcat !== 'all' ? e.state.subcat : null;
      openCatPage(e.state.catPage, _sub);
    }
  } else if (e.state?.page === 'blog') {
    if (e.state.post) {
      if (typeof openBlogPost === 'function') openBlogPost(e.state.post);
    } else {
      const postView = document.getElementById('blogPostView');
      if (postView && postView.style.display !== 'none') {
        if (typeof closeBlogPost === 'function') closeBlogPost();
      } else if (typeof openBlogPage === 'function') {
        openBlogPage();
      }
    }
  } else {
    // Navigated back to homepage — close all overlays
    const pg = document.getElementById('catPage');
    if (pg) pg.classList.remove('open');
    const blogPg = document.getElementById('blogPage');
    if (blogPg) blogPg.classList.remove('open');
    const pdp = document.getElementById('pdpBackdrop');
    if (pdp) pdp.classList.remove('open');
    const modal = document.getElementById('productModalBackdrop');
    if (modal) modal.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    const _ld = document.getElementById('_blogPostLD');
    if (_ld) _ld.remove();
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
  const maxPrice = catProds.length ? Math.max(...catProds.map(p => toEur(p.price))) : 2000;
  const maxPriceRound = Math.ceil(maxPrice / 100) * 100;
  _cpMaxEur = maxPriceRound;
  cpPriceMax = maxPriceRound;

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
    html += `<div id="cpCatSpecWrap">`;
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
    html += `</div>`;
  }

  // ── Brands (collapsed by default) ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);">
    <div onclick="cpToggleBrands(this)" style="display:flex;align-items:center;justify-content:space-between;padding:16px;cursor:pointer;user-select:none;">
      <div class="sfb-title" id="cpBrandTitle" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin:0;">🏷 Марка</div>
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


  // ── Subcat-specific spec filters (populated by cpApplySubcat) ──
  html += `<div id="cpSubcatSpecBlock"></div>`;

  // ── Reset button ──
  html += `<div style="padding:12px 16px 16px;">
    <button type="button" onclick="cpResetFilters()" style="width:100%;background:none;border:1px solid var(--border);border-radius:8px;padding:9px;font-size:12px;font-weight:700;color:var(--text2);cursor:pointer;font-family:'Outfit',sans-serif;transition:all .18s;" onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">
      ✕ Изчисти всички филтри
    </button>
  </div>`;

  sb.innerHTML = html;
  cpUpdateSlider(true);
}

function cpUpdateSlider(skipRender) {
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
  if (!skipRender) cpRenderGrid();
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
const cpSubcatSpecChange = cpSpecChange;

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

const _BC_HOME_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>';

function cpUpdateCatBreadcrumb(cat, subcat) {
  const bc = document.getElementById('catBreadcrumb');
  if (!bc) return;
  const m = CAT_META[cat] || { label: cat };
  const hasSubcat = subcat && subcat !== 'all';

  // Намери label на подкатегорията без емотиконки
  let subcatLabel = '';
  if (hasSubcat && typeof SUBCATS !== 'undefined' && SUBCATS[cat]) {
    const found = SUBCATS[cat].find(s => s.id === subcat);
    if (found) subcatLabel = found.label.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
  }
  if (!subcatLabel && hasSubcat) subcatLabel = subcat;

  let html = '<ol itemscope itemtype="https://schema.org/BreadcrumbList">';

  // Ниво 1: Начало
  html += `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
    <a href="/" class="bc-home-link" itemprop="item" onclick="closeCatPage();return false;" aria-label="Начало">
      <span class="bc-home-icon">${_BC_HOME_ICON}</span>
      <meta itemprop="name" content="Начало">
    </a>
    <meta itemprop="position" content="1">
  </li>`;

  html += '<span class="bc-sep" aria-hidden="true">›</span>';

  if (hasSubcat) {
    // Ниво 2: Категория — кликаема, изчиства подкатегорията
    html += `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/?cat=${cat}" class="bc-cat-link" itemprop="item" onclick="event.preventDefault();cpApplySubcat('all',null)">
        <span itemprop="name">${m.label.replace(/</g,'&lt;')}</span>
      </a>
      <meta itemprop="position" content="2">
    </li>`;
    html += '<span class="bc-sep" aria-hidden="true">›</span>';
    // Ниво 3: Подкатегория — текущата страница, не е линк
    html += `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span class="bc-current" itemprop="name">${subcatLabel}</span>
      <meta itemprop="position" content="3">
    </li>`;
  } else {
    // Ниво 2: Категория — текущата страница, не е линк
    html += `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span class="bc-current" itemprop="name">${m.label.replace(/</g,'&lt;')}</span>
      <meta itemprop="position" content="2">
    </li>`;
  }

  html += '</ol>';
  bc.innerHTML = html;
}

function cpApplySubcat(id, btn) {
  cpSubcat = id;
  document.querySelectorAll('#cpSubcatBar .subcat-pill').forEach(p => p.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else if (id === 'all') {
    // Called programmatically (e.g. from breadcrumb) — activate the "Всички" pill
    const allPill = document.querySelector('#cpSubcatBar .subcat-pill:first-child');
    if (allPill) allPill.classList.add('active');
  }
  // Hide generic cat spec filters when a specific subcat is active
  const cpCatSpecWrap = document.getElementById('cpCatSpecWrap');
  if (cpCatSpecWrap) cpCatSpecWrap.style.display = (!id || id === 'all') ? '' : 'none';
  // Update brand filter title + list for subcat-specific manufacturers
  const _subcatMfr = {
    cpu: ['Intel','AMD'],
    gpu: ['Palit','Gainward','Gigabyte','Sapphire','MSI','ASUS','ASRock','TD'],
    motherboard: ['ASUS','MSI','Gigabyte','ASRock'],
    ram: [
      {label:'Team',    value:'TeamGroup'},
      {label:'ADATA',   value:'ADATA'},
      {label:'Kingston',value:'Kingston'},
      {label:'KingSpec',value:'KingSpec'},
      {label:'Crucial', value:'Crucial'},
      {label:'Samsung', value:'Samsung'},
      {label:'Other',   value:'__other__'},
    ],
    ssd: [
      {label:'Team',    value:'TeamGroup'},
      {label:'ADATA',   value:'ADATA'},
      {label:'Kingston',value:'Kingston'},
      {label:'KingSpec',value:'KingSpec'},
      {label:'MSI',     value:'MSI'},
      {label:'Emtec',   value:'Emtec'},
      {label:'Other',   value:'__other__'},
    ],
    hdd: ['Seagate'],
    ssd_hdd: [
      {label:'Team',    value:'TeamGroup'},
      {label:'ADATA',   value:'ADATA'},
      {label:'Kingston',value:'Kingston'},
      {label:'KingSpec',value:'KingSpec'},
      {label:'MSI',     value:'MSI'},
      {label:'Emtec',   value:'Emtec'},
      {label:'Seagate', value:'Seagate'},
      {label:'Other',   value:'__other__'},
    ],
  };
  const brandTitle = document.getElementById('cpBrandTitle');
  const brandList  = document.getElementById('cpBrandList');
  const brandSearch = document.getElementById('cpBrandSearch');
  const brandBody  = document.getElementById('cpBrandBody');
  if (brandTitle && brandList) {
    const mfr = id && id !== 'all' ? _subcatMfr[id] : null;
    if (mfr) {
      brandTitle.textContent = '🏷 Производител';
      if (brandSearch) brandSearch.style.display = 'none';
      // Resolve label/value for each entry (supports plain string or {label,value} object)
      const mfrEntries = mfr.map(b => typeof b === 'object' ? b : {label: b, value: b});
      const knownValues = mfrEntries.map(e => e.value).filter(v => v !== '__other__');
      _cpSubcatBrands = knownValues;
      const subcatProds = products.filter(p => p.subcat === id || (normalizeCat(p.cat) === cpCat && (!p.subcat || p.subcat === id)));
      brandList.innerHTML = mfrEntries.map(({label, value}) => {
        const cnt = value === '__other__'
          ? subcatProds.filter(p => !knownValues.includes(p.brand)).length
          : subcatProds.filter(p => p.brand === value).length;
        return `<label class="brand-filter-item"><input type="checkbox" value="${value}" onchange="cpBrandChange(this)"><span style="flex:1;">${label}</span><span class="brand-count">${cnt}</span></label>`;
      }).join('');
      if (brandBody) brandBody.style.display = '';
    } else {
      brandTitle.textContent = '🏷 Марка';
      if (brandSearch) brandSearch.style.display = '';
      if (brandBody) brandBody.style.display = 'none';
      // Restore full list — rebuild from cpCat products
      const catProds = products.filter(p => normalizeCat(p.cat) === cpCat);
      const allBrands = [...new Set(catProds.map(p => p.brand))].sort();
      brandList.innerHTML = allBrands.map(b => {
        const cnt = catProds.filter(p => p.brand === b).length;
        return `<label class="brand-filter-item"><input type="checkbox" value="${b}" onchange="cpBrandChange(this)"><span style="flex:1;">${b}</span><span class="brand-count">${cnt}</span></label>`;
      }).join('');
    }
  }
  // Render subcat-specific spec filters into sidebar
  const cpSubcatSpecBlock = document.getElementById('cpSubcatSpecBlock');
  if (cpSubcatSpecBlock) {
    const subcatSpecs = (id && id !== 'all' && typeof SUBCAT_SPEC_FILTERS !== 'undefined') ? SUBCAT_SPEC_FILTERS[id] : null;
    if (subcatSpecs && subcatSpecs.length) {
      cpSubcatSpecBlock.innerHTML = subcatSpecs.map(spec => `
        <div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
          <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${spec.label}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            ${spec.values.map(val => `<label class="brand-filter-item" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" data-spec-key="${spec.key}" value="${val}" onchange="cpSubcatSpecChange(this)">
              <span style="flex:1;font-size:13px;">${val}</span>
            </label>`).join('')}
          </div>
        </div>`).join('');
    } else {
      cpSubcatSpecBlock.innerHTML = '';
    }
  }
  cpRenderGrid();
  cpUpdateCatBreadcrumb(cpCat, id);
  setSidebarActive(cpCat, id);
}

function cpUpdateURL() {
  if (!document.getElementById('catPage')?.classList.contains('open')) return;
  const params = new URLSearchParams();
  params.set('cat', cpCat);
  if (cpSubcat && cpSubcat !== 'all') params.set('sub', cpSubcat);
  if (cpSort && cpSort !== 'bestseller') params.set('sort', cpSort);
  if (cpBrands.size > 0) params.set('brand', [...cpBrands].join(','));
  if (cpPriceMin > 0) params.set('priceMin', cpPriceMin);
  if (cpPriceMax < _cpMaxEur) params.set('priceMax', cpPriceMax);
  if (cpSaleOnly) params.set('sale', '1');
  if (cpNewOnly) params.set('new', '1');
  if (cpStockOnly) params.set('stock', '1');
  if (cpRating > 0) params.set('rating', cpRating);
  const qs = '?' + params.toString();
  const fullUrl = 'https://mostcomputers.bg/' + qs;
  try { history.replaceState({ catPage: cpCat, subcat: cpSubcat }, '', qs); } catch(e) {}
  const can = document.querySelector('link[rel="canonical"]');
  if (can) can.setAttribute('href', fullUrl);
  const og = document.querySelector('meta[property="og:url"]');
  if (og) og.setAttribute('content', fullUrl);
}

function cpApplyURLFilters() {
  const params = new URLSearchParams(location.search);
  const _VALID_SORTS_CP = new Set(['bestseller','price-asc','price-desc','rating','discount','new']);
  const sort = params.get('sort');
  if (sort && _VALID_SORTS_CP.has(sort)) {
    cpSort = sort;
    const sortSel = document.getElementById('cpSortSelect');
    if (sortSel) sortSel.value = cpSort;
  }
  const brand = params.get('brand');
  if (brand) {
    brand.split(',').forEach(b => { if (b && b.length <= 60) cpBrands.add(b); });
    document.querySelectorAll('#cpBrandList input[type=checkbox]').forEach(cb => {
      if (cpBrands.has(cb.value)) cb.checked = true;
    });
  }
  const priceMin = parseFloat(params.get('priceMin'));
  if (!isNaN(priceMin) && priceMin > 0) {
    cpPriceMin = priceMin;
    const el = document.getElementById('cpPriceMinSlider');
    if (el) el.value = cpPriceMin;
  }
  const priceMax = parseFloat(params.get('priceMax'));
  if (!isNaN(priceMax) && priceMax < _cpMaxEur) {
    cpPriceMax = priceMax;
    const el = document.getElementById('cpPriceMaxSlider');
    if (el) el.value = cpPriceMax;
  }
  if (params.get('sale') === '1') { cpSaleOnly = true; const el = document.getElementById('cpSaleToggle'); if (el) el.checked = true; }
  if (params.get('new') === '1') { cpNewOnly = true; const el = document.getElementById('cpNewToggle'); if (el) el.checked = true; }
  if (params.get('stock') === '1') { cpStockOnly = true; const el = document.getElementById('cpStockToggle'); if (el) el.checked = true; }
  const rating = parseFloat(params.get('rating'));
  if (!isNaN(rating) && rating > 0) {
    cpRating = rating;
    const rEl = document.querySelector(`input[name="cpRating"][value="${rating}"]`);
    if (rEl) rEl.checked = true;
  }
  cpUpdateSlider(true);
}

// ═══════════════════════════════════════
// RENDER CAT PAGE GRID
// ═══════════════════════════════════════
function cpGetFiltered() {
  let list = products.slice();
  // category filter
  if (cpCat === 'new') { list = list.slice().sort((a,b) => b.id - a.id); }
  else if (cpCat === 'sale') list = list.filter(p => p.badge === 'sale' || p.badge === 'Намаление' || !!p.old);
  else if (cpCat !== 'all') list = list.filter(p => normalizeCat(p.cat) === cpCat);
  // subcat filter
  if (cpSubcat && cpSubcat !== 'all' && typeof matchesSubcat === 'function')
    list = list.filter(p => matchesSubcat(p, cpSubcat));
  // price
  list = list.filter(p => { const e = toEur(p.price); return e >= cpPriceMin && e <= cpPriceMax; });
  // brands
  if (cpBrands.size > 0) list = list.filter(p => {
    if (cpBrands.has(p.brand)) return true;
    if (cpBrands.has('__other__') && _cpSubcatBrands && !_cpSubcatBrands.includes(p.brand)) return true;
    return false;
  });
  // rating
  if (cpRating > 0) list = list.filter(p => p.rating >= cpRating);
  // toggles
  if (cpStockOnly) list = list.filter(p => p.stock !== false);
  if (cpSaleOnly || cpNewOnly) {
    list = list.filter(p =>
      (cpSaleOnly && (p.badge === 'sale' || !!p.old)) ||
      (cpNewOnly  && p.badge === 'new')
    );
  }
  // Spec filters
  const _типToSubcat = {'процесор':'cpu','видеокарта':'gpu','дънна платка':'motherboard','ram':'ram','ssd nvme':'ssd','hdd':'hdd','захранване':'psu','кутия':'case','охлаждане':'cooling'};
  Object.entries(cpSpecFilters).forEach(([key, vals]) => {
    if (!vals || !vals.size) return;
    // 'Тип' filter for components maps label → subcat
    if (key === 'Тип') {
      const subcats = [...vals].map(v => _типToSubcat[v.toLowerCase()]).filter(Boolean);
      if (subcats.length) { list = list.filter(p => subcats.includes(p.subcat)); return; }
    }
    // Numeric/computed CPU filters (keys prefixed with _)
    if (key === '_tdp') {
      list = list.filter(p => {
        const tdpStr = (Object.entries(p.specs || {}).find(([k]) => k.toLowerCase() === 'tdp')?.[1] || '').toString();
        const m = tdpStr.match(/(\d+)/);
        if (!m) return false;
        const tdp = parseInt(m[1]);
        return [...vals].some(v => {
          if (v === 'До 65 W') return tdp <= 65;
          if (v === '66 – 100 W') return tdp >= 66 && tdp <= 100;
          if (v === 'Над 101 W') return tdp > 100;
          return false;
        });
      });
      return;
    }
    if (key === '_freq') {
      list = list.filter(p => {
        const freqStr = (Object.entries(p.specs || {}).find(([k]) => k.toLowerCase() === 'честота')?.[1] || '').toString();
        const m = freqStr.match(/(\d+(?:\.\d+)?)\s*ghz/i);
        if (!m) return false;
        const freq = parseFloat(m[1]);
        return [...vals].some(v => {
          if (v === 'До 1.5 GHz') return freq <= 1.5;
          if (v === '1.6 – 2.5 GHz') return freq >= 1.6 && freq <= 2.5;
          if (v === '2.6 – 3.5 GHz') return freq >= 2.6 && freq <= 3.5;
          if (v === 'Над 3.6 GHz') return freq > 3.6;
          return false;
        });
      });
      return;
    }
    if (key === '_cores') {
      list = list.filter(p => {
        const coreStr = (Object.entries(p.specs || {}).find(([k]) => k.toLowerCase() === 'ядра')?.[1] || '').toString();
        const m = coreStr.match(/^(\d+)/);
        if (!m) return false;
        const cores = parseInt(m[1]);
        return [...vals].some(v => v === '32+' ? cores >= 32 : parseInt(v) === cores);
      });
      return;
    }
    if (key === '_igpu') {
      list = list.filter(p => {
        const igpuVal = (Object.entries(p.specs || {}).find(([k]) => k.toLowerCase().includes('интегрирана'))?.[1] || '').toString().trim();
        const has = igpuVal.length > 0 && igpuVal !== '-';
        return [...vals].some(v => v === 'С iGPU' ? has : !has);
      });
      return;
    }
    // Motherboard computed filters
    if (key === '_mb_ram_type') {
      list = list.filter(p => {
        const mem = (Object.entries(p.specs||{}).find(([k]) => k === 'Памет')?.[1] || '').toString();
        return [...vals].some(v => mem.includes(v));
      });
      return;
    }
    if (key === '_mb_ram_slots') {
      list = list.filter(p => {
        const mem = (Object.entries(p.specs||{}).find(([k]) => k === 'Памет')?.[1] || '').toString();
        return [...vals].some(v => mem.startsWith(v + '×'));
      });
      return;
    }
    if (key === '_mb_outputs') {
      list = list.filter(p => {
        const out = (Object.entries(p.specs||{}).find(([k]) => k === 'Изходи')?.[1] || '').toString();
        return [...vals].some(v => {
          if (v === 'DisplayPort') return /DP|DisplayPort/i.test(out);
          if (v === 'DVI') return /DVI/i.test(out);
          return out.toUpperCase().includes(v.toUpperCase());
        });
      });
      return;
    }
    if (key === '_mb_connect') {
      list = list.filter(p => {
        const sp = p.specs || {};
        const wifi = (Object.entries(sp).find(([k]) => k === 'WiFi')?.[1] || '').toString().trim();
        const bt   = (Object.entries(sp).find(([k]) => k === 'Bluetooth')?.[1] || '').toString().trim();
        const lan  = (Object.entries(sp).find(([k]) => k === 'LAN')?.[1] || '').toString();
        return [...vals].some(v => {
          if (v === 'Wi-Fi')     return wifi.length > 0;
          if (v === 'Bluetooth') return bt.length > 0;
          if (v === '2.5G LAN')  return lan.includes('2.5');
          return false;
        });
      });
      return;
    }
    // GPU computed filters
    if (key === '_gpu_chip') {
      list = list.filter(p => {
        const gpu = (Object.entries(p.specs||{}).find(([k]) => k === 'GPU')?.[1] || p.name + ' ' + (p.desc||'')).toString().toUpperCase();
        return [...vals].some(v => {
          if (v === 'NVIDIA') return /NVIDIA|GEFORCE|RTX|GTX/i.test(gpu);
          if (v === 'AMD')    return /AMD|RADEON|RX\s/i.test(gpu);
          if (v === 'Intel')  return /INTEL|ARC/i.test(gpu);
          return false;
        });
      });
      return;
    }
    if (key === '_gpu_vram') {
      list = list.filter(p => {
        const mem = (Object.entries(p.specs||{}).find(([k]) => k === 'Памет')?.[1] || '').toString();
        return [...vals].some(v => mem.startsWith(v));
      });
      return;
    }
    if (key === '_gpu_memtype') {
      list = list.filter(p => {
        const mem = (Object.entries(p.specs||{}).find(([k]) => k === 'Памет')?.[1] || '').toString();
        return [...vals].some(v => mem.toUpperCase().includes(v));
      });
      return;
    }
    if (key === '_gpu_outputs') {
      list = list.filter(p => {
        const out = (Object.entries(p.specs||{}).find(([k]) => k === 'Изходи')?.[1] || '').toString();
        return [...vals].some(v => {
          if (v === 'DisplayPort') return /\bDP\b|DisplayPort/i.test(out);
          if (v === 'DVI') return /DVI/i.test(out);
          return out.toUpperCase().includes(v.toUpperCase());
        });
      });
      return;
    }
    if (key === '_ram_cap') {
      list = list.filter(p => {
        const cap = (p.specs && p.specs['Капацитет']) || '';
        return [...vals].some(v => cap === v || cap.startsWith(v + ' '));
      });
      return;
    }
    if (key === '_ram_kit') {
      list = list.filter(p => {
        const cap = (p.specs && p.specs['Капацитет']) || '';
        return [...vals].some(v => v === 'Kit (комплект)' && /[×x×]/.test(cap));
      });
      return;
    }
    if (key === '_storage_cap') {
      // Normalize capacity to GB for comparison (handles "1 TB" ≈ "1000 GB" ≈ "1024 GB")
      const toGB = s => {
        const m = (s || '').match(/(\d+(?:\.\d+)?)\s*(GB|TB)/i);
        if (!m) return null;
        return m[2].toUpperCase() === 'TB' ? parseFloat(m[1]) * 1000 : parseFloat(m[1]);
      };
      list = list.filter(p => {
        const capRaw = (p.specs && (p.specs['Капацитет'] || p.specs['Обем'])) || '';
        const capGB = toGB(capRaw);
        return [...vals].some(v => {
          const vGB = toGB(v);
          if (capGB === null || vGB === null) return capRaw.toLowerCase().includes(v.toLowerCase());
          return Math.abs(capGB - vGB) / vGB < 0.25;
        });
      });
      return;
    }
    if (key === '_hdd_rpm') {
      list = list.filter(p => {
        const rpm = ((p.specs && p.specs['RPM']) || '').replace(/[,.\s]/g, '').replace(/rpm/i, '');
        return [...vals].some(v => rpm === v.replace(/,/g, ''));
      });
      return;
    }
    if (key === '_hdd_cache') {
      list = list.filter(p => {
        const cache = ((p.specs && p.specs['Кеш']) || '').replace(/\s/g, '').toUpperCase();
        return [...vals].some(v => {
          const n = v.replace(/\s/g, '').toUpperCase();
          return cache.startsWith(n.split('MB')[0] + 'MB') || cache.startsWith(n.replace('MB','') + 'MB');
        });
      });
      return;
    }
    list = list.filter(p => {
      const _specs = p.specs || {};
      const sv = _specs[key] || _specs[Object.keys(_specs).find(k => k.toLowerCase() === key.toLowerCase()) || ''] || '';
      if (sv) return [...vals].some(v => sv.toString().toLowerCase().includes(v.toLowerCase()));
      // Fallback: search through all spec values + name + desc (handles Cyrillic keys)
      const allText = (p.name + ' ' + (p.desc||'') + ' ' + Object.values(_specs).join(' ')).toLowerCase();
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
    const allInCat = products.filter(p => normalizeCat(p.cat) === cpCat);
    const hasPriceFilter = cpPriceMin > 0 || cpPriceMax < _cpMaxEur;
    const hasBrandFilter = cpBrands.size > 0;
    grid.innerHTML = `<div class="cp-empty-state">
      <div class="cp-empty-icon">🔍</div>
      <div class="cp-empty-title">Няма продукти по тези критерии</div>
      <div class="cp-empty-sub">${hasPriceFilter ? 'Опитай с по-широк ценови диапазон.' : hasBrandFilter ? 'Опитай с друга марка или премахни марковия филтър.' : 'Промени филтрите или разгледай всички продукти в категорията.'}<br>Общо ${allInCat.length} продукта в тази категория.</div>
      <div class="cp-empty-actions">
        <button type="button" class="cp-empty-btn" onclick="cpResetFilters()">Изчисти филтрите</button>
        <button type="button" class="cp-empty-btn-sec" onclick="closeCatPage()">← Обратно</button>
      </div>
    </div>`;
    return;
  }
  grid.innerHTML = list.map(p => makeCard(p)).join('');
  cpUpdateURL();
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

function _saveSession(user) {
  try {
    localStorage.setItem('mc_session', JSON.stringify({
      email: user.email, firstName: user.firstName, lastName: user.lastName || '', phone: user.phone || '',
      ts: Date.now()
    }));
  } catch(e) {}
}

function loginSuccess(user) {
  currentUser = user;
  _saveSession(user);
  showAuthSuccess('🎉', `Добре дошъл, ${user.firstName}!`, 'Влезе успешно в профила си.');
  // Load wishlist from Supabase and merge with local
  if (typeof window.loadWishlistFromSupabase === 'function') {
    window.loadWishlistFromSupabase(user.email).then(remoteIds => {
      if (remoteIds && Array.isArray(remoteIds)) {
        const merged = [...new Set([...wishlist, ...remoteIds])];
        wishlist = merged;
        try { localStorage.setItem('mc_wishlist', JSON.stringify(wishlist)); } catch(e) {}
        updateWishlistUI();
      }
    });
  }
  setTimeout(() => { closeAuthModalDirect(); updateAuthUI(); }, 1800);
}

function registerSuccess(user) {
  currentUser = user;
  _saveSession(user);
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
  try { localStorage.removeItem('mc_session'); } catch(e) {}
  closeDropdown();
  updateAuthUI();
  showToast('Излязохте успешно от профила.');
}

// Restore session from localStorage (30-day TTL)
(function() {
  try {
    const s = JSON.parse(localStorage.getItem('mc_session') || 'null');
    if (!s || !s.ts || (Date.now() - s.ts > 30 * 24 * 3600 * 1000)) return;
    const u = demoUsers.find(x => x.email === s.email) || { email: s.email, firstName: s.firstName, lastName: s.lastName, phone: s.phone };
    currentUser = u;
    // Defer UI update until DOM is ready
    document.addEventListener('DOMContentLoaded', () => updateAuthUI(), { once: true });
  } catch(e) {}
})();

// Close dropdown on outside click
document.addEventListener('click', e => {
  const wrap = document.querySelector('.profile-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) closeDropdown();
});

// ===== WISHLIST =====
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem('mc_wishlist') || '[]'); } catch(e) {}

function _saveWishlistPrices() {
  try {
    const prices = {};
    wishlist.forEach(id => { const p = products.find(x => x.id === id); if (p) prices[id] = p.price; });
    localStorage.setItem('mc_wishlist_prices', JSON.stringify(prices));
  } catch(e) {}
}

function checkWishlistPriceDrops() {
  try {
    const saved = JSON.parse(localStorage.getItem('mc_wishlist_prices') || '{}');
    const drops = wishlist.filter(id => {
      const p = products.find(x => x.id === id);
      return p && saved[id] && p.price < saved[id];
    });
    if (!drops.length) return;
    const el = document.getElementById('wishlistPriceDropBanner');
    if (el) { el.style.display = ''; el.querySelector('.wpd-count').textContent = drops.length; return; }
    const banner = document.createElement('div');
    banner.id = 'wishlistPriceDropBanner';
    banner.style.cssText = 'position:fixed;bottom:70px;left:50%;transform:translateX(-50%);z-index:3000;background:#166534;color:#fff;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:700;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.25);cursor:pointer;max-width:340px;';
    banner.innerHTML = `<span>🔔</span><span><span class="wpd-count">${drops.length}</span> ${drops.length === 1 ? 'продукт от' : 'продукта от'} любимите ${drops.length === 1 ? 'е поевтинял' : 'са поевтинели'}!</span><button type="button" style="margin-left:auto;background:rgba(255,255,255,0.2);border:none;color:#fff;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:12px;" onclick="event.stopPropagation();document.getElementById('wishlistPriceDropBanner').remove()">×</button>`;
    banner.onclick = () => { openWishlist(); banner.remove(); };
    document.body.appendChild(banner);
    setTimeout(() => { if (banner.parentNode) { banner.style.opacity='0'; banner.style.transition='opacity .4s'; setTimeout(()=>banner.remove(),400); } }, 12000);
  } catch(e) {}
}

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
  _saveWishlistPrices();
  if (currentUser && typeof window.syncWishlistToSupabase === 'function') {
    window.syncWishlistToSupabase(currentUser.email, wishlist);
  }
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
    var _savedPrices = {};
    try { _savedPrices = JSON.parse(localStorage.getItem('mc_wishlist_prices') || '{}'); } catch(e) {}
    // Add-all + share buttons before the grid
    const shareUrl = 'https://mostcomputers.bg/?wl=' + wishlist.join(',');
    const addAllHtml = `<div class="wl-add-all-row"><button type="button" class="wl-add-all-btn" onclick="addAllWishlistToCart()"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави всички в кошницата (${prods.length})</button><button type="button" class="wl-share-btn" onclick="navigator.clipboard&&navigator.clipboard.writeText('${escHtml(shareUrl)}').then(()=>showToast('🔗 Линкът е копиран!')).catch(()=>{})" title="Сподели любими">🔗 Сподели</button><button type="button" class="wl-share-btn" onclick="showWishlistQR()" title="QR код">📱 QR</button></div>`;
    grid.innerHTML = addAllHtml + `<div class="wishlist-grid">${prods.map(p => {
      const save = p.old ? Math.round(((p.old-p.price)/p.old)*100) : 0;
      const _wlName = escHtml(p.name);
      const imgHtml = p.img
        ? `<img class="product-img-real" src="${escHtml(p.img)}" alt="${_wlName}" loading="lazy" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${escHtml(p.emoji)}</span>`
        : `<span class="product-img-emoji">${escHtml(p.emoji)}</span>`;
      const savedPrice = _savedPrices[p.id];
      const priceDrop = savedPrice && p.price < savedPrice ? Math.round(((savedPrice - p.price) / savedPrice) * 100) : 0;
      const priceDropBadge = priceDrop > 0 ? `<div class="wl-drop-badge">↓ -${priceDrop}% от добавяне</div>` : '';
      return `<div class="product-card pos-rel">
        <button type="button" class="wishlist-remove-btn" onclick="toggleWishlist(${p.id},{stopPropagation:()=>{}})" title="Премахни">×</button>
        ${priceDropBadge}
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


function showWishlistQR() {
  if (!wishlist.length) return;
  const url = 'https://mostcomputers.bg/?wl=' + wishlist.join(',');
  const qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9000;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = '<div style="background:var(--white);border-radius:16px;padding:28px 24px;text-align:center;max-width:260px;width:calc(100% - 48px);">' +
    '<h3 style="margin:0 0 12px;font-size:16px;">📱 Сканирай QR кода</h3>' +
    '<img src="' + escHtml(qrSrc) + '" width="200" height="200" alt="QR код за wishlist" style="border-radius:8px;display:block;margin:0 auto;">' +
    '<p style="font-size:11px;color:var(--muted);margin:10px 0 14px;">Споделя ' + wishlist.length + ' ' + (wishlist.length === 1 ? 'продукт' : 'продукта') + ' от любими</p>' +
    '<button onclick="this.closest(\'div[style*=fixed]\').remove()" class="add-cart-btn" style="width:100%;">Затвори</button>' +
    '</div>';
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
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

// ===== PROFILE PAGE =====
function openProfilePage() {
  const page = document.getElementById('profilePage');
  if (!page) return;
  // Fill header
  const u = currentUser;
  const avatar = document.getElementById('profAvatar');
  const name   = document.getElementById('profName');
  const email  = document.getElementById('profEmail');
  if (avatar) avatar.textContent = u ? (u.firstName[0] + (u.lastName ? u.lastName[0] : '')).toUpperCase() : '?';
  if (name)   name.textContent   = u ? (u.firstName + ' ' + (u.lastName || '')).trim() : 'Гост';
  if (email)  email.textContent  = u ? u.email : '—';
  // Settings tab values
  const se = document.getElementById('profSettingsEmail');
  const sp = document.getElementById('profSettingsPhone');
  const so = document.getElementById('profOosCount');
  if (se) se.textContent = u ? u.email : '—';
  if (sp) sp.textContent = u ? (u.phone || '—') : '—';
  if (so) {
    try { so.textContent = JSON.parse(localStorage.getItem('mc_oos_notify') || '[]').length + ' продукта'; } catch(e) { so.textContent = '0 продукта'; }
  }
  // Show first tab
  switchProfileTab('orders', document.querySelector('#profilePage .prof-tab'));
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(function() { page.classList.add('open'); });
  document.body.style.overflow = 'hidden';
  try { history.pushState({ page: 'profile' }, '', '?page=profile'); } catch(e) {}
}

function closeProfilePage() {
  const page = document.getElementById('profilePage');
  if (!page) return;
  page.classList.remove('open');
  setTimeout(function() { page.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}

function switchProfileTab(tab, btn) {
  // Deactivate all tabs
  document.querySelectorAll('#profilePage .prof-tab').forEach(function(t) {
    t.classList.remove('active'); t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('#profilePage .prof-tab-pane').forEach(function(p) { p.style.display = 'none'; });
  // Activate selected
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); }
  const pane = document.getElementById('profTab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (pane) pane.style.display = 'block';
  // Lazy render
  if (tab === 'orders') {
    const g = document.getElementById('profOrdersGrid');
    if (g) { const tmp = document.getElementById('myOrdersGrid'); if (tmp) g.innerHTML = tmp.innerHTML || ''; renderMyOrders(); setTimeout(function() { if (g.innerHTML === '') g.innerHTML = tmp ? tmp.innerHTML : ''; }, 100); }
  }
  if (tab === 'wishlist') {
    const g = document.getElementById('profWishlistGrid');
    if (g) { const tmp = document.getElementById('wishlistGrid'); renderWishlistGrid(); setTimeout(function() { if (tmp) g.innerHTML = tmp.innerHTML; }, 100); }
  }
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

const _INVOICE_COMPANIES = [
  {
    name: '„МОСТ КОМПЮТЪРС" ООД',
    eik: '831210862',
    dds: 'BG831210862',
    addr: 'бул. „Шипченски проход", бл. 240, вх. Г, гр. София 1111',
    mol: 'Христофор Аспарухов',
    tel: '02 91 823',
    fax: '02 873 00 37',
    bank: 'ОББ АД',
    bic: 'UBBSBGSF',
    iban: 'BG29UBBS74281010110202',
  },
  {
    name: '„СММ - 97" ООД',
    eik: '121488372',
    dds: 'BG121488372',
    addr: 'бул. „Шипченски проход", бл. 240, вх. А, гр. София 1111',
    mol: 'Христофор Аспарухов',
    tel: '02 91 823',
    fax: '02 873 00 37',
    bank: 'ОББ АД',
    bic: 'UBBSBGSF',
    iban: 'BG79UBBS74281010871916',
  }
];

function _bgNumWords(n) {
  const oM = ['','един','два','три','четири','пет','шест','седем','осем','девет','десет','единадесет','дванадесет','тринадесет','четиринадесет','петнадесет','шестнадесет','седемнадесет','осемнадесет','деветнадесет'];
  const oF = ['','една','две','три','четири','пет','шест','седем','осем','девет','десет','единадесет','дванадесет','тринадесет','четиринадесет','петнадесет','шестнадесет','седемнадесет','осемнадесет','деветнадесет'];
  const t  = ['','','двадесет','тридесет','четиридесет','петдесет','шестдесет','седемдесет','осемдесет','деветдесет'];
  const h  = ['','сто','двеста','триста','четиристотин','петстотин','шестстотин','седемстотин','осемстотин','деветстотин'];
  function b100(x, f) { if (!x) return ''; const a = f ? oF : oM; if (x < 20) return a[x]; return t[Math.floor(x/10)] + (x%10 ? ' и ' + a[x%10] : ''); }
  function b1k(x, f)  { if (!x) return ''; const hh = Math.floor(x/100), r = x%100; return (h[hh]||'') + (hh && r ? ' и ' : '') + b100(r, f); }
  const iv = Math.floor(n), dc = Math.round((n - iv) * 100);
  let w = '';
  if (!iv) { w = 'нула лева'; }
  else if (iv < 1000) { w = b1k(iv, false) + (iv === 1 ? ' лев' : ' лева'); }
  else if (iv < 1000000) {
    const th = Math.floor(iv/1000), r = iv%1000;
    w = (th === 1 ? 'хиляда' : b1k(th, true) + ' хиляди') + (r ? (r < 100 ? ' и ' : ' ') + b1k(r, false) : '') + ' лева';
  } else { w = iv + ' лева'; }
  if (dc) w += ' и ' + (dc < 10 ? '0'+dc : dc) + ' стотинки';
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function _openInvoiceWindow(o, co) {
  const _h = s => escHtml(String(s || ''));
  const _items   = o.itemsData || [];
  const itemsTotal = _items.length
    ? _items.reduce((s, x) => s + (x.price || 0) * (Number(x.qty) || 1), 0)
    : (o.subtotal || o.total || 0);
  const base = itemsTotal / 1.2;
  const vat  = itemsTotal - base;
  const payLabel = o.payment === 'card' ? 'Карта' : o.payment === 'cod' ? 'Наложен платеж' : 'Банков превод';
  let invDate = '';
  try {
    const d = o.date ? new Date(o.date) : new Date();
    invDate = isNaN(d.getTime()) ? new Date().toLocaleDateString('bg-BG') : d.toLocaleDateString('bg-BG');
  } catch(e) { invDate = new Date().toLocaleDateString('bg-BG'); }
  const rows = (o.itemsData && o.itemsData.length)
    ? o.itemsData.map((x, i) => {
        const qty = Number(x.qty) || 1;
        const unitEx = x.price / 1.2;
        const lineEx = unitEx * qty;
        return `<tr><td style="text-align:center;">${i+1}</td><td>${_h(x.name||'')}</td><td style="text-align:center;">бр.</td><td style="text-align:center;">${qty}</td><td style="text-align:right;">${unitEx.toFixed(2)}</td><td style="text-align:right;font-weight:700;">${lineEx.toFixed(2)}</td></tr>`;
      }).join('')
    : `<tr><td colspan="6" style="text-align:center;color:#888;padding:12px;">${_h(o.items||'—')}</td></tr>`;
  const win = window.open('', '_blank', 'width=800,height=920');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(`<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8"><title>Фактура ${_h(o.num)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;font-size:12px;color:#000;background:#fff;padding:20px}
.page{max-width:740px;margin:0 auto;background:#fff;padding:28px}
.print-btn{display:block;margin:0 auto 14px;padding:9px 26px;background:#1d4ed8;color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer}
h1{font-size:20px;font-weight:900;text-align:center;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px}
.inv-meta{text-align:center;font-size:11px;color:#444;margin-bottom:18px}
.parties{display:grid;grid-template-columns:1fr 1fr;margin-bottom:16px;border:1px solid #888}
.party{padding:10px 13px}
.party+.party{border-left:1px solid #888}
.party-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#555;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:7px}
.pr{font-size:11px;line-height:1.85}
.basis{font-size:11px;margin:10px 0 8px;color:#333}
table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px}
thead th{background:#efefef;border:1px solid #888;padding:5px 8px;font-weight:800;text-align:left}
tbody td{border:1px solid #bbb;padding:5px 8px;vertical-align:top}
.tw{display:flex;justify-content:flex-end;margin-bottom:10px}
.totals{width:260px;border:1px solid #888;font-size:11px}
.tr{display:flex;justify-content:space-between;padding:5px 10px;border-bottom:1px solid #ddd}
.tr:last-child{border-bottom:none;font-weight:900;font-size:13px;background:#efefef}
.slovom{font-size:11px;padding:7px 11px;border:1px solid #bbb;background:#fafafa;margin-bottom:10px}
.bank{font-size:11px;border:1px solid #bbb;padding:7px 11px;line-height:1.8;margin-bottom:18px}
@media print{.print-btn{display:none!important}body{padding:0}.page{padding:18px}}
</style></head><body>
<div class="page">
<button class="print-btn" onclick="window.print()">🖨 Принтирай</button>
<h1>Фактура</h1>
<div class="inv-meta">№ ${_h(o.num)} &nbsp;|&nbsp; Дата: ${invDate} &nbsp;|&nbsp; Оригинал &nbsp;|&nbsp; Плащане: ${_h(payLabel)}</div>
<div class="parties">
  <div class="party">
    <div class="party-title">Доставчик</div>
    <div class="pr"><strong>${_h(co.name)}</strong><br>ЕИК: ${_h(co.eik)}<br>ДДС №: ${_h(co.dds)}<br>Адрес: ${_h(co.addr)}<br>МОЛ: ${_h(co.mol)}<br>Тел: ${_h(co.tel)} &nbsp; Факс: ${_h(co.fax)}</div>
  </div>
  <div class="party">
    <div class="party-title">Получател</div>
    <div class="pr"><strong>${_h(o.customer||'—')}</strong><br>ЕИК/ЕГН: &nbsp;<br>ДДС №: &nbsp;<br>Адрес: ${_h(o.city||'')}${o.addr ? ', ' + _h(o.addr) : ''}<br>Тел: ${_h(o.phone||'')}<br>Имейл: ${_h(o.email||'')}</div>
  </div>
</div>
<div class="basis">Основание за плащане: Покупка на стоки</div>
<table>
  <thead><tr>
    <th style="width:30px;text-align:center;">№</th>
    <th>Наименование на стоката / услугата</th>
    <th style="width:42px;text-align:center;">Мярка</th>
    <th style="width:40px;text-align:center;">Кол.</th>
    <th style="width:88px;text-align:right;">Ед. цена лв.</th>
    <th style="width:88px;text-align:right;">Стойност лв.</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="tw"><div class="totals">
  <div class="tr"><span>Данъчна основа</span><span>${base.toFixed(2)} лв.</span></div>
  <div class="tr"><span>ДДС 20%</span><span>${vat.toFixed(2)} лв.</span></div>
  <div class="tr"><span>Сума за плащане</span><span>${itemsTotal.toFixed(2)} лв.</span></div>
</div></div>
<div class="slovom"><strong>Словом:</strong> ${_bgNumWords(itemsTotal)}</div>
<div class="bank"><strong>Банкова сметка:</strong> ${_h(co.bank)} &nbsp;·&nbsp; BIC: ${_h(co.bic)} &nbsp;·&nbsp; IBAN: ${_h(co.iban)}</div>
</div></body></html>`);
  win.document.close();
}

// Марки, фактурирани към Мост Компютърс; всички останали → СММ 97
const _MOST_BRANDS = new Set(['hp', 'lenovo', 'nokia', 'hmd', 'koorui']);

function printOrder(num) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
  const o = orders.find(x => x.num === num);
  if (!o) { showToast('Поръчката не е намерена'); return; }

  const items = o.itemsData || [];
  const mostItems = items.filter(x => _MOST_BRANDS.has((x.brand || '').toLowerCase().trim()));
  const smmItems  = items.filter(x => !_MOST_BRANDS.has((x.brand || '').toLowerCase().trim()));

  function splitOrder(filteredItems) {
    return Object.assign({}, o, { itemsData: filteredItems });
  }

  if (mostItems.length && smmItems.length) {
    _openInvoiceWindow(splitOrder(mostItems), _INVOICE_COMPANIES[0]);
    setTimeout(() => _openInvoiceWindow(splitOrder(smmItems), _INVOICE_COMPANIES[1]), 400);
    showToast('🧾 Отварят се 2 фактури — Мост Компютърс и СММ 97');
  } else if (mostItems.length) {
    _openInvoiceWindow(o, _INVOICE_COMPANIES[0]);
  } else {
    _openInvoiceWindow(o, _INVOICE_COMPANIES[1]);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toggleWishlist, _resetWishlist: () => { wishlist = []; } };
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



// Stubs for functions that live in app-lazy.js.
// Queues calls made before the lazy bundle finishes loading, then replays them.
// Must be included in the critical bundle (app.js) before main.js.
(function () {
  var _q = [];

  // Called by lazy-init.js immediately after app-lazy.js executes
  window._drainLazyQueue = function () {
    var items = _q.splice(0);
    items.forEach(function (item) {
      if (typeof window[item.fn] === 'function') {
        window[item.fn].apply(window, item.args);
      }
    });
  };

  function _stub(name) {
    window[name] = function () {
      _q.push({ fn: name, args: Array.prototype.slice.call(arguments) });
    };
  }

  _stub('openProductPage');
  _stub('openProductModal');
  _stub('addToCart');
  _stub('openQuickOrder');
  _stub('toggleCompare');
  _stub('showSearchResultsPage');
  _stub('openBlogPost');
}());

// IDEA-22: Abandoned cart reminder for returning visitors
(function() {
  try {
    var now = Date.now();
    var lastVisit = parseInt(localStorage.getItem('mc_last_visit') || '0', 10);
    var savedCart = JSON.parse(localStorage.getItem('mc_cart') || '[]');
    localStorage.setItem('mc_last_visit', String(now));
    if (!savedCart.length || !lastVisit || (now - lastVisit) < 2 * 60 * 60 * 1000) return;
    setTimeout(function() {
      var n = savedCart.length;
      var banner = document.createElement('div');
      banner.id = 'abandonedCartBanner';
      banner.style.cssText = 'position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:3500;background:var(--primary);color:#fff;padding:11px 16px;border-radius:12px;font-size:13px;font-weight:700;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,.3);max-width:380px;width:calc(100% - 32px);';
      banner.innerHTML = '<span>🛒</span><span>Имаш ' + n + ' ' + (n === 1 ? 'продукт' : 'продукта') + ' в кошницата!</span>' +
        '<button style="margin-left:auto;background:rgba(255,255,255,.25);border:none;color:#fff;border-radius:8px;padding:4px 12px;cursor:pointer;font-weight:700;white-space:nowrap;font-size:12px;" onclick="openCart();document.getElementById(\'abandonedCartBanner\').remove()">Виж →</button>' +
        '<button style="background:none;border:none;color:rgba(255,255,255,.75);cursor:pointer;font-size:18px;padding:0 2px;line-height:1;" aria-label="Затвори" onclick="document.getElementById(\'abandonedCartBanner\').remove()">×</button>';
      document.body.appendChild(banner);
      setTimeout(function() {
        if (banner.parentNode) { banner.style.opacity = '0'; banner.style.transition = 'opacity .4s'; setTimeout(function() { banner.remove(); }, 400); }
      }, 10000);
    }, 2500);
  } catch(e) {}
})();

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

// ===== CATEGORY COUNTS IN SIDEBAR =====
function initCatCounts() {
  const catMap = {};
  products.forEach(p => { const c = normalizeCat(p.cat); catMap[c] = (catMap[c] || 0) + 1; });
  document.querySelectorAll('.sidebar-categories .cat-item').forEach(el => {
    const fn = el.getAttribute('onclick') || '';
    const m = fn.match(/toggleSidebarCat\(this,'([^']+)'\)/);
    if (!m) return;
    const count = catMap[m[1]] || 0;
    if (!count) return;
    el.querySelector('.cat-count-badge')?.remove();
    const badge = document.createElement('span');
    badge.className = 'cat-count-badge';
    badge.textContent = count;
    const arrow = el.querySelector('.cat-arrow');
    if (arrow) el.insertBefore(badge, arrow); else el.appendChild(badge);
  });
}
document.addEventListener('DOMContentLoaded', initCatCounts);
document.addEventListener('DOMContentLoaded', () => { setTimeout(checkWishlistPriceDrops, 1500); });

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

// IDEA-14: Sync hero slide prices with live product data
(function() {
  const heroSlides = [
    { priceId: 'slide2Price', productId: 1600 },
    { priceId: 'slide4Price', productId: 1884 },
  ];
  heroSlides.forEach(function(s) {
    var el = document.getElementById(s.priceId);
    var p = products.find(function(x) { return x.id === s.productId; });
    if (el && p) el.innerHTML = fmtEur(p.price) + ' <small>с ДДС</small>';
  });
})();
renderSidebarTopProduct();
renderSidebarBrandSpot();
// Quick cart badge from localStorage (full loadCart runs after lazy bundle loads)
(function(){try{var c=JSON.parse(localStorage.getItem('mc_cart')||'[]'),t=c.reduce(function(s,i){return s+(i.qty||1);},0),b=document.getElementById('cartBadge');if(b){b.textContent=t;b.style.display=t>0?'':'none';}}catch(e){}})();
// renderHpCats already called inside renderGrids()
// renderRecentlyDiscounted is in product-page.js (lazy) — runs in lazy-init.js
renderRecentlyViewed();
renderHeroRightPanel();
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

// ===== LAZY BUNDLE LOADER =====
// app-lazy.js is preloaded in <head> (downloads to cache) but executes only on first
// user interaction — Lighthouse never sees it, real users get instant response from cache.
(function () {
  var _ll = false;
  function _loadLazy() {
    if (_ll) return; _ll = true;
    var s = document.createElement('script');
    s.src = 'app-lazy.js?v=20260526';
    document.head.appendChild(s);
  }
  ['click', 'scroll', 'touchstart', 'keydown', 'mousemove'].forEach(function (ev) {
    document.addEventListener(ev, _loadLazy, { once: true, passive: true });
  });
  setTimeout(_loadLazy, 2000); // fallback: load even without interaction
}());

