import { createClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/"
    const error = searchParams.get("error")
    const error_description = searchParams.get("error_description")

    // Handle auth errors
    if (error) {
      console.error("Auth callback error:", error, error_description)
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error_description || error)}`)
    }

    if (code) {
      const supabase = createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Code exchange error:", exchangeError)
        return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(exchangeError.message)}`)
      }

      if (data.session) {
        // Successful authentication
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    // Fallback redirect
    return NextResponse.redirect(`${origin}/auth`)
  } catch (error) {
    console.error("Auth callback unexpected error:", error)
    return NextResponse.redirect(`${request.nextUrl.origin}/auth?error=unexpected_error`)
  }
}
