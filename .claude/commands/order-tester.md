---
description: 🛒 Order Tester — тества целия процес на поръчка от добавяне в кошница до thank-you страница; стартирай с: тест поръчка, order test, провери checkout, тествай поръчка
model: claude-opus-4-8
---

# 🛒 Агент: Order Tester

Тестваш целия процес на поръчка на mostcomputers.bg — от добавяне в кошницата до финалното потвърждение. Целта е 100% покритие на критичния happy path и всички edge cases.

**Scope:** `js/cart.js`, `js/order-tracker.js`, `tests/checkout.test.js`, `tests/cart.test.js`

---

## Стъпка 1: Разбери текущото тест покритие

Прочети `tests/checkout.test.js` и `tests/cart.test.js`.

Провери какво **вече е покрито**:
- applyPromo (валиден/невалиден код)
- renderOrderSummary (subtotal, delivery, COD fee, promo discount, savings)
- formatCardNum / formatExpiry
- addToCart / removeFromCart / changeQty / updateCart

Провери какво **липсва** в тестовете — особено:
- `submitOrder()` — валидация на формата + генериране на orderNum + записване в localStorage
- `handleCheckout()` — prefill от currentUser + зареждане на saved address
- `loadCart()` — persistence между сесии
- `changeQty()` edge case: qty=1 → намаляване премахва продукта
- `undoRemoveCart()` — undo логика

---

## Стъпка 2: Напиши тестове за submitOrder

Добави в `tests/checkout.test.js` нови describe блокове.

### 2a. Form validation тестове

```js
describe('submitOrder — валидация на формата', () => {
  // Setup: DOM с всички checkout полета + cart с 1 продукт
  // За delivery до адрес (idx=0): изисква ckFirst, ckLast, ckEmail, ckPhone, ckCity, ckAddr
  // За вземане от магазин (idx=2): НЕ изисква ckCity, ckAddr

  test('спира при липсващо ckFirst')
  test('спира при липсващо ckEmail')
  test('спира при липсващо ckPhone')
  test('спира при липсващ ckCity (delivery idx=0)')
  test('минава без ckCity при вземане от магазин (idx=2)')
  test('минава без ckAddr при вземане от магазин (idx=2)')
  test('показва toast при невалидна форма')
})
```

### 2b. Order generation тестове

```js
describe('submitOrder — генерира поръчка', () => {
  // Setup: попълни всички полета, cart=[продукт]

  test('записва поръчка в localStorage под ключ mc_orders')
  test('orderNum започва с MC-')
  test('orderNum е уникален за всяка поръчка')
  test('total = subtotal + delivery (без promo)')
  test('total = subtotal + delivery + 1.50 при COD')
  test('total = subtotal + delivery - 10% при promo')
  test('total = subtotal при безплатна доставка (idx=2)')
  test('поръчката съдържа email от формата')
  test('поръчката съдържа itemsData с правилните продукти')
  test('b2b полетата се записват при ckIsB2B=checked')
})
```

### 2c. Thank-you page population

```js
describe('submitOrder — thank-you страница', () => {
  test('tyOrderNum съдържа генерирания номер')
  test('tyEmail е от ckEmail полето')
  test('tyPayment е "Карта" при card')
  test('tyPayment е "Наложен платеж" при cod')
  test('tyDeliveryDate е "При вземане от магазин" при idx=2')
  test('tyItems съдържа имената на продуктите')
  test('tyTotal е коректната сума')
})
```

---

## Стъпка 3: Напиши тестове за loadCart

Добави в `tests/cart.test.js`:

```js
describe('loadCart — persistence', () => {
  test('зарежда запазена кошница от localStorage mc_cart')
  test('игнорира продукти с несъществуващо id')
  test('при празен localStorage cart остава []')
  test('saveCart → loadCart е идемпотентно (qty се запазва)')
})
```

---

## Стъпка 4: Edge case тестове за кошницата

Добави в `tests/cart.test.js`:

```js
describe('changeQty — edge cases', () => {
  test('changeQty(id, -1) при qty=1 премахва продукта от cart')
  test('changeQty(id, +1) увеличава qty')
  test('changeQty на несъществуващ id не хвърля грешка')
})

describe('undoRemoveCart', () => {
  test('добавя обратно премахнат продукт')
  test('при qty>1 добавя qty-те обратно')
  test('без _undoItem не прави нищо')
})
```

---

## Стъпка 5: Изпълни тестовете

```
npm test
```

Анализирай резултатите:
- При failing тест — прочети кода и реши дали е бъг в кода или в теста
- При грешка в mock setup — провери дали DOM структурата в setupDOM() съответства на `index.html`
- НЕ променяй production кода само за да минат тестове — ако тестът открие реален бъг, докладвай го

---

## Стъпка 6: End-to-end smoke тест (browser)

Използвай browser subagent за да верифицираш визуално:

