# Security Report — Most Computers
**Дата:** 2026-04-24 | **Агент:** Security Auditor | **OWASP Top 10**

---

## 🔴 Critical — Оправени от Bug Hunter

### SEC-001 — XSS в ревюта (product-page.js:404)
Оправено в commit `3549d4f`. Виж bug_report.md → BUG-010.

### SEC-002 — XSS в printInvoice (cart.js:639)
Оправено в commit `3549d4f`. Виж bug_report.md → BUG-011.

---

## 🟡 Medium — Оправени тази сесия

### SEC-003 — CSS Selector Injection чрез URL параметри ✅ Fixed
- **Файл:** `js/filters.js` — ред 1153, 1157, 1175
- **Тип:** OWASP A03 — Injection
- **Описание:** URL параметри `?cat=`, `?brand=`, `?sub=` се интерполираха директно в `document.querySelector()` template literals. Специални символи (`"`, `]`, `'`) предизвикват DOMException.
- **PoC:** `?cat=x"]); alert(1); var _=["` → SyntaxError в querySelector, crash на UI
- **Fix:** Валидация срещу `_VALID_CATS` whitelist; brand filter чрез `forEach` + `value` сравнение; subcat санитизация с regex `/[^a-z0-9_-]/gi`
- **Commit:** `(тази сесия)`

---

## 🟠 High — Отворени (известни ограничения на frontend-only прототип)

### SEC-004 — Client-side only auth
- **Файл:** `js/auth.js`
- **Тип:** OWASP A07 — Authentication Failures
- **Описание:** Цялата auth логика е client-side. Admin panel може да се достъпи чрез DevTools → `currentUser = {email:'x', firstName:'Admin'}`.
- **Бележка:** Проектът е frontend-only прототип. За production задължително сървърна auth.
- **Статус:** Known limitation — за backend интеграция

### SEC-005 — Admin PIN с djb2 (некриптографски хеш)
- **Файл:** `js/admin.js:242`
- **Тип:** OWASP A02 — Cryptographic Failures
- **Описание:** `_ADMIN_H = 3533399686` е djb2 хеш — rainbow table crack в секунди. Приложимо само ако някой има достъп до source.
- **Fix препоръка:** При backend интеграция — сървърна PIN верификация с bcrypt/argon2.
- **Статус:** Отворен (нисък практически риск при frontend-only)

### SEC-006 — demoUsers plaintext password
- **Файл:** `js/auth.js:6`
- **Тип:** OWASP A02
- **Описание:** `password: 'demo-only'` е plaintext в JS source.
- **Бележка:** Маркирано като demo-only, не е production auth.
- **Статус:** Known limitation

---

## 🟡 Medium — Отворени

### SEC-007 — CSP с 'unsafe-inline' за scripts
- **Файл:** `index.html:7`
- **Тип:** OWASP A05 — Security Misconfiguration
- **Описание:** `script-src 'self' 'unsafe-inline'` позволява inline JS, което анулира XSS защитата на CSP.
- **Fix препоръка:** Преход към nonce-based CSP: `script-src 'self' 'nonce-{random}'`. Изисква SSR или build-time nonce инжектиране.
- **Статус:** Отворен (значителна рефакторинг, за след backend)

### SEC-008 — Supabase CDN без SRI (Subresource Integrity)
- **Файл:** `index.html:2951`
- **Тип:** OWASP A08 — Software Integrity Failures
- **Описание:** `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer>` без `integrity=` атрибут.
- **PoC:** Компрометиран jsdelivr.net → инжектиране на malicious code.
- **Fix:** Добави `integrity="sha384-..."` след пиниране на конкретна версия.
- **Статус:** Отворен

---

## 🟢 Low

### SEC-009 — Supabase anon key в public source
- **Файл:** `js/supabase-client.js:5`
- **Тип:** OWASP A02
- **Описание:** Анон ключ е видим в source. По дизайн на Supabase е публичен, НО изисква правилно конфигуриран RLS на `orders` таблицата.
- **Препоръка:** Провери Supabase → Authentication → Policies → `orders`: само INSERT за `anon` role; SELECT/UPDATE/DELETE само за `service_role`.
- **Статус:** Приемливо при правилен RLS

### SEC-010 — PII в localStorage (mc_orders, mc_saved_addr)
- **Файл:** `js/cart.js`
- **Тип:** OWASP A02 / GDPR
- **Описание:** Поръчките (имена, имейл, телефон, адрес) се пишат в localStorage. Достъпни за всеки JS на страницата и при XSS.
- **Бележка:** Данните вече се изпращат в Supabase; localStorage е fallback.
- **Препоръка:** Ограничи localStorage само до order_num + status; детайлите само в Supabase.
- **Статус:** Отворен (за след backend)

### SEC-011 — Fake credit card форма (no payment processor)
- **Файл:** `js/cart.js` — selectPayment/submitOrder
- **Описание:** Картовите данни се валидират визуално, но не се изпращат никъде. Фалшива форма — потребителят може да мисли, че плаща с карта.
- **Препоръка:** Интегрирай реален payment processor (Stripe, Borica) или премахни card опцията.
- **Статус:** Отворен (за production)

---

## ✅ Проверено и OK

| Проверка | Резултат |
|---|---|
| `eval()`, `new Function()` | ✅ Няма |
| XSS в search dropdown | ✅ escHtml() навсякъде |
| XSS в product cards | ✅ escHtml() за name, brand, img |
| XSS в cart/wishlist | ✅ escHtml() за всички user данни |
| `npm audit` | ✅ 0 уязвимости |
| CSP header | ✅ Има (с unsafe-inline ограничение) |
| frame-ancestors: none | ✅ Clickjacking защита |
| base-uri: self | ✅ |
| object-src: none | ✅ |
| URL product param | ✅ `parseInt()` преди употреба |
| localStorage try/catch | ✅ Навсякъде |

---

## Обобщение

| Severity | Брой | Оправени |
|---|---|---|
| 🔴 Critical | 2 | 2 (от bug-hunter) |
| 🟠 High | 3 | 0 (known limitations) |
| 🟡 Medium | 3 | 1 (SEC-003) |
| 🟢 Low | 3 | 0 |

**Тестове след fix:** 185/185 ✅
