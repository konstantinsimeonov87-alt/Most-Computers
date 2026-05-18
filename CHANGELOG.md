# Changelog — Most Computers

All notable changes to mostcomputers.bg are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [v1.7.0] — 2026-05-18 — Консумативи, PDP UX & Performance

### Added
- **173 нови продукта** — Canon консумативи (лазерни тонери + мастиленоструйни касети) с EAN, SKU и снимки от Icecat
- Категория **Консумативи** добавена в: desktop sidebar, mobile категорийни тайлове, mobile nav accordion, mega dropdown меню
- Mega dropdown за консумативи с 2 колони — „Лазерни тонери" и „Мастиленоструйни касети"
- **Субкатегории** `laser_toner` и `inkjet` в URL схемата (`?cat=consumables&subcat=laser_toner`)
- Cross-sell widget „Може да те заинтересува" в PDP — позициониран под галерийните миниатюри (вляво)
- `printer → consumables` cross-sell връзка в `_CROSS_SELL` map
- **Scarcity counter** на продуктови карти: „⚡ Остават само N бр." при lowstock/hot badge
- **Qty stepper в search dropdown** — бутони +/− вместо статичен „Добави" след добавяне в кошница
- Breadcrumb навигация в category page (Home → Категория → Субкатегория)
- Sticky CTA bar в PDP при scroll (mobile и desktop)
- Search bar в category page header за филтриране на продукти
- Shipping progress bar в кошницата (показва колко до безплатна доставка)
- Wishlist price-drop нотификации (при намаление на запазен продукт)
- Spec copy бутон в PDP specs таблица (копира стойност в клипборд)
- Econt city autocomplete филтър в checkout
- HTML минификация в build pipeline (230 KB → 183 KB, -21%)
- `preconnect` за images.icecat.biz (ускорява зареждане на продуктови снимки)
- Sitemap URLs за консумативи и техните субкатегории

### Fixed
- Flash sale grid — динамичен брой колони, картите винаги запълват реда
- XSS: `p.img` се escape-ва в 3 `innerHTML` render пътища (cards, PDP gallery, compare)
- PDP layout: максимална ширина 1100px, grid колони `1fr 420px`, `align-items: start`
- Spec филтър reset при смяна на категория не затриваше търсенето
- Brand spotlight, recently-viewed и top-product sidebar widget-и в SRP
- Sidebar price filter с по-умно разпределение на стъпките

### Security
- `p.img` URL-и от external домейни escape-вани преди вмъкване в `innerHTML`
- Премахнат коментар в source кода, разкриващ стойността на admin PIN
- Admin таблицата с продукти escape-ва HTML в имена/emoji/SKU (`_esc()`)
- `previewAefImg()` в admin мигрирана от `innerHTML` към DOM API
- Demo потребителят в auth.js вече не съдържа реална парола в source кода

### Performance
- HTML минификация: -21% (291 KB → 230 KB) в dist/
- Премахнат `dns-prefetch` за dell.com (Dell не е в каталога)
- `preconnect` за icecat.biz заменя по-слабия `dns-prefetch`
- `dist/data.js` (2.2 MB) — решението е gzip/brotli на сървъра (не code change)

### Accessibility (WCAG 2.1 Level A)
- `<th scope="row">` добавен в работното време таблица (`hoursTable`) в index.html
- `<th scope="row/col">` добавен в JavaScript-генерирания compare table (`gallery.js`)
- `<th scope="row">` добавен в PDP specs таблица (`product-page.js`)

### Changed
- Homepage секции наредени по-логично: категории → flash sale → статично промо → нови продукти → препоръчани → bestsellers → brand ticker → всички продукти
- Dead code премахнат: orphan `#pdpRecsWidget` placeholder, legacy checkout upsell функции, дублиран CSS
- Supabase orderData logging премахнат от production (debug логове изчистени)

---

## [v1.6.0] — 2026-04-20 — Backend, XML Import & Stability

### Added
- Supabase интеграция — поръчките се записват в реална база данни
- Имейл нотификации при нова поръчка чрез Resend + Supabase Edge Function
- Подкатегорийна лента в category page (subcat bar) с филтриране по тип
- Избор на подкатегория директно в XML import preview (dropdown "Принуди subcat")
- "Нулирай продуктите към source" бутон в Admin Danger Zone
- Стойностите на поръчки в Admin панела се показват в евро
- Keyboard shortcut за търсене + skeleton loading на продуктови карти (v1.6 features)
- Bundle оферти (M-06) и инсталментен хинт за скъпи продукти в PDP
- Динамичен upsell в кошницата (подобни продукти)

