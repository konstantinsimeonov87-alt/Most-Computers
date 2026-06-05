// ===== BREADCRUMBS =====
// State: array of {label, action}  - action is a function or null for current
let _bcTrail = []; // [{label, fn}]

// BC_CAT_LABELS → вж. глобалния CAT_LABELS в currency.js
const BC_CAT_LABELS = CAT_LABELS;

function bcRender() {
  const inner = document.getElementById('bcInner');
  if (!inner) return;

  // Always start with Home
  const _homeIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>';
  const crumbs = [{ label: 'Начало', fn: () => { if (typeof closeProductPage === 'function') closeProductPage(); if (typeof closeCatPage === 'function') closeCatPage(); bcSet([]); } }, ..._bcTrail];

  window._bcFns = window._bcFns || {};
  const html = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep    = i > 0 ? '<span class="bc-sep" aria-hidden="true">›</span>' : '';
    const display = i === 0 ? 'Начало' : c.label;
    if (isLast) {
      return `${sep}<div class="bc-item current" aria-current="page"><span title="${c.label}">${c.label}</span></div>`;
    }
    window._bcFns[i] = c.fn;
    const href = i === 0 ? '/' : (c.url || '#');
    return `${sep}<div class="bc-item"><a href="${href}" onclick="event.preventDefault();if(window._bcFns[${i}])window._bcFns[${i}]()">${display}</a></div>`;
  }).join('');

  inner.innerHTML = html;

  // Mirror into PDP subheader breadcrumb
  const pdpBc = document.getElementById('pdpBcInner');
  if (pdpBc) pdpBc.innerHTML = html;

  // JSON-LD structured data
  const ldCrumbs = crumbs.map((c, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": c.label,
    "item": c.url || (i === 0 ? 'https://mostcomputers.bg/' : window.location.href.split('?')[0])
  }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": ldCrumbs
  };
  const ldEl = document.getElementById('bcJsonLd');
  if (ldEl) ldEl.textContent = JSON.stringify(ld, null, 2);
}

function bcSet(trail) {
  _bcTrail = trail;
  bcRender();
}

function bcPush(label, fn) {
  _bcTrail.push({ label, fn });
  bcRender();
}

function bcPopTo(idx) {
  _bcTrail = _bcTrail.slice(0, idx);
  bcRender();
}

// ── Hook into navigation events ──

// Category filter
function bcOnFilterCat(cat) {
  if (cat === 'all') {
    bcSet([]);
  } else {
    const label = BC_CAT_LABELS[cat] || cat;
    const url = `https://mostcomputers.bg/?cat=${cat}`;
    bcSet([{
      label,
      url,
      fn: () => { filterCat(cat); bcSet([{ label, url, fn: () => filterCat(cat) }]); }
    }]);
  }
}

// Product page open
// breadcrumb hooks are inlined in openProductPage and closeProductPage

// Search results
function bcOnSearch(query) {
  bcSet([{ label: `Търсене: „${query}"`, fn: null }]);
}

// Blog / Service / Delivery pages
function bcOnPage(label) {
  bcSet([{ label, fn: null }]);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  bcRender(); // renders just "Начало"
});

// ─── SIDEBAR ACTIVE STATE ───
function setSidebarActive(cat, subcat) {
  // Clear previous active
  document.querySelectorAll('.cat-item.active').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.cat-subcat-link.active').forEach(el => el.classList.remove('active'));

  if (!cat || cat === 'all') return;

  // Find the cat-item for this category
  const catItems = document.querySelectorAll('.sidebar-categories .cat-item');
  let targetItem = null;
  catItems.forEach(item => {
    const fn = item.getAttribute('onclick') || '';
    if (fn.includes(`'${cat}'`)) targetItem = item;
  });
  if (!targetItem) return;

  targetItem.classList.add('active');

  // Open accordion if not already open
  if (!targetItem.classList.contains('open')) {
    toggleSidebarCat(targetItem, cat);
  }

  // Mark active subcat link
  if (subcat && subcat !== 'all') {
    const subList = targetItem.nextElementSibling;
    if (subList && subList.classList.contains('cat-subcat-list')) {
      subList.querySelectorAll('.cat-subcat-link').forEach(link => {
        if ((link.getAttribute('onclick') || '').includes(`'${subcat}'`)) {
          link.classList.add('active');
        }
      });
    }
  }
}
// ───────────────────────────

// ─── SIDEBAR ACCORDION ───
function toggleSidebarCat(el, cat) {
  const isOpen = el.classList.contains('open');

  // Затвори всички отворени
  document.querySelectorAll('.sidebar-categories .cat-item.open').forEach(item => {
    item.classList.remove('open');
    const existing = item.nextElementSibling;
    if (existing && existing.classList.contains('cat-subcat-list')) existing.remove();
  });

  if (isOpen) return; // беше отворен - затвори само

  const subs = (typeof SUBCATS !== 'undefined' && SUBCATS[cat]) ? SUBCATS[cat] : [];
  if (!subs.length) {
    // Няма подкатегории - навигирай директно
    openCatPage(cat);
    return;
  }

  el.classList.add('open');

  // Strip emojis from label
  const cleanLabel = s => s.label.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();

  const list = document.createElement('div');
  list.className = 'cat-subcat-list';
  list.innerHTML = subs.map(s =>
    `<a href="/?cat=${cat}&sub=${s.id}" class="cat-subcat-link" onclick="event.preventDefault();openCatPage('${cat}','${s.id}')">${cleanLabel(s)}</a>`
  ).join('');

  el.insertAdjacentElement('afterend', list);
}
// ─────────────────────────

// ─── NAVBAR MEGA MENU ───
let _navMegaTimeout;

function navMegaShow() {
  clearTimeout(_navMegaTimeout);
  const menu = document.getElementById('navMegamenu');
  const trigger = document.getElementById('navCatTrigger');
  const arrow = document.getElementById('navCatArrow');
  if (!menu || !trigger) return;
  const rect = trigger.getBoundingClientRect();
  menu.style.top = (rect.bottom + 2) + 'px';
  menu.style.left = rect.left + 'px';
  menu.classList.add('open');
  if (arrow) arrow.style.transform = 'rotate(180deg)';
}

function navMegaHide(e) {
  _navMegaTimeout = setTimeout(() => {
    const menu = document.getElementById('navMegamenu');
    const arrow = document.getElementById('navCatArrow');
    if (menu) menu.classList.remove('open');
    if (arrow) arrow.style.transform = '';
  }, 120);
}
// ────────────────────────



// ===== ItemList schema for category pages =====
function injectCategoryItemList(cat) {
  let el = document.getElementById('category-jsonld');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'category-jsonld'; document.head.appendChild(el); }
  if (!cat || cat === 'all') { el.textContent = ''; return; }
  const list = (typeof getFilteredSorted === 'function')
    ? getFilteredSorted().slice(0, 20)
    : (typeof products !== 'undefined' ? products.filter(p => p.cat === cat).slice(0, 20) : []);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] + ' - Most Computers' : cat,
    "url": `https://mostcomputers.bg/?cat=${cat}`,
    "numberOfItems": list.length,
    "itemListElement": list.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://mostcomputers.bg/?product=${p.id}`,
      "name": p.name
    }))
  };
  el.textContent = JSON.stringify(schema);
}

// ===== 5. JSON-LD STRUCTURED DATA =====
function injectProductSchema(p) {
  let el = document.getElementById('product-jsonld');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'product-jsonld'; document.head.appendChild(el); }
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0] : (p.img || null);
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.name,
    "brand": { "@type": "Brand", "name": p.brand },
    "sku": p.sku,
    "gtin13": p.ean,
    "description": p.desc,
    ...(imgSrc ? { "image": [imgSrc] } : {}),
    "offers": {
      "@type": "Offer",
      "url": `${location.href.split('?')[0]}?product=${p.id}`,
      "priceCurrency": "BGN",
      "price": p.price,
      "priceValidUntil": priceValidUntil,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": p.stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Most Computers" }
    },
    ...(p.rv > 0 ? { "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating,
      "reviewCount": p.rv,
      "bestRating": 5,
      "worstRating": 1
    }} : {})
  };
  if (Array.isArray(p.reviews) && p.reviews.length > 0) {
    schema.review = p.reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": r.date,
      "reviewBody": r.text,
      "reviewRating": { "@type": "Rating", "ratingValue": r.stars, "bestRating": 5, "worstRating": 1 }
    }));
  }
  el.textContent = JSON.stringify(schema);
}

// JSON-LD injected via mc:productopen event (fired in openProductModal)
document.addEventListener('mc:productopen', e => {
  const p = products.find(x => x.id === e.detail);
  if (!p) return;
  injectProductSchema(p);
  document.title = p.name + ' | Most Computers';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} - ${p.brand} | Цена: ${(p.price/EUR_RATE).toFixed(2)} €. Купи онлайн от Most Computers.`;
    metaDesc.setAttribute('content', descText);
  }
  // Update Open Graph meta tags for social sharing
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', p.name + ' | Most Computers');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 200) + (p.desc.length > 200 ? '…' : '')
      : `${p.name} - ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €. Купи онлайн от Most Computers.`;
    ogDesc.setAttribute('content', descText);
  }
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) {
    const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0]
      : (p.img || 'https://mostcomputers.bg/og-default.jpg');
    ogImg.setAttribute('content', imgSrc);
  }
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://mostcomputers.bg/?product=${p.id}`);
  const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0]
    : (p.img || 'https://mostcomputers.bg/og-default.jpg');
  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.setAttribute('content', imgSrc);
  // og:type → product
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'product');
  // og:image:alt
  const ogImgAlt = document.querySelector('meta[property="og:image:alt"]');
  if (ogImgAlt) ogImgAlt.setAttribute('content', p.name + ' - Most Computers');
  // Twitter title + description
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', p.name + ' | Most Computers');
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) {
    const d = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} - ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €.`;
    twDesc.setAttribute('content', d);
  }
  // Canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://mostcomputers.bg/?product=${p.id}`);
});

