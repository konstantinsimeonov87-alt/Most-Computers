# ⚡ Performance & SEO Report — Most Computers
**Дата:** 2026-04-09

---

## 📊 Размери на файлове

| Файл | Размер (raw) | Размер (dist/minified) | Препоръка |
|------|-------------|----------------------|-----------|
| `app.js` | 531 KB | **412 KB** | ⚠ Разгледай code-splitting за admin |
| `styles.css` | 337 KB | **236 KB** | ⚠ Потенциален unused CSS |
| `index.html` | 243 KB | 243 KB | ✅ Приемливо |
| `products.js` | 53 KB | **48 KB** | ✅ OK |
| `js/admin.js` | **146 KB** | ✅ Lazy-loaded | ✅ Правилно lazy |
| `js/filters.js` | 63 KB | bundled | ⚠ Най-голям source модул |
| `js/data.js` | 62 KB | bundled | ℹ Products data |
| `js/seo.js` | 39 KB | bundled | ⚠ Много голям за SEO модул |

**Общо критично изтегляне:** ~700 KB (app.js + styles.css + index.html) → таргет: **< 500 KB**

---

## ⚡ Performance проблеми

### 🔴 Критични

**PERF-001 — Два `<h1>` тага на страницата**
- `index.html:1746` — hero slider: `<h1 class="slide-title">Вземи ТОП...`
- `index.html:3588` — PDP: `<h1 class="pdp-name" id="pdpName">`
- **Fix (приложен):** Hero slide-1 → `<h2 class="slide-title">`

**PERF-002 — `app.js` версионен параметър е стар**
- `index.html:44` — `app.js?v=20260403` (6 дни стар)
- **Fix (приложен):** Обновен на `v=20260409`

### 🟠 Важни

**PERF-003 — `styles.css` 337 KB — потенциален unused CSS**
- 2601 CSS правила, 56 media queries
- Много наследствен CSS от чакащи/неизползвани компоненти
- **Препоръка:** PurgeCSS анализ; очакван savings ~30-40 KB

**PERF-004 — Липсващ `font-display: swap` в Google Fonts URL**
- Текущото зареждане е `media="print" onload` (добра стратегия), но Fonts URL не съдържа `&display=swap`
- **Fix (приложен):** Добавен `&display=swap` в Google Fonts URL
- **Ефект:** Предотвратява FOIT (Flash of Invisible Text) при бавна мрежа

**PERF-005 — Липсващ `dns-prefetch` за `portal.mostbg.com`**
- Добавени са 7 реални продукта с изображения от `portal.mostbg.com`
- **Fix (приложен):** Добавени `<link rel="dns-prefetch">` и `<link rel="preconnect">`

**PERF-006 — `transition: width` за shipping progress bar**
- `styles.css:15060` — `.cart-ship-fill { transition: width 0.4s ease }`
- `width` анимациите предизвикват layout recalculation (expensive)
- **Препоръка:** Замени с `transform: scaleX()` + `transform-origin: left` (compositor-only)

**PERF-007 — 56 `setTimeout` срещу само 5 `requestAnimationFrame`**
- Много от анимационните timeouts могат да използват `rAF` за по-плавност
- Критично за `showRecommended` panel анимацията

### 🟡 Средни

**PERF-008 — Голямото `js/seo.js` (39 KB)**
- SEO модулът е изненадващо голям — вероятно съдържа много hardcoded structured data
- **Препоръка:** Прегледай дали може да се редуцира

**PERF-009 — Inline `<script>` блок в края на body**
- `index.html:4412` — PWA + dark mode inline скрипт
- Вече е минимален, не е критично; `defer` на `app.js` е правилен ✅

---

## 🔍 SEO Checklist

| Елемент | Статус | Бележка |
|---------|--------|---------|
| `<title>` дължина | ✅ | "Most Computers \| Лаптопи, Телефони, Телевизори — От 1997 г." — 60 chars |
| Meta description | ✅ | 158 chars — в препоръчания диапазон |
| Само един H1 | ✅ *fix* | Было 2; сега 1 (PDP `<h1>`, hero `<h2>`) |
| Canonical URL | ✅ | `https://mostcomputers.bg/` |
| Open Graph tags | ✅ | title, description, image, url, type, locale |
| Twitter Card | ✅ | summary_large_image, site, title, description, image |
| Hreflang (bg + x-default) | ✅ | Правилно дефинирани |
| Schema.org JSON-LD | ✅ | LocalBusiness, WebSite, FAQPage |
| Robots meta | ✅ | `index, follow` |
| Sitemap.xml | ✅ *fix* | lastmod обновен до 2026-04-09 |
| robots.txt | ✅ | Allow: /, Sitemap линк |
| `<img alt="">` на product images | ⚠ | Програмно генерирани — провери JS рендера |
| Structured data за продукти | ❌ | Липсват `Product` schema за индивидуални продукти |
| Breadcrumb schema | ⚠ | Breadcrumb е в JS (dynamic) — не е в initial HTML |

**Критична SEO липса:** Няма `Product` JSON-LD schema. Google може да показва rich results (цена, наличност, рейтинг) в SERP ако се добави.

---

## 📱 PWA Readiness

| Критерий | Статус | Бележка |
|----------|--------|---------|
| manifest.json | ✅ | name, short_name, icons, theme_color |
| Service Worker | ✅ | Регистриран, cache-first за статика |
| Offline поддръжка | ✅ | Fallback Response при мрежова грешка |
| Icons 192 + 512 | ✅ | any + maskable |
| HTTPS | ✅ | (production) |
| `display: standalone` | ✅ | |
| `screenshots` в manifest | ✅ *fix* | Добавени (нужни за Enhanced install) |
| `prefer_related_applications` | ✅ *fix* | `false` |
| Push notifications | ❌ | Не са имплементирани |
| Background sync | ❌ | Не е имплементиран |
| Shortcut icons | ⚠ | Shortcuts дефинирани без `icons` |

**PWA Score: 7.5/10** — Основната функционалност е налице; push notifications = следваща стъпка.

---

## 🎯 Приоритизиран план за оптимизация

| Приоритет | Задача | Effort | Impact |
|-----------|--------|--------|--------|
| 1 | ✅ H1 дублиране fix | Done | SEO High |
| 2 | ✅ Sitemap lastmod обновяване | Done | SEO Medium |
| 3 | ✅ dns-prefetch за portal.mostbg.com | Done | Perf Medium |
| 4 | ✅ manifest screenshots + prefer_related | Done | PWA Medium |
| 5 | Добави `Product` JSON-LD schema за продукти | 2h | SEO High |
| 6 | `transition: width` → `transform: scaleX()` на shipping bar | 15min | Perf Low |
| 7 | PurgeCSS за неизползван CSS | 1h | Perf Medium |

---

## Позитивни находки

- ✅ `app.js` е с `defer` — не блокира rendering
- ✅ `admin.js` (146KB) е правилно lazy-loaded
- ✅ Google Fonts зарежда с `media="print" onload` — не блокира
- ✅ Preconnect + dns-prefetch за всички CDN домейни
- ✅ Service worker с версионна инвалидация
- ✅ Cache-first за изображения, network-first за HTML/CSS/JS
- ✅ Sitemap с 16 URL-а, robots.txt с Allow: /
- ✅ Пълен Open Graph + Twitter Card
- ✅ LocalBusiness + WebSite + FAQPage structured data
- ✅ Canonical + hreflang правилно дефинирани
