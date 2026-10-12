// ==============================================================================
// 🎒 CampuShare — Formatage partagé (Contrat Commun Alban & Mathys)
// Fichier : public/js/data/format.js
// ------------------------------------------------------------------------------
// Prix à la française partout dans l'app : 6 → "6,00 €", 32.5 → "32,50 €".
// Usage dans une vue : {window.CS.formatPrice(item.price)}
// ==============================================================================

window.CS = window.CS || {};

window.CS.formatPrice = function formatPrice(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
};
