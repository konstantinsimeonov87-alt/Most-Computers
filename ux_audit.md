# UX/UI Одит — Most Computers
**Дата:** 2026-04-09  
**Одиторски обхват:** index.html, styles.css, js/ модули

---

## Оценки по категории

| Категория | Оценка | Коментар |
|-----------|--------|----------|
| Visual Design | **8/10** | Чиста, Apple-inspired палитра; добра йерархия; SVG спрайт система |
| Usability | **7/10** | Добър flow; minor inconsistencies; inline onclick anomaly |
| Accessibility | **6/10** | Skip link ✓; aria-labels ✓; outline:none без достатъчен контраст на muted текст |
| Mobile UX | **8/10** | Bottom nav ✓; 44px touch targets ✓; hero right panel hidden OK |
| Conversion | **7.5/10** | Trust signals ✓; urgency елементи ✓; promo strip copy стара |

---

## 🔴 Critical Issues

### UX-001 — Противоречиви прагове за безплатна доставка
- **Файл:** index.html:1519
- **Проблем:** Promo strip показва "Безплатна доставка над 102.26 € / 200 лв." докато topbar (line 1333) и cart.js са обновени на "100 € / 195.58 лв."
- **Ефект:** Потребителят вижда 2 различни числа → загуба на доверие
- **Fix:** Обнови promo strip да казва "100 € / 195.58 лв."

---

## 🟠 High Issues

### UX-002 — Inline `onclick` на mobile filter бутон (несъответствие с event delegation)
- **Файл:** index.html:1821
- **Проблем:** `onclick="toggleMobileFilters()"` — нарушава data-action паттерна, използван навсякъде другаде
- **Ефект:** При CSP промени или рефактор може да се скъса; несъответствие в код стила
- **Fix:** Смени на `data-action="toggleMobileFilters"`

### UX-003 — Продуктовото заглавие е 13px (под препоръчания минимум)
- **Файл:** styles.css:1931
- **Проблем:** `.product-name { font-size: 13px }` — при малки viewport-и е труден за четене
- **Ефект:** Лоша четимост на мобилен (375px), особено при дълги имена с 2 реда
- **Fix:** Промени на 14px

### UX-004 — Newsletter input фокус почти невидим на тъмен фон
- **Файл:** styles.css:2160
- **Проблем:** `.nl-input:focus { border-color: var(--primary); }` — само border промяна без box-shadow
- **Ефект:** На тъмно-сивия фон на newsletter секцията, focus е почти невидим за keyboard потребители
- **Fix:** Добави box-shadow при focus

### UX-005 — Legacy `.bottom-nav` (dead HTML code)
- **Файл:** index.html:2414, styles.css:5248
- **Проблем:** Старият `<nav id="bottomNav" class="bottom-nav">` е в HTML но никога не се показва (display:none в CSS); реалната мобилна навигация е `#mobBottomNav`
- **Ефект:** Излишен DOM, объркващ при дебъгване; `body { padding-bottom: 68px }` в стария CSS блок (line 5317) противоречи с новия `calc(64px + env(safe-area-inset-bottom))`
- **Fix:** Премахни стария body padding правило (68px) — по-новото calc() e достатъчно

---

## 🟡 Medium Issues

### UX-006 — `--muted` цвят (#9ca3af) недостатъчен контраст за важен текст
- **Файл:** styles.css:51
- **Проблем:** Contrast ratio `#9ca3af` на бял фон = ~2.86:1 (WCAG AA изисква 4.5:1 за нормален текст)
- **Ефект:** Рейтинг брой, secondary meta text е труден за четене при слабо зрение
- **Fix:** Промени `--muted` от #9ca3af на #767e8c (contrast ~4.7:1 ✓) или използвай само за decorative елементи

