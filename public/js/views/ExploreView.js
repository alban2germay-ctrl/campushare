// ==============================================================================
// 🎒 CampuShare — Vue ExploreView (Chantier A : Moteur Emprunteur & Découverte 7j/7)
// Fichier : public/js/views/ExploreView.js
// Responsable exclusif : Alban (Co-directeur 2A SN)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ExploreView = function ExploreView({ onNavigateTab }) {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPeriod, setSelectedPeriod] = React.useState('24h'); // '24h' | 'weekend' | 'weekly' | 'custom'
  
  // NOUVEAUX ÉTATS OPTION A : TRI & FILTRES AVANCÉS CAMPUS
  const [selectedSpot, setSelectedSpot] = React.useState('all'); // 'all' | 'Foyer' | 'R1' | 'R2'
  const [maxBudget, setMaxBudget] = React.useState(0); // 0 = illimité, 6, 10, 20
  const [sortBy, setSortBy] = React.useState('recommended'); // 'recommended' | 'price_asc' | 'price_desc' | 'rating'
  const [showFilterDrawer, setShowFilterDrawer] = React.useState(false);

  // Modale de réservation & Toast
  const [activeModalItem, setActiveModalItem] = React.useState(null);
  const [bookingSuccess, setBookingSuccess] = React.useState(null);
  const [customDays, setCustomDays] = React.useState(1);
  const [pickupSpot, setPickupSpot] = React.useState('Foyer des élèves N7');

  const categories = window.CS.data.categories || [];
  const items = window.CS.data.items || [];

  // Actualiser les icônes Lucide
  React.useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [selectedCategory, selectedPeriod, selectedSpot, maxBudget, sortBy, showFilterDrawer, activeModalItem, bookingSuccess]);

  // Calcul du badge de la formule temporelle
  const getPeriodBadge = () => {
    switch (selectedPeriod) {
      case 'weekend':
        return {
          label: 'Forfait Week-end',
          dates: 'Vendredi 17h00 → Dimanche 20h00',
          desc: 'Idéal soirée, ski ou détente',
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
          label: `Durée personnalisée (${customDays}j)`,
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

  // Calcul du prix estimé selon la formule
  const calculateItemPrice = (item) => {
    if (selectedPeriod === 'weekend') return item.pricing.weekendPackage;
    if (selectedPeriod === 'weekly') return item.pricing.weeklyPackage;
    if (selectedPeriod === 'custom') return item.pricing.perDay * customDays;
    return item.pricing.perDay; // 24h
  };

  // FILTRAGE ET TRI MULTI-CRITÈRES INTELLIGENT (Option A Alban)
  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpot =
        selectedSpot === 'all' || item.pickupLocation.toLowerCase().includes(selectedSpot.toLowerCase());
      const activeCost = calculateItemPrice(item);
      const matchesBudget = maxBudget === 0 || activeCost <= maxBudget;

      return matchesCategory && matchesSearch && matchesSpot && matchesBudget;
    })
    .sort((a, b) => {
      const priceA = calculateItemPrice(a);
      const priceB = calculateItemPrice(b);

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.owner.rating - a.owner.rating;
      return 0; // 'recommended'
    });

  // Compteur de filtres actifs
  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSpot !== 'all' ? 1 : 0) +
    (maxBudget > 0 ? 1 : 0) +
    (sortBy !== 'recommended' ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSpot('all');
    setMaxBudget(0);
    setSortBy('recommended');
    setSearchQuery('');
  };

  return (
    <div className="space-y-3.5 animate-fade-in pb-4">
      
      {/* 1. POPUP DE SUCCÈS MODALE : CÉLÉBRATION & ACCÈS DIRECT AU QR CODE */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#EAE2D5] text-center space-y-3.5">
            <div className="w-14 h-14 rounded-full bg-[#E6EFE6] text-[#52796F] flex items-center justify-center text-2xl mx-auto shadow-xs">
              🎉
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6EFE6] text-[#354F48] text-[9px] font-extrabold uppercase tracking-wide">
                Réservation Confirmée
              </span>
              <h3 className="font-extrabold text-base text-[#2C2720] mt-1.5 leading-snug">
                {bookingSuccess.title}
              </h3>
              <p className="text-xs text-[#6B6358] mt-0.5">
                Prêté par <strong>{bookingSuccess.ownerName}</strong>
              </p>
            </div>

            {/* Billet récapitulatif */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-[#8C8275] uppercase">Pass Campus N7</span>
                <span className="font-mono font-extrabold text-[#52796F] text-xs">
                  {bookingSuccess.bookingRef}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#2C2720]">
                <i data-lucide="map-pin" className="w-3.5 h-3.5 text-[#D87D4A] flex-shrink-0"></i>
                <span>Retrait : <strong>{bookingSuccess.spot}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B6358]">
                <i data-lucide="clock" className="w-3.5 h-3.5 text-[#52796F] flex-shrink-0"></i>
                <span>{bookingSuccess.dates}</span>
              </div>
              <div className="pt-1.5 border-t border-[#EAE2D5] flex items-center justify-between text-[10px] text-[#354F48]">
                <span>Empreinte caution :</span>
                <span className="font-bold">0,00 € débité</span>
              </div>
            </div>

            {/* Actions principales de l'emprunteur */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  if (onNavigateTab) {
                    onNavigateTab('bookings');
                  }
                }}
                className="w-full py-3 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>👉 Voir mon Billet & QR Code de retrait</span>
              </button>

              <button
                onClick={() => setBookingSuccess(null)}
                className="w-full py-1.5 rounded-xl text-xs font-semibold text-[#8C8275] hover:text-[#2C2720] transition"
              >
                Continuer à explorer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. BARRE COMPACTE DE RECHERCHE + FILTRES (Style Airbnb / Vinted) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher raclette, tente, perceuse, sono..."
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

        {/* Bouton d'ouverture des filtres avancés */}
        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`px-3 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition shadow-2xs flex-shrink-0 ${
            showFilterDrawer || activeFiltersCount > 0
              ? 'bg-[#52796F] text-white border-[#52796F]'
              : 'bg-white text-[#2C2720] border-[#EAE2D5] hover:bg-[#FAF8F5]'
          }`}
          title="Filtres avancés"
        >
          <i data-lucide="sliders-horizontal" className="w-3.5 h-3.5"></i>
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-[#52796F] flex items-center justify-center text-[9px] font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* 3. SÉLECTEUR RAPIDE DE FORMULE EN PILLS (1 Ligne Horizontale Épurée) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[9px] font-bold text-[#8C8275] uppercase whitespace-nowrap mr-0.5">
          Durée :
        </span>
        {[
          { id: '24h', label: '⚡ 24h Express', subtitle: 'Dès 4€' },
          { id: 'weekend', label: '🎉 Ce Week-end (Ven-Dim)', subtitle: 'Forfait 48h' },
          { id: 'weekly', label: '📦 Semaine 7j (-30%)', subtitle: 'Vacances' }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPeriod(p.id)}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition flex items-center gap-1 ${
              selectedPeriod === p.id
                ? 'bg-[#52796F] text-white shadow-xs'
                : 'bg-white border border-[#EAE2D5] text-[#6B6358] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* 3. PANNEAU DE FILTRES AVANCÉS & TRI (OPTION A ALBAN) */}
      {showFilterDrawer && (
        <div className="p-4 rounded-3xl bg-white border border-[#EAE2D5] space-y-3.5 shadow-sm animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
            <span className="font-extrabold text-[#2C2720] flex items-center gap-1.5">
              <span>🎯</span>
              <span>Filtres & Tri Avancés</span>
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-[10px] text-[#D87D4A] font-bold hover:underline"
              >
                Réinitialiser tout
              </button>
            )}
          </div>

          {/* Tri Intelligent */}
          <div>
            <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1.5">
              Trier les équipements par :
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setSortBy('recommended')}
                className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition ${
                  sortBy === 'recommended'
                    ? 'bg-[#E6EFE6] text-[#354F48] border-[#52796F] font-bold'
                    : 'bg-[#FAF8F5] text-[#6B6358] border-[#EAE2D5]'
                }`}
              >
                ✨ Recommandés
              </button>
              <button
                onClick={() => setSortBy('price_asc')}
                className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition ${
                  sortBy === 'price_asc'
                    ? 'bg-[#E6EFE6] text-[#354F48] border-[#52796F] font-bold'
                    : 'bg-[#FAF8F5] text-[#6B6358] border-[#EAE2D5]'
                }`}
              >
                💶 Prix croissant
              </button>
              <button
                onClick={() => setSortBy('price_desc')}
                className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition ${
                  sortBy === 'price_desc'
                    ? 'bg-[#E6EFE6] text-[#354F48] border-[#52796F] font-bold'
                    : 'bg-[#FAF8F5] text-[#6B6358] border-[#EAE2D5]'
                }`}
              >
                💎 Prix décroissant
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition ${
                  sortBy === 'rating'
                    ? 'bg-[#E6EFE6] text-[#354F48] border-[#52796F] font-bold'
                    : 'bg-[#FAF8F5] text-[#6B6358] border-[#EAE2D5]'
                }`}
              >
                ⭐ Mieux notés
              </button>
            </div>
          </div>

          {/* Filtre par Lieu de Retrait Campus */}
          <div>
            <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1.5">
              Lieu de retrait physique :
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Tous les lieux' },
                { id: 'Foyer', label: '📍 Foyer N7' },
                { id: 'R1', label: '📍 Résidence R1' },
                { id: 'R2', label: '📍 Résidence R2' }
              ].map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold transition ${
                    selectedSpot === spot.id
                      ? 'bg-[#52796F] text-white font-bold shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#6B6358] border border-[#EAE2D5] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {spot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtre Budget Maximum */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold text-[#8C8275] uppercase">
                Budget maximum ({periodInfo.tag}) :
              </label>
              <span className="text-[10px] font-extrabold text-[#52796F]">
                {maxBudget === 0 ? 'Illimité' : `Max ${maxBudget} €`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { val: 0, label: 'Tout' },
                { val: 6, label: '< 6 €' },
                { val: 12, label: '< 12 €' },
                { val: 20, label: '< 20 €' }
              ].map((b) => (
                <button
                  key={b.val}
                  onClick={() => setMaxBudget(b.val)}
                  className={`py-1.5 rounded-xl text-[10px] font-semibold transition ${
                    maxBudget === b.val
                      ? 'bg-[#52796F] text-white font-bold'
                      : 'bg-[#FAF8F5] text-[#6B6358] border border-[#EAE2D5]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. PILLS DE CATÉGORIES HORIZONTAUX */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#8C8275] uppercase tracking-wider">Catégories Campus</span>
          <span className="text-[10px] text-[#52796F] font-bold">
            {filteredAndSortedItems.length} disponible{filteredAndSortedItems.length > 1 ? 's' : ''}
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

      {/* 5. LISTE DES CARTES D'ÉQUIPEMENTS */}
      <div className="space-y-3">
        {filteredAndSortedItems.map((item) => {
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
                    <p className="text-[9px] text-[#8C8275] truncate mt-0.5">
                      📍 {item.pickupLocation}
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

        {filteredAndSortedItems.length === 0 && (
          <div className="p-6 text-center text-xs text-[#8C8275] bg-white rounded-3xl border border-[#EAE2D5] space-y-2">
            <p className="font-bold text-[#2C2720] text-sm">Aucun équipement ne correspond à tes filtres</p>
            <p className="text-[11px]">Essaie d'élargir ton budget ou de chercher sur un autre lieu de retrait.</p>
            <button
              onClick={resetAllFilters}
              className="mt-2 px-3 py-1.5 rounded-xl bg-[#52796F] text-white text-xs font-bold shadow-xs hover:bg-[#43665D]"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>

      {/* 6. MODALE BOTTOMSHEET FICHE OBJET 360° AVEC CTA STICKY FIXÉ EN BAS */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EAE2D5] max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* En-tête fixe de la modale */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F0EBE1] flex-shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#E6EFE6] text-[#354F48] text-[9px] font-bold">
                  {activeModalItem.categoryLabel}
                </span>
                <span className="text-[10px] text-[#52796F] font-bold flex items-center gap-1">
                  <span>✓</span> Certifié N7
                </span>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Corps scrollable ergonomique */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 mobile-scroll-container">
              {/* Photo & Titre avec état certifié */}
              <div className="space-y-2">
                <div className="flex gap-3 items-center">
                  <img
                    src={activeModalItem.image}
                    alt={activeModalItem.title}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#52796F]/20 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm text-[#2C2720] leading-tight">
                      {activeModalItem.title}
                    </h3>
                    <p className="text-xs text-[#6B6358] mt-0.5">
                      Prêté par <strong>{activeModalItem.owner.name}</strong> ({activeModalItem.owner.promo})
                    </p>
                    <p className="text-[10px] text-[#52796F] font-semibold">
                      ⭐ {activeModalItem.owner.rating} / 5 &bull; {activeModalItem.owner.reviewsCount} prêts réussis (0 litige)
                    </p>
                  </div>
                </div>

                {/* Badge d'état certifié */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-[10px] font-bold text-[#354F48]">
                  <span>🛡️ État du matériel :</span>
                  <span className="text-[#52796F]">{activeModalItem.condition || 'Comme neuf'}</span>
                </div>
              </div>

              {/* Checklist des Accessoires Inclus (Fiche 360°) */}
              {activeModalItem.includedAccessories && (
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#8C8275] uppercase block">
                    Accessoires inclus & vérifiés lors du retrait :
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#2C2720]">
                    {activeModalItem.includedAccessories.map((acc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-[#EAE2D5]">
                        <span className="text-[#52796F] font-bold">✓</span>
                        <span className="truncate">{acc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spécifications Clés */}
              {activeModalItem.specs && (
                <div className="flex gap-1.5 flex-wrap">
                  {activeModalItem.specs.map((spec, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-white border border-[#EAE2D5] text-[9px] font-semibold text-[#6B6358]">
                      ⚙️ {spec}
                    </span>
                  ))}
                </div>
              )}

              {/* Avis d'étudiants de l'N7 */}
              {activeModalItem.reviews && activeModalItem.reviews.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#8C8275] uppercase block">
                    Derniers avis d'élèves de l'N7 :
                  </span>
                  <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {activeModalItem.reviews.map((rev, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white border border-[#EAE2D5] text-[10px] space-y-0.5">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-[#2C2720]">{rev.author} ({rev.promo})</span>
                          <span className="text-[#D87D4A]">⭐ {rev.rating}/5</span>
                        </div>
                        <p className="text-[#6B6358] italic leading-tight">« {rev.comment} »</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SÉLECTEUR DE DATE & HEURE AU JOUR LE JOUR (Datepicker 7j/7) */}
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2C2720]">Créneau sélectionné :</span>
                  <span className="font-extrabold text-[#52796F]">{periodInfo.label}</span>
                </div>
                <p className="text-[11px] text-[#6B6358] flex items-center gap-1.5">
                  <i data-lucide="clock" className="w-3.5 h-3.5 text-[#52796F]"></i>
                  <span>{periodInfo.dates}</span>
                </p>

                {/* Choix de l'heure de rendez-vous */}
                <div className="pt-1 border-t border-[#EAE2D5]">
                  <label className="block text-[9px] font-bold text-[#8C8275] uppercase mb-1">
                    Heure de rendez-vous souhaitée :
                  </label>
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    {['12h00', '14h00', '17h00', '18h30'].map((h) => (
                      <button
                        key={h}
                        type="button"
                        className="py-1 rounded-lg bg-white border border-[#EAE2D5] text-center font-semibold text-[#2C2720] hover:border-[#52796F] hover:bg-[#E6EFE6]"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
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

              {/* Garantie Caution Sans Débit */}
              <div className="p-2.5 rounded-2xl bg-[#E6EFE6] text-[#354F48] text-[10px] flex items-center gap-2">
                <i data-lucide="shield-check" className="w-4 h-4 text-[#52796F] flex-shrink-0"></i>
                <span>Caution de <strong>{activeModalItem.depositAmount} € bloquée SANS DÉBIT</strong>. Libérée automatiquement dès la restitution.</span>
              </div>
            </div>

            {/* STICKY BOTTOM BAR (Toujours visible sous le pouce !) */}
            <div className="p-3.5 bg-white/95 backdrop-blur-md border-t border-[#F0EBE1] flex-shrink-0 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs px-1">
                <div>
                  <span className="text-[9px] text-[#8C8275] block font-semibold">Total ({periodInfo.tag})</span>
                  <span className="font-extrabold text-sm text-[#52796F]">
                    {calculateItemPrice(activeModalItem).toFixed(2)} €
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-[#354F48] bg-[#E6EFE6] px-2 py-0.5 rounded-full inline-block">
                    0,00 € débité aujourd'hui
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const confirmedItem = activeModalItem;
                  const cost = calculateItemPrice(confirmedItem);
                  const newBookingRef = `CS-N7-2026-${Math.floor(100 + Math.random() * 900)}`;
                  const newPinCode = `${Math.floor(1000 + Math.random() * 9000)}`;
                  window.CS.data.bookings.unshift({
                    id: `book-${Date.now()}`,
                    bookingRef: newBookingRef,
                    itemTitle: confirmedItem.title,
                    itemCategory: confirmedItem.categoryLabel,
                    itemPrice: cost,
                    depositAmount: confirmedItem.depositAmount,
                    periodLabel: periodInfo.dates,
                    type: periodInfo.tag,
                    pickupLocation: pickupSpot,
                    status: 'confirmed',
                    step: 1, // 1: Confirmée, 2: Retrait & Check-in, 3: Utilisation, 4: Restitution
                    pinCode: newPinCode,
                    renterName: 'Alban D.',
                    ownerName: confirmedItem.owner.name,
                    ownerPromo: confirmedItem.owner.promo || '2A ENSEEIHT',
                    ownerAvatar: confirmedItem.owner.avatar,
                    ownerPhone: '06 42 78 91 23',
                    accessories: confirmedItem.includedAccessories || [
                      'Accessoire officiel vérifié',
                      'Câbles et connectique d\'origine',
                      'Notice campus'
                    ]
                  });
                  setBookingSuccess({
                    title: confirmedItem.title,
                    dates: periodInfo.dates,
                    spot: pickupSpot,
                    bookingRef: newBookingRef,
                    ownerName: confirmedItem.owner.name
                  });
                  setActiveModalItem(null);
                }}
                className="w-full py-3 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <span>Confirmer ma réservation en 1 clic</span>
                <i data-lucide="arrow-right" className="w-3.5 h-3.5"></i>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
