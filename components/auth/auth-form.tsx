"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { validateEmail, validatePassword } from "@/lib/utils"

type AuthMode = "signin" | "signup" | "reset"

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const { signIn, signUp, resetPassword } = useAuth()
  const router = useRouter()

  const validateEmailInput = (email: string) => {
    if (!email) {
      setEmailError("Email is required")
      return false
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }

    setEmailError("")
    return true
  }

  const validatePasswordInput = (password: string) => {
    if (mode === "reset") return true

    if (!password) {
      setPasswordError("Password is required")
      return false
    }

    if (mode === "signup") {
      const validation = validatePassword(password)
      if (!validation.isValid) {
        setPasswordError(validation.errors[0])
        return false
      }

      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match")
        return false
      }
    }

    setPasswordError("")
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value) validateEmailInput(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (value) validatePasswordInput(value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    if (mode === "signup" && password && value !== password) {
      setPasswordError("Passwords do not match")
    } else if (mode === "signup" && password && value === password) {
      setPasswordError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const isEmailValid = validateEmailInput(email)
    const isPasswordValid = validatePasswordInput(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)

    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password)
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setMessage({
              type: "error",
              text: "Invalid email or password. Please check your credentials and try again.",
            })
          } else if (error.message.includes("Email not confirmed")) {
            setMessage({
              type: "error",
              text: "Please check your email and click the confirmation link before signing in.",
            })
          } else {
            setMessage({ type: "error", text: error.message })
          }
        } else {
          router.push("/")
        }
      } else if (mode === "signup") {
        const { error } = await signUp(email, password)
        if (error) {
          if (error.message.includes("User already registered")) {
            setMessage({ type: "error", text: "An account with this email already exists. Please sign in instead." })
          } else {
            setMessage({ type: "error", text: error.message })
          }
        } else {
          setMessage({
            type: "success",
            text: "Account created successfully! Please check your email for a confirmation link.",
          })
          setMode("signin")
        }
      } else if (mode === "reset") {
        const { error } = await resetPassword(email)
        if (error) {
          setMessage({ type: "error", text: error.message })
        } else {
          setMessage({
            type: "success",
            text: "Password reset email sent! Please check your inbox.",
          })
          setMode("signin")
        }
      }
    } catch (error: any) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
      console.error("Auth error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "signin":
        return "Sign In"
      case "signup":
        return "Create Account"
      case "reset":
        return "Reset Password"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "signin":
        return "Enter your credentials to access your account"
      case "signup":
        return "Create a new account to get started"
      case "reset":
        return "Enter your email to receive a password reset link"
    }
  }

  const isFormValid = () => {
    const emailValid = validateEmail(email)
    if (mode === "reset") return emailValid

    const passwordValid = password.length > 0
    const confirmPasswordValid = mode === "signin" || confirmPassword === password

    return emailValid && passwordValid && confirmPasswordValid && !emailError && !passwordError
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{getTitle()}</CardTitle>
          <CardDescription className="text-center">{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`pl-10 ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                  required
                />
              </div>
              {emailError && (
                <div className="flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            {mode !== "reset" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`pl-10 pr-10 ${passwordError ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {message && (
              <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                {message.type === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !isFormValid()}>
              {loading ? "Loading..." : getTitle()}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm">
            {mode === "signin" && (
              <>
                <button type="button" onClick={() => setMode("reset")} className="text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </button>
                <div>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === "signup" && (
              <div>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === "reset" && (
              <button type="button" onClick={() => setMode("signin")} className="text-blue-600 hover:text-blue-500">
                Back to sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
