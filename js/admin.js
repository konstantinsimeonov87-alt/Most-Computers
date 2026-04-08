// ===== ADMIN PANEL =====
const _demoOrders = [
  { num:'MC-241890', customer:'Георги Тодоров', email:'g.todorov@mail.bg', phone:'0888 123 456', city:'София', addr:'ул. Витоша 12', items:'MacBook Pro M4', itemsData:[], subtotal:4299, delivery:0, total:4299, payment:'card', deliveryType:'Еконт', status:'paid',     date:'09.03.2026', ts:0 },
  { num:'MC-241889', customer:'Мария Иванова',  email:'m.ivanova@mail.bg', phone:'0877 234 567', city:'Пловдив', addr:'бул. Марица 5', items:'iPhone 16 Pro Max', itemsData:[], subtotal:2599, delivery:5.99, total:2604.99, payment:'cod', deliveryType:'Еконт', status:'shipped',  date:'09.03.2026', ts:0 },
  { num:'MC-241887', customer:'Петър Стоянов',  email:'p.stoyanov@mail.bg', phone:'0898 345 678', city:'Варна', addr:'ул. Черно море 3', items:'Sony WH-1000XM6 + iPad Pro', itemsData:[], subtotal:2098, delivery:4.99, total:2102.99, payment:'bank', deliveryType:'Еконт', status:'pending',  date:'08.03.2026', ts:0 },
  { num:'MC-241885', customer:'Анна Петрова',   email:'a.petrova@mail.bg', phone:'0888 456 789', city:'Бургас', addr:'ул. Алея 7', items:'Samsung OLED TV', itemsData:[], subtotal:1799, delivery:0, total:1799, payment:'card', deliveryType:'Вземи от магазин', status:'paid',     date:'08.03.2026', ts:0 },
  { num:'MC-241880', customer:'Тодор Николов',  email:'t.nikolov@mail.bg', phone:'0878 567 890', city:'София', addr:'кв. Люлин 14', items:'ASUS ROG Zephyrus', itemsData:[], subtotal:3799, delivery:5.99, total:3804.99, payment:'card', deliveryType:'Еконт', status:'shipped',  date:'07.03.2026', ts:0 },
  { num:'MC-241874', customer:'Ивана Христова', email:'i.hristova@mail.bg', phone:'0897 678 901', city:'Стара Загора', addr:'ул. Цар Симеон 2', items:'Apple Watch Ultra 2', itemsData:[], subtotal:1299, delivery:4.99, total:1303.99, payment:'cod', deliveryType:'Еконт', status:'cancelled', date:'07.03.2026', ts:0 },
];

function getAdminOrders() {
  try {
    const real = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    // Merge: real orders first, then demo orders not already in real
    const realNums = new Set(real.map(o => o.num));
    return [...real, ..._demoOrders.filter(o => !realNums.has(o.num))];
  } catch(e) { return _demoOrders; }
}

function adminSaveOrders(orders) {
  // Only save real (non-demo) orders
  const demoNums = new Set(_demoOrders.map(o => o.num));
  const real = orders.filter(o => !demoNums.has(o.num));
  try { localStorage.setItem('mc_orders', JSON.stringify(real)); } catch(e) {}
}

function adminChangeOrderStatus(num, newStatus) {
  const orders = getAdminOrders();
  const o = orders.find(x => x.num === num);
  if (o) {
    o.status = newStatus;
    adminSaveOrders(orders);
    adminShowTab('orders');
    showToast(`✅ Статус на ${num} → ${adminStatuses[newStatus]}`);
    if (newStatus === 'shipped') adminShowEmailDraft(o);
  }
}

