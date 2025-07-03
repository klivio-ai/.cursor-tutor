#!/bin/bash

# Script pour configurer Supabase en local
echo "🚀 Configuration de Supabase en local..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé. Installation..."
    brew install supabase/tap/supabase
fi

# Initialiser le projet Supabase s'il n'existe pas déjà
if [ ! -d "supabase" ]; then
    echo "📁 Initialisation du projet Supabase..."
    supabase init
fi

# Démarrer Supabase en local
echo "🔄 Démarrage de Supabase en local..."
supabase start

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Appliquer les migrations
echo "🗄️ Application des migrations..."
supabase db reset

# Exécuter le script de création des tables
echo "📋 Création des tables..."
psql "$(supabase db url)" -f scripts/create-tables-with-users.sql

# Insérer les données de test
echo "📊 Insertion des données de test..."
psql "$(supabase db url)" -f scripts/insert-sample-data-with-users.sql

echo "✅ Configuration terminée !"
echo ""
echo "📊 Informations de connexion :"
echo "URL: $(supabase status --output json | jq -r '.api.url')"
echo "Anon Key: $(supabase status --output json | jq -r '.api.anon_key')"
echo "Service Role Key: $(supabase status --output json | jq -r '.api.service_role_key')"
echo ""
echo "🌐 Interface d'administration :"
echo "Studio: $(supabase status --output json | jq -r '.studio.url')"
echo ""
echo "🔧 Pour arrêter Supabase : supabase stop"
echo "🔧 Pour redémarrer : supabase start" 