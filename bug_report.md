# Bug Report — Most Computers
**Последна актуализация:** 2026-05-15 (re-audit) | **Агент:** Bug Hunter | **Тестове след fix:** 185/185 ✅

---

## ✅ Одит 2026-05-15 (re-audit) — Нови бъгове не са открити

Всички бъгове от предишния доклад са потвърдени за оправени чрез статичен анализ на source файловете.
Нов статичен анализ на `js/filters.js`, `js/search.js`, `js/seo.js`, `js/cards.js`, `js/recently-viewed.js`, `js/cart.js` — **нула нови уязвимости или бъгове**.

| Проверка | Резултат |
|----------|----------|
| XSS в renderHeroPanel / renderPromoBanner | ✅ escHtml() навсякъде |
| XSS в SRP pills (нов код) | ✅ data-cat атрибут + escHtml() |
| XSS в brand-spot button | ✅ data-brand-search + event delegation |
| XSS в recently-viewed | ✅ escHtml() + isSafeImgUrl() |
| `p.stock` vs `p.inStock` | ✅ p.stock навсякъде |
| SRP price slider — EUR vs лв. | ✅ fmtEur() |
| sessionStorage — try/catch | ✅ обвит |
| Дублирани HTML id | ✅ Няма |
| Null dereference в renderHeroPanel picks | ✅ .filter(x=>x.p) преди .map() |

---

## ✅ Fixed — 2026-05-15

### BUG-006 — `p.inStock` вместо `p.stock` в sidebar widgets ✅ Fixed
**Файл:** js/filters.js — renderSidebarTopProduct(), renderSidebarBrandSpot()
**Fix:** Заменено `p.inStock !== false` с `p.stock !== false`

### BUG-007 — XSS: brand в `onclick` атрибут ✅ Fixed
**Файл:** js/filters.js:1674
**Fix:** `data-brand-search="${escHtml(brand)}"` + event delegation listener

### BUG-005 — SRP слайдер показва лв. вместо € ✅ Fixed
**Файл:** js/filters.js:283
**Fix:** `fmtBgn()` → `fmtEur()` в `updatePriceSlider()`

### BUG-008 — `recently-viewed.js` XSS ✅ Fixed
**Файл:** js/recently-viewed.js:27–28
**Fix:** `escHtml(p.name)` + `isSafeImgUrl(p.img)`

### BUG-009 — `reviews` е масив, не число ✅ Fixed
**Файл:** js/filters.js:1560
**Fix:** `p.rv || 0` (без `p.reviews`)

---

## ✅ Fixed — 2026-05-14

### BUG-003 — XSS в `renderHeroPanel()` ✅ Fixed
**Файл:** js/filters.js:228, 233
**Fix:** `escHtml(p.name)` в .mini-promo-name и alt атрибут

### BUG-004 — XSS в `renderPromoBanner()` ✅ Fixed
**Файл:** js/filters.js:250–262
**Fix:** `escHtml()` на sub (desc/name), `<h3>` (name), alt атрибут

---

## 🔴 Critical (2026-05-13)

### BUG-001 — `addFromModal()` не записва кошницата в localStorage
**Файл:** [js/gallery.js:141](js/gallery.js)
**Стъпки:** Отвори продуктов модал → "Добави в кошница" → Refresh на страницата
**Очаквано:** Продуктът е в кошницата след refresh
**Действително:** Кошницата беше изпразнена — `saveCart()` не се извикваше
**Fix:** Добавен `saveCart()` след `updateCart()` в `addFromModal()`
**Commit:** `dc8944d`

---

## 🟡 Minor (2026-05-13)

### BUG-002 — Swipe listeners в `openProdPreview()` се натрупват при повторно отваряне
**Файл:** [js/pdp-ux.js:512](js/pdp-ux.js)
**Стъпки:** Отвори product preview bottom sheet → затвори → отвори пак (×5) → свайп надолу
**Очаквано:** Затваря веднъж
**Действително:** Всяко отваряне добавяше нови handlers — memory leak, при 5 отвания → 5 handlers
**Fix:** Named handlers + `removeEventListener` преди всяко `addEventListener`
**Commit:** `dc8944d`

---

---

## Сесия 2026-04-24 — Пълен одит

### 🔴 BUG-010 — XSS в ревюта на продуктова страница ✅ Fixed
- **Файл:** `js/product-page.js` — ред 404-405
- **Стъпки:** Потребителят въвежда `<script>alert(1)</script>` в ревю → отваря продукт
- **Действително:** JS се изпълнява (XSS чрез localStorage)
- **Fix:** HTML escaping с `_escR()` за `r.name`, `r.date`, `r.text` — **commit:** `3549d4f`

### 🔴 BUG-011 — XSS в printInvoice ✅ Fixed
- **Файл:** `js/cart.js` — ред 639
- **Описание:** `${x.name}` без HTML escaping в `document.write()` HTML
- **Fix:** Заменено с `${escHtml(x.name||'')}` — **commit:** `3549d4f`

