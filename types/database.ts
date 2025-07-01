export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          type: string
          color: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          color?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          color?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          id: string
          reference: string | null
          description: string
          amount: number
          vendor: string
          status: string
          paid: boolean | null
          notes: string | null
          property_id: string | null
          category_id: string
          due_date: string | null
          date: string
          file_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          reference?: string | null
          description: string
          amount: number
          vendor: string
          status: string
          paid?: boolean | null
          notes?: string | null
          property_id?: string | null
          category_id: string
          due_date?: string | null
          date: string
          file_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          reference?: string | null
          description?: string
          amount?: number
          vendor?: string
          status?: string
          paid?: boolean | null
          notes?: string | null
          property_id?: string | null
          category_id?: string
          due_date?: string | null
          date?: string
          file_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          id: string
          name: string | null
          address: string
          type: string | null
          tenant_id: string | null
          monthly_rent: number
          payment_status: string
          next_due_date: string | null
          user_id: string | null
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
          payment_status?: string
          next_due_date?: string | null
          user_id?: string | null
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
          payment_status?: string
          next_due_date?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
          rental_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      revenues: {
        Row: {
          id: string
          reference: string | null
          description: string
          amount: number
          source: string
          status: string
          paid: boolean | null
          notes: string | null
          property_id: string | null
          category_id: string
          date: string
          file_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          reference?: string | null
          description: string
          amount: number
          source: string
          status: string
          paid?: boolean | null
          notes?: string | null
          property_id?: string | null
          category_id: string
          date: string
          file_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          reference?: string | null
          description?: string
          amount?: number
          source?: string
          status?: string
          paid?: boolean | null
          notes?: string | null
          property_id?: string | null
          category_id?: string
          date?: string
          file_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenues_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenues_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          id: string
          name: string
          email: string | null
          phone_number: string | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone_number?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone_number?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
