# 📑 Spécifications Fonctionnelles & Techniques — CampuShare PWA

Ce document est la **Single Source of Truth (SSOT)** des spécifications du produit CampuShare. Il est maintenu par l'équipe exécutive agentique sous le contrôle des Directeurs Alban et Mathys.

---

## 🎯 1. Vision Produit
CampuShare est la Progressive Web App (PWA) fermée aux élèves de Toulouse INP - ENSEEIHT permettant de louer et d'emprunter du matériel de week-end (Soirée, Montagne/Outdoor, Bricolage) entre pairs, avec garantie par caution et remise physique en main propre sur le campus.

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
  "weekendPrice": 12, // Prix du forfait Ven 17h -> Dim 20h
  "depositAmount": 40, // Montant de la caution bloquée (sans débit)
  "owner": {
    "name": "Mathys D.",
    "school": "Toulouse INP - ENSEEIHT",
    "promo": "2A 3EA",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    "rating": 5.0,
    "verified": true
  },
  "pickupLocation": "Foyer N7 / Résidence R1",
  "images": [
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  ],
  "status": "available", // 'available' | 'rented' | 'reserved'
  "condition": "Comme neuf (testé et nettoyé)",
  "includedAccessories": ["8 poêlons", "8 spatules bois"]
}
```

---

## 🛡️ 4. Règles de Gestion & Confiance
1. **Accès réservé :** Authentification obligatoire via courriel étudiant institutionnel.
2. **Caution sécurisée :** Empreinte bancaire de pré-autorisation (non encaissée), levée automatiquement le dimanche soir dès confirmation de la restitution en bon état.
3. **Paiement direct :** Versement de la part de location au propriétaire, moins une micro-commission plateforme pour couvrir les frais de fonctionnement.