// ===== 6. SITEMAP GENERATOR =====
function generateSitemap() {
  const base = 'https://mostcomputers.bg';
  const today = new Date().toISOString().split('T')[0];
  const staticPages = [
    { url: '/', priority: '1.0', freq: 'daily' },
    { url: '/?cat=laptops', priority: '0.9', freq: 'weekly' },
    { url: '/?cat=desktops', priority: '0.9', freq: 'weekly' },
    { url: '/?cat=components', priority: '0.8', freq: 'weekly' },
    { url: '/?cat=peripherals', priority: '0.8', freq: 'weekly' },
    { url: '/?cat=audio',      priority: '0.8', freq: 'weekly' },
    { url: '/?cat=cameras',    priority: '0.7', freq: 'weekly' },
    { url: '/?cat=network', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=storage', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=accessories', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=printers', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=ups',      priority: '0.7', freq: 'weekly' },
  ];
  const productPages = products.map(p => ({
    url: `/?product=${p.id}`,
    priority: '0.8',
    freq: 'monthly'
  }));
  const allPages = [...staticPages, ...productPages];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allPages.map(pg => `  <url>\n    <loc>${base}${pg.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${pg.freq}</changefreq>\n    <priority>${pg.priority}</priority>\n  </url>`).join('\n') +
    `\n</urlset>`;

  // Download as file
  const blob = new Blob([xml], { type: 'application/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sitemap.xml';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('✓ sitemap.xml изтеглен успешно!');
}

// Init URL params on load
document.addEventListener('DOMContentLoaded', readURLParams);



// ===== EMAIL PROTECTION =====
function epClick(el) {
  const u = el.dataset.u, d = el.dataset.d;
  const addr = u + '@' + d;
  // Activate mailto on the parent <a> if present, otherwise open directly
  const link = el.closest('a') || el;
  link.href = 'mailto:' + addr;
}
// Also handle direct span clicks
document.addEventListener('click', e => {
  const ep = e.target.closest('.ep');
  if (ep) {
    e.preventDefault();
    const addr = ep.dataset.u + '@' + ep.dataset.d;
    location.href = 'mailto:' + addr;
  }
});



// ===== 📲 SHARE PRODUCT (Web Share API) =====
function shareProduct() {
  const p = products.find(x => x.id === modalProductId);
  if (!p) return;
  const url = location.origin + location.pathname + '?product=' + p.id;
  const title = p.name + ' - Most Computers';
  const text = p.name + ' от ' + p.brand + ' - ' + (p.price / EUR_RATE).toFixed(2) + ' €';

  if (navigator.share) {
    navigator.share({ title, text, url })
      .catch(() => {}); // user cancelled - silent
  } else {
    // Fallback: показваме popup с линка
    document.getElementById('shareUrl').textContent = url;
    document.getElementById('shareFallback').classList.add('open');
    // Auto-close след 8 сек
    clearTimeout(window._shareTimer);
    window._shareTimer = setTimeout(closeShareFallback, 8000);
  }
}

function copyShareUrl() {
  const url = document.getElementById('shareUrl').textContent;
  navigator.clipboard.writeText(url).then(() => {
    const el = document.getElementById('shareUrl');
    const orig = el.textContent;
    el.textContent = '✓ Копирано!';
    setTimeout(() => { el.textContent = orig; }, 1800);
  }).catch(() => {
    // Fallback за по-стари браузъри
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✓ Линкът е копиран!');
    closeShareFallback();
  });
}

function closeShareFallback() {
  document.getElementById('shareFallback').classList.remove('open');
}

// Close share fallback on backdrop click
document.addEventListener('click', e => {
  const fb = document.getElementById('shareFallback');
  if (fb && fb.classList.contains('open') && !fb.contains(e.target)) {
    closeShareFallback();
  }
});


// ═══════════════════════════════════════
// CATEGORY META
// ═══════════════════════════════════════
const CAT_META = {
  phones:     { emoji:'📱', icon:'ic-phone',      label:'Телефони и таблети',   sub:'Смартфони, Таблети', badge:null },
  laptops:    { emoji:'💻', icon:'ic-laptop',     label:'Лаптопи',              sub:'За работа, Гейминг, Ултрабуци', badge:null },
  desktops:   { emoji:'🖥', icon:'ic-desktop',    label:'Настолни компютри',    sub:'Офис, Workstation, All-in-One', badge:null },
  gaming:     { emoji:'🎮', icon:'ic-gamepad',    label:'Гейминг',              sub:'Gaming лаптопи, PC, Мишки, Клавиатури', badge:'hot' },
  monitors:   { emoji:'🖥', icon:'ic-monitor',    label:'Монитори',             sub:'Gaming 144Hz+, 4K, OLED, UltraWide', badge:null },
  components: { emoji:'⚙️', icon:'ic-cpu',        label:'Компоненти',           sub:'CPU, GPU, RAM, SSD/HDD, Дъна', badge:null },
  peripherals:{ emoji:'🖱', icon:'ic-mouse',      label:'Периферия',            sub:'Клавиатури, Мишки, Уеб камери', badge:null },
  cameras:    { emoji:'📹', icon:'ic-camera',     label:'Камери',               sub:'За закрито, За открито, POE камери', badge:null },
  audio:      { emoji:'🎧', icon:'ic-headphones', label:'Аудио и слушалки',     sub:'Gaming, Bluetooth, Тапи, Офис headset', badge:null },
  network:    { emoji:'📡', icon:'ic-wifi',       label:'Мрежово оборудване',   sub:'Рутери, Суичове, Mesh, AP', badge:null },
  storage:    { emoji:'💾', icon:'ic-storage',    label:'Памет и съхранение',    sub:'USB флашки, microSD, NAS, Външни дискове', badge:null },
  accessories:{ emoji:'🎒', icon:'ic-mouse',      label:'Аксесоари',            sub:'Чанти, Кабели, Smart Home, TV', badge:null },
  printers:   { emoji:'🖨', icon:'ic-printer',    label:'Принтери',             sub:'Мастиленоструйни, MegaTank, Лазерни', badge:null },
  ups:        { emoji:'⚡', icon:'ic-bolt',       label:'UPS устройства',       sub:'Домашни, Офис, Онлайн / Чиста синусоида', badge:null },
  consumables:{ emoji:'🖨️', icon:'ic-printer',    label:'Консумативи',          sub:'Тонери, Мастила, Фото хартия', badge:null },
  new:        { emoji:'🆕', icon:'ic-star',       label:'Нови продукти',        sub:'Пресни пристигания', badge:'NEW' },
  sale:       { emoji:'%',  icon:'ic-tag',        label:'Намаления',            sub:'До -60% на избрани продукти', badge:'SALE' },
  promo:      { emoji:'🏷', icon:'ic-tag',        label:'Промоции',             sub:'Специални оферти от партньорски марки', badge:'PROMO' },
};
const HP_CAT_ORDER = ['laptops','desktops','components','monitors','peripherals','audio','cameras','network','storage','accessories'];

// ═══════════════════════════════════════
// RENDER HOMEPAGE CATEGORY CARDS (kept for fallback)
// ═══════════════════════════════════════
function renderHpCats() {
  const grid = document.getElementById('hpCatsGrid');
  if (!grid) return;
  grid.innerHTML = HP_CAT_ORDER.map(cat => {
    const m = CAT_META[cat];
    const count = products.filter(p => p.cat === cat).length;
    return `
      <div class="hp-cat-card" onclick="openCatPage('${cat}')" role="button" tabindex="0" aria-label="Разгледай ${m.label}" onkeydown="if(event.key==='Enter'||event.key===' ')openCatPage('${cat}')">
        ${m.badge ? `<span class="hp-cat-badge">${m.badge}</span>` : ''}
        <span class="hp-cat-icon"><svg width="36" height="36" aria-hidden="true"><use href="#${m.icon}"/></svg></span>
        <div class="hp-cat-name">${m.label}</div>
        <div class="hp-cat-count">${count > 0 ? count + ' продукта' : ''}</div>
      </div>`;
  }).join('');
}

// ═══════════════════════════════════════
// RENDER HOMEPAGE SUBCATEGORY STRIP
// ═══════════════════════════════════════
const HP_SUBCATS = [
  { cat:'laptops',    id:'gaming',      label:'Gaming лаптопи',        icon:'🎮', trending:true  },
  { cat:'components', id:'gpu',         label:'Видеокарти',            icon:'🎴', trending:true  },
  { cat:'monitors',   id:'gaming_mon',   label:'Gaming монитори',       icon:'🎮', trending:true  },
  { cat:'monitors',   id:'oled_mon',    label:'OLED & QLED монитори',  icon:'✨', trending:true  },
  { cat:'gaming',     id:'gaming_pc_s', label:'Gaming PC',             icon:'🕹'                },
  { cat:'components', id:'cpu',         label:'Процесори',             icon:'⚡'                },
  { cat:'laptops',    id:'ultrabook',   label:'Ултрабуци',             icon:'💼'                },
  { cat:'peripherals',id:'keyboard',    label:'Клавиатури',            icon:'⌨️'                },
  { cat:'network',    id:'router',      label:'Рутери',                icon:'📡'                },
  { cat:'network',    id:'mesh',        label:'Mesh Wi-Fi системи',    icon:'🕸️'               },
  { cat:'network',    id:'adapter',     label:'Wi-Fi адаптери',        icon:'🔌'                },
  { cat:'storage',    id:'nas',         label:'NAS и сървъри',         icon:'💾'                },
  { cat:'storage',    id:'usb_flash',   label:'USB флашки',             icon:'💾'                },
  { cat:'storage',    id:'microsd',     label:'microSD карти',          icon:'📱'                },
  { cat:'laptops',    id:'budget',      label:'Бюджетни лаптопи',      icon:'💰'                },
  { cat:'peripherals',id:'mouse',       label:'Геймърски мишки',       icon:'🖱'                 },
  { cat:'peripherals',id:'webcam',      label:'Уеб камери',            icon:'📸'                 },
  { cat:'components', id:'ram',         label:'RAM памет',             icon:'🧠'                },
  { cat:'components', id:'ssd_hdd',     label:'SSD дискове',           icon:'💿'                },
  { cat:'desktops',   id:'workstation', label:'Работни станции',       icon:'🖥'                },
  { cat:'audio',      id:'hp_gaming',    label:'Gaming слушалки',       icon:'🎮'                },
  { cat:'audio',      id:'hp_wireless',  label:'Bluetooth слушалки',    icon:'📡'                },
  { cat:'audio',      id:'hp_inear',     label:'Тапи (In-ear)',         icon:'🎧'                },
  { cat:'cameras',    id:'cam_indoor',   label:'Камери за закрито',     icon:'🏠'                },
  { cat:'cameras',    id:'cam_outdoor',  label:'Outdoor камери',        icon:'🌧'                },
  { cat:'cameras',    id:'cam_poe',      label:'POE камери',            icon:'🔌'                },
  { cat:'network',    id:'switch',      label:'Суичове',               icon:'🔀'                },
  { cat:'accessories',id:'hub',         label:'USB хъбове',            icon:'🔌'                },
  { cat:'components', id:'psu',         label:'Захранвания',           icon:'🔋'                },
  { cat:'laptops',    id:'business',    label:'Бизнес лаптопи',        icon:'💼'                },
  { cat:'printers',   id:'megatank',     label:'MegaTank принтери',     icon:'♾️'               },
  { cat:'printers',   id:'inkjet_aio',  label:'Мастиленоструйни МФУ',  icon:'🖨'                },
  { cat:'components', id:'case_cooling',label:'Кутии и охлаждане',     icon:'❄️'               },
  { cat:'ups',        id:'ups_home',    label:'Домашни UPS',            icon:'🏠'                },
  { cat:'ups',        id:'ups_server',  label:'Онлайн UPS (синусоида)', icon:'⚡'                },
  { cat:'consumables',id:'laser_toner', label:'Лазерни тонери',         icon:'🖨️'               },
  { cat:'consumables',id:'inkjet',      label:'Мастиленоструйни касети', icon:'🖨️'               },
];

const HP_SUBCATS_VISIBLE = 10;

function renderHpSubcatsStrip() {
  const wrap = document.getElementById('hpCatsGrid');
  if (!wrap) return;
  const pills = HP_SUBCATS.map((s, i) => {
    const count = (typeof matchesSubcat === 'function')
      ? products.filter(p => p.cat === s.cat && matchesSubcat(p, s.id)).length
      : products.filter(p => p.cat === s.cat).length;
    const hidden = i >= HP_SUBCATS_VISIBLE ? ' hp-subcat-hidden' : '';
    return `<button type="button" class="hp-subcat-pill${hidden}" data-cattype="${s.cat}" onclick="openCatPage('${s.cat}');applySubcatById('${s.id}')" aria-label="${s.label}">
      ${s.trending ? '<span class="hp-subcat-trend">🔥</span>' : ''}
      <span class="hp-subcat-pill-icon">${s.icon}</span>
      <span class="hp-subcat-pill-label">${s.label}</span>
      ${count > 0 ? `<span class="hp-subcat-pill-count">${count}</span>` : ''}
    </button>`;
  }).join('');
  const remaining = HP_SUBCATS.length - HP_SUBCATS_VISIBLE;
  const moreBtn = remaining > 0
    ? `<button type="button" class="hp-subcat-more" onclick="hpShowMoreSubcats(this)">+ ${remaining} още ▾</button>`
    : '';
  wrap.innerHTML = pills + moreBtn;
}

function hpShowMoreSubcats(btn) {
  document.querySelectorAll('#hpCatsGrid .hp-subcat-hidden').forEach(el => el.classList.remove('hp-subcat-hidden'));
  btn.remove();
}

// ═══════════════════════════════════════
// CATEGORY PAGE STATE
// ═══════════════════════════════════════
let cpCat = 'all';
let cpSort = 'bestseller';
let cpPriceMin = 0, cpPriceMax = 9999;
let _cpMaxEur = 9999;
let cpBrands = new Set();
let cpRating = 0;
let cpSaleOnly = false, cpNewOnly = false, cpStockOnly = false;
let cpSpecFilters = {};
let cpSubcat = 'all';
let _cpSubcatBrands = null; // known brand values for current subcat (to power "Other" filter)

let _catPageScrollY = 0;
function openCatPage(cat, preSubcat, fromURL = false) {
  _catPageScrollY = window.scrollY || document.documentElement.scrollTop;
  cpCat = cat;
  cpSort = 'bestseller';
  cpPriceMin = 0; cpPriceMax = _cpMaxEur;
  cpBrands = new Set();
  cpRating = 0; cpSaleOnly = false; cpNewOnly = false; cpStockOnly = false;
  cpSpecFilters = {};

  cpSubcat = preSubcat || 'all';

  const m = CAT_META[cat] || { emoji:'🗂', label: cat, sub:'' };
  const cpEmoji = document.getElementById('cpEmoji');
  const cpTitle = document.getElementById('cpTitle');
  const cpSubtitle = document.getElementById('cpSubtitle');
  if (cpEmoji) cpEmoji.innerHTML = `<svg width="28" height="28" class="svg-ic cp-cat-icon" aria-hidden="true"><use href="#${m.icon||'ic-tag'}"/></svg>`;
  if (cpTitle) cpTitle.textContent = m.label;
  if (cpSubtitle) cpSubtitle.textContent = m.sub;

  cpUpdateCatBreadcrumb(cat, preSubcat);

  // Build sidebar HTML
  buildCpSidebar(cat);
  // Build subcat bar
  cpRenderSubcatBar(cat);

  // Apply pre-selected subcat if provided (populates spec filters + highlights pill)
  if (preSubcat && preSubcat !== 'all') {
    const activePill = document.querySelector(`#cpSubcatBar .subcat-pill[onclick*="'${preSubcat}'"]`);
    cpApplySubcat(preSubcat, activePill);
  }

  // Update SEO
  const _catDesc = m.label + ' - ' + m.sub + '. Купи онлайн от Most Computers.';
  setPageMeta(m.label + ' | Most Computers', _catDesc);
  const _subSuffix = (preSubcat && preSubcat !== 'all') ? '&sub=' + encodeURIComponent(preSubcat) : '';
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://mostcomputers.bg/?cat=${cat}${_subSuffix}`);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://mostcomputers.bg/?cat=${cat}${_subSuffix}`);

  // Open page first so grid element is visible, then render
  document.getElementById('catPage').classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  try{history.pushState({ catPage: cat, subcat: preSubcat || 'all' }, '', '?cat=' + cat + _subSuffix);}catch(e){}
  // Defer render so overflow/class paint commits before heavy grid work
  requestAnimationFrame(() => {
    if (fromURL) cpApplyURLFilters();
    else cpUpdateSlider(true); // initialize slider track/label (catPage is now open)
    cpRenderGrid();
    setSidebarActive(cat, preSubcat);
  });
}

function closeCatPage() {
  // Close any open product page or modal first
  const pdp = document.getElementById('pdpBackdrop');
  if (pdp && pdp.classList.contains('open')) pdp.classList.remove('open');
  const _sb = document.getElementById('pdpStickyBar');
  if (_sb) _sb.classList.remove('visible');
  const modal = document.getElementById('productModalBackdrop');
  if (modal && modal.classList.contains('open')) modal.classList.remove('open');
  document.getElementById('catPage').classList.remove('open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  restorePageMeta();
  // Restore Open Graph extras
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | Лаптопи, Телефони, Телевизори - От 1990 г.');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', 'Most Computers - специализиран магазин за електроника от 1990 г. Смартфони, лаптопи, телевизори от Apple, Samsung, Sony. Безплатна доставка над 100 €.');
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', 'https://mostcomputers.bg/og-default.jpg');
  const ogImgAlt = document.querySelector('meta[property="og:image:alt"]');
  if (ogImgAlt) ogImgAlt.setAttribute('content', 'Most Computers - магазин за електроника от 1990 г.');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://mostcomputers.bg/');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', 'Most Computers | Електроника от 1990 г.');
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', 'Лаптопи, Телефони, Телевизори, Аудио и аксесоари от Apple, Samsung, Sony. Безплатна доставка над 100 €.');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/');
  try{history.pushState({}, '', location.pathname);}catch(e){}
  setSidebarActive(null);
  requestAnimationFrame(() => window.scrollTo(0, _catPageScrollY));
}

// Back button support
window.addEventListener('popstate', e => {
  if (e.state?.catPage) {
    const pg = document.getElementById('catPage');
    if (pg && !pg.classList.contains('open')) {
      const _sub = e.state.subcat && e.state.subcat !== 'all' ? e.state.subcat : null;
      openCatPage(e.state.catPage, _sub);
    }
  } else if (e.state?.page === 'blog') {
    if (e.state.post) {
      if (typeof openBlogPost === 'function') openBlogPost(e.state.post);
    } else {
      const postView = document.getElementById('blogPostView');
      if (postView && postView.style.display !== 'none') {
        if (typeof closeBlogPost === 'function') closeBlogPost();
      } else {
        // Only reopen blog list if product page is NOT open
        const pdpOpen = document.getElementById('pdpBackdrop')?.classList.contains('open');
        if (!pdpOpen && typeof openBlogPage === 'function') openBlogPage();
      }
    }
  } else if (e.state?.page === 'careers') {
    if (typeof openCareersPage === 'function') openCareersPage();
  } else {
    // Navigated back to homepage - close all overlays and clear breadcrumb
    const pg = document.getElementById('catPage');
    if (pg) pg.classList.remove('open');
    const blogPg = document.getElementById('blogPage');
    if (blogPg) blogPg.classList.remove('open');
    const pdp = document.getElementById('pdpBackdrop');
    if (pdp) pdp.classList.remove('open');
    const modal = document.getElementById('productModalBackdrop');
    if (modal) modal.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    const _ld = document.getElementById('_blogPostLD');
    if (_ld) _ld.remove();
    if (typeof bcSet === 'function') bcSet([]);
  }
});

// ═══════════════════════════════════════
// BUILD CAT PAGE SIDEBAR
// ═══════════════════════════════════════
function buildCpSidebar(cat) {
  const sb = document.getElementById('cpSidebar');
  if (!sb) return;
  const _si = (d,s='') => `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:5px;flex-shrink:0">${d}</svg>`;

  const _promoProds = (typeof promoProducts !== 'undefined') ? promoProducts : [];
  const catProds = cat === 'promo' ? _promoProds :
    cat === 'all' ? products : products.filter(p =>
      normalizeCat(p.cat) === cat || (cat === 'new' && p.badge === 'new') || (cat === 'sale' && p.badge === 'sale'));
  const allBrands = [...new Set(catProds.map(p => p.brand).filter(Boolean))].sort();
  const brands = allBrands.filter(b => catProds.some(p => p.brand === b));
  const maxPrice = catProds.length ? Math.max(...catProds.map(p => toEur(p.price))) : 2000;
  const maxPriceRound = Math.ceil(maxPrice / 100) * 100;
  _cpMaxEur = maxPriceRound;
  cpPriceMax = maxPriceRound;

  // ── Price block ──
  let html = `
    <div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
      <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">${_si('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>')}Ценови диапазон</div>
      <div class="sidebar-price-slider">
        <div class="price-slider-header">
          <span style="font-size:11px;color:var(--muted);font-weight:600;">Диапазон (€):</span>
          <span class="price-slider-vals" id="cpPriceVals">0 € - ${maxPriceRound} €</span>
        </div>
        <div class="sb-slider-wrap">
          <div class="sb-slider-track"><div class="sb-slider-range" id="cpSliderRange"></div></div>
          <input type="range" class="sb-slider" id="cpPriceMinSlider" min="0" max="${maxPriceRound}" value="0" step="5" oninput="cpUpdateSlider()">
          <input type="range" class="sb-slider" id="cpPriceMaxSlider" min="0" max="${maxPriceRound}" value="${maxPriceRound}" step="5" oninput="cpUpdateSlider()">
        </div>
      </div>
    </div>`;

  // ── Availability toggles ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
    <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">${_si('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>')}Наличност</div>
    <div class="stock-filter-list">
      <div class="stock-toggle-row">
        <span class="text-13">${_si('<polyline points="20 6 9 17 4 12"/>')}Само налични</span>
        <label class="stock-toggle"><input type="checkbox" id="cpStockToggle" onchange="cpApplyFilters()"><span class="stock-slider-toggle"></span></label>
      </div>
      <div class="stock-toggle-row" style="margin-top:8px;">
        <span class="text-13">${_si('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>')}Само намалени</span>
        <label class="stock-toggle"><input type="checkbox" id="cpSaleToggle" onchange="cpApplyFilters()"><span class="stock-slider-toggle"></span></label>
      </div>
      <div class="stock-toggle-row" style="margin-top:8px;">
        <span class="text-13">${_si('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>')}Само нови</span>
        <label class="stock-toggle"><input type="checkbox" id="cpNewToggle" onchange="cpApplyFilters()"><span class="stock-slider-toggle"></span></label>
      </div>
    </div>
  </div>`;

  // ── Spec filters ──
  const specs = CAT_SPEC_FILTERS[cat];
  if (specs && specs.length) {
    html += `<div id="cpCatSpecWrap">`;
    specs.forEach(spec => {
      html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
        <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${spec.label}</div>
        <div style="display:flex;flex-direction:column;gap:4px;">`;
      spec.values.forEach(val => {
        html += `<label class="brand-filter-item" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" data-spec-key="${spec.key}" value="${val}" onchange="cpSpecChange(this)">
          <span style="flex:1;font-size:13px;">${val}</span>
        </label>`;
      });
      html += `</div></div>`;
    });
    html += `</div>`;
  }

  // ── Brands (collapsed by default) ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);">
    <div onclick="cpToggleBrands(this)" style="display:flex;align-items:center;justify-content:space-between;padding:16px;cursor:pointer;user-select:none;">
      <div class="sfb-title" id="cpBrandTitle" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin:0;">${_si('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>')}Производител</div>
      <span id="cpBrandArrow" style="color:var(--muted);font-size:13px;transition:transform .2s;transform:rotate(180deg);">▾</span>
    </div>
    <div id="cpBrandBody" style="display:block;padding:0 16px 14px;">
      <input id="cpBrandSearch" placeholder="Търси марка…" oninput="cpFilterBrandList(this.value)" autocomplete="off" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);box-sizing:border-box;margin-bottom:8px;">
      <div class="brand-filter-list" id="cpBrandList" style="max-height:220px;overflow-y:auto;">`;
  brands.forEach(b => {
    const cnt = catProds.filter(p => p.brand === b).length;
    html += `<label class="brand-filter-item">
      <input type="checkbox" value="${b}" onchange="cpBrandChange(this)">
      <span style="flex:1;">${b}</span>
      <span class="brand-count">${cnt}</span>
    </label>`;
  });
  html += `</div></div></div>`;

  // ── Rating ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
    <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">${_si('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>')}Рейтинг</div>
    <div class="rating-filter-list">
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="0" checked onchange="cpRatingChange(this)"><span>Всички</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="4.5" onchange="cpRatingChange(this)"><span>★★★★★ 4.5+</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="4" onchange="cpRatingChange(this)"><span>★★★★☆ 4.0+</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="3" onchange="cpRatingChange(this)"><span>★★★☆☆ 3.0+</span></label>
    </div>
  </div>`;


  // ── Subcat-specific spec filters (populated by cpApplySubcat) ──
  html += `<div id="cpSubcatSpecBlock"></div>`;

  // ── Reset button ──
  html += `<div style="padding:12px 16px 16px;">
    <button type="button" onclick="cpResetFilters()" style="width:100%;background:none;border:1px solid var(--border);border-radius:8px;padding:9px;font-size:12px;font-weight:700;color:var(--text2);cursor:pointer;font-family:'Outfit',sans-serif;transition:all .18s;" onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">
      ✕ Изчисти всички филтри
    </button>
  </div>`;

  sb.innerHTML = html;
  cpUpdateSlider(true);
}

