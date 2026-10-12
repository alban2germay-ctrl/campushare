// ==============================================================================
// 🎒 CampuShare — Chargeur JSX avec cache de compilation
// Fichier : public/js/loader.js
// ------------------------------------------------------------------------------
// Remplace les <script type="text/babel"> : chaque fichier source est récupéré,
// et sa version compilée est gardée dans localStorage (clé = chemin, contrôle =
// empreinte du contenu). Babel (~3 Mo) n'est téléchargé et exécuté QUE si un
// fichier a changé depuis la dernière visite → démarrage quasi instantané sur
// mobile, sans aucune étape de build (pas besoin de Node).
// ⚠️ Pour ajouter un fichier JS de l'app : l'ajouter à SOURCES (et à sw.js).
// ==============================================================================

(function () {
  const SOURCES = [
    'js/data/mockData.js',
    'js/data/store.js',
    'js/components/StudioBar.js',
    'js/components/CampusHeader.js',
    'js/components/BottomNav.js',
    'js/views/ExploreView.js',     // Chantier A (Alban)
    'js/views/ItemsView.js',       // Chantier B (Mathys)
    'js/views/BookingsView.js',    // Chantier C (Locations 7j/7)
    'js/views/ProfileView.js',     // Chantier D (Compte & Confiance)
    'js/app.js'                    // Orchestrateur (toujours en dernier)
  ];
  const VERSION = '20261012';
  const BABEL_URL = 'https://unpkg.com/@babel/standalone@7.26.4/babel.min.js';
  const BABEL_OPTIONS = { presets: ['env', 'react'], sourceType: 'script' };
  const CACHE_PREFIX = 'campushare:jsx:';
  // Change si Babel ou ses options changent → invalide tout le cache
  const SALT = BABEL_URL + JSON.stringify(BABEL_OPTIONS);

  // Empreinte FNV-1a 32 bits (rapide, suffisant pour détecter une modif)
  const hash = (str) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36);
  };

  const readCache = (path) => {
    try { return JSON.parse(window.localStorage.getItem(CACHE_PREFIX + path)); } catch (e) { return null; }
  };
  const writeCache = (path, entry) => {
    try { window.localStorage.setItem(CACHE_PREFIX + path, JSON.stringify(entry)); }
    catch (e) { /* quota plein : on recompilera la prochaine fois */ }
  };

  let babelPromise = null;
  const loadBabel = () => {
    if (window.Babel) return Promise.resolve(window.Babel);
    if (!babelPromise) {
      babelPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = BABEL_URL;
        s.onload = () => resolve(window.Babel);
        s.onerror = () => reject(new Error('Babel indisponible (hors ligne ?)'));
        document.head.appendChild(s);
      });
    }
    return babelPromise;
  };

  // Exécution dans la portée globale, comme un <script> classique
  const run = (path, code) => {
    const s = document.createElement('script');
    s.textContent = code + '\n//# sourceURL=' + path;
    document.body.appendChild(s);
  };

  const compile = async (path, src, h) => {
    const cached = readCache(path);
    if (cached && cached.h === h) return cached.code;
    const Babel = await loadBabel();
    const code = Babel.transform(src, Object.assign({ filename: path }, BABEL_OPTIONS)).code;
    writeCache(path, { h, code });
    return code;
  };

  (async () => {
    // Téléchargement en parallèle, revalidé auprès du serveur (304 si inchangé)
    // pour que chaque modif soit vue au rechargement ; hors ligne, le service
    // worker sert sa copie en cache
    const sources = await Promise.all(
      SOURCES.map((path) =>
        fetch(path + '?v=' + VERSION, { cache: 'no-cache' })
          .then((res) => { if (!res.ok) throw new Error(res.status); return res.text(); })
          .catch(() => null)
      )
    );

    // Exécution dans l'ordre (mockData → store → composants → vues → app)
    for (let i = 0; i < SOURCES.length; i++) {
      const path = SOURCES[i];
      const src = sources[i];
      try {
        let code;
        if (src === null) {
          // Fichier injoignable : dernière version compilée connue
          const cached = readCache(path);
          if (!cached) throw new Error('fichier introuvable et absent du cache');
          code = cached.code;
        } else {
          code = await compile(path, src, hash(SALT + src));
        }
        run(path, code);
      } catch (e) {
        console.error('[CampuShare] Échec du chargement de ' + path + ' :', e);
      }
    }
  })();
})();
