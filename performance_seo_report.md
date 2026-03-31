# ⚡ Performance & SEO Report — mostcomputers.bg
**Дата:** 2026-03-31

---

## 📊 Файлови размери

| Файл | Raw | Minified (dist/) | Gzip est. | Статус |
|------|-----|-----------------|-----------|--------|
| `styles.css` | 332 KB | 230 KB | ~49 KB | ⚠️ Голям |
| `app.js` | 300 KB | 221 KB | ~65 KB | ⚠️ Голям |
| `index.html` | 220 KB | 219 KB | ~35 KB | 🔴 Много голям |
| `js/admin.js` | 120 KB | 100 KB | ~28 KB | ✅ Lazy loaded |
| `products.js` | 56 KB | 48 KB | ~15 KB | ⚠️ Не е split |
| `js/filters.js` | 56 KB | — | — | ⚠️ Кандидат за split |
| `js/data.js` | 56 KB | — | — | ⚠️ Голям модул |
| `js/seo.js` | 32 KB | — | — | ⚠️ Голям за SEO util |

**Общ critical path (gzip est.):** ~164 KB (HTML 35 + CSS 49 + JS 65 + products 15)
**Цел:** < 150 KB → **⚠️ Малко над прага**

---

## ⚡ Performance проблеми

### 🔴 Критични

#### PERF-001 — index.html е 220 KB
HTML файлът е изключително голям. Причини:
- Всички модали/overlays са pre-rendered в DOM при зареждане (checkout, PDP, compare, admin login, wishlist, blog, service, delivery, auth, quick-order...)
- Inline SVG спрайт с всички икони

**Ефект:** +~35 KB gzip само за HTML; браузърът парсва целия DOM при зареждане дори ако потребителят не ги ползва.

**Fix — lazy render модали:**
```javascript
// Вместо модалите да са в HTML при зареждане,
// ги генерирай в JS при първото отваряне:
function openCheckout() {
  if (!document.getElementById('checkoutPage')) {
    document.body.insertAdjacentHTML('beforeend', checkoutTemplate());
  }
  document.getElementById('checkoutPage').classList.add('open');
}
```

---

#### PERF-002 — Inter font: 7 тегла заредени
```html
Inter:wght@300;400;500;600;700;800;900  <!-- 7 тегла! -->
JetBrains Mono:wght@400;500
```
Google Fonts зарежда отделен subset за всяко тегло. 7 тегла = ~7 network requests + значителен CSS размер.

**Реалистично ползвани тегла в styles.css:**
- 400 (body text), 500 (medium), 600 (semi-bold), 700 (bold), 800 (headings) — 5 тегла
- 300 (light) и 900 (black) вероятно рядко ползвани

**Fix:**
```html
<!-- Намали до 5 или дори 3 тегла -->
Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400
```
**Спестяване:** ~20-30% от font размера.

---

### 🟠 Важни

#### PERF-003 — 4 от 6 `<img>` тага без `loading="lazy"`
От 6 `<img>` тага в index.html, само 2 имат `loading="lazy"`. Изображения под fold-а зареждат веднага.

**Fix:** Добави `loading="lazy"` на всички `<img>` освен hero/above-fold изображения.

---

#### PERF-004 — products.js не се lazy-load по категория
`products.js` (56 KB / 15 KB gzip) се зарежда при всяко посещение, включително ако потребителят е влязъл само за контакти. Данните са плоски — подходящи за код-сплитинг по категория.

**Fix (дългосрочен):**
```javascript
// Зареди само базова структура при init,
// зареди категорийните данни при навигация:
async function loadCategory(cat) {
  const { products } = await import(`./products-${cat}.js`);
  renderProducts(products);
}
```

---

#### PERF-005 — `prefers-reduced-motion` само за 1 от 25 анимации
CSS файлът има 25 `@keyframes` анимации и 541 реда с `animation`/`transition`/`transform`, но само 1 `@media (prefers-reduced-motion)` query. Потребители с вестибуларни нарушения виждат всички анимации.

**Fix:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

#### PERF-006 — SW precaches 688 KB при install
Service Worker precache-ва: `app.js (300KB) + styles.css (332KB) + products.js (56KB) + index.html (220KB)` = **908 KB raw** при първото посещение.

