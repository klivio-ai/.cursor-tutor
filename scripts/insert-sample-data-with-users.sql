-- Insert sample users
INSERT INTO users (id, email, full_name, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', 'https://example.com/avatar1.jpg'),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'Jane Smith', 'https://example.com/avatar2.jpg'),
('550e8400-e29b-41d4-a716-446655440003', 'bob.wilson@example.com', 'Bob Wilson', 'https://example.com/avatar3.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert sample categories for user 1
INSERT INTO categories (name, type, color, description, user_id) VALUES
('Loyer', 'revenue', '#10B981', 'Revenus de location', '550e8400-e29b-41d4-a716-446655440001'),
('Charges', 'expense', '#EF4444', 'Charges locatives', '550e8400-e29b-41d4-a716-446655440001'),
('Maintenance', 'expense', '#F59E0B', 'Travaux de maintenance', '550e8400-e29b-41d4-a716-446655440001'),
('Assurance', 'expense', '#8B5CF6', 'Assurance habitation', '550e8400-e29b-41d4-a716-446655440001'),
('Taxes', 'expense', '#EC4899', 'Taxes foncières', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample categories for user 2
INSERT INTO categories (name, type, color, description, user_id) VALUES
('Loyer', 'revenue', '#10B981', 'Revenus de location', '550e8400-e29b-41d4-a716-446655440002'),
('Charges', 'expense', '#EF4444', 'Charges locatives', '550e8400-e29b-41d4-a716-446655440002'),
('Maintenance', 'expense', '#F59E0B', 'Travaux de maintenance', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample properties for user 1
INSERT INTO properties (name, address, type, monthly_rent, payment_status, next_due_date, rental_price, current_value, user_id) VALUES
('Appartement Centre-Ville', '123 Rue de la Paix, Paris', 'Appartement', 1200.00, 'Paid', '2024-02-01', 1500.00, 350000.00, '550e8400-e29b-41d4-a716-446655440001'),
('Maison de Ville', '456 Avenue des Champs, Lyon', 'Maison', 1800.00, 'Pending', '2024-02-15', 2200.00, 450000.00, '550e8400-e29b-41d4-a716-446655440001'),
('Studio Moderne', '789 Boulevard Central, Marseille', 'Studio', 800.00, 'Overdue', '2024-01-01', 950.00, 180000.00, '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample properties for user 2
INSERT INTO properties (name, address, type, monthly_rent, payment_status, next_due_date, rental_price, current_value, user_id) VALUES
('Villa de Luxe', '321 Chemin des Oliviers, Nice', 'Villa', 2500.00, 'Paid', '2024-02-01', 3000.00, 750000.00, '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample tenants for user 1
INSERT INTO tenants (name, email, phone_number, user_id) VALUES
('Marie Dupont', 'marie.dupont@email.com', '+33 1 23 45 67 89', '550e8400-e29b-41d4-a716-446655440001'),
('Pierre Martin', 'pierre.martin@email.com', '+33 1 98 76 54 32', '550e8400-e29b-41d4-a716-446655440001'),
('Sophie Bernard', 'sophie.bernard@email.com', '+33 1 11 22 33 44', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample tenants for user 2
INSERT INTO tenants (name, email, phone_number, user_id) VALUES
('Jean Moreau', 'jean.moreau@email.com', '+33 4 56 78 90 12', '550e8400-e29b-41d4-a716-446655440002');

-- Get category IDs for user 1
DO $$
DECLARE
    loyer_cat_id UUID;
    charges_cat_id UUID;
    maintenance_cat_id UUID;
    assurance_cat_id UUID;
    taxes_cat_id UUID;
    prop1_id UUID;
    prop2_id UUID;
    prop3_id UUID;
    tenant1_id UUID;
    tenant2_id UUID;
    tenant3_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO loyer_cat_id FROM categories WHERE name = 'Loyer' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    SELECT id INTO charges_cat_id FROM categories WHERE name = 'Charges' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    SELECT id INTO maintenance_cat_id FROM categories WHERE name = 'Maintenance' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    SELECT id INTO assurance_cat_id FROM categories WHERE name = 'Assurance' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    SELECT id INTO taxes_cat_id FROM categories WHERE name = 'Taxes' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    
    -- Get property IDs
    SELECT id INTO prop1_id FROM properties WHERE name = 'Appartement Centre-Ville' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    SELECT id INTO prop2_id FROM properties WHERE name = 'Maison de Ville' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    SELECT id INTO prop3_id FROM properties WHERE name = 'Studio Moderne' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    
    -- Get tenant IDs
    SELECT id INTO tenant1_id FROM tenants WHERE name = 'Marie Dupont' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    SELECT id INTO tenant2_id FROM tenants WHERE name = 'Pierre Martin' AND user_id = '550e8400-e29b-41d4-a716-446655440001';
    SELECT id INTO tenant3_id FROM tenants WHERE name = 'Sophie Bernard' AND user_id = '550e8400-e29b-41d4-a716-446655440001';

    -- Insert sample revenues for user 1
    INSERT INTO revenues (reference, description, amount, source, status, paid, property_id, category_id, date) VALUES
    ('REV-001', 'Loyer janvier 2024', 1200.00, 'Marie Dupont', 'Reçu', true, prop1_id, loyer_cat_id, '2024-01-01'),
    ('REV-002', 'Loyer janvier 2024', 1800.00, 'Pierre Martin', 'Reçu', true, prop2_id, loyer_cat_id, '2024-01-01'),
    ('REV-003', 'Loyer janvier 2024', 800.00, 'Sophie Bernard', 'En attente', false, prop3_id, loyer_cat_id, '2024-01-01');

    -- Insert sample expenses for user 1
    INSERT INTO expenses (reference, description, amount, vendor, status, paid, property_id, category_id, due_date, date) VALUES
    ('EXP-001', 'Charges électricité', 150.00, 'EDF', 'Payé', true, prop1_id, charges_cat_id, '2024-01-15', '2024-01-10'),
    ('EXP-002', 'Réparation chaudière', 300.00, 'Plomberie Express', 'Payé', true, prop2_id, maintenance_cat_id, '2024-01-20', '2024-01-18'),
    ('EXP-003', 'Assurance habitation', 200.00, 'AXA', 'En attente', false, prop1_id, assurance_cat_id, '2024-02-01', '2024-01-25'),
    ('EXP-004', 'Taxes foncières', 800.00, 'Trésor Public', 'En attente', false, prop2_id, taxes_cat_id, '2024-02-15', '2024-01-30');

    -- Insert sample payments for user 1
    INSERT INTO payments (property_id, tenant_id, amount, payment_date, method, notes, user_id) VALUES
    (prop1_id, tenant1_id, 1200.00, '2024-01-01', 'Virement bancaire', 'Loyer janvier', '550e8400-e29b-41d4-a716-446655440001'),
    (prop2_id, tenant2_id, 1800.00, '2024-01-01', 'Chèque', 'Loyer janvier', '550e8400-e29b-41d4-a716-446655440001'),
    (prop3_id, tenant3_id, 800.00, '2024-01-15', 'Espèces', 'Loyer janvier avec retard', '550e8400-e29b-41d4-a716-446655440001');

END $$;

-- Get category IDs for user 2
DO $$
DECLARE
    loyer_cat_id UUID;
    charges_cat_id UUID;
    maintenance_cat_id UUID;
    prop1_id UUID;
    tenant1_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO loyer_cat_id FROM categories WHERE name = 'Loyer' AND user_id = '550e8400-e29b-41d4-a716-446655440002';
    SELECT id INTO charges_cat_id FROM categories WHERE name = 'Charges' AND user_id = '550e8400-e29b-41d4-a716-446655440002';
    SELECT id INTO maintenance_cat_id FROM categories WHERE name = 'Maintenance' AND user_id = '550e8400-e29b-41d4-a716-446655440002';
    
    -- Get property IDs
    SELECT id INTO prop1_id FROM properties WHERE name = 'Villa de Luxe' AND user_id = '550e8400-e29b-41d4-a716-446655440002';
    
    -- Get tenant IDs
    SELECT id INTO tenant1_id FROM tenants WHERE name = 'Jean Moreau' AND user_id = '550e8400-e29b-41d4-a716-446655440002';

    -- Insert sample revenues for user 2
    INSERT INTO revenues (reference, description, amount, source, status, paid, property_id, category_id, date) VALUES
    ('REV-004', 'Loyer janvier 2024', 2500.00, 'Jean Moreau', 'Reçu', true, prop1_id, loyer_cat_id, '2024-01-01');

    -- Insert sample expenses for user 2
    INSERT INTO expenses (reference, description, amount, vendor, status, paid, property_id, category_id, due_date, date) VALUES
    ('EXP-005', 'Entretien piscine', 150.00, 'Piscine Pro', 'Payé', true, prop1_id, maintenance_cat_id, '2024-01-10', '2024-01-08'),
    ('EXP-006', 'Charges eau', 80.00, 'Veolia', 'En attente', false, prop1_id, charges_cat_id, '2024-02-01', '2024-01-25');

    -- Insert sample payments for user 2
    INSERT INTO payments (property_id, tenant_id, amount, payment_date, method, notes, user_id) VALUES
    (prop1_id, tenant1_id, 2500.00, '2024-01-01', 'Virement bancaire', 'Loyer janvier', '550e8400-e29b-41d4-a716-446655440002');

END $$;
