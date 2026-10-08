// ==============================================================================
// 🎒 CampuShare — Composant CampusHeader (Identité, Rôles & Cagnotte)
// Fichier : public/js/components/CampusHeader.js
// ==============================================================================

window.CS = window.CS || {};
window.CS.components = window.CS.components || {};

window.CS.components.CampusHeader = function CampusHeader({
  activeUserData,
  activeNotification,
  setActiveNotification,
  userRole,
  setUserRole
}) {
  return (
    <header className="px-5 pt-3 pb-3 border-b border-[#EAE2D5] bg-white/95 backdrop-blur-md flex flex-col gap-2.5 flex-shrink-0 z-20 shadow-2xs">
      
      {/* Ligne Supérieure : Marque + Identité Étudiant */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={activeUserData.avatar}
              alt={activeUserData.name}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#52796F]/20 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#52796F] text-white flex items-center justify-center text-[9px] font-bold">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-[#2C2720] text-sm leading-tight">
                {activeUserData.name}
              </h2>
              <span className="px-1.5 py-0.2 rounded-md bg-[#E6EFE6] text-[#354F48] text-[9px] font-bold">
                Certifié
              </span>
            </div>
            <p className="text-[10px] text-[#6B6358] font-semibold">{activeUserData.promo}</p>
          </div>
        </div>

        {/* Notifications & Switcher de Rôle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveNotification(!activeNotification)}
            className="relative p-2 rounded-xl bg-[#FAF8F5] text-[#4A443A] hover:bg-[#F4EFE6] transition border border-[#EAE2D5]"
            title="Alertes de prêt"
          >
            <i data-lucide="bell" className="w-4 h-4 text-[#52796F]"></i>
            {activeNotification && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D87D4A] ring-2 ring-white"></span>
            )}
          </button>

          <div className="flex bg-[#FAF8F5] p-0.5 rounded-xl border border-[#EAE2D5]">
            <button
              onClick={() => setUserRole('renter')}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition ${
                userRole === 'renter'
                  ? 'bg-[#52796F] text-white shadow-xs'
                  : 'text-[#6B6358]'
              }`}
            >
              Emprunt
            </button>
            <button
              onClick={() => setUserRole('owner')}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition ${
                userRole === 'owner'
                  ? 'bg-[#D87D4A] text-white shadow-xs'
                  : 'text-[#6B6358]'
              }`}
            >
              Prêt
            </button>
          </div>
        </div>
      </div>

      {/* Ligne Inférieure : Widget Cagnotte & Garantie Cautions */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0EBE1] text-xs">
        <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] flex items-center justify-between">
          <div>
            <span className="text-[9px] text-[#8C8275] block font-semibold uppercase">Cagnotte dispo</span>
            <span className="font-extrabold text-sm text-[#2C2720]">
              {activeUserData.wallet.toFixed(2)} €
            </span>
          </div>
          <div className="w-7 h-7 rounded-xl bg-[#E6EFE6] text-[#52796F] flex items-center justify-center font-bold text-xs">
            💶
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] flex items-center justify-between">
          <div>
            <span className="text-[9px] text-[#8C8275] block font-semibold uppercase">Garantie Cautions</span>
            <span className="font-extrabold text-xs text-[#52796F] flex items-center gap-1">
              <span>0 litige</span>
              <span className="text-[10px] text-[#8C8275]">(100%)</span>
            </span>
          </div>
          <div className="w-7 h-7 rounded-xl bg-[#E6EFE6] text-[#354F48] flex items-center justify-center text-xs">
            🛡️
          </div>
        </div>
      </div>
    </header>
  );
};
