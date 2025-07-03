# Configuration de l'authentification - Guide de résolution

## Problème identifié
Vous recevez un email de confirmation de Supabase mais la redirection échoue et vous obtenez "invalid credential" sur klivio.ai.

## Solutions appliquées

### 1. Configuration des URLs de redirection
Le problème principal était que l'application utilisait `window.location.origin` qui génère `localhost` en développement.

**Fichiers modifiés :**
- `components/auth/auth-form.tsx` : Utilise maintenant une configuration d'URL basée sur l'environnement
- `lib/config.ts` : Nouveau fichier de configuration centralisée
- `app/auth/callback/route.ts` : Amélioration de la gestion des erreurs avec logs

### 2. Configuration Supabase requise

Dans votre dashboard Supabase, vous devez configurer :

1. **URLs de redirection autorisées :**
   - `https://klivio.ai/auth/callback` (production)
   - `http://localhost:3000/auth/callback` (développement)

2. **URLs de site autorisées :**
   - `https://klivio.ai` (production)
   - `http://localhost:3000` (développement)

### 3. Variables d'environnement

Créez un fichier `.env.local` avec :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Site Configuration (optionnel pour développement)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 4. Étapes de résolution

1. **Vérifiez la configuration Supabase :**
   - Allez dans Authentication > URL Configuration
   - Ajoutez les URLs de redirection et de site

2. **Redéployez votre application :**
   - Les nouvelles configurations seront prises en compte

3. **Testez la confirmation :**
   - Créez un nouveau compte de test
   - Vérifiez que l'email de confirmation redirige correctement

### 5. Logs de débogage

Les logs ont été ajoutés dans `app/auth/callback/route.ts` pour diagnostiquer les problèmes :
- Vérifiez les logs de votre serveur pour voir les erreurs détaillées
- Les erreurs seront affichées dans la console

### 6. Problèmes courants

- **"Invalid credential"** : Généralement dû à une URL de redirection incorrecte
- **Redirection vers localhost** : Problème de configuration d'environnement
- **Code expiré** : Le code de confirmation expire après 24h

## Support

Si le problème persiste, vérifiez :
1. Les logs de votre serveur
2. La configuration Supabase
3. Les variables d'environnement
4. Les URLs de redirection dans Supabase 