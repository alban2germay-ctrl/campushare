// ==============================================================================
// 🎒 CampuShare — Vue BookingsView (Chantier C : Locations, Passations & Sécurité 7j/7)
// Fichier : public/js/views/BookingsView.js
// Spécialité : @agent-trust & @agent-renter (Toulouse INP - ENSEEIHT)
// Conforme à la Phase 4 du BOARD.md (MT-4.1.1.1 à MT-4.1.1.7)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.BookingsView = function BookingsView() {
  const { useState, useEffect } = React;

  // 1. ÉTAT DES SOUS-ONGLETS : "En cours (Actives)" vs "Historique (Terminées)"
  const [subTab, setSubTab] = useState('active'); // 'active' | 'history'

  // 2. MODALES & INTERACTIONS
  const [qrModalBooking, setQrModalBooking] = useState(null);
  const [contractModalBooking, setContractModalBooking] = useState(null); // MT-4.1.1.7 : Contrat instantané
  const [reviewModalBooking, setReviewModalBooking] = useState(null);     // MT-4.1.1.5 : Notation mutuelle 1 à 5 étoiles
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  const [checkedAccessories, setCheckedAccessories] = useState({});
  const [copyToast, setCopyToast] = useState(false);
  const [contactNotification, setContactNotification] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // 3. SYNCHRONISATION DYNAMIQUE DES DONNÉES DEPUIS window.CS.data.bookings
  const [bookingsList, setBookingsList] = useState(() => {
    return [...(window.CS.data.bookings || [])];
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronisation lors de mises à jour extérieures
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
  }, [subTab, qrModalBooking, contractModalBooking, reviewModalBooking, checkedAccessories, copyToast, contactNotification, bookingsList, toastMessage]);

  // Hash déterministe pour références & PINs
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  // Normalisation intelligente des réservations
  const normalizeBooking = (booking, index) => {
    const bookingRef =
      booking.bookingRef ||
      `CS-N7-2026-${String(Math.abs(hashString(booking.id || booking.itemTitle)) % 899 + 100)}`;

    const pinCode =
      booking.pinCode ||
      String(Math.abs(hashString(booking.itemTitle + bookingRef)) % 9000 + 1000);

    const ownerName = booking.ownerName || 'Mathys D.';
    const ownerPromo = booking.ownerPromo || '2A 3EA (Toulouse INP)';
    const ownerAvatar =
      booking.ownerAvatar ||
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80';
    const ownerPhone = booking.ownerPhone || '06 42 78 91 23';

    const accessories =
      booking.accessories || [
        'Câble d\'alimentation d\'origine',
        'Accessoires de base vérifiés',
        'Housse de transport propre'
      ];

    const isCompleted = booking.status === 'completed' || booking.step >= 4;

    return {
      ...booking,
      bookingRef,
      pinCode,
      ownerName,
      ownerPromo,
      ownerAvatar,
      ownerPhone,
      accessories,
      isCompleted
    };
  };

  const openQrModal = (booking) => {
    const initialChecks = {};
    booking.accessories.forEach((_, idx) => {
      initialChecks[idx] = true;
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

  // Avancement de l'étape du prêt
  const advanceBookingStep = (bookingId) => {
    const updated = bookingsList.map((b) => {
      if (b.id === bookingId) {
        const currentStep = b.step || 2;
        if (currentStep <= 2) {
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

    if (qrModalBooking && qrModalBooking.id === bookingId) {
      const match = updated.find((x) => x.id === bookingId);
      if (match) {
        setQrModalBooking(normalizeBooking(match, 0));
      }
    }
  };

  const handleContactOwner = (ownerName, phone) => {
    setContactNotification({
      name: ownerName,
      phone: phone,
      message: `Message envoyé à ${ownerName} : « Salut ! Je suis devant le lieu de retrait pour la passation de l'équipement CampuShare. »`
    });
    setTimeout(() => setContactNotification(null), 4000);
  };

  // ⭐ MT-4.1.1.5 : SOUMISSION DE LA NOTATION MUTUELLE
  const handleSaveReview = () => {
    if (!reviewModalBooking) return;
    const updated = bookingsList.map((b) => {
      if (b.id === reviewModalBooking.id) {
        return {
          ...b,
          ratingGiven: reviewRating,
          reviewComment: reviewComment || 'Matériel impeccable et camarade très arrangeant !'
        };
      }
      return b;
    });

    window.CS.data.bookings = updated;
    setBookingsList(updated);
    showToast(`⭐ Avis de ${reviewRating}/5 envoyé à ${reviewModalBooking.ownerName} !`);
    setReviewModalBooking(null);
    setReviewComment('');
    setReviewRating(5);
  };

  // Générateur vectoriel SVG de QR Code déterministe
  const renderQRCodeSVG = (bookingRef, pinCode) => {
    const size = 25;
    const seed = Math.abs(hashString(bookingRef + pinCode));

    const isCornerFinder = (r, c) => {
      if (r <= 6 && c <= 6) {
        if (r === 0 || r === 6 || c === 0 || c === 6) return true;
        if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
        return false;
      }
      if (r <= 6 && c >= 18) {
        const sc = c - 18;
        if (r === 0 || r === 6 || sc === 0 || sc === 6) return true;
        if (r >= 2 && r <= 4 && sc >= 2 && sc <= 4) return true;
        return false;
      }
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
        let filled = false;
        if (corner !== null) {
          filled = corner;
        } else {
          const pseudoVal = (seed * (r + 1) * 31 + (c + 1) * 17 + (r * c)) % 100;
          filled = pseudoVal > 50;
        }
        if (filled) {
          modules.push({ r, c });
        }
      }
    }

    const cellSize = 6;
    const totalDim = size * cellSize;

    return (
      <svg
        viewBox={`0 0 ${totalDim} ${totalDim}`}
        className="w-40 h-40 rounded-xl"
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect width={totalDim} height={totalDim} fill="#FFFFFF" />
        {modules.map(({ r, c }, idx) => (
          <rect
            key={idx}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#2C2720"
          />
        ))}
      </svg>
    );
  };

  const normalized = bookingsList.map(normalizeBooking);
  const activeBookings = normalized.filter((b) => !b.isCompleted);
  const historyBookings = normalized.filter((b) => b.isCompleted);
  const displayedBookings = subTab === 'active' ? activeBookings : historyBookings;

  return (
    <div className="space-y-4 pb-20 animate-fade-in text-left">
      {/* Toast de confirmation */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#2C2720] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-white/10 animate-bounce">
          <i data-lucide="check-circle" className="w-4 h-4 text-[#52796F]"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Notification de contact */}
      {contactNotification && (
        <div className="p-3 bg-[#E8F1EE] border border-[#52796F]/30 rounded-2xl text-xs text-[#52796F] font-medium animate-fade-in flex items-start gap-2 shadow-xs">
          <i data-lucide="send" className="w-4 h-4 mt-0.5 flex-shrink-0"></i>
          <div>
            <span className="font-extrabold">{contactNotification.name}</span> notifié(e) par SMS campus ({contactNotification.phone}) :
            <p className="text-[11px] text-[#2C2720] mt-0.5 italic">« Salut ! Je suis devant le lieu de retrait pour la passation. »</p>
          </div>
        </div>
      )}

      {/* 1. HEADER DU BOARDING PASS AVEC SOUS-ONGLETS */}
      <div className="p-4 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#52796F] text-white flex items-center justify-center font-black text-sm shadow-xs">
              🎫
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#2C2720]">Boarding Pass Campus</h3>
              <p className="text-[11px] text-[#6B6358]">Passations 7j/7 & Cautions levées à 0 €</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F1EE] text-[#52796F] border border-[#52796F]/20">
            N7 Certifié
          </span>
        </div>

        {/* Sous-onglets Actives vs Historique */}
        <div className="flex bg-[#FAF8F5] p-1 rounded-2xl border border-[#EAE2D5]">
          <button
            onClick={() => setSubTab('active')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'active'
                ? 'bg-[#52796F] text-white shadow-xs'
                : 'text-[#6B6358] hover:text-[#2C2720] hover:bg-white/60'
            }`}
          >
            <i data-lucide="activity" className="w-3.5 h-3.5"></i>
            <span>En cours ({activeBookings.length})</span>
          </button>
          <button
            onClick={() => setSubTab('history')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'history'
                ? 'bg-[#52796F] text-white shadow-xs'
                : 'text-[#6B6358] hover:text-[#2C2720] hover:bg-white/60'
            }`}
          >
            <i data-lucide="clock" className="w-3.5 h-3.5"></i>
            <span>Historique ({historyBookings.length})</span>
          </button>
        </div>
      </div>

      {/* 2. CARTES DE PASSATION */}
      <div className="space-y-2.5">
        {displayedBookings.map((booking) => {
          const isDone = booking.isCompleted;

          return (
            <div
              key={booking.id}
              className="rounded-2xl bg-white border border-[#EAE2D5] p-3.5 shadow-2xs hover:shadow-xs transition space-y-2.5"
            >
              {/* Header carte */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] font-bold text-[#8C8275] bg-[#FAF8F5] px-2 py-0.5 rounded-lg border border-[#EAE2D5]">
                  {booking.bookingRef}
                </span>
                {isDone ? (
                  <span className="text-[10px] font-bold text-[#52796F] bg-[#E8F1EE] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#52796F]/20">
                    ✓ Caution 0€ levée
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#D87D4A] bg-[#FFF3EB] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#D87D4A]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D87D4A] animate-ping"></span>
                    {booking.step === 3 ? 'En usage 7j/7' : 'À retirer'}
                  </span>
                )}
              </div>

              {/* Titre & Prix */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-xs text-[#2C2720] leading-snug">
                    {booking.itemTitle}
                  </h4>
                  <p className="text-[10px] text-[#6B6358] mt-0.5 flex items-center gap-1.5">
                    <span>📍 {booking.pickupLocation}</span>
                    <span>&bull;</span>
                    <span>Avec {booking.ownerName}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-extrabold text-[#52796F]">
                    {Number(booking.itemPrice).toFixed(2)} €
                  </span>
                  <span className="text-[9px] text-[#8C8275] block">
                    Caution {booking.depositAmount} €
                  </span>
                </div>
              </div>

              {/* Stepper horizontal épuré (MT-4.1.1.3) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-[#8C8275]">
                  <span>Progression</span>
                  <span className="text-[#52796F]">
                    {isDone ? 'Terminé (4/4)' : booking.step === 3 ? 'En usage (3/4)' : 'Retrait en attente (2/4)'}
                  </span>
                </div>
                <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden border border-[#EAE2D5]">
                  <div
                    className="bg-[#52796F] h-full transition-all duration-300 rounded-full"
                    style={{
                      width: isDone ? '100%' : booking.step === 3 ? '75%' : '50%'
                    }}
                  ></div>
                </div>
              </div>

              {/* Actions & Boutons (MT-4.1.1.5, MT-4.1.1.7) */}
              <div className="pt-1 space-y-1.5">
                {!isDone ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openQrModal(booking)}
                      className="flex-1 py-2 rounded-xl bg-[#52796F] text-white text-[11px] font-bold hover:bg-[#43665D] transition shadow-2xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <i data-lucide="qr-code" className="w-3.5 h-3.5"></i>
                      <span>QR Code & Check-in</span>
                    </button>
                    <button
                      onClick={() => setContractModalBooking(booking)}
                      className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-[#2C2720] text-[11px] font-bold hover:bg-gray-100 flex items-center gap-1"
                      title="Contrat de prêt PDF/Texte"
                    >
                      <i data-lucide="file-text" className="w-3.5 h-3.5 text-[#52796F]"></i>
                      <span>Contrat</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-full text-center text-[10px] text-[#6B6358] py-1 bg-[#FAF8F5] rounded-xl border border-[#EAE2D5] flex items-center justify-center gap-1.5">
                      <i data-lucide="shield-check" className="w-3 h-3 text-[#52796F]"></i>
                      <span>Restitution validée ({booking.returnedAt || 'Conforme'})</span>
                    </div>

                    <div className="flex gap-2">
                      {/* BOUTON NOTATION MUTUELLE (MT-4.1.1.5) */}
                      <button
                        onClick={() => {
                          setReviewModalBooking(booking);
                          setReviewRating(booking.ratingGiven || 5);
                          setReviewComment(booking.reviewComment || '');
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-[#FEF4E8] border border-[#D87D4A]/30 text-[#9A4C1E] text-[11px] font-bold hover:bg-[#FEEAD4] flex items-center justify-center gap-1.5"
                      >
                        <i data-lucide="star" className="w-3.5 h-3.5 text-[#D87D4A]"></i>
                        <span>{booking.ratingGiven ? `Noté ${booking.ratingGiven}★ (Modifier)` : 'Noter le camarade (1-5★)'}</span>
                      </button>

                      {/* BOUTON CONTRAT DE PRÊT (MT-4.1.1.7) */}
                      <button
                        onClick={() => setContractModalBooking(booking)}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-[#2C2720] text-[11px] font-bold hover:bg-gray-100 flex items-center gap-1"
                      >
                        <i data-lucide="file-check" className="w-3.5 h-3.5 text-[#52796F]"></i>
                        <span>Contrat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* ÉTAT VIDE */}
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

      {/* 3. MODALE "PASSEPORT QR CODE DE RETRAIT & CHECKLIST" */}
      {qrModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-4 space-y-3 shadow-2xl border border-[#EAE2D5] max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-[#E6EFE6] text-[#52796F] flex items-center justify-center text-[10px] font-bold">
                  🎫
                </span>
                <div>
                  <h3 className="font-extrabold text-xs text-[#2C2720]">Passation Campus</h3>
                  <p className="text-[9px] font-mono text-[#8C8275]">{qrModalBooking.bookingRef}</p>
                </div>
              </div>
              <button
                onClick={closeQrModal}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-xs font-bold border border-[#EAE2D5]"
              >
                ✕
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] flex items-center justify-between text-xs">
              <div>
                <h4 className="font-extrabold text-xs text-[#2C2720] leading-tight">
                  {qrModalBooking.itemTitle}
                </h4>
                <p className="text-[10px] text-[#6B6358] mt-0.5">
                  📍 {qrModalBooking.pickupLocation} &bull; {qrModalBooking.ownerName}
                </p>
              </div>
              <button
                onClick={() => handleContactOwner(qrModalBooking.ownerName, qrModalBooking.ownerPhone)}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE2D5] text-[#52796F] text-[10px] font-bold hover:bg-[#FAF8F5] flex items-center gap-1"
              >
                <i data-lucide="message-circle" className="w-3 h-3"></i>
                <span>Message</span>
              </button>
            </div>

            {/* QR CODE & PIN */}
            <div className="flex flex-col items-center justify-center py-1 space-y-2">
              <div className="p-2 bg-white rounded-2xl border border-[#EAE2D5] shadow-inner">
                {renderQRCodeSVG(qrModalBooking.bookingRef, qrModalBooking.pinCode)}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[10px] text-[#8C8275] font-bold">PIN :</span>
                <span className="font-mono font-extrabold text-[#2C2720] bg-[#FAF8F5] px-2.5 py-0.5 rounded-lg border border-[#EAE2D5] tracking-widest text-sm">
                  {qrModalBooking.pinCode}
                </span>
                <button
                  onClick={() => handleCopyPin(qrModalBooking.pinCode)}
                  className="text-[10px] text-[#52796F] font-bold hover:underline"
                >
                  {copyToast ? '✓ Copié' : 'Copier'}
                </button>
              </div>
            </div>

            {/* CHECKLIST DES ACCESSOIRES (MT-4.1.1.2) */}
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5 text-xs">
              <span className="text-[10px] font-extrabold uppercase text-[#6B6358] block">
                📋 Checklist contradictoire des accessoires :
              </span>
              <div className="space-y-1">
                {qrModalBooking.accessories.map((acc, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer text-[11px] text-[#2C2720]">
                    <input
                      type="checkbox"
                      checked={!!checkedAccessories[idx]}
                      onChange={() => toggleAccessory(idx)}
                      className="rounded border-[#EAE2D5] text-[#52796F] focus:ring-[#52796F]"
                    />
                    <span>{acc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* BOUTONS D'ACTION */}
            <div className="space-y-1.5 pt-1">
              {qrModalBooking.step <= 2 && (
                <button
                  onClick={() => advanceBookingStep(qrModalBooking.id)}
                  className="w-full py-2.5 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <i data-lucide="check" className="w-3.5 h-3.5"></i>
                  <span>Valider le Retrait & Check-in</span>
                </button>
              )}

              {qrModalBooking.step === 3 && (
                <button
                  onClick={() => {
                    advanceBookingStep(qrModalBooking.id);
                    setSubTab('history');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#354F48] text-white text-xs font-bold hover:bg-[#2C2720] transition shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
                  <span>Restituer le matériel (0 € débité)</span>
                </button>
              )}

              <button
                onClick={closeQrModal}
                className="w-full py-1.5 rounded-xl text-xs font-semibold text-[#8C8275] hover:text-[#2C2720] transition"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. MODALE CONTRAT DE PRÊT INSTANTANÉ (MT-4.1.1.7) */}
      {contractModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-4 space-y-3 shadow-2xl border border-[#EAE2D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D5]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E8F1EE] text-[#52796F] flex items-center justify-center text-xs font-bold">
                  📜
                </span>
                <div>
                  <h3 className="font-extrabold text-xs text-[#2C2720]">Contrat de Prêt CampuShare</h3>
                  <p className="text-[9px] font-mono text-[#8C8275]">{contractModalBooking.bookingRef}</p>
                </div>
              </div>
              <button
                onClick={() => setContractModalBooking(null)}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-xs font-bold border border-[#EAE2D5]"
              >
                ✕
              </button>
            </div>

            {/* Corps du contrat juridique simplifié N7 */}
            <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE2D5] space-y-2 text-[10px] text-[#6B6358] font-mono leading-relaxed">
              <div className="font-bold text-[#2C2720] text-[11px] pb-1 border-b border-[#EAE2D5]">
                CONVENTION DE PRÊT ENTRE ÉTUDIANTS N7
              </div>
              <div><strong>Objet :</strong> {contractModalBooking.itemTitle}</div>
              <div><strong>Propriétaire :</strong> {contractModalBooking.ownerName} ({contractModalBooking.ownerPromo})</div>
              <div><strong>Emprunteur :</strong> Alban D. (2A SN • Toulouse INP)</div>
              <div><strong>Période :</strong> 7j/7 • Lieu de retrait : {contractModalBooking.pickupLocation}</div>
              <div><strong>Montant location :</strong> {Number(contractModalBooking.itemPrice).toFixed(2)} € (Réglé)</div>
              <div><strong>Caution garantie :</strong> {contractModalBooking.depositAmount}.00 € (Empreinte non débitée)</div>
              <div className="p-2 bg-white rounded-xl border border-[#EAE2D5] text-[9px] text-[#52796F]">
                🛡️ En validant par QR Code ou PIN {contractModalBooking.pinCode}, les parties attestent du bon fonctionnement des accessoires contradictoires. En cas de litige, la médiation officielle du BDE ENSEEIHT fait foi.
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  showToast('📄 Contrat téléchargé au format texte !');
                  setContractModalBooking(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition flex items-center justify-center gap-1.5"
              >
                <i data-lucide="download" className="w-3.5 h-3.5"></i>
                <span>Télécharger la convention</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODALE NOTATION MUTUELLE (1 à 5 ÉTOILES) (MT-4.1.1.5) */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-4 space-y-3.5 shadow-2xl border border-[#EAE2D5]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D5]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FEF4E8] text-[#D87D4A] flex items-center justify-center text-xs font-bold">
                  ⭐
                </span>
                <h3 className="font-extrabold text-xs text-[#2C2720]">Évaluer le prêt de matériel</h3>
              </div>
              <button
                onClick={() => setReviewModalBooking(null)}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-xs font-bold border border-[#EAE2D5]"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-[#2C2720]">Comment s'est passée la location de :</p>
              <p className="text-xs text-[#52796F] font-black">{reviewModalBooking.itemTitle} avec {reviewModalBooking.ownerName}</p>
            </div>

            {/* Sélecteur d'étoiles 1 à 5 */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`text-2xl transition-all ${
                    star <= reviewRating ? 'text-[#D87D4A] scale-110' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Commentaire optionnel */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B6358] mb-1">
                Commentaire pour la réputation campus :
              </label>
              <textarea
                rows="2"
                placeholder="Matériel nickel, propriétaire super ponctuel au foyer..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-xs text-[#2C2720] focus:ring-2 focus:ring-[#52796F] focus:outline-none"
              ></textarea>
            </div>

            <button
              onClick={handleSaveReview}
              className="w-full py-2.5 rounded-xl bg-[#52796F] text-white text-xs font-extrabold shadow-xs hover:bg-[#43665D] transition active:scale-95"
            >
              Enregistrer l'évaluation
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
