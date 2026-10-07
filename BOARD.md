# 📋 Matrice Opérationnelle des Micro-Tâches — CampuShare

Ce document est le **Registre d'Ingénierie & Tableau de Suivi Officiel**. 
Il applique une décomposition cartésienne au niveau unitaire (nano-tâches). Aucune tâche ne dépasse 1 action technique précise, vérifiable par un critère binaire d'acceptation (*Definition of Done*).

---

## 📊 VUE D'ENSEMBLE DE L'AVANCEMENT

| Phase | Intitulé | Total Micro-Tâches | Terminées | En Cours | Progression |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **P1** | Socle Technique PWA & Navigation Mobile | 12 | 6 | 1 | **50 %** |
| **P2** | Chantier A : Moteur Emprunteur (Découverte) | 10 | 0 | 0 | **0 %** |
| **P3** | Chantier B : Moteur Propriétaire (Matériel) | 10 | 0 | 0 | **0 %** |
| **P4** | Module Confiance, Cautions & Sécurité | 8 | 0 | 0 | **0 %** |
| **TOTAL** | **Architecture Globale CampuShare** | **40** | **6** | **1** | **17.5 %** |

---

## 🟢 PHASE 1 : SOCLE TECHNIQUE PWA & NAVIGATION MOBILE

### Tâche 1.1 : Structure Viewport & Ergonomie Smartphone
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-1.1.1.1` | Configuration des balises meta viewport & safe-areas | `@agent-arch` | `public/index.html` | Balise `viewport-fit=cover` présente, aucun zoom tactile indésirable. | `[x]` |
| `MT-1.1.1.2` | Structure conteneur mobile 390px centré sur PC | `@agent-ui` | `public/index.html` | Largeur limitée à 390px sur bureau, 100% largeur fluide sur smartphone. | `[x]` |
| `MT-1.1.1.3` | Conception du sélecteur de banc d'essai (iPhone / Pixel / Plein écran) | `@agent-arch` | `public/index.html` | 3 boutons fonctionnels basculant la largeur en direct sans recharger la page. | `[x]` |

### Tâche 1.2 : Header Campus & Profils Étudiants
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-1.1.2.1` | Modélisation des profils certifiés d'Alban et Mathys | `@agent-trust` | `public/index.html` | Données promo (SN / 3EA) et avatars distincts enregistrés dans l'état. | `[x]` |
| `MT-1.1.2.2` | Intégration du composant d'identité avec coche de vérification | `@agent-ui` | `public/index.html` | Nom, filière N7 et pastille certifiée affichés nettement dans l'en-tête. | `[x]` |
| `MT-1.1.2.3` | Conception du widget solde cagnotte & garanties | `@agent-ui` | `public/index.html` | Solde affiché en euros (`24,00 €`) + mention `0 litige (100%)`. | `[x]` |

### Tâche 1.3 : Bottom Navigation Bar Tactile (Au pouce)
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-1.1.3.1` | Définition de la structure de données des 4 onglets | `@agent-arch` | `public/index.html` | Tableau des 4 onglets : Explorer, Mes Objets, Week-end, Compte. | `[-]` |
| `MT-1.1.3.2` | Conteneur `nav` fixe en bas avec effet de flou (*backdrop-blur*) | `@agent-ui` | `public/index.html` | Barre fixée en bas, contenu scrollable passant sous la barre sans collision. | `[ ]` |
| `MT-1.1.3.3` | Dimensionnement tactile ergonomique Apple/Android (min 44x44px) | `@agent-ui` | `public/index.html` | Chaque zone cliquable au pouce mesure au moins 44px de hauteur. | `[ ]` |
| `MT-1.1.3.4` | États visuels actif vs inactif (vert sauge vs gris doux) | `@agent-ui` | `public/index.html` | L'onglet actif passe en `#52796F` avec texte en gras, inactif en `#8C8275`. | `[ ]` |
| `MT-1.1.3.5` | Routage d'état `currentTab` avec bascule sous les 16ms (60fps) | `@agent-arch` | `public/index.html` | Clic sur un onglet actualise la vue sans rechargement de page. | `[ ]` |
| `MT-1.1.3.6` | Création des 4 vues-écrans correspondantes | `@agent-arch` | `public/index.html` | Chaque onglet affiche un conteneur d'écran propre et indépendant. | `[ ]` |

---

## ⚪ PHASE 2 : CHANTIER A — MOTEUR EMPRUNTEUR (RECHERCHE & DÉCOUVERTE)

### Tâche 2.1 : Feed d'Accueil & Matériel du Week-end
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-2.1.1.1` | Bannière dynamique de rappel du week-end | `@agent-renter` | `public/index.html` | Créneau `Ven 17h -> Dim 20h` affiché en surbrillance. | `[ ]` |
| `MT-2.1.1.2` | Composant de recherche textuelle temps réel | `@agent-renter` | `public/index.html` | Champ de recherche filtrant instantanément les objets tapés au clavier. | `[ ]` |
| `MT-2.1.1.3` | Barre de pills de catégories à défilement horizontal doux | `@agent-ui` | `public/index.html` | Catégories : 🎉 Soirée, 🏔️ Montagne/Ski, 🔨 Bricolage, 🍳 Convivialité. | `[ ]` |
| `MT-2.1.1.4` | Carte objet unitaire (Photo, titre, prix week-end, caution) | `@agent-renter` | `public/index.html` | Carte tactile avec image nette, badge promo du propriétaire et prix. | `[ ]` |
| `MT-2.1.1.5` | Grille réactive des objets disponibles pour le week-end | `@agent-renter` | `public/index.html` | Grille à 1 ou 2 colonnes adaptative avec espacement tactile fluide. | `[ ]` |

### Tâche 2.2 : Fiche Objet 360° & Réservation
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-2.2.1.1` | Modale coulissante de fiche détail objet (*BottomSheet*) | `@agent-ui` | `public/index.html` | Modale tactile s'ouvrant depuis le bas de l'écran avec fermeture par croix. | `[ ]` |
| `MT-2.2.1.2` | Fiche technique : état certifié, accessoires inclus, descriptif | `@agent-renter` | `public/index.html` | Données techniques complètes affichées sans ambiguïté. | `[ ]` |
| `MT-2.2.1.3` | Sélecteur du lieu de retrait physique sur le campus | `@agent-renter` | `public/index.html` | Choix : Foyer N7, Cafétéria, ou Résidence étudiante R1/R2. | `[ ]` |
| `MT-2.2.1.4` | Calculateur de coût total transparent (Forfait + Caution non débitée) | `@agent-trust` | `public/index.html` | Détail clair : montant payé vs montant de caution bloqué. | `[ ]` |
| `MT-2.2.1.5` | Déclencheur d'action : bouton « Demander pour ce week-end » | `@agent-renter` | `public/index.html` | Clic enregistre la demande dans la liste des réservations en attente. | `[ ]` |

