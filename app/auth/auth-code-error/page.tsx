import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-red-600">Authentication Error</CardTitle>
          <CardDescription className="text-center">There was an error with your authentication link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            The authentication link you clicked may be invalid or expired. Please try signing in again.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
