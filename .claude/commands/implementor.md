---
description: 🛠 Имплементатор — изпълнява одобрени задачи, пише код и прави промени по mostcomputers.bg
---

# 🛠 Агент: Имплементатор (Developer)

Този workflow имплементира одобрени функции и корекции по сайта.

## Предварителни условия
- Трябва да има одобрена задача от потребителя (от idea-generator, bug-hunter, или директна заявка)
- Задачата трябва да е ясно дефинирана с acceptance criteria

## Стъпки

### 1. Подготовка
- Прочети и разбери задачата
- Прочети релевантните файлове. Source JavaScript файловете са в `js/` — виж `js/_load-order.txt` за пълния списък от 18 модула (cart.js, search.js, auth.js, ui.js и др.). **НЕ редактирай `app.js` директно** — той е генериран bundle; редактирай само файловете в `js/`.
- Идентифицирай всички файлове, които ще бъдат засегнати
- Провери за съществуващи паттърни в кода, които трябва да се следват:
  - `data-action` атрибути за event handling
  - CSS naming convention (BEM-подобен)
  - SVG спрайт система (`#ic-*`)
  - Модални бекдропове и анимации

### 2. Планиране
- Създай implementation plan artifact с:
  - Описание на промените по файлове
  - Потенциални рискове
  - Как ще се тества

### 3. Имплементация
- Следвай тези правила при писане на код:

#### HTML
- Добавяй уникални `id` атрибути на интерактивни елементи
- Използвай `data-action` за event binding (следвай съществуващия паттърн)
- Добавяй `aria-*` атрибути за accessibility
- Използвай SVG спрайтовете от `#svgSprite` за икони

#### CSS
- Следвай съществуващия naming convention
- Добавяй responsive стилове с media queries
- Използвай CSS custom properties (`var(--primary)`, `var(--bg)`, etc.)
- Добавяй smooth transitions и micro-animations
- Тествай в dark mode ако е applicable

#### JavaScript
- Редактирай само файловете в `js/` (напр. `js/cart.js`, `js/search.js`, `js/ui.js`)
- **НЕ редактирай `app.js`** — след приключване на промените, rebuild-вай bundle-а с `node build.js`
- Не замърсявай глобалния scope без необходимост
- Добавяй error handling (try/catch)
- Кеширай DOM queries
- Използвай event delegation където е възможно
- Добавяй коментари за сложна логика

### 4. Тестване
- Тествай промените в браузъра:
  - Desktop viewport
  - Mobile viewport (375px wide)
  - Провери за JS грешки в конзолата
- Пусни `npm test` ако има unit тестове за засегнатия модул
// turbo

### 5. Документация
- Обнови walkthrough artifact с:
  - Какво беше променено и защо
  - Скрийншотове преди/след
  - Записи на key interactions (browser recordings)
