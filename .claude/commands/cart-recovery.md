---
description: 🔄 Cart Recovery — abandoned cart логика, персистентна кошница и session retention; стартирай с: изоставена кошница, cart abandonment, запази кошница, recovery, remind
model: claude-opus-4-8
---

# 🔄 Агент: Cart Recovery

Намалява abandonment rate чрез персистентна кошница, session recovery и умни reminder механизми за mostcomputers.bg.

**Правило:** Не изпраща автоматично имейли или нотификации без одобрение.

---

## Задача 1: Одит на кошница persistence

Прочети `js/cart.js` и `js/auth.js`.

Провери:
- Запазва ли се кошницата в localStorage при refresh?
- Синхронизира ли се кошницата за логнати потребители (Supabase)?
- Какъв е TTL на кошницата (изтича ли след X дни)?
- Мърджира ли се guest кошницата при login?

**Output:** Матрица guest/логнат × refresh/нов device — какво се губи и какво се запазва.

---

## Задача 2: Имплементирай персистентна кошница

Ако кошницата не се запазва правилно, имплементирай:

```javascript
// В js/cart.js — при всяка промяна на кошницата
localStorage.setItem('mc_cart', JSON.stringify(cart));
localStorage.setItem('mc_cart_ts', Date.now());

// При зареждане на страницата
const saved = localStorage.getItem('mc_cart');
const ts = localStorage.getItem('mc_cart_ts');
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 дни
if (saved && ts && (Date.now() - ts) < MAX_AGE) {
  cart = JSON.parse(saved);
}
```

Адаптирай към съществуващата cart структура.

---

## Задача 3: Exit intent за кошница

Имплементирай exit intent логика — показва reminder при опит за напускане с продукти в кошницата:

- Trigger: `mouseleave` на `<html>` (desktop) или back button (mobile)
- Условие: кошницата не е празна И потребителят не е купил
- UI: мини overlay с "Имаш продукти в кошницата — продължи поръчката"
- Показва се максимум 1 път на сесия

Добави в `js/cart.js`, UI елемента в `index.html`, стиловете в `styles.css`.

---

## Задача 4: "Запази за по-късно" функционалност

Добави бутон "Запази за по-късно" до всеки продукт в кошницата:
- Местоположение: wishlist/saved items (отделен от кошницата)
- Storage: localStorage за гости, Supabase за логнати
- UI: раздел "Запазени продукти" под кошницата

Прочети как `js/auth.js` управлява Supabase за да интегрираш правилно.

---

## Задача 5: Recently viewed → cart nudge

Прочети `js/recently-viewed.js`.

Добави логика: ако потребителят е разглеждал продукт без да го сложи в кошницата, покажи subtle reminder в края на страницата ("Разглеждал си преди: [продукт]").

---

## Задача 6: Кошница recovery при завръщане

Когато потребител се върне на сайта с изоставена кошница (>30 мин отсъствие):
- Покажи toast нотификация: "Добре дошъл обратно! Имаш [N] продукта в кошницата."
- Бутон "Виж кошницата" → директно към checkout
- Показва се само веднъж при завръщане

Добави в `js/main.js` при page load.

---

## Задача 7: Abandonment анализ

Прочети `js/analytics.js` — провери какво се track-ва за checkout.

Провери дали има:
- `begin_checkout` event
- `add_payment_info` event
- `checkout_step_[n]` events
- Timing между стъпките

Добави липсващите events за пълна funnel visibility.

---

## Rebuild

```
node build.js
```

След rebuild: `npm test`

## Правила
- Никога не изпращай имейли/SMS без изричен trigger от потребителя
- EUR е основната ценова единица
- Overlay/popup максимум 1 път на сесия — не досаждай
- Тествай persistence в incognito и след hard refresh
