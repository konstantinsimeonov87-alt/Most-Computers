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
  const _esc = typeof escHtml === 'function' ? escHtml : s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const safe = _esc(String(text));
  if (!query) return safe;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
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
            <div class="sd-name">${highlightMatch(p.name, q)}</div>
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
  const page = document.getElementById('searchResultsPage');
  const allResults = searchProducts(query, '');

  // Idea 1: Dynamic price range from actual results
  let realMax = 5000;
  if (allResults.length > 0) {
    const prices = allResults.map(p => p.price);
    realMax = Math.max(Math.ceil(Math.max(...prices) / 100) * 100, 100);
  }

  // Idea 7: Restore previous state if same query
  const saved = _srpRestoreState(query);
  if (saved && saved.absMax === realMax) {
    srpCurrentQuery = query; srpCurrentCatFilter = saved.cat;
    srpPriceAbsMax = saved.absMax; srpPriceMinVal = saved.min; srpPriceMaxVal = saved.max;
  } else {
    srpCurrentQuery = query; srpCurrentCatFilter = '';
    srpPriceAbsMax = realMax; srpPriceMinVal = 0; srpPriceMaxVal = realMax;
  }
  _srpQuery = srpCurrentQuery;

  // Inline search bar
  const srpInput = document.getElementById('srpSearchInput');
  const srpClear = document.getElementById('srpSearchClear');
  if (srpInput) {
    srpInput.value = query;
    if (srpClear) srpClear.classList.toggle('visible', query.length > 0);
    srpInput.oninput = function() { if (srpClear) srpClear.classList.toggle('visible', this.value.length > 0); };
    srpInput.onkeydown = function(e) { if (e.key === 'Enter' && this.value.trim()) showSearchResultsPage(this.value.trim()); };
  }
  if (srpClear) {
    srpClear.onclick = function() { if (srpInput) { srpInput.value = ''; srpInput.focus(); } srpClear.classList.remove('visible'); };
  }

  // Category pills with data-label for dynamic count updates
  const cats = [...new Set(allResults.map(p => normalizeCat(p.cat)))];
  const catLabels = {phones:'Телефони и таблети',laptops:'Лаптопи',desktops:'Десктопи',gaming:'Гейминг',monitors:'Монитори',components:'Компоненти',peripherals:'Периферия',network:'Мрежа',storage:'Съхранение',accessories:'Аксесоари',software:'Софтуер'};
  const el_srpFilters = document.getElementById('srpFilters');
  if (el_srpFilters) {
    el_srpFilters.innerHTML =
      `<button type="button" class="srp-filter-pill${srpCurrentCatFilter===''?' active':''}" data-cat="" data-label="Всички" onclick="srpFilter(this,'')">Всички <span class="pill-cnt">(${allResults.length})</span></button>` +
      cats.map(c => {
        const n = allResults.filter(p => normalizeCat(p.cat) === c).length;
        const label = catLabels[c] || c;
        return `<button type="button" class="srp-filter-pill${srpCurrentCatFilter===c?' active':''}" data-cat="${escHtml(c)}" data-label="${escHtml(label)}" onclick="srpFilter(this,'${escHtml(c)}')">${escHtml(label)} <span class="pill-cnt">(${n})</span></button>`;
      }).join('') +
      `<button type="button" class="srp-filter-pill srp-reset-btn" id="srpResetBtn" onclick="srpResetFilters()" style="display:none" aria-label="Нулирай филтрите">✕ Нулирай</button>`;
  }

  // Price slider: set dynamic range
  const rate = typeof EUR_RATE !== 'undefined' ? EUR_RATE : 1.95583;
  const mn = document.getElementById('priceMin'), mx = document.getElementById('priceMax');
  if (mn) { mn.max = srpPriceAbsMax; mn.value = srpPriceMinVal; }
  if (mx) { mx.max = srpPriceAbsMax; mx.value = srpPriceMaxVal; }
  const mnNum = document.getElementById('srpMinNum'), mxNum = document.getElementById('srpMaxNum');
  if (mnNum) { mnNum.max = Math.round(srpPriceAbsMax/rate); mnNum.value = Math.round(srpPriceMinVal/rate); }
  if (mxNum) { mxNum.max = Math.round(srpPriceAbsMax/rate); mxNum.value = Math.round(srpPriceMaxVal/rate); }
  const pct = n => srpPriceAbsMax > 0 ? Math.round(n/srpPriceAbsMax*100) : 0;
  const rng = document.getElementById('sliderRange');
  if (rng) { rng.style.left=pct(srpPriceMinVal)+'%'; rng.style.width=(pct(srpPriceMaxVal)-pct(srpPriceMinVal))+'%'; }
  const pv = document.getElementById('srpPriceVals');
  if (pv) pv.textContent = fmtEur(srpPriceMinVal) + ' — ' + fmtEur(srpPriceMaxVal);
  const pf = document.getElementById('srpPriceFilter');
  if (pf) pf.style.display = '';

  // Render grid with all active filters applied
  const filtered = allResults
    .filter(p => !srpCurrentCatFilter || normalizeCat(p.cat) === srpCurrentCatFilter)
    .filter(p => p.price >= srpPriceMinVal && p.price <= srpPriceMaxVal);
  document.getElementById('srpCount').textContent = `${filtered.length} резултата`;
  renderSRPGrid(filtered, query);
  _srpUpdatePillCounts();
  _srpToggleResetBtn();
  _srpSaveState();

  page.classList.add('open');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

