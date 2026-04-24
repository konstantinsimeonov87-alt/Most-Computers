// CART
function saveCart() { try { localStorage.setItem('mc_cart', JSON.stringify(cart.map(x => ({ id: x.id, qty: x.qty })))); } catch (e) { } }
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
  const btn = document.getElementById('cb-' + id);
  if (btn) { btn.classList.add('added'); btn.innerHTML = '✓ Добавен'; btn.disabled = true; setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави в кошница'; btn.disabled = false; }, 1200); }
  (function showCartToast(prod) {
    var ct = document.getElementById('cartToast');
    if (!ct) { showToast('✓ ' + prod.name.substring(0, 32) + '… добавен!'); return; }
    document.getElementById('cartToastEmoji').textContent = prod.emoji || '🛒';
    document.getElementById('cartToastMsg').textContent = prod.name.substring(0, 36) + (prod.name.length > 36 ? '…' : '') + ' добавен!';
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
        <div style="font-size:22px;min-width:34px;text-align:center;">${r.emoji}</div>
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

// Social proof counter — random-ish but deterministic per day so it feels real
(function initCartSocialProof() {
  const sp = document.getElementById('cartSocialProof');
  const txt = document.getElementById('cartSpText');
  if (!sp || !txt) return;
  // Seed by day so number changes daily but stays stable per session
  const seed = Math.floor(Date.now() / 86400000);
  const n = 28 + (seed % 41); // 28–68
  txt.textContent = `${n} души поръчаха от нас днес`;
  sp.style.display = '';
})();
function updateCart() {
  const count = cart.reduce((s, x) => s + x.qty, 0), total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const badge = document.getElementById('cartBadge'); if (badge) badge.textContent = count;
  const cartTotalEl = document.getElementById('cartTotal'); if (cartTotalEl) cartTotalEl.textContent = fmtEur(total) + ' / ' + fmtBgn(total);
  // sync PDP mini-header cart badge
  const pdpB = document.getElementById('pdpMhdrCartBadge');
  if (pdpB) { pdpB.textContent = count; pdpB.style.display = count > 0 ? '' : 'none'; }
  // sync bottom nav badges (two nav bars exist — update all)
  document.querySelectorAll('#bnCartBadge, #bnCartBadge2').forEach(bnB => {
    bnB.textContent = count; bnB.classList.toggle('show', count > 0);
  });
  const body = document.getElementById('cartBody');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty-msg"><div class="ce-icon"><svg width="44" height="44" class="svg-ic" aria-hidden="true" style="opacity:.25"><use href="#ic-cart"/></svg></div><p>Кошницата е празна.<br>Добави продукти!</p></div>';
    // Return focus to cart icon button when cart becomes empty and panel is open
    const panel = document.getElementById('cartPanel');
    if (panel && panel.classList.contains('open')) { const cartBtn = document.querySelector('[onclick*="toggleCart"]') || document.querySelector('#cartIcon'); if (cartBtn) cartBtn.focus(); }
    return;
  }
  let html = cart.map(x => `<div class="cart-item-row"><div class="ci-emoji">${escHtml(x.emoji || '')}</div><div class="ci-details"><div class="ci-name">${escHtml(x.name || '')}</div><div class="ci-price">${fmtEur(x.price * x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price * x.qty)}</span></div><div class="ci-qty"><button type="button" class="qty-btn" onclick="changeQty(${x.id},-1)">−</button><span class="qty-num">${x.qty}</span><button type="button" class="qty-btn" onclick="changeQty(${x.id},1)">+</button></div></div><button type="button" class="ci-remove" onclick="removeFromCart(${x.id})">×</button></div>`).join('');
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
  // COD fee notice — always visible so no surprise at checkout
  html += `<div style="font-size:11px;color:var(--muted);padding:6px 10px;background:var(--bg2);border-radius:6px;margin-top:6px;">
    💳 Карта/превод — без такса &nbsp;|&nbsp; 📦 Наложен платеж — +0.77 €
  </div>`;
  // Promo code hint — show when no promo applied and subtotal ≥ 80 лв.
  if (!promoApplied && total >= Math.round(40 * EUR_RATE)) {
    html += `<div class="cart-promo-hint" onclick="handleCheckout()" title="Приложи при поръчка">
      🎁 Имаш промо код? <strong>MOSTCOMP10</strong> дава <strong>-10%</strong> от поръчката!
    </div>`;
  }
  // Recently viewed not in cart
  try {
    const rvIds = JSON.parse(localStorage.getItem('mc_rv') || '[]');
    const inCart = new Set(cart.map(x => x.id));
    const rvItems = rvIds.map(id => products.find(p => p.id === id)).filter(p => p && !inCart.has(p.id)).slice(0, 3);
    if (rvItems.length) {
      html += `<div class="cart-rv-section"><div class="cart-rv-title">Забрави ли нещо?</div><div class="cart-rv-list">${rvItems.map(p => `<div class="cart-rv-item"><div class="cart-rv-emoji">${escHtml(p.emoji || '')}</div><div class="cart-rv-info"><div class="cart-rv-name">${escHtml(p.name.length > 28 ? p.name.substring(0, 28) + '…' : p.name)}</div><div class="cart-rv-price">${fmtEur(p.price)}</div></div><button type="button" class="cart-rv-add" onclick="addToCart(${p.id})" title="Добави">+</button></div>`).join('')}</div></div>`;
    }
  } catch (e) { }
  body.innerHTML = html;
  // Sidebar upsell — show 2 products from cart categories not already in cart
  const upsellEl = document.getElementById('cartUpsell');
  if (upsellEl) {
    const inCart = new Set(cart.map(x => x.id));
    const cats = cart.map(x => x.cat);
    let upsellProds = products.filter(x => !inCart.has(x.id) && cats.includes(x.cat) && x.stock !== false).sort((a, b) => (b.rv || 0) - (a.rv || 0)).slice(0, 2);
    if (!upsellProds.length) upsellProds = products.filter(x => !inCart.has(x.id) && x.stock !== false).sort((a, b) => (b.rv || 0) - (a.rv || 0)).slice(0, 2);
    if (upsellProds.length) {
      upsellEl.style.display = '';
      upsellEl.innerHTML = `<div class="cart-upsell-title">⚡ Може да те заинтересува</div><div class="cart-upsell-items">${upsellProds.map(p => `<div class="cu-item"><div class="cu-emoji">${escHtml(p.emoji || '')}</div><div class="cu-info"><div class="cu-name">${escHtml(p.name.length > 30 ? p.name.substring(0, 30) + '…' : p.name)}</div><div class="cu-price">${fmtEur(p.price)}</div></div><button type="button" class="cu-add" onclick="addToCart(${p.id})" title="Добави в кошницата">+</button></div>`).join('')}</div>`;
    } else {
      upsellEl.style.display = 'none';
    }
  }
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
function toggleCart() { document.getElementById('cartOverlay').classList.toggle('open'); document.getElementById('cartPanel').classList.toggle('open'); }
// ===== CHECKOUT & THANK YOU =====
let ckDeliveryIdx = 0;
let ckDeliveryCosts = [5.99, 4.99, 0];
let ckDeliveryNames = ['Еконт', 'Еконт', 'Вземи от магазин'];
let ckPaymentType = 'card';
let promoApplied = false;

function handleCheckout() {
  if (cart.length === 0) { showToast('Добави продукти в кошницата!'); return; }
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
      if (sa.phone && !document.getElementById('ckPhone').value) document.getElementById('ckPhone').value = sa.phone;
      if (sa.city) document.getElementById('ckCity').value = sa.city;
      if (sa.addr) document.getElementById('ckAddr').value = sa.addr;
      if (sa.zip) document.getElementById('ckZip').value = sa.zip;
    }
  } catch (e) { }
  renderOrderSummary();
  document.getElementById('checkoutPage').classList.add('open');
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = 'hidden';
  showCheckoutStep(1);
  // Clear previous validation states
  document.querySelectorAll('#checkoutPage .ck-input').forEach(el => el.classList.remove('error', 'valid'));
  // Populate estimated delivery dates
  const fmt = d => d.toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' });
  const now = new Date();
  const workDay = (d, n) => { let c = new Date(d); let added = 0; while (added < n) { c.setDate(c.getDate() + 1); if (c.getDay() !== 0 && c.getDay() !== 6) added++; } return c; };
  const d0 = document.getElementById('delivDate0'); if (d0) d0.textContent = '· до ' + fmt(workDay(now, 2));
  const d1 = document.getElementById('delivDate1'); if (d1) d1.textContent = '· до ' + fmt(workDay(now, 3));
  const d2 = document.getElementById('delivDate2'); if (d2) d2.textContent = '· готово днес';
}

function closeCheckoutPage() {
  document.getElementById('checkoutPage').classList.remove('open');
  document.body.style.overflow = '';
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
    // Validate Econt office if Econt selected
    const officeEl = document.getElementById('ckEcontOffice');
    if (officeEl && !officeEl.classList.contains('is-hidden')) {
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
    ['ckCardNum', 'ckCardName', 'ckCardExp', 'ckCardCvv'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) { el.classList.add('error'); el.setAttribute('aria-invalid', 'true'); valid = false; }
      else { el.classList.remove('error'); el.setAttribute('aria-invalid', 'false'); }
    });
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
    // Save address for next order
    try {
      localStorage.setItem('mc_saved_addr', JSON.stringify({
        phone: document.getElementById('ckPhone').value,
        city: document.getElementById('ckCity').value,
        addr: document.getElementById('ckAddr').value,
        zip: document.getElementById('ckZip').value,
      }));
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
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch (e) { }
  const o = num ? orders.find(x => x.num === num) : orders[0];
  if (!o) { showToast('⚠️ Няма данни за поръчката'); return; }

  const subtotalNoVat = (o.subtotal / 1.2).toFixed(2);
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
      ${o.b2b ? `<strong>${o.b2b.firma || '—'}</strong><br>ЕИК: ${o.b2b.eik || '—'}<br>${o.b2b.vat ? 'ДДС №: ' + o.b2b.vat + '<br>' : ''}${o.b2b.mol ? 'МОЛ: ' + o.b2b.mol + '<br>' : ''}` : `<strong>${o.customer || '—'}</strong><br>`}
      ${o.addr ? o.addr + '<br>' : ''}
      ${o.city || ''}<br>
      тел.: ${o.phone || '—'}
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
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMobMenu() {
  document.getElementById('mobOverlay').classList.remove('open');
  document.getElementById('mobDrawer').classList.remove('open');
  document.body.style.overflow = '';
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

    const imgHtml = x.img
      ? `<img src="${x.img}" alt="${x.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="cp-item-emoji is-hidden">${x.emoji}</span>`
      : `<span class="cp-item-emoji">${x.emoji}</span>`;

    return `<div class="cp-card">
      <div class="cp-item-thumb">${imgHtml}</div>
      <div class="cp-item-info">
        <div class="cp-item-brand">${x.brand}</div>
        <div class="cp-item-name">${x.name}</div>
        <div class="cp-item-sku">${x.sku || ''}</div>
        <div class="cp-item-badges">${badgeHtml}</div>
      </div>
      <div class="cp-item-right">
        <div class="cp-item-prices">
          ${x.old ? `<div class="cp-item-old">${fmtEur(x.old)}</div>` : ''}
          <div class="cp-item-price">${fmtEur(x.price * x.qty)}</div>
          <div class="cp-item-bgn">${fmtBgn(x.price * x.qty)}</div>
        </div>
        <div class="cp-qty-wrap">
          <button class="cp-qty-btn" onclick="cpChangeQty(${x.id},-1)">−</button>
          <span class="cp-qty-val">${x.qty}</span>
          <button class="cp-qty-btn" onclick="cpChangeQty(${x.id},1)">+</button>
        </div>
        <button class="cp-remove-btn" onclick="cpRemoveItem(${x.id})" title="Премахни">×</button>
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
        <button class="cp-upsell-add" onclick="event.stopPropagation();cpAddUpsell(${p.id})">+ Добави</button>
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addToCart, removeFromCart, changeQty,
    applyPromo, renderOrderSummary, formatCardNum, formatExpiry,
    _resetCheckout: () => { ckDeliveryIdx = 0; ckPaymentType = 'card'; promoApplied = false; },
    _setDelivery: (idx) => { ckDeliveryIdx = idx; },
    _setPayment: (type) => { ckPaymentType = type; },
  };
}
