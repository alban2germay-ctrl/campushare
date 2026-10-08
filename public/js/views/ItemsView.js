// ==============================================================================
// 🎒 CampuShare — Vue ItemsView (Chantier B : Moteur Propriétaire & Matériel)
// Fichier : public/js/views/ItemsView.js
// Responsable principal : Mathys (Directeur 3EA)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ItemsView = function ItemsView({ activeUserData, currentUser }) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [itemsList, setItemsList] = React.useState(window.CS.data.items || []);
  const [pendingRequests, setPendingRequests] = React.useState([
    {
      id: 'req-101',
      requesterName: 'Hugo L.',
      requesterPromo: '1A SN',
      requesterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      itemTitle: currentUser === 'alban' ? 'Enceinte JBL Partybox 310' : 'Appareil à Raclette 8p Tefal',
      dates: 'Vendredi 18h00 → Dimanche 20h00',
      periodType: 'Forfait Week-end',
      estimatedEarning: currentUser === 'alban' ? 28.00 : 12.00,
      depositAmount: currentUser === 'alban' ? 120.00 : 40.00,
      pickupSpot: 'Foyer des élèves N7',
      status: 'pending' // 'pending' | 'accepted' | 'declined'
    }
  ]);
  const [toastMessage, setToastMessage] = React.useState(null);

  // États du formulaire d'ajout express (< 60s)
  const [newTitle, setNewTitle] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('party');
  const [newPurchaseValue, setNewPurchaseValue] = React.useState('');
  const [newPriceDay, setNewPriceDay] = React.useState('');
  const [newPriceWeekend, setNewPriceWeekend] = React.useState('');
  const [newDeposit, setNewDeposit] = React.useState('');
  const [photoPreview, setPhotoPreview] = React.useState(null);

  const fileInputRef = React.useRef(null);

  // Actualiser les icônes Lucide
  React.useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [itemsList, pendingRequests, showAddModal, toastMessage, photoPreview]);

  // Algorithme de tarification suggérée (Micro-tâche MT-3.1.1.4)
  const handlePurchaseValueChange = (val) => {
    setNewPurchaseValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      // 10% de la valeur neuf pour 24h, min 4€
      const day = Math.max(4, Math.round(num * 0.10));
      // Forfait WE avantageux (environ 1.8x prix 24h)
      const we = Math.round(day * 1.8);
      // Caution recommandée (60-80% de la valeur neuf)
      const caution = Math.round(num * 0.75);

      setNewPriceDay(day.toString());
      setNewPriceWeekend(we.toString());
      setNewDeposit(caution.toString());
    } else {
      setNewPriceDay('');
      setNewPriceWeekend('');
      setNewDeposit('');
    }
  };

  // Gestion du déclencheur caméra smartphone (Micro-tâche MT-3.1.1.1 & MT-3.1.1.2)
  const handlePhotoCapture = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Publication d'un nouvel objet (Micro-tâche MT-3.1.1.5)
  const handlePublishItem = () => {
    if (!newTitle.trim()) {
      alert("Veuillez saisir le nom de votre matériel.");
      return;
    }

    const categoryLabels = {
      party: 'Soirée & Fête',
      outdoor: 'Ski & Montagne',
      diy: 'Bricolage',
      kitchen: 'Convivialité'
    };

    const newItem = {
      id: `item-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || 'Matériel Campus',
      pricing: {
        perDay: parseFloat(newPriceDay) || 5.00,
        weekendPackage: parseFloat(newPriceWeekend) || 10.00,
        weeklyPackage: (parseFloat(newPriceDay) || 5.00) * 5
      },
      depositAmount: parseFloat(newDeposit) || 30.00,
      minDuration: '24h',
      owner: {
        name: activeUserData.name,
        promo: activeUserData.promo,
        school: activeUserData.school,
        avatar: activeUserData.avatar,
        rating: 5.0,
        reviewsCount: 0
      },
      image: photoPreview || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      status: 'available',
      pickupLocation: 'Foyer des élèves N7 / Campus'
    };

    // Ajout dans la mémoire partagée et locale
    window.CS.data.items.unshift(newItem);
    setItemsList([...window.CS.data.items]);

    // Reset du formulaire
    setNewTitle('');
    setNewPurchaseValue('');
    setNewPriceDay('');
    setNewPriceWeekend('');
    setNewDeposit('');
    setPhotoPreview(null);
    setShowAddModal(false);

    setToastMessage(`🎉 "${newItem.title}" est maintenant disponible à la location sur le campus !`);
  };

  // Accepter une demande en 1 clic (Micro-tâche MT-3.2.1.3)
  const handleAcceptRequest = (reqId) => {
    setPendingRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'accepted' } : r))
    );
    const req = pendingRequests.find((r) => r.id === reqId);
    if (req) {
      activeUserData.wallet += req.estimatedEarning;
      setToastMessage(`Demande de ${req.requesterName} acceptée ! +${req.estimatedEarning.toFixed(2)} € ajoutés à ta cagnotte.`);
    }
  };

  // Refuser poliment une demande (Micro-tâche MT-3.2.1.4)
  const handleDeclineRequest = (reqId) => {
    setPendingRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'declined' } : r))
    );
    setToastMessage("Demande déclinée. Ton matériel reste libre pour d'autres étudiants.");
  };

  // Filtrer les objets appartenant à l'utilisateur connecté
  const userItems = itemsList.filter((item) =>
    currentUser === 'alban' ? item.owner.name.startsWith('Alban') : item.owner.name.startsWith('Mathys')
  );

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      
      {/* Toast de notification instantané */}
      {toastMessage && (
        <div className="p-3 rounded-2xl bg-[#E6EFE6] border border-[#52796F]/30 text-[#354F48] text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#52796F] text-white flex items-center justify-center text-[11px] font-bold">✓</span>
            <p className="font-bold">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#52796F] text-xs font-bold px-1.5">✕</button>
        </div>
      )}

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

      {/* Bannière cagnotte & revenus générés (Micro-tâche MT-3.2.1.5) */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-br from-[#FEF9EF] to-[#F8EFE3] border border-[#F4E3C5] flex items-center justify-between shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-[#785E2F] uppercase block">Gains cumulés avec mes prêts</span>
          <span className="text-lg font-extrabold text-[#2C2720]">+{activeUserData.wallet.toFixed(2)} €</span>
          <span className="text-[9px] text-[#8C8275] block mt-0.5">Disponibles pour virement bancaire</span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white border border-[#F4E3C5] flex items-center justify-center text-lg shadow-2xs">
          💰
        </div>
      </div>

      {/* DEMANDES ENTRANTES DE CAMARADES (Micro-tâches MT-3.2.1.2 à MT-3.2.1.4) */}
      {pendingRequests.filter((r) => r.status === 'pending').length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#D87D4A] uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D87D4A] animate-ping"></span>
              Demande reçue d'un camarade de promo
            </span>
            <span className="text-[10px] font-bold text-[#52796F] bg-[#E6EFE6] px-1.5 py-0.2 rounded-md">
              1 en attente
            </span>
          </div>

          {pendingRequests
            .filter((r) => r.status === 'pending')
            .map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-3xl bg-white border-2 border-[#D87D4A]/40 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={req.requesterAvatar}
                      alt={req.requesterName}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#52796F]/20"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs text-[#2C2720]">{req.requesterName}</h4>
                      <p className="text-[10px] text-[#6B6358]">{req.requesterPromo} &bull; Profil certifié</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#52796F] bg-[#FAF8F5] px-2 py-1 rounded-xl border border-[#EAE2D5]">
                    +{req.estimatedEarning.toFixed(2)} €
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-[#EAE2D5] space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8C8275]">Objet demandé :</span>
                    <span className="font-bold text-[#2C2720]">{req.itemTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8275]">Créneau :</span>
                    <span className="font-semibold text-[#52796F]">{req.dates}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#8C8275]">Lieu de remise :</span>
                    <span className="text-[#2C2720]">📍 {req.pickupSpot}</span>
                  </div>
                  <div className="flex justify-between text-[10px] pt-1 border-t border-[#F0EBE1] text-[#354F48]">
                    <span>Garantie caution :</span>
                    <span className="font-bold">{req.depositAmount} € bloquée sans débit</span>
                  </div>
                </div>

                {/* Boutons d'action : Accepter ou Refuser */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDeclineRequest(req.id)}
                    className="py-2 rounded-xl border border-[#EAE2D5] text-[#8C8275] text-xs font-semibold hover:bg-[#FAF8F5] transition"
                  >
                    Décliner
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(req.id)}
                    className="py-2 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43665D] transition shadow-xs flex items-center justify-center gap-1"
                  >
                    <i data-lucide="check" className="w-3.5 h-3.5"></i>
                    <span>Accepter (+{req.estimatedEarning.toFixed(0)}€)</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* LISTE DES OBJETS DU PROPRIÉTAIRE (Micro-tâche MT-3.2.1.1) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#8C8275] uppercase tracking-wider">Mes annonces actives</span>
          <span className="text-[10px] text-[#52796F] font-bold">{userItems.length} équipement(s)</span>
        </div>

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
                {item.status === 'available' ? 'Disponible 7j/7' : 'En cours de prêt'}
              </span>
              <span className="text-[10px] text-[#8C8275] font-semibold">
                Caution fixée : {item.depositAmount} €
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
                  {item.pricing.perDay.toFixed(0)}€ /jour &bull; {item.pricing.weekendPackage.toFixed(0)}€ /we &bull; {item.categoryLabel}
                </p>
                <p className="text-[9px] text-[#8C8275] truncate mt-0.5">
                  📍 {item.pickupLocation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EBE1]">
              <button
                onClick={() => alert(`Tarifs actuels pour ${item.title} :\n• 24h : ${item.pricing.perDay}€\n• Forfait WE : ${item.pricing.weekendPackage}€\n• Semaine : ${item.pricing.weeklyPackage}€\n• Caution : ${item.depositAmount}€`)}
                className="py-1.5 rounded-xl border border-[#EAE2D5] text-[#2C2720] text-xs font-semibold hover:bg-[#FAF8F5] transition"
              >
                Gérer tarifs
              </button>
              <button
                onClick={() => alert(`Disponibilité 7j/7 confirmée pour ${item.title} au Foyer N7 !`)}
                className="py-1.5 rounded-xl bg-[#FAF8F5] text-[#52796F] text-xs font-bold hover:bg-[#EAE2D5] transition"
              >
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

      {/* MODALE D'AJOUT D'OBJET EXPRESS AVEC DÉCLENCHEUR CAMÉRA & TARIFICATION SUGGÉRÉE (Micro-tâches MT-3.1.1.1 à MT-3.1.1.5) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-xl border border-[#EAE2D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <div>
                <h3 className="font-extrabold text-sm text-[#2C2720]">Ajouter un équipement</h3>
                <p className="text-[10px] text-[#6B6358]">Formulaire express &bull; Prêt 7j/7 sur le campus</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* 1. Déclencheur Caméra Smartphone & Prévisualisation (MT-3.1.1.1 & MT-3.1.1.2) */}
              <div>
                <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1">
                  1. Photo de ton matériel
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
                
                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#52796F] shadow-xs">
                    <img src={photoPreview} alt="Aperçu" className="w-full h-32 object-cover" />
                    <button
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs"
                    >
                      ✕ Reprendre
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="border-2 border-dashed border-[#EAE2D5] rounded-2xl p-4 text-center bg-[#FAF8F5] hover:bg-[#F4EFE6] cursor-pointer transition space-y-1"
                  >
                    <span className="text-2xl block">📸</span>
                    <span className="text-[11px] font-bold text-[#52796F] block">
                      Prendre une photo avec le smartphone
                    </span>
                    <span className="text-[9px] text-[#8C8275] block">
                      ou sélectionner un fichier depuis la galerie
                    </span>
                  </div>
                )}
              </div>

              {/* 2. Nom de l'objet (MT-3.1.1.3) */}
              <div>
                <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1">
                  2. Nom de l'objet
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Tente 3 places Quechua, Gaufrier, Perceuse..."
                  className="w-full p-2.5 rounded-xl border border-[#EAE2D5] bg-[#FAF8F5] text-xs font-semibold text-[#2C2720] focus:outline-none focus:ring-2 focus:ring-[#52796F]/30"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-[10px] font-bold text-[#8C8275] uppercase mb-1">
                  Catégorie
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EAE2D5] bg-[#FAF8F5] text-xs font-semibold text-[#2C2720] focus:outline-none focus:ring-2 focus:ring-[#52796F]/30"
                >
                  <option value="party">🎉 Soirée & Fête</option>
                  <option value="outdoor">🏔️ Ski & Montagne</option>
                  <option value="diy">🔨 Bricolage & Déménagement</option>
                  <option value="kitchen">🍳 Convivialité</option>
                </select>
              </div>

              {/* 3. Valeur à neuf & Algorithme de tarification suggérée (MT-3.1.1.4) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-[#8C8275] uppercase">
                    3. Valeur d'achat neuve (€)
                  </label>
                  <span className="text-[9px] font-bold text-[#52796F]">
                    ⚡ Calcul automatique des tarifs
                  </span>
                </div>
                <input
                  type="number"
                  value={newPurchaseValue}
                  onChange={(e) => handlePurchaseValueChange(e.target.value)}
                  placeholder="Ex: 50 €"
                  className="w-full p-2.5 rounded-xl border border-[#EAE2D5] bg-[#FAF8F5] text-xs font-semibold text-[#2C2720] focus:outline-none focus:ring-2 focus:ring-[#52796F]/30"
                />
              </div>

              {/* Tarifs suggérés générés automatiquement */}
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2">
                <span className="text-[9px] font-bold text-[#8C8275] uppercase block">
                  Tarifs & Caution calculés (Modifiables) :
                </span>
                
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <span className="text-[8px] text-[#8C8275] block font-semibold">PRIX 24H</span>
                    <input
                      type="number"
                      value={newPriceDay}
                      onChange={(e) => setNewPriceDay(e.target.value)}
                      placeholder="5 €"
                      className="w-full p-1.5 rounded-lg border border-[#EAE2D5] bg-white text-xs font-bold text-[#2C2720] text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[8px] text-[#8C8275] block font-semibold">FORFAIT WE</span>
                    <input
                      type="number"
                      value={newPriceWeekend}
                      onChange={(e) => setNewPriceWeekend(e.target.value)}
                      placeholder="10 €"
                      className="w-full p-1.5 rounded-lg border border-[#EAE2D5] bg-white text-xs font-bold text-[#52796F] text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[8px] text-[#8C8275] block font-semibold">CAUTION</span>
                    <input
                      type="number"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(e.target.value)}
                      placeholder="35 €"
                      className="w-full p-1.5 rounded-lg border border-[#EAE2D5] bg-white text-xs font-bold text-[#354F48] text-center"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Bouton de publication immédiate (MT-3.1.1.5) */}
            <button
              onClick={handlePublishItem}
              className="w-full py-3 rounded-xl bg-[#D87D4A] text-white text-xs font-bold hover:bg-[#C26B39] transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Publier immédiatement sur le campus</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
