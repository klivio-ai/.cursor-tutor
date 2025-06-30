import { supabase } from '../lib/supabase.js'

// Sample data for the property finance dashboard - Updated for UUID schema
const sampleData = {
  categories: [
    { name: 'Loyer', type: 'revenue', color: '#10b981', description: 'Revenus locatifs' },
    { name: 'Charges', type: 'expense', color: '#ef4444', description: 'Charges de copropriété' },
    { name: 'Travaux', type: 'expense', color: '#f59e0b', description: 'Travaux et réparations' },
    { name: 'Assurance', type: 'expense', color: '#8b5cf6', description: 'Assurances' },
    { name: 'Taxes', type: 'expense', color: '#06b6d4', description: 'Taxes foncières' },
    { name: 'Autres Revenus', type: 'revenue', color: '#84cc16', description: 'Autres sources de revenus' }
  ],
  
  properties: [
    {
      name: 'Appartement Paris 11ème',
      address: '15 Rue de la République, 75011 Paris',
      type: 'Appartement',
      payment_status: 'Paid',
      monthly_rent: 1200
    },
    {
      name: 'Maison Bordeaux',
      address: '8 Avenue Victor Hugo, 33000 Bordeaux',
      type: 'Maison',
      payment_status: 'Paid',
      monthly_rent: 900
    },
    {
      name: 'Studio Lyon',
      address: '22 Rue de la Paix, 69001 Lyon', 
      type: 'Studio',
      payment_status: 'Pending',
      monthly_rent: 650
    }
  ]
}

