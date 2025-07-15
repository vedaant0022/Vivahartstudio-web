"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Checkbox } from "../components/ui/checkbox"
import { User, Mail, Lock, Phone, MapPin } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import useAuthStore, { selectIsAuthenticated, selectLogin, selectSignup, selectVerifyEmail } from '../stores/useAuthStore';
import logo from '../assets/image/logo1.png';

export default function Component() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupEmail, setSignupEmail] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [showOtpForm, setShowOtpForm] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const login = useAuthStore(selectLogin)
  const signup = useAuthStore(selectSignup)
  const verifyEmail = useAuthStore(selectVerifyEmail)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const form = e.target as HTMLFormElement
      const email = (form.querySelector('#login-email') as HTMLInputElement).value
      const password = (form.querySelector('#login-password') as HTMLInputElement).value
      
      await login(email, password)
      // Navigation is handled by useEffect
    } catch (error: any) {
      setError(error.message || 'Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const form = e.target as HTMLFormElement
      const firstName = (form.querySelector('#first-name') as HTMLInputElement).value
      const lastName = (form.querySelector('#last-name') as HTMLInputElement).value
      const email = (form.querySelector('#signup-email') as HTMLInputElement).value
      const phoneNumber = (form.querySelector('#phone') as HTMLInputElement).value
      const password = (form.querySelector('#signup-password') as HTMLInputElement).value
      const confirmPassword = (form.querySelector('#confirm-password') as HTMLInputElement).value

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      await signup({ firstName, lastName, email, phoneNumber, password, role: 'user' })
      setSignupEmail(email)
      setShowOtpForm(true)
    } catch (error: any) {
      setError(error.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!signupEmail) throw new Error('No email provided for verification')
      await verifyEmail(signupEmail, otp)
      setShowOtpForm(false)
      setSignupEmail(null)
      setOtp("")
      // Navigation is handled by useEffect
    } catch (error: any) {
      setError(error.message || 'Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-rose-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-2 flex justify-center items-center">
          <img src={logo} alt="logo" width={240} height={60} className="w-[200px] h-[200px]" />
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-rose-400 to-yellow-500 rounded-full mb-4"></div>
          </CardHeader>

          <CardContent>
            {showOtpForm ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <CardTitle className="text-2xl text-yellow-800">Verify Your Email</CardTitle>
                  <CardDescription className="text-yellow-600">
                    Enter the OTP sent to {signupEmail}
                  </CardDescription>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-yellow-800 font-medium">
                      OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-rose-500 hover:from-yellow-600 hover:to-rose-600 text-white font-medium py-2.5"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>
                  <Button
                    variant="link"
                    className="w-full text-yellow-600 hover:text-yellow-800"
                    onClick={() => {
                      setShowOtpForm(false)
                      setOtp("")
                      setError(null)
                    }}
                  >
                    Back to Signup
                  </Button>
                </form>
              </div>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-yellow-100">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
                  >
                    Welcome Back
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
                  >
                    Join Us
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="text-center mb-6">
                    <CardTitle className="text-2xl text-yellow-800">Welcome Back, Creator!</CardTitle>
                    <CardDescription className="text-yellow-600">Continue your crafting journey</CardDescription>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-yellow-800 font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-yellow-800 font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" className="border-yellow-300" />
                        <Label htmlFor="remember" className="text-sm text-yellow-700">
                          Remember me
                        </Label>
                      </div>
                      <Button variant="link" className="text-yellow-600 hover:text-yellow-800 p-0 h-auto">
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-500 to-rose-500 hover:from-yellow-600 hover:to-rose-600 text-white font-medium py-2.5"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <div className="text-center mb-6">
                    <CardTitle className="text-2xl text-yellow-800">Join Our Creative Community</CardTitle>
                    <CardDescription className="text-yellow-600">Start your handcrafted journey today</CardDescription>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-yellow-800 font-medium">
                          First Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                          <Input
                            id="first-name"
                            placeholder="John"
                            className="pl-10 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-yellow-800 font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-yellow-800 font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-yellow-800 font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="pl-10 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-yellow-800 font-medium">
                        City
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                        <Input
                          id="city"
                          placeholder="Your city"
                          className="pl-10 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-yellow-800 font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-yellow-800 font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-600" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" className="border-yellow-300 mt-1" />
                      <Label htmlFor="terms" className="text-sm text-yellow-700 leading-relaxed">
                        I agree to the{" "}
                        <Button variant="link" className="text-yellow-600 hover:text-yellow-800 p-0 h-auto text-sm">
                          Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="text-yellow-600 hover:text-yellow-800 p-0 h-auto text-sm">
                          Privacy Policy
                        </Button>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="newsletter" className="border-yellow-300 mt-1" />
                      <Label htmlFor="newsletter" className="text-sm text-yellow-700">
                        Subscribe to our newsletter for craft tips and exclusive offers
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-500 to-rose-500 hover:from-yellow-600 hover:to-rose-600 text-white font-medium py-2.5"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}