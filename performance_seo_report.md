# ⚡ Performance & SEO Report — mostcomputers.bg
**Дата:** 2026-04-16

---

## 📊 Размери на файловете (dist/)

| Файл | Размер | Статус |
|------|--------|--------|
| `app.js` | **306 KB** (↓ от 442 KB) | ✅ След lazy admin split |
| `dist/js/admin.js` | 137 KB | ✅ Зарежда се само при Admin |
| `styles.css` | 227 KB | ⚠️ Голям, но PurgeCSS вече е приложен |
| `index.html` | 249 KB | ⚠️ Голям — включва SVG sprite inline |
| `products.js` | 48 KB | ✅ Приемливо |
| **TOTAL (без admin)** | **830 KB** (↓ от 966 KB) | ✅ |

---

## ⚡ Performance — Приоритизирани проблеми

### ✅ ОПРАВЕН — Критичен: admin.js в main bundle (−136 KB)
- `js/admin.js` (169 KB source) беше включен в `app.js` за ВСИЧКИ потребители
- `admin-loader.js` е проектиран за lazy loading, но пътят беше грешен (`dist/admin.js` → `js/admin.js`)
- **Fix:** `build.js` използва `admin-loader.js` (1.6 KB) вместо `admin.js`
- **Резултат:** app.js 442 KB → 306 KB (**−31%**)

### ⚠️ СРЕДЕН: styles.css 227 KB (минифициран)
- 16,564 реда, 2,656 CSS правила, 57 media queries
- PurgeCSS вече работи (намали от 344 KB → 227 KB)
- `transition: width` на 3 места вместо `transform: scaleX()` (layout thrashing)

**Potential fix:**
```css
/* Вместо: */
.cart-ship-fill { transition: width .4s ease; }
/* По-добре: */
.cart-ship-fill { transition: transform .4s ease; transform-origin: left; }
```

### ⚠️ СРЕДЕН: Google Fonts — 3 семейства, много тегла
```
Inter: 400, 600, 700, 800
Outfit: 400, 500, 600, 700, 800, 900
JetBrains Mono: 400, 500
```
- JetBrains Mono се използва на 10+ места (цени, кодове) — не може да се премахне
- Inter може да се ограничи до 3 тегла (400, 700, 800) — пести ~10-15 KB fonts CSS
- `font-display: swap` е включен ✅

### 🟢 НИСЪК: `will-change` само на 2 места
- Анимациите ползват `transform` (правилно) ✅
- `will-change: transform` присъства на slider и progress fill ✅

---

## 🔍 SEO Checklist

| Елемент | Статус | Детайл |
|---------|--------|--------|
| `<title>` | ✅ | 59 символа — в оптималния диапазон (50–60) |
| `<meta description>` | ✅ | ~155 символа, включва ключови думи |
| `<h1>` | ✅ | Присъства, `sr-only` (скрит, но семантично коректен) |
| Canonical URL | ✅ | `https://mostcomputers.bg/` |
| Hreflang | ✅ | `bg` + `x-default` |
| Robots meta | ✅ | `index, follow` |
| Open Graph | ✅ | Пълен комплект (title, desc, image 1200×630, url, type, locale) |
| Twitter Card | ✅ | `summary_large_image` с всички полета |
| Schema.org JSON-LD | ✅ | LocalBusiness + WebSite + FAQPage + BreadcrumbList + ItemList |
| Sitemap.xml | ✅ | 67 URLs, `lastmod` актуален (2026-04-16) |
| robots.txt | ✅ | `Allow: /`, Sitemap линк |
| `font-display: swap` | ✅ | В Google Fonts URL |
| `<script defer>` | ✅ | app.js се зарежда с `defer` |
| Preload | ✅ | styles.css и app.js са preload-нати |
| Preconnect | ✅ | fonts.googleapis.com + fonts.gstatic.com + Samsung + Apple |
| `loading="lazy"` | ✅ | Приложено на изображения под fold-а |

---

## 📱 PWA Readiness

| Критерий | Статус |
|----------|--------|
| manifest.json | ✅ Пълен (name, icons 192/512, screenshots, shortcuts, categories) |
| Service Worker | ✅ Cache-first за статични assets, version bump при всеки build |
| Offline поддръжка | ✅ SW кешира app.js, styles.css, index.html |
| Install prompt | ✅ `beforeinstallprompt` handler в ui.js |
| `theme_color` | ✅ `#bd1105` (Most Computers red) |
| HTTPS | ✅ (production) |
| **PWA Score** | **9/10** |

---

## 🎯 Приоритизиран план

| # | Задача | Effort | Gain |
|---|--------|--------|------|
| ✅ | admin.js lazy split | — | −136 KB app.js |
| 2 | `transition: width` → `transform: scaleX()` на progress bars | 15 мин | No layout thrashing |
| 3 | Inter: премахни 600 weight (ограничено ползван) | 5 мин | ~5 KB fonts |
| 4 | Inline SVG sprite → external sprite file | 2+ ч | −30 KB index.html, cacheable |

---

## 📈 Преди / След

| Метрика | Преди | След |
|---------|-------|------|
| app.js (minified) | 442 KB | **306 KB** |
| Total dist | 966 KB | **830 KB** |
| Admin JS за обикновен потребител | 136 KB заредени | **0 KB** |
| npm audit уязвимости | 0 | 0 |
| Jest тестове | 185/185 | 185/185 |