function cpUpdateSlider(skipRender) {
  if (!document.getElementById('catPage')?.classList.contains('open')) return;
  const minEl = document.getElementById('cpPriceMinSlider');
  const maxEl = document.getElementById('cpPriceMaxSlider');
  const range = document.getElementById('cpSliderRange');
  const vals  = document.getElementById('cpPriceVals');
  if (!minEl || !maxEl) return;
  let lo = parseFloat(minEl.value), hi = parseFloat(maxEl.value);
  if (lo > hi) { [lo, hi] = [hi, lo]; }
  cpPriceMin = lo; cpPriceMax = hi;
  const max = parseFloat(maxEl.max);
  if (range) { range.style.left = (lo/max*100)+'%'; range.style.right = ((1-hi/max)*100)+'%'; }
  if (vals) vals.textContent = lo + ' € - ' + hi + ' €';
  if (!skipRender) cpRenderGrid();
}

function cpBrandChange(cb) {
  if (cb.checked) cpBrands.add(cb.value);
  else cpBrands.delete(cb.value);
  cpRenderGrid();
}

function cpRatingChange(rb) {
  cpRating = parseFloat(rb.value);
  cpRenderGrid();
}

function cpApplyFilters() {
  if (!document.getElementById('catPage')?.classList.contains('open')) return;
  cpStockOnly = document.getElementById('cpStockToggle')?.checked || false;
  cpSaleOnly = document.getElementById('cpSaleToggle')?.checked || false;
  cpNewOnly  = document.getElementById('cpNewToggle')?.checked || false;
  cpRenderGrid();
}

