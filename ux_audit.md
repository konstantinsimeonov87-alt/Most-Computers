# 🎨 UX/UI Одит — Most Computers
**Дата:** 2026-04-24 | **Агент:** UX Auditor

---

## Оценки по категории

| Категория | Оценка | Trend |
|-----------|--------|-------|
| 🎨 Visual Design | **8/10** | ↑ (от 7) |
| 🖱️ Usability | **8/10** | → |
| ♿ Accessibility | **8/10** | ↑ (от 6 — след fixes) |
| 📱 Mobile UX | **7/10** | → |
| 💰 Conversion | **7/10** | → |
| **OVERALL** | **7.6/10** | ↑ |

---

## 🎨 Visual Design (8/10)

### ✅ Добро
- **Дизайн система**: Пълна CSS variable система — `--radius: 12px`, `--shadow`, `--shadow-hover`, `--primary: #bd1105` — консистентна навсякъде
- **Product cards**: Hover ефект с `translateY(-3px)` + shadow transition — polished feel
- **Badge система**: `sale` / `new` / `hot` / `-X%` / `Изчерпан` — ясна йерархия
- **Hero slider**: Три слайда с gradient backgrounds, 320px височина — визуално силен
- **Typography**: Bold weights (700, 800, 900) за ценови елементи — правилна йерархия
- **Dark mode**: Пълна поддръжка с semantic color tokens

### ⚠️ Проблеми
- **UX-001**: Dark mode е деактивиран на мобилни устройства (≤768px) — нарушава очакването на потребители, свикнали с dark mode на телефон
- **UX-002**: Два `<h1>` тага — основна страница + продуктова страница едновременно в DOM (semantic inconsistency)

---

## 🖱️ Usability (8/10)

### ✅ Добро
- **Product grid**: `auto-fill minmax(240px, 1fr)` — адаптивна решетка без JS
- **Cart panel**: Slide-in от дясно (380px), cubic-bezier анимация — smooth и стандартен pattern
- **Quick order**: Прост 2-field form (Ime + Tel) за минимален friction
- **Add-to-cart CTA**: `min-height: 48px`, primary red — ясно видим
- **Breadcrumbs**: Динамично показвани при навигация
- **Search**: Live dropdown с debounce — отзивчив
- **Recently viewed**: Persistant в sidebar — добър retention UX

### ⚠️ Проблеми
- **UX-003**: Checkout форма е дълга (3 стъпки) — без progress indicator на Desktop страницата (само в `cp-overlay`)
- **UX-004**: Бутонът за сравнение (`Сравни`) е с inline стилове вместо CSS клас — трудно за поддръжка, не следва дизайн системата

---

## ♿ Accessibility (8/10)
*(Пълен WCAG одит в `a11y_report.md`)*

### Fixed в тази сесия (2026-04-24)
- Mobile drawer close button — добавен `aria-label` ✅
- Accordion toggles — добавен `aria-expanded` ✅
- 7 checkout inputs — добавен `for` атрибут на labels ✅

### Оставащ проблем
- 30 `outline: none` override-а — може да компрометира keyboard focus visibility за edge cases

---

## 📱 Mobile UX (7/10)

### ✅ Добро
- **Bottom tab bar**: 5 tab-а (Начало, Категории, Търсене, Кошница, Профил) — thumb-zone достъпни
- **Touch targets**: 44px minimum на повечето бутони (add-to-cart, nav icons)
- **2-column grid**: На ≤768px продуктите са в 2 колони — добре
- **Hamburger меню**: Drawer от ляво с accordion категории
- **Mobile search**: Full-width overlay при търсене

### ⚠️ Проблеми
- **UX-005**: Dark mode изключен на мобилни — `// Dark Mode persistence (disabled on mobile — dark mode requires ≥769px)`
- **UX-006**: `min-height: 100vh` в admin layout без `100dvh` — address bar на мобилни може да отреже съдържание (ENH-005)
- **UX-007**: Hero slider на мобилен е 260px — малко за visually-led UX; текстът може да е притеснен
- **UX-008**: Accordion в мобилното меню — sub-accordion toggles нямат `aria-expanded` (само root accordion fixed)

---

## 💰 Conversion (7/10)

### ✅ Trust & Urgency Елементи
- ⭐ Rating + брой ревюта на всяка карта
- 🔴 `-X%` badge при намалени продукти
- 🏷️ `Промо` / `Ново` / `Горещо` badge-ове
- ✉️ Newsletter с -5% incentive (after purchase)
- 📦 Schema.org `InStock` / `OutOfStock` микроданни

### ⚠️ Липсващи Conversion Елементи
- **UX-009**: Нняма delivery time estimate на продуктовите карти ("Доставка до 2 работни дни")
- **UX-010**: Нняма social proof counter ("X души са купили тази седмица")
- **UX-011**: Wishlist бутонът е малък (15×15px сърце), невидим докато не се hover — много потребители не го намират
- **UX-012**: `Изчерпан` badge не предлага "Извести ме" CTA на самата карта (само в продуктовата страница)

---

## 🎯 Приоритизиран Action Plan

| # | Проблем | Приоритет | Усилие | Очакван ефект |
|---|---------|-----------|--------|---------------|
| 1 | UX-005: Dark mode на мобилни | 🟡 Medium | Малко | UX consistency |
| 2 | UX-008: Sub-accordion aria-expanded | 🔴 High (A11Y) | Малко | WCAG AA |
| 3 | UX-009: Delivery estimate на карти | 🟡 Medium | Малко | +conversion |
| 4 | UX-011: Wishlist бутон по-видим | 🟡 Medium | Средно | +engagement |
| 5 | UX-004: Compare btn inline styles | 🟢 Low | Малко | Maintainability |
| 6 | UX-006: 100dvh за admin | 🟢 Low | Малко | Mobile admin |
| 7 | UX-010: Social proof counter | 🟢 Low | Голямо | +conversion |

---

## Детайлни Препоръки

### Fix UX-008 (Critical — A11Y) — Sub-accordion aria-expanded
```html
<!-- Всички mob-sub-accordion-toggle бутони трябва да имат: -->
<button class="mob-sub-accordion-toggle"
  onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open');this.setAttribute('aria-expanded',this.classList.contains('open'))"
  type="button" aria-expanded="false">
```

### Fix UX-005 — Dark mode на мобилни
```js
// В ui.js — премахни условието за ≥769px
// Преди:
if (window.innerWidth >= 769) { applyTheme(saved); }
// След:
applyTheme(saved); // Без viewport ограничение
```

### Fix UX-009 — Delivery estimate
```js
// В cards.js — добави след price блока:
`<div class="card-delivery-hint">🚚 Доставка 1-2 работни дни</div>`
```
