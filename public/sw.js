// ==============================================================================
// 🎒 CampuShare — Service Worker (PWA hors ligne)
// Fichier : public/sw.js
// ------------------------------------------------------------------------------
// - Fichiers de l'app (même origine) : réseau d'abord, cache en secours
//   → vos modifs apparaissent tout de suite, et l'app marche sans réseau.
// - Librairies CDN & images (autres origines) : cache d'abord
//   → chargement rapide et disponible hors ligne (QR de retrait au Foyer N7).
// ⚠️ Incrémenter CACHE_VERSION à chaque changement de la liste APP_SHELL.
// ==============================================================================

const CACHE_VERSION = 'campushare-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './js/data/mockData.js?v=20261012',
  './js/data/store.js?v=20261012',
  './js/components/StudioBar.js?v=20261012',
  './js/components/CampusHeader.js?v=20261012',
  './js/components/BottomNav.js?v=20261012',
  './js/views/ExploreView.js?v=20261012',
  './js/views/ItemsView.js?v=20261012',
  './js/views/BookingsView.js?v=20261012',
  './js/views/ProfileView.js?v=20261012',
  './js/app.js?v=20261012'
];

const CDN_LIBS = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      // Les CDN sont mis en cache un par un : un échec ne bloque pas l'installation
      await Promise.all(
        CDN_LIBS.map((url) =>
          fetch(url, { mode: 'no-cors' })
            .then((res) => cache.put(url, res))
            .catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    // Réseau d'abord, cache en secours
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
        )
    );
  } else {
    // Cache d'abord pour les CDN et images
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            if (res.ok || res.type === 'opaque') {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
      })
    );
  }
});
