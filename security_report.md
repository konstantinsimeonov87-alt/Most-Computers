# Security Report — mostcomputers.bg
Дата: 2026-04-08 | OWASP Top 10 одит | Тестове след fix: 185/185 ✅

---

## 🔴 Critical

### SEC-001 — XSS в printOrder (auth.js)
**Файл:** js/auth.js:380–460  
**Тип:** OWASP A03 — Injection (XSS)  
**Описание:** `printOrder()` извиква `document.write()` с данни от localStorage (`o.customer`, `o.email`, `o.phone`, `o.city`, `o.addr`, `o.num`, `x.name`, `x.brand`, `x.emoji`) без HTML escaping. Ако localStorage е компрометиран чрез друга XSS уязвимост, нападателят може да изпълни произволен JS в pop-up прозореца.  
**PoC:** `localStorage.setItem('mc_orders', JSON.stringify([{num:'<img src=x onerror=alert(1)>', ...}]))`  
**Fix:** Добавена helper функция `_h = s => escHtml(String(s||''))`, използвана за всички полета от localStorage в `document.write()`.

### SEC-002 — XSS в renderMyOrders (auth.js)
**Файл:** js/auth.js:332–364  
**Тип:** OWASP A03 — Injection (XSS)  
**Описание:** `renderMyOrders()` рендира `o.num`, `o.date`, `o.status`, `o.deliveryType`, `x.name`, `x.brand`, `x.emoji` от localStorage в `grid.innerHTML` без escaping. Също така `onclick="printOrder('${o.num}')"` позволяваше JS injection ако `o.num` съдържа единична кавичка.  
**Fix:** escHtml за всички полета; `onclick` вече ползва `JSON.stringify(o.num)` вместо string interpolation в атрибут.

### SEC-003 — XSS в tyItems / thank-you page (cart.js)
**Файл:** js/cart.js:423–431  
**Тип:** OWASP A03 — Injection (XSS)  
**Описание:** `_setHTML('tyItems', ...)` рендира `x.emoji`, `x.name`, `x.brand` от cart обекта без escaping.  
**Fix:** `escHtml()` добавен за x.emoji, x.name, x.brand.

### SEC-004 — XSS в renderWishlistGrid (auth.js)
**Файл:** js/auth.js:264–272  
**Тип:** OWASP A03 — Injection (XSS)  
**Описание:** `p.img` (в `src=` и `alt=`), `p.emoji`, `p.brand`, `p.name` се вмъкват без escaping. Ако продуктовите данни са компрометирани, нападател може да инжектира HTML.  
**Fix:** `escHtml()` за всички полета; въведена `_wlName = escHtml(p.name)`.

---

## 🟠 High

### SEC-005 — Plaintext пароли в source и in-memory (auth.js)
**Файл:** js/auth.js:6, js/auth.js:104  
**Тип:** OWASP A02 — Cryptographic Failures  
**Описание:** `demoUsers` масивът съдържа `password: '123456'` в plaintext в публичния source код. При регистрация новият потребител се добавя в `demoUsers` с plaintext парола — без хеширане. Всяка JavaScript парола обаче е client-side и теоретично видима при DevTools достъп.  
**PoC:** Отвори DevTools → Console → `demoUsers` → всички пароли са visible.  
**Забележка:** Демо архитектура — сървър-страна автентикация би решила проблема фундаментално. За сега: документирано.

### SEC-006 — Admin PIN djb2('1234') в публичен source (admin.js)
**Файл:** js/admin.js:182  
**Тип:** OWASP A07 — Identification and Authentication Failures  
**Описание:** `_ADMIN_H = 2085881665` е djb2 хеш на '1234'. djb2 не е криптографска хеш функция — реверсируема при 4-цифрен PIN за < 1 секунда. Хешът и PIN-ът са видими в public GitHub repo.  
**PoC:** `(s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h)^s.charCodeAt(i);return h>>>0})('1234') === 2085881665` — true  
**Препоръка:** Смени PIN на поне 8 символа + смени `_ADMIN_H` в admin.js да отразява новия хеш.

---

## 🟡 Medium

### SEC-007 — Без Content Security Policy (index.html)
**Файл:** index.html  
**Тип:** OWASP A05 — Security Misconfiguration  
**Описание:** Нямаше CSP header/meta tag — без mitigation layer срещу XSS.  
**Fix:** Добавен CSP meta tag:  
`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src * data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';`  
Забележка: `unsafe-inline` е необходим поради extensive onclick атрибути в HTML. За по-строга CSP би трябвало всички inline handlers да бъдат рефакторирани. `object-src 'none'` и `base-uri 'self'` блокират embeds и base tag injection.

### SEC-008 — Добавени security headers (index.html)
**Файл:** index.html  
**Fix:** `X-Content-Type-Options: nosniff` и `Referrer-Policy: strict-origin-when-cross-origin` добавени като meta tags.

### SEC-009 — npm undici уязвимости (dev dependency)
**Пакет:** undici 7.0.0–7.23.0  
**Тип:** OWASP A06 — Vulnerable and Outdated Components  
**Описание:** 3 уязвимости (1 moderate, 2 high) в undici — jest runner dependency. Не засяга production bundle.  
**Fix:** `npm audit fix` — 0 уязвимости след fix.

---

## 🟢 Observations (не са бъгове)

- **Client-side auth:** `handleLogin()` сравнява пароли client-side в `demoUsers`. Заобикаляне е възможно чрез DevTools (`currentUser = {...}`). Очаквано за demo архитектура без backend.
- **Credit card форма:** `ckCardNum`, `ckCardCvv` и т.н. са plain HTML inputs — PCI DSS non-compliant. За реален магазин трябва Stripe/Braintree iframe. Сега данните никъде не се изпращат — само client-side валидация.
- **Google Fonts без SRI:** `fonts.googleapis.com` не поддържа стабилни SRI hashes (content varies). Acceptable tradeoff.
- **`?product=` URL param:** `parseInt(params.get('product'))` — parseInt предотвратява injection; продуктът се lookup по id срещу in-memory масива. Safe.
- **`eval()` / `new Function()`:** Не са открити в codebase. ✅
- **`escHtml()` в currency.js:** Дефинирана глобално, покрива `&`, `<`, `>`, `"`. Достатъчна за HTML context. ✅
