const CACHE_NAME = 'proconix-v3-cache';

self.addEventListener('install', (e) => {
  // Force new service worker to activate immediately without waiting
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()).then(() => {
      // Notify all open browser tabs and installed app windows
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_VERSION_UPDATED' });
        });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  // Never intercept document navigations or API routes - always fetch fresh
  if (e.request.mode === 'navigate' || e.request.url.includes('/api/')) {
    return;
  }
  // Network first, fallback to cache for offline support
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
