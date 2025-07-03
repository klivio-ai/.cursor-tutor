# Scripts d'Automatisation

Ce dossier contient des scripts pour automatiser le processus de build et push GitHub.

## Scripts Disponibles

### 1. `auto-build-push.sh` - Script Complet
Script complet avec vérifications approfondies.

**Utilisation :**
```bash
# Avec message de commit automatique
npm run auto-build

# Avec message personnalisé
npm run auto-build:message "Mon message de commit"
```

**Ce que fait le script :**
- ✅ Vérifie le statut Git
- ✅ Ajoute tous les fichiers modifiés
- ✅ Commite les changements
- ✅ Lance le build Next.js
- ✅ Vérifie le type-check TypeScript
- ✅ Push vers GitHub
- ✅ Annule le commit si le build échoue

### 2. `quick-push.sh` - Script Rapide
Version simplifiée pour les push rapides.

**Utilisation :**
```bash
# Avec message automatique
npm run quick-push

# Avec message personnalisé
npm run quick-push "Mon message"
```

**Ce que fait le script :**
- ✅ Ajoute et commite les changements
- ✅ Lance le build Next.js (sans type-check)
- ✅ Push vers GitHub

## Configuration Requise

1. **Repository Git initialisé**
2. **Fichier `.env.local` présent** avec les variables Supabase
3. **Remote GitHub configuré**

## Exemples d'Utilisation

```bash
# Push rapide après modifications
npm run quick-push

# Push complet avec vérifications
npm run auto-build

# Push avec message personnalisé
npm run auto-build:message "Ajout de nouvelles fonctionnalités"
```

## Gestion des Erreurs

- Si le build échoue, le commit est automatiquement annulé
- Les erreurs sont affichées en rouge
- Le script s'arrête à la première erreur

## Personnalisation

Vous pouvez modifier les scripts selon vos besoins :
- Ajouter des tests supplémentaires
- Modifier les messages par défaut
- Ajouter des notifications (Slack, Discord, etc.) 