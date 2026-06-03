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
  if (!total) return;
  switchGalleryImg((galleryIdx + dir + total) % total);
}

function openProductModal(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  modalProductId=id;modalQtyVal=1;

  // Track recently viewed
  addToRecentlyViewed(id);

  // Gallery
  renderGallery(p, 0);

  const _mb=document.getElementById('modalBrand'); if(_mb){_mb.textContent=p.brand;_mb.dataset.brandSearch=p.brand;_mb.style.cursor='pointer';}
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
  document.getElementById('modalSpecs').innerHTML=Object.keys(p.specs||{}).slice(0,4).map(k=>`<div class="spec-chip"><div class="spec-chip-key">${_esc(k)}</div><div class="spec-chip-val">${_esc(p.specs[k])}</div></div>`).join('');
  let b='';if(p.badge==='sale')b+='<span class="badge badge-sale">Промо</span>';if(p.badge==='new')b+='<span class="badge badge-new">Ново</span>';if(p.badge==='hot')b+='<span class="badge badge-hot">Горещо</span>';
  document.getElementById('modalBadges').innerHTML=b;
  document.getElementById('modalDesc').textContent=p.desc;
  var _el_modalSpecsFull=document.getElementById('modalSpecsFull'); if(_el_modalSpecsFull) _el_modalSpecsFull.innerHTML =
    `<div class="spec-chip"><div class="spec-chip-key">SKU</div><div class="spec-chip-val mono-12">${_esc(p.sku)}</div></div>` +
    `<div class="spec-chip"><div class="spec-chip-key">EAN</div><div class="spec-chip-val mono-12">${_esc(p.ean)}</div></div>` +
    Object.entries(p.specs||{}).map(([k,v])=>`<div class="spec-chip"><div class="spec-chip-key">${_esc(k)}</div><div class="spec-chip-val">${_esc(v)}</div></div>`).join('');
  document.getElementById('modalReviews').innerHTML=(p.reviews||[]).map(r=>`<div class="review-item"><div class="review-header"><span class="review-name">${_esc(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_esc(r.date)}</span></div><div class="review-text">${_esc(r.text)}</div></div>`).join('');
  switchTab('desc');
  document.getElementById('productModalBackdrop').classList.add('open');document.body.style.overflow='hidden';
  // Update mobile/desktop sticky CTA price
  var _mscP=document.getElementById('mscPrice');
  if(_mscP) _mscP.innerHTML=fmtEur(p.price)+'<span style="font-size:11px;font-weight:500;color:var(--muted);display:block">'+fmtBgn(p.price)+'</span>';
  // IntersectionObserver: show sticky CTA when #modalAddBtn scrolls out of view
  var _stickyObs=null;
  (function(){
    var addBtn=document.getElementById('modalAddBtn');
    var cta=document.getElementById('modalStickyCta');
    if(!addBtn||!cta||!('IntersectionObserver' in window))return;
    cta.classList.remove('visible');
    if(_stickyObs)_stickyObs.disconnect();
    var backdrop=document.getElementById('productModalBackdrop');
    _stickyObs=new IntersectionObserver(function(entries){
      cta.classList.toggle('visible',!entries[0].isIntersecting);
    },{root:backdrop,threshold:0.1});
    _stickyObs.observe(addBtn);
    backdrop._stickyObs=_stickyObs;
  })();
}
function closeProductModal(e){if(e.target===e.currentTarget)closeProductModalDirect();}
function closeProductModalDirect(){
  var _bd=document.getElementById('productModalBackdrop');
  var cta=document.getElementById('modalStickyCta');
  if(cta)cta.classList.remove('visible');
  if(_bd&&_bd._stickyObs){_bd._stickyObs.disconnect();_bd._stickyObs=null;}
  _bd.classList.remove('open');
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
  updateCart();saveCart();const btn=document.getElementById('modalAddBtn');
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
  if(typeof updateSidebarCompare==='function') updateSidebarCompare();
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

function _cmpThumb(p, size) {
  const safeImg = p.img && (typeof isSafeImgUrl === 'function' ? isSafeImgUrl(p.img) : true) ? p.img : null;
  if (!safeImg) return `<span style="font-size:${Math.round(size*0.65)}px;display:block;margin-bottom:6px;">${p.emoji||''}</span>`;
  return `<img src="${safeImg}" alt="" width="${size}" height="${size}" loading="lazy" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:6px;display:block;margin:0 auto 6px;" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="font-size:${Math.round(size*0.65)}px;display:none;margin-bottom:6px;">${p.emoji||''}</span>`;
}

function openComparePage(){
  if(compareList.length<2){showToast('Избери поне 2 продукта за сравнение!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('Избери поне 2 налични продукта!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs||{})))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));
  let html=`<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">`;
  html+=`<thead><tr><th scope="col" style="text-align:left;padding:12px;background:var(--bg2);border-radius:8px 0 0 0;">Продукт</th>`;
  prods.forEach(p=>html+=`<th scope="col" style="padding:16px;text-align:center;background:var(--bg2);border-left:1px solid var(--border);">${_cmpThumb(p,64)}<div style="font-weight:800;font-size:14px;margin-bottom:4px;">${p.name}</div><div style="font-size:18px;font-weight:900;color:var(--primary);">${fmtEur(p.price)}</div><div style="font-size:11px;color:var(--muted);">${fmtBgn(p.price)}</div><button type="button" onclick="addToCart(${p.id})" style="margin-top:10px;background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;">🛒 Добави</button></th>`);
  html+=`</tr></thead><tbody>`;
  html+=`<tr><th scope="row" style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Цена</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.price===minP?'background:var(--primary-light);font-weight:800;color:var(--primary);':''}">${fmtEur(p.price)}</td>`);
  html+=`</tr><tr><th scope="row" style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Рейтинг</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.rating===maxR?'background:var(--primary-light);font-weight:800;':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;
  allKeys.forEach(k=>{
    html+=`<tr><th scope="row" style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);color:var(--muted);font-weight:600;">${k}</th>`;
    prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);">${(p.specs||{})[k]||'—'}</td>`);
    html+=`</tr>`;
  });
  html+=`</tbody></table></div>`;
  document.getElementById('compareTable').innerHTML=html;
  document.getElementById('comparePage').style.display='block';
  document.body.style.overflow='hidden';
}
function removeCompare(id){compareList=compareList.filter(x=>x!==id);const btn=document.getElementById('cmp-btn-'+id);if(btn)btn.style.background='var(--bg)';updateCompareBar();}
function clearCompare(){compareList.forEach(id=>{const btn=document.getElementById('cmp-btn-'+id);if(btn)btn.style.background='var(--bg)';});compareList=[];updateCompareBar();}
function openCompareModal(){
  if(compareList.length<2){showToast('Избери поне 2 продукта!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('Избери поне 2 налични продукта!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs||{})))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));

  // Detect diff rows
  function _isDiff(vals){ return new Set(vals).size>1; }
  function _bestNumIdx(vals){
    const nums=vals.map(v=>parseFloat(String(v).replace(/[^\d.]/g,'')));
    if(nums.some(isNaN))return -1;
    const mx=Math.max(...nums);
    return nums.findIndex(n=>n===mx);
  }

  let html=`<thead><tr><th scope="col">Продукт</th>`;
  prods.forEach(p=>html+=`<th scope="col" class="cmp-product-header"><span class="cmp-emoji">${_cmpThumb(p,60)}</span><div class="cmp-name">${_esc(p.name)}</div><div class="cmp-price">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></div><button type="button" class="cmp-add-btn" onclick="addToCart(${p.id})">🛒 Добави</button></th>`);
  html+=`</tr></thead><tbody>`;
  // Price row — lowest is best
  const priceDiff=_isDiff(prods.map(p=>p.price));
  html+=`<tr class="${priceDiff?'cmp-diff-row':''}"><th scope="row">Цена${priceDiff?'<span class="cmp-diff-badge">!</span>':''}</th>`;
  prods.forEach(p=>html+=`<td class="${p.price===minP?'cmp-best':''}">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></td>`);
  // Rating row
  const ratingDiff=_isDiff(prods.map(p=>p.rating));
  html+=`</tr><tr class="${ratingDiff?'cmp-diff-row':''}"><th scope="row">Рейтинг${ratingDiff?'<span class="cmp-diff-badge">!</span>':''}</th>`;
  prods.forEach(p=>html+=`<td class="${p.rating===maxR?'cmp-best':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;

  // Spec rows
  let diffCount=0;
  const specRows=allKeys.map(k=>{
    const vals=prods.map(p=>String((p.specs||{})[k]||'—'));
    const diff=_isDiff(vals);
    if(diff)diffCount++;
    const bestIdx=diff?_bestNumIdx(vals):-1;
    let row=`<tr class="${diff?'cmp-diff-row':''}" data-cmp-diff="${diff?'1':'0'}"><th scope="row">${_esc(k)}${diff?'<span class="cmp-diff-badge">!</span>':''}</th>`;
    vals.forEach((v,i)=>{ row+=`<td class="${diff&&i===bestIdx?'cmp-best':''}">${_esc(v)}</td>`; });
    row+=`</tr>`;
    return row;
  });
  html+=specRows.join('');
  html+=`</tbody>`;

  document.getElementById('compareTableModal').innerHTML=html;

  // Inject toggle above table
  const wrap=document.getElementById('compareTableModal').closest('.cmp-modal-body, .compare-modal-body, [class*="cmp"]') || document.getElementById('compareModalBackdrop').querySelector('.cmp-modal-inner, .compare-inner') || document.getElementById('compareModalBackdrop');
  const tableEl=document.getElementById('compareTableModal');
  if(tableEl && !tableEl.previousElementSibling?.classList?.contains('cmp-diff-only-toggle')){
    const tog=document.createElement('label');
    tog.className='cmp-diff-only-toggle';
    tog.innerHTML=`<input type="checkbox" id="cmpDiffOnly" onchange="cmpToggleDiffOnly(this.checked)"><span>Покажи само разликите</span><span class="cmp-diff-count">(${diffCount} разлики)</span>`;
    tableEl.parentNode.insertBefore(tog, tableEl);
  }

  document.getElementById('compareModalBackdrop').classList.add('open');
  document.body.style.overflow='hidden';
}
function cmpToggleDiffOnly(on){
  document.querySelectorAll('#compareTableModal tr[data-cmp-diff]').forEach(tr=>{
    tr.style.display=(on && tr.dataset.cmpDiff==='0')?'none':'';
  });
}
window.cmpToggleDiffOnly = cmpToggleDiffOnly;
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
function selectDelivery(el){document.querySelectorAll('.qo-delivery-opt').forEach(o=>{o.classList.remove('selected');o.setAttribute('aria-checked','false');});el.classList.add('selected');el.setAttribute('aria-checked','true');}
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
function goSlide(n){if(!slides.length||!slides[n])return;slides[currentSlide].classList.remove('active');dots[currentSlide].classList.remove('active');dots[currentSlide].removeAttribute('aria-current');currentSlide=n;slides[currentSlide].classList.add('active');dots[currentSlide].classList.add('active');dots[currentSlide].setAttribute('aria-current','true');}
let _heroSliderIv=null;
if(slides.length){if(_heroSliderIv)clearInterval(_heroSliderIv);_heroSliderIv=setInterval(()=>goSlide((currentSlide+1)%slides.length),5000);}

// SALE SLIDE COUNTDOWN — counts down to end of day
(function(){
  const el = document.getElementById('saleCountdown');
  if(!el) return;
  function update(){
    const now = new Date();
    const eod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const diff = Math.max(0, Math.floor((eod - now) / 1000));
    const h = String(Math.floor(diff / 3600)).padStart(2,'0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2,'0');
    const s = String(diff % 60).padStart(2,'0');
    el.innerHTML = `⏱ Офертата изтича след <b>${h}:${m}:${s}</b>`;
  }
  update();
  setInterval(update, 1000);
})();

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
  const _ftEl=document.getElementById('flashTimer');
  if(_ftEl)_ftEl.style.visibility='visible';
  if(window._countdownIv)clearInterval(window._countdownIv);
  window._countdownIv=setInterval(tick,1000);
})();

// TOAST
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2800);}


// Modal gallery swipe navigation (mobile)
(function() {
  let _mgStartX = 0, _mgStartY = 0, _mgActive = false;
  document.addEventListener('touchstart', function(e) {
    const zw = document.getElementById('modalZoomWrap');
    if (zw && zw.contains(e.target) && e.touches.length === 1) {
      _mgStartX = e.touches[0].clientX;
      _mgStartY = e.touches[0].clientY;
      _mgActive = true;
    } else {
      _mgActive = false;
    }
  }, { passive: true });
  document.addEventListener('touchend', function(e) {
    if (!_mgActive) return;
    _mgActive = false;
    const dx = e.changedTouches[0].clientX - _mgStartX;
    const dy = e.changedTouches[0].clientY - _mgStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      galleryNav(dx > 0 ? -1 : 1);
    }
  }, { passive: true });
})();

// CART
function _prodThumb(p, size) {
  if (!p.img) return `<span style="font-size:${Math.round(size*0.65)}px;line-height:1;">${escHtml(p.emoji||'')}</span>`;
  return `<img src="${p.img}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:4px;" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'"><span style="font-size:${Math.round(size*0.65)}px;line-height:1;display:none;">${escHtml(p.emoji||'')}</span>`;
}

function saveCart() { try { localStorage.setItem('mc_cart', JSON.stringify(cart.map(x => ({ id: x.id, qty: x.qty })))); } catch (e) { } }

function oosNotify(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const email = prompt('Въведи имейл — ще те уведомим когато "' + p.name.substring(0, 40) + '" е на склад:');
  if (!email || !email.includes('@')) return;
  try {
    const notifs = JSON.parse(localStorage.getItem('mc_oos_notify') || '[]');
    if (!notifs.find(n => n.id === id && n.email === email)) {
      notifs.push({ id: id, email: email, name: p.name, ts: Date.now() });
      localStorage.setItem('mc_oos_notify', JSON.stringify(notifs));
    }
  } catch(e) {}
  showToast('🔔 Ще те уведомим на ' + email + ' при наличност!');
}
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('mc_cart') || '[]');
    if (saved.length) { cart = saved.map(x => { const p = products.find(p => p.id === x.id); return p ? { ...p, qty: x.qty } : null; }).filter(Boolean); updateCart(); }
  } catch (e) { }
}

function addToCart(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  const ex = cart.find(x => x.id === id); if (ex) { ex.qty++; } else { cart.push({ ...p, qty: 1 }); }
  updateCart(); saveCart();
  if (navigator.vibrate) navigator.vibrate(50);
  const btn = document.getElementById('cb-' + id);
  if (btn) { btn.classList.add('added'); btn.innerHTML = '✓ Добавен'; btn.disabled = true; setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави в кошница'; btn.disabled = false; }, 1200); }
  (function showCartToast(prod) {
    var ct = document.getElementById('cartToast');
    if (!ct) { showToast('✓ ' + prod.name.substring(0, 32) + '… добавен!'); return; }
    document.getElementById('cartToastEmoji').textContent = prod.emoji || '🛒';
    document.getElementById('cartToastMsg').textContent = prod.name.substring(0, 36) + (prod.name.length > 36 ? '…' : '') + ' добавен!';
    var total = cart.reduce(function(s,x){return s+x.price*x.qty;},0);
    var fill = document.getElementById('cartToastShipFill');
    var label = document.getElementById('cartToastShipLabel');
    var wrap = document.getElementById('cartToastShipWrap');
    if (fill && label && wrap) {
      if (total >= FREE_SHIP_BGN) {
        fill.style.width = '100%';
        label.textContent = '🎉 Безплатна доставка!';
        wrap.style.display = 'block';
      } else {
        var pct = Math.min(100, Math.round(total / FREE_SHIP_BGN * 100));
        var remaining = (FREE_SHIP_BGN - total).toFixed(2).replace('.',',');
        fill.style.width = pct + '%';
        label.textContent = 'Още ' + remaining + ' лв. до безплатна доставка';
        wrap.style.display = 'block';
      }
    }
    ct.classList.add('show');
    clearTimeout(ct._timer);
    ct._timer = setTimeout(function() { ct.classList.remove('show'); }, 3500);
  })(p);
  if (!document.getElementById('recPanel')) showRecommended(p);
}

function showRecommended(p) {
  const inCart = new Set(cart.map(x => x.id));
  let recs = products.filter(x => x.id !== p.id && x.cat === p.cat && !inCart.has(x.id));
  if (recs.length < 2) recs = products.filter(x => x.id !== p.id && !inCart.has(x.id));
  recs = recs.slice(0, 3);
  if (!recs.length) return;

  const panel = document.createElement('div');
  panel.id = 'recPanel';
  panel.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:2000;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:14px 16px;max-width:300px;width:calc(100vw - 40px);box-shadow:0 8px 32px rgba(0,0,0,0.18);opacity:0;transform:translateY(10px);transition:opacity 0.25s,transform 0.25s;';
  panel.innerHTML = `
    <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px;">Клиентите купуват и…</div>
    ${recs.map(r => `
      <div onclick="openProductPage(${r.id})" style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer;">
        <div style="min-width:34px;text-align:center;">${_prodThumb(r, 34)}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name.length > 32 ? r.name.substring(0, 32) + '…' : r.name}</div>
          <div style="font-size:12px;color:var(--primary);font-weight:700;">${fmtEur(r.price)}</div>
        </div>
        <button type="button" onclick="event.stopPropagation();addToCart(${r.id})" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;cursor:pointer;white-space:nowrap;font-family:'Outfit',sans-serif;font-weight:700;">+</button>
      </div>`).join('')}
    <button type="button" onclick="document.getElementById('recPanel').remove()" style="width:100%;margin-top:8px;background:none;border:none;color:var(--muted);font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;padding:4px;">Затвори ×</button>`;
  document.body.appendChild(panel);
  requestAnimationFrame(() => { panel.style.opacity = '1'; panel.style.transform = 'translateY(0)'; });
  panel._t = setTimeout(() => { panel.style.opacity = '0'; setTimeout(() => panel.remove(), 280); }, 8000);
}
function addToCartById(id) { addToCart(id); }
const FREE_SHIP_BGN = Math.round(100 * EUR_RATE * 100) / 100; // 100 EUR в лева

// Social proof — shown only when real order count exists
(function initCartSocialProof() {
  const sp = document.getElementById('cartSocialProof');
  const txt = document.getElementById('cartSpText');
  if (!sp || !txt) return;
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) {}
  if (orders.length > 0) {
    txt.textContent = `Вие имате ${orders.length} ${orders.length === 1 ? 'поръчка' : 'поръчки'} при нас`;
    sp.style.display = '';
  }
})();
function updateCart() {
  const count = cart.reduce((s, x) => s + x.qty, 0), total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const prev = parseInt(badge.textContent, 10) || 0;
    badge.textContent = count;
    if (count > prev) {
      badge.classList.remove('badge-pop');
      if (typeof badge.animate === 'function') {
        badge.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.4)' },
          { transform: 'scale(0.9)' },
          { transform: 'scale(1.1)' },
          { transform: 'scale(1)' }
        ], { duration: 380, easing: 'cubic-bezier(.36,.07,.19,.97)', fill: 'none' });
      }
    }
  }
  const cartTotalEl = document.getElementById('cartTotal'); if (cartTotalEl) cartTotalEl.textContent = fmtEur(total) + ' / ' + fmtBgn(total);
  // sync PDP mini-header cart badge
  const pdpB = document.getElementById('pdpMhdrCartBadge');
  if (pdpB) { pdpB.textContent = count; pdpB.style.display = count > 0 ? '' : 'none'; }
  // sync bottom nav badges (two nav bars exist — update all)
  document.querySelectorAll('#bnCartBadge, #bnCartBadge2').forEach(bnB => {
    const bnPrev = parseInt(bnB.textContent, 10) || 0;
    bnB.textContent = count; bnB.classList.toggle('show', count > 0);
    if (count > bnPrev) {
      bnB.classList.remove('badge-pop');
      if (typeof bnB.animate === 'function') {
        bnB.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.4)' },
          { transform: 'scale(0.9)' },
          { transform: 'scale(1.1)' },
          { transform: 'scale(1)' }
        ], { duration: 380, easing: 'cubic-bezier(.36,.07,.19,.97)', fill: 'none' });
      }
    }
  });
  const body = document.getElementById('cartBody');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty-msg"><div class="ce-icon"><svg width="44" height="44" class="svg-ic" aria-hidden="true" style="opacity:.25"><use href="#ic-cart"/></svg></div><p>Кошницата е празна.</p><button type="button" class="ce-cta-btn" onclick="closeCart();filterCatScroll(\'all\')">Разгледай продуктите →</button></div>';
    // Return focus to cart icon button when cart becomes empty and panel is open
    const panel = document.getElementById('cartPanel');
    if (panel && panel.classList.contains('open')) { const cartBtn = document.querySelector('[onclick*="toggleCart"]') || document.querySelector('#cartIcon'); if (cartBtn) cartBtn.focus(); }
    return;
  }
  let html = cart.map(x => {
    const name = escHtml(x.name || '');
    const shortName = x.name && x.name.length > 38 ? escHtml(x.name.substring(0, 38)) + '…' : name;
    const unitPrice = x.qty > 1 ? `<span class="ci-unit">${fmtEur(x.price)} / бр.</span>` : '';
    return `<div class="cart-item-row">
      <button type="button" class="ci-emoji-btn" onclick="openProductPage(${x.id})" title="Виж продукта">${_prodThumb(x, 44)}</button>
      <div class="ci-details">
        <div class="ci-top-row">
          <button type="button" class="ci-name-btn" onclick="openProductPage(${x.id})" title="Виж продукта">${shortName}</button>
          <button type="button" class="ci-remove" onclick="removeFromCart(${x.id})" aria-label="Премахни">×</button>
        </div>
        <div class="ci-bottom-row">
          <div class="ci-qty"><button type="button" class="qty-btn" onclick="changeQty(${x.id},-1)">−</button><span class="qty-num">${x.qty}</span><button type="button" class="qty-btn" onclick="changeQty(${x.id},1)">+</button></div>
          <div class="ci-price-wrap">${unitPrice}<span class="ci-price">${fmtEur(x.price * x.qty)}</span></div>
        </div>
      </div>
    </div>`;
  }).join('');
  // Free shipping progress bar + delivery row
  const pct = Math.min(100, (total / FREE_SHIP_BGN) * 100);
  const deliveryRow = document.getElementById('cartDeliveryRow');
  const deliveryVal = document.getElementById('cartDeliveryVal');
  if (total >= FREE_SHIP_BGN) {
    html += `<div class="cart-ship-bar"><div class="cart-ship-msg ship-free">🎉 Имаш безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="transform:scaleX(1)"></div></div></div>`;
    if (deliveryRow) deliveryRow.style.display = 'none';
  } else {
    const remEur = ((FREE_SHIP_BGN - total) / EUR_RATE).toFixed(2);
    html += `<div class="cart-ship-bar"><div class="cart-ship-msg">Добави още <strong>${remEur} €</strong> за безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="transform:scaleX(${(pct / 100).toFixed(3)})"></div></div></div>`;
    if (deliveryRow) deliveryRow.style.display = 'flex';
    if (deliveryVal) deliveryVal.textContent = (5.99 / EUR_RATE).toFixed(2) + ' €';
  }
  // Recently viewed not in cart
  try {
    const rvIds = JSON.parse(localStorage.getItem('mc_rv') || '[]');
    const inCart = new Set(cart.map(x => x.id));
    const rvItems = rvIds.map(id => products.find(p => p.id === id)).filter(p => p && !inCart.has(p.id)).slice(0, 3);
    if (rvItems.length) {
      html += `<div class="cart-rv-section"><div class="cart-rv-title">Забрави ли нещо?</div><div class="cart-rv-list">${rvItems.map(p => `<div class="cart-rv-item"><button type="button" class="cart-rv-link" onclick="openProductPage(${p.id})" title="Виж продукта"><div class="cart-rv-emoji">${_prodThumb(p, 36)}</div><div class="cart-rv-info"><div class="cart-rv-name">${escHtml(p.name.length > 28 ? p.name.substring(0, 28) + '…' : p.name)}</div><div class="cart-rv-price">${fmtEur(p.price)}</div></div></button><button type="button" class="cart-rv-add" onclick="addToCart(${p.id})" title="Добави">+</button></div>`).join('')}</div></div>`;
    }
  } catch (e) { }
  body.innerHTML = html;
  // Update checkout button with total amount
  const ckBtn = document.querySelector('.checkout-btn');
  if (ckBtn) ckBtn.innerHTML = '🔒 Завърши поръчката · ' + fmtEur(total) + ' →';
  // Sync cart page if open
  if (typeof renderCartPageSummary === 'function' && document.getElementById('cartPage')?.style.display !== 'none') { renderCartPageSummary(); }
}
function changeQty(id, d) { const i = cart.find(x => x.id === id); if (!i) return; i.qty += d; if (i.qty <= 0) cart = cart.filter(x => x.id !== id); updateCart(); saveCart(); }
function removeFromCart(id) {
  const removed = cart.find(x => x.id === id);
  cart = cart.filter(x => x.id !== id);
  updateCart(); saveCart();
  if (!removed) return;
  // Undo toast
  const t = document.getElementById('toast');
  if (!t) return;
  clearTimeout(t._timer);
  t.innerHTML = '';
  const _rSpan = document.createElement('span');
  _rSpan.textContent = removed.name.substring(0, 28) + '… премахнат. ';
  const _rBtn = document.createElement('button');
  _rBtn.type = 'button'; _rBtn.onclick = undoRemoveCart;
  _rBtn.style.cssText = 'margin-left:8px;background:rgba(255,255,255,0.25);border:none;border-radius:5px;padding:2px 8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;color:#fff;';
  _rBtn.textContent = 'Отмяна';
  t.appendChild(_rSpan); t.appendChild(_rBtn);
  t.classList.add('show');
  t._undoItem = removed;
  t._timer = setTimeout(() => { t.classList.remove('show'); t._undoItem = null; }, 4500);
}
function undoRemoveCart() {
  const t = document.getElementById('toast');
  if (!t || !t._undoItem) return;
  const item = t._undoItem;
  t._undoItem = null;
  clearTimeout(t._timer);
  t.classList.remove('show');
  const ex = cart.find(x => x.id === item.id);
  if (ex) { ex.qty += item.qty; } else { cart.push(item); }
  updateCart(); saveCart();
  showToast('✓ ' + item.name.substring(0, 28) + '… върнат в кошницата');
}
function toggleCart() { const co=document.getElementById('cartOverlay'),cp=document.getElementById('cartPanel'); if(co)co.classList.toggle('open'); if(cp)cp.classList.toggle('open'); }
// ===== CHECKOUT & THANK YOU =====
let ckDeliveryIdx = 0;
let ckDeliveryCosts = [5.99, 4.99, 0];
let ckDeliveryNames = ['Еконт', 'Speedy', 'Вземи от магазин'];
let ckPaymentType = 'card';
let promoApplied = false;

function _loadSupabase() {
  if (typeof window.supabase !== 'undefined' || document.querySelector('script[data-sb]')) return;
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  s.dataset.sb = '1';
  s.onload = function() {
    const sc = document.createElement('script');
    sc.src = 'js/supabase-client.js';
    document.head.appendChild(sc);
  };
  document.head.appendChild(s);
}

function handleCheckout() {
  if (cart.length === 0) { showToast('Добави продукти в кошницата!'); return; }
  _loadSupabase();
  // Pre-fill from logged-in user
  if (currentUser) {
    document.getElementById('ckFirst').value = currentUser.firstName || '';
    document.getElementById('ckLast').value = currentUser.lastName || '';
    document.getElementById('ckEmail').value = currentUser.email || '';
    document.getElementById('ckPhone').value = currentUser.phone || '';
  }
  // Restore saved address
  try {
    const sa = JSON.parse(localStorage.getItem('mc_saved_addr') || 'null');
    if (sa) {
      if (sa.first && !document.getElementById('ckFirst').value) document.getElementById('ckFirst').value = sa.first;
      if (sa.last && !document.getElementById('ckLast').value) document.getElementById('ckLast').value = sa.last;
      if (sa.email && !document.getElementById('ckEmail').value) document.getElementById('ckEmail').value = sa.email;
      if (sa.phone && !document.getElementById('ckPhone').value) document.getElementById('ckPhone').value = sa.phone;
      if (sa.city) document.getElementById('ckCity').value = sa.city;
      if (sa.addr) document.getElementById('ckAddr').value = sa.addr;
      if (sa.zip) document.getElementById('ckZip').value = sa.zip;
      const notice = document.getElementById('ckSavedAddrNotice');
      if (notice) notice.style.display = 'flex';
    }
  } catch (e) { }
  renderOrderSummary();
  _startCkUpsell();
  document.getElementById('checkoutPage').classList.add('open');
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = 'hidden';
  showCheckoutStep(1);
  // Clear previous validation states and touched flags
  document.querySelectorAll('#checkoutPage .ck-input').forEach(el => { el.classList.remove('error', 'valid'); delete el.dataset.touched; });
  // Populate estimated delivery dates
  const fmt = d => d.toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' });
  const now = new Date();
  const workDay = (d, n) => { let c = new Date(d); let added = 0; while (added < n) { c.setDate(c.getDate() + 1); if (c.getDay() !== 0 && c.getDay() !== 6) added++; } return c; };
  const d0 = document.getElementById('delivDate0'); if (d0) d0.textContent = '· до ' + fmt(workDay(now, 2));
  const d1 = document.getElementById('delivDate1'); if (d1) d1.textContent = '· до ' + fmt(workDay(now, 3));
  const d2 = document.getElementById('delivDate2'); if (d2) d2.textContent = '· готово днес';
}

let _ckUpsellTimer = null;
let _ckUpsellPool = [];

function _cuItemHtml(p) {
  const inCart = cart.find(x => x.id === p.id);
  const qty = inCart ? inCart.qty : 0;
  const qtyCtrl = qty > 0
    ? `<div class="cu-qty"><button type="button" class="cu-qty-btn" onclick="cuChangeQty(${p.id},-1)">−</button><span class="cu-qty-num">${qty}</span><button type="button" class="cu-qty-btn" onclick="cuChangeQty(${p.id},1)">+</button></div>`
    : `<button type="button" class="cu-add" onclick="cuChangeQty(${p.id},1)" title="Добави в кошницата">+</button>`;
  return `<div class="cu-item" id="cu-item-${p.id}">
    <button type="button" class="cu-link" onclick="openProductPage(${p.id})" title="Виж продукта">
      <div class="cu-emoji">${escHtml(p.emoji || '')}</div>
      <div class="cu-info">
        <div class="cu-name">${escHtml(p.name.length > 32 ? p.name.substring(0, 32) + '…' : p.name)}</div>
        <div class="cu-price">${fmtEur(p.price)}</div>
      </div>
    </button>
    ${qtyCtrl}
  </div>`;
}

