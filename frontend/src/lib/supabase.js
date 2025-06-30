import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fcnenhbjrblxaihksbtr.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmVuaGJqcmJseGFpaGtzYnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDMyODAsImV4cCI6MjA2NDI3OTI4MH0.VsZ9-b5TUvVU2sWdxHTzcr6PEzgAsSgM0-Ibb-ECpcc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)