function cpApplySort(val) {
  cpSort = val;
  cpRenderGrid();
}

function cpSpecChange(cb) {
  const key = cb.dataset.specKey;
  const val = cb.value;
  if (!cpSpecFilters[key]) cpSpecFilters[key] = new Set();
  if (cb.checked) cpSpecFilters[key].add(val);
  else {
    cpSpecFilters[key].delete(val);
    if (!cpSpecFilters[key].size) delete cpSpecFilters[key];
  }
  cpRenderGrid();
}
const cpSubcatSpecChange = cpSpecChange;

function cpToggleBrands(header) {
  const body = document.getElementById('cpBrandBody');
  const arrow = document.getElementById('cpBrandArrow');
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arrow) arrow.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
}

function cpFilterBrandList(q) {
  const items = document.querySelectorAll('#cpBrandList .brand-filter-item');
  const s = q.toLowerCase().trim();
  items.forEach(item => {
    const name = item.querySelector('span')?.textContent.toLowerCase() || '';
    item.style.display = (!s || name.includes(s)) ? '' : 'none';
  });
}

function cpResetFilters() {
  cpPriceMin = 0;
  cpSpecFilters = {};
  document.querySelectorAll('#cpSidebar input[data-spec-key]').forEach(cb => cb.checked = false);
  const maxEl = document.getElementById('cpPriceMaxSlider');
  cpPriceMax = maxEl ? parseFloat(maxEl.max) : _cpMaxEur;
  cpBrands = new Set();
  cpRating = 0; cpSaleOnly = false; cpNewOnly = false;
  if (document.getElementById('cpPriceMinSlider')) document.getElementById('cpPriceMinSlider').value = 0;
  if (maxEl) maxEl.value = cpPriceMax;
  document.querySelectorAll('#cpBrandList input[type=checkbox]').forEach(c => c.checked = false);
  const r0 = document.querySelector('input[name="cpRating"][value="0"]');
  if (r0) r0.checked = true;
  const sk = document.getElementById('cpStockToggle'); if (sk) sk.checked = false;
  const st = document.getElementById('cpSaleToggle'); if (st) st.checked = false;
  const nt = document.getElementById('cpNewToggle'); if (nt) nt.checked = false;
  cpSubcat = 'all';
  cpUpdateSlider();
  cpRenderGrid();
  cpRenderSubcatBar(cpCat);
}

// ═══════════════════════════════════════
// SUBCAT BAR IN CAT PAGE
// ═══════════════════════════════════════
function cpRenderSubcatBar(cat) {
  const bar = document.getElementById('cpSubcatBar');
  if (!bar) return;
  const subs = typeof SUBCATS !== 'undefined' ? SUBCATS[cat] : null;
  if (!subs || !subs.length) { bar.innerHTML = ''; bar.style.display = 'none'; return; }
  const catProds = (typeof products !== 'undefined' ? products : []).filter(p => normalizeCat(p.cat) === cat);
  const activeSubs = subs.filter(s => catProds.some(p => matchesSubcat(p, s.id)));
  if (!activeSubs.length) { bar.innerHTML = ''; bar.style.display = 'none'; return; }
  bar.style.display = '';
  bar.innerHTML =
    `<button type="button" class="subcat-pill active" onclick="cpApplySubcat('all',this)">Всички</button>` +
    activeSubs.map(s =>
      `<button type="button" class="subcat-pill" onclick="cpApplySubcat('${s.id}',this)">${s.label}</button>`
    ).join('');
}

const _BC_HOME_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>';

