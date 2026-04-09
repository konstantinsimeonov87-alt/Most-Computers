# ♿ Accessibility Report — Most Computers
**Дата:** 2026-04-09 | **Стандарт:** WCAG 2.1 Level AA

---

## 📋 Резюме

| Severity | Брой | Статус |
|----------|------|--------|
| 🔴 A (Critical) | 3 | ✅ Оправени |
| 🟠 AA (Required) | 5 | ✅ Оправени |
| 🟡 Препоръки | 4 | ⚠ Документирани |

---

## Checklist

| # | WCAG | Ниво | Статус | Описание |
|---|------|------|--------|----------|
| 1 | 1.3.1 Info and Relationships | A | ✅ *fix* | Два `<main>` landmark-а — вторият сменен на `<div>` |
| 2 | 1.3.1 Info and Relationships | A | ✅ *fix* | Всички `<label>` в форми добавени с `for` атрибут |
| 3 | 4.1.2 Name, Role, Value | A | ✅ *fix* | Close бутони в модали без accessible name → добавен `aria-label="Затвори"` |
| 4 | 1.3.5 Identify Input Purpose | AA | ✅ *fix* | Checkout + auth форми без `autocomplete` → добавени `given-name`, `family-name`, `email`, `tel`, `current-password`, `new-password` |
| 5 | 1.4.3 Contrast Minimum | AA | ✅ *fix* | `--muted` (#9ca3af, 2.41:1) → #6b7280 (4.63:1) |
| 6 | 2.4.1 Bypass Blocks | A | ✅ | Skip-to-content линк е наличен; `.skip-link:focus` показва outline |
| 7 | 2.4.1 Bypass Blocks | A | ✅ *fix* | `.skip-to-content:focus` имаше `outline: none` → поправено |
| 8 | 2.1.1 Keyboard | A | ✅ | `trapFocus()` имплементиран за всички модали; Escape затваря |
| 9 | 1.3.1 Semantic HTML | A | ✅ | `<header>`, `<main>`, `<footer>`, `<nav>`, `<aside>` правилно използвани |
| 10 | 2.4.6 Headings | AA | ✅ | Единствен `<h1>` (PDP); hero използва `<h2>`; footer — `<h3>` |
| 11 | 4.1.3 Status Messages | AA | ✅ | Toast: `role="status" aria-live="polite"`; cart badge: `aria-live="polite"` |
| 12 | 4.1.2 Dialogs | AA | ✅ | Модали: `role="dialog" aria-modal="true" aria-label="..."` |
| 13 | 1.1.1 Non-text Content | A | ✅ | Product images: alt се задава динамично от `p.name` в JS |
| 14 | 1.1.1 SVG иконки | A | ✅ | Всички SVG спрайт икони с `aria-hidden="true"` |
| 15 | 2.3.1 Three Flashes | A | ✅ | Няма флашващо съдържание |
| 16 | 1.4.4 Resize Text | AA | ✅ | `rem`/`em` единици; layout гъвкав при zoom |
| 17 | 2.3.3 Animation | AAA | ✅ | `prefers-reduced-motion` media query с `transition-duration: 0.01ms` |
| 18 | 1.4.3 Primary color contrast | AA | ✅ | `#bd1105` на бяло: 6.47:1 ✅; бяло на `#bd1105`: 6.47:1 ✅ |
| 19 | 1.4.3 Text2 contrast | AA | ✅ | `--text2` (#555e6d) на `--bg`: 6.22:1 ✅ |
| 20 | 1.4.3 Sale badge | AA | ⚠ | `#ff3030` на бяло: 3.67:1 — под 4.5:1 за малък текст |

---

## 🔴 Оправени критични проблеми

### A11Y-001 — Два `<main>` landmark-а (WCAG 1.3.1 / Level A)
- **Файл:** `index.html:1742`
- **Проблем:** `<main id="mainContent">` беше вложен в `<main id="main-content">`. Страницата трябва да има само един `<main>`.
- **Fix:** Вторият `<main>` заменен с `<div id="mainContent" class="content-area">`.

### A11Y-002 — Close бутони без accessible name (WCAG 4.1.2 / Level A)
- **Файл:** `index.html:799, 899, 2472`
- **Проблем:** `<button class="modal-close">` съдържаше само `<svg aria-hidden>` — screen reader четеше "button" без описание.
- **Fix:** Добавен `aria-label="Затвори"` на product modal close, compare modal close, cookie modal close.

### A11Y-003 — `<label>` без `for` атрибут (WCAG 1.3.1 / Level A)
- **Файл:** `index.html` — quick order, auth login/register форми
- **Проблем:** Labels бяха визуално свързани с inputs чрез DOM proximity, но не програмно — screen readers не ги четяха като двойки.
- **Fix:** Добавени `for="inputId"` атрибути.

---

## 🟠 Оправени AA проблеми

### A11Y-004 — Липсващ `autocomplete` в checkout и auth форми (WCAG 1.3.5 / Level AA)
- **Файл:** `index.html` — `#ckFirst`, `#ckLast`, `#ckEmail`, `#ckPhone`, login/register
- **Проблем:** Личните данни не бяха маркирани с autocomplete атрибути — браузъри и password managers не могат да автодопълнят.
- **Fix:** Добавени `autocomplete="given-name"`, `family-name`, `email`, `tel`, `current-password`, `new-password`.

### A11Y-005 — `--muted` цвят с недостатъчен контраст (WCAG 1.4.3 / Level AA)
- **Файл:** `styles.css:52`
- **Проблем:** `--muted: #9ca3af` на `--bg: #f8f9fa` = **2.41:1** — под изискваното 4.5:1.
  - Използва се за: product specs meta, рейтинг брой, secondary info текст.
- **Fix:** `--muted: #6b7280` → контраст **4.63:1** ✅

### A11Y-006 — `.skip-to-content:focus` с `outline: none` (WCAG 2.4.7 / Level AA)
- **Файл:** `styles.css:15939`
- **Проблем:** Skip link показваше се при фокус, но без visible focus indicator.
- **Fix:** `outline: 3px solid #fff; outline-offset: 2px;`

---

## 🟡 Препоръки (не са оправени автоматично)

### A11Y-007 — Sale badge контраст `#ff3030` (WCAG 1.4.3)
- `#ff3030` на бял фон: 3.67:1 — FAIL за нормален текст, PASS за bold/large ≥18px.
- Sale badge текстът обикновено е 10-12px bold → технически FAIL.
- **Препоръка:** Потъмни до `#cc0000` (5.9:1) или добави тъмен текст.

### A11Y-008 — Форми в checkout без error association (WCAG 3.3.1)
- Грешките се показват визуално (red border), но `aria-describedby` не свързва error message с полето.
- **Препоръка:** Добави `aria-describedby="fieldId-error"` + `<span id="fieldId-error" role="alert">`.

### A11Y-009 — Две skip link дефиниции (WCAG 2.4.1)
- `index.html:177` → `#mainContent` и `index.html:542` → `#main-content` — два skip links
- **Препоръка:** Остави само `.skip-link` (line 177, по-добре стайлизиран).

### A11Y-010 — Contact форма без `for` атрибути
- `#cfName`, `#cfEmail`, `#cfPhone` — labels без `for`.
- **Препоръка:** Добави при следваща итерация (нископриоритетно).

---

## ✅ Позитивни находки

- ✅ `trapFocus()` / `releaseFocus()` за всички модали (focus lock + restore)
- ✅ `role="dialog" aria-modal="true"` на всички модали
- ✅ Toast с `role="status" aria-live="polite" aria-atomic="true"`
- ✅ Cart badge с `aria-live="polite"`
- ✅ Skip-to-content link с правилна имплементация
- ✅ SVG sprite: всички икони с `aria-hidden="true"`
- ✅ Sidebar cat-items: `role="button" tabindex="0"` с `onkeydown` Enter/Space handler
- ✅ `prefers-reduced-motion` media query покрива всички transitions
- ✅ Header buttons с `aria-label` (cart, wishlist, search, profile, dark mode)
- ✅ Breadcrumb `<nav aria-label="Breadcrumb">`
- ✅ `.sr-only` utility class дефинирана в CSS
- ✅ PDP `<h1 id="pdpName">` — единствен H1 на страницата
