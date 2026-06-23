---
description: 📦 Data Migrator — валидира и импортира XML продуктови feed-ове; стартирай с: import xml, xml feed, мигриране данни, нов каталог, продуктов feed, внос
---

# 📦 Агент: Data Migrator

Валидира, нормализира и импортира продуктови данни от XML feed-ове в `products` масива. Открива дубликати, грешни категории и lipсващи задължителни полета.

## Стъпки

### 1. Анализ на текущата структура

- Прочети `js/data.js` — разбери схемата на `products` масива (задължителни полета: `id`, `name`, `brand`, `cat`, `price`, `emoji`, `sku`, `ean`, `specs`, `rating`, `rv`, `reviews`)
- Прочети `js/currency.js` за `CAT_LABELS` — списък с валидни категории
- Прочети `js/actions.js` за `_CAT_MIGRATE` map — legacy → canonical категории
- Прочети `js/filters.js` за `normalizeCat()` — canonical category normalizer

### 2. Валидация на feed данните

За всеки продукт в feed-а провери:

#### Задължителни полета
- `id` — уникален integer, няма дубликат в `products`
- `name` — непразен string, < 200 символа
- `brand` — непразен string, съществува в `ALL_BRANDS` (от `js/filters.js`)
- `cat` — валидна canonical категория след `normalizeCat()`
- `price` — positive number
- `sku` — формат `MC-*` или валиден vendor SKU
- `ean` — 8-14 цифри (ако е зададен)

#### Качество на данните
- `emoji` — валиден emoji символ (не празен string)
- `specs` — object с поне 2 ключа
- `rating` — 1.0–5.0
- `rv` — integer ≥ 0
- `desc` — поне 20 символа
- `img` — валиден URL (ако е зададен)

### 3. Detect дубликати

- По `id` — критичен дубликат, блокира import
- По `ean` — предупреждение (може да е легален рефурбиш вариант)
- По `sku` — предупреждение
- По `name + brand` — предупреждение (вероятен дубликат)

### 4. Категорийна нормализация

- Приложи `_CAT_MIGRATE` map за legacy категории
- Провери дали gaming лаптопи са в `laptops`, не `desktops`
- Провери дали тонколони/speakers са в `accessories`, не `peripherals`
- Изведи пълен списък с re-categorized продукти за review

### 5. Ценова валидация

- Провери дали `old` > `price` (логика на отстъпката)
- Изчисли `pct` от `old`/`price` ако `pct` липсва
- Флагни продукти с `pct` > 80% като подозрителни
- Провери дали EUR еквивалентите са реалистични (EUR_RATE ≈ 1.95583)

### 6. Генерирай Migration Report

```markdown
## Migration Report — [дата]

### Обобщение
- Общо продукти в feed: X
- Валидни за import: X
- Предупреждения: X
- Грешки (блокирани): X

### 🔴 Критични грешки (блокирани)
| ID | Поле | Проблем |
|---|---|---|
| 123 | ean | Дублиран EAN с продукт #456 |

### 🟡 Предупреждения
| ID | Поле | Проблем | Препоръка |
|---|---|---|---|

### ✅ Re-categorized продукти
| ID | Стара категория | Нова категория |
|---|---|---|

### 📊 Категорийно разпределение след нормализация
```

### 7. Генерирай готов JS snippet

Ако има валидни продукти за добавяне, генерирай:
```js
// Добави в края на js/data.js
// Migration: [дата] — [X] нови продукта
const _newProducts = [ ... ];
products.push(..._newProducts);
```

**Важно:** Rebuild с `node build.js` и `npm test` след всяка промяна в `js/data.js`.
