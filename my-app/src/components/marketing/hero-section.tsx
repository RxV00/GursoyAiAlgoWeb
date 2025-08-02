'use client'

import { useEffect, useState } from 'react'
import { LazyMotion, domMax, m } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CountUp from '@/components/ui/CountUp'
import WindowAnimation from '../ui/window-animation'
import { LazyStarAnimations } from '@/components/ui/lazy-star-animations'

export function HeroSection() {
  const [showMainHero, setShowMainHero] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      // Show content with proper timing for smooth animation
      const timer = setTimeout(() => {
        setShowMainHero(true)
      }, 800) // Longer delay to let animation start properly
      return () => clearTimeout(timer)
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
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(194, 211, 225, 0.1) 0%, transparent 50%)`,
        minHeight: '100vh'
      }}
    >
              {/* Always load star animations for background */}
        <LazyStarAnimations
          starCount={100}
          starColor="#c6d3e1"
          shootingStarProps={{
            minSpeed: 15,
            maxSpeed: 25,
            minDelay: 1500,
            maxDelay: 3000,
            starColor: "#7a8fa5",
            trailColor: "#c6d3e1",
            starWidth: 15,
            starHeight: 2,
          }}
          className="absolute inset-0"
          enableLazyLoading={false}
        />
        
        {/* Sliding Window Animation - Display as overlay */}
        {showMainHero && <WindowAnimation />}

        {/* Main Hero Content */}
        <LazyMotion features={domMax}>
          <m.div
            className="relative z-10 mx-auto max-w-6xl px-4 md:px-6 text-center gpu-accelerated"
            variants={heroContentVariants}
            initial="hidden"
            animate={showMainHero ? 'visible' : 'hidden'}
            style={{
              // FIXED: Always ensure content stays visible, but below navbar
              minHeight: 'auto',
              position: 'relative',
              zIndex: 10
            }}
          >
          <div className="animate-fade-up gpu-accelerated">
            <h1 className="mb-6 md:mb-8 text-4xl md:text-6xl lg:text-7xl font-light leading-tight text-slate-900">
              Instant Quotes for
              <br />
              <span className="font-semibold text-[#7a8fa5]">
                Custom Architectural Products
              </span>
            </h1>
            <p className="mx-auto mb-8 md:mb-12 max-w-3xl px-4 md:px-0 text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed">
              Get accurate price estimates for windows, doors, and skylights in seconds.
              Upload a photo or enter measurements manually.
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center px-4 md:px-0">
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
          <div className="mt-12 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-2 md:px-0">
            <div
              className="animate-fade-up bg-white border border-slate-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-elegant smooth-transition"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-[#7a8fa5]">
                <CountUp to={50000} separator="," className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-[#7a8fa5]" />
                <span>+</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 md:mt-2">Quotes Generated</div>
            </div>
            <div
              className="animate-fade-up bg-white border border-slate-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-elegant smooth-transition"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-[#7a8fa5]">
                <CountUp to={98} className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-[#7a8fa5]" />
                <span>%</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 md:mt-2">Accuracy Rate</div>
            </div>
            <div
              className="animate-fade-up bg-white border border-slate-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-elegant smooth-transition"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-[#7a8fa5]">
                <span className="text-4xl font-light text-[#7a8fa5]">24/7</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 md:mt-2">Available</div>
            </div>
            <div
              className="animate-fade-up bg-white border border-slate-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-elegant smooth-transition"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-[#7a8fa5]">
                <CountUp to={3} className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-[#7a8fa5]" />
                <span>sec</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 md:mt-2">Quote Time</div>
            </div>
          </div>
          </m.div>
        </LazyMotion>

        {/* Elegant scroll indicator - only shows when main hero is visible */}
        {showMainHero && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-[#7a8fa5] opacity-70" />
          </div>
        )}
    </section>
  )
}