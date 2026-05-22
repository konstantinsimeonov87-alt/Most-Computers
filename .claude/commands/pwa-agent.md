---
description: 📱 PWA агент — управлява Service Worker, push notifications, offline режим и installability за mostcomputers.bg
---

# 📱 Агент: PWA (Progressive Web App)

Управлява всички PWA функционалности — service worker, push notifications, offline режим, installability.

## Стъпки

### 1. Разбери заявката
- Прочети `$ARGUMENTS`:
  - PWA одит (пълна проверка)
  - Service worker обновяване
  - Push notifications имплементация
  - Offline страница
  - Install prompt оптимизация
  - Cache стратегия промяна

### 2. PWA Одит
Провери следните файлове:
- `sw.js` — Service Worker
- `manifest.json` — Web App Manifest
- `index.html` — PWA мета тагове и регистрация
- `js/pwa.js` — PWA JS логика

Чеклист:
```
Manifest:
  □ name и short_name
  □ icons (192×192 и 512×512, PNG)
  □ start_url
  □ display: standalone
  □ theme_color и background_color
  □ description
  □ lang: "bg"

Service Worker:
  □ Регистриран в index.html
  □ Install event — precache на critical assets
  □ Fetch event — cache стратегия
  □ Activate event — изчистване на стари кешове
  □ Cache versioning (CACHE_VERSION = 'v1.x')

HTML:
  □ <link rel="manifest">
  □ <meta name="theme-color">
  □ apple-touch-icon
  □ meta viewport
```

### 3. Cache стратегии
```javascript
// Cache First — статични assets (CSS, JS, fonts)
// Network First — API данни (Supabase)
// Stale While Revalidate — product images
// Network Only — checkout, поръчки (критично!)

const STRATEGIES = {
  static: 'cache-first',      // app.js, styles.css
  images: 'stale-while-revalidate', // product images
  api: 'network-first',       // Supabase queries
  checkout: 'network-only'    // никога не кешираме checkout!
};
```

### 4. Offline страница
Създай `offline.html`:
```html
- Ясно съобщение "Няма връзка с интернет"
- Покажи последно кешираните продукти от localStorage
- Бутон "Опитай отново" (проверява connection)
- Wishlist и кошница (работят offline от localStorage)
- Контакти на магазина (телефон, адрес)
```

### 5. Push Notifications
```javascript
// Поискай разрешение
async function requestPushPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY
    });
    // Изпрати subscription до Supabase
  }
}

// Случаи за push notifications:
// 1. Abandoned cart (след 30 мин)
// 2. Промоция на wishlist продукт
// 3. Поръчката е изпратена
// 4. Продуктът е отново в наличност
```

### 6. Install Prompt
```javascript
// Покажи custom install banner след:
// - 2+ посещения
// - 30+ секунди на сайта
// - Разгледани 3+ продукта
// НЕ показвай веднага при влизане!

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // Съхрани и покажи при правилния момент
});
```

### 7. Cache версиониране
При обновяване на SW:
```javascript
const CACHE_VERSION = 'mostcomputers-v1.8.0';
// При activate — изтрий всички стари кешове
// Notify потребителя: "Налична е нова версия" с бутон "Обнови"
```

### 8. Тествай
- Chrome DevTools → Application → Service Workers
- Lighthouse PWA одит (цел: 100/100)
- Тествай offline режим (DevTools → Network → Offline)
- Тествай install prompt на мобилен
- `npm test` за regression

## Формат на доклада
- PWA чеклист с статус (✅/❌/⚠)
- Lighthouse PWA score (преди/след)
- Cache стратегия документация
- Push notification setup инструкции
- Конкретни code changes
