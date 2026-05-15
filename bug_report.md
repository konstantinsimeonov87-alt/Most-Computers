# Bug Report — Most Computers
**Последна актуализация:** 2026-05-15 | **Агент:** Bug Hunter | **Тестове след fix:** 185/185 ✅

---

## 🔴 Critical (2026-05-15)

### BUG-006 — `p.inStock` вместо `p.stock` в sidebar widgets — OOS продукти се показват
**Файл:** js/filters.js:1543, js/filters.js:1628
**Стъпки:** Отвори началната страница → "Топ продукт" или "Марка на деня" sidebar widgets → може да показват продукти с `stock: false`
**Очаквано:** Изчерпаните продукти не се включват в топ продукт ротатора и brand spotlight
**Действително:** `p.inStock` винаги е `undefined` (полето в data.js се казва `stock`, не `inStock`) → условието `p.inStock !== false` е винаги `true` → всички продукти минават, включително изчерпаните
**Fix:** Заменено `p.inStock !== false` с `p.stock !== false` в `renderSidebarTopProduct()` (ред 1543) и `renderSidebarBrandSpot()` (ред 1628)
**Файлове:** js/filters.js
**Commit:** Приложен

---

## 🟠 Major (2026-05-15)

### BUG-007 — XSS pattern: brand в `onclick` атрибут чрез `escHtml()` вместо event delegation
**Файл:** js/filters.js:1652
**Стъпки:** Ако бранд съдържа единична кавичка (напр. `D'Link`) → `onclick="showSearchResultsPage('D'Link')"` → синтаксична грешка; злонамерен бранд може да инжектира JS
**Очаквано:** Безопасно извикване без inline JS от данни
**Действително:** `escHtml()` не защитава single quotes в JS string context
**Fix:** Заменен inline onclick с `data-brand-search="${escHtml(brand)}"` атрибут + event delegation listener
**Файлове:** js/filters.js
**Commit:** Приложен

---

## 🟡 Minor (2026-05-15)

### BUG-005 — Ценовият слайдер показва „лв." вместо „€"
**Файл:** js/search.js:256, js/filters.js:279
**Стъпки:** Отвори търсачката → ценовият диапазон показва „0,00 лв. — 5 000,00 лв." и при плъзгане продължава да показва лв.
**Очаквано:** EUR като основна валута (напр. „0,00 € — 2 557,48 €")
**Fix:** `fmtBgn()` заменен с `fmtEur()` в `showSearchResultsPage()` и `updatePriceSlider()`
**Commit:** pending build

### BUG-008 — `recently-viewed.js` — `p.name` и `p.img` без `escHtml()` в innerHTML
**Файл:** js/recently-viewed.js:21
**Стъпки:** Продукт с HTML в `name` → `renderRecentlyViewed()` → XSS surface в `.rv-card-name` и `alt` атрибут
**Очаквано:** Текстът се escape-ва
**Действително:** `${p.name}` директно в innerHTML, `alt="${p.name}"` без escaping
**Fix:** Добавен `escHtml()` за `p.name` и `isSafeImgUrl()` проверка за `p.img`
**Файлове:** js/recently-viewed.js
**Commit:** Приложен

### BUG-009 — `renderSidebarTopProduct` — `p.rv || p.reviews || 0` — `reviews` е масив, не число
**Файл:** js/filters.js:1546–1547, 1563
**Стъпки:** Продукт с `reviews: [{...}]` → `p.reviews` е `Array`, не `number` → `truthy` → score изчислен с неправилна стойност
**Очаквано:** Брой ревюта като число
**Действително:** Ако `p.rv` е 0 и `p.reviews` е непразен масив, резултатът е `Array` (truthy), а не число
**Fix:** Заменено `p.rv || p.reviews || 0` с `p.rv || 0` — `rv` е каноничното поле за брой ревюта
**Файлове:** js/filters.js
**Commit:** Приложен

---

## 🔴 Critical (2026-05-14)

### BUG-003 — XSS в `renderHeroPanel()` — `p.name` без `escHtml()`
**Файл:** js/filters.js:233
**Стъпки:** Продукт с `name` съдържащо `<img src=x onerror=alert(1)>` → зареди начална страница → hero панел се рендерира
**Очаквано:** Текстът се показва буквално, без изпълнение на JS
**Действително:** HTML тагове в `p.name` се изпълняват в `.mini-promo-name` div и в `alt=""` атрибута
**Fix:** Заменено `p.name` с `escHtml(p.name)` в `.mini-promo-name` и `alt` атрибута в `renderHeroPanel()`
**Commit:**

### BUG-004 — XSS в `renderPromoBanner()` — `p.name` и `p.desc` без `escHtml()`
**Файл:** js/filters.js:250–262
**Стъпки:** Продукт с `name` или `desc` съдържащо HTML тагове → зареди начална страница → промо банер се рендерира
**Очаквано:** Текстът се показва буквално
**Действително:** HTML в `p.name` (в `<h3>`) и `p.desc` (в `<p>`) се интерпретира от браузъра; `alt=""` ползваше `p.name.replace(/"/g,'')` вместо `escHtml()`
**Fix:** `escHtml()` приложен на всички places: `sub` (desc/name), `<h3>` (name), `alt` атрибут (name)
**Commit:**

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
