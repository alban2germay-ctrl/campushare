// ==============================================================================
// 🎒 CampuShare — Application Principale (Orchestrateur Modulaire)
// Fichier : public/js/app.js
// ==============================================================================

const { useState, useEffect } = React;

function App() {
  const [currentTab, setCurrentTab] = useState('explore');
  const [deviceMode, setDeviceMode] = useState('iphone'); // 'iphone' (390px) | 'pixel' (412px) | 'fullscreen'
  const [currentUser, setCurrentUser] = useState('alban'); // 'alban' ou 'mathys'
  const [userRole, setUserRole] = useState('renter'); // 'renter' (Emprunteur) ou 'owner' (Propriétaire)
  const [activeNotification, setActiveNotification] = useState(true);

  const users = window.CS.data.users;
  const activeUserData = users[currentUser];

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [currentTab, deviceMode, currentUser, userRole, activeNotification]);

  // Calcul des largeurs selon le mode choisi par les directeurs
  const getDeviceContainerClass = () => {
    if (deviceMode === 'fullscreen') {
      return 'w-full h-full rounded-none shadow-none border-none';
    }
    if (deviceMode === 'pixel') {
      return 'w-full h-full sm:h-[860px] sm:max-w-[412px] sm:rounded-[40px] sm:shadow-2xl sm:ring-8 sm:ring-black/15 border border-[#EAE2D5]';
    }
    // iPhone 15 Pro par défaut
    return 'w-full h-full sm:h-[844px] sm:max-w-[390px] sm:rounded-[48px] sm:shadow-2xl sm:ring-8 sm:ring-black/15 border border-[#EAE2D5]';
  };

  const StudioBar = window.CS.components.StudioBar;
  const CampusHeader = window.CS.components.CampusHeader;
  const BottomNav = window.CS.components.BottomNav;
  const ExploreView = window.CS.views.ExploreView;
  const ItemsView = window.CS.views.ItemsView;
  const BookingsView = window.CS.views.BookingsView;
  const ProfileView = window.CS.views.ProfileView;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* 1. BARRE D'OUTILS DIRECTIONNELLE (Visible sur PC / Mac pour Alban & Mathys) */}
      <StudioBar
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
      />

      {/* 2. CONTENEUR DE L'APPLICATION SMARTPHONE */}
      <div className={`relative bg-[#FAF8F5] overflow-hidden flex flex-col transition-all duration-300 ${getDeviceContainerClass()}`}>
        
        {/* STATUS BAR SYSTÈME (Encoche ou Dynamic Island) */}
        <div className="pt-2 px-6 flex items-center justify-between text-xs font-semibold text-[#2C2720] flex-shrink-0 select-none">
          <span>09:41</span>
          {deviceMode !== 'fullscreen' && (
            <div className="w-24 h-4 bg-[#2C2720] rounded-full mx-auto"></div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-[#2C2720]">
            <i data-lucide="wifi" className="w-3.5 h-3.5"></i>
            <i data-lucide="battery" className="w-4 h-4"></i>
          </div>
        </div>

        {/* HEADER MOBILE CAMPUS & SOLDE CAGNOTTE */}
        <CampusHeader
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeUserData={activeUserData}
          activeNotification={activeNotification}
          setActiveNotification={setActiveNotification}
          userRole={userRole}
          setUserRole={setUserRole}
        />

        {/* CORPS TACTILE SCROLLABLE MULTI-ÉCRANS */}
        <main className="flex-1 overflow-y-auto mobile-scroll-container p-4 space-y-4">
          {currentTab === 'explore' && (
            <ExploreView
              onNavigateTab={setCurrentTab}
              activeUserData={activeUserData}
              currentUser={currentUser}
            />
          )}
          {currentTab === 'items' && <ItemsView activeUserData={activeUserData} currentUser={currentUser} />}
          {currentTab === 'bookings' && <BookingsView />}
          {currentTab === 'profile' && <ProfileView activeUserData={activeUserData} currentUser={currentUser} />}
        </main>

        {/* BOTTOM NAVIGATION BAR TACTILE (4 Onglets 7j/7) */}
        <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
