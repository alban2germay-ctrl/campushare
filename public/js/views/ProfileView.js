// ==============================================================================
// 🎒 CampuShare — Vue ProfileView (Chantier D : Compte Étudiant & Confiance)
// Fichier : public/js/views/ProfileView.js
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ProfileView = function ProfileView({ activeUserData, currentUser }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-4 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs text-center space-y-2">
        <img
          src={activeUserData.avatar}
          alt={activeUserData.name}
          className="w-16 h-16 rounded-full mx-auto ring-4 ring-[#52796F]/20 object-cover shadow-sm"
        />
        <div>
          <h3 className="text-sm font-extrabold text-[#2C2720] flex items-center justify-center gap-1">
            <span>{activeUserData.name}</span>
            <span className="text-[#52796F] text-xs">✓</span>
          </h3>
          <p className="text-xs text-[#6B6358]">{activeUserData.promo} &bull; {activeUserData.school}</p>
          <p className="text-[10px] text-[#8C8275] font-mono mt-0.5">{activeUserData.email}</p>
        </div>
      </div>

      <div className="p-3.5 rounded-3xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2">
        <span className="text-[10px] font-bold text-[#8C8275] uppercase">Statut de Confiance Étudiant</span>
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 bg-white rounded-2xl border border-[#EAE2D5]">
            <span className="block text-sm font-extrabold text-[#52796F]">
              {activeUserData.trustScore} %
            </span>
            <span className="text-[9px] text-[#8C8275]">Matériel rendu intact</span>
          </div>
          <div className="p-2.5 bg-white rounded-2xl border border-[#EAE2D5]">
            <span className="block text-sm font-extrabold text-[#2C2720]">
              {activeUserData.disputes}
            </span>
            <span className="text-[9px] text-[#8C8275]">Litige signalé</span>
          </div>
        </div>
      </div>

      {/* Carte Détail Cagnotte */}
      <div className="p-4 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#2C2720]">Solde de la Cagnotte</span>
          <span className="text-sm font-extrabold text-[#52796F]">
            {activeUserData.wallet.toFixed(2)} €
          </span>
        </div>
        <p className="text-[10px] text-[#6B6358]">
          Gains perçus directement sur tes prêts de matériel. Aucun frais caché.
        </p>
        <button
          onClick={() => alert(`Demande de virement de ${activeUserData.wallet.toFixed(2)} € vers ton compte bancaire envoyée !`)}
          className="w-full py-2 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-xs"
        >
          Transférer vers mon compte bancaire
        </button>
      </div>

      {/* Carte Accès Roadmap & Suivi du Projet */}
      <a
        href="/roadmap.html"
        className="p-3.5 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs flex items-center justify-between hover:border-[#52796F] transition block"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E6EFE6] text-[#52796F] flex items-center justify-center font-bold text-xs flex-shrink-0">
            🗺️
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-[#2C2720]">Roadmap & Preuves des Agents</h4>
            <p className="text-[10px] text-[#6B6358]">Suivi des micro-tâches, délibérations et livrables Git</p>
          </div>
        </div>
        <span className="text-xs text-[#52796F] font-bold">→</span>
      </a>
    </div>
  );
};
