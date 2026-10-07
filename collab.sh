#!/bin/bash
# Script utilitaire de synchronisation pour CampuShare

set -e

ACTION=$1
MESSAGE=${2:-"feat: mise a jour du projet"}

case "$ACTION" in
  pull)
    echo "⬇️  Récupération des nouveautés..."
    git pull origin main
    echo "✅ Projet à jour !"
    ;;
  save)
    echo "📸 Sauvegarde des modifications..."
    git add .
    git commit -m "$MESSAGE" || echo "Aucune modification à sauvegarder."
    echo "🚀 Envoi sur GitHub..."
    git push origin main
    echo "✅ Modifications envoyées avec succès sur GitHub !"
    ;;
  *)
    echo "Usage :"
    echo "  ./collab.sh pull              -> Récupérer les nouveautés de votre collègue"
    echo "  ./collab.sh save \"Message\"    -> Sauvegarder et envoyer vos modifications"
    ;;
esac
