-- Script de vérification du schéma des dépenses
-- À exécuter après le script de correction pour vérifier que tout fonctionne

-- 1. Vérifier que les catégories ont été créées
SELECT 'Vérification des catégories:' as test;
SELECT name, type, color FROM public.categories WHERE type = 'expense' ORDER BY name;

-- 2. Vérifier que la contrainte unique existe
SELECT 'Vérification de la contrainte unique:' as test;
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'categories' AND constraint_name = 'categories_name_type_unique';

-- 3. Vérifier que la colonne category_name existe
SELECT 'Vérification de la colonne category_name:' as test;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'expenses' AND column_name = 'category_name';

-- 4. Vérifier que les fonctions existent
SELECT 'Vérification des fonctions:' as test;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name IN ('get_category_id_by_name', 'insert_expense_with_category', 'update_expense_with_category')
ORDER BY routine_name;

-- 5. Vérifier que la vue existe
SELECT 'Vérification de la vue:' as test;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'expenses_with_details';

-- 6. Vérifier que les politiques RLS existent
SELECT 'Vérification des politiques RLS:' as test;
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'expenses' 
ORDER BY policyname;

-- 7. Vérifier que les index existent
SELECT 'Vérification des index:' as test;
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'expenses' AND indexname LIKE 'idx_expenses_%'
ORDER BY indexname;

-- 8. Tester la fonction get_category_id_by_name
SELECT 'Test de la fonction get_category_id_by_name:' as test;
SELECT get_category_id_by_name('Maintenance') as maintenance_id,
       get_category_id_by_name('Réparation') as reparation_id,
       get_category_id_by_name('Inexistante') as inexistante_id;

-- 9. Tester l'insertion d'une dépense de test (si aucune dépense n'existe)
SELECT 'Test d\'insertion d\'une dépense:' as test;
DO $$
DECLARE
    expense_id uuid;
BEGIN
    -- Vérifier s'il y a déjà des dépenses
    IF NOT EXISTS (SELECT 1 FROM public.expenses LIMIT 1) THEN
        -- Insérer une dépense de test
        expense_id := insert_expense_with_category(
            'Test dépense - Maintenance',
            150.00,
            'Fournisseur Test',
            'Pending',
            NULL,
            'Maintenance',
            NULL,
            CURRENT_DATE,
            'Note de test pour vérification'
        );
        
        RAISE NOTICE 'Dépense de test insérée avec ID: %', expense_id;
    ELSE
        RAISE NOTICE 'Des dépenses existent déjà, test d''insertion ignoré';
    END IF;
END $$;

-- 10. Vérifier la vue expenses_with_details
SELECT 'Test de la vue expenses_with_details:' as test;
SELECT 
    description,
    amount,
    vendor,
    status,
    category_name,
    property_name,
    created_at
FROM expenses_with_details 
ORDER BY created_at DESC 
LIMIT 5;

-- 11. Vérifier les contraintes de la table expenses
SELECT 'Vérification des contraintes de la table expenses:' as test;
SELECT constraint_name, constraint_type, check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'expenses' AND tc.constraint_type = 'CHECK';

-- Message de fin
SELECT 'Vérification terminée avec succès!' as result; 