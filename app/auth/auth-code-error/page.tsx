import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-xl">Authentication Error</CardTitle>
          </div>
          <CardDescription>There was an error confirming your email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">This could happen if:</p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>The confirmation link has expired</li>
            <li>The link has already been used</li>
            <li>There was a network error</li>
          </ul>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth">Try signing in again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
