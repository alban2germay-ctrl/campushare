// ==============================================================================
// 🎒 CampuShare — Vue BookingsView (Chantier C : Locations, Passations & Sécurité 7j/7)
// Fichier : public/js/views/BookingsView.js
// Spécialité : @agent-trust & @agent-renter (Toulouse INP - ENSEEIHT)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.BookingsView = function BookingsView() {
  const { useState, useEffect } = React;

  // 1. ÉTAT DES SOUS-ONGLETS : "En cours (Actives)" vs "Historique (Terminées)"
  const [subTab, setSubTab] = useState('active'); // 'active' | 'history'

  // 2. MODALE PASSEPORT QR CODE & CHECK-IN CONTRADICTOIRE
  const [qrModalBooking, setQrModalBooking] = useState(null);
  const [checkedAccessories, setCheckedAccessories] = useState({});
  const [copyToast, setCopyToast] = useState(false);
  const [contactNotification, setContactNotification] = useState(null);

  // 3. SYNCHRONISATION DYNAMIQUE DES DONNÉES DEPUIS window.CS.data.bookings
  const [bookingsList, setBookingsList] = useState(() => {
    return [...(window.CS.data.bookings || [])];
  });

  // Synchronisation lors de mises à jour extérieures (ex: nouvel emprunt depuis ExploreView)
  useEffect(() => {
    const syncBookings = () => {
      const current = window.CS.data.bookings || [];
      setBookingsList([...current]);
    };
    syncBookings();
    const interval = setInterval(syncBookings, 1000);
    return () => clearInterval(interval);
  }, []);

  // Déclencher les icônes Lucide à chaque mise à jour de l'affichage
  useEffect(() => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }, [subTab, qrModalBooking, checkedAccessories, copyToast, contactNotification, bookingsList]);

  // Normalisation intelligente des réservations (garantit bookingRef, pinCode, accessoires, stepper)
  const normalizeBooking = (booking, index) => {
    // Numéro officiel de réservation style Boarding Pass
    const bookingRef =
      booking.bookingRef ||
      `CS-N7-2026-${String(Math.abs(hashString(booking.id || booking.itemTitle)) % 899 + 100)}`;

    // Code PIN de secours à 4 chiffres
    const pinCode =
      booking.pinCode ||
      String(Math.abs(hashString(booking.itemTitle + bookingRef)) % 9000 + 1000);

    // Propriétaire et promo
    const ownerName = booking.ownerName || 'Mathys D.';
    const ownerPromo = booking.ownerPromo || '2A 3EA (Toulouse INP)';
    const ownerAvatar =
      booking.ownerAvatar ||
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80';
    const ownerPhone = booking.ownerPhone || '06 42 78 91 23';

    // Accessoires adaptés selon le matériel
    let defaultAccessories = [
      'Appareil complet avec tous ses composants',
      'Câble d\'alimentation ou chargeur d\'origine',
      'Propreté irréprochable vérifiée',
      'Fonctionnement testé ensemble'
    ];
    const titleLower = (booking.itemTitle || '').toLowerCase();
    if (titleLower.includes('raclette')) {
      defaultAccessories = [
        '8 poêlons antiadhésifs complets',
        '8 spatules en bois intactes',
        'Cordon d\'alimentation 2m',
        'Caquelon et plaque nettoyés'
      ];
    } else if (titleLower.includes('perceuse') || titleLower.includes('bosch')) {
      defaultAccessories = [
        'Batterie 18V Li-Ion 100% chargée',
        'Chargeur secteur rapide Bosch',
        'Boîte de 10 embouts & mèches métal',
        'Mallette de transport rigide'
      ];
    } else if (titleLower.includes('jbl') || titleLower.includes('enceinte')) {
      defaultAccessories = [
        'Câble d\'alimentation secteur officiel',
        'Microphone sans fil appairé',
        'Batterie testée à 100%',
        'Housse de transport étanche'
      ];
    } else if (titleLower.includes('tente') || titleLower.includes('quechua')) {
      defaultAccessories = [
        'Toile double-toit sans accroc',
        'Jeu de 3 arceaux en fibre souple',
        '12 sardines métalliques avec housse',
        'Sac de compression complet'
      ];
    } else if (titleLower.includes('crêpière') || titleLower.includes('crepiere')) {
      defaultAccessories = [
        '6 mini-spatules en bois',
        'Louche doseuse Tefal',
        'Cordon d\'alimentation amovible',
        'Plaque alvéolée dégraissée'
      ];
    }

    const accessories = booking.accessories || defaultAccessories;
    const status = booking.status || 'confirmed';
    const isCompleted = status === 'completed';
    const step = booking.step || (isCompleted ? 4 : 2);

    return {
      ...booking,
      bookingRef,
      pinCode,
      ownerName,
      ownerPromo,
      ownerAvatar,
      ownerPhone,
      accessories,
      status,
      isCompleted,
      step,
      pickupLocation: booking.pickupLocation || 'Foyer des élèves N7',
      depositAmount: booking.depositAmount || 40.0,
      itemPrice: booking.itemPrice || 6.0
    };
  };

  // Fonction de hachage simple et déterministe
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  // Séparation Actives vs Historique
  const allNormalized = bookingsList.map((b, idx) => normalizeBooking(b, idx));
  const activeBookings = allNormalized.filter((b) => !b.isCompleted);
  const historyBookings = allNormalized.filter((b) => b.isCompleted);

  const displayedBookings = subTab === 'active' ? activeBookings : historyBookings;

  // Gestion de la modale QR Code
  const openQrModal = (booking) => {
    // Initialiser les cases à cocher
    const initialChecks = {};
    booking.accessories.forEach((_, idx) => {
      initialChecks[idx] = true; // Pré-cochées pour fluidité campus
    });
    setCheckedAccessories(initialChecks);
    setQrModalBooking(booking);
  };

  const closeQrModal = () => {
    setQrModalBooking(null);
  };

  const toggleAccessory = (idx) => {
    setCheckedAccessories((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyPin = (pin) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pin);
    }
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  // Simulation d'avancement de l'étape du prêt (Check-in ou Restitution)
  const advanceBookingStep = (bookingId) => {
    const updated = bookingsList.map((b) => {
      if (b.id === bookingId) {
        const currentStep = b.step || 2;
        if (currentStep === 2) {
          return { ...b, step: 3, status: 'in_progress' };
        } else if (currentStep === 3) {
          return {
            ...b,
            step: 4,
            status: 'completed',
            returnedAt: "Aujourd'hui à " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            depositReleased: true
          };
        }
      }
      return b;
    });

    window.CS.data.bookings = updated;
    setBookingsList(updated);

    // Mettre à jour l'élément actif dans la modale
    if (qrModalBooking && qrModalBooking.id === bookingId) {
      const match = updated.find((x) => x.id === bookingId);
      if (match) {
        setQrModalBooking(normalizeBooking(match, 0));
      }
    }
  };

  // Contact du propriétaire
  const handleContactOwner = (ownerName, phone) => {
    setContactNotification({
      name: ownerName,
      phone: phone,
      message: `Message envoyé à ${ownerName} : « Salut ! Je suis devant le lieu de retrait pour la passation de l'équipement CampuShare. »`
    });
    setTimeout(() => setContactNotification(null), 4000);
  };

  // Générateur vectoriel SVG de QR Code déterministe haute fidélité
  const renderQRCodeSVG = (bookingRef, pinCode) => {
    const size = 25; // Matrice 25x25 modules
    const seed = Math.abs(hashString(bookingRef + pinCode));

    const isCornerFinder = (r, c) => {
      // Top-Left (0..6, 0..6)
      if (r <= 6 && c <= 6) {
        if (r === 0 || r === 6 || c === 0 || c === 6) return true;
        if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
        return false;
      }
      // Top-Right (0..6, 18..24)
      if (r <= 6 && c >= 18) {
        const sc = c - 18;
        if (r === 0 || r === 6 || sc === 0 || sc === 6) return true;
        if (r >= 2 && r <= 4 && sc >= 2 && sc <= 4) return true;
        return false;
      }
      // Bottom-Left (18..24, 0..6)
      if (r >= 18 && c <= 6) {
        const sr = r - 18;
        if (sr === 0 || sr === 6 || c === 0 || c === 6) return true;
        if (sr >= 2 && sr <= 4 && c >= 2 && c <= 4) return true;
        return false;
      }
      return null;
    };

    const modules = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const corner = isCornerFinder(r, c);
        if (corner !== null) {
          if (corner) modules.push({ r, c });
        } else if (r >= 10 && r <= 14 && c >= 10 && c <= 14) {
          // Zone réservée pour le logo central N7
          continue;
        } else if (r === 6 || c === 6) {
          // Lignes de synchronisation temporelle
          if ((r + c) % 2 === 0) modules.push({ r, c });
        } else {
          // Remplissage pseudo-aléatoire déterministe
          const val = (seed * (r + 1) * 31 + (c + 1) * 17 + (r ^ c)) % 100;
          if (val > 44) modules.push({ r, c });
        }
      }
    }

    const cellSize = 8;
    const totalDim = size * cellSize;

    return (
      <div className="relative p-3 bg-white rounded-2xl shadow-inner border border-[#EAE2D5] flex items-center justify-center">
        {/* Viseurs d'angles du scanner */}
        <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#52796F] rounded-tl-sm pointer-events-none"></div>
        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#52796F] rounded-tr-sm pointer-events-none"></div>
        <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#52796F] rounded-bl-sm pointer-events-none"></div>
        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#52796F] rounded-br-sm pointer-events-none"></div>

        <svg
          viewBox={`0 0 ${totalDim} ${totalDim}`}
          className="w-48 h-48 sm:w-56 sm:h-56 select-none"
          shapeRendering="crispEdges"
        >
          {/* Modules du QR Code */}
          {modules.map((m, i) => (
            <rect
              key={i}
              x={m.c * cellSize}
              y={m.r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#2C2720"
            />
          ))}

          {/* Badge central N7 officiel */}
          <rect
            x={10 * cellSize - 1}
            y={10 * cellSize - 1}
            width={5 * cellSize + 2}
            height={5 * cellSize + 2}
            rx={4}
            fill="#FAF8F5"
            stroke="#52796F"
            strokeWidth="1.5"
          />
          <text
            x={totalDim / 2}
            y={totalDim / 2 + 3}
            textAnchor="middle"
            fill="#52796F"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="900"
          >
            N7
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in pb-6">
      
      {/* Toast de notification contact propriétaire */}
      {contactNotification && (
        <div className="p-3 rounded-2xl bg-[#2C2720] text-white text-xs shadow-lg animate-fade-in flex items-start justify-between gap-2 border border-white/10">
          <div className="flex items-start gap-2">
            <span className="text-base">💬</span>
            <div>
              <p className="font-extrabold text-[#FAF8F5] text-[11px]">
                Message envoyé à {contactNotification.name}
              </p>
              <p className="text-[10px] text-white/80 mt-0.5 leading-snug">
                {contactNotification.message}
              </p>
              <p className="text-[9px] text-[#52796F] font-bold mt-1">
                Numéro direct : {contactNotification.phone}
              </p>
            </div>
          </div>
          <button
            onClick={() => setContactNotification(null)}
            className="text-white/60 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. ENCADRÉ VERT RASSURANT : GARANTIE CAUTION CAMPUS TOULOUSE INP */}
      <div className="p-3.5 rounded-3xl bg-[#E6EFE6] border border-[#52796F]/30 text-[#354F48] shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#52796F] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
            <i data-lucide="shield-check" className="w-4 h-4"></i>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#52796F] block">
              Protection Totale Étudiant N7
            </span>
            <h4 className="font-extrabold text-xs text-[#2C2720] leading-tight">
              Garantie Séquestre & Caution 0 € Débité
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white text-[#354F48] text-[9px] font-extrabold border border-[#52796F]/20">
            0,00 € Prélévé
          </span>
        </div>

        <p className="text-[11px] leading-relaxed text-[#354F48] font-medium">
          « Empreinte bancaire de pré-autorisation <strong>non débitée (0,00 € prélevé)</strong>. Levée automatique et intégrale dès confirmation du retour contradictoire. »
        </p>

        <div className="flex items-center gap-3 pt-1 border-t border-[#52796F]/15 text-[10px] text-[#52796F] font-semibold">
          <span className="flex items-center gap-1">
            <i data-lucide="check" className="w-3 h-3"></i> 0 litige sur le campus
          </span>
          <span className="flex items-center gap-1">
            <i data-lucide="lock" className="w-3 h-3"></i> Échanges sécurisés
          </span>
          <span className="flex items-center gap-1">
            <i data-lucide="sparkles" className="w-3 h-3"></i> Prêt solidaire 7j/7
          </span>
        </div>
      </div>

      {/* 1. SÉLECTEUR DE SOUS-ONGLETS : "En cours (Actives)" vs "Historique (Terminées)" */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-[#2C2720]">Mes Billets de Passation</h3>
            <p className="text-[10px] text-[#6B6358]">Retraits, check-ins et restitutions 7j/7</p>
          </div>
          <span className="text-[10px] font-bold text-[#8C8275]">
            Total : {allNormalized.length}
          </span>
        </div>

        {/* Barre de commutation des 2 sous-onglets */}
        <div className="p-1 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] flex gap-1 shadow-2xs">
          <button
            onClick={() => setSubTab('active')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'active'
                ? 'bg-[#52796F] text-white shadow-xs'
                : 'text-[#6B6358] hover:text-[#2C2720] hover:bg-white/60'
            }`}
          >
            <i data-lucide="ticket" className="w-3.5 h-3.5"></i>
            <span>En cours (Actives)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                subTab === 'active'
                  ? 'bg-white text-[#52796F]'
                  : 'bg-[#EAE2D5] text-[#6B6358]'
              }`}
            >
              {activeBookings.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'history'
                ? 'bg-[#52796F] text-white shadow-xs'
                : 'text-[#6B6358] hover:text-[#2C2720] hover:bg-white/60'
            }`}
          >
            <i data-lucide="clock" className="w-3.5 h-3.5"></i>
            <span>Historique (Terminées)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                subTab === 'history'
                  ? 'bg-white text-[#52796F]'
                  : 'bg-[#EAE2D5] text-[#6B6358]'
              }`}
            >
              {historyBookings.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. BILLET DE PASSATION NUMÉRIQUE STYLE "BOARDING PASS" CAMPUS */}
      <div className="space-y-4">
        {displayedBookings.map((booking) => {
          const isDone = booking.isCompleted;

          return (
            <div
              key={booking.id}
              className="relative rounded-3xl bg-white border border-[#EAE2D5] shadow-sm overflow-hidden transition hover:border-[#52796F]/40"
            >
              {/* EN-TÊTE DU BILLET BOARDING PASS */}
              <div className="bg-gradient-to-r from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5] px-4 py-2.5 border-b border-[#EAE2D5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-[#52796F] text-white flex items-center justify-center text-[10px] font-bold">
                    🎫
                  </span>
                  <div>
                    <span className="text-[9px] font-bold text-[#8C8275] uppercase block leading-none">
                      Boarding Pass Campus N7
                    </span>
                    <span className="font-mono font-extrabold text-[#2C2720] text-xs">
                      {booking.bookingRef}
                    </span>
                  </div>
                </div>

                {isDone ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#E6EFE6] text-[#354F48] text-[9px] font-extrabold flex items-center gap-1 border border-[#52796F]/20">
                    <i data-lucide="check" className="w-3 h-3 text-[#52796F]"></i>
                    Terminée & Caution levée
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#E6EFE6] text-[#354F48] text-[9px] font-extrabold flex items-center gap-1 border border-[#52796F]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#52796F] animate-ping"></span>
                    {booking.step === 3 ? 'Utilisation 7j/7' : 'Prêt confirmé'}
                  </span>
                )}
              </div>

              {/* CORPS PRINCIPAL : DÉTAILS DU PRÊT */}
              <div className="p-4 space-y-3">
                
                {/* Ligne 1 : Équipement & Tarif */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-[#52796F] uppercase tracking-wider block">
                      {booking.itemCategory || 'Matériel Étudiant'} &bull; {booking.type || 'Formule 7j/7'}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#2C2720] leading-snug">
                      {booking.itemTitle}
                    </h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-extrabold text-[#2C2720] block">
                      {Number(booking.itemPrice).toFixed(2)} €
                    </span>
                    <span className="text-[9px] text-[#8C8275] font-semibold">
                      Caution {booking.depositAmount} €
                    </span>
                  </div>
                </div>

                {/* Trajet & Lieux Campus (Style Itinéraire Vol / Passation) */}
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#2C2720] font-semibold">
                      <i data-lucide="map-pin" className="w-3.5 h-3.5 text-[#D87D4A]"></i>
                      <span>Retrait : <strong>{booking.pickupLocation}</strong></span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-[#EAE2D5] text-[#52796F]">
                      INP ENSEEIHT
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#6B6358]">
                    <i data-lucide="clock" className="w-3.5 h-3.5 text-[#52796F]"></i>
                    <span>Créneau : {booking.periodLabel}</span>
                  </div>

                  {/* Propriétaire certifié */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#EAE2D5]/70 text-[10px]">
                    <div className="flex items-center gap-2">
                      <img
                        src={booking.ownerAvatar}
                        alt={booking.ownerName}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-[#52796F]/30"
                      />
                      <span className="text-[#2C2720] font-bold">
                        Prêté par {booking.ownerName}
                      </span>
                      <span className="text-[#8C8275]">({booking.ownerPromo})</span>
                    </div>

                    {!isDone && (
                      <button
                        onClick={() => handleContactOwner(booking.ownerName, booking.ownerPhone)}
                        className="text-[9px] font-bold text-[#52796F] hover:underline flex items-center gap-1"
                      >
                        <i data-lucide="message-circle" className="w-3 h-3"></i>
                        Contacter
                      </button>
                    )}
                  </div>
                </div>

                {/* DÉCOUPE / PERFORATION DU TICKET BOARDING PASS */}
                <div className="relative py-1 flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-[#EAE2D5]"></div>
                  {/* Encoches latérales de billet découpé */}
                  <div className="absolute -left-6 w-4 h-4 rounded-full bg-[#FAF8F5] border-r border-[#EAE2D5]"></div>
                  <div className="absolute -right-6 w-4 h-4 rounded-full bg-[#FAF8F5] border-l border-[#EAE2D5]"></div>
                </div>

                {/* STEPPER HORIZONTAL DE PROGRESSION DU PRÊT (4 ÉTAPES) */}
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold text-[#2C2720] uppercase tracking-wider text-[9px]">
                      Progression de la passation :
                    </span>
                    <span className="font-bold text-[#52796F] text-[9px]">
                      {isDone
                        ? '4/4 Restitué (100%)'
                        : booking.step === 3
                        ? '3/4 En cours d\'usage'
                        : '2/4 Check-in à effectuer'}
                    </span>
                  </div>

                  {/* Barre visuelle du Stepper */}
                  <div className="relative flex items-center justify-between">
                    {/* Ligne d'arrière-plan */}
                    <div className="absolute left-3 right-3 top-3 -translate-y-1/2 h-0.5 bg-[#EAE2D5] z-0"></div>
                    {/* Ligne d'avancement verte */}
                    <div
                      className="absolute left-3 top-3 -translate-y-1/2 h-0.5 bg-[#52796F] transition-all duration-300 z-0"
                      style={{
                        width: isDone
                          ? 'calc(100% - 24px)'
                          : booking.step === 3
                          ? '66%'
                          : '33%'
                      }}
                    ></div>

                    {/* Étape 1 : Réservation confirmée */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#52796F] text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                        ✓
                      </div>
                      <span className="text-[8px] font-bold text-[#2C2720] text-center mt-1 w-14 leading-tight">
                        Réservation confirmée
                      </span>
                    </div>

                    {/* Étape 2 : Retrait & Check-in */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                          booking.step >= 2
                            ? booking.step > 2 || isDone
                              ? 'bg-[#52796F] text-white shadow-2xs'
                              : 'bg-[#52796F] text-white ring-4 ring-[#52796F]/20'
                            : 'bg-white border-2 border-[#EAE2D5] text-[#8C8275]'
                        }`}
                      >
                        {booking.step > 2 || isDone ? '✓' : '2'}
                      </div>
                      <span className="text-[8px] font-bold text-[#2C2720] text-center mt-1 w-14 leading-tight">
                        Retrait & Check-in
                      </span>
                    </div>

                    {/* Étape 3 : Utilisation 7j/7 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                          booking.step >= 3
                            ? isDone
                              ? 'bg-[#52796F] text-white shadow-2xs'
                              : 'bg-[#52796F] text-white ring-4 ring-[#52796F]/20'
                            : 'bg-white border-2 border-[#EAE2D5] text-[#8C8275]'
                        }`}
                      >
                        {isDone ? '✓' : '3'}
                      </div>
                      <span className="text-[8px] font-bold text-[#2C2720] text-center mt-1 w-14 leading-tight">
                        Utilisation 7j/7
                      </span>
                    </div>

                    {/* Étape 4 : Restitution & Caution levée */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                          isDone
                            ? 'bg-[#52796F] text-white shadow-2xs'
                            : 'bg-white border-2 border-[#EAE2D5] text-[#8C8275]'
                        }`}
                      >
                        {isDone ? '✓' : '4'}
                      </div>
                      <span className="text-[8px] font-bold text-[#2C2720] text-center mt-1 w-16 leading-tight">
                        Restitution & 0€ débité
                      </span>
                    </div>
                  </div>
                </div>

                {/* PIED DU BILLET : ACTIONS & STATUT CAUTION */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#F0EBE1]">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#354F48]">
                    <i data-lucide="shield-check" className="w-3.5 h-3.5 text-[#52796F]"></i>
                    <span>
                      Caution {booking.depositAmount} € <strong>non débitée</strong>
                    </span>
                  </div>

                  {!isDone ? (
                    <button
                      onClick={() => openQrModal(booking)}
                      className="px-3.5 py-2 rounded-xl bg-[#52796F] text-white text-[11px] font-extrabold hover:bg-[#43665D] transition shadow-xs flex items-center gap-1.5"
                    >
                      <i data-lucide="qr-code" className="w-3.5 h-3.5"></i>
                      <span>Afficher le QR Code de retrait</span>
                    </button>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#52796F] flex items-center gap-1 justify-end">
                        <i data-lucide="check-circle" className="w-3 h-3"></i>
                        Caution levée
                      </span>
                      <span className="text-[9px] text-[#8C8275] block">
                        {booking.returnedAt || 'Restitution 100% conforme'}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {/* ÉTAT VIDE SI AUCUNE RÉSERVATION DANS LE SOUS-ONGLET */}
        {displayedBookings.length === 0 && (
          <div className="p-8 text-center text-xs text-[#8C8275] bg-white rounded-3xl border border-[#EAE2D5] space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] text-[#52796F] flex items-center justify-center text-xl mx-auto border border-[#EAE2D5]">
              {subTab === 'active' ? '🎫' : '📦'}
            </div>
            <h4 className="font-extrabold text-[#2C2720] text-sm">
              {subTab === 'active'
                ? 'Aucune passation active en ce moment'
                : 'Aucun historique de location pour le moment'}
            </h4>
            <p className="text-[11px] max-w-xs mx-auto leading-relaxed">
              {subTab === 'active'
                ? 'Choisis un équipement dans l\'onglet Explorer pour le réserver et obtenir instantanément ton billet de passation QR Code !'
                : 'Tes prêts terminés et attestations de caution levée s\'archiveront automatiquement ici.'}
            </p>
          </div>
        )}
      </div>

      {/* 3. MODALE INTERACTIVE "PASSEPORT QR CODE DE RETRAIT & CHECK-IN" */}
      {qrModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-[#EAE2D5] max-h-[92vh] overflow-y-auto">
            
            {/* Header de la Modale */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E6EFE6] text-[#52796F] flex items-center justify-center text-xs font-bold">
                  🛡️
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-[#2C2720] leading-tight">
                    Passeport QR de Retrait
                  </h3>
                  <p className="text-[10px] text-[#6B6358]">
                    Toulouse INP • ENSEEIHT &bull; Réf : {qrModalBooking.bookingRef}
                  </p>
                </div>
              </div>
              <button
                onClick={closeQrModal}
                className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-sm font-bold border border-[#EAE2D5]"
              >
                ✕
              </button>
            </div>

            {/* Fiche Objet résumé */}
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-[#52796F] uppercase block">
                  {qrModalBooking.itemCategory || 'Équipement'} &bull; Retrait à {qrModalBooking.pickupLocation}
                </span>
                <h4 className="font-extrabold text-xs text-[#2C2720] truncate">
                  {qrModalBooking.itemTitle}
                </h4>
              </div>
              <span className="px-2 py-1 rounded-xl bg-white border border-[#EAE2D5] text-[#2C2720] font-mono text-[10px] font-extrabold flex-shrink-0">
                {qrModalBooking.bookingRef}
              </span>
            </div>

            {/* GRAND QR CODE VECTORIEL / SVG */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              {renderQRCodeSVG(qrModalBooking.bookingRef, qrModalBooking.pinCode)}
              <p className="text-[11px] text-[#6B6358] font-medium">
                Présente ce QR Code à <strong>{qrModalBooking.ownerName}</strong> lors de la passation physique.
              </p>
            </div>

            {/* CODE PIN DE SECOURS À 4 CHIFFRES */}
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2 text-center">
              <span className="text-[10px] font-extrabold text-[#8C8275] uppercase tracking-wider block">
                Code PIN de Secours à 4 Chiffres
              </span>

              <div className="flex items-center justify-center gap-2">
                {qrModalBooking.pinCode.split('').map((digit, i) => (
                  <span
                    key={i}
                    className="w-10 h-11 rounded-xl bg-white border-2 border-[#52796F]/30 text-[#2C2720] text-lg font-mono font-extrabold flex items-center justify-center shadow-xs"
                  >
                    {digit}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <p className="text-[10px] text-[#6B6358]">
                  À communiquer au propriétaire si le scanner optique est indisponible.
                </p>
                <button
                  onClick={() => handleCopyPin(qrModalBooking.pinCode)}
                  className="text-[10px] font-bold text-[#52796F] hover:underline flex items-center gap-0.5"
                >
                  <i data-lucide="copy" className="w-3 h-3"></i>
                  {copyToast ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>

            {/* CHECKLIST DES ACCESSOIRES À VÉRIFIER ENSEMBLE */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE2D5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#2C2720] text-[11px] flex items-center gap-1.5">
                  <i data-lucide="check-circle" className="w-3.5 h-3.5 text-[#52796F]"></i>
                  Checklist de passation contradictoire :
                </span>
                <span className="text-[10px] font-bold text-[#52796F]">
                  {Object.values(checkedAccessories).filter(Boolean).length} / {qrModalBooking.accessories.length}
                </span>
              </div>

              <p className="text-[10px] text-[#6B6358]">
                Vérifiez ensemble ces éléments avant de valider le prêt :
              </p>

              <div className="space-y-1.5 pt-1">
                {qrModalBooking.accessories.map((acc, idx) => (
                  <label
                    key={idx}
                    onClick={() => toggleAccessory(idx)}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                      checkedAccessories[idx]
                        ? 'bg-[#E6EFE6]/70 border-[#52796F]/40 text-[#2C2720]'
                        : 'bg-[#FAF8F5] border-[#EAE2D5] text-[#8C8275]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold transition ${
                        checkedAccessories[idx]
                          ? 'bg-[#52796F] text-white'
                          : 'border border-[#8C8275] bg-white'
                      }`}
                    >
                      {checkedAccessories[idx] && '✓'}
                    </div>
                    <span className="text-[11px] font-semibold">{acc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* CONTACT PROPRIÉTAIRE */}
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={qrModalBooking.ownerAvatar}
                  alt={qrModalBooking.ownerName}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#52796F]/20"
                />
                <div>
                  <h5 className="font-extrabold text-[#2C2720] text-[11px]">
                    {qrModalBooking.ownerName}
                  </h5>
                  <p className="text-[10px] text-[#6B6358]">{qrModalBooking.ownerPromo}</p>
                </div>
              </div>

              <button
                onClick={() => handleContactOwner(qrModalBooking.ownerName, qrModalBooking.ownerPhone)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE2D5] text-[#2C2720] text-[10px] font-bold hover:bg-[#FAF8F5] transition flex items-center gap-1 shadow-2xs"
              >
                <i data-lucide="phone" className="w-3 h-3 text-[#52796F]"></i>
                <span>Contacter</span>
              </button>
            </div>

            {/* BOUTON D'ACTION INTERACTIF (SIMULATION CHECK-IN / RESTITUTION) */}
            <div className="space-y-2 pt-1">
              {qrModalBooking.step === 2 && (
                <button
                  onClick={() => advanceBookingStep(qrModalBooking.id)}
                  className="w-full py-3 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-xs flex items-center justify-center gap-2"
                >
                  <i data-lucide="check" className="w-4 h-4"></i>
                  <span>Valider le Retrait & Check-in (Jour J)</span>
                </button>
              )}

              {qrModalBooking.step === 3 && (
                <button
                  onClick={() => {
                    advanceBookingStep(qrModalBooking.id);
                    setSubTab('history');
                  }}
                  className="w-full py-3 rounded-xl bg-[#354F48] text-white text-xs font-bold hover:bg-[#2C2720] transition shadow-xs flex items-center justify-center gap-2"
                >
                  <i data-lucide="shield-check" className="w-4 h-4"></i>
                  <span>Restituer l'équipement & Libérer la Caution (0 €)</span>
                </button>
              )}

              <button
                onClick={closeQrModal}
                className="w-full py-2.5 rounded-xl bg-[#FAF8F5] text-[#6B6358] text-xs font-bold hover:bg-[#EAE2D5] transition"
              >
                Fermer le passeport
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
