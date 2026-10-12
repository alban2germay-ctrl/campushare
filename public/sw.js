// ==============================================================================
// 🎒 CampuShare — Service Worker (PWA hors ligne)
// Fichier : public/sw.js
// ------------------------------------------------------------------------------
// - Fichiers de l'app (même origine) : réseau d'abord, cache en secours
//   → vos modifs apparaissent tout de suite, et l'app marche sans réseau.
// - Librairies CDN & images (autres origines) : cache d'abord
//   → chargement rapide et disponible hors ligne (QR de retrait au Foyer N7).
// 🤖 APP_SHELL et CACHE_VERSION sont mis à jour automatiquement par
//    outils/sync_app.py à chaque `collab.sh save` / `collab.ps1 save`.
// ==============================================================================

const CACHE_VERSION = 'campushare-7db14107';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './js/loader.js?v=ea56b904',
  './js/data/mockData.js?v=20261012',
  './js/data/store.js?v=20261012',
  './js/data/format.js?v=20261012',
  './js/data/actions.js?v=20261012',
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
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.26.4/babel.min.js', // seulement si un fichier a changé
  'https://unpkg.com/lucide@1.55.0/dist/umd/lucide.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      // Les CDN sont mis en cache un par un : un échec ne bloque pas l'installation.
      // ⚠️ En mode 'cors' (jamais 'no-cors') : React est chargé avec l'attribut
      // crossorigin, et une copie « opaque » serait rejetée → écran vide.
      await Promise.all(
        CDN_LIBS.map((url) =>
          fetch(url, { mode: 'cors' })
            .then((res) => (res.ok ? cache.put(url, res) : null))
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
          caches.match(req).then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
        )
    );
  } else {
    // Cache d'abord pour les CDN et images. Une copie « opaque » (sans CORS)
    // ne peut servir qu'à une requête du même type, sinon le navigateur la
    // rejette (ERR_FAILED) : dans ce cas on repasse par le réseau.
    event.respondWith(
      caches.match(req).then((cached) => {
        const usable = cached && (cached.type !== 'opaque' || req.mode === 'no-cors');
        if (usable) return cached;
        return fetch(req)
          .then((res) => {
            if (res.ok || (res.type === 'opaque' && req.mode === 'no-cors')) {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => (usable ? cached : Response.error()));
      })
    );
  }
});
