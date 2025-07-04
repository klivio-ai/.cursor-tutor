-- Script de correction du schéma des dépenses pour compatibilité avec l'interface
-- À exécuter dans Supabase SQL Editor

-- 1. Met à jour revenues
WITH doublons AS (
  SELECT
    name,
    type,
    (array_agg(id ORDER BY ctid ASC))[1] AS id_to_keep,
    array_agg(id) AS all_ids
  FROM public.categories
  GROUP BY name, type
  HAVING COUNT(*) > 1
)
UPDATE public.revenues r
SET category_id = d.id_to_keep
FROM doublons d
WHERE r.category_id = ANY(d.all_ids)
  AND r.category_id <> d.id_to_keep;

-- 2. Met à jour expenses
WITH doublons AS (
  SELECT
    name,
    type,
    (array_agg(id ORDER BY ctid ASC))[1] AS id_to_keep,
    array_agg(id) AS all_ids
  FROM public.categories
  GROUP BY name, type
  HAVING COUNT(*) > 1
)
UPDATE public.expenses e
SET category_id = d.id_to_keep
FROM doublons d
WHERE e.category_id = ANY(d.all_ids)
  AND e.category_id <> d.id_to_keep;

-- 3. Supprime les doublons (sauf celui conservé)
WITH doublons AS (
  SELECT
    name,
    type,
    (array_agg(id ORDER BY ctid ASC))[1] AS id_to_keep,
    array_agg(id) AS all_ids
  FROM public.categories
  GROUP BY name, type
  HAVING COUNT(*) > 1
)
DELETE FROM public.categories c
USING doublons d
WHERE c.name = d.name
  AND c.type = d.type
  AND c.id <> d.id_to_keep;

-- 4. Ajoute la contrainte unique
ALTER TABLE public.categories ADD CONSTRAINT categories_name_type_unique UNIQUE (name, type);

-- 5. Ajouter des catégories par défaut pour les dépenses
INSERT INTO public.categories (name, type, color, description) VALUES
('Maintenance', 'expense', '#3B82F6', 'Maintenance générale des propriétés'),
('Réparation', 'expense', '#EF4444', 'Réparations et travaux'),
('Assurance', 'expense', '#10B981', 'Assurances et garanties'),
('Taxes', 'expense', '#F59E0B', 'Taxes foncières et impôts'),
('Services', 'expense', '#8B5CF6', 'Services divers'),
('Fournitures', 'expense', '#06B6D4', 'Fournitures et matériaux'),
('Autre', 'expense', '#6B7280', 'Autres dépenses')
ON CONFLICT (name, type) DO NOTHING;

-- 6. Modifier la table expenses pour rendre category_id nullable temporairement
ALTER TABLE public.expenses ALTER COLUMN category_id DROP NOT NULL;

-- 7. Ajouter une contrainte de statut plus flexible
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_status_check;
ALTER TABLE public.expenses ADD CONSTRAINT expenses_status_check 
CHECK (status IN ('Pending', 'Paid', 'Overdue'));

-- 8. Ajouter une colonne category_name pour compatibilité avec l'interface
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS category_name text;

-- 9. Créer une fonction pour synchroniser category_name avec category_id
CREATE OR REPLACE FUNCTION sync_category_name()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.category_id IS NOT NULL THEN
        SELECT name INTO NEW.category_name 
        FROM public.categories 
        WHERE id = NEW.category_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Créer un trigger pour maintenir la synchronisation
DROP TRIGGER IF EXISTS trigger_sync_category_name ON public.expenses;
CREATE TRIGGER trigger_sync_category_name
    BEFORE INSERT OR UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION sync_category_name();

-- 11. Mettre à jour les dépenses existantes pour avoir category_name
UPDATE public.expenses 
SET category_name = c.name
FROM public.categories c
WHERE expenses.category_id = c.id;

-- 12. Créer une fonction pour obtenir l'ID de catégorie par nom
CREATE OR REPLACE FUNCTION get_category_id_by_name(category_name text)
RETURNS uuid AS $$
DECLARE
    category_id uuid;
BEGIN
    SELECT id INTO category_id
    FROM public.categories
    WHERE name = category_name AND type = 'expense'
    LIMIT 1;
    
    RETURN category_id;
