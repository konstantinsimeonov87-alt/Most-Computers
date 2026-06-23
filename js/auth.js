// ===== AUTH SYSTEM =====
let currentUser = null;

// ===== SUPABASE AUTH BRIDGE =====
// supabase-client.js calls these when auth state changes.
// Defined early so the session-restore callback in supabase-client.js can find them.
window._onSupabaseSignIn = function(user) { loginSuccess(user); };
window._onSupabaseSignOut = function() {
  currentUser = null;
  try { localStorage.removeItem('mc_session'); } catch(e) {}
  closeDropdown();
  updateAuthUI();
  showToast('Излязохте успешно от профила.');
};

function openAuth(tab) { openAuthModal(tab || 'login'); }
function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
  resetAuthForms();
  const backdrop = document.getElementById('authBackdrop');
  if (backdrop) { backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeAuthModal(e) { if (e.target === e.currentTarget) closeAuthModalDirect(); }
function closeAuthModalDirect() {
  const backdrop = document.getElementById('authBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  const _t = (id, cls, val) => { const el = document.getElementById(id); if (el) el.classList.toggle(cls, val); };
  _t('tabLogin',      'active', tab === 'login');
  _t('tabRegister',   'active', tab === 'register');
  _t('formLogin',     'active', tab === 'login');
  _t('formRegister',  'active', tab === 'register');
  _t('formForgot',    'active', tab === 'forgot');
  const success = document.getElementById('authSuccess'); if (success) success.classList.remove('show');
  const subs = { login: 'Влез в своя профил', register: 'Създай нов акаунт безплатно', forgot: 'Нулиране на парола' };
  const sub = document.getElementById('authHeaderSub'); if (sub) sub.textContent = subs[tab] || '';
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
  const pass  = document.getElementById('loginPassword').value;
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

  if (!window._sbAuth) {
    errEl.textContent = '⚠ Auth service не е наличен. Опресни страницата.';
    errEl.classList.add('show');
    return;
  }

  const btn = document.querySelector('#formLogin button[type="submit"], #formLogin .auth-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Зарежда…'; }

  window._sbAuth.signIn(email, pass)
    .then(({ error }) => {
      if (error) {
        errEl.textContent = '⚠ Грешен имейл или парола.';
        errEl.classList.add('show');
        document.getElementById('loginPassword').classList.add('error');
        _authErr('loginPassword', 'Грешен имейл или парола.');
        return;
      }
      // loginSuccess is called automatically via window._onSupabaseSignIn
    })
    .catch(() => {
      errEl.textContent = '⚠ Грешка при свързване. Опитай пак.';
      errEl.classList.add('show');
    })
    .finally(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Влез'; }
    });
}

function handleRegister() {
  const fn    = document.getElementById('regFirstName').value.trim();
  const ln    = document.getElementById('regLastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const ph    = (document.getElementById('regPhone') || {}).value || '';
  const pw    = document.getElementById('regPassword').value;
  const pw2   = document.getElementById('regPassword2').value;
  const errEl = document.getElementById('registerError');
  errEl.classList.remove('show');
  let valid = true;
  const fieldChecks = [
    ['regFirstName', fn.length > 0,      'Името е задължително.'],
    ['regLastName',  ln.length > 0,      'Фамилията е задължителна.'],
    ['regEmail',     email.includes('@'),'Въведи валиден имейл адрес.'],
    ['regPassword',  pw.length >= 6,     'Паролата трябва да е поне 6 символа.'],
    ['regPassword2', pw === pw2 && pw.length >= 6, pw !== pw2 ? 'Паролите не съвпадат.' : 'Повтори паролата.'],
  ];
  fieldChecks.forEach(([id, ok, msg]) => {
    document.getElementById(id).classList.toggle('error', !ok);
    _authErr(id, ok ? '' : msg);
    if (!ok) valid = false;
  });
  if (!valid) {
    errEl.textContent = pw !== pw2 ? '⚠ Паролите не съвпадат!' : '⚠ Моля провери данните!';
    errEl.classList.add('show');
    return;
  }

  if (!window._sbAuth) {
    errEl.textContent = '⚠ Auth service не е наличен. Опресни страницата.';
    errEl.classList.add('show');
    return;
  }

  const btn = document.querySelector('#formRegister button[type="submit"], #formRegister .auth-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Регистрира…'; }

  window._sbAuth.signUp(email, pw, { firstName: fn, lastName: ln, phone: ph })
    .then(({ data, error }) => {
      if (error) {
        const msg = error.message?.includes('already registered')
          ? '⚠ Имейлът вече е регистриран!'
          : '⚠ ' + (error.message || 'Грешка при регистрация.');
        errEl.textContent = msg;
        errEl.classList.add('show');
        return;
      }
      if (data?.session) {
        // Email confirmation disabled - user is logged in immediately.
        // loginSuccess will be called via window._onSupabaseSignIn.
      } else {
        // Email confirmation enabled - ask user to check inbox.
        showAuthSuccess('📧', 'Провери имейла си!',
          `Изпратихме потвърждение на ${email}. Кликни линка за активация.`);
      }
    })
    .catch(() => {
      errEl.textContent = '⚠ Грешка при регистрация. Опитай пак.';
      errEl.classList.add('show');
    })
    .finally(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Регистрирай се'; }
    });
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

  if (!window._sbAuth) {
    showAuthSuccess('📧', 'Имейлът е изпратен!', `Провери ${email} за линк за нулиране на паролата.`);
    return;
  }

  window._sbAuth.resetPassword(email)
    .then(() => {
      showAuthSuccess('📧', 'Имейлът е изпратен!', `Провери ${email} за линк за нулиране на паролата.`);
    })
    .catch(() => {
      showAuthSuccess('📧', 'Имейлът е изпратен!', `Провери ${email} за линк за нулиране на паролата.`);
    });
}

function socialLogin(provider) {
  showToast('🔜 Социален вход с ' + provider + ' - очаквайте скоро!');
}

function _saveSession(user) {
  try {
    localStorage.setItem('mc_session', JSON.stringify({
      email: user.email, firstName: user.firstName, lastName: user.lastName || '', phone: user.phone || '',
      ts: Date.now()
    }));
  } catch(e) {}
}

function loginSuccess(user) {
  currentUser = user;
  _saveSession(user);
  showAuthSuccess('🎉', `Добре дошъл, ${user.firstName}!`, 'Влезе успешно в профила си.');
  // Load wishlist from Supabase and merge with local
  if (typeof window.loadWishlistFromSupabase === 'function') {
    window.loadWishlistFromSupabase(user.email).then(remoteIds => {
      if (remoteIds && Array.isArray(remoteIds)) {
        const merged = [...new Set([...wishlist, ...remoteIds])];
        wishlist = merged;
        try { localStorage.setItem('mc_wishlist', JSON.stringify(wishlist)); } catch(e) {}
        updateWishlistUI();
      }
    });
  }
  setTimeout(() => { closeAuthModalDirect(); updateAuthUI(); }, 1800);
}

function registerSuccess(user) {
  currentUser = user;
  _saveSession(user);
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
    const initials = ((currentUser.firstName || 'А')[0] + (currentUser.lastName ? currentUser.lastName[0] : '')).toUpperCase();
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
    const pdEmail = document.getElementById('pdEmail'); if (pdEmail) pdEmail.textContent = '-';
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
  closeDropdown();
  if (window._sbAuth) {
    window._sbAuth.signOut(); // onAuthStateChange → _onSupabaseSignOut handles the rest
  } else {
    currentUser = null;
    try { localStorage.removeItem('mc_session'); } catch(e) {}
    updateAuthUI();
    showToast('Излязохте успешно от профила.');
  }
}

// Session is restored automatically by Supabase (persistSession: true).
// supabase-client.js calls window._onSupabaseSignIn on load if a session exists.

// Close dropdown on outside click
document.addEventListener('click', e => {
  const wrap = document.querySelector('.profile-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) closeDropdown();
});

// ===== WISHLIST =====
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem('mc_wishlist') || '[]'); } catch(e) {}

