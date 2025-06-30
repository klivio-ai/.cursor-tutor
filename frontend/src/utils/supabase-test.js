import { supabase } from '../lib/supabase.js'

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Simple connection test using select with count option
    const { data, error, count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful')
    return { success: true, count: count || 0 }
    
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return { success: false, error: error.message }
  }
}

// Test if tables exist
export async function testTablesExist() {
  const tables = ['categories', 'properties', 'revenues', 'expenses']
  const results = {}
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        results[table] = { exists: false, error: error.message }
      } else {
        results[table] = { exists: true, count: count || 0 }
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message }
    }
  }
  
  return results
}