#!/usr/bin/env bash

# ==============================================================================
# 🎒 CampuShare — Script d'Aide à la Collaboration (Alban & Mathys)
# Commandes simples pour synchroniser le code et lancer la PWA en direct.
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

show_help() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}🎒 CampuShare PWA • Commandes Rapides Alban & Mathys${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "Utilisation : ${YELLOW}./collab.sh [commande]${NC}"
  echo ""
  echo -e "  ${GREEN}pull${NC}               👉 Récupérer le travail de votre collègue depuis GitHub"
  echo -e "  ${GREEN}save \"Message\"${NC}     👉 Sauvegarder, envoyer sur GitHub et alerter Discord"
  echo -e "  ${GREEN}start${NC}              👉 Lancer la PWA sur votre écran : http://localhost:3000"
  echo -e "  ${GREEN}status${NC}             👉 Voir l'état de vos modifications locales"
  echo -e "  ${GREEN}branch [nom]${NC}       👉 Créer un brouillon de test (ex: ./collab.sh branch test-photo)"
  echo -e "  ${GREEN}main${NC}               👉 Revenir sur la branche principale"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

case "$1" in
  pull)
    echo -e "${YELLOW}📥 Récupération des dernières nouveautés depuis GitHub...${NC}"
    git pull origin main
    echo -e "${GREEN}✅ Projet 100% à jour avec le travail de votre binôme !${NC}"
    ;;

  save)
    if [ -z "$2" ]; then
      echo -e "${RED}❌ Erreur : Vous devez préciser un message de description.${NC}"
      echo -e "Exemple : ${YELLOW}./collab.sh save \"Micro-tâche 1.1.1 terminée\"${NC}"
      exit 1
    fi
    echo -e "${YELLOW}📸 Sauvegarde de votre travail...${NC}"
    git add .
    git commit -m "$2" || echo "Rien à commiter."
    echo -e "${YELLOW}🚀 Envoi sur GitHub et notification Discord...${NC}"
    git push origin $(git branch --show-current)
    echo -e "${GREEN}✅ Modifications envoyées avec succès ! Le Discord a sonné.${NC}"
    ;;

  start)
    echo -e "${GREEN}📱 Démarrage de la PWA CampuShare sur le port 3000...${NC}"
    echo -e "👉 Ouvrez votre navigateur sur : ${BLUE}http://localhost:3000${NC}"
    python3 -m http.server 3000 --directory public
    ;;

  status)
    echo -e "${BLUE}📊 Vos fichiers modifiés :${NC}"
    git status -s
    ;;

  branch)
    if [ -z "$2" ]; then
      echo -e "${RED}❌ Précisez un nom de branche.${NC}"
      echo -e "Exemple : ${YELLOW}./collab.sh branch test-ui${NC}"
      exit 1
    fi
    git checkout -b "$2"
    echo -e "${GREEN}🌿 Branche '$2' créée ! Vous pouvez tester sans risque.${NC}"
    ;;

  main)
    git checkout main
    git pull origin main
    echo -e "${GREEN}🏠 De retour sur la branche principale 'main'.${NC}"
    ;;

  *)
    show_help
    ;;
esac