### Fixed
- XML импорт по URL — правилен CORS proxy формат + 3 fallback proxy-та
- XML auto-update задача — използва същия 3-proxy механизъм като ръчния импорт
- Spec филтрите в категорийната страница работят с кирилски ключове (напр. "Тип")
- Марки без продукти вече не се показват в sidebar с "(undefined)" брой
- Scroll позицията се нулира при отваряне на SRP
- `data-action` с `this` в скоби вече работи коректно
- Grешки от Supabase/CDN вече не показват toast нотификации
- localStorage корупция при XML импорт — преминато от replace към merge стратегия
- EAN/SKU identity check предотвратява XML ID конфликти от презаписване на data.js продукти
- Version stamp изчиства остарялото localStorage при първо зареждане на нова версия
- Кирилски spec ключ "Тип" в CAT_SPEC_FILTERS за компоненти

### Removed
- 3 продукта с неправилни изображения от bhphotovideo (ID: 241, 242, 248)

### Security
- XSS защита в 404 страница — emoji и имена в популярни продукти escape-вани
- XSS в SRP filter pills чрез JSON.stringify(query) в onclick

### Changed
- Admin ордерс панел свързан директно към Supabase (вместо localStorage)
- Admin polish: подобрено форматиране и thank-you страница
- XML импорт вече игнорира vendor ID и генерира нов вътрешен ID (предотвратява конфликти)
- Lazy-load на admin.js — премахнати 136 KB от main bundle
- WCAG 2.1 AA: aria-label на search select, role/tabindex на breadcrumb span, dark mode muted контраст (#64748b → #8a9bb5, 3.86:1 → 6.3:1)

---

## [v1.5.0] — 2026-04-16 — UX/UI Одит 10/10

### Added
- Wishlist бутонът е винаги видим на touch устройства (`@media (hover: none)`)
- Delivery estimate micro-copy на всяка продуктова карта ("📦 Доставка до 2 работни дни")
- Financing hint за продукти над 999 лв ("или от X лв./мес. на изплащане")
- CSS z-index token scale в `:root` (`--z-dropdown` → `--z-skip`)
- Named функции `scrollToFeatured()` и `scrollToSale()` (заменят inline JS)

### Fixed
- Focus box-shadow индикатори за mob-search input и quick-order inputs
- `<label for>` атрибути добавени към Quick Order полета (град, адрес, бележка)
- Slider dot бутони получават `aria-label="Слайд 1/2/3"` + `aria-current="true"`
- `gallery.js` `goSlide()` синхронизира `aria-current` на активната точка
- Stray closing `}` в styles.css (от предишно премахване) — CSS parse error отстранен

### Changed
- Dark mode вече НЕ се принудително изключва на мобилни устройства
- `100dvh` fallbacks добавени за modals, order-summary и sidebar filter
- `touch-action: manipulation` глобално за бутони и inputs (премахва 300ms tap delay)
- `overscroll-behavior: contain` за cart panel и checkout страница
- Toast и skip-link мигрирани към CSS токени `var(--z-toast)` / `var(--z-skip)`

---

## [v1.4.0] — 2026-04-14-15 — Catalog, SEO & Multi-Audit Fixes

### Added
- `stock` полета за всички 58 продукта (false = изчерпан, 1-5 = последни бройки)
- "Последни N бр." badges на продуктовите карти
- SW cache auto-bump при всеки `node build.js`
- HyperX и Anker добавени в mega brands
- ItemList schema на category filter, breadcrumb URLs, meta на всички overlay pages

### Fixed
- Badge/pct грешка за Canon продукти
- Рейтинги на RTX 4090 и MSI Vector
- Pickup поръчки вече не изискват адрес за доставка
- ESC затваря checkout прозореца коректно
- XSS в product specs, carousel и brand filter
- EUR_RATE fallbacks в price rules
- Reviews tab default активен при отваряне
- URL restoration за subcat, filter reset след навигация
- Wishlist feedback toast при добавяне/премахване
- Cart focus след добавяне на продукт
- Двойно рендериране на страницата при навигация
- About page навигация

### Changed
- Всички 39 продукта мигрирани към канонични категорийни стойности
- `_CAT_MIGRATE` cleanup — премахнати вече-канонични записи
- 404 страница: rebrand в Most Computers червено (Variant A)
- Analytics admin tab добавен
- Dynamic meta + sitemap генериране

---

## [v1.3.0] — 2026-04-08-09 — Accessibility, Analytics & CRO

### Added
- `analytics.js` — GA4 + Meta Pixel event tracking слой
- PurgeCSS в build pipeline (-17.7KB CSS)
- Checkout error messages с inline validation
- Product JSON-LD schema: gallery, gtin13, priceValidUntil, reviews
- BreadcrumbList + ItemList schema (статичен)
- Auth form error associations (`aria-describedby`)
- 7 реални MSI и Lenovo лаптопи от каталога

### Fixed
- WCAG 2.1 AA: labels, autocomplete, aria, контраст, nested `<main>`
- Sale badge контраст за четимост
- Skip link дублиране
- Контактна форма labels
- Dual H1 проблем
- Font-display swap
- Preconnect за CDN ресурси
- Ситемап дати
- XSS в search dropdown, clipboard, button type attrs
- CSP header добавен

### Changed
- CRO подобрения: urgency текстове, social proof, CTA copy, promo hint
- Checkout: city autocomplete, phone validation, Econt office selection, auto-focus

---

## [v1.2.0] — 2026-04-01-07 — Category Architecture & Filter System

### Added
- 8-категорийна computer-store архитектура (laptops/desktops/phones/gaming/monitors/components/peripherals/accessories)
- Phones, Gaming, Monitors като top-level категории
- Admin products table: сортиране по колона, category & status filters
- Bulk subcat dropdown в admin
- Filter system: URL sync, dynamic price range, inferSubcat, clear-all chip
- Pagination (замества infinite scroll)
- Subcategory pills strip (22 елемента, 3 реда)
- EUR first, BGN second в ценовите дисплеи

### Fixed
- 24+ бъга в filter, cart и product системата
- Product compare, promo code бъгове
- Дублирани ID бъгове
- Sidebar navigation бъгове
- Category filtering с normalizeCat
- Brand filter XSS
- Stop propagation при data-action

### Changed
- Всички product cat стойности нормализирани
- XML category mapping унифициран
- Admin е lazy-loaded (165KB не се зарежда при start)
- Sidebar default filters

---

## [v1.1.0] — 2026-03-27-31 — Mobile UX & Performance

### Added
- Mobile header: логото + wishlist + cart на ред 1, търсачка на ред 2
- Flying cart animation при добавяне на продукт
- Pull-to-refresh поддръжка
- Bottom navigation wiring
- CI workflow за auto-bump на SW cache
- Build pipeline: products.js extraction + minification

### Fixed
- Mobile header layout (hamburger, logo центриране, icons)
- Footer: dark mode background, z-index над cat-page overlay
- PDP mobile: gallery, sticky bar, emoji fallback
- Checkout mobile layout
- Hero slider: fade animation + horizontal-only swipe
- Footer mobile layout
- Cookie banner on mobile Safari
- Wishlist icon видим в mobile header

### Changed
- Wishlist видим на mobile (беше скрит с opacity:0 без hover trigger)
- Footer z-index hierarchy изчистена

---

## [v1.0.0] — 2026-03-23-24 — Initial Release

### Added
- Most Computers PWA — пълен e-commerce сайт
- 58 продукта с цени в EUR и BGN
- Продуктов каталог с категории, филтри и сортиране
- Продуктов модал (gallery, specs, reviews)
- Кошница с localStorage persistence
- Quick order form
- Checkout flow (3 стъпки)
- Admin панел (PIN protected)
- Dark mode
- Service Worker с cache-first стратегия
- sitemap.xml, robots.txt, Twitter meta tags
- Components категория с 10 продукта

---

## Версионна схема

```bash
# Текуща версия: v1.7.0
git tag v1.7.0
git push origin --tags
```

Проектът следва [Semantic Versioning](https://semver.org/):
- **PATCH** (x.x.1) — bug fixes, security patches
- **MINOR** (x.1.x) — нови функции, без breaking changes
- **MAJOR** (1.x.x) — breaking changes в API или структурата
