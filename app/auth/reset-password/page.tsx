import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ResetPasswordPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const updatePassword = async (formData: FormData) => {
    "use server"

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      redirect("/auth/reset-password?error=Passwords do not match")
    }

    if (password.length < 6) {
      redirect("/auth/reset-password?error=Password must be at least 6 characters")
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      redirect("/auth/reset-password?error=" + error.message)
    }

    redirect("/?message=Password updated successfully")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your new password"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
