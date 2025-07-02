-- Insert sample categories
INSERT INTO categories (name, type, description) VALUES
('Rent', 'revenue', 'Monthly rental income from tenants'),
('Late Fees', 'revenue', 'Late payment fees from tenants'),
('Security Deposit', 'revenue', 'Security deposits from new tenants'),
('Maintenance', 'expense', 'Property maintenance and repairs'),
('Insurance', 'expense', 'Property insurance premiums'),
('Property Tax', 'expense', 'Annual property taxes'),
('Utilities', 'expense', 'Water, electricity, gas utilities'),
('Management Fees', 'expense', 'Property management company fees'),
('Advertising', 'expense', 'Marketing costs for vacant properties'),
('Legal Fees', 'expense', 'Legal and professional services')
ON CONFLICT DO NOTHING;

-- Insert sample properties
INSERT INTO properties (name, address, type, purchase_price, current_value, purchase_date, description) VALUES
('Sunset Apartments', '123 Main St, Springfield, IL 62701', 'Multi-Family', 450000.00, 520000.00, '2020-03-15', '12-unit apartment building in downtown Springfield'),
('Oak Street Duplex', '456 Oak St, Springfield, IL 62702', 'Duplex', 280000.00, 310000.00, '2021-07-22', 'Two-unit duplex with separate entrances'),
('Pine View House', '789 Pine Ave, Springfield, IL 62703', 'Single Family', 220000.00, 245000.00, '2019-11-08', 'Single family home with 3 bedrooms, 2 bathrooms'),
('Maple Court Townhome', '321 Maple Ct, Springfield, IL 62704', 'Townhome', 195000.00, 215000.00, '2022-01-30', 'Modern townhome in quiet neighborhood')
ON CONFLICT DO NOTHING;