**Fix:** Обмисли стратегия само с index.html + sw.js при install, и cache-first за останалите при run-time:
```javascript
const PRECACHE = ['./', './index.html']; // Само shell-а
// app.js, styles.css, products.js → cache при runtime fetch
```

---

### 🟡 Ниски

#### PERF-007 — Липсват `will-change` за key animations
Само 3 елемента имат `will-change`. Модалите, cart sidebar, slide animations използват CSS transitions без GPU hint.

**Fix:** Добави само там, където има реална анимация (не наново):
```css
.modal-backdrop, .cart-sidebar, .slide { will-change: transform, opacity; }
```

---

## 🔍 SEO Checklist

| Елемент | Статус | Бележка |
|---------|--------|---------|
| `<title>` — 50-60 символа | ⚠️ | 65 символа — малко над лимита |
| `<meta description>` — 150-160 символа | ❌ | **214 символа** — ще се съкрати от Google |
| Един `<h1>` на страница | ⚠️ | SPA има 4 `<h1>` в DOM (slider, thank-you, PDP, about) — само един видим наведнъж |
| Schema.org LocalBusiness | ✅ | Пълно |
| Schema.org WebSite + SearchAction | ✅ | Пълно |
| Schema.org FAQPage | ✅ | |
| BreadcrumbList | ✅ | |
| Open Graph tags | ✅ | Всички попълнени |
| Twitter Card | ✅ | |
| Canonical URL | ✅ | |
| Hreflang bg + x-default | ✅ | |
| robots meta | ✅ | index, follow |
| Sitemap | ✅ | Формат коректен |
| robots.txt | ✅ | Allow: / |
| Font loading (non-blocking) | ✅ | media="print" onload pattern |
| Scripts defer | ✅ | products.js + app.js с defer |
| Preconnect fonts | ✅ | googleapis + gstatic |

### SEO Fix-ове:

**Title (65 → ≤60 символа):**
```html
<!-- Преди: -->
Most Computers | Електроника от 1997 г. — Лаптопи, Телефони, Телевизори
<!-- След: -->
Most Computers | Лаптопи, Телефони, Телевизори — От 1997 г.
```

**Meta description (214 → ≤160 символа):**
```html
Most Computers — магазин за електроника от 1997 г. Лаптопи, смартфони, телевизори от Apple, Samsung, ASUS. Безплатна доставка над 200 лв.
```
(138 символа ✅)

---

## 📱 PWA Readiness

| Критерий | Статус | Бележка |
|----------|--------|---------|
| manifest.json | ✅ | Пълен |
| name + short_name | ✅ | |
| icons 192 + 512 | ✅ | |
| start_url | ✅ | |
| display: standalone | ✅ | |
| theme_color | ✅ | #bd1105 |
| background_color | ✅ | #0f172a |
| Service Worker | ✅ | |
| Offline fallback | ✅ | 503 с текст |
| Cache strategy | ✅ | cache-first images, network-first others |
| lang в manifest | ✅ | bg |
| shortcuts | ✅ | Промоции + Лаптопи |
| `purpose` icon format | ⚠️ | "any maskable" → трябва отделни entries |

**PWA Score: 9/10** — отличен. Само icon purpose issue.

**Fix за icons:**
```json
"icons": [
  { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
  { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

---

## 🎯 Приоритизиран план

| # | Приоритет | Задача | Файл | Усилие | Ефект |
|---|-----------|--------|------|--------|-------|
| 1 | 🔴 | Съкрати meta description до ≤160 символа | `index.html` | 5 мин | SEO |
| 2 | 🔴 | Съкрати title до ≤60 символа | `index.html` | 5 мин | SEO |
| 3 | 🟠 | Намали Inter font weights (7→4) | `index.html` | 10 мин | Perf |
| 4 | 🟠 | Добави `loading="lazy"` на 4-те img тага | `index.html` | 10 мин | Perf |
| 5 | 🟠 | Добави `prefers-reduced-motion` catch-all | `styles.css` | 15 мин | A11y |
| 6 | 🟡 | Fix PWA icon purpose (separate entries) | `manifest.json` | 10 мин | PWA |
| 7 | 🟡 | Намали SW precache | `sw.js` | 20 мин | Perf |
| 8 | 🔵 | Lazy render на рядко ползвани модали | `index.html` + `js/` | 2-3 ч | Perf |
| 9 | 🔵 | Code split products.js по категория | `products.js` + `js/` | 1 ден | Perf |
