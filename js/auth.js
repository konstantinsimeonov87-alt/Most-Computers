// ===== AUTH SYSTEM =====
let currentUser = null;

// Demo users — client-side only prototype auth (replace with server-side in production)
const demoUsers = [
  { email: 'test@test.bg', password: 'demo-only', firstName: 'Иван', lastName: 'Петров', phone: '0888123456' }
];

function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
  resetAuthForms();
  document.getElementById('authBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAuthModal(e) { if (e.target === e.currentTarget) closeAuthModalDirect(); }
function closeAuthModalDirect() { document.getElementById('authBackdrop').classList.remove('open'); document.body.style.overflow = ''; }

function switchAuthTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('formLogin').classList.toggle('active', tab === 'login');
  document.getElementById('formRegister').classList.toggle('active', tab === 'register');
  document.getElementById('formForgot').classList.toggle('active', tab === 'forgot');
  document.getElementById('authSuccess').classList.remove('show');
  const subs = { login: 'Влез в своя профил', register: 'Създай нов акаунт безплатно', forgot: 'Нулиране на парола' };
  document.getElementById('authHeaderSub').textContent = subs[tab] || '';
}

function showForgotPw() { switchAuthTab('forgot'); document.getElementById('tabLogin').classList.remove('active'); document.getElementById('tabRegister').classList.remove('active'); }

function resetAuthForms() {
  ['loginEmail','loginPassword','regFirstName','regLastName','regEmail','regPhone','regPassword','regPassword2','forgotEmail'].forEach(id => { const el = document.getElementById(id); if (el) { el.value = ''; el.classList.remove('error'); } });
  document.getElementById('loginError').classList.remove('show');
  document.getElementById('registerError').classList.remove('show');
  document.getElementById('authSuccess').classList.remove('show');
  document.getElementById('pwFill').style.width = '0';
  document.getElementById('pwText').textContent = '';
}

function togglePwVis(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
}

function checkPwStrength(val) {
  const fill = document.getElementById('pwFill');
  const text = document.getElementById('pwText');
  if (!val) { fill.style.width = '0'; text.textContent = ''; return; }
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { w: '20%', c: '#ff3d00', t: 'Много слаба' },
    { w: '40%', c: '#ff6b00', t: 'Слаба' },
    { w: '60%', c: '#fbbf24', t: 'Средна' },
    { w: '80%', c: '#00c853', t: 'Силна' },
    { w: '100%', c: '#00a843', t: 'Много силна 💪' },
  ];
  const l = levels[Math.min(score - 1, 4)] || levels[0];
  fill.style.width = l.w; fill.style.background = l.c;
  text.textContent = l.t; text.style.color = l.c;
}

function _authErr(id, msg) {
  const el = document.getElementById(id + '-err');
  if (el) el.textContent = msg || '';
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.classList.remove('show');
  let valid = true;
  if (!email || !email.includes('@')) {
    document.getElementById('loginEmail').classList.add('error');
    _authErr('loginEmail', 'Въведи валиден имейл адрес.');
    valid = false;
  } else {
    document.getElementById('loginEmail').classList.remove('error');
    _authErr('loginEmail', '');
  }
  if (!pass) {
    document.getElementById('loginPassword').classList.add('error');
    _authErr('loginPassword', 'Паролата е задължителна.');
    valid = false;
  } else {
    document.getElementById('loginPassword').classList.remove('error');
    _authErr('loginPassword', '');
  }
  if (!valid) return;
  const user = demoUsers.find(u => u.email === email && u.password === pass);
  if (!user) {
    errEl.classList.add('show');
    document.getElementById('loginPassword').classList.add('error');
    _authErr('loginPassword', 'Грешен имейл или парола.');
    return;
  }
  loginSuccess(user);
}

