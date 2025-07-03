#!/bin/bash

# Script rapide pour push automatique SANS vérification du build
# Usage: ./scripts/quick-push-no-build.sh [commit_message]

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}[QUICK-PUSH]${NC} Début du push automatique (sans build check)..."

# Vérifier les modifications
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${BLUE}[QUICK-PUSH]${NC} Aucune modification détectée."
    exit 0
fi

# Ajouter et commiter
git add .
commit_msg="${1:-Quick push: $(date '+%H:%M:%S')}"
git commit -m "$commit_msg"

echo -e "${YELLOW}[QUICK-PUSH]${NC} Build check désactivé pour éviter les erreurs Supabase..."

# Push
current_branch=$(git branch --show-current)
if git push origin "$current_branch"; then
    echo -e "${GREEN}[QUICK-PUSH]${NC} Push réussi! 🚀"
else
    echo -e "${RED}[QUICK-PUSH]${NC} Échec du push."
    exit 1
fi
