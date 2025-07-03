#!/bin/bash

# Script d'automatisation pour build et push GitHub
# Usage: ./scripts/auto-build-push.sh [commit_message]

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_message() {
    echo -e "${BLUE}[AUTO-BUILD]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si on est dans un repo git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Ce répertoire n'est pas un repository Git"
    exit 1
fi

# Vérifier si les variables d'environnement sont présentes
if [ ! -f ".env.local" ]; then
    print_error "Le fichier .env.local n'existe pas"
    exit 1
fi

print_message "Début de l'automatisation build et push..."

# 1. Vérifier le statut git
print_message "Vérification du statut Git..."
git_status=$(git status --porcelain)

if [ -z "$git_status" ]; then
    print_warning "Aucune modification détectée. Rien à commiter."
    exit 0
fi

print_message "Modifications détectées:"
echo "$git_status"

# 2. Ajouter tous les fichiers modifiés
print_message "Ajout des fichiers modifiés..."
git add .

# 3. Créer le message de commit
if [ -n "$1" ]; then
    commit_message="$1"
else
    commit_message="Auto-build: $(date '+%Y-%m-%d %H:%M:%S')"
fi

print_message "Message de commit: $commit_message"

# 4. Commiter les changements
print_message "Commit des changements..."
git commit -m "$commit_message"

# 5. Vérifier le build
print_message "Vérification du build..."
if npm run build; then
    print_success "Build réussi!"
else
    print_error "Échec du build. Annulation du commit..."
    git reset --soft HEAD~1
    exit 1
fi

# 6. Vérifier le type-check TypeScript
print_message "Vérification du type-check TypeScript..."
if npm run type-check; then
    print_success "Type-check réussi!"
else
    print_error "Échec du type-check. Annulation du commit..."
    git reset --soft HEAD~1
    exit 1
fi

# 7. Push vers GitHub
print_message "Push vers GitHub..."
current_branch=$(git branch --show-current)

if git push origin "$current_branch"; then
    print_success "Push réussi vers la branche $current_branch!"
else
    print_error "Échec du push. Le commit reste local."
    exit 1
fi

print_success "Automatisation terminée avec succès! 🚀"
print_message "Build: ✅ | Type-check: ✅ | Push: ✅"
