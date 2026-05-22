---
description: 📦 Bundle анализатор — оптимизира размерите на файловете за mostcomputers.bg
---

# 📦 Bundle Analyzer

## Цел
Анализ на файловите размери, откриване на неизползван код и предложения за оптимизация за по-бързо зареждане.

## Стъпки

### 1. Инвентаризация на файловете
- Изпълни:
  ```bash
  find . -not -path '*/node_modules/*' -not -path '*/dist/*' -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' \) -exec du -k {} + | sort -rn | awk '{printf "%-8s %s\n", $1"KB", $2}'
  ```
- Запиши размерите на всеки файл
- Идентифицирай critical path файлове (нужни за first paint)

### 2. Benchmarks
Сравни с industry стандарти:
| Метрика | Цел | Текущо |
|---|---|---|
| Total JS (gzipped) | < 150 KB | ? |
| Total CSS (gzipped) | < 50 KB | ? |
| HTML | < 30 KB | ? |
| First Contentful Paint | < 1.8s | ? |
| Largest Contentful Paint | < 2.5s | ? |

### 3. JavaScript анализ
- Измери общия JS размер на critical path
- Търси дублирани функции в app.js
- Идентифицирай код, който може да се lazy-load:
  - Admin панел (вече lazy ✅)
  - Checkout flow
  - Product comparison
  - Blog/About/Contact pages
  - Print order функция
- Провери за dead code: функции, които не се извикват никъде
- Провери `products.js` — може ли да се зарежда async?

### 4. CSS анализ
- Измери общия CSS размер
- Сравни CSS селектори с реално използвани в HTML
- Търси дублирани правила
- Търси media queries, които могат да се разделят в отделни файлове
- Провери за unused CSS custom properties

### 5. HTML анализ
- Измери inline SVG sprite размер
- Провери дали всички модали/overlays трябва да са в initial HTML
- Предложи lazy-loading стратегия за off-screen HTML

### 6. Asset оптимизация
- Провери image формати (WebP vs PNG/JPEG)
- Провери font loading стратегия
- Провери за unused font weights в Google Fonts URL
- Предложи font-display: swap стратегия

### 7. Препоръки за code splitting
Генерирай конкретен план за разделяне на app.js в модули:
```
📁 js/
├── core.js        → Currency, cart, toast (< 20KB)
├── search.js      → Live search + fuzzy (< 15KB)  
├── checkout.js    → Checkout flow (lazy)
├── product.js     → Product modal + PDP (lazy)
├── compare.js     → Comparison (lazy)
├── auth.js        → Auth system (lazy)
└── admin.js       → Admin panel (already lazy ✅)
```

## Формат на доклада
Таблица с файлове, размери, и конкретни предложения за оптимизация с очакван спестен размер.
