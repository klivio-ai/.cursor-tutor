import { supabase } from '../lib/supabase.js'

// Sample data for the property finance dashboard
const sampleData = {
  categories: [
    { id: 'cat-1', name: 'Loyer', type: 'revenue', color: '#10b981', description: 'Revenus locatifs' },
    { id: 'cat-2', name: 'Charges', type: 'expense', color: '#ef4444', description: 'Charges de copropriété' },
    { id: 'cat-3', name: 'Travaux', type: 'expense', color: '#f59e0b', description: 'Travaux et réparations' },
    { id: 'cat-4', name: 'Assurance', type: 'expense', color: '#8b5cf6', description: 'Assurances' },
    { id: 'cat-5', name: 'Taxes', type: 'expense', color: '#06b6d4', description: 'Taxes foncières' },
    { id: 'cat-6', name: 'Autres Revenus', type: 'revenue', color: '#84cc16', description: 'Autres sources de revenus' }
  ],
  
  properties: [
    {
      id: 'prop-1',
      name: 'Appartement Paris 11ème',
      address: '15 Rue de la République, 75011 Paris',
      type: 'Appartement',
      status: 'Loué',
      purchase_price: 280000,
      current_value: 320000,
      rental_price: 1200,
      description: 'Studio 30m² rénové'
    },
    {
      id: 'prop-2', 
      name: 'Maison Bordeaux',
      address: '8 Avenue Victor Hugo, 33000 Bordeaux',
      type: 'Maison',
      status: 'Loué',
      purchase_price: 180000,
      current_value: 220000,
      rental_price: 900,
      description: 'Maison 3 pièces avec jardin'
    },
    {
      id: 'prop-3',
      name: 'Studio Lyon',
      address: '22 Rue de la Paix, 69001 Lyon', 
      type: 'Studio',
      status: 'Vacant',
      purchase_price: 150000,
      current_value: 165000,
      rental_price: 650,
      description: 'Studio 25m² centre-ville'
    }
  ],

  revenues: [
    { id: 'rev-1', description: 'Loyer Janvier 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: 'prop-1', category_id: 'cat-1', date: '2024-01-01' },
    { id: 'rev-2', description: 'Loyer Février 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: 'prop-1', category_id: 'cat-1', date: '2024-02-01' },
    { id: 'rev-3', description: 'Loyer Mars 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: 'prop-1', category_id: 'cat-1', date: '2024-03-01' },
    { id: 'rev-4', description: 'Loyer Avril 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: 'prop-1', category_id: 'cat-1', date: '2024-04-01' },
    { id: 'rev-5', description: 'Loyer Mai 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: 'prop-1', category_id: 'cat-1', date: '2024-05-01' },
    
    { id: 'rev-6', description: 'Loyer Janvier 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: 'prop-2', category_id: 'cat-1', date: '2024-01-01' },
    { id: 'rev-7', description: 'Loyer Février 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: 'prop-2', category_id: 'cat-1', date: '2024-02-01' },
    { id: 'rev-8', description: 'Loyer Mars 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: 'prop-2', category_id: 'cat-1', date: '2024-03-01' },
    { id: 'rev-9', description: 'Loyer Avril 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: 'prop-2', category_id: 'cat-1', date: '2024-04-01' },
    { id: 'rev-10', description: 'Loyer Mai 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: 'prop-2', category_id: 'cat-1', date: '2024-05-01' },
    
    { id: 'rev-11', description: 'Caution restituée', amount: 500, source: 'Ancien locataire', status: 'Reçu', paid: true, property_id: 'prop-3', category_id: 'cat-6', date: '2024-03-15' }
  ],

  expenses: [
    { id: 'exp-1', description: 'Charges copropriété Q1', amount: 180, vendor: 'Syndic ABC', status: 'Payé', paid: true, property_id: 'prop-1', category_id: 'cat-2', date: '2024-01-15' },
    { id: 'exp-2', description: 'Assurance habitation', amount: 240, vendor: 'Assurances XYZ', status: 'Payé', paid: true, property_id: 'prop-1', category_id: 'cat-4', date: '2024-01-10' },
    { id: 'exp-3', description: 'Réparation plomberie', amount: 450, vendor: 'Plombier Pro', status: 'Payé', paid: true, property_id: 'prop-1', category_id: 'cat-3', date: '2024-02-20' },
    { id: 'exp-4', description: 'Taxe foncière 2024', amount: 890, vendor: 'Trésor Public', status: 'Payé', paid: true, property_id: 'prop-1', category_id: 'cat-5', date: '2024-01-30' },
    
    { id: 'exp-5', description: 'Charges copropriété Q1', amount: 150, vendor: 'Syndic DEF', status: 'Payé', paid: true, property_id: 'prop-2', category_id: 'cat-2', date: '2024-01-15' },
    { id: 'exp-6', description: 'Assurance habitation', amount: 180, vendor: 'Assurances XYZ', status: 'Payé', paid: true, property_id: 'prop-2', category_id: 'cat-4', date: '2024-01-10' },
    { id: 'exp-7', description: 'Peinture salon', amount: 320, vendor: 'Peintre Pro', status: 'Payé', paid: true, property_id: 'prop-2', category_id: 'cat-3', date: '2024-03-10' },
    { id: 'exp-8', description: 'Taxe foncière 2024', amount: 650, vendor: 'Trésor Public', status: 'Payé', paid: true, property_id: 'prop-2', category_id: 'cat-5', date: '2024-01-30' },
    
    { id: 'exp-9', description: 'Nettoyage après départ', amount: 120, vendor: 'Clean Services', status: 'Payé', paid: true, property_id: 'prop-3', category_id: 'cat-3', date: '2024-03-05' },
    { id: 'exp-10', description: 'Assurance habitation', amount: 120, vendor: 'Assurances XYZ', status: 'Payé', paid: true, property_id: 'prop-3', category_id: 'cat-4', date: '2024-01-10' }
  ]
}

// Function to add sample data to Supabase
export async function addSampleData() {
  try {
    console.log('🏗️ Creating database tables and adding sample data...')
    
    // Add categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(sampleData.categories)
      .select()
    
    if (categoriesError) {
      console.error('Error adding categories:', categoriesError)
    } else {
      console.log('✅ Categories added:', categoriesData?.length || 0)
    }

    // Add properties
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('properties')
      .insert(sampleData.properties)
      .select()
    
    if (propertiesError) {
      console.error('Error adding properties:', propertiesError)
    } else {
      console.log('✅ Properties added:', propertiesData?.length || 0)
    }

    // Add revenues
    const { data: revenuesData, error: revenuesError } = await supabase
      .from('revenues')
      .insert(sampleData.revenues)
      .select()
    
    if (revenuesError) {
      console.error('Error adding revenues:', revenuesError)
    } else {
      console.log('✅ Revenues added:', revenuesData?.length || 0)
    }

    // Add expenses
    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .insert(sampleData.expenses)
      .select()
    
    if (expensesError) {
      console.error('Error adding expenses:', expensesError)
    } else {
      console.log('✅ Expenses added:', expensesData?.length || 0)
    }

    console.log('🎉 Sample data setup complete!')
    return true
    
  } catch (error) {
    console.error('❌ Error setting up sample data:', error)
    return false
  }
}

// Function to clear all data (for testing)
export async function clearAllData() {
  try {
    await supabase.from('revenues').delete().neq('id', 'impossible-id')
    await supabase.from('expenses').delete().neq('id', 'impossible-id')
    await supabase.from('properties').delete().neq('id', 'impossible-id')
    await supabase.from('categories').delete().neq('id', 'impossible-id')
    console.log('🧹 All data cleared')
    return true
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    return false
  }
}
