export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          type: "revenue" | "expense"
          color: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: "revenue" | "expense"
          color?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: "revenue" | "expense"
          color?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string | null
          address: string
          type: string | null
          tenant_id: string | null
          monthly_rent: number
          payment_status: "Paid" | "Pending" | "Overdue"
          next_due_date: string | null
          user_id: string
          created_at: string
          updated_at: string
          rental_price: number | null
        }
        Insert: {
          id?: string
          name?: string | null
          address: string
          type?: string | null
          tenant_id?: string | null
          monthly_rent: number
          payment_status?: "Paid" | "Pending" | "Overdue"
          next_due_date?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
          rental_price?: number | null
        }
        Update: {
          id?: string
          name?: string | null
          address?: string
          type?: string | null
          tenant_id?: string | null
          monthly_rent?: number
          payment_status?: "Paid" | "Pending" | "Overdue"
          next_due_date?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
          rental_price?: number | null
        }
      }
      tenants: {
        Row: {
          id: string
          name: string
          email: string | null
          phone_number: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone_number?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone_number?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      revenues: {
        Row: {
          id: string
          reference: string | null
          description: string
          amount: number
          source: string
          status: string
          paid: boolean
          notes: string | null
          property_id: string | null
          category_id: string
          date: string
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference?: string | null
          description: string
          amount: number
          source: string
          status: string
          paid?: boolean
          notes?: string | null
          property_id?: string | null
          category_id: string
          date: string
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference?: string | null
          description?: string
          amount?: number
          source?: string
          status?: string
          paid?: boolean
          notes?: string | null
          property_id?: string | null
          category_id?: string
          date?: string
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          reference: string | null
          description: string
          amount: number
          vendor: string
          status: string
          paid: boolean
          notes: string | null
          property_id: string | null
          category_id: string
          due_date: string | null
          date: string
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference?: string | null
          description: string
          amount: number
          vendor: string
          status: string
          paid?: boolean
          notes?: string | null
          property_id?: string | null
          category_id: string
          due_date?: string | null
          date: string
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference?: string | null
          description?: string
          amount?: number
          vendor?: string
          status?: string
          paid?: boolean
          notes?: string | null
          property_id?: string | null
          category_id?: string
          due_date?: string | null
          date?: string
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          property_id: string
          tenant_id: string | null
          amount: number
          payment_date: string
          method: string | null
          notes: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          tenant_id?: string | null
          amount: number
          payment_date: string
          method?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          tenant_id?: string | null
          amount?: number
          payment_date?: string
          method?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
