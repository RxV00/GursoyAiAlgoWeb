'use client'

import Link from "next/link"
import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { LazyStarAnimations } from "@/components/ui/lazy-star-animations"
import { signup, type AuthActionState } from '@/app/login/actions'

const initialState: AuthActionState = { ok: false }

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState)

  const success = state?.ok && !state.error
  const [role, setRole] = useState<string>("")
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false)
  const [newsletter, setNewsletter] = useState<boolean>(false)

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
              {state?.error && (
                <div className="p-4 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
                  {state.error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-md text-sm bg-green-50 text-green-800 border border-green-200">
                  Check your email for a confirmation link to complete your registration!
                </div>
              )}

              <form action={formAction} className="space-y-4">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                    Your Role
                  </Label>
                  <Select value={role} onValueChange={setRole}>
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
                  <input type="hidden" name="role" value={role} />
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
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="agreeToTerms" checked={agreeToTerms} onCheckedChange={(v) => setAgreeToTerms(Boolean(v))} />
                  <input type="hidden" name="agreeToTerms" value={agreeToTerms ? 'on' : ''} />
                  <Label htmlFor="agreeToTerms" className="text-sm text-slate-600 leading-5">
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
                  <Checkbox id="newsletter" checked={newsletter} onCheckedChange={(v) => setNewsletter(Boolean(v))} />
                  <input type="hidden" name="newsletter" value={newsletter ? 'on' : ''} />
                  <Label htmlFor="newsletter" className="text-sm text-slate-600 leading-5">
                    Send me updates about new features and architectural trends
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#c6d3e1] hover:bg-[#a8bcd2] text-[#2d3e50] shadow-elegant text-lg py-3"
                  disabled={isPending}
                >
                  {isPending ? "Creating Account..." : "Create Account"}
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