function cuChangeQty(id, delta) {
  const inCart = cart.find(x => x.id === id);
  if (delta > 0) {
    addToCart(id);
  } else if (inCart && inCart.qty > 1) {
    changeQty(id, -1);
  } else {
    removeFromCart(id);
  }
  // Re-render only this item's qty control
  const p = _ckUpsellPool.find(x => x.id === id);
  if (!p) return;
  const el = document.getElementById('cu-item-' + id);
  if (!el) return;
  const updated = cart.find(x => x.id === id);
  const qty = updated ? updated.qty : 0;
  const oldCtrl = el.querySelector('.cu-qty, .cu-add');
  if (!oldCtrl) return;
  const newHtml = qty > 0
    ? `<div class="cu-qty"><button type="button" class="cu-qty-btn" onclick="cuChangeQty(${id},-1)">−</button><span class="cu-qty-num">${qty}</span><button type="button" class="cu-qty-btn" onclick="cuChangeQty(${id},1)">+</button></div>`
    : `<button type="button" class="cu-add" onclick="cuChangeQty(${id},1)" title="Добави в кошницата">+</button>`;
  oldCtrl.outerHTML = newHtml;
}
window.cuChangeQty = cuChangeQty;

function _startCkUpsell() {
  const el = document.getElementById('ckUpsell');
  if (!el) return;
  if (_ckUpsellTimer) { clearInterval(_ckUpsellTimer); _ckUpsellTimer = null; }
  const inCartIds = new Set(cart.map(x => x.id));
  const cats = cart.map(x => x.cat);
  let pool = products.filter(x => !inCartIds.has(x.id) && cats.includes(x.cat) && x.stock !== false).sort((a, b) => (b.rv || 0) - (a.rv || 0)).slice(0, 8);
  if (pool.length < 2) pool = products.filter(x => !inCartIds.has(x.id) && x.stock !== false).sort((a, b) => (b.rv || 0) - (a.rv || 0)).slice(0, 8);
  if (pool.length < 2) { el.style.display = 'none'; return; }
  _ckUpsellPool = pool;
  el.style.display = '';
  let idx = 0;
  const render = () => {
    const pair = [pool[idx % pool.length], pool[(idx + 1) % pool.length]];
    const items = el.querySelector('.cart-upsell-items');
    if (items) {
      items.style.opacity = '0';
      setTimeout(() => {
        items.innerHTML = pair.map(p => _cuItemHtml(p)).join('');
        items.style.opacity = '1';
      }, 300);
    } else {
      el.innerHTML = `<div class="cart-upsell-title">⚡ Може да те заинтересува</div><div class="cart-upsell-items" style="transition:opacity .3s">${pair.map(p => _cuItemHtml(p)).join('')}</div>`;
    }
    idx = (idx + 2) % pool.length;
  };
  render();
  _ckUpsellTimer = setInterval(render, 6000);
}

function closeCheckoutPage() {
  if (_ckUpsellTimer) { clearInterval(_ckUpsellTimer); _ckUpsellTimer = null; }
  document.getElementById('checkoutPage').classList.remove('open');
  document.body.style.overflow = '';
}

function ckClearSavedAddr() {
  try { localStorage.removeItem('mc_saved_addr'); } catch (e) { }
  ['ckFirst','ckLast','ckEmail','ckPhone','ckCity','ckAddr','ckZip'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const notice = document.getElementById('ckSavedAddrNotice');
  if (notice) notice.style.display = 'none';
  const chk = document.getElementById('ckSaveAddr');
  if (chk) chk.checked = false;
}

function renderOrderSummary() {
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const savings = cart.reduce((s, x) => s + (x.old ? (x.old - x.price) * x.qty : 0), 0);
  const delivery = ckDeliveryCosts[ckDeliveryIdx];
  const codFee = ckPaymentType === 'cod' ? 1.50 : 0;
  const promoDisc = promoApplied ? subtotal * ((promoDiscountPct || 10) / 100) : 0;
  const total = subtotal + delivery + codFee - promoDisc;

  document.getElementById('osSummaryItems').innerHTML = cart.map(x => `
    <div class="os-item">
      <div class="os-emoji">${escHtml(x.emoji || '')}</div>
      <div class="os-item-info">
        <div class="os-item-name">${escHtml(x.name || '')}</div>
        <div class="os-qty-ctrl">
          <button type="button" class="os-qty-btn" onclick="osChangeQty(${x.id},-1)">−</button>
          <span class="os-qty-num">${x.qty}</span>
          <button type="button" class="os-qty-btn" onclick="osChangeQty(${x.id},1)">+</button>
        </div>
      </div>
      <div class="os-item-price">${fmtEur(x.price * x.qty)}<span class="text-10-muted-block">${fmtBgn(x.price * x.qty)}</span></div>
    </div>`).join('');

  document.getElementById('osSubtotal').textContent = fmtEur(subtotal) + ' / ' + fmtBgn(subtotal);
  document.getElementById('osDelivery').textContent = delivery === 0 ? 'Безплатно' : fmtEur(delivery) + ' / ' + fmtBgn(delivery);
  document.getElementById('osTotal').textContent = fmtEur(total) + ' / ' + fmtBgn(total);

  const saveRow = document.getElementById('osSaveRow');
  if (savings > 0) { saveRow.style.display = ''; document.getElementById('osSave').textContent = '-' + fmtEur(savings) + ' / ' + fmtBgn(savings); }
  else saveRow.style.display = 'none';

  const promoRow = document.getElementById('osPromoRow');
  if (promoApplied) { promoRow.style.display = ''; document.getElementById('osPromoAmt').textContent = '-' + fmtEur(promoDisc) + ' / ' + fmtBgn(promoDisc); }
  else promoRow.style.display = 'none';
}

function selectCheckoutMode(mode) {
  const guestOpt = document.getElementById('ckModeGuest');
  const loginOpt = document.getElementById('ckModeLogin');
  const guestRadio = document.getElementById('ckModeGuestRadio');
  const loginRadio = document.getElementById('ckModeLoginRadio');
  if (mode === 'guest') {
    guestOpt?.classList.add('selected');
    loginOpt?.classList.remove('selected');
    guestRadio?.classList.add('checked');
    loginRadio?.classList.remove('checked');
    guestOpt?.setAttribute('aria-checked', 'true');
    loginOpt?.setAttribute('aria-checked', 'false');
  } else {
    loginOpt?.classList.add('selected');
    guestOpt?.classList.remove('selected');
    loginRadio?.classList.add('checked');
    guestRadio?.classList.remove('checked');
    loginOpt?.setAttribute('aria-checked', 'true');
    guestOpt?.setAttribute('aria-checked', 'false');
    if (typeof openAuthModal === 'function') openAuthModal('login');
  }
}

function osChangeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCart();
  saveCart();
  renderOrderSummary();
}

var _allEcontOffices = [
  'Еконт — кв. Лозенец, ул. Свети Наум 52',
  'Еконт — ул. Г. С. Раковски 147, София',
  'Еконт — бул. Витоша 100, София',
  'Еконт — ж.к. Люлин 6, бл. 606, София',
  'Еконт — ж.к. Младост 1, бл. 52Б, София',
  'Еконт — ж.к. Надежда 4, бл. 421, София',
  'Еконт — ул. Дойран 3, Пловдив',
  'Еконт — бул. Цар Освободител 5, Варна',
  'Еконт — ул. Ал. Стамболийски 6, Бургас',
  'Еконт — ул. Цар Освободител 10, Стара Загора',
  'Еконт — ул. Дунав 5, Русе',
  'Еконт — бул. България 23, Плевен',
  'Еконт — ул. Юрий Гагарин 1, Благоевград',
  'Еконт — ул. Климент Охридски 9, Велико Търново'
];

function filterEcontOffices(city) {
  var dl = document.getElementById('econtOfficesList');
  if (!dl) return;
  var filtered = city.trim()
    ? _allEcontOffices.filter(function(o) { return o.toLowerCase().includes(city.toLowerCase()); })
    : _allEcontOffices;
  dl.innerHTML = filtered.map(function(o) { return '<option value="' + o.replace(/"/g,'&quot;') + '">'; }).join('');
  var officeInput = document.getElementById('ckEcontOffice');
  if (officeInput && officeInput.value && !filtered.some(function(o){return o===officeInput.value;})) {
    officeInput.value = '';
  }
}

function selectDeliveryCk(el, idx) {
  document.querySelectorAll('#checkoutPage .delivery-opt').forEach(o => {
    o.classList.remove('selected');
    o.setAttribute('aria-checked', 'false');
    o.setAttribute('tabindex', '-1');
  });
  el.classList.add('selected');
  el.setAttribute('aria-checked', 'true');
  el.setAttribute('tabindex', '0');
  ckDeliveryIdx = idx;
  renderOrderSummary();
  // Show/hide Econt office field and address section based on delivery type
  const officeRow = document.getElementById('ckEcontOfficeRow');
  const addrSection = document.getElementById('ckAddressSection');
  const isPickup = idx === 2;
  if (officeRow) officeRow.style.display = isPickup ? 'none' : '';
  if (addrSection) addrSection.style.display = isPickup ? 'none' : '';
}

function selectPayment(el, type) {
  document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  ckPaymentType = type;
  document.getElementById('cardFields').classList.toggle('show', type === 'card');
  renderOrderSummary();
}

function formatCardNum(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
  el.value = v;
}

let promoDiscountPct = 10; // set by applyPromo based on matched code

function applyPromo(codeArg) {
  const inputEl = document.getElementById('promoInput');
  const code = (codeArg || (inputEl ? inputEl.value : '')).trim().toUpperCase();

  // Load admin-managed codes from localStorage, fallback to built-in
  let codes = [{ code: 'MOSTCOMP10', discount: 10, active: true }];
  try {
    const stored = JSON.parse(localStorage.getItem('mc_promo_codes') || '[]');
    if (stored.length) codes = stored;
  } catch (e) { }

  const match = codes.find(c => c.code === code && c.active !== false);
  if (match) {
    promoApplied = true;
    promoDiscountPct = match.discount || 10;
    // Increment use counter
    try {
      const stored = JSON.parse(localStorage.getItem('mc_promo_codes') || '[]');
      const mc = stored.find(c => c.code === code);
      if (mc) { mc.uses = (mc.uses || 0) + 1; localStorage.setItem('mc_promo_codes', JSON.stringify(stored)); }
    } catch (e) { }
    if (inputEl) { document.getElementById('promoOk').classList.add('show'); inputEl.disabled = true; }
    const hint = document.getElementById('ckPromoHint'); if (hint) hint.style.display = 'none';
    renderOrderSummary();
    showToast(`✓ Промо код приложен — -${promoDiscountPct}%!`);
  } else {
    showToast('Невалиден промо код!');
    if (inputEl) { inputEl.classList.add('error'); setTimeout(() => inputEl.classList.remove('error'), 1500); }
  }
}

function showCheckoutStep(n) {
  [1, 2, 3].forEach(i => {
    const card = document.getElementById('ck-step' + i);
    if (card) card.style.display = i === n ? '' : 'none';
  });
  updateCheckoutSteps(n);
  const page = document.getElementById('checkoutPage');
  if (page) page.scrollTo({ top: 0, behavior: 'smooth' });
  // Auto-focus first empty required input in the new step
  setTimeout(() => {
    const card = document.getElementById('ck-step' + n);
    if (!card) return;
    const inputs = card.querySelectorAll('input.ck-input:not([disabled])');
    const firstEmpty = Array.from(inputs).find(el => !el.value.trim() && el.offsetParent !== null);
    if (firstEmpty) firstEmpty.focus();
  }, 120);
}

function ckNextStep(current) {
  if (!validateCkStep(current)) return;
  if (current === 1 && typeof window.saveAbandonedCart === 'function') {
    const email = document.getElementById('ckEmail')?.value.trim();
    const first = document.getElementById('ckFirst')?.value.trim() || '';
    const last  = document.getElementById('ckLast')?.value.trim()  || '';
    if (email) {
      window.saveAbandonedCart({
        email,
        name:  (first + ' ' + last).trim(),
        items: cart.map(x => ({ id: x.id, name: x.name, qty: x.qty, price: x.price })),
        total: cart.reduce((s, x) => s + x.price * x.qty, 0)
      });
    }
  }
  showCheckoutStep(current + 1);
}

function validateCkStep(step) {
  if (step === 1) {
    let valid = true;
    ['ckFirst', 'ckLast'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid', 'true'); valid = false; }
      else if (el) el.setAttribute('aria-invalid', 'false');
    });
    const email = document.getElementById('ckEmail');
    if (email && (!email.value.trim() || !email.value.includes('@'))) {
      email.classList.add('error'); email.classList.remove('valid'); email.setAttribute('aria-invalid', 'true'); valid = false;
    } else if (email) { email.setAttribute('aria-invalid', 'false'); }
    const phone = document.getElementById('ckPhone');
    if (phone) { ckValidatePhone(phone); if (phone.classList.contains('error')) valid = false; }
    if (!valid) showToast('⚠️ Попълни всички задължителни полета!');
    return valid;
  }
  if (step === 2) {
    let valid = true;
    if (ckDeliveryIdx === 2) return true; // pickup — no address needed
    // Validate Econt office if Econt selected (check row visibility, not a non-existent CSS class)
    const officeEl = document.getElementById('ckEcontOffice');
    const officeRow = document.getElementById('ckEcontOfficeRow');
    if (officeEl && officeRow && officeRow.style.display !== 'none') {
      if (!officeEl.value.trim()) { officeEl.classList.add('error'); officeEl.classList.remove('valid'); officeEl.setAttribute('aria-invalid', 'true'); valid = false; }
      else { officeEl.classList.remove('error'); officeEl.classList.add('valid'); officeEl.setAttribute('aria-invalid', 'false'); }
    }
    ['ckCity', 'ckAddr'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid', 'true'); valid = false; }
      else if (el) { el.classList.remove('error'); el.setAttribute('aria-invalid', 'false'); }
    });
    if (!valid) showToast('⚠️ Попълни адреса за доставка!');
    return valid;
  }
  return true;
}

function _ckSetError(el, msg) {
  const errEl = el.id ? document.getElementById(el.id + '-err') : null;
  if (errEl) errEl.textContent = msg || '';
}

function ckValidateField(el) {
  if (!el.value.trim()) {
    el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid', 'true');
    _ckSetError(el, 'Полето е задължително.');
  } else {
    el.classList.remove('error'); el.classList.add('valid'); el.setAttribute('aria-invalid', 'false');
    _ckSetError(el, '');
  }
}

function ckValidateEmail(el) {
  const ok = el.value.trim() && el.value.includes('@') && el.value.includes('.');
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', !!ok);
  el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  _ckSetError(el, ok ? '' : 'Въведи валиден имейл адрес.');
}

// BG phone: 08xx, 09xx, +359 8xx, 00359 8xx — at least 10 digits
function ckValidatePhone(el) {
  const raw = el.value.replace(/[\s\-().]/g, '');
  const ok = /^(\+359|00359|0)[89]\d{8}$/.test(raw) || /^[1-9]\d{9,}$/.test(raw);
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', ok);
  el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  _ckSetError(el, ok ? '' : 'Въведи валиден телефон (напр. 0888 123 456).');
}

// Auto-format phone as user types: 0888 123 456
function ckFormatPhone(el) {
  let v = el.value.replace(/[^\d+]/g, '');
  if (v.startsWith('+')) {
    // keep international prefix as-is
  } else if (v.length > 4) {
    v = v.substring(0, 4) + ' ' + v.substring(4, 7) + (v.length > 7 ? ' ' + v.substring(7, 11) : '');
  }
  el.value = v;
}

function updateCheckoutSteps(active) {
  [1, 2, 3].forEach(n => {
    const step = document.getElementById('cs' + n);
    const num = document.getElementById('csn' + n);
    if (!step) return;
    step.classList.remove('active', 'done');
    if (n < active) {
      step.classList.add('done');
      if (num) num.textContent = '✓';
      step.style.cursor = 'pointer';
      step.onclick = () => showCheckoutStep(n);
    } else if (n === active) {
      step.classList.add('active');
      step.style.cursor = '';
      step.onclick = null;
    } else {
      if (num) num.textContent = n;
      step.style.cursor = '';
      step.onclick = null;
    }
  });
}

function submitOrder() {
  // Validate required fields — skip city/address for pickup (ckDeliveryIdx === 2)
  const isPickup = ckDeliveryIdx === 2;
  const required = [
    ['ckFirst', 'Ime'], ['ckLast', 'Familiya'], ['ckEmail', 'Email'], ['ckPhone', 'Telefon'],
    ...(!isPickup ? [['ckCity', 'Grad'], ['ckAddr', 'Adres']] : [])
  ];
  let valid = true;
  required.forEach(([id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) { el.classList.add('error'); el.setAttribute('aria-invalid', 'true'); valid = false; }
    else { el.classList.remove('error'); el.setAttribute('aria-invalid', 'false'); }
  });
  if (ckPaymentType === 'card') {
    const cardNum  = document.getElementById('ckCardNum');
    const cardName = document.getElementById('ckCardName');
    const cardExp  = document.getElementById('ckCardExp');
    const cardCvv  = document.getElementById('ckCardCvv');
    const _cardErr = (el, bad) => {
      el.classList.toggle('error', bad);
      el.classList.toggle('valid', !bad);
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) valid = false;
    };
    // Number: 16 digits (spaces stripped)
    if (cardNum) _cardErr(cardNum, cardNum.value.replace(/\s/g,'').length !== 16);
    // Name: at least two words
    if (cardName) _cardErr(cardName, cardName.value.trim().split(/\s+/).length < 2);
    // Expiry: MM/YY format, not expired
    if (cardExp) {
      const parts = cardExp.value.split('/');
      const mm = parseInt(parts[0], 10), yy = parseInt(parts[1], 10);
      const now = new Date();
      const badExp = isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12 ||
        (yy + 2000 < now.getFullYear()) ||
        (yy + 2000 === now.getFullYear() && mm < now.getMonth() + 1);
      _cardErr(cardExp, badExp);
    }
    // CVV: 3 or 4 digits
    if (cardCvv) _cardErr(cardCvv, !/^\d{3,4}$/.test(cardCvv.value.trim()));
  }
  if (!valid) { showToast('Моля попълни всички задължителни полета!'); return; }

  // Loading state
  const submitBtn = document.querySelector('.os-submit');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span class="ck-spinner"></span> Обработва се…'; }

  // Animate steps
  updateCheckoutSteps(2);
  setTimeout(() => updateCheckoutSteps(3), 400);
  setTimeout(() => {
    // Build order data — sequential number based on existing order count
    let _prevOrders = [];
    try { _prevOrders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) { }
    const orderNum = 'MC-' + String(_prevOrders.length + 1).padStart(6, '0');
    const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const delivery = ckDeliveryCosts[ckDeliveryIdx];
    const codFee = ckPaymentType === 'cod' ? 1.50 : 0;
    const promoDisc = promoApplied ? subtotal * ((promoDiscountPct || 10) / 100) : 0;
    const total = subtotal + delivery + codFee - promoDisc;
    const payNames = { card: 'Карта', cod: 'Наложен платеж', bank: 'Банков превод' };
    const now = new Date();
    const delivDays = ckDeliveryIdx === 2 ? 0 : ckDeliveryIdx === 1 ? 3 : 2;
    const _addWorkDays = (d, n) => { let c = new Date(d); let added = 0; while (added < n) { c.setDate(c.getDate() + 1); if (c.getDay() !== 0 && c.getDay() !== 6) added++; } return c; };
    const delivDate = delivDays > 0 ? _addWorkDays(now, delivDays) : now;
    const fmt = d => d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' });

    // Populate thank-you page
    const _set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const _setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
    _set('tyOrderNum', orderNum);
    _set('tyEmail', document.getElementById('ckEmail').value);
    _set('tyDeliveryDate', ckDeliveryIdx === 2 ? 'При вземане от магазин' : fmt(delivDate));
    _set('tyPayment', payNames[ckPaymentType]);
    _set('tyName', document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value);
    _set('tyPhone', document.getElementById('ckPhone').value);
    const _isPickup = ckDeliveryIdx === 2;
    const _econtOffice = (document.getElementById('ckEcontOffice') || {}).value || '';
    _set('tyCity', _isPickup ? 'София (магазин)' : document.getElementById('ckCity').value);
    _set('tyAddr', _isPickup ? 'бул. „Шипченски проход" бл.240' : (_econtOffice ? 'Офис: ' + _econtOffice + ', ' : '') + document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''));
    _set('tyCourier', ckDeliveryNames[ckDeliveryIdx]);
    _set('tyNote', document.getElementById('ckNote').value || '—');
    _set('tyTimestamp', now.toLocaleString('bg-BG'));
    _set('tyDeliveryDateLine', ckDeliveryIdx === 2 ? 'Готова за вземане' : 'Очаквана: ' + fmt(delivDate));
    _set('tySubtotal', fmtEur(subtotal) + ' / ' + fmtBgn(subtotal));
    _set('tyDeliveryCost', delivery === 0 ? 'Безплатно' : fmtEur(delivery) + ' / ' + fmtBgn(delivery));
    _set('tyTotal', fmtEur(total) + ' / ' + fmtBgn(total));
    if (promoApplied) {
      const tyPromoRow = document.getElementById('tyPromoRow'); if (tyPromoRow) tyPromoRow.style.display = '';
      _set('tyPromoAmt', '-' + fmtEur(promoDisc) + ' / ' + fmtBgn(promoDisc));
    }
    _setHTML('tyItems', cart.map(x => `
      <div class="ty-item">
        <div class="ty-item-emoji">${escHtml(x.emoji || '')}</div>
        <div class="ty-item-info">
          <div class="ty-item-name">${escHtml(x.name || '')}</div>
          <div class="ty-item-meta">${escHtml(x.brand || '')} · Количество: ${Number(x.qty) || 0}</div>
        </div>
        <div class="ty-item-price">${fmtEur(x.price * x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price * x.qty)}</span></div>
      </div>`).join(''));

    // Save order to localStorage
    const orderData = {
      num: orderNum,
      customer: document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value,
      email: document.getElementById('ckEmail').value,
      phone: document.getElementById('ckPhone').value,
      city: _isPickup ? 'София (магазин)' : document.getElementById('ckCity').value,
      addr: _isPickup ? 'бул. „Шипченски проход" бл.240' : (_econtOffice ? 'Офис: ' + _econtOffice + ', ' : '') + document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''),
      note: document.getElementById('ckNote').value || '',
      items: cart.map(x => x.name + ' ×' + x.qty).join(', '),
      itemsData: cart.map(x => ({ id: x.id, name: x.name, brand: x.brand, emoji: x.emoji, price: x.price, qty: x.qty })),
      subtotal, delivery, total,
      payment: ckPaymentType,
      deliveryType: ckDeliveryNames[ckDeliveryIdx],
      status: 'pending',
      date: now.toLocaleDateString('bg-BG'),
      ts: now.getTime(),
      b2b: (document.getElementById('ckIsB2B') || {}).checked ? {
        firma: (document.getElementById('ckFirma') || {}).value || '',
        eik:   (document.getElementById('ckEIK')   || {}).value || '',
        vat:   (document.getElementById('ckVAT')   || {}).value || '',
        mol:   (document.getElementById('ckMOL')   || {}).value || '',
      } : null
    };
    try {
      _prevOrders.unshift(orderData);
      localStorage.setItem('mc_orders', JSON.stringify(_prevOrders.slice(0, 200)));
    } catch (e) { }
    // Записване в Supabase (реална база данни)
    if (typeof saveOrderToSupabase === 'function') {
      saveOrderToSupabase(orderData).catch(e => console.error('Supabase save failed:', e));
    }
    // Изчисти abandoned cart записа след успешна поръчка
    if (typeof window.clearAbandonedCart === 'function') {
      window.clearAbandonedCart(orderData.email);
    }
    // Save address for next order (only if user opted in)
    try {
      const saveChk = document.getElementById('ckSaveAddr');
      if (!saveChk || saveChk.checked) {
        localStorage.setItem('mc_saved_addr', JSON.stringify({
          first: document.getElementById('ckFirst').value,
          last: document.getElementById('ckLast').value,
          email: document.getElementById('ckEmail').value,
          phone: document.getElementById('ckPhone').value,
          city: document.getElementById('ckCity').value,
          addr: document.getElementById('ckAddr').value,
          zip: document.getElementById('ckZip').value,
        }));
      } else {
        localStorage.removeItem('mc_saved_addr');
      }
    } catch (e) { }

    // Show thank-you page, clear cart
    closeCheckoutPage();
    document.getElementById('thankyouPage').classList.add('open');
    cart = [];
    updateCart(); saveCart();
    promoApplied = false;
  }, 800);
}

function closeThankyouPage() {
  document.getElementById('thankyouPage').classList.remove('open');
  document.body.style.overflow = '';
}

