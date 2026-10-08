// ==============================================================================
// 🎒 CampuShare — Vue ItemsView (Chantier B : Moteur Propriétaire & Matériel)
// Fichier : public/js/views/ItemsView.js
// Responsable exclusif : Mathys (Co-directeur 2A 3EA - Toulouse INP • ENSEEIHT)
// Conforme à la Phase 3 du BOARD.md (Tâches 3.1 & 3.2) & Charte AGENTS.md
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ItemsView = function ItemsView({ activeUserData, currentUser }) {
  const { useState, useEffect, useRef } = React;

  // 1. ÉTAT DES ONGLETS LOCAUX : "Mes Objets & Gains" vs "Demandes Reçues"
  const [activeSection, setActiveSection] = useState('inventory'); // 'inventory' | 'requests'

  // 2. MODALE D'AJOUT RAPIDE (< 60 secondes)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 3. ÉTAT DU FORMULAIRE D'AJOUT EXPRESS (< 60s)
  const [formData, setFormData] = useState({
    title: '',
    category: 'diy',
    estimatedValue: '', // Valeur d'achat / à neuf (€)
    pickupLocation: 'Foyer des élèves N7',
    condition: 'Très bon état'
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // 4. ÉTAT DES DEMANDES ENTRANTES (Initialisé avec une demande simulée pour le matériel de Mathys)
  const [pendingRequests, setPendingRequests] = useState(() => {
    return [
      {
        id: 'req-001',
        itemTitle: 'Perceuse sans fil Bosch 18V',
        itemId: 'item-bosch',
        renterName: 'Thomas P.',
        renterPromo: '2A SN',
        renterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        periodLabel: 'Samedi 09h00 → Dimanche 18h00 (Week-end)',
        durationDays: 2,
        offeredEarnings: 9.00,
        depositCoverage: 50.00,
        pickupPlace: 'Foyer des élèves N7',
        status: 'pending', // 'pending' | 'accepted' | 'declined'
        createdAt: 'Il y a 12 min'
      },
      {
        id: 'req-002',
        itemTitle: 'Appareil à Raclette 8p Tefal',
        itemId: 'item-raclette',
        renterName: 'Léa M.',
        renterPromo: '1A 3EA',
        renterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        periodLabel: 'Vendredi soir 19h00 → Samedi midi (24h)',
        durationDays: 1,
        offeredEarnings: 6.00,
        depositCoverage: 40.00,
        pickupPlace: 'Résidence étudiante R1',
        status: 'pending',
        createdAt: 'Il y a 45 min'
      }
    ];
  });

  // 5. SYNCHRONISATION LOCALE DES OBJETS DÉPOSÉS PAR MATHYS
  const [ownerItems, setOwnerItems] = useState(() => {
    const all = window.CS.data.items || [];
    // Filtrer les objets appartenant à Mathys ou nouvellement ajoutés
    return all.filter(it => it.owner && (it.owner.name.includes('Mathys') || it.ownerId === 'usr-mathys'));
  });

  // 6. TOTAL DES GAINS CUMULÉS DU MATÉRIEL
  const [totalEarnings, setTotalEarnings] = useState(38.50);

  // Message toast pour actions rapides (Accepté, Refusé, Ajouté)
  const [toastMessage, setToastMessage] = useState(null);

  // Synchroniser les icônes Lucide à chaque rerender
  useEffect(() => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }, [activeSection, isAddModalOpen, photoPreview, pendingRequests, ownerItems, toastMessage]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 🧮 ALGORITHME DE TARIFICATION AUTOMATIQUE SUGGÉRÉE (MT-3.1.1.4)
  // Basé sur 10-15% de la valeur d'achat pour un week-end, et caution fixée à 50-70%
  const calculatePricing = (valStr) => {
    const val = parseFloat(valStr) || 0;
    if (val <= 0) {
      return { perDay: 5.0, weekend: 9.0, deposit: 40.0 };
    }
    const perDay = Math.max(3, Math.round(val * 0.08));
    const weekend = Math.max(5, Math.round(val * 0.14));
    const deposit = Math.max(20, Math.round(val * 0.65));
    return { perDay, weekend, deposit };
  };

  const currentPricing = calculatePricing(formData.estimatedValue);

  // 📸 GESTION PHOTO EXPRESS (Caméra native & Drag/File)
  const handlePhotoCapture = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setPhotoError('Veuillez sélectionner un fichier image valide.');
        return;
      }
      setPhotoError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🚀 SOUMISSION DU FORMULAIRE EXPRESS (< 60s)
  const handlePublishItem = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('⚠️ Précisez le nom de l\'objet.');
      return;
    }

    const val = parseFloat(formData.estimatedValue) || 50;
    const pricing = calculatePricing(val);

    const defaultImages = {
      party: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80',
      outdoor: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
      diy: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
      kitchen: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'
    };

    const newItem = {
      id: 'item-' + Date.now(),
      title: formData.title,
      category: formData.category,
      categoryLabel: formData.category === 'diy' ? 'Bricolage' : formData.category === 'party' ? 'Soirée' : formData.category === 'outdoor' ? 'Montagne' : 'Convivialité',
      pricing: {
        perDay: pricing.perDay,
        weekendPackage: pricing.weekend,
        weeklyPackage: Math.round(pricing.weekend * 1.8)
      },
      depositAmount: pricing.deposit,
      minDuration: '24h',
      ownerId: 'usr-mathys',
      owner: {
        name: 'Mathys D.',
        promo: '2A 3EA',
        school: 'Toulouse INP • ENSEEIHT',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        rating: 5.0,
        reviewsCount: 1
      },
      image: photoPreview || defaultImages[formData.category] || defaultImages.diy,
      status: 'available',
      pickupLocation: formData.pickupLocation,
      condition: formData.condition,
      includedAccessories: ['Accessoires complets fournis par Mathys', 'Câblage / housse de protection d\'origine'],
      specs: ['Matériel vérifié fonctionnel', 'Contrôle avant passation campus'],
      reviews: []
    };

    // Injecter dans les données globales partagées window.CS.data.items pour synchroniser ExploreView
    window.CS.data.items = [newItem, ...(window.CS.data.items || [])];

    // Mettre à jour l'état local
    setOwnerItems(prev => [newItem, ...prev]);

    // Notification et réinitialisation rapide
    setSubmitSuccess(true);
    showToast('🎉 Objet publié sur le campus en < 60s !');

    setTimeout(() => {
      setIsAddModalOpen(false);
      setSubmitSuccess(false);
      setFormData({
        title: '',
        category: 'diy',
        estimatedValue: '',
        pickupLocation: 'Foyer des élèves N7',
        condition: 'Très bon état'
      });
      setPhotoPreview(null);
    }, 1200);
  };

  // ✅ ACCEPTATION D'UNE DEMANDE EN 1 CLIC (MT-3.2.1.3 & MT-3.2.1.5)
  const handleAcceptRequest = (request) => {
    // 1. Mettre à jour la liste des demandes
    setPendingRequests(prev => prev.map(req => {
      if (req.id === request.id) {
        return { ...req, status: 'accepted' };
      }
      return req;
    }));

    // 2. Créditer les gains du matériel dans la cagnotte
    setTotalEarnings(prev => Number((prev + request.offeredEarnings).toFixed(2)));

    // 3. Créer automatiquement une réservation confirmée dans window.CS.data.bookings
    const newBooking = {
      id: 'book-' + Date.now(),
      bookingRef: 'CS-N7-' + Math.floor(1000 + Math.random() * 9000),
      itemTitle: request.itemTitle,
      itemCategory: 'Matériel Prêté',
      itemPrice: request.offeredEarnings,
      depositAmount: request.depositCoverage,
      periodLabel: request.periodLabel,
      type: 'Confirmé campus',
      pickupLocation: request.pickupPlace,
      status: 'confirmed',
      step: 2, // Retrait & Check-in
      pinCode: String(Math.floor(1000 + Math.random() * 9000)),
      renterName: request.renterName,
      ownerName: 'Mathys D.',
      ownerPromo: '2A 3EA (Électronique/Énergie)',
      ownerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      ownerPhone: '06 42 78 91 23',
      accessories: ['Matériel complet prêté par Mathys', 'Cordon & accessoires vérifiés']
    };

    window.CS.data.bookings = [newBooking, ...(window.CS.data.bookings || [])];

    showToast(`✅ Demande de ${request.renterName} acceptée ! (+${request.offeredEarnings.toFixed(2)} € crédités)`);
  };

  // ❌ REFUS POLI SANS BLOCAGE (MT-3.2.1.4)
  const handleDeclineRequest = (request) => {
    setPendingRequests(prev => prev.map(req => {
      if (req.id === request.id) {
        return { ...req, status: 'declined' };
      }
      return req;
    }));
    showToast(`Demande de ${request.renterName} déclinée poliment. Matériel libéré.`);
  };

  const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-4 pb-24 animate-fade-in text-left">
      {/* TOAST FLOTTANT DE NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#2C2720] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-white/10 animate-bounce">
          <i data-lucide="bell" className="w-4 h-4 text-[#D87D4A]"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. EN-TÊTE PROPRIÉTAIRE & COMPTEUR DE GAINS (MT-3.2.1.5) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-white via-white to-[#FEF4E8] border border-[#EAE2D5] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80"
                alt="Mathys"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#D87D4A]/40 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#52796F] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[#2C2720]">Espace Propriétaire</h3>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D87D4A]/10 text-[#D87D4A] border border-[#D87D4A]/20">
                  Mathys • 3EA
                </span>
              </div>
              <p className="text-[11px] text-[#6B6358]">Toulouse INP - ENSEEIHT</p>
            </div>
          </div>

          {/* BOUTON DÉCLENCHEUR DÉPÔT EXPRESS */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#D87D4A] hover:bg-[#C26B39] active:scale-95 text-white rounded-2xl font-bold text-xs shadow-sm transition-all"
          >
            <i data-lucide="plus" className="w-4 h-4"></i>
            <span>Déposer</span>
          </button>
        </div>

        {/* CARTE CAGNOTTE & TOTAL DES GAINS GÉNÉRÉS */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#EAE2D5] flex items-center justify-between shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B6358]">
              <i data-lucide="piggy-bank" className="w-3.5 h-3.5 text-[#52796F]"></i>
              <span>Gains générés par votre matériel</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-[#52796F]">{totalEarnings.toFixed(2)} €</span>
              <span className="text-[10px] text-[#8C8275] font-medium">• solde sécurisé</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F1EE] text-[#52796F] border border-[#52796F]/20">
              0 litige • 100% garanti
            </span>
          </div>
        </div>
      </div>

      {/* 2. SÉLECTEUR TACTILE D'ONGLETS AU POUCE */}
      <div className="flex bg-[#EAE2D5]/50 p-1 rounded-2xl border border-[#EAE2D5]">
        <button
          onClick={() => setActiveSection('inventory')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeSection === 'inventory'
              ? 'bg-white text-[#2C2720] shadow-xs'
              : 'text-[#6B6358] hover:text-[#2C2720]'
          }`}
        >
          <i data-lucide="package" className="w-3.5 h-3.5"></i>
          <span>Mes Objets ({ownerItems.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('requests')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative ${
            activeSection === 'requests'
              ? 'bg-white text-[#2C2720] shadow-xs'
              : 'text-[#6B6358] hover:text-[#2C2720]'
          }`}
        >
          <i data-lucide="inbox" className="w-3.5 h-3.5"></i>
          <span>Demandes reçues</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#D87D4A] text-white text-[10px] font-black rounded-full animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* 3. SECTION MES OBJETS (INVENTAIRE & STATUTS) */}
      {activeSection === 'inventory' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B6358]">
              Matériel en partage ({ownerItems.length})
            </h4>
            <span className="text-[11px] text-[#52796F] font-bold">
              Tous assurés campus
            </span>
          </div>

          {ownerItems.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE2D5] space-y-2">
              <i data-lucide="package-open" className="w-10 h-10 mx-auto text-[#8C8275]"></i>
              <p className="text-xs font-bold text-[#2C2720]">Aucun objet déposé pour le moment</p>
              <p className="text-[11px] text-[#6B6358]">Déposez une raclette, des outils ou une enceinte en 60 secondes !</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 px-4 py-2 bg-[#D87D4A] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Déposer mon premier objet
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {ownerItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-[#EAE2D5] shadow-2xs flex items-center gap-3 transition-all hover:border-[#D87D4A]/40"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover border border-[#EAE2D5] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-extrabold text-xs text-[#2C2720] truncate">
                        {item.title}
                      </h5>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F1EE] text-[#52796F] border border-[#52796F]/20 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#52796F]"></span>
                        Disponible
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B6358]">
                      <span className="font-black text-[#2C2720]">{item.pricing?.weekendPackage || 10} €</span>
                      <span>/ WE</span>
                      <span>•</span>
                      <span>Caution : {item.depositAmount || 40} €</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#8C8275] truncate">
                      <i data-lucide="map-pin" className="w-3 h-3 text-[#D87D4A] flex-shrink-0"></i>
                      <span className="truncate">{item.pickupLocation || 'Foyer N7'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. SECTION DEMANDES REÇUES D'UN CAMARADE DE PROMO (MT-3.2.1.2) */}
      {activeSection === 'requests' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B6358]">
              Demandes directes ({pendingRequests.length})
            </h4>
            <span className="text-[10px] font-semibold text-[#8C8275]">
              Vérifié e-mail @enseeiht.fr
            </span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-3xl bg-white border shadow-xs space-y-3 transition-all ${
                  req.status === 'accepted'
                    ? 'border-[#52796F] bg-[#E8F1EE]/20'
                    : req.status === 'declined'
                    ? 'border-[#EAE2D5] opacity-60'
                    : 'border-[#EAE2D5]'
                }`}
              >
                {/* En-tête Camarade & Objet */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={req.renterAvatar}
                      alt={req.renterName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#52796F]/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-[#2C2720]">{req.renterName}</span>
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#FAF8F5] text-[#52796F] border border-[#EAE2D5]">
                          {req.renterPromo}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8C8275] block mt-0.5">
                        Demande reçue {req.createdAt}
                      </span>
                    </div>
                  </div>

                  <span className="font-black text-xs text-[#52796F] bg-[#E8F1EE] px-2.5 py-1 rounded-full border border-[#52796F]/20">
                    +{req.offeredEarnings.toFixed(2)} €
                  </span>
                </div>

                {/* Détails de la demande */}
                <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#2C2720]">
                    <i data-lucide="tag" className="w-3.5 h-3.5 text-[#D87D4A]"></i>
                    <span>{req.itemTitle}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B6358]">
                    <i data-lucide="calendar" className="w-3.5 h-3.5 text-[#52796F]"></i>
                    <span>{req.periodLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8C8275] pt-1 border-t border-[#EAE2D5]/60">
                    <span className="flex items-center gap-1">
                      <i data-lucide="map-pin" className="w-3 h-3 text-[#D87D4A]"></i>
                      {req.pickupPlace}
                    </span>
                    <span className="font-bold text-[#52796F]">
                      🛡️ Caution couverte ({req.depositCoverage} €)
                    </span>
                  </div>
                </div>

                {/* Boutons d'Action 1 Clic (MT-3.2.1.3 & MT-3.2.1.4) */}
                {req.status === 'pending' ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleDeclineRequest(req)}
                      className="flex-1 py-2 rounded-xl border border-[#EAE2D5] bg-[#FAF8F5] hover:bg-gray-100 text-[#6B6358] font-bold text-xs transition-all active:scale-95"
                    >
                      Décliner
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="flex-2 py-2 rounded-xl bg-[#52796F] hover:bg-[#43645c] text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <i data-lucide="check" className="w-3.5 h-3.5"></i>
                      <span>Accepter (+{req.offeredEarnings.toFixed(2)} €)</span>
                    </button>
                  </div>
                ) : req.status === 'accepted' ? (
                  <div className="p-2.5 rounded-xl bg-[#E8F1EE] text-[#52796F] font-bold text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <i data-lucide="check-circle-2" className="w-4 h-4"></i>
                      Prêt confirmé & billet généré
                    </span>
                    <span className="text-[10px] underline">Voir dans Locations</span>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-gray-100 text-[#8C8275] text-[11px] font-semibold text-center">
                    Demande déclinée poliment
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MODALE FORMULAIRE EXPRESS EN MOINS DE 60s (MT-3.1.1.1 à MT-3.1.1.5) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-[400px] max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EAE2D5] flex flex-col overflow-hidden animate-slide-up">
            
            {/* Barre de titre & Fermeture */}
            <div className="p-4 border-b border-[#EAE2D5] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#D87D4A]/10 text-[#D87D4A] flex items-center justify-center font-black text-xs">
                  ⏱️
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-[#2C2720]">Dépôt Express &lt; 60s</h3>
                  <p className="text-[10px] text-[#6B6358]">3 champs simples, zéro friction</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#EAE2D5] text-[#6B6358] flex items-center justify-center hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Corps du formulaire scrollable */}
            <form onSubmit={handlePublishItem} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
              
              {/* CHAMP 1 : CAMÉRA SMARTPHONE NATIVE (<input type="file" capture>) (MT-3.1.1.1 & MT-3.1.1.2) */}
              <div>
                <label className="block font-bold text-[#2C2720] mb-1.5 flex items-center justify-between">
                  <span>Photo de l'appareil</span>
                  <span className="text-[10px] font-medium text-[#D87D4A]">Recommandé</span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handlePhotoCapture}
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#EAE2D5] h-36 bg-[#FAF8F5] group">
                    <img
                      src={photoPreview}
                      alt="Prévisualisation"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full text-xs shadow-md"
                      title="Supprimer la photo"
                    >
                      ✕
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                      ✓ Photo prête
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="w-full h-24 border-2 border-dashed border-[#D87D4A]/50 bg-[#FEF4E8]/40 hover:bg-[#FEF4E8]/80 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-98"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#D87D4A] text-white flex items-center justify-center shadow-xs">
                      <i data-lucide="camera" className="w-4 h-4"></i>
                    </div>
                    <span className="font-extrabold text-[#D87D4A] text-xs">
                      Prendre en photo / Importer
                    </span>
                    <span className="text-[10px] text-[#8C8275]">
                      Ouverture directe de l'appareil mobile
                    </span>
                  </button>
                )}
                {photoError && <p className="text-[10px] text-red-500 mt-1">{photoError}</p>}
              </div>

              {/* CHAMP 2 : NOM DU MATÉRIEL (MT-3.1.1.3) */}
              <div>
                <label className="block font-bold text-[#2C2720] mb-1">
                  Nom de l'objet
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Appareil à Raclette, Enceinte JBL, Tente..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-[#D87D4A] text-xs font-semibold text-[#2C2720]"
                />
              </div>

              {/* CHAMP 3 : CATÉGORIE EN PILLS */}
              <div>
                <label className="block font-bold text-[#2C2720] mb-1">
                  Catégorie du campus
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'diy', label: '🔨 Bricolage' },
                    { id: 'kitchen', label: '🍳 Convivialité' },
                    { id: 'party', label: '🎉 Soirée & Fête' },
                    { id: 'outdoor', label: '🏔️ Ski & Montagne' }
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold text-left transition-all ${
                        formData.category === cat.id
                          ? 'border-[#D87D4A] bg-[#FEF4E8] text-[#9A4C1E] ring-1 ring-[#D87D4A]'
                          : 'border-[#EAE2D5] bg-[#FAF8F5] text-[#6B6358]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHAMP 4 & ALGORITHME : VALEUR À NEUF & TARIF SUGGÉRÉ (MT-3.1.1.4) */}
              <div>
                <label className="block font-bold text-[#2C2720] mb-1 flex items-center justify-between">
                  <span>Valeur d'achat approximative (€)</span>
                  <span className="text-[10px] text-[#52796F] font-bold">Calcul auto 🪄</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="1500"
                    placeholder="Ex : 60 € (pour calcul auto de la caution)"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    className="w-full p-2.5 pr-8 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] focus:outline-none focus:ring-2 focus:ring-[#52796F] text-xs font-semibold text-[#2C2720]"
                  />
                  <span className="absolute right-3 top-2.5 text-[#8C8275] font-bold">€</span>
                </div>

                {/* CARTOUCHE DE TARIFICATION AUTOMATIQUE INTELLIGENTE */}
                <div className="mt-2 p-2.5 rounded-xl bg-[#E8F1EE] border border-[#52796F]/20 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#52796F] flex items-center justify-between">
                    <span>💡 Tarification suggérée (10-15% valeur)</span>
                    <span>Recommandé N7</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#2C2720]">
                    <span>Week-end entier : <span className="text-[#52796F] font-black">{currentPricing.weekend} €</span></span>
                    <span>Caution bloquée : <span className="text-[#52796F] font-black">{currentPricing.deposit} €</span></span>
                  </div>
                  <p className="text-[9px] text-[#52796F]/80">
                    Caution sécurisée sans prélèvement, restituée dès le check-in de fin.
                  </p>
                </div>
              </div>

              {/* CHAMP 5 : POINT DE RETRAIT CAMPUS */}
              <div>
                <label className="block font-bold text-[#2C2720] mb-1">
                  Lieu de passation habituel
                </label>
                <select
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-xs font-semibold text-[#2C2720]"
                >
                  <option value="Foyer des élèves N7">Foyer des élèves N7</option>
                  <option value="Résidence étudiante R1">Résidence étudiante R1</option>
                  <option value="Résidence étudiante R2">Résidence étudiante R2</option>
                  <option value="Cafétéria INP">Cafétéria INP</option>
                  <option value="Bâtiment A / B">Bâtiment A / B (devant TP)</option>
                </select>
              </div>

              {/* BOUTON DE PUBLICATION IMMÉDIATE (MT-3.1.1.5) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitSuccess}
                  className={`w-full py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    submitSuccess
                      ? 'bg-[#52796F] text-white'
                      : 'bg-[#D87D4A] hover:bg-[#C26B39] text-white'
                  }`}
                >
                  {submitSuccess ? (
                    <>
                      <i data-lucide="check" className="w-4 h-4"></i>
                      <span>Publié avec succès !</span>
                    </>
                  ) : (
                    <>
                      <i data-lucide="sparkles" className="w-4 h-4"></i>
                      <span>Publier mon objet sur le campus (1 clic)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
