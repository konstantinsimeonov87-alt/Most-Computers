# 🐛 Bug Report — mostcomputers.bg
**Дата:** 2026-03-31  
**Метод:** Статичен анализ на source файловете в `js/`

---

## 📊 Обобщение

| Severity | Брой |
|----------|------|
| 🔴 Critical | 5 |
| 🟠 Major | 5 |
| 🟡 Minor | 7 |
| **Общо** | **17** |

---

## 🔴 Critical

### BUG-001 — Null crash в compare modal (gallery.js)
**Файл:** `js/gallery.js` ~line 177  
**Описание:** `compareList.map(id => products.find(...))` може да върне `undefined` в масива, ако продукт е изтрит. После `.flatMap(p => Object.keys(p.specs))` краш-ва с "Cannot read property 'specs' of undefined".  
**Стъпки:** Добави продукт в сравнение → изтрий го от каталога → отвори compare modal → краш  
**Fix:**
```javascript
// Добави .filter(Boolean) след .map()
const prods = compareList.map(id => products.find(x => x.id === id)).filter(Boolean);
```

---

### BUG-002 — Null crash в compare bar (gallery.js)
**Файл:** `js/gallery.js` ~line 167  
**Описание:** В loop-а за рендериране на compare bar, `products.find()` може да върне `undefined`, после `p.emoji` и `p.name` краш-ват.  
**Fix:**
```javascript
const p = products.find(x => x.id === compareList[i]);
if (!p) { compareList.splice(i, 1); renderCompareBar(); return; }
```

---

### BUG-003 — JSON.parse без try-catch при init (search.js)
**Файл:** `js/search.js` line 2  
**Описание:** `JSON.parse(localStorage.getItem('mc_recent') || '[]')` — ако localStorage е корумпиран (невалиден JSON), целият search модул не се инициализира и страницата гърми при стартиране.  
**Fix:**
```javascript
let recentSearches = [];
try {
  recentSearches = JSON.parse(localStorage.getItem('mc_recent') || '[]');
} catch(e) {
  localStorage.removeItem('mc_recent');
}
```

---

### BUG-004 — Null crash при cookie checkboxes (ui.js)
**Файл:** `js/ui.js` ~lines 48-50  
**Описание:** `document.getElementById('ck-analytics').checked` краш-ва ако елементите не са в DOM при извикване на функцията (напр. при бързо зареждане).  
**Fix:**
```javascript
analytics: document.getElementById('ck-analytics')?.checked || false,
marketing: document.getElementById('ck-marketing')?.checked || false,
functional: document.getElementById('ck-functional')?.checked || false,
```

---

### BUG-005 — Math.min/max на потенциално празен масив (gallery.js)
**Файл:** `js/gallery.js` ~line 179  
**Описание:** `Math.min(...prods.map(p=>p.price))` — ако `prods` е празен, резултатът е `Infinity` и highlight логиката се чупи.  
**Fix:** Добави guard: `if (prods.length < 2) return;` преди math операциите.

---

## 🟠 Major

### BUG-006 — EUR_RATE може да стане NaN (currency.js)
**Файл:** `js/currency.js` line 2  
**Описание:** `parseFloat(localStorage.getItem('eurRate'))` — ако стойността е "null" (стринг) или невалидна, `parseFloat` връща NaN. После `p.price / EUR_RATE` = NaN навсякъде в filters.js.  
**Fix:**
```javascript
let EUR_RATE = parseFloat(localStorage.getItem('eurRate')) || 1.95583;
if (isNaN(EUR_RATE)) EUR_RATE = 1.95583;
```

---

### BUG-007 — Duplicate event listeners при search (search.js)
**Файл:** `js/search.js` ~lines 305-334  
**Описание:** `addEventListener('input')`, `('keydown')`, `('focus')` се добавят всеки път при извикване. Ако init функцията се вика повторно, handlers се натрупват → всеки keypress тригерва N хендлъра.  
**Fix:**
```javascript
if (searchInput && !searchInput._listenersAttached) {
  searchInput.addEventListener('input', ...);
  // ...
  searchInput._listenersAttached = true;
}
```

