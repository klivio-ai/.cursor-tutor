# Configuration Supabase avec Utilisateurs

Ce guide vous explique comment configurer Supabase en local avec la gestion des utilisateurs pour résoudre les problèmes de `user_id`.

## 🚀 Installation et Configuration

### 1. Prérequis

- Docker installé
- Node.js 18+
- Supabase CLI

### 2. Installation de Supabase CLI

```bash
brew install supabase/tap/supabase
```

### 3. Configuration des Variables d'Environnement

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp env.example .env.local
```

Modifiez `.env.local` avec vos valeurs Supabase.

### 4. Démarrage de Supabase en Local

Exécutez le script de configuration automatique :

```bash
./scripts/setup-supabase-local.sh
```

Ce script va :
- Initialiser le projet Supabase
- Démarrer les services Docker
- Créer les tables avec la gestion des utilisateurs
- Insérer des données de test

### 5. Test de Connexion

Vérifiez que tout fonctionne :

```bash
./scripts/test-supabase-connection.sh
```

## 📊 Structure de la Base de Données

### Table `users`
- `id` : UUID (clé primaire)
- `email` : Email unique de l'utilisateur
- `full_name` : Nom complet
- `avatar_url` : URL de l'avatar
- `created_at` / `updated_at` : Timestamps

### Tables avec `user_id`
Toutes les tables principales incluent maintenant une colonne `user_id` :

- `categories` : Catégories de revenus/dépenses
- `properties` : Propriétés immobilières
- `tenants` : Locataires
- `revenues` : Revenus
- `expenses` : Dépenses
- `payments` : Paiements

## 🔐 Sécurité (Row Level Security)

Chaque table a des politiques RLS qui :
- Permettent aux utilisateurs de voir uniquement leurs données
- Empêchent l'accès aux données d'autres utilisateurs
- Utilisent `auth.uid()` pour identifier l'utilisateur connecté

## 👥 Gestion des Utilisateurs

### Création Automatique
Quand un utilisateur s'inscrit via Supabase Auth, un enregistrement est automatiquement créé dans la table `users` via le trigger `on_auth_user_created`.

### Données de Test
Le script insère 3 utilisateurs de test :
- John Doe (john.doe@example.com)
- Jane Smith (jane.smith@example.com)
- Bob Wilson (bob.wilson@example.com)

## 🛠️ Commandes Utiles

```bash
# Démarrer Supabase
supabase start

# Arrêter Supabase
supabase stop

# Voir le statut
supabase status

# Accéder à la base de données
supabase db reset

# Interface d'administration
# Ouvrez l'URL affichée par supabase status
```

## 🔧 Résolution de Problèmes

### Problème : "user_id is null"
- Vérifiez que l'utilisateur est authentifié
- Assurez-vous que la table `users` existe
- Vérifiez les politiques RLS

### Problème : "Table not found"
- Exécutez le script de création des tables
- Vérifiez que Supabase est démarré

### Problème : "Connection refused"
- Vérifiez que Docker est démarré
- Redémarrez Supabase : `supabase stop && supabase start`

## 📝 Fichiers Importants

- `scripts/create-tables-with-users.sql` : Structure de la base de données
- `scripts/insert-sample-data-with-users.sql` : Données de test
- `scripts/setup-supabase-local.sh` : Configuration automatique
- `scripts/test-supabase-connection.sh` : Test de connexion
- `types/database.ts` : Types TypeScript mis à jour

## 🌐 Interface d'Administration

Une fois Supabase démarré, accédez à l'interface d'administration :
- URL : Affichée par `supabase status`
- Permet de visualiser et modifier les données
- Gestion des utilisateurs et des politiques RLS 