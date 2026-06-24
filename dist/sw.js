// Most Computers — Service Worker 033f9adc
// Most Computers — Service Worker 5cf2bbeb
const CACHE = 'mc-033f9adc';
=======
// Most Computers — Service Worker f4d37160
const CACHE = 'mc-acad174';
>>>>>>> 408942c (feat(ux): sticky footer bar на десктоп (Вариант B - blur))

const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './app-lazy.js',
];

// Install - precache shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

// Activate - delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - cache-first for images (same-origin + portal.mostbg.com), network-first for rest
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
      .catch(() => caches.match(request, {ignoreSearch: true}).then(cached => cached || new Response('Офлайн режим - страницата не е налична.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })))
  );
});
