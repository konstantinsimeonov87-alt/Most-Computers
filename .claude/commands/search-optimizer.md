---
description: 🔍 Search Optimizer — подобрява вътрешното търсене, autocomplete, no-results и search relevance; стартирай с: търсене, search, autocomplete, no results, намери продукт, search bar
model: claude-opus-4-8
---

# 🔍 Агент: Search Optimizer

Подобрява вътрешното търсене на mostcomputers.bg — relevance, autocomplete, no-results handling и search UX.

**Цел:** Потребителят да намери продукта с 1-2 думи. Нулев "zero results" при реални продукти.

---

## Задача 1: Одит на търсенето

Прочети `js/search.js` изцяло.

Анализирай:
- Търси ли по name, brand, SKU, EAN, category?
- Case-insensitive ли е?
- Работи ли с частични думи ("MSI" → "MSI Thin 15")?
- Работи ли с typos ("монитр" → "монитор")?
- Какво се показва при no-results?
- Има ли ranking/relevance (exact match преди partial)?

**Output:** Таблица на покритите и непокритите случаи.

---

## Задача 2: Подобри relevance ranking

Имплементирай weighted search scoring в `js/search.js`:

```javascript
function scoreResult(product, query) {
  const q = query.toLowerCase();
  let score = 0;
  
  // Exact matches получават по-висок score
  if (product.name.toLowerCase() === q) score += 100;
  if (product.sku?.toLowerCase() === q) score += 90;
  if (product.ean === q) score += 90;
  
  // Partial matches
  if (product.name.toLowerCase().includes(q)) score += 50;
  if (product.brand?.toLowerCase().includes(q)) score += 40;
  if (product.cat?.toLowerCase().includes(q)) score += 20;
  
  // Наличност бонус
  if (product.stock) score += 10;
  
  return score;
}
```

Сортирай резултатите по score desc.

---

## Задача 3: Autocomplete / search suggestions

Имплементирай live suggestions при typing (debounced, 200ms):

- Показва се след 2+ символа
- Показва топ 5 резултата с product image, name и цена
- Клик → директно към продукта или filtered page
- Keyboard navigation (↑↓ Enter Escape)
- "Виж всички [N] резултата" в дъното

Добави UI в `index.html`, логиката в `js/search.js`, стиловете в `styles.css`.

---

## Задача 4: No-results оптимизация

Когато търсенето не връща резултати:

1. **Не показвай просто "Няма резултати"**
2. Провери за typos (Levenshtein distance ≤2) и предложи корекция
3. Разшири търсенето до само brand или само category
4. Покажи "Може би търсиш:" с 3-4 popular products
5. Добави "Не намираш продукта? Свържи се с нас" с телефон

Имплементирай в `js/search.js`.

---

## Задача 5: Search synonyms и aliases

Добави synonym map за чести bulgarski търсения:

```javascript
const synonyms = {
  'принтер': ['printer', 'мфу', 'лазерен', 'мастиленоструен'],
  'лаптоп': ['laptop', 'notebook', 'преносим компютър'],
  'монитор': ['monitor', 'дисплей', 'екран'],
  'мишка': ['mouse', 'мишката'],
  'клавиатура': ['keyboard', 'клава'],
  'памет': ['ram', 'оперативна памет', 'memoria'],
  'диск': ['hdd', 'ssd', 'твърд диск', 'харддиск'],
};
```

Разшири при нужда. Добави в `js/search.js`.

---

## Задача 6: Search analytics

Добави tracking в `js/analytics.js`:
- `search` event с `search_term` при всяко търсене
- `view_search_results` с брой резултати
- `select_item` с `list_name: "search_results"` при клик

Провери дали GA4 вече track-ва searches. Добави само липсващото.

---

## Задача 7: Mobile search UX

Провери search на мобил:
- Search bar достатъчно голям ли е (min 44px touch target)?
- Клавиатурата затваря ли резултатите?
- "X" бутон за изчистване на search?
- Search отваря ли full-screen overlay на мобил?

Приложи mobile-specific fixes.

---

## Rebuild

```
node build.js
```

След rebuild: `npm test`

## Правила
- Debounce всички search requests — не queryвай при всеки keystroke
- Само продукти с реални данни — никога placeholder резултати
- Тествай с кирилица, латиница и смесен вход
