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
  // S'ouvre sur les demandes reçues s'il y en a à traiter
  const [activeSection, setActiveSection] = useState(() =>
    window.CS.actions.todoFor(activeUserData.id).requests > 0 ? 'requests' : 'inventory'
  ); // 'inventory' | 'requests'

  // 2. MODALE D'AJOUT RAPIDE (< 60 secondes)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 3. ÉTAT DU FORMULAIRE D'AJOUT EXPRESS (< 60s)
  const [formData, setFormData] = useState({
    title: '',
    category: 'diy',
    estimatedValue: '', // Valeur d'achat / à neuf (€)
    pickupLocation: 'Foyer des élèves N7',
    condition: 'Très bon état',
    accessories: '' // Liste séparée par des virgules → checklist du retrait
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // 4. DONNÉES RÉELLES PARTAGÉES (règles du prêt : js/data/actions.js)
  // Tout est recalculé à chaque affichage depuis window.CS.data : une demande faite
  // dans Explorer apparaît ici, et l'acceptation débloque le QR de l'emprunteur.
  const myId = activeUserData.id;
  const allBookings = window.CS.data.bookings || [];

  // 5. MES OBJETS (ceux dont je suis propriétaire)
  const ownerItems = (window.CS.data.items || []).filter((it) => it.ownerId === myId);

  // Demandes reçues sur mes objets (en attente d'abord), au format affiché ci-dessous
  const timeAgo = (ts) => {
    if (!ts) return 'récemment';
    const min = Math.round((Date.now() - ts) / 60000);
    if (min < 1) return "à l'instant";
    if (min < 60) return `il y a ${min} min`;
    const h = Math.round(min / 60);
    return h < 24 ? `il y a ${h} h` : `il y a ${Math.round(h / 24)} j`;
  };
  const statusOrder = { pending: 0, confirmed: 1, in_progress: 2, declined: 3 };
  const pendingRequests = allBookings
    .filter((b) => b.ownerId === myId && b.status !== 'completed')
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
    .map((b) => ({
      id: b.id,
      itemTitle: b.itemTitle,
      renterName: b.renterName,
      renterPromo: b.renterPromo,
      renterAvatar: b.renterAvatar,
      periodLabel: b.periodLabel,
      offeredEarnings: Number(b.itemPrice),
      depositCoverage: b.depositAmount,
      pickupPlace: b.pickupLocation,
      status: b.status === 'pending' ? 'pending' : b.status === 'declined' ? 'declined' : 'accepted',
      step: b.step,
      createdAt: timeAgo(b.createdAt)
    }));

  // 6. GAINS : encaissés au retour de l'objet, « à venir » pour les prêts acceptés
  const sumPrices = (list) => Math.round(list.reduce((t, b) => t + Number(b.itemPrice || 0), 0) * 100) / 100;
  const totalEarnings = sumPrices(allBookings.filter((b) => b.ownerId === myId && b.status === 'completed'));
  const upcomingEarnings = sumPrices(allBookings.filter((b) => b.ownerId === myId && (b.status === 'confirmed' || b.status === 'in_progress')));

  // Statut affiché sur chaque objet
  const itemStatus = (item) => {
    const active = window.CS.actions.activeBookingForItem(item.id);
    if (active && active.status === 'in_progress') return { label: `Chez ${active.renterName}`, tone: 'orange' };
    if (active) return { label: 'Réservé', tone: 'orange' };
    if (allBookings.some((b) => b.itemId === item.id && b.status === 'pending')) return { label: 'Demande reçue', tone: 'orange' };
    return { label: 'Disponible', tone: 'green' };
  };

  const handleRemoveItem = (item) => {
    if (!window.confirm(`Retirer « ${item.title} » du catalogue ?`)) return;
    if (window.CS.actions.removeItem(item.id)) showToast('Objet retiré du catalogue.');
    else showToast("⚠️ Impossible : l'objet est réservé ou prêté en ce moment.");
  };

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
      // Photo réduite (600 px max, JPEG) : une photo de téléphone brute (3-5 Mo)
      // saturerait la sauvegarde du navigateur
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, 600 / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          setPhotoPreview(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.onerror = () => setPhotoError('Image illisible, essayez une autre photo.');
        img.src = event.target.result;
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

    const category = (window.CS.data.categories || []).find((c) => c.id === formData.category);
    const accessories = formData.accessories.split(',').map((a) => a.trim()).filter(Boolean);

    // Publié au nom de l'utilisateur connecté, visible tout de suite dans Explorer
    window.CS.actions.addItem({
      title: formData.title.trim(),
      category: formData.category,
      categoryLabel: category ? category.label : 'Bricolage & Déménagement',
      pricing: {
        perDay: pricing.perDay,
        weekendPackage: pricing.weekend,
        weeklyPackage: Math.round(pricing.weekend * 1.8)
      },
      depositAmount: pricing.deposit,
      image: photoPreview || defaultImages[formData.category] || defaultImages.diy,
      pickupLocation: formData.pickupLocation,
      condition: formData.condition,
      includedAccessories: accessories.length ? accessories : ['Objet complet, comme sur la photo'],
      specs: ['Matériel vérifié fonctionnel']
    }, activeUserData);

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
        condition: 'Très bon état',
        accessories: ''
      });
      setPhotoPreview(null);
    }, 1200);
  };

  // ✅ ACCEPTATION D'UNE DEMANDE EN 1 CLIC (MT-3.2.1.3) → l'emprunteur reçoit son QR
  const handleAcceptRequest = (request) => {
    window.CS.actions.acceptBooking(request.id);
    showToast(`✅ Acceptée ! ${request.renterName} reçoit son QR de retrait.`);
  };

  // ❌ REFUS POLI SANS BLOCAGE (MT-3.2.1.4)
  const handleDeclineRequest = (request) => {
    window.CS.actions.declineBooking(request.id);
    showToast(`Demande de ${request.renterName} déclinée. Rien n'est débité.`);
  };

  const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-4 pb-24 animate-fade-in text-left">
      {/* TOAST FLOTTANT DE NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-14 inset-x-0 mx-auto z-[60] !mt-0 w-[90%] max-w-sm bg-[#2C2720] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-white/10 animate-fade-in">
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
                src={activeUserData.avatar}
                alt={activeUserData.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#D87D4A]/40 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#52796F] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[#2C2720]">Espace Propriétaire</h3>
                <span className="px-1.5 py-0.5 rounded-full whitespace-nowrap text-[9px] font-black uppercase tracking-wider bg-[#D87D4A]/10 text-[#D87D4A] border border-[#D87D4A]/20">
                  {activeUserData.name.split(' ')[0]} • {activeUserData.promo.split(' ')[1]}
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
            <div className="mt-0.5">
              <span className="text-xl font-black text-[#52796F] whitespace-nowrap">{window.CS.formatPrice(totalEarnings)}</span>
              <span className="block text-[10px] text-[#8C8275] font-medium">
                {upcomingEarnings > 0 ? `+${window.CS.formatPrice(upcomingEarnings)} à venir` : 'Versés au retour des objets'}
              </span>
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
                      {(() => {
                        const st = itemStatus(item);
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0 border ${
                            st.tone === 'green'
                              ? 'bg-[#E8F1EE] text-[#52796F] border-[#52796F]/20'
                              : 'bg-[#FFF3EB] text-[#D87D4A] border-[#D87D4A]/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.tone === 'green' ? 'bg-[#52796F]' : 'bg-[#D87D4A]'}`}></span>
                            {st.label}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B6358]">
                      <span className="font-black text-[#2C2720]">{item.pricing?.weekendPackage || 10} €</span>
                      <span>/ WE</span>
                      <span>•</span>
                      <span>Caution : {item.depositAmount || 40} €</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1 text-[10px] text-[#8C8275]">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <i data-lucide="map-pin" className="w-3 h-3 text-[#D87D4A] flex-shrink-0"></i>
                        <span className="truncate">{item.pickupLocation || 'Foyer N7'}</span>
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="flex-shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#8C8275] hover:text-[#D87D4A] border border-[#EAE2D5]"
                      >
                        Retirer
                      </button>
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
                    +{window.CS.formatPrice(req.offeredEarnings)}
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
                      <span>Accepter (+{window.CS.formatPrice(req.offeredEarnings)})</span>
                    </button>
                  </div>
                ) : req.status === 'accepted' ? (
                  <div className="p-2.5 rounded-xl bg-[#E8F1EE] text-[#52796F] font-bold text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <i data-lucide="check-circle-2" className="w-4 h-4"></i>
                      {req.step === 3 ? `Objet chez ${req.renterName.split(' ')[0]}` : 'Acceptée • retrait à venir'}
                    </span>
                    <span className="text-[10px] font-semibold">
                      {req.step === 3 ? 'Payé au retour' : `${req.renterName.split(' ')[0]} a son QR`}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-gray-100 text-[#8C8275] text-[11px] font-semibold text-center">
                    Demande déclinée • rien n'a été débité
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MODALE FORMULAIRE EXPRESS EN MOINS DE 60s (MT-3.1.1.1 à MT-3.1.1.5) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 !mt-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-[400px] max-h-[92%] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EAE2D5] flex flex-col overflow-hidden animate-slide-up">
            
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

              {/* CHAMP 2 bis : ACCESSOIRES → checklist cochée au retrait et au retour */}
              <div>
                <label className="block font-bold text-[#2C2720] mb-1">
                  Accessoires inclus <span className="font-medium text-[#8C8275]">(séparés par des virgules)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : chargeur, 2 batteries, mallette"
                  value={formData.accessories}
                  onChange={(e) => setFormData({ ...formData, accessories: e.target.value })}
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
