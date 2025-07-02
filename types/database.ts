export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          type: "revenue" | "expense"
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: "revenue" | "expense"
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: "revenue" | "expense"
          color?: string
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
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          property_id: string
          lease_start: string
          lease_end: string
          rent_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          property_id: string
          lease_start: string
          lease_end: string
          rent_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          property_id?: string
          lease_start?: string
          lease_end?: string
          rent_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      revenues: {
        Row: {
          id: string
          description: string
          amount: number
          date: string
          property_id: string
          category_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          date: string
          property_id: string
          category_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          date?: string
          property_id?: string
          category_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          description: string
          amount: number
          date: string
          property_id: string
          category_id: string
          vendor: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          date: string
          property_id: string
          category_id: string
          vendor: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          date?: string
          property_id?: string
          category_id?: string
          vendor?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          tenant_id: string
          amount: number
          date: string
          method: string
          status: "pending" | "completed" | "failed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          amount: number
          date: string
          method: string
          status?: "pending" | "completed" | "failed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          amount?: number
          date?: string
          method?: string
          status?: "pending" | "completed" | "failed"
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
