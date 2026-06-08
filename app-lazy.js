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
      imgs.push({ src, label: i === 0 ? 'РћСЃРЅРѕРІРЅР°' : `РР·РіР»РµРґ ${i + 1}` });
    }
  });

  // Always add emoji fallback as last "image"
  imgs.push({ src: null, emoji: p.emoji, label: 'РРєРѕРЅР°' });
  return imgs;
}

function renderGallery(p, idx=0) {
  galleryImages = getProductImages(p);
  galleryIdx = Math.min(idx, galleryImages.length - 1);
  const imgEl = document.getElementById('modalImg');
  const emojiEl = document.getElementById('modalEmoji');
  const thumbsEl = document.getElementById('modalThumbs');
  if (!imgEl || !emojiEl) return;
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
      galleryImages[galleryIdx] = { src:null, emoji:p.emoji, label:'РРєРѕРЅР°' };
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
  if (!imgEl) return;
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
  document.getElementById('modalRv').textContent=`${p.rating} (${p.rv} СЂРµРІСЋС‚Р°)`;
  const pe=document.getElementById('modalPrice');
  pe.innerHTML=fmtPrice(p.price, p.badge==='sale'?'sale':'');
  pe.className='modal-price'+(p.badge==='sale'?' sale':'');
  const oe=document.getElementById('modalOld'),se=document.getElementById('modalSave');
  if(p.old){oe.textContent=fmtEur(p.old)+' / '+fmtBgn(p.old);se.textContent='-'+Math.round((p.old-p.price)/p.old*100)+'%';se.style.display='';}else{oe.textContent='';se.style.display='none';}
  document.getElementById('modalMonthly').innerHTML='';
  document.getElementById('modalQty').textContent='1';
  document.getElementById('modalSpecs').innerHTML=Object.keys(p.specs||{}).slice(0,4).map(k=>`<div class="spec-chip"><div class="spec-chip-key">${_esc(k)}</div><div class="spec-chip-val">${_esc(p.specs[k])}</div></div>`).join('');
  let b='';if(p.badge==='sale')b+='<span class="badge badge-sale">РџСЂРѕРјРѕ</span>';if(p.badge==='new')b+='<span class="badge badge-new">РќРѕРІРѕ</span>';if(p.badge==='hot')b+='<span class="badge badge-hot">Р“РѕСЂРµС‰Рѕ</span>';
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
    document.title = 'Most Computers - РўРµС…РЅРёРєР° Рё Р•Р»РµРєС‚СЂРѕРЅРёРєР°';
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
  btn.innerHTML='вњ“ Р”РѕР±Р°РІРµРЅ!';btn.style.background='var(--new)';
  setTimeout(()=>{btn.innerHTML='рџ›’ Р”РѕР±Р°РІРё РІ РєРѕС€РЅРёС†Р°';btn.style.background='';},2000);
  showToast(`вњ“ ${p.name.substring(0,32)}... РґРѕР±Р°РІРµРЅ!`);
}

// COMPARE
function toggleCompare(id,checked){
  if(checked){
    const p = products.find(x=>x.id===id);
    if(compareList.length>0){
      const firstCat = products.find(x=>x.id===compareList[0])?.cat;
      if(p.cat !== firstCat){ showToast('вљ пёЏ РњРѕР¶РµС€ РґР° СЃСЂР°РІРЅСЏРІР°С€ СЃР°РјРѕ РїСЂРѕРґСѓРєС‚Рё РѕС‚ РµРґРЅР° Рё СЃСЉС‰Р° РєР°С‚РµРіРѕСЂРёСЏ!'); return; }
    }
    if(compareList.length>=3){showToast('РњР°РєСЃРёРјСѓРј 3 РїСЂРѕРґСѓРєС‚Р° Р·Р° СЃСЂР°РІРЅРµРЅРёРµ!');return;}
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
    if(i<compareList.length){const p=products.find(x=>x.id===compareList[i]);if(!p){compareList.splice(i,1);updateCompareBar();return;}html+=`<div class="compare-slot filled"><span class="compare-slot-emoji">${p.emoji}</span><span class="compare-slot-name">${p.name.length>22?p.name.slice(0,22)+'вЂ¦':p.name}</span><button type="button" class="compare-slot-remove" onclick="removeCompare(${p.id})">Г—</button></div>`;}
    else html+=`<div class="compare-slot"><span style="color:rgba(255,255,255,0.4);font-size:11px;">+ Р”РѕР±Р°РІРё РїСЂРѕРґСѓРєС‚</span></div>`;
  }
  if(preview) preview.innerHTML=html;
}

function _cmpThumb(p, size) {
  const safeImg = p.img && (typeof isSafeImgUrl === 'function' ? isSafeImgUrl(p.img) : true) ? p.img : null;
  if (!safeImg) return `<span style="font-size:${Math.round(size*0.65)}px;display:block;margin-bottom:6px;">${p.emoji||''}</span>`;
  return `<img src="${safeImg}" alt="" width="${size}" height="${size}" loading="lazy" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:6px;display:block;margin:0 auto 6px;" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="font-size:${Math.round(size*0.65)}px;display:none;margin-bottom:6px;">${p.emoji||''}</span>`;
}

