-- Insert sample categories
INSERT INTO categories (name, type, color) VALUES
('Rent Income', 'revenue', '#10B981'),
('Parking Fees', 'revenue', '#059669'),
('Late Fees', 'revenue', '#047857'),
('Security Deposits', 'revenue', '#065F46'),
('Maintenance', 'expense', '#EF4444'),
('Utilities', 'expense', '#DC2626'),
('Insurance', 'expense', '#B91C1C'),
('Property Tax', 'expense', '#991B1B'),
('Repairs', 'expense', '#7F1D1D'),
('Management Fees', 'expense', '#6B1D1D')
ON CONFLICT DO NOTHING;

-- Insert sample properties
INSERT INTO properties (name, address, type, purchase_price, current_value) VALUES
('Sunset Apartments', '123 Main St, Anytown, ST 12345', 'Apartment Complex', 450000.00, 520000.00),
('Oak Street Duplex', '456 Oak St, Anytown, ST 12345', 'Duplex', 280000.00, 310000.00),
('Pine View Condos', '789 Pine Ave, Anytown, ST 12345', 'Condominium', 180000.00, 195000.00),
('Maple Heights', '321 Maple Dr, Anytown, ST 12345', 'Single Family', 320000.00, 350000.00)
ON CONFLICT DO NOTHING;

-- Insert sample tenants
INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end, rent_amount)
SELECT 
    'John Smith', 'john.smith@email.com', '(555) 123-4567', p.id, '2024-01-01', '2024-12-31', 1200.00
FROM properties p WHERE p.name = 'Sunset Apartments' LIMIT 1;

INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end, rent_amount)
SELECT 
    'Sarah Johnson', 'sarah.johnson@email.com', '(555) 234-5678', p.id, '2024-02-01', '2025-01-31', 950.00
FROM properties p WHERE p.name = 'Oak Street Duplex' LIMIT 1;

INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end, rent_amount)
SELECT 
    'Mike Davis', 'mike.davis@email.com', '(555) 345-6789', p.id, '2024-03-01', '2025-02-28', 800.00
FROM properties p WHERE p.name = 'Pine View Condos' LIMIT 1;

INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end, rent_amount)
SELECT 
    'Emily Wilson', 'emily.wilson@email.com', '(555) 456-7890', p.id, '2024-01-15', '2025-01-14', 1500.00
FROM properties p WHERE p.name = 'Maple Heights' LIMIT 1;

-- Insert sample revenues
INSERT INTO revenues (description, amount, date, property_id, category_id)
SELECT 
    'Monthly Rent - January 2024', 1200.00, '2024-01-01', p.id, c.id
FROM properties p, categories c 
WHERE p.name = 'Sunset Apartments' AND c.name = 'Rent Income' LIMIT 1;

INSERT INTO revenues (description, amount, date, property_id, category_id)
SELECT 
    'Monthly Rent - February 2024', 950.00, '2024-02-01', p.id, c.id
FROM properties p, categories c 
WHERE p.name = 'Oak Street Duplex' AND c.name = 'Rent Income' LIMIT 1;

INSERT INTO revenues (description, amount, date, property_id, category_id)
SELECT 
    'Parking Fee - January 2024', 50.00, '2024-01-01', p.id, c.id
FROM properties p, categories c 
WHERE p.name = 'Sunset Apartments' AND c.name = 'Parking Fees' LIMIT 1;

INSERT INTO revenues (description, amount, date, property_id, category_id)
SELECT 
    'Late Fee - January 2024', 75.00, '2024-01-15', p.id, c.id
FROM properties p, categories c 
WHERE p.name = 'Pine View Condos' AND c.name = 'Late Fees' LIMIT 1;

-- Insert sample expenses
INSERT INTO expenses (description, amount, date, property_id, category_id, vendor)
SELECT 
    'HVAC Repair', 450.00, '2024-01-15', p.id, c.id, 'ABC Heating & Cooling'
FROM properties p, categories c 
WHERE p.name = 'Sunset Apartments' AND c.name = 'Maintenance' LIMIT 1;

INSERT INTO expenses (description, amount, date, property_id, category_id, vendor)
SELECT 
    'Electricity Bill - January', 120.00, '2024-01-31', p.id, c.id, 'City Electric Company'
FROM properties p, categories c 
WHERE p.name = 'Oak Street Duplex' AND c.name = 'Utilities' LIMIT 1;

INSERT INTO expenses (description, amount, date, property_id, category_id, vendor)
SELECT 
    'Property Insurance Premium', 800.00, '2024-01-01', p.id, c.id, 'SafeGuard Insurance'
FROM properties p, categories c 
WHERE p.name = 'Maple Heights' AND c.name = 'Insurance' LIMIT 1;

INSERT INTO expenses (description, amount, date, property_id, category_id, vendor)
SELECT 
    'Plumbing Repair', 275.00, '2024-02-10', p.id, c.id, 'Quick Fix Plumbing'
FROM properties p, categories c 
WHERE p.name = 'Pine View Condos' AND c.name = 'Repairs' LIMIT 1;

-- Insert sample payments
INSERT INTO payments (tenant_id, amount, date, method, status)
SELECT 
    t.id, 1200.00, '2024-01-01', 'bank_transfer', 'completed'
FROM tenants t WHERE t.name = 'John Smith' LIMIT 1;

INSERT INTO payments (tenant_id, amount, date, method, status)
SELECT 
    t.id, 950.00, '2024-02-01', 'check', 'completed'
FROM tenants t WHERE t.name = 'Sarah Johnson' LIMIT 1;

INSERT INTO payments (tenant_id, amount, date, method, status)
SELECT 
    t.id, 800.00, '2024-03-01', 'cash', 'completed'
FROM tenants t WHERE t.name = 'Mike Davis' LIMIT 1;

INSERT INTO payments (tenant_id, amount, date, method, status)
SELECT 
    t.id, 1500.00, '2024-01-15', 'bank_transfer', 'completed'
FROM tenants t WHERE t.name = 'Emily Wilson' LIMIT 1;
