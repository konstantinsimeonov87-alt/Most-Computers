// ===== XSS ESCAPE HELPER =====
function _esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ===== GALLERY STATE =====
let galleryImages = [], galleryIdx = 0;

function getProductImages(p) {
  const imgs = [];
  const seen = new Set();

  // Use gallery[] array if present (from XML import), else fall back to img
  const sources = (Array.isArray(p.gallery) && p.gallery.length)
    ? p.gallery
    : (p.img ? [p.img] : []);

  sources.forEach((src, i) => {
    if (src && !seen.has(src)) {
      seen.add(src);
      imgs.push({ src, label: i === 0 ? 'Основна' : `Изглед ${i + 1}` });
    }
  });

  // Always add emoji fallback as last "image"
  imgs.push({ src: null, emoji: p.emoji, label: 'Икона' });
  return imgs;
}

function renderGallery(p, idx=0) {
  galleryImages = getProductImages(p);
  galleryIdx = Math.min(idx, galleryImages.length - 1);
  const imgEl = document.getElementById('modalImg');
  const emojiEl = document.getElementById('modalEmoji');
  const thumbsEl = document.getElementById('modalThumbs');
  const cur = galleryImages[galleryIdx];

  // Show/hide nav arrows
  const prev = document.getElementById('modalNavPrev');
  const next = document.getElementById('modalNavNext');
  if (prev) prev.style.display = galleryImages.length > 1 ? '' : 'none';
  if (next) next.style.display = galleryImages.length > 1 ? '' : 'none';

  // Main image
  if (cur.src) {
    imgEl.style.display = 'block'; emojiEl.style.display = 'none';
    imgEl.src = cur.src; imgEl.alt = p.name;
    imgEl.classList.add('img-loaded');
    imgEl.onerror = () => {
      imgEl.style.display='none'; emojiEl.style.display='block';
      emojiEl.textContent = p.emoji;
      // Remove this thumb from gallery
      galleryImages[galleryIdx] = { src:null, emoji:p.emoji, label:'Икона' };
      renderThumbs(p);
    };
  } else {
    imgEl.style.display = 'none'; emojiEl.style.display = 'block';
    emojiEl.textContent = cur.emoji || p.emoji;
  }
  renderThumbs(p);
}

function renderThumbs(p) {
  const thumbsEl = document.getElementById('modalThumbs');
  if (!thumbsEl || galleryImages.length <= 1) { if(thumbsEl) thumbsEl.innerHTML=''; return; }
  thumbsEl.innerHTML = galleryImages.map((img, i) =>
    `<div class="modal-thumb ${i===galleryIdx?'active':''}" onclick="switchGalleryImg(${i})">
      ${img.src
        ? `<img src="${img.src}" alt="${p.name}" onerror="this.parentElement.style.display='none'">`
        : `<span class="modal-thumb-emoji">${img.emoji||p.emoji}</span>`}
    </div>`
  ).join('');
}

function switchGalleryImg(idx) {
  const p = products.find(x=>x.id===modalProductId); if(!p) return;
  const imgEl = document.getElementById('modalImg');
  imgEl.classList.add('fading');
  setTimeout(() => {
    galleryIdx = idx;
    renderGallery(p, idx);
    imgEl.classList.remove('fading');
  }, 200);
}

function galleryNav(dir) {
  const total = galleryImages.length;
  switchGalleryImg((galleryIdx + dir + total) % total);
}

