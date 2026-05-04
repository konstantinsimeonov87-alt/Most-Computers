// ===== BLOG / SERVICE / DELIVERY PAGES =====
const blogPosts = [
  { emoji:'💻', cat:'Ревю', title:'MacBook Pro M4 Pro — Worth It?', date:'07 Март 2026', read:'5 мин', summary:'Тествахме новия MacBook Pro M4 Pro в реални условия — видео монтаж, код и gaming. Ето резултатите.' },
  { emoji:'📱', cat:'Сравнение', title:'iPhone 16 Pro Max vs Samsung S25 Ultra', date:'03 Март 2026', read:'7 мин', summary:'Двата флагмана се срещат в директен дуел. Камера, дисплей, батерия — кой печели?' },
  { emoji:'🎧', cat:'Топ 5', title:'Най-добри безжични слушалки за 2026', date:'28 Фев 2026', read:'4 мин', summary:'Sony, Bose, Apple — кои слушалки дават най-добро качество за парите си?' },
  { emoji:'🖥', cat:'Съвети', title:'Как да изберем монитор за работа от вкъщи', date:'22 Фев 2026', read:'6 мин', summary:'4K или 1440p? IPS или OLED? Пълен наръчник за правилния избор.' },
  { emoji:'🔋', cat:'Съвети', title:'10 начина да удължим живота на батерията', date:'15 Фев 2026', read:'3 мин', summary:'Простите навици, които могат да удвоят живота на батерията на твоя телефон или лаптоп.' },
  { emoji:'🏠', cat:'Smart Home', title:'Как да изградим умен дом за под 500 лв.', date:'10 Фев 2026', read:'8 мин', summary:'Philips Hue, смарт контакти, гласов асистент — пълна система без да се разоряваме.' },
];

const reviewPosts = [
  { emoji:'⭐', title:'Sony WH-1000XM6 — 9.4/10', sub:'Най-добрите ANC слушалки на пазара' },
  { emoji:'⭐', title:'ASUS ROG Zephyrus G16 — 9.1/10', sub:'Мощ и стил в тънко тяло' },
  { emoji:'⭐', title:'Samsung S95C OLED — 9.6/10', sub:'Безкомпромисен телевизор' },
  { emoji:'⭐', title:'iPad Pro M4 — 8.8/10', sub:'Лаптоп в тялото на таблет' },
];

