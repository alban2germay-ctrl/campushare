// ==============================================================================
// 🎒 CampuShare — Vue ItemsView (Chantier B : Moteur Propriétaire & Matériel)
// Fichier : public/js/views/ItemsView.js
// Responsable exclusif : Mathys (Co-directeur 2A 3EA)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ItemsView = function ItemsView({ activeUserData, currentUser }) {
  return (
    <div className="space-y-4 animate-fade-in p-2 text-center">
      {/* Badge Espace Réservé */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F5] text-[#D87D4A] border border-[#EAE2D5] shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-[#D87D4A] animate-pulse"></span>
        Espace Dédié à Mathys (Chantier B)
      </div>

      {/* Carte d'accueil & feuille de route de Mathys */}
      <div className="p-5 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs space-y-3 text-left">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80"
            alt="Mathys"
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#D87D4A]/30"
          />
          <div>
            <h3 className="font-extrabold text-sm text-[#2C2720]">Espace Propriétaire de Mathys</h3>
            <p className="text-xs text-[#6B6358]">Toulouse INP - ENSEEIHT &bull; 2A 3EA</p>
          </div>
        </div>

        <p className="text-xs text-[#6B6358] leading-relaxed">
          Bienvenue Mathys ! Cet écran est ton <strong>bac à sable exclusif</strong>. Alban travaille sur le moteur Emprunteur, et cet espace t'est entièrement réservé pour construire l'expérience de mise en location avec ton agent Antigravity sur ton PC.
        </p>

        <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2 text-xs">
          <span className="font-extrabold text-[11px] text-[#2C2720] uppercase tracking-wider block">
            📋 Tes 5 missions prioritaires (Phase 3) :
          </span>
          <ul className="space-y-1.5 text-[#6B6358] text-[11px]">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#EAE2D5] text-[#D87D4A] flex items-center justify-center font-bold text-[9px]">1</span>
              <span>Déclencheur photo appareil smartphone</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#EAE2D5] text-[#D87D4A] flex items-center justify-center font-bold text-[9px]">2</span>
              <span>Formulaire express en moins de 60 secondes</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#EAE2D5] text-[#D87D4A] flex items-center justify-center font-bold text-[9px]">3</span>
              <span>Algorithme de calcul automatique de la caution</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#EAE2D5] text-[#D87D4A] flex items-center justify-center font-bold text-[9px]">4</span>
              <span>Carte des demandes reçues de camarades de promo</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#EAE2D5] text-[#D87D4A] flex items-center justify-center font-bold text-[9px]">5</span>
              <span>Bouton d'acceptation de prêt en 1 clic</span>
            </li>
          </ul>
        </div>

        <div className="p-3 rounded-2xl bg-[#FEF4E8] text-[#9A4C1E] text-[11px] font-medium leading-relaxed">
          💡 <strong>Prêt pour Mathys :</strong> Ouvre ce projet dans Antigravity sur ton PC Windows, et dis à ton agent : <em>« Aide-moi à développer ma première tâche dans ItemsView.js ! »</em>
        </div>
      </div>
    </div>
  );
};
