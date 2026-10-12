# 🗣️ Registre des Délibérations Inter-Agents — CampuShare

Ce journal consigne les discussions et arbitrages collégiaux entre les directeurs de département de notre équipe agentique avant soumission des choix stratégiques au Conseil de Direction (Alban & Mathys).

---

### 🎙️ Session n°1 — Délibération sur la Micro-tâche 1.1.2 & l'Utilité du Simulateur Téléphone

#### Participants :
* 🎩 **CEO Orchestrateur IA** (Médiateur)
* 📐 **@agent-architect** (CTO PWA)
* 🎨 **@agent-ui-design** (CPO Design Mobile)
* 🛡️ **@agent-trust** (Chief Trust & Security)

#### 1. Débat sur le Simulateur Téléphone (Question du Directeur Alban) :
* **Question d'Alban :** *« Est-ce que c'est vraiment utile de simuler le téléphone sur grand écran ? Là, c'est juste une image... »*
* **@agent-ui-design :** *« C'est une excellente remarque ergonomique. Si on étire une interface mobile sur un écran d'ordinateur de 1920px, les boutons deviennent géants, le texte se perd, et les Directeurs ne peuvent pas évaluer la vraie prise en main au pouce. »*
* **@agent-architect :** *« Exactement, mais Alban a raison : une simple image statique n'apporte pas assez de valeur. Je propose d'ajouter une barre d'outils studio au-dessus qui permet de basculer en un clic entre :*
  1. *Vue iPhone 15 Pro (390px)*
  2. *Vue Android Pixel 8 (412px)*
  3. *Vue Plein Écran (pour tester sans contrainte).*
  *Comme ça, le simulateur devient un vrai banc d'essai interactif pour Alban et Mathys ! »*
* **CEO IA :** *« Proposition adoptée à l'unanimité. »*

#### 2. Débat sur la Micro-tâche 1.1.2 (Header Campus & Solde Cagnotte) :
* **@agent-trust :** *« Pour maximiser le sentiment de sécurité et de fierté d'école, le header mobile doit afficher clairement le badge promo certifié (ex: 'Alban D. • 2A SN' et 'Mathys D. • 2A 3EA'). »*
* **@agent-ui-design :** *« Et ajoutons le widget de cagnotte étudiante : afficher le solde d'argent gagné grâce aux prêts (ex: 24,00 €) ainsi que le statut de garantie (0 caution débitée). Ça rend l'app immédiatement vivante et gratifiante. »*
* **CEO IA :** *« Validé. Nous programmons ces éléments pour livraison immédiate au Conseil de Direction. »*

---

### 🎙️ Session n°2 — Directive Stratégique : Location Flexible 7j/7 Toute l'Année

#### Participants :
* 🎩 **CEO Orchestrateur IA** (Médiateur)
* 📐 **@agent-architect** (CTO PWA)
* 🎨 **@agent-ui-design** (CPO Design Mobile)
* 🎒 **@agent-renter** (Responsable Emprunteurs)
* 📦 **@agent-owner** (Responsable Propriétaires)
* 🛡️ **@agent-trust** (Chief Trust & Security)

#### 1. Directive du Directeur Alban :
* **Question d'Alban :** *« Mais on veut pouvoir louer des objets tout le temps, pas que la semaine si ? »*

#### 2. Délibération de l'équipe exécutive :
* **@agent-renter :** *« Alban a 100% raison. Bloquer les locations uniquement au week-end était une vision trop restrictive. Un étudiant à l'N7 a besoin d'une perceuse un mardi après-midi pour monter une étagère, ou d'un appareil à crêpes un mercredi soir pour une raclette entre potes de promo ! Le service doit être disponible 7 jours sur 7. »*
* **@agent-owner :** *« Côté propriétaires, c'est encore plus rentable : au lieu d'avoir leur matériel qui dort du lundi au vendredi, ils peuvent le rentabiliser toute la semaine avec un tarif journalier (ex: 5€ ou 6€/jour) et proposer des forfaits avantageux pour le week-end ou la semaine complète. »*
* **@agent-architect :** *« D'un point de vue architecture technique :*
  1. *L'onglet 3 de la barre de navigation est renommé en **'Locations'** (avec icône calendrier) au lieu de 'Week-end'.*
  2. *Le modèle de données supporte désormais un tarif par jour (`perDay`), un forfait week-end (`weekendPackage`), et un forfait semaine complète (`weeklyPackage`).*
  3. *Les 4 vues de la PWA (Explorer, Mes Objets, Locations, Compte) sont désormais dynamiques et opérationnelles.*