-- Get category and property IDs for sample data
DO $$
DECLARE
    rent_category_id UUID;
    late_fee_category_id UUID;
    maintenance_category_id UUID;
    insurance_category_id UUID;
    tax_category_id UUID;
    utilities_category_id UUID;
    
    sunset_property_id UUID;
    oak_property_id UUID;
    pine_property_id UUID;
    maple_property_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO rent_category_id FROM categories WHERE name = 'Rent' AND type = 'revenue';
    SELECT id INTO late_fee_category_id FROM categories WHERE name = 'Late Fees' AND type = 'revenue';
    SELECT id INTO maintenance_category_id FROM categories WHERE name = 'Maintenance' AND type = 'expense';
    SELECT id INTO insurance_category_id FROM categories WHERE name = 'Insurance' AND type = 'expense';
    SELECT id INTO tax_category_id FROM categories WHERE name = 'Property Tax' AND type = 'expense';
    SELECT id INTO utilities_category_id FROM categories WHERE name = 'Utilities' AND type = 'expense';
    
    -- Get property IDs
    SELECT id INTO sunset_property_id FROM properties WHERE name = 'Sunset Apartments';
    SELECT id INTO oak_property_id FROM properties WHERE name = 'Oak Street Duplex';
    SELECT id INTO pine_property_id FROM properties WHERE name = 'Pine View House';
    SELECT id INTO maple_property_id FROM properties WHERE name = 'Maple Court Townhome';
    
    -- Insert sample tenants
    INSERT INTO tenants (property_id, name, email, phone, lease_start, lease_end, monthly_rent, deposit, status) VALUES
    (sunset_property_id, 'John Smith', 'john.smith@email.com', '555-0101', '2023-01-01', '2023-12-31', 1200.00, 1200.00, 'active'),
    (sunset_property_id, 'Jane Doe', 'jane.doe@email.com', '555-0102', '2023-02-01', '2024-01-31', 1150.00, 1150.00, 'active'),
    (oak_property_id, 'Bob Johnson', 'bob.johnson@email.com', '555-0103', '2023-03-01', '2024-02-29', 1400.00, 1400.00, 'active'),
    (pine_property_id, 'Alice Brown', 'alice.brown@email.com', '555-0104', '2023-04-01', '2024-03-31', 1800.00, 1800.00, 'active'),
    (maple_property_id, 'Charlie Wilson', 'charlie.wilson@email.com', '555-0105', '2023-05-01', '2024-04-30', 1600.00, 1600.00, 'active')
    ON CONFLICT DO NOTHING;
    
    -- Insert sample revenues (rent payments)
    INSERT INTO revenues (property_id, category_id, amount, date, description, payment_method) VALUES
    (sunset_property_id, rent_category_id, 2350.00, '2024-01-01', 'January rent - Units 1 & 2', 'Bank Transfer'),
    (sunset_property_id, rent_category_id, 2350.00, '2024-02-01', 'February rent - Units 1 & 2', 'Bank Transfer'),
    (oak_property_id, rent_category_id, 1400.00, '2024-01-01', 'January rent - Duplex Unit A', 'Check'),
    (oak_property_id, rent_category_id, 1400.00, '2024-02-01', 'February rent - Duplex Unit A', 'Check'),
    (pine_property_id, rent_category_id, 1800.00, '2024-01-01', 'January rent - Single Family Home', 'Online Payment'),
    (pine_property_id, rent_category_id, 1800.00, '2024-02-01', 'February rent - Single Family Home', 'Online Payment'),
    (maple_property_id, rent_category_id, 1600.00, '2024-01-01', 'January rent - Townhome', 'Bank Transfer'),
    (maple_property_id, rent_category_id, 1600.00, '2024-02-01', 'February rent - Townhome', 'Bank Transfer'),
    (sunset_property_id, late_fee_category_id, 50.00, '2024-01-15', 'Late fee - Unit 2', 'Cash')
    ON CONFLICT DO NOTHING;
    
    -- Insert sample expenses
    INSERT INTO expenses (property_id, category_id, amount, date, description, vendor) VALUES
    (sunset_property_id, maintenance_category_id, 450.00, '2024-01-15', 'Plumbing repair - Unit 3', 'Springfield Plumbing Co'),
    (sunset_property_id, utilities_category_id, 280.00, '2024-01-01', 'Water bill - January', 'City Water Department'),
    (oak_property_id, maintenance_category_id, 320.00, '2024-01-20', 'HVAC maintenance', 'Cool Air Services'),
    (pine_property_id, insurance_category_id, 1200.00, '2024-01-01', 'Annual property insurance', 'State Farm Insurance'),
    (maple_property_id, tax_category_id, 2400.00, '2024-01-01', 'Property tax - Q1 2024', 'Sangamon County'),
    (sunset_property_id, maintenance_category_id, 180.00, '2024-02-05', 'Landscaping services', 'Green Thumb Landscaping'),
    (oak_property_id, utilities_category_id, 95.00, '2024-02-01', 'Electricity bill - February', 'Ameren Illinois'),
    (pine_property_id, maintenance_category_id, 75.00, '2024-02-10', 'Gutter cleaning', 'Clean Gutters LLC')
    ON CONFLICT DO NOTHING;
    
    -- Insert sample payments (rent due/paid tracking)
    INSERT INTO payments (tenant_id, property_id, amount, due_date, paid_date, status, payment_method) VALUES
    ((SELECT id FROM tenants WHERE email = 'john.smith@email.com'), sunset_property_id, 1200.00, '2024-03-01', '2024-03-01', 'paid', 'Bank Transfer'),
    ((SELECT id FROM tenants WHERE email = 'jane.doe@email.com'), sunset_property_id, 1150.00, '2024-03-01', '2024-03-03', 'paid', 'Check'),
    ((SELECT id FROM tenants WHERE email = 'bob.johnson@email.com'), oak_property_id, 1400.00, '2024-03-01', '2024-02-28', 'paid', 'Online Payment'),
    ((SELECT id FROM tenants WHERE email = 'alice.brown@email.com'), pine_property_id, 1800.00, '2024-03-01', NULL, 'pending', NULL),
    ((SELECT id FROM tenants WHERE email = 'charlie.wilson@email.com'), maple_property_id, 1600.00, '2024-03-01', '2024-03-01', 'paid', 'Bank Transfer')
    ON CONFLICT DO NOTHING;
    
END $$;
