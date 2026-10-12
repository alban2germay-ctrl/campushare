// ==============================================================================
// 🎒 CampuShare — Composant BottomNav (Barre Tactile 4 Onglets 7j/7)
// Fichier : public/js/components/BottomNav.js
// ==============================================================================

window.CS = window.CS || {};
window.CS.components = window.CS.components || {};

window.CS.components.BottomNav = function BottomNav({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'explore', label: 'Explorer', icon: 'compass', title: 'Explorer le matériel 7j/7' },
    { id: 'items', label: 'Mes Objets', icon: 'package', title: 'Gérer mon matériel en prêt' },
    { id: 'bookings', label: 'Locations', icon: 'calendar', title: 'Mes locations 7j/7' },
    { id: 'profile', label: 'Compte', icon: 'user', title: 'Mon profil certifié N7' }
  ];

  return (
    <nav className="border-t border-[#EAE2D5] bg-white/95 backdrop-blur-md px-2 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] flex items-center justify-around flex-shrink-0 z-20 shadow-sm">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 transition ${
              isActive
                ? 'text-[#52796F] font-bold'
                : 'text-[#8C8275] font-semibold hover:text-[#2C2720]'
            }`}
            title={tab.title}
          >
            <i data-lucide={tab.icon} className="w-5 h-5"></i>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
