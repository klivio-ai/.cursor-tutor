#!/bin/bash

# Script d'installation des prérequis pour Supabase
echo "🔧 Installation des prérequis pour Supabase..."

# Vérifier le système d'exploitation
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Système macOS détecté"
    
    # Vérifier si Homebrew est installé
    if ! command -v brew &> /dev/null; then
        echo "📦 Installation de Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        echo "✅ Homebrew déjà installé"
    fi
    
    # Installer Docker Desktop
    if ! command -v docker &> /dev/null; then
        echo "🐳 Installation de Docker Desktop..."
        brew install --cask docker
        echo "⚠️ Docker Desktop a été installé. Veuillez :"
        echo "   1. Ouvrir Docker Desktop"
        echo "   2. Accepter les conditions d'utilisation"
        echo "   3. Attendre que Docker démarre"
        echo "   4. Relancer ce script"
        exit 0
    else
        echo "✅ Docker déjà installé"
    fi
    
    # Installer Supabase CLI
    if ! command -v supabase &> /dev/null; then
        echo "📦 Installation de Supabase CLI..."
        brew install supabase/tap/supabase
    else
        echo "✅ Supabase CLI déjà installé"
    fi
    
    # Installer jq pour les scripts
    if ! command -v jq &> /dev/null; then
        echo "📦 Installation de jq..."
        brew install jq
    else
        echo "✅ jq déjà installé"
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Système Linux détecté"
    
    # Installer Docker
    if ! command -v docker &> /dev/null; then
        echo "🐳 Installation de Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        echo "⚠️ Docker a été installé. Veuillez vous déconnecter et vous reconnecter, puis relancer ce script"
        exit 0
    else
        echo "✅ Docker déjà installé"
    fi
    
    # Installer Supabase CLI
    if ! command -v supabase &> /dev/null; then
        echo "📦 Installation de Supabase CLI..."
        curl -fsSL https://supabase.com/install.sh | sh
    else
        echo "✅ Supabase CLI déjà installé"
    fi
    
else
    echo "❌ Système d'exploitation non supporté : $OSTYPE"
    echo "Veuillez installer manuellement :"
    echo "- Docker Desktop (https://www.docker.com/products/docker-desktop)"
    echo "- Supabase CLI (https://supabase.com/docs/guides/cli)"
    exit 1
fi

# Vérifier que Docker fonctionne
echo "🔍 Vérification de Docker..."
if docker info &> /dev/null; then
    echo "✅ Docker fonctionne correctement"
else
    echo "❌ Docker ne fonctionne pas"
    echo "🔧 Veuillez démarrer Docker et relancer ce script"
    exit 1
fi

# Vérifier que Supabase CLI fonctionne
echo "🔍 Vérification de Supabase CLI..."
if supabase --version &> /dev/null; then
    echo "✅ Supabase CLI fonctionne correctement"
    echo "Version: $(supabase --version)"
else
    echo "❌ Supabase CLI ne fonctionne pas"
    exit 1
fi

echo ""
echo "🎉 Tous les prérequis sont installés !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Copiez le fichier d'environnement : cp env.example .env.local"
echo "2. Configurez vos variables dans .env.local"
echo "3. Lancez la configuration Supabase : ./scripts/setup-supabase-local.sh" 