function _saveWishlistPrices() {
  try {
    const prices = {};
    wishlist.forEach(id => { const p = products.find(x => x.id === id); if (p) prices[id] = p.price; });
    localStorage.setItem('mc_wishlist_prices', JSON.stringify(prices));
  } catch(e) {}
}

function checkWishlistPriceDrops() {
  try {
    const saved = JSON.parse(localStorage.getItem('mc_wishlist_prices') || '{}');
    const drops = wishlist.filter(id => {
      const p = products.find(x => x.id === id);
      return p && saved[id] && p.price < saved[id];
    });
    if (!drops.length) return;
    const el = document.getElementById('wishlistPriceDropBanner');
    if (el) { el.style.display = ''; el.querySelector('.wpd-count').textContent = drops.length; return; }
    const banner = document.createElement('div');
    banner.id = 'wishlistPriceDropBanner';
    banner.style.cssText = 'position:fixed;bottom:70px;left:50%;transform:translateX(-50%);z-index:3000;background:#166534;color:#fff;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:700;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.25);cursor:pointer;max-width:340px;';
    banner.innerHTML = `<span>🔔</span><span><span class="wpd-count">${drops.length}</span> ${drops.length === 1 ? 'продукт от' : 'продукта от'} любимите ${drops.length === 1 ? 'е поевтинял' : 'са поевтинели'}!</span><button type="button" style="margin-left:auto;background:rgba(255,255,255,0.2);border:none;color:#fff;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:12px;" onclick="event.stopPropagation();document.getElementById('wishlistPriceDropBanner').remove()">×</button>`;
    banner.onclick = () => { openWishlist(); banner.remove(); };
    document.body.appendChild(banner);
    setTimeout(() => { if (banner.parentNode) { banner.style.opacity='0'; banner.style.transition='opacity .4s'; setTimeout(()=>banner.remove(),400); } }, 12000);
  } catch(e) {}
}

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
  _saveWishlistPrices();
  if (currentUser && typeof window.syncWishlistToSupabase === 'function') {
    window.syncWishlistToSupabase(currentUser.email, wishlist);
  }
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
  // Bottom nav badges (two nav bars exist - update all)
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
    var _savedPrices = {};
    try { _savedPrices = JSON.parse(localStorage.getItem('mc_wishlist_prices') || '{}'); } catch(e) {}
    // Add-all + share buttons before the grid
    const shareUrl = 'https://mostcomputers.bg/?wl=' + wishlist.join(',');
    const addAllHtml = `<div class="wl-add-all-row"><button type="button" class="wl-add-all-btn" onclick="addAllWishlistToCart()"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави всички в кошницата (${prods.length})</button><button type="button" class="wl-share-btn" onclick="navigator.clipboard&&navigator.clipboard.writeText('${escHtml(shareUrl)}').then(()=>showToast('🔗 Линкът е копиран!')).catch(()=>{})" title="Сподели любими">🔗 Сподели</button><button type="button" class="wl-share-btn" onclick="showWishlistQR()" title="QR код">📱 QR</button></div>`;
    grid.innerHTML = addAllHtml + `<div class="wishlist-grid">${prods.map(p => {
      const save = p.old ? Math.round(((p.old-p.price)/p.old)*100) : 0;
      const _wlName = escHtml(p.name);
      const imgHtml = p.img
        ? `<img class="product-img-real" src="${escHtml(p.img)}" alt="${_wlName}" loading="lazy" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${escHtml(p.emoji)}</span>`
        : `<span class="product-img-emoji">${escHtml(p.emoji)}</span>`;
      const savedPrice = _savedPrices[p.id];
      const priceDrop = savedPrice && p.price < savedPrice ? Math.round(((savedPrice - p.price) / savedPrice) * 100) : 0;
      const priceDropBadge = priceDrop > 0 ? `<div class="wl-drop-badge">↓ -${priceDrop}% от добавяне</div>` : '';
      return `<div class="product-card pos-rel">
        <button type="button" class="wishlist-remove-btn" onclick="toggleWishlist(${p.id},{stopPropagation:()=>{}})" title="Премахни">×</button>
        ${priceDropBadge}
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