function cpUpdateCatBreadcrumb(cat, subcat) {
  const bc = document.getElementById('catBreadcrumb');
  if (!bc) return;
  const m = CAT_META[cat] || { label: cat };
  const hasSubcat = subcat && subcat !== 'all';

  // Намери label на подкатегорията без емотиконки
  let subcatLabel = '';
  if (hasSubcat && typeof SUBCATS !== 'undefined' && SUBCATS[cat]) {
    const found = SUBCATS[cat].find(s => s.id === subcat);
    if (found) subcatLabel = found.label.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
  }
  if (!subcatLabel && hasSubcat) subcatLabel = subcat;

  let html = '<ol itemscope itemtype="https://schema.org/BreadcrumbList">';

  // Ниво 1: Начало
  html += `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
    <a href="/" class="bc-home-link" itemprop="item" onclick="closeCatPage();return false;" aria-label="Начало">
      Начало
      <meta itemprop="name" content="Начало">
    </a>
    <meta itemprop="position" content="1">
  </li>`;

  html += '<span class="bc-sep" aria-hidden="true">›</span>';

  if (hasSubcat) {
    // Ниво 2: Категория - кликаема, изчиства подкатегорията
    html += `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/?cat=${cat}" class="bc-cat-link" itemprop="item" onclick="event.preventDefault();cpApplySubcat('all',null)">
        <span itemprop="name">${m.label.replace(/</g,'&lt;')}</span>
      </a>
      <meta itemprop="position" content="2">
    </li>`;
    html += '<span class="bc-sep" aria-hidden="true">›</span>';
    // Ниво 3: Подкатегория - текущата страница, не е линк
    html += `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span class="bc-current" itemprop="name">${subcatLabel}</span>
      <meta itemprop="position" content="3">
    </li>`;
  } else {
    // Ниво 2: Категория - текущата страница, не е линк
    html += `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span class="bc-current" itemprop="name">${m.label.replace(/</g,'&lt;')}</span>
      <meta itemprop="position" content="2">
    </li>`;
  }

  html += '</ol>';
  bc.innerHTML = html;
}

