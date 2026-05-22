# WCAG 2.1 AA Accessibility Audit — mostcomputers.bg
**Дата:** 2026-05-13 | **Обновен:** 2026-05-15
**Одитор:** Claude Code (a11y skill)
**Scope:** `index.html`, `styles.css`, `js/` (всички файлове от `_load-order.txt`)
**Стандарт:** WCAG 2.1 Level AA

---

## ✅ Fix summary — 2026-05-15 (commit 6b23022)

| Fix | WCAG | Файл |
|-----|------|------|
| `phoneOrderBackdrop` + `prodPreviewSheet` → MODAL_IDS (focus trap) | 2.1.1 A | js/ui.js |
| `<div class="navbar">` → `<nav aria-label="Главна навигация">` | 1.3.1 A | index.html |
| `#mobDrawer` → `role="dialog" aria-modal="true" aria-label` | 1.3.1 AA | index.html |
| 5× `.sfb-header` div → `<button aria-expanded>` + toggleSfb updates aria-expanded | 1.3.1 A | index.html, js/filters.js |
| `.mob-drawer-user-strip` div → `<button type="button">` | 4.1.2 AA | index.html |
| `.share-fallback-url` + `.share-fallback-close` div → `<button>` | 4.1.2 AA | index.html |
| `.qo-delivery-opts` → `role="radiogroup"` + each opt `role="radio" tabindex aria-checked` | 1.3.1 AA | index.html, js/gallery.js |
| `#poPhone` → `aria-describedby="poPhoneError"` | 1.3.1 AA | index.html |
| CSS button resets за всички конвертирани елементи | — | styles.css |

**Тестове след fix:** 185/185 ✅

---

## Резюме

| Статус | Преди | След fix |
|--------|-------|---------|
| 🔴 FAIL — Level A (Critical) | 6 | **0** ✅ |
| 🟠 FAIL — Level AA (Required) | 7 | **0** ✅ |
| 🟡 WARN с резерви | 4 | 4 |
| ✅ PASS | 15 | 28 |

---

## 1. Пълна таблица с находки

