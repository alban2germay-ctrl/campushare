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
      pickupLocation: 'Foyer des élèves N7 / Résidence R1'
    },
    {
      id: 'item-jbl',
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
      pickupLocation: 'Bâtiment A / Foyer N7'
    },
    {
      id: 'item-bosch',
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
      status: 'rented',
      pickupLocation: 'Résidence R2 / Salle de TP'
    }
  ],

  bookings: [
    {
      id: 'book-001',
      itemTitle: 'Perceuse sans fil Bosch 18V',
      itemCategory: 'Bricolage',
      itemPrice: 6.00,
      depositAmount: 50.00,
      periodLabel: 'Mardi 14h00 → Mercredi 14h00 (24h)',
      type: '24h semaine',
      pickupLocation: 'Foyer des élèves N7',
      status: 'confirmed',
      renterName: 'Alban D.',
      ownerName: 'Mathys D.'
    }
  ]
};
