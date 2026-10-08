// ==============================================================================
// 🎒 CampuShare — Vue ItemsView (Chantier B : Moteur Propriétaire & Matériel)
// Fichier : public/js/views/ItemsView.js
// Responsable principal : Mathys (Directeur 3EA)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ItemsView = function ItemsView({ activeUserData, currentUser }) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const items = window.CS.data.items || [];

  // Filtrer les objets appartenant à l'utilisateur connecté
  const userItems = items.filter((item) =>
    currentUser === 'alban' ? item.owner.name.startsWith('Alban') : item.owner.name.startsWith('Mathys')
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* En-tête de section avec bouton d'ajout express */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-[#2C2720]">Mon Matériel en Prêt</h3>
          <p className="text-[10px] text-[#6B6358]">
            {userItems.length} objet{userItems.length > 1 ? 's' : ''} actif{userItems.length > 1 ? 's' : ''} &bull; Prêt 7j/7
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-xl bg-[#D87D4A] text-white text-xs font-bold shadow-xs flex items-center gap-1 hover:bg-[#C26B39] transition"
        >
          <i data-lucide="plus" className="w-3.5 h-3.5"></i>
          <span>Ajouter (<60s)</span>
        </button>
      </div>

      {/* Bannière de revenus générés */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-br from-[#FEF9EF] to-[#F8EFE3] border border-[#F4E3C5] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#785E2F] uppercase block">Gains cumulés avec mes prêts</span>
          <span className="text-base font-extrabold text-[#2C2720]">+{activeUserData.wallet.toFixed(2)} €</span>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-white/80 border border-[#F4E3C5] flex items-center justify-center text-sm shadow-2xs">
          💰
        </div>
      </div>

      {/* Liste des objets de l'utilisateur */}
      <div className="space-y-3">
        {userItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                item.status === 'available'
                  ? 'bg-[#E6EFE6] text-[#354F48]'
                  : 'bg-[#FEF4E8] text-[#9A4C1E]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'available' ? 'bg-[#52796F]' : 'bg-[#D87D4A]'}`}></span>
                {item.status === 'available' ? 'Disponible 7j/7' : 'En cours de location'}
              </span>
              <span className="text-[10px] text-[#8C8275] font-semibold">
                Caution bloquée : {item.depositAmount} €
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-xs text-[#2C2720] truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-[#6B6358]">
                  {item.pricing.perDay.toFixed(0)}€/jour &bull; {item.pricing.weekendPackage.toFixed(0)}€/we &bull; {item.categoryLabel}
                </p>
                <p className="text-[9px] text-[#8C8275] truncate mt-0.5">
                  📍 {item.pickupLocation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EBE1]">
              <button className="py-1.5 rounded-xl border border-[#EAE2D5] text-[#2C2720] text-xs font-semibold hover:bg-[#FAF8F5] transition">
                Modifier tarifs
              </button>
              <button className="py-1.5 rounded-xl bg-[#FAF8F5] text-[#52796F] text-xs font-bold hover:bg-[#EAE2D5] transition">
                Disponibilités 7j/7
              </button>
            </div>
          </div>
        ))}

        {userItems.length === 0 && (
          <div className="p-6 text-center text-xs text-[#8C8275] bg-white rounded-3xl border border-[#EAE2D5]">
            <p className="font-bold text-[#2C2720]">Aucun objet listé pour le moment</p>
            <p className="text-[11px] mt-1">Clique sur « Ajouter (<60s) » pour mettre ton premier équipement en location !</p>
          </div>
        )}
      </div>

      {/* Modale d'ajout d'objet express (Micro-tâche 3.1) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-xl border border-[#EAE2D5]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#2C2720]">Ajouter un équipement</h3>
                <p className="text-[10px] text-[#6B6358]">Mise en ligne en moins de 60 secondes</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1">Photo de l'objet</label>
                <div className="border-2 border-dashed border-[#EAE2D5] rounded-2xl p-4 text-center bg-[#FAF8F5] hover:bg-[#F4EFE6] cursor-pointer transition">
                  <span className="text-xl block">📸</span>
                  <span className="text-[11px] font-bold text-[#52796F] block mt-1">Prendre une photo</span>
                  <span className="text-[9px] text-[#8C8275]">depuis ton smartphone</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1">Nom de l'objet</label>
                <input
                  type="text"
                  placeholder="Ex: Tente 3 places Quechua, Gaufrier..."
                  className="w-full p-2.5 rounded-xl border border-[#EAE2D5] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#52796F]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1">Prix par jour</label>
                  <input
                    type="number"
                    placeholder="6 €"
                    className="w-full p-2.5 rounded-xl border border-[#EAE2D5] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#52796F]/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1">Forfait WE</label>
                  <input
                    type="number"
                    placeholder="12 €"
                    className="w-full p-2.5 rounded-xl border border-[#EAE2D5] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#52796F]/30"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Équipement ajouté avec succès ! (Simulation Chantier B)");
                setShowAddModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#D87D4A] text-white text-xs font-bold hover:bg-[#C26B39] transition shadow-xs"
            >
              Publier sur le campus
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
