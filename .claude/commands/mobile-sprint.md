---
description: 🚀 Mobile Sprint — пълен цикъл audit→implement→test→push за мобилни подобрения; стартирай с: mobile sprint, мобилен спринт, пусни спринт, оправи мобила, batch mobile fixes
model: claude-opus-4-8
---

# 🚀 Агент: Mobile Sprint

Автоматизира пълния цикъл за мобилни подобрения:
**Одит → Приоритизация → Паралелна имплементация → Build → Test → Verify → Push**

## Архитектура на проекта (задължително познание)

```
SOURCE (редактирай само тук):
  styles.css          ← CSS (13 000+ реда). Мобил: @media (max-width: 768px)
  index.html          ← SPA HTML
  js/ui.js            ← overlays, bottom nav, setBottomNavActive, focusSearch
  js/filters.js       ← normalizeCat, renderGrids
  js/seo.js           ← openCatPage, CAT_META, cpRenderGrid
  js/actions.js       ← data-action система
  js/cart.js          ← updateCart, toggleCart
  js/search.js        ← closeSearchDropdown
  js/auth.js          ← openWishlist, openAuth

BUILD АРТЕФАКТИ (никога не редактирай):
  app.js, app-lazy.js, dist/*

BUILD КОМАНДА: node build.js
ТЕСТ КОМАНДА: npx jest --no-coverage  (трябва 262/262)
DEV СЪРВЪР: http://localhost:4444 (dist/, serviceWorkers:'block')
```

## Playwright шаблон

```js
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    serviceWorkers: 'block'
  });
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  await page.goto('http://localhost:4444/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // действия тук
  await br.close();
})();
```

---

## ФАЗА 1 — ОДИТ

Вземи скрийншоти на всички ключови мобилни екрани и ги анализирай:

```js
// Homepage
await page.screenshot({ path: 'sprint_home_top.png' });
await page.evaluate(() => window.scrollBy(0, 500));
await page.waitForTimeout(300);
await page.screenshot({ path: 'sprint_home_mid.png' });

// Categories overlay
await page.evaluate(() => window.scrollTo(0,0));
await page.evaluate(() => window.openMobCatsPage());
await page.waitForTimeout(600);
await page.screenshot({ path: 'sprint_cats.png' });

// Category page
await page.evaluate(() => { window.closeMobCatsPage(); window.openCatPage('laptops'); });
await page.waitForTimeout(1200);
await page.screenshot({ path: 'sprint_catpage.png' });

// Product
await page.click('#cpGrid .product-card, #cpGrid .card');
await page.waitForTimeout(1000);
await page.screenshot({ path: 'sprint_pdp.png' });

// Cart
await page.evaluate(() => { window.closeProductPage && window.closeProductPage(); window.closeCatPage && window.closeCatPage(); });
await page.waitForTimeout(300);
await page.click('#bn-cart');
await page.waitForTimeout(700);
await page.screenshot({ path: 'sprint_cart.png' });

// Footer
await page.evaluate(() => { window.toggleCart && window.toggleCart(); window.scrollTo(0, document.body.scrollHeight); });
await page.waitForTimeout(500);
await page.screenshot({ path: 'sprint_footer.png' });
```

Прочети ВСЯКО изображение с Read tool. За всеки екран оцени:
- Touch targets (мин 44px)
- Четимост (мин 14px текст)
- Overflow/clipping
- Визуална консистентност с design system
- CTA достъпност (thumb zone)
- JS грешки

---

## ФАЗА 2 — ПРИОРИТИЗАЦИЯ

Групирай проблемите по файл:

```
CSS_FIXES = [проблеми решими само в styles.css]
JS_FIXES  = [проблеми изискващи JS промени в js/*.js]
HTML_FIXES = [проблеми в структурата на index.html]
```

Сортирай по impact (колко потребители засяга × колко лесно за fix).
Представи списъка и изчакай потвърждение ако `$ARGUMENTS` е празен.
Ако `$ARGUMENTS` съдържа "auto" — продължи без пауза.

---

## ФАЗА 3 — ПАРАЛЕЛНА ИМПЛЕМЕНТАЦИЯ

Spawn паралелни агенти за независими файлови групи.

