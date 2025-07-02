-- Insert sample categories (only if user is authenticated)
INSERT INTO categories (name, color, type, user_id) VALUES
('Rent Income', '#10B981', 'revenue', auth.uid()),
('Late Fees', '#F59E0B', 'revenue', auth.uid()),
('Security Deposits', '#3B82F6', 'revenue', auth.uid()),
('Maintenance', '#EF4444', 'expense', auth.uid()),
('Insurance', '#8B5CF6', 'expense', auth.uid()),
('Property Tax', '#F97316', 'expense', auth.uid()),
('Utilities', '#06B6D4', 'expense', auth.uid()),
('Management Fees', '#84CC16', 'expense', auth.uid())
ON CONFLICT DO NOTHING;

-- Insert sample properties
INSERT INTO properties (name, address, type, purchase_price, current_value, monthly_rent, user_id) VALUES
('Sunset Apartments', '123 Main St, Anytown, ST 12345', 'Apartment Complex', 450000.00, 520000.00, 3200.00, auth.uid()),
('Oak Street Duplex', '456 Oak St, Anytown, ST 12345', 'Duplex', 280000.00, 310000.00, 2100.00, auth.uid()),
('Pine View Condo', '789 Pine Ave, Anytown, ST 12345', 'Condominium', 185000.00, 205000.00, 1450.00, auth.uid())
ON CONFLICT DO NOTHING;

-- Note: The following inserts would need to be run after the above data exists
-- and you have the actual UUIDs. In a real application, you'd typically
-- insert this data through your application interface.

-- Sample tenants (you'll need to replace property_id with actual UUIDs)
-- INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end, monthly_rent, deposit, user_id) VALUES
-- ('John Smith', 'john.smith@email.com', '555-0101', 'property-uuid-here', '2024-01-01', '2024-12-31', 1600.00, 1600.00, auth.uid()),
-- ('Jane Doe', 'jane.doe@email.com', '555-0102', 'property-uuid-here', '2024-02-01', '2025-01-31', 1500.00, 1500.00, auth.uid());

-- Sample revenues (you'll need actual category_id and property_id UUIDs)
-- INSERT INTO revenues (amount, description, date, category_id, property_id, user_id) VALUES
-- (1600.00, 'Monthly rent - January', '2024-01-01', 'category-uuid-here', 'property-uuid-here', auth.uid()),
-- (1500.00, 'Monthly rent - January', '2024-01-01', 'category-uuid-here', 'property-uuid-here', auth.uid());

-- Sample expenses (you'll need actual category_id and property_id UUIDs)
-- INSERT INTO expenses (amount, description, date, category_id, property_id, vendor, user_id) VALUES
-- (250.00, 'Plumbing repair', '2024-01-15', 'category-uuid-here', 'property-uuid-here', 'ABC Plumbing', auth.uid()),
-- (180.00, 'Property insurance premium', '2024-01-01', 'category-uuid-here', 'property-uuid-here', 'XYZ Insurance', auth.uid());
