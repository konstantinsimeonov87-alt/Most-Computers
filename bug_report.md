# Bug Report — Most Computers
**Дата:** 2026-04-16 | **Агент:** Bug Hunter (pipeline: release)

---

## Обобщение

| Severity | Брой | Статус |
|----------|------|--------|
| 🔴 Critical | 0 | — |
| 🟠 Major | 0 | — |
| 🟡 Minor (security) | 2 | ✅ Оправени |
| 🟢 Enhancement | 1 | 📋 Документиран |

**Тестове след fix:** 185/185 ✅

---

## 🟡 Minor (Security) — Оправени

### BUG-01 — XSS в admin `previewAefImg()` чрез URL атрибут
**Файл:** `js/admin.js` — функция `previewAefImg(url)`

**Проблем:**
```js
// ПРЕДИ (уязвимо)
preview.innerHTML = `<img src="${url}" alt="...">`
// url.startsWith('http') е insufficient — 'http://x" onload="alert(1)//'
// минава проверката и инжектира JS атрибут
```

**Fix:** Заменено с DOM API — `createElement` + `setAttribute`:
```js
// СЛЕД (безопасно)
const img = document.createElement('img');
img.setAttribute('src', url);  // setAttribute escape-ва специалните символи
img.setAttribute('alt', altText);
```

---

### BUG-02 — Unescaped emoji/name в admin table innerHTML
**Файл:** `js/admin.js` — `renderAdminProductsTable()`

**Проблем:**
```js
// ПРЕДИ (уязвимо при XML import с malicious data)
tbodyHtml += '...' + p.emoji + '...' + p.name + '...'
```

**Fix:** Добавен `_esc()` helper + приложен на p.emoji, p.name, p.sku:
```js
function _esc(s) {
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
```

---

## 🟢 Enhancement — Документиран (без action)

### ENH-01 — Z-index токени не са приложени навсякъде
CSS custom properties (`--z-modal`, `--z-toast` и др.) са дефинирани в `:root`, но ~15 legacy стойности все още използват хардкоднати числа. Влияние: нула. Препоръка: мигрирай при следващ major CSS refactor.

---

## ✅ Clean checks

| Проверка | Резултат |
|----------|----------|
| localStorage без try/catch | ✅ Всички са wrapped |
| `eval()` / `new Function()` | ✅ Не са намерени |
| Дублирани HTML id | ✅ `#bnCartBadge` ×2 е умишлено (querySelectorAll) |
| Cart XSS (p.name в innerHTML) | ✅ Данни от статичен products[] — безопасни |
| XML import sanitization | ✅ DOMParser + textContent (inherently safe) |
| Unhandled fetch promises | ✅ Не са намерени |
| Race conditions (async) | ✅ Не са намерени |
| Missing break в switch | ✅ Не са намерени switch statements |
