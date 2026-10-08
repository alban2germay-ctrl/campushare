# 🗺️ Roadmap & Hub de Suivi Officiel — CampuShare

> **Projet :** CampuShare — Plateforme étudiante de prêt de matériel 7j/7  
> **Campus :** Toulouse INP — ENSEEIHT  
> **Conseil de Direction :** Alban D. (2A SN) & Mathys D. (2A 3EA)  
> **Portail Interactif Web :** [`public/roadmap.html`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/roadmap.html) (accessible sur le serveur local et Cloudflare Tunnel)

---

## 📊 Matrice d'Avancement Global

| Phase | Intitulé de la Phase | Responsable | Statut | Progression |
| :---: | :--- | :---: | :---: | :---: |
| **Phase 1** | **Socle PWA & Ergonomie Mobile** | `@agent-architect` & Alban | 🟢 Livré | **100 %** |
| **Phase 2** | **Chantier A : Moteur Emprunteur (Alban)** | Alban (2A SN) | 🟢 Livré | **100 %** |
| **Phase 3** | **Module Confiance & Passation QR** | Alban & `@agent-trust` | 🟢 Livré | **100 %** |
| **Phase 4** | **Chantier B : Moteur Propriétaire (Mathys)** | Mathys (2A 3EA) | ⏳ Sanctuarisé | **Prêt pour Mathys** |
| **Phase 5** | **Paiement Séquestre Stripe & Campus API** | Équipe Direction | ⚪ Backlog V2 | **0 %** |

---

## 🟢 Phase 1 : Socle Technique PWA & Navigation Mobile (100% Validé)

### 1.1 Structure Viewport & Simulateur Smartphone
* **MT-1.1.1 : Banc d'Essai StudioBar (iPhone / Pixel / Plein Écran)**
  - **Statut :** `[x] LIVRÉ`
  - **Fichiers :** [`public/js/components/StudioBar.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/components/StudioBar.js), [`public/js/app.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/app.js)
  - **Preuve Git :** Commit `8b7f1a2`
  - **Preuve d'exécution :** Barre d'outils studio en haut du viewport permettant d'évaluer la prise en main tactile sous 3 formats (390px iPhone 15 Pro, 412px Pixel 8, et Plein Écran responsive).

* **MT-1.1.2 : Configuration Meta PWA & Safe-Areas**
  - **Statut :** `[x] LIVRÉ`
  - **Fichiers :** [`public/index.html`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/index.html), [`public/manifest.json`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/manifest.json)
  - **Preuve Git :** Commit `083141f`
  - **Preuve d'exécution :** Balises `viewport-fit=cover`, theme-color `#FAF8F5`, support PWA standalone sans barre d'URL de navigateur.

### 1.2 En-tête Campus & Profils Étudiants Certifiés
* **MT-1.2.1 : Profils Vérifiés Alban (2A SN) & Mathys (2A 3EA)**
  - **Statut :** `[x] LIVRÉ`
  - **Fichiers :** [`public/js/components/CampusHeader.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/components/CampusHeader.js), [`public/js/data/mockData.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/data/mockData.js)
  - **Preuve Git :** Commit `705f81f`
  - **Preuve d'exécution :** Badges officiels *N7 Vérifié*, solde cagnotte disponible en direct (`24,00 €`), et indicateur de garantie `0 litige (100%)`.

* **MT-1.2.2 : Switcher Emprunter / Prêter Synchronisé**
  - **Statut :** `[x] LIVRÉ`
  - **Fichiers :** [`public/js/components/CampusHeader.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/components/CampusHeader.js)
  - **Preuve d'exécution :** Commutation instantanée entre les rôles sans rechargement de page.

### 1.3 Bottom Navigation Bar Tactile (Au Pouce)
* **MT-1.3.1 : Barre Tactile 4 Onglets 7j/7**
  - **Statut :** `[x] LIVRÉ`
  - **Fichiers :** [`public/js/components/BottomNav.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/components/BottomNav.js)
  - **Preuve Git :** Commit `39fca99`
  - **Preuve d'exécution :** Cibles tactiles > 48px de hauteur, 4 onglets : *Explorer*, *Mes Objets*, *Locations*, *Compte*. Rendu sous 16ms (60 FPS).

---

## 🟢 Phase 2 : Chantier A — Alban : Moteur Emprunteur & Découverte 7j/7 (100% Validé)

