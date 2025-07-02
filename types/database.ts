export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          type: "revenue" | "expense"
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: "revenue" | "expense"
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: "revenue" | "expense"
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          type: string
          purchase_price: number
          current_value: number
          purchase_date: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          type: string
          purchase_price: number
          current_value: number
          purchase_date: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          type?: string
          purchase_price?: number
          current_value?: number
          purchase_date?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          id: string
          property_id: string
          name: string
          email: string
          phone: string | null
          lease_start: string
          lease_end: string
          monthly_rent: number
          deposit: number
          status: "active" | "inactive"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          email: string
          phone?: string | null
          lease_start: string
          lease_end: string
          monthly_rent: number
          deposit: number
          status?: "active" | "inactive"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          email?: string
          phone?: string | null
          lease_start?: string
          lease_end?: string
          monthly_rent?: number
          deposit?: number
          status?: "active" | "inactive"
          created_at?: string
          updated_at?: string
        }
      }
      revenues: {
        Row: {
          id: string
          property_id: string
          category_id: string
          tenant_id: string | null
          amount: number
          date: string
          description: string | null
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          category_id: string
          tenant_id?: string | null
          amount: number
          date: string
          description?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          category_id?: string
          tenant_id?: string | null
          amount?: number
          date?: string
          description?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          property_id: string
          category_id: string
          amount: number
          date: string
          description: string | null
          vendor: string | null
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          category_id: string
          amount: number
          date: string
          description?: string | null
          vendor?: string | null
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          category_id?: string
          amount?: number
          date?: string
          description?: string | null
          vendor?: string | null
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          tenant_id: string
          property_id: string
          amount: number
          due_date: string
          paid_date: string | null
          status: "pending" | "paid" | "overdue"
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          property_id: string
          amount: number
          due_date: string
          paid_date?: string | null
          status?: "pending" | "paid" | "overdue"
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          property_id?: string
          amount?: number
          due_date?: string
          paid_date?: string | null
          status?: "pending" | "paid" | "overdue"
          payment_method?: string | null
          notes?: string | null
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
