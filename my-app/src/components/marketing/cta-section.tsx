'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DoorComponent } from '@/components/ui/door-component'
import { ArrowRight, Users, Award, Clock } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

export function CTASection() {
  const [isDoorOpen, setIsDoorOpen] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1, // Reduced from 0.3 to work better on mobile
    triggerOnce: true,
    rootMargin: '-10% 0px -10% 0px', // Added margins for better mobile detection
  })

  // Auto-open door when section comes into view
  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        setIsDoorOpen(true)
      }, 1000) // 1 second delay after section is in view
    }
  }, [inView])

  const stats = [
    { icon: Users, value: "5,000+", label: "Happy Customers" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Clock, value: "24/7", label: "Support" }
  ]

  return (
    <section id='contact' className='py-24 bg-[#c6d3e1] text-[#2d3e50]' ref={ref}>
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="space-y-8">
          <h2 className="text-5xl font-light mb-6">
            Ready to Get <span className="font-semibold">Started</span>?
          </h2>
          <p className="text-xl text-[#4a5f7a] max-w-3xl mx-auto leading-relaxed">
            Join thousands of architects and contractors who trust Gursoylar for their professional project estimates
          </p>
          
          {/* Door Component Integration */}
          <div className="my-12">
            <DoorComponent
              isOpen={isDoorOpen}
              doorColor="from-[#2d3e50] to-[#1a252f]"
              doorHeight="h-32"
              contentBehind={
                <div className="flex items-center justify-around h-full px-4 bg-gradient-to-r from-white/90 to-[#f0f4f8]/90 backdrop-blur-sm rounded-xl">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-2">
                        <stat.icon className="h-6 w-6 text-[#7a8fa5]" />
                      </div>
                      <div className="text-2xl font-bold text-[#2d3e50]">{stat.value}</div>
                      <div className="text-sm text-[#4a5f7a]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              }
            />
            <button
              onClick={() => setIsDoorOpen(!isDoorOpen)}
              className="mt-4 text-[#2d3e50] hover:text-[#1a252f] transition-colors text-sm font-medium"
            >
              {isDoorOpen ? 'Hide Our Stats' : 'See Why Customers Choose Us'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#7a8fa5] hover:bg-[#f0f4f8] shadow-elegant px-8 py-4 text-lg font-semibold group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#measurement">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#7a8fa5] px-8 py-4 text-lg">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}