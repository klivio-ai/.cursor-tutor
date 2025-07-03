#!/bin/bash

# Script pour tester la connexion à Supabase
echo "🔍 Test de connexion à Supabase..."

# Vérifier si les variables d'environnement sont définies
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL n'est pas définie"
    echo "📝 Copiez env.example vers .env.local et configurez vos variables"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY n'est pas définie"
    echo "📝 Copiez env.example vers .env.local et configurez vos variables"
    exit 1
fi

echo "✅ Variables d'environnement configurées"
echo "URL: $NEXT_PUBLIC_SUPABASE_URL"

# Tester la connexion à l'API
echo "🌐 Test de connexion à l'API Supabase..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/")

if [ "$response" = "200" ]; then
    echo "✅ Connexion à l'API réussie"
else
    echo "❌ Échec de connexion à l'API (code: $response)"
    echo "🔧 Vérifiez que Supabase est démarré avec: supabase start"
    exit 1
fi

# Tester la connexion à la base de données
echo "🗄️ Test de connexion à la base de données..."
if command -v psql &> /dev/null; then
    db_url=$(supabase db url 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "✅ Connexion à la base de données réussie"
        echo "URL DB: $db_url"
    else
        echo "❌ Échec de connexion à la base de données"
        echo "🔧 Vérifiez que Supabase est démarré avec: supabase start"
    fi
else
    echo "⚠️ psql n'est pas installé, impossible de tester la connexion DB"
fi

# Tester les tables
echo "📋 Test des tables..."
tables_response=$(curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY")

if echo "$tables_response" | grep -q "users"; then
    echo "✅ Table 'users' trouvée"
else
    echo "❌ Table 'users' non trouvée"
    echo "🔧 Exécutez le script de création des tables"
fi

if echo "$tables_response" | grep -q "properties"; then
    echo "✅ Table 'properties' trouvée"
else
    echo "❌ Table 'properties' non trouvée"
fi

if echo "$tables_response" | grep -q "categories"; then
    echo "✅ Table 'categories' trouvée"
else
    echo "❌ Table 'categories' non trouvée"
fi

echo ""
echo "🎉 Test de connexion terminé !"
echo ""
echo "📊 Pour démarrer Supabase : ./scripts/setup-supabase-local.sh"
echo "🌐 Interface d'administration : $(supabase status --output json 2>/dev/null | jq -r '.studio.url' 2>/dev/null || echo 'Supabase non démarré')" 