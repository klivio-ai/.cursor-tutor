# 🧪 Guide de Test des Nouvelles Fonctionnalités

## 📋 Checklist de Test

### 1. Upload de Fichiers

#### ✅ Test du Composant FileUpload
- [ ] **Drag & Drop** : Glisser un fichier PDF dans la zone
- [ ] **Sélection de fichier** : Cliquer sur "Sélectionner un fichier"
- [ ] **Validation de taille** : Essayer d'uploader un fichier > 5MB
- [ ] **Types de fichiers** : Tester PDF, JPG, PNG, DOC
- [ ] **Prévisualisation** : Vérifier l'affichage du fichier uploadé
- [ ] **Suppression** : Cliquer sur le bouton X pour supprimer
- [ ] **Intégration formulaire** : Vérifier que l'URL est bien enregistrée

#### 🔧 Test sur les Pages
- [ ] **Page Dépenses** : Ajouter une dépense avec fichier
- [ ] **Page Revenus** : Ajouter un revenu avec fichier
- [ ] **Édition** : Modifier un enregistrement avec nouveau fichier
- [ ] **Affichage** : Voir le fichier dans la liste

### 2. Filtres et Recherche Avancée

#### ✅ Test du Composant AdvancedFilters
- [ ] **Recherche globale** : Taper du texte dans la barre de recherche
- [ ] **Expansion** : Cliquer sur "Afficher les filtres"
- [ ] **Filtre par statut** : Sélectionner un statut
- [ ] **Filtre par catégorie** : Sélectionner une catégorie
- [ ] **Filtre par propriété** : Sélectionner une propriété
- [ ] **Filtre par montant** : Entrer min/max
- [ ] **Filtre par date** : Sélectionner une période
- [ ] **Filtres actifs** : Vérifier l'affichage des badges
- [ ] **Suppression filtre** : Cliquer sur X d'un badge
- [ ] **Réinitialisation** : Cliquer sur "Réinitialiser"

#### 🔧 Test sur les Pages
- [ ] **Page Dépenses** : Appliquer tous les filtres
- [ ] **Page Revenus** : Appliquer tous les filtres
- [ ] **Performance** : Vérifier la réactivité des filtres
- [ ] **Données filtrées** : Vérifier l'affichage correct

### 3. Export de Données

#### ✅ Test du Composant DataExport
- [ ] **Sélection de données** : Choisir un type d'export
- [ ] **Export CSV** : Télécharger un fichier CSV
- [ ] **Export PDF** : Télécharger un fichier PDF
- [ ] **Nommage** : Vérifier le nom du fichier avec date
- [ ] **Contenu** : Ouvrir les fichiers et vérifier les données
- [ ] **Filtres appliqués** : Vérifier que l'export respecte les filtres

#### 🔧 Test des Formats
- [ ] **CSV** : Ouvrir dans Excel/LibreOffice
- [ ] **PDF** : Vérifier la mise en page
- [ ] **Données** : Vérifier l'intégrité des données
- [ ] **Encodage** : Vérifier les caractères spéciaux

### 4. Hook useFilters

#### ✅ Test des Fonctionnalités
- [ ] **Filtrage automatique** : Vérifier la réactivité
- [ ] **Recherche multi-champs** : Tester différents champs
- [ ] **Filtres combinés** : Appliquer plusieurs filtres
- [ ] **Performance** : Vérifier l'absence de lag
- [ ] **Type Safety** : Vérifier les types TypeScript

### 5. Intégration Générale

#### ✅ Test de l'Interface
- [ ] **Responsive** : Tester sur mobile/tablette
- [ ] **Navigation** : Vérifier les liens entre pages
- [ ] **Notifications** : Vérifier les toasts
- [ ] **Erreurs** : Tester les cas d'erreur
- [ ] **Chargement** : Vérifier les états de loading

#### 🔧 Test des Données
- [ ] **Cohérence** : Vérifier l'intégrité des données
- [ ] **Synchronisation** : Vérifier la mise à jour en temps réel
- [ ] **Persistance** : Vérifier la sauvegarde en base

