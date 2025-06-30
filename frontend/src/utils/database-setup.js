import { supabase } from '../lib/supabase.js'

// SQL queries to create all required tables
const createTablesSQL = {
  categories: `
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
      color TEXT,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  properties: `
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      purchase_price NUMERIC,
      current_value NUMERIC,
      rental_price NUMERIC,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  revenues: `
    CREATE TABLE IF NOT EXISTS revenues (
      id TEXT PRIMARY KEY,
      reference TEXT,
      description TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL,
      paid BOOLEAN DEFAULT FALSE,
      notes TEXT,
      property_id TEXT REFERENCES properties(id),
      category_id TEXT NOT NULL REFERENCES categories(id),
      date DATE NOT NULL,
      file_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  expenses: `
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      reference TEXT,
      description TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      vendor TEXT NOT NULL,
      status TEXT NOT NULL,
      paid BOOLEAN DEFAULT FALSE,
      notes TEXT,
      property_id TEXT REFERENCES properties(id),
      category_id TEXT NOT NULL REFERENCES categories(id),
      due_date DATE,
      date DATE NOT NULL,
      file_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
}

// Function to create all database tables
export async function createDatabaseTables() {
  console.log('🏗️ Creating database tables...')
  
  try {
    console.log('ℹ️ Note: Tables should be created manually in Supabase SQL Editor')
    console.log('The automatic table creation via RPC is not available.')
    
    return false // Always return false to show manual SQL instructions
    
  } catch (error) {
    console.error('❌ Error creating database tables:', error)
    return false
  }
}

// Alternative method: Create tables via direct SQL execution if RPC fails
export async function createTablesDirectSQL() {
  console.log('🔄 Attempting to create tables via direct SQL...')
  
  try {
    // Try to create each table individually
    for (const [tableName, sql] of Object.entries(createTablesSQL)) {
      console.log(`Creating ${tableName}...`)
      
      const { error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1)
      
      if (error && error.message.includes('does not exist')) {
        console.log(`Table ${tableName} doesn't exist, needs to be created manually`)
      } else {
        console.log(`✅ Table ${tableName} already exists`)
      }
    }
    
    return false // Still need manual creation
    
  } catch (error) {
    console.error('Error checking tables:', error)
    return false
  }
}

// Get SQL commands for manual creation
export function getManualSQLCommands() {
  const allSQL = Object.values(createTablesSQL).join('\n\n')
  return `
-- Run this SQL in your Supabase Dashboard SQL Editor
-- Go to: Project Dashboard > SQL Editor > New Query

${allSQL}

-- Enable Row Level Security (optional but recommended)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for development)
CREATE POLICY "Enable all operations for all users" ON categories FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON properties FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON revenues FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON expenses FOR ALL USING (true);
  `
}