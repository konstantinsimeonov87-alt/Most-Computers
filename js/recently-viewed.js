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
  scroll.innerHTML = items.map(p => {
    const _safeName = escHtml(p.name||'');
    const _safeImg = p.img && isSafeImgUrl(p.img) ? p.img : null;
    return `
    <div class="rv-card" onclick="openProductPage(${p.id})">
      ${_safeImg
        ? `<img class="rv-card-img" src="${escHtml(_safeImg)}" alt="${_safeName}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="rv-card-emoji is-hidden">${p.emoji}</span>`
        : `<span class="rv-card-emoji">${p.emoji}</span>`}
      <div class="rv-card-name">${_safeName}</div>
      <div class="rv-card-price">${fmtEur(p.price)}</div>
    </div>`;
  }).join('');
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

