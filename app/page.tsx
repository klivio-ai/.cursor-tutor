import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import Dashboard from "@/components/Dashboard"

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <Dashboard />
      </div>
    </MainLayout>
  )
}
