---
name: Icecat image fetch after product import
description: След всеки внос на нови продукти в data.js задължително пускай Icecat скрипта за снимки
type: feedback
---

След всеки внос на продукти в `js/data.js` — задължително пусни:

```bash
node scripts/fetch-icecat-images.js
node build.js
npm test
```

**Why:** Продуктите от Most BG XML feed-ове идват с placeholder снимки (`PL_4.gif`) или без снимка. Icecat API-то намира реални снимки по EAN номер.

**How to apply:** Напомни на потребителя преди/след `git commit` при data import. Credentials: `konstantin87` / `makosi1324` (вече хардкоднати в скрипта).