1. Отвори сайта
2. Кликни "Добави в кошница" на произволен продукт
3. Провери: badge се обновява, cart toast се появява
4. Отвори cart panel → виж продукта
5. Кликни "Завърши поръчката"
6. Провери: checkout страницата се отваря, order summary показва продукта
7. Попълни формата: Иван Иванов, test@test.com, 0888123456, София, ул. Тест 1
8. Избери доставка "Еконт - до адрес"
9. Избери плащане "Наложен платеж"
10. Кликни "Потвърди поръчката"
11. Провери: thank-you страницата се показва с orderNum, email, items
12. Провери: `localStorage.mc_orders` съдържа новата поръчка

Направи скрийншот на: cart panel, checkout форма, thank-you страница.

---

## Стъпка 7: Тест на поръчки с различни категории и продукти

Целта е да верифицираш, че поръчката работи коректно независимо от типа продукт.

### 7a. Unit тестове за различни категории

Категориите на сайта: `phones`, `laptops`, `desktops`, `gaming`, `monitors`, `components`, `peripherals`, `network`, `storage`, `accessories`, `printers`, `ups`, `consumables`.

Вземи по 1 продукт от `products.js` за всяка категория и тествай:

```js
describe('submitOrder — различни категории продукти', () => {
  const testProducts = [
    // Вземи реални ID-та и цени от products.js
    { cat: 'phones',      /* id, name, price от products.js */ },
    { cat: 'laptops',     /* id, name, price */ },
    { cat: 'gaming',      /* id, name, price */ },
    { cat: 'components',  /* id, name, price */ },
    { cat: 'monitors',    /* id, name, price */ },
    { cat: 'storage',     /* id, name, price */ },
  ];

  testProducts.forEach(prod => {
    test(`поръчка с ${prod.cat} продукт записва правилен total`, () => {
      // setup: cart=[prod], попълни форма, submitOrder()
      // assert: mc_orders[0].total = prod.price + delivery
    });

    test(`поръчка с ${prod.cat} продукт запазва itemsData.cat`, () => {
      // assert: mc_orders[0].itemsData[0].cat === prod.cat  (или id)
    });
  });
});
```

### 7b. Тест на кошница с продукти от РАЗЛИЧНИ категории едновременно

```js
describe('submitOrder — смесена кошница', () => {
  test('поръчка с телефон + лаптоп изчислява правилен subtotal')
  test('поръчка с 5 различни продукта — total = сумата на всички + delivery')
  test('поръчка с sale продукт — savings реда се показва в order summary')
  test('поръчка само с gaming продукти — без грешки')
})
```

### 7c. Крайни случаи по цена (различни категории имат различни ценови диапазони)

```js
describe('submitOrder — ценови edge cases', () => {
  test('евтин аксесоар (<5 €) — total е над 0')
  test('скъп лаптоп (>1000 €) — форматирането на total е коректно')
  test('продукт с qty=10 — subtotal = price * 10')
  test('free shipping threshold — при total >= FREE_SHIP_BGN delivery = 0')
})
```

### 7d. Browser smoke тест за различни категории

С browser subagent тествай поръчка от **3 различни категории**:

**Тест 1 — Телефон (phones):**
1. Филтрирай по "Телефони"
2. Добави 1 продукт в кошница
3. Мини до thank-you страница
4. Скрийншот

**Тест 2 — Компонент (components):**
1. Филтрирай по "Компоненти"
2. Добави 1 продукт в кошница
3. Мини до thank-you страница
4. Скрийншот

**Тест 3 — Смесена кошница (2+ категории):**
1. Добави лаптоп + периферия (мишка/клавиатура)
2. Провери order summary показва ВСИЧКИ продукти
3. Провери tyItems в thank-you показва всичките
4. Скрийншот

---

## Стъпка 9: Order tracker тест

Провери `js/order-tracker.js`:
- `openOrderTracker('MC-TEST01')` показва правилните статус стъпки
- `trackOrder()` с реален номер от localStorage намира поръчката
- `trackOrder()` с несъществуващ номер показва грешка

---

## Стъпка 10: Финален доклад

Напиши обобщение:

```
## Order Test Report — [дата]

### Unit тестове
- Нови: X теста добавени
- Всички: Y/Y минават

### Открити проблеми
| Проблем | Файл:ред | Сериозност |
|---------|----------|------------|
| ...     | ...      | ...        |

### Browser smoke тест — категории
| Категория | Добавяне | Checkout | Thank-you | Скрийншот |
|-----------|----------|----------|-----------|-----------|
| phones    | [ ]      | [ ]      | [ ]       | -         |
| laptops   | [ ]      | [ ]      | [ ]       | -         |
| components| [ ]      | [ ]      | [ ]       | -         |
| смесена   | [ ]      | [ ]      | [ ]       | -         |

### Browser smoke тест — flow
- [x] Добавяне в кошница
- [x] Cart panel
- [x] Checkout отваряне
- [x] Form validation
- [x] Submit поръчка
- [x] Thank-you страница
- [x] localStorage persistence

### Категории с проблеми
(изброй ако някоя категория се държи различно)

### Препоръки
1. ...
```

---

## Правила

- EUR е основната ценова единица — никога лв. като основна в assertions
- Само `node build.js` за rebuild (НЕ cat на js/ файлове)
- При бъг в production кода — докладвай, не поправяй без одобрение
- Тествай с реални ID-та от `products.js` (не измислени)
- Не добавяй тестове за функции, которые вече имат 100% покритие
