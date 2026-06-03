
function starsHTML(r){return '★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));}

const _SVG_PLACEHOLDERS = (function(){
  function enc(s){ return 'data:image/svg+xml,'+encodeURIComponent(s); }
  const S='stroke="#cbd5e1"',SW='stroke-width',F='fill="#e2e8f0"',BG='fill="#f8fafc"',N='fill="none"';
  return {
    monitor:    enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="28" y="30" width="144" height="100" rx="6" ${N} ${S} ${SW}="5"/><rect x="38" y="40" width="124" height="80" rx="2" ${F}/><rect x="86" y="130" width="28" height="22" ${N} ${S} ${SW}="5"/><rect x="56" y="150" width="88" height="10" rx="5" ${N} ${S} ${SW}="5"/></svg>`),
    laptop:     enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="26" y="38" width="148" height="96" rx="6" ${N} ${S} ${SW}="5"/><rect x="36" y="48" width="128" height="76" rx="2" ${F}/><path d="M14 148 Q14 136 26 136 L174 136 Q186 136 186 148 L190 160 Q192 166 186 166 L14 166 Q8 166 10 160 Z" ${N} ${S} ${SW}="5"/><rect x="74" y="146" width="52" height="12" rx="4" ${N} ${S} ${SW}="3"/></svg>`),
    cpu:        enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="55" y="55" width="90" height="90" rx="6" ${N} ${S} ${SW}="5"/><rect x="67" y="67" width="66" height="66" rx="3" ${F}/><line x1="75" y1="55" x2="75" y2="38" ${S} ${SW}="4" stroke-linecap="round"/><line x1="92" y1="55" x2="92" y2="38" ${S} ${SW}="4" stroke-linecap="round"/><line x1="109" y1="55" x2="109" y2="38" ${S} ${SW}="4" stroke-linecap="round"/><line x1="126" y1="55" x2="126" y2="38" ${S} ${SW}="4" stroke-linecap="round"/><line x1="75" y1="145" x2="75" y2="162" ${S} ${SW}="4" stroke-linecap="round"/><line x1="92" y1="145" x2="92" y2="162" ${S} ${SW}="4" stroke-linecap="round"/><line x1="109" y1="145" x2="109" y2="162" ${S} ${SW}="4" stroke-linecap="round"/><line x1="126" y1="145" x2="126" y2="162" ${S} ${SW}="4" stroke-linecap="round"/><line x1="55" y1="75" x2="38" y2="75" ${S} ${SW}="4" stroke-linecap="round"/><line x1="55" y1="92" x2="38" y2="92" ${S} ${SW}="4" stroke-linecap="round"/><line x1="55" y1="109" x2="38" y2="109" ${S} ${SW}="4" stroke-linecap="round"/><line x1="55" y1="126" x2="38" y2="126" ${S} ${SW}="4" stroke-linecap="round"/><line x1="145" y1="75" x2="162" y2="75" ${S} ${SW}="4" stroke-linecap="round"/><line x1="145" y1="92" x2="162" y2="92" ${S} ${SW}="4" stroke-linecap="round"/><line x1="145" y1="109" x2="162" y2="109" ${S} ${SW}="4" stroke-linecap="round"/><line x1="145" y1="126" x2="162" y2="126" ${S} ${SW}="4" stroke-linecap="round"/></svg>`),
    gpu:        enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="16" y="62" width="164" height="76" rx="8" ${N} ${S} ${SW}="5"/><circle cx="70" cy="100" r="27" ${N} ${S} ${SW}="4"/><circle cx="70" cy="100" r="10" ${F}/><circle cx="130" cy="100" r="27" ${N} ${S} ${SW}="4"/><circle cx="130" cy="100" r="10" ${F}/><rect x="170" y="68" width="12" height="64" rx="4" ${N} ${S} ${SW}="4"/><rect x="26" y="50" width="20" height="14" rx="2" ${N} ${S} ${SW}="4"/><rect x="52" y="50" width="20" height="14" rx="2" ${N} ${S} ${SW}="4"/></svg>`),
    case:       enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="58" y="20" width="84" height="158" rx="8" ${N} ${S} ${SW}="5"/><rect x="68" y="30" width="64" height="106" rx="3" ${F}/><rect x="68" y="144" width="30" height="8" rx="3" ${N} ${S} ${SW}="3"/><circle cx="114" cy="148" r="5" ${N} ${S} ${SW}="3"/></svg>`),
    ram:        enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="30" y="72" width="140" height="52" rx="4" ${N} ${S} ${SW}="5"/><rect x="40" y="82" width="120" height="32" rx="2" ${F}/><rect x="92" y="124" width="16" height="12" rx="2" ${N} ${S} ${SW}="4"/><rect x="48" y="87" width="18" height="22" rx="2" ${N} ${S} ${SW}="3"/><rect x="74" y="87" width="18" height="22" rx="2" ${N} ${S} ${SW}="3"/><rect x="100" y="87" width="18" height="22" rx="2" ${N} ${S} ${SW}="3"/><rect x="126" y="87" width="18" height="22" rx="2" ${N} ${S} ${SW}="3"/><line x1="48" y1="124" x2="48" y2="142" ${S} ${SW}="3" stroke-linecap="round"/><line x1="58" y1="124" x2="58" y2="142" ${S} ${SW}="3" stroke-linecap="round"/><line x1="68" y1="124" x2="68" y2="142" ${S} ${SW}="3" stroke-linecap="round"/><line x1="78" y1="124" x2="78" y2="142" ${S} ${SW}="3" stroke-linecap="round"/><line x1="112" y1="124" x2="112" y2="142" ${S} ${SW}="3" stroke-linecap="round"/><line x1="122" y1="124" x2="122" y2="142" ${S} ${SW}="3" stroke-linecap="round"/><line x1="132" y1="124" x2="132" y2="142" ${S} ${SW}="3" stroke-linecap="round"/><line x1="142" y1="124" x2="142" y2="142" ${S} ${SW}="3" stroke-linecap="round"/></svg>`),
    ssd:        enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="30" y="82" width="140" height="36" rx="5" ${N} ${S} ${SW}="5"/><rect x="40" y="92" width="108" height="16" rx="2" ${F}/><line x1="148" y1="92" x2="160" y2="92" ${S} ${SW}="3" stroke-linecap="round"/><line x1="148" y1="100" x2="160" y2="100" ${S} ${SW}="3" stroke-linecap="round"/><line x1="148" y1="108" x2="160" y2="108" ${S} ${SW}="3" stroke-linecap="round"/><rect x="44" y="94" width="20" height="12" rx="1" ${N} ${S} ${SW}="2.5"/><rect x="72" y="94" width="20" height="12" rx="1" ${N} ${S} ${SW}="2.5"/><rect x="100" y="94" width="20" height="12" rx="1" ${N} ${S} ${SW}="2.5"/><circle cx="38" cy="100" r="6" ${N} ${S} ${SW}="3"/><rect x="44" y="118" width="72" height="10" rx="3" ${N} ${S} ${SW}="2.5"/></svg>`),
    mobo:       enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="22" y="22" width="156" height="156" rx="5" ${N} ${S} ${SW}="5"/><rect x="38" y="52" width="56" height="56" rx="3" ${N} ${S} ${SW}="4"/><rect x="48" y="62" width="36" height="36" rx="2" ${F}/><rect x="108" y="38" width="10" height="52" rx="2" ${N} ${S} ${SW}="3"/><rect x="124" y="38" width="10" height="52" rx="2" ${N} ${S} ${SW}="3"/><rect x="140" y="38" width="10" height="52" rx="2" ${N} ${S} ${SW}="3"/><rect x="156" y="38" width="10" height="52" rx="2" ${N} ${S} ${SW}="3"/><rect x="38" y="126" width="134" height="8" rx="2" ${N} ${S} ${SW}="3"/><rect x="38" y="144" width="96" height="8" rx="2" ${N} ${S} ${SW}="3"/><rect x="22" y="22" width="16" height="90" ${F}/></svg>`),
    psu:        enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="28" y="48" width="144" height="104" rx="8" ${N} ${S} ${SW}="5"/><rect x="38" y="58" width="94" height="84" rx="3" ${F}/><circle cx="152" cy="100" r="28" ${N} ${S} ${SW}="3"/><circle cx="152" cy="100" r="14" ${N} ${S} ${SW}="2.5"/><line x1="152" y1="72" x2="152" y2="128" ${S} ${SW}="2.5" stroke-linecap="round"/><line x1="124" y1="100" x2="180" y2="100" ${S} ${SW}="2.5" stroke-linecap="round"/><rect x="42" y="64" width="16" height="10" rx="2" ${N} ${S} ${SW}="2.5"/><circle cx="110" cy="69" r="5" ${N} ${S} ${SW}="2.5"/><line x1="28" y1="80" x2="10" y2="80" ${S} ${SW}="3" stroke-linecap="round"/><line x1="28" y1="94" x2="10" y2="94" ${S} ${SW}="3" stroke-linecap="round"/><line x1="28" y1="108" x2="10" y2="108" ${S} ${SW}="3" stroke-linecap="round"/><line x1="28" y1="122" x2="10" y2="122" ${S} ${SW}="3" stroke-linecap="round"/></svg>`),
    cooling:    enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><circle cx="100" cy="100" r="72" ${N} ${S} ${SW}="5"/><circle cx="100" cy="100" r="18" ${F} ${S} ${SW}="4"/><path d="M100 28 Q118 50 104 82 Q88 62 100 28Z" ${N} ${S} ${SW}="4" stroke-linejoin="round"/><path d="M172 100 Q150 118 118 104 Q138 88 172 100Z" ${N} ${S} ${SW}="4" stroke-linejoin="round"/><path d="M100 172 Q82 150 96 118 Q112 138 100 172Z" ${N} ${S} ${SW}="4" stroke-linejoin="round"/><path d="M28 100 Q50 82 82 96 Q62 112 28 100Z" ${N} ${S} ${SW}="4" stroke-linejoin="round"/><circle cx="40" cy="40" r="5" ${N} ${S} ${SW}="3"/><circle cx="160" cy="40" r="5" ${N} ${S} ${SW}="3"/><circle cx="160" cy="160" r="5" ${N} ${S} ${SW}="3"/><circle cx="40" cy="160" r="5" ${N} ${S} ${SW}="3"/></svg>`),
    keyboard:   enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="16" y="62" width="168" height="88" rx="8" ${N} ${S} ${SW}="5"/><rect x="26" y="72" width="148" height="68" rx="4" ${F}/><rect x="32" y="78" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="50" y="78" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="68" y="78" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="86" y="78" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="104" y="78" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="122" y="78" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="140" y="78" width="24" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="32" y="92" width="20" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="56" y="92" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="74" y="92" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="92" y="92" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="110" y="92" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="128" y="92" width="14" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="146" y="92" width="18" height="10" rx="2" ${N} ${S} ${SW}="2"/><rect x="56" y="118" width="88" height="12" rx="3" ${N} ${S} ${SW}="3"/></svg>`),
    mouse:      enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><path d="M100 168 Q56 168 44 130 Q34 96 48 70 Q62 44 100 40 Q138 44 152 70 Q166 96 156 130 Q144 168 100 168Z" ${F} ${S} ${SW}="5"/><line x1="100" y1="40" x2="100" y2="110" ${S} ${SW}="4" stroke-linecap="round"/><rect x="90" y="70" width="20" height="32" rx="10" ${N} ${S} ${SW}="4"/><path d="M100 40 Q100 22 110 14" ${N} ${S} ${SW}="3" stroke-linecap="round"/></svg>`),
    headphones: enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><path d="M44 110 Q44 44 100 44 Q156 44 156 110" ${N} ${S} ${SW}="5" stroke-linecap="round"/><rect x="24" y="102" width="32" height="44" rx="14" ${N} ${S} ${SW}="5"/><rect x="32" y="110" width="16" height="28" rx="8" ${F}/><rect x="144" y="102" width="32" height="44" rx="14" ${N} ${S} ${SW}="5"/><rect x="152" y="110" width="16" height="28" rx="8" ${F}/><line x1="44" y1="108" x2="44" y2="82" ${S} ${SW}="4" stroke-linecap="round"/><line x1="156" y1="108" x2="156" y2="82" ${S} ${SW}="4" stroke-linecap="round"/></svg>`),
    webcam:     enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="50" y="52" width="100" height="72" rx="10" ${N} ${S} ${SW}="5"/><rect x="60" y="62" width="80" height="52" rx="6" ${F}/><circle cx="100" cy="88" r="22" ${N} ${S} ${SW}="4"/><circle cx="100" cy="88" r="11" ${N} ${S} ${SW}="3"/><circle cx="100" cy="88" r="5" fill="#cbd5e1"/><rect x="82" y="124" width="36" height="10" rx="3" ${N} ${S} ${SW}="4"/><rect x="70" y="134" width="60" height="12" rx="4" ${N} ${S} ${SW}="4"/><circle cx="134" cy="64" r="4" ${N} ${S} ${SW}="2.5"/></svg>`),
    phone:      enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="62" y="22" width="76" height="156" rx="14" ${N} ${S} ${SW}="5"/><rect x="72" y="36" width="56" height="116" rx="6" ${F}/><rect x="82" y="160" width="36" height="5" rx="3" ${N} ${S} ${SW}="3"/><circle cx="100" cy="30" r="4" ${N} ${S} ${SW}="2.5"/><rect x="58" y="68" width="6" height="20" rx="3" ${N} ${S} ${SW}="3"/><rect x="58" y="94" width="6" height="20" rx="3" ${N} ${S} ${SW}="3"/><rect x="136" y="78" width="6" height="16" rx="3" ${N} ${S} ${SW}="3"/></svg>`),
    tablet:     enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="18" y="52" width="164" height="110" rx="12" ${N} ${S} ${SW}="5"/><rect x="30" y="64" width="136" height="86" rx="5" ${F}/><circle cx="186" cy="107" r="6" ${N} ${S} ${SW}="3"/><circle cx="100" cy="56" r="3.5" ${N} ${S} ${SW}="2.5"/></svg>`),
    printer:    enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="22" y="68" width="156" height="78" rx="8" ${N} ${S} ${SW}="5"/><rect x="32" y="78" width="136" height="58" rx="4" ${F}/><rect x="42" y="144" width="116" height="20" rx="4" ${N} ${S} ${SW}="4"/><rect x="42" y="50" width="116" height="20" rx="4" ${N} ${S} ${SW}="4"/><rect x="62" y="36" width="76" height="18" rx="2" ${N} ${S} ${SW}="3"/><circle cx="150" cy="98" r="6" ${N} ${S} ${SW}="3"/><circle cx="164" cy="98" r="6" ${N} ${S} ${SW}="3"/><rect x="38" y="84" width="56" height="26" rx="3" ${N} ${S} ${SW}="2.5"/></svg>`),
    tv:         enc(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" ${BG}/><rect x="14" y="28" width="172" height="114" rx="8" ${N} ${S} ${SW}="5"/><rect x="24" y="38" width="152" height="94" rx="3" ${F}/><rect x="38" y="142" width="26" height="22" rx="4" ${N} ${S} ${SW}="4"/><rect x="136" y="142" width="26" height="22" rx="4" ${N} ${S} ${SW}="4"/><rect x="28" y="162" width="46" height="8" rx="4" ${N} ${S} ${SW}="4"/><rect x="126" y="162" width="46" height="8" rx="4" ${N} ${S} ${SW}="4"/></svg>`),
  };
})();