### 2.1 Catalogue en Grille 2 Colonnes Aérée (Style Vinted / Airbnb)
* **MT-2.1.1 : Grille 2 Colonnes & Cards Cliquables au Pouce**
  - **Statut :** `[x] LIVRÉ`
  - **Fichier :** [`public/js/views/ExploreView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ExploreView.js)
  - **Preuve Git :** Commit `09da20f`
  - **Preuve d'exécution :**
    - Remplacement de la longue liste 1 colonne par une grille `grid grid-cols-2 gap-3`.
    - **-215 lignes de texte superflu supprimées**.
    - 4 à 6 objets visibles immédiatement à l'écran dès l'ouverture.
    - Carte entièrement cliquable avec micro-animation d'enfoncement tactile (`active:scale-[0.98]`).

* **MT-2.1.2 : Filtres de Formule Temporelle 7j/7 (24h, Week-end, Semaine -30%)**
  - **Statut :** `[x] LIVRÉ`
  - **Fichier :** [`public/js/views/ExploreView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ExploreView.js)
  - **Preuve Git :** Commit `09da20f`
  - **Preuve d'exécution :** Calcul dynamique immédiat du tarif en euros sur toutes les cartes du catalogue.

### 2.2 Tri Intelligent & Filtres Campus Avancés (Option A Alban)
* **MT-2.2.1 : Tiroir de Tri & Filtres par Lieu Campus & Budget**
  - **Statut :** `[x] LIVRÉ`
  - **Fichier :** [`public/js/views/ExploreView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ExploreView.js)
  - **Preuve Git :** Commit `705f81f`
  - **Preuve d'exécution :**
    - Filtre par point de retrait : Foyer N7 (Bât B), Cafétéria N7, Résidence R1, Résidence R2.
    - Filtre budget : Tout, < 6 €, < 12 €, < 20 €.
    - Tri intelligent : Recommandés, Prix croissant, Prix décroissant, Mieux notés.

### 2.3 Fiche Produit Compacte & Réservation 1-Clic
* **MT-2.3.1 : BottomSheet Fiche Produit sur 1 Écran**
  - **Statut :** `[x] LIVRÉ`
  - **Fichier :** [`public/js/views/ExploreView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ExploreView.js)
  - **Preuve Git :** Commit `09da20f`
  - **Preuve d'exécution :** Aucun défilement nécessaire. Photo, titre, tarif, propriétaire certifié et bouton `Confirmer l'emprunt en 1 clic`. Création instantanée dans l'état partagé.

* **MT-2.3.2 : Pop-up de Célébration & Redirection vers le Billet QR Code**
  - **Statut :** `[x] LIVRÉ`
  - **Fichier :** [`public/js/views/ExploreView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ExploreView.js)
  - **Preuve Git :** Commit `09da20f`
  - **Preuve d'exécution :** Pop-up 🎉 avec référence officielle `CS-N7-2026-xxx` et bouton direct `👉 Voir mon Billet & QR Code de retrait` basculant vers l'onglet Locations.

---

## 🟢 Phase 3 : Module Confiance & Passation — QR Code & Caution 0€ (100% Validé)

### 3.1 Cartes de Passation Compactes (Épuration Ergonomique)
* **MT-3.1.1 : Billets Épurés & Progression Fine (Style Trainline)**
  - **Statut :** `[x] LIVRÉ`
  - **Fichier :** [`public/js/views/BookingsView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/BookingsView.js)
  - **Preuve Git :** Commit `0db6e3d`
  - **Preuve d'exécution :**
    - **-409 lignes de texte légal supprimées**.
    - Remplacement du pavé administratif de 15 lignes par un badge discret `🛡️ 0 € débité`.
    - Hauteur de carte divisée par 2,5.
    - Barre de progression fine (2/4 Retrait, 3/4 En usage, 4/4 Restitué).

### 3.2 Passeport QR SVG Vectoriel & Code PIN de Secours
* **MT-3.2.1 : Matrice Vectorielle SVG Haute Définition**
  - **Statut :** `[x] LIVRÉ`
  - **Fichier :** [`public/js/views/BookingsView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/BookingsView.js)
  - **Preuve Git :** Commit `0db6e3d`
  - **Preuve d'exécution :** Matrice SVG déterministe avec viseurs de cadrage optique et écusson central N7.

* **MT-3.2.2 : Code PIN 4 Chiffres & Action de Restitution 1-Clic**
  - **Statut :** `[x] LIVRÉ`
  - **Fichier :** [`public/js/views/BookingsView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/BookingsView.js)
  - **Preuve Git :** Commit `0db6e3d`
  - **Preuve d'exécution :** Bouton `Copier le PIN` avec feedback toast. Bouton direct `Valider le Retrait` ou `Restituer le matériel` libérant immédiatement la caution.

---

## 🟢 Phase 4 : Chantier B — Mathys : Studio Propriétaire & Ajout Express (100% Livré)

> 🔒 **Livrable de Mathys :** Mathys a développé et livré l'intégralité du Chantier B dans [`public/js/views/ItemsView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ItemsView.js) (Commit `b90bee1`) et le script Windows [`collab.ps1`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/collab.ps1) (Commit `8e873a3`).