* **@agent-trust :** *« La caution reste sécurisée de la même manière : une simple empreinte bancaire non débitée pendant la durée de la location (24h, 48h ou 7 jours), levée automatiquement dès la restitution en main propre. »*
* **CEO IA :** *« Décision unanime. Les spécifications, le tableau de bord (BOARD.md), les issues GitHub et le code source de la PWA sont alignés immédiatement sur la directive d'Alban. »*

---

### 🎙️ Session n°3 — Directive Stratégique : Mandat d'Initiative, d'Amélioration & de Simplification « One-Thumb »

#### Participants :
* 🎩 **CEO Orchestrateur IA** (Médiateur)
* 📐 **@agent-architect** (CTO PWA)
* 🎨 **@agent-ui-design** (CPO Design Mobile)
* 🔍 **@agent-renter** (Responsable Emprunteurs)
* 📸 **@agent-owner** (Responsable Propriétaires)
* 🛡️ **@agent-trust** (Chief Trust & Security)

#### 1. Directive du Co-Directeur Alban :
* **Instruction d'Alban :** *« Si les agents ont envie de rajouter des spécifications utiles, qu'ils découvrent des fonctionnalités intéressantes (eBay, Vinted, Airbnb), ou au contraire qu'il faut simplifier, n'hésite pas à autoriser ça. Optimise le fichier AGENTS.md avec le périmètre des agents et un canal de contact. »*

#### 2. Délibération et Application Immédiate :
* **@agent-ui-design :** *« C'est exactement l'état d'esprit des meilleures équipes produit. Sur smartphone, l'ergonomie ne pardonne pas : avoir allégé le header, supprimé 3 blocs de texte redondants pour faire apparaître les objets au premier coup d'œil, et fixé le bouton de confirmation sous le pouce avec Sticky CTA a rendu l'expérience 10 fois plus fluide. »*
* **@agent-renter :** *« Et l'ajout de la modale de succès avec le bouton '👉 Voir mon Billet & QR Code' qui bascule automatiquement vers l'onglet Locations résout le sentiment de 'trou noir' post-réservation. »*
* **@agent-owner :** *« Côté Mathys (Chantier B), son agent aura le même mandat d'initiative pour concevoir l'ajout d'objet le plus rapide de l'histoire du campus : prise de photo en 1 clic et calcul de tarif automatique en moins de 60 secondes. »*
* **@agent-architect :** *« Les règles sont désormais gravées dans la charte suprême `AGENTS.md` : parité stricte, sanctuarisation de `ItemsView.js` pour Mathys, mandat d'initiative et canaux de contact officiels (Discord, GitHub, e-mails promo). »*
* **CEO IA :** *« Directive actée et déployée à 100%. »*

---

### 🎙️ Session n°4 — Directive Ergonomique : Épuration Radicale des Données & Fluidité Mobile

#### Participants :
* 🎩 **CEO Orchestrateur IA** (Médiateur)
* 📐 **@agent-architect** (CTO PWA)
* 🎨 **@agent-ui-design** (CPO Design Mobile)
* 🔍 **@agent-renter** (Responsable Emprunteurs)
* 🛡️ **@agent-trust** (Chief Trust & Security)

#### 1. Constat du Co-Directeur Alban :
* **Instruction d'Alban :** *« Il faut que tu laisses faire un peu, que ce soit plus fonctionnel. Peut-être découper plus en micro-tâches ou utiliser de bonnes méthodes de raisonnement. Je trouve qu'il y a trop de données, c'est pas assez fluide pour une application. »*

#### 2. Délibération et Arbitrage Opérationnel :
* **@agent-ui-design :** *« Alban a mis le doigt sur le défaut classique des prototypes universitaires : la surcharge administrative et textuelle. On avait 4 paragraphes de disjoncteurs légaux, des steppers géants à 4 ronds, et des cartes de 350px de hauteur ! L'utilisateur devait scroller pendant des kilomètres pour voir 2 objets. »*
* **@agent-renter :** *« Nous avons appliqué une règle d'or Vinted / Airbnb :
  1. Grille 2 colonnes dans Explorer : 4 à 6 objets visibles dès le premier regard sans scroller.
  2. Cartes de passation compactes dans Locations : hauteur divisée par 2,5, suppression des blocs de texte légaux redondants.
  3. Modale QR Code instantanée : affichage direct du QR SVG et du code PIN sans forcer à scroller dans une checklist de 10 éléments. »*
* **@agent-trust :** *« La réassurance (caution 0 € débité) est conservée, mais sous forme d'un badge élégant et discret au lieu d'un pavé juridique imposant. »*
* **CEO IA :** *« Résultat : -624 lignes de code superflu supprimées, application 100% fluide, santualisation de la partie de Mathys préservée. »*




---

### 🎙️ Session n°5 — Persistance des données & PWA hors ligne (12 octobre 2026)

