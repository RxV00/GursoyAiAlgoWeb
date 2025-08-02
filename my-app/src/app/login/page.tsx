'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LazyStarAnimations } from "@/components/ui/lazy-star-animations"
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        setMessage({ 
          type: 'success', 
          text: 'Login successful! Redirecting...' 
        })
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      }

    } catch (error) {
      console.error('Login error:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Invalid email or password. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
      {/* Background Stars - More frequent */}
      <LazyStarAnimations
        starCount={150}
        starColor="#c6d3e1"
        shootingStarProps={{
          minSpeed: 15,
          maxSpeed: 30,
          minDelay: 800,
          maxDelay: 2000,
          starColor: "#7a8fa5",
          trailColor: "#c6d3e1",
          starWidth: 12,
          starHeight: 2,
        }}
        className="absolute inset-0"
        enableLazyLoading={false}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 pt-32">
        <div className="w-full max-w-md">
          <Card className="border-slate-200 bg-white/95 backdrop-blur-sm shadow-elegant hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center bg-[#c6d3e1] text-[#2d3e50] rounded-t-lg">
              <CardTitle className="text-3xl font-light text-slate-900">Welcome Back</CardTitle>
              <CardDescription className="text-[#4a5f7a] text-lg">
                Sign in to your Gursoylar account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-md text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[#7a8fa5] hover:text-[#2d3e50] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#c6d3e1] hover:bg-[#a8bcd2] text-[#2d3e50] shadow-elegant text-lg py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>



              <div className="text-center text-sm text-slate-600">
                {"Don't have an account? "}
                <Link href="/signup" className="font-medium text-[#7a8fa5] hover:text-[#2d3e50] transition-colors">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Need help getting started?{" "}
              <Link href="#contact" className="text-[#7a8fa5] hover:text-[#2d3e50] transition-colors">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