// Idea 2+4+5+7: shared render helper called by both slider and category filter
function _srpRender() {
  const res = searchProducts(srpCurrentQuery, srpCurrentCatFilter)
    .filter(p => p.price >= srpPriceMinVal && p.price <= srpPriceMaxVal);
  const cnt = document.getElementById('srpCount');
  if (cnt) cnt.textContent = res.length + ' резултата';
  renderSRPGrid(res, srpCurrentQuery);
  _srpUpdatePillCounts();
  _srpToggleResetBtn();
  _srpSaveState();
}

// Idea 4: update pill counts based on current price range
function _srpUpdatePillCounts() {
  const allByPrice = searchProducts(srpCurrentQuery, '')
    .filter(p => p.price >= srpPriceMinVal && p.price <= srpPriceMaxVal);
  document.querySelectorAll('.srp-filter-pill[data-cat]').forEach(pill => {
    if (pill.id === 'srpResetBtn') return;
    const cat = pill.dataset.cat;
    const n = cat ? allByPrice.filter(p => normalizeCat(p.cat) === cat).length : allByPrice.length;
    const cntEl = pill.querySelector('.pill-cnt');
    if (cntEl) cntEl.textContent = '(' + n + ')';
    if (cat) { pill.disabled = n === 0; pill.classList.toggle('pill-empty', n === 0); }
  });
}

// Idea 5: show reset button only when filters are non-default
function _srpToggleResetBtn() {
  const btn = document.getElementById('srpResetBtn');
  if (!btn) return;
  const active = srpCurrentCatFilter !== '' || srpPriceMinVal > 0 || srpPriceMaxVal < srpPriceAbsMax;
  btn.style.display = active ? '' : 'none';
}

function srpResetFilters() {
  srpCurrentCatFilter = ''; srpPriceMinVal = 0; srpPriceMaxVal = srpPriceAbsMax;
  const mn = document.getElementById('priceMin'), mx = document.getElementById('priceMax');
  if (mn) mn.value = 0; if (mx) mx.value = srpPriceAbsMax;
  const rate = typeof EUR_RATE !== 'undefined' ? EUR_RATE : 1.95583;
  const mnNum = document.getElementById('srpMinNum'), mxNum = document.getElementById('srpMaxNum');
  if (mnNum) mnNum.value = 0;
  if (mxNum) mxNum.value = Math.round(srpPriceAbsMax/rate);
  const rng = document.getElementById('sliderRange');
  if (rng) { rng.style.left='0%'; rng.style.width='100%'; }
  const pv = document.getElementById('srpPriceVals');
  if (pv) pv.textContent = fmtEur(0) + ' — ' + fmtEur(srpPriceAbsMax);
  document.querySelectorAll('.srp-filter-pill').forEach(b => b.classList.remove('active'));
  const allPill = document.querySelector('.srp-filter-pill[data-cat=""]');
  if (allPill) allPill.classList.add('active');
  _srpRender();
}

// Idea 7: persist and restore filter state per query
function _srpSaveState() {
  try {
    sessionStorage.setItem('mc_srp_state', JSON.stringify({
      q: srpCurrentQuery, cat: srpCurrentCatFilter,
      min: srpPriceMinVal, max: srpPriceMaxVal, absMax: srpPriceAbsMax
    }));
  } catch(e) {}
}

function _srpRestoreState(query) {
  try {
    const s = JSON.parse(sessionStorage.getItem('mc_srp_state') || 'null');
    if (s && s.q === query) return s;
  } catch(e) {}
  return null;
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
  srpCurrentCatFilter = cat;
  _srpRender();
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

