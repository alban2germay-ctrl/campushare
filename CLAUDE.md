# CLAUDE.md — Directives de Développement CampuShare PWA

## 🎯 Mission
Développer pas à pas la Progressive Web App (PWA) **CampuShare** pour Alban (2A SN sur Mac) et Mathys (2A 3EA sur Windows PC), étudiants à Toulouse INP - ENSEEIHT.

---

## 🏛️ Architecture & Organisation des Fichiers
Le projet est une PWA modulaire pure Vanilla JS / React (sans build step lourd) :
* `public/index.html` : Point d'entrée PWA (React production + Lucide, versions figées)
* `public/js/loader.js` : Charge les fichiers JSX dans l'ordre et garde leur version compilée en cache (Babel téléchargé seulement si un fichier a changé). La liste `SOURCES` est mise à jour automatiquement.
* `public/sw.js` : Service worker hors ligne (`APP_SHELL` et `CACHE_VERSION` mis à jour automatiquement)
* `outils/sync_app.py` : lancé par `collab.sh save` / `collab.ps1 save` → vérifie la syntaxe (bloque l'envoi si erreur), puis met à jour `SOURCES`, `APP_SHELL`, `CACHE_VERSION` et le `?v=` de `loader.js`. Lancement manuel : `python3 outils/sync_app.py`
* `public/js/app.js` : Orchestrateur principal & routeur d'onglets
* `public/js/data/mockData.js` : Contrat de données partagé (utilisateurs, catégories, objets avec `ownerId`, réservations avec `renterId`/`ownerId`/`status`)
* `public/js/data/actions.js` : Règles du prêt (`window.CS.actions` : `requestBooking`, `acceptBooking`, `declineBooking`, `advanceBooking`, `addItem`, `removeItem`). Chaque action déclenche `cs:change` → l'app se redessine. **Ne jamais modifier une réservation ou un objet sans passer par là.**
* `public/js/data/format.js` : `window.CS.formatPrice(6)` → « 6,00 € »
* `public/js/components/` : Composants partagés (`CampusHeader.js`, `BottomNav.js`, `StudioBar.js`)
* `public/js/views/` :
  - `ExploreView.js` : Chantier A d'Alban (Moteur Emprunteur & Recherche 7j/7)
  - `ItemsView.js` : Chantier B de Mathys (Moteur Propriétaire & Ajout Express < 60s)
  - `BookingsView.js` : Chantier C (Passeport QR Code & Check-in)
  - `ProfileView.js` : Chantier D (Compte & Confiance)

---

## 🔒 Règles de Collaboration & Sanctuarisation
1. **Parité 50/50 :** Respecter le partage de travail entre Alban (Chantier A) et Mathys (Chantier B).
2. **Sanctuarisation de `ItemsView.js` :** Développé et maintenu par Mathys (ne pas écraser sans concertation).
3. **Synchronisation Git :** Toujours utiliser les scripts dédiés :
   - Sur Mac (Alban) : `./collab.sh save "message"` et `./collab.sh pull`
   - Sur Windows (Mathys) : `powershell -ExecutionPolicy Bypass -File .\collab.ps1 save "message"`

---

## 🧪 Commandes & Lancement
* **Lancer le serveur local :** `python3 -m http.server 3000 --directory public`
* **Vérifier l'intégrité de la syntaxe JS :**
  `python3 -c "import glob,sys; bad=[f for f in glob.glob('public/js/**/*.js',recursive=True)+['public/sw.js'] if any((t:=open(f,encoding='utf-8').read()).count(a)!=t.count(b) for a,b in ('()','{}','[]'))]; print('KO :',bad) if bad else print('Syntaxe 100% OK'); sys.exit(bool(bad))"`

---

## 🎨 Charte Graphique & Ergonomie
* **Design :** Mobile-First, One-Thumb (tout accessible au pouce en bas de l'écran).
* **Palette :**
  - Fond doux : `#FAF8F5`
  - Accent primaire : Vert sauge `#52796F` (hover `#43665D`)
  - Accent secondaire : Terracotta `#D87D4A`
  - Cartes : Blanc `#FFFFFF` avec bordures fines `#EAE2D5`
* **Ton :** Simple, direct, étudiant, rassurant (zéro jargon financier anxiogène, insister sur *"0,00 € débité"* pour la caution).

