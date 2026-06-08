// ===== B2B PORTAL =====

const _B2B_VIEWS = ['b2bLandingView', 'b2bPendingView', 'b2bDashView'];

function _b2bShowView(id) {
  _B2B_VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.style.display = v === id ? '' : 'none';
  });
}

function _b2bErr(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg || ''; el.style.display = msg ? '' : 'none'; }
}

function _b2bField(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ── Open / Close ─────────────────────────────────────────────

async function openB2BPage() {
  if (typeof _setPgBc === 'function') _setPgBc('b2bBc', 'B2B Портал', 'closeB2BPage');
  const page = document.getElementById('b2bPage');
  if (page) {
    page.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  if (typeof setPageMeta === 'function') setPageMeta('B2B Портал - Most Computers', 'Фирмен портал: фактура с ДДС, приоритетни оферти.');
  try { history.pushState({ page: 'b2b' }, '', '?page=b2b'); } catch(e) {}
  await _b2bInit();
}

function closeB2BPage() {
  const page = document.getElementById('b2bPage');
  if (page) page.classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}

// ── Initialise correct view based on auth + B2B status ───────

async function _b2bInit() {
  const sb = window._sb_client;
  if (!sb) { _b2bShowView('b2bLandingView'); return; }

  const { data: { session } } = await sb.auth.getSession().catch(() => ({ data: { session: null } }));

  if (!session?.user) {
    _b2bShowView('b2bLandingView');
    _b2bToggleAuthFields(true);
    return;
  }

  // Logged in - hide auth fields, pre-fill email
  _b2bToggleAuthFields(false);
  const emailFld = document.getElementById('b2bEmail');
  if (emailFld) emailFld.value = session.user.email;

  const { data: profile } = await sb.from('b2b_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle()
    .catch(() => ({ data: null }));

  if (!profile) { _b2bShowView('b2bLandingView'); return; }

  if (profile.status === 'pending')  { _b2bShowPending(profile); return; }
  if (profile.status === 'approved') { await _b2bShowDashboard(profile, session.user); return; }

  // rejected - show landing with notice
  _b2bShowView('b2bLandingView');
  _b2bErr('b2bRegisterError', '⚠ Заявката е отхвърлена. Свържете се с нас на (+359 2) 91 823.');
}

function _b2bToggleAuthFields(show) {
  const wrap = document.getElementById('b2bAuthFieldsWrap');
  if (wrap) wrap.style.display = show ? '' : 'none';
}

// ── Landing: Register ─────────────────────────────────────────

async function handleB2BRegister() {
  _b2bErr('b2bRegisterError', '');
  const sb = window._sb_client;
  if (!sb) { _b2bErr('b2bRegisterError', '⚠ Сървисът не е наличен. Опресни страницата.'); return; }

  const company = _b2bField('b2bCompany');
  const eik     = _b2bField('b2bEik');
  const vat     = _b2bField('b2bVat');
  const mol     = _b2bField('b2bMol');
  const phone   = _b2bField('b2bPhone');

  if (!company) { _b2bErr('b2bRegisterError', '⚠ Въведи наименованието на фирмата.'); return; }
  if (!eik || eik.length < 9) { _b2bErr('b2bRegisterError', '⚠ Въведи валиден ЕИК (9 цифри).'); return; }
  if (!mol) { _b2bErr('b2bRegisterError', '⚠ Въведи МОЛ.'); return; }
  if (!phone) { _b2bErr('b2bRegisterError', '⚠ Въведи телефон за контакт.'); return; }

  const btn = document.getElementById('b2bRegisterBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Изпраща…'; }

  try {
    // Step 1: ensure we have a logged-in user
    let userId;
    const { data: { session } } = await sb.auth.getSession();

    if (session?.user) {
      userId = session.user.id;
    } else {
      const email = _b2bField('b2bEmail');
      const pass  = _b2bField('b2bPassword');
      if (!email || !email.includes('@')) { _b2bErr('b2bRegisterError', '⚠ Въведи валиден имейл.'); return; }
      if (!pass || pass.length < 6)       { _b2bErr('b2bRegisterError', '⚠ Паролата трябва да е поне 6 символа.'); return; }

      if (!window._sbAuth) { _b2bErr('b2bRegisterError', '⚠ Auth service не е наличен.'); return; }
      const { data, error: signUpErr } = await window._sbAuth.signUp(email, pass, {
        firstName: mol.split(' ')[0] || 'Контакт',
        lastName:  mol.split(' ')[1] || '',
        phone,
      });
      if (signUpErr) {
        _b2bErr('b2bRegisterError', '⚠ ' + (signUpErr.message || 'Грешка при регистрация.'));
        return;
      }
      userId = data?.user?.id;
    }

    if (!userId) { _b2bErr('b2bRegisterError', '⚠ Не може да се определи потребителят. Опитай пак.'); return; }

    // Step 2: insert B2B profile
    const { error: profileErr } = await sb.from('b2b_profiles').insert([{
      user_id:      userId,
      company_name: company,
      eik,
      vat_number:   vat || null,
      mol,
      phone,
      status:       'pending',
    }]);

    if (profileErr) {
      if (profileErr.code === '23505') {
        _b2bErr('b2bRegisterError', '⚠ ЕИК вече е регистриран. Свържи се с нас при въпроси.');
      } else {
        _b2bErr('b2bRegisterError', '⚠ ' + (profileErr.message || 'Грешка при записване.'));
      }
      return;
    }

    _b2bShowPending({ company_name: company });

  } catch(e) {
    _b2bErr('b2bRegisterError', '⚠ Грешка при изпращане. Опитай пак.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Изпрати заявка'; }
  }
}

// ── Pending view ──────────────────────────────────────────────

function _b2bShowPending(profile) {
  _b2bShowView('b2bPendingView');
  const nameEl = document.getElementById('b2bPendingCompany');
  if (nameEl) nameEl.textContent = profile.company_name || '';
}

// ── Dashboard ─────────────────────────────────────────────────

async function _b2bShowDashboard(profile, user) {
  _b2bShowView('b2bDashView');

  const el = (id) => document.getElementById(id);
  if (el('b2bDashCompany'))  el('b2bDashCompany').textContent  = profile.company_name;
  if (el('b2bDashEik'))      el('b2bDashEik').textContent      = profile.eik;
  if (el('b2bDashCredit'))   el('b2bDashCredit').textContent   = (profile.credit_days || 30) + ' дни';
  if (el('b2bDashManager'))  el('b2bDashManager').textContent  = profile.account_manager || 'Екипът на Most Computers';
  if (el('b2bDashEmail'))    el('b2bDashEmail').textContent    = user.email;

  // Prefill quote form
  if (el('quoteCompany')) el('quoteCompany').value = profile.company_name;

  switchB2BTab('orders', document.querySelector('#b2bDashView .b2b-tab'));
  await _b2bLoadOrders(user.email);
}

function switchB2BTab(tab, btn) {
  document.querySelectorAll('#b2bDashView .b2b-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#b2bDashView .b2b-tab-pane').forEach(p => p.style.display = 'none');
  if (btn) btn.classList.add('active');
  const pane = document.getElementById('b2bTab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (pane) pane.style.display = '';
  if (tab === 'orders')  _b2bLoadOrders();
  if (tab === 'quotes')  _b2bLoadQuotes();
  if (tab === 'invoices') _b2bLoadInvoices();
}

// ── Orders ────────────────────────────────────────────────────

async function _b2bLoadOrders() {
  const grid = document.getElementById('b2bOrdersGrid');
  if (!grid) return;
  const sb = window._sb_client;
  if (!sb) { grid.innerHTML = _b2bEmptyState('📦', 'Поръчките не са налични'); return; }

  const { data: { session } } = await sb.auth.getSession().catch(() => ({ data: { session: null } }));
  if (!session) return;

  grid.innerHTML = '<div class="b2b-loading">⏳ Зарежда…</div>';

  const { data: orders } = await sb.from('orders')
    .select('*')
    .eq('customer_email', session.user.email)
    .order('created_at', { ascending: false })
    .limit(20)
    .catch(() => ({ data: null }));

  if (!orders || !orders.length) {
    grid.innerHTML = _b2bEmptyState('📦', 'Нямате поръчки още');
    return;
  }

  const statusLabel = { pending:'⏳ Изчаква', processing:'⚙ Обработва се', shipped:'🚚 Изпратена', delivered:'✅ Доставена', cancelled:'❌ Отказана' };
  grid.innerHTML = orders.map(o => `
    <div class="b2b-order-card">
      <div class="b2b-order-header">
        <div>
          <div class="b2b-order-num">${escHtml(o.order_num || '')}</div>
          <div class="b2b-order-date">${o.created_at ? new Date(o.created_at).toLocaleDateString('bg-BG') : ''}</div>
        </div>
        <span class="b2b-order-status">${escHtml(statusLabel[o.status] || o.status || '')}</span>
      </div>
      <div class="b2b-order-total">Общо: <strong>${typeof fmtEur === 'function' ? fmtEur(o.total) : o.total + ' €'}</strong></div>
    </div>`).join('');
}

// ── Quotes ────────────────────────────────────────────────────

async function _b2bLoadQuotes() {
  const list = document.getElementById('b2bQuotesList');
  if (!list) return;
  const sb = window._sb_client;
  if (!sb) return;

  const { data: { session } } = await sb.auth.getSession().catch(() => ({ data: { session: null } }));
  if (!session) return;

  list.innerHTML = '<div class="b2b-loading">⏳ Зарежда…</div>';

  const { data: quotes } = await sb.from('quote_requests')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(10)
    .catch(() => ({ data: null }));

  if (!quotes || !quotes.length) {
    list.innerHTML = _b2bEmptyState('💬', 'Нямате изпратени оферти');
    return;
  }

  const statusLabel = { pending:'⏳ Изчаква', sent:'📤 Изпратена', accepted:'✅ Приета', rejected:'❌ Отхвърлена' };
  list.innerHTML = quotes.map(q => `
    <div class="b2b-order-card">
      <div class="b2b-order-header">
        <div class="b2b-order-date">${q.created_at ? new Date(q.created_at).toLocaleDateString('bg-BG') : ''}</div>
        <span class="b2b-order-status">${escHtml(statusLabel[q.status] || q.status || '')}</span>
      </div>
      ${q.notes ? `<div class="b2b-order-total">${escHtml(q.notes)}</div>` : ''}
      ${q.admin_reply ? `<div class="b2b-admin-reply">💬 ${escHtml(q.admin_reply)}</div>` : ''}
    </div>`).join('');
}

async function handleQuoteSubmit() {
  _b2bErr('b2bQuoteError', '');
  const sb = window._sb_client;
  if (!sb) { _b2bErr('b2bQuoteError', '⚠ Сървисът не е наличен.'); return; }

  const notes = _b2bField('quoteNotes');
  const qty   = _b2bField('quoteQty');
  const prod  = _b2bField('quoteProd');

  if (!prod && !notes) { _b2bErr('b2bQuoteError', '⚠ Опиши продуктите или добави бележка.'); return; }

  const { data: { session } } = await sb.auth.getSession().catch(() => ({ data: { session: null } }));
  if (!session) { _b2bErr('b2bQuoteError', '⚠ Влез в акаунта.'); return; }

  const { data: profile } = await sb.from('b2b_profiles').select('id').eq('user_id', session.user.id).maybeSingle();
  if (!profile) { _b2bErr('b2bQuoteError', '⚠ Фирменият профил не е намерен.'); return; }

  const btn = document.getElementById('quoteSubmitBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Изпраща…'; }

  const items = prod ? [{ name: prod, qty: qty || 1 }] : [];

  const { error } = await sb.from('quote_requests').insert([{
    b2b_profile_id: profile.id,
    user_id:        session.user.id,
    items,
    notes:          notes || null,
    status:         'pending',
  }]).catch(e => ({ error: e }));

  if (btn) { btn.disabled = false; btn.textContent = 'Изпрати запитване'; }

  if (error) { _b2bErr('b2bQuoteError', '⚠ Грешка при изпращане.'); return; }

  if (typeof showToast === 'function') showToast('✅ Запитването е изпратено! Ще се свържем скоро.');
  ['quoteNotes', 'quoteQty', 'quoteProd'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  await _b2bLoadQuotes();
}

// ── Invoices ──────────────────────────────────────────────────

async function _b2bLoadInvoices() {
  const list = document.getElementById('b2bInvoicesList');
  if (!list) return;
  const sb = window._sb_client;
  if (!sb) { list.innerHTML = _b2bEmptyState('🧾', 'Фактурите не са налични'); return; }

  const { data: { session } } = await sb.auth.getSession().catch(() => ({ data: { session: null } }));
  if (!session) return;

  const { data: orders } = await sb.from('orders')
    .select('order_num, total, created_at, status')
    .eq('customer_email', session.user.email)
    .eq('status', 'delivered')
    .order('created_at', { ascending: false })
    .limit(20)
    .catch(() => ({ data: null }));

  if (!orders || !orders.length) {
    list.innerHTML = _b2bEmptyState('🧾', 'Няма доставени поръчки за фактуриране');
    return;
  }

  list.innerHTML = orders.map(o => `
    <div class="b2b-order-card">
      <div class="b2b-order-header">
        <div>
          <div class="b2b-order-num">Фактура - ${escHtml(o.order_num || '')}</div>
          <div class="b2b-order-date">${o.created_at ? new Date(o.created_at).toLocaleDateString('bg-BG') : ''}</div>
        </div>
        <button type="button" class="b2b-print-btn" onclick="printOrder(${JSON.stringify(o.order_num || '')})">🖨 Принтирай</button>
      </div>
      <div class="b2b-order-total">Сума: <strong>${typeof fmtEur === 'function' ? fmtEur(o.total) : o.total + ' €'}</strong></div>
    </div>`).join('');
}

// ── Helpers ───────────────────────────────────────────────────

function _b2bEmptyState(icon, text) {
  return `<div class="b2b-empty"><div class="b2b-empty-icon">${icon}</div><p>${escHtml(text)}</p></div>`;
}