function cpApplySubcat(id, btn) {
  cpSubcat = id;
  document.querySelectorAll('#cpSubcatBar .subcat-pill').forEach(p => p.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else if (id === 'all') {
    // Called programmatically (e.g. from breadcrumb) - activate the "Всички" pill
    const allPill = document.querySelector('#cpSubcatBar .subcat-pill:first-child');
    if (allPill) allPill.classList.add('active');
  }
  // Hide generic cat spec filters when a specific subcat is active
  const cpCatSpecWrap = document.getElementById('cpCatSpecWrap');
  if (cpCatSpecWrap) cpCatSpecWrap.style.display = (!id || id === 'all') ? '' : 'none';
  // Update brand filter title + list for subcat-specific manufacturers
  const _subcatMfr = {
    cpu: ['Intel','AMD'],
    gpu: ['Palit','Gainward','Gigabyte','Sapphire','MSI','ASUS','ASRock','TD'],
    motherboard: ['ASUS','MSI','Gigabyte','ASRock'],
    ram: [
      {label:'Team',    value:'TeamGroup'},
      {label:'ADATA',   value:'ADATA'},
      {label:'Kingston',value:'Kingston'},
      {label:'KingSpec',value:'KingSpec'},
      {label:'Crucial', value:'Crucial'},
      {label:'Samsung', value:'Samsung'},
      {label:'Other',   value:'__other__'},
    ],
    ssd: [
      {label:'Team',    value:'TeamGroup'},
      {label:'ADATA',   value:'ADATA'},
      {label:'Kingston',value:'Kingston'},
      {label:'KingSpec',value:'KingSpec'},
      {label:'MSI',     value:'MSI'},
      {label:'Emtec',   value:'Emtec'},
      {label:'Other',   value:'__other__'},
    ],
    hdd: ['Seagate'],
    ssd_hdd: [
      {label:'Team',    value:'TeamGroup'},
      {label:'ADATA',   value:'ADATA'},
      {label:'Kingston',value:'Kingston'},
      {label:'KingSpec',value:'KingSpec'},
      {label:'MSI',     value:'MSI'},
      {label:'Emtec',   value:'Emtec'},
      {label:'Seagate', value:'Seagate'},
      {label:'Other',   value:'__other__'},
    ],
    psu: [
      {label:'Cooler Master',   value:'Cooler Master'},
      {label:'Fortron',         value:'Fortron'},
      {label:'Seasonic',        value:'Seasonic'},
      {label:'Fractal Design',  value:'Fractal Design'},
      {label:'MSI',             value:'MSI'},
      {label:'Gigabyte',        value:'Gigabyte'},
      {label:'Other',           value:'__other__'},
    ],
    laptops: ['Acer','ASUS','Lenovo','MSI'],
  };
  const brandTitle = document.getElementById('cpBrandTitle');
  const brandList  = document.getElementById('cpBrandList');
  const brandSearch = document.getElementById('cpBrandSearch');
  const brandBody  = document.getElementById('cpBrandBody');
  if (brandTitle && brandList) {
    const mfr = id && id !== 'all' ? _subcatMfr[id] : null;
    if (mfr) {
      brandTitle.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:5px;flex-shrink:0"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>Производител';
      if (brandSearch) brandSearch.style.display = 'none';
      // Resolve label/value for each entry (supports plain string or {label,value} object)
      const mfrEntries = mfr.map(b => typeof b === 'object' ? b : {label: b, value: b});
      const knownValues = mfrEntries.map(e => e.value).filter(v => v !== '__other__');
      _cpSubcatBrands = knownValues;
      const subcatProds = products.filter(p => p.subcat === id || (normalizeCat(p.cat) === cpCat && (!p.subcat || p.subcat === id)));
      brandList.innerHTML = mfrEntries.map(({label, value}) => {
        const cnt = value === '__other__'
          ? subcatProds.filter(p => !knownValues.includes(p.brand)).length
          : subcatProds.filter(p => p.brand === value).length;
        return `<label class="brand-filter-item"><input type="checkbox" value="${value}" onchange="cpBrandChange(this)"><span style="flex:1;">${label}</span><span class="brand-count">${cnt}</span></label>`;
      }).join('');
      if (brandBody) brandBody.style.display = '';
    } else {
      brandTitle.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:5px;flex-shrink:0"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>Производител';
      if (brandSearch) brandSearch.style.display = '';
      if (brandBody) brandBody.style.display = 'none';
      // Restore full list - rebuild from cpCat products
      const catProds = products.filter(p => normalizeCat(p.cat) === cpCat);
      const allBrands = [...new Set(catProds.map(p => p.brand))].sort();
      brandList.innerHTML = allBrands.map(b => {
        const cnt = catProds.filter(p => p.brand === b).length;
        return `<label class="brand-filter-item"><input type="checkbox" value="${b}" onchange="cpBrandChange(this)"><span style="flex:1;">${b}</span><span class="brand-count">${cnt}</span></label>`;
      }).join('');
    }
  }
  // Render subcat-specific spec filters into sidebar
  const cpSubcatSpecBlock = document.getElementById('cpSubcatSpecBlock');
  if (cpSubcatSpecBlock) {
    const subcatSpecs = (id && id !== 'all' && typeof SUBCAT_SPEC_FILTERS !== 'undefined') ? SUBCAT_SPEC_FILTERS[id] : null;
    if (subcatSpecs && subcatSpecs.length) {
      cpSubcatSpecBlock.innerHTML = subcatSpecs.map(spec => `
        <div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
          <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${spec.label}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            ${spec.values.map(val => `<label class="brand-filter-item" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" data-spec-key="${spec.key}" value="${val}" onchange="cpSubcatSpecChange(this)">
              <span style="flex:1;font-size:13px;">${val}</span>
            </label>`).join('')}
          </div>
        </div>`).join('');
    } else {
      cpSubcatSpecBlock.innerHTML = '';
    }
  }
  cpRenderGrid();
  cpUpdateCatBreadcrumb(cpCat, id);
  setSidebarActive(cpCat, id);
}

function cpUpdateURL() {
  if (!document.getElementById('catPage')?.classList.contains('open')) return;
  const params = new URLSearchParams();
  params.set('cat', cpCat);
  if (cpSubcat && cpSubcat !== 'all') params.set('sub', cpSubcat);
  if (cpSort && cpSort !== 'bestseller') params.set('sort', cpSort);
  if (cpBrands.size > 0) params.set('brand', [...cpBrands].join(','));
  if (cpPriceMin > 0) params.set('priceMin', cpPriceMin);
  if (cpPriceMax < _cpMaxEur) params.set('priceMax', cpPriceMax);
  if (cpSaleOnly) params.set('sale', '1');
  if (cpNewOnly) params.set('new', '1');
  if (cpStockOnly) params.set('stock', '1');
  if (cpRating > 0) params.set('rating', cpRating);
  const qs = '?' + params.toString();
  const fullUrl = 'https://mostcomputers.bg/' + qs;
  try { history.replaceState({ catPage: cpCat, subcat: cpSubcat }, '', qs); } catch(e) {}
  const can = document.querySelector('link[rel="canonical"]');
  if (can) can.setAttribute('href', fullUrl);
  const og = document.querySelector('meta[property="og:url"]');
  if (og) og.setAttribute('content', fullUrl);
}

function cpApplyURLFilters() {
  const params = new URLSearchParams(location.search);
  const _VALID_SORTS_CP = new Set(['bestseller','price-asc','price-desc','rating','discount','new']);
  const sort = params.get('sort');
  if (sort && _VALID_SORTS_CP.has(sort)) {
    cpSort = sort;
    const sortSel = document.getElementById('cpSortSelect');
    if (sortSel) sortSel.value = cpSort;
  }
  const brand = params.get('brand');
  if (brand) {
    brand.split(',').forEach(b => { if (b && b.length <= 60) cpBrands.add(b); });
    document.querySelectorAll('#cpBrandList input[type=checkbox]').forEach(cb => {
      if (cpBrands.has(cb.value)) cb.checked = true;
    });
  }
  const priceMin = parseFloat(params.get('priceMin'));
  if (!isNaN(priceMin) && priceMin > 0) {
    cpPriceMin = priceMin;
    const el = document.getElementById('cpPriceMinSlider');
    if (el) el.value = cpPriceMin;
  }
  const priceMax = parseFloat(params.get('priceMax'));
  if (!isNaN(priceMax) && priceMax < _cpMaxEur) {
    cpPriceMax = priceMax;
    const el = document.getElementById('cpPriceMaxSlider');
    if (el) el.value = cpPriceMax;
  }
  if (params.get('sale') === '1') { cpSaleOnly = true; const el = document.getElementById('cpSaleToggle'); if (el) el.checked = true; }
  if (params.get('new') === '1') { cpNewOnly = true; const el = document.getElementById('cpNewToggle'); if (el) el.checked = true; }
  if (params.get('stock') === '1') { cpStockOnly = true; const el = document.getElementById('cpStockToggle'); if (el) el.checked = true; }
  const rating = parseFloat(params.get('rating'));
  if (!isNaN(rating) && rating > 0) {
    cpRating = rating;
    const rEl = document.querySelector(`input[name="cpRating"][value="${rating}"]`);
    if (rEl) rEl.checked = true;
  }
  cpUpdateSlider(true);
}

// ═══════════════════════════════════════
// RENDER CAT PAGE GRID
// ═══════════════════════════════════════
function cpGetFiltered() {
  let list = products.slice();
  // category filter
  if (cpCat === 'new') { list = list.slice().sort((a,b) => b.id - a.id); }
  else if (cpCat === 'sale') list = list.filter(p => p.badge === 'sale' || p.badge === 'Намаление' || !!p.old);
  else if (cpCat === 'promo') list = (typeof promoProducts !== 'undefined' ? [...promoProducts] : []);
  else if (cpCat !== 'all') list = list.filter(p => normalizeCat(p.cat) === cpCat);
  // subcat filter
  if (cpSubcat && cpSubcat !== 'all' && typeof matchesSubcat === 'function')
    list = list.filter(p => matchesSubcat(p, cpSubcat));
  // price
  list = list.filter(p => { const e = toEur(p.price); return e >= cpPriceMin && e <= cpPriceMax; });
  // brands
  if (cpBrands.size > 0) list = list.filter(p => {
    if (cpBrands.has(p.brand)) return true;
    if (cpBrands.has('__other__') && _cpSubcatBrands && !_cpSubcatBrands.includes(p.brand)) return true;
    return false;
  });
  // rating
  if (cpRating > 0) list = list.filter(p => p.rating >= cpRating);
  // toggles
  if (cpStockOnly) list = list.filter(p => p.stock !== false);
  if (cpSaleOnly || cpNewOnly) {
    list = list.filter(p =>
      (cpSaleOnly && (p.badge === 'sale' || !!p.old)) ||
      (cpNewOnly  && p.badge === 'new')
    );
  }
  // Spec filters
  const _типToSubcat = {'процесор':'cpu','видеокарта':'gpu','дънна платка':'motherboard','ram':'ram','ssd nvme':'ssd','hdd':'hdd','захранване':'psu','кутия':'case','охлаждане':'cooling'};
  Object.entries(cpSpecFilters).forEach(([key, vals]) => {
    if (!vals || !vals.size) return;
    // 'Тип' filter for components maps label → subcat
    if (key === 'Тип') {
      const subcats = [...vals].map(v => _типToSubcat[v.toLowerCase()]).filter(Boolean);
      if (subcats.length) { list = list.filter(p => subcats.includes(p.subcat)); return; }
    }
    // Numeric/computed CPU filters (keys prefixed with _)
    if (key === '_tdp') {
      list = list.filter(p => {
        const tdpStr = (Object.entries(p.specs || {}).find(([k]) => k.toLowerCase() === 'tdp')?.[1] || '').toString();
        const m = tdpStr.match(/(\d+)/);
        if (!m) return false;
        const tdp = parseInt(m[1]);
        return [...vals].some(v => {
          if (v === 'До 65 W') return tdp <= 65;
          if (v === '66 – 100 W') return tdp >= 66 && tdp <= 100;
          if (v === 'Над 101 W') return tdp > 100;
          return false;
        });
      });
      return;
    }
    if (key === '_freq') {
      list = list.filter(p => {
        const freqStr = (Object.entries(p.specs || {}).find(([k]) => k.toLowerCase() === 'честота')?.[1] || '').toString();
        const m = freqStr.match(/(\d+(?:\.\d+)?)\s*ghz/i);
        if (!m) return false;
        const freq = parseFloat(m[1]);
        return [...vals].some(v => {
          if (v === 'До 1.5 GHz') return freq <= 1.5;
          if (v === '1.6 – 2.5 GHz') return freq >= 1.6 && freq <= 2.5;
          if (v === '2.6 – 3.5 GHz') return freq >= 2.6 && freq <= 3.5;
          if (v === 'Над 3.6 GHz') return freq > 3.6;
          return false;
        });
      });
      return;
    }
    if (key === '_cores') {
      list = list.filter(p => {
        const coreStr = (Object.entries(p.specs || {}).find(([k]) => k.toLowerCase() === 'ядра')?.[1] || '').toString();
        const m = coreStr.match(/^(\d+)/);
        if (!m) return false;
        const cores = parseInt(m[1]);
        return [...vals].some(v => v === '32+' ? cores >= 32 : parseInt(v) === cores);
      });
      return;
    }
    if (key === '_igpu') {
      list = list.filter(p => {
        const igpuVal = (Object.entries(p.specs || {}).find(([k]) => k.toLowerCase().includes('интегрирана'))?.[1] || '').toString().trim();
        const has = igpuVal.length > 0 && igpuVal !== '-';
        return [...vals].some(v => v === 'С iGPU' ? has : !has);
      });
      return;
    }
    // Motherboard computed filters
    if (key === '_mb_ram_type') {
      list = list.filter(p => {
        const mem = (Object.entries(p.specs||{}).find(([k]) => k === 'Памет')?.[1] || '').toString();
        return [...vals].some(v => mem.includes(v));
      });
      return;
    }
    if (key === '_mb_ram_slots') {
      list = list.filter(p => {
        const mem = (Object.entries(p.specs||{}).find(([k]) => k === 'Памет')?.[1] || '').toString();
        return [...vals].some(v => mem.startsWith(v + '×'));
      });
      return;
    }
    if (key === '_mb_outputs') {
      list = list.filter(p => {
        const out = (Object.entries(p.specs||{}).find(([k]) => k === 'Изходи')?.[1] || '').toString();
        return [...vals].some(v => {
          if (v === 'DisplayPort') return /DP|DisplayPort/i.test(out);
          if (v === 'DVI') return /DVI/i.test(out);
          return out.toUpperCase().includes(v.toUpperCase());
        });
      });
      return;
    }
    if (key === '_mb_connect') {
      list = list.filter(p => {
        const sp = p.specs || {};
        const wifi = (Object.entries(sp).find(([k]) => k === 'WiFi')?.[1] || '').toString().trim();
        const bt   = (Object.entries(sp).find(([k]) => k === 'Bluetooth')?.[1] || '').toString().trim();
        const lan  = (Object.entries(sp).find(([k]) => k === 'LAN')?.[1] || '').toString();
        return [...vals].some(v => {
          if (v === 'Wi-Fi')     return wifi.length > 0;
          if (v === 'Bluetooth') return bt.length > 0;
          if (v === '2.5G LAN')  return lan.includes('2.5');
          return false;
        });
      });
      return;
    }
    // GPU computed filters
    if (key === '_gpu_chip') {
      list = list.filter(p => {
        const gpu = (Object.entries(p.specs||{}).find(([k]) => k === 'GPU')?.[1] || p.name + ' ' + (p.desc||'')).toString().toUpperCase();
        return [...vals].some(v => {
          if (v === 'NVIDIA') return /NVIDIA|GEFORCE|RTX|GTX/i.test(gpu);
          if (v === 'AMD')    return /AMD|RADEON|RX\s/i.test(gpu);
          if (v === 'Intel')  return /INTEL|ARC/i.test(gpu);
          return false;
        });
      });
      return;
    }
    if (key === '_gpu_vram') {
      list = list.filter(p => {
        const mem = (Object.entries(p.specs||{}).find(([k]) => k === 'Памет')?.[1] || '').toString();
        return [...vals].some(v => mem.startsWith(v));
      });
      return;
    }
    if (key === '_gpu_memtype') {
      list = list.filter(p => {
        const mem = (Object.entries(p.specs||{}).find(([k]) => k === 'Памет')?.[1] || '').toString();
        return [...vals].some(v => mem.toUpperCase().includes(v));
      });
      return;
    }
    if (key === '_gpu_outputs') {
      list = list.filter(p => {
        const out = (Object.entries(p.specs||{}).find(([k]) => k === 'Изходи')?.[1] || '').toString();
        return [...vals].some(v => {
          if (v === 'DisplayPort') return /\bDP\b|DisplayPort/i.test(out);
          if (v === 'DVI') return /DVI/i.test(out);
          return out.toUpperCase().includes(v.toUpperCase());
        });
      });
      return;
    }
    if (key === '_ram_cap') {
      list = list.filter(p => {
        const cap = (p.specs && p.specs['Капацитет']) || '';
        return [...vals].some(v => cap === v || cap.startsWith(v + ' '));
      });
      return;
    }
    if (key === '_ram_kit') {
      list = list.filter(p => {
        const cap = (p.specs && p.specs['Капацитет']) || '';
        return [...vals].some(v => v === 'Kit (комплект)' && /[×x×]/.test(cap));
      });
      return;
    }
    if (key === '_storage_cap') {
      // Normalize capacity to GB for comparison (handles "1 TB" ≈ "1000 GB" ≈ "1024 GB")
      const toGB = s => {
        const m = (s || '').match(/(\d+(?:\.\d+)?)\s*(GB|TB)/i);
        if (!m) return null;
        return m[2].toUpperCase() === 'TB' ? parseFloat(m[1]) * 1000 : parseFloat(m[1]);
      };
      list = list.filter(p => {
        const capRaw = (p.specs && (p.specs['Капацитет'] || p.specs['Обем'])) || '';
        const capGB = toGB(capRaw);
        return [...vals].some(v => {
          const vGB = toGB(v);
          if (capGB === null || vGB === null) return capRaw.toLowerCase().includes(v.toLowerCase());
          return Math.abs(capGB - vGB) / vGB < 0.25;
        });
      });
      return;
    }
    if (key === '_hdd_rpm') {
      list = list.filter(p => {
        const rpm = ((p.specs && p.specs['RPM']) || '').replace(/[,.\s]/g, '').replace(/rpm/i, '');
        return [...vals].some(v => rpm === v.replace(/,/g, ''));
      });
      return;
    }
    if (key === '_hdd_cache') {
      list = list.filter(p => {
        const cache = ((p.specs && p.specs['Кеш']) || '').replace(/\s/g, '').toUpperCase();
        return [...vals].some(v => {
          const n = v.replace(/\s/g, '').toUpperCase();
          return cache.startsWith(n.split('MB')[0] + 'MB') || cache.startsWith(n.replace('MB','') + 'MB');
        });
      });
      return;
    }
    if (key === '_psu_watt') {
      list = list.filter(p => {
        const w = parseInt(((p.specs && p.specs['Мощност']) || '').replace(/\D/g, '')) || 0;
        return [...vals].some(v => {
          if (v === 'До 500 W')      return w > 0 && w <= 500;
          if (v === '501 – 749 W')   return w >= 501 && w <= 749;
          if (v === '750 – 999 W')   return w >= 750 && w <= 999;
          if (v === 'Над 1000 W')    return w >= 1000;
          return false;
        });
      });
      return;
    }
    if (key === '_psu_80plus') {
      list = list.filter(p => {
        const eff = ((p.specs && p.specs['Ефективност']) || '').replace('80+', '80 Plus').replace('80 Plus ', '80 Plus ');
        return [...vals].some(v => eff.toLowerCase().includes(v.toLowerCase().replace('80 plus', '').trim()) && eff.toLowerCase().includes('80'));
      });
      return;
    }
    if (key === '_psu_form') {
      list = list.filter(p => {
        const ff = ((p.specs && p.specs['Формфактор']) || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'ATX 3.1') return ff.includes('3.1') || ff.includes('atx12v 3.1') || ff.includes('atx12v v3.1');
          if (v === 'ATX 3.0') return ff.includes('3.0') || ff.includes('atx 3.0') || ff.includes('v3.0');
          if (v === 'SFX / ITX') return ff.includes('sfx') || ff.includes('itx') || ff.includes('micro atx');
          if (v === 'ATX') return ff.includes('atx') && !ff.includes('3.0') && !ff.includes('3.1') && !ff.includes('sfx') && !ff.includes('itx');
          return false;
        });
      });
      return;
    }
    if (key === '_psu_modular') {
      list = list.filter(p => {
        const mod = ((p.specs && p.specs['Модулно']) || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'Модулно')  return mod === 'да' || mod === 'yes' || mod === 'full' || mod === 'full modular';
          if (v === 'Фиксирано') return !mod || mod === 'не' || mod === 'no';
          return false;
        });
      });
      return;
    }
    if (key === '_psu_fan') {
      list = list.filter(p => {
        const fan = ((p.specs && p.specs['Вентилатор']) || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'Без вентилатор') return fan.includes('fanless') || fan.includes('без');
          const mm = v.replace(' мм', '').trim();
          return fan.includes(mm + 'mm') || fan.includes(mm + ' mm');
        });
      });
      return;
    }
    // Desktop computed filters
    if (key === '_desktop_cpu') {
      list = list.filter(p => {
        const cpu = ((p.specs || {})['Процесор'] || '').replace(/[®™©]/g, ' ').toLowerCase();
        if (!cpu) return false;
        return [...vals].some(v => {
          if (v === 'Core i3')      return /\bi3[-\s\d]|core\s+i3|core\s+3\s+\d|with intel i3/i.test(cpu);
          if (v === 'Core i5')      return /\bi5[-\s\d]|core\s+i5|core\s+5\s+\d|with intel i5/i.test(cpu);
          if (v === 'Core i7')      return /\bi7[-\s\d]|core\s+i7|core\s+7\s+\d|with intel i7/i.test(cpu);
          if (v === 'Core i9')      return /\bi9[-\s\d]|core\s+i9/i.test(cpu);
          if (v === 'Core Ultra 5') return /ultra\s*5[\s\d]/i.test(cpu);
          if (v === 'Core Ultra 7') return /ultra\s*7[\s\d]/i.test(cpu);
          if (v === 'Core Ultra 9') return /ultra\s*9[\s\d]/i.test(cpu);
          if (v === 'Ryzen 5')      return /ryzen\s*5[\s\d]/i.test(cpu);
          if (v === 'Ryzen 7')      return /ryzen\s*7[\s\d]/i.test(cpu);
          if (v === 'Ryzen 9')      return /ryzen\s*9[\s\d]/i.test(cpu);
          return cpu.includes(v.toLowerCase());
        });
      });
      return;
    }
    if (key === '_phone_brand') {
      list = list.filter(p => [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase()));
      return;
    }
    if (key === '_desktop_brand') {
      list = list.filter(p => [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase()));
      return;
    }
    if (key === '_desktop_ram') {
      list = list.filter(p => {
        const raw = ((p.specs || {}).RAM || '').replace(/\s/g, '');
        const gb = parseInt(raw);
        return !isNaN(gb) && [...vals].some(v => parseInt(v) === gb);
      });
      return;
    }
    if (key === '_desktop_ssd') {
      list = list.filter(p => {
        const ssd = ((p.specs || {}).SSD || '').trim().toUpperCase().replace(/\s/g, '');
        return [...vals].some(v => {
          const vl = v.toUpperCase().replace(/\s/g, '');
          if (vl.endsWith('TB')) {
            const tb = parseFloat(vl);
            if (ssd.endsWith('TB')) return Math.abs(parseFloat(ssd) - tb) < 0.1;
            if (ssd.endsWith('GB')) return Math.abs(parseFloat(ssd) / 1000 - tb) < 0.15;
          }
          if (vl.endsWith('GB')) {
            const gb2 = parseInt(vl);
            if (ssd.endsWith('GB')) return parseInt(ssd) === gb2;
            if (ssd.endsWith('TB')) return Math.abs(parseFloat(ssd) * 1000 - gb2) < gb2 * 0.25;
          }
          return false;
        });
      });
      return;
    }
    if (key === '_desktop_gpu') {
      list = list.filter(p => {
        const gpu = ((p.specs || {}).GPU || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'RTX 50') return /rtx.{0,3}50\d\d/i.test(gpu);
          if (v === 'RTX 40') return /rtx.{0,3}40\d\d/i.test(gpu);
          if (v === 'Интегрирана') return /intel.*uhd|intel.*iris|amd\s*radeon.*graphics|integrated|uma/i.test(gpu);
          return gpu.includes(v.toLowerCase());
        });
      });
      return;
    }
    if (key === '_desktop_os') {
      list = list.filter(p => {
        const os = ((p.specs || {}).ОС || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'Windows 11') return os.includes('windows 11') || os.includes('windows® 11');
          if (v === 'Без OS') return !os || os === 'none' || os === 'n/a' || os.includes('free dos') || os.includes('freedos');
          return os.includes(v.toLowerCase());
        });
      });
      return;
    }
    // Laptop computed filters
    if (key === '_laptop_brand') {
      list = list.filter(p => [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase()));
      return;
    }
    if (key === '_laptop_cpu') {
      list = list.filter(p => {
        const cpu = ((p.specs && p.specs['Процесор']) || p.name || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'Core i3') return /core\s*(™\s*)?i3|\bi3-\d/i.test(cpu);
          if (v === 'Core i5') return /core\s*(™\s*)?i5|\bi5-\d|core\s+5\s+\d/i.test(cpu);
          if (v === 'Core i7') return /core\s*(™\s*)?i7|\bi7-\d|core\s+7\s+\d/i.test(cpu);
          if (v === 'Core i9') return /core\s*(™\s*)?i9|\bi9-\d/i.test(cpu);
          if (v === 'Core Ultra 5') return /ultra\s*(™\s*)?5/i.test(cpu);
          if (v === 'Core Ultra 7') return /ultra\s*(™\s*)?7/i.test(cpu);
          if (v === 'Core Ultra 9') return /ultra\s*(™\s*)?9/i.test(cpu);
          if (v === 'Ryzen 5') return /ryzen\s*(™\s*)?5/i.test(cpu);
          if (v === 'Ryzen 7') return /ryzen\s*(™\s*)?7/i.test(cpu);
          if (v === 'Ryzen 9') return /ryzen\s*(™\s*)?9/i.test(cpu);
          if (v === 'AMD Athlon') return /athlon/i.test(cpu);
          return cpu.includes(v.toLowerCase());
        });
      });
      return;
    }
    if (key === '_laptop_ram') {
      list = list.filter(p => {
        const ram = ((p.specs && p.specs['RAM']) || '').replace(/\s/g, '').toUpperCase();
        const gb = parseInt(ram);
        return !isNaN(gb) && [...vals].some(v => parseInt(v) === gb);
      });
      return;
    }
    if (key === '_laptop_ssd') {
      list = list.filter(p => {
        const ssd = ((p.specs && p.specs['SSD']) || '').trim().toUpperCase().replace(/\s/g, '');
        return [...vals].some(v => {
          const vl = v.toUpperCase().replace(/\s/g, '');
          if (vl.endsWith('TB')) {
            const tb = parseFloat(vl);
            if (ssd.endsWith('TB')) return Math.abs(parseFloat(ssd) - tb) < 0.1;
            if (ssd.endsWith('GB')) return Math.abs(parseFloat(ssd) / 1000 - tb) < 0.15;
          }
          if (vl.endsWith('GB')) {
            const gb2 = parseInt(vl);
            if (ssd.endsWith('GB')) return parseInt(ssd) === gb2;
            if (ssd.endsWith('TB')) return Math.abs(parseFloat(ssd) * 1000 - gb2) < gb2 * 0.25;
          }
          return false;
        });
      });
      return;
    }
    if (key === '_laptop_screen') {
      list = list.filter(p => {
        const scr = ((p.specs && p.specs['Екран']) || '').toLowerCase();
        return [...vals].some(v => {
          const d = v.replace('"', '');
          return scr.includes(d + '"') || scr.includes(d + '″') || scr.includes(d + "'") || new RegExp(d.replace('.', '\\.') + '[^\\d]').test(scr);
        });
      });
      return;
    }
    if (key === '_laptop_display') {
      list = list.filter(p => {
        const scr = ((p.specs && p.specs['Екран']) || '').toLowerCase();
        return [...vals].some(v => scr.includes(v.toLowerCase()));
      });
      return;
    }
    if (key === '_laptop_gpu') {
      list = list.filter(p => {
        const gpu = ((p.specs && p.specs['GPU']) || (p.specs && p.specs['Видеокарта']) || p.name || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'RTX 50') return /rtx.{0,3}50\d\d/i.test(gpu);
          if (v === 'RTX 40') return /rtx.{0,3}40\d\d/i.test(gpu);
          if (v === 'RTX 30') return /rtx\s*30\d\d/i.test(gpu);
          if (v === 'GTX') return /gtx/i.test(gpu);
          if (v === 'AMD Radeon RX') return /radeon\s*rx/i.test(gpu);
          if (v === 'Интегрирана') return /iris\s*xe/i.test(gpu) || /uhd\s*\d/i.test(gpu) || /radeon\s*graphics/i.test(gpu) || /integrated/i.test(gpu) || gpu.includes('интегрирана');
          return gpu.includes(v.toLowerCase());
        });
      });
      return;
    }
    if (key === '_laptop_os') {
      list = list.filter(p => {
        const os = ((p.specs && p.specs['ОС']) || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'Windows 11') return os.includes('windows 11');
          if (v === 'Free DOS / Linux') return os.includes('free dos') || os.includes('freedos') || os.includes('linux') || os.trim() === '';
          return os.includes(v.toLowerCase());
        });
      });
      return;
    }
    if (key === '_laptop_weight') {
      list = list.filter(p => {
        const wt = ((p.specs && p.specs['Тегло']) || '').replace(/\s/g, '').replace(',', '.');
        const kg = parseFloat(wt);
        return !isNaN(kg) && [...vals].some(v => {
          if (v === 'До 1.5 кг') return kg <= 1.5;
          if (v === '1.5 – 2 кг') return kg > 1.5 && kg <= 2.0;
          if (v === 'Над 2 кг') return kg > 2.0;
          return false;
        });
      });
      return;
    }
    if (key === '_laptop_hz') {
      list = list.filter(p => {
        const scr = ((p.specs && p.specs['Екран']) || '').replace(/\s/g, '').toLowerCase();
        const m = scr.match(/(\d+)hz/i);
        const hz = m ? parseInt(m[1]) : 0;
        return [...vals].some(v => {
          if (v === '60 Hz') return hz === 0 || hz === 60;
          if (v === '120 Hz') return hz >= 120 && hz < 140;
          if (v === '144 Hz') return hz >= 140 && hz < 160;
          if (v === '165+ Hz') return hz >= 165;
          return false;
        });
      });
      return;
    }
    if (key === '_monitor_brand') {
      list = list.filter(p => [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase()));
      return;
    }
    if (key === '_monitor_panel') {
      list = list.filter(p => {
        const panel = ((p.specs || {}).Панел || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'IPS')  return /\bips\b/i.test(panel);
          if (v === 'VA')   return /\bva\b/i.test(panel);
          if (v === 'OLED') return /oled/i.test(panel);
          if (v === 'TN')   return /\btn\b/i.test(panel);
          if (v === 'QLED') return /qled/i.test(panel);
          return false;
        });
      });
      return;
    }
    if (key === '_monitor_hz') {
      list = list.filter(p => {
        const raw = ((p.specs || {}).Честота || '').replace(/\s/g, '');
        const hz = parseInt(raw);
        return !isNaN(hz) && [...vals].some(v => parseInt(v) === hz);
      });
      return;
    }
    if (key === '_monitor_res') {
      list = list.filter(p => {
        const r = ((p.specs || {}).Резолюция || '').toLowerCase();
        return [...vals].some(v => {
          if (v === 'FHD 1920×1080' || v === 'Full HD') return /1920.{0,3}1080|full\s*hd/i.test(r);
          if (v === 'QHD 2560×1440') return /2560.{0,3}1440/i.test(r);
          if (v === '4K 3840×2160'  || v === '4K UHD') return /3840.{0,3}2160|4k\s*uhd/i.test(r);
          if (v === 'WUXGA 1920×1200') return /1920.{0,3}1200/i.test(r);
          if (v === 'UltraWide') return /3440.{0,3}1440/i.test(r);
          if (v === 'QLED') return /qled/i.test(r);
          return false;
        });
      });
      return;
    }
    if (key === '_monitor_size') {
      list = list.filter(p => {
        const raw = ((p.specs || {}).Размер || '').replace(/[^\d.,]/g, '').replace(',', '.');
        const inch = parseFloat(raw);
        return !isNaN(inch) && [...vals].some(v => {
          if (v === 'До 19"')   return inch <= 19;
          if (v === '21"–23"')  return inch > 19  && inch <= 23;
          if (v === '23"–25"')  return inch > 23  && inch <= 25;
          if (v === '25"–27"')  return inch > 25  && inch <= 27;
          if (v === '27"–29"')  return inch > 27  && inch <= 29;
          if (v === 'Над 29"')  return inch > 29;
          if (v === '40"+')     return inch >= 40;
          const n = parseFloat(v);
          return !isNaN(n) && Math.abs(inch - n) < 0.6;
        });
      });
      return;
    }
    if (key === '_monitor_gaming') {
      list = list.filter(p => {
        const specs = p.specs || {};
        return [...vals].some(v => {
          if (v === 'FreeSync') return /freesync/i.test(specs.Sync || '');
          if (v === 'G-Sync')   return /g.?sync/i.test(specs.Sync || '');
          if (v === 'HDR')      return specs.HDR === 'Да';
          if (v === 'Curved')   return !!(specs.Curved);
          return false;
        });
      });
      return;
    }
    if (key === '_monitor_interface') {
      list = list.filter(p => {
        const specs = p.specs || {};
        return [...vals].some(v => {
          if (v === 'HDMI')        return specs.HDMI === 'Да';
          if (v === 'DisplayPort') return specs.DP   === 'Да';
          if (v === 'USB-C')       return specs.USBC === 'Да';
          return false;
        });
      });
      return;
    }
    if (key === '_monitor_stand') {
      list = list.filter(p => {
        const specs = p.specs || {};
        return [...vals].some(v => {
          if (v === 'Pivot')  return specs.Pivot  === 'Да';
          if (v === 'Swivel') return specs.Swivel === 'Да';
          return false;
        });
      });
      return;
    }
    if (key === '_hp_brand') {
      list = list.filter(p => [...vals].some(v => (p.brand || '').toLowerCase() === v.toLowerCase()));
      return;
    }
    list = list.filter(p => {
      const _specs = p.specs || {};
      const sv = _specs[key] || _specs[Object.keys(_specs).find(k => k.toLowerCase() === key.toLowerCase()) || ''] || '';
      if (sv) return [...vals].some(v => sv.toString().toLowerCase().includes(v.toLowerCase()));
      // Fallback: search through all spec values + name + desc (handles Cyrillic keys)
      const allText = (p.name + ' ' + (p.desc||'') + ' ' + Object.values(_specs).join(' ')).toLowerCase();
      return [...vals].some(v => allText.includes(v.toLowerCase()));
    });
  });
  // sort
  if (cpSort === 'price-asc') list.sort((a,b) => a.price - b.price);
  else if (cpSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  else if (cpSort === 'rating') list.sort((a,b) => b.rating - a.rating);
  else if (cpSort === 'discount') list.sort((a,b) => (b.old ? (b.old-b.price)/b.old : 0) - (a.old ? (a.old-a.price)/a.old : 0));
  else {
    // M-2: bestseller default - in-stock first, then by reviews
    list.sort((a,b) => {
      const stockA = a.stock !== false ? 0 : 1;
      const stockB = b.stock !== false ? 0 : 1;
      if (stockA !== stockB) return stockA - stockB;
      return (b.rv||0) - (a.rv||0);
    });
  }
  return list;
}

