const CACHE_NAME = 'proconix-v2-cache';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Base cache items - do NOT cache '/' to avoid loading stale HTML and broken Next.js chunks
      return cache.addAll(['/manifest.json', '/icon.jpg', '/talibbhai.jpg']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Ignore document/navigation requests to ensure users always fetch the latest HTML and JS/CSS chunk maps from the network
  if (e.request.mode === 'navigate') {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
