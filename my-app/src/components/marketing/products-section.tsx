'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, Check, Star, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as Accordion from '@radix-ui/react-accordion'
import { DoorComponent } from '@/components/ui/door-component'

const products = [
  {
    id: 'window',
    name: 'Windows',
    icon: '🪟' ,
    description: 'Energy efficient designs with premium materials for every architectural style.',
    specifications: [
      'Double or triple glazing options',
      'Energy efficiency ratings A++ to C',
      'Customizable frame materials (PVC, Aluminum, Wood)',
      'Multi-point locking systems',
      'Noise reduction up to 42dB'
    ],
    features: [
      'Thermal break technology',
      'UV protection coating',
      'Easy maintenance design',
      'Weather sealing systems'
    ],
    priceRange: '€150 - €800 per m²'
  },
  {
    id: 'door',
    name: 'Doors',
    icon: '🚪',
    description: 'Secure and stylish entry solutions with advanced locking systems.',
    specifications: [
      'Multi-point locking mechanisms',
      'RC2 security rating standard',
      'Insulation values up to 1.3 W/m²K',
      'Custom sizes and designs',
      'Various glass options available'
    ],
    features: [
      'Anti-lift security features',
      'Weatherproof construction',
      'Smart lock compatibility',
      'Reinforced frame design'
    ],
    priceRange: '€800 - €3,500 per unit'
  },
  {
    id: 'skylight',
    name: 'Skylights',
    icon: '☀️',
    description: 'Bring natural light into your space with weather-resistant designs.',
    specifications: [
      'Fixed or opening mechanisms',
      'Laminated safety glass standard',
      'Integrated drainage systems',
      'Remote control options',
      'Solar heat gain control'
    ],
    features: [
      'Automated rain sensors',
      'Ventilation control systems',
      'Easy cleaning access',
      'Leak-proof guarantee'
    ],
    priceRange: '€400 - €2,000 per unit'
  },
]

export function ProductsSection() {
  const [openDoors, setOpenDoors] = useState<{ [key: string]: boolean }>({})
  const { ref, inView } = useInView({
    threshold: 0.1, // Reduced from 0.3 to work better on mobile
    triggerOnce: true,
    rootMargin: '-10% 0px -10% 0px', // Added margins for better mobile detection
  })

  // Auto-open doors sequentially when section comes into view
  useEffect(() => {
    if (inView) {
      const productIds = ['window', 'door', 'skylight']
      
      productIds.forEach((productId, index) => {
        setTimeout(() => {
          setOpenDoors(prev => ({
            ...prev,
            [productId]: true
          }))
        }, (index + 1) * 800) // 800ms delay between each door opening
      })
    }
  }, [inView])

  const toggleDoor = (productId: string) => {
    setOpenDoors(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

  return (
    <section id="products" className="py-24 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light text-slate-900 mb-6">
            Our <span className="font-semibold text-[#7a8fa5]">Products</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our selection of premium architectural products, each designed with quality and precision
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {products.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full bg-white border-slate-200 shadow-lg hover:shadow-elegant transition-all duration-300 overflow-hidden">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0f4f8] transition-colors">
                    <span className="text-3xl">{p.icon}</span>
                  </div>
                  <CardTitle className="text-slate-900 text-2xl font-semibold">{p.name}</CardTitle>
                  <div className="mt-2 px-3 py-1 bg-[#7a8fa5] text-white text-sm rounded-full">
                    {p.priceRange}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">{p.description}</p>

                  {/* Door Component Integration */}
                  <div className="mb-6">
                    <DoorComponent
                      isOpen={openDoors[p.id] || false}
                      doorColor="from-[#7a8fa5] to-[#5d7489]"
                      doorHeight="h-48"
                      contentBehind={
                        <div className="p-6 bg-gradient-to-br from-[#f0f4f8] to-[#e8f0f8] rounded-xl">
                          <h4 className="text-lg font-semibold text-slate-900 mb-3">Premium Features</h4>
                          <ul className="space-y-2 text-sm text-slate-700">
                            {p.features.slice(0, 3).map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start space-x-2">
                                <Star className="h-4 w-4 text-[#7a8fa5] mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      }
                    />
                    <motion.button
                      onClick={() => toggleDoor(p.id)}
                      className="mt-4 flex items-center justify-center space-x-2 text-[#7a8fa5] hover:text-[#5d7489] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {openDoors[p.id] ? 'Hide Features' : 'Reveal Features'}
                      </span>
                    </motion.button>
                  </div>

                  <Accordion.Root type="single" collapsible className="w-full">
                    <Accordion.Item value="specifications">
                      <Accordion.Trigger className="group flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors mb-2">
                        <span>Technical Specifications</span>
                        <motion.div
                          className="text-slate-500"
                          animate={{ rotate: 0 }}
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </Accordion.Trigger>
                      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <div className="pt-2 pb-4">
                          <ul className="space-y-2 text-sm text-slate-600">
                            {p.specifications.map((spec, specIndex) => (
                              <motion.li
                                key={specIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: specIndex * 0.1 }}
                                className="flex items-start space-x-2"
                              >
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{spec}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>

                    <Accordion.Item value="features">
                      <Accordion.Trigger className="group flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                        <span>All Features</span>
                        <motion.div
                          className="text-slate-500"
                          animate={{ rotate: 0 }}
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </Accordion.Trigger>
                      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <div className="pt-2 pb-4">
                          <ul className="space-y-2 text-sm text-slate-600">
                            {p.features.map((feature, featureIndex) => (
                              <motion.li
                                key={featureIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                                className="flex items-start space-x-2"
                              >
                                <Star className="h-4 w-4 text-[#7a8fa5] mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}