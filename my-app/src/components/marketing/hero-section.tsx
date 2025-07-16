'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CountUp from '@/components/ui/CountUp'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { StaticStars } from '@/components/ui/static-stars'
import { WindowAnimation } from '@/components/ui/window-animation'

export function HeroSection() {
  const [showMainHero, setShowMainHero] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      // Start the 3D animation immediately when in view
      setTimeout(() => {
        setShowMainHero(true)
      }, 1300) // Reduced delay for faster hero content appearance while keeping window animation slow
    }
  }, [inView])

  // Variants for the main hero content
  const heroContentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 },
    },
  }

  if (!inView) {
    return (
      <section
        ref={ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-slate-50 pt-24 md:pt-20"
      >
        <div className="text-center">
          <div className="animate-pulse text-slate-400">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-slate-50 pt-24 md:pt-20"
    >
      {/* 3D Window Animation */}
      <WindowAnimation>
        {/* Static Stars Background */}
        <StaticStars
          starCount={150}
          starColor="#c6d3e1"
          className="absolute inset-0 z-0"
        />
        
        {/* Shooting Stars Background */}
        <ShootingStars
          minSpeed={20}
          maxSpeed={35}
          minDelay={800}
          maxDelay={2000}
          starColor="#7a8fa5"
          trailColor="#c6d3e1"
          starWidth={20}
          starHeight={3}
          className="absolute inset-0 z-[1]"
        />

        {/* Main Hero Content */}
        <motion.div
          className="relative z-10 mx-auto max-w-6xl px-6 text-center"
          variants={heroContentVariants}
          initial="hidden"
          animate={showMainHero ? 'visible' : 'hidden'}
        >
          <div className="animate-fade-up">
            <h1 className="mb-8 text-6xl font-light leading-tight text-slate-900 md:text-7xl">
              Instant Quotes for
              <br />
              <span className="font-semibold text-[#7a8fa5]">
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
                  className="group bg-[#c6d3e1] hover:bg-[#a8bcd2] text-[#2d3e50] shadow-elegant px-8 py-4 text-lg"
                >
                  Start Your Quote
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#c6d3e1] text-[#7a8fa5] hover:bg-[#c6d3e1] hover:text-[#2d3e50] px-8 py-4 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Elegant stats cards */}
          <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div
              className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg hover:shadow-elegant transition-all duration-300"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="text-4xl font-light text-[#7a8fa5]">
                <CountUp to={50000} separator="," className="text-4xl font-light text-[#7a8fa5]" />
                <span>+</span>
              </div>
              <div className="text-sm text-slate-600 mt-2">Quotes Generated</div>
            </div>
            <div
              className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg hover:shadow-elegant transition-all duration-300"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-4xl font-light text-[#7a8fa5]">
                <CountUp to={98} className="text-4xl font-light text-[#7a8fa5]" />
                <span>%</span>
              </div>
              <div className="text-sm text-slate-600 mt-2">Accuracy Rate</div>
            </div>
            <div
              className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg hover:shadow-elegant transition-all duration-300"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="text-4xl font-light text-[#7a8fa5]">
                <span className="text-4xl font-light text-[#7a8fa5]">24/7</span>
              </div>
              <div className="text-sm text-slate-600 mt-2">Available</div>
            </div>
            <div
              className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg hover:shadow-elegant transition-all duration-300"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="text-4xl font-light text-[#7a8fa5]">
                <CountUp to={3} className="text-4xl font-light text-[#7a8fa5]" />
                <span>sec</span>
              </div>
              <div className="text-sm text-slate-600 mt-2">Quote Time</div>
            </div>
          </div>
        </motion.div>

        {/* Elegant scroll indicator - only shows when main hero is visible */}
        {showMainHero && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-[#7a8fa5] opacity-70" />
          </div>
        )}
      </WindowAnimation>
    </section>
  )
}