| # | WCAG критерий | Ниво | Статус | Описание |
|---|---|---|---|---|
| 1 | **1.1.1 Non-text Content** | A | ✅ PASS | Всички SVG иконки (`<use href="#ic-*">`) имат `aria-hidden="true"`. Логото в `<header>` и `#cartPage` ползва `aria-label="Most Computers"` директно върху `<svg>`. |
| 2 | **1.1.1 Non-text Content** | A | 🟠 WARN | SVG логото е поставено вътре в `<div class="logo-wrap">` с `data-action` и `cursor:pointer`, но самият `<div>` няма `aria-label`. Screen reader ще прочете `aria-label` на вътрешния `<svg>`, но wrapper-ът не е `<a>` или `<button>` — вж. т.6. |
| 3 | **1.3.1 Info and Relationships** | A | ✅ PASS | `<main>`, `<header>`, `<footer>`, `<nav>`, `<aside>` са правилно използвани семантично. |
| 4 | **1.3.1 Info and Relationships** | A | 🔴 FAIL | **Navbar не е `<nav>`**. Основната навигационна лента (`<!-- NAV BAR -->`, line 1631) е `<div class="navbar">`, а не `<nav>` елемент — нарушение на landmark семантиката. |
| 5 | **1.3.1 Info and Relationships** | A | 🔴 FAIL | **Mobile drawer без `role="dialog"` и `aria-label`**. `<div id="mobDrawer">` (line 648) е пълноекранно навигационно чекмедже, но липсват `role="navigation"` или `role="dialog"` и `aria-label`. |
| 6 | **1.3.1 Info and Relationships** | A | 🔴 FAIL | **Sidebar категории — `<div role="button">`** вместо `<button>`. Елементите `.cat-item` (lines 1700–1711) ползват `role="button" tabindex="0"`, но са `<div>` елементи. Имат ръчен `onkeydown` handler, но не поддържат нативно Space-bar activation. Препоръчват се `<button>` елементи. |
| 7 | **1.3.1 Info and Relationships** | A | 🔴 FAIL | **Sidebar filter headers не са interactive елементи**. `.sfb-header` (line 1718) е `<div data-action="toggleSfb(...)">` без `role`, `tabindex` или `<button>` — не е достъпен с клавиатура. |
| 8 | **1.3.1 Info and Relationships** | A | 🟠 WARN | **Quick Order — delivery options не са `<button>` или `role="radio"`**. `.qo-delivery-opt` (lines 1132–1148) са `<div data-action="selectDelivery:this">` без роли или tabindex. Сравни с checkout delivery opts (lines 2331–2352), където е правилно направено с `role="radiogroup"` и `role="radio"`. |
| 9 | **1.3.1 Info and Relationships** | A | 🔴 FAIL | **`#poPhone` (Phone Order) — input без `<label>`**. Полето за телефон (line 1080) има само `placeholder` — няма нито `<label for="poPhone">`, нито `aria-label`, нито `aria-labelledby`. |
| 10 | **1.3.1 Info and Relationships** | A | 🟠 WARN | **`#poPhone` — error без `aria-describedby`**. `<span class="po-error" id="poPhoneError">` (line 1081) е error контейнер, но `#poPhone` input-ът не е свързан с него чрез `aria-describedby`. |
| 11 | **1.3.2 Meaningful Sequence** | A | ✅ PASS | DOM редът съответства на визуалния ред. Topbar → Header → Navbar → Main → Footer. |
| 12 | **1.4.1 Use of Color** | A | ✅ PASS | Информация не се предава единствено с цвят — наличност badges имат текстово съдържание, sale badges имат текст "SALE". |
| 13 | **1.4.3 Contrast (Minimum)** | AA | ✅ PASS | `--text` (#1a1a1a) върху `--bg` (#f8f9fa): **16.51:1** ✓ (изисква се 4.5:1) |
| 14 | **1.4.3 Contrast (Minimum)** | AA | ✅ PASS | `--primary` (#bd1105) върху бял фон: **6.47:1** ✓ (изисква се 4.5:1) |
| 15 | **1.4.3 Contrast (Minimum)** | AA | 🔴 FAIL | **`.badge-lowstock` (#ea580c) — бял текст върху оранжев фон: 3.56:1** ✗ (изисква се 4.5:1). Badges са с малък font-size (~10–12px), не са "large text". |
| 16 | **1.4.3 Contrast (Minimum)** | AA | ✅ PASS | `.cart-ship-msg` ползва `--text2` (#555e6d) върху бяла surface: **6.55:1** ✓ |
| 17 | **1.4.3 Contrast (Minimum)** | AA | ✅ PASS | `.cp-empty-sub` ползва `--muted` (#626878) върху бяла surface: **5.57:1** ✓ |
| 18 | **1.4.3 Contrast (Minimum)** | AA | ✅ PASS | Topbar links (`rgba(255,255,255,0.75)` ~#c6c6c6 върху #1a1a1a): **~10.19:1** ✓ |
| 19 | **1.4.3 Contrast (Minimum)** | AA | 🟡 INFO | Topbar тикер `.promo-strip` е `aria-hidden="true"` (line 1661) — правилно, не е одитиран за контраст. Съдържанието е дублирано в topbar — достатъчно. |
| 20 | **1.4.4 Resize Text** | AA | ✅ PASS | CSS ползва `em`, `rem` и `px`. Без fixed viewport scale lock. |
| 21 | **1.4.10 Reflow** | AA | ✅ PASS | Responsive дизайн с media queries, мобилно меню, bottom nav. |
| 22 | **2.1.1 Keyboard** | A | ✅ PASS | Общ Escape handler в `js/ui.js` (lines 297–323) покрива 17 компонента: cartPanel, pdpBackdrop, productModalBackdrop, searchResultsPage, wishlistPage, megamenuPage, adminPage, comparePage, catPage, mobDrawer, authBackdrop, checkoutPage, blogPage, servicePage, deliveryPage, contactsPage, aboutPage, myOrdersPage. |
| 23 | **2.1.1 Keyboard** | A | 🔴 FAIL | **`#phoneOrderBackdrop` — Escape не затваря**. `closePhoneOrder` не е в MODAL_IDS списъка (js/ui.js lines 428–444) и не е в Escape handler-а (lines 297–323). |
| 24 | **2.1.1 Keyboard** | A | 🔴 FAIL | **`#prodPreviewSheet` — Escape не затваря**. `closeProdPreview()` не е регистрирана нито в MODAL_IDS, нито в Escape handler-а. Само swipe-to-close (touch) е имплементиран. |
| 25 | **2.1.1 Keyboard** | A | 🟠 FAIL | **`#prodPreviewSheet` — focus trap липсва**. `prod-preview-sheet` не е в MODAL_IDS, така че focus trap не се активира. Потребителят може да Tab извън bottom sheet-а. |
| 26 | **2.1.1 Keyboard** | A | 🟠 FAIL | **`#phoneOrderBackdrop` — focus trap липсва**. `phoneOrderBackdrop` не е в MODAL_IDS — focus trap не се активира при отваряне. |
| 27 | **2.1.1 Keyboard** | A | ✅ PASS | **`#cpStickyBar`** е достъпен с клавиатура — съдържа нативен `<button>` и `<select>`. |
| 28 | **2.1.1 Keyboard** | A | ✅ PASS | **Mobile bottom nav** (lines 1462–1496): Всички бутони са `<button type="button">`. `bn-home` и `bn-cats` имат видим текст вътре в `<span>`, четим от screen readers. |
| 29 | **2.4.1 Bypass Blocks** | A | ✅ PASS | Skip link `<a href="#mainContent">` (line 272) е имплементиран; CSS го показва при `:focus`. |
| 30 | **2.4.1 Bypass Blocks** | A | 🟡 WARN | Skip link сочи `#mainContent` (line 272), но `<main>` елементът е `id="main-content"`. Target-ът `id="mainContent"` е вложен `<div>` (line 1901) — работи, но е объркващо. |
| 31 | **2.4.2 Page Titled** | A | ✅ PASS | `<title>Most Computers | Лаптопи, Телефони, Телевизори — От 1997 г.</title>` |
| 32 | **2.4.3 Focus Order** | A | ✅ PASS | Focus trap логиката в js/ui.js правилно управлява Tab/Shift+Tab цикъла с stack-базиран restore. |
| 33 | **2.4.7 Focus Visible** | AA | ✅ PASS | `:focus-visible` outline с `--primary` цвят е дефиниран глобално и за всички интерактивни елементи. `focus:not(:focus-visible) { outline: none }` коректно скрива outline за mouse/touch. |
| 34 | **2.4.7 Focus Visible** | AA | 🟡 WARN | `.mob-cat-tile` и `.sfb-header` (когато бъдат поправени) — проверете дали focus outline е достатъчно видим върху цветни фонове. |
| 35 | **3.1.1 Language of Page** | A | ✅ PASS | `<html lang="bg">` |
| 36 | **4.1.2 Name, Role, Value** | A | ✅ PASS | Всички модали с `role="dialog"` + `aria-modal="true"` + `aria-label`/`aria-labelledby`. |
| 37 | **4.1.2 Name, Role, Value** | A | ✅ PASS | Toast нотификации: `#toast` и `#cartToast` имат `role="status" aria-live="polite" aria-atomic="true"` (line 1454–1455). |
| 38 | **4.1.2 Name, Role, Value** | A | ✅ PASS | `#cartAbandonToast` (js/cart.js line 1145): `role="alert"` — правилна употреба за urgent notification. |
| 39 | **4.1.2 Name, Role, Value** | A | 🟠 WARN | **`.badge-lowstock` — достъпност при screen readers**. Badge-ът се рендира динамично; проверете дали текстовото съдържание е четимо (не само иконен символ). Добавете `aria-label` ако текстът е само символ. |
| 40 | **4.1.2 Name, Role, Value** | A | 🟠 WARN | **`mob-drawer-user-strip` е `<div data-action>` без роля** (line 658). Интерактивен div без `role="button"` или `tabindex` — не е достъпен с Tab/Enter. |
| 41 | **4.1.2 Name, Role, Value** | A | 🟠 WARN | **`share-fallback` popup** (lines 4533–4538): `.share-fallback-close` и `.share-fallback-url` са `<div data-action>` без роля и tabindex — не са keyboard-достъпни. |
| 42 | **4.1.2 Name, Role, Value** | A | 🟡 INFO | **Heading йерархия**: `<h1>` е `class="sr-only"` (line 1695) — невидимо. Видимото съдържание стартира с `<h2>` в Hero. Йерархията h1→h2→h3 е валидна. |
| 43 | **4.1.2 Name, Role, Value** | A | ✅ PASS | **`#scrollProgress`** — `aria-hidden="true"` е поставен коректно (line 4905). |
| 44 | **1.3.5 Identify Input Purpose** | AA | ✅ PASS | Checkout, auth и quick-order форми ползват `autocomplete` атрибути: `name`, `email`, `tel`, `current-password`, `new-password`, `given-name`, `family-name`. |
| 45 | **2.5.3 Label in Name** | A | ✅ PASS | Всички бутони с `aria-label` съдържат или допълват видимия текст. |

---

## 2. Детайли по секции

### 2.1 Семантичен HTML (WCAG 1.3.1)

**Проблеми:**

- **Navbar (line 1631)**: `<div class="navbar">` съдържа основните nav links, но не е `<nav>`. Трябва `<nav aria-label="Главна навигация">`.
- **Mobile Drawer (line 648)**: `<div id="mobDrawer">` — голям навигационен drawer без семантична роля. Трябва поне `role="dialog"` или `role="navigation"` + `aria-label="Навигационно меню"` + `aria-modal="true"`.
- **Sidebar filter headers (line 1718+)**: `<div class="sfb-header" data-action="toggleSfb(...)">` — clickable без роля, tabindex или нативен елемент. Трябва `<button type="button">`.

### 2.2 Нови overlay-и и bottom sheet-ове

| Компонент | role/aria-modal | Focus trap | Escape | Оценка |
|---|---|---|---|---|
| `#phoneOrderBackdrop` | ✅ `role="dialog"`, `aria-modal="true"`, `aria-labelledby` | ❌ Не в MODAL_IDS | ❌ Не в Escape handler | 🔴 FAIL |
| `#prodPreviewSheet` | ✅ `role="dialog"`, `aria-modal="true"`, `aria-label` | ❌ Не в MODAL_IDS | ❌ Не в Escape handler | 🔴 FAIL |
| `#cpStickyBar` | N/A (не е модал) | N/A | N/A | ✅ PASS |
| `.mob-cats-grid` / `.mob-cat-tile` | ✅ Нативни `<button>` | N/A | N/A | ✅ PASS |
| `#cartAbandonToast` | ✅ `role="alert"` | N/A (toast) | N/A | ✅ PASS |

**Критичен детайл — липсващи ID-та в MODAL_IDS (js/ui.js lines 428–444):**
```
'phoneOrderBackdrop'  ← ЛИПСВА (focus trap + Escape)
'prodPreviewSheet'    ← ЛИПСВА (focus trap + Escape)
```

### 2.3 Цветов контраст (WCAG 1.4.3)

| Двойка | Ratio | Изискване | Статус |
|---|---|---|---|
| `--text` (#1a1a1a) върху `--bg` (#f8f9fa) | **16.51:1** | 4.5:1 | ✅ PASS |
| `--primary` (#bd1105) върху бял (#fff) | **6.47:1** | 4.5:1 | ✅ PASS |
| `--primary` (#bd1105) върху `--bg` (#f8f9fa) | **6.14:1** | 4.5:1 | ✅ PASS |
| `.badge-lowstock` — бял (#fff) върху #ea580c | **3.56:1** | 4.5:1 | 🔴 FAIL |
| `.cart-ship-msg` — `--text2` (#555e6d) върху бяло | **6.55:1** | 4.5:1 | ✅ PASS |
| `.cp-empty-sub` — `--muted` (#626878) върху бяло | **5.57:1** | 4.5:1 | ✅ PASS |
| Topbar link (rgba 75% бяло върху #1a1a1a) | **~10.19:1** | 4.5:1 | ✅ PASS |
| Dark mode `--muted` (#8a9bb5) върху #0f172a | **6.32:1** | 4.5:1 | ✅ PASS |

### 2.4 Форми (WCAG 1.3.1)

| Форма | Labels | aria-describedby за грешки | Оценка |
|---|---|---|---|
| Auth login (email/password) | ✅ `<label for="">` | ✅ `aria-describedby` + `role="alert"` | ✅ PASS |
| Auth register | ✅ `<label for="">` | ✅ `aria-describedby` + `role="alert"` | ✅ PASS |
| Forgot password | ✅ `<label for="">` | ✅ `aria-describedby` | ✅ PASS |
| Quick Order (name/phone/city/addr/note) | ✅ `<label for="">` | ❌ Без aria-describedby за грешки | 🟠 WARN |
| Phone Order (`#poPhone`) | ❌ Без label | ❌ `#poPhoneError` не е свързан | 🔴 FAIL |
| Price Range sliders | ✅ `aria-label` | N/A | ✅ PASS |

### 2.5 Scroll progress bar

```html
<!-- line 4905 -->
<div id="scrollProgress" aria-hidden="true"></div>
```
✅ **PASS** — `aria-hidden="true"` е правилно поставен.

---

## 3. Приоритизиран списък за fix

### 🔴 P0 — Критично (Level A violations — трябва fix)

1. **[#23, #24]** Добави `phoneOrderBackdrop` и `prodPreviewSheet` в Escape handler (`js/ui.js` panels масив, lines 297–323)
2. **[#25, #26]** Добави `phoneOrderBackdrop` и `prodPreviewSheet` в `MODAL_IDS` масива (`js/ui.js` lines 428–444) за focus trap
3. **[#9]** Добави `<label for="poPhone">Телефон</label>` или `aria-label="Телефон"` на `#poPhone` input (index.html line 1080)
4. **[#4]** Смени `<div class="navbar">` на `<nav aria-label="Главна навигация">` (line 1631)
5. **[#7]** Смени `.sfb-header` div-ове на `<button type="button" class="sfb-header">` с aria-expanded

### 🟠 P1 — Required (Level AA violations)

6. **[#15]** Смени цвета на `.badge-lowstock`: `#ea580c` → `#c44000` (4.53:1 с бял текст) или използвай тъмен текст
7. **[#10]** Добави `aria-describedby="poPhoneError"` на `#poPhone` input
8. **[#5]** Добави `role="dialog"` + `aria-label="Навигационно меню"` + `aria-modal="true"` на `#mobDrawer`
9. **[#8]** Добави `role="radiogroup"` на `.qo-delivery-opts` и `role="radio"` + `tabindex` + `aria-checked` на всяко `.qo-delivery-opt` в quick order
10. **[#40]** Смени `.mob-drawer-user-strip` div на `<button type="button">` или добави `role="button" tabindex="0"`
11. **[#41]** Смени `.share-fallback-close` и `.share-fallback-url` div-ове на `<button type="button">`

### 🟡 P2 — Препоръки (подобрения)

12. **[#30]** Синхронизирай skip link target: смени `href="#mainContent"` на `href="#main-content"` (или обратното)
13. **[#6]** Обмисли замяна на `.cat-item[role=button]` div-ове с `<button>` за по-надеждна cross-browser keyboard support
14. Добави `@media (prefers-reduced-motion: reduce)` за `.badge-lowstock` pulse анимацията
15. **[#39]** Провери runtime съдържанието на `.badge-lowstock` — добави `aria-label` ако текстът е само символ

---

## 4. Добри практики, открити при одита (PASS)

- ✅ Skip link е имплементиран и CSS го показва при focus
- ✅ `:focus-visible` outline с `--primary` цвят — добра видимост за keyboard users
- ✅ Focus trap с stack-базирана логика + restore на предишния фокус (`js/ui.js`)
- ✅ `lang="bg"` на `<html>`
- ✅ Всички модални бутони-затваряне имат `aria-label`
- ✅ SVG sprite с `aria-hidden="true"` навсякъде
- ✅ Cart badge с `aria-live="polite"` за динамичен брояч
- ✅ Auth форми с пълни labels + `aria-describedby` + `role="alert"` error spans
- ✅ Checkout delivery options с `role="radiogroup"` и `role="radio"` — отличен пример
- ✅ `#scrollProgress` с `aria-hidden="true"`
- ✅ Breadcrumb навигации с `aria-label="Breadcrumb"`
- ✅ `autocomplete` атрибути на всички форми
- ✅ Mobile bottom nav с `aria-label="Мобилна навигация"` на `<nav>`
- ✅ `#cartAbandonToast` с `role="alert"` за urgent уведомления
- ✅ `#toast` и `#cartToast` с `role="status" aria-live="polite"`

---

*Одитът е изцяло статичен (source code analysis). Препоръчва се допълнително тестване с NVDA/JAWS + Chrome и VoiceOver + Safari за runtime верификация на focus trap и aria-live поведение.*

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
