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
function openServicePage() {
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Сервизен център — Most Computers', 'Сертифициран сервиз за лаптопи, компютри и електроника. Диагностика, ремонт и гаранционно обслужване в Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Сервизен център');
  try { history.pushState({ page: 'service' }, '', '?page=service'); } catch(e) {}
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
function openContactsPage() {
  document.getElementById('contactsPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  checkOpenNow();
  // Update URL
  try{history.pushState({page:'contacts'}, '', '?page=contacts');}catch(e){}
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
  // Mon-Fri 09:30-18:30
  if (day >= 1 && day <= 5 && time >= 570 && time < 1110) isOpen = true;
  // Sat 10:00-14:00
  if (day === 6 && time >= 600 && time < 840) isOpen = true;

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

// ===== PC CONFIGURATOR =====
var _pcfg = { step: 0, usage: null, budget: 1000 };

function openPCConfigurator() {
  _pcfg = { step: 1, usage: null, budget: 1000 };
  var ov = document.getElementById('pcfgOverlay');
  ov.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  _pcfgRenderStep(1);
}

function closePCConfigurator() {
  var ov = document.getElementById('pcfgOverlay');
  ov.style.display = 'none';
  document.body.style.overflow = '';
}

function _pcfgSetStep(n) {
  [1,2,3].forEach(function(i) {
    var el = document.getElementById('pcfgStep' + i + 'dot');
    if (!el) return;
    el.classList.toggle('active', i === n);
    el.classList.toggle('done', i < n);
  });
}

function _pcfgRenderStep(n) {
  _pcfgSetStep(n);
  var body = document.getElementById('pcfgBody');
  if (!body) return;
  if (n === 1) {
    body.innerHTML = '<div class="pcfg-q">За какво ще използваш компютъра?</div><div class="pcfg-q-sub">Ще ти помогнем да намерим най-подходящите компоненти</div><div class="pcfg-opts">' +
      _pcfgOpt('gaming','🎮','Гейминг','Игри с висока производителност') +
      _pcfgOpt('work','💼','Работа / Офис','Office, видеоконференции, многозадачност') +
      _pcfgOpt('creative','🎨','Творчество','Видео монтаж, 3D, графика') +
      _pcfgOpt('study','📚','Учене / Сърфиране','Учене, интернет, медия') +
    '</div>';
    body.querySelectorAll('.pcfg-opt').forEach(function(el) {
      el.addEventListener('click', function() {
        _pcfg.usage = el.dataset.val;
        _pcfgRenderStep(2);
      });
    });
  } else if (n === 2) {
    body.innerHTML = '<div class="pcfg-q">Какъв е твоят бюджет?</div><div class="pcfg-q-sub">Плъзни за да изберете желания диапазон</div>' +
      '<div class="pcfg-budget-wrap">' +
      '<div class="pcfg-budget-val" id="pcfgBudgetVal">' + _pcfg.budget.toFixed(0) + ' €</div>' +
      '<input type="range" class="pcfg-slider" id="pcfgSlider" min="200" max="5000" step="50" value="' + _pcfg.budget + '">' +
      '<div class="pcfg-budget-labels"><span>200 €</span><span>5 000 €</span></div>' +
      '</div>' +
      '<button type="button" class="pcfg-next-btn" onclick="_pcfgRenderStep(3)">Намери ми продукти →</button>';
    document.getElementById('pcfgSlider').addEventListener('input', function() {
      _pcfg.budget = Number(this.value);
      document.getElementById('pcfgBudgetVal').textContent = _pcfg.budget.toFixed(0) + ' €';
    });
  } else if (n === 3) {
    var results = _pcfgGetRecommendations();
    var EUR_RATE = 1.95583;
    body.innerHTML = '<div class="pcfg-q">Препоръки за теб 🎯</div><div class="pcfg-q-sub">Избрахме ' + results.length + ' продукта съобразени с твоите нужди и бюджет от ' + _pcfg.budget + ' €</div>' +
      '<div class="pcfg-results">' +
      results.map(function(p) {
        var priceEur = (p.price / EUR_RATE).toFixed(2);
        var oldEur = p.old ? (p.old / EUR_RATE).toFixed(2) : null;
        return '<div class="pcfg-result-card" onclick="closePCConfigurator();openProductModal(' + p.id + ')">' +
          '<div class="pcfg-result-emoji">' + (p.emoji || '📦') + '</div>' +
          '<div class="pcfg-result-info">' +
            '<div class="pcfg-result-cat">' + (p.cat || '') + '</div>' +
            '<div class="pcfg-result-name">' + (p.name || '').substring(0, 48) + '</div>' +
            '<div class="pcfg-result-price">' + priceEur + ' €' + (oldEur ? ' <span class="pcfg-result-old">' + oldEur + ' €</span>' : '') + '</div>' +
          '</div>' +
          '<button type="button" class="pcfg-result-add" onclick="event.stopPropagation();addToCart(' + p.id + ')">+ Кошница</button>' +
        '</div>';
      }).join('') +
    '</div>' +
    '<button type="button" class="pcfg-restart" onclick="_pcfgRenderStep(1)">← Направи нова конфигурация</button>';
  }
}

function _pcfgOpt(val, icon, label, sub) {
  return '<div class="pcfg-opt" data-val="' + val + '">' +
    '<div class="pcfg-opt-icon">' + icon + '</div>' +
    '<div class="pcfg-opt-label">' + label + '</div>' +
    '<div class="pcfg-opt-sub">' + sub + '</div>' +
  '</div>';
}

function _pcfgGetRecommendations() {
  var EUR_RATE = 1.95583;
  var budget_bgn = _pcfg.budget * EUR_RATE;
  var usage = _pcfg.usage;
  var catMap = {
    gaming: ['gpu', 'gaming-laptops', 'components', 'laptops'],
    work: ['laptops', 'mobile', 'peripherals', 'monitors'],
    creative: ['laptops', 'components', 'gpu', 'monitors'],
    study: ['laptops', 'mobile', 'tablets', 'monitors']
  };
  var preferred = catMap[usage] || ['laptops', 'components'];
  var EUR_RATE_VAL = EUR_RATE;
  var pool = products.filter(function(p) {
    return p.price <= budget_bgn * 0.9 && preferred.indexOf(p.cat) !== -1 && p.rating >= 4.0;
  });
  pool.sort(function(a, b) { return b.rating - a.rating; });
  var seen = {};
  var top = [];
  pool.forEach(function(p) {
    if (top.length >= 5) return;
    var key = p.cat;
    if (!seen[key] || seen[key] < 2) { seen[key] = (seen[key] || 0) + 1; top.push(p); }
  });
  if (top.length < 3) {
    var fallback = products.filter(function(p) { return p.price <= budget_bgn && p.rating >= 4.2; }).sort(function(a,b){ return b.rating-a.rating; }).slice(0,5);
    fallback.forEach(function(p) { if (top.length < 5 && !top.find(function(x){return x.id===p.id;})) top.push(p); });
  }
  return top;
}
