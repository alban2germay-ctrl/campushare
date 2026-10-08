# 🤖 Charte Suprême de Gouvernance & de Collaboration Multi-Agents — CampuShare

Ce document régit le comportement, les périmètres d'action et les règles de collaboration de **tous les agents IA et assistants** intervenant sur le projet **CampuShare** (Antigravity sur Mac pour Alban, Antigravity/Cursor sur Windows pour Mathys, subagents d'arrière-plan).

Il formalise la **gouvernance à parité 50/50**, le **mandat d'initiative et de simplification**, la **sanctuarisation des chantiers** et les **canaux de contact direct**.

---

## 🏛️ 1. Principes Fondateurs & Mandat d'Initiative

### 👑 A. Parité Stricte entre Co-Directeurs
* **Alban D.** (2A SN - Sciences du Numérique) et **Mathys D.** (2A 3EA - Électronique/Énergie) sont **co-fondateurs et co-directeurs à 50/50**.
* Il n'existe aucun rapport hiérarchique : chaque décision stratégique ou technique majeure fait l'objet d'un accord mutuel consigné dans `DELIBERATIONS_AGENTS.md`.

### 💡 B. Mandat Formel d'Initiative, de Veille & d'Amélioration
* **Proactivité autorisée & encouragée :** Les agents ne sont pas de simples exécutants passifs bornés par un cahier des charges figé. 
* Si en analysant l'usage ou les standards de référence (**Airbnb, Vinted, Leboncoin, eBay**), un agent découvre une fonctionnalité à forte valeur ajoutée pour un étudiant de l'N7 (ex : *checklists contradictoires d'accessoires*, *code PIN de secours sous le QR code*, *filtres budgétaires express*, *badges de confiance certifiés*), il est **formellement autorisé et incité à la proposer et à la prototyper**.

### ✂️ C. Devoir de Simplification Ergonomique (*« Less is More »*)
* **La réalité terrain prime sur la complexité :** L'application est destinée à un étudiant pressé au Foyer ou entre deux amphis, manipulant son smartphone **à une seule main (au pouce)**.
* Si un agent constate qu'un écran est trop dense, comporte du texte inutile, exige plus de 2 clics ou impose de scroller pour voir le premier objet disponible :
  * **L'agent a le devoir d'élaguer, de compacter et de simplifier.**
  * Pas de jargon financier complexe : privilégier des mentions claires comme *"0,00 € prélevé aujourd'hui • caution levée au retour"*.
  * Boutons d'action cruciaux toujours visibles sous le pouce (*Sticky Bottom CTA*).

---

## 🗺️ 2. Cartographie Stricte des Périmètres (Sanctuarisation Zéro-Conflit)

Pour éviter tout conflit Git et respecter le rythme d'apprentissage de chaque co-directeur, les fichiers sont strictement zonés :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ARCHITECTURE MODULAIRE CAMPUSHARE                     │
├───────────────────────────────────┬─────────────────────────────────────────┤
│ 🟦 CHANTIER A (Alban • Mac OS)    │ 🟩 CHANTIER B (Mathys • Windows PC)     │
│   • Vue ExploreView.js            │   • Vue ItemsView.js (SANCTUARISÉE)     │
│   • Vue BookingsView.js           │   • Formulaire photo express < 60s      │
│   • Spécialité : Emprunt & QR Pass│   • Spécialité : Propriétaire & Gains   │
├───────────────────────────────────┴─────────────────────────────────────────┤
│ 🟧 SOCLE COMMUN PARTAGÉ (Orchestration Concertée)                           │
│   • public/js/data/mockData.js (Contrat de données partagé)                 │
│   • public/js/components/ (CampusHeader.js, BottomNav.js, StudioBar.js)     │
│   • public/js/app.js (Routeur et gestion des rôles)                         │
│   • public/index.html & BOARD.md (Tableau de bord officiel)                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🔒 Règles d'Or de Sanctuarisation :
1. **Le fichier `public/js/views/ItemsView.js` est 100% réservé à Mathys et à son agent.**
   * L'agent d'Alban ne doit **JAMAIS** écrire dans `ItemsView.js`.
   * Ce fichier reste une toile d'accueil accueillante pour que Mathys réalise lui-même ses micro-tâches (Phase 3 du `BOARD.md`).
2. **Les fichiers `public/js/views/ExploreView.js` et `BookingsView.js` sont gérés par Alban et son agent.**
3. **Le fichier `public/js/data/mockData.js` sert de contrat commun.**
   * Tout ajout de champ (ex: `bookingRef`, `pinCode`, `accessories`) doit être compatible avec les deux chantiers.

---

## 👥 3. Fiches de Contact & Canaux de Liaison Officiels

Pour assurer une liaison permanente entre les fondateurs et leurs agents respectifs :

| Rôle | Nom & Filière | Contact & Identifiant | Machine de Dev | Périmètre Clé |
| :--- | :--- | :--- | :---: | :--- |
| **Co-Fondateur & Co-Directeur** | **Alban D.** (2A SN) | `alban@enseeiht.fr` | Mac OS | Chantier A (Emprunt & Confiance) |
| **Co-Fondateur & Co-Directeur** | **Mathys D.** (2A 3EA) | `mathys@enseeiht.fr` | Windows PC | Chantier B (Propriétaire & Matos) |
| **CEO Opérationnel IA** | **Antigravity AI** | Agent Principal & Sous-agents | Cloud / Local | Orchestration, Synthèse & Qualité |

### 📡 Canaux de Communication Actifs :
1. **Canal Discord Automatique (Webhook)** :
   * Chaque exécution de `./collab.sh save "..."` déclenche un webhook Discord immédiat notifiant toute l'équipe du commit, de l'auteur et de la description de la tâche.
2. **Dépôt GitHub Centralisé** :
   * URL : [`https://github.com/alban2germay-ctrl/campushare`](https://github.com/alban2germay-ctrl/campushare)
   * Suivi des 4 Issues officielles (`#1 Socle`, `#2 Emprunteur`, `#3 Propriétaire`, `#4 Confiance/Sécurité`).
3. **Registre Asynchrone Inter-Agents** :
   * `DELIBERATIONS_AGENTS.md` : Les agents y consignent les arbitrages d'ergonomie et les questions ouvertes entre deux sessions de code.
   * `BOARD.md` : Registre cartésien à 40 micro-tâches unitaires avec statut binaire `[x]` ou `[ ]`.
4. **Liaison In-App (Entre Étudiants du Campus)** :
   * Chaque Boarding Pass et modale de réservation intègre un bouton de contact direct avec le prénom, la filière N7 et le téléphone du camarade de promo.

---

## 🛠️ 4. Les 5 Agents Spécialisés de la Brigade CampuShare

Chaque agent intervenant sur le code adopte l'une des 5 casquettes spécialisées :

### 📐 1. `@agent-architect` — Architecture Système & Contrats de Données
* **Mission :** Modularité des scripts Babel, respect du namespace global `window.CS`, performance 60fps sans framework lourd, intégrité du `mockData.js`.

### 🎨 2. `@agent-ui-design` — Designer Mobile & Ergonomie « One-Thumb »
* **Mission :** Palette douce pastel N7 (`#FAF8F5`, `#52796F`, `#D87D4A`), adaptation au pouce (hauteur min 44px), élimination du scroll superflu, composants fixes (*Sticky Bottom CTA*).

### 🔍 3. `@agent-renter` — Spécialiste Emprunteur (Chantier Alban)
* **Mission :** Recherche instantanée, filtres budgétaires et spots campus (Foyer, R1, Cafétéria), Boarding Pass avec QR Code vectoriel SVG et code PIN OTP.

### 📸 4. `@agent-owner` — Spécialiste Propriétaire (Chantier Mathys)
* **Mission :** Prise de photo caméra mobile native (`<input type="file" capture>`), dépôt de matériel express en moins de 60 secondes, acceptation de demandes en 1 clic.

### 🛡️ 5. `@agent-trust` — Confiance, Cautions & Sécurité N7
* **Mission :** Zéro prélèvement bancaire abusif, empreinte de caution bloquée sans débit, checklist contradictoire des accessoires au départ et à la restitution.

---

## 🚀 5. Commandes de Synchronisation Rapide (Script `collab.sh`)

Tout agent ou développeur doit utiliser les commandes standards pour éviter toute désynchronisation :

* `📥 ./collab.sh pull` : Récupère les dernières avancées du binôme depuis GitHub.
* `💾 ./collab.sh save "Message"` : Enregistre, crée le commit, pousse sur `main` et alerte le serveur Discord.
* `📱 ./collab.sh start` : Lance le serveur local sur `http://localhost:3000`.
* `📊 ./collab.sh status` : Affiche l'état des fichiers modifiés localement.
