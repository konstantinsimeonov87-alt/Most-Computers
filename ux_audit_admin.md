# 🎨 UX/UI Одит — Admin Panel · mostcomputers.bg
**Дата:** 2026-06-04 | **Одитор:** UX Auditor Agent | **Scope:** js/admin.js + index.html (admin секция)

---

## 📊 Обобщена оценка

| Категория | Оценка | Бележка |
|-----------|--------|---------|
| Визуална йерархия | 6/10 | Добра основа, но масивен inline CSS |
| Workflow ефективност | 5/10 | Критични gaps: фалшиви данни, липсващи потвърждения |
| Навигация | 7/10 | Ясна структура, но дублирани икони и bug в Settings |
| Консистентност на стила | 4/10 | 80%+ от tab съдържанието е inline CSS |
| Мобилна използваемост | 5/10 | Sidebar изчезва без замяна |
| Информационна точност | 3/10 | Три таба показват фалшиви данни |

---

## 🔴 КРИТИЧНИ ПРОБЛЕМИ (трябва да се оправят)

---

### 1. Двоен `tab === 'settings'` — единият таб никога не се показва
**Файл:** [js/admin.js:1042](js/admin.js#L1042) и [js/admin.js:1100](js/admin.js#L1100)

В `adminShowTab()` има два `else if (tab === 'settings')` клона в един и същи if-else chain. JS изпълнява само **втория** (редове 1100–1116), а **първият** (1042–1099) — с currency editor и danger zone — **никога не се рендерира**.

```js
// Ред 1042 — НИКОГА не се достига поради...
} else if (tab === 'settings') { /* пълни настройки с currency + danger zone */ }
// Ред 1100 — ...този блок го засенчва
} else if (tab === 'settings') { /* само SEO инструменти */ }
```

**Ефект:** Администраторът не може да достигне currency editor-а и Danger Zone.

---

### 2. Таб "Клиенти" показва 100% измислени данни
**Файл:** [js/admin.js:771-783](js/admin.js#L771)

```js
const customers = ['Георги Тодоров','Мария Иванова', ...]; // hardcoded имена
// Math.random() за поръчки, сума и дата
```

Субтитълът казва **"891 регистрирани клиента"** (hardcoded), а стойностите са изцяло `Math.random()`. Администраторът вижда измислена информация и взима решения на база нея. Реалните данни за клиенти **съществуват** в поръчките (`o.customer`, `o.email`) — просто не се агрегират.

---

### 3. Dashboard "Топ продукти" използва `Math.random()`
**Файл:** [js/admin.js:674](js/admin.js#L674)

```js
<td>${Math.floor(Math.random()*80+20)}</td>  // "Продадени"
<td>${(p.price*(Math.floor(Math.random()*80+20))).toLocaleString()} лв.</td>  // "Приход"
```

При всяко отваряне на Dashboard числата се сменят. Таблицата с "Топ продукти" е напълно ненадеждна.

---

### 4. Dashboard hardcoded fallback приходи
**Файл:** [js/admin.js:610](js/admin.js#L610)

```js
thisMoRev = thisMoRev || 47300;  // показва 47,300 лв. когато няма поръчки
lastMoRev = lastMoRev || 61700;
thisMoCnt = thisMoCnt || 143;
```

Когато реалните поръчки са 0, Dashboard показва **47,300 лв. приход** и **143 поръчки** — изцяло измислени стойности.

---

### 5. Промяна на статус на поръчка без потвърждение
**Файл:** [js/admin.js:695](js/admin.js#L695)

```js
<select onchange="adminChangeOrderStatus('${o.num}',this.value)">
```

Едно случайно движение на скрол в `<select>` сменя статуса незабавно. Няма "Сигурен ли си?" стъпка. Особено рисково за `cancelled`.

---

## 🟠 ВАЖНИ ПРОБЛЕМИ (препоръчани)

---

### 6. Дублирани икони в навигацията
**Файл:** [index.html:3972](index.html#L3972) и [index.html:3985](index.html#L3985)

Два nav item-а използват иконата 📦:
- "Поръчки" → 📦
- "Инвентар" → 📦

Визуалното сканиране на sidebar-а е по-бавно когато иконите се повтарят. Препоръка: "Инвентар" → `📋` или `🗄`.

---

### 7. Products topbar overflow — 6+ бутона
**Файл:** [js/admin.js:710-726](js/admin.js#L710)

```
[+ Добави] [🔧 Нормализирай] [⬇ JSON] [⬇ CSV] [🗑 Изтрий избраните] [🏷 Бадж] [🗂 Подкатегория] [✕]
```

На 1280px или по-малко тези бутони се препълват. Bulk actions (изтриване, бадж, подкатегория) трябва да се появяват само при selection — **вече е имплементирано** (display:none при 0 selection), но останалите 5 постоянни бутона са твърде много. JSON и CSV export могат да се наберат в dropdown.

---

### 8. Inline price/stock editing без визуален сигнал
**Файл:** [js/admin.js:551](js/admin.js#L551) и [js/admin.js:555](js/admin.js#L555)

```js
onclick="adminInlineEdit(id,'price')" title="Клик за редактиране на цена"
```

Клетките са кликаеми, но единственият hint е `title` атрибут (tooltip при hover). Потребителят не знае за тази функция. Трябва поне `cursor: pointer` + pencil икона при hover.

---

### 9. Analytics показва само session данни
**Файл:** [js/admin.js:1317](js/admin.js#L1317)

```
"Табло — 0 записани събития от тази сесия"
```

`mc_analytics_log` в localStorage се изчиства при всяко reload. Няма персистиране. Стойността е нула при всяко отваряне. Analytics таба е практически безполезен.

---

### 10. Analytics валута: лв. вместо €
**Файл:** [js/admin.js:1329](js/admin.js#L1329)

```js
<div class="admin-stat-val">${purchaseRevenue.toFixed(2)} лв.</div>
```

Целият admin panel използва € (Dashboard, Orders, Products), но Analytics показва лв. Несъответствие.

---

### 11. Blog таб: само метаданни, без body editor
**Файл:** [js/admin.js:1394-1418](js/admin.js#L1394)

Формата за нова статия съдържа: заглавие, категория, emoji, времe за четене, резюме. **Няма поле за основно съдържание** (body). Не може да се напише реална статия.

---

### 12. Модал "Продуктов редактор" — gallery само 1 снимка
**Файл:** [index.html:4115-4120](index.html#L4115) + [js/admin.js:1687](js/admin.js#L1687)

```js
gallery: newImg ? [newImg] : [],  // gallery винаги е масив от 1 елемент
```

В модала има само едно поле `aef-img` за снимка. Продуктите имат `gallery[]` масив, но от UI може да се добави само главна снимка.

---

### 13. Без warning при затваряне на Product Editor с незапазени промени
**Файл:** [js/admin.js:1582](js/admin.js#L1582)

```js
function closeProductEditor() {
  document.getElementById('adminEditorBackdrop').classList.remove('open');
  // ← няма проверка за unsaved changes
}
```

Клик върху backdrop-а или ✕ бутона затваря модала без потвърждение. Работата по продукт се губи мълчаливо.

---

## 🟡 MINOR ПРОБЛЕМИ (подобрения)

---

### 14. Масивен inline CSS в JS template literals
**Файл:** [js/admin.js:430-585](js/admin.js#L430) (Products table), [677-702](js/admin.js#L677) (Orders), [617-676](js/admin.js#L617) (Dashboard)

Приблизително **80% от admin UI** се рендерира чрез inline `style=""` атрибути в JS template strings. Примери:
```js
style="background:rgba(99,102,241,0.25);color:#a5b4fc;border:1px solid rgba(99,102,241,0.5);border-radius:6px;padding:4px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.15s;white-space:nowrap;"
```

**Проблеми:** не може да се теми, дублира се, трудно се поддържа, влияе на performance при re-render.

---

### 15. Pagination функция btnStyle() генерира 100+ char inline CSS
**Файл:** [js/admin.js:569](js/admin.js#L569)

```js
const btnStyle = (active) => 'background:' + (active?'rgba(96,165,250,.25)':'rgba(255,255,255,.05)') + ...
```

Трябва CSS клас `admin-pg-btn` и `admin-pg-btn.active`.

---

### 16. Мобилна навигация — sidebar изчезва без замяна
**Файл:** [styles.css:11225-11233](styles.css#L11225)

```css
@media (max-width: 768px) {
  .admin-sidebar { display: none; }   /* ← пълно скриване */
  .admin-main { padding: 12px; }
}
```

На мобилно устройство цялата навигация е недостъпна. Трябва hamburger бутон или bottom nav bar.

---

### 17. Orders таб — без search/filter
**Файл:** [js/admin.js:677-702](js/admin.js#L677)

Поръчките са просто плосък списък. Без търсене по клиент, без filter по статус, без date range. При 100+ поръчки е практически неизползваем.

---

### 18. `aef-btn-cancel` с inline style override
**Файл:** [index.html:4046](index.html#L4046)

```html
<button class="aef-btn-cancel" style="padding:6px 12px;font-size:12px;">✕</button>
```

Inline стил override на CSS клас — трябва да е в класа.

---

### 19. Nav item selector използва `onclick*=` pattern
**Файл:** [js/admin.js:588](js/admin.js#L588)

```js
const active = document.querySelector(`.admin-nav-item[onclick*="'${tab}'"]`);
```

Крехка selekция — разчита на текста на onclick атрибута. Ако атрибутът се промени или има друг nav item с подобен onclick, ще се счупи. Трябва `data-tab="${tab}"` атрибут.

---

## ✅ ДОБРИ ПРАКТИКИ (запазете ги)

1. **Sidebar sticky позиция** — sidebar остава видим при скрол на дългото съдържание
2. **Inline editing** за price/stock — бързо, без да се отваря пълен модал
3. **Bulk operations** — checkbox selection + batch badge/subcat/delete
4. **Auto-update с countdown** — визуалният ring timer в XML импорт е отличен UX
5. **Category group headers** в Products table — групирането по категория улеснява намирането
6. **`.aef-saved-flash` animation** при запис — добър feedback
7. **Data-action pattern** — централизирана обработка на clicks
8. **XML Import** — drag-and-drop зона + paste + URL + JSON tabs — пълно покритие

---

## 🎯 Приоритизиран Action Plan

### Фаза 1 — Критично (1-2 часа)
| # | Задача | Файл | Усилие |
|---|--------|------|--------|
| 1 | Оправи duplicate `tab === 'settings'` bug | admin.js:1042+1100 | 15 мин |
| 2 | Замени Math.random() в Dashboard "Топ продукти" с реални данни от orders | admin.js:674 | 30 мин |
| 3 | Премахни hardcoded fallback приходи (47300/61700) | admin.js:610 | 10 мин |
| 4 | Добави confirm() преди смяна на order статус | admin.js:695 | 15 мин |
| 5 | Клиенти таб — агрегирай реални данни от поръчки | admin.js:771 | 45 мин |

### Фаза 2 — Важно (2-4 часа)
| # | Задача | Файл | Усилие |
|---|--------|------|--------|
| 6 | Добави мобилен hamburger за admin sidebar | styles.css + index.html | 30 мин |
| 7 | Orders таб — добави filter по статус | admin.js:677 | 45 мин |
| 8 | Смени иконата на "Инвентар" от 📦 на 📋 | index.html:3985 | 5 мин |
| 9 | Извади export бутоните (JSON/CSV) в dropdown | admin.js:713-714 | 20 мин |
| 10 | Добави unsaved changes warning в Product Editor | admin.js:1582 | 20 мин |
| 11 | Analytics — persist log в IndexedDB или `mc_analytics_persistent` | admin.js:1281 | 60 мин |
| 12 | Analytics — смени лв. на € | admin.js:1329 | 5 мин |

### Фаза 3 — Подобрения (4-8 часа)
| # | Задача | Файл | Усилие |
|---|--------|------|--------|
| 13 | Извади inline CSS от Products table → CSS класове | admin.js:430-585 | 2 часа |
| 14 | Добави gallery multi-image upload в Product Editor | admin.js:1687 + index.html | 90 мин |
| 15 | Blog таб — добави body/content поле (textarea или markdown) | admin.js:1394 | 60 мин |
| 16 | Inline editing visual cue (pencil icon on hover) | admin.js:551,555 | 30 мин |
| 17 | Orders search + date filter | admin.js:677 | 60 мин |
| 18 | Смени `nav-item[onclick*=]` с `data-tab` атрибут | admin.js:588 | 15 мин |

---

## 📐 Mockup предложения

### Проблем 7: Orders filter bar
```
┌─────────────────────────────────────────────────────────────┐
│ [🔍 Търси клиент...] [Всички ▾] [Всички статуси ▾] [↻] [⬇CSV]│
└─────────────────────────────────────────────────────────────┘
```

### Проблем 8: Export dropdown
```
Преди:  [⬇ JSON] [⬇ CSV]
След:   [⬇ Експорт ▾]  →  JSON / CSV / XML
```

### Проблем 16: Inline edit cue
```
Преди:  449.00 €        (никакъв сигнал)
След:   449.00 € ✏      (hover показва pencil)
        ════════ (подчертано при hover)
```

---

*Генерирано от /ux-auditor — прочетени: js/admin.js (2911 реда), index.html (admin секция ~ред 3952-4150), styles.css (admin секция ~ред 10778-11240)*