END;
$$ LANGUAGE plpgsql;

-- 13. Créer une fonction pour insérer une dépense avec gestion automatique des catégories
CREATE OR REPLACE FUNCTION insert_expense_with_category(
    p_description text,
    p_amount numeric,
    p_vendor text,
    p_status text,
    p_property_id uuid DEFAULT NULL,
    p_category_name text DEFAULT NULL,
    p_due_date date DEFAULT NULL,
    p_date date,
    p_notes text DEFAULT NULL,
    p_file_url text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
    expense_id uuid;
    category_id uuid;
BEGIN
    -- Obtenir l'ID de catégorie si un nom est fourni
    IF p_category_name IS NOT NULL AND p_category_name != 'none' THEN
        category_id := get_category_id_by_name(p_category_name);
    END IF;
    
    -- Insérer la dépense
    INSERT INTO public.expenses (
        description,
        amount,
        vendor,
        status,
        property_id,
        category_id,
        category_name,
        due_date,
        date,
        notes,
        file_url,
        user_id
    ) VALUES (
        p_description,
        p_amount,
        p_vendor,
        p_status,
        CASE WHEN p_property_id = 'none'::uuid THEN NULL ELSE p_property_id END,
        category_id,
        p_category_name,
        p_due_date,
        p_date,
        p_notes,
        p_file_url,
        auth.uid()
    ) RETURNING id INTO expense_id;
    
    RETURN expense_id;
END;
$$ LANGUAGE plpgsql;

-- 14. Créer une fonction pour mettre à jour une dépense
CREATE OR REPLACE FUNCTION update_expense_with_category(
    p_expense_id uuid,
    p_description text,
    p_amount numeric,
    p_vendor text,
    p_status text,
    p_property_id uuid DEFAULT NULL,
    p_category_name text DEFAULT NULL,
    p_due_date date DEFAULT NULL,
    p_date date,
    p_notes text DEFAULT NULL,
    p_file_url text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
    category_id uuid;
BEGIN
    -- Obtenir l'ID de catégorie si un nom est fourni
    IF p_category_name IS NOT NULL AND p_category_name != 'none' THEN
        category_id := get_category_id_by_name(p_category_name);
    END IF;
    
    -- Mettre à jour la dépense
    UPDATE public.expenses SET
        description = p_description,
        amount = p_amount,
        vendor = p_vendor,
        status = p_status,
        property_id = CASE WHEN p_property_id = 'none'::uuid THEN NULL ELSE p_property_id END,
        category_id = category_id,
        category_name = p_category_name,
        due_date = p_due_date,
        date = p_date,
        notes = p_notes,
        file_url = p_file_url,
        updated_at = now()
    WHERE id = p_expense_id AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 15. Créer une vue pour faciliter la récupération des dépenses avec toutes les informations
CREATE OR REPLACE VIEW expenses_with_details AS
SELECT 
    e.id,
    e.reference,
    e.description,
    e.amount,
    e.vendor,
    e.status,
    e.paid,
    e.notes,
    e.property_id,
    e.category_id,
    e.category_name,
    e.due_date,
    e.date,
    e.file_url,
    e.created_at,
    e.updated_at,
    e.user_id,
    p.name as property_name,
    c.name as category_display_name,
    c.color as category_color
FROM public.expenses e
LEFT JOIN public.properties p ON e.property_id = p.id
LEFT JOIN public.categories c ON e.category_id = c.id
WHERE e.user_id = auth.uid();

-- 16. Ajouter des politiques RLS pour la sécurité
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres dépenses
CREATE POLICY "Users can view their own expenses" ON public.expenses
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs d'insérer leurs propres dépenses
CREATE POLICY "Users can insert their own expenses" ON public.expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres dépenses
CREATE POLICY "Users can update their own expenses" ON public.expenses
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres dépenses
CREATE POLICY "Users can delete their own expenses" ON public.expenses
    FOR DELETE USING (auth.uid() = user_id);

-- 17. Créer un index pour améliorer les performances des filtres
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON public.expenses(property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON public.expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);

-- Message de confirmation
SELECT 'Schema des dépenses mis à jour avec succès!' as message; 
