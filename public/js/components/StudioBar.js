// ==============================================================================
// 🎒 CampuShare — Composant StudioBar (Banc d'essai Alban & Mathys)
// Fichier : public/js/components/StudioBar.js
// ==============================================================================

window.CS = window.CS || {};
window.CS.components = window.CS.components || {};

window.CS.components.StudioBar = function StudioBar({
  currentUser,
  setCurrentUser,
  deviceMode,
  setDeviceMode
}) {
  return (
    <div className="hidden sm:flex items-center justify-between w-full max-w-2xl mb-3 px-4 py-2 bg-white/80 backdrop-blur rounded-2xl border border-[#DCD5C5] shadow-xs text-xs">
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-[#2C2720] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#52796F] animate-pulse"></span>
          CampuShare Studio
        </span>
        <span className="text-[#A89F91]">&bull;</span>
        <span className="text-[#6B6358] font-medium">Banc d'essai PWA</span>
      </div>

      {/* Sélecteur de profil actif */}
      <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE2D5]">
        <span className="text-[10px] text-[#8C8275] font-bold px-1.5">Profil :</span>
        <button
          onClick={() => setCurrentUser('alban')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
            currentUser === 'alban'
              ? 'bg-[#52796F] text-white shadow-xs'
              : 'text-[#6B6358] hover:text-[#2C2720]'
          }`}
        >
          Alban
        </button>
        <button
          onClick={() => setCurrentUser('mathys')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
            currentUser === 'mathys'
              ? 'bg-[#52796F] text-white shadow-xs'
              : 'text-[#6B6358] hover:text-[#2C2720]'
          }`}
        >
          Mathys
        </button>
      </div>

      {/* Sélecteur de simulateur / plein écran */}
      <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE2D5]">
        <button
          onClick={() => setDeviceMode('iphone')}
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
            deviceMode === 'iphone' ? 'bg-[#2C2720] text-white font-bold' : 'text-[#6B6358]'
          }`}
          title="Simulateur iPhone 15 Pro (390px)"
        >
          📱 iPhone
        </button>
        <button
          onClick={() => setDeviceMode('pixel')}
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
            deviceMode === 'pixel' ? 'bg-[#2C2720] text-white font-bold' : 'text-[#6B6358]'
          }`}
          title="Simulateur Android Pixel (412px)"
        >
          📱 Pixel
        </button>
        <button
          onClick={() => setDeviceMode('fullscreen')}
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
            deviceMode === 'fullscreen' ? 'bg-[#2C2720] text-white font-bold' : 'text-[#6B6358]'
          }`}
          title="Mode Plein Écran Web"
        >
          🖥️ Plein Écran
        </button>
      </div>
    </div>
  );
};
