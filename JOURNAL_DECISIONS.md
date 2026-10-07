# 📓 Journal des Décisions & Mémoire Partagée — CampuShare

Ce document consigne l'historique de toutes les décisions scientifiques, arbitrages de gouvernance et enseignements validés. C'est la mémoire centrale du projet.

---

### 📅 Session du 07 Octobre 2026 (17h25)

#### 1. Décision d'Architecture Produit : La PWA Mobile-First
* **Arbitrage validé par Alban & Mathys :** Développement sous forme de **Progressive Web App (PWA)** pensée exclusivement pour l'ergonomie smartphone.
* **Justification scientifique & UX :**
  1. Zéro barrière de téléchargement : accessible instantanément via un simple QR code sur les affiches du campus ou lien partagé sans passer par les contraintes d'Apple ($99) ou Google Play (14 jours de tests).
  2. Installation sur l'écran d'accueil en un clic avec icône native et affichage plein écran (`display: standalone`).
  3. Accès direct à l'appareil photo du téléphone pour permettre la prise de vue des objets en moins de 10 secondes.
  4. Ergonomie 100% pensée au pouce (Bottom Navigation Bar, gestes tactiles, modales coulissantes).

#### 2. Mise en Place de la Brigade des Agents Spécialisés
Pour garantir un développement sans bug, découpé en micro-tâches rigoureuses, 5 rôles d'agents ont été créés et formalisés dans `AGENTS.md` :
* `@agent-architect` : Architecture PWA, routing mobile, manifest et offline.
* `@agent-ui-design` : Design system pastel, composants tactiles, safe areas.
* `@agent-renter` : Parcours Emprunteur (Découverte, filtres, fiche 360°, réservation week-end).
* `@agent-owner` : Parcours Propriétaire (Upload photo caméra, suggestion prix, gestion demandes).
* `@agent-trust` : Module de confiance (Caution sans débit, vérification email étudiant, check-in/out).

#### 3. Découpage WBS du Produit
* L'arbre hiérarchique a été entièrement restructuré dans `WBS_BACKLOG.md` pour concevoir l'outil pas à pas.
* **Micro-tâche active immédiate :** Micro-tâche 1.1.1 — La Coquille Smartphone & Safe Areas.
