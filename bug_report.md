# Bug Report — mostcomputers.bg
Дата: 2026-04-08 | Тестове след fix: 185/185 ✅

---

## 🔴 Critical

### BUG-001 — XSS в product cards (cards.js)
**Файл:** js/cards.js:7,18,22,23  
**Проблем:** `p.name`, `p.brand`, `p.img` се вкарват в `alt=""`, `aria-label=""` и innerHTML без escaping. При XML импорт с crafted продуктово ime (`Test" onmouseover="alert(1)`) може да се изпълни произволен JS.  
**Fix:** Добавен `escHtml()` за `p.name` (→ `_eName`), `p.brand` и `p.img` в `makeCard()`.

### BUG-002 — XSS в search dropdown (search.js)
**Файл:** js/search.js:176,178  
**Проблем:** `p.name` и `p.brand` се рендират в innerHTML на dropdown без escaping.  
**Fix:** `highlightMatch(escHtml(p.name), q)` и `escHtml(p.brand)`.

### BUG-003 — Null dereference в submitOrder (cart.js)
**Файл:** js/cart.js:362-363, 368-369  
**Проблем:** `document.getElementById(id)` директно се ползва без null check. Ако DOM елементът липсва — TypeError crash при checkout.  
**Fix:** Добавен `if (!el) return;` преди всяко ползване.

---

## 🟠 Major

### BUG-004 — localStorage без try/catch при поръчка (cart.js)
**Файл:** js/cart.js:387  
**Проблем:** `JSON.parse(localStorage.getItem('mc_orders'))` без try/catch в setTimeout на submitOrder. В private browsing или при full localStorage, хвърля изключение и поръчката не се записва.  
**Fix:** Обвито в try/catch.

### BUG-005 — localStorage без try/catch в countdown (gallery.js)
**Файл:** js/gallery.js:261,264  
**Проблем:** Flash sale countdown IIFE чете/пише localStorage без защита. В Safari ITP или private mode — crash при зареждане.  
**Fix:** Добавени try/catch около двете localStorage операции.

---

## 🟡 Minor

### BUG-006 — Двоен `class` атрибут на tyPromoRow (index.html)
**Файл:** index.html:2261  
**Проблем:** `<div class="ty-total-row" id="tyPromoRow" class="is-hidden">` — двата `class` атрибута са невалидни HTML. Браузърът ползва само първия — `is-hidden` се игнорира, редът е видим при зареждане на thank-you страницата.  
**Fix:** Обединено в `<div class="ty-total-row is-hidden" id="tyPromoRow">`.

---

## 🟢 Observations (не са бъгове)

- Дублираните ID-та `bn-home`, `bn-cart` и т.н. са умишлени — JS ги обработва с `querySelectorAll`. OK.
- `100vh` в admin sidebar е последвано от `100dvh` — правилен Safari fix. OK.
- `escHtml()` е дефинирана в currency.js и е достъпна глобално. OK.
- Всички cart/wishlist/auth localStorage операции са в try/catch. OK.