## 🐛 Cas de Test d'Erreur

### Upload de Fichiers
- [ ] **Fichier trop volumineux** : > 5MB
- [ ] **Type non autorisé** : .exe, .zip
- [ ] **Connexion perdue** : Pendant l'upload
- [ ] **Stockage plein** : Quota Supabase dépassé

### Filtres
- [ ] **Données vides** : Aucune donnée à filtrer
- [ ] **Filtres invalides** : Dates impossibles
- [ ] **Caractères spéciaux** : Recherche avec accents

### Export
- [ ] **Données vides** : Export sans données
- [ ] **Fichier volumineux** : Beaucoup de données
- [ ] **Caractères spéciaux** : Données avec accents

## 📊 Métriques de Performance

### Temps de Chargement
- [ ] **Page initiale** : < 2 secondes
- [ ] **Filtres** : < 500ms
- [ ] **Upload** : < 5 secondes pour 1MB
- [ ] **Export** : < 10 secondes pour 1000 lignes

### Utilisation Mémoire
- [ ] **Pas de fuites** : Vérifier avec DevTools
- [ ] **Optimisation** : Images compressées
- [ ] **Cache** : Mise en cache efficace

## 🔧 Configuration Supabase

### Vérification Storage
- [ ] **Bucket créé** : "documents" existe
- [ ] **Politiques RLS** : Permissions correctes
- [ ] **Types MIME** : Configuration autorisée
- [ ] **Taille limite** : 5MB configuré

### Vérification Base de Données
- [ ] **Champ file_url** : Présent dans revenues/expenses
- [ ] **Index** : Performance des requêtes
- [ ] **Contraintes** : Intégrité des données

## 📱 Test Mobile

### Responsive Design
- [ ] **Mobile** : iPhone/Android
- [ ] **Tablette** : iPad/Android
- [ ] **Desktop** : Chrome/Firefox/Safari
- [ ] **Touch** : Interactions tactiles

### Performance Mobile
- [ ] **Upload** : Fonctionne sur mobile
- [ ] **Filtres** : Interface adaptée
- [ ] **Export** : Téléchargement mobile

## 🎯 Critères de Validation

### ✅ Fonctionnel
- [ ] Toutes les fonctionnalités marchent
- [ ] Pas d'erreurs JavaScript
- [ ] Pas d'erreurs console
- [ ] Pas d'erreurs réseau

### ✅ UX/UI
- [ ] Interface intuitive
- [ ] Feedback utilisateur
- [ ] États de chargement
- [ ] Messages d'erreur clairs

### ✅ Performance
- [ ] Temps de réponse < 2s
- [ ] Pas de lag sur les filtres
- [ ] Upload fluide
- [ ] Export rapide

### ✅ Sécurité
- [ ] Authentification requise
- [ ] Validation des fichiers
- [ ] Permissions correctes
- [ ] Pas d'injection SQL

## 🚀 Déploiement

### Pré-production
- [ ] **Variables d'environnement** : Configurées
- [ ] **Supabase** : Bucket et politiques
- [ ] **Build** : `npm run build` sans erreurs
- [ ] **Tests** : Tous les tests passent

### Production
- [ ] **Monitoring** : Erreurs surveillées
- [ ] **Backup** : Données sauvegardées
- [ ] **Performance** : Métriques surveillées
- [ ] **Sécurité** : Audit de sécurité

---

## 📝 Notes de Test

### Date de Test : [DATE]
### Testeur : [NOM]
### Version : [VERSION]

### Résultats
- ✅ Fonctionnalités principales : [STATUT]
- ✅ Performance : [STATUT]
- ✅ Sécurité : [STATUT]
- ✅ UX/UI : [STATUT]

### Problèmes Détectés
1. [PROBLÈME 1]
2. [PROBLÈME 2]
3. [PROBLÈME 3]

### Actions Correctives
1. [ACTION 1]
2. [ACTION 2]
3. [ACTION 3]

---

**🎉 Si tous les tests passent, les nouvelles fonctionnalités sont prêtes pour la production !** 