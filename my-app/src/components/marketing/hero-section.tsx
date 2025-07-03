'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white mt-20">
      {/* Subtle geometric pattern */}

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="animate-fade-up">
          <h1 className="mb-8 text-6xl font-light leading-tight text-slate-900 md:text-7xl">
            Instant Quotes for
            <br />
            <span className="font-semibold text-blue-900">
              Custom Architectural Products
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl text-slate-600 leading-relaxed md:text-2xl">
            Get accurate price estimates for windows, doors, and skylights in seconds.
            Upload a photo or enter measurements manually.
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
            <Link href="#measurement">
              <Button
                size="lg"
                className="group bg-blue-900 hover:bg-blue-800 text-white shadow-elegant px-8 py-4 text-lg"
              >
                Start Your Quote
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-8 py-4
text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Elegant stats cards */}
        <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg
hover:shadow-elegant transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl font-light text-blue-900">50K+</div>
            <div className="text-sm text-slate-600 mt-2">Quotes Generated</div>
          </div>
          <div className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg
hover:shadow-elegant transition-all duration-300" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl font-light text-blue-900">98%</div>
            <div className="text-sm text-slate-600 mt-2">Accuracy Rate</div>
          </div>
          <div className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg
hover:shadow-elegant transition-all duration-300" style={{ animationDelay: '0.3s' }}>
            <div className="text-4xl font-light text-blue-900">24/7</div>
            <div className="text-sm text-slate-600 mt-2">Available</div>
          </div>
          <div className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg
hover:shadow-elegant transition-all duration-300" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl font-light text-blue-900">3sec</div>
            <div className="text-sm text-slate-600 mt-2">Quote Time</div>
          </div>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-blue-900 opacity-70" />
      </div>
    </section>
  )
}