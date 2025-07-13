'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CountUp from '@/components/ui/CountUp'

export function HeroSection() {
  const controls = useAnimation()
  const [showMainHero, setShowMainHero] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
      // Show main hero content after sliding animation completes
      setTimeout(() => {
        setShowMainHero(true)
      }, 800) // Delay to let sliding animation complete
    }
  }, [controls, inView])

  // Variants for the left window panel
  const leftWindowVariants = {
    hidden: { x: 0 },
    visible: {
      x: '-100%',
      transition: { duration: 0.5 },
    },
  }

  // Variants for the right window panel
  const rightWindowVariants = {
    hidden: { x: 0 },
    visible: {
      x: '100%',
      transition: { duration: 0.5 },
    },
  }

  // Variants for the center divider
  const centerDividerVariants = {
    hidden: { opacity: 1, scaleY: 1 },
    visible: {
      opacity: 0,
      scaleY: 0,
      transition: { duration: 0.3 },
    },
  }

  // Variants for the main hero content
  const heroContentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.1 },
    },
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20"
    >
      {/* Sliding Window Animation Layer */}
      <div className="absolute inset-0 z-30">
        {/* Left Window Panel */}
        <motion.div
          className="absolute inset-0 w-1/2 z-20"
          variants={leftWindowVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-750 to-gray-800">
            <div className="absolute inset-1 bg-gradient-to-br from-gray-700 via-gray-750 to-gray-800
shadow-inner">
              <div className="absolute inset-1 bg-gradient-to-br from-gray-750 to-gray-800">
                {/* Premium Glass Panel */}
                <div className="absolute inset-3 bg-gradient-to-br from-sky-50/70 via-white/50 to-blue-50/60
backdrop-blur-[0.5px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent
to-transparent" />
                  <div className="absolute top-0 left-0 w-2/5 h-3/5 bg-gradient-to-br from-white/45 via-white/15
to-transparent" />
                  <div className="absolute bottom-1/5 right-0 w-1/3 h-2/5 bg-gradient-to-tl from-sky-100/35
via-transparent to-transparent" />
                  <div className="absolute top-1/4 right-1/5 w-1/6 h-1/4 bg-gradient-to-bl from-white/55
via-white/20 to-transparent" />
                  <div className="absolute bottom-1/3 left-1/4 w-1/8 h-1/6 bg-gradient-to-tr from-white/40
to-transparent" />
                  <div className="absolute inset-0 border border-gray-700/60" />
                  <div className="absolute inset-0 border border-white/25" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent
via-white/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent
via-white/30 to-transparent" />
                </div>

                {/* Window Handle */}
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 w-4 h-32 bg-gradient-to-r
from-gray-600 via-gray-500 to-gray-600 shadow-2xl">
                  <div className="absolute inset-0.5 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5
h-10 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 shadow-inner" />
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-400
opacity-60" />
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-400
opacity-60" />
                </div>
              </div>
            </div>

            {/* Enhanced Edge Glow */}
            <div
              className={`absolute right-0 top-0 bottom-0 w-0.5 transition-all duration-[500ms] ${
                inView
                  ? "bg-gradient-to-b from-blue-400/70 via-indigo-400/50 to-purple-400/70shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                  : "bg-gray-600"
              }`}
            />
          </div>
        </motion.div>

        {/* Right Window Panel */}
        <motion.div
          className="absolute inset-0 left-1/2 w-1/2 z-20"
          variants={rightWindowVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-gray-800 via-gray-750 to-gray-800">
            <div className="absolute inset-1 bg-gradient-to-bl from-gray-700 via-gray-750 to-gray-800
shadow-inner">
              <div className="absolute inset-1 bg-gradient-to-bl from-gray-750 to-gray-800">
                {/* Premium Glass Panel */}
                <div className="absolute inset-3 bg-gradient-to-bl from-sky-50/70 via-white/50 to-blue-50/60
backdrop-blur-[0.5px]">
                  <div className="absolute inset-0 bg-gradient-to-bl from-white/35 via-transparent
to-transparent" />
                  <div className="absolute top-0 right-0 w-2/5 h-3/5 bg-gradient-to-bl from-white/45 via-white/15
 to-transparent" />
                  <div className="absolute bottom-1/5 left-0 w-1/3 h-2/5 bg-gradient-to-tr from-sky-100/35
via-transparent to-transparent" />
                  <div className="absolute top-1/4 left-1/5 w-1/6 h-1/4 bg-gradient-to-br from-white/55
via-white/20 to-transparent" />
                  <div className="absolute bottom-1/3 right-1/4 w-1/8 h-1/6 bg-gradient-to-tl from-white/40
to-transparent" />
                  <div className="absolute inset-0 border border-gray-700/60" />
                  <div className="absolute inset-0 border border-white/25" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent
via-white/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent
via-white/30 to-transparent" />
                </div>

                {/* Window Handle */}
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-32 bg-gradient-to-l
from-gray-600 via-gray-500 to-gray-600 shadow-2xl">
                  <div className="absolute inset-0.5 bg-gradient-to-l from-gray-500 via-gray-400 to-gray-500" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5
h-10 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 shadow-inner" />
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-400
opacity-60" />
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-400
opacity-60" />
                </div>
              </div>
            </div>

            {/* Enhanced Edge Glow */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-[500ms] ${
                inView
                  ? "bg-gradient-to-b from-blue-400/70 via-indigo-400/50 to-purple-400/70shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                  : "bg-gray-600"
              }`}
            />
          </div>
        </motion.div>

        {/* Center Divider */}
        <motion.div
          className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-2 z-30"
          variants={centerDividerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-700 shadow-xl">
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-20 bg-gradient-to-b
from-gray-600 via-gray-700 to-gray-600 shadow-inner" />
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-2 bg-gray-500" />
          </div>
        </motion.div>
      </div>

      {/* Original Hero Content - Shows after animation */}
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
                className="border-2 border-[#c6d3e1] text-[#7a8fa5] hover:bg-[#c6d3e1] hover:text-[#2d3e50] px-8
py-4 text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Elegant stats cards */}
        <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div
            className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg
hover:shadow-elegant transition-all duration-300"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="text-4xl font-light text-[#7a8fa5]">
              <CountUp to={50000} separator="," className="text-4xl font-light text-[#7a8fa5]" />
              <span>+</span>
            </div>
            <div className="text-sm text-slate-600 mt-2">Quotes Generated</div>
          </div>
          <div
            className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg
hover:shadow-elegant transition-all duration-300"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-4xl font-light text-[#7a8fa5]">
              <CountUp to={98} className="text-4xl font-light text-[#7a8fa5]" />
              <span>%</span>
            </div>
            <div className="text-sm text-slate-600 mt-2">Accuracy Rate</div>
          </div>
          <div
            className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg
hover:shadow-elegant transition-all duration-300"
            style={{ animationDelay: '0.3s' }}
          >
                          <div className="text-4xl font-light text-[#7a8fa5]">
                <span className="text-4xl font-light text-[#7a8fa5]">24/7</span>
              </div>
            <div className="text-sm text-slate-600 mt-2">Available</div>
          </div>
          <div
            className="animate-fade-up bg-white border border-slate-200 rounded-xl p-8 shadow-lg
hover:shadow-elegant transition-all duration-300"
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
    </section>
  )
}