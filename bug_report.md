# Bug Report — Most Computers
**Последна актуализация:** 2026-04-21 | **Агент:** Bug Hunter | **Тестове след fix:** 185/185 ✅

---

## 🟠 Major — оправени

### BUG-001 — RAM честотен филтър не работи за 27 продукта
- **Файл:** `js/data.js` (RAM блок, IDs 586–794)
- **Описание:** 27 RAM продукта с грешен формат: `"2666MT/s MHz"`, `"DDR4-3200 MHz"`, `"4 800 MHz"`. Честотният филтър не ги намираше.
- **Причина:** `normSpeed()` не обработваше MT/s и DDR-prefix форматите от XML.
- **Fix:** Корекция на 27 записа в `data.js` + обновена `normSpeed()` в `scripts/parse-ram.js`.

---

## 🟡 Minor — оправени

### BUG-002 — RAM продукт #599 с фалшив kit формат
- **Файл:** `js/data.js`, product id:599
- **Описание:** `"8G DDR4 3200 TEAM DELTA R WHIT"` имаше `Капацитет: "8 GB (1×)"` вместо `"8 GB"`.
- **Fix:** Data fix в `data.js` + `normCapacity()` вече показва kit само за 2+ пръчки.

---

## ✅ Проверено и OK

| Проверка | Резултат |
|---|---|
| Дублирани ID в products (795 продукта) | ✅ Няма |
| Липсващи задължителни полета | ✅ Всички пълни |
| Zero-price продукти | ✅ Няма |
| Дублирани HTML id атрибути | ✅ Няма |
| localStorage достъп — try/catch | ✅ Обвити |
| XSS в search dropdown | ✅ escHtml() навсякъде |
| XSS в product cards | ✅ escHtml() за name, brand, img |
| Footer z-index конфликти | ✅ Няма |
| Cart логика — add/qty/remove | ✅ Коректна |
| matchesSubcat() за cpu/gpu/mb/ram | ✅ Direct p.subcat match |
| catSpecActiveFilters reset при subcat смяна | ✅ OK |

---

## 🟢 Enhancement (не са бъгове)

### ENH-001 — `_origUpdateCart` dead code в ui.js:105
Dead variable — никога не се използва. Може да се изтрие при следващ рефактор.

### ENH-002 — Честота филтър без 3600 MHz за DDR4 XMP
Препоръка: добави 3600 MHz стойност в SUBCAT_SPEC_FILTERS.ram.

### ENH-003 — 18 RAM продукта с `brand: 'Generic'`
XML не дава производител. Препоръка: manual review или скриване от brand filter.

---

## Сесия 2026-04-21 — Import на Storage/Monitors/Keyboards/Mice/Multimedia (783 нови продукта)

### 🔴 BUG-003 — Critical: SUBCATS.accessories показва 0 резултати ✅ Fixed

- **Файл:** `js/filters.js:692`
- **Описание:** `SUBCATS.accessories` съдържаше placeholder pills (`bag`, `cable`, `hub`, `smart_dev`, `mobile_acc`, `av`). Реалните импортирани продукти имат `subcat: 'projector'`, `'chair'`, `'controller'`.
- **Fix:** Заменени с реалните subcats (projector / chair / controller). **Commit:** `a63702c`

### 🔴 BUG-004 — Critical: Липсващи SUBCAT_SPEC_FILTERS за chair и controller ✅ Fixed

- **Файл:** `js/filters.js`
- **Описание:** При клик на "Gaming столове" / "Контролери" pill нямаше spec филтри вляво.
- **Fix:** Добавени entries за `chair` (Материал) и `controller` (Връзка). **Commit:** `12726ba`

### 🟡 BUG-005 — Minor: Dead 'monitor' pill в SUBCATS.peripherals ✅ Fixed

- **Файл:** `js/filters.js:673`
- **Описание:** Pill "🖥 Монитори" в периферия показваше 0 резултати — мониторите са в кат. `'monitors'`, не `'peripherals'`.
- **Fix:** Премахнат от `SUBCATS.peripherals`. **Commit:** `a63702c`

### 🟢 ENH-004 — CAT_SPEC_FILTERS.accessories не отразява реалните данни

Обновен с реални стойности (Резолюция/Технология/WiFi за проектори). При бъдещи imports ще трябва разширяване.
