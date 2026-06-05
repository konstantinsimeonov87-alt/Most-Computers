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
    audio:'audio',       аудио:'audio',       headphones:'audio',       слушалки:'audio',       camera:'cameras',  cameras:'cameras',  камери:'cameras',  peripherals:'peripherals',
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
    currentFilter==='promo'? (typeof promoProducts!=='undefined'?[...promoProducts]:[]) :
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
  if (!grid) return;
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

function initNewPeriodChips() {
  const wrap = document.getElementById('newPeriodChips');
  if (!wrap || wrap.dataset.init) return;
  wrap.dataset.init = '1';
  wrap.addEventListener('click', e => {
    const chip = e.target.closest('.npc-chip');
    if (!chip) return;
    wrap.querySelectorAll('.npc-chip').forEach(c => c.classList.remove('npc-active'));
    chip.classList.add('npc-active');
    window._newPeriodDays = +chip.dataset.days;
    renderNewGrid(window._newPeriodDays);
  });
}

function renderGrids(){
  const _inStock = p => p.stock !== false;
  const _flashAll=[...products].filter(p=>_inStock(p)&&p.old&&p.pct>0);
  for(let i=_flashAll.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[_flashAll[i],_flashAll[j]]=[_flashAll[j],_flashAll[i]];}
  const _flashProds=_flashAll.slice(0,4);
  const flashSection=document.getElementById('sale');
  if(flashSection) flashSection.style.display=_flashProds.length?'':'none';
  const fg=document.getElementById('flashGrid');
  if(fg){
    fg.innerHTML=_flashProds.map(p=>makeCard(p,true)).join('');
    fg.className='products-row';
  }
  renderTopGrid();
  // Bestsellers grid - top rated products not tied to discounts
  const bg=document.getElementById('bestsellersGrid');
  if(bg){
    const _best=[...products].filter(p=>_inStock(p)).sort((a,b)=>(b.rating*Math.log1p(b.rv||1))-(a.rating*Math.log1p(a.rv||1))).slice(0,5);
    bg.innerHTML=_best.map(p=>makeCard(p,true)).join('');
    bg.className='products-row cols'+Math.min(_best.length,5);
    const bs=document.getElementById('bestsellersSection');
    if(bs) bs.style.display=_best.length?'':'none';
  }
  // Slide 1 - cheapest flash-sale product
  const _s1Prods = [...products].filter(p=>_inStock(p)&&p.old&&p.pct>0).sort((a,b)=>a.price-b.price);
  const _s1el = document.getElementById('slide1Price');
  if(_s1Prods.length && _s1el) {
    const _s1min = _s1Prods[0], _s1max = _s1Prods[_s1Prods.length-1];
    _s1el.innerHTML = `от <b>${(_s1min.price/EUR_RATE).toFixed(2)} €</b> / ${fmtBgn(_s1min.price)} <small>вместо ${(_s1min.old/EUR_RATE).toFixed(2)} € / ${fmtBgn(_s1min.old)}</small>`;
  }
  // Slide 2 - sync price from products array (id:1600 = MSI Katana 15)
  const _s2 = products.find(p=>p.id===1600);
  const _s2el = document.getElementById('slide2Price');
  if(_s2 && _s2el) _s2el.innerHTML = `${(_s2.price/EUR_RATE).toFixed(2)} € / ${fmtBgn(_s2.price)} <small>с ДДС</small>`;
  // Slide 3 - max savings from flash-sale products
  const _s3el = document.querySelector('.slide-3 .slide-price');
  if(_s3el && _s1Prods.length) {
    const _maxSave = _s1Prods.reduce((mx,p)=>Math.max(mx,p.old-p.price),0);
    if(_maxSave>0) _s3el.innerHTML = `Спести до <b>${(_maxSave/EUR_RATE).toFixed(2)} €</b> / ${fmtBgn(_maxSave)}`;
  }
  // Slide 4 - sync price from products array (id:1884 = Lenovo Legion Pro 7 RTX 5090)
  const _s4 = products.find(p=>p.id===1884);
  const _s4el = document.getElementById('slide4Price');
  if(_s4 && _s4el) _s4el.innerHTML = `${(_s4.price/EUR_RATE).toFixed(2)} € / ${_s4.price} лв. <small>с ДДС</small>`;
  renderNewGrid(window._newPeriodDays || 14);
  initNewPeriodChips();
  // Promo strip - update free delivery threshold with current EUR rate
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
  if(srpVals) srpVals.textContent=fmtEur(minV)+' - '+fmtEur(maxV);
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
  const _catLabels = { phones:'📱 Телефони', laptops:'💻 Лаптопи', desktops:'🖥 Настолни', gaming:'🎮 Гейминг', monitors:'🖥 Монитори', components:'⚙️ Компоненти', peripherals:'🖱 Периферия', network:'📡 Мрежово', storage:'💾 Памет и съхранение', software:'📀 Софтуер', accessories:'🎒 Аксесоари', printers:'🖨 Принтери', ups:'⚡ UPS устройства', consumables:'🖨️ Консумативи' };
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
      label + ' | Most Computers',
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

// syncFiltersToUrl е псевдоним на updateURL() - дефинирана по-долу в файла
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
  if (vals) vals.textContent = `${minV} € - ${maxV} €`;

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
  if (vals) vals.textContent = minEur === 0 && maxEur >= _sbPriceAbsMax ? 'Всички цени' : `${minEur} € - ${maxEur} €`;

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
  promo: [
    { id: 'phones',      label: 'Смартфони' },
    { id: 'laptops',     label: 'Лаптопи' },
    { id: 'gpu',         label: 'Видео карти' },
    { id: 'monitors',    label: 'Монитори' },
    { id: 'components',  label: 'Компоненти' },
    { id: 'printers',    label: 'Принтери' },
    { id: 'network',     label: 'Мрежа' },
  ],
  phones: [
    { id: 'smartphone',   label: '📱 Смартфони' },
    { id: 'tablet',       label: '📟 Таблети' },
  ],
  laptops: [
    { id: 'gaming',      label: '🎮 Геймърски' },
    { id: 'ultrabook',   label: '✈ Ултрабуци' },
    { id: 'business',    label: '💼 Бизнес' },
    { id: 'convertible', label: '🔄 2-в-1' },
    { id: 'budget',      label: '💰 Бюджетни' },
  ],
  desktops: [
    { id: 'office_pc',    label: '💼 Офис компютри' },
    { id: 'workstation',  label: '🔬 Workstation' },
    { id: 'aio',          label: '🖥 All-in-One' },
  ],
  gaming: [
    { id: 'gaming_laptop_s', label: '💻 Геймърски лаптопи' },
    { id: 'gaming_pc_s',     label: '🖥 Геймърски конфигурации' },
    { id: 'gaming_mouse',    label: '🖱 Геймърски мишки' },
    { id: 'gaming_kb',       label: '⌨ Геймърски клавиатури' },
    { id: 'gaming_headset',  label: '🎧 Геймърски слушалки' },
  ],
  monitors: [
    { id: 'gaming_mon',   label: '🎮 Gaming' },
    { id: 'qhd_mon',      label: '🔲 QHD / 2K' },
    { id: 'ultrawide',    label: '↔️ UltraWide' },
    { id: 'oled_mon',     label: '✨ OLED & QLED' },
    { id: 'curved_mon',   label: '🔄 Curved' },
    { id: 'office_mon',   label: '💼 Офис' },
    { id: 'tv',           label: '📺 Телевизори' },
  ],
  components: [
    { id: 'cpu',         label: '⚙ Процесори' },
    { id: 'gpu',         label: '🎮 Видео карти' },
    { id: 'ram',         label: '🧠 RAM памет' },
    { id: 'ssd_hdd',     label: '💿 SSD / HDD дискове' },
    { id: 'motherboard', label: '🔩 Дънни платки' },
    { id: 'psu',         label: '⚡ Захранвания' },
    { id: 'case',        label: '🗄 Кутии' },
    { id: 'cooling',     label: '❄ Охлаждане' },
  ],
  peripherals: [
    { id: 'keyboard',     label: '⌨ Клавиатури' },
    { id: 'mouse',        label: '🖱 Мишки' },
    { id: 'webcam',       label: '📷 Уеб камери' },
  ],
  cameras: [
    { id: 'cam_indoor',   label: '🏠 За закрито' },
    { id: 'cam_outdoor',  label: '🌧 За открито' },
    { id: 'cam_poe',      label: '🔌 POE камери' },
  ],
  audio: [
    { id: 'hp_gaming',    label: '🎮 Gaming' },
    { id: 'hp_wireless',  label: '📡 Bluetooth / Безжични' },
    { id: 'hp_inear',     label: '🎧 Тапи' },
    { id: 'hp_office',    label: '💼 Офис' },
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
    { id: 'ext_drive',    label: 'Външни дискове' },
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
  ],
  laptops: [
    { title: 'Геймърски', id: 'gaming', items: ['ASUS ROG', 'ASUS TUF Gaming', 'Lenovo Legion', 'MSI Katana', 'Acer Nitro', 'Acer Predator'] },
    { title: 'Ултрабуци', id: 'ultrabook', items: ['ASUS ZenBook', 'MSI Prestige', 'Lenovo IdeaPad Slim', 'Acer Swift'] },
    { title: 'Бизнес', id: 'business', items: ['ASUS ExpertBook', 'Lenovo ThinkBook', 'MSI Modern', 'Acer TravelMate'] },
    { title: '2-в-1 и Бюджетни', id: 'convertible', items: ['2-в-1 лаптопи', 'Бюджетни лаптопи'] },
  ],
  desktops: [
    { title: 'Офис и Workstation', id: 'office_pc', items: ['Офис компютри', 'Workstation', 'All-in-One'] },
  ],
  gaming: [
    { title: 'Геймърски лаптопи', id: 'gaming_laptop_s', items: ['ASUS ROG', 'Razer Blade', 'MSI Titan', 'Lenovo Legion'] },
    { title: 'Геймърски PC', id: 'gaming_pc_s', items: ['RTX 4070', 'RTX 4080 / 4090', 'AMD Radeon RX 7000', 'Готови конфигурации'] },
    { title: 'Периферия', id: 'gaming_mouse', items: ['Геймърски мишки', 'Механични клавиатури', 'Геймърски слушалки'] },
  ],
  monitors: [
    { title: 'Gaming монитори', id: 'gaming_mon', items: ['144Hz+', '165Hz', '240Hz', '360Hz', 'G-Sync / FreeSync', 'HDR'] },
    { title: 'QHD / 2K', id: 'qhd_mon', items: ['QHD 27"', 'QHD 32"', 'QHD IPS', 'QHD VA', 'WQHD'] },
    { title: 'OLED & QLED', id: 'oled_mon', items: ['OLED монитори', 'QLED монитори', 'UltraWide OLED', '4K OLED', 'HDR'] },
    { title: 'Телевизори', id: 'tv', items: ['Smart TV 24-27"', 'Smart TV 32"', 'Smart TV 40-55"', '4K UHD TV'] },
  ],
  components: [
    { title: 'Процесори', id: 'cpu', items: ['Intel Core i5/i7/i9', 'Intel Core Ultra', 'AMD Ryzen 5/7/9', 'AMD Threadripper'] },
    { title: 'Видео карти', id: 'gpu', items: ['GeForce RTX 40 серия', 'Radeon RX 7000 серия', 'Работни карти'] },
    { title: 'Памет', id: 'ram', items: ['DDR5 RAM', 'DDR4 RAM', 'SO-DIMM лаптоп'] },
    { title: 'Дискове', id: 'ssd_hdd', items: ['SSD M.2 NVMe', 'SSD SATA', 'HDD 2.5"', 'HDD 3.5"'] },
    { title: 'Дъно и корпус', id: 'motherboard', items: ['Intel LGA1851', 'Intel LGA1700', 'AMD AM5', 'AMD AM4', 'Захранвания', 'Кутии'] },
  ],
  peripherals: [
    { title: 'Клавиатури', id: 'keyboard', items: ['Механични клавиатури', 'Офис клавиатури', 'Безжични клавиатури', 'Геймпадове'] },
    { title: 'Мишки', id: 'mouse', items: ['Геймърски мишки', 'Офис мишки', 'Ергономични', 'Trackpad'] },
    { title: 'Уеб камери', id: 'webcam', items: ['Full HD камери', '4K камери', 'С микрофон', 'За стрийминг'] },
  ],
  audio: [
    { title: 'Gaming слушалки', id: 'hp_gaming', items: ['7.1 Surround', 'RGB слушалки', 'Геймърски headset', 'USB слушалки'] },
    { title: 'Bluetooth / Безжични', id: 'hp_wireless', items: ['Over-ear', 'On-ear', 'Noise Cancelling', 'Безжични слушалки'] },
    { title: 'Тапи и In-ear', id: 'hp_inear', items: ['TWS слушалки', 'In-ear тапи', 'Bluetooth тапи', 'Кабелни тапи'] },
    { title: 'Офис headset', id: 'hp_office', items: ['USB headset', '3.5mm headset', 'С микрофон', 'За конферентни разговори'] },
  ],
  cameras: [
    { title: 'За закрито', id: 'cam_indoor',  items: ['Pan/Tilt камери', 'Smart Home', '1080p', '2K / 3MP'] },
    { title: 'За открито', id: 'cam_outdoor', items: ['Outdoor Wi-Fi', 'С нощно виждане', 'IP66 защита', 'Двойна леща'] },
    { title: 'POE камери', id: 'cam_poe',     items: ['4MP POE', 'Full Color нощен режим', 'IP66 защита'] },
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
    { title: 'Външни дискове', id: 'ext_drive', items: ['Портативни SSD', 'Портативни HDD', 'Kingston XS2000', 'Seagate One Touch'] },
    { title: 'Флаш памет', id: 'usb_flash', items: ['USB флашки', 'USB-C флашки', 'Dual OTG флашки'] },
    { title: 'Карти с памет', id: 'microsd', items: ['microSD карти', 'SD карти', 'CF карти', 'Четци за карти'] },
  ],
  ups: [
    { title: 'Домашни UPS', id: 'ups_home', items: ['До 800VA', 'Fortron Nano', 'Fortron FP серия', 'Inform Guardian', 'Hikvision DS-UPS'] },
    { title: 'Офис UPS', id: 'ups_office', items: ['1-2 KVA', 'AVR защита', 'С USB мониторинг', 'Repotec', 'Fortron IFP'] },
    { title: 'Сървърни / Онлайн', id: 'ups_server', items: ['Чиста синусоида', 'Онлайн double-conversion', 'Inform Sinus', 'Fortron Champ', 'Tuncmatik PowerUp'] },
    { title: 'Резервни батерии', id: 'ups_battery', items: ['12V/7Ah', '12V/9Ah', '12V/12Ah', '12V/18Ah', 'Sunlight', 'Fortron'] },
  ],
  accessories: [
    { title: 'Проектори', id: 'projector', items: ['Full HD проектори', '4K проектори', 'Лазерни проектори', 'Мини проектори', 'Бизнес проектори'] },
    { title: 'Смарт устройства', id: 'smart_dev', items: ['Фитнес тракери', 'Смарт говорители', 'Смарт лампи', 'Умен дом'] },
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
    { key: '_phone_brand', label: '🏷 Производител',          values: ['Nokia','HMD','Realme','Samsung','Xiaomi','Asus'] },
    { key: 'ОС',           label: '📱 Операционна система',   values: ['Android','S30+','KaiOS'] },
    { key: 'Мрежа',        label: '📡 Мрежа',                 values: ['5G','4G'] },
    { key: 'RAM',          label: '🧠 RAM',                   values: ['4 GB','6 GB','8 GB','12 GB'] },
    { key: 'Памет',        label: '💾 Вградена памет',        values: ['64 GB','128 GB','256 GB'] },
  ],
  gaming: [
    { key: 'Type',  label: '📦 Тип',                    values: ['Лаптоп','Настолен','Мишка','Клавиатура','Слушалки'] },
    { key: 'GPU',   label: '🎮 Видео карта',            values: ['RTX 4060','RTX 4070','RTX 4080','RTX 4090','RX 7900'] },
    { key: 'RAM',   label: '🧠 Оперативна памет',       values: ['16 GB','32 GB','64 GB'] },
  ],
  monitors: [
    { key: '_monitor_brand',     label: '🏷 Производител',    values: ['Acer','LG','Lenovo','MSI','Asus','Koorui','ASRock','Thomson'] },
    { key: '_monitor_panel',     label: '🖥 Тип панел',        values: ['IPS','VA','OLED','TN','Nano IPS','QLED'] },
    { key: '_monitor_res',       label: '🔍 Резолюция',        values: ['FHD 1920×1080','QHD 2560×1440','4K 3840×2160','WUXGA 1920×1200','UltraWide'] },
    { key: '_monitor_hz',        label: '⚡ Честота',          values: ['60Hz','75Hz','100Hz','120Hz','144Hz','165Hz','180Hz','200Hz','240Hz','360Hz'] },
    { key: '_monitor_size',      label: '📐 Диагонал',         values: ['До 19"','21"–23"','23"–25"','25"–27"','27"–29"','Над 29"'] },
    { key: '_monitor_gaming',    label: '🎮 Gaming функции',   values: ['FreeSync','G-Sync','HDR','Curved'] },
    { key: '_monitor_interface', label: '🔌 Интерфейси',       values: ['HDMI','DisplayPort','USB-C'] },
    { key: '_monitor_stand',     label: '🔧 Стойка',           values: ['Pivot','Swivel'] },
  ],
  laptops: [
    { key: '_laptop_brand',   label: '🏷 Производител',           values: ['Lenovo','Asus','Acer','MSI'] },
    { key: '_laptop_cpu',     label: '💻 Процесор',               values: ['Core i3','Core i5','Core i7','Core i9','Core Ultra 5','Core Ultra 7','Core Ultra 9','Ryzen 5','Ryzen 7','Ryzen 9','AMD Athlon'] },
    { key: '_laptop_ram',     label: '🧠 RAM памет',              values: ['8 GB','12 GB','16 GB','24 GB','32 GB','64 GB'] },
    { key: '_laptop_ssd',     label: '💾 SSD',                    values: ['256 GB','512 GB','1 TB','2 TB'] },
    { key: '_laptop_screen',  label: '📐 Диагонал',               values: ['13"','14"','15.6"','16"','17"'] },
    { key: '_laptop_display', label: '🖥 Тип дисплей',            values: ['IPS','OLED','VA'] },
    { key: '_laptop_gpu',     label: '🎮 Видео карта',            values: ['RTX 50','RTX 40','RTX 30','GTX','AMD Radeon RX','Интегрирана'] },
    { key: '_laptop_os',      label: '🪟 Операционна система',    values: ['Windows 11','Free DOS / Linux'] },
    { key: '_laptop_weight',  label: '⚖ Тегло',                  values: ['До 1.5 кг','1.5 – 2 кг','Над 2 кг'] },
    { key: '_laptop_hz',      label: '🔄 Честота на опресняване', values: ['60 Hz','120 Hz','144 Hz','165+ Hz'] },
  ],
  desktops: [
    { key: '_desktop_brand', label: '🏷 Производител',        values: ['Lenovo','MSI','Asus'] },
    { key: '_desktop_cpu',   label: '💻 Процесор',            values: ['Core i3','Core i5','Core i7','Core i9','Core Ultra 7','Core Ultra 9','Ryzen 5','Ryzen 7','Ryzen 9'] },
    { key: '_desktop_ram',   label: '🧠 Оперативна памет',    values: ['8 GB','16 GB','32 GB','64 GB'] },
    { key: '_desktop_ssd',   label: '💾 SSD',                 values: ['256 GB','512 GB','1 TB','2 TB'] },
    { key: '_desktop_gpu',   label: '🎮 Видео карта',         values: ['RTX 50','RTX 40','Интегрирана'] },
    { key: '_desktop_os',    label: '🪟 Операционна система', values: ['Windows 11','Без OS'] },
  ],
  components: [
    { key: 'Тип',      label: '📦 Тип компонент',     values: ['Процесор','Видеокарта','Дънна платка','RAM','SSD NVMe','HDD','Захранване','Кутия','Охлаждане'] },
    { key: 'Brand',    label: '🏷 Производител',      values: ['Intel','AMD','ASUS','MSI','Gigabyte','ASRock','Sapphire','Palit','PowerColor','Zotac'] },
    { key: 'Socket',   label: '🔩 Сокет / Слот',      values: ['LGA1851','LGA1700','LGA1200','AM5','AM4','DDR5','DDR4','PCIe 5.0','PCIe 4.0'] },
    { key: 'TDP',      label: '🌡 TDP / Мощност',     values: ['35 W','45 W','65 W','95 W','105 W','125 W','165 W','250 W','320 W'] },
  ],
  peripherals: [
    { key: 'Type',        label: '📦 Тип',             values: ['Клавиатура','Мишка','Уеб камера'] },
    { key: 'Connection',  label: '🔗 Връзка',          values: ['USB','Bluetooth','Безжична','2.4GHz'] },
  ],
  cameras: [
    { key: 'Резолюция',       label: '📷 Резолюция',        values: ['1080p','2K','4MP'] },
    { key: 'Монтаж',          label: '🏠 Приложение',       values: ['За закрито','За открито'] },
    { key: 'Връзка',          label: '🔗 Връзка',           values: ['Wi-Fi','LAN','POE'] },
    { key: 'Нощно виждане',   label: '🌙 Нощно виждане',   values: ['Да'] },
    { key: 'Микрофон',        label: '🎙 Микрофон',         values: ['Да'] },
  ],
  audio: [
    { key: 'Тип',      label: '🎧 Тип',       values: ['Слушалки','Тапи','Тонколони'] },
    { key: 'Връзка',   label: '📡 Връзка',    values: ['Кабелна','Bluetooth','Кабелна + BT'] },
    { key: 'Микрофон', label: '🎙 Микрофон',  values: ['Да'] },
    { key: 'Gaming',   label: '🎮 Gaming',     values: ['Да'] },
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
    { key: 'Капацитет',  label: '📦 Капацитет',  values: ['8 GB','16 GB','32 GB','64 GB','128 GB','256 GB','512 GB','1 TB','2 TB'] },
    { key: 'Интерфейс',  label: '🔌 Интерфейс',  values: ['USB 2.0','USB 3.0','USB 3.1','USB 3.2','USB-C'] },
  ],
  ups: [
    { key: 'Мощност',    label: '⚡ Мощност (VA/KVA)',    values: ['600VA','800VA','850VA','1KVA','1.5KVA','2KVA','3KVA','6KVA+'] },
    { key: 'Тип',        label: '🔌 Тип UPS',             values: ['Линейно-интерактивен','Онлайн / Чиста синусоида','Резервна батерия'] },
    { key: 'Свързаност', label: '🔗 Свързаност',          values: ['USB'] },
    { key: 'AVR',        label: '🛡 AVR защита',          values: ['Да'] },
  ],
  accessories: [
    { key: 'Тип',       label: '⚙ Вид аксесоар',         values: ['Проектор','Фитнес тракер','Gaming стол','Контролер','USB хъб','Чанта'] },
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
  psu: [
    { key: '_psu_watt',     label: '⚡ Мощност',           values: ['До 500 W','501 – 749 W','750 – 999 W','Над 1000 W'] },
    { key: '_psu_80plus',   label: '🏆 80 Plus рейтинг',   values: ['80 Plus','80 Plus Bronze','80 Plus Gold','80 Plus Platinum','80 Plus Titanium'] },
    { key: '_psu_form',     label: '📐 Форм фактор',       values: ['ATX','ATX 3.0','ATX 3.1','SFX / ITX'] },
    { key: '_psu_modular',  label: '🔌 Окабеляване',       values: ['Модулно','Фиксирано'] },
    { key: '_psu_fan',      label: '🌀 Вентилатор',        values: ['80 мм','120 мм','135 мм','140 мм','Без вентилатор'] },
  ],
  case: [
    { key: '_case_brand',  label: '🏷 Производител',  values: ['Fractal Design','Fortron','ADATA','MSI','BitFenix','NZXT'] },
    { key: 'Формфактор',   label: '📐 Форм-фактор',   values: ['Mini-ITX','Mid Tower','Micro-ATX'] },
    { key: '_case_color',  label: '🎨 Цвят',           values: ['Black','White'] },
  ],
  cooling: [
    { key: '_cooling_brand',  label: '🏷 Производител',  values: ['Fractal Design','MSI','Noctua','Deepcool','ADATA','Fortron'] },
    { key: '_cooling_type',   label: '⚙ Тип',            values: ['CPU въздушно','AIO водно','Вентилатор'] },
    { key: '_cooling_socket', label: '🔩 Сокет',          values: ['AM5','AM4','LGA1700','LGA1200','LGA1151'] },
  ],
  webcam: [
    { key: 'Резолюция', label: '📷 Резолюция',  values: ['720p','1080p','2K','4K'] },
    { key: 'Връзка',    label: '🔗 Връзка',     values: ['USB 2.0','USB-C','Wi-Fi'] },
    { key: 'Микрофон',  label: '🎙 Микрофон',  values: ['Да'] },
    { key: 'Автофокус', label: '🔍 Автофокус', values: ['Да'] },
  ],
  cam_indoor: [
    { key: 'Резолюция',     label: '📷 Резолюция',      values: ['1080p','2K','4MP'] },
    { key: 'Връзка',        label: '🔗 Връзка',         values: ['Wi-Fi','LAN'] },
    { key: 'Микрофон',      label: '🎙 Микрофон',       values: ['Да'] },
    { key: 'Pan/Tilt',      label: '🔄 Pan/Tilt',       values: ['Да'] },
  ],
  cam_outdoor: [
    { key: 'Резолюция',     label: '📷 Резолюция',      values: ['1080p','2K','4MP','6MP'] },
    { key: 'Връзка',        label: '🔗 Връзка',         values: ['Wi-Fi','LAN','Wi-Fi + LAN'] },
    { key: 'Нощно виждане', label: '🌙 Нощно виждане', values: ['Да'] },
    { key: 'Микрофон',      label: '🎙 Микрофон',       values: ['Да'] },
  ],
  cam_poe: [
    { key: 'Резолюция',     label: '📷 Резолюция',      values: ['4MP'] },
    { key: 'Нощно виждане', label: '🌙 Нощно виждане', values: ['Да'] },
  ],
  ext_drive: [
    { key: 'Тип',        label: '💾 Тип',         values: ['Портативен SSD','Портативен HDD'] },
    { key: 'Капацитет',  label: '📦 Капацитет',   values: ['512 GB','1 TB','2 TB','4 TB','5 TB','6 TB','8 TB'] },
    { key: 'Интерфейс',  label: '🔌 Интерфейс',   values: ['USB 3.0','USB 3.1','USB 3.2 Gen 2','USB 3.2 Gen 2x2','USB-C 3.1','USB-C 3.2 Gen 2','USB-C 3.2 Gen 2x2'] },
  ],
  usb_flash: [
    { key: 'Капацитет',  label: '📦 Капацитет',  values: ['16 GB','32 GB','64 GB','128 GB','256 GB'] },
    { key: 'Интерфейс',  label: '🔌 Интерфейс',  values: ['USB 2.0','USB 3.0','USB 3.1','USB 3.2'] },
  ],
  microsd: [
    { key: 'Капацитет',  label: '📦 Капацитет',  values: ['32 GB','64 GB','128 GB','256 GB'] },
  ],
  sd_card: [
    { key: 'Капацитет',  label: '📦 Капацитет',  values: ['32 GB','64 GB','128 GB','256 GB'] },
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
  hp_gaming: [
    { key: '_hp_brand', label: '🏷 Производител', values: ['Logitech','A4Tech','Asus','Acer','Lenovo'] },
    { key: 'Връзка',    label: '📡 Връзка',       values: ['Кабелна','Bluetooth','Кабелна + BT'] },
    { key: 'Микрофон',  label: '🎙 Микрофон',     values: ['Да'] },
    { key: 'Gaming',    label: '🎮 Gaming',        values: ['Да'] },
  ],
  hp_wireless: [
    { key: '_hp_brand', label: '🏷 Производител', values: ['Logitech','Realme','Nokia','A4Tech','Lenovo','Acer'] },
    { key: 'Връзка',    label: '📡 Връзка',       values: ['Bluetooth','Кабелна + BT'] },
    { key: 'Микрофон',  label: '🎙 Микрофон',     values: ['Да'] },
  ],
  hp_inear: [
    { key: '_hp_brand', label: '🏷 Производител', values: ['A4Tech','Realme','Nokia','Lenovo','iFrogz'] },
    { key: 'Връзка',    label: '📡 Връзка',       values: ['Кабелна','Bluetooth'] },
    { key: 'Микрофон',  label: '🎙 Микрофон',     values: ['Да'] },
  ],
  hp_office: [
    { key: '_hp_brand', label: '🏷 Производител', values: ['Logitech','A4Tech','Acer','Lenovo','Meliconi'] },
    { key: 'Връзка',    label: '📡 Връзка',       values: ['Кабелна','Bluetooth','Кабелна + BT'] },
    { key: 'Микрофон',  label: '🎙 Микрофон',     values: ['Да'] },
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
  tablet: [
    { key: '_hp_brand', label: '🏷 Производител',        values: ['Lenovo'] },
    { key: 'RAM',       label: '💾 RAM',                 values: ['4 GB','8 GB','12 GB'] },
    { key: 'Памет',     label: '📦 Вградена памет',       values: ['128 GB','256 GB'] },
    { key: 'WiFi',      label: '📶 WiFi стандарт',        values: ['Wi-Fi 5','Wi-Fi 7'] },
    { key: 'LTE',       label: '📡 4G/LTE',              values: ['Да'] },
    { key: 'ОС',        label: '💻 Операционна система', values: ['Android 14','Android 15'] },
  ],
  smart_dev: [
    { key: 'Тип',    label: '⌚ Вид устройство',  values: ['Фитнес тракер','Смарт говорител','Таблет'] },
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
    { key: '_monitor_brand',   label: '🏷 Производител',      values: ['Acer','LG','Lenovo','MSI','Asus','Koorui','ASRock','Thomson'] },
    { key: '_monitor_hz',      label: '⚡ Честота',            values: ['144Hz','165Hz','180Hz','200Hz','240Hz','360Hz'] },
    { key: '_monitor_panel',   label: '🖥 Панел',              values: ['IPS','VA','OLED','TN'] },
    { key: '_monitor_gaming',  label: '🎮 Gaming функции',    values: ['FreeSync','G-Sync','HDR','Curved'] },
    { key: '_monitor_res',     label: '🔍 Резолюция',         values: ['FHD 1920×1080','QHD 2560×1440','4K 3840×2160'] },
    { key: '_monitor_size',    label: '📐 Диагонал',           values: ['24"','27"','32"','34"'] },
  ],
  qhd_mon: [
    { key: '_monitor_brand',     label: '🏷 Производител',    values: ['Acer','LG','Lenovo','MSI','Asus','Koorui','ASRock','Thomson'] },
    { key: '_monitor_size',      label: '📐 Диагонал',        values: ['23"–25"','25"–27"','27"–29"','Над 29"'] },
    { key: '_monitor_hz',        label: '⚡ Честота',          values: ['60Hz','75Hz','100Hz','144Hz','165Hz','180Hz','240Hz'] },
    { key: '_monitor_panel',     label: '🖥 Панел',            values: ['IPS','VA','OLED'] },
    { key: '_monitor_gaming',    label: '🎮 Gaming функции',  values: ['FreeSync','G-Sync','HDR','Curved'] },
    { key: '_monitor_interface', label: '🔌 Интерфейси',      values: ['HDMI','DisplayPort','USB-C'] },
  ],
  oled_mon: [
    { key: '_monitor_brand',   label: '🏷 Производител',      values: ['Acer','LG','Lenovo','MSI','Asus','Koorui','ASRock','Thomson'] },
    { key: '_monitor_panel',   label: '🖥 Панел',              values: ['OLED','QLED'] },
    { key: '_monitor_size',    label: '📐 Диагонал',           values: ['27"','34"','45"','49"'] },
    { key: '_monitor_hz',      label: '⚡ Честота',            values: ['120Hz','144Hz','165Hz','240Hz'] },
    { key: '_monitor_res',     label: '🔍 Резолюция',         values: ['FHD 1920×1080','QHD 2560×1440','4K 3840×2160','UltraWide'] },
    { key: '_monitor_gaming',  label: '🎮 Gaming функции',    values: ['FreeSync','G-Sync','HDR'] },
  ],
  curved_mon: [
    { key: '_monitor_brand',   label: '🏷 Производител',      values: ['Acer','LG','Lenovo','MSI','Asus','Koorui','ASRock','Thomson'] },
    { key: '_monitor_size',    label: '📐 Диагонал',           values: ['27"–29"','Над 29"'] },
    { key: '_monitor_hz',      label: '⚡ Честота',            values: ['60Hz','100Hz','144Hz','165Hz','180Hz','240Hz'] },
    { key: '_monitor_res',     label: '🔍 Резолюция',         values: ['FHD 1920×1080','QHD 2560×1440','4K 3840×2160','UltraWide'] },
    { key: '_monitor_gaming',  label: '🎮 Gaming функции',    values: ['FreeSync','G-Sync','HDR'] },
  ],
  ultrawide: [
    { key: '_monitor_brand',   label: '🏷 Производител',      values: ['Acer','LG','Lenovo','MSI','Asus','Koorui','ASRock','Thomson'] },
    { key: '_monitor_size',    label: '📐 Диагонал',           values: ['29"','34"','38"','45"','49"'] },
    { key: '_monitor_res',     label: '🔍 Резолюция',         values: ['UltraWide','QHD 2560×1440','4K 3840×2160'] },
    { key: '_monitor_hz',      label: '⚡ Честота',            values: ['60Hz','100Hz','144Hz','165Hz','240Hz'] },
    { key: '_monitor_panel',   label: '🖥 Панел',              values: ['IPS','VA','OLED'] },
    { key: '_monitor_gaming',  label: '🎮 Gaming функции',    values: ['FreeSync','G-Sync','HDR','Curved'] },
  ],
  office_mon: [
    { key: '_monitor_brand',     label: '🏷 Производител',    values: ['Acer','LG','Lenovo','MSI','Asus','Koorui','ASRock','Thomson'] },
    { key: '_monitor_size',      label: '📐 Диагонал',        values: ['23"','24"','27"','32"'] },
    { key: '_monitor_panel',     label: '🖥 Панел',            values: ['IPS','VA'] },
    { key: '_monitor_res',       label: '🔍 Резолюция',       values: ['FHD 1920×1080','QHD 2560×1440','WUXGA 1920×1200'] },
    { key: '_monitor_interface', label: '🔌 Интерфейси',      values: ['HDMI','DisplayPort','USB-C'] },
    { key: '_monitor_stand',     label: '🔧 Стойка',          values: ['Pivot','Swivel'] },
  ],
  tv: [
    { key: '_monitor_brand',   label: '🏷 Производител',      values: ['Acer','LG','Thomson','Koorui'] },
    { key: '_monitor_size',    label: '📐 Диагонал',           values: ['24"','27"','32"','40"','43"','50"','55"'] },
    { key: '_monitor_res',     label: '🔍 Резолюция',         values: ['Full HD','4K UHD','QLED'] },
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
  office_pc: [
    { key: '_desktop_brand', label: '🏷 Производител',        values: ['Lenovo','MSI','Asus'] },
    { key: '_desktop_cpu',   label: '💻 Процесор',            values: ['Core i3','Core i5','Core i7','Core Ultra 5','Core Ultra 7'] },
    { key: '_desktop_ram',   label: '🧠 Оперативна памет',    values: ['8 GB','16 GB','32 GB'] },
    { key: '_desktop_ssd',   label: '💾 SSD',                 values: ['256 GB','512 GB','1 TB'] },
    { key: '_desktop_os',    label: '🪟 Операционна система', values: ['Windows 11','Без OS'] },
  ],
  workstation: [
    { key: '_desktop_brand', label: '🏷 Производител',        values: ['Lenovo','MSI'] },
    { key: '_desktop_cpu',   label: '💻 Процесор',            values: ['Core i7','Core i9','Core Ultra 7','Core Ultra 9','Ryzen 7','Ryzen 9'] },
    { key: '_desktop_ram',   label: '🧠 Оперативна памет',    values: ['16 GB','32 GB','64 GB','128 GB'] },
    { key: '_desktop_ssd',   label: '💾 SSD',                 values: ['512 GB','1 TB','2 TB'] },
    { key: '_desktop_gpu',   label: '🎮 Видео карта',         values: ['RTX 50','RTX 40','Интегрирана'] },
  ],
  aio: [
    { key: '_desktop_brand', label: '🏷 Производител',        values: ['Lenovo','MSI','Asus'] },
    { key: '_desktop_cpu',   label: '💻 Процесор',            values: ['Core i3','Core i5','Core i7','Core Ultra 7','Ryzen 5','Ryzen 7'] },
    { key: '_desktop_ram',   label: '🧠 Оперативна памет',    values: ['8 GB','16 GB','32 GB'] },
    { key: '_desktop_ssd',   label: '💾 SSD',                 values: ['256 GB','512 GB','1 TB'] },
    { key: '_desktop_os',    label: '🪟 Операционна система', values: ['Windows 11','Без OS'] },
  ],
  gaming: [
    { key: '_laptop_brand',  label: '🏷 Производител',           values: ['Lenovo','Asus','Acer','MSI'] },
    { key: '_laptop_cpu',    label: '💻 Процесор',               values: ['Core i5','Core i7','Core i9','Core Ultra 5','Core Ultra 7','Core Ultra 9','Ryzen 5','Ryzen 7','Ryzen 9'] },
    { key: '_laptop_gpu',    label: '🎮 Видео карта',            values: ['RTX 50','RTX 40','RTX 30','GTX','AMD Radeon RX'] },
    { key: '_laptop_ram',    label: '🧠 RAM памет',              values: ['8 GB','16 GB','24 GB','32 GB','64 GB'] },
    { key: '_laptop_screen', label: '📐 Диагонал',               values: ['14"','15.6"','16"','17"'] },
    { key: '_laptop_hz',     label: '🔄 Честота на опресняване', values: ['120 Hz','144 Hz','165+ Hz'] },
  ],
  ultrabook: [
    { key: '_laptop_brand',   label: '🏷 Производител',           values: ['Lenovo','Asus','Acer','MSI'] },
    { key: '_laptop_cpu',     label: '💻 Процесор',               values: ['Core i5','Core i7','Core Ultra 5','Core Ultra 7','Core Ultra 9','Ryzen 5','Ryzen 7','Ryzen 9'] },
    { key: '_laptop_ram',     label: '🧠 RAM памет',              values: ['8 GB','16 GB','32 GB','64 GB'] },
    { key: '_laptop_ssd',     label: '💾 SSD',                    values: ['256 GB','512 GB','1 TB','2 TB'] },
    { key: '_laptop_screen',  label: '📐 Диагонал',               values: ['13"','14"','15.6"','16"'] },
    { key: '_laptop_display', label: '🖥 Тип дисплей',            values: ['IPS','OLED','VA'] },
    { key: '_laptop_os',      label: '🪟 Операционна система',    values: ['Windows 11','Free DOS / Linux'] },
  ],
  business: [
    { key: '_laptop_brand',   label: '🏷 Производител',           values: ['Lenovo','Asus','Acer','MSI'] },
    { key: '_laptop_cpu',     label: '💻 Процесор',               values: ['Core i5','Core i7','Core i9','Core Ultra 5','Core Ultra 7','Ryzen 5','Ryzen 7','Ryzen 9'] },
    { key: '_laptop_ram',     label: '🧠 RAM памет',              values: ['8 GB','16 GB','24 GB','32 GB','64 GB'] },
    { key: '_laptop_ssd',     label: '💾 SSD',                    values: ['256 GB','512 GB','1 TB','2 TB'] },
    { key: '_laptop_screen',  label: '📐 Диагонал',               values: ['13"','14"','15.6"','16"'] },
    { key: '_laptop_os',      label: '🪟 Операционна система',    values: ['Windows 11','Free DOS / Linux'] },
    { key: '_laptop_weight',  label: '⚖ Тегло',                  values: ['До 1.5 кг','1.5 – 2 кг','Над 2 кг'] },
  ],
  convertible: [
    { key: '_laptop_brand',   label: '🏷 Производител',           values: ['Lenovo','Asus','Acer','MSI'] },
    { key: '_laptop_cpu',     label: '💻 Процесор',               values: ['Core i5','Core i7','Core Ultra 5','Core Ultra 7','Ryzen 5','Ryzen 7'] },
    { key: '_laptop_ram',     label: '🧠 RAM памет',              values: ['8 GB','16 GB','32 GB'] },
    { key: '_laptop_ssd',     label: '💾 SSD',                    values: ['256 GB','512 GB','1 TB'] },
    { key: '_laptop_screen',  label: '📐 Диагонал',               values: ['13"','14"','15.6"','16"'] },
    { key: '_laptop_display', label: '🖥 Тип дисплей',            values: ['IPS','OLED'] },
    { key: '_laptop_os',      label: '🪟 Операционна система',    values: ['Windows 11','Free DOS / Linux'] },
  ],
  budget: [
    { key: '_laptop_brand',   label: '🏷 Производител',           values: ['Lenovo','Asus','Acer','MSI'] },
    { key: '_laptop_cpu',     label: '💻 Процесор',               values: ['Core i3','Core i5','Core Ultra 5','Ryzen 5','AMD Athlon'] },
    { key: '_laptop_ram',     label: '🧠 RAM памет',              values: ['8 GB','12 GB','16 GB'] },
    { key: '_laptop_ssd',     label: '💾 SSD',                    values: ['256 GB','512 GB'] },
    { key: '_laptop_screen',  label: '📐 Диагонал',               values: ['14"','15.6"','16"'] },
    { key: '_laptop_os',      label: '🪟 Операционна система',    values: ['Windows 11','Free DOS / Linux'] },
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
    ? `⚙ ${subcatLabels[subcat]}, филтри`
    : `⚙ ${CAT_LABELS[cat] || cat}, филтри`;
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

// Subcat filtering logic - maps subcat ID to product spec matching
function matchesSubcat(p, subcat) {
  if (subcat === 'all') return true;
  // Promo page subcats group by site category
  const _isPromo = currentFilter === 'promo' || (typeof cpCat !== 'undefined' && cpCat === 'promo');
  if (_isPromo) {
    if (subcat === 'phones')     return p.cat === 'phones';
    if (subcat === 'laptops')    return p.cat === 'laptops';
    if (subcat === 'monitors')   return p.cat === 'monitors';
    if (subcat === 'printers')   return p.cat === 'printers';
    if (subcat === 'network')    return p.cat === 'network';
    if (subcat === 'gpu')        return p.cat === 'components' && p.subcat === 'gpu';
    if (subcat === 'components') return p.cat === 'components' && p.subcat !== 'gpu';
    return false;
  }
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
// Laptops - 5 clear subcategories tied to spec filters
    gaming:      () => {
      const gpu = ((p.specs && p.specs['GPU']) || '').toLowerCase();
      const scr = ((p.specs && p.specs['Екран']) || '').replace(/\s/g,'').toLowerCase();
      const hz  = parseInt((scr.match(/(\d+)hz/i)||[])[1]||'0');
      return /rtx|gtx|radeon\s*rx/i.test(gpu) || hz >= 120 ||
        all.includes('rog') || all.includes('tuf gaming') || all.includes('legion') ||
        all.includes('nitro') || all.includes('predator') || all.includes('katana') ||
        all.includes('cyborg') || all.includes('raider') || all.includes('sword') ||
        all.includes('loq') ||
        /asus\s+(g6\d\d|ga[34]\d\d|fa6\d\d|fa7\d\d|fx6\d\d)/i.test(p.name);
    },
    business:    () => {
      const gpu = ((p.specs && p.specs['GPU']) || '').toLowerCase();
      const isGaming = /rtx|gtx|radeon\s*rx/i.test(gpu) ||
        all.includes('rog') || all.includes('tuf gaming') || all.includes('legion') ||
        all.includes('nitro') || all.includes('predator') || all.includes('katana') ||
        all.includes('cyborg') || all.includes('loq');
      if (isGaming) return false;
      return all.includes('expertbook') || all.includes('thinkbook') || all.includes('thinkpad') ||
        all.includes('travelmate') || all.includes('modern') || all.includes('summit') ||
        all.includes('vivobook pro') ||
        /lenovo\s+tp\s/i.test(p.name) ||
        /lenovo\s+tpx/i.test(p.name) ||
        /lenovo\s+tb\s/i.test(p.name) ||
        /lenovo\s+ws\s/i.test(p.name) ||
        /acer\s+tmp/i.test(p.name);
    },
    ultrabook:   () => {
      const gpu = ((p.specs && p.specs['GPU']) || '').toLowerCase();
      const isGaming = /rtx|gtx|radeon\s*rx/i.test(gpu) ||
        all.includes('rog') || all.includes('tuf gaming') || all.includes('legion') ||
        all.includes('nitro') || all.includes('predator') || all.includes('loq');
      if (isGaming) return false;
      const wt  = ((p.specs && p.specs['Тегло']) || '').replace(/\s/g,'').replace(',','.');
      const kg  = parseFloat(wt);
      const scr = ((p.specs && p.specs['Екран']) || '').toLowerCase();
      const isLight = !isNaN(kg) && kg <= 1.5;
      const isSmall = /\b1[34][^0-9]/.test(scr);
      return (isLight && isSmall) || all.includes('zenbook') || all.includes('swift') ||
        (all.includes('prestige') && !all.includes('gaming')) ||
        (all.includes('slim') && !all.includes('gaming')) ||
        /lenovo\s+yg\s/i.test(p.name) ||
        /asus\s+(ux|um|uh|s5|h7)\d/i.test(p.name);
    },
    convertible: () => {
      return all.includes('2-in-1') || all.includes('2in1') || all.includes('2 в 1') ||
        all.includes('flip') || all.includes('spin') || all.includes('yoga') ||
        all.includes('flex') || all.includes('convertible') ||
        /asus\s+tp\d/i.test(p.name);
    },
    budget:      () => {
      const os  = ((p.specs && p.specs['ОС']) || '').toLowerCase();
      const cpu = ((p.specs && p.specs['Процесор']) || '').toLowerCase();
      const eur = p.price / (typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583);
      return os.includes('free dos') || os.includes('freedos') || os.includes('linux') ||
        os.includes('chrome') || /athlon/i.test(cpu) || eur < 700 ||
        /acer\s+cbe/i.test(p.name) ||
        /lenovo\s+v\d+/i.test(p.name);
    },
    // Desktops
    office_pc:     () => all.includes('office') || all.includes('офис') || all.includes('business') || (p.price/(typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583) < 800 && !all.includes('gaming')),
    workstation:   () => all.includes('workstation') || all.includes('xeon') || all.includes('quadro') || p.price > 4000,
    aio:           () => all.includes('all-in-one') || all.includes('aio') || all.includes('imac') || all.includes('моноблок'),
    // Gaming
    gaming_laptop_s: () => all.includes('laptop') || all.includes('лаптоп') || all.includes('notebook') || (p.emoji === '💻'),
    gaming_pc_s:     () => all.includes('desktop') || all.includes('настолен') || all.includes('tower') || all.includes('gaming desktop') || (p.emoji === '🖥' && !all.includes('monitor')),
    gaming_mouse:    () => all.includes('mouse') || all.includes('мишк') || (p.emoji === '🖱'),
    gaming_kb:       () => all.includes('keyboard') || all.includes('клавиатур') || (p.emoji === '⌨'),
    gaming_headset:  () => all.includes('headset') || all.includes('headphone') || all.includes('слушалк') || (p.emoji === '🎧'),
    // Monitors
    tv:         () => p.subcat === 'tv' || all.includes('smart tv') || all.includes('телевизор'),
    gaming_mon: () => p.subcat === 'gaming_mon' || (all.includes('hz') && parseInt(all.match(/(\d+)hz/)?.[1]||0) >= 144),
    mon_4k:     () => p.subcat === 'mon_4k' || all.includes('4k') || all.includes('uhd') || all.includes('3840') || all.includes('4к'),
    qhd_mon:    () => {
      const res = ((p.specs || {}).Резолюция || '');
      return p.subcat === 'qhd_mon' || /2560.?1440/i.test(res) || /\bwqhd\b|\bqhd\b/i.test(res) ||
        /2560.?1440/i.test(all) || /\bwqhd\b/i.test(all) || all.includes('quad hd') ||
        (/\bqhd\b/i.test(all) && !all.includes('ultrawide') && !all.includes('ultra-wide'));
    },
    ultrawide:  () => p.subcat === 'ultrawide' || all.includes('ultrawide') || all.includes('ultra-wide') || all.includes('21:9') || all.includes('32:9'),
    oled_mon:   () => p.subcat === 'oled_mon' || all.includes('oled') || (p.specs||{}).Панел === 'QLED' || all.includes('qled'),
    curved_mon: () => p.subcat === 'curved_mon' || (p.specs||{}).Curved === 'Да' || /\bcurved?\b/i.test(all),
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
    headphones:    () => p.subcat === 'headphones' || all.includes('слушалк') || all.includes('headphone') || all.includes('headset') || all.includes('earphone') || all.includes('earbud'),
    hp_gaming: () => {
      const typ  = ((p.specs||{}).Тип||'').toLowerCase();
      if (typ === 'тапи' || typ === 'тонколони') return false;
      return p.subcat === 'hp_gaming' || (p.specs||{}).Gaming === 'Да' ||
        ((all.includes('слушалк') || all.includes('headphone') || all.includes('headset')) &&
         (all.includes('gaming') || /\bg\d{3}\b/i.test(p.name||'') || all.includes('7.1') || all.includes('surround') || all.includes('rgb')));
    },
    hp_wireless: () => {
      const typ  = ((p.specs||{}).Тип||'').toLowerCase();
      if (typ === 'тапи' || typ === 'тонколони') return false;
      if ((p.specs||{}).Gaming === 'Да') return false;
      const conn = ((p.specs||{}).Връзка||'').toLowerCase();
      return p.subcat === 'hp_wireless' || conn.includes('bluetooth') || conn.includes('кабелна + bt');
    },
    hp_inear: () => {
      const typ = ((p.specs||{}).Тип||'').toLowerCase();
      if (typ === 'слушалки' || typ === 'тонколони') return false;
      return p.subcat === 'hp_inear' || typ === 'тапи' ||
        all.includes('earphone') || all.includes('earbud') || all.includes('тапи') ||
        /\btws\b/i.test(p.name||'') || all.includes('in-ear');
    },
    hp_office: () => {
      const typ  = ((p.specs||{}).Тип||'').toLowerCase();
      if (typ === 'тапи' || typ === 'тонколони') return false;
      if ((p.specs||{}).Gaming === 'Да') return false;
      const conn = ((p.specs||{}).Връзка||'').toLowerCase();
      return p.subcat === 'hp_office' || (typ === 'слушалки' && conn === 'кабелна');
    },
    webcam:        () => p.subcat === 'webcam' || all.includes('webcam') || all.includes('уеб камер') || all.includes('web camera'),
    cam_indoor:    () => p.subcat === 'cam_indoor'  || (p.cat === 'cameras' && (p.specs||{}).Монтаж === 'За закрито'),
    cam_outdoor:   () => p.subcat === 'cam_outdoor' || (p.cat === 'cameras' && (p.specs||{}).Монтаж === 'За открито'),
    cam_poe:       () => p.subcat === 'cam_poe'     || (p.cat === 'cameras' && (p.specs||{}).Връзка === 'POE'),
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
    ext_drive:     () => p.subcat === 'ext_drive' || all.includes('portable') || all.includes('портативен') || all.includes('external') || all.includes('външен'),
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
    // CPU Series - extracted from product name
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
    // Package type - BOX / TRAY / MPK from product name
    if (key === 'Опаковка') {
      return [...vals].some(v => new RegExp(v, 'i').test(p.name || ''));
    }
    // Cores - "N ядра" filter values matched against numeric spec
    if (key === 'Ядра') {
      const coreNum = ((p.specs || {})['Ядра'] || '').trim();
      return [...vals].some(v => coreNum === (v.match(/^(\d+)/)?.[1] || ''));
    }
    // Form factor - exact match to avoid 'ATX' matching 'Micro-ATX'
    if (key === 'Форм фактор') {
      const ff = ((p.specs || {})['Форм фактор'] || '').toLowerCase();
      return [...vals].some(v => ff === v.toLowerCase());
    }
    // Desktop computed filters
    if (key === '_desktop_cpu') {
      const cpu = ((p.specs || {})['Процесор'] || '').replace(/[®™©]/g, ' ').toLowerCase();
      if (!cpu) return false;
      return [...vals].some(v => {
        if (v === 'Core i3')      return /\bi3[-\s\d]|core\s+i3|core\s+3\s+\d|with intel i3/i.test(cpu);
        if (v === 'Core i5')      return /\bi5[-\s\d]|core\s+i5|core\s+5\s+\d|with intel i5/i.test(cpu);
        if (v === 'Core i7')      return /\bi7[-\s\d]|core\s+i7|core\s+7\s+\d|with intel i7/i.test(cpu);
        if (v === 'Core i9')      return /\bi9[-\s\d]|core\s+i9/i.test(cpu);
        if (v === 'Core Ultra 5') return /ultra\s*5[\s\d]/i.test(cpu);
        if (v === 'Core Ultra 7') return /ultra\s*7[\s\d]/i.test(cpu);
        if (v === 'Core Ultra 9') return /ultra\s*9[\s\d]/i.test(cpu);
        if (v === 'Ryzen 5')      return /ryzen\s*5[\s\d]/i.test(cpu);
        if (v === 'Ryzen 7')      return /ryzen\s*7[\s\d]/i.test(cpu);
        if (v === 'Ryzen 9')      return /ryzen\s*9[\s\d]/i.test(cpu);
        return cpu.includes(v.toLowerCase());
      });
    }
    if (key === '_phone_brand') {
      return [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase());
    }
    if (key === '_desktop_brand') {
      return [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase());
    }
    if (key === '_desktop_ram') {
      const raw = ((p.specs || {}).RAM || '').replace(/\s/g, '');
      const gb = parseInt(raw);
      return !isNaN(gb) && [...vals].some(v => parseInt(v) === gb);
    }
    if (key === '_desktop_ssd') {
      const ssd = ((p.specs || {}).SSD || '').trim().toUpperCase().replace(/\s/g, '');
      return [...vals].some(v => {
        const vl = v.toUpperCase().replace(/\s/g, '');
        if (vl.endsWith('TB')) {
          const tb = parseFloat(vl);
          if (ssd.endsWith('TB')) return Math.abs(parseFloat(ssd) - tb) < 0.1;
          if (ssd.endsWith('GB')) return Math.abs(parseFloat(ssd) / 1000 - tb) < 0.15;
        }
        if (vl.endsWith('GB')) {
          const gb2 = parseInt(vl);
          if (ssd.endsWith('GB')) return parseInt(ssd) === gb2;
          if (ssd.endsWith('TB')) return Math.abs(parseFloat(ssd) * 1000 - gb2) < gb2 * 0.25;
        }
        return false;
      });
    }
    if (key === '_desktop_gpu') {
      const gpu = ((p.specs || {}).GPU || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'RTX 50') return /rtx.{0,3}50\d\d/i.test(gpu);
        if (v === 'RTX 40') return /rtx.{0,3}40\d\d/i.test(gpu);
        if (v === 'Интегрирана') return /intel.*uhd|intel.*iris|amd\s*radeon.*graphics|integrated|uma/i.test(gpu);
        return gpu.includes(v.toLowerCase());
      });
    }
    if (key === '_desktop_os') {
      const os = ((p.specs || {}).ОС || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'Windows 11') return os.includes('windows 11') || os.includes('windows® 11');
        if (v === 'Без OS') return !os || os === 'none' || os === 'n/a' || os.includes('free dos') || os.includes('freedos');
        return os.includes(v.toLowerCase());
      });
    }
    // Laptop computed filters
    if (key === '_laptop_brand') {
      const b = (p.brand || '').toLowerCase();
      return [...vals].some(v => b === v.toLowerCase());
    }
    if (key === '_laptop_cpu') {
      const cpu = ((p.specs && p.specs['Процесор']) || p.name || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'Core i3') return /core\s*(™\s*)?i3|\bi3-\d/i.test(cpu);
        if (v === 'Core i5') return /core\s*(™\s*)?i5|\bi5-\d|core\s+5\s+\d/i.test(cpu);
        if (v === 'Core i7') return /core\s*(™\s*)?i7|\bi7-\d|core\s+7\s+\d/i.test(cpu);
        if (v === 'Core i9') return /core\s*(™\s*)?i9|\bi9-\d/i.test(cpu);
        if (v === 'Core Ultra 5') return /ultra\s*(™\s*)?5/i.test(cpu);
        if (v === 'Core Ultra 7') return /ultra\s*(™\s*)?7/i.test(cpu);
        if (v === 'Core Ultra 9') return /ultra\s*(™\s*)?9/i.test(cpu);
        if (v === 'Ryzen 5') return /ryzen\s*(™\s*)?5/i.test(cpu);
        if (v === 'Ryzen 7') return /ryzen\s*(™\s*)?7/i.test(cpu);
        if (v === 'Ryzen 9') return /ryzen\s*(™\s*)?9/i.test(cpu);
        if (v === 'AMD Athlon') return /athlon/i.test(cpu);
        return cpu.includes(v.toLowerCase());
      });
    }
    if (key === '_laptop_ram') {
      const ram = ((p.specs && p.specs['RAM']) || '').replace(/\s/g, '').toUpperCase();
      const gb = parseInt(ram);
      return !isNaN(gb) && [...vals].some(v => parseInt(v) === gb);
    }
    if (key === '_laptop_ssd') {
      const ssd = ((p.specs && p.specs['SSD']) || '').trim().toUpperCase().replace(/\s/g, '');
      return [...vals].some(v => {
        const vl = v.toUpperCase().replace(/\s/g, '');
        if (vl.endsWith('TB')) {
          const tb = parseFloat(vl);
          if (ssd.endsWith('TB')) return Math.abs(parseFloat(ssd) - tb) < 0.1;
          if (ssd.endsWith('GB')) return Math.abs(parseFloat(ssd) / 1000 - tb) < 0.15;
        }
        if (vl.endsWith('GB')) {
          const gb2 = parseInt(vl);
          if (ssd.endsWith('GB')) return parseInt(ssd) === gb2;
          if (ssd.endsWith('TB')) return Math.abs(parseFloat(ssd) * 1000 - gb2) < gb2 * 0.25;
        }
        return false;
      });
    }
    if (key === '_laptop_screen') {
      const scr = ((p.specs && p.specs['Екран']) || '').toLowerCase();
      return [...vals].some(v => {
        const d = v.replace('"', '');
        return scr.includes(d + '"') || scr.includes(d + '″') || scr.includes(d + "'" ) || new RegExp(d.replace('.', '\\.') + '[^\\d]').test(scr);
      });
    }
    if (key === '_laptop_display') {
      const scr = ((p.specs && p.specs['Екран']) || '').toLowerCase();
      return [...vals].some(v => scr.includes(v.toLowerCase()));
    }
    if (key === '_laptop_gpu') {
      const gpu = ((p.specs && p.specs['GPU']) || (p.specs && p.specs['Видеокарта']) || p.name || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'RTX 50') return /rtx\s*50\d\d/i.test(gpu);
        if (v === 'RTX 40') return /rtx\s*40\d\d/i.test(gpu);
        if (v === 'RTX 30') return /rtx\s*30\d\d/i.test(gpu);
        if (v === 'GTX') return /gtx/i.test(gpu);
        if (v === 'AMD Radeon RX') return /radeon\s*rx/i.test(gpu);
        if (v === 'Интегрирана') return /iris\s*xe/i.test(gpu) || /uhd\s*\d/i.test(gpu) || /radeon\s*graphics/i.test(gpu) || /integrated/i.test(gpu) || gpu.includes('интегрирана');
        return gpu.includes(v.toLowerCase());
      });
    }
    if (key === '_laptop_os') {
      const os = ((p.specs && p.specs['ОС']) || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'Windows 11') return os.includes('windows 11');
        if (v === 'Free DOS / Linux') return os.includes('free dos') || os.includes('freedos') || os.includes('linux') || os.trim() === '';
        return os.includes(v.toLowerCase());
      });
    }
    if (key === '_laptop_weight') {
      const wt = ((p.specs && p.specs['Тегло']) || '').replace(/\s/g, '').replace(',', '.');
      const kg = parseFloat(wt);
      return !isNaN(kg) && [...vals].some(v => {
        if (v === 'До 1.5 кг') return kg <= 1.5;
        if (v === '1.5 – 2 кг') return kg > 1.5 && kg <= 2.0;
        if (v === 'Над 2 кг') return kg > 2.0;
        return false;
      });
    }
    if (key === '_laptop_hz') {
      const scr = ((p.specs && p.specs['Екран']) || '').replace(/\s/g, '').toLowerCase();
      const m = scr.match(/(\d+)hz/i);
      const hz = m ? parseInt(m[1]) : 0;
      return [...vals].some(v => {
        if (v === '60 Hz') return hz === 0 || hz === 60;
        if (v === '120 Hz') return hz >= 120 && hz < 140;
        if (v === '144 Hz') return hz >= 140 && hz < 160;
        if (v === '165+ Hz') return hz >= 165;
        return false;
      });
    }
    if (key === '_monitor_brand') {
      return [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase());
    }
    if (key === '_monitor_panel') {
      const panel = ((p.specs || {}).Панел || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'IPS')  return /\bips\b/i.test(panel);
        if (v === 'VA')   return /\bva\b/i.test(panel);
        if (v === 'OLED') return /oled/i.test(panel);
        if (v === 'TN')   return /\btn\b/i.test(panel);
        if (v === 'QLED') return /qled/i.test(panel);
        return false;
      });
    }
    if (key === '_monitor_hz') {
      const raw = ((p.specs || {}).Честота || '').replace(/\s/g, '');
      const hz = parseInt(raw);
      return !isNaN(hz) && [...vals].some(v => parseInt(v) === hz);
    }
    if (key === '_monitor_res') {
      const r = ((p.specs || {}).Резолюция || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'FHD 1920×1080' || v === 'Full HD') return /1920.{0,3}1080|full\s*hd/i.test(r);
        if (v === 'QHD 2560×1440') return /2560.{0,3}1440/i.test(r);
        if (v === '4K 3840×2160'  || v === '4K UHD') return /3840.{0,3}2160|4k\s*uhd/i.test(r);
        if (v === 'WUXGA 1920×1200') return /1920.{0,3}1200/i.test(r);
        if (v === 'UltraWide') return /3440.{0,3}1440/i.test(r);
        if (v === 'QLED') return /qled/i.test(r);
        return false;
      });
    }
    if (key === '_monitor_size') {
      const raw = ((p.specs || {}).Размер || '').replace(/[^\d.,]/g, '').replace(',', '.');
      const inch = parseFloat(raw);
      return !isNaN(inch) && [...vals].some(v => {
        if (v === 'До 19"')   return inch <= 19;
        if (v === '21"–23"')  return inch > 19  && inch <= 23;
        if (v === '23"–25"')  return inch > 23  && inch <= 25;
        if (v === '25"–27"')  return inch > 25  && inch <= 27;
        if (v === '27"–29"')  return inch > 27  && inch <= 29;
        if (v === 'Над 29"')  return inch > 29;
        if (v === '40"+')     return inch >= 40;
        const n = parseFloat(v);
        return !isNaN(n) && Math.abs(inch - n) < 0.6;
      });
    }
    if (key === '_monitor_gaming') {
      const specs = p.specs || {};
      return [...vals].some(v => {
        if (v === 'FreeSync') return /freesync/i.test(specs.Sync || '');
        if (v === 'G-Sync')   return /g.?sync/i.test(specs.Sync || '');
        if (v === 'HDR')      return specs.HDR === 'Да';
        if (v === 'Curved')   return !!(specs.Curved);
        return false;
      });
    }
    if (key === '_monitor_interface') {
      const specs = p.specs || {};
      return [...vals].some(v => {
        if (v === 'HDMI')        return specs.HDMI === 'Да';
        if (v === 'DisplayPort') return specs.DP   === 'Да';
        if (v === 'USB-C')       return specs.USBC === 'Да';
        return false;
      });
    }
    if (key === '_monitor_stand') {
      const specs = p.specs || {};
      return [...vals].some(v => {
        if (v === 'Pivot')  return specs.Pivot  === 'Да';
        if (v === 'Swivel') return specs.Swivel === 'Да';
        return false;
      });
    }
    if (key === '_case_brand') {
      return [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase());
    }
    if (key === '_case_color') {
      const color = ((p.specs || {}).Цвят || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'Black') return color.includes('black') || color.includes('charcoal') || color.includes('dark') || color === 'black';
        if (v === 'White') return color.includes('white') || color.includes('light gray') || color.includes('silver');
        return false;
      });
    }
    if (key === '_cooling_brand') {
      return [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase());
    }
    if (key === '_cooling_type') {
      const name = (p.name || '').toLowerCase();
      const specAll = Object.values(p.specs || {}).join(' ').toLowerCase();
      return [...vals].some(v => {
        if (v === 'AIO водно')    return /aio|liquid|water|celsius|kraken/i.test(name) || /pump spec/i.test(specAll);
        if (v === 'CPU въздушно') return /nh-|hyper\s*\d|d15|d14|l12|u12|u14|thermalright|cpu.*cool|cool.*cpu|tower.*cool|air.*cool/i.test(name) || (/noctua|deepcool|arctic/i.test(p.brand||'') && /cool/i.test(name));
        if (v === 'Вентилатор')   return /\bfan\b|вентил/i.test(name) && !/aio|liquid|water|cpu|cool/i.test(name);
        return false;
      });
    }
    if (key === '_cooling_socket') {
      const sock = ((p.specs || {})['CPU socket support'] || '').toLowerCase();
      return [...vals].some(v => {
        const num = v.replace(/^lga/i, '');
        return sock.includes(v.toLowerCase()) || sock.includes(num.toLowerCase());
      });
    }
    if (key === '_hp_brand') {
      return [...vals].some(v => (p.brand||'').toLowerCase() === v.toLowerCase());
    }
    if (key === '_hp_conn') {
      const nm = (p.name||'').toLowerCase();
      const sc = ((p.specs||{}).Връзка || (p.specs||{}).Connection || '').toLowerCase();
      return [...vals].some(v => {
        if (v === 'USB')             return nm.includes('usb') || sc.includes('usb');
        if (v === 'Bluetooth')       return nm.includes('bluetooth') || sc.includes('bluetooth');
        if (v === 'Безжична 2.4GHz') return /wireless|2\.4/.test(nm) || /wireless|2\.4/.test(sc);
        if (v === 'Кабелна')         return !nm.includes('bluetooth') && !nm.includes('wireless') && !nm.includes('безжич');
        if (v === '3.5mm')           return /3\.5\s*mm|jack|aux/.test(nm) || sc.includes('3.5');
        return sc.includes(v.toLowerCase()) || nm.includes(v.toLowerCase());
      });
    }
    if (key === '_hp_mic') {
      const nm = (p.name||'').toLowerCase();
      const sp = Object.values(p.specs||{}).join(' ').toLowerCase();
      return [...vals].some(v => v === 'Да' ? (nm.includes('mic') || nm.includes('микрофон') || sp.includes('mic') || nm.includes('headset')) : false);
    }
    if (key === '_hp_surround') {
      const nm = (p.name||'').toLowerCase();
      return [...vals].some(v => {
        if (v === '7.1 Surround') return /7\.1|surround/.test(nm);
        if (v === 'Стерео')       return !/7\.1|surround/.test(nm);
        return false;
      });
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

// Allowed canonical categories + sort values - used to validate URL params before querySelector
const _VALID_CATS = new Set(['all','laptops','desktops','gaming','components','monitors','peripherals','audio','cameras','phones','network','storage','software','accessories','printers','ups','consumables','new','sale','promo']);
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
  } else if (_urlPage === 'careers') {
    setTimeout(() => { if (typeof openCareersPage === 'function') openCareersPage(); }, 350);
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
  if (!hasMega) return; // no mega menu - let click through normally
  if (_megaMenuActiveCat === cat && _megaMenuOpen) return; // second tap - let openCatPage run
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
    // catPage is open - use cpApplySubcat
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
// SIDEBAR WIDGET A - TOP PRODUCT ROTATOR
// ═══════════════════════════════════════
const _HP_CAT_CYCLE = ['laptops','desktops','components','monitors','peripherals','audio','cameras','network','storage','accessories'];
const _CAT_EMOJI_SB = {laptops:'💻',desktops:'🖥️',components:'⚙️',monitors:'🖥',peripherals:'⌨️',audio:'🎧',cameras:'📹',network:'🌐',storage:'💾',accessories:'🎒'};
const _CAT_LABEL_SB = {laptops:'Лаптопи',desktops:'Настолни',components:'Компоненти',monitors:'Монитори',peripherals:'Периферия',audio:'Аудио',cameras:'Камери',network:'Мрежа',storage:'Памет и съхранение',accessories:'Аксесоари'};
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
      <span class="sb-tp-title"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-1px;margin-right:5px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Топ продукт</span>
      <span class="sb-tp-cat-pill">${_CAT_LABEL_SB[cat]||cat}</span>
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
// SIDEBAR WIDGET C - COMPARE TRAY
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
// SIDEBAR WIDGET - BRAND SPOTLIGHT
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
  // Rotate by day - different brand each day
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
      <span class="sb-bs-label">🏷 Производител на деня</span>
    </div>
    <div class="sb-bs-name">${escHtml(brand)}</div>
    <div class="sb-bs-meta">${brandProds.length} продукта · от ${fmtEur(minPrice)}</div>
    <div class="sb-bs-thumbs">${thumbs}</div>
    <button type="button" class="sb-bs-btn" data-brand-search="${escHtml(brand)}">Разгледай всички →</button>`;
}


function renderNewGrid(days, page) {
  page = page || 1;
  var PER = 10;
  var cutoff = new Date(Date.now() - days * 86400000);
  var all = [...products]
    .filter(function(p) { return p.stock !== false && p.added && new Date(p.added) >= cutoff; })
    .sort(function(a, b) { return new Date(b.added) - new Date(a.added); });
  var total = Math.max(1, Math.ceil(all.length / PER));
  page = Math.min(page, total);
  var prods = all.slice((page - 1) * PER, page * PER);
  var ng = document.getElementById('newGrid');
  if (ng) {
    ng.className = 'products-row cols5';
    ng.innerHTML = prods.map(function(p) { return makeCard(p, true); }).join('');
  }
  var pager = document.getElementById('newGridPager');
  if (!pager) return;
  if (total <= 1) { pager.innerHTML = ''; return; }
  var d = days;
  function pgBtn(p, lbl, dis, act) {
    return '<button class="ng-pg-btn' + (act ? ' ng-pg-active' : '') + '" ' +
      (dis ? 'disabled' : '') + ' onclick="renderNewGrid(' + d + ',' + p + ')">' + lbl + '</button>';
  }
  var nums = '';
  if (total <= 7) {
    for (var i = 1; i <= total; i++) nums += pgBtn(i, i, false, i === page);
  } else {
    nums += pgBtn(1, 1, false, page === 1);
    if (page > 3) nums += '<span class="ng-pg-ellipsis">…</span>';
    for (var j = Math.max(2, page - 1); j <= Math.min(total - 1, page + 1); j++) nums += pgBtn(j, j, false, j === page);
    if (page < total - 2) nums += '<span class="ng-pg-ellipsis">…</span>';
    nums += pgBtn(total, total, false, page === total);
  }
  pager.innerHTML = '<div class="ng-pager">' +
    pgBtn(page - 1, '‹', page <= 1, false) + nums + pgBtn(page + 1, '›', page >= total, false) +
    '</div>';
}
