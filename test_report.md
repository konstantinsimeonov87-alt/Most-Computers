# Test Report — Most Computers
**Дата:** 2026-06-10  
**Сесия:** Search логика — разширени edge-case тестове

---

## Резюме

| Категория | Тестове | ✅ Преминали | ❌ Фейлнали |
|---|---|---|---|
| Jest unit тестове | 254 | 254 | 0 |
| Browser smoke тестове | 7 | 7 | 0 |
| **ОБЩО** | **261** | **261** | **0** |

---

## Jest Unit Тестове (254/254)

### Съществуващи suite-ове
| Suite | Тестове | Резултат |
|---|---|---|
| `cart.test.js` | addToCart, removeFromCart, changeQty | ✅ |
| `checkout.test.js` | Checkout стъпки, калкулации | ✅ |
| `currency.test.js` | EUR/BGN конверсии, форматиране | ✅ |
| `filters.test.js` | getFilteredSorted, normalizeCat, сортиране | ✅ |
| `initDataActions.test.js` | data-action атрибути, DOM binding | ✅ |
| `search.test.js` | 33 теста: highlightMatch, searchProducts, queryType, saveRecentSearch | ✅ |
| `wishlist.test.js` | Добавяне/премахване от любими | ✅ |
| `admin.test.js` | Admin панел функционалност | ✅ |
| `warranty.test.js` | openWarrantyPage, closeWarrantyPage, DOM структура | ✅ |

### Нови тестове — `search-extended.test.js` (53 теста)
| Група | Тестове | Резултат |
|---|---|---|
| `highlightMatch` — XSS и HTML escaping | 7 теста: `<script>`, `&`, `"`, кирилица, partial match | ✅ |
| `queryType` — гранични EAN стойности | 9 теста: 7/8/13/14/15 цифри, spaces, SKU case | ✅ |
| `searchProducts` — fuzzy matching | 5 теста: 1-typo "Somy"→Sony, "soni"→Sony, "Samsng"→Samsung | ✅ |
| `searchProducts` — multi-word queries | 5 теста: "Sony слушалки", "iPhone Pro Max", "Samsung 4K" | ✅ |
| `searchProducts` — sparse/incomplete продукти | 6 теста: без ean/sku/desc/specs, no crash | ✅ |
| `searchProducts` — EAN търсене | 4 теста: EAN-13, EAN-8, leading zeros | ✅ |
| `searchProducts` — category filter | 6 теста: phones/accessories/laptops/all/null/undefined | ✅ |
| `saveRecentSearch` — edge cases | 5 теста: spaces, case-sensitive dedupe, FIFO, special chars | ✅ |
| `searchProducts` — specs | 3 теста: "40mm", "A18 Pro", "4K" | ✅ |
| `searchProducts` — кирилица | 3 теста: lowercase, uppercase, partial | ✅ |

---

## Browser Smoke Тестове (7/7) — Playwright Chromium

| Тест | Резултат |
|---|---|
| Homepage зарежда без JS грешки | ✅ |
| warrantyPage се отваря (`openWarrantyPage()`) | ✅ |
| OGU download линкът присъства в warrantyPage | ✅ |
| `ogu-most-computers.html` HTTP 200 | ✅ |
| Footer "Гаранция" `data-action=openWarrantyPage` | ✅ |
| `?page=warranty` deep link отваря warrantyPage | ✅ |
| `closeWarrantyPage()` затваря warrantyPage | ✅ |

---

## Открити поведения / Quirks в search логиката

### ⚠ QUIRK-1: Fuzzy токени < 3 символа се изпускат
**Описание:** В `matchesQuery`, fuzzy fallback-ът филтрира токени с дължина < 3 символа. При заявка "Sony TV", токенът "TV" (2 chars) се изпуска и остава само "sony". Резултатът е, че Sony WH-1000XM6 се връща дори когато няма "TV" в нито едно поле.

