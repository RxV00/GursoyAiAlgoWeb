'use client'
  import Link from 'next/link'
  import { Button } from '@/components/ui/button'

  export function CTASection() {
    return (
      <section id='contact' className='py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white'>
        <div className="mx-auto max-w-7xl px-6 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of architects and contractors who trust ArchQuote for their project estimates
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-warm text-slate-900 hover:bg-primary/90 shadow-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="#measurement">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white
  hover:text-slate-900">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }