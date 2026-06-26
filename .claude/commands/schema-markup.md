---
description: 🔖 Schema Markup — JSON-LD структурирани данни за Google Shopping и rich results; стартирай с: schema, json-ld, structured data, rich results, google shopping, markup
model: claude-opus-4-8
---

# 🔖 Агент: Schema Markup

Пише и поддържа JSON-LD структурирани данни за mostcomputers.bg — Google Shopping feed, rich results и Knowledge Graph.

## Защо е важно
- Google Shopping интеграция изисква валиден `Product` schema
- Rich results (звезди, цена, наличност) в търсачката = повече кликове
- `Organization` schema помага с Knowledge Panel
- `BreadcrumbList` schema подобрява навигационните breadcrumbs в Google

---

## Задачи

### Задача 1: Одит на текущите schema
- Прочети `index.html` — търси `<script type="application/ld+json">`
- Провери всеки schema блок:
  - Валиден ли е JSON?
  - Правилен ли е `@type`?
  - Попълнени ли са задължителните полета?
- Тествай с: https://validator.schema.org/ (ако е достъпен)
- Изведи доклад

### Задача 2: Organization schema
Прочети `index.html` за контактна информация.
Напиши/обнови Organization schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Most Computers",
  "url": "https://mostcomputers.bg",
  "logo": "https://mostcomputers.bg/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+359-2-919-1823",
    "contactType": "customer service",
    "availableLanguage": "Bulgarian",
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:30",
      "closes": "18:15"
    }
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "бул. Шипченски проход бл.240",
    "addressLocality": "София",
    "addressCountry": "BG"
  }
}
```

**Важно:** Събота не е работен ден — не я включвай в schema.

### Задача 3: Product schema за продуктов модал
Прочети `js/product-page.js` и `js/seo.js` за текущата SEO логика.
Прочети `js/data.js` за схемата на продуктите.

Напиши динамичен Product schema генератор:
```javascript
function generateProductSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "brand": { "@type": "Brand", "name": product.brand },
    "sku": product.sku,
    "gtin": product.ean,
    "image": product.img,
    "description": product.desc || product.name,
    "offers": {
      "@type": "Offer",
      "price": (product.price / 1.95583).toFixed(2), // EUR
      "priceCurrency": "EUR",
      "availability": product.stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "Most Computers" }
    },
    "aggregateRating": product.rating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews || product.rv || 1
    } : undefined
  };
}
```

Добави в `js/seo.js` и провери дали се инжектира при отваряне на продуктовия модал.

### Задача 4: BreadcrumbList schema
Прочети `js/seo.js` за текущия breadcrumb код.
Генерирай `BreadcrumbList` schema при навигация:
- Homepage → категория → продукт
- Схема да се обновява динамично при промяна на страницата

### Задача 5: LocalBusiness schema
Напиши `LocalBusiness` schema за физическия магазин:
```json
{
  "@type": "ComputerStore",
  "name": "Most Computers",
  "openingHours": ["Mo-Fr 09:30-18:15"],
  "priceRange": "€€"
}
```

### Задача 6: Валидация
- Провери всички schema блокове в `index.html`
- Провери JSON синтаксис с `JSON.parse()`
- Провери задължителните полета по schema.org спецификацията
- Изведи report с ✅/❌ за всеки блок

## Правила
- EUR е основната ценова единица в schema
- Събота не е работен ден
- Rebuild с `node build.js` след промени в `js/seo.js`
- `npm test` след всяка JS промяна