// ==============================================================================
// 🎒 CampuShare — Données Partagées (Contrat Commun Alban & Mathys)
// Fichier : public/js/data/mockData.js
// ==============================================================================

window.CS = window.CS || {};

window.CS.data = {
  users: {
    alban: {
      id: 'usr-alban',
      name: 'Alban D.',
      email: 'alban@enseeiht.fr',
      promo: '2A SN (Numérique)',
      school: 'Toulouse INP • ENSEEIHT',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      activeItems: 2,
      wallet: 32.50,
      trustScore: 100,
      disputes: 0
    },
    mathys: {
      id: 'usr-mathys',
      name: 'Mathys D.',
      email: 'mathys@enseeiht.fr',
      promo: '2A 3EA (Électronique/Énergie)',
      school: 'Toulouse INP • ENSEEIHT',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      activeItems: 3,
      wallet: 18.00,
      trustScore: 100,
      disputes: 0
    }
  },

  categories: [
    { id: 'party', label: 'Soirée & Fête', icon: '🎉', count: 6 },
    { id: 'outdoor', label: 'Ski & Montagne', icon: '🏔️', count: 5 },
    { id: 'diy', label: 'Bricolage & Déménagement', icon: '🔨', count: 4 },
    { id: 'kitchen', label: 'Convivialité', icon: '🍳', count: 3 }
  ],

  items: [
    {
      id: 'item-raclette',
      ownerId: 'usr-mathys', // Propriétaire (les comptes CampuShare : usr-alban, usr-mathys)
      title: 'Appareil à Raclette 8p Tefal',
      category: 'kitchen',
      categoryLabel: 'Convivialité',
      pricing: {
        perDay: 6.00,
        weekendPackage: 12.00,
        weeklyPackage: 25.00
      },
      depositAmount: 40.00,
      minDuration: '24h',
      owner: {
        name: 'Mathys D.',
        promo: '2A 3EA',
        school: 'Toulouse INP • ENSEEIHT',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        rating: 5.0,
        reviewsCount: 8
      },
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      status: 'available',
      pickupLocation: 'Foyer des élèves N7 / Résidence R1',
      condition: 'Comme neuf (testé & nettoyé)',
      includedAccessories: ['8 poêlons antiadhésifs', '8 spatules en bois', 'Câble secteur 2m', 'Plaque grill supérieure'],
      specs: ['Puissance 1050W', 'Revêtement sans PFOA', 'Thermostat automatique'],
      reviews: [
        { author: 'Thomas P.', promo: '2A SN', rating: 5, date: 'Il y a 3 jours', comment: 'Super raclette au foyer avec les potes de promo, matériel nickel et poêlons très propres !' },
        { author: 'Léa M.', promo: '1A 3EA', rating: 5, date: 'Semaine dernière', comment: 'Mathys est super arrangeant pour la remise des clés au bâtiment B. Recommandé à 100% !' }
      ]
    },
    {
      id: 'item-jbl',
      ownerId: 'usr-alban',
      title: 'Enceinte JBL Partybox 310 (240W)',
      category: 'party',
      categoryLabel: 'Soirée & Fête',
      pricing: {
        perDay: 15.00,
        weekendPackage: 28.00,
        weeklyPackage: 55.00
      },
      depositAmount: 120.00,
      minDuration: '24h',
      owner: {
        name: 'Alban D.',
        promo: '2A SN',
        school: 'Toulouse INP • ENSEEIHT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        rating: 4.9,
        reviewsCount: 14
      },
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80',
      status: 'available',
      pickupLocation: 'Bâtiment A / Foyer N7',
      condition: 'Très bon état (son impeccable)',
      includedAccessories: ['Câble secteur de charge', 'Micro karaoké avec fil', 'Roulettes télescopiques intégrées'],
      specs: ['Puissance 240W RMS', 'Autonomie 18h sur batterie', 'Jeux de lumières synchronisés', 'Bluetooth 5.1'],
      reviews: [
        { author: 'Hugo L.', promo: '1A SN', rating: 5, date: 'Il y a 5 jours', comment: 'Le son a régalé toute la soirée d\'inté ! Batterie increvable de 20h à 5h du matin.' },
        { author: 'Sarah K.', promo: '2A MFEE', rating: 5, date: 'Le 28 sept.', comment: 'Excellente enceinte, Alban a été super réactif pour le prêt.' }
      ]
    },
    {
      id: 'item-bosch',
      ownerId: 'usr-mathys',
      title: 'Perceuse Visseuse sans fil Bosch 18V',
      category: 'diy',
      categoryLabel: 'Bricolage',
      pricing: {
        perDay: 5.00,
        weekendPackage: 9.00,
        weeklyPackage: 18.00
      },
      depositAmount: 50.00,
      minDuration: '24h',
      owner: {
        name: 'Mathys D.',
        promo: '2A 3EA',
        school: 'Toulouse INP • ENSEEIHT',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        rating: 5.0,
        reviewsCount: 6
      },
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
      status: 'available',
      pickupLocation: 'Résidence R2 / Salle de TP',
      condition: 'Comme neuf',
      includedAccessories: ['2 batteries Lithium 18V', 'Chargeur rapide', 'Coffret 32 embouts & mèches bois/béton', 'Mallette rigide'],
      specs: ['Couple max 50 Nm', 'Mandrin auto-serrant 13mm', 'Éclairage LED intégré'],
      reviews: [
        { author: 'Maxime D.', promo: '1A SN', rating: 5, date: 'Il y a 2 semaines', comment: 'A sauvé mon emménagement à la résidence R2 pour monter mon lit et mes étagères en 1h chrono.' }
      ]
    },
    {
      id: 'item-quechua',
      ownerId: 'usr-camille',
      title: 'Tente 3 Places Quechua Arpenaz',
      category: 'outdoor',
      categoryLabel: 'Ski & Montagne',
      pricing: {
        perDay: 8.00,
        weekendPackage: 15.00,
        weeklyPackage: 30.00
      },
      depositAmount: 45.00,
      minDuration: '24h',
      owner: {
        name: 'Camille B.',
        promo: '1A 3EA',
        school: 'Toulouse INP • ENSEEIHT',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        rating: 4.8,
        reviewsCount: 5
      },
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
      status: 'available',
      pickupLocation: 'Foyer des élèves N7',
      condition: 'Très bon état (imperméable)',
      includedAccessories: ['Double toit imperméable', 'Arceaux aluminium', '12 piquets sardines', 'Housse de compression'],
      specs: ['Dimensions chambre : 210 x 195 cm', 'Poids : 3.2 kg', 'Résistance vent 50 km/h'],
      reviews: [
        { author: 'Bastien V.', promo: '2A 3EA', rating: 5, date: 'Le mois dernier', comment: 'Utilisée pour le bivouac dans les Pyrénées, facile à monter et bien étanche sous la pluie.' }
      ]
    },
    {
      id: 'item-crepiere',
      ownerId: 'usr-lucas',
      title: 'Crêpière Party Tefal 6 Mini-Crêpes',
      category: 'kitchen',
      categoryLabel: 'Convivialité',
      pricing: {
        perDay: 4.00,
        weekendPackage: 8.00,
        weeklyPackage: 16.00
      },
      depositAmount: 30.00,
      minDuration: '24h',
      owner: {
        name: 'Lucas M.',
        promo: '2A SN',
        school: 'Toulouse INP • ENSEEIHT',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5.0,
        reviewsCount: 11
      },
      image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=400&q=80',
      status: 'available',
      pickupLocation: 'Résidence étudiante R1',
      condition: 'Comme neuf',
      includedAccessories: ['6 mini-spatules en bois', '1 louche doseuse', 'Cordon d\'alimentation 1.5m'],
      specs: ['Puissance 1000W', 'Revêtement antiadhésif Prometal', 'Indicateur Thermo-Spot'],
      reviews: [
        { author: 'Clara T.', promo: '1A SN', rating: 5, date: 'Hier soir', comment: 'Soirée crêpes réussie à la coloc R1, chauffe super vite et ne colle pas du tout.' }
      ]
    }
  ],

  // Statuts : 'pending' (demande) → 'confirmed' (acceptée, étape 2) → 'in_progress' (3) → 'completed' (4)
  //           ou 'declined' (refusée). Règles dans public/js/data/actions.js
  bookings: [
    {
      id: 'book-req-thomas',
      bookingRef: 'CS-N7-2026-431',
      itemId: 'item-bosch',
      itemTitle: 'Perceuse Visseuse sans fil Bosch 18V',
      itemCategory: 'Bricolage',
      itemPrice: 9.00,
      depositAmount: 50.00,
      periodLabel: 'Samedi 09h00 → Dimanche 18h00 (Week-end)',
      type: 'Ven-Dim',
      pickupLocation: 'Foyer des élèves N7',
      status: 'pending',
      step: 1,
      pinCode: '5307',
      renterId: 'usr-thomas',
      renterName: 'Thomas P.',
      renterPromo: '2A SN',
      renterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      ownerId: 'usr-mathys',
      ownerName: 'Mathys D.',
      ownerPromo: '2A 3EA',
      ownerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      ownerPhone: '06 42 78 91 23',
      accessories: ['2 batteries Lithium 18V', 'Chargeur rapide', 'Coffret 32 embouts & mèches bois/béton', 'Mallette rigide']
    },
    {
      id: 'book-req-lea',
      bookingRef: 'CS-N7-2026-208',
      itemId: 'item-raclette',
      itemTitle: 'Appareil à Raclette 8p Tefal',
      itemCategory: 'Convivialité',
      itemPrice: 6.00,
      depositAmount: 40.00,
      periodLabel: 'Vendredi 19h00 → Samedi 19h00 (24h)',
      type: '24h',
      pickupLocation: 'Résidence étudiante R1',
      status: 'pending',
      step: 1,
      pinCode: '6614',
      renterId: 'usr-lea',
      renterName: 'Léa M.',
      renterPromo: '1A 3EA',
      renterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      ownerId: 'usr-mathys',
      ownerName: 'Mathys D.',
      ownerPromo: '2A 3EA',
      ownerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      ownerPhone: '06 42 78 91 23',
      accessories: ['8 poêlons antiadhésifs', '8 spatules en bois', 'Câble secteur 2m', 'Plaque grill supérieure']
    },
    {
      id: 'book-req-hugo',
      bookingRef: 'CS-N7-2026-157',
      itemId: 'item-jbl',
      itemTitle: 'Enceinte JBL Partybox 310 (240W)',
      itemCategory: 'Soirée & Fête',
      itemPrice: 28.00,
      depositAmount: 120.00,
      periodLabel: 'Vendredi 17h00 → Dimanche 20h00 (Week-end)',
      type: 'Ven-Dim',
      pickupLocation: 'Bâtiment A / Foyer N7',
      status: 'pending',
      step: 1,
      pinCode: '2290',
      renterId: 'usr-hugo',
      renterName: 'Hugo L.',
      renterPromo: '1A SN',
      renterAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      ownerId: 'usr-alban',
      ownerName: 'Alban D.',
      ownerPromo: '2A SN',
      ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      ownerPhone: '06 12 34 56 78',
      accessories: ['Câble secteur de charge', 'Micro karaoké avec fil', 'Roulettes télescopiques intégrées']
    },
    {
      id: 'book-001',
      bookingRef: 'CS-N7-2026-884',
      itemId: 'item-bosch',
      itemTitle: 'Perceuse Visseuse sans fil Bosch 18V',
      itemCategory: 'Bricolage',
      itemPrice: 6.00,
      depositAmount: 50.00,
      periodLabel: 'Mardi 14h00 → Mercredi 14h00 (24h)',
      type: '24h semaine',
      pickupLocation: 'Foyer des élèves N7',
      status: 'confirmed',
      step: 2, // 1: Confirmée, 2: Retrait & Check-in, 3: Utilisation, 4: Restitution
      pinCode: '8492',
      renterId: 'usr-alban',
      renterName: 'Alban D.',
      renterPromo: '2A SN',
      renterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      ownerId: 'usr-mathys',
      ownerName: 'Mathys D.',
      ownerPromo: '2A 3EA (Électronique/Énergie)',
      ownerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      ownerPhone: '06 42 78 91 23',
      accessories: [
        'Batterie 18V Li-Ion chargée',
        'Chargeur secteur Bosch rapide',
        'Boîte de 10 embouts & mèches métal',
        'Mallette de transport rigide'
      ]
    },
    {
      id: 'book-000',
      bookingRef: 'CS-N7-2026-712',
      itemId: 'item-raclette',
      itemTitle: 'Appareil à Raclette 8p Tefal',
      itemCategory: 'Convivialité',
      itemPrice: 12.00,
      depositAmount: 40.00,
      periodLabel: 'Week-end dernier (Ven 18h → Dim 20h)',
      type: 'Week-end 48h',
      pickupLocation: 'Résidence étudiante R1',
      status: 'completed',
      step: 4,
      pinCode: '3142',
      renterId: 'usr-alban',
      renterName: 'Alban D.',
      renterPromo: '2A SN',
      renterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      ownerId: 'usr-mathys',
      ownerName: 'Mathys D.',
      ownerPromo: '2A 3EA (Électronique/Énergie)',
      ownerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      ownerPhone: '06 42 78 91 23',
      returnedAt: 'Dimanche 20h15',
      depositReleased: true,
      accessories: [
        '8 poêlons antiadhésifs',
        '8 spatules en bois',
        'Cordon d\'alimentation 2m',
        'Caquelon & plaque nettoyés'
      ]
    }
  ]
};
