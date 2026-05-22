---
description: 🔒 Security одитор — проверява за уязвимости в кода на mostcomputers.bg
---

# 🔒 Security Auditor

## Цел
Систематично сканиране на кода за security уязвимости, класифицирани по OWASP Top 10.

## Стъпки

### 1. XSS (Cross-Site Scripting) анализ
- Търси всички `innerHTML`, `outerHTML`, `document.write()` — сканирай `app.js` за runtime patterns (той е изпълняваният код), но fix-ове прилагай в съответния source файл от `js/` (вж. `js/_load-order.txt`)
- За всяко: провери дали потребителски данни (search input, URL params, localStorage) се интерполират без escaping
- Провери `onclick` атрибути генерирани с template literals за injection
- Верифицирай `escapeHTML()` utility функцията — покрива ли всички случаи?
- **Severity:** Critical (ако потребителски input → innerHTML без sanitize)

### 2. Sensitive Data Exposure
- Търси hardcoded credentials: `password`, `pin`, `secret`, `token`, `api_key` в .js файлове
- Провери localStorage за sensitive data (пароли, credit card info)
- Провери дали admin PIN е hardcoded (известен проблем: `'1234'`)
- Провери `demoUsers` масив за plaintext пароли
- **Severity:** Critical

### 3. Client-Side Auth
- Анализирай auth flow в `js/auth.js` — дали проверките са само client-side
- Провери дали admin panel bypass е възможен чрез DevTools
- Провери session management (localStorage vs secure cookies)
- **Severity:** High

### 4. Insecure Data Handling
- Провери credit card форма — има ли PCI DSS compliance?
- Провери дали чувствителни данни (ЕГН, телефон, адрес) се записват в localStorage
- Провери `printOrder()` и `document.write()` за injection
- **Severity:** High

### 5. Content Security Policy
- Провери дали index.html има CSP meta tag
- Провери за external script loading без integrity checks
- Провери `eval()`, `new Function()` usage
- **Severity:** Medium

### 6. URL/Parameter Injection
- Провери `URLSearchParams` usage — дали query params се валидират
- Провери `location.search`, `location.hash` за injection vectors
- Провери deep linking: `?product=` — може ли да инжектира код?
- **Severity:** Medium

### 7. Third-Party Dependencies
- Провери `package.json` за known vulnerabilities: `npm audit`
- Провери CDN links (Google Fonts, external images) за integrity
- Провери Service Worker за cache poisoning vectors
- **Severity:** Low-Medium

## Формат на доклада

За всяка намерена уязвимост, документирай:
```
### [SEVERITY] Кратко описание
- **Файл:** path:line
- **Тип:** OWASP категория
- **Описание:** Какъв е проблемът
- **PoC:** Как може да се експлоатира
- **Fix:** Конкретна стъпка за поправка
```

## Класификация
- 🔴 **Critical** — Директен exploit, трябва незабавен fix
- 🟠 **High** — Сериозен риск, fix тази седмица
- 🟡 **Medium** — Потенциален риск, fix този месец
- 🟢 **Low** — Best practice нарушение, планирай
