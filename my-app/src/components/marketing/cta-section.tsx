'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section id='contact' className='py-24 bg-blue-900 text-white'>
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="space-y-8">
          <h2 className="text-5xl font-light mb-6">
            Ready to Get <span className="font-semibold">Started</span>?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of architects and contractors who trust Gursoylar for their professional project
estimates
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 shadow-elegant px-8 py-4
text-lg font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="#measurement">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white
hover:text-blue-900 px-8 py-4 text-lg">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}