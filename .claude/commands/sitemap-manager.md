---
description: 🗺 Sitemap Manager — XML sitemap генериране, robots.txt и canonical тагове; стартирай с: sitemap, robots.txt, canonical, индексиране, crawl, XML, Google Search Console
model: claude-opus-4-8
---

# 🗺 Агент: Sitemap Manager

Управлява XML sitemap, robots.txt и canonical тагове за mostcomputers.bg. Осигурява пълно и правилно Google индексиране на каталога.

---

## Задача 1: Одит на текущия sitemap

Провери дали съществува `/sitemap.xml` и `/robots.txt`.

Провери:
- Покрити ли са всички категорийни URLs?
- Включени ли са продуктовите pages (ако са отделни URLs)?
- `lastmod` дати актуални ли са?
- `changefreq` и `priority` зададени ли са правилно?
- robots.txt сочи ли към sitemap?

---

## Задача 2: Генерирай XML sitemap

Прочети `js/data.js` за всички продукти и категории.
Прочети `js/seo.js` за URL структурата.

Генерирай `sitemap.xml` с:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://mostcomputers.bg/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Категории — priority 0.8, changefreq weekly -->
  <!-- Продукти — priority 0.6, changefreq weekly -->
  <!-- Static pages — priority 0.4, changefreq monthly -->
</urlset>
```

Запази като `sitemap.xml` в root директорията.

---

## Задача 3: robots.txt

Провери или създай `robots.txt`:

```
User-agent: *
Allow: /

# Блокирай admin и utility URLs
Disallow: /admin
Disallow: /api/
Disallow: /?sort=
Disallow: /?page=

# Crawl delay за bandwidth
Crawl-delay: 2

Sitemap: https://mostcomputers.bg/sitemap.xml
```

Адаптирай към реалните URL параметри в сайта.

---

## Задача 4: Canonical тагове одит

Прочети `js/seo.js` и `index.html`.

Провери:
- Има ли `<link rel="canonical">` на всяка page?
- Canonical URL правилен ли е при филтрирани/сортирани pages?
- Paginated pages имат ли `rel="next"` / `rel="prev"`?
- Duplicate URLs (с/без trailing slash, с/без www) canonical ли се?

Приложи fixes в `js/seo.js`.

---

## Задача 5: Sitemap index за голям каталог

Ако каталогът е >1000 продукта, раздели sitemap-а:

```xml
<!-- sitemap-index.xml -->
<sitemapindex>
  <sitemap>
    <loc>https://mostcomputers.bg/sitemap-categories.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://mostcomputers.bg/sitemap-products.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://mostcomputers.bg/sitemap-static.xml</loc>
  </sitemap>
</sitemapindex>
```

Генерирай отделните файлове.

---

## Задача 6: Auto-refresh sitemap скрипт

Напиши Node.js скрипт `scripts/generate-sitemap.js`:
- Чете `js/data.js`
- Генерира `sitemap.xml` автоматично
- Може да се добави към build процеса

---

## Задача 7: Structured data проверка

Прочети `js/seo.js` — провери JSON-LD schema markup:
- `Organization` на homepage
- `BreadcrumbList` на category/product pages
- `Product` schema на PDP с `offers`, `availability`, `price`
- `WebSite` с `SearchAction`

Добави липсващите.

---

## Правила
- sitemap.xml не включва `?` URL параметри
- Само публично достъпни URLs (без admin, без login-required)
- `lastmod` = дата на последна промяна на данните, не днешната дата
- Тествай с Google Search Console след промяна