function showWishlistQR() {
  if (!wishlist.length) return;
  const url = 'https://mostcomputers.bg/?wl=' + wishlist.join(',');
  const qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9000;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = '<div style="background:var(--white);border-radius:16px;padding:28px 24px;text-align:center;max-width:260px;width:calc(100% - 48px);">' +
    '<h3 style="margin:0 0 12px;font-size:16px;">📱 Сканирай QR кода</h3>' +
    '<img src="' + escHtml(qrSrc) + '" width="200" height="200" alt="QR код за wishlist" style="border-radius:8px;display:block;margin:0 auto;">' +
    '<p style="font-size:11px;color:var(--muted);margin:10px 0 14px;">Споделя ' + wishlist.length + ' ' + (wishlist.length === 1 ? 'продукт' : 'продукта') + ' от любими</p>' +
    '<button onclick="this.closest(\'div[style*=fixed]\').remove()" class="add-cart-btn" style="width:100%;">Затвори</button>' +
    '</div>';
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
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

// ===== PROFILE PAGE =====
function openProfilePage() {
  const page = document.getElementById('profilePage');
  if (!page) return;
  // Fill header
  const u = currentUser;
  const avatar = document.getElementById('profAvatar');
  const name   = document.getElementById('profName');
  const email  = document.getElementById('profEmail');
  if (avatar) avatar.textContent = u ? (u.firstName[0] + (u.lastName ? u.lastName[0] : '')).toUpperCase() : '?';
  if (name)   name.textContent   = u ? (u.firstName + ' ' + (u.lastName || '')).trim() : 'Гост';
  if (email)  email.textContent  = u ? u.email : '-';
  // Settings tab values
  const se = document.getElementById('profSettingsEmail');
  const sp = document.getElementById('profSettingsPhone');
  const so = document.getElementById('profOosCount');
  if (se) se.textContent = u ? u.email : '-';
  if (sp) sp.textContent = u ? (u.phone || '-') : '-';
  if (so) {
    try { so.textContent = JSON.parse(localStorage.getItem('mc_oos_notify') || '[]').length + ' продукта'; } catch(e) { so.textContent = '0 продукта'; }
  }
  // Show first tab
  switchProfileTab('orders', document.querySelector('#profilePage .prof-tab'));
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(function() { page.classList.add('open'); });
  document.body.style.overflow = 'hidden';
  try { history.pushState({ page: 'profile' }, '', '?page=profile'); } catch(e) {}
}

function closeProfilePage() {
  const page = document.getElementById('profilePage');
  if (!page) return;
  page.classList.remove('open');
  setTimeout(function() { page.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}

function switchProfileTab(tab, btn) {
  // Deactivate all tabs
  document.querySelectorAll('#profilePage .prof-tab').forEach(function(t) {
    t.classList.remove('active'); t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('#profilePage .prof-tab-pane').forEach(function(p) { p.style.display = 'none'; });
  // Activate selected
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); }
  const pane = document.getElementById('profTab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (pane) pane.style.display = 'block';
  // Lazy render
  if (tab === 'orders') {
    const g = document.getElementById('profOrdersGrid');
    if (g) { const tmp = document.getElementById('myOrdersGrid'); if (tmp) g.innerHTML = tmp.innerHTML || ''; renderMyOrders(); setTimeout(function() { if (g.innerHTML === '') g.innerHTML = tmp ? tmp.innerHTML : ''; }, 100); }
  }
  if (tab === 'wishlist') {
    const g = document.getElementById('profWishlistGrid');
    if (g) { const tmp = document.getElementById('wishlistGrid'); renderWishlistGrid(); setTimeout(function() { if (tmp) g.innerHTML = tmp.innerHTML; }, 100); }
  }
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
    const _oDel = escHtml(o.deliveryType || '-');
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

const _INVOICE_COMPANIES = [
  {
    name: '„МОСТ КОМПЮТЪРС" ООД',
    eik: '831210862',
    dds: 'BG831210862',
    addr: 'бул. „Шипченски проход", бл. 240, вх. Г, гр. София 1111',
    mol: 'Христофор Аспарухов',
    tel: '02 91 823',
    fax: '02 873 00 37',
    bank: 'ОББ АД',
    bic: 'UBBSBGSF',
    iban: 'BG29UBBS74281010110202',
  },
  {
    name: '„СММ - 97" ООД',
    eik: '121488372',
    dds: 'BG121488372',
    addr: 'бул. „Шипченски проход", бл. 240, вх. А, гр. София 1111',
    mol: 'Христофор Аспарухов',
    tel: '02 91 823',
    fax: '02 873 00 37',
    bank: 'ОББ АД',
    bic: 'UBBSBGSF',
    iban: 'BG79UBBS74281010871916',
  }
];

function _bgNumWords(n) {
  const oM = ['','един','два','три','четири','пет','шест','седем','осем','девет','десет','единадесет','дванадесет','тринадесет','четиринадесет','петнадесет','шестнадесет','седемнадесет','осемнадесет','деветнадесет'];
  const oF = ['','една','две','три','четири','пет','шест','седем','осем','девет','десет','единадесет','дванадесет','тринадесет','четиринадесет','петнадесет','шестнадесет','седемнадесет','осемнадесет','деветнадесет'];
  const t  = ['','','двадесет','тридесет','четиридесет','петдесет','шестдесет','седемдесет','осемдесет','деветдесет'];
  const h  = ['','сто','двеста','триста','четиристотин','петстотин','шестстотин','седемстотин','осемстотин','деветстотин'];
  function b100(x, f) { if (!x) return ''; const a = f ? oF : oM; if (x < 20) return a[x]; return t[Math.floor(x/10)] + (x%10 ? ' и ' + a[x%10] : ''); }
  function b1k(x, f)  { if (!x) return ''; const hh = Math.floor(x/100), r = x%100; return (h[hh]||'') + (hh && r ? ' и ' : '') + b100(r, f); }
  const iv = Math.floor(n), dc = Math.round((n - iv) * 100);
  let w = '';
  if (!iv) { w = 'нула лева'; }
  else if (iv < 1000) { w = b1k(iv, false) + (iv === 1 ? ' лев' : ' лева'); }
  else if (iv < 1000000) {
    const th = Math.floor(iv/1000), r = iv%1000;
    w = (th === 1 ? 'хиляда' : b1k(th, true) + ' хиляди') + (r ? (r < 100 ? ' и ' : ' ') + b1k(r, false) : '') + ' лева';
  } else { w = iv + ' лева'; }
  if (dc) w += ' и ' + (dc < 10 ? '0'+dc : dc) + ' стотинки';
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function _openInvoiceWindow(o, co) {
  const _h = s => escHtml(String(s || ''));
  const _items   = o.itemsData || [];
  const itemsTotal = _items.length
    ? _items.reduce((s, x) => s + (x.price || 0) * (Number(x.qty) || 1), 0)
    : (o.subtotal || o.total || 0);
  const base = itemsTotal / 1.2;
  const vat  = itemsTotal - base;
  const payLabel = o.payment === 'card' ? 'Карта' : o.payment === 'cod' ? 'Наложен платеж' : 'Банков превод';
  let invDate = '';
  try {
    const d = o.date ? new Date(o.date) : new Date();
    invDate = isNaN(d.getTime()) ? new Date().toLocaleDateString('bg-BG') : d.toLocaleDateString('bg-BG');
  } catch(e) { invDate = new Date().toLocaleDateString('bg-BG'); }
  const _eur = (bgn) => (bgn / EUR_RATE).toFixed(2);
  const rows = (o.itemsData && o.itemsData.length)
    ? o.itemsData.map((x, i) => {
        const qty = Number(x.qty) || 1;
        const unitEx = x.price / 1.2;
        const lineEx = unitEx * qty;
        return `<tr><td style="text-align:center;">${i+1}</td><td>${_h(x.name||'')}</td><td style="text-align:center;">бр.</td><td style="text-align:center;">${qty}</td><td style="text-align:right;">${_eur(unitEx)}</td><td style="text-align:right;font-weight:700;">${_eur(lineEx)}</td></tr>`;
      }).join('')
    : `<tr><td colspan="6" style="text-align:center;color:#888;padding:12px;">${_h(o.items||'-')}</td></tr>`;
  const win = window.open('', '_blank', 'width=800,height=920');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(`<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8"><title>Фактура ${_h(o.num)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;font-size:12px;color:#000;background:#fff;padding:20px}
.page{max-width:740px;margin:0 auto;background:#fff;padding:28px}
.print-btn{display:block;margin:0 auto 14px;padding:9px 26px;background:#1d4ed8;color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer}
h1{font-size:20px;font-weight:900;text-align:center;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px}
.inv-meta{text-align:center;font-size:11px;color:#444;margin-bottom:18px}
.parties{display:grid;grid-template-columns:1fr 1fr;margin-bottom:16px;border:1px solid #888}
.party{padding:10px 13px}
.party+.party{border-left:1px solid #888}
.party-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#555;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:7px}
.pr{font-size:11px;line-height:1.85}
.basis{font-size:11px;margin:10px 0 8px;color:#333}
table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px}
thead th{background:#efefef;border:1px solid #888;padding:5px 8px;font-weight:800;text-align:left}
tbody td{border:1px solid #bbb;padding:5px 8px;vertical-align:top}
.tw{display:flex;justify-content:flex-end;margin-bottom:10px}
.totals{width:260px;border:1px solid #888;font-size:11px}
.tr{display:flex;justify-content:space-between;padding:5px 10px;border-bottom:1px solid #ddd}
.tr:last-child{border-bottom:none;font-weight:900;font-size:13px;background:#efefef}
.slovom{font-size:11px;padding:7px 11px;border:1px solid #bbb;background:#fafafa;margin-bottom:10px}
.bank{font-size:11px;border:1px solid #bbb;padding:7px 11px;line-height:1.8;margin-bottom:18px}
@media print{.print-btn{display:none!important}body{padding:0}.page{padding:18px}}
</style></head><body>
<div class="page">
<button class="print-btn" onclick="window.print()">🖨 Принтирай</button>
<h1>Фактура</h1>
<div class="inv-meta">№ ${_h(o.num)} &nbsp;|&nbsp; Дата: ${invDate} &nbsp;|&nbsp; Оригинал &nbsp;|&nbsp; Плащане: ${_h(payLabel)}</div>
<div class="parties">
  <div class="party">
    <div class="party-title">Доставчик</div>
    <div class="pr"><strong>${_h(co.name)}</strong><br>ЕИК: ${_h(co.eik)}<br>ДДС №: ${_h(co.dds)}<br>Адрес: ${_h(co.addr)}<br>МОЛ: ${_h(co.mol)}<br>Тел: ${_h(co.tel)} &nbsp; Факс: ${_h(co.fax)}</div>
  </div>
  <div class="party">
    <div class="party-title">Получател</div>
    <div class="pr"><strong>${_h(o.customer||'-')}</strong><br>ЕИК/ЕГН: &nbsp;<br>ДДС №: &nbsp;<br>Адрес: ${_h(o.city||'')}${o.addr ? ', ' + _h(o.addr) : ''}<br>Тел: ${_h(o.phone||'')}<br>Имейл: ${_h(o.email||'')}</div>
  </div>
</div>
<div class="basis">Основание за плащане: Покупка на стоки</div>
<table>
  <thead><tr>
    <th style="width:30px;text-align:center;">№</th>
    <th>Наименование на стоката / услугата</th>
    <th style="width:42px;text-align:center;">Мярка</th>
    <th style="width:40px;text-align:center;">Кол.</th>
    <th style="width:88px;text-align:right;">Ед. цена €</th>
    <th style="width:88px;text-align:right;">Стойност €</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="tw"><div class="totals">
  <div class="tr"><span>Данъчна основа</span><span>${_eur(base)} €</span></div>
  <div class="tr"><span>ДДС 20%</span><span>${_eur(vat)} €</span></div>
  <div class="tr"><span>Сума за плащане</span><span>${_eur(itemsTotal)} €</span></div>
</div></div>
<div class="slovom"><strong>Словом:</strong> ${_bgNumWords(itemsTotal)} (${_eur(itemsTotal)} EUR)</div>
<div class="bank"><strong>Банкова сметка:</strong> ${_h(co.bank)} &nbsp;·&nbsp; BIC: ${_h(co.bic)} &nbsp;·&nbsp; IBAN: ${_h(co.iban)}</div>
</div></body></html>`);
  win.document.close();
}

// Марки, фактурирани към Мост Компютърс; всички останали → СММ 97
const _MOST_BRANDS = new Set(['hp', 'lenovo', 'nokia', 'hmd', 'koorui']);

function printOrder(num) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
  const o = orders.find(x => x.num === num);
  if (!o) { showToast('Поръчката не е намерена'); return; }

  const items = o.itemsData || [];
  const mostItems = items.filter(x => _MOST_BRANDS.has((x.brand || '').toLowerCase().trim()));
  const smmItems  = items.filter(x => !_MOST_BRANDS.has((x.brand || '').toLowerCase().trim()));

  function splitOrder(filteredItems) {
    return Object.assign({}, o, { itemsData: filteredItems });
  }

  if (mostItems.length && smmItems.length) {
    _openInvoiceWindow(splitOrder(mostItems), _INVOICE_COMPANIES[0]);
    setTimeout(() => _openInvoiceWindow(splitOrder(smmItems), _INVOICE_COMPANIES[1]), 400);
    showToast('🧾 Отварят се 2 фактури - Мост Компютърс и СММ 97');
  } else if (mostItems.length) {
    _openInvoiceWindow(o, _INVOICE_COMPANIES[0]);
  } else {
    _openInvoiceWindow(o, _INVOICE_COMPANIES[1]);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toggleWishlist, _resetWishlist: () => { wishlist = []; } };
}