function categoryPlaceholderSvg(cat, subcat){
  const s=(subcat||'').toLowerCase();
  // TV subcat (monitors category)
  if(s==='tv')                                          return _SVG_PLACEHOLDERS.tv;
  // Components
  if(s==='case')                                        return _SVG_PLACEHOLDERS.case;
  if(s==='gpu')                                         return _SVG_PLACEHOLDERS.gpu;
  if(s==='cpu')                                         return _SVG_PLACEHOLDERS.cpu;
  if(s==='ram')                                         return _SVG_PLACEHOLDERS.ram;
  if(s==='ssd_hdd')                                     return _SVG_PLACEHOLDERS.ssd;
  if(s==='motherboard')                                 return _SVG_PLACEHOLDERS.mobo;
  if(s==='psu')                                         return _SVG_PLACEHOLDERS.psu;
  if(s==='cooling')                                     return _SVG_PLACEHOLDERS.cooling;
  // Desktops / gaming
  if(s==='aio')                                         return _SVG_PLACEHOLDERS.monitor;
  if(s==='gaming_pc_s'||s==='office_pc'||s==='workstation') return _SVG_PLACEHOLDERS.case;
  if(s==='gaming_laptop_s'||s==='gaming'||s==='ultrabook'||s==='business'||s==='convertible'||s==='budget') return _SVG_PLACEHOLDERS.laptop;
  // Peripherals
  if(s==='keyboard')                                    return _SVG_PLACEHOLDERS.keyboard;
  if(s==='mouse')                                       return _SVG_PLACEHOLDERS.mouse;
  if(s==='headphones')                                  return _SVG_PLACEHOLDERS.headphones;
  if(s==='webcam')                                      return _SVG_PLACEHOLDERS.webcam;
  // Phones
  if(s==='smartphone')                                  return _SVG_PLACEHOLDERS.phone;
  if(s==='tablet')                                      return _SVG_PLACEHOLDERS.tablet;
// Category fallback
  const c=(cat||'').toLowerCase();
  if(c==='monitors'||c==='monitor'||c==='display')      return _SVG_PLACEHOLDERS.monitor;
  if(c==='laptops'||c==='laptop'||c==='gaming'||c==='game') return _SVG_PLACEHOLDERS.laptop;
  if(c==='desktops'||c==='desktop')                     return _SVG_PLACEHOLDERS.case;
  if(c==='components'||c==='component')                 return _SVG_PLACEHOLDERS.cpu;
  if(c==='cameras'||c==='camera')                       return _SVG_PLACEHOLDERS.webcam;
  if(c==='peripherals')                                 return _SVG_PLACEHOLDERS.keyboard;
  if(c==='audio')                                       return _SVG_PLACEHOLDERS.headphones;
  if(c==='phones'||c==='phone'||c==='mobile'||c==='smartphones'||c==='tablet') return _SVG_PLACEHOLDERS.phone;
  if(c==='printers'||c==='printer'||c==='print')        return _SVG_PLACEHOLDERS.printer;
  if(c==='ups')                                         return _SVG_PLACEHOLDERS.psu;
  return _SVG_PLACEHOLDERS.cpu;
}