#### 1. Constat :
* Aucune donnée n'était conservée : un simple rechargement effaçait réservations, objets ajoutés, cagnottes, demandes et gains.
* Le `manifest.json` existait, mais sans service worker : l'app n'était ni vraiment installable ni utilisable hors ligne (QR de retrait au Foyer sans réseau).

#### 2. Arbitrage :
* **@agent-architect :** nouvelle couche `public/js/data/store.js` (localStorage) qui restaure puis sauvegarde automatiquement `users`, `items`, `bookings` et `ownerDashboard`. Les vues continuent de lire/écrire `window.CS.data` comme avant.
* **@agent-architect :** `public/sw.js` — app en « réseau d'abord » (les modifs restent visibles immédiatement), CDN en « cache d'abord ». Bouton « ↺ Reset démo » ajouté à la StudioBar.
* **@agent-owner — ⚠️ intervention dans `ItemsView.js`, autorisée par Alban :** modification minimale, sans toucher à l'interface ni à la logique. Les demandes entrantes et le total des gains sont désormais recopiés dans `window.CS.data.ownerDashboard[currentUser]`, et relus au montage. Effet : ils survivent au rechargement **et** au changement d'onglet (auparavant ils revenaient à 38,50 € à chaque retour sur « Mes Objets »).
* **À valider par Mathys :** relire le diff de `ItemsView.js` (≈15 lignes, blocs commentés 💾).

---

### 🎙️ Session n°6 — Performance mobile, Discord & liens de la roadmap (12 octobre 2026)

#### 1. Constat :
* React était chargé en version *development* et Babel (~3 Mo) recompilait les ~3 100 lignes de JSX **à chaque ouverture** : démarrage lent sur smartphone.
* Le script `collab.sh` affichait « Le Discord a sonné » sans jamais envoyer de webhook.
* Les liens de `ROADMAP.md` (et `ESPACE_ALBAN.md`) pointaient vers l'ancien dossier `~/.gemini/antigravity/scratch/campushare`.

#### 2. Arbitrage :
* **@agent-architect — pas d'étape de build :** ni Alban ni Mathys n'ont Node installé, et un build obligatoire compliquerait le flux `collab.sh`/`collab.ps1`. On garde donc l'édition directe des fichiers JSX, mais avec un nouveau chargeur `public/js/loader.js` qui :
  * télécharge les fichiers de l'app en parallèle (revalidés auprès du serveur : chaque modif est vue au rechargement) ;
  * réutilise la version compilée stockée dans `localStorage` si le contenu n'a pas changé (empreinte du fichier) ;
  * ne télécharge et n'exécute Babel **que** si un fichier a changé depuis la dernière visite.
  * Mesuré sur le serveur local : 2ᵉ ouverture sans aucune requête Babel, DOM prêt en ~80 ms.
