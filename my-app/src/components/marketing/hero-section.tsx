'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const patternBg = `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-gray-900" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: patternBg }} />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <div className="animate-fade-up">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl">
            Instant Quotes for
            <br />
            <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              Custom Architectural Products
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-200 md:text-2xl">
            Get accurate price estimates for windows, doors, and skylights in seconds. 
            Upload a photo or enter measurements manually.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="#measurement">
              <Button
                size="lg"
                className="group bg-accent hover:bg-accent/90 text-white"
              >
                Start Your Quote
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-white">50K+</div>
            <div className="text-sm text-gray-300">Quotes Generated</div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-white">98%</div>
            <div className="text-sm text-gray-300">Accuracy Rate</div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-sm text-gray-300">Available</div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl font-bold text-white">3sec</div>
            <div className="text-sm text-gray-300">Quote Time</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white" />
      </div>
    </section>
  )
}