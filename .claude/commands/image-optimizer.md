---
description: 🖼️ Image оптимизатор — оптимизира продуктови снимки, WebP конверсия и lazy loading за mostcomputers.bg
---

# 🖼️ Агент: Image Оптимизатор

Оптимизира всички изображения на сайта — конверсия към WebP, responsive images, lazy loading и CDN стратегия.

## Стъпки

### 1. Разбери заявката
- Прочети `$ARGUMENTS`:
  - Пълен audit на всички изображения
  - Оптимизация на конкретна страница/секция
  - Имплементация на WebP конверсия
  - Lazy loading настройка
  - Responsive images (`srcset`)

### 2. Одит на текущите изображения
- Провери `index.html` за всички `<img>` тагове
- Провери `js/cards.js` за динамично генерирани product images
- Провери `js/gallery.js` за галерия изображения
- Провери `products.js` за image URLs на продуктите
- Идентифицирай:
  - Изображения без `width`/`height` атрибути (причиняват CLS)
  - Изображения без `loading="lazy"` под fold-а
  - Изображения без `alt` текст
  - Изображения без `srcset` за различни размери
  - Липсващ WebP формат

### 3. WebP конверсия стратегия
Имплементирай `<picture>` елемент с fallback:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Описание" width="400" height="300" loading="lazy">
</picture>
```

За динамично генерирани карти в `js/cards.js` — обнови template strings.

### 4. Lazy Loading
- Добави `loading="lazy"` на всички изображения под fold-а
- Hero image и first visible product — **НЕ** lazy (влияе на LCP)
- Провери `js/gallery.js` за intersection observer имплементация

### 5. Responsive Images
```html
<img
  src="product-400.jpg"
  srcset="product-400.jpg 400w, product-800.jpg 800w, product-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Продукт"
  width="800"
  height="600"
  loading="lazy"
>
```

### 6. Размери и aspect ratio
- Задължително добави `width` и `height` на всеки `<img>` — предотвратява CLS
- Product thumbnails: 300×300 или 400×400 (square)
- Hero images: 1200×600 или 1600×800 (2:1)
- Category banners: 800×400

### 7. Alt текстове
- Product images: `{brand} {name} — {category}`
- Logo: `Most Computers лого`
- Банери: описателен текст на български
- Декоративни изображения: `alt=""`

### 8. CSS background images
- Провери `styles.css` за background-image URL-и
- Добави WebP версии чрез:
  ```css
  .hero {
    background-image: url('hero.webp');
  }
  @supports not (background-image: url('test.webp')) {
    .hero { background-image: url('hero.jpg'); }
  }
  ```

### 9. Тествай
- Провери Chrome DevTools → Network → Images за размери
- Провери Lighthouse score за image optimization
- Тествай на мобилен за responsive images
- `npm test` за regression

## Формат на доклада
- 📊 Таблица: изображение → текущ размер → оптимизиран размер → % спестено
- ✅ CLS проблеми (липсващи width/height)
- 🦥 Lazy loading статус
- 📱 Responsive images статус
- Конкретни code changes за всеки проблем
