# 📑 Spécifications Fonctionnelles & Techniques — CampuShare PWA

Ce document est la **Single Source of Truth (SSOT)** des spécifications du produit CampuShare. Il est maintenu par l'équipe exécutive agentique sous le contrôle des Directeurs Alban et Mathys.

---

## 🎯 1. Vision Produit
CampuShare est la Progressive Web App (PWA) fermée aux élèves de Toulouse INP - ENSEEIHT permettant de louer et d'emprunter du matériel 7 jours sur 7 en totale flexibilité (location ponctuelle 24h en semaine, forfait week-end, semaine de vacances ou multi-jours) entre pairs, avec garantie par caution et remise physique en main propre sur le campus.

---

## 📱 2. Spécifications Ergonomiques & UX PWA
* **Viewport cible :** Mobile-First (390px à 430px de largeur de référence).
* **Modes de visualisation :**
  1. *Mode Simulateur Studio (sur ordinateur) :* Permet aux Directeurs de basculer entre iPhone 15 Pro (390px), Pixel 8 (412px) et Mode Plein Écran, avec indicateur de safe areas.
  2. *Mode Natif Mobile (sur smartphone) :* Plein écran sans bordures, support des encoches (`env(safe-area-inset)`), chargement instantané sans barre d'adresse de navigateur.
* **Palette Graphique :**
  * Fond principal : Sable / Crème doux `#FAF8F5`
  * Cartes & Conteneurs : Blanc pur `#FFFFFF` avec bordure fine `#EAE2D5`
  * Accent Primaire : Vert sauge `#52796F` (hover `#43665D`)
  * Accent Secondaire : Terracotta chaleureux `#D87D4A`
  * Typographie : *Plus Jakarta Sans* (titres et navigation), *Inter* (corps de texte).

---

## 📦 3. Modèle de Données Unitaire (Objet de Location)
```json
{
  "id": "item-raclette-tefal",
  "title": "Appareil à Raclette 8 personnes Tefal",
  "category": "party", // 'party' | 'outdoor' | 'diy' | 'tech'
  "categoryLabel": "Soirée & Convivialité",
  "categoryIcon": "🎉",
  "pricing": {
    "perDay": 6.00, // Tarif par tranche de 24h (location en semaine)
    "weekendPackage": 12.00, // Forfait avantageux Ven 17h -> Dim 20h
    "weeklyPackage": 25.00 // Forfait semaine complète (7 jours)
  },
  "depositAmount": 40.00, // Montant de la caution bloquée (sans débit)
  "minDuration": "24h", // Durée minimale
  "owner": {
    "name": "Mathys D.",
    "school": "Toulouse INP • ENSEEIHT",
    "promo": "2A 3EA",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    "rating": 5.0,
    "verified": true
  },
  "pickupLocation": "Foyer N7 / Résidence R1",
  "status": "available", // 'available' | 'rented' | 'reserved'
  "condition": "Comme neuf (testé et nettoyé)",
  "includedAccessories": ["8 poêlons", "8 spatules bois"]
}
```

---

## 🛡️ 4. Règles de Gestion & Confiance
1. **Accès réservé :** Authentification obligatoire via courriel étudiant institutionnel.
2. **Durée flexible 7j/7 :** Possibilité de louer 24h en semaine, un forfait week-end de 48h/72h ou plusieurs jours consécutifs.
3. **Caution sécurisée :** Empreinte bancaire de pré-autorisation (non encaissée), levée automatiquement à la fin de la période dès confirmation de la restitution en bon état.
4. **Paiement direct :** Versement de la part de location au propriétaire, moins une micro-commission plateforme pour couvrir les frais de fonctionnement.