function handleRegister() {
  const fn = document.getElementById('regFirstName').value.trim();
  const ln = document.getElementById('regLastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pw = document.getElementById('regPassword').value;
  const pw2 = document.getElementById('regPassword2').value;
  const errEl = document.getElementById('registerError');
  errEl.classList.remove('show');
  let valid = true;
  const fieldChecks = [
    ['regFirstName', fn.length > 0, 'Името е задължително.'],
    ['regLastName', ln.length > 0, 'Фамилията е задължителна.'],
    ['regEmail', email.includes('@'), 'Въведи валиден имейл адрес.'],
    ['regPassword', pw.length >= 6, 'Паролата трябва да е поне 6 символа.'],
    ['regPassword2', pw === pw2 && pw.length >= 6, pw !== pw2 ? 'Паролите не съвпадат.' : 'Повтори паролата.'],
  ];
  fieldChecks.forEach(([id, ok, msg]) => {
    document.getElementById(id).classList.toggle('error', !ok);
    _authErr(id, ok ? '' : msg);
    if (!ok) valid = false;
  });
  if (!valid) { errEl.textContent = pw !== pw2 ? '⚠ Паролите не съвпадат!' : '⚠ Моля провери данните!'; errEl.classList.add('show'); return; }
  if (demoUsers.find(u => u.email === email)) {
    errEl.textContent = '⚠ Имейлът вече е регистриран!'; errEl.classList.add('show');
    document.getElementById('regEmail').classList.add('error');
    _authErr('regEmail', 'Този имейл вече е регистриран.');
    return;
  }
  const newUser = { email, password: pw, firstName: fn, lastName: ln, phone: document.getElementById('regPhone').value };
  demoUsers.push(newUser);
  registerSuccess(newUser);
}

function handleForgot() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email.includes('@')) {
    document.getElementById('forgotEmail').classList.add('error');
    _authErr('forgotEmail', 'Въведи валиден имейл адрес.');
    return;
  }
  document.getElementById('forgotEmail').classList.remove('error');
  _authErr('forgotEmail', '');
  showAuthSuccess('📧', 'Имейлът е изпратен!', `Провери ${email} за линк за нулиране на паролата.`);
}

function socialLogin(provider) {
  const mockUser = { email: `user@${provider.toLowerCase()}.com`, firstName: 'Потребител', lastName: provider, phone: '' };
  loginSuccess(mockUser);
}

function loginSuccess(user) {
  currentUser = user;
  showAuthSuccess('🎉', `Добре дошъл, ${user.firstName}!`, 'Влезе успешно в профила си.');
  setTimeout(() => { closeAuthModalDirect(); updateAuthUI(); }, 1800);
}

function registerSuccess(user) {
  currentUser = user;
  showAuthSuccess('🎊', 'Акаунтът е създаден!', `Добре дошъл, ${user.firstName}! Можеш да пазаруваш веднага.`);
  setTimeout(() => { closeAuthModalDirect(); updateAuthUI(); }, 2000);
}

function showAuthSuccess(icon, title, text) {
  ['formLogin','formRegister','formForgot'].forEach(id => { const f = document.getElementById(id); if(f) f.classList.remove('active'); });
  document.getElementById('authSuccessIcon').textContent = icon;
  document.getElementById('authSuccessTitle').textContent = title;
  document.getElementById('authSuccessText').textContent = text;
  document.getElementById('authSuccess').classList.add('show');
}