* React/ReactDOM passent en build **production** 18.3.1, Lucide figé en 1.55.0 et Babel en 7.26.4 (fini les `@latest` qui peuvent casser l'app du jour au lendemain). `sw.js` passe en `campushare-v3`.
* ⚠️ **Impact pour Mathys :** rien ne change dans `ItemsView.js`. Seule règle nouvelle : un **nouveau** fichier JS doit être ajouté à la liste `SOURCES` de `loader.js` (et à `APP_SHELL` dans `sw.js`). Pour voir les avertissements React détaillés en debug, remettre temporairement `react.development.js` dans `index.html`.
* **Discord :** webhook réellement branché dans `collab.sh` **et `collab.ps1`** (script de Mathys, modification additive : nouvelle fonction appelée après le push). Il est optionnel : URL à coller dans `.discord_webhook` (ajouté au nouveau `.gitignore`, donc jamais poussé publiquement). `AGENTS.md` décrit désormais le comportement réel.
* **Roadmap :** liens `file:///…/.gemini/…` remplacés par des chemins relatifs dans `ROADMAP.md` et `ESPACE_ALBAN.md`.
* **Hors périmètre, à prévoir :** `public/roadmap.html` charge toujours React dev + Babel (page secondaire) ; Tailwind passe encore par le CDN « play », qui compile le CSS dans le navigateur.

---

### 🎙️ Session n°7 — Zéro tâche manuelle à l'envoi (12 octobre 2026)

* **Demande d'Alban :** ne plus avoir à penser à la liste des fichiers de `loader.js` (« fais-le pour nous »).
* **@agent-architect :** nouveau script `outils/sync_app.py` (Python, déjà présent chez Alban et Mathys, rien à installer), lancé **automatiquement** par `./collab.sh save` et `collab.ps1 save` avant chaque commit :
  1. vérifie la syntaxe de tous les fichiers JS → **l'envoi est bloqué** en cas d'erreur, avec le fichier fautif affiché ;
  2. ajoute les nouveaux fichiers JS à `SOURCES` (données après `store.js`, le reste avant `app.js`) et retire ceux qui ont été supprimés ;
  3. recopie la liste dans `APP_SHELL` de `sw.js` ;
  4. recalcule `CACHE_VERSION` (empreinte des fichiers de l'app) et le `?v=` de `loader.js`.
* ⚠️ **Impact pour Mathys :** `collab.ps1 save` lance désormais `python outils\sync_app.py` (même commande `python` que `collab.ps1 start`). Aucune autre action à faire, `ItemsView.js` non modifié.
* Les règles « incrémenter `CACHE_VERSION` » et « ajouter le fichier à `loader.js` » deviennent automatiques.

---

### 🎙️ Session n°8 — Audit visuel complet au format téléphone (12 octobre 2026)

#### Participants :
* 🎩 **CEO IA** (Médiateur) • 📐 **@agent-architect** • 🎨 **@agent-ui-design** • 🔍 **@agent-renter** • 📸 **@agent-owner** • 🛡️ **@agent-trust**

#### 1. Question d'Alban :
* *« Tout est fait là, tu es sûr ? Au niveau du visuel, front etc. c'est fluide, clair ? N'hésite pas à prendre des décisions et à discuter avec tous les spécialistes. »*

#### 2. Constats (testés écran par écran en 390×844) :
* **@agent-architect — bug n°1 (bloquant) :** toutes les fenêtres (fiche produit, QR, contrat, notation, ajout d'objet) se positionnaient par rapport à la **liste défilante** au lieu de l'écran. Cause : l'animation `fadeIn` laissait un `transform` actif sur chaque écran, plus la marge automatique `space-y` de Tailwind. Effet : photo coupée sous l'en-tête, fond sombre incomplet, et avec un long catalogue la fiche pouvait s'ouvrir hors de l'écran.
* **@agent-renter :** le bouton « Confirmer l'emprunt » n'était pas visible sans défiler (photo trop haute).
* **@agent-ui-design :** la fausse barre d'état iPhone (« 09:41 », encoche, wifi) s'affichait **aussi sur un vrai téléphone**, par-dessus la vraie. Prix au format anglais (« 6.00 € »). Sélecteur Emprunter/Prêter en double avec la barre du bas, en haut de l'écran (loin du pouce), et surligné nulle part sur 2 onglets sur 4. Jargon : « Boarding Pass », « Check-in », « Checklist contradictoire ».
* **@agent-trust :** la checklist des accessoires était **pré-cochée** : elle ne servait à rien. On pouvait valider le retrait sans rien vérifier.
* **@agent-owner :** « Mes Objets » affichait toujours « Mathys • 3EA » et sa photo, même connecté en Alban.

#### 3. Décisions appliquées :
* **Fenêtres :** le cadre du téléphone devient la référence (`translateZ(0)` dans `app.js`), fondu sans transform (`index.html`), `!mt-0` sur toutes les fenêtres, hauteur max en % du téléphone (et non de la fenêtre du navigateur).
* **Fiche produit :** photo à hauteur fixe, contenu qui défile, bouton « Confirmer » **toujours visible en bas** (Sticky Bottom CTA).
* **Vrai téléphone :** fausse barre d'état visible seulement sur ordi ; marges pour l'encoche et la barre d'accueil iPhone (`safe-area`).
* **Prix :** nouveau `public/js/data/format.js` → `window.CS.formatPrice(6)` = « 6,00 € », utilisé partout.
* **En-tête :** sélecteur Emprunter/Prêter retiré (la barre du bas Explorer / Mes Objets fait déjà ce rôle).
* **Locations :** « Mes locations », « Mon QR de retrait » / « Rendre l'objet », « J'ai bien récupéré l'objet ». Checklist **vide à l'ouverture**, bouton bloqué tant que tout n'est pas coché, checklist refaite au retour, fenêtre fermée + message après le retrait.
* **Compte :** carte « Roadmap & Matrice » retirée (outil de dev, toujours accessible dans la StudioBar). Lien roadmap en chemin relatif (compatible mise en ligne).
* **@agent-owner — ⚠️ intervention dans `ItemsView.js` (mandat d'Alban) :** uniquement de l'affichage, aucune logique touchée : en-tête avec l'utilisateur connecté (photo, prénom, filière), prix via `formatPrice`, `!mt-0` et `max-h-[92%]` sur la fenêtre d'ajout.

#### 4. Point ouvert pour Mathys :
* Connecté en Alban, « Mes Objets » liste encore les objets et demandes de démo de Mathys (raclette, perceuse). Faut-il filtrer par propriétaire (`item.owner`) ? C'est son chantier : à lui de trancher.