### Agent A — CSS fixes (само styles.css)

Prompt template:
```
Ти си мобилен CSS разработчик на Most Computers PWA.
Имплементирай следните CSS-only мобилни подобрения в styles.css:

[CSS_FIXES от Фаза 2]

ПРАВИЛА:
- Редактирай САМО styles.css
- Добавяй в КРАЯ на файла в @media (max-width: 768px) блокове
- Не пускай build
- Използвай Grep за намиране на селектори преди Edit
- Потвърди с diff накрая
```

### Agent B — JS fixes (само js/*.js)

Prompt template:
```
Ти си мобилен JS разработчик на Most Computers PWA.
Имплементирай следните JS мобилни подобрения:

[JS_FIXES от Фаза 2]

ПРАВИЛА:
- Редактирай САМО файлове в js/ директорията
- НЕ пипай app.js, app-lazy.js, dist/*
- Функциите трябва да са достъпни като window.XXX
- Не пускай build
- Прочети файловете с Read преди Edit
```

### Agent C — HTML fixes (само index.html)

Prompt template:
```
Ти си мобилен HTML разработчик на Most Computers PWA.
Имплементирай следните HTML структурни подобрения:

[HTML_FIXES от Фаза 2]

ПРАВИЛА:
- Редактирай САМО index.html
- Не пипай styles.css или js/*
- data-action стойности: функцията трябва да е в window.*
- Не пускай build
- Прочети засегнатите секции с Read преди Edit
```

**Стартирай агентите с `isolation: "worktree"` и `run_in_background: true`.**
Изчакай всички да завършат.

---

## ФАЗА 4 — MERGE

След като агентите приключат, копирай промените в main:

```bash
# CSS агент
cp ".claude/worktrees/AGENT_CSS_PATH/styles.css" "styles.css"

# JS агент
cp ".claude/worktrees/AGENT_JS_PATH/js/ui.js" "js/ui.js"
cp ".claude/worktrees/AGENT_JS_PATH/js/cart.js" "js/cart.js"
# ... останалите засегнати js файлове

# HTML агент
cp ".claude/worktrees/AGENT_HTML_PATH/index.html" "index.html"
```

Провери git diff за всеки файл преди merge.

---

## ФАЗА 5 — BUILD И TEST

```bash
node build.js
npx jest --no-coverage
```

Ако тестовете не минат — debug и fix преди да продължиш.
**262/262 тест трябва да минат.**

---

## ФАЗА 6 — VERIFY

Вземи нови скрийншоти на засегнатите екрани и сравни с тези от Фаза 1.

За всяка имплементирана точка: ✅ потвърдено / ❌ не работи (и защо).

---

## ФАЗА 7 — COMMIT И PUSH

```bash
git add styles.css js/*.js index.html app.js app-lazy.js sw.js \
        dist/app.js dist/styles.css dist/index.html dist/sw.js

git commit -m "fix(mobile): [обобщение на промените]

$(списък с bullet points)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

При конфликт при push (обичайно sw.js от CI):
```bash
git stash
git pull --rebase origin main
git checkout --theirs sw.js dist/sw.js dist/app.js
git add sw.js dist/sw.js dist/app.js
git rebase --continue
git stash pop
git push origin main
```

---

## ФИНАЛЕН ДОКЛАД

```
## Mobile Sprint — [дата]

### Одит: [N] проблема намерени

### Имплементирано:
✅ [fix 1] — [файл]
✅ [fix 2] — [файл]
⚠️ [fix 3] — частично (причина)
❌ [fix 4] — пропуснато (причина)

### Build: ✅ успешен
### Тестове: 262/262 ✅
### Push: commit [hash]

### Следващи стъпки:
- [какво остана]
```

## Правила
- Никога не редактирай `app.js`, `app-lazy.js`, `dist/*` директно
- `serviceWorkers: 'block'` задължително в Playwright
- Rebuild след ВСЯКА промяна
- 262 Jest теста трябва да минат
- Никога em тирета (—) — само обикновено тире (-)
- EUR е основна валута, лв. е вторично
- Само марки от XML фийдовете — никога Dell, Apple, HP ако ги няма в каталога
- Никога събота в работното време (само Пон-Пет 09:30-18:15)
