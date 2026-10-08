// ==============================================================================
// 🎒 CampuShare — Vue BookingsView (Chantier C : Locations & Réservations 7j/7)
// Fichier : public/js/views/BookingsView.js
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.BookingsView = function BookingsView() {
  const bookings = window.CS.data.bookings || [];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-[#2C2720]">Mes Locations 7j/7</h3>
          <p className="text-[10px] text-[#6B6358]">Semaine, week-end ou multi-jours</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#E6EFE6] text-[#354F48] text-[9px] font-bold">
          {bookings.length} en cours
        </span>
      </div>

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="p-4 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#52796F] uppercase tracking-wider flex items-center gap-1">
              <i data-lucide="check-circle" className="w-3 h-3"></i>
              Confirmée & Sécurisée
            </span>
            <span className="text-[10px] text-[#8C8275] font-semibold">{booking.type}</span>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE2D5] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-[#2C2720]">{booking.itemTitle}</span>
              <span className="font-extrabold text-[#52796F]">{booking.itemPrice.toFixed(2)} €</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#6B6358]">
              <i data-lucide="clock" className="w-3 h-3 text-[#52796F]"></i>
              <span>{booking.periodLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#6B6358]">
              <i data-lucide="map-pin" className="w-3 h-3 text-[#D87D4A]"></i>
              <span>Retrait : {booking.pickupLocation}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1 text-[10px] text-[#354F48]">
              <i data-lucide="shield-check" className="w-3.5 h-3.5 text-[#52796F]"></i>
              <span>Caution {booking.depositAmount} € <strong>non débitée</strong></span>
            </div>
            <button
              onClick={() => alert(`Code de retrait pour ${booking.itemTitle} : CS-7749 (Présente ce QR au propriétaire lors de la passation)`)}
              className="px-3 py-1.5 rounded-xl bg-[#52796F] text-white text-[10px] font-bold shadow-xs hover:bg-[#43665D] transition"
            >
              Code Retrait QR
            </button>
          </div>
        </div>
      ))}

      {bookings.length === 0 && (
        <div className="p-6 text-center text-xs text-[#8C8275] bg-white rounded-3xl border border-[#EAE2D5]">
          <p className="font-bold text-[#2C2720]">Aucune location en cours</p>
          <p className="text-[11px] mt-1">Parcours l'onglet Explorer pour emprunter du matériel à tes camarades !</p>
        </div>
      )}
    </div>
  );
};
