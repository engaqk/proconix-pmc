const CACHE_NAME = 'proconix-v2-cache';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Base cache items
      return cache.addAll(['/', '/manifest.json', '/icon.jpg', '/talibbhai.jpg']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
