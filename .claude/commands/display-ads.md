---
description: 📢 Display Ads — Google Display, Meta и remarketing банерни реклами; стартирай с: реклама, display ads, Google Ads, Meta Ads, banner ad, remarketing, ремаркетинг, платена реклама
model: claude-opus-4-8
---

# 📢 Агент: Display Ads

Създава HTML5 display банери и copy за Google Display Network, Meta Ads и remarketing кампании на mostcomputers.bg.

---

## Стандартни Google Display размери

| Формат | Размер | Използване |
|--------|--------|-----------|
| Leaderboard | 728x90 | Хедър на сайтове |
| Medium Rectangle | 300x250 | Sidebar, in-content |
| Large Rectangle | 336x280 | In-content |
| Half Page | 300x600 | Sidebar |
| Billboard | 970x250 | Топ на страницата |
| Mobile Banner | 320x50 | Мобилен хедър |
| Large Mobile | 320x100 | Мобилен |

---

## Задача 1: Google Display банер пакет

Приеми `$ARGUMENTS`: промоция / продукт / категория.

Генерирай HTML5 банери за топ 3 размера (300x250, 728x90, 160x600):

Структура на банера:
- Most Computers лого (горе ляво)
- Headline (1 ред, bold)
- Visual area (product placeholder или цветен блок)
- CTA бутон (долу дясно, amber)
- Animation: subtle pulse на CTA бутон (CSS @keyframes)

Технически:
- Standalone HTML файл с inline CSS
- Анимация само CSS (не JS — Google го ограничава)
- Max file size: 150KB
- `<meta name="ad.size" content="width=300,height=250">`

---

## Задача 2: Meta Ads (Facebook/Instagram) пакет

Приеми `$ARGUMENTS`: промоция + продукт.

Генерирай:
1. **Single Image Ad copy:**
   - Primary text: 125 символа max
   - Headline: 40 символа max
   - Description: 30 символа max
   - CTA button: "Пазарувай сега" / "Научи повече"

2. **Carousel Ad** (3-5 карти):
   - Всяка карта: 1080x1080px HTML визуал
   - Всяка карта: отделен headline + description
   - Последна карта: "Виж всички оферти" CTA

---

## Задача 3: Remarketing банери

Банери насочени към потребители, посетили сайта без покупка.

3 remarketing аудитории:
1. **Product viewers** ("Разглеждал си [продукт]")
2. **Cart abandoners** ("Остави нещо в кошницата")
3. **Category browsers** ("Търсиш [категория]?")

За всяка аудитория: 300x250 + 728x90 HTML банер с персонализирано copy.

---

## Задача 4: Dynamic product ads template

Шаблон за dynamic remarketing (Google/Meta) — попълва се автоматично с продуктови данни.

Структура:
```html
<!-- Placeholder variables: {{product_name}}, {{price}}, {{image_url}} -->
<div class="dpa-banner">
  <img src="{{image_url}}" alt="{{product_name}}">
  <div class="dpa-banner__info">
    <h3>{{product_name}}</h3>
    <span class="price">{{price}} EUR</span>
    <a href="{{product_url}}" class="cta">Купи сега</a>
  </div>
</div>
```

---

## Задача 5: Seasonal ads пакет

Приеми `$ARGUMENTS`: сезон (Back to School / Black Friday / Коледа).

Генерирай пълен пакет: 300x250, 728x90, 300x600, 320x50.

Сезонни теми:
- **Back to School:** синьо, notebook иконки, "Готов за учебната година"
- **Black Friday:** черно + amber, countdown, "До -40%"
- **Коледа:** тъмно зелено + злато, "Подари технология"

---

## Задача 6: Ad copy A/B тест

За един банер — генерирай 3 copy варианта:
- Вариант A: Feature-focused ("16GB RAM, 512GB SSD")
- Вариант B: Benefit-focused ("Работи по-бързо, пести повече")
- Вариант C: Price-focused ("От 599 EUR с доставка")

Помогни за избор на вариант за тест.

---

## Задача 7: Performance одит на реклами

Провери съществуващи рекламни материали:
- Текстът четим ли е на малките размери?
- CTA бутонът достатъчно контрастен ли е (WCAG AA)?
- Лого/бранд видимо ли е на всички размери?
- Comply ли са с Google Ads policies (без misleading claims)?

---

## Правила
- Само марки от каталога (никога Dell, Apple, HP ако ги няма)
- EUR е основната ценова единица
- Google Display: само CSS анимация, не JS
- Всички банери: max 150KB file size
- Никога em dash (—) в copy
- CTA контраст минимум 4.5:1 (WCAG AA)
