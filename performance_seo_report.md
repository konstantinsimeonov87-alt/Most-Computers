# ⚡ Performance & SEO Report — Most Computers
**Дата:** 2026-04-20

---

## 📊 Размери на файловете (dist/)

| Файл | Размер | Статус | Препоръка |
|------|--------|--------|-----------|
| `app.js` | 305 KB | ⚠️ | Admin.js вече lazy (-136KB). Разгледай code-split за product-page.js |
| `styles.css` | 227 KB | ⚠️ | PurgeCSS работи (-18.7KB). Минифициран. |
| `index.html` | 250 KB | ⚠️ | 52 inline SVG символа (~18KB) + всички overlay панели |
| `products.js` | 48 KB | ✅ | Кешира се независимо |
| `admin.js` (lazy) | 140 KB | ✅ | Зарежда се само при admin достъп |
| **TOTAL** | **830 KB** | ⚠️ | Целта е под 500 KB за критичния path |

---

## ⚡ Performance проблеми

### 🟡 MEDIUM — Supabase CDN без `defer` (поправен ✅)
**Преди:** `<script src="cdn.jsdelivr.net/supabase-js@2">` блокира HTML parsing  
**След:** `defer` добавен — не спира parsing за 73KB CDN скрипт  
**Ефект:** ~200-400ms подобрение на FCP при бавни connections

### 🟡 MEDIUM — Липсваше preconnect за Supabase (поправен ✅)
**Поправка:** `<link rel="preconnect" href="https://zdwzccucqfvlsgxlspby.supabase.co" crossorigin>`  
**Ефект:** Намалява order submit latency с ~100-200ms

### 🟡 MEDIUM — Стар version stamp на app.js (поправен ✅)
**Преди:** `?v=20260409` — 11 дни стар, browsers може да сервират кеш  
**След:** `build.js` автоматично обновява датата при всеки build

### 🟢 LOW — SVG sprite inline в HTML (+18KB)
52 SVG символа са inline. Могат да се изнесат в `/icons/sprite.svg`. Ефект: ~7% по-малко initial HTML. Сложност: High.

### 🟢 LOW — JetBrains Mono зарежда на всяка страница
Използва се само за SKU/EAN и admin полета. Може да се lazy-зареди. Ефект: ~20KB по-малко fonts. Сложност: Medium.

---

## 🔍 SEO Checklist

| # | Елемент | Статус | Коментар |
|---|---------|--------|---------|
| 1 | Title tag | ⚠️ | 62 символа — леко над 60. Препоръка: съкрати до ~50 chars |
| 2 | Meta description | ✅ | 158 символа — идеален диапазон |
| 3 | H1 tag | ✅ | Един H1 (`.sr-only`) — семантично коректен |
| 4 | Canonical URL | ✅ | `https://mostcomputers.bg/` |
| 5 | Hreflang | ✅ | `bg` и `x-default` |
| 6 | Robots | ✅ | `index, follow` |
| 7 | Open Graph | ✅ | title, description, image 1200x630, url, type, locale |
| 8 | OG Image | ⚠️ | `og-default.jpg` — провери дали файлът е деплойнат |
| 9 | Twitter Card | ✅ | summary_large_image, всички тагове |
| 10 | Schema.org JSON-LD | ✅ | Organization + LocalBusiness schema |
| 11 | Product JSON-LD | ✅ | В PDP — gallery, gtin13, priceValidUntil, reviews |
| 12 | Sitemap | ✅ | 67 URLs, lastmod актуален (2026-04-20) |
| 13 | robots.txt | ✅ | Allow *, sitemap link |
| 14 | Preconnect | ✅ | Google Fonts, Samsung, Apple, Portal, Supabase (новодобавен) |
| 15 | Font loading | ✅ | Non-blocking: media="print" onload="this.media='all'" |
| 16 | Image lazy loading | ✅ | `loading="lazy"` на product и PDP изображения |
| 17 | SRI за CDN | ❌ | Supabase CDN без `integrity` hash — риск при CDN компромис |

---

## 📱 PWA Readiness Score: 9/10

| Критерий | Статус | Коментар |
|----------|--------|---------|
| manifest.json | ✅ | Пълен: name, icons 192+512, display:standalone, lang:bg |
| Maskable icons | ✅ | `purpose: "maskable"` за 192 и 512 |
| Service Worker | ✅ | Cache-first за assets, network-first за HTML/JS |
| Cache invalidation | ✅ | Crypto random версия, стар кеш изтрива при activate |
| Offline поддръжка | ✅ | Shell прекешира при install |
| HTTPS | ✅ | GitHub Pages |
| Push notifications | ❌ | Не е имплементирано |

---

## 🎯 Приоритизиран план

### Направено ✅
1. `defer` на Supabase CDN скрипт
2. `preconnect` за Supabase endpoint
3. `build.js` автоматично обновява `app.js?v=` при всеки build

### Следващи стъпки

| Приоритет | Задача | Ефект | Сложност |
|-----------|--------|-------|---------|
| 🟡 | SRI `integrity` за Supabase CDN | Сигурност | Low |
| 🟡 | Съкрати title до ~50 символа | SEO CTR | Low |
| 🟡 | Code split product-page.js | -40KB initial JS | High |
| 🟢 | SVG sprite в отделен файл | -18KB HTML | High |
| 🟢 | JetBrains Mono lazy | -20KB fonts | Medium |
| 🟢 | Провери og-default.jpg в production | Social share | Low |

---

## CSS анализ

| Метрика | Стойност |
|---------|---------|
| Редове | 16 564 |
| Media queries | 57 |
| PurgeCSS намаление | -18.7 KB |
| Минифицирано | 227 KB |

- `will-change` — само 3 случая (не overused) ✅
- Анимации използват `transform` и `opacity` (GPU-accelerated) ✅
- `prefers-reduced-motion` — имплементиран и изключва всички анимации ✅
