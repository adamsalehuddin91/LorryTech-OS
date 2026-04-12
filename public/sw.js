const CACHE_NAME = 'lorrytech-v1';
const DRIVER_PAGES = [
  '/driver/dashboard',
  '/driver/trips',
  '/driver/commissions',
  '/driver/receipts',
  '/driver/upload-receipt',
];

// Shell assets to cache on install
const SHELL_ASSETS = [
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Skip non-GET and Inertia XHR (let those go fresh)
  if (request.method !== 'GET') return;
  if (request.headers.get('X-Inertia')) return;

  const isDriverPage = DRIVER_PAGES.some((p) => url.pathname.startsWith(p));
  const isStaticAsset = url.pathname.startsWith('/build/') || url.pathname.startsWith('/icons/');

  if (isStaticAsset) {
    // CacheFirst for build assets (Vite fingerprinted)
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  if (isDriverPage) {
    // NetworkFirst for driver portal pages — fresh data, fallback to cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            return caches.match('/offline.html');
          })
        )
    );
    return;
  }
});