function cpUpdateFilterBadge() {
  let count = 0;
  if (cpBrands && cpBrands.size > 0) count += cpBrands.size;
  if (cpPriceMin > 0 || cpPriceMax < _cpMaxEur) count++;
  if (cpSaleOnly) count++;
  if (cpNewOnly) count++;
  if (cpStockOnly) count++;
  if (cpRating > 0) count++;
  if (typeof currentSubcat !== 'undefined' && currentSubcat && currentSubcat !== 'all') count++;
  const btns = document.querySelectorAll('[data-action="toggleMobileFilters"], .cp-sticky-filters');
  btns.forEach(btn => {
    let badge = btn.querySelector('.cp-filter-badge');
    if (count > 0) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'cp-filter-badge'; btn.appendChild(badge); }
      badge.textContent = count;
    } else if (badge) {
      badge.remove();
    }
  });
}

function cpRenderGrid() {
  cpUpdateFilterBadge();
  const grid = document.getElementById('cpGrid');
  const count = document.getElementById('cpResultsCount');
  if (!grid) return;
  const list = cpGetFiltered();
  if (count) count.textContent = list.length + ' продукта';
  if (list.length === 0) {
    const allInCat = products.filter(p => normalizeCat(p.cat) === cpCat);
    const hasPriceFilter = cpPriceMin > 0 || cpPriceMax < _cpMaxEur;
    const hasBrandFilter = cpBrands.size > 0;
    grid.innerHTML = `<div class="cp-empty-state">
      <div class="cp-empty-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".35"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
      <div class="cp-empty-title">Няма продукти по тези критерии</div>
      <div class="cp-empty-sub">${hasPriceFilter ? 'Опитай с по-широк ценови диапазон.' : hasBrandFilter ? 'Опитай с друга марка или премахни марковия филтър.' : 'Промени филтрите или разгледай всички продукти в категорията.'}<br>Общо ${allInCat.length} продукта в тази категория.</div>
      <div class="cp-empty-actions">
        <button type="button" class="cp-empty-btn" onclick="cpResetFilters()">Изчисти филтрите</button>
        <button type="button" class="cp-empty-btn-sec" onclick="closeCatPage()">← Обратно</button>
      </div>
    </div>`;
    return;
  }
  grid.innerHTML = list.map(p => makeCard(p)).join('');
  cpUpdateURL();
}

