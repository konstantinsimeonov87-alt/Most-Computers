---
description: 🖼 Image Optimizer — WebP конвертиране, компресия и lazy loading на продуктови снимки; стартирай с: снимки, images, webp, компресия, оптимизация изображения, lazy load
model: claude-opus-4-8
---

# 🖼 Агент: Image Optimizer

Оптимизира изображенията на mostcomputers.bg — WebP конвертиране, компресия, lazy loading и placeholder стратегия.

## Контекст

Product images идват от: `https://portal.mostbg.com/api/images/imageFileData/[id].[ext]`
Hero images са локални в: `img/` директорията
Favicon/og images: `img/`, `dist/`

---

## Задачи

### Задача 1: Одит на изображенията
- Провери `index.html` за всички `<img>` тагове — имат ли `loading="lazy"`?
- Провери `js/cards.js` и `js/product-page.js` — как се генерират img тагове?
- Провери `styles.css` за background-image употреба
- Провери размерите на локалните img файлове:
  ```bash
  Get-ChildItem img/ | Select-Object Name, @{N='KB';E={[math]::Round($_.Length/1KB,1)}}
  ```
- Изведи доклад: кои изображения са над 200KB, кои липсват `loading="lazy"`

### Задача 2: Добави lazy loading
Прочети `js/cards.js` за генерирането на product card HTML.
Прочети `js/product-page.js` за gallery HTML.

За всеки `<img>` без `loading="lazy"`:
- Добави `loading="lazy"`
- Добави `decoding="async"`
- Добави `width` и `height` атрибути (ако липсват) за CLS prevention

Пример:
```html
<!-- Преди -->
<img src="${img}" alt="${name}">
<!-- След -->
<img src="${img}" alt="${name}" loading="lazy" decoding="async" width="300" height="300">
```

- Rebuild с `node build.js`
- `npm test`

### Задача 3: WebP стратегия за локални изображения
Провери локалните изображения в `img/`:
```bash
Get-ChildItem img/ -Include "*.jpg","*.jpeg","*.png" | Select-Object Name
```

За всеки файл над 100KB предложи:
```html
<picture>
  <source srcset="img/[name].webp" type="image/webp">
  <img src="img/[name].jpg" alt="..." loading="lazy">
</picture>
```

Провери дали `sharp` или `cwebp` е наличен за конвертиране:
```bash
npx sharp-cli --version 2>$null
```

### Задача 4: Placeholder / blur-up ефект
За hero изображения имплементирай blur-up техника:
1. Генерирай tiny placeholder (10x10px, inline base64)
2. Покажи placeholder докато зарежда реалното изображение
3. Плавен transition при зареждане

```javascript
// Добави в js/ui.js или js/gallery.js
function lazyLoadWithBlur(img) {
  img.style.filter = 'blur(10px)';
  img.style.transition = 'filter 0.3s';
  img.addEventListener('load', () => { img.style.filter = ''; });
}
```

**Важно:** Никога не използвай CSS blend modes или filter за hero изображения на продукти — обработвай pixel-level с Node.js.

### Задача 5: Product image fallback
Прочети `js/cards.js` за error handling на изображения.

Добави fallback при broken image:
```javascript
img.onerror = function() {
  this.src = 'img/placeholder.png';
  this.onerror = null; // предотврати infinite loop
};
```

Провери дали `img/placeholder.png` съществува.

### Задача 6: Доклад за performance влияние
- Изведи таблица: файл | размер преди | очакван размер след WebP | спестявания %
- Изчисли очаквано подобрение на LCP (Largest Contentful Paint)
- Препоръчай приоритет: кои изображения да се оптимизират първо

## Правила
- НЕ ползвай CSS blend modes или filter за product hero images — pngjs в Node.js
- `loading="lazy"` само за off-screen елементи — first viewport трябва да е eager
- Rebuild с `node build.js` след JS промени
- `npm test` след всяка промяна