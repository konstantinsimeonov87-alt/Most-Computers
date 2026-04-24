# ♿ Accessibility Report — Most Computers (WCAG 2.1 AA)
**Дата:** 2026-04-24 | **Агент:** Accessibility Auditor | **Стандарт:** WCAG 2.1 AA

---

## Резюме

| Ниво | Намерени | Fixed | Отворени |
|------|----------|-------|---------|
| 🔴 A (Critical) | 3 | 3 | 0 |
| 🟠 AA (Required) | 1 | 0 | 1 |
| ✅ Преминати | 14+ | — | — |

---

## WCAG Checklist

| # | WCAG критерий | Ниво | Статус | Описание |
|---|---|---|---|---|
| 1 | 1.1.1 Non-text Content | A | ✅ PASS | Product card images имат `alt="${продуктово_име}"` (динамично) |
| 2 | 1.1.1 Non-text Content | A | ✅ PASS | SVG иконки имат `aria-hidden="true"` навсякъде |
| 3 | 1.3.1 Info and Relationships | A | ✅ FIXED | Checkout labels без `for` → добавен `for` на ckAddr/ckZip/ckNote/ckCardNum/ckCardName/ckCardExp/ckCardCvv |
| 4 | 1.3.1 Landmarks | A | ✅ PASS | `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>` — всички използвани |
| 5 | 1.4.3 Contrast (Minimum) | AA | ✅ PASS | `--text` (#1a1a1a) на `--bg` (#f8f9fa) ≈ 17:1 |
| 6 | 1.4.3 Contrast | AA | ✅ PASS | `--primary` (#bd1105) на бяло (#fff) ≈ 6.4:1 |
| 7 | 1.4.3 Contrast | AA | ✅ PASS | `--muted` (#626878) на `--bg` ≈ 5.4:1 (коментар в CSS потвърждава) |
| 8 | 1.4.4 Resize text | AA | ✅ PASS | Responsive layout — zoom до 200% работи |
| 9 | 2.1.1 Keyboard | A | ✅ FIXED | Mobile drawer close: добавен `aria-label="Затвори меню"` |
| 10 | 2.1.1 Keyboard | A | ✅ FIXED | Accordion toggles: добавен `aria-expanded="false"` с runtime toggle |
| 11 | 2.4.1 Bypass Blocks | A | ✅ PASS | Skip link „Прескочи към съдържанието" присъства (line 239) |
| 12 | 2.4.2 Page Titled | A | ✅ PASS | Title: „Most Computers — Лаптопи, телефони, компютри" (59 chars) |
| 13 | 2.4.7 Focus Visible | AA | ⚠️ PARTIAL | Глобален `:focus-visible` дефиниран, но 30 `outline: none` могат да override-нат |
| 14 | 3.1.1 Language of Page | A | ✅ PASS | `<html lang="bg">` |
| 15 | 3.3.1 Error Identification | A | ✅ PASS | Error messages с `role="alert"` и `aria-describedby` |
| 16 | 3.3.2 Labels or Instructions | A | ✅ PASS | Всички inputs имат `<label for="...">` или `aria-label` |
| 17 | 4.1.2 Name, Role, Value | A | ✅ PASS | Диалози: `role="dialog"`, `aria-modal="true"`, `aria-label` |
| 18 | 4.1.3 Status Messages | AA | ✅ PASS | Toast: `role="status"`, `aria-live="polite"`, `aria-atomic="true"` |
| 19 | 2.3.1 Three Flashes | A | ✅ PASS | Без flickering/flash контент |
| 20 | 1.4.12 Text Spacing | AA | ✅ PASS | CSS не хардкодира `line-height` в px |
| 21 | 2.5.3 Label in Name | A | ✅ PASS | Видимите текстове съответстват на `aria-label` стойностите |

---

## 🔴 Fixed Issues

### A11Y-001 — Mobile menu close button без accessible name ✅ Fixed
- **Файл:** `index.html:608`
- **Проблем:** `<button class="mob-drawer-close">` имаше само `<svg aria-hidden="true">` — нямаше достъпно ime
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Fix:** Добавен `aria-label="Затвори меню"`

### A11Y-002 — Accordion toggles без aria-expanded ✅ Fixed
- **Файл:** `index.html:655`
- **Проблем:** `mob-accordion-toggle` не съобщаваше expanded/collapsed state на screen readers
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Fix:** Добавен `aria-expanded="false"` + runtime toggle в onclick handler

### A11Y-003 — Checkout форма с неасоциирани labels ✅ Fixed
- **Файл:** `index.html:2242-2286`
- **Проблем:** `<label>Адрес *</label>` без `for` — не е свързан с `<input id="ckAddr">`
- **Засегнати:** ckAddr, ckZip, ckNote, ckCardNum, ckCardName, ckCardExp, ckCardCvv
- **WCAG:** 1.3.1 Info and Relationships (Level A)
- **Fix:** Добавен `for="..."` на всички засегнати label елементи

---

## 🟠 Open Issues

### A11Y-004 — 30 `outline: none` overrides (AA — Low priority)
- **Файл:** `styles.css` (30 места)
- **Проблем:** Component-specific `outline: none` на `:focus` може да override глобалния `:focus-visible`
- **WCAG:** 2.4.7 Focus Visible (Level AA)
- **Препоръка:** Замени с `outline: none` само на `:focus:not(:focus-visible)` pattern

---

## ✅ Добри практики (вече в сайта)

- **sr-only клас** дефиниран и използван (screen-reader-only текстове)
- **prefers-reduced-motion** с wildcard `*` (line 15031) — изключва всички анимации
- **autocomplete атрибути**: `email`, `tel`, `given-name`, `family-name`, `street-address`, `postal-code`
- **aria-live regions**: toast (`polite`) и error spans (`role="alert"`) правилно имплементирани
- **focus trap в модали**: `role="dialog"` + `aria-modal="true"` навсякъде
- **Emoji fallback**: `aria-hidden="true"` — не се четат от screen readers

---

## Тестове след fix
- ✅ 185/185 Jest тестове
- ✅ Build успешен
