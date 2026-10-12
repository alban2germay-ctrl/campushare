// ==============================================================================
// 🎒 CampuShare — Vue ExploreView (Chantier A : Moteur Emprunteur & Découverte 7j/7)
// Fichier : public/js/views/ExploreView.js
// Responsable exclusif : Alban (Co-directeur 2A SN)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ExploreView = function ExploreView({ onNavigateTab, activeUserData, currentUser }) {
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
  const isOwnItem = !!activeModalItem && !!activeUserData && activeModalItem.ownerId === activeUserData.id;
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
        <div className="fixed inset-0 !mt-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#EAE2D5] text-center space-y-3.5">
            <div className="w-14 h-14 rounded-full bg-[#E6EFE6] text-[#52796F] flex items-center justify-center text-2xl mx-auto shadow-xs">
              {bookingSuccess.isPending ? '📨' : '🎉'}
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6EFE6] text-[#354F48] text-[9px] font-extrabold uppercase tracking-wide">
                {bookingSuccess.isPending ? `Demande envoyée à ${bookingSuccess.ownerName.split(' ')[0]}` : 'Réservation confirmée'}
              </span>
              <h3 className="font-extrabold text-base text-[#2C2720] mt-1.5 leading-snug">
                {bookingSuccess.title}
              </h3>
              <p className="text-xs text-[#6B6358] mt-0.5">
                {bookingSuccess.isPending
                  ? <>Ton QR de retrait apparaîtra dès que <strong>{bookingSuccess.ownerName}</strong> accepte.</>
                  : <>Prêté par <strong>{bookingSuccess.ownerName}</strong></>}
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
                <span>{bookingSuccess.isPending ? '👉 Suivre ma demande' : '👉 Voir mon QR de retrait'}</span>
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
                { val: 6, label: '≤ 6 €' },
                { val: 12, label: '≤ 12 €' },
                { val: 20, label: '≤ 20 €' }
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

      {/* 5. GRILLE MODERNE D'ÉQUIPEMENTS (2 COLONNES STYLE AIRBNB/VINTED) */}
      <div className="grid grid-cols-2 gap-3">
        {filteredAndSortedItems.map((item) => {
          const activeCost = calculateItemPrice(item);
          return (
            <div
              key={item.id}
              onClick={() => {
                setActiveModalItem(item);
                if (item.pickupLocation) {
                  setPickupSpot(item.pickupLocation.split('/')[0].trim());
                }
              }}
              className="group cursor-pointer rounded-2xl bg-white border border-[#EAE2D5] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#52796F]/40 transition flex flex-col active:scale-[0.98]"
            >
              {/* Photo avec badge prix intégré */}
              <div className="relative aspect-square w-full bg-[#FAF8F5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {item.categoryLabel}
                </span>
                <span className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-[#2C2720] font-extrabold text-xs px-2 py-0.5 rounded-xl shadow-xs">
                  {activeCost.toFixed(0)} €
                  <span className="text-[8px] font-normal text-[#8C8275]">
                    {selectedPeriod === 'weekend' ? '/we' : selectedPeriod === 'weekly' ? '/sem' : '/j'}
                  </span>
                </span>
              </div>

              {/* Infos épurées : Titre + Lieu */}
              <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1">
                <h4 className="font-extrabold text-xs text-[#2C2720] line-clamp-1 leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-[#6B6358]">
                  <span className="truncate">📍 {item.pickupLocation.split('/')[0].trim()}</span>
                  <span className="font-semibold text-[#52796F] text-[9px] flex-shrink-0">
                    ⭐ {item.owner.rating}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAndSortedItems.length === 0 && (
          <div className="col-span-2 p-6 text-center text-xs text-[#8C8275] bg-white rounded-3xl border border-[#EAE2D5] space-y-2">
            <p className="font-bold text-[#2C2720] text-sm">Aucun équipement disponible</p>
            <p className="text-[11px]">Essaie d'élargir ta recherche.</p>
            <button
              onClick={resetAllFilters}
              className="mt-2 px-3 py-1.5 rounded-xl bg-[#52796F] text-white text-xs font-bold shadow-xs hover:bg-[#43665D]"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* 6. FICHE PRODUIT ÉPURÉE & DEMANDE 1-CLIC */}
      {activeModalItem && (
        <div className="fixed inset-0 !mt-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm max-h-[92%] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EAE2D5] overflow-hidden flex flex-col">
            
            {/* Header photo épuré (hauteur fixe : le bouton reste visible sans défiler) */}
            <div className="relative h-40 w-full flex-shrink-0 bg-[#FAF8F5]">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center text-xs font-bold hover:bg-black/70 transition"
              >
                ✕
              </button>
              <span className="absolute bottom-3 left-3 bg-[#52796F] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                ✓ {activeModalItem.categoryLabel}
              </span>
            </div>

            {/* Contenu aéré sans pavés inutiles (défile si l'écran est petit) */}
            <div className="p-4 space-y-3 overflow-y-auto">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-sm text-[#2C2720] leading-tight flex-1">
                    {activeModalItem.title}
                  </h3>
                  <div className="text-right pl-2">
                    <span className="font-extrabold text-base text-[#52796F]">
                      {window.CS.formatPrice(calculateItemPrice(activeModalItem))}
                    </span>
                    <span className="text-[9px] text-[#8C8275] block -mt-0.5">
                      {periodInfo.tag}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[#6B6358] mt-1 flex items-center gap-1.5">
                  <span>Prêté par <strong>{activeModalItem.owner.name}</strong> ({activeModalItem.owner.promo})</span>
                  <span>&bull;</span>
                  <span className="text-[#52796F] font-bold">⭐ {activeModalItem.owner.rating}</span>
                </p>
              </div>

              {/* Lieu de remise campus express */}
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] flex items-center justify-between text-xs">
                <span className="text-[#6B6358] font-semibold text-[11px] flex items-center gap-1.5">
                  <i data-lucide="map-pin" className="w-3.5 h-3.5 text-[#D87D4A]"></i>
                  <span>Remise :</span>
                </span>
                <select
                  value={pickupSpot}
                  onChange={(e) => setPickupSpot(e.target.value)}
                  className="bg-transparent font-bold text-[#2C2720] focus:outline-none cursor-pointer text-[11px]"
                >
                  <option value="Foyer des élèves N7">Foyer N7 (Bât B)</option>
                  <option value="Cafétéria N7">Cafétéria N7</option>
                  <option value="Résidence étudiante R1">Résidence R1</option>
                  <option value="Résidence étudiante R2">Résidence R2</option>
                </select>
              </div>

              {/* Accessoires inclus vérifiés (Option Lucas) */}
              {activeModalItem.includedAccessories && activeModalItem.includedAccessories.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#8C8275] uppercase">
                    <span className="flex items-center gap-1">
                      <span>🎒</span>
                      <span>Accessoires inclus vérifiés :</span>
                    </span>
                    <span className="text-[#52796F] font-extrabold">{activeModalItem.includedAccessories.length} éléments</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeModalItem.includedAccessories.map((acc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-white border border-[#EAE2D5] text-[10px] text-[#2C2720] font-medium flex items-center gap-1 shadow-2xs"
                      >
                        <span className="text-[#52796F] font-bold">✓</span> {acc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Garantie Caution avec Réassurance Sans Débit */}
              <div className="p-2.5 rounded-xl bg-[#E6EFE6] text-[#354F48] text-[10px] space-y-1 border border-[#CCE0CC]">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1">
                    <i data-lucide="shield-check" className="w-3.5 h-3.5 text-[#52796F]"></i>
                    <span>Caution {activeModalItem.depositAmount} € garantie</span>
                  </span>
                  <span className="font-extrabold text-[#52796F] text-xs">0,00 € débité</span>
                </div>
                <p className="text-[9px] text-[#52796F] font-medium leading-tight">
                  Empreinte bancaire sécurisée sans débit ni blocage de ton plafond étudiant.
                </p>
              </div>

            </div>

            {/* Bouton direct 1-clic, toujours visible sous le pouce (Sticky Bottom CTA) */}
            <div className="p-4 pt-3 border-t border-[#F0EBE1] flex-shrink-0">
              <button
                onClick={() => {
                  const confirmedItem = activeModalItem;
                  // Demande envoyée au propriétaire (règles communes : js/data/actions.js)
                  const booking = window.CS.actions.requestBooking({
                    item: confirmedItem,
                    renter: activeUserData,
                    price: calculateItemPrice(confirmedItem),
                    periodLabel: periodInfo.dates,
                    periodTag: periodInfo.tag,
                    pickupLocation: pickupSpot
                  });
                  setBookingSuccess({
                    title: confirmedItem.title,
                    dates: periodInfo.dates,
                    spot: pickupSpot,
                    bookingRef: booking.bookingRef,
                    ownerName: confirmedItem.owner.name,
                    isPending: booking.status === 'pending'
                  });
                  setActiveModalItem(null);
                }}
                disabled={isOwnItem}
                className="w-full py-3 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:bg-[#EAE2D5] disabled:text-[#8C8275] disabled:shadow-none disabled:pointer-events-none"
              >
                {isOwnItem ? (
                  <span>C'est ton objet : gère-le dans « Mes Objets »</span>
                ) : (
                  <>
                    <span>Demander à {activeModalItem.owner.name.split(' ')[0]} ({window.CS.formatPrice(calculateItemPrice(activeModalItem))})</span>
                    <i data-lucide="arrow-right" className="w-3.5 h-3.5"></i>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
