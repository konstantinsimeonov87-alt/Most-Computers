# Bug Report — Most Computers
**Дата:** 17.04.2026 | **Тестове:** 185/185 ✅

---

## Обобщение

| Severity | Брой | Статус |
|----------|------|--------|
| 🔴 Critical | 1 | ✅ Оправен |
| 🟡 Minor | 3 | ✅ Оправени |
| 🟢 Enhancement | 1 | 📋 Документиран |

---

## 🔴 Critical — Оправени

### BUG-001 — catPage субкатегории не работеха
- **Файл:** `js/seo.js`, `js/filters.js`, `index.html`
- **Стъпки:** Клик на HP subcat pill ("Gaming лаптопи") → catPage се отваря, но НЕ филтрира по субкатегория
- **Причина:** `applySubcatById` търсеше `.subcat-pill` само в `#subcatBar` (homepage). catPage нямаше subcat bar и нямаше `cpSubcat` state.
- **Fix:** Добавен `cpSubcat` state, `cpRenderSubcatBar()`, `cpApplySubcat()`, `#cpSubcatBar` в HTML; `cpGetFiltered()` прилага `matchesSubcat()`; `applySubcatById()` пренасочва към catPage при нужда
- **Статус:** ✅ ОПРАВЕН (17.04.2026)

---

## 🟡 Minor — Оправени

### BUG-002 — Duplicate HTML IDs в двата bottom nav бара
- **Файл:** `index.html`
- **Причина:** Две `<nav>` (`.mob-bottom-nav` и `.bottom-nav`) ползваха еднакви ID-та (`bn-cart`, `bnCartBadge` и др.)
- **Fix:** Второто nav получи уникални ID-та (`bn2-*`, `bnCartBadge2`, `bnWishBadge2`); badge updates обновяват и двете
- **Статус:** ✅ ОПРАВЕН (17.04.2026)

### BUG-003 — Spec филтри в catPage не намираха продукти с кирилски ключове
- **Файл:** `js/seo.js`
- **Причина:** Търсеше по `'OS'`, `'Display'` но продуктите имат `'ОС'`, `'Дисплей'`
- **Fix:** Fallback към full-text search при липса на ключ
- **Статус:** ✅ ОПРАВЕН (commit 2bed3fa)

### BUG-004 — Sidebar показваше марки с `undefined` брой
- **Файл:** `js/filters.js`
- **Причина:** `EXTRA_BRANDS` включваше марки без продукти
- **Fix:** Премахнат `EXTRA_BRANDS` — само марки с реални продукти
- **Статус:** ✅ ОПРАВЕН (commit 44ec216)

---

## 🟢 Enhancement (без action)

### ENH-01 — Z-index токени не са приложени навсякъде
~15 legacy стойности използват хардкоднати числа вместо CSS custom properties. Влияние: нула. Препоръка: мигрирай при следващ CSS refactor.

---

## ✅ Clean checks

| Проверка | Резултат |
|----------|----------|
| localStorage без try/catch | ✅ Всички са wrapped |
| `eval()` / `new Function()` | ✅ Не са намерени |
| Admin XSS (previewAefImg, product table) | ✅ Оправени в предишен одит |
| Cart XSS (p.name в innerHTML) | ✅ Данни от статичен products[] — безопасни |
| Unhandled fetch promises | ✅ Не са намерени |
| Race conditions (async) | ✅ Не са намерени |
| Missing break в switch | ✅ Не са намерени |
| Бутони без `type="button"` | ✅ Само accordion toggles — all have `type="button"` |