### UX-007 — `logo-top` текст 9px
- **Файл:** styles.css:189
- **Проблем:** `.logo-top { font-size: 9px }` — "СПЕЦИАЛИЗИРАН МАГАЗИН" текстът е практически нечетим
- **Ефект:** Губи trust съобщение; потенциален WCAG fail за normal text (WCAG изисква ≥ 14px без bold за normal weight)
- **Fix:** Вдигни до 10px или скрий елемента

### UX-008 — Flash sale таймер е статичен HTML
- **Файл:** index.html:1789-1795
- **Проблем:** Таймерът е hardcoded "02:47:33" като статичен HTML. Ако JS не го override-не при зареждане, ще показва фиксирано остаряло число
- **Ефект:** Загуба на urgency ако потребителят refresh-не и вижда същото число
- **Fix:** Провери дали JS динамично задава flash sale таймера (вероятно в main.js/ui.js) и увери се, че HTML placeholder е само скелет

### UX-009 — Hero slider без автоплей потвърждение
- **Файл:** styles.css:1508, js/ui.js или main.js
- **Проблем:** Hero slideshow анимацията `slide-in` е само CSS за ръчно превключване; не е ясно дали автоплей е реализиран
- **Ефект:** Слайдовете 2 и 3 може никога да се видят ако потребителят не кликне на dots
- **Fix:** Провери дали има `setInterval` за автоплей в JS; ако не — добави 4-5 секунди autoplay

---

## 🟢 Low Issues

### UX-010 — Hero slider без клавиатурни стрелки
- **Файл:** Slider dots бутони (index.html:1772-1776)
- **Проблем:** Dots са clickable но slider не поддържа keyboard arrow navigation
- **Fix:** Добави `keydown` handler за ← → клавиши в slider логиката

### UX-011 — Slide-sub и slide-price с opacity:0.85 на цветен фон
- **Файл:** styles.css:1553 (`.slide-sub { opacity: 0.85 }`)
- **Проблем:** На slide-3 (#ff6b00 orange bg), белия текст с 0.85 opacity може да е под 4.5:1
- **Fix:** Тествай реален contrast; ако fail — вдигни opacity до 0.95

### UX-012 — Мobile category filter label "Категории" в bottom nav отваря мобилно меню
- **Файл:** index.html:1296 (`data-action="toggleMobMenu"`)
- **Проблем:** Очакването е "Категории" → категорийна страница; реалното поведение е "отваря навигационното меню"
- **Ефект:** Slight semantic mismatch; потребителят очаква листинг, получава навигация
- **Fix:** Renaming to "Меню" или промяна на действието

---

## Приоритизиран Action Plan

| Приоритет | Issue | Effort | Impact |
|-----------|-------|--------|--------|
| 1 | UX-001 Promo strip copy | 2 мин | Висок |
| 2 | UX-002 Inline onclick | 5 мин | Среден |
| 3 | UX-003 Product name 14px | 2 мин | Среден |
| 4 | UX-004 Newsletter focus | 3 мин | Среден |
| 5 | UX-005 Redundant body padding | 2 мин | Нисък |
| 6 | UX-006 Muted contrast | 10 мин | Висок |
| 7 | UX-007 Logo-top 10px | 1 мин | Нисък |

---

## Позитивни находки (не променяй!)

- ✅ **Skip link** — правилно имплементиран (a11y)
- ✅ **SVG спрайт система** — чиста, без дублиране
- ✅ **44px touch targets** — `min-height: 48px` на CTA бутоните, `.hdr-btn` 44px на mobile
- ✅ **Sticky header** с blur backdrop — съвременен, не блокира съдържание
- ✅ **Bottom nav** — 5 ключови action, правилно архивирани
- ✅ **Dark mode** — имплементиран, с правилно force-light на mobile (избягва contrast issues)
- ✅ **`aria-live` на cart badge** — screen readers чуват промяната
- ✅ **Custom focus styles** — всички форм инпути имат `box-shadow` при :focus (checkout, auth)
- ✅ **`env(safe-area-inset-bottom)`** — правилна iPhone notch поддръжка
- ✅ **Mobile search** — full-width, min-height 44px, на отделен ред