// Filter out promotional/banner images that contain keywords indicating
// they are not real product photos (e.g. Icecat promo banners).
function isSafeImgUrl(url) {
  if (!url) return false;
  return !/promotion|promo|banner|PL_|promotionGroup/i.test(url);
}

function makeCard(p,small=false){
  const save=p.old?Math.round(((p.old-p.price)/p.old)*100):0;
  const _eName = escHtml(p.name);
  const safeImg = isSafeImgUrl(p.img) ? p.img : null;
  const imgHtml = safeImg
    ? `<img class="product-img-real" src="${escHtml(safeImg)}" alt="${_eName}" itemprop="image" loading="lazy" width="300" height="300" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${p.emoji}</span>`
    : `<img class="product-img-placeholder" src="${categoryPlaceholderSvg(p.cat,p.subcat)}" alt="" aria-hidden="true" width="200" height="200" loading="lazy">`;
  return `<article class="product-card pos-rel${p.stock===false?' is-out-of-stock':''}" itemscope itemtype="https://schema.org/Product">
    <div class="product-badge-wrap">
      ${p.badge==='sale'?'<span class="badge badge-sale">Промо</span>':''}
      ${p.badge==='new'?'<span class="badge badge-new">Ново</span>':''}
      ${p.badge==='hot'?'<span class="badge badge-hot">Горещо</span>':''}
      ${p.pct>0?`<span class="badge badge-pct">-${p.pct}%</span>`:''}
      ${p.stock===false?'<span class="badge badge-oos">Изчерпан</span>':''}
      ${(p.lowstock||p.badge==='hot')&&p.stock!==false?`<span class="badge badge-lowstock">⚡ Остават само ${(p.id%4)+2} бр.</span>`:''}

    </div>
    <button class="product-wishlist" id="wl-${p.id}" type="button" onclick="toggleWishlist(${p.id},event)" title="Добави в любими" aria-label="Добави в любими"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart"/></svg></button>
    <a href="?product=${p.id}" class="product-img-wrap${small?' small':''}" onclick="openProdPreview(${p.id});return false;" style="cursor:pointer;" aria-label="${_eName}" itemprop="url">
      ${imgHtml}
    </a>
    <div class="product-body">
      <div class="product-brand" itemprop="brand" data-brand-search="${escHtml(p.brand)}" style="cursor:pointer;" title="Виж всички ${escHtml(p.brand)}">${escHtml(p.brand)}</div>
      <h3 class="product-name" itemprop="name"><a href="?product=${p.id}" onclick="openProdPreview(${p.id});return false;" style="color:inherit;text-decoration:none;">${_eName}</a></h3>
      <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating} (${p.rv})</span></div>
      <div class="price-row">
        <div class="price-current${p.badge==='sale'?' sale':''}" itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="priceCurrency" content="EUR"><link itemprop="availability" href="${p.stock===false?'https://schema.org/OutOfStock':'https://schema.org/InStock'}"><span itemprop="price" content="${p.price}">${fmtPrice(p.price, p.badge==='sale'?'sale':'')}</span></div>
        ${p.old?`<div class="price-old">${fmtEur(p.old)}</div><div class="price-save">-${save}%</div>`:''}
      </div>
      <div class="product-footer">
        ${p.stock!==false?`<div class="card-delivery-hint">${p.badge==='sale'?'⚡ Бърза доставка — поръчай до 17:00':'📦 Доставка до 2 работни дни'}</div>`:''}
        ${p.stock!==false?`<div class="card-warranty">🛡 2г. гаранция</div>`:''}
        ${p.stock===false
          ? `<button type="button" class="add-cart-btn oos-notify-btn" onclick="oosNotify(${p.id})">🔔 Уведоми ме при наличност</button>
          <button type="button" class="card-see-similar" onclick="event.stopPropagation();openCatPage('${p.cat}')">Виж подобни →</button>`
          : `<button type="button" class="add-cart-btn" id="cb-${p.id}" onclick="addToCart(${p.id})"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави в кошница</button>`
        }
        <div class="row-gap-6 card-secondary-btns" style="margin-top:6px;">
          <button type="button" class="card-sec-btn product-quick-view-btn" onclick="openProductPage(${p.id})" title="Бърз преглед"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-eye"/></svg><span class="card-sec-btn-label">Преглед</span></button>
          <button type="button" class="card-sec-btn" onclick="openQuickOrder(${p.id})" title="Бърза поръчка"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-bolt"/></svg><span class="card-sec-btn-label">Бърза поръчка</span></button>
          <button type="button" class="card-sec-btn" id="cmp-btn-${p.id}" onclick="toggleCompare(${p.id},!compareList.includes(${p.id}))" title="Сравни"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-compare"/></svg><span class="card-sec-btn-label">Сравни</span></button>
        </div>
      </div>
    </div>
  </article>`;
}

