---
description: 🚀 Deploy агент — build, оптимизация и deployment pipeline за mostcomputers.bg
---

# 🚀 Deploy Agent

## Цел
Подготовка на production build, оптимизация на assets и deployment pipeline.

## Стъпки

### 1. Pre-deploy проверки
// turbo
- Изпълни: `npx jest --no-coverage` — всички тестове трябва да минават
- Провери за console.log/debugger statements в production код
- Провери за TODO/FIXME коментари, които трябва да се адресират
- Верифицирай, че `manifest.json` и `sw.js` са актуални

### 2. Build процес
- Minify JavaScript:
  ```
  npx -y terser app.js -o dist/app.min.js --compress --mangle
  npx -y terser products.js -o dist/products.min.js --compress --mangle
  ```
- Minify CSS:
  ```
  npx -y clean-css-cli styles.css -o dist/styles.min.css
  ```
- Minify HTML:
  ```
  npx -y html-minifier-terser index.html -o dist/index.html --collapse-whitespace --remove-comments
  ```

### 3. Asset оптимизация
- Генерирай favicon set (16x16, 32x32, 180x180, 512x512)
- Провери og:image — съществува ли `og-default.jpg`?
- Оптимизирай SVG sprite — премахни ненужни атрибути
- Генерирай sitemap с правилни lastmod дати

### 4. Performance верификация
- Стартирай HTTP server: `npx http-server dist/ -p 3333 -c-1`
- Отвори в браузъра и провери:
  - Страницата зарежда ли се правилно?
  - Product modal работи ли?
  - Cart функционалност OK?
  - Mobile responsive OK?
- Измери размери:
  ```bash
  du -k dist/* | sort -rn | awk '{printf "%-8s %s\n", $1"KB", $2}'
  ```

### 5. Deployment options
Генерирай инструкции за:

**Option A: Netlify (препоръчително за static sites)**
```bash
npx -y netlify-cli deploy --dir=dist --prod
```

**Option B: Vercel**
```bash
npx -y vercel deploy dist/ --prod
```

**Option C: GitHub Pages**
```bash
git subtree push --prefix dist origin gh-pages
```

**Option D: Custom Server (nginx)**
```nginx
server {
    listen 80;
    server_name mostcomputers.bg;
    root /var/www/mostcomputers/dist;
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:;";
}
```

### 6. Post-deploy верификация
- Провери HTTPS сертификат
- Тествай production URL в браузъра
- Провери Service Worker registration
- Верифицирай meta tags и OpenGraph preview
- Тествай Google PageSpeed Insights score

## Формат на доклада
- Build размери (before/after minification)  
- Deployment URL
- Performance scores
- Checklist на успешните проверки
