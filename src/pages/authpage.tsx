"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import { Checkbox } from "../components/ui/checkbox"
import { Heart, Palette, Scissors, User, Mail, Lock, Phone, MapPin } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

export default function Component() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const login = useAuthStore((state: { login: (email: string, password: string) => Promise<void> }) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const form = e.target as HTMLFormElement
      const email = (form.querySelector('#login-email') as HTMLInputElement).value
      const password = (form.querySelector('#login-password') as HTMLInputElement).value
      
      await login(email, password)
      navigate('/') 
    } catch (error) {
      console.error('Login failed:', error)
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Decorative Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <div className="p-2 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="p-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full">
              <Scissors className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            CraftHub
          </h1>
          <p className="text-pink-600/70 text-sm mt-1">Where creativity meets commerce</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="w-full h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full mb-4"></div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-pink-100">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
                >
                  Welcome Back
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
                >
                  Join Us
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="text-center mb-6">
                  <CardTitle className="text-2xl text-pink-800">Welcome Back, Creator!</CardTitle>
                  <CardDescription className="text-pink-600">Continue your crafting journey</CardDescription>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-pink-800 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-pink-800 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" className="border-pink-300" />
                      <Label htmlFor="remember" className="text-sm text-pink-700">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="text-pink-600 hover:text-pink-800 p-0 h-auto">
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2.5"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <Separator className="bg-pink-200" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-pink-600">
                    or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="text-center mb-6">
                  <CardTitle className="text-2xl text-pink-800">Join Our Creative Community</CardTitle>
                  <CardDescription className="text-pink-600">Start your handcrafted journey today</CardDescription>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-pink-800 font-medium">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                        <Input
                          id="first-name"
                          placeholder="John"
                          className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-pink-800 font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-pink-800 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-pink-800 font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-pink-800 font-medium">
                      City
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                      <Input
                        id="city"
                        placeholder="Your city"
                        className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-pink-800 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-pink-800 font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" className="border-pink-300 mt-1" />
                    <Label htmlFor="terms" className="text-sm text-pink-700 leading-relaxed">
                      I agree to the{" "}
                      <Button variant="link" className="text-pink-600 hover:text-pink-800 p-0 h-auto text-sm">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="text-pink-600 hover:text-pink-800 p-0 h-auto text-sm">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="newsletter" className="border-pink-300 mt-1" />
                    <Label htmlFor="newsletter" className="text-sm text-pink-700">
                      Subscribe to our newsletter for craft tips and exclusive offers
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2.5"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}
