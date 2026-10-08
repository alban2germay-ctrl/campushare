// ==============================================================================
// 🎒 CampuShare — Vue ExploreView (Chantier A : Moteur Emprunteur & Découverte 7j/7)
// Fichier : public/js/views/ExploreView.js
// Responsable principal : Alban (Directeur SN)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ExploreView = function ExploreView() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPeriod, setSelectedPeriod] = React.useState('24h'); // '24h' | 'weekend' | 'weekly' | 'custom'
  const [activeModalItem, setActiveModalItem] = React.useState(null); // Objet ouvert en détail/réservation
  const [bookingSuccess, setBookingSuccess] = React.useState(null); // Message de confirmation
  const [customDays, setCustomDays] = React.useState(1);
  const [pickupSpot, setPickupSpot] = React.useState('Foyer des élèves N7');

  const categories = window.CS.data.categories || [];
  const items = window.CS.data.items || [];

  // Re-déclencher les icônes Lucide à chaque mise à jour de vue
  React.useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [selectedCategory, selectedPeriod, activeModalItem, bookingSuccess]);

  // Filtrage des objets selon catégorie et recherche
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calcul du libellé et du prix selon la période active
  const getPeriodBadge = () => {
    switch (selectedPeriod) {
      case 'weekend':
        return {
          label: 'Forfait Week-end',
          dates: 'Vendredi 17h00 → Dimanche 20h00',
          desc: 'Idéal soirée, ski ou week-end détente',
          tag: 'Ven-Dim'
        };
      case 'weekly':
        return {
          label: 'Semaine Complète (7 jours)',
          dates: '7 jours consécutifs avec remise de 30%',
          desc: 'Idéal vacances ou projet d\'école',
          tag: '7 jours'
        };
      case 'custom':
        return {
          label: `Durée personnalisée (${customDays} jour${customDays > 1 ? 's' : ''})`,
          dates: `Location sur ${customDays * 24} heures`,
          desc: 'Dates sur-mesure au campus',
          tag: `${customDays}j`
        };
      case '24h':
      default:
        return {
          label: 'Location Express 24h en semaine',
          dates: 'Aujourd\'hui 14h00 → Demain 14h00',
          desc: 'Idéal besoin ponctuel ou bricolage',
          tag: '24h'
        };
    }
  };

  const periodInfo = getPeriodBadge();

  // Calcul du prix estimé pour un objet donné selon la formule
  const calculateItemPrice = (item) => {
    if (selectedPeriod === 'weekend') return item.pricing.weekendPackage;
    if (selectedPeriod === 'weekly') return item.pricing.weeklyPackage;
    if (selectedPeriod === 'custom') return item.pricing.perDay * customDays;
    return item.pricing.perDay; // 24h
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      
      {/* Toast de confirmation de réservation */}
      {bookingSuccess && (
        <div className="p-3 rounded-2xl bg-[#E6EFE6] border border-[#52796F]/30 text-[#354F48] text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#52796F] text-white flex items-center justify-center text-[11px] font-bold">✓</span>
            <div>
              <p className="font-extrabold">{bookingSuccess.title} réservé !</p>
              <p className="text-[10px] text-[#52796F]">{bookingSuccess.dates} &bull; Retrait : {bookingSuccess.spot}</p>
            </div>
          </div>
          <button onClick={() => setBookingSuccess(null)} className="text-[#52796F] text-xs font-bold px-1.5">✕</button>
        </div>
      )}

      {/* 1. SÉLECTEUR DYNAMIQUE DE PÉRIODE 7J/7 (Micro-tâche MT-2.1.1.1) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#FAF8F5] to-[#F4EFE6] border border-[#EAE2D5] space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6EFE6] text-[#354F48]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52796F] animate-pulse"></span>
            Locations 7j/7 sans restriction
          </span>
          <span className="text-[10px] text-[#8C8275] font-semibold">Toulouse INP</span>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-[#2C2720]">Quand as-tu besoin de ce matériel ?</h3>
          <p className="text-[11px] text-[#6B6358] mt-0.5">Choisis ta formule :</p>
        </div>

        {/* Boutons tactiles interactifs des formules */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setSelectedPeriod('24h')}
            className={`p-2.5 rounded-2xl text-center transition ${
              selectedPeriod === '24h'
                ? 'bg-[#52796F] text-white shadow-xs ring-2 ring-[#52796F]/30'
                : 'bg-white/90 border border-[#EAE2D5] text-[#2C2720] hover:border-[#52796F]'
            }`}
          >
            <span className={`block text-[9px] font-bold ${selectedPeriod === '24h' ? 'text-white/80' : 'text-[#8C8275]'}`}>
              24H SEMAINE
            </span>
            <span className="text-xs font-extrabold block mt-0.5">Dès 5 €</span>
            <span className={`text-[8px] block ${selectedPeriod === '24h' ? 'text-white/70' : 'text-[#8C8275]'}`}>
              Express
            </span>
          </button>

          <button
            onClick={() => setSelectedPeriod('weekend')}
            className={`p-2.5 rounded-2xl text-center transition ${
              selectedPeriod === 'weekend'
                ? 'bg-[#52796F] text-white shadow-xs ring-2 ring-[#52796F]/30'
                : 'bg-white/90 border border-[#EAE2D5] text-[#2C2720] hover:border-[#52796F]'
            }`}
          >
            <span className={`block text-[9px] font-bold ${selectedPeriod === 'weekend' ? 'text-white/80' : 'text-[#8C8275]'}`}>
              WEEK-END
            </span>
            <span className="text-xs font-extrabold block mt-0.5">Ven &rarr; Dim</span>
            <span className={`text-[8px] block ${selectedPeriod === 'weekend' ? 'text-white/70' : 'text-[#8C8275]'}`}>
              Forfait 48h
            </span>
          </button>

          <button
            onClick={() => setSelectedPeriod('weekly')}
            className={`p-2.5 rounded-2xl text-center transition ${
              selectedPeriod === 'weekly'
                ? 'bg-[#52796F] text-white shadow-xs ring-2 ring-[#52796F]/30'
                : 'bg-white/90 border border-[#EAE2D5] text-[#2C2720] hover:border-[#52796F]'
            }`}
          >
            <span className={`block text-[9px] font-bold ${selectedPeriod === 'weekly' ? 'text-white/80' : 'text-[#8C8275]'}`}>
              SEMAINE (7J)
            </span>
            <span className="text-xs font-extrabold block mt-0.5">-30%</span>
            <span className={`text-[8px] block ${selectedPeriod === 'weekly' ? 'text-white/70' : 'text-[#8C8275]'}`}>
              Vacances/Projet
            </span>
          </button>
        </div>

        {/* Bandeau d'information dynamique du créneau actif */}
        <div className="p-2.5 rounded-2xl bg-white border border-[#EAE2D5] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#E6EFE6] text-[#52796F] flex items-center justify-center font-bold text-xs flex-shrink-0">
              📅
            </div>
            <div>
              <p className="font-extrabold text-[#2C2720] text-[11px]">{periodInfo.label}</p>
              <p className="text-[10px] text-[#6B6358]">{periodInfo.dates}</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-[#52796F] bg-[#FAF8F5] px-2 py-1 rounded-lg border border-[#EAE2D5]">
            {periodInfo.tag}
          </span>
        </div>
      </div>

      {/* 2. RECHERCHE TEXTUELLE TEMPS RÉEL (Micro-tâche MT-2.1.1.2) */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher appareil raclette, enceinte JBL, perceuse..."
          className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white border border-[#EAE2D5] text-xs text-[#2C2720] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#52796F]/30 shadow-2xs"
        />
        <i data-lucide="search" className="w-4 h-4 text-[#8C8275] absolute left-3 top-3"></i>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-[#8C8275] hover:text-[#2C2720]"
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. BARRE DE PILLS DE CATÉGORIES (Micro-tâche MT-2.1.1.3) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#8C8275] uppercase tracking-wider">Catégories Campus</span>
          <span className="text-[10px] text-[#52796F] font-bold">
            {filteredItems.length} objet{filteredItems.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shadow-xs ${
              selectedCategory === 'all'
                ? 'bg-[#52796F] text-white'
                : 'bg-white border border-[#EAE2D5] text-[#6B6358] hover:bg-[#FAF8F5]'
            }`}
          >
            ✨ Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs ${
                selectedCategory === cat.id
                  ? 'bg-[#52796F] text-white font-bold'
                  : 'bg-white border border-[#EAE2D5] text-[#6B6358] hover:bg-[#FAF8F5]'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. GRILLE RÉACTIVE DES CARTES OBJETS (Micro-tâches MT-2.1.1.4 & MT-2.1.1.5) */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const activeCost = calculateItemPrice(item);
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs space-y-2.5 hover:border-[#52796F]/40 transition"
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl bg-[#FAF8F5] overflow-hidden flex-shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-[#2C2720]/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                    7j/7
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#52796F] uppercase">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[9px] font-semibold text-[#8C8275]">
                        ⭐ {item.owner.rating} ({item.owner.reviewsCount})
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-[#2C2720] truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-[#6B6358] truncate">
                      Prêté par {item.owner.name} ({item.owner.promo})
                    </p>
                  </div>
                  
                  {/* Prix calculé selon la période sélectionnée */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0EBE1]">
                    <div>
                      <span className="text-sm font-extrabold text-[#2C2720]">
                        {activeCost.toFixed(2)} €
                      </span>
                      <span className="text-[9px] text-[#8C8275]">
                        {selectedPeriod === 'weekend' ? ' /we' : selectedPeriod === 'weekly' ? ' /semaine' : ' /24h'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-[#354F48] bg-[#E6EFE6] px-1.5 py-0.5 rounded-md">
                      Caution : {item.depositAmount} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Bouton tactile d'action */}
              <button
                onClick={() => setActiveModalItem(item)}
                className="w-full py-2.5 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <i data-lucide="check" className="w-3.5 h-3.5"></i>
                <span>Réserver ({activeCost.toFixed(2)} € • {periodInfo.tag})</span>
              </button>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-xs text-[#8C8275] bg-white rounded-3xl border border-[#EAE2D5]">
            <p className="font-bold text-[#2C2720]">Aucun objet trouvé</p>
            <p className="text-[11px] mt-1">Essaie une autre recherche ou une autre catégorie.</p>
          </div>
        )}
      </div>

      {/* 5. MODALE BOTTOMSHEET FICHE OBJET 360° & VALIDATION RÉSERVATION */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-[#EAE2D5] max-h-[90vh] overflow-y-auto">
            
            {/* En-tête de la modale */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#E6EFE6] text-[#354F48] text-[9px] font-bold">
                  {activeModalItem.categoryLabel}
                </span>
                <span className="text-[10px] text-[#8C8275]">Prêt Campus N7</span>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Photo & Titre */}
            <div className="flex gap-3 items-center">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#52796F]/20"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-[#2C2720] leading-tight">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs text-[#6B6358] mt-0.5">
                  Propriétaire : <strong>{activeModalItem.owner.name}</strong> ({activeModalItem.owner.promo})
                </p>
                <p className="text-[10px] text-[#52796F] font-semibold">⭐ {activeModalItem.owner.rating} / 5 &bull; 0 litige</p>
              </div>
            </div>

            {/* Récapitulatif du créneau choisi */}
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#2C2720]">Créneau sélectionné :</span>
                <span className="font-extrabold text-[#52796F]">{periodInfo.label}</span>
              </div>
              <p className="text-[11px] text-[#6B6358] flex items-center gap-1.5">
                <i data-lucide="clock" className="w-3.5 h-3.5 text-[#52796F]"></i>
                <span>{periodInfo.dates}</span>
              </p>
            </div>

            {/* Choix du lieu de retrait campus */}
            <div>
              <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1.5">
                Lieu de retrait sur le campus :
              </label>
              <select
                value={pickupSpot}
                onChange={(e) => setPickupSpot(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EAE2D5] bg-[#FAF8F5] text-xs font-semibold text-[#2C2720] focus:outline-none focus:ring-2 focus:ring-[#52796F]/30"
              >
                <option value="Foyer des élèves N7">📍 Foyer des élèves N7 (Bâtiment B)</option>
                <option value="Cafétéria N7">📍 Cafétéria N7</option>
                <option value="Résidence étudiante R1">📍 Résidence étudiante R1</option>
                <option value="Résidence étudiante R2">📍 Résidence étudiante R2</option>
              </select>
            </div>

            {/* Décomposition financière transparente */}
            <div className="p-3 rounded-2xl bg-white border border-[#EAE2D5] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B6358]">
                <span>Part location ({periodInfo.tag}) :</span>
                <span className="font-bold text-[#2C2720]">{calculateItemPrice(activeModalItem).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-[#6B6358]">
                <span>Frais de service campus :</span>
                <span className="font-bold text-[#2C2720]">0,00 € (Offert)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#F0EBE1] font-extrabold text-[#2C2720]">
                <span>Total à régler :</span>
                <span className="text-sm text-[#52796F]">{calculateItemPrice(activeModalItem).toFixed(2)} €</span>
              </div>
              <div className="p-2 rounded-xl bg-[#E6EFE6] text-[#354F48] text-[10px] mt-2 flex items-center gap-1.5">
                <i data-lucide="shield-check" className="w-4 h-4 text-[#52796F] flex-shrink-0"></i>
                <span>Caution de <strong>{activeModalItem.depositAmount} € bloquée SANS DÉBIT</strong>. Libérée automatiquement dès la restitution.</span>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <button
              onClick={() => {
                const confirmedItem = activeModalItem;
                const cost = calculateItemPrice(confirmedItem);
                // Ajouter la réservation dans les données partagées
                window.CS.data.bookings.unshift({
                  id: `book-${Date.now()}`,
                  itemTitle: confirmedItem.title,
                  itemCategory: confirmedItem.categoryLabel,
                  itemPrice: cost,
                  depositAmount: confirmedItem.depositAmount,
                  periodLabel: periodInfo.dates,
                  type: periodInfo.tag,
                  pickupLocation: pickupSpot,
                  status: 'confirmed',
                  renterName: 'Alban D.',
                  ownerName: confirmedItem.owner.name
                });
                setBookingSuccess({
                  title: confirmedItem.title,
                  dates: periodInfo.dates,
                  spot: pickupSpot
                });
                setActiveModalItem(null);
              }}
              className="w-full py-3 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Confirmer ma demande de réservation</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