function openComparePage(){
  if(compareList.length<2){showToast('РР·Р±РµСЂРё РїРѕРЅРµ 2 РїСЂРѕРґСѓРєС‚Р° Р·Р° СЃСЂР°РІРЅРµРЅРёРµ!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('РР·Р±РµСЂРё РїРѕРЅРµ 2 РЅР°Р»РёС‡РЅРё РїСЂРѕРґСѓРєС‚Р°!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs||{})))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));
  let html=`<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">`;
  html+=`<thead><tr><th scope="col" style="text-align:left;padding:12px;background:var(--bg2);border-radius:8px 0 0 0;">РџСЂРѕРґСѓРєС‚</th>`;
  prods.forEach(p=>html+=`<th scope="col" style="padding:16px;text-align:center;background:var(--bg2);border-left:1px solid var(--border);">${_cmpThumb(p,64)}<div style="font-weight:800;font-size:14px;margin-bottom:4px;">${p.name}</div><div style="font-size:18px;font-weight:900;color:var(--primary);">${fmtEur(p.price)}</div><div style="font-size:11px;color:var(--muted);">${fmtBgn(p.price)}</div><button type="button" onclick="addToCart(${p.id})" style="margin-top:10px;background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;">рџ›’ Р”РѕР±Р°РІРё</button></th>`);
  html+=`</tr></thead><tbody>`;
  html+=`<tr><th scope="row" style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Р¦РµРЅР°</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.price===minP?'background:var(--primary-light);font-weight:800;color:var(--primary);':''}">${fmtEur(p.price)}</td>`);
  html+=`</tr><tr><th scope="row" style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Р РµР№С‚РёРЅРі</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.rating===maxR?'background:var(--primary-light);font-weight:800;':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;
  allKeys.forEach(k=>{
    html+=`<tr><th scope="row" style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);color:var(--muted);font-weight:600;">${k}</th>`;
    prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);">${(p.specs||{})[k]||'-'}</td>`);
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
  if(compareList.length<2){showToast('РР·Р±РµСЂРё РїРѕРЅРµ 2 РїСЂРѕРґСѓРєС‚Р°!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('РР·Р±РµСЂРё РїРѕРЅРµ 2 РЅР°Р»РёС‡РЅРё РїСЂРѕРґСѓРєС‚Р°!');return;}
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

  let html=`<thead><tr><th scope="col">РџСЂРѕРґСѓРєС‚</th>`;
  prods.forEach(p=>html+=`<th scope="col" class="cmp-product-header"><span class="cmp-emoji">${_cmpThumb(p,60)}</span><div class="cmp-name">${_esc(p.name)}</div><div class="cmp-price">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></div><button type="button" class="cmp-add-btn" onclick="addToCart(${p.id})">рџ›’ Р”РѕР±Р°РІРё</button></th>`);
  html+=`</tr></thead><tbody>`;
  // Price row - lowest is best
  const priceDiff=_isDiff(prods.map(p=>p.price));
  html+=`<tr class="${priceDiff?'cmp-diff-row':''}"><th scope="row">Р¦РµРЅР°${priceDiff?'<span class="cmp-diff-badge">!</span>':''}</th>`;
  prods.forEach(p=>html+=`<td class="${p.price===minP?'cmp-best':''}">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></td>`);
  // Rating row
  const ratingDiff=_isDiff(prods.map(p=>p.rating));
  html+=`</tr><tr class="${ratingDiff?'cmp-diff-row':''}"><th scope="row">Р РµР№С‚РёРЅРі${ratingDiff?'<span class="cmp-diff-badge">!</span>':''}</th>`;
  prods.forEach(p=>html+=`<td class="${p.rating===maxR?'cmp-best':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;

  // Spec rows
  let diffCount=0;
  const specRows=allKeys.map(k=>{
    const vals=prods.map(p=>String((p.specs||{})[k]||'-'));
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
    tog.innerHTML=`<input type="checkbox" id="cmpDiffOnly" onchange="cmpToggleDiffOnly(this.checked)"><span>РџРѕРєР°Р¶Рё СЃР°РјРѕ СЂР°Р·Р»РёРєРёС‚Рµ</span><span class="cmp-diff-count">(${diffCount} СЂР°Р·Р»РёРєРё)</span>`;
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
  if(!ok){showToast('РџРѕРїСЉР»РЅРё РІСЃРёС‡РєРё Р·Р°РґСЉР»Р¶РёС‚РµР»РЅРё РїРѕР»РµС‚Р°!');return;}
  document.getElementById('qoFormWrap').style.display='none';
  document.getElementById('qoSuccess').classList.add('show');
  showToast('РџРѕСЂСЉС‡РєР°С‚Р° Рµ РёР·РїСЂР°С‚РµРЅР° СѓСЃРїРµС€РЅРѕ!');
  setTimeout(closeQuickOrderDirect,4000);
}

// SLIDER
let currentSlide=0;
const slides=document.querySelectorAll('.slide'),dots=document.querySelectorAll('.dot');
function goSlide(n){if(!slides.length||!slides[n])return;slides[currentSlide].classList.remove('active');dots[currentSlide].classList.remove('active');dots[currentSlide].removeAttribute('aria-current');currentSlide=n;slides[currentSlide].classList.add('active');dots[currentSlide].classList.add('active');dots[currentSlide].setAttribute('aria-current','true');}
let _heroSliderIv=null;
if(slides.length){if(_heroSliderIv)clearInterval(_heroSliderIv);_heroSliderIv=setInterval(()=>goSlide((currentSlide+1)%slides.length),5000);}

// SALE SLIDE COUNTDOWN - counts down to end of day
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
    el.innerHTML = `вЏ± РћС„РµСЂС‚Р°С‚Р° РёР·С‚РёС‡Р° СЃР»РµРґ <b>${h}:${m}:${s}</b>`;
  }
  update();
  setInterval(update, 1000);
})();

// COUNTDOWN - persistent across page reloads via localStorage
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
  const email = prompt('Р’СЉРІРµРґРё РёРјРµР№Р» - С‰Рµ С‚Рµ СѓРІРµРґРѕРјРёРј РєРѕРіР°С‚Рѕ "' + p.name.substring(0, 40) + '" Рµ РЅР° СЃРєР»Р°Рґ:');
  if (!email || !email.includes('@')) return;
  try {
    const notifs = JSON.parse(localStorage.getItem('mc_oos_notify') || '[]');
    if (!notifs.find(n => n.id === id && n.email === email)) {
      notifs.push({ id: id, email: email, name: p.name, ts: Date.now() });
      localStorage.setItem('mc_oos_notify', JSON.stringify(notifs));
    }
  } catch(e) {}
  showToast('рџ”” Р©Рµ С‚Рµ СѓРІРµРґРѕРјРёРј РЅР° ' + email + ' РїСЂРё РЅР°Р»РёС‡РЅРѕСЃС‚!');
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
  if (btn) { btn.classList.add('added'); btn.innerHTML = 'вњ“ Р”РѕР±Р°РІРµРЅ'; btn.disabled = true; setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Р”РѕР±Р°РІРё РІ РєРѕС€РЅРёС†Р°'; btn.disabled = false; }, 1200); }
  (function showCartToast(prod) {
    var ct = document.getElementById('cartToast');
    if (!ct) { showToast('вњ“ ' + prod.name.substring(0, 32) + 'вЂ¦ РґРѕР±Р°РІРµРЅ!'); return; }
    document.getElementById('cartToastEmoji').textContent = prod.emoji || 'рџ›’';
    document.getElementById('cartToastMsg').textContent = prod.name.substring(0, 36) + (prod.name.length > 36 ? 'вЂ¦' : '') + ' РґРѕР±Р°РІРµРЅ!';
    var total = cart.reduce(function(s,x){return s+x.price*x.qty;},0);
    var fill = document.getElementById('cartToastShipFill');
    var label = document.getElementById('cartToastShipLabel');
    var wrap = document.getElementById('cartToastShipWrap');
    if (fill && label && wrap) {
      if (total >= FREE_SHIP_BGN) {
        fill.style.width = '100%';
        label.textContent = 'рџЋ‰ Р‘РµР·РїР»Р°С‚РЅР° РґРѕСЃС‚Р°РІРєР°!';
        wrap.style.display = 'block';
      } else {
        var pct = Math.min(100, Math.round(total / FREE_SHIP_BGN * 100));
        var remaining = (FREE_SHIP_BGN - total).toFixed(2).replace('.',',');
        fill.style.width = pct + '%';
        label.textContent = 'РћС‰Рµ ' + remaining + ' Р»РІ. РґРѕ Р±РµР·РїР»Р°С‚РЅР° РґРѕСЃС‚Р°РІРєР°';
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
    <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px;">РљР»РёРµРЅС‚РёС‚Рµ РєСѓРїСѓРІР°С‚ РёвЂ¦</div>
    ${recs.map(r => `
      <div onclick="openProductPage(${r.id})" style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer;">
        <div style="min-width:34px;text-align:center;">${_prodThumb(r, 34)}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name.length > 32 ? r.name.substring(0, 32) + 'вЂ¦' : r.name}</div>
          <div style="font-size:12px;color:var(--primary);font-weight:700;">${fmtEur(r.price)}</div>
        </div>
        <button type="button" onclick="event.stopPropagation();addToCart(${r.id})" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;cursor:pointer;white-space:nowrap;font-family:'Outfit',sans-serif;font-weight:700;">+</button>
      </div>`).join('')}
    <button type="button" onclick="document.getElementById('recPanel').remove()" style="width:100%;margin-top:8px;background:none;border:none;color:var(--muted);font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;padding:4px;">Р—Р°С‚РІРѕСЂРё Г—</button>`;
  document.body.appendChild(panel);
  requestAnimationFrame(() => { panel.style.opacity = '1'; panel.style.transform = 'translateY(0)'; });
  panel._t = setTimeout(() => { panel.style.opacity = '0'; setTimeout(() => panel.remove(), 280); }, 8000);
}
function addToCartById(id) { addToCart(id); }
const _sc_fs = (()=>{ try{return JSON.parse(localStorage.getItem('mc_store_config')||'{}');}catch(e){return {};} })();
const FREE_SHIP_BGN = Math.round((_sc_fs.freeShipEur||100) * EUR_RATE * 100) / 100;

// Social proof - shown only when real order count exists
(function initCartSocialProof() {
  const sp = document.getElementById('cartSocialProof');
  const txt = document.getElementById('cartSpText');
  if (!sp || !txt) return;
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) {}
  if (orders.length > 0) {
    txt.textContent = `Р’РёРµ РёРјР°С‚Рµ ${orders.length} ${orders.length === 1 ? 'РїРѕСЂСЉС‡РєР°' : 'РїРѕСЂСЉС‡РєРё'} РїСЂРё РЅР°СЃ`;
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
  // sync bottom nav badges (two nav bars exist - update all)
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
    body.innerHTML = '<div class="cart-empty-msg"><div class="ce-icon"><svg width="44" height="44" class="svg-ic" aria-hidden="true" style="opacity:.25"><use href="#ic-cart"/></svg></div><p>РљРѕС€РЅРёС†Р°С‚Р° Рµ РїСЂР°Р·РЅР°.</p><button type="button" class="ce-cta-btn" onclick="closeCart();filterCatScroll(\'all\')">Р Р°Р·РіР»РµРґР°Р№ РїСЂРѕРґСѓРєС‚РёС‚Рµ в†’</button></div>';
    // Return focus to cart icon button when cart becomes empty and panel is open
    const panel = document.getElementById('cartPanel');
    if (panel && panel.classList.contains('open')) { const cartBtn = document.querySelector('[onclick*="toggleCart"]') || document.querySelector('#cartIcon'); if (cartBtn) cartBtn.focus(); }
    return;
  }
  let html = cart.map(x => {
    const name = escHtml(x.name || '');
    const shortName = x.name && x.name.length > 38 ? escHtml(x.name.substring(0, 38)) + 'вЂ¦' : name;
    const unitPrice = x.qty > 1 ? `<span class="ci-unit">${fmtEur(x.price)} / Р±СЂ.</span>` : '';
    return `<div class="cart-item-row">
      <button type="button" class="ci-emoji-btn" onclick="openProductPage(${x.id})" title="Р’РёР¶ РїСЂРѕРґСѓРєС‚Р°">${_prodThumb(x, 44)}</button>
      <div class="ci-details">
        <div class="ci-top-row">
          <button type="button" class="ci-name-btn" onclick="openProductPage(${x.id})" title="Р’РёР¶ РїСЂРѕРґСѓРєС‚Р°">${shortName}</button>
          <button type="button" class="ci-remove" onclick="removeFromCart(${x.id})" aria-label="РџСЂРµРјР°С…РЅРё">Г—</button>
        </div>
        <div class="ci-bottom-row">
          <div class="ci-qty"><button type="button" class="qty-btn" onclick="changeQty(${x.id},-1)">в€’</button><span class="qty-num">${x.qty}</span><button type="button" class="qty-btn" onclick="changeQty(${x.id},1)">+</button></div>
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
    html += `<div class="cart-ship-bar"><div class="cart-ship-msg ship-free">рџЋ‰ РРјР°С€ Р±РµР·РїР»Р°С‚РЅР° РґРѕСЃС‚Р°РІРєР°!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="transform:scaleX(1)"></div></div></div>`;
    if (deliveryRow) deliveryRow.style.display = 'none';
  } else {
    const remEur = ((FREE_SHIP_BGN - total) / EUR_RATE).toFixed(2);
    html += `<div class="cart-ship-bar"><div class="cart-ship-msg">Р”РѕР±Р°РІРё РѕС‰Рµ <strong>${remEur} в‚¬</strong> Р·Р° Р±РµР·РїР»Р°С‚РЅР° РґРѕСЃС‚Р°РІРєР°!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="transform:scaleX(${(pct / 100).toFixed(3)})"></div></div></div>`;
    if (deliveryRow) deliveryRow.style.display = 'flex';
    if (deliveryVal) deliveryVal.textContent = (5.99 / EUR_RATE).toFixed(2) + ' в‚¬';
  }
  // Recently viewed not in cart
  try {
    const rvIds = JSON.parse(localStorage.getItem('mc_rv') || '[]');
    const inCart = new Set(cart.map(x => x.id));
    const rvItems = rvIds.map(id => products.find(p => p.id === id)).filter(p => p && !inCart.has(p.id)).slice(0, 3);
    if (rvItems.length) {
      html += `<div class="cart-rv-section"><div class="cart-rv-title">Р—Р°Р±СЂР°РІРё Р»Рё РЅРµС‰Рѕ?</div><div class="cart-rv-list">${rvItems.map(p => `<div class="cart-rv-item"><button type="button" class="cart-rv-link" onclick="openProductPage(${p.id})" title="Р’РёР¶ РїСЂРѕРґСѓРєС‚Р°"><div class="cart-rv-emoji">${_prodThumb(p, 36)}</div><div class="cart-rv-info"><div class="cart-rv-name">${escHtml(p.name.length > 28 ? p.name.substring(0, 28) + 'вЂ¦' : p.name)}</div><div class="cart-rv-price">${fmtEur(p.price)}</div></div></button><button type="button" class="cart-rv-add" onclick="addToCart(${p.id})" title="Р”РѕР±Р°РІРё">+</button></div>`).join('')}</div></div>`;
    }
  } catch (e) { }
  body.innerHTML = html;
  // Update checkout button with total amount
  const ckBtn = document.querySelector('.checkout-btn');
  if (ckBtn) ckBtn.innerHTML = 'рџ”’ Р—Р°РІСЉСЂС€Рё РїРѕСЂСЉС‡РєР°С‚Р° В· ' + fmtEur(total) + ' в†’';
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
  _rSpan.textContent = removed.name.substring(0, 28) + 'вЂ¦ РїСЂРµРјР°С…РЅР°С‚. ';
  const _rBtn = document.createElement('button');
  _rBtn.type = 'button'; _rBtn.onclick = undoRemoveCart;
  _rBtn.style.cssText = 'margin-left:8px;background:rgba(255,255,255,0.25);border:none;border-radius:5px;padding:2px 8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;color:#fff;';
  _rBtn.textContent = 'РћС‚РјСЏРЅР°';
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
  showToast('вњ“ ' + item.name.substring(0, 28) + 'вЂ¦ РІСЉСЂРЅР°С‚ РІ РєРѕС€РЅРёС†Р°С‚Р°');
}
function toggleCart() { const co=document.getElementById('cartOverlay'),cp=document.getElementById('cartPanel'); if(co)co.classList.toggle('open'); if(cp)cp.classList.toggle('open'); }
// ===== CHECKOUT & THANK YOU =====
let ckDeliveryIdx = 0;
let ckDeliveryCosts = (()=>{ try{const sc=JSON.parse(localStorage.getItem('mc_store_config')||'{}');return sc.deliveryCosts||[5.99,4.99,0];}catch(e){return [5.99,4.99,0];} })();
let ckDeliveryNames = ['Р•РєРѕРЅС‚', 'Speedy', 'Р’Р·РµРјРё РѕС‚ РјР°РіР°Р·РёРЅ'];
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
  if (cart.length === 0) { showToast('Р”РѕР±Р°РІРё РїСЂРѕРґСѓРєС‚Рё РІ РєРѕС€РЅРёС†Р°С‚Р°!'); return; }
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
  const d0 = document.getElementById('delivDate0'); if (d0) d0.textContent = 'В· РґРѕ ' + fmt(workDay(now, 2));
  const d1 = document.getElementById('delivDate1'); if (d1) d1.textContent = 'В· РґРѕ ' + fmt(workDay(now, 3));
  const d2 = document.getElementById('delivDate2'); if (d2) d2.textContent = 'В· РіРѕС‚РѕРІРѕ РґРЅРµСЃ';
}

let _ckUpsellTimer = null;
let _ckUpsellPool = [];

function _cuItemHtml(p) {
  const inCart = cart.find(x => x.id === p.id);
  const qty = inCart ? inCart.qty : 0;
  const qtyCtrl = qty > 0
    ? `<div class="cu-qty"><button type="button" class="cu-qty-btn" onclick="cuChangeQty(${p.id},-1)">в€’</button><span class="cu-qty-num">${qty}</span><button type="button" class="cu-qty-btn" onclick="cuChangeQty(${p.id},1)">+</button></div>`
    : `<button type="button" class="cu-add" onclick="cuChangeQty(${p.id},1)" title="Р”РѕР±Р°РІРё РІ РєРѕС€РЅРёС†Р°С‚Р°">+</button>`;
  return `<div class="cu-item" id="cu-item-${p.id}">
    <button type="button" class="cu-link" onclick="openProductPage(${p.id})" title="Р’РёР¶ РїСЂРѕРґСѓРєС‚Р°">
      <div class="cu-emoji">${escHtml(p.emoji || '')}</div>
      <div class="cu-info">
        <div class="cu-name">${escHtml(p.name.length > 32 ? p.name.substring(0, 32) + 'вЂ¦' : p.name)}</div>
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
    ? `<div class="cu-qty"><button type="button" class="cu-qty-btn" onclick="cuChangeQty(${id},-1)">в€’</button><span class="cu-qty-num">${qty}</span><button type="button" class="cu-qty-btn" onclick="cuChangeQty(${id},1)">+</button></div>`
    : `<button type="button" class="cu-add" onclick="cuChangeQty(${id},1)" title="Р”РѕР±Р°РІРё РІ РєРѕС€РЅРёС†Р°С‚Р°">+</button>`;
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
      el.innerHTML = `<div class="cart-upsell-title">вљЎ РњРѕР¶Рµ РґР° С‚Рµ Р·Р°РёРЅС‚РµСЂРµСЃСѓРІР°</div><div class="cart-upsell-items" style="transition:opacity .3s">${pair.map(p => _cuItemHtml(p)).join('')}</div>`;
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
  const codFee = ckPaymentType === 'cod' ? ((()=>{ try{return JSON.parse(localStorage.getItem('mc_store_config')||'{}').codFee||1.50;}catch(e){return 1.50;} })()) : 0;
  const promoDisc = promoApplied ? subtotal * ((promoDiscountPct || 10) / 100) : 0;
  const total = subtotal + delivery + codFee - promoDisc;

  document.getElementById('osSummaryItems').innerHTML = cart.map(x => `
    <div class="os-item">
      <div class="os-emoji">${escHtml(x.emoji || '')}</div>
      <div class="os-item-info">
        <div class="os-item-name">${escHtml(x.name || '')}</div>
        <div class="os-qty-ctrl">
          <button type="button" class="os-qty-btn" onclick="osChangeQty(${x.id},-1)">в€’</button>
          <span class="os-qty-num">${x.qty}</span>
          <button type="button" class="os-qty-btn" onclick="osChangeQty(${x.id},1)">+</button>
        </div>
      </div>
      <div class="os-item-price">${fmtEur(x.price * x.qty)}<span class="text-10-muted-block">${fmtBgn(x.price * x.qty)}</span></div>
    </div>`).join('');

  document.getElementById('osSubtotal').textContent = fmtEur(subtotal) + ' / ' + fmtBgn(subtotal);
  document.getElementById('osDelivery').textContent = delivery === 0 ? 'Р‘РµР·РїР»Р°С‚РЅРѕ' : fmtEur(delivery) + ' / ' + fmtBgn(delivery);
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
  'Р•РєРѕРЅС‚ - РєРІ. Р›РѕР·РµРЅРµС†, СѓР». РЎРІРµС‚Рё РќР°СѓРј 52',
  'Р•РєРѕРЅС‚ - СѓР». Р“. РЎ. Р Р°РєРѕРІСЃРєРё 147, РЎРѕС„РёСЏ',
  'Р•РєРѕРЅС‚ - Р±СѓР». Р’РёС‚РѕС€Р° 100, РЎРѕС„РёСЏ',
  'Р•РєРѕРЅС‚ - Р¶.Рє. Р›СЋР»РёРЅ 6, Р±Р». 606, РЎРѕС„РёСЏ',
  'Р•РєРѕРЅС‚ - Р¶.Рє. РњР»Р°РґРѕСЃС‚ 1, Р±Р». 52Р‘, РЎРѕС„РёСЏ',
  'Р•РєРѕРЅС‚ - Р¶.Рє. РќР°РґРµР¶РґР° 4, Р±Р». 421, РЎРѕС„РёСЏ',
  'Р•РєРѕРЅС‚ - СѓР». Р”РѕР№СЂР°РЅ 3, РџР»РѕРІРґРёРІ',
  'Р•РєРѕРЅС‚ - Р±СѓР». Р¦Р°СЂ РћСЃРІРѕР±РѕРґРёС‚РµР» 5, Р’Р°СЂРЅР°',
  'Р•РєРѕРЅС‚ - СѓР». РђР». РЎС‚Р°РјР±РѕР»РёР№СЃРєРё 6, Р‘СѓСЂРіР°СЃ',
  'Р•РєРѕРЅС‚ - СѓР». Р¦Р°СЂ РћСЃРІРѕР±РѕРґРёС‚РµР» 10, РЎС‚Р°СЂР° Р—Р°РіРѕСЂР°',
  'Р•РєРѕРЅС‚ - СѓР». Р”СѓРЅР°РІ 5, Р СѓСЃРµ',
  'Р•РєРѕРЅС‚ - Р±СѓР». Р‘СЉР»РіР°СЂРёСЏ 23, РџР»РµРІРµРЅ',
  'Р•РєРѕРЅС‚ - СѓР». Р®СЂРёР№ Р“Р°РіР°СЂРёРЅ 1, Р‘Р»Р°РіРѕРµРІРіСЂР°Рґ',
  'Р•РєРѕРЅС‚ - СѓР». РљР»РёРјРµРЅС‚ РћС…СЂРёРґСЃРєРё 9, Р’РµР»РёРєРѕ РўСЉСЂРЅРѕРІРѕ'
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
    if (match.expiresAt && Date.now() > match.expiresAt) {
      showToast('РџСЂРѕРјРѕ РєРѕРґСЉС‚ Рµ РёР·С‚РµРєСЉР»!');
      if (inputEl) { inputEl.classList.add('error'); setTimeout(() => inputEl.classList.remove('error'), 1500); }
      return;
    }
    if (match.maxUses && (match.uses || 0) >= match.maxUses) {
      showToast('РџСЂРѕРјРѕ РєРѕРґСЉС‚ Рµ РёР·С‡РµСЂРїР°РЅ!');
      if (inputEl) { inputEl.classList.add('error'); setTimeout(() => inputEl.classList.remove('error'), 1500); }
      return;
    }
    if (match.minOrderEur) {
      const curSubtotalEur = (() => { try { let s=0; cart.forEach(ci=>{const p=products.find(x=>x.id===ci.id); if(p) s+=((p.price||0)/EUR_RATE)*ci.qty;}); return s; } catch(e){return 0;} })();
      if (curSubtotalEur < match.minOrderEur) {
        showToast(`РњРёРЅРёРјР°Р»РЅР° РїРѕСЂСЉС‡РєР° ${match.minOrderEur} в‚¬ Р·Р° С‚РѕР·Рё РєРѕРґ!`);
        if (inputEl) { inputEl.classList.add('error'); setTimeout(() => inputEl.classList.remove('error'), 1500); }
        return;
      }
    }
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
    showToast(`вњ“ РџСЂРѕРјРѕ РєРѕРґ РїСЂРёР»РѕР¶РµРЅ - -${promoDiscountPct}%!`);
  } else {
    showToast('РќРµРІР°Р»РёРґРµРЅ РїСЂРѕРјРѕ РєРѕРґ!');
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
    if (!valid) showToast('вљ пёЏ РџРѕРїСЉР»РЅРё РІСЃРёС‡РєРё Р·Р°РґСЉР»Р¶РёС‚РµР»РЅРё РїРѕР»РµС‚Р°!');
    return valid;
  }
  if (step === 2) {
    let valid = true;
    if (ckDeliveryIdx === 2) return true; // pickup - no address needed
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
    if (!valid) showToast('вљ пёЏ РџРѕРїСЉР»РЅРё Р°РґСЂРµСЃР° Р·Р° РґРѕСЃС‚Р°РІРєР°!');
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
    _ckSetError(el, 'РџРѕР»РµС‚Рѕ Рµ Р·Р°РґСЉР»Р¶РёС‚РµР»РЅРѕ.');
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
  _ckSetError(el, ok ? '' : 'Р’СЉРІРµРґРё РІР°Р»РёРґРµРЅ РёРјРµР№Р» Р°РґСЂРµСЃ.');
}

// BG phone: 08xx, 09xx, +359 8xx, 00359 8xx - at least 10 digits
function ckValidatePhone(el) {
  const raw = el.value.replace(/[\s\-().]/g, '');
  const ok = /^(\+359|00359|0)[89]\d{8}$/.test(raw) || /^[1-9]\d{9,}$/.test(raw);
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', ok);
  el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  _ckSetError(el, ok ? '' : 'Р’СЉРІРµРґРё РІР°Р»РёРґРµРЅ С‚РµР»РµС„РѕРЅ (РЅР°РїСЂ. 0888 123 456).');
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
      if (num) num.textContent = 'вњ“';
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
  // Validate required fields - skip city/address for pickup (ckDeliveryIdx === 2)
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
  if (!valid) { showToast('РњРѕР»СЏ РїРѕРїСЉР»РЅРё РІСЃРёС‡РєРё Р·Р°РґСЉР»Р¶РёС‚РµР»РЅРё РїРѕР»РµС‚Р°!'); return; }

  // Loading state
  const submitBtn = document.querySelector('.os-submit');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span class="ck-spinner"></span> РћР±СЂР°Р±РѕС‚РІР° СЃРµвЂ¦'; }

  // Animate steps
  updateCheckoutSteps(2);
  setTimeout(() => updateCheckoutSteps(3), 400);
  setTimeout(() => {
    // Build order data - sequential number based on existing order count
    let _prevOrders = [];
    try { _prevOrders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) { }
    const orderNum = 'MC-' + String(_prevOrders.length + 1).padStart(6, '0');
    const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const delivery = ckDeliveryCosts[ckDeliveryIdx];
    const codFee = ckPaymentType === 'cod' ? ((()=>{ try{return JSON.parse(localStorage.getItem('mc_store_config')||'{}').codFee||1.50;}catch(e){return 1.50;} })()) : 0;
    const promoDisc = promoApplied ? subtotal * ((promoDiscountPct || 10) / 100) : 0;
    const total = subtotal + delivery + codFee - promoDisc;
    const payNames = { card: 'РљР°СЂС‚Р°', cod: 'РќР°Р»РѕР¶РµРЅ РїР»Р°С‚РµР¶', bank: 'Р‘Р°РЅРєРѕРІ РїСЂРµРІРѕРґ' };
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
    _set('tyDeliveryDate', ckDeliveryIdx === 2 ? 'РџСЂРё РІР·РµРјР°РЅРµ РѕС‚ РјР°РіР°Р·РёРЅ' : fmt(delivDate));
    _set('tyPayment', payNames[ckPaymentType]);
    _set('tyName', document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value);
    _set('tyPhone', document.getElementById('ckPhone').value);
    const _isPickup = ckDeliveryIdx === 2;
    const _econtOffice = (document.getElementById('ckEcontOffice') || {}).value || '';
    _set('tyCity', _isPickup ? 'РЎРѕС„РёСЏ (РјР°РіР°Р·РёРЅ)' : document.getElementById('ckCity').value);
    _set('tyAddr', _isPickup ? 'Р±СѓР». вЂћРЁРёРїС‡РµРЅСЃРєРё РїСЂРѕС…РѕРґ" Р±Р».240' : (_econtOffice ? 'РћС„РёСЃ: ' + _econtOffice + ', ' : '') + document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''));
    _set('tyCourier', ckDeliveryNames[ckDeliveryIdx]);
    _set('tyNote', document.getElementById('ckNote').value || '-');
    _set('tyTimestamp', now.toLocaleString('bg-BG'));
    _set('tyDeliveryDateLine', ckDeliveryIdx === 2 ? 'Р“РѕС‚РѕРІР° Р·Р° РІР·РµРјР°РЅРµ' : 'РћС‡Р°РєРІР°РЅР°: ' + fmt(delivDate));
    _set('tySubtotal', fmtEur(subtotal) + ' / ' + fmtBgn(subtotal));
    _set('tyDeliveryCost', delivery === 0 ? 'Р‘РµР·РїР»Р°С‚РЅРѕ' : fmtEur(delivery) + ' / ' + fmtBgn(delivery));
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
          <div class="ty-item-meta">${escHtml(x.brand || '')} В· РљРѕР»РёС‡РµСЃС‚РІРѕ: ${Number(x.qty) || 0}</div>
        </div>
        <div class="ty-item-price">${fmtEur(x.price * x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price * x.qty)}</span></div>
      </div>`).join(''));

    // Save order to localStorage
    const orderData = {
      num: orderNum,
      customer: document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value,
      email: document.getElementById('ckEmail').value,
      phone: document.getElementById('ckPhone').value,
      city: _isPickup ? 'РЎРѕС„РёСЏ (РјР°РіР°Р·РёРЅ)' : document.getElementById('ckCity').value,
      addr: _isPickup ? 'Р±СѓР». вЂћРЁРёРїС‡РµРЅСЃРєРё РїСЂРѕС…РѕРґ" Р±Р».240' : (_econtOffice ? 'РћС„РёСЃ: ' + _econtOffice + ', ' : '') + document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''),
      note: document.getElementById('ckNote').value || '',
      items: cart.map(x => x.name + ' Г—' + x.qty).join(', '),
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
    // Р—Р°РїРёСЃРІР°РЅРµ РІ Supabase (СЂРµР°Р»РЅР° Р±Р°Р·Р° РґР°РЅРЅРё)
    if (typeof saveOrderToSupabase === 'function') {
      saveOrderToSupabase(orderData).catch(e => console.error('Supabase save failed:', e));
    }
    // РР·С‡РёСЃС‚Рё abandoned cart Р·Р°РїРёСЃР° СЃР»РµРґ СѓСЃРїРµС€РЅР° РїРѕСЂСЉС‡РєР°
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
  // Delegates to printOrder() - correct company data + brand-based auto-detection
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) { }
  const o = num ? orders.find(x => x.num === num) : orders[0];
  if (!o) { showToast('вљ пёЏ РќСЏРјР° РґР°РЅРЅРё Р·Р° РїРѕСЂСЉС‡РєР°С‚Р°'); return; }
  if (typeof printOrder === 'function') { printOrder(o.num); return; }

  const _sc = JSON.parse(localStorage.getItem('mc_store_config') || '{}');
  const _co = (window._INVOICE_COMPANIES && window._INVOICE_COMPANIES[0]) || {
    name: _sc.companyName || 'Most Computers Р•РћРћР”',
    eik:  _sc.companyEik  || '',
    dds:  _sc.companyDds  || '',
    addr: _sc.companyAddr || 'Р±СѓР». РЁРёРїС‡РµРЅСЃРєРё РїСЂРѕС…РѕРґ Р±Р».240, 1111 РЎРѕС„РёСЏ',
    tel:  _sc.companyTel  || '+359 2 919 1823',
    bank: _sc.companyBank || '', iban: _sc.companyIban || '', bic: _sc.companyBic  || '',
  };

  const subtotalNoVat = o.subtotal / 1.2;
  const vatAmt = (o.subtotal - subtotalNoVat).toFixed(2);
  const invNum = 'Р¤Рљ-' + o.num.replace('MC-', '');
  const date = new Date(o.ts || Date.now()).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const payLabel = o.payment === 'card' ? 'Р‘Р°РЅРєРѕРІР° РєР°СЂС‚Р°' : o.payment === 'cod' ? 'РќР°Р»РѕР¶РµРЅ РїР»Р°С‚РµР¶' : 'Р‘Р°РЅРєРѕРІ РїСЂРµРІРѕРґ';
  const delivLabel = o.delivery === 0 ? 'Р‘РµР·РїР»Р°С‚РЅР°' : (Number(o.delivery) / EUR_RATE).toFixed(2) + ' в‚¬';

  const rows = (o.itemsData || []).map((x, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escHtml(x.name||'')}</td>
      <td style="text-align:center">${x.qty}</td>
      <td style="text-align:right">${toEur(x.price / 1.2).toFixed(2)} в‚¬</td>
      <td style="text-align:right">20%</td>
      <td style="text-align:right">${toEur(x.price * x.qty).toFixed(2)} в‚¬</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="UTF-8">
<title>Р¤Р°РєС‚СѓСЂР° ${invNum} - Most Computers</title>
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
      ${_co.name} &nbsp;|&nbsp; Р•РРљ: ${_co.eik || '-'}<br>
      ${_co.dds ? 'Р”Р”РЎ в„–: ' + _co.dds + '<br>' : ''}
      ${_co.addr}<br>
      С‚РµР».: ${_co.tel} &nbsp;|&nbsp; office@mostcomputers.bg
    </div>
  </div>
  <div class="hdr-right">
    <h1>Р¤РђРљРўРЈР Рђ</h1>
    <div class="meta">
      в„– ${invNum}<br>
      Р”Р°С‚Р°: ${date}<br>
      РџРѕСЂСЉС‡РєР°: ${o.num}
    </div>
  </div>
</div>

<div class="parties">
  <div class="party">
    <div class="party-lbl">РџСЂРѕРґР°РІР°С‡</div>
    <div class="party-val">
      <strong>${_co.name}</strong><br>
      ${_co.eik ? 'Р•РРљ: ' + _co.eik + '<br>' : ''}
      ${_co.dds ? 'Р”Р”РЎ в„–: ' + _co.dds + '<br>' : ''}
      ${_co.addr}
    </div>
  </div>
  <div class="party">
    <div class="party-lbl">${o.b2b ? 'РљСѓРїСѓРІР°С‡ (С„РёСЂРјР°)' : 'РљР»РёРµРЅС‚ / РџРѕР»СѓС‡Р°С‚РµР»'}</div>
    <div class="party-val">
      ${o.b2b ? `<strong>${escHtml(o.b2b.firma || '-')}</strong><br>Р•РРљ: ${escHtml(o.b2b.eik || '-')}<br>${o.b2b.vat ? 'Р”Р”РЎ в„–: ' + escHtml(o.b2b.vat) + '<br>' : ''}${o.b2b.mol ? 'РњРћР›: ' + escHtml(o.b2b.mol) + '<br>' : ''}` : `<strong>${escHtml(o.customer || '-')}</strong><br>`}
      ${o.addr ? escHtml(o.addr) + '<br>' : ''}
      ${escHtml(o.city || '')}<br>
      С‚РµР».: ${escHtml(o.phone || '-')}
    </div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th style="width:28px">в„–</th>
      <th>РћРїРёСЃР°РЅРёРµ РЅР° СЃС‚РѕРєР°С‚Р° / СѓСЃР»СѓРіР°С‚Р°</th>
      <th style="width:42px;text-align:center">Р‘СЂ.</th>
      <th style="width:110px;text-align:right">Р•Рґ.С†РµРЅР° Р±РµР· Р”Р”РЎ</th>
      <th style="width:60px;text-align:right">Р”Р”РЎ %</th>
      <th style="width:110px;text-align:right">РЎСѓРјР° СЃ Р”Р”РЎ</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
    <tr>
      <td colspan="5" style="text-align:right;font-size:11px;color:#555">Р”РѕСЃС‚Р°РІРєР° (${o.deliveryType || 'РљСѓСЂРёРµСЂ'})</td>
      <td style="text-align:right">${delivLabel}</td>
    </tr>
  </tbody>
</table>

<div class="totals-wrap">
  <div class="totals">
    <div class="tot-row"><span>Р”Р°РЅСЉС‡РЅР° РѕСЃРЅРѕРІР° (Р±РµР· Р”Р”РЎ):</span><span>${(Number(subtotalNoVat)/EUR_RATE).toFixed(2)} в‚¬</span></div>
    <div class="tot-row vat"><span>Р”Р”РЎ 20%:</span><span>${(Number(vatAmt)/EUR_RATE).toFixed(2)} в‚¬</span></div>
    <div class="tot-row"><span>Р”РѕСЃС‚Р°РІРєР°:</span><span>${delivLabel}</span></div>
    <div class="tot-row final"><span>РћР‘Р©Рћ Р”РЄР›Р–РРњРћ:</span><span>${(Number(o.total)/EUR_RATE).toFixed(2)} в‚¬</span></div>
  </div>
</div>

<div class="payment-info">
  вњ… РќР°С‡РёРЅ РЅР° РїР»Р°С‰Р°РЅРµ: <strong>${payLabel}</strong>
  ${o.payment === 'bank' && _co.iban ? ` &nbsp;|&nbsp; IBAN: ${_co.iban}  BIC: ${_co.bic}  ${_co.bank}` : ''}
  &nbsp;|&nbsp; РџР»Р°С‰Р°РЅРµС‚Рѕ Рµ РёР·РІСЉСЂС€РµРЅРѕ.
</div>

<div class="legal">
  Р¤Р°РєС‚СѓСЂР°С‚Р° Рµ РёР·РґР°РґРµРЅР° РЅР° ${date} РѕС‚ ${_co.name} - СЂРµРіРёСЃС‚СЂРёСЂР°РЅРѕ РїРѕ Р—Р”Р”РЎ Р»РёС†Рµ.<br>
  Р’Р°Р»РёРґРЅР° Рµ Р±РµР· РїРѕРґРїРёСЃ Рё РїРµС‡Р°С‚ РїРѕ С‡Р». 6, Р°Р». 1 РѕС‚ РќР°СЂРµРґР±Р° в„– Рќ-18 / 13.12.2006 Рі.
</div>

</body>
</html>`;

  const w = window.open('', '_blank', 'width=860,height=950,scrollbars=yes');
  if (!w) { showToast('вљ пёЏ Р Р°Р·СЂРµС€Рё pop-up РїСЂРѕР·РѕСЂС†РёС‚Рµ РІ Р±СЂР°СѓР·СЉСЂР°'); return; }
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
  if (countEl) countEl.textContent = count + ' Р±СЂ.';

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
      ? `<span class="cp-badge cp-badge-sale">РџСЂРѕРјРѕ -${save}%</span>`
      : x.badge === 'new' ? `<span class="cp-badge cp-badge-new">РќРѕРІРѕ</span>`
        : x.badge === 'hot' ? `<span class="cp-badge cp-badge-hot">Р“РѕСЂРµС‰Рѕ</span>` : '';

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
          <button type="button" class="cp-qty-btn" onclick="cpChangeQty(${x.id},-1)">в€’</button>
          <span class="cp-qty-val">${x.qty}</span>
          <button type="button" class="cp-qty-btn" onclick="cpChangeQty(${x.id},1)">+</button>
        </div>
        <button type="button" class="cp-remove-btn" onclick="cpRemoveItem(${x.id})" title="РџСЂРµРјР°С…РЅРё">Г—</button>
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
    el.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px 0;font-size:13px;">Р”РѕР±Р°РІРё РїСЂРѕРґСѓРєС‚Рё РІ РєРѕС€РЅРёС†Р°С‚Р°</div>';
    return;
  }

  el.innerHTML = `
    <div class="cp-sum-row"><span>РџСЂРѕРґСѓРєС‚Рё (${cart.reduce((s, x) => s + x.qty, 0)} Р±СЂ.)</span><span>${fmtEur(subtotal)}<small>${fmtBgn(subtotal)}</small></span></div>
    ${savings > 0 ? `<div class="cp-sum-row cp-sum-save"><span>вњ“ РЎРїРµСЃС‚СЏРІР°С€</span><span>в€’${fmtEur(savings)}</span></div>` : ''}
    <div class="cp-sum-row"><span>Р”РѕСЃС‚Р°РІРєР°</span><span>${delivery === 0 ? '<b style="color:var(--accent2)">Р‘РµР·РїР»Р°С‚РЅР°</b>' : fmtEur(delivery)}</span></div>
    <div class="cp-sum-row"><span>Р”Р”РЎ (РІРєР».)</span><span>${fmtEur(total * 0.2)}</span></div>
    <hr class="cp-sum-divider">
    <div class="cp-sum-row cp-sum-total"><span>РћР±С‰Рѕ</span><span>${fmtEur(total)}<small>${fmtBgn(total)}</small></span></div>
    ${subtotal < FREE_SHIP_BGN ? `<div class="cp-ship-hint">Р”РѕР±Р°РІРё РѕС‰Рµ <b>${fmtEur(FREE_SHIP_BGN - subtotal)}</b> Р·Р° Р±РµР·РїР»Р°С‚РЅР° РґРѕСЃС‚Р°РІРєР°</div>` : ''}`;
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
    <div class="cp-upsell-header">вљЎ РњРѕР¶Рµ РґР° С‚Рµ Р·Р°РёРЅС‚РµСЂРµСЃСѓРІР°</div>
    ${recs.map(p => `
      <div class="cp-upsell-item" onclick="openProductPage(${p.id});closeCartPage()">
        <div class="cp-upsell-emoji">${p.emoji}</div>
        <div class="cp-upsell-info">
          <div class="cp-upsell-name">${p.name.length > 40 ? p.name.substring(0, 40) + 'вЂ¦' : p.name}</div>
          <div class="cp-upsell-price">${fmtEur(p.price)} / ${fmtBgn(p.price)}</div>
        </div>
        <button type="button" class="cp-upsell-add" onclick="event.stopPropagation();cpAddUpsell(${p.id})">+ Р”РѕР±Р°РІРё</button>
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
  if (!confirm('РР·С‡РёСЃС‚Рё С†СЏР»Р°С‚Р° РєРѕС€РЅРёС†Р°?')) return;
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
    var totalStr = typeof fmtEur === 'function' ? fmtEur(total) : total.toFixed(2) + ' в‚¬';

    var el = document.createElement('div');
    el.id = 'cartAbandonToast';
    el.setAttribute('role', 'alert');
    el.innerHTML =
      '<div class="cat-toast-inner">' +
        '<span class="cat-toast-icon">рџ›’</span>' +
        '<span class="cat-toast-text">РРјР°С€ ' + count + ' ' + (count === 1 ? 'РїСЂРѕРґСѓРєС‚' : 'РїСЂРѕРґСѓРєС‚Р°') + ' (' + totalStr + ') РІ РєРѕР»РёС‡РєР°С‚Р°</span>' +
        '<button type="button" class="cat-toast-cta" onclick="document.getElementById(\'cartAbandonToast\').remove();handleCheckout()">Р—Р°РІСЉСЂС€Рё в†’</button>' +
        '<button type="button" class="cat-toast-close" aria-label="Р—Р°С‚РІРѕСЂРё" onclick="document.getElementById(\'cartAbandonToast\').remove()">Г—</button>' +
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
    if (errEl) { errEl.textContent = 'Р’СЉРІРµРґРµС‚Рµ РІР°Р»РёРґРµРЅ С‚РµР»РµС„РѕРЅРµРЅ РЅРѕРјРµСЂ'; errEl.style.display = 'block'; }
    if (phoneEl) phoneEl.focus();
    return;
  }
  var submitBtn = document.getElementById('poSubmitBtn');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'РР·РїСЂР°С‰Р°РЅРµ...'; }
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
  if (modal) modal.innerHTML = '<div style="text-align:center;padding:32px 16px"><div style="font-size:48px;margin-bottom:12px">вњ…</div><div style="font-size:18px;font-weight:700;margin-bottom:8px">Р—Р°СЏРІРєР°С‚Р° Рµ РёР·РїСЂР°С‚РµРЅР°!</div><p style="color:var(--text2);font-size:14px">Р©Рµ СЃРµ СЃРІСЉСЂР¶РµРј СЃ РІР°СЃ РЅР° <strong>' + phone + '</strong> РІ СЂР°РјРєРёС‚Рµ РЅР° СЂР°Р±РѕС‚РЅРёСЏ РґРµРЅ.</p><button type="button" onclick="closePhoneOrder()" style="margin-top:20px;background:var(--primary);color:#fff;border:none;border-radius:8px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;">Р—Р°С‚РІРѕСЂРё</button></div>';
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
let _srpQuery = ''; // current SRP query - never embed user input in HTML attributes

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
    .replace(/[Г ГЎГўГЈГ¤ГҐ]/g,'a').replace(/[ГЁГ©ГЄГ«]/g,'e').replace(/[Г¬Г­Г®ГЇ]/g,'i')
    .replace(/[ГІГіГґГµГ¶]/g,'o').replace(/[Г№ГєГ»Гј]/g,'u').replace(/[Г±]/g,'n');
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
      ? `<div class="sd-section-title">рџ’Ў РњРѕР¶РµС€ РґР° С‚СЉСЂСЃРёС€ РїРѕ</div>
         <div class="sd-recent">
           <div class="sd-recent-chip" onclick="void(0)">рџ“ќ РРјРµ / РјР°СЂРєР°</div>
           <div class="sd-recent-chip" onclick="void(0)">рџ”– SKU (РЅР°РїСЂ. MC-SONY-WH1000XM6)</div>
           <div class="sd-recent-chip" onclick="void(0)">рџ“¦ EAN Р±Р°СЂРєРѕРґ (13 С†РёС„СЂРё)</div>
         </div>`
      : `<div class="sd-section-title">рџ•ђ РџРѕСЃР»РµРґРЅРё С‚СЉСЂСЃРµРЅРёСЏ</div>
         <div class="sd-recent">
           ${recentSearches.map((s,i) => `
             <div class="sd-recent-chip" data-recent-search="${escHtml(s)}">
               рџ”Ќ ${escHtml(s)}
               <button type="button" class="sd-recent-remove" onclick="removeRecent(event,${i})">Г—</button>
             </div>`).join('')}
         </div>
         <div class="sd-section-title">рџ’Ў РўСЉСЂСЃРё Рё РїРѕ</div>
         <div class="sd-recent">
           <div class="sd-recent-chip cursor-default">рџ”– SKU РєРѕРґ</div>
           <div class="sd-recent-chip cursor-default">рџ“¦ EAN Р±Р°СЂРєРѕРґ</div>
         </div>`;
    searchDropdown.innerHTML = hints;
    searchDropdown.classList.add('open');
    searchBar.classList.add('active');
    return;
  }

  if (results.length === 0) {
    let hint = '';
    if (qtype === 'ean') {
      hint = '<div class="sd-empty-sub">РўСЉСЂСЃРµРЅРµС‚Рѕ РїРѕ EAN РЅРµ РЅР°РјРµСЂРё РїСЂРѕРґСѓРєС‚ СЃ Р±Р°СЂРєРѕРґ <strong>' + escHtml(q) + '</strong></div>';
    } else if (qtype === 'sku') {
      hint = '<div class="sd-empty-sub">РўСЉСЂСЃРµРЅРµС‚Рѕ РїРѕ SKU РЅРµ РЅР°РјРµСЂРё РїСЂРѕРґСѓРєС‚ СЃ РєРѕРґ <strong>' + escHtml(q) + '</strong></div>';
    } else {
      // "Did you mean?" - РЅР°РјРµСЂРё Р±Р»РёР·РєРё РјР°СЂРєРё/РёРјРµРЅР° СЃ Levenshtein
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
        hint = `<div class="sd-empty-sub">РњРѕР¶Рµ Р±Рё С‚СЉСЂСЃРёС€: ${chips}</div>`;
      } else {
        hint = '<div class="sd-empty-sub">РџСЂРѕРІРµСЂРё РїСЂР°РІРѕРїРёСЃР° РёР»Рё РѕРїРёС‚Р°Р№ СЃ SKU / EAN Р±Р°СЂРєРѕРґ</div>';
      }
    }
    searchDropdown.innerHTML = `
      <div class="sd-empty">
        <div class="sd-empty-icon">рџ”Ќ</div>
        <div class="sd-empty-text">РќСЏРјР° СЂРµР·СѓР»С‚Р°С‚Рё Р·Р° "<strong>${escHtml(q)}</strong>"</div>
        ${hint}
      </div>`;
    searchDropdown.classList.add('open');
    searchBar.classList.add('active');
    return;
  }

  const shown = results.slice(0, 6);
  // Section title differs by query type
  const sectionTitle = qtype === 'ean'
    ? `рџ“¦ EAN СЂРµР·СѓР»С‚Р°С‚ (${results.length})`
    : qtype === 'sku'
    ? `рџ”– SKU СЂРµР·СѓР»С‚Р°С‚ (${results.length})`
    : `рџ›Ќ РџСЂРѕРґСѓРєС‚Рё (${results.length})`;

  searchDropdown.innerHTML = `
    <div class="sd-section-title">${sectionTitle}</div>
    ${shown.map((p, i) => {
      const save = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : 0;
      let badgeHtml = '';
      if (p.badge === 'sale') badgeHtml = `<span class="sd-badge-small sd-badge-sale">-${save}%</span>`;
      else if (p.badge === 'new') badgeHtml = `<span class="sd-badge-small sd-badge-new">РќРѕРІРѕ</span>`;
      else if (p.badge === 'hot') badgeHtml = `<span class="sd-badge-small sd-badge-hot">Р“РѕСЂРµС‰Рѕ</span>`;
      // Highlight SKU/EAN if that's what matched
      const skuMatch = p.sku && p.sku.toLowerCase().includes(q.toLowerCase());
      const eanMatch = p.ean && p.ean.includes(q);
      const extraMeta = skuMatch
        ? `<span class="text-primary-strong">рџ”– ${highlightMatch(p.sku, q)}</span>`
        : eanMatch
        ? `<span class="text-primary-strong">рџ“¦ EAN: ${highlightMatch(p.ean, q)}</span>`
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
        <span class="sd-footer-count">РџРѕРєР°Р·Р°РЅРё ${shown.length} РѕС‚ ${results.length}</span>
        <button type="button" class="sd-footer-btn" onclick="doFullSearch()">Р’РёР¶ РІСЃРёС‡РєРё СЂРµР·СѓР»С‚Р°С‚Рё в†’</button>
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
      '<button type="button" aria-label="РќР°РјР°Р»Рё" onclick="event.stopPropagation();changeQty('+id+',-1);_sdRefresh('+id+')">в€’</button>' +
      '<span>'+qty+'</span>' +
      '<button type="button" aria-label="РЈРІРµР»РёС‡Рё" onclick="event.stopPropagation();addToCart('+id+');_sdRefresh('+id+')">+</button>' +
      '</div>';
  }
  return '<button type="button" class="sd-add-btn" onclick="event.stopPropagation();addToCart('+id+');_sdRefresh('+id+')" aria-label="Р”РѕР±Р°РІРё РІ РєРѕС€РЅРёС†Р°">+</button>';
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
  const catLabels = {phones:'РўРµР»РµС„РѕРЅРё Рё С‚Р°Р±Р»РµС‚Рё',laptops:'Р›Р°РїС‚РѕРїРё',desktops:'РќР°СЃС‚РѕР»РЅРё РєРѕРјРїСЋС‚СЂРё',gaming:'Р“РµР№РјРёРЅРі',monitors:'РњРѕРЅРёС‚РѕСЂРё',components:'РљРѕРјРїРѕРЅРµРЅС‚Рё',peripherals:'РџРµСЂРёС„РµСЂРёСЏ',network:'РњСЂРµР¶Р°',storage:'РџР°РјРµС‚ Рё СЃСЉС…СЂР°РЅРµРЅРёРµ',accessories:'РђРєСЃРµСЃРѕР°СЂРё',software:'РЎРѕС„С‚СѓРµСЂ'};
  const el_srpFilters = document.getElementById('srpFilters');
  if (el_srpFilters) {
    el_srpFilters.innerHTML =
      `<button type="button" class="srp-filter-pill${srpCurrentCatFilter===''?' active':''}" data-cat="" data-label="Р’СЃРёС‡РєРё" onclick="srpFilter(this,'')">Р’СЃРёС‡РєРё <span class="pill-cnt">(${allResults.length})</span></button>` +
      cats.map(c => {
        const n = allResults.filter(p => normalizeCat(p.cat) === c).length;
        const label = catLabels[c] || c;
        return `<button type="button" class="srp-filter-pill${srpCurrentCatFilter===c?' active':''}" data-cat="${escHtml(c)}" data-label="${escHtml(label)}" onclick="srpFilter(this,'${escHtml(c)}')">${escHtml(label)} <span class="pill-cnt">(${n})</span></button>`;
      }).join('') +
      `<button type="button" class="srp-filter-pill srp-reset-btn" id="srpResetBtn" onclick="srpResetFilters()" style="display:none" aria-label="РќСѓР»РёСЂР°Р№ С„РёР»С‚СЂРёС‚Рµ">вњ• РќСѓР»РёСЂР°Р№</button>`;
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
  if (pv) pv.textContent = fmtEur(srpPriceMinVal) + ' - ' + fmtEur(srpPriceMaxVal);
  const pf = document.getElementById('srpPriceFilter');
  if (pf) pf.style.display = '';

  // Render grid with all active filters applied
  const filtered = allResults
    .filter(p => !srpCurrentCatFilter || normalizeCat(p.cat) === srpCurrentCatFilter)
    .filter(p => p.price >= srpPriceMinVal && p.price <= srpPriceMaxVal);
  document.getElementById('srpCount').textContent = `${filtered.length} СЂРµР·СѓР»С‚Р°С‚Р°`;
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
  if (cnt) cnt.textContent = res.length + ' СЂРµР·СѓР»С‚Р°С‚Р°';
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
  if (pv) pv.textContent = fmtEur(0) + ' - ' + fmtEur(srpPriceAbsMax);
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
        <div class="nri">рџ”Ќ</div>
        <h3>РќСЏРјР° РЅР°РјРµСЂРµРЅРё РїСЂРѕРґСѓРєС‚Рё</h3>
        <p>РћРїРёС‚Р°Р№ СЃ СЂР°Р·Р»РёС‡РЅР° РґСѓРјР° РёР»Рё СЂР°Р·РіР»РµРґР°Р№ РїРѕРїСѓР»СЏСЂРЅРёС‚Рµ С‚СЉСЂСЃРµРЅРёСЏ:</p>
        <div class="srp-suggestions">
          ${['Р»Р°РїС‚РѕРї','СЃР»СѓС€Р°Р»РєРё','С‚РµР»РµС„РѕРЅ','С‚Р°Р±Р»РµС‚','РєР°РјРµСЂР°'].map(s =>
            `<button type="button" class="srp-suggestion" onclick="document.getElementById('searchInput').value='${s}';showSearchResultsPage('${s}')">${s}</button>`
          ).join('')}
        </div>
      </div>
      <div style="margin-top:32px;">
        <div style="font-size:16px;font-weight:800;margin-bottom:16px;">РџРѕРїСѓР»СЏСЂРЅРё РїСЂРѕРґСѓРєС‚Рё</div>
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
  if (!v || !v.includes('@') || !v.includes('.')) { showToast('Р’СЉРІРµРґРё РІР°Р»РёРґРµРЅ РёРјРµР№Р»!'); return; }
  // Save to localStorage
  try {
    const subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]');
    if (!subs.includes(v)) { subs.push(v); localStorage.setItem('mc_newsletter', JSON.stringify(subs)); }
  } catch(e) {}
  showToast('вњ“ РђР±РѕРЅРёСЂР°РЅ СѓСЃРїРµС€РЅРѕ! Р©Рµ РїРѕР»СѓС‡Р°РІР°С€ РЅР°Р№-РґРѕР±СЂРёС‚Рµ РѕС„РµСЂС‚Рё.');
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

  // Breadcrumb (inline - no wrapper needed)
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

  // SEO - Dynamic meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? 'вЂ¦' : '')
      : `${p.name} - ${p.brand} | Р¦РµРЅР°: ${(p.price/EUR_RATE).toFixed(2)} в‚¬ / ${p.price} Р»РІ. РљСѓРїРё РѕРЅР»Р°Р№РЅ РѕС‚ Most Computers.`;
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
  setOG('og:description', p.desc ? p.desc.substring(0,200) : `${p.name} РѕС‚ ${p.brand}. Р¦РµРЅР°: ${(p.price/EUR_RATE).toFixed(2)} в‚¬`);
  setOG('og:image',       p.img || 'https://mostcomputers.bg/og-default.jpg');
  setOG('og:url',         window.location.href);
  setOG('og:type',        'product');
  setOG('og:site_name',   'Most Computers');
  setOG('product:price:amount',   (p.price/EUR_RATE).toFixed(2));
  setOG('product:price:currency', 'EUR');
  setOGName('twitter:card',        'summary_large_image');
  setOGName('twitter:title',       p.name + ' | Most Computers');
  setOGName('twitter:description', p.desc ? p.desc.substring(0,200) : `${p.brand} - ${p.name}`);
  setOGName('twitter:image',       p.img || '');
  const _canonical = document.querySelector('link[rel="canonical"]');
  if (_canonical) _canonical.setAttribute('href', `https://mostcomputers.bg/?product=${p.id}`);

  // Badges
  let b = '';
  if (p.badge==='sale') b += '<span class="badge badge-sale">РџСЂРѕРјРѕ</span>';
  if (p.badge==='new')  b += '<span class="badge badge-new">РќРѕРІРѕ</span>';
  if (p.badge==='hot')  b += '<span class="badge badge-hot">Р“РѕСЂРµС‰Рѕ</span>';
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
    _rvEl.textContent = `${p.rating} (${p.rv} СЂРµРІСЋС‚Р°)`;
    _rvEl.style.cssText = 'font-size:12px;color:var(--muted);cursor:pointer;';
  } else {
    _starsEl.innerHTML = '';
    _starsEl.style.display = 'none';
    _rvEl.innerHTML = 'в­ђ <span style="color:var(--primary);font-weight:600;">Р‘СЉРґРё РїСЉСЂРІРё РґР° РЅР°РїРёС€РµС€ СЂРµРІСЋ</span>';
    _rvEl.style.cssText = 'font-size:11.5px;cursor:pointer;';
  }

  // E: Spec badges - universal across all categories
  (function renderSpecBadges(prod) {
    const wrap = document.getElementById('pdpSpecBadges');
    if (!wrap) return;
    const sp = prod.specs || {};
    const name = (prod.name || '').toUpperCase();
    const badges = [];
    const b = (text, color) => `<span style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:5px;font-size:10.5px;font-weight:700;border:1.5px solid ${color};color:${color};background:${color}18;white-space:nowrap;">${text}</span>`;

    // Storage - speed class
    if (prod.subcat === 'microsd' || prod.subcat === 'sd_card' || prod.subcat === 'cf_card') {
      if (name.includes('U3') || (sp['РРЅС‚РµСЂС„РµР№СЃ']||'').includes('U3')) badges.push(b('U3 вљЎ','#3b82f6'));
      else if (name.includes('U1')) badges.push(b('U1','#64748b'));
      if (name.includes('V30') || (sp['РРЅС‚РµСЂС„РµР№СЃ']||'').includes('V30')) badges.push(b('V30 рџЋҐ','#8b5cf6'));
      else if (name.includes('V10')) badges.push(b('V10','#64748b'));
      if (name.includes('A2')) badges.push(b('A2 рџ“±','#10b981'));
      else if (name.includes('A1')) badges.push(b('A1 рџ“±','#10b981'));
      if (sp['РЎРєРѕСЂРѕСЃС‚ С‡РµС‚РµРЅРµ']) badges.push(b('в†“ ' + sp['РЎРєРѕСЂРѕСЃС‚ С‡РµС‚РµРЅРµ'],'#f59e0b'));
      if (sp['РЎРєРѕСЂРѕСЃС‚ Р·Р°РїРёСЃ'])  badges.push(b('в†‘ ' + sp['РЎРєРѕСЂРѕСЃС‚ Р·Р°РїРёСЃ'], '#f59e0b'));
    }
    // USB flash
    if (prod.subcat === 'usb_flash') {
      if (name.includes('USB3.2') || (sp['РРЅС‚РµСЂС„РµР№СЃ']||'').includes('3.2')) badges.push(b('USB 3.2 вљЎ','#3b82f6'));
      else if (name.includes('USB3') || (sp['РРЅС‚РµСЂС„РµР№СЃ']||'').includes('3.0') || (sp['РРЅС‚РµСЂС„РµР№СЃ']||'').includes('3.1')) badges.push(b('USB 3.0 вљЎ','#3b82f6'));
      else badges.push(b('USB 2.0','#64748b'));
      if (name.includes('TYPE-C') || name.includes('USB-C') || name.includes('/DT70') || (sp['РРЅС‚РµСЂС„РµР№СЃ']||'').toLowerCase().includes('type-c')) badges.push(b('USB-C','#6d28d9'));
      if (name.includes('DUAL') || name.includes('OTG')) badges.push(b('Dual OTG','#0ea5e9'));
      if (sp['РЎРєРѕСЂРѕСЃС‚ С‡РµС‚РµРЅРµ']) badges.push(b('в†“ ' + sp['РЎРєРѕСЂРѕСЃС‚ С‡РµС‚РµРЅРµ'],'#f59e0b'));
    }
    // RAM
    if (prod.subcat === 'ram') {
      const iface = (sp['РРЅС‚РµСЂС„РµР№СЃ'] || sp['Type'] || '').toUpperCase();
      if (iface.includes('DDR5')) badges.push(b('DDR5','#8b5cf6'));
      else if (iface.includes('DDR4')) badges.push(b('DDR4','#3b82f6'));
      else if (iface.includes('DDR3')) badges.push(b('DDR3','#64748b'));
      const freq = sp['Р§РµСЃС‚РѕС‚Р°'] || sp['Speed'] || sp['Frequency'] || '';
      if (freq) badges.push(b(freq,'#f59e0b'));
      const cap = sp['РљР°РїР°С†РёС‚РµС‚'] || sp['Capacity'] || '';
      if (cap) badges.push(b(cap,'#10b981'));
    }
    // SSD/HDD
    if (prod.subcat === 'ssd' || prod.subcat === 'hdd') {
      const iface = (sp['РРЅС‚РµСЂС„РµР№СЃ'] || sp['Interface'] || '').toUpperCase();
      if (iface.includes('NVME') || iface.includes('M.2')) badges.push(b('NVMe M.2','#8b5cf6'));
      else if (iface.includes('SATA')) badges.push(b('SATA','#3b82f6'));
      const cap = sp['РљР°РїР°С†РёС‚РµС‚'] || sp['Capacity'] || '';
      if (cap) badges.push(b(cap,'#10b981'));
      if (sp['РЎРєРѕСЂРѕСЃС‚ С‡РµС‚РµРЅРµ']) badges.push(b('в†“ ' + sp['РЎРєРѕСЂРѕСЃС‚ С‡РµС‚РµРЅРµ'],'#f59e0b'));
    }
    // GPU
    if (prod.subcat === 'gpu') {
      const vram = sp['VRAM'] || sp['Р’РёРґРµРѕРїР°РјРµС‚'] || sp['Memory'] || '';
      if (vram) badges.push(b(vram + ' VRAM','#8b5cf6'));
      const conn = sp['РљРѕРЅРµРєС‚РѕСЂ'] || sp['Interface'] || '';
      if (conn.toUpperCase().includes('PCIE 5')) badges.push(b('PCIe 5.0','#f59e0b'));
      else if (conn.toUpperCase().includes('PCIE 4')) badges.push(b('PCIe 4.0','#f59e0b'));
    }
    // CPU
    if (prod.subcat === 'cpu') {
      const cores = sp['РЇРґСЂР°'] || sp['Cores'] || '';
      if (cores) badges.push(b(cores + ' СЏРґСЂР°','#3b82f6'));
      const socket = sp['РЎРѕРєРµС‚'] || sp['Socket'] || '';
      if (socket) badges.push(b(socket,'#6d28d9'));
      const tdp = sp['TDP'] || '';
      if (tdp) badges.push(b(tdp + ' TDP','#f59e0b'));
    }
    // Monitors
    if (prod.cat === 'monitors' || prod.subcat === 'gaming_mon' || prod.subcat === 'mon_4k') {
      const hz = sp['Р§РµСЃС‚РѕС‚Р°'] || sp['Refresh rate'] || '';
      if (hz) badges.push(b(hz,'#8b5cf6'));
      const panel = sp['РўРёРї РїР°РЅРµР»'] || sp['Panel'] || '';
      if (panel) badges.push(b(panel,'#3b82f6'));
      const res = sp['Р РµР·РѕР»СЋС†РёСЏ'] || sp['Resolution'] || '';
      if (res) badges.push(b(res,'#10b981'));
    }
    // Network
    if (prod.cat === 'network') {
      const wifi = sp['WiFi'] || sp['РЎС‚Р°РЅРґР°СЂС‚'] || '';
      if (wifi) badges.push(b(wifi,'#3b82f6'));
      const ports = sp['РџРѕСЂС‚РѕРІРµ'] || sp['Ports'] || '';
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
      _el_pdpMonthly.innerHTML=`<span>РёР»Рё РѕС‚ <strong>${mo24} в‚¬/РјРµСЃ.</strong> Г— 24 РІРЅРѕСЃРєРё</span>`;
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
  let stockTxt = 'РР·С‡РµСЂРїР°РЅ';
  if (inStock) {
    stockTxt = (stockNum !== null && stockNum <= 5) ? `вљ пёЏ РЎР°РјРѕ ${stockNum} Р±СЂ. РІ РЅР°Р»РёС‡РЅРѕСЃС‚` : 'вњ“ Р’ РЅР°Р»РёС‡РЅРѕСЃС‚';
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
      notifySuccess.textContent = `вњ“ Р©Рµ С‚Рµ СѓРІРµРґРѕРјРёРј РЅР° ${savedBisEmail} РІРµРґРЅР°РіР° С‰РѕРј РїСЂРѕРґСѓРєС‚СЉС‚ Рµ РЅР°Р»РёС‡РµРЅ!`;
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
    lbl.textContent = isSet ? 'РЎР»РµРґРёС€ С†РµРЅР°С‚Р° вњ“' : 'РџСЂРё РЅР°РјР°Р»РµРЅРёРµ';
    // Check if price dropped since alert was set
    if (isSet && prod.price < alerts[prod.id].price) {
      showToast('рџЋ‰ Р¦РµРЅР°С‚Р° РЅР° "' + prod.name.substring(0, 30) + '..." Рµ РїР°РґРЅР°Р»Р°!');
      delete alerts[prod.id];
      try { localStorage.setItem('mc_price_alerts', JSON.stringify(alerts)); } catch(e) {}
      btn.classList.remove('active');
      lbl.textContent = 'РџСЂРё РЅР°РјР°Р»РµРЅРёРµ';
    }
  })(p);

  // Quick specs hidden
  const specs = p.specs || {};
  var _el_pdpQuickSpecs=document.getElementById('pdpQuickSpecs'); if(_el_pdpQuickSpecs) _el_pdpQuickSpecs.innerHTML = '';

  // Qty
  document.getElementById('pdpQty').textContent = '1';

  // Wishlist btn
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) wishBtn.innerHTML = wishlist.includes(id) ? 'вќ¤ Р’ Р»СЋР±РёРјРё' : 'в™Ў Р”РѕР±Р°РІРё РІ Р¶РµР»Р°РЅРёСЏ';

  // Meta
  document.getElementById('pdpSku').textContent     = p.sku  || '-';
  document.getElementById('pdpEan').textContent     = p.ean  || p.sku || '-';
  document.getElementById('pdpWarranty').textContent = specs['Warranty'] || specs['Р“Р°СЂР°РЅС†РёСЏ'] || specs['warrantyInMonths'] || '24 РјРµСЃРµС†Р°';

  // в”Ђв”Ђ Gallery в”Ђв”Ђ
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

  // в”Ђв”Ђ Full specs table в”Ђв”Ђ
  const tbody = document.getElementById('pdpSpecsTbody');
  if (tbody) {
    let specRows = `<tr><th scope="row">SKU / Part Number</th><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.sku||'-'}</td></tr>`;
    if (p.ean) specRows += `<tr><th scope="row">EAN / Р‘Р°СЂРєРѕРґ</th><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.ean}</td></tr>`;
    const _se = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    specRows += Object.entries(specs).map(([k,v]) => `<tr><th scope="row">${_se(k)}</th><td>${_se(v)}</td></tr>`).join('');
    tbody.innerHTML = specRows || '<tr><td colspan="2" style="color:var(--muted);text-align:center;padding:24px;">РќСЏРјР° РґР°РЅРЅРё Р·Р° СЃРїРµС†РёС„РёРєР°С†РёРё.</td></tr>';
  }

  // в”Ђв”Ђ Description (HTML) в”Ђв”Ђ
  const htmlContent = document.getElementById('pdpHtmlContent');
  if (htmlContent) {
    if (p.htmlDesc) {
      // htmlDesc is admin-authored HTML - kept as-is (trusted source)
      htmlContent.innerHTML = p.htmlDesc;
    } else if (p.desc) {
      // p.desc may come from XML - render as plain text to prevent XSS
      htmlContent.innerHTML = '';
      const para = document.createElement('p');
      para.style.cssText = 'font-size:14px;line-height:1.8;color:var(--text2);';
      para.textContent = p.desc;
      htmlContent.appendChild(para);
    } else {
      htmlContent.innerHTML = '<p style="color:var(--muted);font-size:13px;">РќСЏРјР° РґРѕР±Р°РІРµРЅРѕ РѕРїРёСЃР°РЅРёРµ Р·Р° С‚РѕР·Рё РїСЂРѕРґСѓРєС‚.</p>';
    }
  }

  // в”Ђв”Ђ Video в”Ђв”Ђ
  const videoWrap = document.getElementById('pdpVideoWrap');
  if (p.videoUrl) {
    pdpRenderVideo(p.videoUrl, videoWrap);
  } else {
    videoWrap.innerHTML = `<div class="pdp-video-placeholder"><span>в–¶</span><div style="font-size:13px;color:var(--muted);">РќСЏРјР° РґРѕР±Р°РІРµРЅРѕ РІРёРґРµРѕ Р·Р° С‚РѕР·Рё РїСЂРѕРґСѓРєС‚.</div></div>`;
  }

  // в”Ђв”Ђ Reviews в”Ђв”Ђ
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
    revEl.innerHTML = '<p style="color:var(--muted);font-size:13px;">Р’СЃРµ РѕС‰Рµ РЅСЏРјР° СЂРµРІСЋС‚Р° Р·Р° С‚РѕР·Рё РїСЂРѕРґСѓРєС‚.</p>';
  }

  // в”Ђв”Ђ Vendor в”Ђв”Ђ
  const vendorDiv = document.getElementById('pdpVendorContent');
  if (vendorDiv) {
    if (p.vendorUrl) {
      vendorDiv.innerHTML = `
        <p style="font-size:13px;color:var(--text2);margin-bottom:12px;">РџРѕСЃРµС‚РµС‚Рµ РѕС„РёС†РёР°Р»РЅРёСЏ СЃР°Р№С‚ РЅР° РїСЂРѕРёР·РІРѕРґРёС‚РµР»СЏ Р·Р° РїРѕРІРµС‡Рµ РёРЅС„РѕСЂРјР°С†РёСЏ.</p>
        <a class="pdp-vendor-link" href="${p.vendorUrl}" target="_blank" rel="noopener">
          рџЊђ <span>РћС„РёС†РёР°Р»РµРЅ СЃР°Р№С‚ - ${p.brand || 'РџСЂРѕРёР·РІРѕРґРёС‚РµР»'}</span>
          <span style="margin-left:auto;font-size:11px;color:var(--muted);">в†—</span>
        </a>`;
    } else {
      vendorDiv.innerHTML = '<p style="color:var(--muted);font-size:13px;">РќСЏРјР° РґРѕР±Р°РІРµРЅ Р»РёРЅРє РєСЉРј РїСЂРѕРёР·РІРѕРґРёС‚РµР»СЏ.</p>';
    }
  }

  // Show reviews tab by default if product has reviews, otherwise specs
  const _hasPublicRevs = (p.reviews || []).filter(r => !r.pending).length > 0
    || (() => { try { return (JSON.parse(localStorage.getItem('mc_reviews') || '{}')[p.id] || []).length > 0; } catch(e) { return false; } })();
  pdpSwitchTab(_hasPublicRevs ? 'reviews' : 'specs');
  pdpUpdateStickyBar(p);
  // pdpShowViewers Рё pdpRenderSparkline РїСЂРµРјР°С…РЅР°С‚Рё - РіРµРЅРµСЂРёСЂР°С…Р° С„Р°Р»С€РёРІРё РґР°РЅРЅРё
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
  // Sidebar disabled - specs already shown in main tab
  if (typeof pdpInitPinch === 'function') pdpInitPinch();
  if (typeof _pdpCompareReset === 'function') _pdpCompareReset();
  const _pdpEl = document.getElementById('pdpBackdrop');
  _pdpEl.scrollTop = 0;
  _pdpEl.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  // в”Ђв”Ђ Structured Data (Product + BreadcrumbList) в”Ђв”Ђ
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
        { "@type": "ListItem", "position": 1, "name": "РќР°С‡Р°Р»Рѕ", "item": window.location.origin + "/" },
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
  // Breadcrumb - pop back to category if present
  document.title = 'Most Computers | РћРЅР»Р°Р№РЅ РјР°РіР°Р·РёРЅ Р·Р° РєРѕРјРїСЋС‚СЂРё Рё РєРѕРјРїРѕРЅРµРЅС‚Рё';
  // Reset meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'Most Computers вЂ“ РѕРЅР»Р°Р№РЅ РјР°РіР°Р·РёРЅ Р·Р° РєРѕРјРїСЋС‚СЂРё, РєРѕРјРїРѕРЅРµРЅС‚Рё, РјРѕРЅРёС‚РѕСЂРё, РїРµСЂРёС„РµСЂРёСЏ Рё РјСЂРµР¶РѕРІРѕ РѕР±РѕСЂСѓРґРІР°РЅРµ.');
  // Reset OG
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | РћРЅР»Р°Р№РЅ РјР°РіР°Р·РёРЅ Р·Р° РєРѕРјРїСЋС‚СЂРё Рё РєРѕРјРїРѕРЅРµРЅС‚Рё');
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
      : '<p style="color:var(--muted);font-size:13px;">Р’СЃРµ РѕС‰Рµ РЅСЏРјР° СЂРµРІСЋС‚Р° Р·Р° С‚РѕР·Рё РїСЂРѕРґСѓРєС‚.</p>';
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
      mainEmoji.textContent = p.emoji || 'рџ–Ґ';
      this.onerror = null;
    };
  } else {
    mainImg.style.display = 'none';
    mainEmoji.style.display = '';
    mainEmoji.textContent = p.emoji || 'рџ–Ґ';
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
    wrap.innerHTML = `<div class="pdp-video-placeholder"><span>в–¶</span><div style="font-size:13px;color:var(--muted);">РќРµРІР°Р»РёРґРµРЅ РІРёРґРµРѕ Р»РёРЅРє.</div></div>`;
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
    btn.innerHTML = 'вњ“ Р”РѕР±Р°РІРµРЅ!';
    btn.style.background = 'var(--accent2)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
  });
  showToast(`вњ“ ${p.name.substring(0,32)}вЂ¦ РґРѕР±Р°РІРµРЅ РІ РєРѕС€РЅРёС†Р°С‚Р°!`);
  // Reveal checkout shortcut buttons
  const ckBtn = document.getElementById('pdpCheckoutBtn');
  if (ckBtn) ckBtn.style.display = '';
  const stickyBtn = document.getElementById('pdpStickyCheckoutBtn');
  if (stickyBtn) stickyBtn.style.display = '';
}

function pdpCopyProductLink() {
  const url = location.origin + location.pathname + '?product=' + pdpProductId;
  navigator.clipboard.writeText(url).then(() => showToast('рџ”— Р›РёРЅРєСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    showToast('рџ”— Р›РёРЅРєСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!');
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
    if (lbl) lbl.textContent = 'РџСЂРё РЅР°РјР°Р»РµРЅРёРµ';
    showToast('рџ”• РЎРїСЂСЏРЅ price alert Р·Р° ' + p.name.substring(0, 25) + '...');
  } else {
    alerts[p.id] = { price: p.price, name: p.name, set: Date.now() };
    if (btn) btn.classList.add('active');
    if (lbl) lbl.textContent = 'РЎР»РµРґРёС€ С†РµРЅР°С‚Р° вњ“';
    showToast('рџ”” Р©Рµ С‚Рµ СѓРІРµРґРѕРјРёРј Р°РєРѕ С†РµРЅР°С‚Р° РїР°РґРЅРµ!');
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
  const text = encodeURIComponent((p ? p.name + ' - ' : '') + url);
  window.open('viber://forward?text=' + text, '_blank');
}

function pdpToggleWish() {
  if (!pdpProductId) return;
  toggleWishlist(pdpProductId, null);
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) wishBtn.innerHTML = wishlist.includes(pdpProductId) ? 'вќ¤ Р’ Р»СЋР±РёРјРё' : 'в™Ў Р”РѕР±Р°РІРё РІ Р¶РµР»Р°РЅРёСЏ';
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
    txt.innerHTML = 'вњ… РРјР°С€ Р±РµР·РїР»Р°С‚РЅР° РґРѕСЃС‚Р°РІРєР°!';
    fill.style.background = 'var(--success, #22c55e)';
  } else {
    const need = (FREE_SHIP_EUR - cartEur).toFixed(2);
    txt.innerHTML = `рџљљ Р”РѕР±Р°РІРё РѕС‰Рµ <b>${need} в‚¬</b> Р·Р° Р±РµР·РїР»Р°С‚РЅР° РґРѕСЃС‚Р°РІРєР°`;
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
  // Same subcat, similar price (В±35%); fallback to same cat; fallback to all
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


// ===== рџ–ј IMAGE ZOOM =====
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
  if (!email || !email.includes('@')) { showToast('вљ пёЏ Р’СЉРІРµРґРё РІР°Р»РёРґРµРЅ РёРјРµР№Р»'); return; }
  // Save to localStorage
  const key = 'mc_bis_' + pdpProductId;
  localStorage.setItem(key, email);
  document.getElementById('pdpNotifyForm').style.display = 'none';
  document.getElementById('pdpNotifySuccess').style.display = 'block';
  showToast('рџ“¬ Р©Рµ С‚Рµ СѓРІРµРґРѕРјРёРј РїСЂРё РЅР°Р»РёС‡РЅРѕСЃС‚!');
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

// QW-02: Viewers counter - seeded by product id for consistency per session
function pdpShowViewers(p) {
  let el = document.getElementById('pdpViewers');
  if (!el) return;
  const n = 3 + ((p.id * 7 + Math.floor(Date.now() / 600000)) % 10);
  el.textContent = `рџ‘Ђ ${n} С‡РѕРІРµРєР° СЂР°Р·РіР»РµР¶РґР°С‚ РІ РјРѕРјРµРЅС‚Р°`;
  el.style.display = '';
}

// QW-05: Share product
function pdpShare(p) {
  const url = location.origin + location.pathname + '?product=' + p.id;
  if (navigator.share) {
    navigator.share({ title: p.name, text: p.brand + ' ' + p.name + ' - ' + fmtEur(p.price), url }).catch(() => {});
  } else {
    try { navigator.clipboard.writeText(url); showToast('рџ”— Р›РёРЅРєСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!'); } catch(e) { showToast('рџ”— ' + url); }
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
    const delta = (seed - 50) / 50 * 0.08; // В±8%
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
  const labels = ['РЈР¶Р°СЃРЅРѕ', 'Р›РѕС€Рѕ', 'РЎСЂРµРґРЅРѕ', 'Р”РѕР±СЂРѕ', 'РћС‚Р»РёС‡РЅРѕ'];
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = labels[n - 1] || '';
  document.querySelectorAll('.rf-star').forEach(s => {
    s.style.color = parseInt(s.dataset.v) <= n ? '#fbbf24' : '';
  });
}

function submitPdpReview() {
  const name = document.getElementById('rfName')?.value.trim();
  const text = document.getElementById('rfText')?.value.trim();
  if (!name) { showToast('вљ пёЏ Р’СЉРІРµРґРё С‚РІРѕРµС‚Рѕ РёРјРµ'); return; }
  if (!rfStarVal) { showToast('вљ пёЏ РР·Р±РµСЂРё СЂРµР№С‚РёРЅРі'); return; }
  if (!text || text.length < 10) { showToast('вљ пёЏ Р РµРІСЋС‚Рѕ С‚СЂСЏР±РІР° РґР° Рµ РїРѕРЅРµ 10 СЃРёРјРІРѕР»Р°'); return; }

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
  if (lbl) lbl.textContent = 'РР·Р±РµСЂРё СЂРµР№С‚РёРЅРі';

  showToast('вњ… Р РµРІСЋС‚Рѕ Рµ РёР·РїСЂР°С‚РµРЅРѕ Рё С‰Рµ Р±СЉРґРµ РїСѓР±Р»РёРєСѓРІР°РЅРѕ СЃР»РµРґ РїСЂРµРіР»РµРґ!');
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
    drop.innerHTML = `<div class="pdp-drop-empty">РќСЏРјР° РЅР°РјРµСЂРµРЅРё РїСЂРѕРґСѓРєС‚Рё Р·Р° <strong>${escHtml(q)}</strong></div>`;
    drop.style.display = '';
    return;
  }

  drop.innerHTML = _pdpSrchResults.map((p, i) => {
    const price = typeof formatPrice === 'function' ? formatPrice(p.price) : p.price + ' Р»РІ.';
    const img = p.img
      ? `<img src="${escHtml(p.img)}" alt="" class="pdp-drop-img" loading="lazy">`
      : `<span class="pdp-drop-emoji">${escHtml(p.emoji || 'рџ“¦')}</span>`;
    return `<div class="pdp-drop-item" role="option" data-idx="${i}" onmousedown="pdpSearchPick(${i})">
      <div class="pdp-drop-thumb">${img}</div>
      <div class="pdp-drop-info">
        <div class="pdp-drop-name">${escHtml(p.name)}</div>
        <div class="pdp-drop-price">${price}</div>
      </div>
    </div>`;
  }).join('') +
  `<div class="pdp-drop-all" onmousedown="pdpSearchGo(document.getElementById('pdpSearchInput').value)">
    Р’РёР¶ РІСЃРёС‡РєРё СЂРµР·СѓР»С‚Р°С‚Рё Р·Р° вЂћ${escHtml(q)}" в†’
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
        <div class="bundle-item-name">${_esc(x.name.length > 40 ? x.name.slice(0,40)+'вЂ¦' : x.name)}</div>
        <div class="bundle-item-price">${fmtEur(x.price)}</div>
      </div>
    </div>
    ${i < allProds.length - 1 ? '<div class="bundle-plus">+</div>' : ''}
  `).join('');

  wrap.innerHTML = `
    <div class="bundle-section">
      <div class="bundle-header">
        <span class="bundle-tag">рџЋЃ РљСѓРїРё Р·Р°РµРґРЅРѕ</span>
        <span class="bundle-save-badge">РЎРїРµСЃС‚Рё ${fmtEur(saving)}</span>
      </div>
      <div class="bundle-items">${itemsHtml}</div>
      <div class="bundle-footer">
        <div class="bundle-totals">
          <span class="bundle-old-total">${fmtEur(totalFull)}</span>
          <span class="bundle-new-total">${fmtEur(totalDisc)}</span>
          <span class="bundle-disc-label">-${disc}% РїСЂРё РєРѕРјРїР»РµРєС‚</span>
        </div>
        <button type="button" class="bundle-add-btn" onclick="pdpAddBundle(${JSON.stringify(allProds.map(x=>x.id))})">
          рџ›’ Р”РѕР±Р°РІРё РІСЃРёС‡РєРё РІ РєРѕС€РЅРёС†Р°С‚Р°
        </button>
      </div>
    </div>`;
  wrap.style.display = '';
}

function pdpAddBundle(ids) {
  ids.forEach(id => { if (typeof addToCart === 'function') addToCart(id); });
  showToast('вњ… РљРѕРјРїР»РµРєС‚СЉС‚ Рµ РґРѕР±Р°РІРµРЅ РІ РєРѕС€РЅРёС†Р°С‚Р°!');
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
      list.innerHTML = '<p class="pdp-qa-empty">Р’СЃРµ РѕС‰Рµ РЅСЏРјР° РїСѓР±Р»РёС‡РЅРё РІСЉРїСЂРѕСЃРё Р·Р° С‚РѕР·Рё РїСЂРѕРґСѓРєС‚. Р‘СЉРґРё РїСЉСЂРІРёСЏС‚!</p>';
      return;
    }
    list.innerHTML = items.map(q => `
      <div class="pdp-qa-item">
        <div class="pdp-qa-q"><span class="pdp-qa-q-icon">вќ“</span><span>${escHtml(q.question)}</span></div>
        <div class="pdp-qa-a"><span class="pdp-qa-a-icon">рџ’¬</span><span>${escHtml(q.answer)}</span></div>
        <div class="pdp-qa-meta">${escHtml(q.asker_name || 'РђРЅРѕРЅРёРјРµРЅ')} В· ${new Date(q.created_at).toLocaleDateString('bg-BG')}</div>
      </div>`).join('');
  });
}

async function pdpSubmitQuestion() {
  const text  = (document.getElementById('pdpQaText')?.value  || '').trim();
  const name  = (document.getElementById('pdpQaName')?.value  || '').trim();
  const email = (document.getElementById('pdpQaEmail')?.value || '').trim();
  if (!text) { showToast('вљ пёЏ РњРѕР»СЏ РІСЉРІРµРґРё РІСЉРїСЂРѕСЃР° СЃРё.'); return; }
  if (text.length < 10) { showToast('вљ пёЏ Р’СЉРїСЂРѕСЃСЉС‚ Рµ С‚РІСЉСЂРґРµ РєСЂР°С‚СЉРє.'); return; }
  const btn = document.querySelector('.pdp-qa-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'РР·РїСЂР°С‰Р°РЅРµ...'; }
  if (typeof window.saveProductQuestion === 'function') {
    const ok = await window.saveProductQuestion(_pdpQaProductId, text, name, email);
    if (ok) {
      showToast('вњ… Р’СЉРїСЂРѕСЃСЉС‚ Рµ РёР·РїСЂР°С‚РµРЅ! Р©Рµ РѕС‚РіРѕРІРѕСЂРёРј СЃРєРѕСЂРѕ.');
      if (document.getElementById('pdpQaText'))  document.getElementById('pdpQaText').value  = '';
      if (document.getElementById('pdpQaName'))  document.getElementById('pdpQaName').value  = '';
      if (document.getElementById('pdpQaEmail')) document.getElementById('pdpQaEmail').value = '';
    } else {
      showToast('вќЊ Р“СЂРµС€РєР° РїСЂРё РёР·РїСЂР°С‰Р°РЅРµ. РћРїРёС‚Р°Р№ РѕС‚РЅРѕРІРѕ.');
    }
  } else {
    showToast('вњ… Р’СЉРїСЂРѕСЃСЉС‚ Рµ Р·Р°РїРёСЃР°РЅ!');
  }
  if (btn) { btn.disabled = false; btn.textContent = 'РР·РїСЂР°С‚Рё РІСЉРїСЂРѕСЃР° в†’'; }
}

// ===== PDP UX ENHANCEMENTS =====

// в”Ђв”Ђ LIGHTBOX в”Ђв”Ђ
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
      el.innerHTML = 'РџРѕСЂСЉС‡Р°Р№ СЃРµРіР° Рё РїРѕР»СѓС‡Рё РІ <strong>РїРѕРЅРµРґРµР»РЅРёРє</strong>';
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
      el.innerHTML = 'РџРѕСЂСЉС‡Р°Р№ РґРѕ <strong>16:30 С‡.</strong> Рё РїРѕР»СѓС‡Рё <strong>СѓС‚СЂРµ</strong>';
      if (cd) cd.textContent = '(РѕСЃС‚Р°РІР°С‚ ' + hh + ':' + mm + ':' + ss + ')';
    } else {
      el.innerHTML = 'РџРѕСЂСЉС‡Р°Р№ СЃРµРіР° - РёР·РїСЂР°С‰Р°РјРµ <strong>СѓС‚СЂРµ</strong>';
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
      '<span class="pdp-rvb-lbl">' + s + ' в…</span>' +
      '<div class="pdp-rvb-bar"><div class="pdp-rvb-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="pdp-rvb-num">' + c + '</span>' +
      '</div>';
  });
  wrap.innerHTML = '<div class="pdp-rvb">' +
    '<div class="pdp-rvb-avg">' +
      '<div class="pdp-rvb-big">' + avg + '</div>' +
      '<div class="pdp-rvb-stars">' + starsHTML(parseFloat(avg)) + '</div>' +
      '<div class="pdp-rvb-count">' + total + ' СЂРµРІСЋС‚' + (total === 1 ? 'Рѕ' : 'Р°') + '</div>' +
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
    title.textContent = catLabel ? ('РџРѕРґРѕР±РЅРё - ' + catLabel) : 'РџРѕРґРѕР±РЅРё РїСЂРѕРґСѓРєС‚Рё';
  }
  scroll.innerHTML = related.map(_pdpCarCard).join('');
  section.style.display = '';
}

