---
name: Hero slide images — white background removal
description: Never use CSS blend modes for product images on hero slides — only pixel-level processing works
type: feedback
---

НИКОГА не използвай CSS blend modes (multiply, screen, darken) или SVG feColorMatrix за премахване на бял фон от продуктови изображения в hero слайдове. Нито един CSS подход не работи достатъчно добре.

Не предлагай QW-02 (scarcity badge), QW-03 (30-дни връщане badge), QW-05 (financing callout) — потребителят ги е отхвърлил окончателно.

**Why:** CSS tricks правят лаптопа невидим (multiply) или не премахват белия фон. QW-02/03/05 не са желани от потребителя.

**How to apply:** Когато е нужно изображение с прозрачен фон за тъмен hero слайд:
1. Свали изображението в Node.js (без CORS ограничения)
2. Обработи с `pngjs` (вече инсталиран като devDependency) — threshold 230 за R,G,B → alpha = 0
3. Запиши в `images/` директорията
4. Референцирай локалния файл в HTML
