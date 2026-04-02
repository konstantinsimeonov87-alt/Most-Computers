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
  let list=currentFilter==='all'?[...products]:products.filter(p=>p.cat===currentFilter);
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
  if(typeof advPriceMin!=='undefined' && (advPriceMin>0 || advPriceMax<2000)){
    list=list.filter(p=>{ const eur=p.price/EUR_RATE; return eur>=advPriceMin && eur<=advPriceMax; });
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
  const _freeDelBgn = 200;
  const _freeDelEur = (_freeDelBgn / EUR_RATE).toFixed(2);
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
      <button type="button" class="mini-promo-view" onclick="event.stopPropagation();openProductModal(${p.id})">Виж →</button>
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
  if(minV > maxV-50){ minV=maxV-50; mn.value=minV; }
  srpPriceMinVal=minV; srpPriceMaxVal=maxV;
  document.getElementById('srpPriceVals').textContent = fmtBgn(minV) + ' — ' + fmtBgn(maxV);
  const rng = document.getElementById('sliderRange');
  if(rng){ rng.style.left=(minV/5000*100)+'%'; rng.style.width=((maxV-minV)/5000*100)+'%'; }
  let res = searchProducts(srpCurrentQuery, srpCurrentCatFilter).filter(p => p.price>=minV && p.price<=maxV);
  document.getElementById('srpCount').textContent = res.length + ' резултата';
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
  const EXCLUDE_BRANDS = new Set(['Apple','Samsung','Sony','TP-Link','Bose','Xiaomi','Google','Dell','Philips','JBL','GoPro','WD','Anker']);
  const EXTRA_BRANDS = ['Nokia','HMD','Koorui','Tenda','Acer','Fortron','Adata','XPG','Kingspec'];
  const brandCounts = {};
  products.forEach(p => { if(p.brand) brandCounts[p.brand] = (brandCounts[p.brand]||0) + 1; });
  const ALL_BRANDS = [
    ...Object.entries(brandCounts).filter(([b]) => !EXCLUDE_BRANDS.has(b)).sort((a,b) => b[1]-a[1]).map(([b]) => b),
    ...EXTRA_BRANDS.filter(b => !brandCounts[b])
  ];
  const el = document.getElementById('brandFilterList');
  if (el) {
    el.innerHTML = ALL_BRANDS.map(b => {
      const c = brandCounts[b];
      return `<label class="brand-filter-item">
        <input type="checkbox" value="${b}" onchange="toggleBrandFilter('${b}',this.checked)">
        <span>${b}</span>
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
  setPriceGroup(0, 2000, 'pg-all');
  clearBrandSearch();
  applyAdvFilters();
}

// Adv filters applied inside getFilteredSorted directly (no override needed)

// Override filterCat to scroll + filter
function filterCat(cat) {
  const pill = document.querySelector(`.filter-pill[onclick*="'${cat}'"]`);
  if (pill) { applyFilter(pill, cat); }
  else { currentFilter = cat; renderTopGrid(); }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
  if (typeof bcOnFilterCat === 'function') bcOnFilterCat(cat);
}

// Init on load
// initSidebarFilters called in DOMContentLoaded

// Export for tests/environment detection

// ===== SIDEBAR PRICE SLIDER =====
let advPriceMin = 0, advPriceMax = 2000, activePriceGroup = 'pg-all';
// EUR_RATE comes from currency.js

function updateSbSlider() {
  const mn = document.getElementById('sbPriceMin');
  const mx = document.getElementById('sbPriceMax');
  if (!mn || !mx) return;
  let minV = parseFloat(mn.value), maxV = parseFloat(mx.value);
  if (minV > maxV - 10) { minV = maxV - 10; mn.value = minV; }
  advPriceMin = minV; advPriceMax = maxV;

  // Update track fill
  const pct1 = (minV/2000)*100, pct2 = (maxV/2000)*100;
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
  const pct1 = (minEur/2000)*100, pct2 = (maxEur/2000)*100;
  const rng = document.getElementById('sbSliderRange');
  if (rng) { rng.style.left=pct1+'%'; rng.style.width=(pct2-pct1)+'%'; }

  // Update label
  const vals = document.getElementById('sbPriceVals');
  if (vals) vals.textContent = minEur === 0 && maxEur === 2000 ? 'Всички цени' : `${minEur} € — ${maxEur} €`;

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
      const eur = p.price / EUR;
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
    { id: 'gaming_pc',    label: '🎮 Геймърски конфигурации' },
    { id: 'office_pc',    label: '💼 Офис компютри' },
    { id: 'workstation',  label: '🔬 Workstation' },
    { id: 'aio',          label: '🖥 All-in-One' },
    { id: 'mac_desktop',  label: '🍎 Mac' },
  ],
  components: [
    { id: 'cpu',          label: '⚙ Процесори' },
    { id: 'gpu',          label: '🎮 Видео карти' },
    { id: 'ram',          label: '🧠 RAM памет' },
    { id: 'ssd_hdd',      label: '💾 SSD / HDD' },
    { id: 'motherboard',  label: '🔩 Дънни платки' },
    { id: 'psu',          label: '⚡ Захранвания' },
    { id: 'case_cooling', label: '🗄 Кутии и охлаждане' },
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
  laptops: [
    { title: 'По предназначение', id: 'work', items: ['За работа', 'За гейминг', 'Ултрабуци', 'Workstation'] },
    { title: 'По марка', id: 'ultrabook', items: ['Apple MacBook', 'Dell XPS', 'ASUS ROG', 'Lenovo ThinkPad', 'HP EliteBook'] },
    { title: 'По бюджет', id: 'budget', items: ['До 500 €', '500–800 €', '800–1500 €', '1500 €+'] },
    { title: 'Use-case', id: 'for_students', items: ['За студенти', 'За програмисти', 'За дизайнери', 'За игри'] },
  ],
  desktops: [
    { title: 'Gaming PC', id: 'gaming_pc', items: ['RTX 4070', 'RTX 4080 / 4090', 'Готови конфигурации', 'AMD Radeon'] },
    { title: 'Офис и Workstation', id: 'office_pc', items: ['Офис компютри', 'Workstation', 'Mac Mini / iMac', 'All-in-One'] },
    { title: 'По марка', id: 'mac_desktop', items: ['Apple', 'ASUS', 'Dell', 'HP', 'Lenovo'] },
  ],
  components: [
    { title: 'Процесори', id: 'cpu', items: ['Intel Core i5/i7/i9', 'Intel Core Ultra', 'AMD Ryzen 5/7/9', 'AMD Threadripper'] },
    { title: 'Видео карти', id: 'gpu', items: ['NVIDIA GeForce RTX 40', 'AMD Radeon RX 7000', 'Работни карти'] },
    { title: 'Памет', id: 'ram', items: ['DDR5 RAM', 'DDR4 RAM', 'SO-DIMM лаптоп'] },
    { title: 'Дискове', id: 'ssd_hdd', items: ['SSD M.2 NVMe', 'SSD SATA', 'HDD 2.5"', 'HDD 3.5"'] },
    { title: 'Дъно и корпус', id: 'motherboard', items: ['Intel LGA1851', 'Intel LGA1700', 'AMD AM5', 'AMD AM4', 'Захранвания', 'Кутии'] },
  ],
  peripherals: [
    { title: 'Монитори', id: 'monitor', items: ['Gaming 144Hz+', '4K UHD', 'QHD 1440p', 'Ultra-Wide', 'OLED'] },
    { title: 'Въвеждане', id: 'keyboard', items: ['Механични клавиатури', 'Геймърски мишки', 'Офис мишки', 'Trackpad'] },
    { title: 'Аудио и видео', id: 'headphones', items: ['Геймърски слушалки', 'Офис слушалки', 'Уеб камери', 'Принтери'] },
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
    { key: 'Type',      label: '📦 Тип компонент',     values: ['Процесор','Видеокарта','RAM','Дънна платка','SSD NVMe','SSD SATA','HDD','Захранване','Кутия'] },
    { key: 'Brand',     label: '🏷 Производител',      values: ['Intel','AMD','NVIDIA','ASUS','MSI','Gigabyte','Corsair','Kingston','Samsung','Seasonic'] },
    { key: 'Socket',    label: '🔩 Сокет / Слот',      values: ['LGA1700','LGA1851','AM4','AM5','DDR4','DDR5','PCIe 4.0','PCIe 5.0'] },
    { key: 'TDP',       label: '🌡 TDP / Мощност',     values: ['35W','65W','105W','125W','170W','450W','550W','650W','750W','850W'] },
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
  renderTopGrid();
}

function renderCatSpecFilters(cat) {
  const block = document.getElementById('catSpecFilterBlock');
  const inner = document.getElementById('catSpecFiltersInner');
  const title = document.getElementById('catSpecTitle');
  if (!block || !inner) return;

  catSpecActiveFilters = {};
  const specs = CAT_SPEC_FILTERS[cat];
  if (!specs || !specs.length) {
    block.style.display = 'none';
    return;
  }

  const CAT_LABELS = {
    laptops:'Лаптопи', desktops:'Настолни компютри', components:'Компоненти',
    peripherals:'Периферия', network:'Мрежово оборудване', storage:'Сървъри и сторидж',
    software:'Софтуер', accessories:'Аксесоари'
  };
  if (title) title.textContent = `⚙ ${CAT_LABELS[cat] || cat} — филтри`;

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
  const name  = (p.name  || '').toLowerCase();
  const desc  = (p.desc  || '').toLowerCase();
  const brand = (p.brand || '').toLowerCase();
  const specsStr = Object.values(p.specs || {}).join(' ').toLowerCase();
  const all = name + ' ' + desc + ' ' + specsStr;

  const rules = {
    // Laptops
    work:          () => all.includes('business') || all.includes('thinkpad') || all.includes('latitude') || all.includes('elitebook') || all.includes('бизнес') || all.includes('xps'),
    gaming_l:      () => all.includes('gaming') || all.includes('rog') || all.includes('rtx') || all.includes('геймърски') || all.includes('republic of gamers'),
    ultrabook:     () => all.includes('ultra') || all.includes('air') || all.includes('slim') || p.price < 3000,
    budget:        () => (p.price / EUR_RATE) < 500,
    convertible:   () => all.includes('2-in-1') || all.includes('2 в 1') || all.includes('convertible') || all.includes('flip') || all.includes('surface pro') || all.includes('yoga'),
    for_students:  () => (p.price / EUR_RATE) < 700 || all.includes('student') || all.includes('студент') || all.includes('chromebook'),
    for_devs:      () => all.includes('thinkpad') || all.includes('xps') || all.includes('macbook pro') || all.includes('linux') || all.includes('програмист'),
    for_design:    () => all.includes('macbook') || all.includes('design') || all.includes('creator') || all.includes('дизайн') || all.includes('retina') || all.includes('4k display'),
    for_gaming:    () => all.includes('gaming') || all.includes('rtx') || all.includes('rog') || all.includes('rx 6') || all.includes('rx 7') || p.cat === 'gaming',
    // Desktops
    gaming_pc:     () => all.includes('gaming') || all.includes('rtx') || all.includes('rog') || all.includes('rx 6') || all.includes('rx 7') || all.includes('геймърски'),
    office_pc:     () => all.includes('office') || all.includes('офис') || all.includes('business') || (p.price/EUR_RATE < 800 && !all.includes('gaming')),
    workstation:   () => all.includes('workstation') || all.includes('xeon') || all.includes('quadro') || p.price > 4000,
    aio:           () => all.includes('all-in-one') || all.includes('aio') || all.includes('imac') || all.includes('моноблок'),
    mac_desktop:   () => brand === 'apple' || all.includes('mac mini') || all.includes('imac') || all.includes('mac studio') || all.includes('mac pro'),
    // Components
    cpu:           () => all.includes('процесор') || all.includes('processor') || all.includes('cpu') || all.includes('ryzen') || all.includes('core i') || all.includes('core ultra'),
    gpu:           () => all.includes('видеокарт') || all.includes('gpu') || all.includes('geforce') || all.includes('radeon') || all.includes('rtx') || all.includes('rx 6') || all.includes('rx 7') || all.includes('arc'),
    ram:           () => all.includes(' ram') || all.includes('памет') || all.includes('ddr4') || all.includes('ddr5') || all.includes('dimm') || all.includes('sodimm'),
    ssd_hdd:       () => all.includes('ssd') || all.includes('hdd') || all.includes('nvme') || all.includes('диск') || all.includes('m.2'),
    motherboard:   () => all.includes('дънна') || all.includes('motherboard') || all.includes('mainboard') || all.includes('платка'),
    psu:           () => all.includes('захранван') || all.includes('psu') || all.includes('power supply') || all.includes(' w ') || (all.includes('watt') && !all.includes('battery')),
    case_cooling:  () => all.includes('кутия') || all.includes('chassis') || all.includes('case') || all.includes('охлади') || all.includes('cooler') || all.includes('cooling'),
    // Peripherals
    monitor:       () => all.includes('монитор') || all.includes('monitor') || all.includes('display') || all.includes('hz') && (all.includes('ips') || all.includes('oled') || all.includes('va') || all.includes('qhd') || all.includes('4k') || all.includes('1440')),
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
  const all = (p.name + ' ' + p.desc + ' ' + specsStr).toLowerCase();
  return keys.every(key => {
    const vals = catSpecActiveFilters[key];
    return [...vals].some(v => all.includes(v.toLowerCase()));
  });
}


// ===== 1. URL PARAMS FOR FILTERS =====
function updateURL() {
  const params = new URLSearchParams();
  if (currentFilter !== 'all') params.set('cat', currentFilter);
  if (currentSort !== 'bestseller') params.set('sort', currentSort);
  if (advFilterBrands.size > 0) params.set('brand', [...advFilterBrands].join(','));
  if (advFilterRating > 0) params.set('rating', advFilterRating);
  if (advFilterSaleOnly) params.set('sale', '1');
  if (advFilterNewOnly) params.set('new', '1');
  if (advPriceMin > 0) params.set('priceMin', advPriceMin);
  if (advPriceMax < 2000) params.set('priceMax', advPriceMax);
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
      if (typeof renderCatSpecFilters === 'function') renderCatSpecFilters(currentFilter);
      if (typeof bcOnFilterCat === 'function') bcOnFilterCat(currentFilter);
    }
    renderTopGrid();
    updateActiveFiltersBar();
  }
  if (params.get('product')) { setTimeout(()=>openProductModal(parseInt(params.get('product'))),400); }
}

// URL + skeleton + carousel hooks — using var to avoid redeclaration
var _urlHooked = false;
if (!_urlHooked) {
  _urlHooked = true;

  var _baseApplyFilter = applyFilter;
  applyFilter = function(btn, cat) { _baseApplyFilter(btn, cat); updateURL(); };

  var _baseApplySort = applySort;
  applySort = function(val) { _baseApplySort(val); updateURL(); };

  var _baseApplyAdvFilters = applyAdvFilters;
  applyAdvFilters = function() { _baseApplyAdvFilters(); updateURL(); };

  var _baseOpenProductModal = openProductModal;
  openProductModal = function(id) {
    showModalSkeleton();
    setTimeout(() => {
      _baseOpenProductModal(id);
      renderRelated(id);
      updateURL();
      document.dispatchEvent(new CustomEvent('mc:productopen', {detail: id}));
    }, 280);
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
  module.exports = { getFilteredSorted, advFilterBrands, renderGrids };
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
  // Find and click the subcat pill with this id
  setTimeout(() => {
    const pill = document.querySelector(`.subcat-pill[onclick*="'${id}'"]`);
    if (pill) { pill.click(); }
  }, 100);
}
