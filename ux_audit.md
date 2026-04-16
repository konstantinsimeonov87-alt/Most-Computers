# UX/UI Одит — Most Computers
**Дата:** 2026-04-15 | **Одитор:** Claude UX Agent

---

## Оценки по категории

| Категория | Оценка | Бележка |
|---|---|---|
| Visual Design | **8/10** | Консистентна палитра, добра типография, dark mode |
| Usability | **7/10** | Добри потоци, но wishlist невидим на мобилен |
| Accessibility | **5/10** | 32 елемента с outline:none, wishlist скрит при hover |
| Mobile UX | **6/10** | Dark mode деактивиран на мобилен, vh проблеми |
| Conversion | **7.5/10** | Trust signals, scarcity, добър checkout flow |

---

## 🔴 Критични проблеми

### BUG-UX-01 — Wishlist невидим на мобилни устройства
**Файл:** [styles.css:1889](styles.css#L1889)

```css
.product-wishlist { opacity: 0; }                     /* скрит по подразбиране */
.product-card:hover .product-wishlist { opacity: 1; } /* само при hover */
```

Touch устройствата нямат `:hover` — бутонът е **изцяло недостъпен** на ~60% от трафика. Feature за любими съществува, но е невидим на мобилен.

**Fix:**
```css
/* Показвай бутона винаги на touch устройства */
@media (hover: none) {
  .product-wishlist { opacity: 1; }
}
```

---

### BUG-UX-02 — 32 елемента с `outline: none` без замяна
**Файл:** [styles.css](styles.css) — 32 места

Глобалният `:focus-visible` (ред 12852) е правилен, но специфичните правила го override-ват:
```css
.qo-input:focus   { outline: none; }   /* бърза поръчка */
.auth-input:focus { outline: none; }   /* вход/регистрация */
.ck-input:focus   { outline: none; }   /* checkout */
.sort-select:focus { outline: none; }  /* сортиране */
/* + още 28 */
```

Keyboard потребителите не виждат кой елемент е активен. Нарушава **WCAG 2.1 SC 2.4.11**.

**Fix:**
```css
/* Замени outline:none с видим box-shadow индикатор */
.ck-input:focus,
.auth-input:focus,
.qo-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(189, 17, 5, 0.2);
}
```

---

### BUG-UX-03 — Flash sale таймерът е хардкоднат (фалшив)
**Файл:** [index.html:1860](index.html#L1860)

```html
<span class="timer-num" id="th">02</span>  <!-- статична стойност -->
<span class="timer-num" id="tm">47</span>
<span class="timer-num" id="ts">33</span>
```

При всеки refresh показва `02:47:33`. Потребители с DevTools или при отваряне в различно време виждат несъответствие — **уронва доверието**.

**Fix:**
```js
const SALE_END = new Date().setHours(23, 59, 59, 0); // края на деня
function tickTimer() {
  const d = Math.max(0, SALE_END - Date.now());
  document.getElementById('th').textContent = String(Math.floor(d/3600000)).padStart(2,'0');
  document.getElementById('tm').textContent = String(Math.floor(d%3600000/60000)).padStart(2,'0');
  document.getElementById('ts').textContent = String(Math.floor(d%60000/1000)).padStart(2,'0');
}
setInterval(tickTimer, 1000);
tickTimer();
```

---

## 🟠 Сериозни проблеми

### BUG-UX-04 — `<label>` без `for` атрибут в Quick Order
**Файл:** [index.html:1005](index.html#L1005)

```html
<label>Град</label>              <!-- ПРОБЛЕМ: без for -->
<input id="qoCity" ...>

<label>Адрес</label>             <!-- ПРОБЛЕМ: без for -->
<input id="qoAddr" ...>
```

Screen readers не асоциират label с input. Клик на label не фокусира полето.

**Fix:** `<label for="qoCity">Град</label>` и `<label for="qoAddr">Адрес</label>`

---

### BUG-UX-05 — Hero slider dots без `aria-label`
**Файл:** [index.html:1840](index.html#L1840)

```html
<button type="button" class="dot active" data-action="goSlide(0)"></button>
```

Три бутона без текст или aria-label. Screen reader обявява само `"button"` три пъти.

**Fix:** `aria-label="Слайд 1"`, `"Слайд 2"`, `"Слайд 3"`

---

### BUG-UX-06 — Dark mode деактивиран на мобилен
**Файл:** [styles.css:7000](styles.css#L7000)

```css
@media (max-width: 768px) {
  /* Force light theme on mobile — dark mode disabled */
}
```

Потребители с тъмна тема на телефон получават принудително светла. Неочаквано поведение.

**Fix:** Премахни override или добави UI toggle "Тъмна тема" в настройките.

---

## 🟡 Леки проблеми

### BUG-UX-07 — `100vh` без `dvh` fallback
Само admin страницата ползва `100dvh`. Останалите overlay-и ползват само `100vh` — Safari iOS address bar може да отреже съдържание.

**Fix:** `max-height: calc(100dvh - Xpx)` паралелно с `100vh` версията.

### BUG-UX-08 — Непоследователни breakpoints
Текущи: 400 / 560 / 600 / 640 / 768 / 900 / 1100 / 1280px — 8 различни стойности без система. Препоръка: унифицирай до 4 основни (640 / 768 / 1024 / 1280).

### BUG-UX-09 — Inline JS в `data-action`
`data-action="document.getElementById('featured').scrollIntoView({behavior:'smooth'})"` — смесва системата. Трябва именувана функция `scrollToFeatured()`.

### BUG-UX-10 — Z-index без скала
Стойности: 2000, 9000, 9500, 9999×4, 10000, 10001, 20000, 99999. Без система — конфликти при нови overlay елементи. Препоръка: CSS custom property токени `--z-modal`, `--z-toast`, `--z-skip`.

---

## ✅ Положителни находки

| Елемент | Статус | Детайл |
|---|---|---|
| Skip link | ✅ | `<a href="#mainContent" class="skip-link">` — index.html:236 |
| Toast | ✅ | `role="status" aria-live="polite" aria-atomic="true"` |
| Auth форма | ✅ | `aria-describedby` за error съобщения |
| Checkout progress | ✅ | 3-стъпков indicator: Данни → Доставка → Плащане |
| Trust signals | ✅ | Cart, checkout, PDP, мобилно меню |
| `prefers-reduced-motion` | ✅ | styles.css:15002 — анимациите спират |
| Focus-visible глобален | ✅ | `2px solid var(--primary)` — styles.css:12852 |
| Add-to-cart touch target | ✅ | `min-height: 48px` — над минималния 44px |
| Modal ARIA | ✅ | `role="dialog" aria-modal="true"` |
| Search region | ✅ | `role="search" aria-label="Търсене в сайта"` |
| Cart/wishlist badge | ✅ | `aria-live="polite"` — обновяват се динамично |
| Dark mode desktop | ✅ | Пълно покритие с CSS custom properties |
| `100dvh` | ⚠️ | Само за admin — останалите ползват само `100vh` |

---

## Приоритизиран Action Plan

| При. | Проблем | Файл | Усилие | Ефект |
|---|---|---|---|---|
| 🔴 P0 | Wishlist скрит на mobile | styles.css | 15 мин | Feature достъпност |
| 🔴 P0 | 32× outline:none | styles.css | 30 мин | Keyboard nav |
| 🟠 P1 | label for атрибути | index.html | 5 мин | Form a11y |
| 🟠 P1 | Slider dots aria-label | index.html | 5 мин | Screen reader |
| 🟠 P1 | Реален таймер | JS | 30 мин | Доверие |
| 🟡 P2 | Dark mode mobile | styles.css | 20 мин | UX consistency |
| 🟡 P2 | dvh за modals | styles.css | 15 мин | Safari iOS |
| 🟡 P3 | z-index скала | styles.css | 1 ч | Maintainability |
| 🟡 P3 | scrollToFeatured() fn | index.html/JS | 10 мин | Code quality |