function openProductModal(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  modalProductId=id;modalQtyVal=1;

  // Track recently viewed
  addToRecentlyViewed(id);

  // Gallery
  renderGallery(p, 0);

  document.getElementById('modalBrand').textContent=p.brand;
  document.getElementById('modalName').textContent=p.name;
  document.getElementById('modalStars').textContent=starsHTML(p.rating);
  document.getElementById('modalRv').textContent=`${p.rating} (${p.rv} ревюта)`;
  const pe=document.getElementById('modalPrice');
  pe.innerHTML=fmtPrice(p.price, p.badge==='sale'?'sale':'');
  pe.className='modal-price'+(p.badge==='sale'?' sale':'');
  const oe=document.getElementById('modalOld'),se=document.getElementById('modalSave');
  if(p.old){oe.textContent=fmtEur(p.old)+' / '+fmtBgn(p.old);se.textContent='-'+Math.round((p.old-p.price)/p.old*100)+'%';se.style.display='';}else{oe.textContent='';se.style.display='none';}
  document.getElementById('modalMonthly').innerHTML='';
  document.getElementById('modalQty').textContent='1';
  document.getElementById('modalSpecs').innerHTML=Object.keys(p.specs).slice(0,4).map(k=>`<div class="spec-chip"><div class="spec-chip-key">${k}</div><div class="spec-chip-val">${p.specs[k]}</div></div>`).join('');
  let b='';if(p.badge==='sale')b+='<span class="badge badge-sale">Промо</span>';if(p.badge==='new')b+='<span class="badge badge-new">Ново</span>';if(p.badge==='hot')b+='<span class="badge badge-hot">Горещо</span>';
  document.getElementById('modalBadges').innerHTML=b;
  document.getElementById('modalDesc').textContent=p.desc;
  var _el_modalSpecsFull=document.getElementById('modalSpecsFull'); if(_el_modalSpecsFull) _el_modalSpecsFull.innerHTML =
    `<div class="spec-chip"><div class="spec-chip-key">SKU</div><div class="spec-chip-val mono-12">${p.sku}</div></div>` +
    `<div class="spec-chip"><div class="spec-chip-key">EAN</div><div class="spec-chip-val mono-12">${p.ean}</div></div>` +
    Object.entries(p.specs).map(([k,v])=>`<div class="spec-chip"><div class="spec-chip-key">${k}</div><div class="spec-chip-val">${v}</div></div>`).join('');
  document.getElementById('modalReviews').innerHTML=p.reviews.map(r=>`<div class="review-item"><div class="review-header"><span class="review-name">${_esc(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_esc(r.date)}</span></div><div class="review-text">${_esc(r.text)}</div></div>`).join('');
  switchTab('desc');
  document.getElementById('productModalBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeProductModal(e){if(e.target===e.currentTarget)closeProductModalDirect();}
function closeProductModalDirect(){
  document.getElementById('productModalBackdrop').classList.remove('open');
  document.body.style.overflow='';
  // Restore title if no category page is open
  if (!document.getElementById('catPage')?.classList.contains('open') && !document.getElementById('pdpBackdrop')?.classList.contains('open')) {
    document.title = 'Most Computers — Техника и Електроника';
  }
}
function switchTab(tab){
  document.querySelectorAll('.modal-tab').forEach((t,i)=>t.classList.toggle('active',['desc','specs','reviews'][i]===tab));
  document.querySelectorAll('.modal-tab-content').forEach(c=>c.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
}
function changeModalQty(d){modalQtyVal=Math.max(1,modalQtyVal+d);document.getElementById('modalQty').textContent=modalQtyVal;}
function addFromModal(){
  if(!modalProductId)return;const p=products.find(x=>x.id===modalProductId);if(!p)return;
  const ex=cart.find(x=>x.id===modalProductId);if(ex){ex.qty+=modalQtyVal;}else{cart.push({...p,qty:modalQtyVal});}
  updateCart();const btn=document.getElementById('modalAddBtn');
  btn.innerHTML='✓ Добавен!';btn.style.background='var(--new)';
  setTimeout(()=>{btn.innerHTML='🛒 Добави в кошница';btn.style.background='';},2000);
  showToast(`✓ ${p.name.substring(0,32)}... добавен!`);
}

// COMPARE
function toggleCompare(id,checked){
  if(checked){
    const p = products.find(x=>x.id===id);
    if(compareList.length>0){
      const firstCat = products.find(x=>x.id===compareList[0])?.cat;
      if(p.cat !== firstCat){ showToast('⚠️ Можеш да сравняваш само продукти от една и съща категория!'); return; }
    }
    if(compareList.length>=3){showToast('Максимум 3 продукта за сравнение!');return;}
    if(!compareList.includes(id))compareList.push(id);
  }
  else{compareList=compareList.filter(x=>x!==id);}
  // Update button visual state
  const btn=document.getElementById('cmp-btn-'+id);
  if(btn) btn.style.background=compareList.includes(id)?'var(--primary-light)':'var(--bg)';
  updateCompareBar();
}
function updateCompareBar(){
  const bar=document.getElementById('compareBar');
  const preview=document.getElementById('comparePreview');
  const cnt=document.getElementById('compareCnt');
  if(compareList.length===0){bar.classList.remove('visible');return;}
  bar.classList.add('visible');
  if(cnt) cnt.textContent=compareList.length;
  let html='';
  for(let i=0;i<3;i++){
    if(i<compareList.length){const p=products.find(x=>x.id===compareList[i]);if(!p){compareList.splice(i,1);updateCompareBar();return;}html+=`<div class="compare-slot filled"><span class="compare-slot-emoji">${p.emoji}</span><span class="compare-slot-name">${p.name.length>22?p.name.slice(0,22)+'…':p.name}</span><button type="button" class="compare-slot-remove" onclick="removeCompare(${p.id})">×</button></div>`;}
    else html+=`<div class="compare-slot"><span style="color:rgba(255,255,255,0.4);font-size:11px;">+ Добави продукт</span></div>`;
  }
  if(preview) preview.innerHTML=html;
}

function openComparePage(){
  if(compareList.length<2){showToast('Избери поне 2 продукта за сравнение!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('Избери поне 2 налични продукта!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs||{})))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));
  let html=`<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">`;
  html+=`<thead><tr><th style="text-align:left;padding:12px;background:var(--bg2);border-radius:8px 0 0 0;">Продукт</th>`;
  prods.forEach(p=>html+=`<td style="padding:16px;text-align:center;background:var(--bg2);border-left:1px solid var(--border);"><span style="font-size:36px;display:block;margin-bottom:8px;">${p.emoji}</span><div style="font-weight:800;font-size:14px;margin-bottom:4px;">${p.name}</div><div style="font-size:18px;font-weight:900;color:var(--primary);">${fmtEur(p.price)}</div><div style="font-size:11px;color:var(--muted);">${fmtBgn(p.price)}</div><button type="button" onclick="addToCart(${p.id})" style="margin-top:10px;background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;">🛒 Добави</button></td>`);
  html+=`</tr></thead><tbody>`;
  html+=`<tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Цена</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.price===minP?'background:var(--primary-light);font-weight:800;color:var(--primary);':''}">${fmtEur(p.price)}</td>`);
  html+=`</tr><tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Рейтинг</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.rating===maxR?'background:var(--primary-light);font-weight:800;':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;
  allKeys.forEach(k=>{
    html+=`<tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);color:var(--muted);font-weight:600;">${k}</th>`;
    prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);">${(p.specs||{})[k]||'—'}</td>`);
    html+=`</tr>`;
  });
  html+=`</tbody></table></div>`;
  document.getElementById('compareTable').innerHTML=html;
  document.getElementById('comparePage').style.display='block';
  document.body.style.overflow='hidden';
}
function removeCompare(id){compareList=compareList.filter(x=>x!==id);const btn=document.getElementById('cmp-btn-'+id);if(btn)btn.style.background='var(--bg)';updateCompareBar();}
function clearCompare(){compareList.forEach(id=>{const cb=document.getElementById('cmp-'+id);if(cb)cb.checked=false;});compareList=[];updateCompareBar();}
function openCompareModal(){
  if(compareList.length<2){showToast('Избери поне 2 продукта!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('Избери поне 2 налични продукта!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs)))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));
  let html=`<thead><tr><th>Продукт</th>`;
  prods.forEach(p=>html+=`<td class="cmp-product-header"><span class="cmp-emoji">${p.emoji}</span><div class="cmp-name">${p.name}</div><div class="cmp-price">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></div><button type="button" class="cmp-add-btn" onclick="addToCart(${p.id})">🛒 Добави</button></td>`);
  html+=`</tr></thead><tbody><tr><th>Цена</th>`;
  prods.forEach(p=>html+=`<td class="${p.price===minP?'cmp-highlight':''}">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></td>`);
  html+=`</tr><tr><th>Рейтинг</th>`;
  prods.forEach(p=>html+=`<td class="${p.rating===maxR?'cmp-highlight':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;
  allKeys.forEach(k=>{html+=`<tr><th>${k}</th>`;prods.forEach(p=>html+=`<td>${p.specs[k]||'—'}</td>`);html+=`</tr>`;});
  html+=`</tbody>`;
  document.getElementById('compareTableModal').innerHTML=html;
  document.getElementById('compareModalBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeCompareModal(e){if(e.target===e.currentTarget)closeCompareModalDirect();}
function closeCompareModalDirect(){document.getElementById('compareModalBackdrop').classList.remove('open');document.body.style.overflow='';}

// QUICK ORDER
function openQuickOrder(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  quickOrderProductId=id;
  document.getElementById('qoEmoji').textContent=p.emoji;
  document.getElementById('qoName').textContent=p.name;
  document.getElementById('qoPrice').textContent=fmtEur(p.price)+' / '+fmtBgn(p.price);
  document.getElementById('qoFormWrap').style.display='';
  document.getElementById('qoSuccess').classList.remove('show');
  ['qoName2','qoPhone','qoCity','qoAddr','qoNote'].forEach(fid=>{const el=document.getElementById(fid);if(el){el.value='';el.classList.remove('error');}});
  document.getElementById('quickOrderBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeQuickOrder(e){if(e.target===e.currentTarget)closeQuickOrderDirect();}
function closeQuickOrderDirect(){document.getElementById('quickOrderBackdrop').classList.remove('open');document.body.style.overflow='';}
function selectDelivery(el){document.querySelectorAll('.qo-delivery-opt').forEach(o=>o.classList.remove('selected'));el.classList.add('selected');}
function submitQuickOrder(){
  let ok=true;
  ['qoName2','qoPhone','qoCity','qoAddr'].forEach(fid=>{const el=document.getElementById(fid);if(!el.value.trim()){el.classList.add('error');ok=false;}else el.classList.remove('error');});
  if(!ok){showToast('Попълни всички задължителни полета!');return;}
  document.getElementById('qoFormWrap').style.display='none';
  document.getElementById('qoSuccess').classList.add('show');
  showToast('Поръчката е изпратена успешно!');
  setTimeout(closeQuickOrderDirect,4000);
}

// SLIDER
let currentSlide=0;
const slides=document.querySelectorAll('.slide'),dots=document.querySelectorAll('.dot');
function goSlide(n){if(!slides.length||!slides[n])return;slides[currentSlide].classList.remove('active');dots[currentSlide].classList.remove('active');currentSlide=n;slides[currentSlide].classList.add('active');dots[currentSlide].classList.add('active');}
let _heroSliderIv=null;
if(slides.length){if(_heroSliderIv)clearInterval(_heroSliderIv);_heroSliderIv=setInterval(()=>goSlide((currentSlide+1)%slides.length),5000);}

// COUNTDOWN — persistent across page reloads via localStorage
(function(){
  const DURATION = 4*3600; // 4 hours flash sale window
  let endTs = 0;
  try { endTs = parseInt(localStorage.getItem('mc_flash_end')||'0'); } catch(e) {}
  if(!endTs || Date.now() > endTs) {
    endTs = Date.now() + DURATION*1000;
    try { localStorage.setItem('mc_flash_end', endTs); } catch(e) {}
  }
  function tick(){
    let totalSecs = Math.max(0, Math.floor((endTs - Date.now())/1000));
    const th=document.getElementById('th'),tm=document.getElementById('tm'),ts=document.getElementById('ts');
    if(th) th.textContent=String(Math.floor(totalSecs/3600)).padStart(2,'0');
    if(tm) tm.textContent=String(Math.floor((totalSecs%3600)/60)).padStart(2,'0');
    if(ts) ts.textContent=String(totalSecs%60).padStart(2,'0');
    if(totalSecs===0){ localStorage.removeItem('mc_flash_end'); }
  }
  tick();
  if(window._countdownIv)clearInterval(window._countdownIv);
  window._countdownIv=setInterval(tick,1000);
})();

// TOAST
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2800);}

