// ==============================================================================
// 🎒 CampuShare — Persistance Locale (localStorage)
// Fichier : public/js/data/store.js
// ------------------------------------------------------------------------------
// Chargé juste après mockData.js. Restaure l'état sauvegardé (objets,
// réservations, utilisateurs/cagnottes) puis sauvegarde automatiquement
// window.CS.data dès qu'il change. Aucune vue n'a besoin d'être modifiée :
// les mutations directes (window.CS.data.bookings = ..., unshift, etc.)
// sont détectées par comparaison de snapshot.
// ==============================================================================

(function () {
  const STORAGE_KEY = 'campushare:data';
  const SCHEMA_VERSION = 2; // ⚠️ Incrémenter si la forme de mockData.js change
  const PERSISTED_KEYS = ['users', 'items', 'bookings'];
  const SAVE_INTERVAL_MS = 1000;

  const data = window.CS.data;
  // Copie profonde des données de démo d'origine (pour la réinitialisation)
  const defaults = JSON.parse(JSON.stringify(data));

  const safeGet = () => {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  };
  const safeSet = (value) => {
    try { window.localStorage.setItem(STORAGE_KEY, value); return true; }
    catch (e) { console.warn('[CampuShare] Sauvegarde impossible (quota plein ou stockage bloqué) :', e); return false; }
  };
  const safeRemove = () => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  };

  const snapshot = () => {
    const out = { version: SCHEMA_VERSION };
    PERSISTED_KEYS.forEach((k) => { out[k] = data[k]; });
    return JSON.stringify(out);
  };

  // 1. RESTAURATION AU DÉMARRAGE
  const raw = safeGet();
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      if (saved && saved.version === SCHEMA_VERSION) {
        PERSISTED_KEYS.forEach((k) => {
          if (saved[k] !== undefined) data[k] = saved[k];
        });
      } else {
        safeRemove(); // Ancienne version du schéma : on repart des données de démo
      }
    } catch (e) {
      safeRemove(); // Données corrompues
    }
  }

  // 2. SAUVEGARDE AUTOMATIQUE (seulement si quelque chose a changé)
  let lastSaved = snapshot();
  const saveIfChanged = () => {
    const current = snapshot();
    if (current !== lastSaved && safeSet(current)) lastSaved = current;
  };
  setInterval(saveIfChanged, SAVE_INTERVAL_MS);
  window.addEventListener('pagehide', saveIfChanged);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveIfChanged();
  });

  // 3. API PUBLIQUE
  window.CS.store = {
    save: saveIfChanged,
    // Remet les données de démo et recharge (utile avant une démo / un test)
    reset: () => {
      safeRemove();
      PERSISTED_KEYS.forEach((k) => {
        if (defaults[k] === undefined) delete data[k];
        else data[k] = JSON.parse(JSON.stringify(defaults[k]));
      });
      lastSaved = snapshot();
      window.location.reload();
    }
  };
})();
