// ==============================================================================
// 🎒 CampuShare — Règles du prêt (Contrat Commun Alban & Mathys)
// Fichier : public/js/data/actions.js
// ------------------------------------------------------------------------------
// LE circuit d'un prêt, utilisé par toutes les vues (Explorer, Mes Objets,
// Locations) pour qu'elles restent synchronisées :
//
//   Emprunteur        Propriétaire           Emprunteur + Propriétaire
//   demande  ──────▶  accepte / refuse  ──▶  retrait (QR)  ──▶  retour
//   'pending'         'confirmed' (étape 2)  'in_progress' (3)  'completed' (4)
//                     'declined'                                 → cagnotte du
//                                                                  propriétaire créditée
//
// Un objet d'un camarade sans compte CampuShare (données de démo) est accepté
// automatiquement, pour que l'emprunteur puisse aller jusqu'au QR.
// Chaque action prévient l'app (événement 'cs:change') et sauvegarde aussitôt.
// ==============================================================================

window.CS = window.CS || {};

(function () {
  const data = () => window.CS.data;

  const emit = () => {
    if (window.CS.store) window.CS.store.save();
    window.dispatchEvent(new Event('cs:change'));
  };

  // Utilisateur ayant un compte CampuShare (clé 'alban' / 'mathys') à partir de son id
  const userById = (id) =>
    Object.values(data().users || {}).find((u) => u.id === id) || null;

  const randomDigits = (n) => String(Math.floor(Math.pow(10, n - 1) + Math.random() * 9 * Math.pow(10, n - 1)));

  const findBooking = (bookingId) => (data().bookings || []).find((b) => b.id === bookingId);

  const update = (bookingId, changes) => {
    data().bookings = (data().bookings || []).map((b) => (b.id === bookingId ? { ...b, ...changes } : b));
    emit();
    return findBooking(bookingId);
  };

  window.CS.userById = userById;

  window.CS.actions = {
    // 1. L'emprunteur demande un objet → renvoie la réservation créée
    requestBooking({ item, renter, price, periodLabel, periodTag, pickupLocation }) {
      const ownerHasAccount = !!userById(item.ownerId);
      const booking = {
        id: 'book-' + Date.now(),
        bookingRef: 'CS-N7-2026-' + randomDigits(3),
        itemId: item.id,
        itemTitle: item.title,
        itemCategory: item.categoryLabel,
        itemImage: item.image,
        itemPrice: price,
        depositAmount: item.depositAmount,
        periodLabel,
        type: periodTag,
        pickupLocation,
        status: ownerHasAccount ? 'pending' : 'confirmed',
        step: ownerHasAccount ? 1 : 2,
        pinCode: randomDigits(4),
        createdAt: Date.now(),
        renterId: renter.id,
        renterName: renter.name,
        renterPromo: renter.promo,
        renterAvatar: renter.avatar,
        ownerId: item.ownerId,
        ownerName: item.owner.name,
        ownerPromo: item.owner.promo,
        ownerAvatar: item.owner.avatar,
        ownerPhone: '06 42 78 91 23',
        accessories: item.includedAccessories && item.includedAccessories.length
          ? item.includedAccessories
          : ['Objet complet, comme sur la photo']
      };
      data().bookings = [booking, ...(data().bookings || [])];
      emit();
      return booking;
    },

    // 2. Le propriétaire accepte → l'emprunteur reçoit son QR de retrait
    acceptBooking(bookingId) {
      return update(bookingId, { status: 'confirmed', step: 2 });
    },

    // 2 bis. Le propriétaire refuse → la demande part dans l'historique de l'emprunteur
    declineBooking(bookingId) {
      return update(bookingId, { status: 'declined', step: 0 });
    },

    // 3. Retrait validé (QR / PIN + accessoires) puis retour de l'objet
    advanceBooking(bookingId) {
      const b = findBooking(bookingId);
      if (!b) return null;
      if (b.step <= 2) return update(bookingId, { status: 'in_progress', step: 3 });
      if (b.step === 3) {
        // Retour : le propriétaire est payé, la caution est levée (0,00 € débité)
        const owner = userById(b.ownerId);
        if (owner) owner.wallet = Math.round((Number(owner.wallet) + Number(b.itemPrice)) * 100) / 100;
        return update(bookingId, {
          status: 'completed',
          step: 4,
          depositReleased: true,
          returnedAt: "Aujourd'hui à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        });
      }
      return b;
    },

    // 4. Le propriétaire dépose un objet → visible tout de suite dans Explorer
    addItem(fields, ownerUser) {
      const item = {
        id: 'item-' + Date.now(),
        ...fields,
        minDuration: '24h',
        ownerId: ownerUser.id,
        owner: {
          name: ownerUser.name,
          promo: ownerUser.promo.split(' ').slice(0, 2).join(' '), // '2A SN (Numérique)' → '2A SN'
          school: ownerUser.school,
          avatar: ownerUser.avatar,
          rating: 5.0,
          reviewsCount: 0
        },
        status: 'available',
        reviews: []
      };
      data().items = [item, ...(data().items || [])];
      emit();
      return item;
    },

    // 5. Le propriétaire retire un objet (impossible s'il est réservé ou prêté)
    removeItem(itemId) {
      if (window.CS.actions.activeBookingForItem(itemId)) return false;
      data().items = (data().items || []).filter((it) => it.id !== itemId);
      emit();
      return true;
    },

    // Ce qui attend une action de l'utilisateur : demandes à traiter sur ses objets
    // (onglet Mes Objets) et QR de retrait disponibles (onglet Locations)
    todoFor(userId) {
      const bookings = data().bookings || [];
      return {
        requests: bookings.filter((b) => b.ownerId === userId && b.status === 'pending').length,
        readyToPickup: bookings.filter((b) => b.renterId === userId && b.status === 'confirmed').length
      };
    },

    // Réservation qui bloque un objet (acceptée ou en cours d'utilisation)
    activeBookingForItem(itemId) {
      return (data().bookings || []).find(
        (b) => b.itemId === itemId && (b.status === 'confirmed' || b.status === 'in_progress')
      ) || null;
    }
  };
})();