function printInvoice(num) {
  // Delegates to printOrder() — correct company data + brand-based auto-detection
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) { }
  const o = num ? orders.find(x => x.num === num) : orders[0];
  if (!o) { showToast('⚠️ Няма данни за поръчката'); return; }
  if (typeof printOrder === 'function') { printOrder(o.num); return; }

  const subtotalNoVat = o.subtotal / 1.2;
  const vatAmt = (o.subtotal - subtotalNoVat).toFixed(2);
  const invNum = 'ФК-' + o.num.replace('MC-', '');
  const date = new Date(o.ts || Date.now()).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const payLabel = o.payment === 'card' ? 'Банкова карта' : o.payment === 'cod' ? 'Наложен платеж' : 'Банков превод';
  const delivLabel = o.delivery === 0 ? 'Безплатна' : (Number(o.delivery) / EUR_RATE).toFixed(2) + ' €';

  const rows = (o.itemsData || []).map((x, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escHtml(x.name||'')}</td>
      <td style="text-align:center">${x.qty}</td>
      <td style="text-align:right">${toEur(x.price / 1.2).toFixed(2)} €</td>
      <td style="text-align:right">20%</td>
      <td style="text-align:right">${toEur(x.price * x.qty).toFixed(2)} €</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="UTF-8">
<title>Фактура ${invNum} — Most Computers</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#1a1a1a;padding:40px;max-width:820px;margin:auto}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #bd1105}
  .hdr-logo{font-size:22px;font-weight:900;color:#bd1105;letter-spacing:-0.5px}
  .hdr-logo span{color:#1a1a1a}
  .hdr-company{font-size:11px;color:#555;line-height:1.7;margin-top:4px}
  .hdr-right{text-align:right}
  .hdr-right h1{font-size:30px;font-weight:900;letter-spacing:-1px;color:#1a1a1a}
  .hdr-right .meta{font-size:11px;color:#555;margin-top:4px;line-height:1.7}
  .parties{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
  .party{background:#f8f9fa;border-radius:8px;padding:14px 16px;border-left:3px solid #bd1105}
  .party-lbl{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#bd1105;margin-bottom:6px}
  .party-val{font-size:12px;line-height:1.8;color:#1a1a1a}
  table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11.5px}
  thead tr{background:#1a1a1a;color:#fff}
  th{padding:8px 10px;text-align:left;font-weight:700;font-size:11px}
  td{padding:7px 10px;border-bottom:1px solid #e5e7eb}
  tr:nth-child(even) td{background:#f9fafb}
  .totals-wrap{display:flex;justify-content:flex-end;margin-bottom:24px}
  .totals{width:300px}
  .tot-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #e5e7eb;font-size:12px}
  .tot-row.vat{color:#555}
  .tot-row.final{font-weight:800;font-size:15px;border-top:2px solid #1a1a1a;border-bottom:none;padding-top:10px;margin-top:4px;color:#bd1105}
  .payment-info{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;font-size:11.5px;margin-bottom:32px;color:#166534}
  .legal{font-size:10px;color:#9ca3af;text-align:center;margin-top:24px;line-height:1.6;border-top:1px solid #e5e7eb;padding-top:12px}
  @media print{body{padding:20px}@page{margin:1.5cm}}
</style>
</head>
<body>

<div class="hdr">
  <div>
    <div class="hdr-logo">Most <span>Computers</span></div>
    <div class="hdr-company">
      Most Computers ЕООД &nbsp;|&nbsp; ЕИК: 203000000<br>
      ДДС №: BG203000000<br>
      бул. „Шипченски проход" бл.240, 1111 София<br>
      тел.: +359 2 919 1823 &nbsp;|&nbsp; office@mostcomputers.bg
    </div>
  </div>
  <div class="hdr-right">
    <h1>ФАКТУРА</h1>
    <div class="meta">
      № ${invNum}<br>
      Дата: ${date}<br>
      Поръчка: ${o.num}
    </div>
  </div>
</div>

<div class="parties">
  <div class="party">
    <div class="party-lbl">Продавач</div>
    <div class="party-val">
      <strong>Most Computers ЕООД</strong><br>
      ЕИК: 203000000<br>
      ДДС №: BG203000000<br>
      бул. „Шипченски проход" бл.240<br>
      1111 София, България
    </div>
  </div>
  <div class="party">
    <div class="party-lbl">${o.b2b ? 'Купувач (фирма)' : 'Клиент / Получател'}</div>
    <div class="party-val">
      ${o.b2b ? `<strong>${escHtml(o.b2b.firma || '—')}</strong><br>ЕИК: ${escHtml(o.b2b.eik || '—')}<br>${o.b2b.vat ? 'ДДС №: ' + escHtml(o.b2b.vat) + '<br>' : ''}${o.b2b.mol ? 'МОЛ: ' + escHtml(o.b2b.mol) + '<br>' : ''}` : `<strong>${escHtml(o.customer || '—')}</strong><br>`}
      ${o.addr ? escHtml(o.addr) + '<br>' : ''}
      ${escHtml(o.city || '')}<br>
      тел.: ${escHtml(o.phone || '—')}
    </div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th style="width:28px">№</th>
      <th>Описание на стоката / услугата</th>
      <th style="width:42px;text-align:center">Бр.</th>
      <th style="width:110px;text-align:right">Ед.цена без ДДС</th>
      <th style="width:60px;text-align:right">ДДС %</th>
      <th style="width:110px;text-align:right">Сума с ДДС</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
    <tr>
      <td colspan="5" style="text-align:right;font-size:11px;color:#555">Доставка (${o.deliveryType || 'Куриер'})</td>
      <td style="text-align:right">${delivLabel}</td>
    </tr>
  </tbody>
</table>

<div class="totals-wrap">
  <div class="totals">
    <div class="tot-row"><span>Данъчна основа (без ДДС):</span><span>${(Number(subtotalNoVat)/EUR_RATE).toFixed(2)} €</span></div>
    <div class="tot-row vat"><span>ДДС 20%:</span><span>${(Number(vatAmt)/EUR_RATE).toFixed(2)} €</span></div>
    <div class="tot-row"><span>Доставка:</span><span>${delivLabel}</span></div>
    <div class="tot-row final"><span>ОБЩО ДЪЛЖИМО:</span><span>${(Number(o.total)/EUR_RATE).toFixed(2)} €</span></div>
  </div>
</div>

<div class="payment-info">
  ✅ Начин на плащане: <strong>${payLabel}</strong>
  ${o.payment === 'bank' ? ' &nbsp;|&nbsp; IBAN: BG…  BIC: …  Most Computers ЕООД' : ''}
  &nbsp;|&nbsp; Плащането е извършено.
</div>

<div class="legal">
  Фактурата е издадена на ${date} от Most Computers ЕООД — регистрирано по ЗДДС лице.<br>
  Валидна е без подпис и печат по чл. 6, ал. 1 от Наредба № Н-18 / 13.12.2006 г.
</div>

</body>
</html>`;

  const w = window.open('', '_blank', 'width=860,height=950,scrollbars=yes');
  if (!w) { showToast('⚠️ Разреши pop-up прозорците в браузъра'); return; }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
}

function toggleB2BFields(cb) {
  const el = document.getElementById('ckB2BFields');
  if (el) el.style.display = cb.checked ? '' : 'none';
}

// MOBILE MENU
function toggleMobMenu() {
  const overlay = document.getElementById('mobOverlay');
  const drawer = document.getElementById('mobDrawer');
  const isOpen = drawer.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  // iOS scroll bleed-through fix: position:fixed prevents inertial scroll behind drawer
  if (isOpen) {
    document.body.dataset.scrollY = window.scrollY;
    document.body.style.cssText += ';overflow:hidden;position:fixed;top:-' + window.scrollY + 'px;width:100%';
  } else {
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.cssText = document.body.style.cssText.replace(/overflow:[^;]+;position:fixed;top:[^;]+;width:[^;]+;?/g, '');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }
}
function closeMobMenu() {
  document.getElementById('mobOverlay').classList.remove('open');
  document.getElementById('mobDrawer').classList.remove('open');
  const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
}
function handleMobSearch() {
  const q = document.getElementById('mobSearchInput').value.trim();
  if (q) {
    document.getElementById('searchInput').value = q;
    toggleMobMenu();
    showSearchResultsPage(q);
  }
}

// ===== CART PAGE =====
function openCartPage() {
  // Close drawer if open
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');

  renderCartPage();
  const page = document.getElementById('cartPage');
  if (page) { page.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeCartPage() {
  const page = document.getElementById('cartPage');
  if (page) { page.style.display = 'none'; }
  document.body.style.overflow = '';
}

function renderCartPage() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const countEl = document.getElementById('cpItemCount');
  if (countEl) countEl.textContent = count + ' бр.';

  const itemsEl = document.getElementById('cpItems');
  const emptyEl = document.getElementById('cpEmpty');
  const promoRow = document.getElementById('cpPromoRow');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (promoRow) promoRow.style.display = 'none';
    renderCartPageSummary();
    renderCartPageUpsell();
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (promoRow) promoRow.style.display = '';

  itemsEl.innerHTML = cart.map(x => {
    const save = x.old ? Math.round(((x.old - x.price) / x.old) * 100) : 0;
    const badgeHtml = x.badge === 'sale'
      ? `<span class="cp-badge cp-badge-sale">Промо -${save}%</span>`
      : x.badge === 'new' ? `<span class="cp-badge cp-badge-new">Ново</span>`
        : x.badge === 'hot' ? `<span class="cp-badge cp-badge-hot">Горещо</span>` : '';

    const _xName = escHtml(x.name||''); const _xBrand = escHtml(x.brand||''); const _xSku = escHtml(x.sku||'');
    const imgHtml = x.img
      ? `<img src="${escHtml(x.img)}" alt="${_xName}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="cp-item-emoji is-hidden">${x.emoji}</span>`
      : `<span class="cp-item-emoji">${x.emoji}</span>`;

    return `<div class="cp-card">
      <div class="cp-item-thumb">${imgHtml}</div>
      <div class="cp-item-info">
        <div class="cp-item-brand">${_xBrand}</div>
        <div class="cp-item-name">${_xName}</div>
        <div class="cp-item-sku">${_xSku}</div>
        <div class="cp-item-badges">${badgeHtml}</div>
      </div>
      <div class="cp-item-right">
        <div class="cp-item-prices">
          ${x.old ? `<div class="cp-item-old">${fmtEur(x.old)}</div>` : ''}
          <div class="cp-item-price">${fmtEur(x.price * x.qty)}</div>
          <div class="cp-item-bgn">${fmtBgn(x.price * x.qty)}</div>
        </div>
        <div class="cp-qty-wrap">
          <button type="button" class="cp-qty-btn" onclick="cpChangeQty(${x.id},-1)">−</button>
          <span class="cp-qty-val">${x.qty}</span>
          <button type="button" class="cp-qty-btn" onclick="cpChangeQty(${x.id},1)">+</button>
        </div>
        <button type="button" class="cp-remove-btn" onclick="cpRemoveItem(${x.id})" title="Премахни">×</button>
      </div>
    </div>`;
  }).join('');

  renderCartPageSummary();
  renderCartPageUpsell();
}

function renderCartPageSummary() {
  const el = document.getElementById('cpSummary');
  if (!el) return;
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const savings = cart.reduce((s, x) => s + (x.old ? (x.old - x.price) * x.qty : 0), 0);
  const delivery = subtotal >= FREE_SHIP_BGN ? 0 : Math.round(9.99 * EUR_RATE * 100) / 100;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px 0;font-size:13px;">Добави продукти в кошницата</div>';
    return;
  }

  el.innerHTML = `
    <div class="cp-sum-row"><span>Продукти (${cart.reduce((s, x) => s + x.qty, 0)} бр.)</span><span>${fmtEur(subtotal)}<small>${fmtBgn(subtotal)}</small></span></div>
    ${savings > 0 ? `<div class="cp-sum-row cp-sum-save"><span>✓ Спестяваш</span><span>−${fmtEur(savings)}</span></div>` : ''}
    <div class="cp-sum-row"><span>Доставка</span><span>${delivery === 0 ? '<b style="color:var(--accent2)">Безплатна</b>' : fmtEur(delivery)}</span></div>
    <div class="cp-sum-row"><span>ДДС (вкл.)</span><span>${fmtEur(total * 0.2)}</span></div>
    <hr class="cp-sum-divider">
    <div class="cp-sum-row cp-sum-total"><span>Общо</span><span>${fmtEur(total)}<small>${fmtBgn(total)}</small></span></div>
    ${subtotal < FREE_SHIP_BGN ? `<div class="cp-ship-hint">Добави още <b>${fmtEur(FREE_SHIP_BGN - subtotal)}</b> за безплатна доставка</div>` : ''}`;
}

function renderCartPageUpsell() {
  const el = document.getElementById('cpUpsell');
  if (!el) return;
  const inCart = new Set(cart.map(x => x.id));
  const cats = cart.map(x => x.cat);
  let recs = products.filter(p => !inCart.has(p.id) && cats.includes(p.cat)).slice(0, 3);
  if (recs.length < 2) recs = products.filter(p => !inCart.has(p.id)).slice(0, 3);
  if (!recs.length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="cp-upsell-header">⚡ Може да те заинтересува</div>
    ${recs.map(p => `
      <div class="cp-upsell-item" onclick="openProductPage(${p.id});closeCartPage()">
        <div class="cp-upsell-emoji">${p.emoji}</div>
        <div class="cp-upsell-info">
          <div class="cp-upsell-name">${p.name.length > 40 ? p.name.substring(0, 40) + '…' : p.name}</div>
          <div class="cp-upsell-price">${fmtEur(p.price)} / ${fmtBgn(p.price)}</div>
        </div>
        <button type="button" class="cp-upsell-add" onclick="event.stopPropagation();cpAddUpsell(${p.id})">+ Добави</button>
      </div>`).join('')}`;
}

function cpChangeQty(id, d) {
  changeQty(id, d);
  renderCartPage();
}

function cpRemoveItem(id) {
  removeFromCart(id);
  renderCartPage();
}

function cpAddUpsell(id) {
  addToCart(id);
  renderCartPage();
}

function cpClearCart() {
  if (!cart.length) return;
  if (!confirm('Изчисти цялата кошница?')) return;
  cart = [];
  updateCart(); saveCart();
  renderCartPage();
}

function cpApplyPromo() {
  const input = document.getElementById('cpPromoInput');
  if (!input || !input.value.trim()) return;
  applyPromo(input.value.trim());
}

function cpGoCheckout() {
  closeCartPage();
  handleCheckout();
}

// ===== CART ABANDONMENT REMINDER =====
(function () {
  var _reminderShown = false;
  var _reminderTimer = null;

  function showCartReminder() {
    if (_reminderShown) return;
    if (!cart || cart.length === 0) return;
    if (sessionStorage.getItem('mc_cart_reminded')) return;
    _reminderShown = true;
    sessionStorage.setItem('mc_cart_reminded', '1');

    var total = cart.reduce(function(s, x) { return s + x.price * x.qty; }, 0);
    var count = cart.reduce(function(s, x) { return s + x.qty; }, 0);
    var totalStr = typeof fmtEur === 'function' ? fmtEur(total) : total.toFixed(2) + ' €';

    var el = document.createElement('div');
    el.id = 'cartAbandonToast';
    el.setAttribute('role', 'alert');
    el.innerHTML =
      '<div class="cat-toast-inner">' +
        '<span class="cat-toast-icon">🛒</span>' +
        '<span class="cat-toast-text">Имаш ' + count + ' ' + (count === 1 ? 'продукт' : 'продукта') + ' (' + totalStr + ') в количката</span>' +
        '<button type="button" class="cat-toast-cta" onclick="document.getElementById(\'cartAbandonToast\').remove();handleCheckout()">Завърши →</button>' +
        '<button type="button" class="cat-toast-close" aria-label="Затвори" onclick="document.getElementById(\'cartAbandonToast\').remove()">×</button>' +
      '</div>';
    document.body.appendChild(el);
    // Auto-remove after 8s
    setTimeout(function() { if (el.parentNode) el.remove(); }, 8000);
  }

  function scheduleReminder() {
    clearTimeout(_reminderTimer);
    if (!cart || cart.length === 0) return;
    _reminderTimer = setTimeout(showCartReminder, 30000);
  }

  if (typeof cart === 'undefined' || typeof document === 'undefined') return;
  document.addEventListener('mousemove', scheduleReminder, { passive: true });
  document.addEventListener('touchstart', scheduleReminder, { passive: true });
  document.addEventListener('keydown', scheduleReminder, { passive: true });
  scheduleReminder();
}());

// ===== PHONE ORDER =====
var _phoneOrderProductId = null;

function openPhoneOrder() {
  var p = (typeof products !== 'undefined' && typeof pdpProductId !== 'undefined' && pdpProductId != null)
    ? products.find(function(x) { return x.id === pdpProductId; }) : null;
  _phoneOrderProductId = p ? p.id : null;
  var nameEl = document.getElementById('poProductName');
  if (nameEl) nameEl.textContent = p ? p.name : '';
  var phoneEl = document.getElementById('poPhone');
  if (phoneEl) {
    // Pre-fill from saved address
    try {
      var sa = JSON.parse(localStorage.getItem('mc_saved_addr') || 'null');
      phoneEl.value = (sa && sa.phone) ? sa.phone : '';
    } catch(e) { phoneEl.value = ''; }
    phoneEl.focus();
  }
  var errEl = document.getElementById('poPhoneError');
  if (errEl) errEl.style.display = 'none';
  var backdrop = document.getElementById('phoneOrderBackdrop');
  if (backdrop) { backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closePhoneOrder(e) {
  if (e && e.target !== document.getElementById('phoneOrderBackdrop')) return;
  var backdrop = document.getElementById('phoneOrderBackdrop');
  if (backdrop) { backdrop.classList.remove('open'); document.body.style.overflow = ''; }
}

function submitPhoneOrder() {
  var phoneEl = document.getElementById('poPhone');
  var errEl = document.getElementById('poPhoneError');
  var phone = phoneEl ? phoneEl.value.trim() : '';
  var valid = /^[0-9+\s\-]{7,}$/.test(phone);
  if (!valid) {
    if (errEl) { errEl.textContent = 'Въведете валиден телефонен номер'; errEl.style.display = 'block'; }
    if (phoneEl) phoneEl.focus();
    return;
  }
  var submitBtn = document.getElementById('poSubmitBtn');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Изпращане...'; }
  var p = (typeof products !== 'undefined' && _phoneOrderProductId != null)
    ? products.find(function(x) { return x.id === _phoneOrderProductId; }) : null;
  var orderData = {
    type: 'phone_order',
    phone: phone,
    product_id: _phoneOrderProductId,
    product_name: p ? p.name : '',
    product_price: p ? p.price : null,
    status: 'phone_confirm',
    created_at: new Date().toISOString(),
  };
  if (typeof saveOrderToSupabase === 'function') {
    saveOrderToSupabase(orderData).catch(function() {});
  }
  // Save phone for next time
  try {
    var sa = JSON.parse(localStorage.getItem('mc_saved_addr') || '{}');
    sa.phone = phone;
    localStorage.setItem('mc_saved_addr', JSON.stringify(sa));
  } catch(e) {}
  // Show success
  var modal = document.querySelector('.phone-order-modal');
  if (modal) modal.innerHTML = '<div style="text-align:center;padding:32px 16px"><div style="font-size:48px;margin-bottom:12px">✅</div><div style="font-size:18px;font-weight:700;margin-bottom:8px">Заявката е изпратена!</div><p style="color:var(--text2);font-size:14px">Ще се свържем с вас на <strong>' + phone + '</strong> в рамките на работния ден.</p><button type="button" onclick="closePhoneOrder()" style="margin-top:20px;background:var(--primary);color:#fff;border:none;border-radius:8px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;">Затвори</button></div>';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addToCart, removeFromCart, changeQty,
    applyPromo, renderOrderSummary, formatCardNum, formatExpiry,
    _resetCheckout: () => { ckDeliveryIdx = 0; ckPaymentType = 'card'; promoApplied = false; },
    _setDelivery: (idx) => { ckDeliveryIdx = idx; },
    _setPayment: (type) => { ckPaymentType = type; },
  };
}

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
    if (qtype === 'ean') {
      hint = '<div class="sd-empty-sub">Търсенето по EAN не намери продукт с баркод <strong>' + escHtml(q) + '</strong></div>';
    } else if (qtype === 'sku') {
      hint = '<div class="sd-empty-sub">Търсенето по SKU не намери продукт с код <strong>' + escHtml(q) + '</strong></div>';
    } else {
      // "Did you mean?" — намери близки марки/имена с Levenshtein
      const ql = q.toLowerCase().trim();
      const suggestions = [];
      if (ql.length >= 3 && typeof products !== 'undefined') {
        const seen = new Set();
        const candidates = [];
        products.forEach(p => {
          [p.brand, ...(p.name||'').split(' ').slice(0,2)].forEach(w => {
            const wl = (w||'').toLowerCase();
            if (wl.length >= 3 && !seen.has(wl) && Math.abs(wl.length - ql.length) <= 3) {
              seen.add(wl);
              const dist = _levenshtein(ql, wl.substring(0, ql.length + 2));
              if (dist > 0 && dist <= 2) candidates.push({w, dist});
            }
          });
        });
        candidates.sort((a,b) => a.dist - b.dist);
        candidates.slice(0,3).forEach(c => suggestions.push(c.w));
      }
      if (suggestions.length) {
        const chips = suggestions.map(s =>
          `<span class="sd-suggestion-chip" onclick="document.getElementById('searchInput').value=${JSON.stringify(s)};showSearchResults(${JSON.stringify(s)})">${escHtml(s)}</span>`
        ).join('');
        hint = `<div class="sd-empty-sub">Може би търсиш: ${chips}</div>`;
      } else {
        hint = '<div class="sd-empty-sub">Провери правописа или опитай с SKU / EAN баркод</div>';
      }
    }
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
          <div id="sd-ctrl-${p.id}" class="sd-ctrl">${_sdCtrlHtml(p.id)}</div>
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

function _sdCtrlHtml(id) {
  var inCart = typeof cart !== 'undefined' && cart.find(function(x){return x.id===id;});
  var qty = inCart ? inCart.qty : 0;
  if (qty > 0) {
    return '<div class="sd-qty">' +
      '<button type="button" aria-label="Намали" onclick="event.stopPropagation();changeQty('+id+',-1);_sdRefresh('+id+')">−</button>' +
      '<span>'+qty+'</span>' +
      '<button type="button" aria-label="Увеличи" onclick="event.stopPropagation();addToCart('+id+');_sdRefresh('+id+')">+</button>' +
      '</div>';
  }
  return '<button type="button" class="sd-add-btn" onclick="event.stopPropagation();addToCart('+id+');_sdRefresh('+id+')" aria-label="Добави в кошница">+</button>';
}

function _sdRefresh(id) {
  var el = document.getElementById('sd-ctrl-'+id);
  if (el) el.innerHTML = _sdCtrlHtml(id);
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
  const catLabels = {phones:'Телефони и таблети',laptops:'Лаптопи',desktops:'Настолни компютри',gaming:'Гейминг',monitors:'Монитори',components:'Компоненти',peripherals:'Периферия',network:'Мрежа',storage:'Памет и съхранение',accessories:'Аксесоари',software:'Софтуер'};
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
  // Save to localStorage
  try {
    const subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]');
    if (!subs.includes(v)) { subs.push(v); localStorage.setItem('mc_newsletter', JSON.stringify(subs)); }
  } catch(e) {}
  showToast('✓ Абониран успешно! Ще получаваш най-добрите оферти.');
  if (input) input.value = '';
  // Save to Supabase if available
  if (typeof window.supabase !== 'undefined' && typeof window._sb_client !== 'undefined') {
    window._sb_client.from('newsletter_subscribers')
      .upsert({ email: v, subscribed_at: new Date().toISOString(), source: 'homepage' }, { onConflict: 'email' })
      .catch(function() {});
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    highlightMatch, searchProducts, queryType, saveRecentSearch,
    _resetRecentSearches: () => { recentSearches = []; },
  };
}


// ===== PRODUCT PAGE =====
let pdpProductId = null;
let pdpQtyVal    = 1;
let pdpGallery   = [];
let pdpGalleryIdx = 0;


let _pdpScrollY = 0;
function openProductPage(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  // Save scroll position only when not inside catPage (catPage has its own scroll)
  if (!document.getElementById('catPage')?.classList.contains('open')) {
    _pdpScrollY = window.scrollY || document.documentElement.scrollTop;
  }
  // Hide main sr-only H1 so only the product H1 is active for screen readers
  const mainH1 = document.querySelector('main h1.sr-only');
  if (mainH1) mainH1.setAttribute('aria-hidden', 'true');
  pdpProductId = id;
  pdpQtyVal = 1;
  addToRecentlyViewed(id);

  // Breadcrumb (inline — no wrapper needed)
  const _bcCatLabel = (typeof CAT_LABELS !== 'undefined' ? CAT_LABELS[p.cat] : null) || p.cat;
  if (typeof bcSet === 'function') {
    const _bcCatFn = () => { closeProductPage(); filterCat(p.cat); bcSet([{ label: _bcCatLabel, fn: _bcCatFn }]); };
    // D: find subcat label from SUBCAT_DEFS
    const _subcatLabel = (() => {
      if (!p.subcat || typeof SUBCATS === 'undefined') return null;
      const subs = SUBCATS[p.cat] || [];
      const found = subs.find(s => s.id === p.subcat);
      if (!found) return null;
      return found.label.replace(/^[^\p{L}\p{N}]+\s*/u, '');
    })();
    const _bcItems = [
      { label: _bcCatLabel, url: `https://mostcomputers.bg/?cat=${p.cat}`, fn: _bcCatFn }
    ];
    if (_subcatLabel) {
      const _bcSubFn = () => {
        closeProductPage();
        if (typeof openCatPage === 'function') openCatPage(p.cat);
        if (typeof applySubcatById === 'function') setTimeout(() => applySubcatById(p.subcat), 50);
        bcSet([{ label: _bcCatLabel, fn: _bcCatFn }]);
      };
      _bcItems.push({ label: _subcatLabel, url: `https://mostcomputers.bg/?cat=${p.cat}`, fn: _bcSubFn });
    }
    _bcItems.push({ label: p.name, url: `https://mostcomputers.bg/?product=${p.id}`, fn: null });
    bcSet(_bcItems);
  }
  document.title = p.name + ' | Most Computers';

  // SEO — Dynamic meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} — ${p.brand} | Цена: ${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв. Купи онлайн от Most Computers.`;
    metaDesc.setAttribute('content', descText);
  }

  // Open Graph tags
  function setOG(prop, val) {
    let tag = document.querySelector(`meta[property="${prop}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', prop); document.head.appendChild(tag); }
    tag.setAttribute('content', val);
  }
  function setOGName(name, val) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', name); document.head.appendChild(tag); }
    tag.setAttribute('content', val);
  }
  setOG('og:title',       p.name + ' | Most Computers');
  setOG('og:description', p.desc ? p.desc.substring(0,200) : `${p.name} от ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €`);
  setOG('og:image',       p.img || 'https://mostcomputers.bg/og-default.jpg');
  setOG('og:url',         window.location.href);
  setOG('og:type',        'product');
  setOG('og:site_name',   'Most Computers');
  setOG('product:price:amount',   (p.price/EUR_RATE).toFixed(2));
  setOG('product:price:currency', 'EUR');
  setOGName('twitter:card',        'summary_large_image');
  setOGName('twitter:title',       p.name + ' | Most Computers');
  setOGName('twitter:description', p.desc ? p.desc.substring(0,200) : `${p.brand} — ${p.name}`);
  setOGName('twitter:image',       p.img || '');
  const _canonical = document.querySelector('link[rel="canonical"]');
  if (_canonical) _canonical.setAttribute('href', `https://mostcomputers.bg/?product=${p.id}`);

  // Badges
  let b = '';
  if (p.badge==='sale') b += '<span class="badge badge-sale">Промо</span>';
  if (p.badge==='new')  b += '<span class="badge badge-new">Ново</span>';
  if (p.badge==='hot')  b += '<span class="badge badge-hot">Горещо</span>';
  var _el_pdpBadges=document.getElementById('pdpBadges'); if(_el_pdpBadges) _el_pdpBadges.innerHTML = b;

  // Brand / Name / Rating
  const _pdpB=document.getElementById('pdpBrand'); if(_pdpB){_pdpB.textContent=p.brand||'';if(p.brand){_pdpB.dataset.brandSearch=p.brand;_pdpB.style.cursor='pointer';}}
  document.getElementById('pdpName').textContent  = p.name;
  const _hasRv = p.rv && p.rv > 0;
  const _starsEl = document.getElementById('pdpStars');
  const _rvEl    = document.getElementById('pdpRv');
  if (_hasRv) {
    _starsEl.innerHTML = starsHTML(p.rating);
    _starsEl.style.display = '';
    _rvEl.textContent = `${p.rating} (${p.rv} ревюта)`;
    _rvEl.style.cssText = 'font-size:12px;color:var(--muted);cursor:pointer;';
  } else {
    _starsEl.innerHTML = '';
    _starsEl.style.display = 'none';
    _rvEl.innerHTML = '⭐ <span style="color:var(--primary);font-weight:600;">Бъди първи да напишеш ревю</span>';
    _rvEl.style.cssText = 'font-size:11.5px;cursor:pointer;';
  }

  // E: Spec badges — universal across all categories
  (function renderSpecBadges(prod) {
    const wrap = document.getElementById('pdpSpecBadges');
    if (!wrap) return;
    const sp = prod.specs || {};
    const name = (prod.name || '').toUpperCase();
    const badges = [];
    const b = (text, color) => `<span style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:5px;font-size:10.5px;font-weight:700;border:1.5px solid ${color};color:${color};background:${color}18;white-space:nowrap;">${text}</span>`;

    // Storage — speed class
    if (prod.subcat === 'microsd' || prod.subcat === 'sd_card' || prod.subcat === 'cf_card') {
      if (name.includes('U3') || (sp['Интерфейс']||'').includes('U3')) badges.push(b('U3 ⚡','#3b82f6'));
      else if (name.includes('U1')) badges.push(b('U1','#64748b'));
      if (name.includes('V30') || (sp['Интерфейс']||'').includes('V30')) badges.push(b('V30 🎥','#8b5cf6'));
      else if (name.includes('V10')) badges.push(b('V10','#64748b'));
      if (name.includes('A2')) badges.push(b('A2 📱','#10b981'));
      else if (name.includes('A1')) badges.push(b('A1 📱','#10b981'));
      if (sp['Скорост четене']) badges.push(b('↓ ' + sp['Скорост четене'],'#f59e0b'));
      if (sp['Скорост запис'])  badges.push(b('↑ ' + sp['Скорост запис'], '#f59e0b'));
    }
    // USB flash
    if (prod.subcat === 'usb_flash') {
      if (name.includes('USB3.2') || (sp['Интерфейс']||'').includes('3.2')) badges.push(b('USB 3.2 ⚡','#3b82f6'));
      else if (name.includes('USB3') || (sp['Интерфейс']||'').includes('3.0') || (sp['Интерфейс']||'').includes('3.1')) badges.push(b('USB 3.0 ⚡','#3b82f6'));
      else badges.push(b('USB 2.0','#64748b'));
      if (name.includes('TYPE-C') || name.includes('USB-C') || name.includes('/DT70') || (sp['Интерфейс']||'').toLowerCase().includes('type-c')) badges.push(b('USB-C','#6d28d9'));
      if (name.includes('DUAL') || name.includes('OTG')) badges.push(b('Dual OTG','#0ea5e9'));
      if (sp['Скорост четене']) badges.push(b('↓ ' + sp['Скорост четене'],'#f59e0b'));
    }
    // RAM
    if (prod.subcat === 'ram') {
      const iface = (sp['Интерфейс'] || sp['Type'] || '').toUpperCase();
      if (iface.includes('DDR5')) badges.push(b('DDR5','#8b5cf6'));
      else if (iface.includes('DDR4')) badges.push(b('DDR4','#3b82f6'));
      else if (iface.includes('DDR3')) badges.push(b('DDR3','#64748b'));
      const freq = sp['Честота'] || sp['Speed'] || sp['Frequency'] || '';
      if (freq) badges.push(b(freq,'#f59e0b'));
      const cap = sp['Капацитет'] || sp['Capacity'] || '';
      if (cap) badges.push(b(cap,'#10b981'));
    }
    // SSD/HDD
    if (prod.subcat === 'ssd' || prod.subcat === 'hdd') {
      const iface = (sp['Интерфейс'] || sp['Interface'] || '').toUpperCase();
      if (iface.includes('NVME') || iface.includes('M.2')) badges.push(b('NVMe M.2','#8b5cf6'));
      else if (iface.includes('SATA')) badges.push(b('SATA','#3b82f6'));
      const cap = sp['Капацитет'] || sp['Capacity'] || '';
      if (cap) badges.push(b(cap,'#10b981'));
      if (sp['Скорост четене']) badges.push(b('↓ ' + sp['Скорост четене'],'#f59e0b'));
    }
    // GPU
    if (prod.subcat === 'gpu') {
      const vram = sp['VRAM'] || sp['Видеопамет'] || sp['Memory'] || '';
      if (vram) badges.push(b(vram + ' VRAM','#8b5cf6'));
      const conn = sp['Конектор'] || sp['Interface'] || '';
      if (conn.toUpperCase().includes('PCIE 5')) badges.push(b('PCIe 5.0','#f59e0b'));
      else if (conn.toUpperCase().includes('PCIE 4')) badges.push(b('PCIe 4.0','#f59e0b'));
    }
    // CPU
    if (prod.subcat === 'cpu') {
      const cores = sp['Ядра'] || sp['Cores'] || '';
      if (cores) badges.push(b(cores + ' ядра','#3b82f6'));
      const socket = sp['Сокет'] || sp['Socket'] || '';
      if (socket) badges.push(b(socket,'#6d28d9'));
      const tdp = sp['TDP'] || '';
      if (tdp) badges.push(b(tdp + ' TDP','#f59e0b'));
    }
    // Monitors
    if (prod.cat === 'monitors' || prod.subcat === 'gaming_mon' || prod.subcat === 'mon_4k') {
      const hz = sp['Честота'] || sp['Refresh rate'] || '';
      if (hz) badges.push(b(hz,'#8b5cf6'));
      const panel = sp['Тип панел'] || sp['Panel'] || '';
      if (panel) badges.push(b(panel,'#3b82f6'));
      const res = sp['Резолюция'] || sp['Resolution'] || '';
      if (res) badges.push(b(res,'#10b981'));
    }
    // Network
    if (prod.cat === 'network') {
      const wifi = sp['WiFi'] || sp['Стандарт'] || '';
      if (wifi) badges.push(b(wifi,'#3b82f6'));
      const ports = sp['Портове'] || sp['Ports'] || '';
      if (ports) badges.push(b(ports,'#10b981'));
    }

    if (badges.length) {
      wrap.innerHTML = badges.join('');
      wrap.style.display = 'flex';
    } else {
      wrap.innerHTML = '';
      wrap.style.display = 'none';
    }
  })(p);

  // Price
  const priceBgn = p.price;
  const prEl = document.getElementById('pdpPrice');
  prEl.textContent = fmtEur(priceBgn);
  prEl.className   = 'pdp-price-main' + (p.badge==='sale' ? ' sale' : '');
  document.getElementById('pdpPriceEur').textContent = `${fmtBgn(priceBgn)}`;

  const oldRow = document.getElementById('pdpOldRow');
  if (p.old) {
    document.getElementById('pdpOld').textContent = fmtEur(p.old) + ' / ' + fmtBgn(p.old);
    document.getElementById('pdpSave').textContent = '-' + Math.round((p.old-p.price)/p.old*100) + '%';
    oldRow.style.display = 'flex';
  } else {
    oldRow.style.display = 'none';
  }
  var _el_pdpMonthly=document.getElementById('pdpMonthly');
  if(_el_pdpMonthly){
    const _eurPrice = p.price / EUR_RATE;
    if(_eurPrice >= 60){
      const mo24 = (_eurPrice / 24).toFixed(2);
      _el_pdpMonthly.innerHTML=`<span>или от <strong>${mo24} €/мес.</strong> × 24 вноски</span>`;
      _el_pdpMonthly.style.display='';
    } else {
      _el_pdpMonthly.innerHTML='';
      _el_pdpMonthly.style.display='none';
    }
  }

  // Stock
  const inStock = p.stock !== false;
  const stockEl = document.getElementById('pdpStock');
  stockEl.className = 'pdp-stock ' + (inStock ? 'in' : 'out');
  const stockNum = typeof p.stock === 'number' && p.stock > 0 ? p.stock : null;
  let stockTxt = 'Изчерпан';
  if (inStock) {
    stockTxt = (stockNum !== null && stockNum <= 5) ? `⚠️ Само ${stockNum} бр. в наличност` : '✓ В наличност';
  }
  document.getElementById('pdpStockTxt').textContent = stockTxt;
  // Show/hide back-in-stock notify button
  const bisBtn = document.getElementById('pdpNotifyStock');
  if (bisBtn) bisBtn.style.display = inStock ? 'none' : 'flex';
  const pdpAddBtn = document.getElementById('pdpAddBtn');
  if (pdpAddBtn) { pdpAddBtn.disabled = !inStock; pdpAddBtn.style.opacity = inStock ? '' : '0.4'; }
  // Restore BIS subscription state
  if (!inStock) {
    const savedBisEmail = localStorage.getItem('mc_bis_' + id);
    const notifyForm = document.getElementById('pdpNotifyForm');
    const notifySuccess = document.getElementById('pdpNotifySuccess');
    const notifyEmail = document.getElementById('pdpNotifyEmail');
    if (savedBisEmail && notifyForm && notifySuccess) {
      notifyForm.style.display = 'none';
      notifySuccess.style.display = 'block';
      notifySuccess.textContent = `✓ Ще те уведомим на ${savedBisEmail} веднага щом продуктът е наличен!`;
    } else if (notifyForm && notifySuccess) {
      notifyForm.style.display = '';
      notifySuccess.style.display = 'none';
      if (notifyEmail) notifyEmail.value = '';
    }
  }

  // M-1: Price alert button state
  (function _pdpRenderAlertBtn(prod) {
    const btn = document.getElementById('pdpPriceAlertBtn');
    const lbl = document.getElementById('pdpPriceAlertLabel');
    if (!btn || !lbl) return;
    let alerts = {};
    try { alerts = JSON.parse(localStorage.getItem('mc_price_alerts') || '{}'); } catch(e) {}
    const isSet = !!alerts[prod.id];
    btn.classList.toggle('active', isSet);
    lbl.textContent = isSet ? 'Следиш цената ✓' : 'При намаление';
    // Check if price dropped since alert was set
    if (isSet && prod.price < alerts[prod.id].price) {
      showToast('🎉 Цената на "' + prod.name.substring(0, 30) + '..." е паднала!');
      delete alerts[prod.id];
      try { localStorage.setItem('mc_price_alerts', JSON.stringify(alerts)); } catch(e) {}
      btn.classList.remove('active');
      lbl.textContent = 'При намаление';
    }
  })(p);

  // Quick specs hidden
  const specs = p.specs || {};
  var _el_pdpQuickSpecs=document.getElementById('pdpQuickSpecs'); if(_el_pdpQuickSpecs) _el_pdpQuickSpecs.innerHTML = '';

  // Qty
  document.getElementById('pdpQty').textContent = '1';

  // Wishlist btn
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) wishBtn.innerHTML = wishlist.includes(id) ? '❤ В любими' : '♡ Добави в желания';

  // Meta
  document.getElementById('pdpSku').textContent     = p.sku  || '—';
  document.getElementById('pdpEan').textContent     = p.ean  || p.sku || '—';
  document.getElementById('pdpWarranty').textContent = specs['Warranty'] || specs['Гаранция'] || specs['warrantyInMonths'] || '24 месеца';

  // ── Gallery ──
  pdpGallery = [];
  if (p.gallery && p.gallery.length) {
    pdpGallery = p.gallery;
  } else if (p.img) {
    pdpGallery = [p.img];
  }
  pdpGalleryIdx = 0;
  // Show skeleton while image loads
  const _imgWrap = document.querySelector('.pdp-main-img-wrap');
  if (_imgWrap) _imgWrap.classList.add('img-loading');
  pdpRenderGallery();
  const _mainImg = document.getElementById('pdpMainImg');
  if (_mainImg) {
    const _removeLoading = function(){ if(_imgWrap) _imgWrap.classList.remove('img-loading'); };
    _mainImg.addEventListener('load', _removeLoading, { once: true });
    _mainImg.addEventListener('error', _removeLoading, { once: true });
    if (_mainImg.complete) _removeLoading();
  }

  // ── Full specs table ──
  const tbody = document.getElementById('pdpSpecsTbody');
  if (tbody) {
    let specRows = `<tr><th scope="row">SKU / Part Number</th><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.sku||'—'}</td></tr>`;
    if (p.ean) specRows += `<tr><th scope="row">EAN / Баркод</th><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.ean}</td></tr>`;
    const _se = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    specRows += Object.entries(specs).map(([k,v]) => `<tr><th scope="row">${_se(k)}</th><td>${_se(v)}</td></tr>`).join('');
    tbody.innerHTML = specRows || '<tr><td colspan="2" style="color:var(--muted);text-align:center;padding:24px;">Няма данни за спецификации.</td></tr>';
  }

  // ── Description (HTML) ──
  const htmlContent = document.getElementById('pdpHtmlContent');
  if (htmlContent) {
    if (p.htmlDesc) {
      // htmlDesc is admin-authored HTML — kept as-is (trusted source)
      htmlContent.innerHTML = p.htmlDesc;
    } else if (p.desc) {
      // p.desc may come from XML — render as plain text to prevent XSS
      htmlContent.innerHTML = '';
      const para = document.createElement('p');
      para.style.cssText = 'font-size:14px;line-height:1.8;color:var(--text2);';
      para.textContent = p.desc;
      htmlContent.appendChild(para);
    } else {
      htmlContent.innerHTML = '<p style="color:var(--muted);font-size:13px;">Няма добавено описание за този продукт.</p>';
    }
  }

  // ── Video ──
  const videoWrap = document.getElementById('pdpVideoWrap');
  if (p.videoUrl) {
    pdpRenderVideo(p.videoUrl, videoWrap);
  } else {
    videoWrap.innerHTML = `<div class="pdp-video-placeholder"><span>▶</span><div style="font-size:13px;color:var(--muted);">Няма добавено видео за този продукт.</div></div>`;
  }

  // ── Reviews ──
  const revEl = document.getElementById('pdpReviews');
  // Build merged review list without mutating the shared product object
  let displayRevs = p.reviews ? [...p.reviews] : [];
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    const userRevs = saved[id] || [];
    if (userRevs.length) {
      const existingKeys = new Set(displayRevs.map(r => r.name + '|' + r.date));
      userRevs.forEach(r => {
        if (!existingKeys.has(r.name + '|' + r.date)) displayRevs.unshift(r);
      });
    }
  } catch(e) {}
  // Show only approved reviews publicly; pending ones need admin approval
  const publicRevs = displayRevs.filter(r => !r.pending);
  if (typeof pdpRenderRatingBreakdown === 'function') pdpRenderRatingBreakdown(publicRevs);
  if (publicRevs.length) {
    const _esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    revEl.innerHTML = publicRevs.map(r =>
      `<div class="review-item"><div class="review-header"><span class="review-name">${_esc(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_esc(r.date)}</span></div><div class="review-text">${_esc(r.text)}</div></div>`
    ).join('');
  } else {
    revEl.innerHTML = '<p style="color:var(--muted);font-size:13px;">Все още няма ревюта за този продукт.</p>';
  }

  // ── Vendor ──
  const vendorDiv = document.getElementById('pdpVendorContent');
  if (vendorDiv) {
    if (p.vendorUrl) {
      vendorDiv.innerHTML = `
        <p style="font-size:13px;color:var(--text2);margin-bottom:12px;">Посетете официалния сайт на производителя за повече информация.</p>
        <a class="pdp-vendor-link" href="${p.vendorUrl}" target="_blank" rel="noopener">
          🌐 <span>Официален сайт — ${p.brand || 'Производител'}</span>
          <span style="margin-left:auto;font-size:11px;color:var(--muted);">↗</span>
        </a>`;
    } else {
      vendorDiv.innerHTML = '<p style="color:var(--muted);font-size:13px;">Няма добавен линк към производителя.</p>';
    }
  }

  // Show reviews tab by default if product has reviews, otherwise specs
  const _hasPublicRevs = (p.reviews || []).filter(r => !r.pending).length > 0
    || (() => { try { return (JSON.parse(localStorage.getItem('mc_reviews') || '{}')[p.id] || []).length > 0; } catch(e) { return false; } })();
  pdpSwitchTab(_hasPublicRevs ? 'reviews' : 'specs');
  pdpUpdateStickyBar(p);
  // pdpShowViewers и pdpRenderSparkline премахнати — генерираха фалшиви данни
  pdpInitDeliveryTimer();
  pdpRenderBundle(p);
  pdpRenderRelated(p);
  pdpRenderRvCarousel();
  pdpLoadQA(p.id);
  if (typeof pdpRenderRecsWidget === 'function') pdpRenderRecsWidget(p);
  pdpInitZoom();
  pdpInitSwipe();
  pdpInitTabsScroll();
  if (typeof pdpInitDeliveryTimer === 'function') pdpInitDeliveryTimer();
  // Sidebar disabled — specs already shown in main tab
  if (typeof pdpInitPinch === 'function') pdpInitPinch();
  if (typeof _pdpCompareReset === 'function') _pdpCompareReset();
  const _pdpEl = document.getElementById('pdpBackdrop');
  _pdpEl.scrollTop = 0;
  _pdpEl.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  // ── Structured Data (Product + BreadcrumbList) ──
  const _avgRating = p.rating || 0;
  const _rvCount   = p.rv    || 0;
  const _schemaId  = 'pdpJsonLd';
  let _schemaTag   = document.getElementById(_schemaId);
  if (!_schemaTag) {
    _schemaTag = document.createElement('script');
    _schemaTag.type = 'application/ld+json';
    _schemaTag.id   = _schemaId;
    document.head.appendChild(_schemaTag);
  }
  const _catLabel = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[p.cat]) ? CAT_LABELS[p.cat] : p.cat;
  const _priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const _images = Array.isArray(p.gallery) && p.gallery.length ? p.gallery : (p.img ? [p.img] : []);
  const _productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.name,
    "image": _images,
    "description": p.desc || p.name,
    "brand": { "@type": "Brand", "name": p.brand || '' },
    "sku": p.sku || '',
    ...(p.ean ? { "gtin13": p.ean } : {}),
    "offers": {
      "@type": "Offer",
      "url": `${location.origin}/?product=${p.id}`,
      "priceCurrency": "BGN",
      "price": p.price,
      "priceValidUntil": _priceValidUntil,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": p.stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Most Computers" }
    },
    ...(_avgRating && _rvCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": _avgRating,
        "reviewCount": _rvCount,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {})
  };
  if (Array.isArray(p.reviews) && p.reviews.length > 0) {
    _productSchema.review = p.reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": r.date,
      "reviewBody": r.text,
      "reviewRating": { "@type": "Rating", "ratingValue": r.stars, "bestRating": 5, "worstRating": 1 }
    }));
  }
  _schemaTag.textContent = JSON.stringify([
    _productSchema,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Начало", "item": window.location.origin + "/" },
        { "@type": "ListItem", "position": 2, "name": _catLabel, "item": window.location.origin + "/?cat=" + p.cat },
        { "@type": "ListItem", "position": 3, "name": p.name }
      ]
    }
  ]);
}

function closeProductPage() {
  pdpSearchDropClose();
  const _st = document.getElementById('pdpScrollTop');
  if (_st) _st.style.display = 'none';
  // Restore main H1 visibility for screen readers
  const mainH1 = document.querySelector('main h1.sr-only');
  if (mainH1) mainH1.removeAttribute('aria-hidden');
  document.getElementById('pdpBackdrop').classList.remove('open');
  const _sb = document.getElementById('pdpStickyBar');
  if (_sb) _sb.classList.remove('visible');
  // Keep body locked if cat-page is still open
  if (!document.getElementById('catPage')?.classList.contains('open')) {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    // Restore scroll position
    requestAnimationFrame(() => window.scrollTo(0, _pdpScrollY));
  }
  // Stop any video
  const videoWrap = document.getElementById('pdpVideoWrap');
  if (videoWrap) {
    const iframe = videoWrap.querySelector('iframe');
    if (iframe) iframe.src = iframe.src;
  }
  // Breadcrumb — pop back to category if present
  document.title = 'Most Computers | Онлайн магазин за компютри и компоненти';
  // Reset meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'Most Computers – онлайн магазин за компютри, компоненти, монитори, периферия и мрежово оборудване.');
  // Reset OG
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | Онлайн магазин за компютри и компоненти');
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', 'https://mostcomputers.bg/og-default.jpg');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/');
  if (typeof bcSet === 'function') {
    if (_bcTrail.length >= 2) {
      bcSet([_bcTrail[0]]);
    } else {
      bcSet([]);
    }
  }
}

function pdpSwitchTab(tab) {
  document.querySelectorAll('.pdp-tab').forEach(t => {
    const action = t.getAttribute('data-action') || t.getAttribute('onclick') || '';
    t.classList.toggle('active', action.includes(`'${tab}'`));
  });
  document.querySelectorAll('.pdp-tab-content').forEach(c => c.classList.remove('active'));
  const el = document.getElementById(`pdp-tab-${tab}`);
  if (el) el.classList.add('active');
  // Re-read reviews from localStorage every time the tab is opened
  if (tab === 'reviews' && pdpProductId != null) {
    const p = products.find(x => x.id === pdpProductId);
    const revEl = document.getElementById('pdpReviews');
    if (!p || !revEl) return;
    let displayRevs = p.reviews ? [...p.reviews] : [];
    try {
      const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
      const userRevs = saved[pdpProductId] || [];
      const existingKeys = new Set(displayRevs.map(r => r.name + '|' + r.date));
      userRevs.forEach(r => { if (!existingKeys.has(r.name + '|' + r.date)) displayRevs.unshift(r); });
    } catch(e) {}
    const publicRevs = displayRevs.filter(r => !r.pending);
    if (typeof pdpRenderRatingBreakdown === 'function') pdpRenderRatingBreakdown(publicRevs);
    const _escR = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    revEl.innerHTML = publicRevs.length
      ? publicRevs.map(r => `<div class="review-item"><div class="review-header"><span class="review-name">${_escR(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_escR(r.date)}</span></div><div class="review-text">${_escR(r.text)}</div></div>`).join('')
      : '<p style="color:var(--muted);font-size:13px;">Все още няма ревюта за този продукт.</p>';
  }
}

function pdpRenderGallery() {
  const mainImg   = document.getElementById('pdpMainImg');
  const mainEmoji = document.getElementById('pdpMainEmoji');
  const thumbsEl  = document.getElementById('pdpThumbs');
  const p = products.find(x => x.id === pdpProductId);
  if (!p) return;

  if (pdpGallery.length && pdpGallery[pdpGalleryIdx]) {
    mainImg.src = pdpGallery[pdpGalleryIdx];
    mainImg.alt = p.name;
    mainImg.style.display = '';
    mainEmoji.style.display = 'none';
    mainImg.onerror = function() {
      this.style.display = 'none';
      mainEmoji.style.display = '';
      mainEmoji.textContent = p.emoji || '🖥';
      this.onerror = null;
    };
  } else {
    mainImg.style.display = 'none';
    mainEmoji.style.display = '';
    mainEmoji.textContent = p.emoji || '🖥';
  }

  if (pdpGallery.length > 1) {
    thumbsEl.innerHTML = pdpGallery.map((url, i) =>
      `<div class="pdp-thumb ${i===pdpGalleryIdx?'active':''}" onclick="pdpGallerySet(${i})">
        <img src="${url}" alt="" onerror="this.style.display='none'">
      </div>`
    ).join('');
  } else {
    thumbsEl.innerHTML = '';
  }
}

function pdpGalleryNav(dir) {
  if (!pdpGallery.length) return;
  pdpGalleryIdx = (pdpGalleryIdx + dir + pdpGallery.length) % pdpGallery.length;
  pdpRenderGallery();
}

function pdpGallerySet(i) {
  pdpGalleryIdx = i;
  pdpRenderGallery();
}

function pdpRenderVideo(url, wrap) {
  let embedUrl = url;
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) embedUrl = `https://player.vimeo.com/video/${vmMatch[1]}`;

  const isEmbed = embedUrl !== url || url.includes('embed') || url.includes('youtube') || url.includes('vimeo');
  if (isEmbed || url.startsWith('http')) {
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      wrap.innerHTML = `<video controls><source src="${url}"></video>`;
    } else {
      wrap.innerHTML = `<iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  } else {
    wrap.innerHTML = `<div class="pdp-video-placeholder"><span>▶</span><div style="font-size:13px;color:var(--muted);">Невалиден видео линк.</div></div>`;
  }
}

function pdpChangeQty(d) {
  pdpQtyVal = Math.max(1, pdpQtyVal + d);
  // Sync all qty displays (main page, sticky bar, bottom sheet)
  ['pdpQty', 'pdpStickyQty', 'pdpBsQty'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = pdpQtyVal;
  });
}

function pdpAddToCart() {
  if (!pdpProductId) return;
  const p = products.find(x => x.id === pdpProductId);
  if (!p) return;
  const ex = cart.find(x => x.id === pdpProductId);
  if (ex) { ex.qty += pdpQtyVal; } else { cart.push({...p, qty: pdpQtyVal}); }
  updateCart();
  if (typeof saveCart === 'function') saveCart();
  // Visual feedback on ALL add-to-cart buttons (main, sticky bar, bottom sheet)
  const addBtns = [
    document.getElementById('pdpAddBtn'),
    document.querySelector('#pdpStickyBar .pdp-sticky-atc'),
    document.querySelector('#pdpBottomSheet .pdp-add-btn'),
  ];
  addBtns.forEach(btn => {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Добавен!';
    btn.style.background = 'var(--accent2)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
  });
  showToast(`✓ ${p.name.substring(0,32)}… добавен в кошницата!`);
  // Reveal checkout shortcut buttons
  const ckBtn = document.getElementById('pdpCheckoutBtn');
  if (ckBtn) ckBtn.style.display = '';
  const stickyBtn = document.getElementById('pdpStickyCheckoutBtn');
  if (stickyBtn) stickyBtn.style.display = '';
}

function pdpCopyProductLink() {
  const url = location.origin + location.pathname + '?product=' + pdpProductId;
  navigator.clipboard.writeText(url).then(() => showToast('🔗 Линкът е копиран!')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    showToast('🔗 Линкът е копиран!');
  });
}

function pdpTogglePriceAlert() {
  const p = products.find(x => x.id === pdpProductId);
  if (!p) return;
  let alerts = {};
  try { alerts = JSON.parse(localStorage.getItem('mc_price_alerts') || '{}'); } catch(e) {}
  const btn = document.getElementById('pdpPriceAlertBtn');
  const lbl = document.getElementById('pdpPriceAlertLabel');
  if (alerts[p.id]) {
    delete alerts[p.id];
    if (btn) btn.classList.remove('active');
    if (lbl) lbl.textContent = 'При намаление';
    showToast('🔕 Спрян price alert за ' + p.name.substring(0, 25) + '...');
  } else {
    alerts[p.id] = { price: p.price, name: p.name, set: Date.now() };
    if (btn) btn.classList.add('active');
    if (lbl) lbl.textContent = 'Следиш цената ✓';
    showToast('🔔 Ще те уведомим ако цената падне!');
  }
  try { localStorage.setItem('mc_price_alerts', JSON.stringify(alerts)); } catch(e) {}
}

function pdpShareFacebook() {
  const url = encodeURIComponent(location.origin + location.pathname + '?product=' + pdpProductId);
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'width=600,height=400');
}

function pdpShareViber() {
  const p = products.find(x => x.id === pdpProductId);
  const url = location.origin + location.pathname + '?product=' + pdpProductId;
  const text = encodeURIComponent((p ? p.name + ' — ' : '') + url);
  window.open('viber://forward?text=' + text, '_blank');
}

function pdpToggleWish() {
  if (!pdpProductId) return;
  toggleWishlist(pdpProductId, null);
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) wishBtn.innerHTML = wishlist.includes(pdpProductId) ? '❤ В любими' : '♡ Добави в желания';
}



// ===== 2. MODAL SKELETON =====
function showModalSkeleton() {
  const backdrop = document.getElementById('productModalBackdrop');
  const gallery = document.getElementById('modalGallery');
  const info = document.querySelector('.modal-info');
  if (!backdrop || !gallery || !info) return;

  gallery.innerHTML = `<div class="modal-skeleton"><div class="modal-sk-img"></div></div>`;
  info.innerHTML = `
    <div class="modal-skeleton" style="padding:8px 0;">
      <div class="modal-sk-badge" style="width:70px;height:18px;border-radius:9px;background:var(--bg2);margin-bottom:10px;"></div>
      <div class="modal-sk-title" style="width:90%;height:22px;border-radius:6px;background:var(--bg2);margin-bottom:8px;"></div>
      <div class="modal-sk-title" style="width:60%;height:14px;border-radius:6px;background:var(--bg2);margin-bottom:16px;"></div>
      <div class="modal-sk-price"></div>
      <div class="modal-sk-line" style="width:100%;margin-top:16px;"></div>
      <div class="modal-sk-line" style="width:85%;"></div>
      <div class="modal-sk-line" style="width:70%;"></div>
      <div class="modal-sk-btn"></div>
      <div class="modal-sk-btn" style="margin-top:8px;opacity:.5;"></div>
    </div>`;

  backdrop.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

// ===== 3. GALLERY SWIPE =====
(function initGallerySwipe() {
  let startX = 0, startY = 0;
  document.addEventListener('touchstart', e => {
    const gallery = e.target.closest('.modal-gallery');
    if (!gallery) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const gallery = e.target.closest('.modal-gallery');
    if (!gallery) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      galleryNav(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
})();


// ===== FREE SHIPPING BAR (QW-08) =====
function updatePdpShipBar() {
  const bar = document.getElementById('pdpShipBar');
  const txt = document.getElementById('pdpShipBarText');
  const fill = document.getElementById('pdpShipBarFill');
  if (!bar || !txt || !fill) return;
  const FREE_SHIP_EUR = 100;
  let cartTotal = 0;
  try {
    const cart = JSON.parse(localStorage.getItem('mc_cart') || '[]');
    cartTotal = cart.reduce((s, i) => {
      const pr = products.find(x => x.id === i.id);
      return s + (pr ? pr.price * i.qty : 0);
    }, 0);
  } catch(e) {}
  const cartEur = cartTotal / EUR_RATE;
  const pct = Math.min(100, Math.round(cartEur / FREE_SHIP_EUR * 100));
  fill.style.width = pct + '%';
  if (cartEur >= FREE_SHIP_EUR) {
    txt.innerHTML = '✅ Имаш безплатна доставка!';
    fill.style.background = 'var(--success, #22c55e)';
  } else {
    const need = (FREE_SHIP_EUR - cartEur).toFixed(2);
    txt.innerHTML = `🚚 Добави още <b>${need} €</b> за безплатна доставка`;
    fill.style.background = 'var(--primary)';
  }
  bar.style.display = '';
}

// ===== ALSO BOUGHT (QW-06) =====
function renderAlsoBought(currentId) {
  const section = document.getElementById('alsoBoughtSection');
  const track = document.getElementById('alsoBoughtTrack');
  if (!section || !track) return;
  let topIds = [];
  try {
    const log = JSON.parse(localStorage.getItem('mc_analytics_log') || '[]');
    const freq = {};
    log.filter(e => e.event === 'add_to_cart' && e.id !== currentId)
       .forEach(e => { freq[e.id] = (freq[e.id] || 0) + 1; });
    topIds = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>parseInt(id));
  } catch(e) {}
  // Fallback: top rated from same category
  if (topIds.length < 2) {
    const p = products.find(x => x.id === currentId);
    const catTop = p ? [...products].filter(x => x.id !== currentId && x.cat === p.cat)
      .sort((a,b) => b.rating - a.rating).slice(0,4).map(x=>x.id) : [];
    topIds = [...new Set([...topIds, ...catTop])].slice(0,4);
  }
  const items = topIds.map(id => products.find(x=>x.id===id)).filter(Boolean);
  if (items.length < 2) { section.style.display = 'none'; return; }
  track.innerHTML = items.map(r => `
    <div class="related-card" onclick="openProductModal(${r.id})">
      <span class="related-card-emoji">${escHtml(r.emoji||'')}</span>
      <div class="related-card-name">${escHtml(r.name)}</div>
      <div class="related-card-price">${fmtEur(r.price)}</div>
    </div>`).join('');
  section.style.display = '';
}

// ===== 4. RELATED CAROUSEL =====
let relatedOffset = 0;
function renderRelated(currentId) {
  const p = products.find(x => x.id === currentId);
  if (!p) return;
  // Same subcat, similar price (±35%); fallback to same cat; fallback to all
  let related = products.filter(x => x.id !== currentId && x.subcat && x.subcat === p.subcat
    && Math.abs(x.price - p.price) / p.price <= 0.35);
  if (related.length < 3) related = products.filter(x => x.id !== currentId && x.cat === p.cat);
  if (related.length < 3) related = products.filter(x => x.id !== currentId);
  related = related.slice(0, 8);

  const track = document.getElementById('relatedTrack');
  if (!track) return;
  relatedOffset = 0;
  track.style.transform = 'translateX(0)';
  track.innerHTML = related.map(r => `
    <div class="related-card" onclick="openProductModal(${r.id})">
      <span class="related-card-emoji">${escHtml(r.emoji||'')}</span>
      <div class="related-card-name">${escHtml(r.name)}</div>
      <div class="related-card-price">${fmtEur(r.price)}</div>
    </div>`).join('');
  updateRelatedNav(related.length);
}

function relatedNav(dir) {
  const track = document.getElementById('relatedTrack');
  const wrap = document.getElementById('relatedWrap');
  if (!track || !wrap) return;
  const cardW = 152; // 140px + 12px gap
  const visible = Math.floor(wrap.offsetWidth / cardW);
  const total = track.children.length;
  const maxOffset = Math.max(0, total - visible);
  relatedOffset = Math.max(0, Math.min(maxOffset, relatedOffset + dir));
  track.style.transform = `translateX(-${relatedOffset * cardW}px)`;
  updateRelatedNav(total);
}

function updateRelatedNav(total) {
  const wrap = document.getElementById('relatedWrap');
  const cardW = 152;
  const visible = wrap ? Math.floor(wrap.offsetWidth / cardW) : 3;
  const prevBtn = document.getElementById('relatedPrev');
  const nextBtn = document.getElementById('relatedNext');
  if (prevBtn) prevBtn.classList.toggle('hidden', relatedOffset === 0);
  if (nextBtn) nextBtn.classList.toggle('hidden', relatedOffset >= total - visible);
}


// ===== 🖼 IMAGE ZOOM =====
(function initImageZoom() {
  document.addEventListener('mousemove', e => {
    const wrap = e.target.closest('.modal-gallery-zoom');
    if (!wrap) return;
    const img = wrap.querySelector('.modal-main-img');
    if (!img || img.style.display === 'none') return;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    wrap.style.setProperty('--zoom-x', x + '%');
    wrap.style.setProperty('--zoom-y', y + '%');
  });

  // Touch zoom toggle (mobile double-tap)
  let lastTap = 0;
  document.addEventListener('touchend', e => {
    const wrap = e.target.closest('.modal-gallery-zoom');
    if (!wrap) return;
    const now = Date.now();
    if (now - lastTap < 300) {
      wrap.classList.toggle('zoomed');
      e.preventDefault();
    }
    lastTap = now;
  }, { passive: false });
})();


// ===== BACK IN STOCK =====
function submitNotifyStock() {
  const email = document.getElementById('pdpNotifyEmail')?.value.trim();
  if (!email || !email.includes('@')) { showToast('⚠️ Въведи валиден имейл'); return; }
  // Save to localStorage
  const key = 'mc_bis_' + pdpProductId;
  localStorage.setItem(key, email);
  document.getElementById('pdpNotifyForm').style.display = 'none';
  document.getElementById('pdpNotifySuccess').style.display = 'block';
  showToast('📬 Ще те уведомим при наличност!');
}

// ===== STICKY ADD-TO-CART =====
(function() {
  function initStickyBar() {
    const backdrop = document.getElementById('pdpBackdrop');
    if (!backdrop) return;
    let ticking = false;
    let _barWasVisible = false;
    backdrop.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const bar = document.getElementById('pdpStickyBar');
          const addBtn = document.getElementById('pdpAddBtn');
          if (!bar || !addBtn) { ticking = false; return; }
          const rect = addBtn.getBoundingClientRect();
          const tabsEl = document.getElementById('pdpTabs');
          const tabsTop = tabsEl ? tabsEl.getBoundingClientRect().top : 0;
          const barH = bar.offsetHeight || 65;
          const show = rect.bottom < 0 && tabsTop < (window.innerHeight - barH - 10);
          if (show !== _barWasVisible) {
            bar.classList.toggle('visible', show);
            _barWasVisible = show;
          }
          // Sync qty
          const qtyMain = document.getElementById('pdpQty');
          const qtySticky = document.getElementById('pdpStickyQty');
          if (qtyMain && qtySticky) qtySticky.textContent = qtyMain.textContent;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  document.addEventListener('DOMContentLoaded', initStickyBar);
})();

function pdpUpdateStickyBar(p) {
  const nameEl = document.getElementById('pdpStickyName');
  const priceEl = document.getElementById('pdpStickyPrice');
  if (nameEl) nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = fmtEur(p.price) + ' / ' + fmtBgn(p.price);
}

// QW-02: Viewers counter — seeded by product id for consistency per session
function pdpShowViewers(p) {
  let el = document.getElementById('pdpViewers');
  if (!el) return;
  const n = 3 + ((p.id * 7 + Math.floor(Date.now() / 600000)) % 10);
  el.textContent = `👀 ${n} човека разглеждат в момента`;
  el.style.display = '';
}

// QW-05: Share product
function pdpShare(p) {
  const url = location.origin + location.pathname + '?product=' + p.id;
  if (navigator.share) {
    navigator.share({ title: p.name, text: p.brand + ' ' + p.name + ' — ' + fmtEur(p.price), url }).catch(() => {});
  } else {
    try { navigator.clipboard.writeText(url); showToast('🔗 Линкът е копиран!'); } catch(e) { showToast('🔗 ' + url); }
  }
}

// M-08: Price history sparkline
function pdpRenderSparkline(p) {
  const canvas = document.getElementById('pdpSparkline');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 120, H = canvas.height = 36;
  // Generate 6-month fake history seeded by product id
  const points = [];
  let cur = p.price;
  for (let i = 5; i >= 0; i--) {
    const seed = (p.id * 31 + i * 17) % 100;
    const delta = (seed - 50) / 50 * 0.08; // ±8%
    points.push(Math.round(cur * (1 + delta)));
  }
  points.push(p.price);
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * W);
  const ys = points.map(v => H - 4 - ((v - min) / range) * (H - 8));
  ctx.clearRect(0, 0, W, H);
  ctx.beginPath();
  ctx.moveTo(xs[0], ys[0]);
  for (let i = 1; i < xs.length; i++) ctx.lineTo(xs[i], ys[i]);
  ctx.strokeStyle = p.price <= points[0] ? '#16a34a' : '#bd1105';
  ctx.lineWidth = 1.8;
  ctx.stroke();
  // Current price dot
  ctx.beginPath();
  ctx.arc(xs[xs.length-1], ys[ys.length-1], 3, 0, Math.PI*2);
  ctx.fillStyle = p.price <= points[0] ? '#16a34a' : '#bd1105';
  ctx.fill();
  const sparkWrap = document.getElementById('pdpSparkWrap');
  if (sparkWrap) sparkWrap.style.display = '';
}

// ===== RECENTLY DISCOUNTED =====
function renderRecentlyDiscounted() {
  const el = document.getElementById('recentlyDiscountedGrid');
  if (!el) return;
  const discounted = products
    .filter(p => p.stock !== false && p.old && p.old > p.price)
    .sort((a,b) => ((b.old-b.price)/b.old) - ((a.old-a.price)/a.old))
    .slice(0, 5);
  if (!discounted.length) { el.closest('.section-wrap')?.remove(); return; }
  el.innerHTML = discounted.map(p => makeCard(p)).join('');
  updateWishlistUI();
}


// ===== REVIEW FORM =====
let rfStarVal = 0;

function rfSetStar(n) {
  rfStarVal = n;
  const labels = ['Ужасно', 'Лошо', 'Средно', 'Добро', 'Отлично'];
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = labels[n - 1] || '';
  document.querySelectorAll('.rf-star').forEach(s => {
    s.style.color = parseInt(s.dataset.v) <= n ? '#fbbf24' : '';
  });
}

function submitPdpReview() {
  const name = document.getElementById('rfName')?.value.trim();
  const text = document.getElementById('rfText')?.value.trim();
  if (!name) { showToast('⚠️ Въведи твоето име'); return; }
  if (!rfStarVal) { showToast('⚠️ Избери рейтинг'); return; }
  if (!text || text.length < 10) { showToast('⚠️ Ревюто трябва да е поне 10 символа'); return; }

  const review = {
    name,
    stars: rfStarVal,
    text,
    date: new Date().toLocaleDateString('bg-BG'),
    pending: true,
    productId: pdpProductId,
  };

  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (!saved[pdpProductId]) saved[pdpProductId] = [];
    saved[pdpProductId].unshift(review);
    localStorage.setItem('mc_reviews', JSON.stringify(saved));
  } catch(e) {}

  // Reset form
  document.getElementById('rfName').value = '';
  document.getElementById('rfText').value = '';
  rfStarVal = 0;
  document.querySelectorAll('.rf-star').forEach(s => s.style.color = '');
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = 'Избери рейтинг';

  showToast('✅ Ревюто е изпратено и ще бъде публикувано след преглед!');
}


// ===== PDP subheader search =====
let _pdpSrchIdx = -1;
let _pdpSrchResults = [];
let _pdpSrchTimer = null;

function pdpSearchLive(q) {
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = q ? '' : 'none';
  clearTimeout(_pdpSrchTimer);
  if (!q.trim()) { pdpSearchDropClose(); return; }
  _pdpSrchTimer = setTimeout(() => _pdpSrchRender(q.trim()), 220);
}

function _pdpSrchRender(q) {
  const drop = document.getElementById('pdpSearchDrop');
  if (!drop) return;

  _pdpSrchResults = typeof searchProducts === 'function'
    ? searchProducts(q, '').slice(0, 7)
    : [];
  _pdpSrchIdx = -1;

  if (!_pdpSrchResults.length) {
    drop.innerHTML = `<div class="pdp-drop-empty">Няма намерени продукти за <strong>${escHtml(q)}</strong></div>`;
    drop.style.display = '';
    return;
  }

  drop.innerHTML = _pdpSrchResults.map((p, i) => {
    const price = typeof formatPrice === 'function' ? formatPrice(p.price) : p.price + ' лв.';
    const img = p.img
      ? `<img src="${escHtml(p.img)}" alt="" class="pdp-drop-img" loading="lazy">`
      : `<span class="pdp-drop-emoji">${escHtml(p.emoji || '📦')}</span>`;
    return `<div class="pdp-drop-item" role="option" data-idx="${i}" onmousedown="pdpSearchPick(${i})">
      <div class="pdp-drop-thumb">${img}</div>
      <div class="pdp-drop-info">
        <div class="pdp-drop-name">${escHtml(p.name)}</div>
        <div class="pdp-drop-price">${price}</div>
      </div>
    </div>`;
  }).join('') +
  `<div class="pdp-drop-all" onmousedown="pdpSearchGo(document.getElementById('pdpSearchInput').value)">
    Виж всички резултати за „${escHtml(q)}" →
  </div>`;

  drop.style.display = '';
}

function pdpSearchPick(idx) {
  const p = _pdpSrchResults[idx];
  if (!p) return;
  pdpSearchDropClose();
  const inp = document.getElementById('pdpSearchInput');
  if (inp) inp.value = '';
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = 'none';
  openProductPage(p.id);
}

function pdpSearchGo(q) {
  q = (q || '').trim();
  if (!q) return;
  pdpSearchDropClose();
  closeProductPage();
  const inp = document.getElementById('searchInput');
  if (inp) { inp.value = q; }
  if (typeof showSearchResultsPage === 'function') showSearchResultsPage(q);
}

function pdpSearchClear() {
  const inp = document.getElementById('pdpSearchInput');
  if (inp) { inp.value = ''; inp.focus(); }
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = 'none';
  pdpSearchDropClose();
}

function pdpSearchDropClose() {
  const drop = document.getElementById('pdpSearchDrop');
  if (drop) drop.style.display = 'none';
  _pdpSrchIdx = -1;
}

function pdpSearchKey(e) {
  const drop = document.getElementById('pdpSearchDrop');
  const items = drop ? drop.querySelectorAll('.pdp-drop-item') : [];
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _pdpSrchIdx = Math.min(_pdpSrchIdx + 1, items.length - 1);
    _pdpSrchHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _pdpSrchIdx = Math.max(_pdpSrchIdx - 1, -1);
    _pdpSrchHighlight(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (_pdpSrchIdx >= 0 && items[_pdpSrchIdx]) {
      pdpSearchPick(Number(items[_pdpSrchIdx].dataset.idx));
    } else {
      pdpSearchGo(e.target.value);
    }
  } else if (e.key === 'Escape') {
    pdpSearchClear();
  }
}

function _pdpSrchHighlight(items) {
  items.forEach((el, i) => el.classList.toggle('active', i === _pdpSrchIdx));
}

// Close PDP search dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('#pdpShSearch') && !e.target.closest('#pdpSearchDrop')) {
    pdpSearchDropClose();
  }
});

// ===== BUNDLE OFFER =====
function pdpRenderBundle(p) {
  const wrap = document.getElementById('pdpBundle');
  if (!wrap) return;
  if (!p.bundle || !p.bundle.length) { wrap.style.display = 'none'; return; }

  const bundleProds = p.bundle.map(id => products.find(x => x.id === id)).filter(Boolean);
  if (!bundleProds.length) { wrap.style.display = 'none'; return; }

  const disc = p.bundleDiscount || 10;
  const allProds = [p, ...bundleProds];
  const totalFull = allProds.reduce((s, x) => s + x.price, 0);
  const totalDisc = Math.round(totalFull * (1 - disc / 100));
  const saving = totalFull - totalDisc;

  const _esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const itemsHtml = allProds.map((x, i) => `
    <div class="bundle-item" onclick="openProductPage(${x.id})">
      <div class="bundle-emoji">${x.emoji}</div>
      <div class="bundle-info">
        <div class="bundle-item-name">${_esc(x.name.length > 40 ? x.name.slice(0,40)+'…' : x.name)}</div>
        <div class="bundle-item-price">${fmtEur(x.price)}</div>
      </div>
    </div>
    ${i < allProds.length - 1 ? '<div class="bundle-plus">+</div>' : ''}
  `).join('');

  wrap.innerHTML = `
    <div class="bundle-section">
      <div class="bundle-header">
        <span class="bundle-tag">🎁 Купи заедно</span>
        <span class="bundle-save-badge">Спести ${fmtEur(saving)}</span>
      </div>
      <div class="bundle-items">${itemsHtml}</div>
      <div class="bundle-footer">
        <div class="bundle-totals">
          <span class="bundle-old-total">${fmtEur(totalFull)}</span>
          <span class="bundle-new-total">${fmtEur(totalDisc)}</span>
          <span class="bundle-disc-label">-${disc}% при комплект</span>
        </div>
        <button type="button" class="bundle-add-btn" onclick="pdpAddBundle(${JSON.stringify(allProds.map(x=>x.id))})">
          🛒 Добави всички в кошницата
        </button>
      </div>
    </div>`;
  wrap.style.display = '';
}

function pdpAddBundle(ids) {
  ids.forEach(id => { if (typeof addToCart === 'function') addToCart(id); });
  showToast('✅ Комплектът е добавен в кошницата!');
}

// ===== PRODUCT Q&A =====
let _pdpQaProductId = null;

function pdpLoadQA(productId) {
  _pdpQaProductId = productId;
  const list = document.getElementById('pdpQaList');
  if (!list) return;
  list.innerHTML = '';
  if (typeof window.loadProductQuestions !== 'function') return;
  window.loadProductQuestions(productId).then(items => {
    if (!items || items.length === 0) {
      list.innerHTML = '<p class="pdp-qa-empty">Все още няма публични въпроси за този продукт. Бъди първият!</p>';
      return;
    }
    list.innerHTML = items.map(q => `
      <div class="pdp-qa-item">
        <div class="pdp-qa-q"><span class="pdp-qa-q-icon">❓</span><span>${escHtml(q.question)}</span></div>
        <div class="pdp-qa-a"><span class="pdp-qa-a-icon">💬</span><span>${escHtml(q.answer)}</span></div>
        <div class="pdp-qa-meta">${escHtml(q.asker_name || 'Анонимен')} · ${new Date(q.created_at).toLocaleDateString('bg-BG')}</div>
      </div>`).join('');
  });
}

async function pdpSubmitQuestion() {
  const text  = (document.getElementById('pdpQaText')?.value  || '').trim();
  const name  = (document.getElementById('pdpQaName')?.value  || '').trim();
  const email = (document.getElementById('pdpQaEmail')?.value || '').trim();
  if (!text) { showToast('⚠️ Моля въведи въпроса си.'); return; }
  if (text.length < 10) { showToast('⚠️ Въпросът е твърде кратък.'); return; }
  const btn = document.querySelector('.pdp-qa-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Изпращане...'; }
  if (typeof window.saveProductQuestion === 'function') {
    const ok = await window.saveProductQuestion(_pdpQaProductId, text, name, email);
    if (ok) {
      showToast('✅ Въпросът е изпратен! Ще отговорим скоро.');
      if (document.getElementById('pdpQaText'))  document.getElementById('pdpQaText').value  = '';
      if (document.getElementById('pdpQaName'))  document.getElementById('pdpQaName').value  = '';
      if (document.getElementById('pdpQaEmail')) document.getElementById('pdpQaEmail').value = '';
    } else {
      showToast('❌ Грешка при изпращане. Опитай отново.');
    }
  } else {
    showToast('✅ Въпросът е записан!');
  }
  if (btn) { btn.disabled = false; btn.textContent = 'Изпрати въпроса →'; }
}

// ===== PDP UX ENHANCEMENTS =====

// ── LIGHTBOX ──
function pdpLbOpen() {
  var img = document.getElementById('pdpMainImg');
  if (!img || !img.src || img.style.display === 'none') return;
  var lb = document.getElementById('pdpLightbox');
  var lbImg = document.getElementById('pdpLbImg');
  if (!lb || !lbImg) return;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbImg.style.setProperty('--lb-scale', '1');
  lb.style.display = 'flex';
  document.addEventListener('keydown', _pdpLbKey);
}
function pdpLbClose() {
  var lb = document.getElementById('pdpLightbox');
  if (lb) lb.style.display = 'none';
  document.removeEventListener('keydown', _pdpLbKey);
}
function pdpLbNav(dir) {
  pdpGalleryNav(dir);
  var img = document.getElementById('pdpMainImg');
  var lbImg = document.getElementById('pdpLbImg');
  if (img && lbImg) lbImg.src = img.src;
}
function _pdpLbKey(e) {
  if (e.key === 'Escape') pdpLbClose();
  if (e.key === 'ArrowLeft') pdpLbNav(-1);
  if (e.key === 'ArrowRight') pdpLbNav(1);
}
// Wheel zoom
(function() {
  document.addEventListener('wheel', function(e) {
    var lb = document.getElementById('pdpLightbox');
    if (!lb || lb.style.display === 'none') return;
    e.preventDefault();
    var lbImg = document.getElementById('pdpLbImg');
    var cur = parseFloat(lbImg.style.getPropertyValue('--lb-scale') || '1');
    var next = Math.min(4, Math.max(1, cur - e.deltaY * 0.003));
    lbImg.style.setProperty('--lb-scale', next);
  }, { passive: false });
})();

// Scroll-to-top button visibility + action
function pdpGoToTop() {
  var b = document.getElementById('pdpBackdrop');
  if (!b) return;
  b.scrollTop = 0;
}
(function() {
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop) return;
  backdrop.addEventListener('scroll', function() {
    var btn = document.getElementById('pdpScrollTop');
    if (!btn) return;
    var show = backdrop.scrollTop > 400;
    btn.style.display = show ? '' : 'none';
  }, { passive: true });
  // wire button via JS (works on both click and touch)
  var _wireBtn = function() {
    var btn = document.getElementById('pdpScrollTop');
    if (!btn) return;
    btn.addEventListener('click', pdpGoToTop);
    btn.addEventListener('touchstart', function(e) { e.preventDefault(); pdpGoToTop(); }, { passive: false });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _wireBtn);
  } else {
    _wireBtn();
  }
})();

// 1. DELIVERY TIMER
function pdpInitDeliveryTimer() {
  const el = document.getElementById('pdpDeliveryMsg');
  const cd = document.getElementById('pdpDeliveryCd');
  if (!el) return;
  clearInterval(pdpInitDeliveryTimer._iv);

  function update() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;
    if (isWeekend) {
      el.innerHTML = 'Поръчай сега и получи в <strong>понеделник</strong>';
      if (cd) cd.textContent = '';
      return;
    }
    // Cutoff: 16:30 = 16h 30m
    const cutoffSec = 16 * 3600 + 30 * 60;
    const nowSec = h * 3600 + m * 60 + now.getSeconds();
    if (nowSec < cutoffSec) {
      const secLeft = cutoffSec - nowSec;
      const hh = Math.floor(secLeft / 3600);
      const mm = String(Math.floor((secLeft % 3600) / 60)).padStart(2, '0');
      const ss = String(secLeft % 60).padStart(2, '0');
      el.innerHTML = 'Поръчай до <strong>16:30 ч.</strong> и получи <strong>утре</strong>';
      if (cd) cd.textContent = '(остават ' + hh + ':' + mm + ':' + ss + ')';
    } else {
      el.innerHTML = 'Поръчай сега — изпращаме <strong>утре</strong>';
      if (cd) cd.textContent = '';
    }
  }
  update();
  pdpInitDeliveryTimer._iv = setInterval(update, 1000);
}

// 2. RATING BREAKDOWN
function pdpRenderRatingBreakdown(revs) {
  const wrap = document.getElementById('pdpRvBreakdown');
  if (!wrap) return;
  if (!revs || !revs.length) { wrap.style.display = 'none'; return; }
  const counts = [0, 0, 0, 0, 0];
  revs.forEach(function(r) {
    const i = Math.min(4, Math.max(0, Math.round(r.stars) - 1));
    counts[i]++;
  });
  const avg = (revs.reduce(function(s, r) { return s + r.stars; }, 0) / revs.length).toFixed(1);
  const total = revs.length;
  var barsHtml = '';
  [5,4,3,2,1].forEach(function(s) {
    var c = counts[s-1];
    var pct = total ? Math.round(c / total * 100) : 0;
    barsHtml += '<div class="pdp-rvb-row">' +
      '<span class="pdp-rvb-lbl">' + s + ' ★</span>' +
      '<div class="pdp-rvb-bar"><div class="pdp-rvb-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="pdp-rvb-num">' + c + '</span>' +
      '</div>';
  });
  wrap.innerHTML = '<div class="pdp-rvb">' +
    '<div class="pdp-rvb-avg">' +
      '<div class="pdp-rvb-big">' + avg + '</div>' +
      '<div class="pdp-rvb-stars">' + starsHTML(parseFloat(avg)) + '</div>' +
      '<div class="pdp-rvb-count">' + total + ' ревют' + (total === 1 ? 'о' : 'а') + '</div>' +
    '</div>' +
    '<div class="pdp-rvb-bars">' + barsHtml + '</div>' +
  '</div>';
  wrap.style.display = '';
}

// 3. IMAGE ZOOM
function pdpInitZoom() {
  const wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap) return;
  // Remove previous listeners via flag
  if (wrap._zoomInited) {
    wrap.removeEventListener('mousemove', wrap._zoomMove);
    wrap.removeEventListener('mouseleave', wrap._zoomLeave);
  }
  wrap._zoomMove = function(e) {
    const img = document.getElementById('pdpMainImg');
    if (!img || img.style.display === 'none') return;
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    img.style.transformOrigin = x + '% ' + y + '%';
    img.style.transform = 'scale(2.2)';
    wrap.style.cursor = 'zoom-in';
  };
  wrap._zoomLeave = function() {
    const img = document.getElementById('pdpMainImg');
    if (!img) return;
    img.style.transform = '';
    img.style.transformOrigin = 'center center';
  };
  wrap.addEventListener('mousemove', wrap._zoomMove);
  wrap.addEventListener('mouseleave', wrap._zoomLeave);
  wrap._zoomInited = true;
}

// 4. MOBILE SWIPE
function pdpInitSwipe() {
  const wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap || wrap._swipeInited) return;
  var sx = 0;
  wrap.addEventListener('touchstart', function(e) {
    sx = e.touches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) {
      pdpGalleryNav(dx < 0 ? 1 : -1);
      wrap.classList.remove('swipe-bounce');
      // Double rAF restarts the animation without a forced synchronous reflow
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          wrap.classList.add('swipe-bounce');
          setTimeout(function(){ wrap.classList.remove('swipe-bounce'); }, 320);
        });
      });
    }
  }, { passive: true });
  wrap._swipeInited = true;
}

// 5. TABS SCROLL SYNC
var _pdpTabsObs = null;
function pdpInitTabsScroll() {
  if (_pdpTabsObs) { _pdpTabsObs.disconnect(); _pdpTabsObs = null; }
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop || !('IntersectionObserver' in window)) return;
  var tabs = ['specs','desc','video','reviews','vendor'];
  _pdpTabsObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var tab = entry.target.id.replace('pdp-tab-', '');
        document.querySelectorAll('.pdp-tab').forEach(function(t) {
          var act = t.getAttribute('data-action') || '';
          t.classList.toggle('active', act.indexOf("'" + tab + "'") !== -1);
        });
      }
    });
  }, { root: backdrop, rootMargin: '-10% 0px -75% 0px', threshold: 0 });
  tabs.forEach(function(t) {
    var el = document.getElementById('pdp-tab-' + t);
    if (el) _pdpTabsObs.observe(el);
  });
}

// 6. SPECS SEARCH/FILTER
function pdpFilterSpecs(q) {
  var rows = document.querySelectorAll('#pdpSpecsTbody tr');
  var ql = q.toLowerCase().trim();
  rows.forEach(function(row) {
    row.style.display = (!ql || row.textContent.toLowerCase().indexOf(ql) !== -1) ? '' : 'none';
  });
  var noRes = document.getElementById('pdpSpecsNoResult');
  var visible = Array.from(rows).some(function(r) { return r.style.display !== 'none'; });
  if (noRes) noRes.style.display = (ql && !visible) ? '' : 'none';
}

// 7. RELATED PRODUCTS CAROUSEL
function pdpRenderRelated(p) {
  var section = document.getElementById('pdpRelated');
  var scroll  = document.getElementById('pdpRelatedScroll');
  var title   = document.getElementById('pdpRelatedTitle');
  if (!section || !scroll) return;
  var all = (typeof products !== 'undefined') ? products : [];
  // A: prefer same subcat first, fallback to same cat
  var related = p.subcat
    ? all.filter(function(x) { return x.id !== p.id && x.subcat === p.subcat; })
    : [];
  if (related.length < 4)
    related = all.filter(function(x) { return x.id !== p.id && x.cat === p.cat; });
  related = related.sort(function() { return Math.random() - 0.5; }).slice(0, 14);
  if (related.length < 2) { section.style.display = 'none'; return; }
  if (title) {
    var catLabel = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[p.cat]) ? CAT_LABELS[p.cat] : '';
    title.textContent = catLabel ? ('Подобни — ' + catLabel) : 'Подобни продукти';
  }
  scroll.innerHTML = related.map(_pdpCarCard).join('');
  section.style.display = '';
}

// 8. CROSS-SELL WIDGET (right column, below CTA)
var _CROSS_SELL = {
  // Лаптопи → мишки, клавиатури, слушалки
  laptops:     ['mouse','keyboard','headphones','accessories'],
  gaming_l:    ['mouse','keyboard','headphones','accessories'],
  convertible: ['mouse','keyboard','accessories'],

  // Настолни компютри → монитори, клавиатури, мишки
  desktops:    ['monitor','monitors','keyboard','mouse'],
  office_pc:   ['monitor','monitors','keyboard','mouse'],
  aio:         ['keyboard','mouse','accessories'],

  // Монитори → кабели/аксесоари, клавиатури, мишки
  monitor:     ['keyboard','mouse','accessories'],
  monitors:    ['keyboard','mouse','accessories'],

  // Телефони / смартфони → аксесоари, памет, слушалки
  phones:      ['accessories','microsd','headphones'],
  smartphone:  ['accessories','microsd','headphones'],

  // Принтери → консумативи, хартия
  printers:    ['consumables','photo_paper','accessories'],
  inkjet:      ['consumables','photo_paper'],
  inkjet_aio:  ['consumables','photo_paper'],
  laser:       ['consumables','accessories'],
  megatank:    ['consumables','photo_paper'],

  // PC компоненти → кутии, захранвания
  components:  ['case','psu','accessories'],
  gpu:         ['psu','case','accessories'],
  cpu:         ['case','psu','accessories'],
  motherboard: ['ram','psu','case'],
  ram:         ['ssd','accessories'],
  ssd:         ['accessories','case'],
  hdd:         ['case','accessories'],
  storage:     ['accessories'],
  ext_drive:   ['usb_flash','accessories'],
  psu:         ['case','accessories'],
  case:        ['psu','accessories'],

  // Периферия
  keyboard:    ['mouse','headphones','accessories'],
  mouse:       ['keyboard','accessories'],
  headphones:  ['microsd','accessories'],
  audio:       ['accessories'],
  webcam:      ['headphones','accessories'],

  // UPS системи → батерии/аксесоари
  ups:         ['ups_battery','accessories'],
  ups_home:    ['ups_battery','accessories'],
  ups_office:  ['ups_battery','accessories'],
  ups_server:  ['ups_battery'],
  ups_battery: [],

  // Проектори → аксесоари, носители
  projector:   ['accessories'],

  // Камери и видеонаблюдение → памет, аксесоари
  cameras:     ['microsd','sd_card','accessories'],
  cam_indoor:  ['microsd','accessories'],
  cam_outdoor: ['microsd','accessories'],
  cam_poe:     ['accessories'],

  // Флаш и карти памет
  usb_flash:   ['ext_drive','accessories'],
  microsd:     ['card_reader','accessories'],
  sd_card:     ['card_reader','accessories'],
  card_reader: ['microsd','sd_card'],
  cf_card:     ['card_reader'],

  // Консумативи → принтери (обратна посока)
  consumables: ['printers','inkjet','laser'],
  photo_paper: ['inkjet','inkjet_aio','megatank'],

  // Офис / работно място
  chair:       ['monitor','monitors','accessories'],

  // Широка периферия / аксесоари — без cross-sell
  accessories: [],
  peripherals: [],
  multimedia:  [],
  controller:  [],
  portable:    ['accessories']
};

function pdpRenderRecsWidget(p) {
  var widget = document.getElementById('pdpRecsWidget');
  if (!widget) return;
  var all = (typeof products !== 'undefined') ? products : [];
  var inCart = new Set((typeof cart !== 'undefined' ? cart : []).map(function(x) { return x.id; }));
  var cats = _CROSS_SELL[p.subcat] || _CROSS_SELL[p.cat] || [];
  var recs = [];

  // 1. Same category, different subcat (accessories for this type)
  if (p.subcat) {
    recs = all.filter(function(x) {
      return x.id !== p.id && !inCart.has(x.id) && x.cat === p.cat && x.subcat !== p.subcat;
    });
  }

  // 2. Related accessory categories
  if (recs.length < 3 && cats.length) {
    var extra = all.filter(function(x) {
      return x.id !== p.id && !inCart.has(x.id) && cats.indexOf(x.cat) !== -1;
    }).sort(function(a,b) { return (b.rv||0) - (a.rv||0); });
    recs = recs.concat(extra);
  }

  // 3. Fallback: bestsellers from same category
  if (recs.length < 3) {
    var fb = all.filter(function(x) {
      return x.id !== p.id && !inCart.has(x.id) && x.cat === p.cat;
    }).sort(function(a,b) { return (b.rv||0) - (a.rv||0); });
    recs = recs.concat(fb);
  }

  // Deduplicate + take 3
  var seen = new Set();
  recs = recs.filter(function(x) { if (seen.has(x.id)) return false; seen.add(x.id); return true; }).slice(0, 3);

  if (!recs.length) { widget.style.display = 'none'; return; }

  var _e = function(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var _thumb = function(r) {
    if (r.img) return '<img src="' + _e(r.img) + '" alt="" width="40" height="40" style="width:40px;height:40px;object-fit:contain;border-radius:6px;" loading="lazy" onerror="this.style.display=\'none\'">';
    return '<span style="font-size:22px;line-height:1;">' + _e(r.emoji||'') + '</span>';
  };

  widget.innerHTML =
    '<div class="pdp-rw-hdr"><span class="pdp-rw-flash">⚡</span>Може да те заинтересува</div>' +
    recs.map(function(r) {
      return '<div class="pdp-rw-row" onclick="openProductPage(' + r.id + ')" tabindex="0" role="button" aria-label="' + _e(r.name) + '">' +
        '<div class="pdp-rw-thumb">' + _thumb(r) + '</div>' +
        '<div class="pdp-rw-info">' +
          '<div class="pdp-rw-name">' + _e(r.name.length > 42 ? r.name.substring(0,42)+'…' : r.name) + '</div>' +
          '<div class="pdp-rw-price">' + (typeof fmtEur === 'function' ? fmtEur(r.price) : r.price + ' €') + '</div>' +
        '</div>' +
        '<button type="button" class="pdp-rw-add" onclick="event.stopPropagation();addToCart(' + r.id + ');this.textContent=\'✓\';this.classList.add(\'added\');setTimeout(function(){this.textContent=\'+\';this.classList.remove(\'added\');}.bind(this),1400);" aria-label="Добави ' + _e(r.name) + ' в кошница">+</button>' +
      '</div>';
    }).join('') +
    '<div class="pdp-rw-foot">Клиентите купуват заедно с този продукт</div>';

  widget.style.display = '';
}

// 9. RECENTLY VIEWED CAROUSEL IN PDP
function pdpRenderRvCarousel() {
  var section = document.getElementById('pdpRvSection');
  var scroll  = document.getElementById('pdpRvCarousel');
  if (!section || !scroll) return;
  var rv = [];
  try { rv = JSON.parse(localStorage.getItem('mc_rv') || '[]'); } catch(e) {}
  var all = (typeof products !== 'undefined') ? products : [];
  var items = rv.map(function(id) { return all.find(function(p) { return p.id === id; }); })
    .filter(Boolean).slice(0, 14);
  if (items.length < 2) { section.style.display = 'none'; return; }
  scroll.innerHTML = items.map(_pdpCarCard).join('');
  section.style.display = '';
}

// Shared carousel card renderer
function _pdpCarCard(p) {
  var _e = typeof _esc === 'function' ? _esc : escHtml;
  var price = (typeof fmtEur === 'function') ? fmtEur(p.price) : (p.price + ' лв.');
  var thumb = p.img
    ? '<img class="pdp-car-img" src="' + _e(p.img) + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
    : '';
  var emoji = '<span class="pdp-car-emoji"' + (p.img ? ' style="display:none"' : '') + '>' + (p.emoji || '📦') + '</span>';
  var stars = p.rating ? '<div class="pdp-car-stars">' + starsHTML(p.rating) + '</div>' : '';
  var badge = p.badge === 'sale' ? '<span class="pdp-car-badge">Промо</span>'
    : p.badge === 'new' ? '<span class="pdp-car-badge pdp-car-badge-new">Ново</span>' : '';
  return '<div class="pdp-car-card" onclick="openProductPage(' + p.id + ')">' +
    '<div class="pdp-car-thumb">' + badge + thumb + emoji + '</div>' +
    '<div class="pdp-car-info">' +
      '<div class="pdp-car-name">' + (typeof _esc === 'function' ? _esc(p.name) : escHtml(p.name)) + '</div>' +
      stars +
      '<div class="pdp-car-price">' + price + '</div>' +
    '</div>' +
  '</div>';
}

// Carousel scroll helper
function pdpCarScroll(id, dir) {
  var el = document.getElementById(id);
  if (el) el.scrollBy({ left: dir * 230, behavior: 'smooth' });
}

// ===== 9. STICKY SPECS SIDEBAR =====
function pdpRenderSpecsSidebar(p) {
  var sb = document.getElementById('pdpSpecsSidebar');
  if (!sb) return;
  var specs = p.specs || {};
  var keys = Object.keys(specs).slice(0, 10);
  if (!keys.length) { sb.style.display = 'none'; return; }
  var rows = keys.map(function(k) {
    var _e = typeof _esc === 'function' ? _esc : escHtml;
    return '<tr><td class="pdp-sb-key">' + _e(k) + '</td><td class="pdp-sb-val">' + _e(specs[k]) + '</td></tr>';
  }).join('');
  sb.innerHTML =
    '<div class="pdp-sb-title">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' +
      ' Основни характеристики' +
    '</div>' +
    '<table class="pdp-sb-table"><tbody>' + rows + '</tbody></table>' +
    '<button type="button" class="pdp-sb-more" onclick="pdpSwitchTab(\'specs\');document.getElementById(\'pdp-tab-specs\').scrollIntoView({behavior:\'smooth\'})">Виж всички →</button>';
  sb.style.display = '';
}

// ===== 10. COPY SPECS =====
function pdpCopySpecs() {
  var p = (typeof products !== 'undefined') ? products.find(function(x) { return x.id === pdpProductId; }) : null;
  if (!p) return;
  var specs = p.specs || {};
  var text = p.name + '\n\n' + Object.keys(specs).map(function(k) { return k + ': ' + specs[k]; }).join('\n');
  var btn = document.getElementById('pdpCopyBtn');
  if (!navigator.clipboard) { showToast && showToast('⚠️ Клипборд недостъпен'); return; }
  navigator.clipboard.writeText(text).then(function() {
    if (btn) { btn.textContent = '✓ Копирано'; btn.classList.add('pdp-copy-done'); }
    if (typeof showToast === 'function') showToast('✓ Характеристиките са копирани!');
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Копирай'; btn.classList.remove('pdp-copy-done'); }
    }, 2000);
  }).catch(function() { if (typeof showToast === 'function') showToast('⚠️ Грешка при копиране'); });
}

// ===== 11. PRINT / PDF =====
function pdpPrintSpecs() {
  var p = (typeof products !== 'undefined') ? products.find(function(x) { return x.id === pdpProductId; }) : null;
  if (!p) return;
  var specs = p.specs || {};
  var _ep = function(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var rows = Object.keys(specs).map(function(k) {
    return '<tr><td style="padding:7px 12px;font-weight:600;color:#444;width:38%;border-bottom:1px solid #eee;">' + _ep(k) +
           '</td><td style="padding:7px 12px;border-bottom:1px solid #eee;">' + _ep(specs[k]) + '</td></tr>';
  }).join('');
  var win = window.open('', '_blank', 'width=800,height=700');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(
    '<!DOCTYPE html><html><head><title>' + _ep(p.name) + ' — Характеристики</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a;}h1{font-size:20px;margin-bottom:4px;}' +
    '.sub{color:#888;font-size:13px;margin-bottom:24px;}table{width:100%;border-collapse:collapse;}' +
    'tr:nth-child(even){background:#f9f9f9;}' +
    '@media print{button{display:none!important;}}' +
    '</style></head><body>' +
    '<h1>' + _ep(p.name) + '</h1>' +
    '<div class="sub">' + _ep(p.brand || '') + (p.sku ? ' · SKU: ' + _ep(p.sku) : '') + '</div>' +
    '<table><tbody>' + rows + '</tbody></table>' +
    '<br><button onclick="window.print()" style="padding:10px 22px;background:#bd1105;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🖨 Принтирай</button>' +
    '</body></html>'
  );
  win.document.close();
}

// ===== 11. COMPARE BUTTON IN PDP =====
function pdpToggleCompare() {
  var btn = document.getElementById('pdpCompareBtn');
  if (!pdpProductId || typeof toggleCompare !== 'function') return;
  var isActive = btn && btn.classList.contains('active');
  toggleCompare(pdpProductId, !isActive);
  if (btn) {
    if (!isActive) {
      btn.innerHTML = btn.innerHTML.replace('Сравни', 'Сравнено ✓');
      btn.classList.add('active');
    } else {
      btn.innerHTML = btn.innerHTML.replace('Сравнено ✓', 'Сравни');
      btn.classList.remove('active');
    }
  }
}

// Reset compare button state when new product opens
var _pdpCompareReset = function() {
  var btn = document.getElementById('pdpCompareBtn');
  if (!btn) return;
  btn.classList.remove('active');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Сравни';
};

// ===== 12. MOBILE BOTTOM SHEET =====
var _pdpBsVisible = false;

function pdpBsOpen(p) {
  var sheet = document.getElementById('pdpBottomSheet');
  var overlay = document.getElementById('pdpBsOverlay');
  if (!sheet || !p) return;
  // Populate
  var nameEl = document.getElementById('pdpBsName');
  var priceEl = document.getElementById('pdpBsPrice');
  var thumbEl = document.getElementById('pdpBsThumb');
  if (nameEl) nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = (typeof fmtEur === 'function') ? fmtEur(p.price) : p.price + ' лв.';
  if (thumbEl) {
    var _e = typeof _esc === 'function' ? _esc : escHtml;
    thumbEl.innerHTML = p.img
      ? '<img src="' + _e(p.img) + '" style="width:44px;height:44px;object-fit:contain;border-radius:6px;">'
      : '<span style="font-size:28px;">' + (p.emoji || '📦') + '</span>';
  }
  sheet.classList.add('open');
  if (overlay) { overlay.style.display = ''; }
  _pdpBsVisible = true;
}

function pdpBsClose() {
  var sheet = document.getElementById('pdpBottomSheet');
  var overlay = document.getElementById('pdpBsOverlay');
  if (sheet) sheet.classList.remove('open');
  if (overlay) overlay.style.display = 'none';
  _pdpBsVisible = false;
}

// Show bottom sheet when add button scrolls out of view (mobile only)
(function() {
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop) return;
  var _pdpScrollTicking = false;
  backdrop.addEventListener('scroll', function() {
    if (window.innerWidth > 768) return;
    if (_pdpScrollTicking) return;
    _pdpScrollTicking = true;
    requestAnimationFrame(function() {
      var addBtn = document.getElementById('pdpAddBtn');
      if (addBtn) {
        var rect = addBtn.getBoundingClientRect();
        var outOfView = rect.bottom < 0 || rect.top > window.innerHeight;
        var sheet = document.getElementById('pdpBottomSheet');
        if (sheet) {
          if (outOfView && !sheet.classList.contains('open')) {
            var p = (typeof products !== 'undefined' && pdpProductId != null)
              ? products.find(function(x) { return x.id === pdpProductId; }) : null;
            if (p) pdpBsOpen(p);
          } else if (!outOfView && sheet.classList.contains('open')) {
            pdpBsClose();
          }
        }
      }
      _pdpScrollTicking = false;
    });
  }, { passive: true });
})();

// Sync bottom sheet qty display
var _origPdpChangeQty = typeof pdpChangeQty === 'function' ? pdpChangeQty : null;

// ===== 13. PINCH-TO-ZOOM =====
function pdpInitPinch() {
  var wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap || wrap._pinchInited) return;
  var startDist = 0, curScale = 1;

  wrap.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      startDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  wrap.addEventListener('touchmove', function(e) {
    if (e.touches.length !== 2) return;
    var dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    var img = document.getElementById('pdpMainImg');
    if (!img || img.style.display === 'none') return;
    curScale = Math.min(Math.max(dist / startDist, 1), 3.5);
    img.style.transform = 'scale(' + curScale + ')';
  }, { passive: true });

  wrap.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
      // reset after short delay
      setTimeout(function() {
        var img = document.getElementById('pdpMainImg');
        if (img) { img.style.transform = ''; curScale = 1; }
      }, 300);
    }
  }, { passive: true });

  wrap._pinchInited = true;
}

// ===== PRODUCT PREVIEW BOTTOM SHEET (mobile) =====
var _ppProductId = null;

function openProdPreview(id) {
  if (window.innerWidth > 768) { openProductPage(id); return; }
  var p = typeof products !== 'undefined' ? products.find(function(x) { return x.id === id; }) : null;
  if (!p) { openProductPage(id); return; }
  _ppProductId = id;

  var imgEl = document.getElementById('ppImg');
  var brandEl = document.getElementById('ppBrand');
  var nameEl = document.getElementById('ppName');
  var ratingEl = document.getElementById('ppRating');
  var priceEl = document.getElementById('ppPrice');

  var _e = typeof _esc === 'function' ? _esc : escHtml;
  if (imgEl) imgEl.innerHTML = p.img
    ? '<img src="' + _e(p.img) + '" style="width:72px;height:72px;object-fit:contain;border-radius:10px;">'
    : '<span style="font-size:44px;">' + (p.emoji || '📦') + '</span>';
  if (brandEl) brandEl.textContent = p.brand || '';
  if (nameEl) nameEl.textContent = p.name;
  if (ratingEl) {
    var stars = Math.round(p.rating || 0);
    ratingEl.innerHTML = '★'.repeat(stars) + '☆'.repeat(5 - stars) + ' <span style="color:var(--muted);font-size:11px;">(' + (p.reviews ? p.reviews.length : p.rv || 0) + ')</span>';
  }
  if (priceEl) priceEl.innerHTML = typeof fmtEur === 'function' ? '<strong>' + fmtEur(p.price) + '</strong>' : '<strong>' + p.price + ' €</strong>';

  var addBtn = document.getElementById('ppAddBtn');
  if (addBtn) {
    addBtn.onclick = function() {
      if (typeof addToCart === 'function') addToCart(_ppProductId);
      closeProdPreview();
    };
    addBtn.textContent = p.stock === false ? '✕ Изчерпан' : '🛒 Добави в кошница';
    addBtn.disabled = p.stock === false;
  }
  var detBtn = document.getElementById('ppDetailsBtn');
  if (detBtn) detBtn.onclick = function() { closeProdPreview(); openProductPage(_ppProductId); };

  var sheet = document.getElementById('prodPreviewSheet');
  var backdrop = document.getElementById('prodPreviewBackdrop');
  if (sheet) sheet.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Swipe down to close — use named handlers so old ones are replaced on re-open
  if (sheet._swipeStart) sheet.removeEventListener('touchstart', sheet._swipeStart);
  if (sheet._swipeEnd)   sheet.removeEventListener('touchend',   sheet._swipeEnd);
  var startY = 0;
  sheet._swipeStart = function(e) { startY = e.touches[0].clientY; };
  sheet._swipeEnd   = function(e) { if (e.changedTouches[0].clientY - startY > 70) closeProdPreview(); };
  sheet.addEventListener('touchstart', sheet._swipeStart, { passive: true });
  sheet.addEventListener('touchend',   sheet._swipeEnd,   { passive: true });
}

function closeProdPreview() {
  var sheet = document.getElementById('prodPreviewSheet');
  var backdrop = document.getElementById('prodPreviewBackdrop');
  if (sheet) sheet.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== BLOG / SERVICE / DELIVERY PAGES =====
function _setPgBc(id, label, closeFnName) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<ol class="pg-bc-list" itemscope itemtype="https://schema.org/BreadcrumbList"><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/" class="pg-bc-home" onclick="${closeFnName}();return false;">Начало</a><meta itemprop="position" content="1"/></li><li class="pg-bc-sep" aria-hidden="true">›</li><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><strong class="pg-bc-current" itemprop="name">${label}</strong><meta itemprop="position" content="2"/></li></ol>`;
}
const blogPosts = [
  {
    slug: 'palit-rtx-4070-super-jetstream-oc-review',
    emoji: '🎮', cat: 'Ревю', title: 'Palit RTX 4070 Super JetStream OC — Крал на средния клас',
    date: '02 Юни 2026', dateISO: '2026-06-02', read: '6 мин', author: 'Мост Компютърс',
    summary: 'RTX 4070 Super JetStream OC от Palit е може би най-балансираната видеокарта за 2026. Тествахме я в игри, рендериране и DLSS 3.',
    metaDesc: 'Palit GeForce RTX 4070 Super JetStream OC ревю — тест при 1440p и 4K, DLSS 3, температури. Най-добрата GeForce за парите?',
    tags: ['Nvidia', 'Palit', 'GPU', 'гейминг', 'ревю'],
    brand: 'palit', rating: '9.1',
    model: 'RTX 4070 Super', modelSub: 'JetStream OC · 12 GB', brandLabel: 'PALIT · GPU',
    verdict: 'Безспорен избор за 1440p гейминг с бюджет до 1200 €. JetStream охладителят е сред най-добрите в класа, а factory OC носи реален бонус.',
    specs: {'GPU чип':'Ada Lovelace AD104','CUDA ядра':'7 168','Памет':'12 GB GDDR6X, 192-bit','Boost Clock':'2535 MHz (factory OC)','TDP':'220 W','Охладител':'JetStream 3×90 мм вентилатора'},
    body: `<h2>Паспорт на картата</h2>
<p>Palit GeForce RTX 4070 Super JetStream OC разполага с 7168 CUDA ядра (Ada Lovelace), 12 GB GDDR6X памет на 192-битова шина и factory OC от 2535 MHz boost. Трисекционният охладител с 3 вентилатора × 90 мм осигурява ниски температури и почти безшумна работа при умерено натоварване.</p>
<h2>Производителност при 1440p</h2>
<p>При <strong>1440p Ultra</strong> Palit RTX 4070 Super JetStream OC постига:</p>
<ul>
<li>Cyberpunk 2077 (RT Ultra + DLSS Quality) — 85 fps средно</li>
<li>Alan Wake 2 (Path Tracing + DLSS Quality) — 72 fps средно</li>
<li>CS2 (High) — 260 fps средно</li>
<li>Microsoft Flight Simulator 2024 (High) — 68 fps средно</li>
</ul>
<p>При 1440p без ray tracing практически всяка игра тече над 100 fps — нивото, от което играта е наистина плавна.</p>
<h2>Производителност при 4K</h2>
<p>4K не е основната целева резолюция на тази карта, но с DLSS 3 Quality (реален рендер при 1440p) резултатите изненадват: Cyberpunk 2077 — 62 fps, Alan Wake 2 — 54 fps. За 4K без DLSS Frame Generation е нужна RTX 4080 Super или по-висока карта.</p>
<h2>DLSS 3 и Frame Generation</h2>
<p>Transformer-базираният DLSS 3.7 дава визуално качество, неотличимо от native резолюция. Frame Generation удвоява fps-ите при GPU-bound сценарии без забележима латентност при Reflex + G-Sync. В Cyberpunk 2077 с всички RT ефекти и FG — 165 fps при 1440p.</p>
<h2>Температури и шум</h2>
<p>При full load GPU температурата е 68°C при стайна температура 22°C. Вентилаторите спират напълно при натоварване под 60W. При игри нивото е около 36 dBA — тихо дори в отворен корпус.</p>
<h2>Заключение</h2>
<p>Palit RTX 4070 Super JetStream OC е <strong>безспорният избор за 1440p гейминг</strong> с бюджет до 1200 €. JetStream охладителят е един от най-добрите в класа, а factory OC носи малък, но реален бонус. <strong>Оценка: 9.1 / 10</strong></p>`
  },
  {
    slug: 'amd-ryzen-9-9950x3d-review',
    emoji: '🔴', cat: 'Ревю', title: 'AMD Ryzen 9 9950X3D — Краят на компромисите',
    date: '02 Юни 2026', dateISO: '2026-06-02', read: '7 мин', author: 'Мост Компютърс',
    summary: 'AMD комбинира Zen 5 архитектурата с 3D V-Cache технологията. Резултатът е процесорът, за който геймърите мечтаеха.',
    metaDesc: 'AMD Ryzen 9 9950X3D ревю — Zen 5 + 3D V-Cache. Тест в игри, рендериране и съдържателна работа. Лидерът за 2026.',
    tags: ['AMD', 'процесори', 'гейминг', 'ревю'],
    brand: 'amd', rating: '9.5',
    model: 'Ryzen 9 9950X3D', modelSub: 'Zen 5 · 3D V-Cache · AM5', brandLabel: 'AMD · CPU',
    verdict: 'Първият процесор без компромис между гейминг и продуктивност. Скъп, но напълно оправдан за enthusiast системи.',
    specs: {'Архитектура':'Zen 5 (TSMC 4nm)','Ядра / Нишки':'16C / 32T','Boost честота':'5.7 GHz','Кеш (L3)':'128 MB 3D V-Cache + 64 MB','TDP':'170 W','Сокет':'AM5 (LGA1718)'},
    body: `<h2>Zen 5 + 3D V-Cache: мощната комбинация</h2>
<p>Ryzen 9 9950X3D носи 16 ядра / 32 нишки на Zen 5 архитектура с 5.7 GHz boost честота плюс 128 MB 3D V-Cache върху CCD-то. Общо: 192 MB кеш (L2 + L3). AMD е решила дилемата от предишните X3D модели — кешираното CCD вече не ограничава максималните честоти.</p>
<h2>Производителност в игри</h2>
<p>В гейминг тестовете 9950X3D е <strong>недостижим в момента</strong>. При 1080p (CPU-limited) резултатите са:</p>
<ul>
<li>Cyberpunk 2077 — 245 fps средно (+18% vs 9800X3D)</li>
<li>CS2 — 680 fps средно (+22% vs Intel Core Ultra 9 285K)</li>
<li>Microsoft Flight Simulator 2024 — 115 fps (+25% vs 9900X)</li>
</ul>
<p>Подобренията идват от по-бързия Zen 5 IPC и увеличения кеш — двойна полза при силно зависими от кеша игри.</p>
<h2>Производителност в съдържателни задачи</h2>
<p>За разлика от 7950X3D, 9950X3D не жертва производителност при рендериране. В Cinebench 2025 Multi-Core надминава Core Ultra 9 285K с около <strong>12%</strong>. При компилация на голям C++ проект — 9950X3D е ~8% по-бърз от Intel.</p>
<h2>Температура и охлаждане</h2>
<p>TDP е 170W. AMD препоръчва минимум 360 мм AIO охладител. При добро охлаждане температурите са около 72°C при full load — отлично за 16-ядрен процесор.</p>
<h2>Платформа AM5 и надстройка</h2>
<p>Сокет AM5 осигурява дълголетие — платките от X670E клас поддържат DDR5-6400+ и PCIe 5.0 x16. Ако вече имаш AM5 система, 9950X3D е директна надстройка без смяна на дъното.</p>
<h2>Заключение</h2>
<p>9950X3D е първият процесор, при който <em>не е нужен компромис</em> между гейминг и продуктивност. Скъп, но оправдан. <strong>Оценка: 9.5 / 10</strong></p>`
  },
  {
    slug: 'intel-core-ultra-300-arrow-lake-2026',
    emoji: '🔵', cat: 'Новини', title: 'Intel Core Ultra 300 (Arrow Lake-R) — Пресичане на пропастта',
    date: '02 Юни 2026', dateISO: '2026-06-02', read: '5 мин', author: 'Мост Компютърс',
    summary: 'Intel Arrow Lake-R донесе значителни подобрения с BIOS оптимизации. Вече ли е достоен конкурент на AMD Ryzen 9000?',
    metaDesc: 'Intel Core Ultra 300 Arrow Lake-R ревю 2026 — IPC ръст, BIOS оптимизации, AI Boost. Сравнение с AMD Ryzen 9 9900X.',
    tags: ['Intel', 'процесори', 'Arrow Lake', 'новини'],
    brand: 'intel', rating: '8.3',
    model: 'Core Ultra 9 285K', modelSub: 'Arrow Lake-R · LGA1851', brandLabel: 'INTEL · CPU',
    verdict: 'Arrow Lake-R затваря голяма част от пропастта с AMD. Добър избор за AI работни натоварвания и смесена употреба.',
    specs: {'Архитектура':'Lion Cove + Skymont E-cores','Ядра':'8P + 16E = 24 ядра','Boost честота':'5.7 GHz','Кеш (L3)':'36 MB','TDP':'125 W (253 W PL2)','Сокет':'LGA1851 (Z890)','NPU':'48 TOPS'},
    body: `<h2>Какво се промени при Arrow Lake-R?</h2>
<p>Серията Core Ultra 300 (Arrow Lake-R) е освежен вариант на Arrow Lake с нови BIOS микрокодове, оптимизации за Thread Director 2.0 и подобрени E-ядра (Skymont). Intel признава, че оригиналният Arrow Lake не постигна очакванията при гейминг — <strong>освежената версия коригира значителна част от проблемите</strong>.</p>
<h2>Core Ultra 9 285K vs предшественика</h2>
<p>При идентичен силиций, новите BIOS оптимизации носят:</p>
<ul>
<li>+11% средно в гейминг тестове при 1080p</li>
<li>+7% в Cinebench 2025 Multi-Core</li>
<li>-15W средна консумация при игри</li>
</ul>
<p>Резултатите поставят 285K по-близо до AMD Ryzen 9 9900X, но без 3D V-Cache вариантите, геймингът все още е предимство на AMD.</p>
<h2>AI Boost — Intel NPU в действие</h2>
<p>Arrow Lake-R включва NPU с <strong>48 TOPS</strong> AI производителност. Microsoft Copilot+, Adobe Firefly локално и GitHub Copilot с локален модел работят значително по-плавно. Ако AI инструментите са ключови за работата ти — Intel е по-добрата платформа в момента.</p>
<h2>Платформа LGA1851 и памет</h2>
<p>Core Ultra 300 изисква DDR5 — DDR4 вече не се поддържа. Оптималното е DDR5-6400 CL32. Intel препоръчва платки от Z890 клас за максимална производителност. PCIe 5.0 x16 за GPU и x4 за NVMe SSD са стандарт.</p>
<h2>За кого е Intel Core Ultra 300?</h2>
<p>Ако работиш интензивно с AI инструменти, нуждаеш се от Thunderbolt 5, или вече имаш LGA1851 платка — Core Ultra 300 е логичният избор. За чист гейминг AMD все още държи короната. За смесена употреба двете платформи са практически равни.</p>
<h2>Заключение</h2>
<p>Intel се върна в играта с Arrow Lake-R. Не е перфектен, но е значително подобрен. Очакваме Panther Lake (края на 2026) да затвори окончателно пропастта с AMD. <strong>Оценка: 8.3 / 10</strong></p>`
  },
  {
    slug: 'amd-ryzen-7-9800x3d-review-2026',
    emoji: '🔴', cat: 'Ревю', title: 'AMD Ryzen 7 9800X3D — Най-добрият геймърски процесор за парите',
    date: '26 Май 2026', dateISO: '2026-05-26', read: '6 мин', author: 'Мост Компютърс',
    summary: 'Ryzen 7 9800X3D предлага 9950X3D гейминг производителност на половин цена. Тествахме го в 12 игри и при рендериране.',
    metaDesc: 'AMD Ryzen 7 9800X3D ревю 2026 — тест в игри, Zen 5 + 3D V-Cache, сравнение с 9950X3D. Най-добрият геймърски CPU за цената.',
    tags: ['AMD', 'процесори', 'гейминг', 'ревю'],
    brand: 'amd', rating: '9.4',
    model: 'Ryzen 7 9800X3D', modelSub: 'Zen 5 · 3D V-Cache · AM5', brandLabel: 'AMD · CPU',
    verdict: 'Абсолютният крал на гейминг производителност за цената. Ако бюджетът не позволява 9950X3D — 9800X3D е правилният избор.',
    specs: {'Архитектура':'Zen 5 (TSMC 4nm)','Ядра / Нишки':'8C / 16T','Boost честота':'5.7 GHz','Кеш (L3)':'96 MB 3D V-Cache','TDP':'120 W','Сокет':'AM5 (LGA1718)'},
    body: `<h2>Защо 9800X3D е специален?</h2>
<p>AMD Ryzen 7 9800X3D съчетава Zen 5 IPC с 96 MB 3D V-Cache — комбинация, която е почти недостижима в гейминг при CPU-limited сценарии. За разлика от 7800X3D, новото поколение не жертва честота за кеш — 5.7 GHz boost е реален и постижим при охлаждане с 240+ мм AIO.</p>
<h2>Гейминг тестове при 1080p</h2>
<p>При <strong>1080p CPU-limited</strong> тестове 9800X3D e:</p>
<ul>
<li>Cyberpunk 2077 — 275 fps средно</li>
<li>CS2 — 620 fps средно</li>
<li>Hogwarts Legacy — 198 fps средно</li>
<li>Star Wars Outlaws — 165 fps средно</li>
<li>Microsoft Flight Simulator 2024 — 108 fps средно</li>
</ul>
<p>Разликата спрямо Ryzen 9 9950X3D е под <strong>8% в повечето игри</strong> — незначителна за практически употреби при 1440p с RTX 4070+ GPU.</p>
<h2>Продуктивност — слабата страна?</h2>
<p>При 8 ядра срещу 16 при 9950X3D, разликата в рендериране е реална: Blender Classroom — 9800X3D е ~42% по-бавен. За чиста продуктивна работа 9950X3D или 9900X са по-добри. 9800X3D е оптимален за геймъри, които понякога стриймват или компилират.</p>
<h2>Температура и платформа</h2>
<p>TDP е 120W — по-лесен за охлаждане от 9950X3D. 240 мм AIO е достатъчен. Работи на всяка AM5 платка с актуален BIOS. Препоръчителна памет: DDR5-6000 CL30 в 2×16 GB конфигурация.</p>
<h2>Заключение</h2>
<p>9800X3D е процесорът, който повечето геймъри <em>действително</em> трябва да купят. Оферира 95% от гейминг производителността на 9950X3D на под 60% от цената. <strong>Оценка: 9.4 / 10</strong></p>`
  },
  {
    slug: 'intel-vs-amd-cpu-2026',
    emoji: '⚔️', cat: 'Сравнение', title: 'Intel vs AMD 2026 — Кой процесор да изберем?',
    date: '19 Май 2026', dateISO: '2026-05-19', read: '7 мин', author: 'Мост Компютърс',
    summary: 'Arrow Lake-R срещу Zen 5 — пълно сравнение по гейминг, продуктивност, AI и платформа. Кой побеждава в средата на 2026?',
    metaDesc: 'Intel vs AMD 2026 — сравнение Core Ultra 300 Arrow Lake-R срещу Ryzen 9000 Zen 5. Кой CPU да купим за гейминг и работа?',
    tags: ['Intel', 'AMD', 'процесори', 'сравнение'],
    brand: 'general',
    body: `<h2>Платформи — AM5 срещу LGA1851</h2>
<p><strong>AMD AM5</strong> е по-зряла платформа — съществува от 2022 и поддържа Ryzen 7000, 8000 и 9000 серии. Съществуващите AM5 платки (X670E, B650E, B650) работят с нов BIOS. <strong>Intel LGA1851</strong> е по-нова — само Z890 и B860 дъни, DDR5 задължителна. AMD дава по-дълготрайна инвестиция в момента.</p>
<h2>Гейминг — AMD доминира</h2>
<p>При 1080p CPU-limited гейминг, Ryzen 7 9800X3D и 9950X3D са недостижими за Intel. Core Ultra 9 285K изостава с 15-25% в кешово-зависими игри. Без 3D V-Cache Intel губи директния дуел. При 1440p и 4K с мощна GPU разликата намалява до под 5% — практически незначителна.</p>
<h2>Продуктивност — по-изравнена битка</h2>
<p>В Cinebench 2025 Multi-Core: Core Ultra 9 285K е около 8% пред Ryzen 9 9900X, но 12% зад 9950X3D. При video export (DaVinci Resolve) Intel е по-бърз с ~6% спрямо 9900X. AMD печели при компилация и научни изчисления благодарение на по-голям кеш.</p>
<h2>AI — Intel NPU срещу AMD XDNA 2</h2>
<p>Intel Core Ultra 300 предлага <strong>48 TOPS NPU</strong>, AMD Ryzen 9000 — <strong>50 TOPS XDNA 2</strong>. Двете платформи са практически равни при локален AI инфер. Microsoft Copilot+ работи добре и на двете.</p>
<h2>Препоръки по случай</h2>
<ul>
<li><strong>Чист гейминг</strong> → AMD Ryzen 7 9800X3D</li>
<li><strong>Гейминг + продуктивност</strong> → AMD Ryzen 9 9950X3D</li>
<li><strong>AI работни натоварвания + Thunderbolt 5</strong> → Intel Core Ultra 9 285K</li>
<li><strong>Бюджет до 200 €</strong> → Intel Core i5-14600K или AMD Ryzen 5 9600X</li>
</ul>
<h2>Заключение</h2>
<p>AMD печели 2026 при гейминг. Intel отговаря с по-добри AI инструменти и Thunderbolt 5. За повечето потребители — AMD е по-доброто решение в момента.</p>`
  },
  {
    slug: 'palit-rtx-4080-super-jetstream-review',
    emoji: '🎮', cat: 'Ревю', title: 'Palit RTX 4080 Super JetStream OC — За 4K без компромис',
    date: '12 Май 2026', dateISO: '2026-05-12', read: '5 мин', author: 'Мост Компютърс',
    summary: 'RTX 4080 Super с JetStream охладителя на Palit е отговорът за истинско 4K гейминг. Тествахме го при максимални настройки.',
    metaDesc: 'Palit RTX 4080 Super JetStream OC ревю 2026 — 4K гейминг тест, температури, сравнение с RTX 4070 Ti Super. Worth it?',
    tags: ['Nvidia', 'Palit', 'GPU', 'гейминг', 'ревю'],
    brand: 'palit', rating: '8.9',
    model: 'RTX 4080 Super', modelSub: 'JetStream OC · 16 GB', brandLabel: 'PALIT · GPU',
    verdict: 'Оптималният избор за 4K гейминг с бюджет под 2000 €. JetStream охладителят го прави тих дори при максимално натоварване.',
    specs: {'GPU чип':'Ada Lovelace AD102','CUDA ядра':'10 240','Памет':'16 GB GDDR6X, 256-bit','Boost Clock':'2595 MHz (factory OC)','TDP':'320 W','Охладител':'JetStream 3×100 мм'},
    body: `<h2>RTX 4080 Super — позицията в линейката</h2>
<p>RTX 4080 Super запълва пространството между RTX 4070 Ti Super и RTX 4090. С 10 240 CUDA ядра и 16 GB GDDR6X на 256-битова шина, картата предлага около <strong>15% повече производителност</strong> спрямо RTX 4070 Ti Super при ~20% по-висока цена. Palit JetStream OC версията идва с factory overclock до 2595 MHz boost.</p>
<h2>4K гейминг производителност</h2>
<p>При <strong>4K Ultra</strong> настройки без ray tracing:</p>
<ul>
<li>Cyberpunk 2077 — 82 fps средно</li>
<li>Alan Wake 2 — 74 fps средно</li>
<li>Red Dead Redemption 2 — 98 fps средно</li>
<li>Microsoft Flight Simulator 2024 — 72 fps средно</li>
</ul>
<p>С DLSS 3 Quality (рендер при 1440p) числата скачат до 130-165 fps — 4K гейминг над 60 fps е постижимо без Frame Generation при повечето заглавия.</p>
<h2>Ray Tracing и DLSS 3</h2>
<p>RTX 4080 Super е <strong>значително по-добър от RTX 4070 Ti Super при RT</strong> — 18-22% разлика при Path Tracing в Cyberpunk 2077. Frame Generation удвоява fps при GPU-bound сценарии, а Reflex 2 запазва латентността под контрол.</p>
<h2>Температури и шум</h2>
<p>Palit JetStream охладителят с три 100 мм вентилатора държи GPU на 72°C при full load при стайна температура 22°C. Шумното ниво е 38 dBA — практически безшумен в затворен корпус. Вентилаторите спират напълно при 2D натоварване.</p>
<h2>Заключение</h2>
<p>Palit RTX 4080 Super JetStream OC е правилният избор за 4K геймъри, които не искат да плащат RTX 4090 цена. При 1440p — RTX 4070 Super е по-добрата стойност. <strong>Оценка: 8.9 / 10</strong></p>`
  },
  {
    slug: 'ddr5-6000-gaming-guide-2026',
    emoji: '🧠', cat: 'Съвети', title: 'DDR5 памет за гейминг 2026 — Колко и каква?',
    date: '05 Май 2026', dateISO: '2026-05-05', read: '5 мин', author: 'Мост Компютърс',
    summary: 'DDR5-6000 или DDR5-6400? 32 GB или 64 GB? Пълен наръчник за избор на памет за AMD AM5 и Intel LGA1851.',
    metaDesc: 'DDR5 памет за гейминг 2026 — DDR5-6000 vs 6400, 32 GB vs 64 GB, AMD AM5 и Intel Z890. Как да изберем правилно.',
    tags: ['памет', 'DDR5', 'AM5', 'съвети'],
    brand: 'general',
    body: `<h2>Колко GB памет е нужна за гейминг?</h2>
<p><strong>32 GB (2×16 GB)</strong> е стандартът за 2026. Повечето съвременни игри използват 16-24 GB при максимални настройки. 64 GB има смисъл само ако правиш едновременно гейминг + стрийминг + видео монтаж. За чист гейминг 32 GB е оптималното.</p>
<h2>DDR5-6000 vs DDR5-6400 — каква е разликата?</h2>
<p>За <strong>AMD AM5</strong> — DDR5-6000 CL30 е оптималното: попада в EXPO профила и синхронизира Infinity Fabric към 2000 MHz (1:1 режим). DDR5-6400 CL32 е леко по-бързо, но цената е непропорционална. Над DDR5-6400 AM5 преминава в 1:2 режим и производителността пада.</p>
<p>За <strong>Intel LGA1851</strong> — DDR5-6400 CL32 е препоръчителното. Intel XMP профилите са добре оптимизирани до тази честота. По-бързата памет носи минимални ползи при реална употреба.</p>
<h2>Dual Channel — задължителен</h2>
<p>Никога не купувай един модул. 2×16 GB dual channel е <strong>значително по-бърза</strong> от 1×32 GB single channel — до 20% разлика в гейминг производителност. Ако имаш бюджет за 64 GB — 2×32 GB вместо 4×16 GB (по-малко стрес върху контролера).</p>
<h2>CL (CAS Latency) — важен ли е?</h2>
<p>При равни честоти — по-нисък CL е по-добър. DDR5-6000 CL30 е по-бърза от DDR5-6000 CL36. Формулата е: <strong>латентност (ns) = (CL / честота) × 2000</strong>. При DDR5-6000 CL30: 10 ns — отлично.</p>
<h2>Препоръки за платформа</h2>
<ul>
<li><strong>AMD AM5 (Ryzen 9000)</strong> → DDR5-6000 CL30, 2×16 GB</li>
<li><strong>Intel LGA1851 (Core Ultra 300)</strong> → DDR5-6400 CL32, 2×16 GB</li>
<li><strong>AMD AM4 (Ryzen 5000)</strong> → все още DDR4-3600 CL18</li>
</ul>`
  },
  {
    slug: 'byudzhetna-gaming-sistema-2026',
    emoji: '🖥', cat: 'Съвети', title: 'Бюджетна гейминг система за 2026 — план за 800 €',
    date: '28 Април 2026', dateISO: '2026-04-28', read: '6 мин', author: 'Мост Компютърс',
    summary: 'Как да сглобим пълна гейминг система за около 800 € с компоненти, налични в Мост Компютърс. Съвети за всеки бюджет.',
    metaDesc: 'Бюджетна гейминг система 2026 — AMD Ryzen 5 9600X, Palit RTX 4060, B650 дъна. Как да изберем правилните компоненти за 800 €.',
    tags: ['гейминг', 'AMD', 'Palit', 'съвети', 'build'],
    brand: 'general',
    body: `<h2>Стратегия: CPU или GPU — кое е по-важно?</h2>
<p>За гейминг <strong>GPU-то е по-важно</strong>. При ограничен бюджет — вложи повече в видеокартата. Ryzen 5 9600X за 220 € + RTX 4060 8GB за 310 € е по-добра гейминг система от Ryzen 9 9950X3D + GTX 1660 Super. Правилото: GPU = 40-50% от бюджета.</p>
<h2>Примерна конфигурация за ~800 €</h2>
<ul>
<li><strong>CPU:</strong> AMD Ryzen 5 9600X — 220 € (6 ядра, Zen 5, 5.9 GHz boost)</li>
<li><strong>GPU:</strong> Palit GeForce RTX 4060 8GB — 310 € (DLSS 3, Frame Gen, 1080p/1440p)</li>
<li><strong>Дъна:</strong> ASRock B650M-HDV/M.2 AM5 — 110 € (B650, PCIe 4.0, 2× DDR5)</li>
<li><strong>RAM:</strong> DDR5-6000 CL30 2×8 GB — 65 € (достатъчно за гейминг)</li>
<li><strong>SSD:</strong> 1 TB NVMe Gen4 — 60 €</li>
<li><strong>Захранване:</strong> 650W 80+ Bronze — 55 €</li>
</ul>
<p><strong>Общо: ~820 €</strong> — пълна система без корпус и охладяване.</p>
<h2>RTX 4060 — добра ли е за парите?</h2>
<p>При 1080p Ultra — RTX 4060 постига 85-120 fps в повечето AAA заглавия. С DLSS 3 Frame Generation резултатите при 1440p са изненадващо добри (65-90 fps). За геймъри с 1080p монитор е отличен избор. За 1440p — препоръчваме RTX 4070 Super.</p>
<h2>Как да надградиш по-късно?</h2>
<p>AM5 платформата поддържа до Ryzen 9000 серия — можеш да смениш CPU по-късно без смяна на дъното. Захранването от 650W поддържа до RTX 4080 Super надстройка. Инвестирай в добро захранване от самото начало.</p>
<h2>Съвет за спестяване</h2>
<p>Ако бюджетът е под 700 € — замени Ryzen 5 9600X с Ryzen 5 9600 (MPK версия, ~185 €) и RTX 4060 с RTX 3060 12GB (~250 €). Системата ще е около 100 € по-евтина при само ~10% по-ниска производителност.</p>`
  },
  {
    slug: 'am5-motherboard-guide-2026',
    emoji: '🔧', cat: 'Съвети', title: 'AM5 дъна платка 2026 — ASRock, ASUS, Gigabyte или MSI?',
    date: '21 Април 2026', dateISO: '2026-04-21', read: '6 мин', author: 'Мост Компютърс',
    summary: 'B650 или X670? Кой производител предлага най-добро качество за цената при AM5 платформата? Пълен наръчник.',
    metaDesc: 'AM5 дъна платка 2026 — B650 vs X670E, ASRock vs ASUS vs Gigabyte vs MSI. Кое дъно да изберем за AMD Ryzen 9000?',
    tags: ['дъни платки', 'AM5', 'AMD', 'съвети'],
    brand: 'general',
    body: `<h2>B650 или X670E — какво да изберем?</h2>
<p><strong>B650</strong> е достатъчен за 95% от потребителите. Поддържа DDR5 ECC, PCIe 4.0 x4 за NVMe и USB 3.2 Gen 2. <strong>X670E</strong> добавя PCIe 5.0 x16 за GPU и PCIe 5.0 x4 за NVMe — полезно само ако имаш PCIe 5.0 SSD или RTX 4090 клас GPU. За Ryzen 5/7 — B650 е оптималното.</p>
<h2>Кой производител?</h2>
<h3>ASRock</h3>
<p>Най-добра стойност за парите. <strong>ASRock B650M Pro RS</strong> и <strong>B650M HDV/M.2</strong> предлагат солидни VRM за Ryzen 9000 на конкурентна цена. Добра BIOS поддръжка с редовни обновявания. Минус: по-скромен дизайн.</p>
<h3>ASUS</h3>
<p>Отлична BIOS среда (UEFI), богата функционалност, добра VRM. <strong>ASUS Prime B650M-A</strong> е популярен избор за mid-range системи. По-скъпо от ASRock, но оправдано при Ryzen 7/9.</p>
<h3>Gigabyte</h3>
<p>Добро охлаждане на VRM зоната. <strong>Gigabyte B650M DS3H</strong> е евтина и надеждна. Pro серията предлага подобрена аудио секция и по-добри конектори. Стабилна опция.</p>
<h3>MSI</h3>
<p>Висококачествен дизайн и богата екосистема с EZ Debug LED. <strong>MSI B650M Gaming Plus WiFi</strong> е отличен избор ако искаш WiFi включен. По-добра геймърска естетика от ASRock.</p>
<h2>Какво да проверим при избор</h2>
<ul>
<li><strong>VRM фазове</strong> — за Ryzen 9 9950X3D трябват минимум 12+2 фази с 60A+ дросели</li>
<li><strong>M.2 слотове</strong> — минимум 2 за система + storage</li>
<li><strong>WiFi</strong> — не всички B650 имат; проверявай спецификациите</li>
<li><strong>USB портове</strong> — USB4 / Thunderbolt само при X670E</li>
</ul>
<h2>Препоръка</h2>
<p>За <strong>Ryzen 5/7 9000</strong> → ASRock B650M Pro RS (~120 €). За <strong>Ryzen 9 9950X3D</strong> → ASUS Prime X670-P или MSI MEG X670E Ace за максимална стабилност.</p>`
  },
  {
    slug: 'macbook-pro-m4-pro-review',
    emoji: '💻', cat: 'Ревю', title: 'MacBook Pro M4 Pro — Worth It?',
    date: '07 Март 2026', dateISO: '2026-03-07', read: '5 мин', author: 'Мост Компютърс',
    summary: 'Тествахме новия MacBook Pro M4 Pro в реални условия — видео монтаж, код и gaming. Ето резултатите.',
    metaDesc: 'MacBook Pro M4 Pro ревю — производителност, батерия, дисплей. Струва ли си цената? Тест в реални условия от Most Computers.',
    tags: ['MacBook', 'лаптопи', 'ревю'],
    body: `<h2>Дизайн и конструкция</h2>
<p>MacBook Pro M4 Pro запазва емблематичния алуминиев корпус в Space Black. При 14-инчовия модел тежи 1.55 кг — незначително повече от M3, но усещането за качество е на ниво. Notch-ът е намален с 20% спрямо предишното поколение.</p>
<h2>Производителност — M4 Pro чип</h2>
<p>12-ядреният CPU на M4 Pro е около <strong>22% по-бърз</strong> от M3 Pro при многоядрени задачи. Рендерирането на 4K проект в Final Cut Pro, което на M3 Pro отнемаше 8 минути, при M4 Pro приключва за 6:20. Компилацията на голям Swift проект се ускорява с ~18%.</p>
<p>При gaming чрез Game Mode и Rosetta 2 постиженията са изненадващи — Baldur's Gate 3 тече стабилно на средни настройки при 1080p, около 55-60 fps.</p>
<h2>Дисплей и батерия</h2>
<p>Liquid Retina XDR панелът с 1000 нита за SDR и 1600 нита за HDR остава еталон. ProMotion адаптивно управлява честотата между 24 и 120 Hz. При смесено натоварване (код, видео конференции, Safari) изкарахме <strong>16-17 часа</strong> от зареждане до зареждане — резултат, недостижим за Windows алтернативите.</p>
<h2>Струва ли си надстройката от M3 Pro?</h2>
<p>Ако работиш с M3 Pro Mac — не бързай. Подобрението е реално, но не революционно. Ако обаче идваш от Intel Mac или M1, разликата е <em>огромна</em>. M4 Pro е най-балансираният MacBook Pro засега.</p>
<p><strong>Оценка: 9.2 / 10</strong></p>`
  },
  {
    slug: 'iphone-16-pro-max-vs-s25-ultra',
    emoji: '📱', cat: 'Сравнение', title: 'iPhone 16 Pro Max vs Samsung S25 Ultra',
    date: '03 Март 2026', dateISO: '2026-03-03', read: '7 мин', author: 'Мост Компютърс',
    summary: 'Двата флагмана се срещат в директен дуел. Камера, дисплей, батерия — кой печели?',
    metaDesc: 'iPhone 16 Pro Max срещу Samsung Galaxy S25 Ultra — пълно сравнение на камера, дисплей, батерия и производителност.',
    tags: ['iPhone', 'Samsung', 'смартфони', 'сравнение'],
    body: `<h2>Дизайн</h2>
<p>iPhone 16 Pro Max е преминал към титаниева рамка с по-заоблени ъгли. S25 Ultra залага на плоски ръбове и вградена S Pen — уникален плюс за творческата работа. И двата са в premium сегмента, но Apple изглежда по-изтънчено.</p>
<h2>Дисплей</h2>
<p>S25 Ultra предлага 6.9" Dynamic AMOLED 2X с 2600 нита пик яркост и 1-120 Hz адаптивен ProMotion. iPhone 16 Pro Max разполага с 6.9" Super Retina XDR OLED с ProMotion. В пряка конкуренция Samsung печели по яркост при директна слънчева светлина, докато Apple превъзхожда при точност на цветопредаването.</p>
<h2>Камера</h2>
<p>iPhone 16 Pro Max разполага с 48 MP главна, 48 MP ултраширока и 5x оптичен зум. S25 Ultra предлага 200 MP главна с 50 MP телефото при 5x и 10x зум. При дневна светлина двете системи са практически равни. Нощното снимане леко предпочита Samsung заради агресивната обработка, докато Apple дава по-естествен резултат.</p>
<h2>Производителност</h2>
<p>A18 Pro (Apple) срещу Snapdragon 8 Elite (Samsung) — в ежедневна употреба разликата е невидима. При тежко натоварване (видео рендериране, ML задачи) Apple губи по-малко производителност при топлинно дросиране.</p>
<h2>Батерия</h2>
<p>S25 Ultra предлага 5000 mAh батерия с 45W зареждане. iPhone 16 Pro Max — 4685 mAh с 27W. При реална употреба Samsung дава около 1 час повече автономия, но Apple зарежда безжично по-бързо (MagSafe 25W).</p>
<h2>Заключение</h2>
<p>Ако ти трябва S Pen, максимален зум и Android — <strong>S25 Ultra</strong>. Ако искаш iOS екосистема, по-добро видео и по-плавен софтуер — <strong>iPhone 16 Pro Max</strong>.</p>`
  },
  {
    slug: 'top-5-bejichni-slushalki-2026',
    emoji: '🎧', cat: 'Топ 5', title: 'Най-добри безжични слушалки за 2026',
    date: '28 Февруари 2026', dateISO: '2026-02-28', read: '4 мин', author: 'Мост Компютърс',
    summary: 'Sony, Bose, ANC технология — кои слушалки дават най-добро качество за парите си?',
    metaDesc: 'Топ 5 безжични слушалки за 2026 — Sony WH-1000XM6, Bose QC45, Jabra. Коя да избереш?',
    tags: ['слушалки', 'аудио', 'топ 5'],
    body: `<h2>1. Sony WH-1000XM6 — Най-добро шумопотискане</h2>
<p>Sony продължава да доминира в сегмента на ANC слушалките. XM6 предлага 40 ч. автономия, Multipoint свързване с 2 устройства и подобрен процесор V2 за по-прецизно шумопотискане. Звукът е наситен и детайлен, особено при Hi-Res Wireless с LDAC кодек.</p>
<h2>2. Bose QuietComfort Ultra</h2>
<p>Bose е поставил акцент върху Immersive Audio — пространствен звук, който се адаптира спрямо движенията на главата. Ако пътуваш много и шумопотискането е приоритет, QC Ultra е равностоен конкурент на Sony.</p>
<h2>3. Jabra Evolve2 85 — За офиса</h2>
<p>Ако работиш в open space, Jabra предлага 8-микрофонен array за кристални обаждания, 37 ч. батерия и сертификация за Microsoft Teams. Звукът е малко по-неутрален от Sony, но за видеоконференции е идеален.</p>
<h2>4. Sennheiser Momentum 4</h2>
<p>Германска инженерия, 60 ч. батерия и естествен звук без прекомерна обработка. Momentum 4 е изборът на аудиофилите с бюджет под 350 €.</p>
<h2>5. Logitech Zone Vibe 130 — Бюджетен избор</h2>
<p>Лека безжична слушалка с 22 ч. батерия, вграден микрофон и Teams/Zoom сертификация. За под 100 € е трудно да се намери по-добър офис вариант.</p>
<h2>Заключение</h2>
<p>За повечето хора — <strong>Sony WH-1000XM6</strong>. За офис употреба — <strong>Jabra Evolve2 85</strong>. На бюджет — <strong>Logitech Zone Vibe 130</strong>.</p>`
  },
  {
    slug: 'kak-da-izberem-monitor-rabota-vkashti',
    emoji: '🖥', cat: 'Съвети', title: 'Как да изберем монитор за работа от вкъщи',
    date: '22 Февруари 2026', dateISO: '2026-02-22', read: '6 мин', author: 'Мост Компютърс',
    summary: '4K или 1440p? IPS или OLED? Пълен наръчник за правилния избор.',
    metaDesc: 'Как да изберем монитор за работа от вкъщи — 4K, 1440p, IPS, OLED. Пълен наръчник 2026.',
    tags: ['монитори', 'работа от вкъщи', 'съвети', '4K'],
    body: `<h2>Резолюция: 1080p, 1440p или 4K?</h2>
<p>При 24-27" монитор <strong>1440p (2K)</strong> е оптималният баланс — достатъчно остра картина без прекомерно натоварване на GPU. 4K има смисъл при 32"+ или ако работиш с видео/снимки и имаш мощна графична карта.</p>
<h2>Матрица: IPS, VA или OLED?</h2>
<ul>
<li><strong>IPS</strong> — най-добри ъгли на видимост, точни цветове. Идеален за дизайн и фото работа.</li>
<li><strong>VA</strong> — по-висок контраст, по-добри черни. Добър за филми и кодиране.</li>
<li><strong>OLED</strong> — перфектни черни, изключителни цветове, но риск от burn-in при статично съдържание.</li>
</ul>
<h2>Честота на опресняване</h2>
<p>За офис работа 60-75 Hz е достатъчно. Ако пишеш код или четеш много — 120-144 Hz прави скролването значително по-плавно и намалява умората на очите.</p>
<h2>Размер и ергономия</h2>
<p>27" е стандартът за работа от вкъщи. Ако имаш пространство — помисли за ултраширок 34" (21:9), който заменя два отделни монитора. Стойка с регулиране на височина е задължителна за правилна поза.</p>
<h2>Препоръки по бюджет</h2>
<ul>
<li><strong>до 200 €</strong> — LG 27MN60T (IPS, 1080p, 75Hz)</li>
<li><strong>до 350 €</strong> — LG 27QN850-B (IPS, 1440p, USB-C 60W)</li>
<li><strong>до 600 €</strong> — LG 27UK850 (IPS, 4K, USB-C)</li>
<li><strong>без ограничение</strong> — ASUS ProArt PA329CRV (4K OLED, 144Hz)</li>
</ul>`
  },
  {
    slug: '10-nachina-udalzhim-bateriya',
    emoji: '🔋', cat: 'Съвети', title: '10 начина да удължим живота на батерията',
    date: '15 Февруари 2026', dateISO: '2026-02-15', read: '3 мин', author: 'Мост Компютърс',
    summary: 'Простите навици, които могат да удвоят живота на батерията на твоя телефон или лаптоп.',
    metaDesc: '10 съвета за по-дълъг живот на батерията на смартфон и лаптоп. Практични навици от Most Computers.',
    tags: ['батерия', 'съвети', 'смартфон', 'лаптоп'],
    body: `<h2>За смартфони</h2>
<ol>
<li><strong>Оптимизирано зареждане</strong> — iPhone и Android имат функция, която ограничава зареждането до 80% за нощни зарядки. Включи я.</li>
<li><strong>Избягвай крайностите</strong> — не изтощавай батерията до 0% и не я дръж постоянно на 100%. Оптималният диапазон е 20-80%.</li>
<li><strong>Намали яркостта</strong> — дисплеят е най-големият консуматор. Автоматична яркост + тъмен режим могат да спестят до 30% от батерията.</li>
<li><strong>Ограничи Background App Refresh</strong> — приложенията, които се обновяват на заден план, изяждат батерия незабележимо.</li>
<li><strong>Изключи Location Services</strong> за приложения, които не го нуждаят.</li>
</ol>
<h2>За лаптопи</h2>
<ol start="6">
<li><strong>Батерийни режими</strong> — Windows има "Battery Saver", macOS има "Low Power Mode". Включи при работа без захранване.</li>
<li><strong>Охлаждане</strong> — батериите деградират по-бързо при висока температура. Не работи с лаптопа върху меки повърхности.</li>
<li><strong>Hibernation вместо Sleep</strong> при дълго неизползване пести значително повече батерия.</li>
<li><strong>RAM вместо HDD/SSD swap</strong> — ако лаптопът постоянно пише на диска, добави RAM.</li>
<li><strong>Калибрация</strong> — веднъж на 3 месеца напълно зареди до 100%, след което изтощи до ~5%. Помага за точното отчитане на заряда.</li>
</ol>
<p>При правилна грижа, литиево-йонна батерия може да запази над 80% от капацитета след 500 цикъла зареждане.</p>`
  },
  {
    slug: 'umen-dom-pod-500-leva',
    emoji: '🏠', cat: 'Smart Home', title: 'Как да изградим умен дом за под 500 лв.',
    date: '10 Февруари 2026', dateISO: '2026-02-10', read: '8 мин', author: 'Мост Компютърс',
    summary: 'Philips Hue, смарт контакти, гласов асистент — пълна система без да се разоряваме.',
    metaDesc: 'Умен дом за под 500 лева — Philips Hue, Google Home, смарт контакти. Ръководство стъпка по стъпка.',
    tags: ['умен дом', 'Smart Home', 'Philips Hue', 'Google Home'],
    body: `<h2>Отправна точка: Гласов асистент</h2>
<p>Всичко започва с централен хъб. <strong>Google Nest Mini</strong> (около 50 лв.) или <strong>Amazon Echo Dot</strong> (около 45 лв.) са идеалните отправни точки. Веднъж инсталиран, асистентът управлява всички останали устройства с гласови команди.</p>
<h2>Интелигентно осветление (~150 лв.)</h2>
<p>Philips Hue Starter Kit с 3 крушки и хъб е класическият избор — стабилен Zigbee протокол, богата екосистема и страхотно приложение. Алтернативата е IKEA TRÅDFRI (по-евтино, малко по-ограничено). Смарт крушките с WiFi (SONOFF, Tapo) не изискват отделен хъб.</p>
<h2>Смарт контакти (~80 лв. за 2 бр.)</h2>
<p>Смарт контактите трансформират обикновени уреди в интелигентни. Стар вентилатор, кафемашина или лампа могат да се управляват от телефона или таймер. TP-Link Tapo P115 е любимецът — мери и консумацията на ток.</p>
<h2>Сигурност (~150 лв.)</h2>
<p>Смарт видеокамера (Tapo C200 — около 60 лв.) + смарт звънец (Reolink Video Doorbell — около 90 лв.) покриват основната домашна сигурност. И двата работят с Google Home и Alexa.</p>
<h2>Примерен бюджет</h2>
<ul>
<li>Google Nest Mini — 50 лв.</li>
<li>Philips Hue Starter Kit — 150 лв.</li>
<li>2x Tapo P115 смарт контакт — 80 лв.</li>
<li>Tapo C200 камера — 60 лв.</li>
<li>Reolink Doorbell — 90 лв.</li>
<li><strong>Общо: ~430 лв.</strong></li>
</ul>
<p>Ако разпределиш покупките за 2-3 месеца, усещането за „умен дом" идва постепенно — и е много по-достъпно, отколкото изглежда.</p>`
  },
];


function openBlogPage() {
  const listView = document.getElementById('blogListView');
  const postView = document.getElementById('blogPostView');
  if (listView) listView.style.display = '';
  if (postView) postView.style.display = 'none';
  const titleEl = document.getElementById('blogPageTitle');
  if (titleEl) titleEl.textContent = '📰 Блог и новини';
  _renderBlogGrid();
  _setPgBc('blogBc', 'Блог и новини', 'closeBlogPage');
  document.getElementById('blogPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Блог — Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Блог');
  try { history.pushState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
}
function _renderBlogGrid() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = blogPosts.map(p => {
    const brand = p.brand || 'general';
    const hdContent = p.model
      ? `${p.brandLabel ? `<div class="blog-mag-brand-lbl">${escHtml(p.brandLabel)}</div>` : ''}
         <div class="blog-mag-model">${escHtml(p.model)}</div>
         ${p.modelSub ? `<div class="blog-mag-submodel">${escHtml(p.modelSub)}</div>` : ''}`
      : `<div class="blog-mag-emoji">${p.emoji}</div>`;
    return `<div class="blog-mag-card" onclick="openBlogPost('${p.slug}')">
      <div class="blog-mag-hd blog-brand-${brand}">
        <span class="blog-mag-cat-pill">${escHtml(p.cat)}</span>
        ${p.rating ? `<span class="blog-mag-rating-badge">${escHtml(p.rating)}</span>` : ''}
        ${hdContent}
      </div>
      <div class="blog-mag-body">
        <div class="blog-mag-meta">
          <span class="blog-mag-date">${escHtml(p.date)}</span>
          <span class="blog-mag-read"><span class="blog-mag-dot"></span>${escHtml(p.read)} четене</span>
        </div>
        <div class="blog-mag-title">${escHtml(p.title)}</div>
        <div class="blog-mag-summary">${escHtml(p.summary)}</div>
        <div class="blog-mag-footer">
          <span class="blog-mag-tag">${escHtml(p.tags[0]||'')}</span>
          <span class="blog-mag-cta">Прочети →</span>
        </div>
      </div>
    </div>`;
  }).join('');
}
function openBlogPost(slug) {
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return;
  const listView = document.getElementById('blogListView');
  const postView = document.getElementById('blogPostView');
  const article = document.getElementById('blogArticle');
  if (!postView || !article) return;
  if (listView) listView.style.display = 'none';
  postView.style.display = '';
  const titleEl = document.getElementById('blogPageTitle');
  if (titleEl) titleEl.textContent = post.title;
  // Update breadcrumb: Начало > Блог > [Title]
  const bcEl = document.getElementById('blogBc');
  if (bcEl) {
    const shortTitle = post.title.length > 40 ? post.title.slice(0, 40) + '…' : post.title;
    bcEl.innerHTML = `<ol class="pg-bc-list" itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/" class="pg-bc-home" onclick="closeBlogPage();return false;">Начало</a>
      <meta itemprop="position" content="1"/>
    </li>
    <li class="pg-bc-sep" aria-hidden="true">›</li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a class="pg-bc-home" onclick="closeBlogPost();return false;" style="cursor:pointer">Блог</a>
      <meta itemprop="position" content="2"/>
    </li>
    <li class="pg-bc-sep" aria-hidden="true">›</li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <strong class="pg-bc-current" itemprop="name">${shortTitle}</strong>
      <meta itemprop="position" content="3"/>
    </li>
  </ol>`;
  }
  const brand = post.brand || 'general';
  const specsHtml = post.specs
    ? `<table class="blog-specs-table">${Object.entries(post.specs).map(([k,v]) =>
        `<tr><td>${escHtml(k)}</td><td>${escHtml(v)}</td></tr>`).join('')}</table>`
    : '';
  const verdictHtml = post.rating
    ? `<div class="blog-verdict">
        <div class="blog-verdict-score">${escHtml(post.rating)}<span>/ 10</span></div>
        <div class="blog-verdict-text">
          <h3>Нашата присъда</h3>
          <p>${escHtml(post.verdict||post.summary)}</p>
        </div>
       </div>`
    : '';
  article.innerHTML = `
    <div class="blog-reading-bar"><div class="blog-reading-fill" id="blogReadingFill"></div></div>
    <header class="blog-article-hero blog-brand-${brand}">
      ${post.brandLabel ? `<div class="blog-article-hero-brand">${escHtml(post.brandLabel)}</div>` : ''}
      <h1>${escHtml(post.title)}</h1>
      <div class="blog-article-hero-meta">
        <span class="blog-article-hero-badge cat">${escHtml(post.cat)}</span>
        <time datetime="${post.dateISO}" class="blog-article-hero-badge info">${escHtml(post.date)}</time>
        <span class="blog-article-hero-badge info">📖 ${escHtml(post.read)}</span>
        <span class="blog-article-hero-badge info">✍️ ${escHtml(post.author)}</span>
      </div>
    </header>
    <div class="blog-article-body-wrap">
      <p class="blog-article-lead">${escHtml(post.summary)}</p>
      ${specsHtml}
      <div class="blog-article-body">${post.body}</div>
      ${verdictHtml}
    </div>`;
  // SEO meta
  if (typeof setPageMeta === 'function') setPageMeta(post.title + ' — Most Computers', post.metaDesc);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/?page=blog&post=' + post.slug);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://mostcomputers.bg/?page=blog&post=' + post.slug);
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'article');
  // Article JSON-LD
  let _ld = document.getElementById('_blogPostLD');
  if (!_ld) { _ld = document.createElement('script'); _ld.type = 'application/ld+json'; _ld.id = '_blogPostLD'; document.head.appendChild(_ld); }
  _ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDesc,
    datePublished: post.dateISO,
    author: { '@type': 'Organization', name: 'Most Computers', url: 'https://mostcomputers.bg' },
    publisher: { '@type': 'Organization', name: 'Most Computers', url: 'https://mostcomputers.bg' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://mostcomputers.bg/?page=blog&post=' + post.slug }
  });
  if (!document.getElementById('blogPage').classList.contains('open')) {
    document.getElementById('blogPage').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  try { history.pushState({ page: 'blog', post: slug }, '', '?page=blog&post=' + slug); } catch(e) {}
  postView.scrollTop = 0;
  const fill = document.getElementById('blogReadingFill');
  if (postView._blogScrollFn) postView.removeEventListener('scroll', postView._blogScrollFn);
  postView._blogScrollFn = () => {
    const total = postView.scrollHeight - postView.clientHeight;
    if (fill && total > 0) fill.style.width = Math.min(100, (postView.scrollTop / total) * 100) + '%';
  };
  postView.addEventListener('scroll', postView._blogScrollFn);
}
function closeBlogPost() {
  const listView = document.getElementById('blogListView');
  const postView = document.getElementById('blogPostView');
  if (postView) postView.style.display = 'none';
  if (listView) listView.style.display = '';
  const titleEl = document.getElementById('blogPageTitle');
  if (titleEl) titleEl.textContent = '📰 Блог и новини';
  // Remove Article JSON-LD
  const _ld = document.getElementById('_blogPostLD');
  if (_ld) _ld.remove();
  if (typeof setPageMeta === 'function') setPageMeta('Блог — Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  try { history.replaceState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
  _setPgBc('blogBc', 'Блог и новини', 'closeBlogPage');
}
function closeBlogPage() {
  // If a post is open, close post first and go back to list
  const postView = document.getElementById('blogPostView');
  if (postView && postView.style.display !== 'none' && postView.style.display !== '') {
    closeBlogPost();
    return;
  }
  document.getElementById('blogPage').classList.remove('open');
  document.body.style.overflow = '';
  const _ld = document.getElementById('_blogPostLD');
  if (_ld) _ld.remove();
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
// Lazy-load Leaflet JS + CSS on first map use (saves ~41 KiB from initial load)
var _leafletLoaded = false;
var _leafletLoading = false;
var _leafletQueue = [];
function _loadLeaflet(cb) {
  if (_leafletLoaded) { cb(); return; }
  _leafletQueue.push(cb);
  if (_leafletLoading) return;
  _leafletLoading = true;
  // CSS first (non-blocking)
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  css.crossOrigin = '';
  document.head.appendChild(css);
  // JS
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  s.crossOrigin = '';
  s.onload = function() {
    _leafletLoaded = true;
    _leafletLoading = false;
    _leafletQueue.forEach(function(fn) { fn(); });
    _leafletQueue = [];
  };
  document.head.appendChild(s);
}

let _svcMap = null;
function openServicePage() {
  _setPgBc('serviceBc', 'Сервиз и поддръжка', 'closeServicePage');
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Сервизен център — Most Computers', 'Сертифициран сервиз за лаптопи, компютри и електроника. Диагностика, ремонт и гаранционно обслужване в Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Сервизен център');
  try { history.pushState({ page: 'service' }, '', '?page=service'); } catch(e) {}
  _svcTrkInit();
  _svcMapInit();
}
function _svcMapInit() {
  const el = document.getElementById('svcLeafletMap');
  if (!el) return;
  if (_svcMap) { setTimeout(() => _svcMap.invalidateSize(), 200); return; }
  _loadLeaflet(function() {
    if (_svcMap) return;
    _svcMap = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([42.679938, 23.359063], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(_svcMap);
    const pinIcon = L.divIcon({
      className: '',
      html: '<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="#bd1105"/><circle cx="14" cy="14" r="5.5" fill="#fff"/></svg>',
      iconSize: [28, 36],
      iconAnchor: [14, 36]
    });
    L.marker([42.679938, 23.359063], { icon: pinIcon })
      .addTo(_svcMap)
      .bindPopup('<strong>Мост Компютърс</strong><br>бул. Шипченски проход 240');
    setTimeout(() => _svcMap.invalidateSize(), 200);
  });
}
function closeServicePage() {
  document.getElementById('servicePage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function openDeliveryPage() {
  _setPgBc('deliveryBc', 'Доставка и плащане', 'closeDeliveryPage');
  document.getElementById('deliveryPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Доставка и плащане — Most Computers', 'Безплатна доставка при поръчки над 100 €. Доставяме с куриер в рамките на 1-3 работни дни в цяла България.');
  if (typeof bcOnPage === 'function') bcOnPage('Доставка и плащане');
  try { history.pushState({ page: 'delivery' }, '', '?page=delivery'); } catch(e) {}
}
function closeDeliveryPage() {
  document.getElementById('deliveryPage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function filterCatScroll(type) {
  if (typeof openCatPage === 'function') { openCatPage(type); return; }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
}


// ===== CONTACTS PAGE =====
let _contactsMap = null;
function openContactsPage() {
  _setPgBc('contactsBc', 'Контакти & Как да ни намерите', 'closeContactsPage');
  document.getElementById('contactsPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  checkOpenNow();
  try{history.pushState({page:'contacts'}, '', '?page=contacts');}catch(e){}
  _contactsMapInit();
}
function _contactsMapInit() {
  const el = document.getElementById('contactsLeafletMap');
  if (!el) return;
  if (_contactsMap) { setTimeout(() => _contactsMap.invalidateSize(), 200); return; }
  _loadLeaflet(function() {
    if (_contactsMap) return;
    _contactsMap = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([42.679938, 23.359063], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(_contactsMap);
    const pinIcon = L.divIcon({
      className: '',
      html: '<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="#bd1105"/><circle cx="14" cy="14" r="5.5" fill="#fff"/></svg>',
      iconSize: [28, 36],
      iconAnchor: [14, 36]
    });
    L.marker([42.679938, 23.359063], { icon: pinIcon })
      .addTo(_contactsMap)
      .bindPopup('<strong>Мост Компютърс</strong><br>бул. Шипченски проход 240');
    setTimeout(() => _contactsMap.invalidateSize(), 200);
  });
}

function closeContactsPage() {
  document.getElementById('contactsPage').classList.remove('open');
  document.body.style.overflow = '';
  try{history.pushState(null, '', window.location.pathname);}catch(e){}
}

function switchDirTab(type, btn) {
  document.querySelectorAll('.dir-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dir-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById('dir-' + type);
  if (el) el.classList.add('active');
}

function copyAddress() {
  const addr = 'бул. Шипченски проход бл.240, ж.к. Гео Милев, 1111 София';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(addr).then(() => showToast('📋 Адресът е копиран!')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = addr; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 Адресът е копиран!');
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = addr; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('📋 Адресът е копиран!');
  }
}

function copyPlusCode() {
  const code = 'M9H5+XJ Sofia';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => showToast('📍 Plus Code е копиран!')).catch(() => showToast('Plus Code: M9H5+XJ Sofia'));
  } else {
    showToast('Plus Code: M9H5+XJ Sofia');
  }
}

function checkOpenNow() {
  const badge = document.getElementById('openNowBadge');
  if (!badge) return;
  const now = new Date();
  const day  = now.getDay(); // 0=Sun, 1=Mon, 6=Sat
  const h    = now.getHours();
  const m    = now.getMinutes();
  const time = h * 60 + m;

  let isOpen = false;
  // Mon-Fri 09:30-18:15
  if (day >= 1 && day <= 5 && time >= 570 && time < 1095) isOpen = true;
  // Sat-Sun: closed

  // Highlight today in table
  const rows = document.querySelectorAll('#hoursTable tr');
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // table row index for each JS day
  rows.forEach(r => r.style.fontWeight = '');
  if (rows[dayMap[day]]) {
    rows[dayMap[day]].style.background = 'var(--primary-light)';
    rows[dayMap[day]].style.borderRadius = '6px';
  }

  badge.innerHTML = isOpen
    ? '<span style="display:inline-flex;align-items:center;gap:6px;background:#e8f9ed;color:#1a7f37;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#34c759;display:inline-block;"></span> Отворено сега</span>'
    : '<span style="display:inline-flex;align-items:center;gap:6px;background:#fef2f2;color:#dc2626;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span> Затворено</span>';
}



// ===== SERVICE TRACKER =====
let _svcTrkInited = false;
const _SVCTRK_LAST = 'svcTrkLast';
const _SVCTRK_HIST = 'svcTrkHist';

function _svcEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _svcTrkInit() {
  if (_svcTrkInited) return;
  const form = document.getElementById('svcTrkForm');
  if (!form) return;
  _svcTrkInited = true;

  const inputOrder    = document.getElementById('svcTrkOrder');
  const inputWarranty = document.getElementById('svcTrkWarranty');
  const errEl         = document.getElementById('svcTrkErr');

  inputWarranty.addEventListener('input', e => {
    const v = e.target.value.replace(/\D/g, '');
    if (e.target.value !== v) e.target.value = v;
    inputWarranty.classList.remove('svc-err');
    errEl.style.display = 'none';
    _svcTrkClearResult();
  });
  inputOrder.addEventListener('input', () => {
    inputOrder.classList.remove('svc-err');
    errEl.style.display = 'none';
    _svcTrkClearResult();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    _svcTrkSearch(inputOrder.value.trim(), inputWarranty.value.trim());
  });

  // Restore last result from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem(_SVCTRK_LAST) || 'null');
    if (saved && saved.searchType && saved.searchValue) {
      if (saved.searchType === 'order') inputOrder.value = saved.searchValue;
      else inputWarranty.value = saved.searchValue;
      _svcTrkShowResult(saved, true);
    }
  } catch(e) {}
  _svcTrkUpdateHistory();
}

function _svcTrkSearch(order, warranty) {
  const inputOrder    = document.getElementById('svcTrkOrder');
  const inputWarranty = document.getElementById('svcTrkWarranty');
  const errEl         = document.getElementById('svcTrkErr');
  inputOrder.classList.remove('svc-err');
  inputWarranty.classList.remove('svc-err');

  if (!order && !warranty) {
    errEl.style.display = 'block';
    inputOrder.classList.add('svc-err');
    inputWarranty.classList.add('svc-err');
    return;
  }
  const val = order || warranty;
  if (val.length < 3) {
    errEl.style.display = 'block';
    (order ? inputOrder : inputWarranty).classList.add('svc-err');
    return;
  }
  errEl.style.display = 'none';

  const btn    = document.getElementById('svcTrkBtn');
  const btnTxt = document.getElementById('svcTrkBtnTxt');
  const loader = document.getElementById('svcTrkLoader');
  btn.disabled = true;
  btnTxt.textContent = 'Проверяваме…';
  loader.style.display = 'inline-block';
  _svcTrkClearResult();

  const searchType  = order ? 'order' : 'warranty';
  const searchValue = val;

  // TODO: replace setTimeout with real API fetch
  setTimeout(() => {
    btn.disabled = false;
    btnTxt.textContent = '🔍 Провери статус';
    loader.style.display = 'none';

    if (searchValue.endsWith('0')) {
      _svcTrkShowError('⚠️ Няма намерена поръчка с този номер. Проверете дали номерът е изписан правилно.');
    } else {
      const demo = { found:true, status:'В ремонт', updatedAt:'20.11.2025',
        step:'Изчаква резервни части', location:'Сервизен център — София', searchType, searchValue };
      _svcTrkShowResult(demo, false);
      localStorage.setItem(_SVCTRK_LAST, JSON.stringify(demo));
      _svcTrkSaveHistory(demo);
      _svcTrkUpdateHistory();
    }
  }, 1200);
}

function _svcTrkPillClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('ремонт'))                    return 'svc-pill-repair';
  if (s.includes('изчаква') || s.includes('части')) return 'svc-pill-waiting';
  if (s.includes('готов')   || s.includes('получаване')) return 'svc-pill-ready';
  return 'svc-pill-default';
}

function _svcTrkShowResult(data, fromCache) {
  if (!data || !data.found) { _svcTrkShowError('⚠️ Няма намерена поръчка с този номер.'); return; }
  const box       = document.getElementById('svcTrkResult');
  const pill      = _svcTrkPillClass(data.status);
  const isReady   = pill === 'svc-pill-ready';
  const typeLabel = data.searchType === 'order' ? 'Сервизна поръчка' : 'Гаранционна карта';
  const sv        = _svcEsc(data.searchValue || '');

  box.innerHTML = `
    <div class="svc-result-ok">✅ Поръчката е намерена</div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
      <span class="svc-result-label">${typeLabel} → ${sv}</span>
      <button type="button" class="svc-copy-btn"
        onclick="navigator.clipboard&&navigator.clipboard.writeText('${sv}').then(()=>{this.textContent='Копирано';setTimeout(()=>this.textContent='Копирай номер',1500)})">Копирай номер</button>
    </div>
    <div class="svc-result-row"><span class="svc-result-label">Статус:</span> ${_svcEsc(data.status)} <span class="svc-pill ${pill}">${_svcEsc(data.status)}</span></div>
    <div class="svc-result-row"><span class="svc-result-label">Последна актуализация:</span> ${_svcEsc(data.updatedAt || '—')}</div>
    <div class="svc-result-row"><span class="svc-result-label">Етап:</span> ${_svcEsc(data.step || '—')}</div>
    <div class="svc-result-row"><span class="svc-result-label">Локация:</span> ${_svcEsc(data.location || '—')}</div>
    ${isReady ? '<div class="svc-ready-note">✅ Ремонтът е приключил. Носете сервизния протокол при получаване.</div>' : ''}
    ${fromCache ? '<div style="margin-top:8px;font-size:12px;color:var(--muted);"><em>Показан е последният резултат от предишно търсене.</em></div>' : ''}
  `;
  box.style.display = 'block';
  requestAnimationFrame(() => box.classList.add('show'));
}

function _svcTrkShowError(msg) {
  const box = document.getElementById('svcTrkResult');
  box.innerHTML = `
    <div class="svc-result-err">${_svcEsc(msg)}</div>
    <div style="font-size:13px;color:var(--text2);">Проверете дали номерът е изписан правилно и опитайте отново.</div>
    <div style="margin-top:8px;font-size:13px;">При нужда от съдействие: <a href="tel:0700144 11" style="color:var(--primary);font-weight:700;">0700 144 11</a></div>
  `;
  box.style.display = 'block';
  requestAnimationFrame(() => box.classList.add('show'));
}

function _svcTrkClearResult() {
  const box = document.getElementById('svcTrkResult');
  if (!box) return;
  box.classList.remove('show');
  box.style.display = 'none';
  box.innerHTML = '';
}

function _svcTrkGetHistory() {
  try { return JSON.parse(localStorage.getItem(_SVCTRK_HIST) || '[]'); } catch(e) { return []; }
}

function _svcTrkSaveHistory(data) {
  const h = _svcTrkGetHistory().filter(i => !(i.searchType === data.searchType && i.searchValue === data.searchValue));
  h.unshift({ searchType: data.searchType, searchValue: data.searchValue, status: data.status });
  localStorage.setItem(_SVCTRK_HIST, JSON.stringify(h.slice(0, 3)));
}

function _svcTrkUpdateHistory() {
  const box  = document.getElementById('svcTrkHistory');
  const list = document.getElementById('svcTrkHistList');
  if (!box || !list) return;
  const h = _svcTrkGetHistory();
  if (!h.length) { box.style.display = 'none'; return; }
  list.innerHTML = h.map(item => {
    const label = item.searchType === 'order' ? 'Поръчка' : 'Гаранция';
    const sv    = _svcEsc(item.searchValue || '');
    const st    = _svcEsc(item.status || '');
    const type  = _svcEsc(item.searchType || '');
    return `<li style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;gap:6px;flex-wrap:wrap;">
      <span style="font-size:13px;">${label} → ${sv} — ${st}</span>
      <button type="button" class="svc-copy-btn" onclick="_svcTrkRepeat('${type}','${sv}')">Повтори</button>
    </li>`;
  }).join('');
  box.style.display = 'block';
}

function _svcTrkRepeat(type, value) {
  const inputOrder    = document.getElementById('svcTrkOrder');
  const inputWarranty = document.getElementById('svcTrkWarranty');
  if (!inputOrder) return;
  if (type === 'order') { inputOrder.value = value; inputWarranty.value = ''; _svcTrkSearch(value, ''); }
  else                  { inputOrder.value = ''; inputWarranty.value = value; _svcTrkSearch('', value); }
}

// ===== ABOUT PAGE =====
function openAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  _setPgBc('aboutBc', 'За нас', 'closeAboutPage');
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('За нас — Most Computers', 'Most Computers — над 36 години опит в продажбата на компютри и електроника. Специализиран магазин в центъра на София.');
  if (typeof bcOnPage === 'function') bcOnPage('За нас');
  try{history.pushState({ page: 'about' }, '', '?page=about');}catch(e){}
}
function closeAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  page.classList.remove('open');
  setTimeout(() => { page.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try{history.pushState(null, '', window.location.pathname);}catch(e){}
}

// renderHpSubcatsStrip and renderRecentlyDiscounted are called
// directly in main.js — no DOMContentLoaded wrapper needed here
// (deferred scripts run before DOMContentLoaded, so the handler
//  would cause a redundant second render on every page load).

// ===== PWA =====
(function() {
  // 1. Generate SVG icon as data URL
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="115" fill="#bd1105"/>
    <text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text>
    <text x="256" y="430" font-size="72" font-family="Arial" font-weight="900" text-anchor="middle" fill="white">MC</text>
  </svg>`;
  const iconUrl = 'data:image/svg+xml,' + encodeURIComponent(iconSvg);

  // Apply apple-touch-icon
  const appleIcon = document.getElementById('pwaAppleIcon');
  if (appleIcon) { appleIcon.rel='apple-touch-icon'; appleIcon.href=iconUrl; }

  // 2. Generate and inject manifest via Blob URL
  const manifest = {
    name: 'Most Computers',
    short_name: 'Most Computers',
    description: 'Онлайн магазин за електроника',
    start_url: './',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#bd1105',
    lang: 'bg',
    icons: [
      { src: iconUrl, sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
      { src: iconUrl, sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
    ],
    screenshots: [],
    categories: ['shopping', 'electronics'],
  };
  try {
    const blob = new Blob([JSON.stringify(manifest)], {type:'application/json'});
    const manifestUrl = URL.createObjectURL(blob);
    const manifestLink = document.getElementById('pwaManifest');
    if (manifestLink) manifestLink.href = manifestUrl;
  } catch(e) {}

  // 3. Service Worker — registers when hosted on HTTPS
  // (Blob URLs not supported for SW — browser security restriction)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => { console.log('MC SW ✓', reg.scope); window._mcSwReg = reg; })
      .catch(err => console.warn('MC SW:', err.message));
  }

  // 4. Install prompt logic
  let deferredPrompt = null;
  const banner = document.getElementById('pwaBanner');
  let dismissed, installed;
  try { dismissed = localStorage.getItem('mc_pwa_dismissed'); installed = localStorage.getItem('mc_pwa_installed'); } catch(e) {}

  if (installed || dismissed) return; // already handled

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  // avoid errors during testing where matchMedia may be undefined
  const isInStandalone = window.navigator.standalone === true
    || (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches);

  if (isInStandalone) return; // already installed

  if (isIos) {
    // Show iOS instructions after 4s
    setTimeout(() => { if (banner) banner.classList.add('show'); }, 4000);
    window.__pwaIsIos = true;
  } else {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(() => { if (banner) banner.classList.add('show'); }, 3000);
    });
    window.__pwaPrompt = () => deferredPrompt;
  }
})();

function pwaInstall() {
  if (window.__pwaIsIos) {
    document.getElementById('pwaBanner').classList.remove('show');
    document.getElementById('pwaIosModal').classList.add('open');
    return;
  }
  const prompt = window.__pwaPrompt?.();
  if (prompt) {
    prompt.prompt();
    prompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        try { localStorage.setItem('mc_pwa_installed', '1'); } catch(e) {}
        showToast('✓ Мост Компютърс е инсталиран!');
      }
      document.getElementById('pwaBanner').classList.remove('show');
    });
  } else {
    // Fallback: show iOS style instructions
    document.getElementById('pwaBanner').classList.remove('show');
    document.getElementById('pwaIosModal').classList.add('open');
  }
}

function pwaDismiss() {
  document.getElementById('pwaBanner').classList.remove('show');
  try { localStorage.setItem('mc_pwa_dismissed', '1'); } catch(e) {}
}

// helper called from data-action to scroll modal to top
function scrollProductModalTop() {
  const modal = document.getElementById('productModal');
  if (modal) modal.scrollTo({top:0,behavior:'smooth'});
}

function closePwaIos() {
  document.getElementById('pwaIosModal').classList.remove('open');
}



// ===== PUSH NOTIFICATIONS =====
async function requestPushPermission() {
  if (!('Notification' in window)) {
    showToast('⚠️ Браузърът ти не поддържа известия');
    return;
  }
  if (Notification.permission === 'granted') {
    showToast('✓ Известията вече са активирани!');
    return;
  }
  if (Notification.permission === 'denied') {
    showToast('⚠️ Известията са блокирани в браузъра');
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    showToast('🔔 Ще получаваш известия за горещи оферти!');
    localStorage.setItem('mc_push_granted', '1');
    // Demo: send a test notification after 3s
    setTimeout(() => {
      new Notification('Мост Компютърс 🔥', {
        body: 'Добре дошъл! Следи за ексклузивни оферти.',
        icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text></svg>'),
        tag: 'mc-welcome'
      });
    }, 3000);
  } else {
    showToast('Известията не са активирани');
  }
}

function sendPromoNotification(title, body, url) {
  if (Notification.permission !== 'granted') return;
  const n = new Notification(title || 'Мост Компютърс 🔥', {
    body: body || 'Нова оферта те очаква!',
    icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text></svg>'),
    tag: 'mc-promo',
    renotify: true
  });
  if (url) n.addEventListener('click', () => window.focus());
}

// Auto-show push opt-in after 30s (only once)
setTimeout(() => {
  if (localStorage.getItem('mc_push_granted')) return;
  if (localStorage.getItem('mc_push_dismissed')) return;
  if (!('Notification' in window) || Notification.permission !== 'default') return;
  const banner = document.getElementById('pushOptInBanner');
  if (banner) banner.classList.add('show');
}, 30000);

function dismissPushBanner() {
  const banner = document.getElementById('pushOptInBanner');
  if (banner) banner.classList.remove('show');
  localStorage.setItem('mc_push_dismissed', '1');
}



// ── Lazy Admin Loader ────────────────────────────────────────────────────────
// admin.js (144 KB) се зарежда само когато потребителят отвори admin панела.
// Стубовете по-долу се заменят автоматично от реалните функции след зареждане.

let _adminLoaded = false;
let _adminLoading = false;
const _adminQueue = [];

function _loadAdminScript(cb) {
  if (_adminLoaded) { if (cb) cb(); return; }
  if (cb) _adminQueue.push(cb);
  if (_adminLoading) return;
  _adminLoading = true;
  const s = document.createElement('script');
  s.src = 'js/admin.js?v=' + (typeof SW_VERSION !== 'undefined' ? SW_VERSION : Date.now());
  s.onload = () => {
    _adminLoaded = true;
    _adminLoading = false;
    _adminQueue.splice(0).forEach(fn => fn());
  };
  s.onerror = () => {
    _adminLoading = false;
    showToast('⚠️ Грешка при зареждане на Admin панела');
  };
  document.head.appendChild(s);
}

// Stub — заменя се от реалната функция в admin.js след зареждане
function openAdminPage() {
  _loadAdminScript(() => {
    if (typeof openAdminPage === 'function') openAdminPage();
  });
}

// Stub — нужен на ui.js преди admin.js да се зареди
function closeAdminPage() {
  const page = document.getElementById('adminPage');
  if (page) page.style.display = 'none';
  document.body.style.overflow = '';
}

// ===== ANALYTICS — Most Computers =====
// GA4 + Meta Pixel + dev console
// Load order: after main.js (last) so all functions are defined
// ======================================

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────────────
  const IS_DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const GA4_ID = 'G-HE0YMD8BQ7';
  const FB_PIXEL = ''; // опционален Meta Pixel ID

  // ── Core trackEvent ──────────────────────────────────────────────────────────
  function trackEvent(eventName, data) {
    const payload = Object.assign({ timestamp: Date.now() }, data || {});

    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, payload);
    }

    // Meta Pixel
    if (typeof fbq === 'function' && FB_PIXEL) {
      fbq('trackCustom', eventName, payload);
    }

    // Dev console
    if (IS_DEV) {
      console.log('%c[Analytics]%c ' + eventName, 'color:#bd1105;font-weight:700', 'color:inherit', payload);
    }

    // LocalStorage event log (capped at 200 entries — for debugging & simple analytics)
    try {
      const log = JSON.parse(localStorage.getItem('mc_analytics_log') || '[]');
      log.unshift({ event: eventName, data: payload });
      if (log.length > 200) log.length = 200;
      localStorage.setItem('mc_analytics_log', JSON.stringify(log));
    } catch (_) {}
  }

  // ── page_view ────────────────────────────────────────────────────────────────
  function trackPageView() {
    trackEvent('page_view', {
      page_title: document.title,
      page_location: location.href,
      referrer: document.referrer || '(direct)'
    });
  }

  // ── view_product ─────────────────────────────────────────────────────────────
  function hookOpenProductPage() {
    const _orig = window.openProductPage;
    if (typeof _orig !== 'function') return;
    window.openProductPage = function (id) {
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        trackEvent('view_product', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          brand: p.brand || '',
          currency: 'BGN'
        });
        // GA4 standard ecommerce
        if (typeof gtag === 'function') {
          gtag('event', 'view_item', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price }]
          });
        }
      }
      return result;
    };
  }

  // ── add_to_cart ───────────────────────────────────────────────────────────────
  function hookAddToCart() {
    const _orig = window.addToCart;
    if (typeof _orig !== 'function') return;
    window.addToCart = function (id) {
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        trackEvent('add_to_cart', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          brand: p.brand || '',
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'add_to_cart', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price, quantity: 1 }]
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'AddToCart', { content_ids: [p.id], content_name: p.name, value: p.price, currency: 'BGN' });
        }
      }
      return result;
    };
  }

  // ── remove_from_cart ─────────────────────────────────────────────────────────
  function hookRemoveFromCart() {
    const _orig = window.removeFromCart;
    if (typeof _orig !== 'function') return;
    window.removeFromCart = function (id) {
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      const result = _orig.apply(this, arguments);
      if (p) {
        trackEvent('remove_from_cart', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'remove_from_cart', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price }]
          });
        }
      }
      return result;
    };
  }

  // ── add_to_wishlist / remove_from_wishlist ────────────────────────────────────
  function hookToggleWishlist() {
    const _orig = window.toggleWishlist;
    if (typeof _orig !== 'function') return;
    window.toggleWishlist = function (id, e) {
      const wishlistBefore = (typeof wishlist !== 'undefined') ? wishlist.slice() : [];
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        const wasInWishlist = wishlistBefore.indexOf(id) !== -1;
        const eventName = wasInWishlist ? 'remove_from_wishlist' : 'add_to_wishlist';
        trackEvent(eventName, {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          currency: 'BGN'
        });
        if (!wasInWishlist && typeof fbq === 'function') {
          fbq('track', 'AddToWishlist', { content_ids: [p.id], content_name: p.name, value: p.price, currency: 'BGN' });
        }
      }
      return result;
    };
  }

  // ── begin_checkout ───────────────────────────────────────────────────────────
  function hookToggleCart() {
    const _orig = window.toggleCart;
    if (typeof _orig !== 'function') return;
    window.toggleCart = function () {
      const result = _orig.apply(this, arguments);
      const cartEl = document.getElementById('cartPanel');
      const isOpening = cartEl && cartEl.classList.contains('open');
      if (isOpening && typeof cart !== 'undefined' && cart.length > 0) {
        const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
        trackEvent('view_cart', {
          cart_total: Math.round(total * 100) / 100,
          item_count: cart.reduce((s, x) => s + x.qty, 0),
          currency: 'BGN'
        });
      }
      return result;
    };
  }

  function hookShowCheckoutStep() {
    const _orig = window.showCheckoutStep;
    if (typeof _orig !== 'function') return;
    window.showCheckoutStep = function (n) {
      const result = _orig.apply(this, arguments);
      if (n === 1 && typeof cart !== 'undefined') {
        const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
        const items = cart.map(x => ({ item_id: String(x.id), item_name: x.name, price: x.price, quantity: x.qty }));
        trackEvent('begin_checkout', {
          cart_total: Math.round(total * 100) / 100,
          item_count: cart.reduce((s, x) => s + x.qty, 0),
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'begin_checkout', { currency: 'BGN', value: total, items });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'InitiateCheckout', { value: total, currency: 'BGN', num_items: items.length });
        }
      }
      return result;
    };
  }

  // ── apply_promo ──────────────────────────────────────────────────────────────
  function hookApplyPromo() {
    const _orig = window.applyPromo;
    if (typeof _orig !== 'function') return;
    window.applyPromo = function (codeArg) {
      const codeBefore = typeof promoApplied !== 'undefined' ? promoApplied : false;
      const result = _orig.apply(this, arguments);
      const codeAfter = typeof promoApplied !== 'undefined' ? promoApplied : false;
      const code = (codeArg || '').trim().toUpperCase();
      if (!codeBefore && codeAfter) {
        const total = (typeof cart !== 'undefined') ? cart.reduce((s, x) => s + x.price * x.qty, 0) : 0;
        trackEvent('apply_promo', {
          promo_code: code,
          discount_pct: 10,
          discount_amount: Math.round(total * 0.10 * 100) / 100,
          currency: 'BGN'
        });
      } else if (!codeAfter && code) {
        trackEvent('promo_failed', { promo_code: code });
      }
      return result;
    };
  }

  // ── purchase ─────────────────────────────────────────────────────────────────
  function hookSubmitOrder() {
    const _orig = window.submitOrder;
    if (typeof _orig !== 'function') return;
    window.submitOrder = function () {
      // Snapshot cart before submit clears it
      const cartSnapshot = (typeof cart !== 'undefined') ? cart.map(x => ({
        item_id: String(x.id),
        item_name: x.name,
        item_category: x.cat,
        price: x.price,
        quantity: x.qty
      })) : [];
      const subtotal = cartSnapshot.reduce((s, x) => s + x.price * x.quantity, 0);
      const promo = (typeof promoApplied !== 'undefined' && promoApplied) ? subtotal * 0.10 : 0;
      const delivery = (typeof ckDeliveryCosts !== 'undefined' && typeof ckDeliveryIdx !== 'undefined')
        ? ckDeliveryCosts[ckDeliveryIdx] : 0;
      const total = Math.round((subtotal - promo + delivery) * 100) / 100;

      const result = _orig.apply(this, arguments);

      // Fire after a tick (submitOrder has a setTimeout internally)
      setTimeout(function () {
        const orderNumEl = document.getElementById('tyOrderNum');
        const orderNum = orderNumEl ? orderNumEl.textContent : 'unknown';
        trackEvent('purchase', {
          transaction_id: orderNum,
          value: total,
          subtotal: Math.round(subtotal * 100) / 100,
          discount: Math.round(promo * 100) / 100,
          shipping: delivery,
          currency: 'BGN',
          payment_method: (typeof ckPaymentType !== 'undefined') ? ckPaymentType : 'unknown',
          item_count: cartSnapshot.reduce((s, x) => s + x.quantity, 0)
        });
        if (typeof gtag === 'function') {
          gtag('event', 'purchase', {
            transaction_id: orderNum,
            currency: 'BGN',
            value: total,
            shipping: delivery,
            coupon: (typeof promoApplied !== 'undefined' && promoApplied) ? 'MOSTCOMP10' : '',
            items: cartSnapshot
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Purchase', { value: total, currency: 'BGN', num_items: cartSnapshot.length });
        }
      }, 600);

      return result;
    };
  }

  // ── search ───────────────────────────────────────────────────────────────────
  function hookSearch() {
    const _origFull = window.doFullSearch;
    if (typeof _origFull === 'function') {
      window.doFullSearch = function () {
        const q = (document.getElementById('searchInput') || {}).value || '';
        const result = _origFull.apply(this, arguments);
        if (q.trim()) {
          // Results count available after render — approximate with DOM query
          setTimeout(function () {
            const count = document.querySelectorAll('.srp-card').length;
            trackEvent('search', {
              search_term: q.trim(),
              results_count: count
            });
            if (typeof gtag === 'function') {
              gtag('event', 'search', { search_term: q.trim() });
            }
            // Track zero-result searches separately
            if (count === 0) {
              trackEvent('search_no_results', { search_term: q.trim() });
            }
          }, 200);
        }
        return result;
      };
    }
  }

  // ── view_category ─────────────────────────────────────────────────────────────
  function hookFilterCat() {
    const _orig = window.filterCat;
    if (typeof _orig !== 'function') return;
    window.filterCat = function (cat) {
      const result = _orig.apply(this, arguments);
      const label = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] : cat;
      trackEvent('view_category', {
        category: cat,
        category_label: label
      });
      return result;
    };
  }

  // ── Init: wire up all hooks ───────────────────────────────────────────────────
  function init() {
    hookOpenProductPage();
    hookAddToCart();
    hookRemoveFromCart();
    hookToggleWishlist();
    hookToggleCart();
    hookShowCheckoutStep();
    hookApplyPromo();
    hookSubmitOrder();
    hookSearch();
    hookFilterCat();
    trackPageView();

    if (IS_DEV) {
      console.log('%c[Analytics] Initialized — hooks active', 'color:#34c759;font-weight:700');
    }
  }

  // Run after DOM + app.js are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded already fired — defer one tick so app.js globals are set
    setTimeout(init, 0);
  }

  // ── Public API ───────────────────────────────────────────────────────────────
  window.mcTrack = trackEvent;
  window.mcAnalyticsLog = function () {
    try { return JSON.parse(localStorage.getItem('mc_analytics_log') || '[]'); } catch (_) { return []; }
  };
})();

// Lazy bundle initialization — runs after app-lazy.js loads
// blogPosts (pages.js) is only available after lazy load — re-render hero panel so blog widget appears
// Calls functions deferred from main.js (cart badge was shown inline; full init runs here)
(function () {
  if (typeof renderHeroRightPanel === 'function') renderHeroRightPanel();
  if (typeof loadCart === 'function') loadCart();
  if (typeof renderRecentlyDiscounted === 'function') {
    var el = document.getElementById('recentlyDiscountedGrid');
    if (el) renderRecentlyDiscounted();
  }
  // Replay any calls that arrived before lazy bundle finished loading
  if (typeof _drainLazyQueue === 'function') _drainLazyQueue();

  // URL + modal hooks that depend on lazy-bundle functions.
  // openProductModal and closeProductModalDirect are in gallery.js (lazy), so these
  // patches must run here, not in filters.js (critical).
  if (typeof openProductModal === 'function' && !openProductModal._lazyPatched) {
    var _baseOpenProductModal = openProductModal;
    openProductModal = function(id) {
      _baseOpenProductModal(id);
      if (typeof renderRelated === 'function') renderRelated(id);
      if (typeof renderAlsoBought === 'function') renderAlsoBought(id);
      if (typeof updatePdpShipBar === 'function') updatePdpShipBar();
      if (typeof updateURL === 'function') updateURL();
      document.dispatchEvent(new CustomEvent('mc:productopen', {detail: id}));
    };
    openProductModal._lazyPatched = true;
  }

  if (typeof closeProductModalDirect === 'function' && !closeProductModalDirect._lazyPatched) {
    var _baseCloseProductModalDirect = closeProductModalDirect;
    closeProductModalDirect = function() {
      _baseCloseProductModalDirect();
      if (document.getElementById('catPage')?.classList.contains('open') ||
          document.getElementById('pdpBackdrop')?.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      }
      var params = new URLSearchParams(location.search);
      params.delete('product');
      var qs = params.toString();
      history.replaceState(null, '', qs ? (location.pathname + '?' + qs) : location.pathname);
    };
    closeProductModalDirect._lazyPatched = true;
  }
}());
