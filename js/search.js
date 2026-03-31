// ===== LIVE SEARCH SYSTEM =====
let recentSearches = [];
try { recentSearches = JSON.parse(localStorage.getItem('mc_recent') || '[]'); } catch(e) { localStorage.removeItem('mc_recent'); }
let searchFocusIdx = -1;
let searchDebounce = null;

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
  return products.filter(p => (!catFilter || p.cat === catFilter) && matchesQuery(p, q));
}

// Detect if query looks like SKU or EAN
function queryType(q) {
  if (/^\d{8,14}$/.test(q.trim())) return 'ean';
  if (/^mc-/i.test(q.trim())) return 'sku';
  return 'text';
}

function renderDropdown(query) {
  const cat = document.getElementById('searchCat').value;
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
             <div class="sd-recent-chip" onclick="applyRecentSearch('${s}')">
               🔍 ${s}
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
    if (qtype === 'ean') hint = '<div class="sd-empty-sub">Търсенето по EAN не намери продукт с баркод <strong>' + q + '</strong></div>';
    else if (qtype === 'sku') hint = '<div class="sd-empty-sub">Търсенето по SKU не намери продукт с код <strong>' + q + '</strong></div>';
    else hint = '<div class="sd-empty-sub">Провери правописа или опитай с SKU / EAN баркод</div>';
    searchDropdown.innerHTML = `
      <div class="sd-empty">
        <div class="sd-empty-icon">🔍</div>
        <div class="sd-empty-text">Няма резултати за "<strong>${q}</strong>"</div>
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
              <span class="sd-brand">${p.brand}</span>
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
  openProductModal(id);
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

  const cat = document.getElementById('searchCat').value;
  let results = searchProducts(query, cat);
  const page = document.getElementById('searchResultsPage');
  document.getElementById('srpQuery').textContent = `"${query}"`;
  document.getElementById('srpCount').textContent = `${results.length} резултата`;
  // Breadcrumb
  const srpBc = document.getElementById('srpBreadcrumb');
  if (srpBc) srpBc.innerHTML = `<span class="srp-bc-item" onclick="closeSearchPage()">Начало</span><span class="srp-bc-sep">›</span><span class="srp-bc-item">Търсене</span><span class="srp-bc-sep">›</span><span class="srp-bc-current">${query}</span>`;

  // Category filter pills for SRP
  const cats = [...new Set(results.map(p => p.cat))];
  const catLabels = {audio:'Аудио',mobile:'Телефони',laptop:'Лаптопи',tablet:'Таблети',tv:'Телевизори',camera:'Камери',gaming:'Гейминг',smart:'Smart Home',network:'Мрежа',acc:'Аксесоари',print:'Принтери',components:'Компоненти',monitor:'Монитори',desktop:'Десктопи',storage:'Съхранение'};
  var _el_srpFilters=document.getElementById('srpFilters'); if(_el_srpFilters) _el_srpFilters.innerHTML = `
    <button type="button" class="srp-filter-pill active" onclick="srpFilter(this,'',${JSON.stringify(query)})">Всички (${results.length})</button>
    ${cats.map(c => `<button type="button" class="srp-filter-pill" onclick="srpFilter(this,'${c}',${JSON.stringify(query)})">${catLabels[c]||c} (${results.filter(p=>p.cat===c).length})</button>`).join('')}
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

function srpFilter(btn, cat, query) {
  document.querySelectorAll('.srp-filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const results = searchProducts(query, cat);
  document.getElementById('srpCount').textContent = `${results.length} резултата`;
  renderSRPGrid(results, query);
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
  if (!e.target.closest('.search-wrap')) closeSearchDropdown();
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