// 8. CROSS-SELL WIDGET (right column, below CTA)
var _CROSS_SELL = {
  // Р›Р°РїС‚РѕРїРё в†’ РјРёС€РєРё, РєР»Р°РІРёР°С‚СѓСЂРё, СЃР»СѓС€Р°Р»РєРё
  laptops:     ['mouse','keyboard','headphones','accessories'],
  gaming_l:    ['mouse','keyboard','headphones','accessories'],
  convertible: ['mouse','keyboard','accessories'],

  // РќР°СЃС‚РѕР»РЅРё РєРѕРјРїСЋС‚СЂРё в†’ РјРѕРЅРёС‚РѕСЂРё, РєР»Р°РІРёР°С‚СѓСЂРё, РјРёС€РєРё
  desktops:    ['monitor','monitors','keyboard','mouse'],
  office_pc:   ['monitor','monitors','keyboard','mouse'],
  aio:         ['keyboard','mouse','accessories'],

  // РњРѕРЅРёС‚РѕСЂРё в†’ РєР°Р±РµР»Рё/Р°РєСЃРµСЃРѕР°СЂРё, РєР»Р°РІРёР°С‚СѓСЂРё, РјРёС€РєРё
  monitor:     ['keyboard','mouse','accessories'],
  monitors:    ['keyboard','mouse','accessories'],

  // РўРµР»РµС„РѕРЅРё / СЃРјР°СЂС‚С„РѕРЅРё в†’ Р°РєСЃРµСЃРѕР°СЂРё, РїР°РјРµС‚, СЃР»СѓС€Р°Р»РєРё
  phones:      ['accessories','microsd','headphones'],
  smartphone:  ['accessories','microsd','headphones'],

  // РџСЂРёРЅС‚РµСЂРё в†’ РєРѕРЅСЃСѓРјР°С‚РёРІРё, С…Р°СЂС‚РёСЏ
  printers:    ['consumables','photo_paper','accessories'],
  inkjet:      ['consumables','photo_paper'],
  inkjet_aio:  ['consumables','photo_paper'],
  laser:       ['consumables','accessories'],
  megatank:    ['consumables','photo_paper'],

  // PC РєРѕРјРїРѕРЅРµРЅС‚Рё в†’ РєСѓС‚РёРё, Р·Р°С…СЂР°РЅРІР°РЅРёСЏ
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

  // РџРµСЂРёС„РµСЂРёСЏ
  keyboard:    ['mouse','headphones','accessories'],
  mouse:       ['keyboard','accessories'],
  headphones:  ['microsd','accessories'],
  audio:       ['accessories'],
  webcam:      ['headphones','accessories'],

  // UPS СЃРёСЃС‚РµРјРё в†’ Р±Р°С‚РµСЂРёРё/Р°РєСЃРµСЃРѕР°СЂРё
  ups:         ['ups_battery','accessories'],
  ups_home:    ['ups_battery','accessories'],
  ups_office:  ['ups_battery','accessories'],
  ups_server:  ['ups_battery'],
  ups_battery: [],

  // РџСЂРѕРµРєС‚РѕСЂРё в†’ Р°РєСЃРµСЃРѕР°СЂРё, РЅРѕСЃРёС‚РµР»Рё
  projector:   ['accessories'],

  // РљР°РјРµСЂРё Рё РІРёРґРµРѕРЅР°Р±Р»СЋРґРµРЅРёРµ в†’ РїР°РјРµС‚, Р°РєСЃРµСЃРѕР°СЂРё
  cameras:     ['microsd','sd_card','accessories'],
  cam_indoor:  ['microsd','accessories'],
  cam_outdoor: ['microsd','accessories'],
  cam_poe:     ['accessories'],

  // Р¤Р»Р°С€ Рё РєР°СЂС‚Рё РїР°РјРµС‚
  usb_flash:   ['ext_drive','accessories'],
  microsd:     ['card_reader','accessories'],
  sd_card:     ['card_reader','accessories'],
  card_reader: ['microsd','sd_card'],
  cf_card:     ['card_reader'],

  // РљРѕРЅСЃСѓРјР°С‚РёРІРё в†’ РїСЂРёРЅС‚РµСЂРё (РѕР±СЂР°С‚РЅР° РїРѕСЃРѕРєР°)
  consumables: ['printers','inkjet','laser'],
  photo_paper: ['inkjet','inkjet_aio','megatank'],

  // РћС„РёСЃ / СЂР°Р±РѕС‚РЅРѕ РјСЏСЃС‚Рѕ
  chair:       ['monitor','monitors','accessories'],

  // РЁРёСЂРѕРєР° РїРµСЂРёС„РµСЂРёСЏ / Р°РєСЃРµСЃРѕР°СЂРё - Р±РµР· cross-sell
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
    '<div class="pdp-rw-hdr"><span class="pdp-rw-flash">вљЎ</span>РњРѕР¶Рµ РґР° С‚Рµ Р·Р°РёРЅС‚РµСЂРµСЃСѓРІР°</div>' +
    recs.map(function(r) {
      return '<div class="pdp-rw-row" onclick="openProductPage(' + r.id + ')" tabindex="0" role="button" aria-label="' + _e(r.name) + '">' +
        '<div class="pdp-rw-thumb">' + _thumb(r) + '</div>' +
        '<div class="pdp-rw-info">' +
          '<div class="pdp-rw-name">' + _e(r.name.length > 42 ? r.name.substring(0,42)+'вЂ¦' : r.name) + '</div>' +
          '<div class="pdp-rw-price">' + (typeof fmtEur === 'function' ? fmtEur(r.price) : r.price + ' в‚¬') + '</div>' +
        '</div>' +
        '<button type="button" class="pdp-rw-add" onclick="event.stopPropagation();addToCart(' + r.id + ');this.textContent=\'вњ“\';this.classList.add(\'added\');setTimeout(function(){this.textContent=\'+\';this.classList.remove(\'added\');}.bind(this),1400);" aria-label="Р”РѕР±Р°РІРё ' + _e(r.name) + ' РІ РєРѕС€РЅРёС†Р°">+</button>' +
      '</div>';
    }).join('') +
    '<div class="pdp-rw-foot">РљР»РёРµРЅС‚РёС‚Рµ РєСѓРїСѓРІР°С‚ Р·Р°РµРґРЅРѕ СЃ С‚РѕР·Рё РїСЂРѕРґСѓРєС‚</div>';

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
  var price = (typeof fmtEur === 'function') ? fmtEur(p.price) : (p.price + ' Р»РІ.');
  var thumb = p.img
    ? '<img class="pdp-car-img" src="' + _e(p.img) + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
    : '';
  var emoji = '<span class="pdp-car-emoji"' + (p.img ? ' style="display:none"' : '') + '>' + (p.emoji || 'рџ“¦') + '</span>';
  var stars = p.rating ? '<div class="pdp-car-stars">' + starsHTML(p.rating) + '</div>' : '';
  var badge = p.badge === 'sale' ? '<span class="pdp-car-badge">РџСЂРѕРјРѕ</span>'
    : p.badge === 'new' ? '<span class="pdp-car-badge pdp-car-badge-new">РќРѕРІРѕ</span>' : '';
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
      ' РћСЃРЅРѕРІРЅРё С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё' +
    '</div>' +
    '<table class="pdp-sb-table"><tbody>' + rows + '</tbody></table>' +
    '<button type="button" class="pdp-sb-more" onclick="pdpSwitchTab(\'specs\');document.getElementById(\'pdp-tab-specs\').scrollIntoView({behavior:\'smooth\'})">Р’РёР¶ РІСЃРёС‡РєРё в†’</button>';
  sb.style.display = '';
}

