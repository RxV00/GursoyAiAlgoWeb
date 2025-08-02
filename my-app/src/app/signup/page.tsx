'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { LazyStarAnimations } from "@/components/ui/lazy-star-animations"
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    newsletter: false
  })

  const supabase = createClient()



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' })
      setIsLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setMessage({ type: 'error', text: 'You must agree to the Terms of Service' })
      setIsLoading(false)
      return
    }

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
            role: formData.role,
            newsletter_subscription: formData.newsletter,
          }
        }
      })

      if (error) {
        throw error
      }

      if (data.user && !data.session) {
        // Email confirmation required
        setMessage({ 
          type: 'success', 
          text: 'Check your email for a confirmation link to complete your registration!' 
        })
      } else if (data.session) {
        // User is signed in immediately (email confirmation disabled)
        setMessage({ 
          type: 'success', 
          text: 'Account created successfully! Redirecting...' 
        })
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }

    } catch (error) {
      console.error('Signup error:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An error occurred during signup. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
      {/* Background Stars - More frequent */}
      <LazyStarAnimations
        starCount={120}
        starColor="#c6d3e1"
        shootingStarProps={{
          minSpeed: 12,
          maxSpeed: 25,
          minDelay: 1000,
          maxDelay: 2500,
          starColor: "#7a8fa5",
          trailColor: "#c6d3e1",
          starWidth: 10,
          starHeight: 2,
        }}
        className="absolute inset-0 pointer-events-none z-0"
        enableLazyLoading={false}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 pt-32">
        <div className="w-full max-w-md relative z-20">
          <Card className="shadow-lg relative z-30 bg-white border border-slate-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Create Your Account</CardTitle>
              <CardDescription className="text-gray-600">
                Join GursoyJar Architecture and get instant quotes for your projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                      First Name
                    </Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      type="text" 
                      placeholder="John" 
                      className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                      Last Name
                    </Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      type="text" 
                      placeholder="Doe" 
                      className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                    Company Name (Optional)
                  </Label>
                  <Input 
                    id="company" 
                    name="company"
                    type="text" 
                    placeholder="Your Company" 
                    className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]" 
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                    Your Role
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="architect">Architect</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="homeowner">Homeowner</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <p className="text-xs text-slate-500">Must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full border-slate-300 focus:border-[#c6d3e1] focus:ring-[#c6d3e1]"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                  />
                  <Label htmlFor="terms" className="text-sm text-slate-600 leading-5">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#7a8fa5] hover:text-[#2d3e50] underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#7a8fa5] hover:text-[#2d3e50] underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="newsletter" 
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => setFormData({...formData, newsletter: checked as boolean})}
                  />
                  <Label htmlFor="newsletter" className="text-sm text-slate-600 leading-5">
                    Send me updates about new features and architectural trends
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#c6d3e1] hover:bg-[#a8bcd2] text-[#2d3e50] shadow-elegant text-lg py-3"
                  disabled={isLoading || !formData.agreeToTerms}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>



              <div className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#7a8fa5] hover:text-[#2d3e50] transition-colors">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Questions about getting started?{" "}
              <Link href="#contact" className="text-[#7a8fa5] hover:text-[#2d3e50] transition-colors">
                Contact our team
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
