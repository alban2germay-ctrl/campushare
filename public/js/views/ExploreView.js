// ==============================================================================
// 🎒 CampuShare — Vue ExploreView (Chantier A : Moteur Emprunteur & Découverte 7j/7)
// Fichier : public/js/views/ExploreView.js
// Responsable principal : Alban (Directeur SN)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ExploreView = function ExploreView({ onSelectItem, onSelectDates }) {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const categories = window.CS.data.categories || [];
  const items = window.CS.data.items || [];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Bannière de liberté 7j/7 & Flexibilité */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#FAF8F5] to-[#F4EFE6] border border-[#EAE2D5] space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6EFE6] text-[#354F48]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52796F] animate-pulse"></span>
            Locations 7j/7 à l'N7
          </span>
          <span className="text-[10px] text-[#8C8275] font-semibold">Toute l'année</span>
        </div>
        <h3 className="text-sm font-extrabold text-[#2C2720] leading-snug">
          Loue du matériel n'importe quel jour, selon tes besoins
        </h3>
        <p className="text-xs text-[#6B6358] leading-relaxed">
          Que ce soit pour <strong>24h en semaine</strong> (bricolage, soirée crêpes), pour tout le <strong>week-end</strong> ou pour une <strong>semaine entière</strong>, choisis ta formule en toute liberté.
        </p>

        {/* Sélecteur express de formule temporelle */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <div className="p-2 rounded-xl bg-white/90 border border-[#EAE2D5] text-center hover:border-[#52796F] transition cursor-pointer">
            <span className="block text-[9px] text-[#8C8275] font-bold">24H SEMAINE</span>
            <span className="text-xs font-extrabold text-[#2C2720]">Dès 5 €</span>
          </div>
          <div className="p-2 rounded-xl bg-[#52796F] text-white text-center shadow-xs cursor-pointer">
            <span className="block text-[9px] text-white/80 font-bold">WEEK-END</span>
            <span className="text-xs font-extrabold text-white">Ven &rarr; Dim</span>
          </div>
          <div className="p-2 rounded-xl bg-white/90 border border-[#EAE2D5] text-center hover:border-[#52796F] transition cursor-pointer">
            <span className="block text-[9px] text-[#8C8275] font-bold">SEMAINE (7J)</span>
            <span className="text-xs font-extrabold text-[#2C2720]">-30%</span>
          </div>
        </div>
      </div>

      {/* 2. Barre de recherche textuelle temps réel */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher appareil raclette, enceinte, perceuse..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#EAE2D5] text-xs text-[#2C2720] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#52796F]/30 shadow-2xs"
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

      {/* 3. Pills de Catégories horizontaux */}
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

      {/* 4. Liste des cartes d'équipements */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
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
                      ⭐ {item.owner.rating} ({item.owner.reviewsCount} avis)
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-[#2C2720] truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#6B6358] truncate">
                    Prêté par {item.owner.name} ({item.owner.promo})
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#F0EBE1]">
                  <div>
                    <span className="text-xs font-extrabold text-[#2C2720]">
                      {item.pricing.perDay.toFixed(2)} €
                    </span>
                    <span className="text-[9px] text-[#8C8275]">
                      {' '}/jour (ou {item.pricing.weekendPackage.toFixed(0)}€ WE)
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-[#354F48] bg-[#E6EFE6] px-1.5 py-0.5 rounded-md">
                    Caution : {item.depositAmount} €
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectDates && onSelectDates(item)}
              className="w-full py-2 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <i data-lucide="calendar" className="w-3.5 h-3.5"></i>
              <span>Choisir mes dates (Semaine ou WE)</span>
            </button>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-xs text-[#8C8275] bg-white rounded-3xl border border-[#EAE2D5]">
            <p className="font-bold text-[#2C2720]">Aucun objet trouvé</p>
            <p className="text-[11px] mt-1">Essaie une autre recherche ou une autre catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};
