<<<<<<< HEAD
// Most Computers — Service Worker f9d6cf3
// Most Computers — Service Worker f6a5d73
=======
<<<<<<< HEAD
// Most Computers — Service Worker 4d773356
>>>>>>> 27684c9 (fix(mobile): replace emoji with SVG icons in homepage tabs, fix one-row layout)
// Most Computers — Service Worker 420bf23
// Most Computers — Service Worker c662290
// Most Computers — Service Worker 4b3d57c0
// Most Computers — Service Worker 1af9e586
<<<<<<< HEAD
const CACHE = 'mc-f9d6cf3';
=======
const CACHE = 'mc-4d773356';
>>>>>>> 27684c9 (fix(mobile): replace emoji with SVG icons in homepage tabs, fix one-row layout)
=======
<<<<<<< HEAD
// Most Computers — Service Worker 93e6cded
// Most Computers — Service Worker c662290
// Most Computers — Service Worker 4b3d57c0
// Most Computers — Service Worker 1af9e586
const CACHE = 'mc-f9d6cf3';
>>>>>>> c3fd921 (fix(pdp-mobile): replace back button with compact one-row mobile header)
=======
<<<<<<< HEAD
// Most Computers — Service Worker 4c790905
const CACHE = 'mc-f9d6cf3';
>>>>>>> 947bad8 (feat(cat): replace all-at-once render with 24-per-page pagination)
=======
// Most Computers — Service Worker 0a84693a
const CACHE = 'mc-f9d6cf3';
=======
// Most Computers — Service Worker 4c6a43be
// Most Computers — Service Worker 4b3d57c0
// Most Computers — Service Worker 1af9e586
const CACHE = 'mc-f9d6cf3';
=======
// Most Computers — Service Worker 557b9dd2
// Most Computers — Service Worker 4b3d57c0
// Most Computers — Service Worker 1af9e586
const CACHE = 'mc-f9d6cf3';
>>>>>>> 42c3966 (fix(pdp-mobile): add back navigation button on mobile product page)
=======
<<<<<<< HEAD
// Most Computers — Service Worker 4c790905
const CACHE = 'mc-f9d6cf3';
>>>>>>> 947bad8 (feat(cat): replace all-at-once render with 24-per-page pagination)
=======
// Most Computers — Service Worker 0a84693a
<<<<<<< HEAD
const CACHE = 'mc-f9d6cf3';
>>>>>>> 0b0dfb2 (fix(pdp): match 'При намаление' button style to other secondary action buttons)
=======
const CACHE = 'mc-f9d6cf3';
>>>>>>> 42c3966 (fix(pdp-mobile): add back navigation button on mobile product page)
>>>>>>> 0ec6325 (fix(mobile): drawer menu + PDP layout fixes)
const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './app-lazy.js',
  './data-core.js',
  './data-details.js',
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
