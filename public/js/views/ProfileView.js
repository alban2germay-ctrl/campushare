// ==============================================================================
// 🎒 CampuShare — Vue ProfileView (Chantier D : Compte Étudiant, Litiges & Confiance)
// Fichier : public/js/views/ProfileView.js
// Conforme à la Phase 4 du BOARD.md (MT-4.1.1.6 & MT-4.1.1.8)
// ==============================================================================

window.CS = window.CS || {};
window.CS.views = window.CS.views || {};

window.CS.views.ProfileView = function ProfileView({ activeUserData, currentUser }) {
  const { useState, useEffect } = React;

  // 1. MODALE LITIGE SIMPLIFIÉ (MT-4.1.1.6)
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeForm, setDisputeForm] = useState({
    itemTitle: 'Perceuse sans fil Bosch 18V',
    reason: 'accessory_missing',
    description: '',
    photoPreview: null
  });
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  // 2. MODALE SÉCURITÉ E-MAIL INSTITUTIONNEL (@enseeiht.fr) (MT-4.1.1.8)
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [domainError, setDomainError] = useState(null);
  const [domainSuccess, setDomainSuccess] = useState(false);

  // Synchronisation des icônes Lucide
  useEffect(() => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }, [isDisputeModalOpen, isDomainModalOpen, disputeSuccess, domainSuccess]);

  // MT-4.1.1.8 : Filtrage strict du domaine e-mail @enseeiht.fr
  const handleVerifyDomain = (e) => {
    e.preventDefault();
    const email = testEmail.trim().toLowerCase();
    if (!email.endsWith('@enseeiht.fr') && !email.endsWith('@toulouse-inp.fr')) {
      setDomainError('❌ Accès refusé : Seules les adresses étudiantes @enseeiht.fr ou @toulouse-inp.fr sont autorisées.');
      setDomainSuccess(false);
    } else {
      setDomainError(null);
      setDomainSuccess(true);
      setTimeout(() => {
        setIsDomainModalOpen(false);
        setDomainSuccess(false);
        setTestEmail('');
      }, 1500);
    }
  };

  // MT-4.1.1.6 : Envoi d'un signalement de litige avec médiation BDE
  const handleSubmitDispute = (e) => {
    e.preventDefault();
    setDisputeSuccess(true);
    setTimeout(() => {
      setIsDisputeModalOpen(false);
      setDisputeSuccess(false);
      setDisputeForm({
        itemTitle: 'Perceuse sans fil Bosch 18V',
        reason: 'accessory_missing',
        description: '',
        photoPreview: null
      });
    }, 1800);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in text-left">
      {/* 1. CARTE PROFIL CERTIFIÉ & DOMAINE N7 (MT-4.1.1.8) */}
      <div className="p-4 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs text-center space-y-2.5">
        <div className="relative inline-block">
          <img
            src={activeUserData.avatar}
            alt={activeUserData.name}
            className="w-16 h-16 rounded-full mx-auto ring-4 ring-[#52796F]/20 object-cover shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#52796F] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
            ✓
          </span>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-sm font-extrabold text-[#2C2720]">{activeUserData.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F1EE] text-[#52796F] border border-[#52796F]/20">
              Certifié N7
            </span>
          </div>
          <p className="text-xs text-[#6B6358] mt-0.5">{activeUserData.promo} &bull; {activeUserData.school}</p>
          
          <button
            onClick={() => setIsDomainModalOpen(true)}
            className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#52796F] font-mono bg-[#FAF8F5] px-2.5 py-1 rounded-xl border border-[#EAE2D5] hover:bg-[#E8F1EE] transition"
          >
            <i data-lucide="shield-check" className="w-3 h-3"></i>
            <span>{activeUserData.email}</span>
            <span className="text-[9px] text-[#8C8275] font-sans font-bold">(Vérifié)</span>
          </button>
        </div>
      </div>

      {/* 2. STATUT DE CONFIANCE & LITIGES (MT-4.1.1.6) */}
      <div className="p-3.5 rounded-3xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#8C8275] uppercase tracking-wider">
            Indicateurs de Confiance Campus
          </span>
          <span className="text-[10px] font-bold text-[#52796F]">
            Médiation BDE Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 bg-white rounded-2xl border border-[#EAE2D5]">
            <span className="block text-sm font-black text-[#52796F]">
              {activeUserData.trustScore} %
            </span>
            <span className="text-[9px] text-[#8C8275] font-semibold">Matériel rendu intact</span>
          </div>

          <div className="p-2.5 bg-white rounded-2xl border border-[#EAE2D5]">
            <span className="block text-sm font-black text-[#2C2720]">
              {activeUserData.disputes}
            </span>
            <span className="text-[9px] text-[#8C8275] font-semibold">Litige signalé (0%)</span>
          </div>
        </div>

        {/* BOUTON SIGNALER UN LITIGE / CASSE (MT-4.1.1.6) */}
        <button
          onClick={() => setIsDisputeModalOpen(true)}
          className="w-full mt-1 py-2 px-3 rounded-xl bg-white border border-[#EAE2D5] hover:border-[#D87D4A] text-[#9A4C1E] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <i data-lucide="alert-triangle" className="w-3.5 h-3.5 text-[#D87D4A]"></i>
          <span>Signaler un pépin ou casse (Médiation BDE)</span>
        </button>
      </div>

      {/* 3. CARTE SOLDE CAGNOTTE */}
      <div className="p-4 rounded-3xl bg-white border border-[#EAE2D5] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#2C2720]">Solde de la Cagnotte</span>
          <span className="text-base font-black text-[#52796F]">
            {window.CS.formatPrice(activeUserData.wallet)}
          </span>
        </div>
        <p className="text-[10px] text-[#6B6358] leading-relaxed">
          Gains perçus directement sur tes prêts de matériel. Caution restituée sans frais bancaires.
        </p>
        {/* Pas de faux virement : il arrivera avec le paiement en ligne */}
        <button
          disabled
          className="w-full py-2 rounded-xl bg-[#EAE2D5] text-[#8C8275] text-xs font-bold cursor-not-allowed"
        >
          Virement bancaire : bientôt disponible
        </button>
      </div>

      {/* 4. MODALE DE SIGNALEMENT DE LITIGE (MT-4.1.1.6) */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 !mt-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-4 space-y-3.5 shadow-2xl border border-[#EAE2D5]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D5]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FEF4E8] text-[#D87D4A] flex items-center justify-center text-xs font-bold">
                  ⚠️
                </span>
                <h3 className="font-extrabold text-xs text-[#2C2720]">Signalement & Médiation N7</h3>
              </div>
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-xs font-bold border border-[#EAE2D5]"
              >
                ✕
              </button>
            </div>

            {disputeSuccess ? (
              <div className="p-4 bg-[#E8F1EE] rounded-2xl border border-[#52796F]/30 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#52796F] text-white flex items-center justify-center mx-auto text-lg">
                  ✓
                </div>
                <h4 className="font-extrabold text-xs text-[#2C2720]">Signalement noté</h4>
                <p className="text-[10px] text-[#6B6358]">
                  Rien n'est débité. L'envoi automatique au BDE arrive avec la version en ligne : en attendant, contacte directement le BDE de l'N7.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDispute} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#2C2720] mb-1">Motif du signalement :</label>
                  <select
                    value={disputeForm.reason}
                    onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-xs font-semibold text-[#2C2720]"
                  >
                    <option value="accessory_missing">Accessoire manquant par rapport à la checklist</option>
                    <option value="broken">Matériel détérioré ou non fonctionnel</option>
                    <option value="late">Retard important à la restitution</option>
                    <option value="other">Autre motif</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2C2720] mb-1">Description précise :</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Expliquez brièvement la situation pour l'équipe de médiation..."
                    value={disputeForm.description}
                    onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-xs text-[#2C2720]"
                  ></textarea>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-[10px] text-[#6B6358] flex items-center gap-1.5">
                  <i data-lucide="shield" className="w-3.5 h-3.5 text-[#52796F] flex-shrink-0"></i>
                  <span>L'empreinte bancaire reste sécurisée et ne sera pas prélevée arbitrairement.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#D87D4A] hover:bg-[#C26B39] text-white font-extrabold text-xs shadow-xs transition"
                >
                  Envoyer le signalement à la commission
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. MODALE TEST SÉCURITÉ DOMAINE ENSEEIHT (MT-4.1.1.8) */}
      {isDomainModalOpen && (
        <div className="fixed inset-0 !mt-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-4 space-y-3.5 shadow-2xl border border-[#EAE2D5]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D5]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E8F1EE] text-[#52796F] flex items-center justify-center text-xs font-bold">
                  🔒
                </span>
                <h3 className="font-extrabold text-xs text-[#2C2720]">Filtrage Domaine Sécurisé</h3>
              </div>
              <button
                onClick={() => setIsDomainModalOpen(false)}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] text-[#8C8275] hover:text-[#2C2720] flex items-center justify-center text-xs font-bold border border-[#EAE2D5]"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-[#6B6358]">
              CampuShare est un cercle fermé réservé à l'INP ENSEEIHT. Toute adresse externe (ex: @gmail.com) est rigoureusement bloquée.
            </p>

            <form onSubmit={handleVerifyDomain} className="space-y-2 text-xs">
              <label className="block font-bold text-[#2C2720]">Tester la validation d'une adresse :</label>
              <input
                type="email"
                required
                placeholder="prenom.nom@enseeiht.fr"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-xs font-mono"
              />

              {domainError && (
                <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold">
                  {domainError}
                </div>
              )}

              {domainSuccess && (
                <div className="p-2 rounded-xl bg-[#E8F1EE] border border-[#52796F]/30 text-[#52796F] text-[10px] font-bold">
                  ✓ Adresse institutionnelle reconnue et validée !
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#52796F] text-white font-extrabold text-xs shadow-xs hover:bg-[#43665D] transition mt-2"
              >
                Vérifier le domaine institutionnel
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
