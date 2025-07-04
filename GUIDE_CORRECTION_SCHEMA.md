# Guide de Correction du Schéma Supabase pour les Dépenses

## 🔍 **Problèmes Identifiés**

### **Incompatibilités entre l'interface et la base de données :**

1. **Champ `category` vs `category_id`**
   - Interface : utilise `category` (string)
   - Base : utilise `category_id` (uuid)

2. **Valeurs par défaut**
   - Interface : utilise `'none'` pour les champs optionnels
   - Base : attend des UUID ou NULL

3. **Champs manquants**
   - `reference` : présent en base mais pas dans l'interface
   - `paid` : présent en base mais pas dans l'interface
   - `file_url` : présent en base mais pas utilisé

4. **Contraintes de statut**
   - Base : contraintes spécifiques sur les statuts

## 🛠️ **Solution : Script SQL de Correction**

### **Étapes pour corriger le schéma :**

1. **Ouvrir Supabase Dashboard**
   - Aller sur votre projet Supabase
   - Cliquer sur "SQL Editor"

2. **Exécuter le script de correction**
   - Copier le contenu du fichier `scripts/fix-expenses-schema.sql`
   - Coller dans l'éditeur SQL
   - Cliquer sur "Run"

3. **Vérifier l'exécution**
   - Le script devrait s'exécuter sans erreur
   - Vous devriez voir le message "Schema des dépenses mis à jour avec succès!"

4. **Exécuter le script de vérification (optionnel)**
   - Copier le contenu du fichier `scripts/verify-expenses-schema.sql`
   - Coller dans l'éditeur SQL
   - Cliquer sur "Run"
   - Vérifier que tous les tests passent

## 📋 **Ce que fait le script :**

### **1. Ajout d'une contrainte unique**
```sql
ALTER TABLE public.categories ADD CONSTRAINT categories_name_type_unique UNIQUE (name, type);
```

### **2. Ajout des catégories par défaut**
```sql
INSERT INTO public.categories (name, type, color, description) VALUES
('Maintenance', 'expense', '#3B82F6', 'Maintenance générale des propriétés'),
('Réparation', 'expense', '#EF4444', 'Réparations et travaux'),
-- ... autres catégories
ON CONFLICT (name, type) DO NOTHING;
```

### **3. Modification de la table expenses**
- Rendre `category_id` nullable temporairement
- Ajouter une colonne `category_name` pour compatibilité
- Corriger les contraintes de statut

### **4. Création de fonctions utilitaires**
- `get_category_id_by_name()` : obtenir l'ID de catégorie par nom
- `insert_expense_with_category()` : insérer avec gestion automatique des catégories
- `update_expense_with_category()` : mettre à jour avec gestion des catégories

### **5. Création d'une vue optimisée**
- `expenses_with_details` : vue avec toutes les informations nécessaires

### **6. Sécurité et performance**
- Ajout des politiques RLS (Row Level Security)
- Création d'index pour les performances

## 🔧 **Utilisation dans l'application**

### **Pour insérer une nouvelle dépense :**
```typescript
// Utiliser la fonction Supabase
const { data, error } = await supabase.rpc('insert_expense_with_category', {
  p_description: formData.description,
  p_amount: parseFloat(formData.amount),
  p_vendor: formData.vendor,
  p_status: formData.status,
  p_property_id: formData.property_id === 'none' ? null : formData.property_id,
  p_category_name: formData.category === 'none' ? null : formData.category,
  p_due_date: formData.due_date || null,
  p_date: formData.date,
  p_notes: formData.notes || null,
  p_file_url: fileUrl || null
});
```

### **Pour récupérer les dépenses :**
```typescript
// Utiliser la vue optimisée
const { data: expenses, error } = await supabase
  .from('expenses_with_details')
  .select('*')
  .order('date', { ascending: false });
```

## ✅ **Vérification post-correction**

### **1. Vérifier les catégories**
```sql
SELECT * FROM public.categories WHERE type = 'expense';
```

### **2. Vérifier la vue**
```sql
SELECT * FROM expenses_with_details LIMIT 5;
```

### **3. Tester l'insertion**
```sql
SELECT insert_expense_with_category(
  'Test dépense',
  100.00,
  'Fournisseur test',
  'Pending',
  NULL,
  'Maintenance',
  NULL,
  '2024-01-15',
  'Test notes'
);
```

## 🚨 **Points d'attention**

### **Avant d'exécuter le script :**
1. **Sauvegarder vos données** : Le script modifie la structure de la table
2. **Tester en environnement de développement** : Vérifier que tout fonctionne
3. **Vérifier les permissions** : S'assurer d'avoir les droits d'administration

### **Après l'exécution :**
1. **Tester l'interface** : Vérifier que l'ajout de dépenses fonctionne
2. **Vérifier les filtres** : S'assurer que le filtrage fonctionne correctement
3. **Tester l'upload de fichiers** : Vérifier l'intégration des PDF

## 📝 **Notes importantes**

- Le script est **idempotent** : peut être exécuté plusieurs fois sans problème
- Les **données existantes** sont préservées
- Les **politiques de sécurité** sont automatiquement configurées
- Les **index de performance** sont créés automatiquement

## 🔄 **Migration des données existantes**

Si vous avez déjà des dépenses dans votre base :
1. Le script met automatiquement à jour `category_name` pour les dépenses existantes
2. Les relations avec les catégories sont maintenues
3. Aucune perte de données n'est à craindre

## 📞 **Support**

En cas de problème lors de l'exécution du script :
1. Vérifier les logs d'erreur dans Supabase
2. S'assurer que toutes les tables existent
3. Vérifier les permissions utilisateur
4. Contacter le support si nécessaire 