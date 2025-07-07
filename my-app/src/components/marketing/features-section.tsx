'use client'
import { ShieldCheck, Camera, Clock, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'

export function FeaturesSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Accurate Quotes',
      description: 'Get instant pricing with built-in measurement validation and professional accuracy.',
      details: [
        'Advanced algorithms ensure precise calculations',
        'Integration with industry-standard pricing models',
        'Real-time market price adjustments',
        'Professional-grade accuracy for all quotes'
      ]
    },
    {
      icon: Camera,
      title: 'AI Measurements',
      description: 'Upload a photo and let our advanced AI technology handle the precise measurements.',
      details: [
        'DeepSeek AI automatically extracts dimensions',
        'Supports multiple image formats and angles',
        'Instant processing and validation',
        'Manual override options for verification'
      ]
    },
    {
      icon: Clock,
      title: 'Fast Results',
      description: 'Receive your detailed quote in just seconds with comprehensive breakdowns.',
      details: [
        'Sub-second calculation processing',
        'Detailed material and labor breakdowns',
        'Multiple pricing options and alternatives',
        'Instant PDF generation and download'
      ]
    }
  ]

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light text-slate-900 mb-6">
            Why Choose <span className="font-semibold text-[#7a8fa5]">Gursoylar</span>?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of architectural product quoting with our advanced features designed for
professionals
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex p-4 rounded-2xl bg-[#f0f4f8] border border-slate-200">
                    <f.icon className="h-8 w-8 text-[#7a8fa5]" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">{f.description}</p>

                <Accordion.Root type="single" collapsible>
                  <Accordion.Item value="details">
                    <Accordion.Trigger className="group flex items-center justify-between w-full px-4 py-3
text-left text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                      <span>Learn More</span>
                      <motion.div
                        className="text-slate-500"
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </Accordion.Trigger>
                    <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up
data-[state=open]:animate-accordion-down">
                      <div className="pt-4">
                        <ul className="space-y-2 text-sm text-slate-600">
                          {f.details.map((detail, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-[#7a8fa5] mt-1">•</span>
                              <span>{detail}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}