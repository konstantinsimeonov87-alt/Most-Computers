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
          <span class="sb-rv-title"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" style="display:inline-block;vertical-align:-1px;margin-right:5px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Наскоро разгледани</span>
          <button type="button" class="sb-rv-clear" data-action="clearRecentlyViewed">Изчисти</button>
        </div>
        ${items.slice(0, 5).map(p => {
          const _safeName = escHtml(p.name || '');
          const _safeImg = p.img && isSafeImgUrl(p.img) ? escHtml(p.img) : null;
          return `<div class="sb-rv-item" onclick="openProductPage(${p.id})">
            ${_safeImg
              ? `<img class="sb-rv-thumb" src="${_safeImg}" alt="${_safeName}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="sb-rv-emoji" style="display:none">${p.emoji||''}</span>`
              : `<span class="sb-rv-emoji">${p.emoji||''}</span>`}
            <div class="sb-rv-info">
              <div class="sb-rv-name">${_safeName}</div>
              <div class="sb-rv-price">${fmtEur(p.price)}</div>
            </div>
          </div>`;
        }).join('')}`;
    }
  }

  // M-3: Show bottom section for return visitors with ≥3 items
  const section = document.getElementById('recentlyViewedSection');
  if (section) {
    if (items.length >= 3) {
      const rvScroll = document.getElementById('rvScroll');
      if (rvScroll) {
        rvScroll.innerHTML = items.slice(0, 8).map(p => {
          const _safeName = escHtml(p.name || '');
          const _safeImg = p.img && isSafeImgUrl(p.img) ? escHtml(p.img) : null;
          return `<div class="rv-card" onclick="openProductPage(${p.id})" role="button" tabindex="0" aria-label="${_safeName}">
            <div class="rv-card-img">
              ${_safeImg
                ? `<img src="${_safeImg}" alt="${_safeName}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="rv-card-emoji" style="display:none">${p.emoji||''}</span>`
                : `<span class="rv-card-emoji">${p.emoji||''}</span>`}
            </div>
            <div class="rv-card-name">${_safeName.length > 40 ? _safeName.substring(0,40)+'…' : _safeName}</div>
            <div class="rv-card-price">${fmtEur(p.price)}</div>
          </div>`;
        }).join('');
      }
      section.style.display = '';
      section.removeAttribute('aria-hidden');
    } else {
      section.style.display = 'none';
      section.setAttribute('aria-hidden', 'true');
    }
  }
}

function clearRecentlyViewed() {
  recentlyViewed = [];
  try { localStorage.removeItem('mc_rv'); } catch(e){}
  const wrap = document.getElementById('sidebarRecentlyViewed');
  if (wrap) wrap.style.display = 'none';
  const section = document.getElementById('recentlyViewedSection');
  if (section) section.style.display = 'none';
  showToast('История изчистена');
}

// renderRecentlyViewed called in main.js after DOMContentLoaded