### 🟡 BUG-012 — Дата за доставка в thank-you не отчита почивни дни ✅ Fixed
- **Файл:** `js/cart.js` — ред 690
- **Описание:** `handleCheckout()` вече ползва `_addWorkDays()` helper (идентичен с `workDay()`) — датата правилно пропуска събота и неделя.
- **Статус:** Оправен в по-ранна сесия

### 🟢 ENH-005 — 100vh без dvh fallback в admin layout
- **Файл:** `styles.css` — ред 8902
- **Описание:** `min-height: 100vh` без `100dvh` — мобилни браузъри с address bar
- **Статус:** Отворен (Low priority)

---

## 🟠 Major — оправени

### BUG-001 — RAM честотен филтър не работи за 27 продукта
- **Файл:** `js/data.js` (RAM блок, IDs 586–794)
- **Описание:** 27 RAM продукта с грешен формат: `"2666MT/s MHz"`, `"DDR4-3200 MHz"`, `"4 800 MHz"`. Честотният филтър не ги намираше.
- **Причина:** `normSpeed()` не обработваше MT/s и DDR-prefix форматите от XML.
- **Fix:** Корекция на 27 записа в `data.js` + обновена `normSpeed()` в `scripts/parse-ram.js`.

---

## 🟡 Minor — оправени

### BUG-002 — RAM продукт #599 с фалшив kit формат
- **Файл:** `js/data.js`, product id:599
- **Описание:** `"8G DDR4 3200 TEAM DELTA R WHIT"` имаше `Капацитет: "8 GB (1×)"` вместо `"8 GB"`.
- **Fix:** Data fix в `data.js` + `normCapacity()` вече показва kit само за 2+ пръчки.

---

## ✅ Проверено и OK

| Проверка | Резултат |
|---|---|
| Дублирани ID в products (795 продукта) | ✅ Няма |
| Липсващи задължителни полета | ✅ Всички пълни |
| Zero-price продукти | ✅ Няма |
| Дублирани HTML id атрибути | ✅ Няма |
| localStorage достъп — try/catch | ✅ Обвити |
| XSS в search dropdown | ✅ escHtml() навсякъде |
| XSS в product cards | ✅ escHtml() за name, brand, img |
| Footer z-index конфликти | ✅ Няма |
| Cart логика — add/qty/remove | ✅ Коректна |
| matchesSubcat() за cpu/gpu/mb/ram | ✅ Direct p.subcat match |
| catSpecActiveFilters reset при subcat смяна | ✅ OK |

---

## 🟢 Enhancement (не са бъгове)

### ENH-001 — `_origUpdateCart` dead code в ui.js:105
Dead variable — никога не се използва. Може да се изтрие при следващ рефактор.

### ENH-002 — Честота филтър без 3600 MHz за DDR4 XMP
Препоръка: добави 3600 MHz стойност в SUBCAT_SPEC_FILTERS.ram.

### ENH-003 — 18 RAM продукта с `brand: 'Generic'`
XML не дава производител. Препоръка: manual review или скриване от brand filter.

---

## Сесия 2026-04-21 — Import на Storage/Monitors/Keyboards/Mice/Multimedia (783 нови продукта)

### 🔴 BUG-003 — Critical: SUBCATS.accessories показва 0 резултати ✅ Fixed

- **Файл:** `js/filters.js:692`
- **Описание:** `SUBCATS.accessories` съдържаше placeholder pills (`bag`, `cable`, `hub`, `smart_dev`, `mobile_acc`, `av`). Реалните импортирани продукти имат `subcat: 'projector'`, `'chair'`, `'controller'`.
- **Fix:** Заменени с реалните subcats (projector / chair / controller). **Commit:** `a63702c`

### 🔴 BUG-004 — Critical: Липсващи SUBCAT_SPEC_FILTERS за chair и controller ✅ Fixed

- **Файл:** `js/filters.js`
- **Описание:** При клик на "Gaming столове" / "Контролери" pill нямаше spec филтри вляво.
- **Fix:** Добавени entries за `chair` (Материал) и `controller` (Връзка). **Commit:** `12726ba`

### 🟡 BUG-005 — Minor: Dead 'monitor' pill в SUBCATS.peripherals ✅ Fixed

- **Файл:** `js/filters.js:673`
- **Описание:** Pill "🖥 Монитори" в периферия показваше 0 резултати — мониторите са в кат. `'monitors'`, не `'peripherals'`.
- **Fix:** Премахнат от `SUBCATS.peripherals`. **Commit:** `a63702c`

### 🟢 ENH-004 — CAT_SPEC_FILTERS.accessories не отразява реалните данни

Обновен с реални стойности (Резолюция/Технология/WiFi за проектори). При бъдещи imports ще трябва разширяване.