function adminShowEmailDraft(o) {
  const subject = `Вашата поръчка ${o.num} е изпратена — Most Computers`;
  const body = `Здравейте ${(o.customer||'').split(' ')[0]},\n\nПоръчка ${o.num} е изпратена с Еконт!\n\nПродукти: ${o.items}\nОбщо: ${fmtBgn(o.total)}\nДата: ${o.date}\n\nБлагодарим за доверието!\n\nЕкипът на Most Computers\nmostcomputers.bg`;
  let modal = document.getElementById('adminEmailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'adminEmailModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:20px;';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="background:#1a1d35;border:1px solid #2d3148;border-radius:16px;padding:28px;max-width:560px;width:100%;font-family:'Outfit',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <div style="font-size:16px;font-weight:800;color:#fff;">📧 Имейл до клиента</div>
        <button type="button" onclick="document.getElementById('adminEmailModal').remove()" style="background:none;border:none;color:#9ca3af;font-size:22px;cursor:pointer;line-height:1;">×</button>
      </div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">До:</div>
      <div style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:9px 14px;color:#e5e7eb;font-size:13px;margin-bottom:12px;">${o.email||'—'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Относно:</div>
      <div style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:9px 14px;color:#e5e7eb;font-size:13px;margin-bottom:12px;">${subject}</div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Съдържание:</div>
      <textarea id="adminEmailBody" style="width:100%;box-sizing:border-box;background:#252840;border:1px solid #2d3148;border-radius:8px;padding:12px 14px;color:#e5e7eb;font-size:13px;font-family:'Outfit',sans-serif;resize:vertical;min-height:180px;outline:none;">${body}</textarea>
      <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end;">
        <button type="button" onclick="document.getElementById('adminEmailModal').remove()" style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:9px 18px;color:#9ca3af;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;">Отказ</button>
        <button type="button" onclick="adminCopyEmailDraft()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:8px;padding:9px 18px;color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;">📋 Копирай</button>
        <button type="button" onclick="adminOpenMailto(${JSON.stringify(o.email||'')},${JSON.stringify(subject)})" style="background:linear-gradient(135deg,#10b981,#059669);border:none;border-radius:8px;padding:9px 18px;color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;">✉️ Имейл клиент</button>
      </div>
    </div>`;
  modal.style.display = 'flex';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
}

function adminCopyEmailDraft() {
  const body = document.getElementById('adminEmailBody')?.value || '';
  navigator.clipboard.writeText(body).then(() => showToast('📋 Имейлът е копиран!')).catch(() => {
    const ta = document.getElementById('adminEmailBody');
    if (ta) { ta.select(); document.execCommand('copy'); }
    showToast('📋 Имейлът е копиран!');
  });
}

function adminOpenMailto(email, subject) {
  const body = document.getElementById('adminEmailBody')?.value || '';
  window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
}

function adminDeleteOrder(num) {
  if (!confirm(`Изтрий поръчка ${num}?`)) return;
  let orders = getAdminOrders();
  orders = orders.filter(x => x.num !== num);
  adminSaveOrders(orders);
  adminShowTab('orders');
  showToast(`🗑 Поръчка ${num} изтрита`);
}

function adminExportCSV() {
  const orders = getAdminOrders();
  const header = ['#','Клиент','Имейл','Телефон','Продукти','Сума (лв.)','Доставка','Плащане','Статус','Дата'];
  const rows = orders.map(o => [
    o.num, o.customer, o.email||'', o.phone||'',
    '"' + (o.items||'').replace(/"/g,'""') + '"',
    (o.total||0).toFixed(2),
    '"' + (o.deliveryType||'') + '"',
    o.payment||'', o.status||'', o.date||''
  ]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mc-orders-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`✅ Изтеглени ${orders.length} поръчки като CSV`);
}

function adminExportProductsJSON() {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mc-products-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`✅ Изтеглени ${products.length} продукта като JSON`);
}

function adminExportProductsCSV() {
  const header = ['id','name','brand','cat','sku','price','old','rating','rv','badge','stock'];
  const rows = products.map(p => header.map(k => {
    const v = p[k] == null ? '' : p[k];
    return typeof v === 'string' && v.includes(',') ? '"' + v.replace(/"/g,'""') + '"' : v;
  }));
  const csv = [header, ...rows].map(r => r.join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mc-products-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`✅ Изтеглени ${products.length} продукта като CSV`);
}

function adminImportJSON(jsonText) {
  try {
    const data = JSON.parse(jsonText);
    const arr = Array.isArray(data) ? data : [data];
    const saved = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    const existingNums = new Set(saved.map(o => o.num));
    let added = 0;
    arr.forEach(o => {
      if (o.num && !existingNums.has(o.num)) { saved.unshift(o); added++; }
    });
    localStorage.setItem('mc_orders', JSON.stringify(saved.slice(0, 500)));
    showToast(`✅ Импортирани ${added} поръчки`);
    adminShowTab('orders');
  } catch(e) {
    showToast('❌ Невалиден JSON файл');
  }
}

const adminStatuses = { paid:'Платена', pending:'Изчаква', shipped:'Изпратена', cancelled:'Отказана' };
const chartData = [
  {m:'Окт',v:42800},{m:'Ное',v:55100},{m:'Дек',v:98400},{m:'Яну',v:38200},
  {m:'Фев',v:61700},{m:'Мар',v:47300},
];
const maxChart = Math.max(...chartData.map(d=>d.v));
function orderMonth(o) { const d = new Date(o.ts||0); return { m: d.getMonth(), y: d.getFullYear() }; }

let _adminOrdersNotified = 0;
function adminUpdateOrdersBadge() {
  const seenTs = parseInt(localStorage.getItem('mc_orders_seen_ts') || '0');
  const cnt = getAdminOrders().filter(o => o.ts && o.ts > seenTs).length;
  const badge = document.querySelector('.admin-nav-item[data-action*="orders"] .nav-badge');
  if (badge) { badge.textContent = cnt || ''; badge.style.display = cnt > 0 ? '' : 'none'; }
  if (cnt > _adminOrdersNotified) {
    showToast(`🔔 ${cnt} нова${cnt > 1 ? ' поръчки' : ' поръчка'}!`);
    _adminOrdersNotified = cnt;
  } else if (cnt === 0) {
    _adminOrdersNotified = 0;
  }
}

// PIN is stored as a djb2 hash — change _ADMIN_H to match your chosen PIN
// To generate: paste in console → (s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)^s.charCodeAt(i);return h>>>0})('yourPIN')
const _ADMIN_H = 2085881665; // djb2('1234') — change both this and your PIN together
function _djb2(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)^s.charCodeAt(i);return h>>>0;}

function openAdminPage() {
  if (!window._adminUnlocked) {
    const _attempts = parseInt(sessionStorage.getItem('_adm_att')||'0');
    if (_attempts >= 5) { showToast('❌ Твърде много опити. Затвори и отвори отново браузъра.'); return; }
    const pin = prompt('Въведи PIN за достъп до администрацията:');
    if (!pin) return;
    if (_djb2(pin) !== _ADMIN_H) {
      sessionStorage.setItem('_adm_att', _attempts + 1);
      showToast('❌ Грешен PIN! Опит ' + (_attempts+1) + '/5');
      return;
    }
    sessionStorage.removeItem('_adm_att');
    window._adminUnlocked = true;
  }
  document.getElementById('adminPage').classList.add('open');
  document.body.style.overflow='hidden';
  adminUpdateOrdersBadge();
  // Reviews badge — count pending reviews
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    const pending = Object.values(saved).flat().filter(r => r.pending).length;
    const rb = document.getElementById('adminReviewsBadge');
    if (rb) { rb.textContent = pending || ''; rb.style.display = pending > 0 ? '' : 'none'; }
  } catch(e) {}
  adminShowTab('dashboard');
}
function closeAdminPage() {
  document.getElementById('adminPage').classList.remove('open');
  document.body.style.overflow='';
}

// ── Admin products table state ────────────────────────────────────────────────
var _adminProd = { sort: 'cat', dir: 1, cat: '', status: '', q: '', brand: '', page: 1, perPage: 25 };

const _adminCatNamesMap = {
  phones:'📱 Телефони и таблети', laptops:'💻 Лаптопи', desktops:'🖥 Настолни компютри',
  gaming:'🎮 Гейминг', monitors:'🖥 Монитори', components:'⚙️ Компоненти',
  peripherals:'🖱 Периферия', network:'📡 Мрежово', storage:'💾 Сторидж',
  software:'📀 Софтуер', accessories:'🎒 Аксесоари',
  // legacy aliases
  laptop:'💻 Лаптопи', desktop:'🖥 Настолни', monitor:'🖥 Монитори',
  mobile:'📱 Телефони и таблети', tablet:'📱 Телефони и таблети', tv:'📺 TV', audio:'🎧 Аудио',
  camera:'📷 Камера', print:'🖨 Принтер', smart:'⌚ Смарт', acc:'🔌 Аксесоар'
};

function _adminSortCol(col) {
  if (_adminProd.sort === col) { _adminProd.dir *= -1; }
  else { _adminProd.sort = col; _adminProd.dir = 1; }
  _adminProd.page = 1;
  renderAdminProductsTable();
}
function _adminCatFilter(val) { _adminProd.cat = val; _adminProd.page = 1; renderAdminProductsTable(); }
function _adminStatusFilter(val) { _adminProd.status = val; _adminProd.page = 1; renderAdminProductsTable(); }
function _adminBrandFilter(val) { _adminProd.brand = val; _adminProd.page = 1; renderAdminProductsTable(); }
function _adminGoPage(p) { _adminProd.page = p; renderAdminProductsTable(); }

function adminInlineEdit(id, field) {
  const p = products.find(x => x.id === id); if (!p) return;
  const cell = document.getElementById('aie-' + field + '-' + id);
  if (!cell || cell.querySelector('input')) return;
  const cur = field === 'price' ? p.price : (p.stock === false ? '' : p.stock);
  cell.innerHTML = '<input type="number" value="' + cur + '" placeholder="' + (field==='price'?'лв.':'–1=изчерпан') + '" style="width:78px;background:#1a1d35;border:1px solid #6366f1;border-radius:4px;padding:3px 6px;color:#fff;font-size:12px;font-family:Outfit,sans-serif;outline:none;" onblur="adminInlineSave(' + id + ',\'' + field + '\',this.value)" onkeydown="if(event.key===\'Enter\')this.blur();if(event.key===\'Escape\')renderAdminProductsTable()" autofocus>';
}

function adminInlineSave(id, field, val) {
  const p = products.find(x => x.id === id); if (!p) return;
  if (field === 'price') {
    const v = parseFloat(val);
    if (!isNaN(v) && v > 0) { p.price = Math.round(v * 100) / 100; showToast('✅ Цена → ' + p.price + ' лв.'); }
  } else {
    const v = parseInt(val);
    p.stock = (val === '' || isNaN(v) || v < 0) ? false : (v === 0 ? false : v);
    showToast('✅ Наличност → ' + (p.stock === false ? 'Изчерпан' : p.stock + ' бр.'));
  }
  persistProducts();
  renderGrids();
  renderAdminProductsTable();
}

function renderAdminProductsTable() {
  const tbody = document.getElementById('adminProductsTbody');
  const cntEl = document.getElementById('adminProdCount');
  if (!tbody) return;

  let list = products.slice();

  // text search
  if (_adminProd.q) {
    const ql = _adminProd.q.toLowerCase();
    list = list.filter(p => (p.name + ' ' + (p.sku||'') + ' ' + (p.brand||'')).toLowerCase().includes(ql));
  }
  // category filter — normalize both sides so old/new cat values both match
  if (_adminProd.cat) list = list.filter(p => normalizeCat(p.cat) === _adminProd.cat);
  // brand filter
  if (_adminProd.brand) list = list.filter(p => p.brand === _adminProd.brand);
  // status filter
  if (_adminProd.status === 'instock')   list = list.filter(p => p.stock !== false && p.stock !== 0 && (p.stock == null || p.stock > 5));
  else if (_adminProd.status === 'low')  list = list.filter(p => p.stock != null && p.stock !== false && p.stock > 0 && p.stock <= 5);
  else if (_adminProd.status === 'oos')  list = list.filter(p => p.stock === false || p.stock === 0);
  else if (_adminProd.status === 'sale') list = list.filter(p => p.badge === 'sale');
  else if (_adminProd.status === 'new')  list = list.filter(p => p.badge === 'new');
  else if (_adminProd.status === 'hot')  list = list.filter(p => p.badge === 'hot');

  // sort — default: category A-Z then name A-Z
  list.sort((a, b) => {
    let va, vb;
    if (_adminProd.sort === 'name')        { va = (a.name||'').toLowerCase();  vb = (b.name||'').toLowerCase(); }
    else if (_adminProd.sort === 'price')  { va = a.price;  vb = b.price; }
    else if (_adminProd.sort === 'rating') { va = a.rating; vb = b.rating; }
    else if (_adminProd.sort === 'stock')  {
      va = a.stock === false || a.stock === 0 ? -1 : (a.stock == null ? 9999 : a.stock);
      vb = b.stock === false || b.stock === 0 ? -1 : (b.stock == null ? 9999 : b.stock);
    } else {
      // default: group by normalized category, then name
      va = (_adminCatNamesMap[normalizeCat(a.cat)]||a.cat) + '|' + (a.name||'').toLowerCase();
      vb = (_adminCatNamesMap[normalizeCat(b.cat)]||b.cat) + '|' + (b.name||'').toLowerCase();
    }
    if (va < vb) return -1 * _adminProd.dir;
    if (va > vb) return  1 * _adminProd.dir;
    return 0;
  });

  const total = list.length;
  if (cntEl) cntEl.textContent = total + ' продукта';

  // Pagination
  const perPage = _adminProd.perPage;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  _adminProd.page = Math.min(Math.max(1, _adminProd.page), totalPages);
  const pageStart = (_adminProd.page - 1) * perPage;
  const pageList = list.slice(pageStart, pageStart + perPage);

  // update sort indicators
  ['name','price','rating','stock'].forEach(col => {
    const el = document.getElementById('_ath_' + col);
    if (!el) return;
    el.textContent = ({name:'Продукт', price:'Цена', rating:'Рейтинг', stock:'Наличност'})[col]
      + (_adminProd.sort === col ? (_adminProd.dir === 1 ? ' ↑' : ' ↓') : ' ↕');
  });

  // update category pill active state
  document.querySelectorAll('.admin-cat-pill').forEach(btn => {
    const on = btn.dataset.val === _adminProd.cat;
    btn.style.background   = on ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)';
    btn.style.color        = on ? '#a5b4fc' : '#9ca3af';
    btn.style.borderColor  = on ? 'rgba(99,102,241,0.5)'  : 'transparent';
  });

  // update status filter active state
  document.querySelectorAll('.admin-status-btn').forEach(btn => {
    const on = btn.dataset.val === _adminProd.status;
    btn.style.background  = on ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.05)';
    btn.style.color       = on ? '#60a5fa' : '#9ca3af';
    btn.style.borderColor = on ? 'rgba(96,165,250,0.4)'  : 'transparent';
  });

  // update brand select
  const brandSel = document.getElementById('adminBrandSelect');
  if (brandSel) {
    const allBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
    const cur = _adminProd.brand;
    const brandsKey = allBrands.join('|');
    if (brandSel.dataset.built !== brandsKey) {
      brandSel.innerHTML = '<option value="">Всички марки</option>'
        + allBrands.map(b => '<option value="' + b + '">' + b + ' (' + products.filter(p=>p.brand===b).length + ')</option>').join('');
      brandSel.dataset.built = brandsKey;
    }
    brandSel.value = cur;
  }

  // build tbody with category group headers
  const showGroups = _adminProd.sort === 'cat' || !_adminProd.sort;
  let lastCat = null;
  let tbodyHtml = '';
  pageList.forEach(p => {
    const normCat = normalizeCat(p.cat);
    if (showGroups && normCat !== lastCat) {
      const catTotal = list.filter(x => normalizeCat(x.cat) === normCat).length;
      tbodyHtml += '<tr style="background:#0d0f1a;"><td colspan="10" style="padding:7px 14px;font-size:10px;font-weight:900;color:#4b5563;text-transform:uppercase;letter-spacing:.1em;">'
        + (_adminCatNamesMap[normCat]||normCat)
        + ' <span style="color:#374151;font-weight:600;font-size:10px;">(' + catTotal + ')</span></td></tr>';
      lastCat = normCat;
    }
    const stockHtml = p.stock===false||p.stock===0
      ? '<span style="color:#f87171;font-size:11px;">Изчерпан</span>'
      : p.stock!=null&&p.stock<=5
        ? '<span style="color:#fbbf24;font-size:11px;">' + p.stock + ' бр.</span>'
        : '<span style="color:#34d399;font-size:11px;">✓</span>';
    const badgeHtml = p.badge==='sale'
      ? '<span style="background:rgba(239,68,68,.15);color:#f87171;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">ПРОМО</span>'
      : p.badge==='new'
        ? '<span style="background:rgba(52,211,153,.15);color:#34d399;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">НОВО</span>'
        : p.badge==='hot'
          ? '<span style="background:rgba(251,191,36,.15);color:#fbbf24;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">ГОРЕЩО</span>'
          : '<span style="color:#4b5563;font-size:11px;">—</span>';
    tbodyHtml += '<tr id="admin-prod-row-' + p.id + '">'
      + '<td><input type="checkbox" class="admin-prod-cb" data-id="' + p.id + '" onchange="adminUpdateSelection()" style="cursor:pointer;accent-color:#f87171;width:15px;height:15px;"></td>'
      + '<td><div class="admin-product-thumb">' + p.emoji + '</div></td>'
      + '<td style="color:#fff;font-weight:600;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.name + '</td>'
      + '<td style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:#6b7280;">' + (p.sku||'—') + '</td>'
      + '<td id="aie-price-' + p.id + '" style="color:#34d399;font-weight:700;cursor:pointer;" onclick="adminInlineEdit(' + p.id + ',\'price\')" title="Клик за редактиране на цена">'
      + (p.price/EUR_RATE).toFixed(2) + ' €<div style="font-size:10px;color:#6b7280;">' + p.price + ' лв.</div></td>'
      + '<td style="color:#9ca3af;">' + (_adminCatNamesMap[normalizeCat(p.cat)]||p.cat) + (p.subcat ? '<div style="margin-top:3px;"><span style="background:rgba(99,102,241,0.15);color:#a5b4fc;padding:1px 7px;border-radius:8px;font-size:10px;font-weight:600;">' + p.subcat + '</span></div>' : '') + '</td>'
      + '<td>' + badgeHtml + '</td>'
      + '<td id="aie-stock-' + p.id + '" style="cursor:pointer;" onclick="adminInlineEdit(' + p.id + ',\'stock\')" title="Клик за редактиране на наличност">' + stockHtml + '</td>'
      + '<td>⭐ ' + p.rating + '</td>'
      + '<td style="text-align:right;"><div style="display:flex;gap:5px;justify-content:flex-end;">'
      + '<button type="button" style="background:rgba(96,165,250,.1);color:#60a5fa;border:1px solid rgba(96,165,250,.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:Outfit,sans-serif;" onclick="closeAdminPage();openProductPage(' + p.id + ')" title="Преглед">👁</button>'
      + '<button type="button" style="background:rgba(251,191,36,.1);color:#fbbf24;border:1px solid rgba(251,191,36,.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:Outfit,sans-serif;" onclick="openProductEditor(' + p.id + ')" title="Редактирай">✏️</button>'
      + '<button type="button" style="background:rgba(248,113,113,.1);color:#f87171;border:1px solid rgba(248,113,113,.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:Outfit,sans-serif;" onclick="confirmDeleteProduct(' + p.id + ')" title="Изтрий">🗑</button>'
      + '</div></td></tr>';
  });
  tbody.innerHTML = tbodyHtml;

  // Pagination controls
  const pgEl = document.getElementById('adminProdPagination');
  if (pgEl) {
    if (totalPages <= 1) { pgEl.innerHTML = ''; return; }
    const btnStyle = (active) => 'background:' + (active?'rgba(96,165,250,.25)':'rgba(255,255,255,.05)') + ';border:1px solid ' + (active?'rgba(96,165,250,.4)':'#2d3148') + ';border-radius:6px;padding:5px 10px;color:' + (active?'#60a5fa':'#9ca3af') + ';cursor:pointer;font-size:12px;font-family:Outfit,sans-serif;font-weight:' + (active?'700':'400') + ';';
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i===1 || i===totalPages || Math.abs(i - _adminProd.page) <= 1) pages.push(i);
      else if (pages[pages.length-1] !== '…') pages.push('…');
    }
    pgEl.innerHTML = '<div style="display:flex;align-items:center;gap:5px;padding:12px 16px;justify-content:center;border-top:1px solid #2d3148;">'
      + '<button type="button" onclick="_adminGoPage(' + (_adminProd.page-1) + ')" ' + (_adminProd.page<=1?'disabled':'') + ' style="' + btnStyle(false) + (_adminProd.page<=1?'opacity:.4;cursor:not-allowed;':'') + '">‹</button>'
      + pages.map(pg => pg==='…'
        ? '<span style="color:#4b5563;padding:0 2px;">…</span>'
        : '<button type="button" onclick="_adminGoPage(' + pg + ')" style="' + btnStyle(pg===_adminProd.page) + '">' + pg + '</button>'
      ).join('')
      + '<button type="button" onclick="_adminGoPage(' + (_adminProd.page+1) + ')" ' + (_adminProd.page>=totalPages?'disabled':'') + ' style="' + btnStyle(false) + (_adminProd.page>=totalPages?'opacity:.4;cursor:not-allowed;':'') + '">›</button>'
      + '<span style="color:#4b5563;font-size:11px;margin-left:6px;">' + (pageStart+1) + '–' + Math.min(pageStart+perPage,total) + ' / ' + total + '</span>'
      + '</div>';
  }
}
function adminShowTab(tab) {
  document.querySelectorAll('.admin-nav-item').forEach(b=>b.classList.remove('active'));
  const active = document.querySelector(`.admin-nav-item[onclick*="'${tab}'"]`);
  if(active) active.classList.add('active');
  const main = document.getElementById('adminMain');
  if (!main) return;

  if (tab === 'dashboard') {
    // Compute real stats + chart data in a single pass over orders
    const allOrders = getAdminOrders();
    const nowDate = new Date();
    const thisMonth = nowDate.getMonth();
    const thisYear = nowDate.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const realRevByMonth = {};
    let thisMoRev = 0, lastMoRev = 0, thisMoCnt = 0, lastMoCnt = 0, cancelledCnt = 0;
    allOrders.forEach(o => {
      const {m, y} = orderMonth(o);
      if (m === thisMonth && y === thisYear) { thisMoRev += o.total||0; thisMoCnt++; }
      if (m === lastMonth && y === lastYear) { lastMoRev += o.total||0; lastMoCnt++; }
      if (o.status === 'cancelled') cancelledCnt++;
      if (o.ts) { const key = y + '-' + m; realRevByMonth[key] = (realRevByMonth[key]||0) + (o.total||0); }
    });
    thisMoRev = thisMoRev || 47300; lastMoRev = lastMoRev || 61700;
    thisMoCnt = thisMoCnt || 143;   lastMoCnt = lastMoCnt || 119;
    const avgOrder = thisMoRev / thisMoCnt;
    const cancelledPct = allOrders.length > 0 ? (cancelledCnt / allOrders.length * 100).toFixed(1) : 2.1;
    const revDelta = lastMoRev > 0 ? ((thisMoRev - lastMoRev) / lastMoRev * 100).toFixed(0) : 18;
    const cntDelta = thisMoCnt - lastMoCnt;

    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📊 Табло</div><div class="admin-page-sub">Добре дошъл! Ето резюме на магазина.</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-stats-grid">
        <div class="admin-stat-card"><div class="admin-stat-icon">💰</div><div class="admin-stat-val">${thisMoRev.toLocaleString('bg-BG')} лв.</div><div class="admin-stat-label">Приходи този месец</div><div class="admin-stat-delta ${revDelta>=0?'up':'down'}">${revDelta>=0?'↑ +':'↓ '}${Math.abs(revDelta)}% спрямо м.м.</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">📦</div><div class="admin-stat-val">${thisMoCnt}</div><div class="admin-stat-label">Поръчки този месец</div><div class="admin-stat-delta ${cntDelta>=0?'up':'down'}">${cntDelta>=0?'↑ +':'↓ '}${Math.abs(cntDelta)} спрямо м.м.</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">👥</div><div class="admin-stat-val">${allOrders.length}</div><div class="admin-stat-label">Общо поръчки</div><div class="admin-stat-delta up">↑ всички времена</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">⭐</div><div class="admin-stat-val">4.83</div><div class="admin-stat-label">Среден рейтинг</div><div class="admin-stat-delta up">↑ +0.1 спрямо м.м.</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🛒</div><div class="admin-stat-val">${avgOrder.toFixed(2)} лв.</div><div class="admin-stat-label">Средна стойност на поръчка</div><div class="admin-stat-delta up">↑ текущ месец</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">↩</div><div class="admin-stat-val">${cancelledPct}%</div><div class="admin-stat-label">Отказани поръчки</div><div class="admin-stat-delta ${cancelledPct<=3?'up':'down'}">${cancelledPct<=3?'↓ Под нормата':'↑ Над нормата'}</div></div>
      </div>
      <div class="admin-chart-card">
        <div class="admin-chart-title">📈 Приходи по месеци (лв.)</div>
        <div class="admin-chart-bars">
          ${(()=>{
            const monthLabels = ['Яну','Фев','Мар','Апр','Май','Юни','Юли','Авг','Сеп','Окт','Ное','Дек'];
            const months = [];
            for (let i=5;i>=0;i--) {
              const d = new Date(nowDate.getFullYear(), nowDate.getMonth()-i, 1);
              months.push({m:monthLabels[d.getMonth()], month:d.getMonth(), year:d.getFullYear()});
            }
            const points = months.map((mo,i) => {
              const key = mo.year + '-' + mo.month;
              const realV = realRevByMonth[key];
              return {m: mo.m, v: realV !== undefined ? realV : (chartData[i]?.v||0)};
            });
            const mx = Math.max(...points.map(p=>p.v), 1);
            return points.map(d=>`
              <div class="admin-bar-wrap">
                <div class="admin-bar" style="height:${Math.round(d.v/mx*100)}%" data-val="${d.v.toLocaleString('bg-BG')} лв."></div>
                <div class="admin-bar-label">${d.m}</div>
              </div>`).join('');
          })()}
        </div>
      </div>
      <div class="admin-table-card">
        <div class="admin-table-header"><div class="admin-table-title">📦 Последни поръчки</div><button type="button" class="admin-table-action" onclick="adminShowTab('orders')">Виж всички →</button></div>
        <table class="admin-table">
          <thead><tr><th>#</th><th>Клиент</th><th>Продукти</th><th>Сума</th><th>Статус</th><th>Дата</th></tr></thead>
          <tbody>${allOrders.slice(0,4).map(o=>`<tr><td class="mono-11-gray">${o.num}</td><td class="text-white-semibold">${o.customer}</td><td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${o.items}</td><td class="text-success-strong">${fmtBgn(o.total)}</td><td><span class="admin-status ${o.status}">${adminStatuses[o.status]}</span></td><td>${o.date}</td></tr>`).join('')}</tbody>
        </table>
      </div>
      ${(()=>{
        const low = products.filter(p=>p.stock!==false&&p.stock!=null&&p.stock<=5);
        const oos = products.filter(p=>p.stock===false||p.stock===0);
        if (!low.length && !oos.length) return '';
        return `<div class="admin-table-card" style="border-color:rgba(251,191,36,0.3);">
          <div class="admin-table-header"><div class="admin-table-title" style="color:#fbbf24;">⚠️ Ниска наличност / Изчерпани</div><button type="button" class="admin-table-action" onclick="adminShowTab('inventory')">Виж всички →</button></div>
          <table class="admin-table"><thead><tr><th>Продукт</th><th>Наличност</th></tr></thead><tbody>${[...oos,...low].slice(0,5).map(p=>`<tr><td class="text-white-semibold">${p.name.substring(0,32)}</td><td>${p.stock===false||p.stock===0?'<span style="color:#f87171;font-weight:700;">Изчерпан</span>':`<span style="color:#fbbf24;font-weight:700;">${p.stock} бр.</span>`}</td></tr>`).join('')}</tbody></table>
        </div>`;
      })()}
      <div class="admin-table-card">
        <div class="admin-table-header"><div class="admin-table-title">🏆 Топ продукти</div></div>
        <table class="admin-table">
          <thead><tr><th></th><th>Продукт</th><th>Продадени</th><th>Приход</th><th>Рейтинг</th></tr></thead>
          <tbody>${products.slice(0,6).map(p=>`<tr><td><div class="admin-product-thumb">${p.emoji}</div></td><td class="text-white-semibold">${p.name.substring(0,28)}...</td><td>${Math.floor(Math.random()*80+20)}</td><td class="text-success-strong">${(p.price*(Math.floor(Math.random()*80+20))).toLocaleString()} лв.</td><td>⭐ ${p.rating}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else if (tab === 'orders') {
    // Mark orders as seen
    try { localStorage.setItem('mc_orders_seen_ts', Date.now()); } catch(e) {}
    adminUpdateOrdersBadge();
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📦 Поръчки</div><div class="admin-page-sub">Всички поръчки — ${getAdminOrders().length} намерени</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card">
        <div class="admin-table-header"><div class="admin-table-title">Последни поръчки</div><button type="button" class="admin-table-action" onclick="adminExportCSV()">⬇ CSV</button></div>
        <table class="admin-table">
          <thead><tr><th>#</th><th>Клиент</th><th>Продукти</th><th>Сума</th><th>Статус</th><th>Дата</th><th></th></tr></thead>
          <tbody>${getAdminOrders().map(o=>`<tr>
            <td class="mono-11-gray">${o.num}</td>
            <td class="text-white-semibold">${o.customer}<div style="font-size:10px;color:#6b7280;">${o.email||''}</div></td>
            <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#9ca3af;">${o.items}</td>
            <td class="text-success-strong">${fmtBgn(o.total)}</td>
            <td><select onchange="adminChangeOrderStatus('${o.num}',this.value)" style="background:#252840;border:1px solid #2d3148;border-radius:6px;padding:3px 6px;color:#e5e7eb;font-size:11px;font-family:'Outfit',sans-serif;cursor:pointer;">
              ${['pending','paid','shipped','cancelled'].map(s=>`<option value="${s}"${o.status===s?' selected':''}>${adminStatuses[s]}</option>`).join('')}
            </select></td>
            <td style="color:#6b7280;">${o.date}</td>
            <td style="text-align:right;"><button type="button" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;" onclick="adminDeleteOrder('${o.num}')">🗑</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else if (tab === 'products') {
    const catCounts = {};
    products.forEach(p => { const nc = normalizeCat(p.cat); catCounts[nc] = (catCounts[nc]||0) + 1; });
    const catPills = [['','Всички'],['phones','📱 Телефони'],['laptops','💻 Лаптопи'],['desktops','🖥 Настолни'],['gaming','🎮 Гейминг'],['monitors','🖥 Монитори'],['components','⚙️ Компоненти'],['peripherals','🖱 Периферия'],['network','📡 Мрежово'],['storage','💾 Сторидж'],['software','📀 Софтуер'],['accessories','🎒 Аксесоари']];
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">🏷 Продукти</div><div class="admin-page-sub">${products.length} продукта в базата</div></div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button type="button" class="admin-table-action" onclick="openProductEditor(null)">+ Добави продукт</button>
          <button type="button" class="admin-table-action" onclick="adminNormalizeCats()" title="Нормализирай cat стойностите на всички продукти към стандартните категории" style="background:rgba(251,191,36,0.1);color:#fbbf24;border-color:rgba(251,191,36,0.3);">🔧 Нормализирай категориите</button>
          <button type="button" class="admin-table-action" onclick="adminExportProductsJSON()" title="Изтегли всички продукти като JSON">⬇ JSON</button>
          <button type="button" class="admin-table-action" onclick="adminExportProductsCSV()" title="Изтегли всички продукти като CSV">⬇ CSV</button>
          <button type="button" id="adminBulkDeleteBtn" class="admin-table-action" onclick="adminBulkDelete()" style="display:none;background:rgba(248,113,113,0.15);color:#f87171;border-color:rgba(248,113,113,0.3);">🗑 Изтрий избраните (<span id="adminSelCount">0</span>)</button>
          <div id="adminBulkBadgeWrap" style="display:none;position:relative;">
            <button type="button" class="admin-table-action" onclick="adminToggleBadgeMenu()" style="gap:4px;">🏷 Бадж (<span id="adminBulkBadgeCount">0</span>) ▾</button>
            <div id="adminBadgeMenu" style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:200;background:#1a1d35;border:1px solid #2d3148;border-radius:10px;padding:6px;min-width:150px;box-shadow:0 8px 24px rgba(0,0,0,0.4);">
              <div onclick="adminBulkSetBadge('sale')" style="padding:8px 12px;cursor:pointer;border-radius:6px;color:#f87171;font-size:12px;font-family:'Outfit',sans-serif;">🔴 Промо</div>
              <div onclick="adminBulkSetBadge('new')" style="padding:8px 12px;cursor:pointer;border-radius:6px;color:#34d399;font-size:12px;font-family:'Outfit',sans-serif;">🟢 Ново</div>
              <div onclick="adminBulkSetBadge('hot')" style="padding:8px 12px;cursor:pointer;border-radius:6px;color:#fbbf24;font-size:12px;font-family:'Outfit',sans-serif;">🟡 Горещо</div>
              <div onclick="adminBulkSetBadge('')" style="padding:8px 12px;cursor:pointer;border-radius:6px;color:#9ca3af;font-size:12px;font-family:'Outfit',sans-serif;">✖ Без бадж</div>
            </div>
          </div>
          <button type="button" id="adminBulkSubcatWrap" style="display:none;background:rgba(99,102,241,0.15);color:#a5b4fc;border:1px solid rgba(99,102,241,0.3);border-radius:8px;padding:6px 12px;font-size:12px;font-family:'Outfit',sans-serif;cursor:pointer;" onclick="adminOpenSubcatModal()">🗂 Подкатегория (<span id="adminBulkSubcatCount">0</span>)</button>
          <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
        </div>
      </div>
      <div class="admin-table-card">
        <!-- Row 1: search + brand -->
        <div style="padding:10px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;border-bottom:1px solid #1e2236;">
          <input id="adminProdSearchInput" style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:7px 12px;color:#e5e7eb;font-family:'Outfit',sans-serif;font-size:12px;outline:none;width:200px;" placeholder="🔍  Търси продукт…" oninput="adminFilterProducts(this.value)">
          <select id="adminBrandSelect" onchange="_adminBrandFilter(this.value)" style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:7px 10px;color:#e5e7eb;font-family:'Outfit',sans-serif;font-size:12px;cursor:pointer;outline:none;">
            <option value="">Всички марки</option>
          </select>
          <div style="margin-left:auto;font-size:11px;color:#6b7280;" id="adminProdCount">${products.length} продукта</div>
        </div>
        <!-- Row 2: category pills -->
        <div style="padding:8px 16px;display:flex;flex-wrap:wrap;gap:5px;align-items:center;border-bottom:1px solid #1e2236;">
          <span style="font-size:10px;font-weight:800;color:#4b5563;text-transform:uppercase;letter-spacing:.06em;margin-right:4px;white-space:nowrap;">Категория:</span>
          ${catPills.map(([val,lbl]) => {
            const cnt = val ? (catCounts[val]||0) : products.length;
            const on = _adminProd.cat === val;
            return `<button type="button" class="admin-cat-pill" data-val="${val}" onclick="_adminCatFilter('${val}')" style="background:${on?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)'};color:${on?'#a5b4fc':'#9ca3af'};border:1px solid ${on?'rgba(99,102,241,0.5)':'transparent'};border-radius:6px;padding:4px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.15s;white-space:nowrap;">${lbl} <span style="opacity:.6;">(${cnt})</span></button>`;
          }).join('')}
        </div>
        <!-- Row 3: status pills -->
        <div style="padding:8px 16px;display:flex;flex-wrap:wrap;gap:5px;align-items:center;border-bottom:1px solid #1e2236;">
          <span style="font-size:10px;font-weight:800;color:#4b5563;text-transform:uppercase;letter-spacing:.06em;margin-right:4px;white-space:nowrap;">Статус:</span>
          ${[['','Всички'],['instock','✓ В наличност'],['low','⚠ Малко'],['oos','✗ Изчерпани'],['sale','🔴 Промо'],['new','🟢 Ново'],['hot','🟡 Горещо']].map(([val,lbl])=>`<button type="button" class="admin-status-btn" data-val="${val}" onclick="_adminStatusFilter('${val}')" style="background:${_adminProd.status===val?'rgba(96,165,250,0.25)':'rgba(255,255,255,0.05)'};color:${_adminProd.status===val?'#60a5fa':'#9ca3af'};border:1px solid ${_adminProd.status===val?'rgba(96,165,250,0.4)':'transparent'};border-radius:6px;padding:4px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.15s;">${lbl}</button>`).join('')}
        </div>
        <table class="admin-table" id="adminProductsTable">
          <thead><tr>
            <th style="width:32px;"><input type="checkbox" id="adminSelectAll" onchange="adminToggleSelectAll(this.checked)" style="cursor:pointer;accent-color:#f87171;width:15px;height:15px;"></th>
            <th></th>
            <th onclick="_adminSortCol('name')" style="cursor:pointer;user-select:none;white-space:nowrap;" title="Сортирай по продукт"><span id="_ath_name">Продукт ↕</span></th>
            <th>SKU</th>
            <th onclick="_adminSortCol('price')" style="cursor:pointer;user-select:none;white-space:nowrap;" title="Сортирай по цена"><span id="_ath_price">Цена ↕</span></th>
            <th>Категория</th>
            <th>Бадж</th>
            <th onclick="_adminSortCol('stock')" style="cursor:pointer;user-select:none;white-space:nowrap;" title="Сортирай по наличност"><span id="_ath_stock">Наличност ↕</span></th>
            <th onclick="_adminSortCol('rating')" style="cursor:pointer;user-select:none;white-space:nowrap;" title="Сортирай по рейтинг"><span id="_ath_rating">Рейтинг ↕</span></th>
            <th style="text-align:right;">Действия</th>
          </tr></thead>
          <tbody id="adminProductsTbody"></tbody>
        </table>
        <div id="adminProdPagination"></div>
      </div>`;
    _adminProd.q = ''; _adminProd.sort = 'cat'; _adminProd.dir = 1; _adminProd.cat = ''; _adminProd.status = ''; _adminProd.brand = ''; _adminProd.page = 1;
    renderAdminProductsTable();
  } else if (tab === 'customers') {
    const customers = ['Георги Тодоров','Мария Иванова','Петър Стоянов','Анна Петрова','Тодор Николов','Ивана Христова','Симон Борисов','Елена Димитрова'];
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">👥 Клиенти</div><div class="admin-page-sub">891 регистрирани клиента</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card">
        <table class="admin-table">
          <thead><tr><th>Клиент</th><th>Имейл</th><th>Поръчки</th><th>Общо похарчено</th><th>Регистриран</th></tr></thead>
          <tbody>${customers.map((c)=>`<tr><td class="text-white-semibold">${c}</td><td class="text-gray-600">${c.split(' ')[0].toLowerCase()}@gmail.com</td><td>${Math.floor(Math.random()*10+1)}</td><td class="text-success-strong">${(Math.floor(Math.random()*5000+500)).toLocaleString()} лв.</td><td class="text-gray-600">0${Math.floor(Math.random()*9+1)}.0${Math.floor(Math.random()*9+1)}.202${Math.floor(Math.random()*4+2)}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else if (tab === 'import') {
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📥 XML Импорт</div><div class="admin-page-sub">Зареди продукти от XML файл</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>

      <div class="xml-mode-tabs">
        <button type="button" class="xml-mode-tab active" onclick="xmlSwitchTab('file')">📁 Файл</button>
        <button type="button" class="xml-mode-tab" onclick="xmlSwitchTab('paste')">📋 Paste XML</button>
        <button type="button" class="xml-mode-tab" onclick="xmlSwitchTab('url')">🌐 URL</button>
        <button type="button" class="xml-mode-tab" onclick="xmlSwitchTab('json')">{ } JSON поръчки</button>
      </div>

      <!-- FILE TAB -->
      <div class="xml-tab-panel active" id="xml-tab-file">
        <div class="xml-drop-zone" id="xmlDropZone"
          ondragover="event.preventDefault();this.classList.add('drag-over')"
          ondragleave="this.classList.remove('drag-over')"
          ondrop="xmlHandleDrop(event)">
          <div class="xml-drop-icon">📂</div>
          <div class="xml-drop-title">Провлачи XML файл тук</div>
          <div class="xml-drop-sub">или избери ръчно от компютъра</div>
          <button type="button" class="xml-file-btn" onclick="document.getElementById('xmlFileInput').click()">📁 Избери файл</button>
          <input type="file" id="xmlFileInput" accept=".xml,text/xml" style="display:none" onchange="xmlHandleFile(this)">
        </div>
      </div>

      <!-- PASTE TAB -->
      <div class="xml-tab-panel" id="xml-tab-paste">
        <textarea class="xml-paste-area" id="xmlPasteArea" placeholder="Постави XML съдържание тук…"></textarea>
        <div style="display:flex;gap:10px;margin-top:12px;">
          <button type="button" class="xml-parse-btn" onclick="xmlParseAndPreview(document.getElementById('xmlPasteArea').value)">
            🔍 Анализирай XML
          </button>
          <button type="button" style="background:#252840;color:#9ca3af;border:1px solid #2d3148;border-radius:8px;padding:10px 16px;font-size:12px;cursor:pointer;font-family:'Outfit',sans-serif;" onclick="document.getElementById('xmlPasteArea').value='';document.getElementById('xmlPreviewArea').innerHTML=''">Изчисти</button>
        </div>
      </div>

      <!-- URL TAB -->
      <div class="xml-tab-panel" id="xml-tab-url">
        <div style="margin-bottom:14px;">
          <label style="font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:8px;">URL към XML файл</label>
          <div style="display:flex;gap:10px;">
            <input class="aef-input" id="xmlUrlInput" placeholder="https://example.com/products.xml" style="flex:1;font-family:'JetBrains Mono',monospace;font-size:12px;" onkeydown="if(event.key==='Enter')xmlFetchUrl()">
            <button type="button" class="xml-parse-btn" onclick="xmlFetchFromUI()" id="xmlFetchBtn">🌐 Зареди</button>
          </div>
          <div style="font-size:11px;color:#4b5563;margin-top:8px;">
            ⚠️ URL-ът трябва да поддържа <strong style="color:#6b7280;">CORS</strong> или да е от същия домейн. Работи с GitHub Raw, публични API-та и собствени сървъри.
          </div>
        </div>

        <!-- Quick examples -->
        <div style="margin-bottom:16px;">
          <div style="font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Примерни формати URL:</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <div style="background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div>
                <div style="font-size:11px;font-weight:700;color:#9ca3af;margin-bottom:2px;">GitHub Raw</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b7280;">https://raw.githubusercontent.com/user/repo/main/products.xml</div>
              </div>
              <span style="font-size:18px;">🐙</span>
            </div>
            <div style="background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div>
                <div style="font-size:11px;font-weight:700;color:#9ca3af;margin-bottom:2px;">Собствен сървър</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b7280;">https://mostcomputers.bg/catalog/products.xml</div>
              </div>
              <span style="font-size:18px;">🖥</span>
            </div>
            <div style="background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div>
                <div style="font-size:11px;font-weight:700;color:#9ca3af;margin-bottom:2px;">Dropbox / Google Drive (public)</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b7280;">https://dl.dropboxusercontent.com/s/…/products.xml</div>
              </div>
              <span style="font-size:18px;">☁️</span>
            </div>
          </div>
        </div>

        <!-- Auto-update settings -->
        <div class="autoupd-card" style="margin-top:16px;">
          <div class="autoupd-header">
            <div class="autoupd-header-left">
              <span style="font-size:20px;">🔄</span>
              <div>
                <div class="autoupd-title">Автоматично обновяване</div>
                <div class="autoupd-sub">Периодично зареждане от URL</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="autoupd-status-badge inactive" id="autoupdBadge">
                <div class="autoupd-dot"></div>
                <span id="autoupdBadgeText">Изключено</span>
              </div>
              <div class="autoupd-toggle-wrap">
                <span class="autoupd-toggle-label" id="autoupdToggleLabel">OFF</span>
                <label class="big-toggle">
                  <input type="checkbox" id="autoupdToggle" onchange="xmlToggleAutoUpdate(this.checked)">
                  <span class="big-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="autoupd-body">
            <div class="autoupd-settings">
              <div class="autoupd-field autoupd-field-full">
                <label class="autoupd-label">XML Категории за автоматично зареждане</label>
                <div id="multiFeedList" style="display:flex;flex-direction:column;gap:8px;margin-top:6px;"></div>
                <div style="display:flex;gap:8px;margin-top:10px;">
                  <input class="autoupd-input" id="newFeedUrl" placeholder="https://portal.mostbg.com/api/product/xml/categoryId=XX" style="flex:1;">
                  <input class="autoupd-input" id="newFeedLabel" placeholder="Описание (пр. Телевизори)" style="width:200px;">
                  <button type="button" onclick="addFeedUrl()" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:'Outfit',sans-serif;">+ Добави</button>
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:6px;">При обновяване се зареждат всички включени категории последователно.</div>
              </div>
              <div class="autoupd-field">
                <label class="autoupd-label">Интервал</label>
                <select class="autoupd-select" id="autoupdInterval" onchange="xmlSaveAutoUpdSettings()">
                  <option value="3600000">На всеки 1 час</option>
                  <option value="7200000" selected>На всеки 2 часа</option>
                  <option value="10800000">На всеки 3 часа</option>
                  <option value="21600000">На всеки 6 часа</option>
                  <option value="43200000">На всеки 12 часа</option>
                  <option value="86400000">Веднъж дневно</option>
                </select>
              </div>
              <div class="autoupd-field">
                <label class="autoupd-label">При update</label>
                <select class="autoupd-select" id="autoupdMode" onchange="xmlSaveAutoUpdSettings()">
                  <option value="merge" selected>Запазват се (добавяне/обновяване)</option>
                  <option value="replace">Пълна замяна</option>
                </select>
              </div>
            </div>
            <div id="autoupdCountdownWrap" style="margin-top:14px;display:none;">
              <div class="autoupd-countdown">
                <div class="autoupd-cd-ring">
                  <svg viewBox="0 0 56 56" width="56" height="56">
                    <circle class="autoupd-cd-track" cx="28" cy="28" r="24"/>
                    <circle class="autoupd-cd-fill" id="autoupdCdCircle" cx="28" cy="28" r="24"
                      stroke-dasharray="150.8" stroke-dashoffset="0"/>
                  </svg>
                  <div class="autoupd-cd-text"><span id="autoupdCdMin">—</span><small>мин.</small></div>
                </div>
                <div class="autoupd-cd-info">
                  <div class="autoupd-cd-title">Следващо обновяване</div>
                  <div class="autoupd-cd-sub">
                    <span id="autoupdNextTime">—</span><br>
                    Последно: <span id="autoupdLastTime">никога</span>
                  </div>
                </div>
                <button type="button" class="autoupd-now-btn" id="autoupdNowBtn" onclick="xmlRunAutoUpdate(true)">
                  ⚡ Обнови сега
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Status indicator -->
        <div id="xmlUrlStatus"></div>
      </div>

      <!-- JSON ORDERS IMPORT TAB -->
      <div class="xml-tab-panel" id="xml-tab-json">
        <div style="font-size:12px;color:#9ca3af;margin-bottom:12px;">Импортирай поръчки от JSON файл (масив от поръчки или единична поръчка).</div>
        <textarea class="xml-paste-area" id="jsonImportArea" placeholder='[{"num":"MC-001","customer":"Иван Иванов","total":299,...}]' style="font-family:\'JetBrains Mono\',monospace;font-size:11px;"></textarea>
        <div style="display:flex;gap:10px;margin-top:12px;">
          <button type="button" class="xml-parse-btn" onclick="adminImportJSON(document.getElementById(\'jsonImportArea\').value)">⬆ Импортирай поръчки</button>
          <button type="button" class="xml-parse-btn" onclick="document.getElementById(\'jsonFileInput\').click()" style="background:#252840;">📁 От файл</button>
          <input type="file" id="jsonFileInput" accept=".json,application/json" style="display:none" onchange="(r=>{r.onload=e=>adminImportJSON(e.target.result);r.readAsText(this.files[0])})(new FileReader())">
        </div>
      </div>

      <!-- PREVIEW -->
      <div id="xmlPreviewArea"></div>

      <!-- UPDATE LOG -->
      <div class="autoupd-log" id="autoupdLogWrap" style="display:none;">
        <div class="autoupd-log-title">
          📋 Лог на обновяванията
          <button type="button" class="autoupd-log-clear" onclick="xmlClearLog()">✕ Изчисти лога</button>
        </div>
        <div class="autoupd-log-list" id="autoupdLogList"></div>
      </div>

      <!-- SAMPLE XML -->
      <div class="xml-sample-card" style="margin-top:24px;">
        <div class="xml-sample-header">
          <span class="xml-sample-title">📄 Примерен XML формат</span>
          <button type="button" class="xml-copy-btn" onclick="xmlCopySample()">📋 Копирай примера</button>
        </div>
        <div class="xml-code" id="xmlSampleCode">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;data&gt;
  &lt;productList&gt;
    &lt;product id="69062"&gt;
      &lt;name&gt;MSI GE68 HX RAIDER&lt;/name&gt;
      &lt;price&gt;2556.00&lt;/price&gt;
      &lt;currency&gt;EUR&lt;/currency&gt;
      &lt;category id="21"&gt;NOTEBOOK&lt;/category&gt;
      &lt;manufacturer id="7"&gt;MSI&lt;/manufacturer&gt;
      &lt;warrantyInMonths&gt;24&lt;/warrantyInMonths&gt;
      &lt;EAN&gt;GE68 HX RAIDER 14VHG-461BG&lt;/EAN&gt;
      &lt;PartNumber&gt;9S7-15M131-461&lt;/PartNumber&gt;
      &lt;product_status&gt;Обадете се&lt;/product_status&gt;
      &lt;gallery&gt;
        &lt;pictureUrl&gt;https://portal.mostbg.com/api/images/imageFileData/38131.png&lt;/pictureUrl&gt;
      &lt;/gallery&gt;
      &lt;searchStringParts&gt;
        &lt;description name="MSI"&gt;Производител - MSI&lt;/description&gt;
        &lt;description name="I9-14"&gt;Процесор Intel i9 14-то поколение&lt;/description&gt;
        &lt;description name="RTX4080"&gt;Видео карта Nvidia RTX 4080&lt;/description&gt;
      &lt;/searchStringParts&gt;
      &lt;properties&gt;
        &lt;property name="CPU model"&gt;Intel Core i9-14900HX&lt;/property&gt;
        &lt;property name="Memory size"&gt;32 GB DDR5&lt;/property&gt;
        &lt;property name="Graphics"&gt;RTX 4080 12GB GDDR6&lt;/property&gt;
        &lt;property name="Screen size"&gt;16"&lt;/property&gt;
        &lt;property name="SSD"&gt;2 TB NVMe&lt;/property&gt;
      &lt;/properties&gt;
    &lt;/product&gt;
  &lt;/productList&gt;
&lt;/data&gt;</div>
      </div>
    `;
    xmlInitDrop();
    // Ensure all products have extended fields
  products.forEach(p => {
    if (!p.gallery)   p.gallery   = p.img ? [p.img] : [];
    if (!p.htmlDesc)  p.htmlDesc  = '';
    if (!p.videoUrl)  p.videoUrl  = '';
    if (!p.vendorUrl) p.vendorUrl = '';
  });
  xmlRestoreAutoUpdSettings();

  } else if (tab === 'export') {
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📤 XML Експорт</div><div class="admin-page-sub">Изтегли всички продукти като XML</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card" style="padding:28px;">
        <div style="text-align:center;margin-bottom:28px;">
          <div style="font-size:52px;margin-bottom:12px;">📤</div>
          <div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:8px;">Експортирай продуктовия каталог</div>
          <div style="font-size:13px;color:#6b7280;margin-bottom:24px;">Изтегля XML файл с всичките <strong style="color:#fff">${products.length} продукта</strong>.</div>
          <button type="button" class="xml-parse-btn" style="margin:0 auto;justify-content:center;" onclick="xmlExport()">
            ⬇️ Изтегли products.xml
          </button>
        </div>
        <div style="background:#0f1117;border:1px solid #2d3148;border-radius:10px;padding:16px;">
          <div style="font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Preview (първи 3 продукта)</div>
          <pre style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#a5b4fc;line-height:1.6;overflow-x:auto;white-space:pre;">${xmlPreviewExport()}</pre>
        </div>
      </div>
    `;

  } else if (tab === 'settings') {
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">⚙ Настройки</div><div class="admin-page-sub">Общи настройки на магазина</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card" style="padding:28px;display:flex;flex-direction:column;gap:28px;">

        <!-- SEO -->
        <div>
          <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #2d3148;">🔍 SEO & Sitemap</div>
          <p style="font-size:12px;color:#6b7280;margin-bottom:14px;">Генерира <code style="color:#a5b4fc;">sitemap.xml</code> с всички продуктови URL-и за Google Search Console.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px;">
            <input id="sitemapBaseUrl" placeholder="https://mostcomputers.bg" value="https://mostcomputers.bg"
              style="flex:1;min-width:220px;background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:10px 14px;color:#fff;font-size:13px;font-family:'Outfit',sans-serif;">
            <button type="button" onclick="generateSitemap()"
              style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap;">
              ⬇️ Изтегли sitemap.xml
            </button>
          </div>
          <div id="sitemapStatus" style="font-size:12px;color:#6b7280;"></div>
        </div>

        <!-- Currency -->
        <div>
          <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #2d3148;">💱 Валутен курс BGN/EUR</div>
          <div style="display:flex;gap:10px;align-items:center;">
            <span style="font-size:12px;color:#6b7280;">1 EUR =</span>
            <input id="eurRateInput" value="${localStorage.getItem('eurRate')||'1.95583'}" type="number" step="0.00001"
              style="width:120px;background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:8px 12px;color:#fff;font-size:13px;font-family:'JetBrains Mono',monospace;">
            <span style="font-size:12px;color:#6b7280;">BGN</span>
            <button type="button" onclick="saveEurRate()"
              style="background:var(--accent2);color:#fff;border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">
              Запази
            </button>
          </div>
        </div>

        <!-- Danger zone -->
        <div>
          <div style="font-size:13px;font-weight:800;color:#f87171;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(248,113,113,0.2);">⚠️ Опасна зона</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="button" onclick="if(confirm('Изтрий всички продукти?')){products=[];renderGrids();showToast('✓ Всички продукти изтрити');}"
              style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:8px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">
              🗑 Изтрий всички продукти
            </button>
            <button type="button" onclick="localStorage.clear();showToast('✓ localStorage изчистен');location.reload();"
              style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:8px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">
              🔄 Нулиране на настройките
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'settings') {
    main.innerHTML = `<div class="admin-topbar"><div><div class="admin-page-title">⚙ Настройки</div><div class="admin-page-sub">SEO инструменти и системни настройки</div></div><button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button></div>
    <div class="admin-table-card" style="padding:24px;">
      <div class="admin-chart-title">🗺 SEO инструменти</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;">
        <button type="button" class="admin-table-action" style="padding:12px 20px;font-size:13px;" onclick="closeAdminPage();generateSitemap()">🗺 Генерирай sitemap.xml</button>
        <button type="button" class="admin-table-action" style="padding:12px 20px;font-size:13px;background:rgba(96,165,250,0.1);color:#60a5fa;border-color:rgba(96,165,250,0.2);" onclick="showToast('robots.txt: User-agent: * / Allow: /')">🤖 Преглед robots.txt</button>
        <button type="button" class="admin-table-action" style="padding:12px 20px;font-size:13px;background:rgba(52,211,153,0.1);color:#34d399;border-color:rgba(52,211,153,0.2);" onclick="showToast('Schema.org JSON-LD е активен за всички продукти')">📊 Schema.org статус</button>
      </div>
      <div style="margin-top:20px;padding:16px;background:#252840;border-radius:8px;font-size:12px;color:#6b7280;font-family:'JetBrains Mono',monospace;line-height:1.8;">
        <div style="color:#34d399;">✓ JSON-LD Product schema — активен</div>
        <div style="color:#34d399;">✓ OG / Twitter Card meta — активен</div>
        <div style="color:#34d399;">✓ foundingDate: 1997 — активен</div>
        <div style="color:#fbbf24;">⚠ sitemap.xml — генерирай ръчно</div>
        <div style="color:#fbbf24;">⚠ robots.txt — нужен при хостинг</div>
      </div>
    </div>`;
  } else if (tab === 'newsletter') {
    let subs = [];
    try { subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]'); } catch(e) {}
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📩 Newsletter</div><div class="admin-page-sub">${subs.length} абонирани имейла</div></div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button type="button" class="admin-table-action" onclick="adminExportNewsletter()">⬇ CSV</button>
          <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
        </div>
      </div>
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div class="admin-table-title">Абонирани имейли</div>
          <div style="font-size:12px;color:#6b7280;">Събрани от newsletter формата на сайта</div>
        </div>
        ${subs.length === 0
          ? `<div style="text-align:center;padding:60px 20px;color:#4b5563;font-size:14px;">Все още няма абонирани имейли.<br><span style="font-size:11px;">Те ще се появят след като клиент се абонира от сайта.</span></div>`
          : `<table class="admin-table">
              <thead><tr><th>#</th><th>Имейл</th><th style="text-align:right;">Действия</th></tr></thead>
              <tbody id="nlTable">${subs.map((email, i) => `
                <tr id="nl-row-${i}">
                  <td class="mono-11-gray">${i + 1}</td>
                  <td style="color:#e5e7eb;font-size:13px;">${email}</td>
                  <td style="text-align:right;"><button type="button" onclick="adminDeleteNL(${i})" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">🗑</button></td>
                </tr>`).join('')}
              </tbody>
            </table>`}
      </div>`;
  } else if (tab === 'bis') {
    // Collect all mc_bis_* entries from localStorage
    const bisEntries = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mc_bis_')) {
        const pid = Number(key.replace('mc_bis_', ''));
        const p = products.find(x => x.id === pid);
        let emails = [];
        try { emails = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { emails = [localStorage.getItem(key)]; }
        if (!Array.isArray(emails)) emails = [emails];
        emails.forEach(email => bisEntries.push({ pid, email, pname: p?.name || 'ID: '+pid, emoji: p?.emoji || '📦' }));
      }
    }
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">🔔 BIS заявки</div><div class="admin-page-sub">${bisEntries.length} заявки за уведомяване при наличност</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card">
        ${bisEntries.length === 0
          ? `<div style="text-align:center;padding:60px 20px;color:#4b5563;font-size:14px;">Няма BIS заявки.<br><span style="font-size:11px;">Появяват се когато клиент иска уведомление при наличност на изчерпан продукт.</span></div>`
          : `<table class="admin-table">
              <thead><tr><th>#</th><th>Продукт</th><th>Имейл</th><th style="text-align:right;">Действия</th></tr></thead>
              <tbody>${bisEntries.map((row, i) => `
                <tr>
                  <td class="mono-11-gray">${i+1}</td>
                  <td><span style="font-size:18px;">${row.emoji}</span> <span style="font-size:12px;color:#e5e7eb;">${row.pname.substring(0,30)}</span></td>
                  <td style="color:#e5e7eb;font-size:13px;">${row.email}</td>
                  <td style="text-align:right;"><button type="button" onclick="adminDeleteBIS(${row.pid},'${row.email}')" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">🗑</button></td>
                </tr>`).join('')}
              </tbody>
            </table>`}
      </div>`;
  } else if (tab === 'reviews') {
    let allRevs = [];
    try {
      const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
      Object.entries(saved).forEach(([pid, revs]) => {
        revs.forEach((r, i) => {
          const p = products.find(x => x.id === Number(pid));
          allRevs.push({ ...r, _pid: Number(pid), _idx: i, _pname: p?.name || 'Неизвестен продукт', _emoji: p?.emoji || '📦' });
        });
      });
    } catch(e) {}
    allRevs.sort((a, b) => (b.pending ? 1 : 0) - (a.pending ? 1 : 0));
    const pendingCnt = allRevs.filter(r => r.pending).length;
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📝 Ревюта</div><div class="admin-page-sub">${allRevs.length} ревюта${pendingCnt > 0 ? ` · <span style="color:#fbbf24;">${pendingCnt} чакат одобрение</span>` : ''}</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      ${allRevs.length === 0
        ? `<div class="admin-table-card"><div style="text-align:center;padding:60px 20px;color:#4b5563;font-size:14px;">Все още няма ревюта.</div></div>`
        : `<div class="admin-table-card">
            <table class="admin-table">
              <thead><tr><th>Продукт</th><th>Клиент</th><th>Рейтинг</th><th>Ревю</th><th>Дата</th><th>Статус</th><th style="text-align:right;">Действия</th></tr></thead>
              <tbody>${allRevs.map(r => `
                <tr>
                  <td style="white-space:nowrap;"><span style="font-size:18px;">${r._emoji}</span> <span style="font-size:11px;color:#9ca3af;max-width:120px;overflow:hidden;text-overflow:ellipsis;display:inline-block;vertical-align:middle;">${r._pname.substring(0,20)}</span></td>
                  <td style="color:#e5e7eb;font-weight:600;">${r.name}</td>
                  <td style="color:#fbbf24;white-space:nowrap;">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</td>
                  <td style="max-width:240px;color:#9ca3af;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.text}</td>
                  <td style="color:#6b7280;font-size:11px;white-space:nowrap;">${r.date}</td>
                  <td>${r.pending ? '<span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:700;">Чака</span>' : '<span style="background:rgba(52,211,153,0.15);color:#34d399;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:700;">Одобрено</span>'}</td>
                  <td style="text-align:right;white-space:nowrap;">
                    ${r.pending ? `<button type="button" onclick="adminApproveReview(${r._pid},${r._idx})" style="background:rgba(52,211,153,0.1);color:#34d399;border:1px solid rgba(52,211,153,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;margin-right:4px;">✓ Одобри</button>` : ''}
                    <button type="button" onclick="adminDeleteReview(${r._pid},${r._idx})" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">🗑</button>
                  </td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>`}`;
  } else if (tab === 'inventory') {
    const lowStock = products.filter(p => p.stock !== false && p.stock != null && p.stock <= 5);
    const outOfStock = products.filter(p => p.stock === false || p.stock === 0);
    const inStock = products.filter(p => p.stock == null || (p.stock !== false && p.stock > 5));
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📦 Инвентар</div><div class="admin-page-sub">Управление на наличности</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-stats-grid" style="grid-template-columns:repeat(3,1fr);">
        <div class="admin-stat-card"><div class="admin-stat-icon">✅</div><div class="admin-stat-val">${inStock.length}</div><div class="admin-stat-label">В наличност</div></div>
        <div class="admin-stat-card" style="border-color:rgba(251,191,36,0.3);"><div class="admin-stat-icon">⚠️</div><div class="admin-stat-val" style="color:#fbbf24;">${lowStock.length}</div><div class="admin-stat-label">Ниска наличност (≤5)</div></div>
        <div class="admin-stat-card" style="border-color:rgba(248,113,113,0.3);"><div class="admin-stat-icon">❌</div><div class="admin-stat-val" style="color:#f87171;">${outOfStock.length}</div><div class="admin-stat-label">Изчерпани</div></div>
      </div>
      ${lowStock.length > 0 ? `
      <div class="admin-table-card" style="border-color:rgba(251,191,36,0.3);">
        <div class="admin-table-header"><div class="admin-table-title" style="color:#fbbf24;">⚠️ Ниска наличност</div></div>
        <table class="admin-table">
          <thead><tr><th></th><th>Продукт</th><th>SKU</th><th>Наличност</th><th style="text-align:right;">Действия</th></tr></thead>
          <tbody>${lowStock.map(p=>`<tr>
            <td><div class="admin-product-thumb">${p.emoji}</div></td>
            <td style="color:#fff;font-weight:600;">${p.name.substring(0,40)}</td>
            <td class="mono-11-gray">${p.sku||'—'}</td>
            <td><span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">${p.stock} бр.</span></td>
            <td style="text-align:right;"><button type="button" onclick="openProductEditor(${p.id})" style="background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">✏️ Редактирай</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>` : ''}
      ${outOfStock.length > 0 ? `
      <div class="admin-table-card" style="border-color:rgba(248,113,113,0.3);">
        <div class="admin-table-header"><div class="admin-table-title" style="color:#f87171;">❌ Изчерпани</div></div>
        <table class="admin-table">
          <thead><tr><th></th><th>Продукт</th><th>SKU</th><th>Статус</th><th style="text-align:right;">Действия</th></tr></thead>
          <tbody>${outOfStock.map(p=>`<tr>
            <td><div class="admin-product-thumb">${p.emoji}</div></td>
            <td style="color:#fff;font-weight:600;">${p.name.substring(0,40)}</td>
            <td class="mono-11-gray">${p.sku||'—'}</td>
            <td><span style="background:rgba(248,113,113,0.15);color:#f87171;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">Изчерпан</span></td>
            <td style="text-align:right;"><button type="button" onclick="openProductEditor(${p.id})" style="background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">✏️ Редактирай</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>` : ''}
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div class="admin-table-title">Всички продукти</div>
          <input style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:7px 12px;color:#e5e7eb;font-family:'Outfit',sans-serif;font-size:12px;outline:none;width:200px;" placeholder="🔍  Търси…" oninput="adminFilterInventory(this.value)">
        </div>
        <table class="admin-table" id="inventoryTable">
          <thead><tr><th></th><th>Продукт</th><th>SKU</th><th>Цена</th><th>Наличност</th><th style="text-align:right;">Действия</th></tr></thead>
          <tbody id="inventoryTbody">${products.map(p=>`<tr>
            <td><div class="admin-product-thumb">${p.emoji}</div></td>
            <td style="color:#fff;font-weight:600;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name}</td>
            <td class="mono-11-gray">${p.sku||'—'}</td>
            <td style="color:#34d399;font-weight:700;">${p.price} лв.</td>
            <td>${p.stock===false||p.stock===0?'<span style="background:rgba(248,113,113,0.15);color:#f87171;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">Изчерпан</span>':p.stock!=null&&p.stock<=5?`<span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">${p.stock} бр.</span>`:'<span style="background:rgba(52,211,153,0.15);color:#34d399;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">В наличност</span>'}</td>
            <td style="text-align:right;"><button type="button" onclick="openProductEditor(${p.id})" style="background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">✏️</button></td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } else {
    main.innerHTML = `<div class="admin-topbar"><div><div class="admin-page-title">🚧 В разработка</div><div class="admin-page-sub">Тази секция скоро ще е готова.</div></div><button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button></div><div style="text-align:center;padding:80px 20px;color:#4b5563;font-size:48px;">🚧</div>`;
  }
}

// Init admin-only settings — runs when admin.js loads (lazily or eagerly)
(function _adminInit() {
  // Pre-configure Most Computers XML feed URL if not already set
  if (!localStorage.getItem('mc_autoupd_url')) {
    localStorage.setItem('mc_autoupd_url', 'https://portal.mostbg.com/api/product/xml/categoryId=21');
  }
  if (!localStorage.getItem('mc_autoupd_urls')) {
    localStorage.setItem('mc_autoupd_urls', JSON.stringify([
      { id: 'cat21', label: 'Лаптопи (cat 21)',         url: 'https://portal.mostbg.com/api/product/xml/categoryId=21', enabled: true },
      { id: 'cat22', label: 'Телефони (cat 22)',         url: 'https://portal.mostbg.com/api/product/xml/categoryId=22', enabled: false },
      { id: 'cat23', label: 'Таблети (cat 23)',          url: 'https://portal.mostbg.com/api/product/xml/categoryId=23', enabled: false },
      { id: 'cat24', label: 'Монитори (cat 24)',         url: 'https://portal.mostbg.com/api/product/xml/categoryId=24', enabled: false },
      { id: 'cat25', label: 'Принтери (cat 25)',         url: 'https://portal.mostbg.com/api/product/xml/categoryId=25', enabled: false },
      { id: 'cat26', label: 'Мрежово оборудване (cat 26)', url: 'https://portal.mostbg.com/api/product/xml/categoryId=26', enabled: false },
      { id: 'cat27', label: 'Аксесоари (cat 27)',        url: 'https://portal.mostbg.com/api/product/xml/categoryId=27', enabled: false },
    ]));
  }
  // Defer until AU_STORE and related functions are defined (end of this script)
  setTimeout(() => {
    if (typeof xmlRestoreAutoUpdSettings === 'function') xmlRestoreAutoUpdSettings();
    // Auto-start feed on first load
    if (!localStorage.getItem('mc_feed_initial_done')) {
      localStorage.setItem('mc_feed_initial_done', '1');
      localStorage.setItem('mc_autoupd_enabled', '1');
      setTimeout(() => { if (typeof xmlRunAutoUpdate === 'function') xmlRunAutoUpdate(false); }, 1500);
    }
  }, 0);
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { openAdminPage, closeAdminPage };
}

// ===== ADMIN PRODUCT EDITOR =====
let aefEditingId = null; // null = new product
let aefSelectedBadge = 'none';

function openProductEditor(id) {
  aefEditingId = id;
  aefSelectedBadge = 'none';

  const isNew = id === null;
  document.getElementById('aefModeIcon').textContent = isNew ? '➕' : '✏️';
  document.getElementById('aefModalTitle').textContent = isNew ? 'Добави нов продукт' : 'Редактирай продукт';
  document.getElementById('aefDeleteBtn').style.display = isNew ? 'none' : 'flex';

  if (!isNew) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('aef-name').value    = p.name || '';
    document.getElementById('aef-brand').value   = p.brand || '';
    document.getElementById('aef-cat').value     = p.cat || 'components';
    aefUpdateSubcats(p.subcat || '');
    document.getElementById('aef-price').value   = p.price || '';
    document.getElementById('aef-old').value     = p.old || '';
    document.getElementById('aef-rating').value  = p.rating || '';
    document.getElementById('aef-rv').value      = p.rv || '';
    document.getElementById('aef-emoji').value   = p.emoji || '';
    document.getElementById('aef-sku').value     = p.sku || '';
    document.getElementById('aef-img').value     = p.img || '';
    document.getElementById('aef-desc').value    = p.desc || '';
    if(document.getElementById('aef-htmldesc')) document.getElementById('aef-htmldesc').value = p.htmlDesc || '';
    if(document.getElementById('aef-video'))    document.getElementById('aef-video').value    = p.videoUrl || '';
    if(document.getElementById('aef-vendor'))   document.getElementById('aef-vendor').value   = p.vendorUrl || '';
    const stockEl = document.getElementById('aef-stock');
    if (stockEl) stockEl.value = p.stock === false ? 0 : (p.stock != null ? p.stock : '');
    previewAefImg(p.img || '');
    aefSelectedBadge = p.badge || 'none';
    // Specs
    buildSpecsUI(p.specs || {});
  } else {
    // Clear all fields
    ['aef-name','aef-brand','aef-price','aef-old','aef-rating','aef-rv','aef-stock','aef-emoji','aef-sku','aef-img','aef-desc','aef-htmldesc','aef-video','aef-vendor'].forEach(id => {
      const el = document.getElementById(id); if(el) el.value = '';
    });
    document.getElementById('aef-cat').value = 'components';
    aefUpdateSubcats('');
    document.getElementById('aef-emoji').value = '📦';
    previewAefImg('');
    buildSpecsUI({});
  }

  // Badge UI
  selectBadge(aefSelectedBadge);

  document.getElementById('adminEditorBackdrop').classList.add('open');
}

function closeProductEditor() {
  document.getElementById('adminEditorBackdrop').classList.remove('open');
}

function selectBadge(val) {
  aefSelectedBadge = val;
  ['none','sale','new','hot'].forEach(b => {
    const el = document.getElementById('badge-' + b);
    if (el) el.classList.toggle('active', b === val);
  });
}

function aefUpdateSubcats(selectedId = '') {
  const cat = document.getElementById('aef-cat')?.value;
  const group = document.getElementById('aef-subcat-group');
  const select = document.getElementById('aef-subcat');
  if (!group || !select) return;
  const subs = (typeof SUBCATS !== 'undefined' && SUBCATS[cat]) ? SUBCATS[cat] : [];
  if (!subs.length) { group.style.display = 'none'; select.value = ''; return; }
  group.style.display = '';
  select.innerHTML = `<option value="">— без подкатегория —</option>` +
    subs.map(s => `<option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${s.label}</option>`).join('');
}

function previewAefImg(url) {
  const preview = document.getElementById('aefImgPreview');
  if (!preview) return;
  if (url && url.startsWith('http')) {
    preview.innerHTML = `<img src="${url}" alt="${document.getElementById('aefName')?.value||'Продукт'}" onerror="this.style.display='none';document.getElementById('aefImgPlaceholder').style.display='block'">
      <span class="aef-img-placeholder" id="aefImgPlaceholder" style="display:none">${document.getElementById('aef-emoji')?.value || '🖼'}</span>`;
  } else {
    preview.innerHTML = `<span class="aef-img-placeholder" id="aefImgPlaceholder">${document.getElementById('aef-emoji')?.value || '🖼'}</span>`;
  }
}

function buildSpecsUI(specs) {
  const list = document.getElementById('aefSpecsList');
  if (!list) return;
  list.innerHTML = Object.entries(specs).map(([k,v]) => specRowHTML(k,v)).join('');
}

function specRowHTML(key='', val='') {
  return `<div class="aef-spec-row">
    <input class="aef-input spec-key" placeholder="Ключ (пр. Батерия)" value="${key}" style="max-width:160px;">
    <input class="aef-input spec-val" placeholder="Стойност (пр. 30 часа)" value="${val}">
    <button type="button" class="aef-spec-remove" onclick="this.parentElement.remove()" title="Премахни">−</button>
  </div>`;
}

function addSpecRow() {
  const list = document.getElementById('aefSpecsList');
  if (!list) return;
  list.insertAdjacentHTML('beforeend', specRowHTML());
  list.lastElementChild?.querySelector('.spec-key')?.focus();
}

function getSpecsFromUI() {
  const rows = document.querySelectorAll('#aefSpecsList .aef-spec-row');
  const specs = {};
  rows.forEach(row => {
    const k = row.querySelector('.spec-key')?.value?.trim();
    const v = row.querySelector('.spec-val')?.value?.trim();
    if (k && v) specs[k] = v;
  });
  return specs;
}

function saveProductEditor() {
  const name  = document.getElementById('aef-name').value.trim();
  const price = parseFloat(document.getElementById('aef-price').value);
  const brand = document.getElementById('aef-brand').value.trim();

  if (!name)  { showToast('⚠️ Въведи наименование!'); return; }
  if (!price || price <= 0) { showToast('⚠️ Въведи валидна цена!'); return; }
  if (!brand) { showToast('⚠️ Въведи марка!'); return; }

  const oldPrice = parseFloat(document.getElementById('aef-old').value) || null;
  const pct = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const newImg = document.getElementById('aef-img').value.trim();
  const updatedData = {
    name,
    brand,
    cat:      document.getElementById('aef-cat').value,
    subcat:   document.getElementById('aef-subcat')?.value || '',
    price,
    old:      oldPrice,
    pct,
    rating:   parseFloat(document.getElementById('aef-rating').value) || 4.5,
    rv:       parseInt(document.getElementById('aef-rv').value) || 0,
    emoji:    document.getElementById('aef-emoji').value.trim() || '📦',
    sku:      document.getElementById('aef-sku').value.trim(),
    img:      newImg,
    gallery:  newImg ? [newImg] : [],
    desc:     document.getElementById('aef-desc').value.trim(),
    htmlDesc: document.getElementById('aef-htmldesc')?.value?.trim() || '',
    videoUrl: document.getElementById('aef-video')?.value?.trim() || '',
    vendorUrl:document.getElementById('aef-vendor')?.value?.trim() || '',
    badge:    aefSelectedBadge === 'none' ? '' : aefSelectedBadge,
    specs:    getSpecsFromUI(),
    stock:    (()=>{ const v = document.getElementById('aef-stock')?.value; if(v===''||v==null) return null; const n=parseInt(v); return n===0?false:n; })(),
  };

  if (aefEditingId === null) {
    // New product — generate new ID
    const newId = Math.max(...products.map(p=>p.id)) + 1;
    updatedData.id = newId;
    updatedData.reviews = [];
    products.push(updatedData);
    showToast(`✅ Продуктът "${name.substring(0,24)}…" е добавен!`);
  } else {
    // Edit existing
    const idx = products.findIndex(p => p.id === aefEditingId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updatedData };
      showToast(`✅ "${name.substring(0,24)}…" е обновен!`);
    }
  }

  closeProductEditor();
  persistProducts();
  // Re-render grids and refresh admin table
  renderGrids();
  adminShowTab('products');

  // Flash the row
  if (aefEditingId !== null) {
    setTimeout(() => {
      const row = document.getElementById('admin-prod-row-' + aefEditingId);
      if (row) { row.classList.add('aef-saved-flash'); setTimeout(()=>row.classList.remove('aef-saved-flash'),600); }
    }, 100);
  }
}

function confirmDeleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (confirm(`Сигурен ли си, че искаш да изтриеш:\n"${p.name}"?\n\nТова действие не може да се отмени.`)) {
    deleteProductById(id);
  }
}

function deleteProduct() {
  if (aefEditingId === null) return;
  confirmDeleteProduct(aefEditingId);
  closeProductEditor();
}

function deleteProductById(id) {
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    const name = products[idx].name;
    products.splice(idx, 1);
    persistProducts();
    showToast(`🗑 "${name.substring(0,28)}…" е изтрит.`);
    renderGrids();
    adminShowTab('products');
  }
}

function adminToggleSelectAll(checked) {
  document.querySelectorAll('.admin-prod-cb').forEach(cb => { cb.checked = checked; });
  adminUpdateSelection();
}

function adminUpdateSelection() {
  const selected = document.querySelectorAll('.admin-prod-cb:checked');
  const btn = document.getElementById('adminBulkDeleteBtn');
  const badgeWrap = document.getElementById('adminBulkBadgeWrap');
  const subcatWrap = document.getElementById('adminBulkSubcatWrap');
  const cnt = document.getElementById('adminSelCount');
  const badgeCnt = document.getElementById('adminBulkBadgeCount');
  const subcatCnt = document.getElementById('adminBulkSubcatCount');
  if (!btn) return;
  const show = selected.length > 0;
  btn.style.display = show ? '' : 'none';
  if (badgeWrap) badgeWrap.style.display = show ? '' : 'none';
  if (subcatWrap) subcatWrap.style.display = show ? '' : 'none';
  if (show) {
    if (cnt) cnt.textContent = selected.length;
    if (badgeCnt) badgeCnt.textContent = selected.length;
    if (subcatCnt) subcatCnt.textContent = selected.length;
  }
  const all = document.querySelectorAll('.admin-prod-cb');
  const selAll = document.getElementById('adminSelectAll');
  if (selAll) selAll.checked = all.length > 0 && selected.length === all.length;
}

function adminToggleBadgeMenu() {
  const menu = document.getElementById('adminBadgeMenu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function adminOpenSubcatModal() {
  const selectedCbs = [...document.querySelectorAll('.admin-prod-cb:checked')];
  if (!selectedCbs.length) return;
  const ids = selectedCbs.map(cb => Number(cb.dataset.id));
  const selProds = ids.map(id => products.find(p => p.id === id)).filter(Boolean);

  // Auto-detect category from selected products
  const cats = [...new Set(selProds.map(p => normalizeCat(p.cat)))];
  const detectedCat = cats.length === 1 ? cats[0] : '';

  // Build category selector (shown only if mixed cats)
  const catSelectorHtml = cats.length > 1
    ? `<div style="margin-bottom:14px;">
        <div style="font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px;">Избери категория:</div>
        <select id="adminSubcatModalCat" onchange="adminSubcatModalRefreshPills(this.value)" style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:7px 10px;color:#e5e7eb;font-family:'Outfit',sans-serif;font-size:12px;width:100%;outline:none;">
          <option value="">— избери —</option>
          ${Object.keys(CAT_LABELS).map(c => `<option value="${c}">${CAT_LABELS[c]}</option>`).join('')}
        </select>
      </div>`
    : `<input type="hidden" id="adminSubcatModalCat" value="${detectedCat}">`;

  // Build product list
  const prodListHtml = selProds.map(p => `
    <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #1e2236;">
      <span style="font-size:18px;">${p.emoji||'📦'}</span>
      <span style="flex:1;font-size:12px;color:#e5e7eb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</span>
      <span id="adminSubcatChip-${p.id}" style="font-size:10px;padding:2px 7px;border-radius:8px;background:${p.subcat ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'};color:${p.subcat ? '#a5b4fc' : '#4b5563'};">${p.subcat || '—'}</span>
    </div>`).join('');

  // Build subcat pills for detected cat
  const initialSubs = detectedCat && SUBCATS[detectedCat] ? SUBCATS[detectedCat] : [];
  const pillsHtml = adminSubcatBuildPills(initialSubs);

  // Render modal
  const _oldModal = document.getElementById('adminSubcatModal');
  if (_oldModal) _oldModal.remove();
  const modal = document.createElement('div');
  modal.id = 'adminSubcatModal';
  document.body.appendChild(modal);
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:#1a1d35;border:1px solid #2d3148;border-radius:16px;padding:24px;max-width:480px;width:100%;font-family:'Outfit',sans-serif;max-height:90vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
        <div style="font-size:15px;font-weight:800;color:#fff;">🗂 Задай подкатегория <span style="color:#6b7280;font-size:13px;font-weight:500;">(${selProds.length} продукта)</span></div>
        <button type="button" onclick="document.getElementById('adminSubcatModal').remove()" style="background:none;border:none;color:#9ca3af;font-size:22px;cursor:pointer;line-height:1;">×</button>
      </div>

      <!-- Product list -->
      <div style="background:#0d0f1a;border-radius:10px;padding:10px 12px;margin-bottom:16px;max-height:160px;overflow-y:auto;">
        ${prodListHtml}
      </div>

      <!-- Category selector (if mixed) -->
      ${catSelectorHtml}

      <!-- Subcat pills -->
      <div style="font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;">
        ${detectedCat ? CAT_LABELS[detectedCat] + ' — избери подкатегория:' : 'Подкатегории:'}
      </div>
      <div id="adminSubcatModalPills" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">
        ${pillsHtml}
      </div>

      <!-- Actions -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #2d3148;padding-top:14px;">
        <button type="button" onclick="adminBulkSetSubcat('', true)" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:8px;padding:7px 14px;font-size:12px;cursor:pointer;font-family:'Outfit',sans-serif;">✖ Изчисти подкат.</button>
        <button type="button" onclick="document.getElementById('adminSubcatModal').remove()" style="background:rgba(255,255,255,0.06);color:#9ca3af;border:1px solid #2d3148;border-radius:8px;padding:7px 14px;font-size:12px;cursor:pointer;font-family:'Outfit',sans-serif;">Затвори</button>
      </div>
    </div>`;

  // Click outside to close
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function adminSubcatBuildPills(subs) {
  if (!subs || !subs.length) return `<span style="color:#4b5563;font-size:12px;font-style:italic;">Няма подкатегории за тази категория</span>`;
  return subs.map(s => `
    <button type="button" onclick="adminBulkSetSubcat('${s.id}', true)" style="background:rgba(99,102,241,0.12);color:#a5b4fc;border:1px solid rgba(99,102,241,0.25);border-radius:20px;padding:6px 14px;font-size:12px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.15s;" onmouseover="this.style.background='rgba(99,102,241,0.3)'" onmouseout="this.style.background='rgba(99,102,241,0.12)'">${s.label}</button>
  `).join('');
}

function adminSubcatModalRefreshPills(cat) {
  const pillsEl = document.getElementById('adminSubcatModalPills');
  if (!pillsEl) return;
  const subs = (cat && SUBCATS[cat]) ? SUBCATS[cat] : [];
  pillsEl.innerHTML = adminSubcatBuildPills(subs);
}

function adminBulkSetSubcat(subcat, fromModal) {
  const selected = [...document.querySelectorAll('.admin-prod-cb:checked')];
  if (!selected.length) return;
  const ids = new Set(selected.map(cb => Number(cb.dataset.id)));

  // Find subcat label for toast
  let label = 'без подкатегория';
  if (subcat) {
    for (const cat of Object.keys(SUBCATS)) {
      const found = SUBCATS[cat].find(s => s.id === subcat);
      if (found) { label = found.label; break; }
    }
  }

  products.forEach(p => {
    if (!ids.has(p.id)) return;
    if (subcat) p.subcat = subcat;
    else delete p.subcat;
  });
  persistProducts();
  if (typeof _invalidateFilterCache === 'function') _invalidateFilterCache();
  showToast(`✅ ${ids.size} продукта → ${label}`);
  if (fromModal) {
    // Refresh chips inside open modal without closing it
    ids.forEach(id => {
      const chip = document.getElementById('adminSubcatChip-' + id);
      if (chip) {
        chip.textContent = subcat || '—';
        chip.style.background = subcat ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)';
        chip.style.color = subcat ? '#a5b4fc' : '#4b5563';
      }
    });
    if (!subcat) { renderGrids(); renderAdminProductsTable(); return; } // keep modal open after clear
    document.getElementById('adminSubcatModal')?.remove();
  }
  renderGrids();
  renderAdminProductsTable();
}

function adminBulkSetBadge(badge) {
  const selected = [...document.querySelectorAll('.admin-prod-cb:checked')];
  if (!selected.length) return;
  const ids = new Set(selected.map(cb => Number(cb.dataset.id)));
  products.forEach(p => { if (ids.has(p.id)) { if (badge) p.badge = badge; else delete p.badge; } });
  persistProducts();
  const label = { sale:'Промо', new:'Ново', hot:'Горещо' }[badge] || 'без бадж';
  showToast(`✅ ${ids.size} продукта → ${label}`);
  renderGrids();
  renderAdminProductsTable();
}

function adminApproveReview(pid, idx) {
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (saved[pid] && saved[pid][idx]) {
      delete saved[pid][idx].pending;
      localStorage.setItem('mc_reviews', JSON.stringify(saved));
    }
  } catch(e) {}
  adminShowTab('reviews');
  showToast('✅ Ревюто е одобрено и публикувано!');
}

function adminDeleteReview(pid, idx) {
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (saved[pid]) {
      saved[pid].splice(idx, 1);
      if (!saved[pid].length) delete saved[pid];
      localStorage.setItem('mc_reviews', JSON.stringify(saved));
    }
  } catch(e) {}
  adminShowTab('reviews');
  showToast('🗑 Ревюто е изтрито');
}

function adminExportNewsletter() {
  let subs = [];
  try { subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]'); } catch(e) {}
  if (!subs.length) { showToast('Няма абонирани имейли за експорт'); return; }
  const csv = 'Email\r\n' + subs.map(e => e).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mc-newsletter-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`✅ Изтеглени ${subs.length} имейла`);
}

function adminDeleteNL(idx) {
  try {
    const subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]');
    subs.splice(idx, 1);
    localStorage.setItem('mc_newsletter', JSON.stringify(subs));
  } catch(e) {}
  adminShowTab('newsletter');
  showToast('🗑 Имейлът е премахнат');
}

function adminDeleteBIS(pid, email) {
  const key = 'mc_bis_' + pid;
  try {
    let emails = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(emails)) emails = [emails];
    const updated = emails.filter(e => e !== email);
    if (updated.length) localStorage.setItem(key, JSON.stringify(updated));
    else localStorage.removeItem(key);
  } catch(e) { localStorage.removeItem(key); }
  adminShowTab('bis');
  showToast('🗑 BIS заявката е премахната');
}

function adminFilterInventory(q) {
  const rows = document.querySelectorAll('#inventoryTbody tr');
  const ql = q.toLowerCase();
  rows.forEach(row => { row.style.display = !ql || row.textContent.toLowerCase().includes(ql) ? '' : 'none'; });
}

function adminBulkDelete() {
  const selected = [...document.querySelectorAll('.admin-prod-cb:checked')];
  if (!selected.length) return;
  const ids = selected.map(cb => Number(cb.dataset.id));
  ids.forEach(id => {
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) products.splice(idx, 1);
  });
  persistProducts();
  showToast(`🗑 Изтрити ${ids.length} продукта.`);
  renderGrids();
  renderAdminProductsTable();
}

function adminFilterProducts(q) {
  _adminProd.q = q;
  renderAdminProductsTable();
}

function adminNormalizeCats() {
  let changed = 0;
  products.forEach(p => {
    const norm = normalizeCat(p.cat);
    if (norm !== p.cat) { p.cat = norm; changed++; }
  });
  if (changed === 0) { showToast('✅ Всички категории вече са наредени правилно'); return; }
  persistProducts();
  renderGrids();
  _invalidateFilterCache();
  adminShowTab('products');
  showToast('✅ ' + changed + ' продукта категоризирани правилно');
}



// ===== XML IMPORT / EXPORT =====

function xmlSwitchTab(tab) {
  document.querySelectorAll('.xml-mode-tab').forEach((t,i) => {
    t.classList.toggle('active',
      (tab==='file'&&i===0)||(tab==='paste'&&i===1)||(tab==='url'&&i===2)||(tab==='json'&&i===3));
  });
  ['file','paste','url','json'].forEach(id => {
    document.getElementById('xml-tab-'+id)?.classList.toggle('active', tab===id);
  });
  if(tab==='url') setTimeout(()=>document.getElementById('xmlUrlInput')?.focus(), 50);
  if(tab==='json') setTimeout(()=>document.getElementById('jsonImportArea')?.focus(), 50);
}

function xmlInitDrop() {
  // already handled via ondragover/ondrop attrs
}

function xmlHandleDrop(e) {
  e.preventDefault();
  document.getElementById('xmlDropZone')?.classList.remove('drag-over');
  const file = e.dataTransfer?.files?.[0];
  if (file) xmlReadFile(file);
}

function xmlHandleFile(input) {
  const file = input?.files?.[0];
  if (file) xmlReadFile(file);
}

function xmlReadFile(file) {
  if (!file.name.endsWith('.xml') && file.type !== 'text/xml' && file.type !== 'application/xml') {
    showToast('⚠️ Моля, избери .xml файл!'); return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const txt = e.target.result;
    // Switch to paste tab to show content and parse
    xmlSwitchTab('paste');
    const pa = document.getElementById('xmlPasteArea');
    if (pa) pa.value = txt;
    xmlParseAndPreview(txt);
    // Update drop zone to show file name
    const dz = document.getElementById('xmlDropZone');
    if (dz) dz.innerHTML = `<div class="xml-drop-icon">✅</div><div class="xml-drop-title" style="color:#34d399;">Зареден: ${file.name}</div><div class="xml-drop-sub">${(file.size/1024).toFixed(1)} KB · ${txt.split('<product>').length - 1} продукта намерени</div>`;
  };
  reader.readAsText(file, 'UTF-8');
}

function xmlParseAndPreview(xmlStr) {
  const preview = document.getElementById('xmlPreviewArea');
  if (!preview) return;
  if (!xmlStr?.trim()) { preview.innerHTML = ''; return; }

  let parsed;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'text/xml');
    const err = doc.querySelector('parsererror');
    if (err) throw new Error(err.textContent?.split('\n')[0] || 'XML грешка');
    // Auto-detect element name
    const elName = ['product','item','offer','good','Product','Item'].find(n => doc.querySelector(n)) || 'product';
    parsed = doc.querySelectorAll(elName);
    if (parsed.length === 0) throw new Error('Не са намерени продуктови елементи (<product>, <item>, <offer>…)');
  } catch(e) {
    preview.innerHTML = `<div style="background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.2);border-radius:10px;padding:16px;color:#f87171;font-size:13px;">
      ❌ <strong>XML грешка:</strong> ${e.message}
    </div>`;
    return;
  }

  // Parse each product — flexible tag aliases
  const getT   = (el, tag) => el.querySelector(tag)?.textContent?.trim() || '';
  const getAny = (el, ...tags) => { for(const t of tags){ const v=getT(el,t); if(v) return v; } return ''; };

  // Category text → canonical cat key (matches normalizeCat output)
  const CAT_MAP_GENERIC = [
    // Phones & Tablets — check BEFORE generic accessories
    [['IPHONE','SAMSUNG GALAXY S','SAMSUNG GALAXY A','PIXEL','XIAOMI','СМАРТФОН','SMARTPHONE'], 'phones'],
    [['IPAD','GALAXY TAB','ТАБЛЕТ','TABLET PC'], 'phones'],
    [['SMARTWATCH','SMART WATCH','GALAXY WATCH','APPLE WATCH'], 'phones'],
    [['PHONE','MOBILE','ТЕЛЕФОН','МОБИЛЕН'], 'phones'],
    [['TABLET','ТАБЛЕТ'], 'phones'],
    // Gaming — check BEFORE laptops/desktops
    [['GAMING LAPTOP','GAMING NOTEBOOK','GAMING НОТ','ГЕЙМЪРСКИ ЛАПТОП'], 'gaming'],
    [['GAMING PC','GAMING DESKTOP','GAME PC','ГЕЙМЪРСКИ КОМПЮТЪР'], 'gaming'],
    [['GAMING MOUSE','GAMING МИШК','ГЕЙМЪРСКА МИШК'], 'gaming'],
    [['GAMING KEYBOARD','GAMING КЛАВИАТУР','ГЕЙМЪРСКА КЛАВИАТУР','МЕХАНИЧНА КЛАВИАТУР'], 'gaming'],
    [['GAMING HEADSET','GAMING СЛУШАЛК','ГЕЙМЪРСКИ СЛУШАЛК'], 'gaming'],
    [['GAMING MONITOR','ГЕЙМЪРСКИ МОНИТОР'], 'monitors'],
    // Monitors
    [['MONITOR','МОНИТОР','DISPLAY','ДИСПЛЕЙ'], 'monitors'],
    // Laptops & Desktops
    [['NOTEBOOK','LAPTOP','ЛАПТОП','NOTEBOOK PC'], 'laptops'],
    [['DESKTOP','СТАЦИОНАРЕН','ALL-IN-ONE','AIO','TOWER PC','НАСТОЛЕН'], 'desktops'],
    // Peripherals
    [['AUDIO','HEADPHONE','СЛУШАЛК','SPEAKER','КОЛОНК'], 'peripherals'],
    [['CAMERA','ФОТОАПАРАТ','WEBCAM','УЕБ КАМ'], 'peripherals'],
    [['PRINTER','ПРИНТЕР','СКЕНЕР','SCANNER'], 'peripherals'],
    [['KEYBOARD','КЛАВИАТУР','MOUSE','МИШК','ГЕЙМПАД','GAMEPAD'], 'peripherals'],
    // Network
    [['NETWORK','ROUTER','МРЕЖА','SWITCH','ACCESS POINT','WIRELESS'], 'network'],
    // Storage
    [['EXTERNAL STORAGE','EXTERNAL DRIVE','NAS','ВЪНШЕН ДИСК','USB ДИСК'], 'storage'],
    // Components
    [['ПРОЦЕСОР','PROCESSOR','CPU'], 'components'],
    [['ВИДЕОКАРТ','VIDEO CARD','GPU','GRAPHIC'], 'components'],
    [['RAM','ПАМЕТ','MEMORY','DIMM'], 'components'],
    [['ДЪННА','MOTHERBOARD','MAINBOARD'], 'components'],
    [['SSD','HDD','NVME','SOLID STATE'], 'components'],
    [['ЗАХРАНВАН','PSU','POWER SUPPLY'], 'components'],
    [['ОХЛАДИТЕЛ','COOLER','COOLING','ВЕНТИЛАТОР'], 'components'],
    [['КУТИЯ','CHASSIS','CASE'], 'components'],
    [['КОМПОНЕНТ','COMPONENT'], 'components'],
    // TV & Smart Home → accessories
    [['TV','ТЕЛЕВИЗОР','TELEVISION'], 'accessories'],
    [['SMART HOME','SMARTHOME'], 'accessories'],
    // Software
    [['SOFTWARE','СОФТУЕР','LICENSE','ЛИЦЕНЗ'], 'software'],
    // Accessories (catch-all)
    [['АКСЕСОАР','ACCESSORY','CABLE','КАБЕЛ','BAG','ЧАНТА','HUB','ХЪБ'], 'accessories'],
  ];
  function mapCatGeneric(raw) {
    const u = raw.toUpperCase();
    for (const [keys, cat] of CAT_MAP_GENERIC) {
      if (keys.some(k => u.includes(k))) return cat;
    }
    return 'acc';
  }

  const parsed_products = [];
  let errors = 0;

  parsed.forEach(el => {
    const name  = getAny(el,'name','n','title','productName','product_name','naziv');
    const price = parseFloat(getAny(el,'price','selling_price','sale_price','finalPrice','priceWithVat','price_with_vat','currentPrice'));
    const id    = parseInt(getAny(el,'id','productId','product_id','itemId')) || null;
    const ok    = name && price > 0;
    if (!ok) { errors++; }

    // Specs: <spec key="…">, <param name="…">, <feature name="…">
    const specs = {};
    el.querySelectorAll('spec,param,feature,property,attribute').forEach(s => {
      const k = s.getAttribute('key') || s.getAttribute('name') || s.getAttribute('label');
      if (k) specs[k] = s.textContent.trim();
    });

    // Images — collect ALL from common tags (multiple <image> children, url attrs, numbered tags)
    const allImgs = [];
    el.querySelectorAll('image,img,picture,photo,pic').forEach(n => {
      const src = (n.getAttribute('url') || n.getAttribute('src') || n.textContent || '').trim();
      if (src && src.startsWith('http') && !allImgs.includes(src)) allImgs.push(src);
    });
    // <images><url>…</url></images> / <gallery><pictureUrl>…</pictureUrl></gallery> patterns
    el.querySelectorAll('images url, pictures url, gallery url, gallery pictureUrl, gallery picture, pictures pictureUrl').forEach(n => {
      const src = n.textContent.trim();
      if (src && src.startsWith('http') && !allImgs.includes(src)) allImgs.push(src);
    });
    // Numbered: image1, image2, image3 … image10 / imageUrl, imageUrl2 …
    ['img','image','picture','photo','imageUrl','image_url','picture_url','url_image','thumbnail'].forEach(tag => {
      const v = getT(el, tag);
      if (v && v.startsWith('http') && !allImgs.includes(v)) allImgs.push(v);
    });
    for (let n = 1; n <= 10; n++) {
      ['image','img','picture','photo'].forEach(tag => {
        const v = getT(el, tag + n);
        if (v && v.startsWith('http') && !allImgs.includes(v)) allImgs.push(v);
      });
    }

    const existsIdx = id ? products.findIndex(p=>p.id===id) : -1;
    parsed_products.push({
      id, name, ok, isUpdate: existsIdx !== -1,
      brand:  getAny(el,'brand','manufacturer','vendor','make'),
      cat:    normalizeCat(mapCatGeneric(getAny(el,'cat','category','categoryId','group') || '')),
      price,
      old:    parseFloat(getAny(el,'old','oldprice','old_price','original_price','comparePrice','compare_price','regular_price')) || null,
      badge:  getAny(el,'badge','label','tag') || '',
      rating: parseFloat(getAny(el,'rating','rate','stars')) || 4.5,
      rv:     parseInt(getAny(el,'rv','reviews','reviewCount','review_count')) || 0,
      emoji:  getAny(el,'emoji') || '🖥',
      sku:    getAny(el,'sku','code','article','barcode','partNumber','part_number'),
      img:    allImgs[0] || '',
      gallery: allImgs,
      desc:   getAny(el,'desc','description','shortDescription','short_description','summary'),
      specs,
      reviews: [],
    });
  });

  const newCount    = parsed_products.filter(p=>p.ok && !p.isUpdate).length;
  const updateCount = parsed_products.filter(p=>p.ok && p.isUpdate).length;

  // Build preview table
  let rows = parsed_products.map(p => `
    <tr>
      <td>${p.emoji || '📦'}</td>
      <td style="color:#fff;font-weight:600;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name || '<span style="color:#f87171">— липсва —</span>'}</td>
      <td>${p.brand || '—'}</td>
      <td style="color:#34d399;font-weight:700;">${p.price ? p.price+' лв.' : '<span style="color:#f87171">липсва</span>'}</td>
      <td>${p.cat || '—'}</td>
      <td>${p.sku || '—'}</td>
      <td>${p.gallery?.length ? `<span style="color:#34d399">🖼 ${p.gallery.length}</span>` : '<span style="color:#6b7280">—</span>'}</td>
      <td>${p.ok
        ? (p.isUpdate
            ? '<span class="xml-status-update">🔄 Обновяване</span>'
            : '<span class="xml-status-ok">✅ Нов</span>')
        : '<span class="xml-status-err">❌ Грешка</span>'}</td>
    </tr>`).join('');

  // Store parsed for import
  window._xmlParsedProducts = parsed_products.filter(p => p.ok);

  preview.innerHTML = `
    <div class="admin-table-card" style="margin-top:0;">
      <div class="admin-table-header">
        <div class="admin-table-title">🔍 Преглед — ${parsed_products.length} продукта от XML</div>
      </div>
      <table class="xml-preview-table">
        <thead><tr><th></th><th>Наименование</th><th>Марка</th><th>Цена</th><th>Категория</th><th>SKU</th><th>Снимки</th><th>Статус</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${window._xmlParsedProducts.length > 0 ? `
    <div class="xml-import-confirm">
      <div class="xml-import-summary">
        Готови за импорт: <strong>${newCount} нови</strong> продукта
        ${updateCount > 0 ? `+ <strong style="color:#fbbf24">${updateCount} обновявания</strong>` : ''}
        ${errors > 0 ? `<span style="color:#f87171"> · ${errors} с грешки (пропуснати)</span>` : ''}
      </div>
      <button type="button" class="xml-import-go" onclick="xmlDoImport()">⬇️ Импортирай сега</button>
    </div>` : ''}
  `;
}

function xmlDoImport() {
  const toImport = window._xmlParsedProducts;
  if (!toImport?.length) { showToast('⚠️ Няма валидни продукти за импорт!'); return; }

  let added = 0, updated = 0;
  const maxId = Math.max(...products.map(p=>p.id), 0);

  toImport.forEach((p, i) => {
    const existsIdx = p.id ? products.findIndex(x=>x.id===p.id) : -1;
    if (existsIdx !== -1) {
      // Update existing
      products[existsIdx] = { ...products[existsIdx], ...p, id: products[existsIdx].id };
      updated++;
    } else {
      // Add new with auto ID if missing
      p.id = p.id || (maxId + i + 1);
      products.push(p);
      added++;
    }
  });

  window._xmlParsedProducts = [];
  persistProducts();
  renderGrids();
  showToast(`✅ Импортирани: ${added} нови, ${updated} обновени!`);
  adminShowTab('products');
}

// ── EXPORT ──
function xmlPreviewExport() {
  return products.slice(0,3).map(p => {
    const specs = Object.entries(p.specs||{}).map(([k,v])=>`      <spec key="${k}">${v}</spec>`).join('\n');
    return `  <product>
    <id>${p.id}</id>
    <sku>${p.sku||''}</sku>
    <name>${p.name}</name>
    <brand>${p.brand}</brand>
    <cat>${p.cat}</cat>
    <price>${p.price}</price>
    ${p.old?`<old>${p.old}</old>`:''}
    <badge>${p.badge||''}</badge>
    <rating>${p.rating}</rating>
    <rv>${p.rv}</rv>
    <emoji>${p.emoji}</emoji>
    <img>${p.img||''}</img>
    <desc>${(p.desc||'').substring(0,80)}…</desc>
    <specs>
${specs}
    </specs>
  </product>`;
  }).join('\n');
}

function xmlExport() {
  const lines = products.map(p => {
    const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const specs = Object.entries(p.specs||{}).map(([k,v])=>
      `      <spec key="${esc(k)}">${esc(v)}</spec>`).join('\n');
    return `  <product>
    <id>${p.id}</id>
    <sku>${esc(p.sku)}</sku>
    <name>${esc(p.name)}</name>
    <brand>${esc(p.brand)}</brand>
    <cat>${esc(p.cat)}</cat>
    <price>${p.price}</price>
    <old>${p.old||''}</old>
    <badge>${esc(p.badge)}</badge>
    <rating>${p.rating}</rating>
    <rv>${p.rv}</rv>
    <emoji>${esc(p.emoji)}</emoji>
    <img>${esc(p.img)}</img>
    <desc>${esc(p.desc)}</desc>
    <specs>
${specs}
    </specs>
  </product>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<products>\n${lines}\n</products>`;
  const blob = new Blob([xml], {type:'application/xml;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'most-computers-products.xml';
  a.click(); URL.revokeObjectURL(url);
  showToast(`✅ Експортирани ${products.length} продукта!`);
}

function xmlCopySample() {
  const el = document.getElementById('xmlSampleCode');
  if (!el) return;
  // Decode HTML entities for copy
  const txt = el.innerText;
  navigator.clipboard?.writeText(txt).then(()=>showToast('📋 Примерът е копиран!')).catch(()=>showToast('⚠️ Копирането не е налично'));
}


// ── XML FETCH FROM URL ──
async function xmlFetchFromUI() {
  const url = document.getElementById('xmlUrlInput')?.value?.trim();
  const status = document.getElementById('xmlUrlStatus');
  const btn = document.getElementById('xmlFetchBtn');
  const preview = document.getElementById('xmlPreviewArea');

  if (!url) { showToast('⚠️ Въведи URL!'); return; }
  if (!url.startsWith('http')) { showToast('⚠️ URL трябва да започва с https://'); return; }

  // Show loading state
  if (btn) { btn.textContent = '⏳ Зарежда…'; btn.disabled = true; }
  if (status) status.innerHTML = `
    <div style="background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <span style="font-size:20px;">⏳</span>
      <div>
        <div style="font-size:13px;font-weight:700;color:#60a5fa;">Свързване…</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px;">${url}</div>
      </div>
    </div>`;
  if (preview) preview.innerHTML = '';

  try {
    // Try direct fetch first
    let text = null;
    let method = '';

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      text = await res.text();
      method = 'директна връзка';
    } catch(e) {
      // CORS blocked — try CORS proxy
      const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const res2 = await fetch(proxy, { signal: AbortSignal.timeout(12000) });
      if (!res2.ok) throw new Error(`HTTP ${res2.status} (proxy)`);
      text = await res2.text();
      method = 'CORS proxy';
    }

    // Detect element name: <product>, <item>, <offer>, <good>
    const _elName = ['product','item','offer','good','Product','Item'].find(n => text.includes(`<${n}`)) || 'product';
    if (!_elName) throw new Error('Не са намерени продуктови елементи (<product>, <item>, <offer>)');
    window._xmlElName = _elName;

    const productCount = (text.match(new RegExp('<' + _elName + '[\\s>]','g'))||[]).length;

    if (status) status.innerHTML = `
      <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <span style="font-size:20px;">✅</span>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:700;color:#34d399;">Зареден успешно</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">${productCount} продукта · ${(text.length/1024).toFixed(1)} KB · чрез ${method}</div>
        </div>
        <button type="button" style="background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3);border-radius:6px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;" onclick="xmlSwitchTab('paste');document.getElementById('xmlPasteArea').value=window._xmlLastFetched||''">Виж XML</button>
      </div>`;

    window._xmlLastFetched = text;
    xmlParseAndPreview(text);

  } catch(err) {
    const isCors = err.message?.includes('fetch') || err.name === 'TypeError';
    if (status) status.innerHTML = `
      <div style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:10px;padding:14px 18px;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#f87171;margin-bottom:6px;">❌ Грешка при зареждане</div>
        <div style="font-size:12px;color:#9ca3af;margin-bottom:8px;">${err.message}</div>
        ${isCors ? `<div style="font-size:11px;color:#6b7280;background:#0f1117;padding:10px;border-radius:6px;line-height:1.6;">
          💡 <strong style="color:#9ca3af;">Съвет:</strong> Ако URL-ът е валиден но не се зарежда, сървърът блокира CORS заявки.<br>
          Решения: използвай <strong style="color:#a5b4fc;">GitHub Raw</strong>, <strong style="color:#a5b4fc;">Dropbox direct link</strong> или настрой CORS заглавки на сървъра.
        </div>` : ''}
      </div>`;
  } finally {
    if (btn) { btn.textContent = '🌐 Зареди'; btn.disabled = false; }
  }
}



// ===== XML AUTO-UPDATE ENGINE =====
let _autoupdTimer        = null;   // setInterval handle
let _autoupdCountdown    = null;   // countdown tick handle
let _autoupdNextTs       = null;   // timestamp of next run
let _autoupdRunning      = false;

const AU_STORE = {
  get url()      { return localStorage.getItem('mc_autoupd_url') || ''; },
  get interval() { return parseInt(localStorage.getItem('mc_autoupd_interval') || '7200000'); },
  get mode()     { return localStorage.getItem('mc_autoupd_mode') || 'merge'; },
  get enabled()  { return localStorage.getItem('mc_autoupd_enabled') === '1'; },
  get lastRun()  { return localStorage.getItem('mc_autoupd_last') || null; },
  set enabled(v) { localStorage.setItem('mc_autoupd_enabled', v ? '1' : '0'); },
  set lastRun(v) { localStorage.setItem('mc_autoupd_last', v); },
};

// ── Restore settings from localStorage on page load ──
function xmlRestoreAutoUpdSettings() {
  setTimeout(renderFeedList, 100); // render feed list when admin tab opens
  const urlEl  = document.getElementById('autoupdUrl');
  const intEl  = document.getElementById('autoupdInterval');
  const modeEl = document.getElementById('autoupdMode');
  const togEl  = document.getElementById('autoupdToggle');
  if (urlEl)  urlEl.value  = AU_STORE.url;
  if (intEl)  intEl.value  = String(AU_STORE.interval);
  if (modeEl) modeEl.value = AU_STORE.mode;
  if (togEl)  togEl.checked = AU_STORE.enabled;
  if (AU_STORE.enabled && AU_STORE.url) {
    xmlStartAutoUpdate(false); // resume silently
  }
  xmlUpdateBadgeUI();
}

function xmlSaveAutoUpdSettings() {
  const intEl  = document.getElementById('autoupdInterval');
  const modeEl = document.getElementById('autoupdMode');
  if (intEl)  localStorage.setItem('mc_autoupd_interval', intEl.value);
  if (modeEl) localStorage.setItem('mc_autoupd_mode', modeEl.value);
  // Restart timer with new interval if running
  if (AU_STORE.enabled) {
    xmlStopAutoUpdate();
    xmlStartAutoUpdate(false);
  }
}

function xmlToggleAutoUpdate(enabled) {
  const urlEl = document.getElementById('autoupdUrl');
  const url   = urlEl?.value?.trim() || AU_STORE.url;
  if (enabled && !url) {
    showToast('⚠️ Въведи URL преди да включиш auto-update!');
    document.getElementById('autoupdToggle').checked = false;
    return;
  }
  if (url) localStorage.setItem('mc_autoupd_url', url);
  AU_STORE.enabled = enabled;
  if (enabled) {
    xmlStartAutoUpdate(true);
  } else {
    xmlStopAutoUpdate();
  }
}

function xmlStartAutoUpdate(runNow) {
  xmlStopAutoUpdate(); // clear any existing
  const interval = AU_STORE.interval;
  _autoupdNextTs = Date.now() + interval;
  _autoupdTimer  = setInterval(() => xmlRunAutoUpdate(false), interval);
  _autoupdCountdown = setInterval(xmlTickCountdown, 1000);
  if (runNow) xmlRunAutoUpdate(true);
  xmlUpdateBadgeUI();
  xmlLog('info', `Auto-update включен — интервал ${Math.round(interval/60000)} мин., URL: ${AU_STORE.url}`);
}

function xmlStopAutoUpdate() {
  if (_autoupdTimer)    { clearInterval(_autoupdTimer);    _autoupdTimer = null; }
  if (_autoupdCountdown){ clearInterval(_autoupdCountdown);_autoupdCountdown = null; }
  _autoupdNextTs = null;
  xmlUpdateBadgeUI();
}

async function xmlFetchUrl(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch(e) {
    const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res2  = await fetch(proxy, { signal: AbortSignal.timeout(18000) });
    if (!res2.ok) throw new Error(`HTTP ${res2.status} via proxy`);
    return await res2.text();
  }
}

async function xmlRunAutoUpdate(manual) {
  if (_autoupdRunning) { if(manual) showToast('⏳ Обновяването вече тече…'); return; }

  // Collect enabled feed URLs
  let feeds = [];
  try { feeds = JSON.parse(localStorage.getItem('mc_autoupd_urls') || '[]').filter(f => f.enabled && f.url); } catch(e) {}
  // Fallback to single URL
  if (!feeds.length) {
    const singleUrl = AU_STORE.url;
    if (singleUrl) feeds = [{ url: singleUrl, label: 'XML Feed' }];
  }
  if (!feeds.length) { if(manual) showToast('⚠️ Няма конфигурирани URL-и за зареждане!'); return; }

  _autoupdRunning = true;
  const btn = document.getElementById('autoupdNowBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Зарежда…'; }

  xmlLog('info', `${manual?'Ръчно':'Автоматично'} обновяване стартира (${feeds.length} категории)`);

  let totalAdded = 0, totalUpdated = 0, totalSkipped = 0;

  try {
    for (const feed of feeds) {
      xmlLog('info', `→ Зарежда: ${feed.label || feed.url}`);
      let text = null;
      try {
        text = await xmlFetchUrl(feed.url);
      } catch(e) {
        xmlLog('err', `✗ ${feed.label}: ${e.message}`);
        continue;
      }
      if (!text?.includes('<product')) { xmlLog('err', `✗ ${feed.label}: няма <product> елементи`); continue; }

    // Parse XML
    const parser  = new DOMParser();
    const doc     = parser.parseFromString(text, 'text/xml');
    const err     = doc.querySelector('parsererror');
    if (err) throw new Error('XML грешка: ' + err.textContent?.split('\n')[0]);

    const _rElName = ['product','item','offer','good','Product','Item'].find(n => doc.querySelector(n)) || 'product';
    const nodes   = doc.querySelectorAll(_rElName);
    const getT    = (el, tag) => el.querySelector(tag)?.textContent?.trim() || '';
    const getAny  = (el, ...tags) => { for(const t of tags){ const v=getT(el,t); if(v) return v; } return ''; };
    const catMap  = {
        'NOTEBOOK': 'laptops', 'ЛАПТОП': 'laptops', 'LAPTOP': 'laptops',
        'PHONE': 'accessories', 'MOBILE': 'accessories', 'ТЕЛЕФОН': 'accessories', 'СМАРТФОН': 'accessories',
        'TABLET': 'accessories', 'ТАБЛЕТ': 'accessories',
        'TV': 'accessories', 'ТЕЛЕВИЗОР': 'accessories', 'TELEVISION': 'accessories',
        'AUDIO': 'peripherals', 'HEADPHONE': 'peripherals', 'СЛУШАЛКИ': 'peripherals',
        'MONITOR': 'peripherals', 'МОНИТОР': 'peripherals', 'DISPLAY': 'peripherals',
        'CAMERA': 'peripherals', 'ФОТОАПАРАТ': 'peripherals', 'WEBCAM': 'peripherals',
        'PRINTER': 'peripherals', 'ПРИНТЕР': 'peripherals', 'SCANNER': 'peripherals',
        'KEYBOARD': 'peripherals', 'КЛАВИАТУРА': 'peripherals', 'MOUSE': 'peripherals',
        'GAMING': 'desktops', 'GAME': 'desktops',
        'DESKTOP': 'desktops', 'НАСТОЛЕН': 'desktops',
        'SMARTWATCH': 'accessories', 'SMART HOME': 'accessories',
        'NETWORK': 'network', 'ROUTER': 'network', 'МРЕЖА': 'network', 'SWITCH': 'network',
        'ACCESSORY': 'accessories', 'АКСЕСОАР': 'accessories',
        // Components
        'ПРОЦЕСОР': 'components', 'PROCESSOR': 'components', 'CPU': 'components',
        'ВИДЕОКАРТ': 'components', 'VIDEO CARD': 'components', 'GPU': 'components', 'GRAPHIC': 'components',
        'RAM': 'components', 'ПАМЕТ': 'components', 'MEMORY': 'components', 'DIMM': 'components',
        'ДЪННА': 'components', 'MOTHERBOARD': 'components', 'MAINBOARD': 'components',
        'SSD': 'components', 'HDD': 'components', 'NVME': 'components', 'ДИСК': 'components',
        'ЗАХРАНВАН': 'components', 'PSU': 'components', 'POWER SUPPLY': 'components',
        'ОХЛАДИТЕЛ': 'components', 'COOLER': 'components', 'COOLING': 'components',
        'КУТИЯ': 'components', 'CHASSIS': 'components',
        'КОМПОНЕНТ': 'components', 'COMPONENT': 'components',
        // Storage
        'EXTERNAL STORAGE': 'storage', 'NAS': 'storage', 'STORAGE': 'storage',
        // Software
        'SOFTWARE': 'software', 'ЛИЦЕНЗ': 'software',
      };
    const catEmojis = {
      laptops:'💻',desktops:'🖥',components:'⚙️',peripherals:'🖱',
      network:'📡',storage:'💾',software:'📀',accessories:'🎒',
      // legacy:
      laptop:'💻',mobile:'📱',tablet:'📟',tv:'📺',audio:'🎧',camera:'📷',gaming:'🎮',smart:'🏠',print:'🖨',acc:'🖱'
    };
    const mode    = AU_STORE.mode;
    let added = 0, updated = 0, skipped = 0;

    if (mode === 'replace' && feeds.indexOf(feed) === 0) products.length = 0;

    const maxId = () => Math.max(...products.map(p => p.id), 0);

    nodes.forEach(el => {
      const name  = getAny(el,'name','n','title','productName','product_name');
      // Price: Most Computers sends EUR — convert to BGN
      const rawPrice = parseFloat(getT(el,'price'));
      const currency = getT(el,'currency');
      const price = (currency === 'EUR' && rawPrice) ? Math.round(rawPrice * EUR_RATE * 100) / 100 : rawPrice;
      if (!name || !price) { skipped++; return; }

      const id = parseInt(el.getAttribute('id')) || null;

      // Specs from <property name="…">value</property>
      const specs = {};
      el.querySelectorAll('property').forEach(s => {
        const k = s.getAttribute('name');
        if (k) specs[k] = s.textContent.trim();
      });

      // Gallery: first <pictureUrl>
      const firstImg = el.querySelector('gallery pictureUrl')?.textContent?.trim() || '';

      // Category mapping
      const rawCat = getT(el,'category').toUpperCase();
      const mappedCat = Object.entries(catMap).find(([k]) => rawCat.includes(k))?.[1] || 'acc';

      // Stock
      const statusTxt = getT(el,'product_status');
      const inStock = !statusTxt.includes('Изчерпан') && !statusTxt.includes('Няма');

      // Description from searchStringParts
      const ssParts = [];
      el.querySelectorAll('searchStringParts description').forEach(d => ssParts.push(d.textContent.trim()));
      const desc = ssParts.length ? ssParts.join(' · ') : getT(el,'searchstring');

      const data = {
        name, price, specs,
        brand:   getT(el,'manufacturer') || '',
        cat:     mappedCat,
        old:     null,
        badge:   '',
        rating:  4.5,
        rv:      0,
        emoji:   catEmojis[mappedCat] || '🖥',
        sku:     getAny(el,'PartNumber','EAN','ean','sku','code'),
        img:     firstImg,
        desc,
        stock:   inStock,
        gallery: Array.from(el.querySelectorAll('gallery pictureUrl')).map(u=>u.textContent.trim()).filter(Boolean),
        htmlDesc: '',
        videoUrl: '',
        vendorUrl: getAny(el,'Vendor_url') || (el.querySelector('property[name="Vendor_url"]')?.textContent?.trim() || ''),
        reviews: [],
        pct:     0,
      };

      const existsIdx = id ? products.findIndex(p => p.id === id) : -1;
      if (existsIdx !== -1) {
        const prev = products[existsIdx];
        const merged = { ...prev, ...data, id: prev.id };
        // Preserve manually-set old/pct/badge — XML feed doesn't supply them
        if (!data.old  && prev.old)        merged.old   = prev.old;
        if (!(data.pct > 0) && prev.pct > 0) merged.pct = prev.pct;
        if (!data.badge && prev.badge)     merged.badge = prev.badge;
        products[existsIdx] = merged;
        updated++;
      } else {
        data.id = id || (maxId() + added + updated + 1);
        products.push(data);
        added++;
      }
    });

      totalAdded += added; totalUpdated += updated; totalSkipped += skipped;
      xmlLog('ok', `✓ ${feed.label||''}: +${added} нови, ~${updated} обновени${skipped?`, ${skipped} пропуснати`:''}`);
    } // end feed loop

    renderGrids();
    const now = new Date().toLocaleString('bg-BG');
    AU_STORE.lastRun = now;
    _autoupdNextTs = Date.now() + AU_STORE.interval;

    const msg = `✅ Обновяване (${feeds.length} категории): +${totalAdded} нови, ~${totalUpdated} обновени${totalSkipped?`, ${totalSkipped} пропуснати`:''}`;
    xmlLog('ok', msg);
    if (manual) showToast(msg);

    // Update last time in UI
    const lt = document.getElementById('autoupdLastTime');
    if (lt) lt.textContent = now;

    // Flash topbar badge
    const tb = document.getElementById('autoupdTopbarBadge');
    if (tb) { tb.style.background = 'rgba(52,211,153,0.2)'; setTimeout(()=>tb.style.background='',1000); }

  } catch(err) {
    const msg = `❌ Грешка: ${err.message}`;
    xmlLog('err', msg);
    if (manual) showToast(msg);
  } finally {
    _autoupdRunning = false;
    if (btn) { btn.disabled = false; btn.textContent = '⚡ Обнови сега'; }
  }
}

function xmlTickCountdown() {
  if (!_autoupdNextTs) return;
  const remaining = Math.max(0, _autoupdNextTs - Date.now());
  const mins      = Math.floor(remaining / 60000);
  const interval  = AU_STORE.interval;
  const pct       = remaining / interval; // 1 → 0
  const circ      = 150.8;
  const offset    = circ * pct;           // full → 0

  // Update ring
  const circle = document.getElementById('autoupdCdCircle');
  if (circle) circle.style.strokeDashoffset = String(circ - offset);

  // Update minutes text
  const cdMin = document.getElementById('autoupdCdMin');
  if (cdMin) cdMin.textContent = mins < 1 ? '<1' : String(mins);

  // Update next time label
  const nextEl = document.getElementById('autoupdNextTime');
  if (nextEl) {
    const d = new Date(_autoupdNextTs);
    nextEl.textContent = d.toLocaleTimeString('bg-BG', {hour:'2-digit', minute:'2-digit'});
  }
}

function xmlUpdateBadgeUI() {
  const enabled = AU_STORE.enabled && _autoupdTimer !== null;
  const badge   = document.getElementById('autoupdBadge');
  const badgeTx = document.getElementById('autoupdBadgeText');
  const togLbl  = document.getElementById('autoupdToggleLabel');
  const cdWrap  = document.getElementById('autoupdCountdownWrap');
  const topbar  = document.getElementById('autoupdTopbarBadge');
  const dot     = badge?.querySelector('.autoupd-dot');

  if (badge) {
    badge.className = `autoupd-status-badge ${enabled ? 'active' : 'inactive'}`;
  }
  if (badgeTx) badgeTx.textContent = enabled ? 'Активно' : 'Изключено';
  if (togLbl)  togLbl.textContent  = enabled ? 'ON' : 'OFF';
  if (cdWrap)  cdWrap.style.display = enabled ? 'block' : 'none';
  if (topbar)  topbar.classList.toggle('show', enabled);
  if (dot) dot.classList.toggle('pulse', enabled);

  // Restore last run
  const lt = document.getElementById('autoupdLastTime');
  if (lt) lt.textContent = AU_STORE.lastRun || 'никога';
}

// ── LOG ──
const _autoupdLog = [];
function xmlLog(type, msg) {
  const now = new Date().toLocaleTimeString('bg-BG', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
  _autoupdLog.unshift({ type, msg, time: now });
  if (_autoupdLog.length > 50) _autoupdLog.pop();
  xmlRenderLog();
}
function xmlRenderLog() {
  const wrap = document.getElementById('autoupdLogWrap');
  const list = document.getElementById('autoupdLogList');
  if (!list) return;
  if (wrap) wrap.style.display = _autoupdLog.length ? 'block' : 'none';
  list.innerHTML = _autoupdLog.map(e =>
    `<div class="autoupd-log-item autoupd-log-${e.type}">
      <span class="autoupd-log-time">${e.time}</span>
      <span class="autoupd-log-msg">${e.msg}</span>
    </div>`).join('');
}
function xmlClearLog() {
  _autoupdLog.length = 0;
  xmlRenderLog();
}

// ── Init on DOMContentLoaded ──
// (called inside existing DOMContentLoaded listener below)



// ===== MULTI-FEED MANAGER =====
function getFeeds() {
  try { return JSON.parse(localStorage.getItem('mc_autoupd_urls') || '[]'); } catch(e) { return []; }
}
function saveFeeds(feeds) {
  localStorage.setItem('mc_autoupd_urls', JSON.stringify(feeds));
}
function renderFeedList() {
  const el = document.getElementById('multiFeedList');
  if (!el) return;
  const feeds = getFeeds();
  if (!feeds.length) {
    el.innerHTML = '<div style="font-size:12px;color:rgba(255,255,255,0.3);padding:6px 0;">Няма добавени категории.</div>';
    return;
  }
  el.innerHTML = feeds.map((f, i) => `
    <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border-radius:8px;padding:8px 10px;">
      <label class="big-toggle" style="transform:scale(0.75);flex-shrink:0;">
        <input type="checkbox" ${f.enabled?'checked':''} onchange="toggleFeed(${i},this.checked)">
        <span class="big-toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.label||'Feed '+(i+1)}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.url}</div>
      </div>
      <button type="button" onclick="testFeedUrl(${i})" title="Тест" style="background:rgba(96,165,250,0.15);color:#60a5fa;border:1px solid rgba(96,165,250,0.2);border-radius:6px;padding:5px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap;">⚡ Тест</button>
      <button type="button" onclick="removeFeed(${i})" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:5px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">✕</button>
    </div>`).join('');
}
function addFeedUrl() {
  const urlEl   = document.getElementById('newFeedUrl');
  const labelEl = document.getElementById('newFeedLabel');
  const url   = urlEl?.value?.trim();
  const label = labelEl?.value?.trim() || url;
  if (!url) { showToast('⚠️ Въведи URL!'); return; }
  const feeds = getFeeds();
  feeds.push({ id: 'feed_'+Date.now(), label, url, enabled: true });
  saveFeeds(feeds);
  if (urlEl)   urlEl.value   = '';
  if (labelEl) labelEl.value = '';
  renderFeedList();
  showToast('✓ Категорията е добавена!');
}
function removeFeed(i) {
  const feeds = getFeeds();
  feeds.splice(i, 1);
  saveFeeds(feeds);
  renderFeedList();
}
function toggleFeed(i, enabled) {
  const feeds = getFeeds();
  if (feeds[i]) feeds[i].enabled = enabled;
  saveFeeds(feeds);
}
async function testFeedUrl(i) {
  const feeds = getFeeds();
  const feed  = feeds[i];
  if (!feed) return;
  showToast('⏳ Тества се…');
  try {
    const text = await xmlFetchUrl(feed.url);
    const count = (text.match(/<product/g)||[]).length;
    showToast(`✅ ${feed.label}: ${count} продукта намерени`);
    xmlLog('ok', `Тест ✓ ${feed.label}: ${count} <product> елемента`);
  } catch(e) {
    showToast(`❌ ${feed.label}: ${e.message}`);
    xmlLog('err', `Тест ✗ ${feed.label}: ${e.message}`);
  }
}



function saveEurRate() {
  const val = parseFloat(document.getElementById('eurRateInput')?.value);
  if (isNaN(val) || val <= 0) { showToast('⚠️ Невалиден курс!'); return; }
  window.EUR_RATE = val;
  localStorage.setItem('eurRate', val);
  if (typeof renderGrids === 'function') renderGrids();
  showToast(`✅ Курс запазен: 1 EUR = ${val} BGN`);
}