function openBlogPage() {
  const grid = document.getElementById('blogGrid');
  if (grid) grid.innerHTML = blogPosts.map(p => `
    <div style="background:var(--white);border-radius:14px;border:1px solid var(--border);overflow:hidden;cursor:pointer;transition:all .22s;box-shadow:var(--shadow-card);"
         onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-hover)'"
         onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow-card)'"
         onclick="showToast('📰 Статията се зарежда...')">
      <div style="background:linear-gradient(135deg,var(--primary-light),var(--bg2));height:120px;display:flex;align-items:center;justify-content:center;font-size:52px;">${p.emoji}</div>
      <div style="padding:16px 18px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="background:var(--primary-light);color:var(--primary);font-size:10px;font-weight:800;padding:2px 8px;border-radius:10px;letter-spacing:.05em;">${p.cat}</span>
          <span class="text-11-muted">${p.date}</span>
          <span style="font-size:11px;color:var(--muted);margin-left:auto;">📖 ${p.read}</span>
        </div>
        <div style="font-size:15px;font-weight:800;margin-bottom:8px;line-height:1.3;">${p.title}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6;">${p.summary}</div>
        <div style="margin-top:12px;font-size:12px;color:var(--primary);font-weight:700;">Прочети повече →</div>
      </div>
    </div>`).join('');
  const rGrid = document.getElementById('reviewsGrid');
  if (rGrid) rGrid.innerHTML = reviewPosts.map(r => `
    <div class="megamenu-cat-card" onclick="showToast('📝 Ревюто се зарежда...')" style="flex-direction:row;text-align:left;gap:14px;">
      <div style="font-size:28px;">${r.emoji}</div>
      <div><div style="font-size:13px;font-weight:800;">${r.title}</div><div style="font-size:11px;color:var(--muted);margin-top:3px;">${r.sub}</div></div>
    </div>`).join('');
  document.getElementById('blogPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Блог — Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Блог');
  try { history.pushState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
}
function closeBlogPage() {
  document.getElementById('blogPage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
let _svcMap = null;
function openServicePage() {
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Сервизен център — Most Computers', 'Сертифициран сервиз за лаптопи, компютри и електроника. Диагностика, ремонт и гаранционно обслужване в Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Сервизен център');
  try { history.pushState({ page: 'service' }, '', '?page=service'); } catch(e) {}
  _svcTrkInit();
  _svcMapInit();
}
function _svcMapInit() {
  if (!window.L) return;
  const el = document.getElementById('svcLeafletMap');
  if (!el) return;
  if (_svcMap) { _svcMap.invalidateSize(); return; }
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
    .bindPopup('<strong>Most Computers</strong><br>бул. Шипченски проход 240');
}
function closeServicePage() {
  document.getElementById('servicePage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function openDeliveryPage() {
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
  if (type === 'sale') {
    document.querySelectorAll('.filter-pill').forEach(p => {
      if (p.textContent.includes('Промо') || p.textContent.includes('sale')) p.click();
    });
  }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
}


// ===== CONTACTS PAGE =====
let _contactsMap = null;
function openContactsPage() {
  document.getElementById('contactsPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  checkOpenNow();
  try{history.pushState({page:'contacts'}, '', '?page=contacts');}catch(e){}
  _contactsMapInit();
}
function _contactsMapInit() {
  if (!window.L) return;
  const el = document.getElementById('contactsLeafletMap');
  if (!el) return;
  if (_contactsMap) { _contactsMap.invalidateSize(); return; }
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
    .bindPopup('<strong>Most Computers</strong><br>бул. Шипченски проход 240');
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

// ===== REVIEW FORM =====
let rfRating = 0;
function rfSetStar(v) {
  rfRating = v;
  const labels = ['', 'Лошо', 'Незадоволително', 'Добро', 'Много добро', 'Отлично'];
  document.querySelectorAll('.rf-star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.v) <= v);
    s.style.color = parseInt(s.dataset.v) <= v ? '#fbbf24' : '';
  });
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = labels[v] || '';
}
function submitPdpReview() {
  const name = document.getElementById('rfName')?.value.trim();
  const text = document.getElementById('rfText')?.value.trim();
  if (!name) { showToast('⚠️ Въведи своето име'); return; }
  if (!rfRating) { showToast('⚠️ Избери рейтинг'); return; }
  if (!text || text.length < 10) { showToast('⚠️ Ревюто трябва да е поне 10 символа'); return; }

  const now = new Date();
  const dateStr = now.toLocaleDateString('bg-BG', { day:'2-digit', month:'2-digit', year:'numeric' });
  const newRev = { name, stars: rfRating, text, date: dateStr, pending: true, productId: pdpProductId };

  // Persist to localStorage — pending until admin approves
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (!saved[pdpProductId]) saved[pdpProductId] = [];
    saved[pdpProductId].unshift(newRev);
    localStorage.setItem('mc_reviews', JSON.stringify(saved));
  } catch(e) {}

  // Reset form
  document.getElementById('rfName').value = '';
  document.getElementById('rfText').value = '';
  rfRating = 0;
  document.querySelectorAll('.rf-star').forEach(s => { s.classList.remove('active'); s.style.color = ''; });
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = 'Избери рейтинг';
  showToast('✅ Ревюто е изпратено и ще бъде публикувано след преглед!');
}


// ===== ABOUT PAGE =====
function openAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('За нас — Most Computers', 'Most Computers — над 27 години опит в продажбата на компютри и електроника. Специализиран магазин в центъра на София.');
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
