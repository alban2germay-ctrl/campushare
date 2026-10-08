# 📋 Matrice Opérationnelle des Micro-Tâches — CampuShare

Ce document est le **Registre d'Ingénierie & Tableau de Suivi Officiel**. 
Il applique une décomposition cartésienne au niveau unitaire (nano-tâches). Aucune tâche ne dépasse 1 action technique précise, vérifiable par un critère binaire d'acceptation (*Definition of Done*).

---

### 📊 VUE D'ENSEMBLE DE L'AVANCEMENT

| Phase | Intitulé | Total Micro-Tâches | Terminées | En Cours | Progression |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **P1** | Socle Technique PWA & Navigation Mobile | 12 | 12 | 0 | **100 %** |
| **P2** | Chantier A : Moteur Emprunteur (Découverte 7j/7 - Alban) | 10 | 10 | 0 | **100 %** |
| **P3** | Chantier B : Moteur Propriétaire (Matériel Express - Mathys) | 10 | 0 | 0 | **0 %** |
| **P4** | Module Confiance, Cautions & Sécurité | 8 | 0 | 0 | **0 %** |
| **TOTAL** | **Architecture Globale CampuShare** | **40** | **22** | **0** | **55.0 %** |

---

## 🟢 PHASE 1 : SOCLE TECHNIQUE PWA & NAVIGATION MOBILE (100% VALIDÉE)

### Tâche 1.1 : Structure Viewport & Ergonomie Smartphone
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-1.1.1.1` | Configuration des balises meta viewport & safe-areas | `@agent-arch` | `public/index.html` | Balise `viewport-fit=cover` présente, aucun zoom tactile indésirable. | `[x]` |
| `MT-1.1.1.2` | Structure conteneur mobile 390px centré sur PC | `@agent-ui` | `public/index.html` | Largeur limitée à 390px sur bureau, 100% largeur fluide sur smartphone. | `[x]` |
| `MT-1.1.1.3` | Conception du sélecteur de banc d'essai (iPhone / Pixel / Plein écran) | `@agent-arch` | `public/index.html` | 3 boutons fonctionnels basculant la largeur en direct sans recharger la page. | `[x]` |

### Tâche 1.2 : Header Campus & Profils Étudiants
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-1.1.2.1` | Modélisation des profils certifiés d'Alban et Mathys | `@agent-trust` | `public/js/data/mockData.js` | Données promo (SN / 3EA) et avatars distincts enregistrés dans l'état. | `[x]` |
| `MT-1.1.2.2` | Intégration du composant d'identité avec coche de vérification | `@agent-ui` | `public/js/components/CampusHeader.js` | Nom, filière N7 et pastille certifiée affichés nettement dans l'en-tête. | `[x]` |
| `MT-1.1.2.3` | Conception du widget solde cagnotte & garanties | `@agent-ui` | `public/js/components/CampusHeader.js` | Solde affiché en euros (`24,00 €`) + mention `0 litige (100%)`. | `[x]` |

### Tâche 1.3 : Bottom Navigation Bar Tactile (Au pouce)
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-1.1.3.1` | Définition de la structure de données des 4 onglets | `@agent-arch` | `public/js/components/BottomNav.js` | Tableau des 4 onglets : Explorer, Mes Objets, Locations (7j/7), Compte. | `[x]` |
| `MT-1.1.3.2` | Conteneur `nav` fixe en bas avec effet de flou (*backdrop-blur*) | `@agent-ui` | `public/js/components/BottomNav.js` | Barre fixée en bas, contenu scrollable passant sous la barre sans collision. | `[x]` |
| `MT-1.1.3.3` | Dimensionnement tactile ergonomique Apple/Android (min 44x44px) | `@agent-ui` | `public/js/components/BottomNav.js` | Chaque zone cliquable au pouce mesure au moins 44px de hauteur. | `[x]` |
| `MT-1.1.3.4` | États visuels actif vs inactif (vert sauge vs gris doux) | `@agent-ui` | `public/js/components/BottomNav.js` | L'onglet actif passe en `#52796F` avec texte en gras, inactif en `#8C8275`. | `[x]` |
| `MT-1.1.3.5` | Routage d'état `currentTab` avec bascule sous les 16ms (60fps) | `@agent-arch` | `public/js/app.js` | Clic sur un onglet actualise la vue sans rechargement de page. | `[x]` |
| `MT-1.1.3.6` | Création des 4 vues-écrans correspondantes | `@agent-arch` | `public/js/views/` | Chaque onglet affiche un conteneur d'écran propre et indépendant. | `[x]` |

