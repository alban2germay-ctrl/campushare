# CLAUDE.md — Directives de Développement CampuShare PWA

## 🎯 Mission
Développer pas à pas la Progressive Web App (PWA) **CampuShare** pour Alban (2A SN sur Mac) et Mathys (2A 3EA sur Windows PC), étudiants à Toulouse INP - ENSEEIHT.

---

## 🏛️ Architecture & Organisation des Fichiers
Le projet est une PWA modulaire pure Vanilla JS / React (sans build step lourd) :
* `public/index.html` : Point d'entrée PWA avec balises de cache-busting `?v=...`
* `public/js/app.js` : Orchestrateur principal & routeur d'onglets
* `public/js/data/mockData.js` : Contrat de données partagé (utilisateurs, catégories, objets, réservations)
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
  `python3 -c "import glob; [assert open(f).read().count('(') == open(f).read().count(')') and open(f).read().count('{') == open(f).read().count('}') for f in glob.glob('public/js/**/*.js')]; print('Syntaxe 100% OK')"`

---

## 🎨 Charte Graphique & Ergonomie
* **Design :** Mobile-First, One-Thumb (tout accessible au pouce en bas de l'écran).
* **Palette :**
  - Fond doux : `#FAF8F5`
  - Accent primaire : Vert sauge `#52796F` (hover `#43665D`)
  - Accent secondaire : Terracotta `#D87D4A`
  - Cartes : Blanc `#FFFFFF` avec bordures fines `#EAE2D5`
* **Ton :** Simple, direct, étudiant, rassurant (zéro jargon financier anxiogène, insister sur *"0,00 € débité"* pour la caution).

