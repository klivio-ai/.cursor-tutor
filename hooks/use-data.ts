"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Property = Database["public"]["Tables"]["properties"]["Row"]
type Revenue = Database["public"]["Tables"]["revenues"]["Row"]
type Expense = Database["public"]["Tables"]["expenses"]["Row"]
type Tenant = Database["public"]["Tables"]["tenants"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]
type Payment = Database["public"]["Tables"]["payments"]["Row"]

interface DataState {
  properties: Property[]
  revenues: Revenue[]
  expenses: Expense[]
  tenants: Tenant[]
  categories: Category[]
  payments: Payment[]
  loading: boolean
  error: string | null
}

interface UseDataReturn extends DataState {
  refetch: () => Promise<void>
  addProperty: (property: Omit<Property, "id" | "created_at" | "updated_at">) => Promise<Property>
  addRevenue: (revenue: Omit<Revenue, "id" | "created_at" | "updated_at">) => Promise<Revenue>
  addExpense: (expense: Omit<Expense, "id" | "created_at" | "updated_at">) => Promise<Expense>
  addTenant: (tenant: Omit<Tenant, "id" | "created_at" | "updated_at">) => Promise<Tenant>
  addPayment: (payment: Omit<Payment, "id" | "created_at" | "updated_at">) => Promise<Payment>
  updateProperty: (id: string, updates: Partial<Property>) => Promise<Property>
  updateRevenue: (id: string, updates: Partial<Revenue>) => Promise<Revenue>
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<Expense>
  updateTenant: (id: string, updates: Partial<Tenant>) => Promise<Tenant>
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<Payment>
  deleteProperty: (id: string) => Promise<void>
  deleteRevenue: (id: string) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  deleteTenant: (id: string) => Promise<void>
  deletePayment: (id: string) => Promise<void>
}

export function useData(): UseDataReturn {
  const [state, setState] = useState<DataState>({
    properties: [],
    revenues: [],
    expenses: [],
    tenants: [],
    categories: [],
    payments: [],
    loading: true,
    error: null,
  })

  const fetchAllData = async () => {
    try {
      setState((prev: DataState) => ({ ...prev, loading: true, error: null }))

      const [
        { data: properties, error: propertiesError },
        { data: revenues, error: revenuesError },
        { data: expenses, error: expensesError },
        { data: tenants, error: tenantsError },
        { data: categories, error: categoriesError },
        { data: payments, error: paymentsError },
      ] = await Promise.all([
        supabase.from("properties").select("*").order("created_at", { ascending: false }),
        supabase.from("revenues").select(`
          *,
          properties(name),
          categories(name),
          tenants(name)
        `).order("date", { ascending: false }),
        supabase.from("expenses").select(`
          *,
          properties(name),
          categories(name)
        `).order("date", { ascending: false }),
        supabase.from("tenants").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
        supabase.from("payments").select("*").order("due_date", { ascending: false }),
      ])

      if (propertiesError) throw propertiesError
      if (revenuesError) throw revenuesError
      if (expensesError) throw expensesError
      if (tenantsError) throw tenantsError
      if (categoriesError) throw categoriesError
      if (paymentsError) throw paymentsError

      setState({
        properties: properties || [],
        revenues: revenues || [],
        expenses: expenses || [],
        tenants: tenants || [],
        categories: categories || [],
        payments: payments || [],
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      setState((prev: DataState) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue",
      }))
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // CRUD Operations
  const addProperty = async (property: Omit<Property, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("properties")
      .insert([property])
      .select()
      .single()

    if (error) throw error
    setState((prev: DataState) => ({ ...prev, properties: [data, ...prev.properties] }))
    return data
  }

  const addRevenue = async (revenue: Omit<Revenue, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("revenues")
      .insert([revenue])
      .select(`
        *,
        properties(name),
        categories(name),
        tenants(name)
      `)
      .single()

    if (error) throw error
    setState((prev: DataState) => ({ ...prev, revenues: [data, ...prev.revenues] }))
    return data
  }

  const addExpense = async (expense: Omit<Expense, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("expenses")
      .insert([expense])
      .select(`
        *,
        properties(name),
        categories(name)
      `)
      .single()

    if (error) throw error
    setState((prev: DataState) => ({ ...prev, expenses: [data, ...prev.expenses] }))
    return data
  }

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const { data, error } = await supabase
      .from("properties")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      properties: prev.properties.map((p: Property) => p.id === id ? data : p)
    }))
    return data
  }

  const updateRevenue = async (id: string, updates: Partial<Revenue>) => {
    const { data, error } = await supabase
      .from("revenues")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(`
        *,
        properties(name),
        categories(name),
        tenants(name)
      `)
      .single()

    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      revenues: prev.revenues.map((r: Revenue) => r.id === id ? data : r)
    }))
    return data
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const { data, error } = await supabase
      .from("expenses")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(`
        *,
        properties(name),
        categories(name)
      `)
      .single()

    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      expenses: prev.expenses.map((e: Expense) => e.id === id ? data : e)
    }))
    return data
  }

  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", id)
    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      properties: prev.properties.filter((p: Property) => p.id !== id)
    }))
  }

  const deleteRevenue = async (id: string) => {
    const { error } = await supabase.from("revenues").delete().eq("id", id)
    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      revenues: prev.revenues.filter((r: Revenue) => r.id !== id)
    }))
  }

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id)
    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      expenses: prev.expenses.filter((e: Expense) => e.id !== id)
    }))
  }

  const addTenant = async (tenant: Omit<Tenant, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("tenants")
      .insert([tenant])
      .select()
      .single()

    if (error) throw error
    setState((prev: DataState) => ({ ...prev, tenants: [data, ...prev.tenants] }))
    return data
  }

  const updateTenant = async (id: string, updates: Partial<Tenant>) => {
    const { data, error } = await supabase
      .from("tenants")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      tenants: prev.tenants.map((t: Tenant) => t.id === id ? data : t)
    }))
    return data
  }

  const deleteTenant = async (id: string) => {
    const { error } = await supabase.from("tenants").delete().eq("id", id)
    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      tenants: prev.tenants.filter((t: Tenant) => t.id !== id)
    }))
  }

  const addPayment = async (payment: Omit<Payment, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("payments")
      .insert([payment])
      .select()
      .single()

    if (error) throw error
    setState((prev: DataState) => ({ ...prev, payments: [data, ...prev.payments] }))
    return data
  }

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    const { data, error } = await supabase
      .from("payments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      payments: prev.payments.map((p: Payment) => p.id === id ? data : p)
    }))
    return data
  }

  const deletePayment = async (id: string) => {
    const { error } = await supabase.from("payments").delete().eq("id", id)
    if (error) throw error
    setState((prev: DataState) => ({
      ...prev,
      payments: prev.payments.filter((p: Payment) => p.id !== id)
    }))
  }

  return {
    ...state,
    refetch: fetchAllData,
    addProperty,
    addRevenue,
    addExpense,
    addTenant,
    addPayment,
    updateProperty,
    updateRevenue,
    updateExpense,
    updateTenant,
    updatePayment,
    deleteProperty,
    deleteRevenue,
    deleteExpense,
    deleteTenant,
    deletePayment,
  }
} 