function updateAuthUI() {
  const topLogin = document.getElementById('topbarLogin');
  const topReg = document.getElementById('topbarRegister');
  const profileBtn = document.getElementById('profileBtn');
  const profileLabel = document.getElementById('profileLabel');
  const profileIcon = document.getElementById('profileIcon');
  if (currentUser) {
    const initials = (currentUser.firstName[0] + (currentUser.lastName ? currentUser.lastName[0] : '')).toUpperCase();
    if (topLogin) topLogin.style.display = 'none';
    if (topReg) topReg.style.display = 'none';
    if (profileBtn) profileBtn.style.display = '';
    if (profileLabel) profileLabel.textContent = currentUser.firstName;
    if (profileIcon) profileIcon.innerHTML = `<div class="hdr-btn-avatar">${escHtml(initials)}</div>`;
    const pdAvatar = document.getElementById('pdAvatar'); if (pdAvatar) pdAvatar.textContent = initials;
    const pdName = document.getElementById('pdName'); if (pdName) pdName.textContent = `${currentUser.firstName} ${currentUser.lastName || ''}`.trim();
    const pdEmail = document.getElementById('pdEmail'); if (pdEmail) pdEmail.textContent = currentUser.email;
    showToast(`👋 Добре дошъл, ${currentUser.firstName}!`);
  } else {
    if (topLogin) topLogin.style.display = '';
    if (topReg) topReg.style.display = '';
    if (profileBtn) profileBtn.style.display = 'none';
    const pdAvatar = document.getElementById('pdAvatar'); if (pdAvatar) pdAvatar.textContent = '?';
    const pdName = document.getElementById('pdName'); if (pdName) pdName.textContent = 'Гост';
    const pdEmail = document.getElementById('pdEmail'); if (pdEmail) pdEmail.textContent = '—';
  }
}

function handleProfileClick() {
  if (currentUser) {
    document.getElementById('profileDropdown').classList.toggle('open');
  } else {
    openAuthModal('login');
  }
}

function closeDropdown() {
  document.getElementById('profileDropdown').classList.remove('open');
}

function handleLogout() {
  currentUser = null;
  closeDropdown();
  updateAuthUI();
  showToast('Излязохте успешно от профила.');
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  const wrap = document.querySelector('.profile-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) closeDropdown();
});

// ===== WISHLIST =====
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem('mc_wishlist') || '[]'); } catch(e) {}

function toggleWishlist(id, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    showToast('❤ Добавено в любими!');
  } else {
    wishlist.splice(idx, 1);
    showToast('♡ Премахнато от любими');
  }
  try { localStorage.setItem('mc_wishlist', JSON.stringify(wishlist)); } catch(err){}
  updateWishlistUI();
  // Update specific button if visible
  const btn = document.getElementById('wl-' + id);
  if (btn) {
    btn.innerHTML = wishlist.includes(id)
      ? '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart-fill"/></svg>'
      : '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart"/></svg>';
    btn.classList.toggle('wishlisted', wishlist.includes(id));
    // Brief pointer-events block to prevent accidental double-tap
    btn.style.pointerEvents = 'none';
    setTimeout(() => { btn.style.pointerEvents = ''; }, 400);
  }
  // Refresh wishlist page if open
  if (document.getElementById('wishlistPage').classList.contains('open')) renderWishlistGrid();
}

function updateWishlistUI() {
  const count = wishlist.length;
  // Header badge
  const hdrBadge = document.getElementById('wlHdrBadge');
  if (hdrBadge) { hdrBadge.textContent = count; hdrBadge.style.display = count > 0 ? 'flex' : 'none'; }
  const hdrIcon = document.getElementById('wlHdrIcon');
  if (hdrIcon) hdrIcon.textContent = count > 0 ? '❤' : '♡';
  // Bottom nav badges (two nav bars exist — update all)
  document.querySelectorAll('#bnWishBadge, #bnWishBadge2').forEach(bnBadge => {
    bnBadge.textContent = count; bnBadge.classList.toggle('show', count > 0);
  });
  // Wishlist count label
  const cl = document.getElementById('wishlistCount');
  if (cl) cl.textContent = count + (count === 1 ? ' продукт' : ' продукта');
}

