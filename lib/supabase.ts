import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          name: string
          address: string
          type: string
          value: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          type: string
          value: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          type?: string
          value?: number
          created_at?: string
        }
      }
      revenus: {
        Row: {
          id: string
          property_id: string
          amount: number
          date: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          amount: number
          date: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          amount?: number
          date?: string
          description?: string
          created_at?: string
        }
      }
      depenses: {
        Row: {
          id: string
          property_id: string
          amount: number
          date: string
          description: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          amount: number
          date: string
          description: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          amount?: number
          date?: string
          description?: string
          category?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          created_at?: string
        }
      }
    }
  }
}