**Засегнат код:** `js/search.js:79` — `filter(t => t.length >= 3)`

**Препоръка:** Ако multi-word query съдържа само кратки токени (< 3 chars), fuzzy не трябва да се активира — вместо това трябва да се разчита на multi-word path или да се върне `false`. Алтернативно — прагът може да се намали до 2 символа за специфични случаи (напр. "TV", "PC", "4K").

**Текущо поведение:** Документирано с тест `'Sony TV' → KNOWN QUIRK`.

---

### ⚠ QUIRK-2: `saveRecentSearch` не трим-ва преди записване
**Описание:** `saveRecentSearch("   ")` записва низ от интервали (защото `"   "` е truthy). Потребителят би видял празни chips в `recentSearches` dropdown.

**Засегнат код:** `js/search.js:455` — `if (!q) return;` трябва да бъде `if (!q.trim()) return;`

**Препоръка:** Промяна `if (!q)` → `if (!q.trim())` в `saveRecentSearch`.

---

## Поправен бъг в тази сесия (search)

Няма промени в продуктивния код — само тестове добавени.

---

## Намерени и отстранени бъгове (предишни сесии)

### 🐛 BUG-1: Deep link `?page=warranty` не отваряше страницата
**Проблем:** Routing кодът за warranty беше добавен директно в генерирания `app.js` bundle (а не в source файла `js/filters.js`). При следващ build щеше да бъде изтрит. Освен това `setTimeout` от 350ms е недостатъчен — lazy bundle-ът се зарежда след 2000ms.

**Fix:** Добавен в `js/filters.js` с timeout 2400ms (след lazy bundle зареждане).

### 🐛 BUG-2: `ogu-most-computers.html` се изтриваше при build
**Проблем:** `build.js` изтрива `dist/` и не копираше `ogu-most-computers.html`, което правеше download линкът нефункционален след всеки build.

**Fix:** Файлът е добавен в `build.js` в списъка с копираните статични файлове; source файлът е в root-а на проекта.

---

## Промени в кода (тази сесия — search тестове)

| Файл | Промяна |
|---|---|
| `tests/search-extended.test.js` | **НОВ** — 53 edge-case теста за `js/search.js` |

## Промени в кода (предишни сесии)

| Файл | Промяна |
|---|---|
| `js/pages.js` | Добавени `openWarrantyPage`, `closeWarrantyPage` + `module.exports` за тестване |
| `js/filters.js` | Добавен `?page=warranty` deep link routing с правилен timeout (2400ms) |
| `build.js` | Добавен `ogu-most-computers.html` в списъка с копираните файлове |
| `ogu-most-computers.html` | Нов standalone downloadable warranty документ |
| `index.html` | Нова `warrantyPage` с hero, 6 секции, сервизна мрежа |
| `styles.css` | Нови `wrt-*` CSS класове за warranty страницата |
| `tests/warranty.test.js` | **НОВ** — 16 unit теста за warranty функционалност |

---

## Препоръки за допълнителни тестове

### Search логика
1. **QUIRK-2 fix** — `saveRecentSearch` да трим-ва преди `if (!q)` check; добави тест след fix
2. **QUIRK-1 fix** — fuzzy path да не активира ако всички токени са < 3 chars; добави regression тест
3. **`renderDropdown` DOM тест** — stub `escHtml`, `fmtEur`, `fmtBgn`, `_sdCtrlHtml` и тествай dropdown HTML output
4. **`doFullSearch` тест** — проверява дали `showSearchResultsPage` се извиква с правилния query
5. **keyboard navigation** — ArrowDown/Up/Enter/Escape на `#searchInput`

### Общи
6. **E2E тест** — Playwright: търсене → проверка на dropdown резултати в браузъра
7. **E2E тест** — Playwright: кликване footer → "Гаранция" → warrantyPage
8. **Mobile responsive** — warranty hero при 375px viewport
