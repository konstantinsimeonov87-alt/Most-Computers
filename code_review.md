# Code Review — New Files
**Дата:** 2026-06-08 | **Агент:** Code Reviewer | **Scope:** js/b2b.js, js/careers-page.js, js/careers-data.js

---

## Обхват

Първи code review на три нови файла добавени за B2B портала и Careers секцията.

---

## ✅ Оправени в тази сесия

### CR-001 — `b2b.js:350` onclick с `JSON.stringify` чупи HTML атрибут [ОПРАВЕН]

**Проблем:** `onclick="printOrder(${JSON.stringify(o.order_num || '')})"` генерира
`onclick="printOrder("MC-001")"` — вътрешните `"` прекъсват HTML атрибута.

**Fix:** Заменено с `escHtml(JSON.stringify(...))` → `onclick="printOrder(&quot;MC-001&quot;)"`, валиден HTML.

---

### CR-002 — `b2b.js:187` двойно извикване на `_b2bLoadOrders` при отваряне на dashboard [ОПРАВЕН]

**Проблем:** `_b2bShowDashboard` извиква `switchB2BTab('orders', ...)`, а `switchB2BTab` вече извиква `_b2bLoadOrders()` вътрешно. Имаше допълнителен `await _b2bLoadOrders(user.email)` след това — два Supabase заявки при всяко отваряне на dashboard.

**Fix:** Премахнат дублирания `await _b2bLoadOrders(user.email)` ред.

---

### CR-003 — `careers-page.js:11` null crash при липсващи DOM елементи [ОПРАВЕН]

**Проблем:** `renderCareersPage()` проверяваше само `if (!grid) return` но след това директно достъпваше `detail.style.display` и `empty.style.display` без null guard.

**Fix:** Guard разширен на `if (!grid || !empty || !detail) return`.

---

### CR-004 — `careers-page.js:177` file extension не е sanitized [ОПРАВЕН]

**Проблем:** `file.name.split('.').pop()` не премахва специални символи. Файл `malware.pdf.js` качва extension `js` в Storage пътя.

**Fix:** Добавено `.toLowerCase().replace(/[^a-z0-9]/g, '')` — позволява само alphanumeric символи в extension.

---

## 🟡 Наблюдения (без автоматичен fix — изискват owner решение)

### CR-005 — `careers-page.js:82` `job.description` е raw HTML в detail view

`<p>${job.description}</p>` не е escaped. Умишлено — позволява HTML форматиране в описанията. Приемливо тъй като `careersData` е статичен JS файл, редактиран само от разработчиците, не от потребителски вход.

**Препоръка:** Документирай това намерение с коментар в careers-data.js, за да е ясно за бъдещи редактори.

---

### CR-006 — `careers-page.js:198` Supabase edge function URL е hardcoded

`'https://zdwzccucqfvlsgxlspby.supabase.co/functions/v1/send-career-email'` е production URL директно в кода.

**Препоръка:** Изнеси в константа в горната част на файла или в общ конфигурационен блок.

---

## ✅ Проверено и наред

| Точка | Статус | Бележка |
|-------|--------|---------|
| `escHtml` в b2b.js | ✅ | Дефиниран в `js/currency.js:30`, глобален |
| `type="button"` на бутони | ✅ | Всички бутони в новите файлове имат `type="button"` |
| localStorage без try/catch | ✅ | Не се използва в нови файлове |
| Supabase заявки без catch | ✅ | Всички `.catch(() => ...)` guards са налице |
| `===` vs `==` | ✅ | Коректно навсякъде |
| `_esc()` helper в careers-page.js | ✅ | Правилна имплементация, идентична на `escHtml` |
| `fmtEur()` за цени | ✅ | Използван с fallback `o.total + ' €'` |
| Валидация на форма полета | ✅ | Company, EIK (9 цифри), MOL, phone, email валидирани |
| Supabase уникален ключ (EIK `23505`) | ✅ | Грешката е хваната и потребителят информиран |

---

## 📊 Обобщение

| Severity | Брой | Статус |
|----------|------|--------|
| 🔴 Critical | 0 | — |
| 🟠 High | 1 (CR-001) | ✅ Оправен |
| 🟡 Medium | 3 (CR-002, CR-003, CR-004) | ✅ Оправени |
| 🟢 Low | 2 (CR-005, CR-006) | Наблюдения, без автоматичен fix |

**Общ код качество: 8/10** — Добра структура, последователни patterns, правилен error handling. Основният проблем беше HTML attribute escape в динамичен onclick.