// ═══════════════════════════════════════
// MOBILE SIDEBAR DRAWER
// ═══════════════════════════════════════
function cpOpenSidebar() {
  document.getElementById('cpSidebar')?.classList.add('open');
  document.getElementById('cpSidebarOverlay')?.classList.add('open');
}
function cpCloseSidebar() {
  document.getElementById('cpSidebar')?.classList.remove('open');
  document.getElementById('cpSidebarOverlay')?.classList.remove('open');
}

// ═══════════════════════════════════════
// DYNAMIC META TAGS
// Updates <title> and <meta description> when a category / page opens.
// Call setPageMeta(title, description) - pass null to restore defaults.
// ═══════════════════════════════════════
const _defaultTitle = document.title;
const _defaultDesc  = (document.querySelector('meta[name="description"]') || {}).content || '';

function setPageMeta(title, description) {
  document.title = title || _defaultTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description || _defaultDesc);
  // OG tags
  const og = document.querySelector('meta[property="og:title"]');
  if (og) og.setAttribute('content', title || _defaultTitle);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description || _defaultDesc);
}

function restorePageMeta() { setPageMeta(_defaultTitle, _defaultDesc); }

// ═══════════════════════════════════════
// INIT HP CATS on DOMContentLoaded
// ═══════════════════════════════════════

