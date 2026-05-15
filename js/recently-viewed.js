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

  // Hero compact widget (top-right, next to Препоръчано/Бестселър)
  const heroWrap = document.getElementById('heroRvWidget');
  const heroList = document.getElementById('heroRvList');
  if (heroWrap && heroList) {
    if (!items.length) {
      heroWrap.style.display = 'none';
    } else {
      heroWrap.style.display = '';
      heroList.innerHTML = items.slice(0, 5).map(p => {
        const _safeName = escHtml(p.name || '');
        const _safeImg = p.img && isSafeImgUrl(p.img) ? escHtml(p.img) : null;
        return `<div class="hero-rv-item" onclick="openProductPage(${p.id})">
          ${_safeImg
            ? `<img class="hero-rv-thumb" src="${_safeImg}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="hero-rv-emoji-sm" style="display:none">${p.emoji||''}</span>`
            : `<span class="hero-rv-emoji-sm">${p.emoji||''}</span>`}
          <div style="flex:1;min-width:0">
            <div class="hero-rv-name">${_safeName}</div>
            <div class="hero-rv-price">${fmtEur(p.price)}</div>
          </div>
        </div>`;
      }).join('');
    }
  }

  // Legacy bottom section — always hidden (superseded by hero widget)
  const section = document.getElementById('recentlyViewedSection');
  if (section) section.style.display = 'none';
}

function clearRecentlyViewed() {
  recentlyViewed = [];
  try { localStorage.removeItem('mc_rv'); } catch(e){}
  const heroWrap = document.getElementById('heroRvWidget');
  if (heroWrap) heroWrap.style.display = 'none';
  const section = document.getElementById('recentlyViewedSection');
  if (section) section.style.display = 'none';
  showToast('🗑 История изчистена');
}

// renderRecentlyViewed called in main.js after DOMContentLoaded
