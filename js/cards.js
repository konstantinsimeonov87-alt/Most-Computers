
function starsHTML(r){return '★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));}

function makeCard(p,small=false){
  const save=p.old?Math.round(((p.old-p.price)/p.old)*100):0;
  const imgHtml = p.img
    ? `<img class="product-img-real" src="${p.img}" alt="${p.name}" itemprop="image" loading="lazy" width="300" height="300" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${p.emoji}</span>`
    : `<span class="product-img-emoji">${p.emoji}</span>`;
  return `<article class="product-card pos-rel" itemscope itemtype="https://schema.org/Product">
    <div class="product-badge-wrap">
      ${p.badge==='sale'?'<span class="badge badge-sale">Промо</span>':''}
      ${p.badge==='new'?'<span class="badge badge-new">Ново</span>':''}
      ${p.badge==='hot'?'<span class="badge badge-hot">Горещо</span>':''}
      ${p.pct>0?`<span class="badge badge-pct">-${p.pct}%</span>`:''}
      ${p.stock===false?'<span class="badge badge-oos">Изчерпан</span>':p.stock!=null&&p.stock<=5?`<span class="badge badge-low">Последни ${p.stock} бр.</span>`:''}
    </div>
    <button class="product-wishlist" id="wl-${p.id}" type="button" onclick="toggleWishlist(${p.id},event)" title="Добави в любими" aria-label="Добави в любими"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart"/></svg></button>
    <a href="?product=${p.id}" class="product-img-wrap${small?' small':''}" onclick="openProductPage(${p.id});return false;" style="cursor:pointer;" aria-label="${p.name}" itemprop="url">
      ${imgHtml}
      ${Object.keys(p.specs||{}).length ? `<div class="card-specs-overlay" aria-hidden="true">${Object.entries(p.specs).slice(0,3).map(([k,v])=>`<div class="cso-row"><span class="cso-key">${k}</span><span class="cso-val">${v}</span></div>`).join('')}</div>` : ''}
    </a>
    <div class="product-body">
      <div class="product-brand" itemprop="brand">${p.brand}</div>
      <h3 class="product-name" itemprop="name"><a href="?product=${p.id}" onclick="openProductPage(${p.id});return false;" style="color:inherit;text-decoration:none;">${p.name}</a></h3>
      <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating} (${p.rv})</span></div>
      <div class="product-footer">
        <div class="price-row">
          <div class="price-current${p.badge==='sale'?' sale':''}" itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="priceCurrency" content="EUR"><link itemprop="availability" href="${p.stock===false?'https://schema.org/OutOfStock':'https://schema.org/InStock'}"><span itemprop="price" content="${p.price}">${fmtPrice(p.price, p.badge==='sale'?'sale':'')}</span></div>
          ${p.old?`<div class="price-old">${fmtEur(p.old)}</div><div class="price-save">-${save}%</div>`:''}
        </div>
        ${p.stock!==false&&p.stock!=null&&p.stock<=5?`<div style="font-size:11px;color:var(--sale);font-weight:700;margin-bottom:5px;">🔥 Последни ${p.stock} бр. в наличност!</div>`:''}
        <div class="card-guarantee-badge">🛡 24 мес. гаранция &nbsp;·&nbsp; ↩ 30 дни връщане</div>
        <button type="button" class="add-cart-btn" id="cb-${p.id}" onclick="addToCart(${p.id})" ${p.stock===false?'disabled':''}><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> ${p.stock===false?'Изчерпан':'Добави в кошница'}</button>
        <div class="row-gap-6" style="margin-top:6px;">
          <button type="button" class="product-quick-view-btn" onclick="openProductModal(${p.id})" title="Бърз преглед" style="flex:1;"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-eye"/></svg><span class="qv-tooltip">Бърз преглед</span></button>
          <button type="button" onclick="openQuickOrder(${p.id})" title="Бърза поръчка" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:9px 10px;transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='var(--bg)'"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-bolt"/></svg> Бърза</button>
          <div class="product-compare-cb"><input type="checkbox" id="cmp-${p.id}" onchange="toggleCompare(${p.id},this.checked)"><label for="cmp-${p.id}">Сравни</label></div>
        </div>
      </div>
    </div>
  </article>`;
}

