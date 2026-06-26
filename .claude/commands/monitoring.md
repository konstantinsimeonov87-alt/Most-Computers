---
description: 📡 Monitoring — uptime проверки, JS грешки в production, Core Web Vitals и site health; стартирай с: мониторинг, грешки, uptime, CWV, core web vitals, site health, performance, JS error
---

# 📡 Агент: Monitoring

Наблюдава health-а на mostcomputers.bg — JS грешки, Core Web Vitals, broken функционалност и performance regression.

---

## Задача 1: JS error tracking одит

Прочети `js/analytics.js` и `js/main.js`.

Провери дали има global error handler:
```javascript
window.addEventListener('error', (e) => {
  gtag('event', 'js_error', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
  });
});

window.addEventListener('unhandledrejection', (e) => {
  gtag('event', 'js_promise_error', { message: e.reason?.toString() });
});
```

Ако не — добави в `js/main.js`.

---

## Задача 2: Core Web Vitals tracking

Провери дали се track-ват CWV метрики.

Имплементирай с web-vitals library или ръчно:
```javascript
// В js/analytics.js
function trackWebVitals() {
  // LCP
  new PerformanceObserver((list) => {
    const lcp = list.getEntries().at(-1);
    gtag('event', 'web_vitals', { metric: 'LCP', value: Math.round(lcp.startTime) });
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  
  // CLS
  let cls = 0;
  new PerformanceObserver((list) => {
    list.getEntries().forEach(e => { if (!e.hadRecentInput) cls += e.value; });
    gtag('event', 'web_vitals', { metric: 'CLS', value: Math.round(cls * 1000) });
  }).observe({ type: 'layout-shift', buffered: true });
  
  // INP / FID
  new PerformanceObserver((list) => {
    list.getEntries().forEach(e => {
      gtag('event', 'web_vitals', { metric: 'FID', value: Math.round(e.processingStart - e.startTime) });
    });
  }).observe({ type: 'first-input', buffered: true });
}
```

---

## Задача 3: Критични функции health check

Напиши `scripts/health-check.js` — Node.js скрипт, който проверява:

- [ ] Homepage зарежда ли се (200 OK)?
- [ ] `app.js` достъпен ли е?
- [ ] `styles.css` достъпен ли е?
- [ ] `js/data.js` съдържа ли продукти (не е празен)?
- [ ] `dist/js/promotions-data.js` валиден JS ли е?
- [ ] `sitemap.xml` достъпен ли е?

Изводи: ✅ OK / ❌ FAIL за всяка проверка.

---

## Задача 4: Performance budget

Дефинирай performance бюджет за `app.js` и `styles.css`:

```javascript
// В package.json или отделен файл
const PERFORMANCE_BUDGET = {
  'app.js': 500 * 1024,      // 500KB max
  'styles.css': 100 * 1024,  // 100KB max
  'LCP': 2500,               // ms
  'CLS': 0.1,
  'FID': 100,                // ms
};
```

Добави проверка в build процеса (npm test или отделен скрипт).

---

## Задача 5: 404 и broken links мониторинг

Прочети `js/analytics.js` — провери дали 404 се track-ва.

Ако не:
```javascript
// В js/pages.js при 404 state
gtag('event', 'page_not_found', {
  page_location: location.href,
  page_referrer: document.referrer,
});
```

Генерирай weekly report от GA4 за топ 10 404 URLs.

---

## Задача 6: Service Worker health

Прочети `js/pwa.js` — провери SW статуса.

Провери:
- SW регистрира ли се успешно?
- Cache версията актуална ли е?
- Fetch errors логват ли се?
- SW update process — уведомява ли потребителя при нова версия?

Добави SW error tracking ако липсва.

---

## Задача 7: Daily health report

Напиши `scripts/daily-report.js`:
- Брой JS грешки от последните 24ч (от GA4 или Supabase logs)
- Core Web Vitals средни стойности
- Брой 404 грешки
- Top 5 бавни pages

Output: markdown доклад `reports/health_[YYYY-MM-DD].md`.

---

## Правила
- Error tracking само при consent (не изпращай данни без съгласие)
- Не логвай лични данни в error events (email, phone, имена)
- Performance budget проверките са задължителни преди всеки push
- CWV targets: LCP < 2.5s, CLS < 0.1, FID < 100ms
