---
name: Само марки от XML фийдове
description: На сайта трябва да фигурират САМО марки от XML фийдовете на доставчика. Никога Dell, Apple, HP или друга марка, която не е в каталога.
type: feedback
---

Сайтът трябва да съдържа САМО марки от XML фийдовете, които потребителят е предоставил.

**Why:** Потребителят многократно е изразявал недоволство от появата на Dell, Apple, HP и подобни марки, които не се продават в магазина.

**How to apply:**
- Преди да добавяш brand в mega menu, brand ticker (ui.js), филтри или статично съдържание — провери дали марката съществува в `js/data.js` чрез `grep -n "brand:'ИМЕ'" js/data.js`
- Текущи марки в каталога (2026-05): Lenovo, Asus, MSI, Acer, Kingston, Fractal Design, ASRock, Gigabyte, A4Tech, AMD, ADATA, Nokia, Logitech, Fortron, Intel, TeamGroup, LG, Realme, Seasonic, Canon, KingSpec, Koorui, Dynacard, Thomson, Emtec, Omega, INFORM, BitFenix, Cooler Master, Tuncmatik, Repotec, Palit, Sapphire, Fnatic, NZXT, Genius
- Блог статии могат да споменават чужди марки (редакционно съдържание — ОК)
- Всичко друго (ticker, мега меню, сервизна страница, за нас, placeholders) — само марки от каталога
