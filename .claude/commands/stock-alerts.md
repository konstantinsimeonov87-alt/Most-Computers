---
description: 📦 Stock Alerts — нисък/нулев наличност, автоматично hide/show на продукти и stock tracking; стартирай с: наличност, stock, изчерпан, нисък склад, скрий продукт, покажи продукт, наличен
model: claude-opus-4-8
---

# 📦 Агент: Stock Alerts

Управлява наличностите на mostcomputers.bg — предупреждава при нисък stock, скрива изчерпани продукти и осигурява точна информация за наличност.

---

## Задача 1: Одит на stock логиката

Прочети `js/data.js`, `js/cards.js` и `js/product-page.js`.

Провери:
- Как се определя дали продукт е "в наличност" (`stock: true/false`)?
- Показват ли се изчерпани продукти в grid-а?
- Деактивира ли се "Добави в кошница" при `stock: false`?
- Показва ли се "Изчерпан" badge на картата?
- Може ли потребителят да поръча изчерпан продукт?

**Output:** Матрица на stock states и поведението им.

---

## Задача 2: Stock badge система

Имплементирай визуални stock индикатори в `js/cards.js`:

```javascript
function getStockBadge(product) {
  if (!product.stock) return '<span class="badge badge--out">Изчерпан</span>';
  if (product.qty <= 3) return '<span class="badge badge--low">Последни ' + product.qty + ' бр.</span>';
  return ''; // В наличност — без badge
}
```

Добави съответните стилове в `styles.css`.

---

## Задача 3: Деактивирай checkout за изчерпани продукти

В `js/cart.js` и `js/product-page.js`:
- Бутон "Добави в кошница" → disabled + tooltip "Изчерпан" при `stock: false`
- Ако изчерпан продукт е в кошницата при checkout → покажи warning
- Не позволявай завършване на поръчка с `stock: false` продукти

---

## Задача 4: "Уведоми ме" функционалност

За изчерпани продукти — добави форма "Уведоми ме при наличност":
- Email input + бутон "Уведоми ме"
- Запази в Supabase таблица `stock_notifications(product_id, email, created_at)`
- Confirmation toast: "Ще те уведомим на [email]"

Прочети `js/supabase-client.js` за Supabase connection.

---

## Задача 5: Филтриране на изчерпани продукти

В `js/filters.js` — добави toggle:
- По подразбиране: скрий изчерпани продукти
- Checkbox "Покажи изчерпани" за тези, които искат да видят

Запази настройката в localStorage.

---

## Задача 6: Stock sync скрипт

Прегледай `scripts/` директорията за съществуващи sync скриптове.

Провери дали има автоматичен stock update от XML feed-овете.
Ако не — напиши `scripts/sync-stock.js`:
- Чете XML feed-овете (или Supabase)
- Обновява `stock` полето в `js/data.js`
- Логва промените (кои продукти са станали изчерпани)

---

## Задача 7: Stock одит доклад

Анализирай `js/data.js`:
- Брой продукти с `stock: true` / `stock: false`
- Категории с най-много изчерпани продукти
- Продукти без stock информация (undefined/null)
- Продукти с `stock: false` > 30 дни (кандидати за архивиране)

Изведи markdown доклад.

---

## Правила
- Никога не позволявай поръчка на изчерпан продукт без изрично одобрение
- Stock информацията е real-time критична — не кеширай с дълъг TTL
- "Последни X бр." показвай само ако qty данните са точни
- При stock промяна от true→false: незабавно деактивирай от промоции
