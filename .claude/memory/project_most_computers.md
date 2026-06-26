---
name: Most Computers project
description: E-commerce PWA за електроника, структура и ключови архитектурни решения
type: project
---

## Проект: Most Computers (mostcomputers.bg)

Vanilla JS PWA за онлайн магазин за електроника. Без framework.

### Файлова структура
- `index.html` — главна страница (единична SPA страница)
- `app.js` — **пълен бъндъл**, rebuild-нат от всички js/ файлове (без admin.js)
- `styles.css` — всички стилове (~308KB raw, ~49KB gzip)
- `sw.js` — Service Worker v4, кешира само: `./`, `index.html`, `styles.css`, `app.js`
- `js/` — source файлове (18 модула + admin.js)
- `icons/` — PWA иконки (192x192 и 512x512 PNG)
- `Most Computers/` — Jest тест suite (125 теста)

### Важно: app.js е генериран бъндъл
`app.js` се rebuild-ва от js/ файловете в този ред (от `_load-order.txt` + pdp-ux.js):
currency, data, cards, ui, gallery, cart, search, auth, recently-viewed, filters,
order-tracker, pwa, product-page, pdp-ux, seo, pages, actions, main + admin stub

**НЕ редактирай app.js директно** — редактирай source файловете в js/ и rebuild.
За rebuild използвай Node.js скрипт (вж. историята на разговора).

### Admin панел — lazy loading
- `js/admin.js` се зарежда **динамично** само когато потребителят отвори admin панела
- Stub функциите `openAdminPage` и `_doOpenAdmin` са в app.js
- PIN защита: `window._adminUnlocked` (стойността е в js/admin.js и stub-а в app.js)
- `window._adminScriptLoaded` = флаг дали admin.js вече е зареден

### Направени промени
- FREE_SHIP_BGN = 200 лв. (беше 100)
- PWA theme_color = #bd1105 (беше #6366f1)
- Admin PIN защита добавена
- icons/ папка създадена
- index.html.html → index.html (преименуван)