// Function to add sample data to Supabase with UUID handling
export async function addSampleData() {
  try {
    console.log('🏗️ Adding sample data to UUID-based tables...')
    
    // Step 1: Add categories and get their UUIDs
    console.log('Adding categories...')
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(sampleData.categories)
      .select()
    
    if (categoriesError) {
      console.error('Error adding categories:', categoriesError)
      throw new Error(`Failed to add categories: ${categoriesError.message}`)
    }
    
    console.log('✅ Categories added:', categoriesData?.length || 0)
    
    // Step 2: Add properties and get their UUIDs
    console.log('Adding properties...')
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('properties')
      .insert(sampleData.properties)
      .select()
    
    if (propertiesError) {
      console.error('Error adding properties:', propertiesError)
      throw new Error(`Failed to add properties: ${propertiesError.message}`)
    }
    
    console.log('✅ Properties added:', propertiesData?.length || 0)
    
    // Step 3: Create category lookup map
    const categoryMap = {
      'Loyer': categoriesData.find(c => c.name === 'Loyer')?.id,
      'Charges': categoriesData.find(c => c.name === 'Charges')?.id,
      'Travaux': categoriesData.find(c => c.name === 'Travaux')?.id,
      'Assurance': categoriesData.find(c => c.name === 'Assurance')?.id,
      'Taxes': categoriesData.find(c => c.name === 'Taxes')?.id,
      'Autres Revenus': categoriesData.find(c => c.name === 'Autres Revenus')?.id
    }
    
    console.log('Category map:', categoryMap)
    
    // Step 4: Create property lookup map
    const propertyMap = {
      'Appartement Paris 11ème': propertiesData.find(p => p.name === 'Appartement Paris 11ème')?.id,
      'Maison Bordeaux': propertiesData.find(p => p.name === 'Maison Bordeaux')?.id,
      'Studio Lyon': propertiesData.find(p => p.name === 'Studio Lyon')?.id
    }
    
    console.log('Property map:', propertyMap)
    
    // Step 5: Create revenues with proper UUID references
    console.log('Adding revenues...')
    const revenues = [
      { description: 'Loyer Janvier 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Loyer'], date: '2024-01-01' },
      { description: 'Loyer Février 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Loyer'], date: '2024-02-01' },
      { description: 'Loyer Mars 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Loyer'], date: '2024-03-01' },
      { description: 'Loyer Avril 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Loyer'], date: '2024-04-01' },
      { description: 'Loyer Mai 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Loyer'], date: '2024-05-01' },
      { description: 'Loyer Juin 2024', amount: 1200, source: 'Locataire A', status: 'Reçu', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Loyer'], date: '2024-06-01' },
      
      { description: 'Loyer Janvier 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Loyer'], date: '2024-01-01' },
      { description: 'Loyer Février 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Loyer'], date: '2024-02-01' },
      { description: 'Loyer Mars 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Loyer'], date: '2024-03-01' },
      { description: 'Loyer Avril 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Loyer'], date: '2024-04-01' },
      { description: 'Loyer Mai 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Loyer'], date: '2024-05-01' },
      { description: 'Loyer Juin 2024', amount: 900, source: 'Locataire B', status: 'Reçu', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Loyer'], date: '2024-06-01' },
      
      { description: 'Caution restituée', amount: 500, source: 'Ancien locataire', status: 'Reçu', paid: true, property_id: propertyMap['Studio Lyon'], category_id: categoryMap['Autres Revenus'], date: '2024-03-15' }
    ]
    
    console.log('Sample revenue to add:', revenues[0])
    
    const { data: revenuesData, error: revenuesError } = await supabase
      .from('revenues')
      .insert(revenues)
      .select()
    
    if (revenuesError) {
      console.error('Error adding revenues:', revenuesError)
      throw new Error(`Failed to add revenues: ${revenuesError.message}`)
    }
    
    console.log('✅ Revenues added:', revenuesData?.length || 0)
    
    // Step 6: Create expenses with proper UUID references
    console.log('Adding expenses...')
    const expenses = [
      { description: 'Charges copropriété Q1', amount: 180, vendor: 'Syndic ABC', status: 'Payé', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Charges'], date: '2024-01-15' },
      { description: 'Assurance habitation', amount: 240, vendor: 'Assurances XYZ', status: 'Payé', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Assurance'], date: '2024-01-10' },
      { description: 'Réparation plomberie', amount: 450, vendor: 'Plombier Pro', status: 'Payé', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Travaux'], date: '2024-02-20' },
      { description: 'Taxe foncière 2024', amount: 890, vendor: 'Trésor Public', status: 'Payé', paid: true, property_id: propertyMap['Appartement Paris 11ème'], category_id: categoryMap['Taxes'], date: '2024-01-30' },
      
      { description: 'Charges copropriété Q1', amount: 150, vendor: 'Syndic DEF', status: 'Payé', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Charges'], date: '2024-01-15' },
      { description: 'Assurance habitation', amount: 180, vendor: 'Assurances XYZ', status: 'Payé', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Assurance'], date: '2024-01-10' },
      { description: 'Peinture salon', amount: 320, vendor: 'Peintre Pro', status: 'Payé', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Travaux'], date: '2024-03-10' },
      { description: 'Taxe foncière 2024', amount: 650, vendor: 'Trésor Public', status: 'Payé', paid: true, property_id: propertyMap['Maison Bordeaux'], category_id: categoryMap['Taxes'], date: '2024-01-30' },
      
      { description: 'Nettoyage après départ', amount: 120, vendor: 'Clean Services', status: 'Payé', paid: true, property_id: propertyMap['Studio Lyon'], category_id: categoryMap['Travaux'], date: '2024-03-05' },
      { description: 'Assurance habitation', amount: 120, vendor: 'Assurances XYZ', status: 'Payé', paid: true, property_id: propertyMap['Studio Lyon'], category_id: categoryMap['Assurance'], date: '2024-01-10' }
    ]
    
    console.log('Sample expense to add:', expenses[0])
    
    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .insert(expenses)
      .select()
    
    if (expensesError) {
      console.error('Error adding expenses:', expensesError)
      throw new Error(`Failed to add expenses: ${expensesError.message}`)
    }
    
    console.log('✅ Expenses added:', expensesData?.length || 0)
    console.log('🎉 Sample data setup complete with UUIDs!')
    
    return true
    
  } catch (error) {
    console.error('❌ Error setting up sample data:', error)
    throw error
  }
}

// Function to clear all data (for testing)
export async function clearAllData() {
  try {
    await supabase.from('revenues').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('expenses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('properties').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('🧹 All data cleared')
    return true
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    return false
  }
}