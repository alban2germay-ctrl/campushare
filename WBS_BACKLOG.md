# 📋 WBS (Work Breakdown Structure) — Développement de la PWA CampuShare

Ce document est l'arbre hiérarchique officiel du développement de l'application **PWA CampuShare**.
Chaque tâche est atomique, progressive et conçue pour un apprentissage complet d'Alban et Mathys.

**Légende des statuts :**
* ⚪ `[À FAIRE]` : En attente
* 🟡 `[EN COURS]` : Micro-tâche active en développement
* 🟢 `[VALIDÉ]` : Testé et validé par Alban & Mathys

---

## 🟢 PHASE 1 : Socle Technique PWA & Coquille Mobile-First
*Objectif : Mettre en place un conteneur smartphone ultra-fluide avec une navigation au pouce et le support PWA.*
*Agent responsable :* `@agent-architect` & `@agent-ui-design`

### Tâche 1.1 : La Coquille d'Application Smartphone (Mobile Shell)
* 🟢 **Micro-tâche 1.1.1** : *Conteneur Mobile & Safe Areas* — Structure viewport smartphone (largeur 390px-430px sur PC, 100% responsive sur mobile, encoches iOS/Android et palette pastel).
* 🟢 **Micro-tâche 1.1.2** : *Header Mobile Campus & Solde Cagnotte* — Bandeau supérieur avec badge Toulouse INP - ENSEEIHT, avatar étudiant certifié et compteur de cagnotte campus.
* 🟡 **Micro-tâche 1.1.3** : *Bottom Navigation Bar Tactile (4 onglets au pouce)* — Barre de navigation inférieure fixe au pouce avec 4 onglets tactiles (Explorer, Mes Objets, Week-end, Compte).

### Tâche 1.2 : Configuration Native PWA (Installation Smartphone)
* ⚪ **Micro-tâche 1.2.1** : *Manifest PWA* — Créer `manifest.json` avec affichage plein écran (`display: standalone`), couleurs de thème crème/vert sauge et icônes d'application.
* ⚪ **Micro-tâche 1.2.2** : *Service Worker & Cache Offline* — Configurer le Service Worker pour le chargement instantané sans temps de latence réseau.

---

## ⚪ PHASE 2 : Chantier A — Le Moteur Emprunteur & Découverte (Feed & Fiche)
*Objectif : Permettre à un étudiant de trouver et réserver un objet pour le week-end en moins de 3 clics.*
*Agent responsable :* `@agent-renter` & `@agent-ui-design`

### Tâche 2.1 : L'Écran d'Accueil & Filtres Catégories
* ⚪ **Micro-tâche 2.1.1** : *Bannière Week-end Dynamique* — Affichage du compte à rebours avant le prochain week-end (ex: *« Prochain départ : Vendredi 17h au foyer »*).
* ⚪ **Micro-tâche 2.1.2** : *Pills de Catégories Tactiles* — Sélecteur horizontal à défilement doux (🎉 Soirée, 🏔️ Montagne/Ski, 🔨 Bricolage, 🍳 Cuisine/Raclette, 💻 Tech/Projo).
* ⚪ **Micro-tâche 2.1.3** : *Carte Objet Tactile* — Composant de carte avec photo nette, titre, badge catégorie, prix forfait week-end (ex: 12€), montant de caution rassurant et badge promo du propriétaire.

### Tâche 2.2 : La Fiche Produit 360° & Réservation Week-end
* ⚪ **Micro-tâche 2.2.1** : *Fiche Détail Matériel* — Caractéristiques de l'objet, accessoires inclus, état d'usure certifié et avis des camarades de promo.
* ⚪ **Micro-tâche 2.2.2** : *Sélecteur de Retrait Physique* — Choix du lieu de rendez-vous sur le campus (Foyer N7, Cafétéria, Résidence étudiante).
* ⚪ **Micro-tâche 2.2.3** : *Modale de Confirmation & Caution* — Récapitulatif transparent du prix de location et de l'empreinte de caution non débitée.

---

## ⚪ PHASE 3 : Chantier B — Le Moteur Propriétaire & Prise de Vue (Mise en Location)
*Objectif : Permettre à un propriétaire de photographier et lister son objet en moins de 60 secondes.*
*Agent responsable :* `@agent-owner` & `@agent-trust`

### Tâche 3.1 : Formulaire d'Ajout d'Objet Mobile Express
* ⚪ **Micro-tâche 3.1.1** : *Déclencheur Caméra Smartphone* — Bouton d'upload direct ouvrant l'appareil photo du téléphone avec prévisualisation immédiate.
* ⚪ **Micro-tâche 3.1.2** : *Formulaire Épuré à 3 Champs* — Titre de l'objet, catégorie et valeur d'achat estimée.
* ⚪ **Micro-tâche 3.1.3** : *Calculateur Tarifaire Intelligent* — Suggestion automatique du prix week-end recommandé (10-15% du prix neuf) et de la caution adéquate.

### Tâche 3.2 : Tableau de Bord Propriétaire & Gestion des Demandes
* ⚪ **Micro-tâche 3.2.1** : *Gestionnaire d'Inventaire Personnel* — Liste des objets du propriétaire avec statut (Disponible / En location / Indisponible).
* ⚪ **Micro-tâche 3.2.2** : *Centre de Validation des Demandes* — Carte de demande entrante d'un camarade avec options tactiles *Accepter* / *Décliner*.

---

## ⚪ PHASE 4 : Le Module de Confiance & Check-in / Check-out (Anti-Casse)
*Objectif : Supprimer la peur de la casse grâce à l'état des lieux numérique simplifié.*
*Agent responsable :* `@agent-trust` & `@agent-architect`

### Tâche 4.1 : Passation Numérique de Début et Fin de Prêt
* ⚪ **Micro-tâche 4.1.1** : *Check-in du Vendredi* — Double photo de l'objet remis au départ pour figer son état initial.
* ⚪ **Micro-tâche 4.1.2** : *Check-out du Dimanche* — Confirmation de restitution en bon état et déblocage instantané de l'empreinte de caution.
