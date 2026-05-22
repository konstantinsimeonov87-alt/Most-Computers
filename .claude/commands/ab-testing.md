---
description: 🧪 A/B Testing агент — имплементира и анализира A/B тестове за повишаване на conversion rate на mostcomputers.bg
---

# 🧪 Агент: A/B Testing

Имплементира A/B тестове с ясна хипотеза, измерване и анализ на резултатите.

## Стъпки

### 1. Разбери заявката
- Прочети `$ARGUMENTS`:
  - Нов A/B тест (дефиниция на хипотеза и варианти)
  - Имплементация на тест
  - Анализ на резултати
  - Завършване на тест (прилагане на победителя)

### 2. Дефиниция на теста
За нов тест попълни:
```
Тест ID: ab_[описание]_[дата]
Хипотеза: Ако [промяна], тогава [метрика] ще се подобри с [X]%
  защото [причина базирана на данни/поведение]

Вариант A (Control): [текущото поведение]
Вариант B (Treatment): [предложената промяна]

Метрика: [conversion rate | CTR | AOV | add-to-cart rate]
Минимален размер на извадката: [изчисли за 95% confidence]
Продължителност: [X дни/седмици]
```

### 3. Имплементация
Lightweight A/B тест без external library:
```javascript
// ab-test.js — добавя се в js/
function getABVariant(testId, variants = ['A', 'B']) {
  const stored = localStorage.getItem(`ab_${testId}`);
  if (stored) return stored;

  // Детерминистично на базата на userId или random
  const variant = variants[Math.floor(Math.random() * variants.length)];
  localStorage.setItem(`ab_${testId}`, variant);

  // Track assignment
  if (typeof gtag !== 'undefined') {
    gtag('event', 'ab_test_assigned', {
      test_id: testId,
      variant: variant
    });
  }

  return variant;
}

// Ползване:
const variant = getABVariant('cta_button_color');
if (variant === 'B') {
  document.querySelector('.btn-add-to-cart').classList.add('btn-green');
}
```

### 4. Tracking (Google Analytics)
```javascript
// При conversion event:
gtag('event', 'purchase', {
  ab_test_id: 'cta_button_color',
  ab_variant: getABVariant('cta_button_color')
});
```

### 5. Статистически анализ
При анализ на резултати изчисли:
```
Вариант A: [N] посетители, [X] конверсии → [X/N]%
Вариант B: [N] посетители, [X] конверсии → [X/N]%

Relative improvement: [(B-A)/A * 100]%
Statistical significance: [p-value < 0.05 = значимо]
Confidence interval: [range]

Заключение: [Вариант B е победител / Няма значима разлика / Нужни са повече данни]
```

### 6. Завършване на теста
При победител:
- Приложи вариант B като постоянен код
- Премахни A/B test логиката
- Документирай резултатите

При неубедителни резултати:
- Провери дали тестът е продължил достатъчно
- Провери за seasonal effects
- Обмисли нова хипотеза

### 7. Активни тестове — как да проследяваш
- Прочети `js/ab-tests.js` (ако съществува) за списък на активни тестове
- Всеки тест трябва да има: ID, начална дата, очаквана дата на приключване
- Не стартирай повече от 2-3 теста едновременно (interferenge риск)

### 8. Почисти стари тестове
- Провери localStorage за стари ab_ ключове
- Премахни код на завършени тестове от `js/`
- Rebuild: `cat js/*.js > app.js`

## Формат на доклада
- Тест дефиниция (хипотеза, варианти, метрика)
- Имплементационен код
- Tracking setup
- Очаквана продължителност
- Критерии за победител