---

## 🟢 PHASE 2 : CHANTIER A — MOTEUR EMPRUNTEUR (100% VALIDÉE - ALBAN)

### Tâche 2.1 : Feed d'Accueil & Matériel Disponible 7j/7
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-2.1.1.1` | Sélecteur dynamique de période (24h, Week-end, Semaine libre) | `@agent-renter` | `public/js/views/ExploreView.js` | Choix libre du créneau de location 7j/7 sans restriction. | `[x]` |
| `MT-2.1.1.2` | Composant de recherche textuelle temps réel | `@agent-renter` | `public/js/views/ExploreView.js` | Champ de recherche filtrant instantanément les objets tapés au clavier. | `[x]` |
| `MT-2.1.1.3` | Barre de pills de catégories à défilement horizontal doux | `@agent-ui` | `public/js/views/ExploreView.js` | Catégories : 🎉 Soirée, 🏔️ Montagne/Ski, 🔨 Bricolage, 🍳 Convivialité. | `[x]` |
| `MT-2.1.1.4` | Carte objet unitaire (Photo, titre, prix /jour & forfaits, caution) | `@agent-renter` | `public/js/views/ExploreView.js` | Carte tactile avec image nette, badge promo du propriétaire et tarifs. | `[x]` |
| `MT-2.1.1.5` | Grille réactive des objets disponibles 7j/7 | `@agent-renter` | `public/js/views/ExploreView.js` | Grille à 1 ou 2 colonnes adaptative avec disponibilité instantanée. | `[x]` |

### Tâche 2.2 : Fiche Objet 360° & Réservation
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-2.2.1.1` | Modale coulissante de fiche détail objet (*BottomSheet*) | `@agent-ui` | `public/js/views/ExploreView.js` | Modale tactile s'ouvrant depuis le bas de l'écran avec fermeture par croix. | `[x]` |
| `MT-2.2.1.2` | Fiche technique : état certifié, accessoires inclus, descriptif | `@agent-renter` | `public/js/views/ExploreView.js` | Données techniques complètes affichées sans ambiguïté. | `[x]` |
| `MT-2.2.1.3` | Sélecteur du lieu de retrait physique sur le campus | `@agent-renter` | `public/js/views/ExploreView.js` | Choix : Foyer N7, Cafétéria, ou Résidence étudiante R1/R2. | `[x]` |
| `MT-2.2.1.4` | Calculateur de coût total transparent (Tarif durée + Caution non débitée) | `@agent-trust` | `public/js/views/ExploreView.js` | Détail clair : montant payé vs montant de caution bloqué. | `[x]` |
| `MT-2.2.1.5` | Déclencheur d'action : bouton « Confirmer ma demande de réservation » | `@agent-renter` | `public/js/views/ExploreView.js` | Clic enregistre la demande sur la période choisie (24h, WE, etc.). | `[x]` |

---

## ⚪ PHASE 3 : CHANTIER B — MOTEUR PROPRIÉTAIRE (EN ATTENTE DE MATHYS)

