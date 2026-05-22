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