---

### BUG-008 — Дублирана функция initScrollAnimations
**Файлове:** `js/ui.js` и `js/filters.js`  
**Описание:** Две различни дефиниции на `initScrollAnimations()`. Втората (в filters.js) overwrite-ва първата, може да счупи scroll анимациите от ui.js.  
**Fix:** Преименуй едната или обедини логиките.

---

### BUG-009 — Null check липсва в compare slot (ui.js)
**Файл:** `js/ui.js` ~line 341  
**Описание:** `const p = products.find(x => x.id === id)` — после директен достъп до `p.emoji` и `p.name` без проверка дали `p` съществува.  
**Fix:** Добави `if (!p) return;` или `if (!p) continue;` след find.

---

### BUG-010 — Ключ без default в payNames обект (multiple)
**Файлове:** `js/pages.js` и др.  
**Описание:** `payNames[ckPaymentType]` — ако `ckPaymentType` е невалидна стойност, резултатът е `undefined` и се показва празно поле.  
**Fix:**
```javascript
document.getElementById('tyPayment').textContent = payNames[ckPaymentType] || 'Неизвестно';
```

---

## 🟡 Minor

### BUG-011 — Потенциален XSS в ревюта (pages.js)
**Файл:** `js/pages.js`  
**Описание:** Потребителски review текст се записва в localStorage и рендерира — трябва да се провери дали се ескейпва преди `innerHTML`. Ако не — `<img src=x onerror="...">` може да изпълни код.  
**Fix:** Провери, че `escapeHTML()` се прилага към `r.text` и `r.name` при рендериране.

---

### BUG-012 — Typo в toast съобщение (pages.js)
**Файл:** `js/pages.js` ~line 172  
**Описание:** `'⚠️ Въведи своето ime'` — "ime" трябва да е "име".

---

### BUG-013 — Floating point в cart progress bar (cart.js)
**Файл:** `js/cart.js`  
**Описание:** `(total/FREE_SHIP_BGN)*100` може да даде 99.9999... вместо 100 при точна стойност.  
**Fix:** `Math.min(100, Math.round((total/FREE_SHIP_BGN)*10000)/100)`

---

### BUG-014 — Отрицателно количество при бърз двоен клик (cart.js)
**Файл:** `js/cart.js` `changeQty()`  
**Описание:** При много бърз двоен клик на "-" qty може моментно да стане отрицателно.  
**Fix:** `i.qty = Math.max(0, i.qty + d);`

---

### BUG-015 — Cart hidden check само по display (cart.js)
**Файл:** `js/cart.js`  
**Описание:** `?.style.display!=='none'` не улавя hidden чрез `visibility:hidden` или CSS класове.  
**Impact:** Ниско — в текущия код display е единственият метод за скриване.

---

### BUG-016 — filters.js: директен [0] без guard
**Файл:** `js/filters.js` ~line 160  
**Описание:** `products.filter(p=>p.badge==='new')[0]` — ако няма такъв продукт, `[0]` е `undefined` и после property access гърми.  
**Fix:**
```javascript
const newP = products.filter(p => p.badge === 'new' || p.badge === 'hot')[0];
if (newP) { ... }
```

---

### BUG-017 — gallery.js: Math.min/Math.max с 0 продукта
**Файл:** `js/gallery.js`  
**Описание:** Ако compare modal се отвори с 0 продукта (edge case), `Math.min(...[])` = `Infinity`.  
**Fix:** Guard преди math операциите.

---

## 🎯 Топ 4 — Оправи първо

| Приоритет | Бъг | Файл | Промяна |
|-----------|-----|------|---------|
| 1 | BUG-003 | `js/search.js:2` | try-catch за JSON.parse |
| 2 | BUG-001 | `js/gallery.js:177` | .filter(Boolean) след .map() |
| 3 | BUG-006 | `js/currency.js:2` | isNaN guard за EUR_RATE |
| 4 | BUG-004 | `js/ui.js:48-50` | Optional chaining за checkboxes |
