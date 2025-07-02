import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables. Please check your environment configuration.")
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton instance for client-side usage
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
})()

// Re-export for compatibility
export { createBrowserClient }
