export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          color: string
          type: "revenue" | "expense"
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          type: "revenue" | "expense"
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          type?: "revenue" | "expense"
          created_at?: string
          updated_at?: string
          user_id?: string
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
          monthly_rent: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          type: string
          purchase_price: number
          current_value: number
          monthly_rent: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          type?: string
          purchase_price?: number
          current_value?: number
          monthly_rent?: number
          created_at?: string
          updated_at?: string
          user_id?: string
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
          monthly_rent: number
          deposit: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          property_id: string
          lease_start: string
          lease_end: string
          monthly_rent: number
          deposit: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          property_id?: string
          lease_start?: string
          lease_end?: string
          monthly_rent?: number
          deposit?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      revenues: {
        Row: {
          id: string
          amount: number
          description: string
          date: string
          category_id: string
          property_id: string
          tenant_id: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          amount: number
          description: string
          date: string
          category_id: string
          property_id: string
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          amount?: number
          description?: string
          date?: string
          category_id?: string
          property_id?: string
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      expenses: {
        Row: {
          id: string
          amount: number
          description: string
          date: string
          category_id: string
          property_id: string
          vendor: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          amount: number
          description: string
          date: string
          category_id: string
          property_id: string
          vendor: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          amount?: number
          description?: string
          date?: string
          category_id?: string
          property_id?: string
          vendor?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      payments: {
        Row: {
          id: string
          amount: number
          date: string
          tenant_id: string
          property_id: string
          payment_method: string
          status: "pending" | "completed" | "failed"
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          amount: number
          date: string
          tenant_id: string
          property_id: string
          payment_method: string
          status: "pending" | "completed" | "failed"
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          amount?: number
          date?: string
          tenant_id?: string
          property_id?: string
          payment_method?: string
          status?: "pending" | "completed" | "failed"
          created_at?: string
          updated_at?: string
          user_id?: string
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
