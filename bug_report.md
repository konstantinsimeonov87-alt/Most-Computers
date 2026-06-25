# Bug Report — Most Computers
**Дата:** 2026-06-25  
**Версия:** HEAD (main branch)  
**Метод:** Статичен анализ на source файловете в `js/`, `styles.css`, `index.html`

---

## 🔴 Critical (блокиращи)

### BUG-001 — Checkout блокиран при избор "Еконт до адрес" — FIXED (2026-06-24)
**Файл:** `js/cart.js` — `selectDeliveryCk()` (~ред 650) и `handleCheckout()` (~ред 432)

**Стъпки за възпроизвеждане:**
1. Добави продукт в кошницата
2. Отвори checkout
3. На стъпка 2 остави избраната опция "Еконт до адрес" (default)
4. Попълни Град и Адрес
5. Натисни "Продължи"

**Очаквано:** Преминаване към стъпка 3 (Плащане)  
**Действително:** Валидацията изисква "Еконт офис" поле — `validateCkStep(2)` блокира, защото `ckEcontOfficeRow` е видим (no `display:none` в HTML по подразбиране)

**Fix:**
```javascript
// FIXED in selectDeliveryCk(el, idx):
if (officeRow) officeRow.style.display = (idx === 1) ? '' : 'none';
if (addrSection) addrSection.style.display = (idx === 2) ? 'none' : '';
```

---

### BUG-004 — `data-slim.js` версия не е обновена след ребилд — FIXED (2026-06-25)
**Файл:** `index.html` — редове 57 и 3482

**Стъпки за възпроизвеждане:**
1. Потребител посещава сайта на 2026-06-24
2. Браузърът кешира `data-slim.js?v=20260624`
3. На 2026-06-25 се добавят 224 нови продукта и `data-slim.js` се ребилдва
4. `index.html` продължава да референцира `v=20260624`
5. Потребителят вижда стари продуктови данни (без 224-те нови продукта)

**Очаквано:** `data-slim.js?v=20260625` (matching app.js, data.js, promotions-data.js)  
**Действително:** `data-slim.js?v=20260624` — stale cache-busting string

**Причина:** `data-slim.js` се ребилдва от import скриптовете, но версията в `index.html` не се обновява автоматично.

**Fix:**
```html
<!-- ПРЕДИ -->
<link rel="preload" href="data-slim.js?v=20260624" as="script">
<script src="data-slim.js?v=20260624" defer></script>

<!-- СЛЕД -->
<link rel="preload" href="data-slim.js?v=20260625" as="script">
<script src="data-slim.js?v=20260625" defer></script>
```

**Засегнати потребители:** Мобилни потребители с кеширана версия от 2026-06-24.

---

## 🟠 Major (функционални проблеми)

### BUG-002 — "Изчисти филтрите" не нулира "Само налични" — FIXED (2026-06-24)
**Файл:** `js/seo.js` — `cpResetFilters()` (~ред 924)

**Fix:**
```javascript
// FIXED:
cpRating = 0; cpSaleOnly = false; cpNewOnly = false; cpStockOnly = false;
```

---

## 🟡 Minor (козметични / edge case)

### BUG-003 — `filter-pill` querySelector — мъртъв код в `filters.js`
**Файл:** `js/filters.js` — `applyFilter()` и `updateActiveFiltersBar()`

`document.querySelectorAll('.filter-pill')` се използва на няколко места, но елементи с клас `.filter-pill` никога не се създават. Резултатът е празен NodeList — функционалността не е нарушена.

**Fix:** Не е критично. Препоръчително почистване при следващ рефактор.

---

## 🟢 Enhancement (не е бъг, но може да е по-добре)

### ENH-001 — Валидация на `ckAddr` при "Еконт до офис"
**Файл:** `js/cart.js` — `validateCkStep(2)`

При idx=1 (до офис) се изисква и попълване на полето `ckAddr` (домашен адрес), което не е логично при офис доставка.

### ENH-002 — Hero slider NodeList при parse-time
**Файл:** `js/gallery.js` — ред 333-336

`const slides = document.querySelectorAll('.slide')` се изпълнява top-level. Работи коректно (bundle е в края на body), но при бъдещ async load може да стане проблем.

### ENH-003 — data-slim.js версия да се обновява автоматично
**Файл:** `build.js` или import скриптове

При всеки rebuild на `data-slim.js`, версията в `index.html` трябва да се обновява автоматично за да се избегне повторение на BUG-004.

---

## Резюме

| ID | Severity | Файл | Статус |
|----|----------|------|--------|
| BUG-001 | 🔴 Critical | `js/cart.js` | FIXED (2026-06-24) |
| BUG-004 | 🔴 Critical | `index.html` | FIXED (2026-06-25) |
| BUG-002 | 🟠 Major | `js/seo.js` | FIXED (2026-06-24) |
| BUG-003 | 🟡 Minor | `js/filters.js` | Noted (no fix needed) |
| ENH-001 | 🟢 Enhancement | `js/cart.js` | Open |
| ENH-002 | 🟢 Enhancement | `js/gallery.js` | Open |
| ENH-003 | 🟢 Enhancement | `build.js` | Open |

**Build:** `node build.js` — 1052.2 KB OK  
**Tests:** 317/317 passed ✅
