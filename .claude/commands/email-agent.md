---
description: 📧 Email агент — управлява email templates, abandoned cart имейли и transactional emails за mostcomputers.bg
---

# 📧 Агент: Email Marketing

Управлява всички email комуникации — abandoned cart, transactional emails, промоционални кампании и templates.

## Стъпки

### 1. Разбери заявката
- Прочети `$ARGUMENTS`:
  - Abandoned cart email (ремайндер за изоставена кошница)
  - Order confirmation email
  - Промоционална кампания
  - Нов email template
  - Одит на съществуващи emails

### 2. Прегледай текущата email логика
- Провери `js/cart.js` за abandoned cart reminder имплементация
- Провери `js/auth.js` за user email при регистрация
- Провери `js/order-tracker.js` за order confirmation логика
- Идентифицирай:
  - Кога се изпраща abandoned cart reminder
  - Какви данни се пращат (продукти, цени, потребител)
  - Email service provider (Supabase Edge Functions? External API?)

### 3. Abandoned Cart Email Template
Структура за висок conversion:
```html
Subject: Забравихте нещо? Вашата кошница ви чака 🛒

Заглавие: [Потребителско ime], имате продукти в кошницата

Секция 1 - Продукти:
  [Снимка] [Продукт] [Цена]
  [Бутон: Завърши поръчката →]

Секция 2 - Urgency:
  "Наличността е ограничена — запазете цената сега"

Секция 3 - Trust:
  ✓ Безплатна доставка над 100 лв
  ✓ 14 дни право на връщане
  ✓ Официална гаранция

Footer: unsubscribe | политика за поверителност
```

### 4. Order Confirmation Template
```html
Subject: Поръчка #[ID] потвърдена — Most Computers

- Резюме на поръчката (продукти, количества, цени)
- Обща сума + доставка
- Очаквана дата на доставка
- Проследяване на поръчката (линк към order tracker)
- Контакти за поддръжка
```

### 5. Промоционален Email Template
```html
Subject: [Промоция] — само до [дата]

- Hero banner с промоцията
- Топ 3-5 продукта с намалени цени
- CTA бутон: "Виж всички оферти"
- Краен срок (urgency)
- Unsubscribe линк
```

### 6. Технически изисквания
- **Responsive** — работи на мобилен (min-width: 320px)
- **Dark mode** — поддържа `prefers-color-scheme: dark`
- **Plain text fallback** — за email клиенти без HTML
- **Alt текстове** — на всички изображения
- **Unsubscribe** — задължително в footer (GDPR)
- **Preheader text** — 40-90 символа след subject line

### 7. GDPR съответствие
- Unsubscribe линк в ВСЕКИ имейл
- Само на потребители, дали съгласие
- Данни за изпращача (адрес на фирмата)
- Ясна цел на имейла

### 8. Тествай
- Провери rendering в Gmail, Outlook, Apple Mail
- Провери мобилен изглед
- Провери всички линкове
- Провери unsubscribe functionality

## Формат на доклада
- HTML template (готов за употреба)
- Plain text версия
- Subject line варианти (A/B тест)
- Технически бележки (ESP интеграция)
- GDPR чеклист
