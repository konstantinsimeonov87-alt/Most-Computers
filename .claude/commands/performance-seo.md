---
description: ⚡ Performance & SEO одитор — анализира скоростта, размера и SEO здравето на mostcomputers.bg
---

# ⚡ Агент: Performance & SEO Одитор

Този workflow анализира производителността и SEO оптимизацията на сайта.

## Стъпки

### 1. Анализ на размерите на файловете
// turbo
- Изпълни команда за размер на всеки ключов файл:
  ```bash
  find . -not -path '*/node_modules/*' -not -path '*/dist/*' -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -exec du -k {} + | sort -rn | awk '{printf "%-8s %s\n", $1"KB", $2}'
  ```
- Анализирай дали файловете са прекалено големи
- Идентифицирай кандидати за code splitting

### 2. CSS анализ
- Прочети `styles.css` и измери:
  - Общ брой CSS правила
  - Брой media queries
  - Дублирани декларации
  - CSS, който може да се минифицира
  - Unused CSS (сравни класове в CSS vs HTML)
- Провери за:
  - Expensive CSS selectors (deep nesting, universal selectors)
  - Layout thrashing properties (width, height в анимации вместо transform)
  - Missing `will-change` за анимирани елементи

### 3. JavaScript анализ
- За performance анализ на JS: `app.js` (bundle) измерва цялостния размер. За конкретни оптимизации — прочети source файловете в `js/` (вж. `js/_load-order.txt`). Анализирай:
  - Размер на всеки модул и кандидати за lazy loading
  - DOM queries, които могат да се кешират
  - Чести re-renders или излишни DOM манипулации
  - Event delegation vs individual listeners
  - requestAnimationFrame за анимации vs setTimeout/setInterval

### 4. Ресурсен анализ
- Провери `index.html` за:
  - Брой external заявки (fonts, CDN, images)
  - Preconnect / dns-prefetch — дали са оптимални
  - Defer/async за скриптове
  - Lazy loading за изображения под fold-а
  - Font loading стратегия (font-display: swap)

### 5. SEO Одит
- Провери `index.html` за SEO елементи:
  - Title tag — дължина (50-60 символа), ключови думи
  - Meta description — дължина (150-160 символа)
  - H1 tag — един на страница, описателен
  - Schema.org structured data — валиден ли е JSON-LD
  - Open Graph tags — пълни и правилни
  - Twitter Card tags
  - Canonical URL
  - Hreflang tags
  - Robots meta tag

- Провери `sitemap.xml`:
  - Всички важни URLs включени ли са
  - Формат коректен ли е
  - lastmod дати актуални ли са

- Провери `robots.txt`:
  - Правилно конфигуриран ли е
  - Не блокира ли важни ресурси

### 6. PWA анализ
- Провери `manifest.json` за пълнота
- Провери `sw.js` за:
  - Caching стратегия
  - Offline поддръжка
  - Cache invalidation

### 7. Browser Performance Test
- Отвори сайта в браузъра
- Провери конзолата за:
  - JavaScript грешки
  - Warnings
  - Deprecated API usage
  - Network errors
- Тествай скоростта на зареждане

### 8. Създай Performance & SEO Report
- Създай artifact `performance_seo_report.md` със:
  - 📊 Таблица с размери на файлове и препоръчани оптимизации
  - ⚡ Performance проблеми (критични → ниски)
  - 🔍 SEO checklist с статус (✅/❌/⚠)
  - 📱 PWA readiness score
  - 🎯 Приоритизиран план за оптимизация
  - Конкретни code examples за всяка оптимизация
