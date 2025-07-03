#!/bin/bash

# Script rapide pour push automatique
# Usage: ./scripts/quick-push.sh [commit_message]

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[QUICK-PUSH]${NC} Début du push automatique..."

# Vérifier les modifications
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${BLUE}[QUICK-PUSH]${NC} Aucune modification détectée."
    exit 0
fi

# Ajouter et commiter
git add .
commit_msg="${1:-Quick push: $(date '+%H:%M:%S')}"
git commit -m "$commit_msg"

# Build rapide (sans type-check pour aller plus vite)
echo -e "${BLUE}[QUICK-PUSH]${NC} Vérification du build..."
if npm run build; then
    echo -e "${GREEN}[QUICK-PUSH]${NC} Build réussi!"
else
    echo -e "${RED}[QUICK-PUSH]${NC} Échec du build. Annulation..."
    git reset --soft HEAD~1
    exit 1
fi

# Push
current_branch=$(git branch --show-current)
if git push origin "$current_branch"; then
    echo -e "${GREEN}[QUICK-PUSH]${NC} Push réussi! 🚀"
else
    echo -e "${RED}[QUICK-PUSH]${NC} Échec du push."
    exit 1
fi