function openWishlist() {
  renderWishlistGrid();
  document.getElementById('wishlistPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  setBottomNavActive('bn-wish');
}
function closeWishlist() {
  document.getElementById('wishlistPage').classList.remove('open');
  document.body.style.overflow = '';
  setBottomNavActive('bn-home');
}

function renderWishlistGrid() {
  const grid = document.getElementById('wishlistGrid');
  const count = document.getElementById('wishlistCount');
  if (wishlist.length === 0) {
    grid.innerHTML = `<div class="wishlist-empty">
      <div class="wishlist-empty-icon">♡</div>
      <h3>Нямаш любими продукти</h3>
      <p>Кликни на сърчицето на продукт,<br>за да го добавиш в любими.</p>
      <button type="button" class="wishlist-empty-btn" onclick="closeWishlist()">← Разгледай продуктите</button>
    </div>`;
  } else {
    const prods = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
    count.textContent = prods.length + (prods.length === 1 ? ' продукт' : ' продукта');
    // Add-all button before the grid
    const addAllHtml = `<div class="wl-add-all-row"><button type="button" class="wl-add-all-btn" onclick="addAllWishlistToCart()"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави всички в кошницата (${prods.length})</button></div>`;
    grid.innerHTML = addAllHtml + `<div class="wishlist-grid">${prods.map(p => {
      const save = p.old ? Math.round(((p.old-p.price)/p.old)*100) : 0;
      const _wlName = escHtml(p.name);
      const imgHtml = p.img
        ? `<img class="product-img-real" src="${escHtml(p.img)}" alt="${_wlName}" loading="lazy" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${escHtml(p.emoji)}</span>`
        : `<span class="product-img-emoji">${escHtml(p.emoji)}</span>`;
      return `<div class="product-card pos-rel">
        <button type="button" class="wishlist-remove-btn" onclick="toggleWishlist(${p.id},{stopPropagation:()=>{}})" title="Премахни">×</button>
        <div class="product-img-wrap cursor-pointer" onclick="openProductPage(${p.id});closeWishlist();">${imgHtml}</div>
        <div class="product-body">
          <div class="product-brand">${escHtml(p.brand)}</div>
          <div class="product-name">${_wlName}</div>
          <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating}</span></div>
          <div class="product-footer">
            <div class="price-row">
              <div class="price-current${p.badge==='sale'?' sale':''}">${fmtPrice(p.price,p.badge==='sale'?'sale':'')}</div>
              ${p.old?`<div class="price-save">-${save}%</div>`:''}
            </div>
            <button type="button" class="add-cart-btn" onclick="addToCart(${p.id})">🛒 Добави в кошница</button>
          </div>
        </div>
      </div>`;
    }).join('')}</div>`;
  }
}


function addAllWishlistToCart() {
  const prods = wishlist.map(id => products.find(p => p.id === id)).filter(p => p && p.stock !== false);
  if (!prods.length) { showToast('⚠️ Няма налични продукти в любими!'); return; }
  prods.forEach(p => {
    const ex = cart.find(x => x.id === p.id);
    if (ex) ex.qty++; else cart.push({...p, qty: 1});
  });
  updateCart(); saveCart();
  showToast(`🛒 ${prods.length} продукта добавени в кошницата!`);
}

