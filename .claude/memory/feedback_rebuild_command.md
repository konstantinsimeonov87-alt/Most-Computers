---
name: feedback-rebuild-command
description: Правилната rebuild команда е node build.js — НЕ cat на всички js/ файлове; data.js се зарежда отделно като data-core.js
metadata:
  type: feedback
---

Единствената правилна rebuild команда е `node build.js`.

**Why:** app.js е critical bundle БЕЗ data.js. data.js се зарежда отделно от index.html като `data-core.js`. При cat на всички js/ файлове, `let cart=` се декларира два пъти (веднъж в data-core.js, веднъж в app.js) и сайтът спира да работи — renderGrids не се достига и продуктите не се зареждат.

**How to apply:** Винаги използвай `node build.js` след промяна на JS файлове. Командата:
1. Сглобява `app.js` (critical): currency.js, cards.js, ui.js, recently-viewed.js, filters.js, seo.js, actions.js, auth.js, order-tracker.js, lazy-proxy.js, main.js
2. Сглобява `app-lazy.js` (lazy): gallery.js, cart.js, search.js, product-page.js, pdp-ux.js, pages.js, pwa.js, admin-loader.js, analytics.js, lazy-init.js
3. Обработва data.js → data-core.js и data-details.js отделно

**Never:** `cat js/currency.js js/data.js js/cards.js ... > app.js` — това включва data.js в app.js и причинява duplicate declaration crash.
