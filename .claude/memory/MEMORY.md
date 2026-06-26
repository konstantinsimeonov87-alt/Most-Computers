# Memory Index

## Setup на нова машина
Копирай папката `.claude/memory/` от repo-то в:
`~/.claude/projects/<абсолютен-път-до-проекта>/memory/`
Пример (Windows): `C:\Users\<user>\.claude\projects\c--Users-<user>-Desktop-New-folder\memory\`

## Project
- [Most Computers project](project_most_computers.md) — PWA структура, app.js rebuild процес, admin lazy loading
- [V2 план](project_v2_plan.md) — финален tech stack, агентна карта; V1 = текуща версия, V2 = новата

## Reference
- [PageSpeed / CLS документация](reference_pagespeed_docs.md) — web.dev CLS + Lighthouse forced reflow URL-и

## Feedback
- [Задължително тестване преди push](feedback_testing.md) — Jest тестове + build преди всеки push; проверявай за дублирани имплементации
- [Официална валута е евро](feedback_currency.md) — EUR е основна валута; лв. е вторично; никога не пиши лв. като основна единица
- [Icecat снимки след внос на продукти](feedback_icecat_images.md) — след всеки data import пускай scripts/fetch-icecat-images.js
- [Hero изображения — бял фон](feedback_hero_images.md) — НИКОГА CSS blend modes; използвай pngjs в Node.js за pixel-level обработка
- [Предпочитан стил на работа](feedback_work_style.md) — довършвай задачите end-to-end без излишни въпроси; питай само при деструктивни операции
- [Most Computers — събота почивен ден](feedback_saturday_closed.md) — НЕ работи в събота; само Пон–Пет 09:30–18:15; никога не добавяй събота в работното време
- [Само марки от XML фийдове](feedback_brands_from_xml_only.md) — НИКОГА Dell, Apple, HP или марки извън каталога в ticker, меню, филтри, статично съдържание
- [Питай преди странични промени](feedback_ask_before_changes.md) — правиш само точно казаното; ако видиш нещо "свързано" — питаш първо
- [Забранени дълги тирета](feedback_no_em_dashes.md) — НИКОГА em dash (—); само обикновено тире (-) навсякъде
- [Само SVG иконки навсякъде](feedback_svg_icons_only.md) — НИКОГА emoji като иконки в UI; само SVG `<use href="#ic-..."/>` чрез helper `_fl()` в filters.js
- [Правилна rebuild команда](feedback_rebuild_command.md) — САМО `node build.js`; никога cat на всички js/ файлове; data.js е отделен от app.js
- [V2 планиране - само дискусия](feedback_v2_planning.md) — НЕ имплементирай нищо без потвърждение; задавай въпроси с предложения за най-добри решения