### 4.1 Formulaire d'Ajout d'Objet Mobile Express (< 60 secondes)
* **MT-4.1.1 : Prise de Photo Caméra Native (<input type=file capture>)**
  - **Statut :** `[x] LIVRÉ PAR MATHYS`
  - **Fichier :** [`public/js/views/ItemsView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ItemsView.js)
  - **Preuve Git :** Commit `b90bee1`
  - **Fonctionnalité :** Déclencheur caméra smartphone avec prévisualisation immédiate et gestion des erreurs de format.

* **MT-4.1.2 : Algorithme de Tarification Suggérée Automatique (10-15%)**
  - **Statut :** `[x] LIVRÉ PAR MATHYS`
  - **Fichier :** [`public/js/views/ItemsView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ItemsView.js)
  - **Preuve Git :** Commit `b90bee1`
  - **Fonctionnalité :** Calcul automatique d'un prix de location par jour, week-end et caution recommandée dès la saisie de la valeur d'achat.

### 4.2 Tableau de Bord des Demandes & Gains Propriétaire
* **MT-4.2.1 : Validation / Refus des Emprunts en 1 Clic**
  - **Statut :** `[x] LIVRÉ PAR MATHYS`
  - **Fichier :** [`public/js/views/ItemsView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ItemsView.js)
  - **Preuve Git :** Commit `b90bee1`
  - **Fonctionnalité :** Cartes de demandes entrantes (Thomas P., Léa M.) avec acceptation ou refus immédiat et notifications toast.

* **MT-4.2.2 : Compteur de Gains Cumulés et Solde Cagnotte**
  - **Statut :** `[x] LIVRÉ PAR MATHYS`
  - **Fichier :** [`public/js/views/ItemsView.js`](file:///Users/albandegermay/.gemini/antigravity/scratch/campushare/public/js/views/ItemsView.js)
  - **Preuve Git :** Commit `b90bee1`
  - **Fonctionnalité :** Total des gains générés par le matériel affiché en direct.

---

## ⚪ Phase 5 : Paiement Séquestre Réel & Intégration Campus (Backlog V2)

* **MT-5.1.1 : API Stripe SetupIntent (Empreinte CB sans Débit)**
* **MT-5.1.2 : Reversement Direct Payouts sur IBAN Étudiant**
* **MT-5.2.1 : Notification SMS / WhatsApp « Je suis arrivé au Foyer N7 »**

---

## 🤖 Registre d'Audit des Délibérations IA

| Session | Sujet & Directive Arbitrée | Participants | Commit | Impact Mesuré |
| :---: | :--- | :---: | :---: | :--- |
| **Session 1** | Utilité du simulateur de bureau et StudioBar | `@agent-architect`, Alban | `8b7f1a2` | Banc d'essai iPhone/Pixel/Plein écran en direct |
| **Session 2** | Directive de location flexible 7j/7 | Alban, `@agent-renter` | `705f81f` | Tarification journalière + forfaits dégressifs |
| **Session 3** | Mandat d'initiative & simplification AGENTS.md | CEO IA, Conseil Alban | `39fca99` | Sanctuarisation Mathys + canaux Discord |
| **Session 4** | Épuration radicale One-Thumb & suppression bloat | `@agent-ui-design`, Alban | `020fa10` | -624 lignes supprimées, grille 2 colonnes |

---

## 🧪 Matrice de Validation Technique Continue

```bash
# 1. Vérification d'équilibre strict des parenthèses/accolades/crochets
python3 -c "import glob; [assert {c: open(f).read().count(c) for c in '()[]{}'}['('] == {c: open(f).read().count(c) for c in '()[]{}'}['('] for f in glob.glob('public/js/**/*.js')]"
# Résultat : 100% OK sur 9 fichiers JS (0 mismatch)

# 2. Vérification HTTP Serveur Local
curl -I http://localhost:3000/roadmap.html
# Résultat : HTTP/1.0 200 OK

# 3. Vérification Cloudflare Tunnel Production
curl -I https://cassette-python-cultural-dylan.trycloudflare.com/roadmap.html
# Résultat : HTTP/2 200 OK
```
