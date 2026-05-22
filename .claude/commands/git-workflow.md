---
description: 🌿 Git workflow — управлява branches, commits и pull requests за mostcomputers.bg
---

# 🌿 Git Workflow Agent

Този workflow управлява git дисциплина — branches, commits, PRs и pre-commit проверки.

## Стъпки

### 1. Провери текущото состояние
- Изпълни `git status` и `git log --oneline -10`
- Провери на кой branch си и дали има uncommitted промени
- Идентифицирай кои файлове ще бъдат включени в commit-а

### 2. Branch стратегия
Следвай тази naming convention:
- `feature/описание` — нова функционалност
- `fix/описание` — поправка на бъг
- `chore/описание` — maintenance, зависимости, конфигурация
- `perf/описание` — performance оптимизация
- `docs/описание` — само документация

За нов branch: `git checkout -b feature/my-feature`

### 3. Pre-commit checklist
Преди да правиш commit, провери:
- [ ] Няма `console.log`, `debugger`, `console.error` в production код (освен умишлено логване)
- [ ] `npm test` минава без грешки
- [ ] Няма hardcoded credentials или PIN кодове
- [ ] Файловете в `js/` са редактирани, НЕ `app.js` директно
- [ ] Ако са редактирани js/ файлове — `app.js` е rebuild-нат с `node build.js`
- [ ] Няма `.env` или чувствителни файлове в staging

### 4. Conventional commits
Използвай тази форма за commit съобщения:
```
<тип>: <кратко описание> (до 72 символа)

[незадължително тяло — обяснение на "защо"]
```

Типове:
- `feat:` — нова функционалност
- `fix:` — поправка на бъг
- `perf:` — performance подобрение
- `style:` — CSS/UI промени без логика
- `refactor:` — рефакторинг без нова функционалност
- `test:` — тестове
- `chore:` — build, зависимости, конфигурация
- `docs:` — документация

Пример: `fix: footer z-index 600 so it renders above cat-page overlay`

### 5. Staging и commit
- Добавяй файлове по един или по група: `git add js/cart.js styles.css`
- **Избягвай `git add -A`** — може да включи нежелани файлове
- Провери staged промените: `git diff --staged`
- Commit: `git commit -m "feat: add product comparison limit warning"`

### 6. Pull Request насоки
За PR описание включи:
- **Какво** — кратко summary на промените
- **Защо** — мотивация или issue
- **Как да се тества** — стъпки за ревюър
- **Скрийншоти** — за визуални промени

### 7. Squash vs Merge
- **Squash** — когато имаш много малки WIP commits ("fix typo", "try again") → получаваш един чист commit
- **Merge** — когато отделните commits имат смисъл поотделно (логически стъпки)
- За mostcomputers.bg: предпочитай squash за feature branches, merge за release branches

## Формат на доклада
- Текущ git status
- Предложен commit message
- Checklist за pre-commit проверки
