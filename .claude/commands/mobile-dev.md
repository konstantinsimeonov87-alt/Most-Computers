---
description: 📱 Mobile Dev — имплементира мобилни UI/UX подобрения (CSS + JS); стартирай с: мобилно подобрение, mobile fix, мобилен стил, responsive, мобилен бутон, мобилна страница
model: claude-opus-4-8
---

# 📱 Агент: Mobile Dev

Имплементира мобилни UI/UX подобрения за mostcomputers.bg. Работи само в source файловете, rebuild-ва и тества.

## Архитектура на проекта

```
styles.css          ← единственият CSS source (13 000+ реда)
js/ui.js            ← UI interactions, overlays, bottom nav
js/filters.js       ← normalizeCat, getFilteredSorted, renderGrids
js/seo.js           ← openCatPage, CAT_META, buildCpSidebar, cpRenderGrid
js/actions.js       ← data-action система (runActionString)
js/cards.js         ← makeCard(), updateCart(), renderCart()
js/auth.js          ← openWishlist, openAuth, setBottomNavActive
js/cart.js          ← toggleCart, updateCart, checkout
js/search.js        ← closeSearchDropdown
index.html          ← единственият HTML файл (SPA)

dist/               ← BUILD АРТЕФАКТ — никога не редактирай директно
app.js              ← BUILD АРТЕФАКТ — никога не редактирай директно
app-lazy.js         ← BUILD АРТЕФАКТ — никога не редактирай директно
```

## Мобилни CSS правила

- Mobile-only стилове: `@media (max-width: 768px) { ... }`
- Добавяй нови мобилни стилове В КРАЯ на `styles.css`
- Ключови мобилни класове:
  - `.mob-hp-hero`, `.mob-hp-search`, `.mob-hp-tabs`, `.mob-hp-chips` — homepage hero
  - `.mob-bottom-nav`, `.bn-item` — bottom navigation
  - `.mob-cats-page`, `.mcp-cat` — categories overlay
  - `#catPage`, `.cat-page-inner` — category listing page
  - `#cartPanel`, `.checkout-btn` — cart
  - `.wishlist-back`, `#wishlistPage` — wishlist
  - `.auth-body`, `#authModal` — auth modal

## data-action система

Бутоните ползват `data-action` атрибут вместо onclick:
```html
<button data-action="openCatPage('laptops')">...</button>
<button data-action="closeMobCatsPage;openCatPage('monitors')">...</button>
```
`runActionString` в `js/actions.js` ги изпълнява чрез `window[functionName](args)`.

**Функциите трябва да са достъпни като `window.XXX`** — дефинирани в js/ файловете (не IIFE).

## Задачи

### Задача 1: Имплементирай конкретна промяна

Приеми `$ARGUMENTS`: описание на промяната.

Стъпки:
1. Прочети засегнатия файл(ове) с Read tool
2. Намери точния selector/функция с Grep
3. Приложи промяната с Edit tool
4. Rebuild: `node build.js`
5. Тест: `npx jest --no-coverage` (262 теста трябва да минат)
6. Вземи скрийншот за потвърждение:
```js
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, serviceWorkers:'block' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4444/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify_ПРОМЯНА.png' });
  await br.close();
})();
```

### Задача 2: CSS-only подобрение

Приеми `$ARGUMENTS`: описание на визуална промяна.

- Grep за съществуващия selector в styles.css
- Добави override в края на файла в `@media (max-width: 768px)` блок
- Rebuild + тест + скрийншот

### Задача 3: JS функционалност

Приеми `$ARGUMENTS`: описание на поведение което трябва да се добави.

- Определи в кой js/ файл е логиката
- Прочети съществуващия код
- Добави функционалността
- Ensure функцията е достъпна като `window.XXX` ако е нужно от data-action
- Rebuild + тест + скрийншот

### Задача 4: Debug мобилен проблем

Приеми `$ARGUMENTS`: описание на проблема.

```js
// Debug шаблон
const errors = [];
page.on('pageerror', e => errors.push('ERROR: ' + e.message));
// ... navigate и взаимодей
const state = await page.evaluate(() => ({
  // провери DOM state
}));
console.log(JSON.stringify({errors, state}, null, 2));
```

## Workflow при конфликти при push

Ако `git push` дава конфликт (обикновено в sw.js от CI auto-bump):
```bash
git stash
git pull --rebase origin main
git checkout --theirs sw.js dist/sw.js dist/app.js
git add sw.js dist/sw.js dist/app.js
git rebase --continue
git stash pop
git push origin main
```

## Commit формат

```bash
git add styles.css js/ФАЙЛ.js app.js app-lazy.js sw.js dist/app.js dist/styles.css dist/index.html dist/sw.js
git commit -m "fix(mobile): кратко описание

- Точка 1
- Точка 2

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

## Правила
- НИКОГА не редактирай `app.js`, `app-lazy.js`, `dist/*` директно
- НИКОГА `display:none` без `@media` guard (не скривай на desktop)
- НИКОГА em тирета (—) — само обикновено тире (-)
- НИКОГА `лв.` като основна ценова единица — само EUR
- Rebuild с `node build.js` след ВСЯКА промяна
- 262 Jest теста трябва да минат след всяка промяна
- Вземи скрийншот за потвърждение на промяната
