# 🟩 Espace de Travail — Mathys

Bienvenue Mathys ! Cet espace est ton tableau de bord personnel de co-directeur (2A 3EA).
Tu peux l'éditer directement dans ton navigateur sur GitHub (en appuyant sur la touche `.` sur la page du dépôt) ou via ton éditeur local sous Windows.
Dès que tu écris quelque chose ici et que tu sauvegardes, l'agent IA (Antigravity) le lit et le prend en compte.

---

## 🎯 Ton Chantier de Code Prioritaire : Chantier B (Moteur Propriétaire & Matos Express)

### 📂 Ton Fichier Dédié (Zéro Conflit Git avec Alban) :
👉 `public/js/views/ItemsView.js`

Tu peux coder dans ce fichier en toute indépendance ! Alban travaille dans son fichier `ExploreView.js`, donc vous ne vous marcherez jamais sur les pieds.

### 📋 Tes Tâches Unitaires Actives (Phase 3 du BOARD.md) :
1. **`MT-3.1.1.1`** : Déclencheur photo smartphone via `<input type="file" accept="image/*" capture>` pour photographier son matériel.
2. **`MT-3.1.1.2`** : Prévisualisation instantanée de la photo prise avant publication.
3. **`MT-3.1.1.3`** : Formulaire compact en 3 champs : Nom de l'objet, Catégorie, Prix conseillé (ex: 6€/j, 12€/we).
4. **`MT-3.2.1.2`** : Carte de notification quand un camarade demande ton objet en prêt.

---

## 🚀 Comment Sauvegarder Simplement sous Windows :

### Option 1 (Le plus simple, dans Chrome) :
1. Va sur `https://github.com/alban2germay-ctrl/campushare`
2. Appuie sur la touche **`.`** (le point) de ton clavier.
3. Modifie `public/js/views/ItemsView.js`
4. Clique sur "Source Control" à gauche et "Commit & Push".

### Option 2 (Via le terminal Git Bash) :
```bash
./collab.sh pull                               # Récupérer les nouveautés d'Alban
# ... fais tes modifs ...
./collab.sh save "feat: amélioration ItemsView"  # Sauvegarder et faire sonner Discord
```

---

## 🆕 Ce qui a changé dans `ItemsView.js` (12 octobre 2026, à la demande d'Alban)
Ton écran est maintenant branché sur les vraies données, plus rien n'est simulé :
* **Demandes reçues** = les vraies demandes faites dans Explorer sur tes objets. « Accepter » donne son QR à l'emprunteur, « Décliner » le prévient.
* **Mes Objets** = les objets dont tu es propriétaire (celui ou celle connecté·e), avec leur statut réel : Disponible / Demande reçue / Réservé / Chez Thomas…, et un bouton **Retirer**.
* **Gains** = encaissés quand l'objet est rendu (ta cagnotte est créditée), plus le montant « à venir ».
* **Déposer** : nouveau champ « Accessoires inclus » (ils deviennent la checklist du retrait), photo réduite automatiquement à 600 px.
* Les règles du prêt sont dans `public/js/data/actions.js` (fichier commun) : regarde-le pour comprendre le circuit complet.
* Pour tester : sur ordi, utilise le sélecteur **Profil : Alban / Mathys** en haut, et **↺ Reset démo** pour repartir de zéro.
* Détails et justification : session n°9 de `DELIBERATIONS_AGENTS.md`.

---

## 💡 Tes Notes & Suggestions Libres
* [Écris ici tout ce qui te passe par la tête : retours d'élèves de l'N7, idées de matos à prêter, etc.]