---

## ⚪ PHASE 3 : CHANTIER B — MOTEUR PROPRIÉTAIRE (MISE EN LOCATION & MATOS)

### Tâche 3.1 : Ajout d'Objet Mobile Express (< 60 secondes)
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-3.1.1.1` | Déclencheur caméra smartphone via input HTML natif | `@agent-owner` | `public/index.html` | `<input type="file" accept="image/*" capture>` ouvrant l'appareil photo. | `[ ]` |
| `MT-3.1.1.2` | Prévisualisation instantanée de la photo prise | `@agent-ui` | `public/index.html` | Image affichée en miniature dans le formulaire avec bouton de suppression. | `[ ]` |
| `MT-3.1.1.3` | Formulaire compact à 3 champs (Titre, Catégorie, Valeur d'achat) | `@agent-owner` | `public/index.html` | Saisie ultra-rapide sans surcharge textuelle. | `[ ]` |
| `MT-3.1.1.4` | Algorithme de tarification suggérée (10-15% valeur neuf) | `@agent-arch` | `public/index.html` | Remplissage automatique du prix week-end et de la caution recommandée. | `[ ]` |
| `MT-3.1.1.5` | Bouton de publication immédiate dans l'inventaire | `@agent-owner` | `public/index.html` | Ajout immédiat de l'objet dans la liste du campus avec statut « Disponible ». | `[ ]` |

### Tâche 3.2 : Tableau de Bord Propriétaire & Demandes Entrantes
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-3.2.1.1` | Liste des objets personnels avec pastille de statut | `@agent-owner` | `public/index.html` | Objets affichés avec statut vert (Dispo) ou orange (Demandé). | `[ ]` |
| `MT-3.2.1.2` | Carte de demande entrante d'un camarade de promo | `@agent-owner` | `public/index.html` | Affichage du prénom, promo et créneau de retrait demandé. | `[ ]` |
| `MT-3.2.1.3` | Bouton d'acceptation de la demande en 1 clic | `@agent-owner` | `public/index.html` | Clic valide la réservation et passe l'objet en « Réservé pour ce week-end ». | `[ ]` |
| `MT-3.2.1.4` | Bouton de refus poli avec libération immédiate | `@agent-owner` | `public/index.html` | Clic décline la demande sans bloquer l'objet pour d'autres étudiants. | `[ ]` |
| `MT-3.2.1.5` | Compteur d'euros générés par le matériel | `@agent-trust` | `public/index.html` | Total cumulé des gains ajoutés au solde cagnotte du propriétaire. | `[ ]` |

---

## ⚪ PHASE 4 : CONFIANCE, CAUTIONS & SÉCURITÉ ANTI-CASSE

### Tâche 4.1 : Passation & État des Lieux Numérique
| ID | Micro-Tâche Unitaire | Responsable | Fichier Impacté | Critère d'Acceptation Binaire (DoD) | Statut |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `MT-4.1.1.1` | Écran de Check-in du Vendredi soir (Départ) | `@agent-trust` | `public/index.html` | Photo de départ prise pour figer l'état initial de l'objet. | `[ ]` |
| `MT-4.1.1.2` | Signature numérique conjointe de remise de matériel | `@agent-trust` | `public/index.html` | Validation bilatérale du prêt entre l'emprunteur et le propriétaire. | `[ ]` |
| `MT-4.1.1.3` | Écran de Check-out du Dimanche soir (Restitution) | `@agent-trust` | `public/index.html` | Photo de retour comparée à celle du départ. | `[ ]` |
| `MT-4.1.1.4` | Déblocage automatique de l'empreinte de caution | `@agent-trust` | `public/index.html` | Confirmation de bon état libérant instantanément la caution. | `[ ]` |
| `MT-4.1.1.5` | Système de notation mutuelle (1 à 5 étoiles) | `@agent-trust` | `public/index.html` | Attribution d'une note renforçant la réputation étudiante du camarade. | `[ ]` |
| `MT-4.1.1.6` | Procédure de litige simplifiée en cas de casse | `@agent-trust` | `public/index.html` | Signalement avec photo et médiation BDE/plateforme. | `[ ]` |
| `MT-4.1.1.7` | Contrat de prêt PDF/Texte instantané généré | `@agent-trust` | `public/index.html` | Récapitulatif contractuel opposable généré automatiquement. | `[ ]` |
| `MT-4.1.1.8` | Filtrage de domaine e-mail institutionnel (`@enseeiht.fr`) | `@agent-trust` | `public/index.html` | Blocage strict de toute adresse hors campus. | `[ ]` |
