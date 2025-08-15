import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MeasurementSection } from '@/components/marketing/measurement-section'

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?next=' + encodeURIComponent('/pricing'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Pricing Calculator
          </h1>
          <p className="text-lg text-slate-600">
            Get accurate quotes for your architectural products
          </p>
        </div>
        <MeasurementSection isAuthenticated={true} />
      </div>
    </div>
  )
}