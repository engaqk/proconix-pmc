'use client';

import { useEffect, useRef } from 'react';

export default function AutoUpdater() {
  const currentVersionRef = useRef<string | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  const safeReload = () => {
    if (typeof window === 'undefined') return;
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    
    const doReload = () => {
      window.location.reload();
    };

    if ('caches' in window) {
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      }).catch(() => {}).finally(() => {
        doReload();
      });
    } else {
      doReload();
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Service Worker Update Listeners
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // Check for SW update immediately
        reg.update().catch(() => {});

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New worker installed while old is active
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
      }).catch((err) => {
        console.warn('SW registration warning:', err);
      });

      // Reload when new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          safeReload();
        }
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_VERSION_UPDATED') {
          safeReload();
        }
      });
    }

    // 2. Deployment Version Check via /api/version
    const checkVersion = async () => {
      try {
        const res = await fetch(`/api/version?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (!res.ok) return;
        const data = await res.json();
        const serverVersion = data.version;

        if (!currentVersionRef.current) {
          // First check: store current version
          const saved = sessionStorage.getItem('__proconix_deployment_ver');
          if (saved && saved !== serverVersion) {
            sessionStorage.setItem('__proconix_deployment_ver', serverVersion);
            safeReload();
            return;
          }
          currentVersionRef.current = serverVersion;
          sessionStorage.setItem('__proconix_deployment_ver', serverVersion);
        } else if (currentVersionRef.current !== serverVersion) {
          // New deployment detected!
          console.log('New deployment detected, refreshing browser/app...');
          sessionStorage.setItem('__proconix_deployment_ver', serverVersion);
          safeReload();
        }
      } catch {
        // Ignore network glitches
      }
    };

    // Initial check
    checkVersion();

    // Check when user returns to the tab or opens the installed app
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((reg) => reg.update()).catch(() => {});
        }
      }
    };

    // Check on window focus
    const onFocus = () => {
      checkVersion();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => reg.update()).catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onFocus);

    // Periodic check every 30 seconds
    const interval = setInterval(() => {
      checkVersion();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => reg.update()).catch(() => {});
      }
    }, 30000);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onFocus);
      clearInterval(interval);
    };
  }, []);

  return null;
}
