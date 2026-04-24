# 💰 CRO Report — Most Computers
**Дата:** 2026-04-24 | **Агент:** CRO Expert

---

## Обобщение

Сайтът има **зряла CRO реализация** — повечето стандартни conversion тактики са вече имплементирани. Оставащите gaps са специфични и с умерен impact.

| Категория | Оценка | Забележка |
|-----------|--------|-----------|
| Product Cards | 8/10 | Delivery hint, badges, quick order — добри |
| Product Detail Page | 9/10 | Viewers, timer, trust badges, notify OOS |
| Cart | 8/10 | Free ship progress, upsell, social proof |
| Checkout | 7/10 | 3 стъпки с progress indicator — ОК |
| Trust Signals | 8/10 | 4 trust badges на PDP, гаранция, телефон |

---

## ✅ Какво е добре реализирано (не пипай)

| Елемент | Локация | CRO стойност |
|---------|---------|-------------|
| Free shipping progress bar | Cart panel | ⭐⭐⭐ |
| Social proof ("28-68 поръчки днес") | Cart panel | ⭐⭐ |
| Viewers counter ("3-12 разглеждат") | PDP | ⭐⭐ |
| Delivery countdown ("Поръчай до 14:00") | PDP | ⭐⭐⭐ |
| Back-in-stock notify form | PDP (OOS) | ⭐⭐ |
| Upsell/cross-sell | Cart panel | ⭐⭐ |
| Quick order button (2 fields) | Product cards | ⭐⭐⭐ |
| Flash sale section + countdown | Homepage | ⭐⭐ |
| "📦 Доставка до 2 работни дни" hint | Product cards | ⭐⭐ |
| 4 trust badges | PDP | ⭐⭐⭐ |
| Newsletter -5% (thank-you page) | Post-purchase | ⭐ |

---

## 🔴 CRO Issues

### CRO-001 — Checkout `× Затвори` бутон е прекалено prominent (High)

| Поле | Съдържание |
|------|-----------|
| Проблем | `button.checkout-close-btn` с текст `× Затвори` е в topbar на checkout — голям и лесно намираем |
| Защо вреди | На стъпка 2-3 от checkout потребителят вижда лесен изход и може да го натисне по инерция |
| Fix | Намали размера, промени в `⟨` (back стрелка) вместо X, позиционирай вляво в ъгъла |
| Очакван ефект | -5% checkout abandonment |

**Текущ код:** `<button type="button" class="checkout-close-btn" data-action="closeCheckoutPage">× Затвори</button>`

**Предложение:**
```html
<button type="button" class="checkout-close-btn" data-action="closeCheckoutPage" title="Обратно към магазина">‹</button>
```
```css
.checkout-close-btn { font-size: 22px; color: var(--muted); background: none; border: none; padding: 4px 8px; }
```

---

### CRO-002 — Inline styles на `Бърза поръчка` и `Сравни` не се override-ват в dark mode (Medium)

| Поле | Съдържание |
|------|-----------|
| Проблем | `js/cards.js` генерира бутоните с `style="background:var(--bg);border:..."` — inline стилове имат висок specificity |
| Защо вреди | В dark mode `var(--bg)` се резолвира правилно, НО `onmouseover="this.style.background='var(--primary-light)'"` задава literal string, не CSS variable → бутоните имат бял hover в dark mode |
| Fix | Замени inline `onmouseover/onmouseout` style-ове с CSS класове |
| Очакван ефект | Fix dark mode UI bug — директен impact на dark mode потребители (≈20-30% на desktop) |

**Fix в `js/cards.js`** — замени `onmouseover="this.style.background='var(--primary-light)'"` с CSS клас:
```css
/* styles.css — добави */
.card-sec-btn { background: var(--bg); border: 1px solid var(--border); border-radius: 7px; padding: 9px 10px; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 3px; }
.card-sec-btn:hover { background: var(--primary-light); }
.card-sec-btn.active { background: var(--primary-light); }
```

---

### CRO-003 — Нняма "Само X бр. в наличност" warning (Medium)

| Поле | Съдържание |
|------|-----------|
| Проблем | Product cards показват само `Изчерпан` badge при нулева наличност. При 1-5 бр. — нищо |
| Защо вреди | Без scarcity сигнал потребителят отлага решението |
| Fix | Добави `stock` поле в продуктовите данни (когато < 5), покажи badge |
| Очакван ефект | +3-5% conversion при нискои нaличности |

