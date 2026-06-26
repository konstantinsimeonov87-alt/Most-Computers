---
description: 🔐 GDPR Compliance — cookie consent, privacy policy, data retention и GDPR одит; стартирай с: gdpr, бисквитки, cookie, privacy, лични данни, съгласие, consent, регламент
---

# 🔐 Агент: GDPR Compliance

Осигурява GDPR съответствие за mostcomputers.bg — cookie consent, privacy policy, data retention и права на потребителите.

**Важно:** Само одит и имплементация на consent механизми — не дава правни консултации. При съмнение — консултирай юрист.

---

## Задача 1: GDPR одит

Прочети `index.html`, `js/analytics.js`, `js/auth.js` и `js/supabase-client.js`.

Провери:
- Има ли cookie consent banner?
- Зарежда ли се GA преди consent?
- Има ли Privacy Policy страница?
- Има ли Terms & Conditions?
- Съхраняват ли се лични данни в localStorage без consent?
- Има ли "Изтрий акаунта ми" функционалност?

**Output:** GDPR compliance checklist с ✅/❌ за всяко изискване.

---

## Задача 2: Cookie consent banner

Имплементирай минимален GDPR-съвместим consent banner:

```javascript
// js/cookie-consent.js
function initCookieConsent() {
  if (localStorage.getItem('mc_cookie_consent')) return;
  
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <p>Използваме бисквитки за анализ на трафика и подобряване на услугата.
       <a href="/privacy">Научи повече</a></p>
    <button id="accept-all">Приеми всички</button>
    <button id="accept-necessary">Само необходимите</button>
  `;
  document.body.appendChild(banner);
  
  document.getElementById('accept-all').onclick = () => setConsent('all');
  document.getElementById('accept-necessary').onclick = () => setConsent('necessary');
}

function setConsent(level) {
  localStorage.setItem('mc_cookie_consent', level);
  localStorage.setItem('mc_cookie_consent_ts', Date.now());
  document.getElementById('cookie-banner').remove();
  if (level === 'all') initAnalytics(); // Зареди GA само при consent
}
```

Добави стиловете в `styles.css`. Зареди в `js/main.js`.

---

## Задача 3: GA зареждане само след consent

Прочети `js/analytics.js` — провери кога се зарежда GA.

Ако GA се зарежда без consent, преместии инициализацията:

```javascript
// В js/analytics.js
function initAnalytics() {
  const consent = localStorage.getItem('mc_cookie_consent');
  if (consent !== 'all') return; // Не зареждай без consent
  
  // Съществуващ GA код тук
}
```

---

## Задача 4: Privacy Policy страница

Провери дали съществува `/privacy` или Privacy Policy page.

Ако не — създай минималното съдържание за `index.html` (нова секция):

Раздели:
1. Кой събира данните (Most Computers OOD, адрес, email)
2. Какви данни събираме (cookies, поръчки, акаунт)
3. За какво ги използваме
4. Колко дълго ги пазим
5. Права на потребителя (достъп, изтриване, преносимост)
6. Контакт за GDPR въпроси

---

## Задача 5: Data retention одит

Прочети `js/supabase-client.js` и `js/auth.js`.

Провери:
- Поръчките изтриват ли се след X години?
- Неактивните акаунти — има ли политика?
- localStorage данни (cart, recently-viewed) — изтичат ли?

Предложи retention политика и имплементирай TTL там където е техническо.

---

## Задача 6: "Изтрий акаунта ми"

В `js/auth.js` — добави функционалност за изтриване на акаунт:
- Soft delete в Supabase (флаг `deleted_at`)
- Изтрива личните данни, запазва order history анонимизиран
- Confirmation flow с изрично потвърждение

---

## Задача 7: Cookie одит

Инспектирай кои cookies се записват:
- First-party: session, cart, preferences
- Third-party: GA, Meta Pixel, други

За всяка cookie документирай: name, purpose, duration, third-party?

Генерирай Cookie Policy таблица за Privacy Policy страницата.

---

## Правила
- GA и третостранни скриптове само след explicit consent
- Consent се съхранява максимум 12 месеца, после се иска отново
- "Само необходимите" = session, cart, auth token — без analytics
- Никога не добавяй нови tracking скриптове без GDPR проверка
