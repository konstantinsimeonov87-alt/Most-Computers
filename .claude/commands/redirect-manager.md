---
description: 🔀 Redirect Manager — 301 редиректи при изтрити/преименувани продукти, URL миграции и broken links; стартирай с: redirect, 301, 404, broken link, URL промяна, преименуван продукт, мигриране URL
---

# 🔀 Агент: Redirect Manager

Управлява 301 редиректи за mostcomputers.bg — предпазва SEO juice при URL промени, изтрити продукти и структурни миграции.

---

## Задача 1: Одит на 404 грешки

Прочети `js/seo.js` и `js/pages.js` за URL структурата.

Провери:
- Има ли механизъм за 404 handling в SPA-то?
- Показва ли се user-friendly 404 page?
- Логва ли се 404-ките някъде (Supabase, GA)?

Ако не — добави 404 tracking в `js/analytics.js`:
```javascript
// При 404
gtag('event', 'page_not_found', { page_url: location.href, referrer: document.referrer });
```

---

## Задача 2: Redirect таблица

Създай и поддържай `redirects.json` в root директорията:

```json
{
  "redirects": [
    {
      "from": "/stari-url-produkt",
      "to": "/nov-url-produkt",
      "type": 301,
      "reason": "продуктът е преименуван",
      "date": "2026-06-22"
    }
  ]
}
```

Добави всички известни redirect нужди.

---

## Задача 3: Имплементирай client-side redirects

Прочети `js/pages.js` — намери URL routing логиката.

Имплементирай redirect механизъм:
```javascript
// В js/pages.js при page load
async function checkRedirects(currentPath) {
  const redirects = await fetch('/redirects.json').then(r => r.json());
  const match = redirects.redirects.find(r => r.from === currentPath);
  if (match) {
    history.replaceState(null, '', match.to);
    // Load правилната страница
    loadPage(match.to);
  }
}
```

---

## Задача 4: Изтрит продукт → категория redirect

Когато продукт е изтрит от каталога:
- Redirect към категорийната му страница (не към 404)
- Покажи "Продуктът не е наличен. Виж подобни:" + 4 related продукта

Прочети `js/product-page.js` за да видиш как се зарежда product page.
Имплементирай fallback логиката.

---

## Задача 5: URL параметри нормализация

Провери дали тези URL варианти водят до едно и също:
- `/category?sort=price` vs `/category`
- `/product-name/` vs `/product-name` (trailing slash)
- Uppercase vs lowercase URLs

Добави нормализация в `js/pages.js` или `js/seo.js`.

---

## Задача 6: Redirect при category rename

Когато категория се преименува в каталога:
- Старият URL → нов URL (301)
- Всички продуктови links в старата категория се обновяват

Документирай процеса за ръчно изпълнение.

---

## Задача 7: Редовен 404 одит

Напиши скрипт `scripts/audit-redirects.js`:
- Чете всички URL-и от `js/data.js` (продукти + категории)
- Проверява дали са достъпни (не 404)
- Извежда списък с broken URLs за ръчна проверка

---

## Правила
- Само 301 (permanent) — не 302 за SEO-важни URL промени
- Поддържай `redirects.json` актуален при всяка URL промяна
- Документирай причината и датата на всеки redirect
- Никога не redirect-вай homepage или категорийни pages без одобрение
