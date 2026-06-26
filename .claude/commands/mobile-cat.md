---
description: 📂 Mobile Cat — оптимизира категорийни и продуктови страници за мобил; стартирай с: категорийна страница мобил, продуктова страница мобил, filteri мобил, category page, PDP мобил, продуктов модал
model: claude-opus-4-8
---

# 📂 Агент: Mobile Cat (Category & Product Pages)

Специализиран агент за оптимизиране на категорийния листинг (`#catPage`) и продуктовия детайл (PDP) за мобилно устройство.

## Архитектура

### Category Page (`#catPage`)
- **HTML**: `index.html` около ред 4890 — `<div class="cat-page" id="catPage">`
- **JS**: `js/seo.js` — `openCatPage(cat, preSubcat)`, `buildCpSidebar()`, `cpRenderGrid()`, `cpGetFiltered()`
- **CSS**: `styles.css` — търси `.cat-page`, `.cat-page-inner`, `#cpGrid`, `.cp-filter-btn`
- **Отваряне**: `window.openCatPage('laptops')` или `window.openCatPage('peripherals','mouse')`

### Categories Overlay (`#mobCatsPage`)
- **HTML**: `index.html` около ред 762
- **CSS**: `.mob-cats-page`, `.mcp-cat`, `.mcp-hdr`, `.mcp-content`
- **JS**: `js/ui.js` — `openMobCatsPage()`, `closeMobCatsPage()`

### Product Detail Page (PDP)
- **JS**: `js/product-page.js` или `js/pdp-ux.js` (в `app-lazy.js`)
- **CSS**: търси `.pdp-`, `#pdpBackdrop`, `.prod-preview`
- **Отваряне**: клик на product card или `window.openProductPage(id)`

### Нормализация на категории (`normalizeCat`)
- Дефинирана в `js/filters.js` ред 4
- Валидни cat стойности: `laptops, desktops, gaming, components, monitors, peripherals, cameras, audio, network, storage, accessories, printers, ups, consumables, software, new, sale, promo`
- **ВНИМАНИЕ**: `'mice'` и `'keyboards'` НЕ са валидни — трябва `openCatPage('peripherals','mouse')` и `openCatPage('peripherals','keyboard')`

### CAT_META (`js/seo.js` ред 448)
Съдържа metadata за всяка категория: `{ emoji, icon, label, sub, badge }`.

## Задачи

### Задача 1: Одит на category page на мобил

Направи скрийншоти:
```js
// Отвори category page
await page.evaluate(() => window.openCatPage('laptops'));
await page.waitForTimeout(1200);
await page.screenshot({ path: 'catpage_top.png' });
await page.evaluate(() => document.querySelector('#catPage').scrollTop = 400);
await page.waitForTimeout(300);
await page.screenshot({ path: 'catpage_mid.png' });
// Отвори filter sidebar
await page.evaluate(() => document.querySelector('.cp-filter-btn')?.click());
await page.waitForTimeout(500);
await page.screenshot({ path: 'catpage_filters.png' });
```

Оцени:
- Header с категория и back бутон
- Grid layout на продуктовите карти (2 колони?)
- Filter бутон достъпен ли е?
- Subcat pills (Гейминг, Ултрабуци...) четими ли са?
- Сортиране достъпно ли е?
- Pagination / infinite scroll

### Задача 2: Оптимизирай category page grid за мобил

Провери CSS за `#cpGrid` на мобил. Оптимизирай:
- Grid: `grid-template-columns: 1fr 1fr` за 390px
- Card height: достатъчно компактна за мобил
- "Добави в кошница" бутон: min-height 44px, full width
- Price: ясна йерархия EUR + лв.

### Задача 3: Оптимизирай filter sidebar за мобил

Category page sidebar с филтри (`buildCpSidebar`) на мобил:
- Sidebar трябва да е скрит по default
- `.cp-filter-btn` отваря bottom sheet / drawer
- Прочети `js/seo.js` `buildCpSidebar()` функцията
- Провери дали `.cp-sidebar` е responsive

### Задача 4: Одит на PDP (product detail) на мобил

```js
// Отвори category page и кликни на продукт
await page.evaluate(() => window.openCatPage('laptops'));
await page.waitForTimeout(1200);
await page.click('#cpGrid .product-card, #cpGrid .card');
await page.waitForTimeout(1000);
await page.screenshot({ path: 'pdp_mobile.png' });
await page.evaluate(() => document.querySelector('.pdp-inner, #pdpPage')?.scrollTop = 300);
await page.waitForTimeout(300);
await page.screenshot({ path: 'pdp_mobile_mid.png' });
```

Оцени:
- Галерия (swipe работи?)
- Цена и "Добави в кошница" CTA
- Характеристики tab
- Back бутон

### Задача 5: Back навигация

Провери back button поведение:
- От category page → back → homepage
- От PDP → back → category page
- Bottom nav при всяка страница

Функции: `closeCatPage()`, `closeProductPage()` в `js/seo.js` и `js/ui.js`.

### Задача 6: Subcat chips оптимизация

`cpRenderSubcatBar(cat)` генерира subcat pills (напр. "Гейминг лаптопи", "Ултрабуци").
На мобил те трябва да са хоризонтално скролиращи с fade gradient.
Провери CSS: `.subcat-pill`, `#cpSubcatBar`.

## Playwright шаблон

```js
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport:{width:390,height:844},
    deviceScaleFactor:2,
    serviceWorkers:'block'
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  // ... твои действия
  console.log('JS errors:', errors);
  await br.close();
})();
```

## Правила
- НИКОГА не редактирай `app.js` или файлове в `dist/` директно
- Rebuild с `node build.js` след ВСЯКА JS или CSS промяна
- 262 Jest теста трябва да минат
- `serviceWorkers:'block'` задължително в Playwright
- Категорийни имена: винаги проверявай в `normalizeCat` в `js/filters.js`
- Back навигация: трябва да работи с browser back button (history.pushState)