// ===== MY ORDERS PAGE =====
function openMyOrders() {
  renderMyOrders();
  document.getElementById('myOrdersPage').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMyOrders() {
  document.getElementById('myOrdersPage').classList.remove('open');
  document.body.style.overflow = '';
}

function renderMyOrders() {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
  const grid = document.getElementById('myOrdersGrid');
  if (!grid) return;

  if (orders.length === 0) {
    grid.innerHTML = `
      <div class="mo-empty">
        <div class="mo-empty-icon">📦</div>
        <p class="mo-empty-text">Нямаш поръчки все още.<br>Разгледай нашите продукти!</p>
        <button type="button" class="mo-empty-btn" data-action="closeMyOrders">Към магазина →</button>
      </div>`;
    return;
  }

  const statusLabels = { pending:'⏳ Изчаква', processing:'⚙ Обработва се', shipped:'🚚 Изпратена', delivered:'✅ Доставена', cancelled:'❌ Отказана' };
  const statusClass  = { pending:'mo-st-pending', processing:'mo-st-processing', shipped:'mo-st-shipped', delivered:'mo-st-delivered', cancelled:'mo-st-cancelled' };

  grid.innerHTML = orders.map(o => {
    const _oNum = escHtml(o.num || '');
    const _oDate = escHtml(o.date || '');
    const _oDel = escHtml(o.deliveryType || '—');
    const _oStatus = escHtml(statusLabels[o.status] || o.status || '');
    const _oStatusCls = statusClass[o.status] || 'mo-st-pending';
    const items = (o.itemsData || []).map(x =>
      `<div class="mo-item-row">
        <span class="mo-item-emoji">${escHtml(x.emoji||'📦')}</span>
        <div class="mo-item-info">
          <div class="mo-item-name">${escHtml(x.name||'')}</div>
          <div class="mo-item-meta">${escHtml(x.brand||'')} · ×${Number(x.qty)||0}</div>
        </div>
        <div class="mo-item-price">${fmtEur(x.price * x.qty)}</div>
      </div>`
    ).join('');
    return `
      <div class="mo-card">
        <div class="mo-card-header">
          <div>
            <div class="mo-card-num">${_oNum}</div>
            <div class="mo-card-date">${_oDate}</div>
          </div>
          <span class="mo-status ${_oStatusCls}">${_oStatus}</span>
        </div>
        <div class="mo-card-items">${items}</div>
        <div class="mo-card-footer">
          <span class="mo-card-delivery">🚚 ${_oDel}</span>
          <div class="mo-card-total">
            <span class="mo-card-total-label">Общо:</span>
            <span class="mo-card-total-val">${fmtEur(o.total)} <span class="mo-card-total-bgn">/ ${fmtBgn(o.total)}</span></span>
          </div>
          <button type="button" class="mo-print-btn" onclick="printOrder(${JSON.stringify(o.num||'')})" title="Принтирай поръчката">
            <svg width="14" height="14" class="svg-ic" aria-hidden="true"><use href="#ic-printer"/></svg> Принтирай
          </button>
        </div>
      </div>`;
  }).join('');
}

function printOrder(num) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
  const o = orders.find(x => x.num === num);
  if (!o) { showToast('Поръчката не е намерена'); return; }
  const statusLabels = { pending:'Изчаква', processing:'Обработва се', shipped:'Изпратена', delivered:'Доставена', cancelled:'Отказана', paid:'Платена' };
  const statusColors = { pending:'#f59e0b', paid:'#10b981', shipped:'#6366f1', delivered:'#10b981', cancelled:'#ef4444' };
  const delivery = o.delivery || 0;
  const subtotal = o.subtotal || (o.total - delivery);
  const _h = s => escHtml(String(s||''));
  const payLabel = o.payment==='card'?'Карта':o.payment==='cod'?'Наложен платеж':'Банков превод';
  const items = (o.itemsData && o.itemsData.length)
    ? o.itemsData.map(x => `<tr><td>${_h(x.emoji||'')}${_h(x.name||'')}</td><td>${_h(x.brand||'')}</td><td style="text-align:center;">×${Number(x.qty)||0}</td><td style="text-align:right;font-weight:700;">${((x.price*x.qty)/1.95583).toFixed(2)} €<br><span style="font-size:10px;color:#6b7280;">${(x.price*x.qty).toFixed(2)} лв.</span></td></tr>`).join('')
    : `<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:16px;">${_h(o.items||'—')}</td></tr>`;
  const win = window.open('', '_blank', 'width=760,height=700');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(`<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8">
    <title>Фактура ${_h(o.num)} — Most Computers</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Segoe UI',Arial,sans-serif;background:#f8f9fa;color:#1f2937;font-size:13px;padding:0}
      .page{max-width:700px;margin:0 auto;background:#fff;min-height:100vh;padding:40px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:2px solid #e5e7eb;margin-bottom:28px}
      .logo{font-size:22px;font-weight:900;color:#111;letter-spacing:-0.5px}
      .logo span{color:#6366f1}
      .logo-sub{font-size:11px;color:#9ca3af;margin-top:3px}
      .inv-meta{text-align:right}
      .inv-num{font-size:18px;font-weight:800;color:#6366f1}
      .inv-date{font-size:11px;color:#9ca3af;margin-top:4px}
      .status-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;margin-top:6px;color:#fff;background:${statusColors[o.status]||'#6b7280'}}
      .section{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
      .box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px}
      .box-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:10px}
      .box-val{font-size:13px;color:#1f2937;line-height:1.7}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      thead th{background:#f3f4f6;padding:10px 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;text-align:left;border-bottom:2px solid #e5e7eb}
      tbody td{padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;vertical-align:top}
      tbody tr:last-child td{border-bottom:none}
      .totals{margin-left:auto;max-width:280px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px}
      .tot-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#6b7280}
      .tot-row.grand{font-size:16px;font-weight:800;color:#1f2937;border-top:2px solid #e5e7eb;margin-top:8px;padding-top:12px}
      .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:11px;color:#9ca3af}
      @media print{body{background:#fff}.page{padding:24px;box-shadow:none}button{display:none!important}}
      .print-btn{display:block;margin:0 auto 20px;padding:10px 28px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Segoe UI',sans-serif}
    </style></head><body>
    <div class="page">
      <button class="print-btn" onclick="window.print()">🖨 Принтирай фактурата</button>
      <div class="header">
        <div>
          <div class="logo">Most <span>Computers</span></div>
          <div class="logo-sub">mostcomputers.bg &nbsp;·&nbsp; office@mostcomputers.bg</div>
        </div>
        <div class="inv-meta">
          <div class="inv-num">Поръчка ${_h(o.num)}</div>
          <div class="inv-date">Дата: ${_h(o.date)}</div>
          <div class="inv-date">Доставка: ${_h(o.deliveryType||'—')} &nbsp;·&nbsp; Плащане: ${_h(payLabel)}</div>
          <div><span class="status-badge">${_h(statusLabels[o.status]||o.status)}</span></div>
        </div>
      </div>
      <div class="section">
        <div class="box">
          <div class="box-title">Клиент</div>
          <div class="box-val">
            <strong>${_h(o.customer||'—')}</strong><br>
            ${_h(o.email||'')}<br>
            ${_h(o.phone||'')}
          </div>
        </div>
        <div class="box">
          <div class="box-title">Адрес за доставка</div>
          <div class="box-val">
            ${_h(o.city||'—')}, ${_h(o.addr||'')}<br>
            ${o.zip ? 'ПК ' + _h(o.zip) : ''}
          </div>
        </div>
      </div>
      <table>
        <thead><tr><th>Продукт</th><th>Марка</th><th style="text-align:center">Бр.</th><th style="text-align:right">Сума</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
      <div class="totals">
        <div class="tot-row"><span>Продукти</span><span>${(subtotal/1.95583).toFixed(2)} €</span></div>
        <div class="tot-row"><span>Доставка</span><span>${delivery===0?'Безплатно':(delivery/1.95583).toFixed(2)+' €'}</span></div>
        <div class="tot-row grand"><span>Общо</span><span>${(o.total/1.95583).toFixed(2)} € / ${o.total.toFixed(2)} лв.</span></div>
      </div>
      <div class="footer">
        <span>Most Computers ЕООД &nbsp;·&nbsp; ЕИК 123456789</span>
        <span>Генерирано: ${new Date().toLocaleString('bg-BG')}</span>
      </div>
    </div>
    </body></html>`);
  win.document.close();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toggleWishlist, _resetWishlist: () => { wishlist = []; } };
}
