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
  let list=currentFilter==='all'?[...products]:products.filter(p=>normalizeCat(p.cat)===currentFilter);
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
function renderGrids(){
  const _flashProds=[...products].filter(p=>p.old&&p.pct>0).sort((a,b)=>b.pct-a.pct).slice(0,5);
  const flashSection=document.getElementById('sale');
  if(flashSection) flashSection.style.display=_flashProds.length?'':'none';
  const fg=document.getElementById('flashGrid'); if(fg) fg.innerHTML=_flashProds.map(p=>makeCard(p,true)).join('');
  renderTopGrid();
  const _saleProds=products.filter(p=>p.badge==='sale');
  const sg=document.getElementById('specialGrid');
  if(sg){
    sg.innerHTML=_saleProds.slice(0,8).map(p=>makeCard(p)).join('');
    const _sgMore=document.getElementById('specialGridMore');
    if(_sgMore) _sgMore.style.display=_saleProds.length>8?'':'none';
    sg.closest('.section-wrap').style.display=_saleProds.length?'':'none';
  }
  // Slide 1 — cheapest flash-sale product
  const _s1Prods = [...products].filter(p=>p.old&&p.pct>0).sort((a,b)=>a.price-b.price);
  const _s1el = document.getElementById('slide1Price');
  if(_s1Prods.length && _s1el) {
    const _s1min = _s1Prods[0], _s1max = _s1Prods[_s1Prods.length-1];
    _s1el.innerHTML = `от <b>${(_s1min.price/EUR_RATE).toFixed(2)} €</b> / ${_s1min.price} лв. <small>вместо ${(_s1min.old/EUR_RATE).toFixed(2)} € / ${_s1min.old} лв.</small>`;
  }
  // Slide 2 — sync price from products array (id:99 = MacBook Pro M4)
  const _s2 = products.find(p=>p.id===99);
  const _s2el = document.getElementById('slide2Price');
  if(_s2 && _s2el) _s2el.innerHTML = `${(_s2.price/EUR_RATE).toFixed(2)} € / ${_s2.price} лв. <small>с ДДС</small>`;
  const ng=document.getElementById('newGrid'); if(ng) ng.innerHTML=products.filter(p=>p.badge==='new').concat(products.filter(p=>p.badge==='hot')).slice(0,5).map(p=>makeCard(p,true)).join('');
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
  if(typeof renderHpSubcatsStrip==='function') renderHpSubcatsStrip();
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
    { id: 'mon_4k',       label: '🖥 4K / UHD' },
    { id: 'ultrawide',    label: '↔ UltraWide' },
    { id: 'oled_mon',     label: '✨ OLED' },
    { id: 'office_mon',   label: '💼 Офис монитори' },
  ],
  components: [
    { id: 'cpu',         label: '⚙ Процесори' },
    { id: 'gpu',         label: '🎮 Видео карти' },
    { id: 'ram',         label: '🧠 RAM памет' },
    { id: 'ssd',         label: '💿 SSD / NVMe' },
    { id: 'hdd',         label: '💾 HDD дискове' },
    { id: 'motherboard', label: '🔩 Дънни платки' },
    { id: 'psu',         label: '⚡ Захранвания' },
    { id: 'case',        label: '🗄 Кутии' },
    { id: 'cooling',     label: '❄ Охлаждане' },
  ],
  peripherals: [
    { id: 'monitor',      label: '🖥 Монитори' },
    { id: 'keyboard',     label: '⌨ Клавиатури' },
    { id: 'mouse',        label: '🖱 Мишки' },
    { id: 'headphones',   label: '🎧 Слушалки' },
    { id: 'webcam',       label: '📷 Уеб камери' },
    { id: 'printer',      label: '🖨 Принтери' },
  ],
  network: [
    { id: 'router',       label: '📶 Рутери' },
    { id: 'switch',       label: '🔌 Суичове' },
    { id: 'ap',           label: '📡 Access Points' },
    { id: 'mesh',         label: '🔗 Mesh системи' },
  ],
  storage: [
    { id: 'nas',          label: '🗄 NAS устройства' },
    { id: 'server',       label: '🖥 Сървъри' },
    { id: 'ext_drive',    label: '💾 Външни дискове' },
    { id: 'flash',        label: '📱 Флаш памет' },
  ],
  accessories: [
    { id: 'bag',          label: '🎒 Чанти' },
    { id: 'cable',        label: '🔌 Кабели и зарядни' },
    { id: 'hub',          label: '🔀 Хъбове / Адаптери' },
    { id: 'smart_dev',    label: '⌚ Смарт устройства' },
    { id: 'mobile_acc',   label: '📱 Телефони и таблети' },
    { id: 'av',           label: '📺 Аудио / Видео' },
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
    { title: 'Gaming монитори', id: 'gaming_mon', items: ['144Hz', '165Hz', '240Hz', '360Hz', 'QHD Gaming', '4K Gaming'] },
    { title: 'По резолюция', id: 'mon_4k', items: ['4K UHD 3840×2160', 'QHD 2560×1440', 'Full HD 1080p'] },
    { title: 'По тип', id: 'oled_mon', items: ['OLED монитори', 'IPS панели', 'VA панели', 'UltraWide 21:9', 'Curved'] },
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
    { title: 'Рутери', id: 'router', items: ['WiFi 7', 'WiFi 6E', 'WiFi 6', 'Dual Band'] },
    { title: 'Мрежова инфра', id: 'switch', items: ['Mesh системи', 'Суичове 8p', 'Суичове 16p+', 'Access Points', 'PoE'] },
  ],
  storage: [
    { title: 'Сторидж', id: 'nas', items: ['NAS устройства', 'Сървъри', 'Rack системи'] },
    { title: 'Носители', id: 'ext_drive', items: ['Портативни SSD', 'Портативни HDD', 'USB Flash', 'SD карти'] },
  ],
  accessories: [
    { title: 'Периферни аксесоари', id: 'cable', items: ['Кабели USB-C/HDMI', 'Зарядни', 'Хъбове', 'Докинг станции'] },
    { title: 'Носене', id: 'bag', items: ['Чанти за лаптоп', 'Раници', 'Калъфи и протектори'] },
    { title: 'Смарт и мобилни', id: 'smart_dev', items: ['Смарт часовници', 'Смартфони', 'Таблети', 'Smart Home'] },
    { title: 'Аудио / Видео', id: 'av', items: ['Тонколони', 'Телевизори', 'Фотоапарати', 'Action камери'] },
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
    { key: 'Панел',      label: '🖥 Тип панел',         values: ['IPS','VA','OLED','TN','QLED'] },
    { key: 'Резолюция',  label: '🔍 Резолюция',         values: ['FHD','QHD','4K','UW-QHD','UW-FHD'] },
    { key: 'Честота',    label: '⚡ Честота',            values: ['60 Hz','75 Hz','100 Hz','120 Hz','144 Hz','165 Hz','180 Hz','200 Hz','240 Hz','280 Hz','360 Hz'] },
    { key: 'Размер',     label: '📐 Диагонал',          values: ['22"','24"','27"','31.5"','32"','34"','49"'] },
  ],
  laptops: [
    { key: 'CPU',     label: '💻 Процесор',            values: ['Intel Core i5','Intel Core i7','Intel Core i9','Intel Core Ultra','AMD Ryzen 5','AMD Ryzen 7','AMD Ryzen 9','Apple M3','Apple M4'] },
    { key: 'RAM',     label: '🧠 Оперативна памет',    values: ['8 GB','16 GB','24 GB','32 GB','64 GB'] },
    { key: 'GPU',     label: '🎮 Видео карта',         values: ['RTX 4050','RTX 4060','RTX 4070','RTX 4080','RTX 4090','Integrated','Apple GPU'] },
    { key: 'Display', label: '📐 Диагонал',            values: ['13"','14"','15.6"','16"','17"'] },
    { key: 'OS',      label: '🪟 Операционна система', values: ['Windows 11','macOS','Linux','Без OS'] },
  ],
  desktops: [
    { key: 'CPU',     label: '💻 Процесор',            values: ['Intel Core i5','Intel Core i7','Intel Core i9','AMD Ryzen 7','AMD Ryzen 9','Apple M4'] },
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
    { key: 'WiFi',   label: '📡 WiFi стандарт',        values: ['WiFi 5','WiFi 6','WiFi 6E','WiFi 7'] },
    { key: 'Ports',  label: '🔌 Портове',              values: ['4 порта','8 порта','16+ порта','PoE'] },
    { key: 'Type',   label: '📦 Тип',                  values: ['Рутер','Суич','Access Point','Mesh нод'] },
  ],
  storage: [
    { key: 'Type',      label: '💾 Тип',               values: ['NAS','Сървър','Портативен SSD','Портативен HDD','USB Flash','SD карта'] },
    { key: 'Capacity',  label: '📦 Капацитет',         values: ['256 GB','512 GB','1 TB','2 TB','4 TB','8 TB+'] },
    { key: 'Interface', label: '🔌 Интерфейс',         values: ['USB-C','USB-A','Thunderbolt','Ethernet'] },
  ],
  accessories: [
    { key: 'Type',   label: '📦 Тип аксесоар',         values: ['Чанта','Кабел','Зарядно','Хъб','Докинг','Смарт часовник','Смартфон','Таблет','Тонколона','Телевизор'] },
    { key: 'Connection', label: '🔗 Връзка',           values: ['USB-A','USB-C','Bluetooth','WiFi','HDMI'] },
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
  const specs = (subcat && subcat !== 'all' && SUBCAT_SPEC_FILTERS[subcat])
    ? SUBCAT_SPEC_FILTERS[subcat]
    : CAT_SPEC_FILTERS[cat];
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
    gaming_mon:   () => all.includes('hz') && (parseInt(all.match(/(\d+)hz/)?.[1]||0) >= 144 || all.includes('144') || all.includes('165') || all.includes('240') || all.includes('360')),
    mon_4k:       () => all.includes('4k') || all.includes('uhd') || all.includes('3840') || all.includes('4к'),
    ultrawide:    () => all.includes('ultrawide') || all.includes('ultra-wide') || all.includes('34"') || all.includes('49"') || all.includes('21:9') || all.includes('32:9'),
    oled_mon:     () => all.includes('oled'),
    office_mon:   () => !all.includes('gaming') && !all.includes('oled') && (p.price / (typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583)) < 600,
    // Components
    cpu:           () => all.includes('процесор') || all.includes('processor') || all.includes('cpu') || all.includes('ryzen') || all.includes('core i') || all.includes('core ultra'),
    gpu:           () => all.includes('видеокарт') || all.includes('gpu') || all.includes('geforce') || all.includes('radeon') || all.includes('rtx') || all.includes('rx 6') || all.includes('rx 7') || all.includes('arc'),
    ram:           () => all.includes(' ram') || all.includes('памет') || all.includes('ddr4') || all.includes('ddr5') || all.includes('dimm') || all.includes('sodimm'),
    ssd_hdd:       () => all.includes('ssd') || all.includes('hdd') || all.includes('nvme') || all.includes('диск') || all.includes('m.2'),
    ssd:           () => all.includes('ssd') || all.includes('nvme') || all.includes('m.2') || all.includes('solid state'),
    hdd:           () => (all.includes('hdd') || all.includes('hard drive') || all.includes('твърд диск') || all.includes(' hd ')) && !all.includes('ssd') && !all.includes('nvme'),
    motherboard:   () => all.includes('дънна') || all.includes('motherboard') || all.includes('mainboard') || all.includes('платка'),
    psu:           () => all.includes('захранван') || all.includes('psu') || all.includes('power supply') || all.includes(' w ') || (all.includes('watt') && !all.includes('battery')),
    case_cooling:  () => all.includes('кутия') || all.includes('chassis') || all.includes('case') || all.includes('охлади') || all.includes('cooler') || all.includes('cooling'),
    case:          () => all.includes('кутия') || all.includes('chassis') || (all.includes('case') && !all.includes('cooler') && !all.includes('cooling')),
    cooling:       () => all.includes('охлади') || all.includes('cooler') || all.includes('cooling') || all.includes('fan') || all.includes('вентилатор') || all.includes('water cool') || all.includes('aio cooler'),
    // Peripherals
    monitor:       () => (normalizeCat(p.cat) === 'peripherals') && (all.includes('монитор') || all.includes('monitor') || (all.includes('hz') && (all.includes('ips') || all.includes('oled') || all.includes('va') || all.includes('qhd') || all.includes('4k') || all.includes('1440')))),
    keyboard:      () => all.includes('клавиатур') || all.includes('keyboard'),
    mouse:         () => all.includes('мишк') || all.includes('mouse') || all.includes('trackpad'),
    headphones:    () => all.includes('слушалк') || all.includes('headphone') || all.includes('headset') || all.includes('earphone') || all.includes('earbud'),
    webcam:        () => all.includes('webcam') || all.includes('уеб камер') || all.includes('web camera'),
    printer:       () => all.includes('принтер') || all.includes('printer') || all.includes('лазер') || all.includes('laser') || all.includes('mfp'),
    // Network
    router:        () => all.includes('router') || all.includes('рутер') || all.includes('ax') || all.includes('wi-fi'),
    switch:        () => all.includes('switch') || all.includes('суич'),
    ap:            () => all.includes('access point') || all.includes('ap ') || all.includes('точка за достъп'),
    mesh:          () => all.includes('mesh') || all.includes('deco') || all.includes('orbi'),
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

function readURLParams() {
  const params = new URLSearchParams(location.search);
  if (params.get('cat') && params.get('cat') !== 'all') {
    currentFilter = params.get('cat');
    // Activate correct pill
    const pill = document.querySelector(`.filter-pill[onclick*="'${currentFilter}'"]`);
    if (pill) { document.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active')); pill.classList.add('active'); }
  }
  if (params.get('sort')) { currentSort = params.get('sort'); const sel = document.querySelector('.sort-select'); if(sel) sel.value = currentSort; }
  if (params.get('brand')) { params.get('brand').split(',').forEach(b => { advFilterBrands.add(b); const cb = document.querySelector(`#brandFilterList input[value="${b}"]`); if(cb) cb.checked=true; }); }
  if (params.get('rating')) { advFilterRating = parseFloat(params.get('rating')); const rb = document.querySelector(`input[name="ratingFilter"][value="${advFilterRating}"]`); if(rb) rb.checked=true; }
  if (params.get('sale') === '1') { advFilterSaleOnly=true; const el=document.getElementById('saleOnlyToggle'); if(el) el.checked=true; }
  if (params.get('new') === '1') { advFilterNewOnly=true; const el=document.getElementById('newOnlyToggle'); if(el) el.checked=true; }
  if (params.get('sub')) { currentSubcat = params.get('sub'); }
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
      // Activate subcat pill if ?sub= param was present
      if (currentSubcat && currentSubcat !== 'all') {
        const subPill = document.querySelector(`.subcat-pill[onclick*="'${currentSubcat}'"]`);
        if (subPill) { document.querySelectorAll('.subcat-pill').forEach(p => p.classList.remove('active')); subPill.classList.add('active'); }
      }
      if (typeof renderCatSpecFilters === 'function') renderCatSpecFilters(currentFilter);
      if (typeof bcOnFilterCat === 'function') bcOnFilterCat(currentFilter);
    }
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
      <div class="mega-col-title" onclick="openCatPage('${cat}'); applySubcatById('${col.id}')">${col.title}</div>
      ${col.items.map(item => `<span class="mega-item" onclick="openCatPage('${cat}'); applySubcatById('${col.id}')">${item}</span>`).join('')}
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
