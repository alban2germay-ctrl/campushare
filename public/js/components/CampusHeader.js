// ==============================================================================
// 🎒 CampuShare — Composant CampusHeader (Identité, Rôles & Cagnotte)
// Fichier : public/js/components/CampusHeader.js
// ==============================================================================

window.CS = window.CS || {};
window.CS.components = window.CS.components || {};

window.CS.components.CampusHeader = function CampusHeader({
  currentTab,
  setCurrentTab,
  activeUserData,
  activeNotification,
  setActiveNotification,
  userRole,
  setUserRole
}) {
  const isOwnerMode = currentTab === 'items' || userRole === 'owner';

  return (
    <header className="px-5 pt-3 pb-2.5 border-b border-[#EAE2D5] bg-white/95 backdrop-blur-md flex flex-col gap-2 flex-shrink-0 z-20 shadow-2xs">
      
      {/* Ligne Supérieure : Marque, Identité & Mode Emprunt/Prêt */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={activeUserData.avatar}
              alt={activeUserData.name}
              className="w-9 h-9 rounded-2xl object-cover ring-2 ring-[#52796F]/20 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#52796F] text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-[#2C2720] text-xs leading-tight">
                {activeUserData.name}
              </h2>
              <span className="px-1.5 py-0.2 rounded-md bg-[#E6EFE6] text-[#354F48] text-[8px] font-bold">
                N7 Vérifié
              </span>
            </div>
            <p className="text-[10px] text-[#6B6358] font-semibold">{activeUserData.promo}</p>
          </div>
        </div>

        {/* Switcher & Cloche */}
        <div className="flex items-center gap-1.5">
          {/* Emprunter / Prêter : retiré d'ici, la barre du bas (Explorer / Mes Objets) fait déjà ce rôle, à portée de pouce */}

          <button
            onClick={() => setActiveNotification(!activeNotification)}
            className="relative p-1.5 rounded-xl bg-[#FAF8F5] text-[#4A443A] hover:bg-[#F4EFE6] transition border border-[#EAE2D5]"
            title="Alertes campus"
          >
            <i data-lucide="bell" className="w-3.5 h-3.5 text-[#52796F]"></i>
            {activeNotification && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D87D4A] ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </div>

      {/* Ligne Inférieure : Affichée en mode Propriétaire / Prêt pour ne pas encombrer l'emprunteur */}
      {isOwnerMode && (
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0EBE1] text-xs animate-fade-in">
          <div className="p-2 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] flex items-center justify-between">
            <div>
              <span className="text-[8px] text-[#8C8275] block font-semibold uppercase">Cagnotte dispo</span>
              <span className="font-extrabold text-xs text-[#2C2720]">
                {window.CS.formatPrice(activeUserData.wallet)}
              </span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-[#E6EFE6] text-[#52796F] flex items-center justify-center font-bold text-[10px]">
              💶
            </div>
          </div>

          <div className="p-2 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] flex items-center justify-between">
            <div>
              <span className="text-[8px] text-[#8C8275] block font-semibold uppercase">Garantie Cautions</span>
              <span className="font-extrabold text-[11px] text-[#52796F] flex items-center gap-1">
                <span>0 litige</span>
                <span className="text-[9px] text-[#8C8275]">(100%)</span>
              </span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-[#E6EFE6] text-[#354F48] flex items-center justify-center text-[10px]">
              🛡️
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