// ===== 10. COPY SPECS =====
function pdpCopySpecs() {
  var p = (typeof products !== 'undefined') ? products.find(function(x) { return x.id === pdpProductId; }) : null;
  if (!p) return;
  var specs = p.specs || {};
  var text = p.name + '\n\n' + Object.keys(specs).map(function(k) { return k + ': ' + specs[k]; }).join('\n');
  var btn = document.getElementById('pdpCopyBtn');
  if (!navigator.clipboard) { showToast && showToast('вљ пёЏ РљР»РёРїР±РѕСЂРґ РЅРµРґРѕСЃС‚СЉРїРµРЅ'); return; }
  navigator.clipboard.writeText(text).then(function() {
    if (btn) { btn.textContent = 'вњ“ РљРѕРїРёСЂР°РЅРѕ'; btn.classList.add('pdp-copy-done'); }
    if (typeof showToast === 'function') showToast('вњ“ РҐР°СЂР°РєС‚РµСЂРёСЃС‚РёРєРёС‚Рµ СЃР° РєРѕРїРёСЂР°РЅРё!');
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> РљРѕРїРёСЂР°Р№'; btn.classList.remove('pdp-copy-done'); }
    }, 2000);
  }).catch(function() { if (typeof showToast === 'function') showToast('вљ пёЏ Р“СЂРµС€РєР° РїСЂРё РєРѕРїРёСЂР°РЅРµ'); });
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
  if (!win) { showToast('вљ пёЏ РџРѕРїСЉРї РїСЂРѕР·РѕСЂРµС†СЉС‚ Рµ Р±Р»РѕРєРёСЂР°РЅ. Р Р°Р·СЂРµС€Рё РїРѕРїСЉРїРё Р·Р° С‚РѕР·Рё СЃР°Р№С‚.'); return; }
  win.document.write(
    '<!DOCTYPE html><html><head><title>' + _ep(p.name) + ' - РҐР°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a;}h1{font-size:20px;margin-bottom:4px;}' +
    '.sub{color:#888;font-size:13px;margin-bottom:24px;}table{width:100%;border-collapse:collapse;}' +
    'tr:nth-child(even){background:#f9f9f9;}' +
    '@media print{button{display:none!important;}}' +
    '</style></head><body>' +
    '<h1>' + _ep(p.name) + '</h1>' +
    '<div class="sub">' + _ep(p.brand || '') + (p.sku ? ' В· SKU: ' + _ep(p.sku) : '') + '</div>' +
    '<table><tbody>' + rows + '</tbody></table>' +
    '<br><button onclick="window.print()" style="padding:10px 22px;background:#bd1105;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">рџ–Ё РџСЂРёРЅС‚РёСЂР°Р№</button>' +
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
      btn.innerHTML = btn.innerHTML.replace('РЎСЂР°РІРЅРё', 'РЎСЂР°РІРЅРµРЅРѕ вњ“');
      btn.classList.add('active');
    } else {
      btn.innerHTML = btn.innerHTML.replace('РЎСЂР°РІРЅРµРЅРѕ вњ“', 'РЎСЂР°РІРЅРё');
      btn.classList.remove('active');
    }
  }
}

