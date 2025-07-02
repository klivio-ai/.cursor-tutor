import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"

export default async function AuthPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  return <AuthForm />
}
