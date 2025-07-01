import { supabase } from "./supabase.js"

// Properties
export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      tenant:tenants(*)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createProperty(property) {
  const { data, error } = await supabase.from("properties").insert([property]).select()

  if (error) throw error
  return data[0]
}

// Revenues
export async function getRevenus() {
  const { data, error } = await supabase
    .from("revenues")
    .select(`
      *,
      property:properties(*),
      category:categories(*)
    `)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createRevenu(revenu) {
  const { data, error } = await supabase.from("revenues").insert([revenu]).select()

  if (error) throw error
  return data[0]
}

// Expenses
export async function getDepenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      *,
      property:properties(*),
      category:categories(*)
    `)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createDepense(depense) {
  const { data, error } = await supabase.from("expenses").insert([depense]).select()

  if (error) throw error
  return data[0]
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

  if (error) throw error
  return data || []
}

export async function createCategory(category) {
  const { data, error } = await supabase.from("categories").insert([category]).select()

  if (error) throw error
  return data[0]
}

// Payments
export async function getPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      property:properties(*),
      tenant:tenants(*)
    `)
    .order("payment_date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createPayment(payment) {
  const { data, error } = await supabase.from("payments").insert([payment]).select()

  if (error) throw error
  return data[0]
}

// Tenants
export async function getTenants() {
  const { data, error } = await supabase.from("tenants").select("*").order("name", { ascending: true })

  if (error) throw error
  return data || []
}

export async function createTenant(tenant) {
  const { data, error } = await supabase.from("tenants").insert([tenant]).select()

  if (error) throw error
  return data[0]
}