### Tâche 3.1 : Ajout d'Objet Mobile Express (< 60 secondes)
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-3.1.1.1` | Déclencheur caméra smartphone via input HTML natif | `@agent-owner` | `public/js/views/ItemsView.js` | `<input type="file" accept="image/*" capture>` ouvrant l'appareil photo. | `[ ]` |
| `MT-3.1.1.2` | Prévisualisation instantanée de la photo prise | `@agent-ui` | `public/js/views/ItemsView.js` | Image affichée en miniature dans le formulaire avec bouton de suppression. | `[ ]` |
| `MT-3.1.1.3` | Formulaire compact à 3 champs (Titre, Catégorie, Valeur d'achat) | `@agent-owner` | `public/js/views/ItemsView.js` | Saisie ultra-rapide sans surcharge textuelle. | `[ ]` |
| `MT-3.1.1.4` | Algorithme de tarification suggérée (10-15% valeur neuf) | `@agent-arch` | `public/js/views/ItemsView.js` | Remplissage automatique du prix week-end et de la caution recommandée. | `[ ]` |
| `MT-3.1.1.5` | Bouton de publication immédiate dans l'inventaire | `@agent-owner` | `public/js/views/ItemsView.js` | Ajout immédiat de l'objet dans la liste du campus avec statut « Disponible ». | `[ ]` |

### Tâche 3.2 : Tableau de Bord Propriétaire & Demandes Entrantes
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-3.2.1.1` | Liste des objets personnels avec pastille de statut | `@agent-owner` | `public/js/views/ItemsView.js` | Objets affichés avec statut vert (Dispo) ou orange (Demandé). | `[ ]` |
| `MT-3.2.1.2` | Carte de demande entrante d'un camarade de promo | `@agent-owner` | `public/js/views/ItemsView.js` | Affichage du prénom, promo et créneau de retrait demandé. | `[ ]` |
| `MT-3.2.1.3` | Bouton d'acceptation de la demande en 1 clic | `@agent-owner` | `public/js/views/ItemsView.js` | Clic valide la réservation et passe l'objet en « Réservé (dates confirmées) ». | `[ ]` |
| `MT-3.2.1.4` | Bouton de refus poli avec libération immédiate | `@agent-owner` | `public/js/views/ItemsView.js` | Clic décline la demande sans bloquer l'objet pour d'autres étudiants. | `[ ]` |
| `MT-3.2.1.5` | Compteur d'euros générés par le matériel | `@agent-trust` | `public/js/views/ItemsView.js` | Total cumulé des gains ajoutés au solde cagnotte du propriétaire. | `[ ]` |

---

## ⚪ PHASE 4 : CONFIANCE, CAUTIONS & SÉCURITÉ ANTI-CASSE

### Tâche 4.1 : Passation & État des Lieux Numérique
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-4.1.1.1` | Écran de Check-in au départ de la location (Remise en main propre) | `@agent-trust` | `public/index.html` | Photo de départ prise pour figer l'état initial de l'objet le jour J. | `[ ]` |
| `MT-4.1.1.2` | Signature numérique conjointe de remise de matériel | `@agent-trust` | `public/index.html` | Validation bilatérale du prêt entre l'emprunteur et le propriétaire. | `[ ]` |
| `MT-4.1.1.3` | Écran de Check-out au retour de la location (Restitution) | `@agent-trust` | `public/index.html` | Photo de retour comparée à celle du départ à l'heure convenue. | `[ ]` |
| `MT-4.1.1.4` | Déblocage automatique de l'empreinte de caution | `@agent-trust` | `public/index.html` | Confirmation de bon état libérant instantanément la caution. | `[ ]` |
| `MT-4.1.1.5` | Système de notation mutuelle (1 à 5 étoiles) | `@agent-trust` | `public/index.html` | Attribution d'une note renforçant la réputation étudiante du camarade. | `[ ]` |
| `MT-4.1.1.6` | Procédure de litige simplifiée en cas de casse | `@agent-trust` | `public/index.html` | Signalement avec photo et médiation BDE/plateforme. | `[ ]` |
| `MT-4.1.1.7` | Contrat de prêt PDF/Texte instantané généré | `@agent-trust` | `public/index.html` | Récapitulatif contractuel opposable généré automatiquement. | `[ ]` |
| `MT-4.1.1.8` | Filtrage de domaine e-mail institutionnel (`@enseeiht.fr`) | `@agent-trust` | `public/index.html` | Blocage strict de toute adresse hors campus. | `[ ]` |
