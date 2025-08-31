'use client'

import { MeasurementSection } from '@/components/marketing/measurement-section'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 pt-32">
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