**Предложение за cards.js:**
```js
${p.stock_qty && p.stock_qty <= 5 ? `<span class="badge badge-scarcity">⚠ Само ${p.stock_qty} бр.</span>` : ''}
```

*Изисква добавяне на `stock_qty` поле в data.js — medium effort.*

---

### CRO-004 — Newsletter -5% не е видим при checkout (Low)

| Поле | Съдържание |
|------|-----------|
| Проблем | -5% от следваща поръчка при абонамент е показан само на thank-you page |
| Защо вреди | Потребители, които не завършат поръчката, никога не виждат тази оферта |
| Fix | Добави subtle banner в cart panel: "📧 Абонирай се и спести -5% от следващата поръчка" |
| Очакван ефект | +email subscribers, indirect conversion impact |

---

## 🎯 A/B Test идеи (Task 4)

| Тест | Хипотеза | Вариант A | Вариант B | Метрика |
|------|---------|-----------|-----------|---------|
| **T-001** | "Бърза поръчка" бутон с различен лейбъл ↑ conversion | "⚡ Бърза поръчка" | "📞 Поръчай по телефон" | Quick order CVR |
| **T-002** | По-голям checkout CTA | "🔒 Завърши поръчката →" (текущ) | "🛒 Потвърди поръчката — Безплатна доставка!" | Checkout CVR |
| **T-003** | Delivery countdown на карти | Без countdown | "⏱ Поръчай до 14:00 ч. — доставка утре" | Add-to-cart rate |
| **T-004** | Уголемен price на PDP | Текущ размер | +20% по-голям font, по-bold | Purchase intent |

---

## ⚡ Quick Wins (Task 9) — Priority List

### QW-1: Checkout close бутон — по-малко prominent (30 мин) 🔥
- **Файл:** `styles.css` + `index.html`
- **Промяна:** Символ `×` → малка стрелка `‹`, намален font, grey color
- **Очакван ефект:** -5% checkout abandonment

### QW-2: CSS клас за card secondary buttons (20 мин)
- **Файл:** `js/cards.js` + `styles.css`
- **Промяна:** Замени inline styles с `.card-sec-btn` клас
- **Очакван ефект:** Fix dark mode hover bug

### QW-3: Втори H1 → H2 на продуктовата страница (5 мин) ✅
- **Файл:** `js/product-page.js` или CSS
- **Промяна:** Намери втория `<h1>` в DOM (основна страница) — промени на `<h2>` или `sr-only` само
- **Очакван ефект:** SEO + A11Y (minor)
- *Бележка: Основната страница H1 е `sr-only`. PDP-то има втори `<h1 id="pdpName">`. При отворена PDP двата съществуват — H1 на PDP трябва да е единственият видим.*

### QW-4: Newsletter banner в cart panel (25 мин)
- **Файл:** `index.html` (cart-panel-footer) + `styles.css`
- **Промяна:** Добави 1 ред с email + subscribe под progress bar
- **Очакван ефект:** +email subscribers

### QW-5: "Запази X €" absolute savings на карти (15 мин)
- **Файл:** `js/cards.js`
- **Промяна:** Покажи `Спестяваш ${save_eur} €` вместо само `-X%`
- **Очакван ефект:** По-ясна ценова стойност → +conversion

---

## 📊 Фунел анализ

```
Awareness (SEO/Direct)
  ↓
  Homepage → Hero slider + Flash sale → 80% scroll до продукти
  ↓
Consideration
  Product card → Quick preview / Бърза поръчка / Add to cart
  Drop-off точка: Прекалено много бутони на карта (4 CTA) — може да предизвика decision paralysis
  ↓
Decision (PDP)
  PDP → Viewers counter → Delivery timer → Trust badges → Add to cart
  Drop-off точка: OOS продукти без алтернатива на карточно ниво
  ↓
Purchase (Cart → Checkout)
  Cart panel → Free ship progress → Social proof → Checkout
  Drop-off точка: Checkout close × бутон (CRO-001)
  ↓
Confirmation (Thank-you page)
  ✅ Newsletter -5%, order tracking link
```

**Препоръка:** Намали secondary buttons на product card от 3 на 2 (Бърза поръчка + Сравни, премахни Преглед — дублира click на картата).
