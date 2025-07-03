-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (for Supabase Auth integration)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table with user_id
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('revenue', 'expense')),
    color VARCHAR(7),
    description TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table with user_id
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255),
    address TEXT NOT NULL,
    type VARCHAR(100),
    tenant_id UUID,
    monthly_rent DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Overdue')),
    next_due_date DATE,
    rental_price DECIMAL(10,2),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenants table with user_id
CREATE TABLE IF NOT EXISTS tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(50),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create revenues table with user_id
CREATE TABLE IF NOT EXISTS revenues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reference VARCHAR(255),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    paid BOOLEAN DEFAULT false,
    notes TEXT,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table with user_id
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reference VARCHAR(255),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    paid BOOLEAN DEFAULT false,
    notes TEXT,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    due_date DATE,
    date DATE NOT NULL,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table with user_id
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    method VARCHAR(100),
    notes TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_revenues_property_id ON revenues(property_id);
CREATE INDEX IF NOT EXISTS idx_revenues_category_id ON revenues(category_id);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(date);
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON expenses(property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON payments(tenant_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for categories table
CREATE POLICY "Users can view own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for properties table
CREATE POLICY "Users can view own properties" ON properties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON properties FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for tenants table
CREATE POLICY "Users can view own tenants" ON tenants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tenants" ON tenants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tenants" ON tenants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tenants" ON tenants FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for revenues table
CREATE POLICY "Users can view own revenues" ON revenues FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = revenues.property_id 
        AND properties.user_id = auth.uid()
    )
);
CREATE POLICY "Users can insert own revenues" ON revenues FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = revenues.property_id 
        AND properties.user_id = auth.uid()
    )
);
CREATE POLICY "Users can update own revenues" ON revenues FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = revenues.property_id 
        AND properties.user_id = auth.uid()
    )
);
CREATE POLICY "Users can delete own revenues" ON revenues FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = revenues.property_id 
        AND properties.user_id = auth.uid()
    )
);

-- Create RLS policies for expenses table
CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = expenses.property_id 
        AND properties.user_id = auth.uid()
    )
);
CREATE POLICY "Users can insert own expenses" ON expenses FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = expenses.property_id 
        AND properties.user_id = auth.uid()
    )
);
CREATE POLICY "Users can update own expenses" ON expenses FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = expenses.property_id 
        AND properties.user_id = auth.uid()
    )
);
CREATE POLICY "Users can delete own expenses" ON expenses FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = expenses.property_id 
        AND properties.user_id = auth.uid()
    )
);

-- Create RLS policies for payments table
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments" ON payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own payments" ON payments FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenues_updated_at BEFORE UPDATE ON revenues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
