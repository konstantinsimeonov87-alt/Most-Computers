// Most Computers — Service Worker cd079078
const CACHE = 'mc-cd079078';
const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './products.js',
  './app.js',
  './data.js',
];

// Install — precache shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for images (same-origin + portal.mostbg.com), network-first for rest
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Images: cache-first (same-origin OR portal.mostbg.com product images)
  const isImage = /\.(png|jpg|jpeg|webp|gif|svg|ico)$/i.test(url.pathname);
  const isPortalImg = url.hostname === 'portal.mostbg.com' && isImage;
  const isSameOriginImg = url.origin === location.origin && isImage;

  if (isSameOriginImg || isPortalImg) {
    e.respondWith(
      caches.match(request).then(cached => cached || fetch(request, { mode: 'cors' }).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      }).catch(() => caches.match(request)))
    );
    return;
  }

  // Cross-origin (non-image): skip SW
  if (url.origin !== location.origin) return;

  // Everything else: network-first, fall back to cache
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request).then(cached => cached || caches.match('./').then(shell => shell || new Response(
        '<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Офлайн — Most Computers</title><style>body{font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f172a;color:#fff;text-align:center;padding:20px}h1{font-size:2rem;margin-bottom:.5rem}p{color:#94a3b8;margin-bottom:1.5rem}a{background:#bd1105;color:#fff;padding:.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:700}</style></head><body><h1>📡 Няма връзка</h1><p>Проверете интернет връзката и опитайте отново.</p><a href="/">Опитай отново</a></body></html>',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      ))))
  );
});