// Reset compare button state when new product opens
var _pdpCompareReset = function() {
  var btn = document.getElementById('pdpCompareBtn');
  if (!btn) return;
  btn.classList.remove('active');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> РЎСЂР°РІРЅРё';
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
  if (priceEl) priceEl.textContent = (typeof fmtEur === 'function') ? fmtEur(p.price) : p.price + ' Р»РІ.';
  if (thumbEl) {
    var _e = typeof _esc === 'function' ? _esc : escHtml;
    thumbEl.innerHTML = p.img
      ? '<img src="' + _e(p.img) + '" style="width:44px;height:44px;object-fit:contain;border-radius:6px;">'
      : '<span style="font-size:28px;">' + (p.emoji || 'рџ“¦') + '</span>';
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
    : '<span style="font-size:44px;">' + (p.emoji || 'рџ“¦') + '</span>';
  if (brandEl) brandEl.textContent = p.brand || '';
  if (nameEl) nameEl.textContent = p.name;
  if (ratingEl) {
    var stars = Math.round(p.rating || 0);
    ratingEl.innerHTML = 'в…'.repeat(stars) + 'в†'.repeat(5 - stars) + ' <span style="color:var(--muted);font-size:11px;">(' + (p.reviews ? p.reviews.length : p.rv || 0) + ')</span>';
  }
  if (priceEl) priceEl.innerHTML = typeof fmtEur === 'function' ? '<strong>' + fmtEur(p.price) + '</strong>' : '<strong>' + p.price + ' в‚¬</strong>';

  var addBtn = document.getElementById('ppAddBtn');
  if (addBtn) {
    addBtn.onclick = function() {
      if (typeof addToCart === 'function') addToCart(_ppProductId);
      closeProdPreview();
    };
    addBtn.textContent = p.stock === false ? 'вњ• РР·С‡РµСЂРїР°РЅ' : 'рџ›’ Р”РѕР±Р°РІРё РІ РєРѕС€РЅРёС†Р°';
    addBtn.disabled = p.stock === false;
  }
  var detBtn = document.getElementById('ppDetailsBtn');
  if (detBtn) detBtn.onclick = function() { closeProdPreview(); openProductPage(_ppProductId); };

  var sheet = document.getElementById('prodPreviewSheet');
  var backdrop = document.getElementById('prodPreviewBackdrop');
  if (sheet) sheet.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Swipe down to close - use named handlers so old ones are replaced on re-open
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
  el.innerHTML = `<ol class="pg-bc-list" itemscope itemtype="https://schema.org/BreadcrumbList"><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/" class="pg-bc-home" onclick="${closeFnName}();return false;">РќР°С‡Р°Р»Рѕ</a><meta itemprop="position" content="1"/></li><li class="pg-bc-sep" aria-hidden="true">вЂє</li><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><strong class="pg-bc-current" itemprop="name">${label}</strong><meta itemprop="position" content="2"/></li></ol>`;
}
const blogPosts = [
  {
    slug: 'palit-rtx-4070-super-jetstream-oc-review',
    emoji: 'рџЋ®', cat: 'Р РµРІСЋ', title: 'Palit RTX 4070 Super JetStream OC - РљСЂР°Р» РЅР° СЃСЂРµРґРЅРёСЏ РєР»Р°СЃ',
    date: '02 Р®РЅРё 2026', dateISO: '2026-06-02', read: '6 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'RTX 4070 Super JetStream OC РѕС‚ Palit Рµ РјРѕР¶Рµ Р±Рё РЅР°Р№-Р±Р°Р»Р°РЅСЃРёСЂР°РЅР°С‚Р° РІРёРґРµРѕРєР°СЂС‚Р° Р·Р° 2026. РўРµСЃС‚РІР°С…РјРµ СЏ РІ РёРіСЂРё, СЂРµРЅРґРµСЂРёСЂР°РЅРµ Рё DLSS 3.',
    metaDesc: 'Palit GeForce RTX 4070 Super JetStream OC СЂРµРІСЋ - С‚РµСЃС‚ РїСЂРё 1440p Рё 4K, DLSS 3, С‚РµРјРїРµСЂР°С‚СѓСЂРё. РќР°Р№-РґРѕР±СЂР°С‚Р° GeForce Р·Р° РїР°СЂРёС‚Рµ?',
    tags: ['Nvidia', 'Palit', 'GPU', 'РіРµР№РјРёРЅРі', 'СЂРµРІСЋ'],
    brand: 'palit', rating: '9.1',
    model: 'RTX 4070 Super', modelSub: 'JetStream OC В· 12 GB', brandLabel: 'PALIT В· GPU',
    productImage: './images/products/38228.webp',
    verdict: 'Р‘РµР·СЃРїРѕСЂРµРЅ РёР·Р±РѕСЂ Р·Р° 1440p РіРµР№РјРёРЅРі СЃ Р±СЋРґР¶РµС‚ РґРѕ 1200 в‚¬. JetStream РѕС…Р»Р°РґРёС‚РµР»СЏС‚ Рµ СЃСЂРµРґ РЅР°Р№-РґРѕР±СЂРёС‚Рµ РІ РєР»Р°СЃР°, Р° factory OC РЅРѕСЃРё СЂРµР°Р»РµРЅ Р±РѕРЅСѓСЃ.',
    specs: {'GPU С‡РёРї':'Ada Lovelace AD104','CUDA СЏРґСЂР°':'7 168','РџР°РјРµС‚':'12 GB GDDR6X, 192-bit','Boost Clock':'2535 MHz (factory OC)','TDP':'220 W','РћС…Р»Р°РґРёС‚РµР»':'JetStream 3Г—90 РјРј РІРµРЅС‚РёР»Р°С‚РѕСЂР°'},
    body: `<h2>РџР°СЃРїРѕСЂС‚ РЅР° РєР°СЂС‚Р°С‚Р°</h2>
<p>Palit GeForce RTX 4070 Super JetStream OC СЂР°Р·РїРѕР»Р°РіР° СЃ 7168 CUDA СЏРґСЂР° (Ada Lovelace), 12 GB GDDR6X РїР°РјРµС‚ РЅР° 192-Р±РёС‚РѕРІР° С€РёРЅР° Рё factory OC РѕС‚ 2535 MHz boost. РўСЂРёСЃРµРєС†РёРѕРЅРЅРёСЏС‚ РѕС…Р»Р°РґРёС‚РµР» СЃ 3 РІРµРЅС‚РёР»Р°С‚РѕСЂР° Г— 90 РјРј РѕСЃРёРіСѓСЂСЏРІР° РЅРёСЃРєРё С‚РµРјРїРµСЂР°С‚СѓСЂРё Рё РїРѕС‡С‚Рё Р±РµР·С€СѓРјРЅР° СЂР°Р±РѕС‚Р° РїСЂРё СѓРјРµСЂРµРЅРѕ РЅР°С‚РѕРІР°СЂРІР°РЅРµ.</p>
<h2>РџСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ РїСЂРё 1440p</h2>
<p>РџСЂРё <strong>1440p Ultra</strong> Palit RTX 4070 Super JetStream OC РїРѕСЃС‚РёРіР°:</p>
<ul>
<li>Cyberpunk 2077 (RT Ultra + DLSS Quality) - 85 fps СЃСЂРµРґРЅРѕ</li>
<li>Alan Wake 2 (Path Tracing + DLSS Quality) - 72 fps СЃСЂРµРґРЅРѕ</li>
<li>CS2 (High) - 260 fps СЃСЂРµРґРЅРѕ</li>
<li>Microsoft Flight Simulator 2024 (High) - 68 fps СЃСЂРµРґРЅРѕ</li>
</ul>
<p>РџСЂРё 1440p Р±РµР· ray tracing РїСЂР°РєС‚РёС‡РµСЃРєРё РІСЃСЏРєР° РёРіСЂР° С‚РµС‡Рµ РЅР°Рґ 100 fps - РЅРёРІРѕС‚Рѕ, РѕС‚ РєРѕРµС‚Рѕ РёРіСЂР°С‚Р° Рµ РЅР°РёСЃС‚РёРЅР° РїР»Р°РІРЅР°.</p>
<h2>РџСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ РїСЂРё 4K</h2>
<p>4K РЅРµ Рµ РѕСЃРЅРѕРІРЅР°С‚Р° С†РµР»РµРІР° СЂРµР·РѕР»СЋС†РёСЏ РЅР° С‚Р°Р·Рё РєР°СЂС‚Р°, РЅРѕ СЃ DLSS 3 Quality (СЂРµР°Р»РµРЅ СЂРµРЅРґРµСЂ РїСЂРё 1440p) СЂРµР·СѓР»С‚Р°С‚РёС‚Рµ РёР·РЅРµРЅР°РґРІР°С‚: Cyberpunk 2077 - 62 fps, Alan Wake 2 - 54 fps. Р—Р° 4K Р±РµР· DLSS Frame Generation Рµ РЅСѓР¶РЅР° RTX 4080 Super РёР»Рё РїРѕ-РІРёСЃРѕРєР° РєР°СЂС‚Р°.</p>
<h2>DLSS 3 Рё Frame Generation</h2>
<p>Transformer-Р±Р°Р·РёСЂР°РЅРёСЏС‚ DLSS 3.7 РґР°РІР° РІРёР·СѓР°Р»РЅРѕ РєР°С‡РµСЃС‚РІРѕ, РЅРµРѕС‚Р»РёС‡РёРјРѕ РѕС‚ native СЂРµР·РѕР»СЋС†РёСЏ. Frame Generation СѓРґРІРѕСЏРІР° fps-РёС‚Рµ РїСЂРё GPU-bound СЃС†РµРЅР°СЂРёРё Р±РµР· Р·Р°Р±РµР»РµР¶РёРјР° Р»Р°С‚РµРЅС‚РЅРѕСЃС‚ РїСЂРё Reflex + G-Sync. Р’ Cyberpunk 2077 СЃ РІСЃРёС‡РєРё RT РµС„РµРєС‚Рё Рё FG - 165 fps РїСЂРё 1440p.</p>
<h2>РўРµРјРїРµСЂР°С‚СѓСЂРё Рё С€СѓРј</h2>
<p>РџСЂРё full load GPU С‚РµРјРїРµСЂР°С‚СѓСЂР°С‚Р° Рµ 68В°C РїСЂРё СЃС‚Р°Р№РЅР° С‚РµРјРїРµСЂР°С‚СѓСЂР° 22В°C. Р’РµРЅС‚РёР»Р°С‚РѕСЂРёС‚Рµ СЃРїРёСЂР°С‚ РЅР°РїСЉР»РЅРѕ РїСЂРё РЅР°С‚РѕРІР°СЂРІР°РЅРµ РїРѕРґ 60W. РџСЂРё РёРіСЂРё РЅРёРІРѕС‚Рѕ Рµ РѕРєРѕР»Рѕ 36 dBA - С‚РёС…Рѕ РґРѕСЂРё РІ РѕС‚РІРѕСЂРµРЅ РєРѕСЂРїСѓСЃ.</p>
<h2>Р—Р°РєР»СЋС‡РµРЅРёРµ</h2>
<p>Palit RTX 4070 Super JetStream OC Рµ <strong>Р±РµР·СЃРїРѕСЂРЅРёСЏС‚ РёР·Р±РѕСЂ Р·Р° 1440p РіРµР№РјРёРЅРі</strong> СЃ Р±СЋРґР¶РµС‚ РґРѕ 1200 в‚¬. JetStream РѕС…Р»Р°РґРёС‚РµР»СЏС‚ Рµ РµРґРёРЅ РѕС‚ РЅР°Р№-РґРѕР±СЂРёС‚Рµ РІ РєР»Р°СЃР°, Р° factory OC РЅРѕСЃРё РјР°Р»СЉРє, РЅРѕ СЂРµР°Р»РµРЅ Р±РѕРЅСѓСЃ. <strong>РћС†РµРЅРєР°: 9.1 / 10</strong></p>`
  },
  {
    slug: 'amd-ryzen-9-9950x3d-review',
    emoji: 'рџ”ґ', cat: 'Р РµРІСЋ', title: 'AMD Ryzen 9 9950X3D - РљСЂР°СЏС‚ РЅР° РєРѕРјРїСЂРѕРјРёСЃРёС‚Рµ',
    date: '02 Р®РЅРё 2026', dateISO: '2026-06-02', read: '7 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'AMD РєРѕРјР±РёРЅРёСЂР° Zen 5 Р°СЂС…РёС‚РµРєС‚СѓСЂР°С‚Р° СЃ 3D V-Cache С‚РµС…РЅРѕР»РѕРіРёСЏС‚Р°. Р РµР·СѓР»С‚Р°С‚СЉС‚ Рµ РїСЂРѕС†РµСЃРѕСЂСЉС‚, Р·Р° РєРѕР№С‚Рѕ РіРµР№РјСЉСЂРёС‚Рµ РјРµС‡С‚Р°РµС…Р°.',
    metaDesc: 'AMD Ryzen 9 9950X3D СЂРµРІСЋ - Zen 5 + 3D V-Cache. РўРµСЃС‚ РІ РёРіСЂРё, СЂРµРЅРґРµСЂРёСЂР°РЅРµ Рё СЃСЉРґСЉСЂР¶Р°С‚РµР»РЅР° СЂР°Р±РѕС‚Р°. Р›РёРґРµСЂСЉС‚ Р·Р° 2026.',
    tags: ['AMD', 'РїСЂРѕС†РµСЃРѕСЂРё', 'РіРµР№РјРёРЅРі', 'СЂРµРІСЋ'],
    brand: 'amd', rating: '9.5',
    model: 'Ryzen 9 9950X3D', modelSub: 'Zen 5 В· 3D V-Cache В· AM5', brandLabel: 'AMD В· CPU',
    productImage: './images/products/44782.webp',
    verdict: 'РџСЉСЂРІРёСЏС‚ РїСЂРѕС†РµСЃРѕСЂ Р±РµР· РєРѕРјРїСЂРѕРјРёСЃ РјРµР¶РґСѓ РіРµР№РјРёРЅРі Рё РїСЂРѕРґСѓРєС‚РёРІРЅРѕСЃС‚. РЎРєСЉРї, РЅРѕ РЅР°РїСЉР»РЅРѕ РѕРїСЂР°РІРґР°РЅ Р·Р° enthusiast СЃРёСЃС‚РµРјРё.',
    specs: {'РђСЂС…РёС‚РµРєС‚СѓСЂР°':'Zen 5 (TSMC 4nm)','РЇРґСЂР° / РќРёС€РєРё':'16C / 32T','Boost С‡РµСЃС‚РѕС‚Р°':'5.7 GHz','РљРµС€ (L3)':'128 MB 3D V-Cache + 64 MB','TDP':'170 W','РЎРѕРєРµС‚':'AM5 (LGA1718)'},
    body: `<h2>Zen 5 + 3D V-Cache: РјРѕС‰РЅР°С‚Р° РєРѕРјР±РёРЅР°С†РёСЏ</h2>
<p>Ryzen 9 9950X3D РЅРѕСЃРё 16 СЏРґСЂР° / 32 РЅРёС€РєРё РЅР° Zen 5 Р°СЂС…РёС‚РµРєС‚СѓСЂР° СЃ 5.7 GHz boost С‡РµСЃС‚РѕС‚Р° РїР»СЋСЃ 128 MB 3D V-Cache РІСЉСЂС…Сѓ CCD-С‚Рѕ. РћР±С‰Рѕ: 192 MB РєРµС€ (L2 + L3). AMD Рµ СЂРµС€РёР»Р° РґРёР»РµРјР°С‚Р° РѕС‚ РїСЂРµРґРёС€РЅРёС‚Рµ X3D РјРѕРґРµР»Рё - РєРµС€РёСЂР°РЅРѕС‚Рѕ CCD РІРµС‡Рµ РЅРµ РѕРіСЂР°РЅРёС‡Р°РІР° РјР°РєСЃРёРјР°Р»РЅРёС‚Рµ С‡РµСЃС‚РѕС‚Рё.</p>
<h2>РџСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ РІ РёРіСЂРё</h2>
<p>Р’ РіРµР№РјРёРЅРі С‚РµСЃС‚РѕРІРµС‚Рµ 9950X3D Рµ <strong>РЅРµРґРѕСЃС‚РёР¶РёРј РІ РјРѕРјРµРЅС‚Р°</strong>. РџСЂРё 1080p (CPU-limited) СЂРµР·СѓР»С‚Р°С‚РёС‚Рµ СЃР°:</p>
<ul>
<li>Cyberpunk 2077 - 245 fps СЃСЂРµРґРЅРѕ (+18% vs 9800X3D)</li>
<li>CS2 - 680 fps СЃСЂРµРґРЅРѕ (+22% vs Intel Core Ultra 9 285K)</li>
<li>Microsoft Flight Simulator 2024 - 115 fps (+25% vs 9900X)</li>
</ul>
<p>РџРѕРґРѕР±СЂРµРЅРёСЏС‚Р° РёРґРІР°С‚ РѕС‚ РїРѕ-Р±СЉСЂР·РёСЏ Zen 5 IPC Рё СѓРІРµР»РёС‡РµРЅРёСЏ РєРµС€ - РґРІРѕР№РЅР° РїРѕР»Р·Р° РїСЂРё СЃРёР»РЅРѕ Р·Р°РІРёСЃРёРјРё РѕС‚ РєРµС€Р° РёРіСЂРё.</p>
<h2>РџСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ РІ СЃСЉРґСЉСЂР¶Р°С‚РµР»РЅРё Р·Р°РґР°С‡Рё</h2>
<p>Р—Р° СЂР°Р·Р»РёРєР° РѕС‚ 7950X3D, 9950X3D РЅРµ Р¶РµСЂС‚РІР° РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ РїСЂРё СЂРµРЅРґРµСЂРёСЂР°РЅРµ. Р’ Cinebench 2025 Multi-Core РЅР°РґРјРёРЅР°РІР° Core Ultra 9 285K СЃ РѕРєРѕР»Рѕ <strong>12%</strong>. РџСЂРё РєРѕРјРїРёР»Р°С†РёСЏ РЅР° РіРѕР»СЏРј C++ РїСЂРѕРµРєС‚ - 9950X3D Рµ ~8% РїРѕ-Р±СЉСЂР· РѕС‚ Intel.</p>
<h2>РўРµРјРїРµСЂР°С‚СѓСЂР° Рё РѕС…Р»Р°Р¶РґР°РЅРµ</h2>
<p>TDP Рµ 170W. AMD РїСЂРµРїРѕСЂСЉС‡РІР° РјРёРЅРёРјСѓРј 360 РјРј AIO РѕС…Р»Р°РґРёС‚РµР». РџСЂРё РґРѕР±СЂРѕ РѕС…Р»Р°Р¶РґР°РЅРµ С‚РµРјРїРµСЂР°С‚СѓСЂРёС‚Рµ СЃР° РѕРєРѕР»Рѕ 72В°C РїСЂРё full load - РѕС‚Р»РёС‡РЅРѕ Р·Р° 16-СЏРґСЂРµРЅ РїСЂРѕС†РµСЃРѕСЂ.</p>
<h2>РџР»Р°С‚С„РѕСЂРјР° AM5 Рё РЅР°РґСЃС‚СЂРѕР№РєР°</h2>
<p>РЎРѕРєРµС‚ AM5 РѕСЃРёРіСѓСЂСЏРІР° РґСЉР»РіРѕР»РµС‚РёРµ - РїР»Р°С‚РєРёС‚Рµ РѕС‚ X670E РєР»Р°СЃ РїРѕРґРґСЉСЂР¶Р°С‚ DDR5-6400+ Рё PCIe 5.0 x16. РђРєРѕ РІРµС‡Рµ РёРјР°С€ AM5 СЃРёСЃС‚РµРјР°, 9950X3D Рµ РґРёСЂРµРєС‚РЅР° РЅР°РґСЃС‚СЂРѕР№РєР° Р±РµР· СЃРјСЏРЅР° РЅР° РґСЉРЅРѕС‚Рѕ.</p>
<h2>Р—Р°РєР»СЋС‡РµРЅРёРµ</h2>
<p>9950X3D Рµ РїСЉСЂРІРёСЏС‚ РїСЂРѕС†РµСЃРѕСЂ, РїСЂРё РєРѕР№С‚Рѕ <em>РЅРµ Рµ РЅСѓР¶РµРЅ РєРѕРјРїСЂРѕРјРёСЃ</em> РјРµР¶РґСѓ РіРµР№РјРёРЅРі Рё РїСЂРѕРґСѓРєС‚РёРІРЅРѕСЃС‚. РЎРєСЉРї, РЅРѕ РѕРїСЂР°РІРґР°РЅ. <strong>РћС†РµРЅРєР°: 9.5 / 10</strong></p>`
  },
  {
    slug: 'intel-core-ultra-300-arrow-lake-2026',
    emoji: 'рџ”µ', cat: 'РќРѕРІРёРЅРё', title: 'Intel Core Ultra 300 (Arrow Lake-R) - РџСЂРµСЃРёС‡Р°РЅРµ РЅР° РїСЂРѕРїР°СЃС‚С‚Р°',
    date: '02 Р®РЅРё 2026', dateISO: '2026-06-02', read: '5 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'Intel Arrow Lake-R РґРѕРЅРµСЃРµ Р·РЅР°С‡РёС‚РµР»РЅРё РїРѕРґРѕР±СЂРµРЅРёСЏ СЃ BIOS РѕРїС‚РёРјРёР·Р°С†РёРё. Р’РµС‡Рµ Р»Рё Рµ РґРѕСЃС‚РѕРµРЅ РєРѕРЅРєСѓСЂРµРЅС‚ РЅР° AMD Ryzen 9000?',
    metaDesc: 'Intel Core Ultra 300 Arrow Lake-R СЂРµРІСЋ 2026 - IPC СЂСЉСЃС‚, BIOS РѕРїС‚РёРјРёР·Р°С†РёРё, AI Boost. РЎСЂР°РІРЅРµРЅРёРµ СЃ AMD Ryzen 9 9900X.',
    tags: ['Intel', 'РїСЂРѕС†РµСЃРѕСЂРё', 'Arrow Lake', 'РЅРѕРІРёРЅРё'],
    brand: 'intel', rating: '8.3',
    model: 'Core Ultra 9 285K', modelSub: 'Arrow Lake-R В· LGA1851', brandLabel: 'INTEL В· CPU',
    productImage: './images/products/43688.webp',
    verdict: 'Arrow Lake-R Р·Р°С‚РІР°СЂСЏ РіРѕР»СЏРјР° С‡Р°СЃС‚ РѕС‚ РїСЂРѕРїР°СЃС‚С‚Р° СЃ AMD. Р”РѕР±СЉСЂ РёР·Р±РѕСЂ Р·Р° AI СЂР°Р±РѕС‚РЅРё РЅР°С‚РѕРІР°СЂРІР°РЅРёСЏ Рё СЃРјРµСЃРµРЅР° СѓРїРѕС‚СЂРµР±Р°.',
    specs: {'РђСЂС…РёС‚РµРєС‚СѓСЂР°':'Lion Cove + Skymont E-cores','РЇРґСЂР°':'8P + 16E = 24 СЏРґСЂР°','Boost С‡РµСЃС‚РѕС‚Р°':'5.7 GHz','РљРµС€ (L3)':'36 MB','TDP':'125 W (253 W PL2)','РЎРѕРєРµС‚':'LGA1851 (Z890)','NPU':'48 TOPS'},
    body: `<h2>РљР°РєРІРѕ СЃРµ РїСЂРѕРјРµРЅРё РїСЂРё Arrow Lake-R?</h2>
<p>РЎРµСЂРёСЏС‚Р° Core Ultra 300 (Arrow Lake-R) Рµ РѕСЃРІРµР¶РµРЅ РІР°СЂРёР°РЅС‚ РЅР° Arrow Lake СЃ РЅРѕРІРё BIOS РјРёРєСЂРѕРєРѕРґРѕРІРµ, РѕРїС‚РёРјРёР·Р°С†РёРё Р·Р° Thread Director 2.0 Рё РїРѕРґРѕР±СЂРµРЅРё E-СЏРґСЂР° (Skymont). Intel РїСЂРёР·РЅР°РІР°, С‡Рµ РѕСЂРёРіРёРЅР°Р»РЅРёСЏС‚ Arrow Lake РЅРµ РїРѕСЃС‚РёРіРЅР° РѕС‡Р°РєРІР°РЅРёСЏС‚Р° РїСЂРё РіРµР№РјРёРЅРі - <strong>РѕСЃРІРµР¶РµРЅР°С‚Р° РІРµСЂСЃРёСЏ РєРѕСЂРёРіРёСЂР° Р·РЅР°С‡РёС‚РµР»РЅР° С‡Р°СЃС‚ РѕС‚ РїСЂРѕР±Р»РµРјРёС‚Рµ</strong>.</p>
<h2>Core Ultra 9 285K vs РїСЂРµРґС€РµСЃС‚РІРµРЅРёРєР°</h2>
<p>РџСЂРё РёРґРµРЅС‚РёС‡РµРЅ СЃРёР»РёС†РёР№, РЅРѕРІРёС‚Рµ BIOS РѕРїС‚РёРјРёР·Р°С†РёРё РЅРѕСЃСЏС‚:</p>
<ul>
<li>+11% СЃСЂРµРґРЅРѕ РІ РіРµР№РјРёРЅРі С‚РµСЃС‚РѕРІРµ РїСЂРё 1080p</li>
<li>+7% РІ Cinebench 2025 Multi-Core</li>
<li>-15W СЃСЂРµРґРЅР° РєРѕРЅСЃСѓРјР°С†РёСЏ РїСЂРё РёРіСЂРё</li>
</ul>
<p>Р РµР·СѓР»С‚Р°С‚РёС‚Рµ РїРѕСЃС‚Р°РІСЏС‚ 285K РїРѕ-Р±Р»РёР·Рѕ РґРѕ AMD Ryzen 9 9900X, РЅРѕ Р±РµР· 3D V-Cache РІР°СЂРёР°РЅС‚РёС‚Рµ, РіРµР№РјРёРЅРіСЉС‚ РІСЃРµ РѕС‰Рµ Рµ РїСЂРµРґРёРјСЃС‚РІРѕ РЅР° AMD.</p>
<h2>AI Boost - Intel NPU РІ РґРµР№СЃС‚РІРёРµ</h2>
<p>Arrow Lake-R РІРєР»СЋС‡РІР° NPU СЃ <strong>48 TOPS</strong> AI РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚. Microsoft Copilot+, Adobe Firefly Р»РѕРєР°Р»РЅРѕ Рё GitHub Copilot СЃ Р»РѕРєР°Р»РµРЅ РјРѕРґРµР» СЂР°Р±РѕС‚СЏС‚ Р·РЅР°С‡РёС‚РµР»РЅРѕ РїРѕ-РїР»Р°РІРЅРѕ. РђРєРѕ AI РёРЅСЃС‚СЂСѓРјРµРЅС‚РёС‚Рµ СЃР° РєР»СЋС‡РѕРІРё Р·Р° СЂР°Р±РѕС‚Р°С‚Р° С‚Рё - Intel Рµ РїРѕ-РґРѕР±СЂР°С‚Р° РїР»Р°С‚С„РѕСЂРјР° РІ РјРѕРјРµРЅС‚Р°.</p>
<h2>РџР»Р°С‚С„РѕСЂРјР° LGA1851 Рё РїР°РјРµС‚</h2>
<p>Core Ultra 300 РёР·РёСЃРєРІР° DDR5 - DDR4 РІРµС‡Рµ РЅРµ СЃРµ РїРѕРґРґСЉСЂР¶Р°. РћРїС‚РёРјР°Р»РЅРѕС‚Рѕ Рµ DDR5-6400 CL32. Intel РїСЂРµРїРѕСЂСЉС‡РІР° РїР»Р°С‚РєРё РѕС‚ Z890 РєР»Р°СЃ Р·Р° РјР°РєСЃРёРјР°Р»РЅР° РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚. PCIe 5.0 x16 Р·Р° GPU Рё x4 Р·Р° NVMe SSD СЃР° СЃС‚Р°РЅРґР°СЂС‚.</p>
<h2>Р—Р° РєРѕРіРѕ Рµ Intel Core Ultra 300?</h2>
<p>РђРєРѕ СЂР°Р±РѕС‚РёС€ РёРЅС‚РµРЅР·РёРІРЅРѕ СЃ AI РёРЅСЃС‚СЂСѓРјРµРЅС‚Рё, РЅСѓР¶РґР°РµС€ СЃРµ РѕС‚ Thunderbolt 5, РёР»Рё РІРµС‡Рµ РёРјР°С€ LGA1851 РїР»Р°С‚РєР° - Core Ultra 300 Рµ Р»РѕРіРёС‡РЅРёСЏС‚ РёР·Р±РѕСЂ. Р—Р° С‡РёСЃС‚ РіРµР№РјРёРЅРі AMD РІСЃРµ РѕС‰Рµ РґСЉСЂР¶Рё РєРѕСЂРѕРЅР°С‚Р°. Р—Р° СЃРјРµСЃРµРЅР° СѓРїРѕС‚СЂРµР±Р° РґРІРµС‚Рµ РїР»Р°С‚С„РѕСЂРјРё СЃР° РїСЂР°РєС‚РёС‡РµСЃРєРё СЂР°РІРЅРё.</p>
<h2>Р—Р°РєР»СЋС‡РµРЅРёРµ</h2>
<p>Intel СЃРµ РІСЉСЂРЅР° РІ РёРіСЂР°С‚Р° СЃ Arrow Lake-R. РќРµ Рµ РїРµСЂС„РµРєС‚РµРЅ, РЅРѕ Рµ Р·РЅР°С‡РёС‚РµР»РЅРѕ РїРѕРґРѕР±СЂРµРЅ. РћС‡Р°РєРІР°РјРµ Panther Lake (РєСЂР°СЏ РЅР° 2026) РґР° Р·Р°С‚РІРѕСЂРё РѕРєРѕРЅС‡Р°С‚РµР»РЅРѕ РїСЂРѕРїР°СЃС‚С‚Р° СЃ AMD. <strong>РћС†РµРЅРєР°: 8.3 / 10</strong></p>`
  },
  {
    slug: 'amd-ryzen-7-9800x3d-review-2026',
    emoji: 'рџ”ґ', cat: 'Р РµРІСЋ', title: 'AMD Ryzen 7 9800X3D - РќР°Р№-РґРѕР±СЂРёСЏС‚ РіРµР№РјСЉСЂСЃРєРё РїСЂРѕС†РµСЃРѕСЂ Р·Р° РїР°СЂРёС‚Рµ',
    date: '26 РњР°Р№ 2026', dateISO: '2026-05-26', read: '6 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'Ryzen 7 9800X3D РїСЂРµРґР»Р°РіР° 9950X3D РіРµР№РјРёРЅРі РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ РЅР° РїРѕР»РѕРІРёРЅ С†РµРЅР°. РўРµСЃС‚РІР°С…РјРµ РіРѕ РІ 12 РёРіСЂРё Рё РїСЂРё СЂРµРЅРґРµСЂРёСЂР°РЅРµ.',
    metaDesc: 'AMD Ryzen 7 9800X3D СЂРµРІСЋ 2026 - С‚РµСЃС‚ РІ РёРіСЂРё, Zen 5 + 3D V-Cache, СЃСЂР°РІРЅРµРЅРёРµ СЃ 9950X3D. РќР°Р№-РґРѕР±СЂРёСЏС‚ РіРµР№РјСЉСЂСЃРєРё CPU Р·Р° С†РµРЅР°С‚Р°.',
    tags: ['AMD', 'РїСЂРѕС†РµСЃРѕСЂРё', 'РіРµР№РјРёРЅРі', 'СЂРµРІСЋ'],
    brand: 'amd', rating: '9.4',
    model: 'Ryzen 7 9800X3D', modelSub: 'Zen 5 В· 3D V-Cache В· AM5', brandLabel: 'AMD В· CPU',
    productImage: './images/products/44485.webp',
    verdict: 'РђР±СЃРѕР»СЋС‚РЅРёСЏС‚ РєСЂР°Р» РЅР° РіРµР№РјРёРЅРі РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ Р·Р° С†РµРЅР°С‚Р°. РђРєРѕ Р±СЋРґР¶РµС‚СЉС‚ РЅРµ РїРѕР·РІРѕР»СЏРІР° 9950X3D - 9800X3D Рµ РїСЂР°РІРёР»РЅРёСЏС‚ РёР·Р±РѕСЂ.',
    specs: {'РђСЂС…РёС‚РµРєС‚СѓСЂР°':'Zen 5 (TSMC 4nm)','РЇРґСЂР° / РќРёС€РєРё':'8C / 16T','Boost С‡РµСЃС‚РѕС‚Р°':'5.7 GHz','РљРµС€ (L3)':'96 MB 3D V-Cache','TDP':'120 W','РЎРѕРєРµС‚':'AM5 (LGA1718)'},
    body: `<h2>Р—Р°С‰Рѕ 9800X3D Рµ СЃРїРµС†РёР°Р»РµРЅ?</h2>
<p>AMD Ryzen 7 9800X3D СЃСЉС‡РµС‚Р°РІР° Zen 5 IPC СЃ 96 MB 3D V-Cache - РєРѕРјР±РёРЅР°С†РёСЏ, РєРѕСЏС‚Рѕ Рµ РїРѕС‡С‚Рё РЅРµРґРѕСЃС‚РёР¶РёРјР° РІ РіРµР№РјРёРЅРі РїСЂРё CPU-limited СЃС†РµРЅР°СЂРёРё. Р—Р° СЂР°Р·Р»РёРєР° РѕС‚ 7800X3D, РЅРѕРІРѕС‚Рѕ РїРѕРєРѕР»РµРЅРёРµ РЅРµ Р¶РµСЂС‚РІР° С‡РµСЃС‚РѕС‚Р° Р·Р° РєРµС€ - 5.7 GHz boost Рµ СЂРµР°Р»РµРЅ Рё РїРѕСЃС‚РёР¶РёРј РїСЂРё РѕС…Р»Р°Р¶РґР°РЅРµ СЃ 240+ РјРј AIO.</p>
<h2>Р“РµР№РјРёРЅРі С‚РµСЃС‚РѕРІРµ РїСЂРё 1080p</h2>
<p>РџСЂРё <strong>1080p CPU-limited</strong> С‚РµСЃС‚РѕРІРµ 9800X3D e:</p>
<ul>
<li>Cyberpunk 2077 - 275 fps СЃСЂРµРґРЅРѕ</li>
<li>CS2 - 620 fps СЃСЂРµРґРЅРѕ</li>
<li>Hogwarts Legacy - 198 fps СЃСЂРµРґРЅРѕ</li>
<li>Star Wars Outlaws - 165 fps СЃСЂРµРґРЅРѕ</li>
<li>Microsoft Flight Simulator 2024 - 108 fps СЃСЂРµРґРЅРѕ</li>
</ul>
<p>Р Р°Р·Р»РёРєР°С‚Р° СЃРїСЂСЏРјРѕ Ryzen 9 9950X3D Рµ РїРѕРґ <strong>8% РІ РїРѕРІРµС‡РµС‚Рѕ РёРіСЂРё</strong> - РЅРµР·РЅР°С‡РёС‚РµР»РЅР° Р·Р° РїСЂР°РєС‚РёС‡РµСЃРєРё СѓРїРѕС‚СЂРµР±Рё РїСЂРё 1440p СЃ RTX 4070+ GPU.</p>
<h2>РџСЂРѕРґСѓРєС‚РёРІРЅРѕСЃС‚ - СЃР»Р°Р±Р°С‚Р° СЃС‚СЂР°РЅР°?</h2>
<p>РџСЂРё 8 СЏРґСЂР° СЃСЂРµС‰Сѓ 16 РїСЂРё 9950X3D, СЂР°Р·Р»РёРєР°С‚Р° РІ СЂРµРЅРґРµСЂРёСЂР°РЅРµ Рµ СЂРµР°Р»РЅР°: Blender Classroom - 9800X3D Рµ ~42% РїРѕ-Р±Р°РІРµРЅ. Р—Р° С‡РёСЃС‚Р° РїСЂРѕРґСѓРєС‚РёРІРЅР° СЂР°Р±РѕС‚Р° 9950X3D РёР»Рё 9900X СЃР° РїРѕ-РґРѕР±СЂРё. 9800X3D Рµ РѕРїС‚РёРјР°Р»РµРЅ Р·Р° РіРµР№РјСЉСЂРё, РєРѕРёС‚Рѕ РїРѕРЅСЏРєРѕРіР° СЃС‚СЂРёР№РјРІР°С‚ РёР»Рё РєРѕРјРїРёР»РёСЂР°С‚.</p>
<h2>РўРµРјРїРµСЂР°С‚СѓСЂР° Рё РїР»Р°С‚С„РѕСЂРјР°</h2>
<p>TDP Рµ 120W - РїРѕ-Р»РµСЃРµРЅ Р·Р° РѕС…Р»Р°Р¶РґР°РЅРµ РѕС‚ 9950X3D. 240 РјРј AIO Рµ РґРѕСЃС‚Р°С‚СЉС‡РµРЅ. Р Р°Р±РѕС‚Рё РЅР° РІСЃСЏРєР° AM5 РїР»Р°С‚РєР° СЃ Р°РєС‚СѓР°Р»РµРЅ BIOS. РџСЂРµРїРѕСЂСЉС‡РёС‚РµР»РЅР° РїР°РјРµС‚: DDR5-6000 CL30 РІ 2Г—16 GB РєРѕРЅС„РёРіСѓСЂР°С†РёСЏ.</p>
<h2>Р—Р°РєР»СЋС‡РµРЅРёРµ</h2>
<p>9800X3D Рµ РїСЂРѕС†РµСЃРѕСЂСЉС‚, РєРѕР№С‚Рѕ РїРѕРІРµС‡РµС‚Рѕ РіРµР№РјСЉСЂРё <em>РґРµР№СЃС‚РІРёС‚РµР»РЅРѕ</em> С‚СЂСЏР±РІР° РґР° РєСѓРїСЏС‚. РћС„РµСЂРёСЂР° 95% РѕС‚ РіРµР№РјРёРЅРі РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚С‚Р° РЅР° 9950X3D РЅР° РїРѕРґ 60% РѕС‚ С†РµРЅР°С‚Р°. <strong>РћС†РµРЅРєР°: 9.4 / 10</strong></p>`
  },
  {
    slug: 'intel-vs-amd-cpu-2026',
    emoji: 'вљ”пёЏ', cat: 'РЎСЂР°РІРЅРµРЅРёРµ', title: 'Intel vs AMD 2026 - РљРѕР№ РїСЂРѕС†РµСЃРѕСЂ РґР° РёР·Р±РµСЂРµРј?',
    productImage: './images/products/43688.webp',
    date: '19 РњР°Р№ 2026', dateISO: '2026-05-19', read: '7 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'Arrow Lake-R СЃСЂРµС‰Сѓ Zen 5 - РїСЉР»РЅРѕ СЃСЂР°РІРЅРµРЅРёРµ РїРѕ РіРµР№РјРёРЅРі, РїСЂРѕРґСѓРєС‚РёРІРЅРѕСЃС‚, AI Рё РїР»Р°С‚С„РѕСЂРјР°. РљРѕР№ РїРѕР±РµР¶РґР°РІР° РІ СЃСЂРµРґР°С‚Р° РЅР° 2026?',
    metaDesc: 'Intel vs AMD 2026 - СЃСЂР°РІРЅРµРЅРёРµ Core Ultra 300 Arrow Lake-R СЃСЂРµС‰Сѓ Ryzen 9000 Zen 5. РљРѕР№ CPU РґР° РєСѓРїРёРј Р·Р° РіРµР№РјРёРЅРі Рё СЂР°Р±РѕС‚Р°?',
    tags: ['Intel', 'AMD', 'РїСЂРѕС†РµСЃРѕСЂРё', 'СЃСЂР°РІРЅРµРЅРёРµ'],
    brand: 'general',
    body: `<h2>РџР»Р°С‚С„РѕСЂРјРё - AM5 СЃСЂРµС‰Сѓ LGA1851</h2>
<p><strong>AMD AM5</strong> Рµ РїРѕ-Р·СЂСЏР»Р° РїР»Р°С‚С„РѕСЂРјР° - СЃСЉС‰РµСЃС‚РІСѓРІР° РѕС‚ 2022 Рё РїРѕРґРґСЉСЂР¶Р° Ryzen 7000, 8000 Рё 9000 СЃРµСЂРёРё. РЎСЉС‰РµСЃС‚РІСѓРІР°С‰РёС‚Рµ AM5 РїР»Р°С‚РєРё (X670E, B650E, B650) СЂР°Р±РѕС‚СЏС‚ СЃ РЅРѕРІ BIOS. <strong>Intel LGA1851</strong> Рµ РїРѕ-РЅРѕРІР° - СЃР°РјРѕ Z890 Рё B860 РґСЉРЅРё, DDR5 Р·Р°РґСЉР»Р¶РёС‚РµР»РЅР°. AMD РґР°РІР° РїРѕ-РґСЉР»РіРѕС‚СЂР°Р№РЅР° РёРЅРІРµСЃС‚РёС†РёСЏ РІ РјРѕРјРµРЅС‚Р°.</p>
<h2>Р“РµР№РјРёРЅРі - AMD РґРѕРјРёРЅРёСЂР°</h2>
<p>РџСЂРё 1080p CPU-limited РіРµР№РјРёРЅРі, Ryzen 7 9800X3D Рё 9950X3D СЃР° РЅРµРґРѕСЃС‚РёР¶РёРјРё Р·Р° Intel. Core Ultra 9 285K РёР·РѕСЃС‚Р°РІР° СЃ 15-25% РІ РєРµС€РѕРІРѕ-Р·Р°РІРёСЃРёРјРё РёРіСЂРё. Р‘РµР· 3D V-Cache Intel РіСѓР±Рё РґРёСЂРµРєС‚РЅРёСЏ РґСѓРµР». РџСЂРё 1440p Рё 4K СЃ РјРѕС‰РЅР° GPU СЂР°Р·Р»РёРєР°С‚Р° РЅР°РјР°Р»СЏРІР° РґРѕ РїРѕРґ 5% - РїСЂР°РєС‚РёС‡РµСЃРєРё РЅРµР·РЅР°С‡РёС‚РµР»РЅР°.</p>
<h2>РџСЂРѕРґСѓРєС‚РёРІРЅРѕСЃС‚ - РїРѕ-РёР·СЂР°РІРЅРµРЅР° Р±РёС‚РєР°</h2>
<p>Р’ Cinebench 2025 Multi-Core: Core Ultra 9 285K Рµ РѕРєРѕР»Рѕ 8% РїСЂРµРґ Ryzen 9 9900X, РЅРѕ 12% Р·Р°Рґ 9950X3D. РџСЂРё video export (DaVinci Resolve) Intel Рµ РїРѕ-Р±СЉСЂР· СЃ ~6% СЃРїСЂСЏРјРѕ 9900X. AMD РїРµС‡РµР»Рё РїСЂРё РєРѕРјРїРёР»Р°С†РёСЏ Рё РЅР°СѓС‡РЅРё РёР·С‡РёСЃР»РµРЅРёСЏ Р±Р»Р°РіРѕРґР°СЂРµРЅРёРµ РЅР° РїРѕ-РіРѕР»СЏРј РєРµС€.</p>
<h2>AI - Intel NPU СЃСЂРµС‰Сѓ AMD XDNA 2</h2>
<p>Intel Core Ultra 300 РїСЂРµРґР»Р°РіР° <strong>48 TOPS NPU</strong>, AMD Ryzen 9000 - <strong>50 TOPS XDNA 2</strong>. Р”РІРµС‚Рµ РїР»Р°С‚С„РѕСЂРјРё СЃР° РїСЂР°РєС‚РёС‡РµСЃРєРё СЂР°РІРЅРё РїСЂРё Р»РѕРєР°Р»РµРЅ AI РёРЅС„РµСЂ. Microsoft Copilot+ СЂР°Р±РѕС‚Рё РґРѕР±СЂРµ Рё РЅР° РґРІРµС‚Рµ.</p>
<h2>РџСЂРµРїРѕСЂСЉРєРё РїРѕ СЃР»СѓС‡Р°Р№</h2>
<ul>
<li><strong>Р§РёСЃС‚ РіРµР№РјРёРЅРі</strong> в†’ AMD Ryzen 7 9800X3D</li>
<li><strong>Р“РµР№РјРёРЅРі + РїСЂРѕРґСѓРєС‚РёРІРЅРѕСЃС‚</strong> в†’ AMD Ryzen 9 9950X3D</li>
<li><strong>AI СЂР°Р±РѕС‚РЅРё РЅР°С‚РѕРІР°СЂРІР°РЅРёСЏ + Thunderbolt 5</strong> в†’ Intel Core Ultra 9 285K</li>
<li><strong>Р‘СЋРґР¶РµС‚ РґРѕ 200 в‚¬</strong> в†’ Intel Core i5-14600K РёР»Рё AMD Ryzen 5 9600X</li>
</ul>
<h2>Р—Р°РєР»СЋС‡РµРЅРёРµ</h2>
<p>AMD РїРµС‡РµР»Рё 2026 РїСЂРё РіРµР№РјРёРЅРі. Intel РѕС‚РіРѕРІР°СЂСЏ СЃ РїРѕ-РґРѕР±СЂРё AI РёРЅСЃС‚СЂСѓРјРµРЅС‚Рё Рё Thunderbolt 5. Р—Р° РїРѕРІРµС‡РµС‚Рѕ РїРѕС‚СЂРµР±РёС‚РµР»Рё - AMD Рµ РїРѕ-РґРѕР±СЂРѕС‚Рѕ СЂРµС€РµРЅРёРµ РІ РјРѕРјРµРЅС‚Р°.</p>`
  },
  {
    slug: 'palit-rtx-4080-super-jetstream-review',
    emoji: 'рџЋ®', cat: 'Р РµРІСЋ', title: 'Palit RTX 4080 Super JetStream OC - Р—Р° 4K Р±РµР· РєРѕРјРїСЂРѕРјРёСЃ',
    date: '12 РњР°Р№ 2026', dateISO: '2026-05-12', read: '5 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'RTX 4080 Super СЃ JetStream РѕС…Р»Р°РґРёС‚РµР»СЏ РЅР° Palit Рµ РѕС‚РіРѕРІРѕСЂСЉС‚ Р·Р° РёСЃС‚РёРЅСЃРєРѕ 4K РіРµР№РјРёРЅРі. РўРµСЃС‚РІР°С…РјРµ РіРѕ РїСЂРё РјР°РєСЃРёРјР°Р»РЅРё РЅР°СЃС‚СЂРѕР№РєРё.',
    metaDesc: 'Palit RTX 4080 Super JetStream OC СЂРµРІСЋ 2026 - 4K РіРµР№РјРёРЅРі С‚РµСЃС‚, С‚РµРјРїРµСЂР°С‚СѓСЂРё, СЃСЂР°РІРЅРµРЅРёРµ СЃ RTX 4070 Ti Super. Worth it?',
    tags: ['Nvidia', 'Palit', 'GPU', 'РіРµР№РјРёРЅРі', 'СЂРµРІСЋ'],
    brand: 'palit', rating: '8.9',
    model: 'RTX 4080 Super', modelSub: 'JetStream OC В· 16 GB', brandLabel: 'PALIT В· GPU',
    productImage: './images/products/38666.webp',
    verdict: 'РћРїС‚РёРјР°Р»РЅРёСЏС‚ РёР·Р±РѕСЂ Р·Р° 4K РіРµР№РјРёРЅРі СЃ Р±СЋРґР¶РµС‚ РїРѕРґ 2000 в‚¬. JetStream РѕС…Р»Р°РґРёС‚РµР»СЏС‚ РіРѕ РїСЂР°РІРё С‚РёС… РґРѕСЂРё РїСЂРё РјР°РєСЃРёРјР°Р»РЅРѕ РЅР°С‚РѕРІР°СЂРІР°РЅРµ.',
    specs: {'GPU С‡РёРї':'Ada Lovelace AD102','CUDA СЏРґСЂР°':'10 240','РџР°РјРµС‚':'16 GB GDDR6X, 256-bit','Boost Clock':'2595 MHz (factory OC)','TDP':'320 W','РћС…Р»Р°РґРёС‚РµР»':'JetStream 3Г—100 РјРј'},
    body: `<h2>RTX 4080 Super - РїРѕР·РёС†РёСЏС‚Р° РІ Р»РёРЅРµР№РєР°С‚Р°</h2>
<p>RTX 4080 Super Р·Р°РїСЉР»РІР° РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕС‚Рѕ РјРµР¶РґСѓ RTX 4070 Ti Super Рё RTX 4090. РЎ 10 240 CUDA СЏРґСЂР° Рё 16 GB GDDR6X РЅР° 256-Р±РёС‚РѕРІР° С€РёРЅР°, РєР°СЂС‚Р°С‚Р° РїСЂРµРґР»Р°РіР° РѕРєРѕР»Рѕ <strong>15% РїРѕРІРµС‡Рµ РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚</strong> СЃРїСЂСЏРјРѕ RTX 4070 Ti Super РїСЂРё ~20% РїРѕ-РІРёСЃРѕРєР° С†РµРЅР°. Palit JetStream OC РІРµСЂСЃРёСЏС‚Р° РёРґРІР° СЃ factory overclock РґРѕ 2595 MHz boost.</p>
<h2>4K РіРµР№РјРёРЅРі РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚</h2>
<p>РџСЂРё <strong>4K Ultra</strong> РЅР°СЃС‚СЂРѕР№РєРё Р±РµР· ray tracing:</p>
<ul>
<li>Cyberpunk 2077 - 82 fps СЃСЂРµРґРЅРѕ</li>
<li>Alan Wake 2 - 74 fps СЃСЂРµРґРЅРѕ</li>
<li>Red Dead Redemption 2 - 98 fps СЃСЂРµРґРЅРѕ</li>
<li>Microsoft Flight Simulator 2024 - 72 fps СЃСЂРµРґРЅРѕ</li>
</ul>
<p>РЎ DLSS 3 Quality (СЂРµРЅРґРµСЂ РїСЂРё 1440p) С‡РёСЃР»Р°С‚Р° СЃРєР°С‡Р°С‚ РґРѕ 130-165 fps - 4K РіРµР№РјРёРЅРі РЅР°Рґ 60 fps Рµ РїРѕСЃС‚РёР¶РёРјРѕ Р±РµР· Frame Generation РїСЂРё РїРѕРІРµС‡РµС‚Рѕ Р·Р°РіР»Р°РІРёСЏ.</p>
<h2>Ray Tracing Рё DLSS 3</h2>
<p>RTX 4080 Super Рµ <strong>Р·РЅР°С‡РёС‚РµР»РЅРѕ РїРѕ-РґРѕР±СЉСЂ РѕС‚ RTX 4070 Ti Super РїСЂРё RT</strong> - 18-22% СЂР°Р·Р»РёРєР° РїСЂРё Path Tracing РІ Cyberpunk 2077. Frame Generation СѓРґРІРѕСЏРІР° fps РїСЂРё GPU-bound СЃС†РµРЅР°СЂРёРё, Р° Reflex 2 Р·Р°РїР°Р·РІР° Р»Р°С‚РµРЅС‚РЅРѕСЃС‚С‚Р° РїРѕРґ РєРѕРЅС‚СЂРѕР».</p>
<h2>РўРµРјРїРµСЂР°С‚СѓСЂРё Рё С€СѓРј</h2>
<p>Palit JetStream РѕС…Р»Р°РґРёС‚РµР»СЏС‚ СЃ С‚СЂРё 100 РјРј РІРµРЅС‚РёР»Р°С‚РѕСЂР° РґСЉСЂР¶Рё GPU РЅР° 72В°C РїСЂРё full load РїСЂРё СЃС‚Р°Р№РЅР° С‚РµРјРїРµСЂР°С‚СѓСЂР° 22В°C. РЁСѓРјРЅРѕС‚Рѕ РЅРёРІРѕ Рµ 38 dBA - РїСЂР°РєС‚РёС‡РµСЃРєРё Р±РµР·С€СѓРјРµРЅ РІ Р·Р°С‚РІРѕСЂРµРЅ РєРѕСЂРїСѓСЃ. Р’РµРЅС‚РёР»Р°С‚РѕСЂРёС‚Рµ СЃРїРёСЂР°С‚ РЅР°РїСЉР»РЅРѕ РїСЂРё 2D РЅР°С‚РѕРІР°СЂРІР°РЅРµ.</p>
<h2>Р—Р°РєР»СЋС‡РµРЅРёРµ</h2>
<p>Palit RTX 4080 Super JetStream OC Рµ РїСЂР°РІРёР»РЅРёСЏС‚ РёР·Р±РѕСЂ Р·Р° 4K РіРµР№РјСЉСЂРё, РєРѕРёС‚Рѕ РЅРµ РёСЃРєР°С‚ РґР° РїР»Р°С‰Р°С‚ RTX 4090 С†РµРЅР°. РџСЂРё 1440p - RTX 4070 Super Рµ РїРѕ-РґРѕР±СЂР°С‚Р° СЃС‚РѕР№РЅРѕСЃС‚. <strong>РћС†РµРЅРєР°: 8.9 / 10</strong></p>`
  },
  {
    slug: 'ddr5-6000-gaming-guide-2026',
    emoji: 'рџ§ ', cat: 'РЎСЉРІРµС‚Рё', title: 'DDR5 РїР°РјРµС‚ Р·Р° РіРµР№РјРёРЅРі 2026 - РљРѕР»РєРѕ Рё РєР°РєРІР°?',
    date: '05 РњР°Р№ 2026', dateISO: '2026-05-05', read: '5 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'DDR5-6000 РёР»Рё DDR5-6400? 32 GB РёР»Рё 64 GB? РџСЉР»РµРЅ РЅР°СЂСЉС‡РЅРёРє Р·Р° РёР·Р±РѕСЂ РЅР° РїР°РјРµС‚ Р·Р° AMD AM5 Рё Intel LGA1851.',
    metaDesc: 'DDR5 РїР°РјРµС‚ Р·Р° РіРµР№РјРёРЅРі 2026 - DDR5-6000 vs 6400, 32 GB vs 64 GB, AMD AM5 Рё Intel Z890. РљР°Рє РґР° РёР·Р±РµСЂРµРј РїСЂР°РІРёР»РЅРѕ.',
    tags: ['РїР°РјРµС‚', 'DDR5', 'AM5', 'СЃСЉРІРµС‚Рё'],
    brand: 'general',
    productImage: './images/products/37086.webp',
    body: `<h2>РљРѕР»РєРѕ GB РїР°РјРµС‚ Рµ РЅСѓР¶РЅР° Р·Р° РіРµР№РјРёРЅРі?</h2>
<p><strong>32 GB (2Г—16 GB)</strong> Рµ СЃС‚Р°РЅРґР°СЂС‚СЉС‚ Р·Р° 2026. РџРѕРІРµС‡РµС‚Рѕ СЃСЉРІСЂРµРјРµРЅРЅРё РёРіСЂРё РёР·РїРѕР»Р·РІР°С‚ 16-24 GB РїСЂРё РјР°РєСЃРёРјР°Р»РЅРё РЅР°СЃС‚СЂРѕР№РєРё. 64 GB РёРјР° СЃРјРёСЃСЉР» СЃР°РјРѕ Р°РєРѕ РїСЂР°РІРёС€ РµРґРЅРѕРІСЂРµРјРµРЅРЅРѕ РіРµР№РјРёРЅРі + СЃС‚СЂРёР№РјРёРЅРі + РІРёРґРµРѕ РјРѕРЅС‚Р°Р¶. Р—Р° С‡РёСЃС‚ РіРµР№РјРёРЅРі 32 GB Рµ РѕРїС‚РёРјР°Р»РЅРѕС‚Рѕ.</p>
<h2>DDR5-6000 vs DDR5-6400 - РєР°РєРІР° Рµ СЂР°Р·Р»РёРєР°С‚Р°?</h2>
<p>Р—Р° <strong>AMD AM5</strong> - DDR5-6000 CL30 Рµ РѕРїС‚РёРјР°Р»РЅРѕС‚Рѕ: РїРѕРїР°РґР° РІ EXPO РїСЂРѕС„РёР»Р° Рё СЃРёРЅС…СЂРѕРЅРёР·РёСЂР° Infinity Fabric РєСЉРј 2000 MHz (1:1 СЂРµР¶РёРј). DDR5-6400 CL32 Рµ Р»РµРєРѕ РїРѕ-Р±СЉСЂР·Рѕ, РЅРѕ С†РµРЅР°С‚Р° Рµ РЅРµРїСЂРѕРїРѕСЂС†РёРѕРЅР°Р»РЅР°. РќР°Рґ DDR5-6400 AM5 РїСЂРµРјРёРЅР°РІР° РІ 1:2 СЂРµР¶РёРј Рё РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚С‚Р° РїР°РґР°.</p>
<p>Р—Р° <strong>Intel LGA1851</strong> - DDR5-6400 CL32 Рµ РїСЂРµРїРѕСЂСЉС‡РёС‚РµР»РЅРѕС‚Рѕ. Intel XMP РїСЂРѕС„РёР»РёС‚Рµ СЃР° РґРѕР±СЂРµ РѕРїС‚РёРјРёР·РёСЂР°РЅРё РґРѕ С‚Р°Р·Рё С‡РµСЃС‚РѕС‚Р°. РџРѕ-Р±СЉСЂР·Р°С‚Р° РїР°РјРµС‚ РЅРѕСЃРё РјРёРЅРёРјР°Р»РЅРё РїРѕР»Р·Рё РїСЂРё СЂРµР°Р»РЅР° СѓРїРѕС‚СЂРµР±Р°.</p>
<h2>Dual Channel - Р·Р°РґСЉР»Р¶РёС‚РµР»РµРЅ</h2>
<p>РќРёРєРѕРіР° РЅРµ РєСѓРїСѓРІР°Р№ РµРґРёРЅ РјРѕРґСѓР». 2Г—16 GB dual channel Рµ <strong>Р·РЅР°С‡РёС‚РµР»РЅРѕ РїРѕ-Р±СЉСЂР·Р°</strong> РѕС‚ 1Г—32 GB single channel - РґРѕ 20% СЂР°Р·Р»РёРєР° РІ РіРµР№РјРёРЅРі РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚. РђРєРѕ РёРјР°С€ Р±СЋРґР¶РµС‚ Р·Р° 64 GB - 2Г—32 GB РІРјРµСЃС‚Рѕ 4Г—16 GB (РїРѕ-РјР°Р»РєРѕ СЃС‚СЂРµСЃ РІСЉСЂС…Сѓ РєРѕРЅС‚СЂРѕР»РµСЂР°).</p>
<h2>CL (CAS Latency) - РІР°Р¶РµРЅ Р»Рё Рµ?</h2>
<p>РџСЂРё СЂР°РІРЅРё С‡РµСЃС‚РѕС‚Рё - РїРѕ-РЅРёСЃСЉРє CL Рµ РїРѕ-РґРѕР±СЉСЂ. DDR5-6000 CL30 Рµ РїРѕ-Р±СЉСЂР·Р° РѕС‚ DDR5-6000 CL36. Р¤РѕСЂРјСѓР»Р°С‚Р° Рµ: <strong>Р»Р°С‚РµРЅС‚РЅРѕСЃС‚ (ns) = (CL / С‡РµСЃС‚РѕС‚Р°) Г— 2000</strong>. РџСЂРё DDR5-6000 CL30: 10 ns - РѕС‚Р»РёС‡РЅРѕ.</p>
<h2>РџСЂРµРїРѕСЂСЉРєРё Р·Р° РїР»Р°С‚С„РѕСЂРјР°</h2>
<ul>
<li><strong>AMD AM5 (Ryzen 9000)</strong> в†’ DDR5-6000 CL30, 2Г—16 GB</li>
<li><strong>Intel LGA1851 (Core Ultra 300)</strong> в†’ DDR5-6400 CL32, 2Г—16 GB</li>
<li><strong>AMD AM4 (Ryzen 5000)</strong> в†’ РІСЃРµ РѕС‰Рµ DDR4-3600 CL18</li>
</ul>`
  },
  {
    slug: 'byudzhetna-gaming-sistema-2026',
    emoji: 'рџ–Ґ', cat: 'РЎСЉРІРµС‚Рё', title: 'Р‘СЋРґР¶РµС‚РЅР° РіРµР№РјРёРЅРі СЃРёСЃС‚РµРјР° Р·Р° 2026 - РїР»Р°РЅ Р·Р° 800 в‚¬',
    date: '28 РђРїСЂРёР» 2026', dateISO: '2026-04-28', read: '6 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'РљР°Рє РґР° СЃРіР»РѕР±РёРј РїСЉР»РЅР° РіРµР№РјРёРЅРі СЃРёСЃС‚РµРјР° Р·Р° РѕРєРѕР»Рѕ 800 в‚¬ СЃ РєРѕРјРїРѕРЅРµРЅС‚Рё, РЅР°Р»РёС‡РЅРё РІ РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ. РЎСЉРІРµС‚Рё Р·Р° РІСЃРµРєРё Р±СЋРґР¶РµС‚.',
    metaDesc: 'Р‘СЋРґР¶РµС‚РЅР° РіРµР№РјРёРЅРі СЃРёСЃС‚РµРјР° 2026 - AMD Ryzen 5 9600X, Palit RTX 4060, B650 РґСЉРЅР°. РљР°Рє РґР° РёР·Р±РµСЂРµРј РїСЂР°РІРёР»РЅРёС‚Рµ РєРѕРјРїРѕРЅРµРЅС‚Рё Р·Р° 800 в‚¬.',
    tags: ['РіРµР№РјРёРЅРі', 'AMD', 'Palit', 'СЃСЉРІРµС‚Рё', 'build'],
    brand: 'general',
    productImage: './images/products/35948.webp',
    body: `<h2>РЎС‚СЂР°С‚РµРіРёСЏ: CPU РёР»Рё GPU - РєРѕРµ Рµ РїРѕ-РІР°Р¶РЅРѕ?</h2>
<p>Р—Р° РіРµР№РјРёРЅРі <strong>GPU-С‚Рѕ Рµ РїРѕ-РІР°Р¶РЅРѕ</strong>. РџСЂРё РѕРіСЂР°РЅРёС‡РµРЅ Р±СЋРґР¶РµС‚ - РІР»РѕР¶Рё РїРѕРІРµС‡Рµ РІ РІРёРґРµРѕРєР°СЂС‚Р°С‚Р°. Ryzen 5 9600X Р·Р° 220 в‚¬ + RTX 4060 8GB Р·Р° 310 в‚¬ Рµ РїРѕ-РґРѕР±СЂР° РіРµР№РјРёРЅРі СЃРёСЃС‚РµРјР° РѕС‚ Ryzen 9 9950X3D + GTX 1660 Super. РџСЂР°РІРёР»РѕС‚Рѕ: GPU = 40-50% РѕС‚ Р±СЋРґР¶РµС‚Р°.</p>
<h2>РџСЂРёРјРµСЂРЅР° РєРѕРЅС„РёРіСѓСЂР°С†РёСЏ Р·Р° ~800 в‚¬</h2>
<ul>
<li><strong>CPU:</strong> AMD Ryzen 5 9600X - 220 в‚¬ (6 СЏРґСЂР°, Zen 5, 5.9 GHz boost)</li>
<li><strong>GPU:</strong> Palit GeForce RTX 4060 8GB - 310 в‚¬ (DLSS 3, Frame Gen, 1080p/1440p)</li>
<li><strong>Р”СЉРЅР°:</strong> ASRock B650M-HDV/M.2 AM5 - 110 в‚¬ (B650, PCIe 4.0, 2Г— DDR5)</li>
<li><strong>RAM:</strong> DDR5-6000 CL30 2Г—8 GB - 65 в‚¬ (РґРѕСЃС‚Р°С‚СЉС‡РЅРѕ Р·Р° РіРµР№РјРёРЅРі)</li>
<li><strong>SSD:</strong> 1 TB NVMe Gen4 - 60 в‚¬</li>
<li><strong>Р—Р°С…СЂР°РЅРІР°РЅРµ:</strong> 650W 80+ Bronze - 55 в‚¬</li>
</ul>
<p><strong>РћР±С‰Рѕ: ~820 в‚¬</strong> - РїСЉР»РЅР° СЃРёСЃС‚РµРјР° Р±РµР· РєРѕСЂРїСѓСЃ Рё РѕС…Р»Р°РґСЏРІР°РЅРµ.</p>
<h2>RTX 4060 - РґРѕР±СЂР° Р»Рё Рµ Р·Р° РїР°СЂРёС‚Рµ?</h2>
<p>РџСЂРё 1080p Ultra - RTX 4060 РїРѕСЃС‚РёРіР° 85-120 fps РІ РїРѕРІРµС‡РµС‚Рѕ AAA Р·Р°РіР»Р°РІРёСЏ. РЎ DLSS 3 Frame Generation СЂРµР·СѓР»С‚Р°С‚РёС‚Рµ РїСЂРё 1440p СЃР° РёР·РЅРµРЅР°РґРІР°С‰Рѕ РґРѕР±СЂРё (65-90 fps). Р—Р° РіРµР№РјСЉСЂРё СЃ 1080p РјРѕРЅРёС‚РѕСЂ Рµ РѕС‚Р»РёС‡РµРЅ РёР·Р±РѕСЂ. Р—Р° 1440p - РїСЂРµРїРѕСЂСЉС‡РІР°РјРµ RTX 4070 Super.</p>
<h2>РљР°Рє РґР° РЅР°РґРіСЂР°РґРёС€ РїРѕ-РєСЉСЃРЅРѕ?</h2>
<p>AM5 РїР»Р°С‚С„РѕСЂРјР°С‚Р° РїРѕРґРґСЉСЂР¶Р° РґРѕ Ryzen 9000 СЃРµСЂРёСЏ - РјРѕР¶РµС€ РґР° СЃРјРµРЅРёС€ CPU РїРѕ-РєСЉСЃРЅРѕ Р±РµР· СЃРјСЏРЅР° РЅР° РґСЉРЅРѕС‚Рѕ. Р—Р°С…СЂР°РЅРІР°РЅРµС‚Рѕ РѕС‚ 650W РїРѕРґРґСЉСЂР¶Р° РґРѕ RTX 4080 Super РЅР°РґСЃС‚СЂРѕР№РєР°. РРЅРІРµСЃС‚РёСЂР°Р№ РІ РґРѕР±СЂРѕ Р·Р°С…СЂР°РЅРІР°РЅРµ РѕС‚ СЃР°РјРѕС‚Рѕ РЅР°С‡Р°Р»Рѕ.</p>
<h2>РЎСЉРІРµС‚ Р·Р° СЃРїРµСЃС‚СЏРІР°РЅРµ</h2>
<p>РђРєРѕ Р±СЋРґР¶РµС‚СЉС‚ Рµ РїРѕРґ 700 в‚¬ - Р·Р°РјРµРЅРё Ryzen 5 9600X СЃ Ryzen 5 9600 (MPK РІРµСЂСЃРёСЏ, ~185 в‚¬) Рё RTX 4060 СЃ RTX 3060 12GB (~250 в‚¬). РЎРёСЃС‚РµРјР°С‚Р° С‰Рµ Рµ РѕРєРѕР»Рѕ 100 в‚¬ РїРѕ-РµРІС‚РёРЅР° РїСЂРё СЃР°РјРѕ ~10% РїРѕ-РЅРёСЃРєР° РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚.</p>`
  },
  {
    slug: 'am5-motherboard-guide-2026',
    emoji: 'рџ”§', cat: 'РЎСЉРІРµС‚Рё', title: 'AM5 РґСЉРЅР° РїР»Р°С‚РєР° 2026 - ASRock, ASUS, Gigabyte РёР»Рё MSI?',
    date: '21 РђРїСЂРёР» 2026', dateISO: '2026-04-21', read: '6 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'B650 РёР»Рё X670? РљРѕР№ РїСЂРѕРёР·РІРѕРґРёС‚РµР» РїСЂРµРґР»Р°РіР° РЅР°Р№-РґРѕР±СЂРѕ РєР°С‡РµСЃС‚РІРѕ Р·Р° С†РµРЅР°С‚Р° РїСЂРё AM5 РїР»Р°С‚С„РѕСЂРјР°С‚Р°? РџСЉР»РµРЅ РЅР°СЂСЉС‡РЅРёРє.',
    metaDesc: 'AM5 РґСЉРЅР° РїР»Р°С‚РєР° 2026 - B650 vs X670E, ASRock vs ASUS vs Gigabyte vs MSI. РљРѕРµ РґСЉРЅРѕ РґР° РёР·Р±РµСЂРµРј Р·Р° AMD Ryzen 9000?',
    tags: ['РґСЉРЅРё РїР»Р°С‚РєРё', 'AM5', 'AMD', 'СЃСЉРІРµС‚Рё'],
    brand: 'general',
    productImage: './images/products/32593.webp',
    body: `<h2>B650 РёР»Рё X670E - РєР°РєРІРѕ РґР° РёР·Р±РµСЂРµРј?</h2>
<p><strong>B650</strong> Рµ РґРѕСЃС‚Р°С‚СЉС‡РµРЅ Р·Р° 95% РѕС‚ РїРѕС‚СЂРµР±РёС‚РµР»РёС‚Рµ. РџРѕРґРґСЉСЂР¶Р° DDR5 ECC, PCIe 4.0 x4 Р·Р° NVMe Рё USB 3.2 Gen 2. <strong>X670E</strong> РґРѕР±Р°РІСЏ PCIe 5.0 x16 Р·Р° GPU Рё PCIe 5.0 x4 Р·Р° NVMe - РїРѕР»РµР·РЅРѕ СЃР°РјРѕ Р°РєРѕ РёРјР°С€ PCIe 5.0 SSD РёР»Рё RTX 4090 РєР»Р°СЃ GPU. Р—Р° Ryzen 5/7 - B650 Рµ РѕРїС‚РёРјР°Р»РЅРѕС‚Рѕ.</p>
<h2>РљРѕР№ РїСЂРѕРёР·РІРѕРґРёС‚РµР»?</h2>
<h3>ASRock</h3>
<p>РќР°Р№-РґРѕР±СЂР° СЃС‚РѕР№РЅРѕСЃС‚ Р·Р° РїР°СЂРёС‚Рµ. <strong>ASRock B650M Pro RS</strong> Рё <strong>B650M HDV/M.2</strong> РїСЂРµРґР»Р°РіР°С‚ СЃРѕР»РёРґРЅРё VRM Р·Р° Ryzen 9000 РЅР° РєРѕРЅРєСѓСЂРµРЅС‚РЅР° С†РµРЅР°. Р”РѕР±СЂР° BIOS РїРѕРґРґСЂСЉР¶РєР° СЃ СЂРµРґРѕРІРЅРё РѕР±РЅРѕРІСЏРІР°РЅРёСЏ. РњРёРЅСѓСЃ: РїРѕ-СЃРєСЂРѕРјРµРЅ РґРёР·Р°Р№РЅ.</p>
<h3>ASUS</h3>
<p>РћС‚Р»РёС‡РЅР° BIOS СЃСЂРµРґР° (UEFI), Р±РѕРіР°С‚Р° С„СѓРЅРєС†РёРѕРЅР°Р»РЅРѕСЃС‚, РґРѕР±СЂР° VRM. <strong>ASUS Prime B650M-A</strong> Рµ РїРѕРїСѓР»СЏСЂРµРЅ РёР·Р±РѕСЂ Р·Р° mid-range СЃРёСЃС‚РµРјРё. РџРѕ-СЃРєСЉРїРѕ РѕС‚ ASRock, РЅРѕ РѕРїСЂР°РІРґР°РЅРѕ РїСЂРё Ryzen 7/9.</p>
<h3>Gigabyte</h3>
<p>Р”РѕР±СЂРѕ РѕС…Р»Р°Р¶РґР°РЅРµ РЅР° VRM Р·РѕРЅР°С‚Р°. <strong>Gigabyte B650M DS3H</strong> Рµ РµРІС‚РёРЅР° Рё РЅР°РґРµР¶РґРЅР°. Pro СЃРµСЂРёСЏС‚Р° РїСЂРµРґР»Р°РіР° РїРѕРґРѕР±СЂРµРЅР° Р°СѓРґРёРѕ СЃРµРєС†РёСЏ Рё РїРѕ-РґРѕР±СЂРё РєРѕРЅРµРєС‚РѕСЂРё. РЎС‚Р°Р±РёР»РЅР° РѕРїС†РёСЏ.</p>
<h3>MSI</h3>
<p>Р’РёСЃРѕРєРѕРєР°С‡РµСЃС‚РІРµРЅ РґРёР·Р°Р№РЅ Рё Р±РѕРіР°С‚Р° РµРєРѕСЃРёСЃС‚РµРјР° СЃ EZ Debug LED. <strong>MSI B650M Gaming Plus WiFi</strong> Рµ РѕС‚Р»РёС‡РµРЅ РёР·Р±РѕСЂ Р°РєРѕ РёСЃРєР°С€ WiFi РІРєР»СЋС‡РµРЅ. РџРѕ-РґРѕР±СЂР° РіРµР№РјСЉСЂСЃРєР° РµСЃС‚РµС‚РёРєР° РѕС‚ ASRock.</p>
<h2>РљР°РєРІРѕ РґР° РїСЂРѕРІРµСЂРёРј РїСЂРё РёР·Р±РѕСЂ</h2>
<ul>
<li><strong>VRM С„Р°Р·РѕРІРµ</strong> - Р·Р° Ryzen 9 9950X3D С‚СЂСЏР±РІР°С‚ РјРёРЅРёРјСѓРј 12+2 С„Р°Р·Рё СЃ 60A+ РґСЂРѕСЃРµР»Рё</li>
<li><strong>M.2 СЃР»РѕС‚РѕРІРµ</strong> - РјРёРЅРёРјСѓРј 2 Р·Р° СЃРёСЃС‚РµРјР° + storage</li>
<li><strong>WiFi</strong> - РЅРµ РІСЃРёС‡РєРё B650 РёРјР°С‚; РїСЂРѕРІРµСЂСЏРІР°Р№ СЃРїРµС†РёС„РёРєР°С†РёРёС‚Рµ</li>
<li><strong>USB РїРѕСЂС‚РѕРІРµ</strong> - USB4 / Thunderbolt СЃР°РјРѕ РїСЂРё X670E</li>
</ul>
<h2>РџСЂРµРїРѕСЂСЉРєР°</h2>
<p>Р—Р° <strong>Ryzen 5/7 9000</strong> в†’ ASRock B650M Pro RS (~120 в‚¬). Р—Р° <strong>Ryzen 9 9950X3D</strong> в†’ ASUS Prime X670-P РёР»Рё MSI MEG X670E Ace Р·Р° РјР°РєСЃРёРјР°Р»РЅР° СЃС‚Р°Р±РёР»РЅРѕСЃС‚.</p>`
  },
  {
    slug: 'macbook-pro-m4-pro-review',
    emoji: 'рџ’»', cat: 'Р РµРІСЋ', title: 'MacBook Pro M4 Pro - Worth It?',
    productImage: './images/products/46747.webp',
    date: '07 РњР°СЂС‚ 2026', dateISO: '2026-03-07', read: '5 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'РўРµСЃС‚РІР°С…РјРµ РЅРѕРІРёСЏ MacBook Pro M4 Pro РІ СЂРµР°Р»РЅРё СѓСЃР»РѕРІРёСЏ - РІРёРґРµРѕ РјРѕРЅС‚Р°Р¶, РєРѕРґ Рё gaming. Р•С‚Рѕ СЂРµР·СѓР»С‚Р°С‚РёС‚Рµ.',
    metaDesc: 'MacBook Pro M4 Pro СЂРµРІСЋ - РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚, Р±Р°С‚РµСЂРёСЏ, РґРёСЃРїР»РµР№. РЎС‚СЂСѓРІР° Р»Рё СЃРё С†РµРЅР°С‚Р°? РўРµСЃС‚ РІ СЂРµР°Р»РЅРё СѓСЃР»РѕРІРёСЏ РѕС‚ Most Computers.',
    tags: ['MacBook', 'Р»Р°РїС‚РѕРїРё', 'СЂРµРІСЋ'],
    body: `<h2>Р”РёР·Р°Р№РЅ Рё РєРѕРЅСЃС‚СЂСѓРєС†РёСЏ</h2>
<p>MacBook Pro M4 Pro Р·Р°РїР°Р·РІР° РµРјР±Р»РµРјР°С‚РёС‡РЅРёСЏ Р°Р»СѓРјРёРЅРёРµРІ РєРѕСЂРїСѓСЃ РІ Space Black. РџСЂРё 14-РёРЅС‡РѕРІРёСЏ РјРѕРґРµР» С‚РµР¶Рё 1.55 РєРі - РЅРµР·РЅР°С‡РёС‚РµР»РЅРѕ РїРѕРІРµС‡Рµ РѕС‚ M3, РЅРѕ СѓСЃРµС‰Р°РЅРµС‚Рѕ Р·Р° РєР°С‡РµСЃС‚РІРѕ Рµ РЅР° РЅРёРІРѕ. Notch-СЉС‚ Рµ РЅР°РјР°Р»РµРЅ СЃ 20% СЃРїСЂСЏРјРѕ РїСЂРµРґРёС€РЅРѕС‚Рѕ РїРѕРєРѕР»РµРЅРёРµ.</p>
<h2>РџСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ - M4 Pro С‡РёРї</h2>
<p>12-СЏРґСЂРµРЅРёСЏС‚ CPU РЅР° M4 Pro Рµ РѕРєРѕР»Рѕ <strong>22% РїРѕ-Р±СЉСЂР·</strong> РѕС‚ M3 Pro РїСЂРё РјРЅРѕРіРѕСЏРґСЂРµРЅРё Р·Р°РґР°С‡Рё. Р РµРЅРґРµСЂРёСЂР°РЅРµС‚Рѕ РЅР° 4K РїСЂРѕРµРєС‚ РІ Final Cut Pro, РєРѕРµС‚Рѕ РЅР° M3 Pro РѕС‚РЅРµРјР°С€Рµ 8 РјРёРЅСѓС‚Рё, РїСЂРё M4 Pro РїСЂРёРєР»СЋС‡РІР° Р·Р° 6:20. РљРѕРјРїРёР»Р°С†РёСЏС‚Р° РЅР° РіРѕР»СЏРј Swift РїСЂРѕРµРєС‚ СЃРµ СѓСЃРєРѕСЂСЏРІР° СЃ ~18%.</p>
<p>РџСЂРё gaming С‡СЂРµР· Game Mode Рё Rosetta 2 РїРѕСЃС‚РёР¶РµРЅРёСЏС‚Р° СЃР° РёР·РЅРµРЅР°РґРІР°С‰Рё - Baldur's Gate 3 С‚РµС‡Рµ СЃС‚Р°Р±РёР»РЅРѕ РЅР° СЃСЂРµРґРЅРё РЅР°СЃС‚СЂРѕР№РєРё РїСЂРё 1080p, РѕРєРѕР»Рѕ 55-60 fps.</p>
<h2>Р”РёСЃРїР»РµР№ Рё Р±Р°С‚РµСЂРёСЏ</h2>
<p>Liquid Retina XDR РїР°РЅРµР»СЉС‚ СЃ 1000 РЅРёС‚Р° Р·Р° SDR Рё 1600 РЅРёС‚Р° Р·Р° HDR РѕСЃС‚Р°РІР° РµС‚Р°Р»РѕРЅ. ProMotion Р°РґР°РїС‚РёРІРЅРѕ СѓРїСЂР°РІР»СЏРІР° С‡РµСЃС‚РѕС‚Р°С‚Р° РјРµР¶РґСѓ 24 Рё 120 Hz. РџСЂРё СЃРјРµСЃРµРЅРѕ РЅР°С‚РѕРІР°СЂРІР°РЅРµ (РєРѕРґ, РІРёРґРµРѕ РєРѕРЅС„РµСЂРµРЅС†РёРё, Safari) РёР·РєР°СЂР°С…РјРµ <strong>16-17 С‡Р°СЃР°</strong> РѕС‚ Р·Р°СЂРµР¶РґР°РЅРµ РґРѕ Р·Р°СЂРµР¶РґР°РЅРµ - СЂРµР·СѓР»С‚Р°С‚, РЅРµРґРѕСЃС‚РёР¶РёРј Р·Р° Windows Р°Р»С‚РµСЂРЅР°С‚РёРІРёС‚Рµ.</p>
<h2>РЎС‚СЂСѓРІР° Р»Рё СЃРё РЅР°РґСЃС‚СЂРѕР№РєР°С‚Р° РѕС‚ M3 Pro?</h2>
<p>РђРєРѕ СЂР°Р±РѕС‚РёС€ СЃ M3 Pro Mac - РЅРµ Р±СЉСЂР·Р°Р№. РџРѕРґРѕР±СЂРµРЅРёРµС‚Рѕ Рµ СЂРµР°Р»РЅРѕ, РЅРѕ РЅРµ СЂРµРІРѕР»СЋС†РёРѕРЅРЅРѕ. РђРєРѕ РѕР±Р°С‡Рµ РёРґРІР°С€ РѕС‚ Intel Mac РёР»Рё M1, СЂР°Р·Р»РёРєР°С‚Р° Рµ <em>РѕРіСЂРѕРјРЅР°</em>. M4 Pro Рµ РЅР°Р№-Р±Р°Р»Р°РЅСЃРёСЂР°РЅРёСЏС‚ MacBook Pro Р·Р°СЃРµРіР°.</p>
<p><strong>РћС†РµРЅРєР°: 9.2 / 10</strong></p>`
  },
  {
    slug: 'iphone-16-pro-max-vs-s25-ultra',
    emoji: 'рџ“±', cat: 'РЎСЂР°РІРЅРµРЅРёРµ', title: 'iPhone 16 Pro Max vs Samsung S25 Ultra',
    productImage: './images/products/42081.webp',
    date: '03 РњР°СЂС‚ 2026', dateISO: '2026-03-03', read: '7 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'Р”РІР°С‚Р° С„Р»Р°РіРјР°РЅР° СЃРµ СЃСЂРµС‰Р°С‚ РІ РґРёСЂРµРєС‚РµРЅ РґСѓРµР». РљР°РјРµСЂР°, РґРёСЃРїР»РµР№, Р±Р°С‚РµСЂРёСЏ - РєРѕР№ РїРµС‡РµР»Рё?',
    metaDesc: 'iPhone 16 Pro Max СЃСЂРµС‰Сѓ Samsung Galaxy S25 Ultra - РїСЉР»РЅРѕ СЃСЂР°РІРЅРµРЅРёРµ РЅР° РєР°РјРµСЂР°, РґРёСЃРїР»РµР№, Р±Р°С‚РµСЂРёСЏ Рё РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚.',
    tags: ['iPhone', 'Samsung', 'СЃРјР°СЂС‚С„РѕРЅРё', 'СЃСЂР°РІРЅРµРЅРёРµ'],
    body: `<h2>Р”РёР·Р°Р№РЅ</h2>
<p>iPhone 16 Pro Max Рµ РїСЂРµРјРёРЅР°Р» РєСЉРј С‚РёС‚Р°РЅРёРµРІР° СЂР°РјРєР° СЃ РїРѕ-Р·Р°РѕР±Р»РµРЅРё СЉРіР»Рё. S25 Ultra Р·Р°Р»Р°РіР° РЅР° РїР»РѕСЃРєРё СЂСЉР±РѕРІРµ Рё РІРіСЂР°РґРµРЅР° S Pen - СѓРЅРёРєР°Р»РµРЅ РїР»СЋСЃ Р·Р° С‚РІРѕСЂС‡РµСЃРєР°С‚Р° СЂР°Р±РѕС‚Р°. Р РґРІР°С‚Р° СЃР° РІ premium СЃРµРіРјРµРЅС‚Р°, РЅРѕ Apple РёР·РіР»РµР¶РґР° РїРѕ-РёР·С‚СЉРЅС‡РµРЅРѕ.</p>
<h2>Р”РёСЃРїР»РµР№</h2>
<p>S25 Ultra РїСЂРµРґР»Р°РіР° 6.9" Dynamic AMOLED 2X СЃ 2600 РЅРёС‚Р° РїРёРє СЏСЂРєРѕСЃС‚ Рё 1-120 Hz Р°РґР°РїС‚РёРІРµРЅ ProMotion. iPhone 16 Pro Max СЂР°Р·РїРѕР»Р°РіР° СЃ 6.9" Super Retina XDR OLED СЃ ProMotion. Р’ РїСЂСЏРєР° РєРѕРЅРєСѓСЂРµРЅС†РёСЏ Samsung РїРµС‡РµР»Рё РїРѕ СЏСЂРєРѕСЃС‚ РїСЂРё РґРёСЂРµРєС‚РЅР° СЃР»СЉРЅС‡РµРІР° СЃРІРµС‚Р»РёРЅР°, РґРѕРєР°С‚Рѕ Apple РїСЂРµРІСЉР·С…РѕР¶РґР° РїСЂРё С‚РѕС‡РЅРѕСЃС‚ РЅР° С†РІРµС‚РѕРїСЂРµРґР°РІР°РЅРµС‚Рѕ.</p>
<h2>РљР°РјРµСЂР°</h2>
<p>iPhone 16 Pro Max СЂР°Р·РїРѕР»Р°РіР° СЃ 48 MP РіР»Р°РІРЅР°, 48 MP СѓР»С‚СЂР°С€РёСЂРѕРєР° Рё 5x РѕРїС‚РёС‡РµРЅ Р·СѓРј. S25 Ultra РїСЂРµРґР»Р°РіР° 200 MP РіР»Р°РІРЅР° СЃ 50 MP С‚РµР»РµС„РѕС‚Рѕ РїСЂРё 5x Рё 10x Р·СѓРј. РџСЂРё РґРЅРµРІРЅР° СЃРІРµС‚Р»РёРЅР° РґРІРµС‚Рµ СЃРёСЃС‚РµРјРё СЃР° РїСЂР°РєС‚РёС‡РµСЃРєРё СЂР°РІРЅРё. РќРѕС‰РЅРѕС‚Рѕ СЃРЅРёРјР°РЅРµ Р»РµРєРѕ РїСЂРµРґРїРѕС‡РёС‚Р° Samsung Р·Р°СЂР°РґРё Р°РіСЂРµСЃРёРІРЅР°С‚Р° РѕР±СЂР°Р±РѕС‚РєР°, РґРѕРєР°С‚Рѕ Apple РґР°РІР° РїРѕ-РµСЃС‚РµСЃС‚РІРµРЅ СЂРµР·СѓР»С‚Р°С‚.</p>
<h2>РџСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚</h2>
<p>A18 Pro (Apple) СЃСЂРµС‰Сѓ Snapdragon 8 Elite (Samsung) - РІ РµР¶РµРґРЅРµРІРЅР° СѓРїРѕС‚СЂРµР±Р° СЂР°Р·Р»РёРєР°С‚Р° Рµ РЅРµРІРёРґРёРјР°. РџСЂРё С‚РµР¶РєРѕ РЅР°С‚РѕРІР°СЂРІР°РЅРµ (РІРёРґРµРѕ СЂРµРЅРґРµСЂРёСЂР°РЅРµ, ML Р·Р°РґР°С‡Рё) Apple РіСѓР±Рё РїРѕ-РјР°Р»РєРѕ РїСЂРѕРёР·РІРѕРґРёС‚РµР»РЅРѕСЃС‚ РїСЂРё С‚РѕРїР»РёРЅРЅРѕ РґСЂРѕСЃРёСЂР°РЅРµ.</p>
<h2>Р‘Р°С‚РµСЂРёСЏ</h2>
<p>S25 Ultra РїСЂРµРґР»Р°РіР° 5000 mAh Р±Р°С‚РµСЂРёСЏ СЃ 45W Р·Р°СЂРµР¶РґР°РЅРµ. iPhone 16 Pro Max - 4685 mAh СЃ 27W. РџСЂРё СЂРµР°Р»РЅР° СѓРїРѕС‚СЂРµР±Р° Samsung РґР°РІР° РѕРєРѕР»Рѕ 1 С‡Р°СЃ РїРѕРІРµС‡Рµ Р°РІС‚РѕРЅРѕРјРёСЏ, РЅРѕ Apple Р·Р°СЂРµР¶РґР° Р±РµР·Р¶РёС‡РЅРѕ РїРѕ-Р±СЉСЂР·Рѕ (MagSafe 25W).</p>
<h2>Р—Р°РєР»СЋС‡РµРЅРёРµ</h2>
<p>РђРєРѕ С‚Рё С‚СЂСЏР±РІР° S Pen, РјР°РєСЃРёРјР°Р»РµРЅ Р·СѓРј Рё Android - <strong>S25 Ultra</strong>. РђРєРѕ РёСЃРєР°С€ iOS РµРєРѕСЃРёСЃС‚РµРјР°, РїРѕ-РґРѕР±СЂРѕ РІРёРґРµРѕ Рё РїРѕ-РїР»Р°РІРµРЅ СЃРѕС„С‚СѓРµСЂ - <strong>iPhone 16 Pro Max</strong>.</p>`
  },
  {
    slug: 'top-5-bejichni-slushalki-2026',
    emoji: 'рџЋ§', cat: 'РўРѕРї 5', title: 'РќР°Р№-РґРѕР±СЂРё Р±РµР·Р¶РёС‡РЅРё СЃР»СѓС€Р°Р»РєРё Р·Р° 2026',
    productImage: './images/products/47243.webp',
    date: '28 Р¤РµРІСЂСѓР°СЂРё 2026', dateISO: '2026-02-28', read: '4 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'Sony, Bose, ANC С‚РµС…РЅРѕР»РѕРіРёСЏ - РєРѕРё СЃР»СѓС€Р°Р»РєРё РґР°РІР°С‚ РЅР°Р№-РґРѕР±СЂРѕ РєР°С‡РµСЃС‚РІРѕ Р·Р° РїР°СЂРёС‚Рµ СЃРё?',
    metaDesc: 'РўРѕРї 5 Р±РµР·Р¶РёС‡РЅРё СЃР»СѓС€Р°Р»РєРё Р·Р° 2026 - Sony WH-1000XM6, Bose QC45, Jabra. РљРѕСЏ РґР° РёР·Р±РµСЂРµС€?',
    tags: ['СЃР»СѓС€Р°Р»РєРё', 'Р°СѓРґРёРѕ', 'С‚РѕРї 5'],
    body: `<h2>1. Sony WH-1000XM6 - РќР°Р№-РґРѕР±СЂРѕ С€СѓРјРѕРїРѕС‚РёСЃРєР°РЅРµ</h2>
<p>Sony РїСЂРѕРґСЉР»Р¶Р°РІР° РґР° РґРѕРјРёРЅРёСЂР° РІ СЃРµРіРјРµРЅС‚Р° РЅР° ANC СЃР»СѓС€Р°Р»РєРёС‚Рµ. XM6 РїСЂРµРґР»Р°РіР° 40 С‡. Р°РІС‚РѕРЅРѕРјРёСЏ, Multipoint СЃРІСЉСЂР·РІР°РЅРµ СЃ 2 СѓСЃС‚СЂРѕР№СЃС‚РІР° Рё РїРѕРґРѕР±СЂРµРЅ РїСЂРѕС†РµСЃРѕСЂ V2 Р·Р° РїРѕ-РїСЂРµС†РёР·РЅРѕ С€СѓРјРѕРїРѕС‚РёСЃРєР°РЅРµ. Р—РІСѓРєСЉС‚ Рµ РЅР°СЃРёС‚РµРЅ Рё РґРµС‚Р°Р№Р»РµРЅ, РѕСЃРѕР±РµРЅРѕ РїСЂРё Hi-Res Wireless СЃ LDAC РєРѕРґРµРє.</p>
<h2>2. Bose QuietComfort Ultra</h2>
<p>Bose Рµ РїРѕСЃС‚Р°РІРёР» Р°РєС†РµРЅС‚ РІСЉСЂС…Сѓ Immersive Audio - РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІРµРЅ Р·РІСѓРє, РєРѕР№С‚Рѕ СЃРµ Р°РґР°РїС‚РёСЂР° СЃРїСЂСЏРјРѕ РґРІРёР¶РµРЅРёСЏС‚Р° РЅР° РіР»Р°РІР°С‚Р°. РђРєРѕ РїСЉС‚СѓРІР°С€ РјРЅРѕРіРѕ Рё С€СѓРјРѕРїРѕС‚РёСЃРєР°РЅРµС‚Рѕ Рµ РїСЂРёРѕСЂРёС‚РµС‚, QC Ultra Рµ СЂР°РІРЅРѕСЃС‚РѕРµРЅ РєРѕРЅРєСѓСЂРµРЅС‚ РЅР° Sony.</p>
<h2>3. Jabra Evolve2 85 - Р—Р° РѕС„РёСЃР°</h2>
<p>РђРєРѕ СЂР°Р±РѕС‚РёС€ РІ open space, Jabra РїСЂРµРґР»Р°РіР° 8-РјРёРєСЂРѕС„РѕРЅРµРЅ array Р·Р° РєСЂРёСЃС‚Р°Р»РЅРё РѕР±Р°Р¶РґР°РЅРёСЏ, 37 С‡. Р±Р°С‚РµСЂРёСЏ Рё СЃРµСЂС‚РёС„РёРєР°С†РёСЏ Р·Р° Microsoft Teams. Р—РІСѓРєСЉС‚ Рµ РјР°Р»РєРѕ РїРѕ-РЅРµСѓС‚СЂР°Р»РµРЅ РѕС‚ Sony, РЅРѕ Р·Р° РІРёРґРµРѕРєРѕРЅС„РµСЂРµРЅС†РёРё Рµ РёРґРµР°Р»РµРЅ.</p>
<h2>4. Sennheiser Momentum 4</h2>
<p>Р“РµСЂРјР°РЅСЃРєР° РёРЅР¶РµРЅРµСЂРёСЏ, 60 С‡. Р±Р°С‚РµСЂРёСЏ Рё РµСЃС‚РµСЃС‚РІРµРЅ Р·РІСѓРє Р±РµР· РїСЂРµРєРѕРјРµСЂРЅР° РѕР±СЂР°Р±РѕС‚РєР°. Momentum 4 Рµ РёР·Р±РѕСЂСЉС‚ РЅР° Р°СѓРґРёРѕС„РёР»РёС‚Рµ СЃ Р±СЋРґР¶РµС‚ РїРѕРґ 350 в‚¬.</p>
<h2>5. Logitech Zone Vibe 130 - Р‘СЋРґР¶РµС‚РµРЅ РёР·Р±РѕСЂ</h2>
<p>Р›РµРєР° Р±РµР·Р¶РёС‡РЅР° СЃР»СѓС€Р°Р»РєР° СЃ 22 С‡. Р±Р°С‚РµСЂРёСЏ, РІРіСЂР°РґРµРЅ РјРёРєСЂРѕС„РѕРЅ Рё Teams/Zoom СЃРµСЂС‚РёС„РёРєР°С†РёСЏ. Р—Р° РїРѕРґ 100 в‚¬ Рµ С‚СЂСѓРґРЅРѕ РґР° СЃРµ РЅР°РјРµСЂРё РїРѕ-РґРѕР±СЉСЂ РѕС„РёСЃ РІР°СЂРёР°РЅС‚.</p>
<h2>Р—Р°РєР»СЋС‡РµРЅРёРµ</h2>
<p>Р—Р° РїРѕРІРµС‡РµС‚Рѕ С…РѕСЂР° - <strong>Sony WH-1000XM6</strong>. Р—Р° РѕС„РёСЃ СѓРїРѕС‚СЂРµР±Р° - <strong>Jabra Evolve2 85</strong>. РќР° Р±СЋРґР¶РµС‚ - <strong>Logitech Zone Vibe 130</strong>.</p>`
  },
  {
    slug: 'kak-da-izberem-monitor-rabota-vkashti',
    emoji: 'рџ–Ґ', cat: 'РЎСЉРІРµС‚Рё', title: 'РљР°Рє РґР° РёР·Р±РµСЂРµРј РјРѕРЅРёС‚РѕСЂ Р·Р° СЂР°Р±РѕС‚Р° РѕС‚ РІРєСЉС‰Рё',
    date: '22 Р¤РµРІСЂСѓР°СЂРё 2026', dateISO: '2026-02-22', read: '6 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: '4K РёР»Рё 1440p? IPS РёР»Рё OLED? РџСЉР»РµРЅ РЅР°СЂСЉС‡РЅРёРє Р·Р° РїСЂР°РІРёР»РЅРёСЏ РёР·Р±РѕСЂ.',
    metaDesc: 'РљР°Рє РґР° РёР·Р±РµСЂРµРј РјРѕРЅРёС‚РѕСЂ Р·Р° СЂР°Р±РѕС‚Р° РѕС‚ РІРєСЉС‰Рё - 4K, 1440p, IPS, OLED. РџСЉР»РµРЅ РЅР°СЂСЉС‡РЅРёРє 2026.',
    tags: ['РјРѕРЅРёС‚РѕСЂРё', 'СЂР°Р±РѕС‚Р° РѕС‚ РІРєСЉС‰Рё', 'СЃСЉРІРµС‚Рё', '4K'],
    productImage: './images/products/46737.webp',
    body: `<h2>Р РµР·РѕР»СЋС†РёСЏ: 1080p, 1440p РёР»Рё 4K?</h2>
<p>РџСЂРё 24-27" РјРѕРЅРёС‚РѕСЂ <strong>1440p (2K)</strong> Рµ РѕРїС‚РёРјР°Р»РЅРёСЏС‚ Р±Р°Р»Р°РЅСЃ - РґРѕСЃС‚Р°С‚СЉС‡РЅРѕ РѕСЃС‚СЂР° РєР°СЂС‚РёРЅР° Р±РµР· РїСЂРµРєРѕРјРµСЂРЅРѕ РЅР°С‚РѕРІР°СЂРІР°РЅРµ РЅР° GPU. 4K РёРјР° СЃРјРёСЃСЉР» РїСЂРё 32"+ РёР»Рё Р°РєРѕ СЂР°Р±РѕС‚РёС€ СЃ РІРёРґРµРѕ/СЃРЅРёРјРєРё Рё РёРјР°С€ РјРѕС‰РЅР° РіСЂР°С„РёС‡РЅР° РєР°СЂС‚Р°.</p>
<h2>РњР°С‚СЂРёС†Р°: IPS, VA РёР»Рё OLED?</h2>
<ul>
<li><strong>IPS</strong> - РЅР°Р№-РґРѕР±СЂРё СЉРіР»Рё РЅР° РІРёРґРёРјРѕСЃС‚, С‚РѕС‡РЅРё С†РІРµС‚РѕРІРµ. РРґРµР°Р»РµРЅ Р·Р° РґРёР·Р°Р№РЅ Рё С„РѕС‚Рѕ СЂР°Р±РѕС‚Р°.</li>
<li><strong>VA</strong> - РїРѕ-РІРёСЃРѕРє РєРѕРЅС‚СЂР°СЃС‚, РїРѕ-РґРѕР±СЂРё С‡РµСЂРЅРё. Р”РѕР±СЉСЂ Р·Р° С„РёР»РјРё Рё РєРѕРґРёСЂР°РЅРµ.</li>
<li><strong>OLED</strong> - РїРµСЂС„РµРєС‚РЅРё С‡РµСЂРЅРё, РёР·РєР»СЋС‡РёС‚РµР»РЅРё С†РІРµС‚РѕРІРµ, РЅРѕ СЂРёСЃРє РѕС‚ burn-in РїСЂРё СЃС‚Р°С‚РёС‡РЅРѕ СЃСЉРґСЉСЂР¶Р°РЅРёРµ.</li>
</ul>
<h2>Р§РµСЃС‚РѕС‚Р° РЅР° РѕРїСЂРµСЃРЅСЏРІР°РЅРµ</h2>
<p>Р—Р° РѕС„РёСЃ СЂР°Р±РѕС‚Р° 60-75 Hz Рµ РґРѕСЃС‚Р°С‚СЉС‡РЅРѕ. РђРєРѕ РїРёС€РµС€ РєРѕРґ РёР»Рё С‡РµС‚РµС€ РјРЅРѕРіРѕ - 120-144 Hz РїСЂР°РІРё СЃРєСЂРѕР»РІР°РЅРµС‚Рѕ Р·РЅР°С‡РёС‚РµР»РЅРѕ РїРѕ-РїР»Р°РІРЅРѕ Рё РЅР°РјР°Р»СЏРІР° СѓРјРѕСЂР°С‚Р° РЅР° РѕС‡РёС‚Рµ.</p>
<h2>Р Р°Р·РјРµСЂ Рё РµСЂРіРѕРЅРѕРјРёСЏ</h2>
<p>27" Рµ СЃС‚Р°РЅРґР°СЂС‚СЉС‚ Р·Р° СЂР°Р±РѕС‚Р° РѕС‚ РІРєСЉС‰Рё. РђРєРѕ РёРјР°С€ РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕ - РїРѕРјРёСЃР»Рё Р·Р° СѓР»С‚СЂР°С€РёСЂРѕРє 34" (21:9), РєРѕР№С‚Рѕ Р·Р°РјРµРЅСЏ РґРІР° РѕС‚РґРµР»РЅРё РјРѕРЅРёС‚РѕСЂР°. РЎС‚РѕР№РєР° СЃ СЂРµРіСѓР»РёСЂР°РЅРµ РЅР° РІРёСЃРѕС‡РёРЅР° Рµ Р·Р°РґСЉР»Р¶РёС‚РµР»РЅР° Р·Р° РїСЂР°РІРёР»РЅР° РїРѕР·Р°.</p>
<h2>РџСЂРµРїРѕСЂСЉРєРё РїРѕ Р±СЋРґР¶РµС‚</h2>
<ul>
<li><strong>РґРѕ 200 в‚¬</strong> - LG 27MN60T (IPS, 1080p, 75Hz)</li>
<li><strong>РґРѕ 350 в‚¬</strong> - LG 27QN850-B (IPS, 1440p, USB-C 60W)</li>
<li><strong>РґРѕ 600 в‚¬</strong> - LG 27UK850 (IPS, 4K, USB-C)</li>
<li><strong>Р±РµР· РѕРіСЂР°РЅРёС‡РµРЅРёРµ</strong> - ASUS ProArt PA329CRV (4K OLED, 144Hz)</li>
</ul>`
  },
  {
    slug: '10-nachina-udalzhim-bateriya',
    emoji: 'рџ”‹', cat: 'РЎСЉРІРµС‚Рё', title: '10 РЅР°С‡РёРЅР° РґР° СѓРґСЉР»Р¶РёРј Р¶РёРІРѕС‚Р° РЅР° Р±Р°С‚РµСЂРёСЏС‚Р°',
    productImage: './images/products/52804.webp',
    date: '15 Р¤РµРІСЂСѓР°СЂРё 2026', dateISO: '2026-02-15', read: '3 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'РџСЂРѕСЃС‚РёС‚Рµ РЅР°РІРёС†Рё, РєРѕРёС‚Рѕ РјРѕРіР°С‚ РґР° СѓРґРІРѕСЏС‚ Р¶РёРІРѕС‚Р° РЅР° Р±Р°С‚РµСЂРёСЏС‚Р° РЅР° С‚РІРѕСЏ С‚РµР»РµС„РѕРЅ РёР»Рё Р»Р°РїС‚РѕРї.',
    metaDesc: '10 СЃСЉРІРµС‚Р° Р·Р° РїРѕ-РґСЉР»СЉРі Р¶РёРІРѕС‚ РЅР° Р±Р°С‚РµСЂРёСЏС‚Р° РЅР° СЃРјР°СЂС‚С„РѕРЅ Рё Р»Р°РїС‚РѕРї. РџСЂР°РєС‚РёС‡РЅРё РЅР°РІРёС†Рё РѕС‚ Most Computers.',
    tags: ['Р±Р°С‚РµСЂРёСЏ', 'СЃСЉРІРµС‚Рё', 'СЃРјР°СЂС‚С„РѕРЅ', 'Р»Р°РїС‚РѕРї'],
    body: `<h2>Р—Р° СЃРјР°СЂС‚С„РѕРЅРё</h2>
<ol>
<li><strong>РћРїС‚РёРјРёР·РёСЂР°РЅРѕ Р·Р°СЂРµР¶РґР°РЅРµ</strong> - iPhone Рё Android РёРјР°С‚ С„СѓРЅРєС†РёСЏ, РєРѕСЏС‚Рѕ РѕРіСЂР°РЅРёС‡Р°РІР° Р·Р°СЂРµР¶РґР°РЅРµС‚Рѕ РґРѕ 80% Р·Р° РЅРѕС‰РЅРё Р·Р°СЂСЏРґРєРё. Р’РєР»СЋС‡Рё СЏ.</li>
<li><strong>РР·Р±СЏРіРІР°Р№ РєСЂР°Р№РЅРѕСЃС‚РёС‚Рµ</strong> - РЅРµ РёР·С‚РѕС‰Р°РІР°Р№ Р±Р°С‚РµСЂРёСЏС‚Р° РґРѕ 0% Рё РЅРµ СЏ РґСЂСЉР¶ РїРѕСЃС‚РѕСЏРЅРЅРѕ РЅР° 100%. РћРїС‚РёРјР°Р»РЅРёСЏС‚ РґРёР°РїР°Р·РѕРЅ Рµ 20-80%.</li>
<li><strong>РќР°РјР°Р»Рё СЏСЂРєРѕСЃС‚С‚Р°</strong> - РґРёСЃРїР»РµСЏС‚ Рµ РЅР°Р№-РіРѕР»РµРјРёСЏС‚ РєРѕРЅСЃСѓРјР°С‚РѕСЂ. РђРІС‚РѕРјР°С‚РёС‡РЅР° СЏСЂРєРѕСЃС‚ + С‚СЉРјРµРЅ СЂРµР¶РёРј РјРѕРіР°С‚ РґР° СЃРїРµСЃС‚СЏС‚ РґРѕ 30% РѕС‚ Р±Р°С‚РµСЂРёСЏС‚Р°.</li>
<li><strong>РћРіСЂР°РЅРёС‡Рё Background App Refresh</strong> - РїСЂРёР»РѕР¶РµРЅРёСЏС‚Р°, РєРѕРёС‚Рѕ СЃРµ РѕР±РЅРѕРІСЏРІР°С‚ РЅР° Р·Р°РґРµРЅ РїР»Р°РЅ, РёР·СЏР¶РґР°С‚ Р±Р°С‚РµСЂРёСЏ РЅРµР·Р°Р±РµР»РµР¶РёРјРѕ.</li>
<li><strong>РР·РєР»СЋС‡Рё Location Services</strong> Р·Р° РїСЂРёР»РѕР¶РµРЅРёСЏ, РєРѕРёС‚Рѕ РЅРµ РіРѕ РЅСѓР¶РґР°СЏС‚.</li>
</ol>
<h2>Р—Р° Р»Р°РїС‚РѕРїРё</h2>
<ol start="6">
<li><strong>Р‘Р°С‚РµСЂРёР№РЅРё СЂРµР¶РёРјРё</strong> - Windows РёРјР° "Battery Saver", macOS РёРјР° "Low Power Mode". Р’РєР»СЋС‡Рё РїСЂРё СЂР°Р±РѕС‚Р° Р±РµР· Р·Р°С…СЂР°РЅРІР°РЅРµ.</li>
<li><strong>РћС…Р»Р°Р¶РґР°РЅРµ</strong> - Р±Р°С‚РµСЂРёРёС‚Рµ РґРµРіСЂР°РґРёСЂР°С‚ РїРѕ-Р±СЉСЂР·Рѕ РїСЂРё РІРёСЃРѕРєР° С‚РµРјРїРµСЂР°С‚СѓСЂР°. РќРµ СЂР°Р±РѕС‚Рё СЃ Р»Р°РїС‚РѕРїР° РІСЉСЂС…Сѓ РјРµРєРё РїРѕРІСЉСЂС…РЅРѕСЃС‚Рё.</li>
<li><strong>Hibernation РІРјРµСЃС‚Рѕ Sleep</strong> РїСЂРё РґСЉР»РіРѕ РЅРµРёР·РїРѕР»Р·РІР°РЅРµ РїРµСЃС‚Рё Р·РЅР°С‡РёС‚РµР»РЅРѕ РїРѕРІРµС‡Рµ Р±Р°С‚РµСЂРёСЏ.</li>
<li><strong>RAM РІРјРµСЃС‚Рѕ HDD/SSD swap</strong> - Р°РєРѕ Р»Р°РїС‚РѕРїСЉС‚ РїРѕСЃС‚РѕСЏРЅРЅРѕ РїРёС€Рµ РЅР° РґРёСЃРєР°, РґРѕР±Р°РІРё RAM.</li>
<li><strong>РљР°Р»РёР±СЂР°С†РёСЏ</strong> - РІРµРґРЅСЉР¶ РЅР° 3 РјРµСЃРµС†Р° РЅР°РїСЉР»РЅРѕ Р·Р°СЂРµРґРё РґРѕ 100%, СЃР»РµРґ РєРѕРµС‚Рѕ РёР·С‚РѕС‰Рё РґРѕ ~5%. РџРѕРјР°РіР° Р·Р° С‚РѕС‡РЅРѕС‚Рѕ РѕС‚С‡РёС‚Р°РЅРµ РЅР° Р·Р°СЂСЏРґР°.</li>
</ol>
<p>РџСЂРё РїСЂР°РІРёР»РЅР° РіСЂРёР¶Р°, Р»РёС‚РёРµРІРѕ-Р№РѕРЅРЅР° Р±Р°С‚РµСЂРёСЏ РјРѕР¶Рµ РґР° Р·Р°РїР°Р·Рё РЅР°Рґ 80% РѕС‚ РєР°РїР°С†РёС‚РµС‚Р° СЃР»РµРґ 500 С†РёРєСЉР»Р° Р·Р°СЂРµР¶РґР°РЅРµ.</p>`
  },
  {
    slug: 'umen-dom-pod-500-leva',
    emoji: 'рџЏ ', cat: 'Smart Home', title: 'РљР°Рє РґР° РёР·РіСЂР°РґРёРј СѓРјРµРЅ РґРѕРј Р·Р° РїРѕРґ 500 Р»РІ.',
    productImage: './images/products/42961.webp',
    date: '10 Р¤РµРІСЂСѓР°СЂРё 2026', dateISO: '2026-02-10', read: '8 РјРёРЅ', author: 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ',
    summary: 'Philips Hue, СЃРјР°СЂС‚ РєРѕРЅС‚Р°РєС‚Рё, РіР»Р°СЃРѕРІ Р°СЃРёСЃС‚РµРЅС‚ - РїСЉР»РЅР° СЃРёСЃС‚РµРјР° Р±РµР· РґР° СЃРµ СЂР°Р·РѕСЂСЏРІР°РјРµ.',
    metaDesc: 'РЈРјРµРЅ РґРѕРј Р·Р° РїРѕРґ 500 Р»РµРІР° - Philips Hue, Google Home, СЃРјР°СЂС‚ РєРѕРЅС‚Р°РєС‚Рё. Р СЉРєРѕРІРѕРґСЃС‚РІРѕ СЃС‚СЉРїРєР° РїРѕ СЃС‚СЉРїРєР°.',
    tags: ['СѓРјРµРЅ РґРѕРј', 'Smart Home', 'Philips Hue', 'Google Home'],
    body: `<h2>РћС‚РїСЂР°РІРЅР° С‚РѕС‡РєР°: Р“Р»Р°СЃРѕРІ Р°СЃРёСЃС‚РµРЅС‚</h2>
<p>Р’СЃРёС‡РєРѕ Р·Р°РїРѕС‡РІР° СЃ С†РµРЅС‚СЂР°Р»РµРЅ С…СЉР±. <strong>Google Nest Mini</strong> (РѕРєРѕР»Рѕ 50 Р»РІ.) РёР»Рё <strong>Amazon Echo Dot</strong> (РѕРєРѕР»Рѕ 45 Р»РІ.) СЃР° РёРґРµР°Р»РЅРёС‚Рµ РѕС‚РїСЂР°РІРЅРё С‚РѕС‡РєРё. Р’РµРґРЅСЉР¶ РёРЅСЃС‚Р°Р»РёСЂР°РЅ, Р°СЃРёСЃС‚РµРЅС‚СЉС‚ СѓРїСЂР°РІР»СЏРІР° РІСЃРёС‡РєРё РѕСЃС‚Р°РЅР°Р»Рё СѓСЃС‚СЂРѕР№СЃС‚РІР° СЃ РіР»Р°СЃРѕРІРё РєРѕРјР°РЅРґРё.</p>
<h2>РРЅС‚РµР»РёРіРµРЅС‚РЅРѕ РѕСЃРІРµС‚Р»РµРЅРёРµ (~150 Р»РІ.)</h2>
<p>Philips Hue Starter Kit СЃ 3 РєСЂСѓС€РєРё Рё С…СЉР± Рµ РєР»Р°СЃРёС‡РµСЃРєРёСЏС‚ РёР·Р±РѕСЂ - СЃС‚Р°Р±РёР»РµРЅ Zigbee РїСЂРѕС‚РѕРєРѕР», Р±РѕРіР°С‚Р° РµРєРѕСЃРёСЃС‚РµРјР° Рё СЃС‚СЂР°С…РѕС‚РЅРѕ РїСЂРёР»РѕР¶РµРЅРёРµ. РђР»С‚РµСЂРЅР°С‚РёРІР°С‚Р° Рµ IKEA TRГ…DFRI (РїРѕ-РµРІС‚РёРЅРѕ, РјР°Р»РєРѕ РїРѕ-РѕРіСЂР°РЅРёС‡РµРЅРѕ). РЎРјР°СЂС‚ РєСЂСѓС€РєРёС‚Рµ СЃ WiFi (SONOFF, Tapo) РЅРµ РёР·РёСЃРєРІР°С‚ РѕС‚РґРµР»РµРЅ С…СЉР±.</p>
<h2>РЎРјР°СЂС‚ РєРѕРЅС‚Р°РєС‚Рё (~80 Р»РІ. Р·Р° 2 Р±СЂ.)</h2>
<p>РЎРјР°СЂС‚ РєРѕРЅС‚Р°РєС‚РёС‚Рµ С‚СЂР°РЅСЃС„РѕСЂРјРёСЂР°С‚ РѕР±РёРєРЅРѕРІРµРЅРё СѓСЂРµРґРё РІ РёРЅС‚РµР»РёРіРµРЅС‚РЅРё. РЎС‚Р°СЂ РІРµРЅС‚РёР»Р°С‚РѕСЂ, РєР°С„РµРјР°С€РёРЅР° РёР»Рё Р»Р°РјРїР° РјРѕРіР°С‚ РґР° СЃРµ СѓРїСЂР°РІР»СЏРІР°С‚ РѕС‚ С‚РµР»РµС„РѕРЅР° РёР»Рё С‚Р°Р№РјРµСЂ. TP-Link Tapo P115 Рµ Р»СЋР±РёРјРµС†СЉС‚ - РјРµСЂРё Рё РєРѕРЅСЃСѓРјР°С†РёСЏС‚Р° РЅР° С‚РѕРє.</p>
<h2>РЎРёРіСѓСЂРЅРѕСЃС‚ (~150 Р»РІ.)</h2>
<p>РЎРјР°СЂС‚ РІРёРґРµРѕРєР°РјРµСЂР° (Tapo C200 - РѕРєРѕР»Рѕ 60 Р»РІ.) + СЃРјР°СЂС‚ Р·РІСЉРЅРµС† (Reolink Video Doorbell - РѕРєРѕР»Рѕ 90 Р»РІ.) РїРѕРєСЂРёРІР°С‚ РѕСЃРЅРѕРІРЅР°С‚Р° РґРѕРјР°С€РЅР° СЃРёРіСѓСЂРЅРѕСЃС‚. Р РґРІР°С‚Р° СЂР°Р±РѕС‚СЏС‚ СЃ Google Home Рё Alexa.</p>
<h2>РџСЂРёРјРµСЂРµРЅ Р±СЋРґР¶РµС‚</h2>
<ul>
<li>Google Nest Mini - 50 Р»РІ.</li>
<li>Philips Hue Starter Kit - 150 Р»РІ.</li>
<li>2x Tapo P115 СЃРјР°СЂС‚ РєРѕРЅС‚Р°РєС‚ - 80 Р»РІ.</li>
<li>Tapo C200 РєР°РјРµСЂР° - 60 Р»РІ.</li>
<li>Reolink Doorbell - 90 Р»РІ.</li>
<li><strong>РћР±С‰Рѕ: ~430 Р»РІ.</strong></li>
</ul>
<p>РђРєРѕ СЂР°Р·РїСЂРµРґРµР»РёС€ РїРѕРєСѓРїРєРёС‚Рµ Р·Р° 2-3 РјРµСЃРµС†Р°, СѓСЃРµС‰Р°РЅРµС‚Рѕ Р·Р° вЂћСѓРјРµРЅ РґРѕРј" РёРґРІР° РїРѕСЃС‚РµРїРµРЅРЅРѕ - Рё Рµ РјРЅРѕРіРѕ РїРѕ-РґРѕСЃС‚СЉРїРЅРѕ, РѕС‚РєРѕР»РєРѕС‚Рѕ РёР·РіР»РµР¶РґР°.</p>`
  },
];


function openBlogPage() {
  const listView = document.getElementById('blogListView');
  const postView = document.getElementById('blogPostView');
  if (listView) listView.style.display = '';
  if (postView) postView.style.display = 'none';
  const titleEl = document.getElementById('blogPageTitle');
  if (titleEl) titleEl.textContent = 'рџ“° Р‘Р»РѕРі Рё РЅРѕРІРёРЅРё';
  _renderBlogGrid();
  _setPgBc('blogBc', 'Р‘Р»РѕРі Рё РЅРѕРІРёРЅРё', 'closeBlogPage');
  document.getElementById('blogPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Р‘Р»РѕРі - Most Computers', 'Р РµРІСЋС‚Р°, СЃСЂР°РІРЅРµРЅРёСЏ Рё СЃСЉРІРµС‚Рё Р·Р° РєРѕРјРїСЋС‚СЂРё, Р»Р°РїС‚РѕРїРё Рё РµР»РµРєС‚СЂРѕРЅРёРєР° РѕС‚ РµРєРёРїР° РЅР° Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Р‘Р»РѕРі');
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
      : (p.productImage ? '' : `<div class="blog-mag-emoji">${p.emoji}</div>`);
    const hdClass = p.productImage ? (p.model ? ' has-product-img' : ' img-only') : '';
    return `<div class="blog-mag-card" onclick="openBlogPost('${p.slug}')">
      <div class="blog-mag-hd blog-brand-${brand}${hdClass}">
        <span class="blog-mag-cat-pill">${escHtml(p.cat)}</span>
        ${p.rating ? `<span class="blog-mag-rating-badge">${escHtml(p.rating)}</span>` : ''}
        <div class="blog-mag-hd-inner">${hdContent}</div>
        ${p.productImage ? `<img class="blog-mag-product-img" src="${p.productImage}" alt="${escHtml(p.model||p.title)}" loading="lazy">` : ''}
      </div>
      <div class="blog-mag-body">
        <div class="blog-mag-meta">
          <span class="blog-mag-date">${escHtml(p.date)}</span>
          <span class="blog-mag-read"><span class="blog-mag-dot"></span>${escHtml(p.read)} С‡РµС‚РµРЅРµ</span>
        </div>
        <div class="blog-mag-title">${escHtml(p.title)}</div>
        <div class="blog-mag-summary">${escHtml(p.summary)}</div>
        <div class="blog-mag-footer">
          <span class="blog-mag-tag">${escHtml(p.tags[0]||'')}</span>
          <span class="blog-mag-cta">РџСЂРѕС‡РµС‚Рё в†’</span>
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
  // Update breadcrumb: РќР°С‡Р°Р»Рѕ > Р‘Р»РѕРі > [Title]
  const bcEl = document.getElementById('blogBc');
  if (bcEl) {
    const shortTitle = post.title.length > 40 ? post.title.slice(0, 40) + 'вЂ¦' : post.title;
    bcEl.innerHTML = `<ol class="pg-bc-list" itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/" class="pg-bc-home" onclick="closeBlogPage();return false;">РќР°С‡Р°Р»Рѕ</a>
      <meta itemprop="position" content="1"/>
    </li>
    <li class="pg-bc-sep" aria-hidden="true">вЂє</li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a class="pg-bc-home" onclick="closeBlogPost();return false;" style="cursor:pointer">Р‘Р»РѕРі</a>
      <meta itemprop="position" content="2"/>
    </li>
    <li class="pg-bc-sep" aria-hidden="true">вЂє</li>
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
          <h3>РќР°С€Р°С‚Р° РїСЂРёСЃСЉРґР°</h3>
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
        <span class="blog-article-hero-badge info">рџ“– ${escHtml(post.read)}</span>
        <span class="blog-article-hero-badge info">вњЌпёЏ ${escHtml(post.author)}</span>
      </div>
      ${post.productImage ? `<div class="blog-article-hero-product"><img src="${post.productImage}" alt="${escHtml(post.model||post.title)}" loading="lazy"></div>` : ''}
    </header>
    <div class="blog-article-body-wrap">
      <p class="blog-article-lead">${escHtml(post.summary)}</p>
      ${specsHtml}
      <div class="blog-article-body">${post.body}</div>
      ${verdictHtml}
    </div>`;
  // SEO meta
  if (typeof setPageMeta === 'function') setPageMeta(post.title + ' - Most Computers', post.metaDesc);
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
  if (titleEl) titleEl.textContent = 'рџ“° Р‘Р»РѕРі Рё РЅРѕРІРёРЅРё';
  // Remove Article JSON-LD
  const _ld = document.getElementById('_blogPostLD');
  if (_ld) _ld.remove();
  if (typeof setPageMeta === 'function') setPageMeta('Р‘Р»РѕРі - Most Computers', 'Р РµРІСЋС‚Р°, СЃСЂР°РІРЅРµРЅРёСЏ Рё СЃСЉРІРµС‚Рё Р·Р° РєРѕРјРїСЋС‚СЂРё, Р»Р°РїС‚РѕРїРё Рё РµР»РµРєС‚СЂРѕРЅРёРєР° РѕС‚ РµРєРёРїР° РЅР° Most Computers.');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  try { history.replaceState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
  _setPgBc('blogBc', 'Р‘Р»РѕРі Рё РЅРѕРІРёРЅРё', 'closeBlogPage');
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
  _setPgBc('serviceBc', 'РЎРµСЂРІРёР· Рё РїРѕРґРґСЂСЉР¶РєР°', 'closeServicePage');
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('РЎРµСЂРІРёР·РµРЅ С†РµРЅС‚СЉСЂ - Most Computers', 'РЎРµСЂС‚РёС„РёС†РёСЂР°РЅ СЃРµСЂРІРёР· Р·Р° Р»Р°РїС‚РѕРїРё, РєРѕРјРїСЋС‚СЂРё Рё РµР»РµРєС‚СЂРѕРЅРёРєР°. Р”РёР°РіРЅРѕСЃС‚РёРєР°, СЂРµРјРѕРЅС‚ Рё РіР°СЂР°РЅС†РёРѕРЅРЅРѕ РѕР±СЃР»СѓР¶РІР°РЅРµ РІ Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('РЎРµСЂРІРёР·РµРЅ С†РµРЅС‚СЉСЂ');
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
      attribution: 'В© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
      .bindPopup('<strong>РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ</strong><br>Р±СѓР». РЁРёРїС‡РµРЅСЃРєРё РїСЂРѕС…РѕРґ 240');
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
  _setPgBc('deliveryBc', 'Р”РѕСЃС‚Р°РІРєР° Рё РїР»Р°С‰Р°РЅРµ', 'closeDeliveryPage');
  document.getElementById('deliveryPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Р”РѕСЃС‚Р°РІРєР° Рё РїР»Р°С‰Р°РЅРµ - Most Computers', 'Р‘РµР·РїР»Р°С‚РЅР° РґРѕСЃС‚Р°РІРєР° РїСЂРё РїРѕСЂСЉС‡РєРё РЅР°Рґ 100 в‚¬. Р”РѕСЃС‚Р°РІСЏРјРµ СЃ РєСѓСЂРёРµСЂ РІ СЂР°РјРєРёС‚Рµ РЅР° 1-3 СЂР°Р±РѕС‚РЅРё РґРЅРё РІ С†СЏР»Р° Р‘СЉР»РіР°СЂРёСЏ.');
  if (typeof bcOnPage === 'function') bcOnPage('Р”РѕСЃС‚Р°РІРєР° Рё РїР»Р°С‰Р°РЅРµ');
  try { history.pushState({ page: 'delivery' }, '', '?page=delivery'); } catch(e) {}
}
function closeDeliveryPage() {
  document.getElementById('deliveryPage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
// TODO: add dedicated pages for Terms and Privacy
function openTermsPage() { openDeliveryPage(); }
function openPrivacyPage() { openDeliveryPage(); }
function openReturnsSection() {
  openDeliveryPage();
  setTimeout(() => {
    const el = document.getElementById('dlv-faq-returns');
    if (!el) return;
    el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 320);
}
function openWarrantyPage() {
  _setPgBc('warrantyBc', 'Р“Р°СЂР°РЅС†РёРѕРЅРЅРё СѓСЃР»РѕРІРёСЏ', 'closeWarrantyPage');
  document.getElementById('warrantyPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Р“Р°СЂР°РЅС†РёРѕРЅРЅРё СѓСЃР»РѕРІРёСЏ (РћР“РЈ) - Most Computers', 'РћР±С‰Рё РіР°СЂР°РЅС†РёРѕРЅРЅРё СѓСЃР»РѕРІРёСЏ РЅР° РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ РћРћР”. Р“Р°СЂР°РЅС†РёРѕРЅРµРЅ СЃСЂРѕРє, РїСЂРёРµРјР°РЅРµ РЅР° СЂРµРєР»Р°РјР°С†РёРё Рё СЃРµСЂРІРёР·РЅР° РјСЂРµР¶Р° РІ 34 РіРѕСЂРѕРґР° РІ Р‘СЉР»РіР°СЂРёСЏ.');
  if (typeof bcOnPage === 'function') bcOnPage('Р“Р°СЂР°РЅС†РёРѕРЅРЅРё СѓСЃР»РѕРІРёСЏ');
  try { history.pushState({ page: 'warranty' }, '', '?page=warranty'); } catch(e) {}
}
function closeWarrantyPage() {
  document.getElementById('warrantyPage').classList.remove('open');
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
let _warehouseMap = null;
function openContactsPage() {
  _setPgBc('contactsBc', 'РљРѕРЅС‚Р°РєС‚Рё & РљР°Рє РґР° РЅРё РЅР°РјРµСЂРёС‚Рµ', 'closeContactsPage');
  document.getElementById('contactsPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  checkOpenNow();
  try{history.pushState({page:'contacts'}, '', '?page=contacts');}catch(e){}
  _contactsMapInit();
  _warehouseMapInit();
}
function _contactsMapInit() {
  const el = document.getElementById('contactsLeafletMap');
  if (!el) return;
  if (_contactsMap) { setTimeout(() => _contactsMap.invalidateSize(), 200); return; }
  _loadLeaflet(function() {
    if (_contactsMap) return;
    _contactsMap = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([42.679938, 23.359063], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'В© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
      .bindPopup('<strong>РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ</strong><br>Р±СѓР». РЁРёРїС‡РµРЅСЃРєРё РїСЂРѕС…РѕРґ 240');
    setTimeout(() => _contactsMap.invalidateSize(), 200);
  });
}

function _warehouseMapInit() {
  const el = document.getElementById('warehouseLeafletMap');
  if (!el) return;
  if (_warehouseMap) { setTimeout(() => _warehouseMap.invalidateSize(), 200); return; }
  _loadLeaflet(function() {
    if (_warehouseMap) return;
    _warehouseMap = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([42.6558, 23.3894], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'В© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(_warehouseMap);
    const pinIcon = L.divIcon({
      className: '',
      html: '<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="#bd1105"/><circle cx="14" cy="14" r="5.5" fill="#fff"/></svg>',
      iconSize: [28, 36],
      iconAnchor: [14, 36]
    });
    L.marker([42.6558, 23.3894], { icon: pinIcon })
      .addTo(_warehouseMap)
      .bindPopup('<strong>Р¦РµРЅС‚СЂР°Р»РµРЅ СЃРєР»Р°Рґ</strong><br>СѓР». РњР°РіРЅР°СѓСЂСЃРєР° С€РєРѕР»Р° в„–13, Р—РРў');
    setTimeout(() => _warehouseMap.invalidateSize(), 200);
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
  const addr = 'Р±СѓР». РЁРёРїС‡РµРЅСЃРєРё РїСЂРѕС…РѕРґ Р±Р».240, Р¶.Рє. Р“РµРѕ РњРёР»РµРІ, 1111 РЎРѕС„РёСЏ';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(addr).then(() => showToast('рџ“‹ РђРґСЂРµСЃСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = addr; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('рџ“‹ РђРґСЂРµСЃСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!');
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = addr; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('рџ“‹ РђРґСЂРµСЃСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!');
  }
}

function copyWarehouseAddress() {
  const addr = 'СѓР». РњР°РіРЅР°СѓСЂСЃРєР° С€РєРѕР»Р° в„–13, 1784 РЎРѕС„РёСЏ, Р—РРў, СЃРіСЂР°РґР° 1';
  navigator.clipboard ? navigator.clipboard.writeText(addr).then(() => showToast('рџ“‹ РђРґСЂРµСЃСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!')).catch(() => {
    const ta = document.createElement('textarea'); ta.value = addr; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('рџ“‹ РђРґСЂРµСЃСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!');
  }) : (() => { const ta = document.createElement('textarea'); ta.value = addr; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('рџ“‹ РђРґСЂРµСЃСЉС‚ Рµ РєРѕРїРёСЂР°РЅ!'); })();
}

function copyPlusCode() {
  const code = 'M9H5+XJ Sofia';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => showToast('рџ“Ќ Plus Code Рµ РєРѕРїРёСЂР°РЅ!')).catch(() => showToast('Plus Code: M9H5+XJ Sofia'));
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

  const _scWH = (()=>{ try{return JSON.parse(localStorage.getItem('mc_store_config')||'{}');}catch(e){return {};} })();
  let isOpen = false;
  if (day >= 1 && day <= 5 && time >= (_scWH.storeOpenMin||570) && time < (_scWH.storeCloseMin||1095)) isOpen = true;

  // Highlight today in table
  const rows = document.querySelectorAll('#hoursTable tr');
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // table row index for each JS day
  rows.forEach(r => r.style.fontWeight = '');
  if (rows[dayMap[day]]) {
    rows[dayMap[day]].style.background = 'var(--primary-light)';
    rows[dayMap[day]].style.borderRadius = '6px';
  }

  badge.innerHTML = isOpen
    ? '<span style="display:inline-flex;align-items:center;gap:6px;background:#e8f9ed;color:#1a7f37;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#34c759;display:inline-block;"></span> РћС‚РІРѕСЂРµРЅРѕ СЃРµРіР°</span>'
    : '<span style="display:inline-flex;align-items:center;gap:6px;background:#fef2f2;color:#dc2626;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span> Р—Р°С‚РІРѕСЂРµРЅРѕ</span>';

  // Warehouse badge - Mon-Fri 09:00-17:00 (540-1020)
  const warehouseBadge = document.getElementById('warehouseOpenNowBadge');
  if (warehouseBadge) {
    const whOpen = day >= 1 && day <= 5 && time >= (_scWH.warehouseOpenMin||540) && time < (_scWH.warehouseCloseMin||1020);
    warehouseBadge.innerHTML = whOpen
      ? '<span style="display:inline-flex;align-items:center;gap:6px;background:#e8f9ed;color:#1a7f37;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#34c759;display:inline-block;"></span> РћС‚РІРѕСЂРµРЅРѕ СЃРµРіР°</span>'
      : '<span style="display:inline-flex;align-items:center;gap:6px;background:#fef2f2;color:#dc2626;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span> Р—Р°С‚РІРѕСЂРµРЅРѕ</span>';
    const whRows = document.querySelectorAll('#warehouseHoursTable tr');
    whRows.forEach(r => { r.style.background = ''; });
    if (whRows[dayMap[day]]) {
      whRows[dayMap[day]].style.background = 'var(--primary-light)';
      whRows[dayMap[day]].style.borderRadius = '6px';
    }
  }
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
  btnTxt.textContent = 'РџСЂРѕРІРµСЂСЏРІР°РјРµвЂ¦';
  loader.style.display = 'inline-block';
  _svcTrkClearResult();

  const searchType  = order ? 'order' : 'warranty';
  const searchValue = val;

  // TODO: replace setTimeout with real API fetch
  setTimeout(() => {
    btn.disabled = false;
    btnTxt.textContent = 'рџ”Ќ РџСЂРѕРІРµСЂРё СЃС‚Р°С‚СѓСЃ';
    loader.style.display = 'none';

    if (searchValue.endsWith('0')) {
      _svcTrkShowError('вљ пёЏ РќСЏРјР° РЅР°РјРµСЂРµРЅР° РїРѕСЂСЉС‡РєР° СЃ С‚РѕР·Рё РЅРѕРјРµСЂ. РџСЂРѕРІРµСЂРµС‚Рµ РґР°Р»Рё РЅРѕРјРµСЂСЉС‚ Рµ РёР·РїРёСЃР°РЅ РїСЂР°РІРёР»РЅРѕ.');
    } else {
      const demo = { found:true, status:'Р’ СЂРµРјРѕРЅС‚', updatedAt:'20.11.2025',
        step:'РР·С‡Р°РєРІР° СЂРµР·РµСЂРІРЅРё С‡Р°СЃС‚Рё', location:'РЎРµСЂРІРёР·РµРЅ С†РµРЅС‚СЉСЂ - РЎРѕС„РёСЏ', searchType, searchValue };
      _svcTrkShowResult(demo, false);
      try { localStorage.setItem(_SVCTRK_LAST, JSON.stringify(demo)); } catch(e) {}
      _svcTrkSaveHistory(demo);
      _svcTrkUpdateHistory();
    }
  }, 1200);
}

function _svcTrkPillClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('СЂРµРјРѕРЅС‚'))                    return 'svc-pill-repair';
  if (s.includes('РёР·С‡Р°РєРІР°') || s.includes('С‡Р°СЃС‚Рё')) return 'svc-pill-waiting';
  if (s.includes('РіРѕС‚РѕРІ')   || s.includes('РїРѕР»СѓС‡Р°РІР°РЅРµ')) return 'svc-pill-ready';
  return 'svc-pill-default';
}

function _svcTrkShowResult(data, fromCache) {
  if (!data || !data.found) { _svcTrkShowError('вљ пёЏ РќСЏРјР° РЅР°РјРµСЂРµРЅР° РїРѕСЂСЉС‡РєР° СЃ С‚РѕР·Рё РЅРѕРјРµСЂ.'); return; }
  const box       = document.getElementById('svcTrkResult');
  const pill      = _svcTrkPillClass(data.status);
  const isReady   = pill === 'svc-pill-ready';
  const typeLabel = data.searchType === 'order' ? 'РЎРµСЂРІРёР·РЅР° РїРѕСЂСЉС‡РєР°' : 'Р“Р°СЂР°РЅС†РёРѕРЅРЅР° РєР°СЂС‚Р°';
  const sv        = _svcEsc(data.searchValue || '');

  box.innerHTML = `
    <div class="svc-result-ok">вњ… РџРѕСЂСЉС‡РєР°С‚Р° Рµ РЅР°РјРµСЂРµРЅР°</div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
      <span class="svc-result-label">${typeLabel} в†’ ${sv}</span>
      <button type="button" class="svc-copy-btn"
        onclick="navigator.clipboard&&navigator.clipboard.writeText('${sv}').then(()=>{this.textContent='РљРѕРїРёСЂР°РЅРѕ';setTimeout(()=>this.textContent='РљРѕРїРёСЂР°Р№ РЅРѕРјРµСЂ',1500)})">РљРѕРїРёСЂР°Р№ РЅРѕРјРµСЂ</button>
    </div>
    <div class="svc-result-row"><span class="svc-result-label">РЎС‚Р°С‚СѓСЃ:</span> ${_svcEsc(data.status)} <span class="svc-pill ${pill}">${_svcEsc(data.status)}</span></div>
    <div class="svc-result-row"><span class="svc-result-label">РџРѕСЃР»РµРґРЅР° Р°РєС‚СѓР°Р»РёР·Р°С†РёСЏ:</span> ${_svcEsc(data.updatedAt || '-')}</div>
    <div class="svc-result-row"><span class="svc-result-label">Р•С‚Р°Рї:</span> ${_svcEsc(data.step || '-')}</div>
    <div class="svc-result-row"><span class="svc-result-label">Р›РѕРєР°С†РёСЏ:</span> ${_svcEsc(data.location || '-')}</div>
    ${isReady ? '<div class="svc-ready-note">вњ… Р РµРјРѕРЅС‚СЉС‚ Рµ РїСЂРёРєР»СЋС‡РёР». РќРѕСЃРµС‚Рµ СЃРµСЂРІРёР·РЅРёСЏ РїСЂРѕС‚РѕРєРѕР» РїСЂРё РїРѕР»СѓС‡Р°РІР°РЅРµ.</div>' : ''}
    ${fromCache ? '<div style="margin-top:8px;font-size:12px;color:var(--muted);"><em>РџРѕРєР°Р·Р°РЅ Рµ РїРѕСЃР»РµРґРЅРёСЏС‚ СЂРµР·СѓР»С‚Р°С‚ РѕС‚ РїСЂРµРґРёС€РЅРѕ С‚СЉСЂСЃРµРЅРµ.</em></div>' : ''}
  `;
  box.style.display = 'block';
  requestAnimationFrame(() => box.classList.add('show'));
}

function _svcTrkShowError(msg) {
  const box = document.getElementById('svcTrkResult');
  box.innerHTML = `
    <div class="svc-result-err">${_svcEsc(msg)}</div>
    <div style="font-size:13px;color:var(--text2);">РџСЂРѕРІРµСЂРµС‚Рµ РґР°Р»Рё РЅРѕРјРµСЂСЉС‚ Рµ РёР·РїРёСЃР°РЅ РїСЂР°РІРёР»РЅРѕ Рё РѕРїРёС‚Р°Р№С‚Рµ РѕС‚РЅРѕРІРѕ.</div>
    <div style="margin-top:8px;font-size:13px;">РџСЂРё РЅСѓР¶РґР° РѕС‚ СЃСЉРґРµР№СЃС‚РІРёРµ: <a href="tel:0700144 11" style="color:var(--primary);font-weight:700;">0700 144 11</a></div>
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
    const label = item.searchType === 'order' ? 'РџРѕСЂСЉС‡РєР°' : 'Р“Р°СЂР°РЅС†РёСЏ';
    const sv    = _svcEsc(item.searchValue || '');
    const st    = _svcEsc(item.status || '');
    const type  = _svcEsc(item.searchType || '');
    return `<li style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;gap:6px;flex-wrap:wrap;">
      <span style="font-size:13px;">${label} в†’ ${sv} - ${st}</span>
      <button type="button" class="svc-copy-btn" onclick="_svcTrkRepeat('${type}','${sv}')">РџРѕРІС‚РѕСЂРё</button>
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

// ===== CAREERS PAGE =====
function openCareersPage() {
  const page = document.getElementById('careersPage');
  if (!page) return;
  _setPgBc('careersBc', 'РљР°СЂРёРµСЂРё', 'closeCareersPage');
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('РљР°СЂРёРµСЂРё - Most Computers', 'Р Р°Р±РѕС‚Рё СЃ РЅР°СЃ. Most Computers С‚СЉСЂСЃРё РјРѕС‚РёРІРёСЂР°РЅРё С…РѕСЂР° Р·Р° СЃРІРѕСЏ РµРєРёРї.');
  if (typeof bcOnPage === 'function') bcOnPage('РљР°СЂРёРµСЂРё');
  if (typeof renderCareersPage === 'function') renderCareersPage();
  try { history.pushState({ page: 'careers' }, '', '?page=careers'); } catch(e) {}
}
function closeCareersPage() {
  const page = document.getElementById('careersPage');
  if (!page) return;
  page.classList.remove('open');
  setTimeout(() => { page.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}

// ===== ABOUT PAGE =====
function openAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  _setPgBc('aboutBc', 'Р—Р° РЅР°СЃ', 'closeAboutPage');
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Р—Р° РЅР°СЃ - Most Computers', 'Most Computers - РЅР°Рґ 36 РіРѕРґРёРЅРё РѕРїРёС‚ РІ РїСЂРѕРґР°Р¶Р±Р°С‚Р° РЅР° РєРѕРјРїСЋС‚СЂРё Рё РµР»РµРєС‚СЂРѕРЅРёРєР°. РЎРїРµС†РёР°Р»РёР·РёСЂР°РЅ РјР°РіР°Р·РёРЅ РІ С†РµРЅС‚СЉСЂР° РЅР° РЎРѕС„РёСЏ.');
  if (typeof bcOnPage === 'function') bcOnPage('Р—Р° РЅР°СЃ');
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
// directly in main.js - no DOMContentLoaded wrapper needed here
// (deferred scripts run before DOMContentLoaded, so the handler
//  would cause a redundant second render on every page load).

if (typeof module !== 'undefined') module.exports = {
  openWarrantyPage, closeWarrantyPage,
  openDeliveryPage, closeDeliveryPage,
  openServicePage,  closeServicePage,
  openContactsPage, closeContactsPage,
  openBlogPage,     closeBlogPage,
};

// ===== PWA =====
(function() {
  // 1. Generate SVG icon as data URL
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="115" fill="#bd1105"/>
    <text x="256" y="340" font-size="280" text-anchor="middle" fill="white">рџ›’</text>
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
    description: 'РћРЅР»Р°Р№РЅ РјР°РіР°Р·РёРЅ Р·Р° РµР»РµРєС‚СЂРѕРЅРёРєР°',
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

  // 3. Service Worker - registers when hosted on HTTPS
  // (Blob URLs not supported for SW - browser security restriction)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => { console.log('MC SW вњ“', reg.scope); window._mcSwReg = reg; })
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
        showToast('вњ“ РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ Рµ РёРЅСЃС‚Р°Р»РёСЂР°РЅ!');
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
    showToast('вљ пёЏ Р‘СЂР°СѓР·СЉСЂСЉС‚ С‚Рё РЅРµ РїРѕРґРґСЉСЂР¶Р° РёР·РІРµСЃС‚РёСЏ');
    return;
  }
  if (Notification.permission === 'granted') {
    showToast('вњ“ РР·РІРµСЃС‚РёСЏС‚Р° РІРµС‡Рµ СЃР° Р°РєС‚РёРІРёСЂР°РЅРё!');
    return;
  }
  if (Notification.permission === 'denied') {
    showToast('вљ пёЏ РР·РІРµСЃС‚РёСЏС‚Р° СЃР° Р±Р»РѕРєРёСЂР°РЅРё РІ Р±СЂР°СѓР·СЉСЂР°');
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    showToast('рџ”” Р©Рµ РїРѕР»СѓС‡Р°РІР°С€ РёР·РІРµСЃС‚РёСЏ Р·Р° РіРѕСЂРµС‰Рё РѕС„РµСЂС‚Рё!');
    localStorage.setItem('mc_push_granted', '1');
    // Demo: send a test notification after 3s
    setTimeout(() => {
      new Notification('РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ рџ”Ґ', {
        body: 'Р”РѕР±СЂРµ РґРѕС€СЉР»! РЎР»РµРґРё Р·Р° РµРєСЃРєР»СѓР·РёРІРЅРё РѕС„РµСЂС‚Рё.',
        icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">рџ›’</text></svg>'),
        tag: 'mc-welcome'
      });
    }, 3000);
  } else {
    showToast('РР·РІРµСЃС‚РёСЏС‚Р° РЅРµ СЃР° Р°РєС‚РёРІРёСЂР°РЅРё');
  }
}

function sendPromoNotification(title, body, url) {
  if (Notification.permission !== 'granted') return;
  const n = new Notification(title || 'РњРѕСЃС‚ РљРѕРјРїСЋС‚СЉСЂСЃ рџ”Ґ', {
    body: body || 'РќРѕРІР° РѕС„РµСЂС‚Р° С‚Рµ РѕС‡Р°РєРІР°!',
    icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">рџ›’</text></svg>'),
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



// в”Ђв”Ђ Lazy Admin Loader в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
// admin.js (144 KB) СЃРµ Р·Р°СЂРµР¶РґР° СЃР°РјРѕ РєРѕРіР°С‚Рѕ РїРѕС‚СЂРµР±РёС‚РµР»СЏС‚ РѕС‚РІРѕСЂРё admin РїР°РЅРµР»Р°.
// РЎС‚СѓР±РѕРІРµС‚Рµ РїРѕ-РґРѕР»Сѓ СЃРµ Р·Р°РјРµРЅСЏС‚ Р°РІС‚РѕРјР°С‚РёС‡РЅРѕ РѕС‚ СЂРµР°Р»РЅРёС‚Рµ С„СѓРЅРєС†РёРё СЃР»РµРґ Р·Р°СЂРµР¶РґР°РЅРµ.

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
    showToast('вљ пёЏ Р“СЂРµС€РєР° РїСЂРё Р·Р°СЂРµР¶РґР°РЅРµ РЅР° Admin РїР°РЅРµР»Р°');
  };
  document.head.appendChild(s);
}

// Stub - Р·Р°РјРµРЅСЏ СЃРµ РѕС‚ СЂРµР°Р»РЅР°С‚Р° С„СѓРЅРєС†РёСЏ РІ admin.js СЃР»РµРґ Р·Р°СЂРµР¶РґР°РЅРµ
function openAdminPage() {
  _loadAdminScript(() => {
    if (typeof openAdminPage === 'function') openAdminPage();
  });
}

// Stub - РЅСѓР¶РµРЅ РЅР° ui.js РїСЂРµРґРё admin.js РґР° СЃРµ Р·Р°СЂРµРґРё
function closeAdminPage() {
  const page = document.getElementById('adminPage');
  if (page) page.style.display = 'none';
  document.body.style.overflow = '';
}

// ===== ANALYTICS - Most Computers =====
// GA4 + Meta Pixel + dev console
// Load order: after main.js (last) so all functions are defined
// ======================================

(function () {
  'use strict';

  // в”Ђв”Ђ Config в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  const IS_DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const GA4_ID = 'G-HE0YMD8BQ7';
  const FB_PIXEL = ''; // РѕРїС†РёРѕРЅР°Р»РµРЅ Meta Pixel ID

  // в”Ђв”Ђ Core trackEvent в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

    // LocalStorage event log (capped at 200 entries - for debugging & simple analytics)
    try {
      const log = JSON.parse(localStorage.getItem('mc_analytics_log') || '[]');
      log.unshift({ event: eventName, data: payload });
      if (log.length > 200) log.length = 200;
      localStorage.setItem('mc_analytics_log', JSON.stringify(log));
    } catch (_) {}
    // Persistent log (survives page reload, capped at 1000 entries)
    try {
      const persistent = JSON.parse(localStorage.getItem('mc_analytics_persistent') || '[]');
      persistent.unshift({ event: eventName, data: payload });
      if (persistent.length > 1000) persistent.length = 1000;
      localStorage.setItem('mc_analytics_persistent', JSON.stringify(persistent));
    } catch (_) {}
  }

  // в”Ђв”Ђ page_view в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  function trackPageView() {
    trackEvent('page_view', {
      page_title: document.title,
      page_location: location.href,
      referrer: document.referrer || '(direct)'
    });
  }

  // в”Ђв”Ђ view_product в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ add_to_cart в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ remove_from_cart в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ add_to_wishlist / remove_from_wishlist в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ begin_checkout в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ apply_promo в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ purchase в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ search в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  function hookSearch() {
    const _origFull = window.doFullSearch;
    if (typeof _origFull === 'function') {
      window.doFullSearch = function () {
        const q = (document.getElementById('searchInput') || {}).value || '';
        const result = _origFull.apply(this, arguments);
        if (q.trim()) {
          // Results count available after render - approximate with DOM query
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

  // в”Ђв”Ђ view_category в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

  // в”Ђв”Ђ Init: wire up all hooks в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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
      console.log('%c[Analytics] Initialized - hooks active', 'color:#34c759;font-weight:700');
    }
  }

  // Run after DOM + app.js are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded already fired - defer one tick so app.js globals are set
    setTimeout(init, 0);
  }

  // в”Ђв”Ђ Public API в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  window.mcTrack = trackEvent;
  window.mcAnalyticsLog = function () {
    try { return JSON.parse(localStorage.getItem('mc_analytics_log') || '[]'); } catch (_) { return []; }
  };
})();

// Lazy bundle initialization - runs after app-lazy.js loads
// blogPosts (pages.js) is only available after lazy load - re-render hero panel so blog widget appears
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

  // Open admin panel directly via ?admin=1 (no login required)
  if (new URLSearchParams(location.search).get('admin') === '1') {
    if (typeof openAdminPage === 'function') openAdminPage();
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
