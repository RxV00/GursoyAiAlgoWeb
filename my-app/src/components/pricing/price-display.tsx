'use client'

import { Button } from '@/components/ui/button'
import { Measurements } from '@/lib/product-utils'
import { ChevronDown, Calculator, Package, Wrench, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'

interface PriceDisplayProps {
  product: string | null
  measurements: Measurements | null
  price: number | null
}

export function PriceDisplay({ product, measurements, price }: PriceDisplayProps) {
  if (!product || !measurements) {
    return (
      <p className="text-gray-600 text-sm">
        Select a product and provide measurements to see your quote.
      </p>
    )
  }

  const unit = measurements.unit || 'cm'

  // Calculate breakdown for display (simplified calculation)
  const basePrice = price || 0
  const materialCost = basePrice * 0.4
  const laborCost = basePrice * 0.3
  const overhead = basePrice * 0.2
  const profit = basePrice * 0.1

  const breakdown = {
    materials: materialCost,
    labor: laborCost,
    overhead: overhead,
    profit: profit
  }

  const additionalOptions = [
    { name: 'Premium Hardware', price: 150 },
    { name: 'Extended Warranty', price: 80 },
    { name: 'Installation Service', price: 200 },
    { name: 'Maintenance Package', price: 120 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#7a8fa5] to-[#5a6f85] text-white p-6 text-center">
          <div className="text-4xl font-bold mb-2">
            {price !== null ? `₺${price.toFixed(2)}` : 'Calculating...'}
          </div>
          <p className="text-blue-100 text-sm">Total Estimated Cost</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-900">
                {Object.entries(measurements)
                  .filter(([k]) => k !== 'unit')
                  .reduce((acc, [, value]) => acc * Number(value), 1) / 10000}
                m²
              </div>
              <p className="text-sm text-slate-600">Total Area</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-900">
                {price ? (price / (Object.entries(measurements)
                  .filter(([k]) => k !== 'unit')
                  .reduce((acc, [, value]) => acc * Number(value), 1) / 10000)).toFixed(0) : '0'}
                ₺/m²
              </div>
              <p className="text-sm text-slate-600">Price per m²</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Measurements</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(measurements)
                .filter(([k]) => k !== 'unit')
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-slate-600 capitalize">{key}:</span>
                    <span className="font-medium">{value} {unit}</span>
                  </div>
                ))}
            </div>
          </div>

          <Accordion.Root type="single" collapsible className="w-full space-y-2">
            <Accordion.Item value="breakdown">
              <Accordion.Trigger className="group flex items-center justify-between w-full px-4 py-3 text-left
text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Cost Breakdown</span>
                </div>
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
                <div className="pt-2 pb-4 space-y-2">
                  {Object.entries(breakdown).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex justify-between items-center py-2 border-b border-slate-100
last:border-b-0"
                    >
                      <div className="flex items-center space-x-2">
                        {key === 'materials' && <Package className="h-4 w-4 text-blue-500" />}
                        {key === 'labor' && <Wrench className="h-4 w-4 text-orange-500" />}
                        {key === 'overhead' && <FileText className="h-4 w-4 text-purple-500" />}
                        {key === 'profit' && <Calculator className="h-4 w-4 text-green-500" />}
                        <span className="text-sm text-slate-600 capitalize">{key}</span>
                      </div>
                      <span className="font-medium text-slate-900">₺{value.toFixed(2)}</span>
                    </motion.div>
                  ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="options">
              <Accordion.Trigger className="group flex items-center justify-between w-full px-4 py-3 text-left
text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Additional Options</span>
                </div>
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
                <div className="pt-2 pb-4 space-y-2">
                  {additionalOptions.map((option, index) => (
                    <motion.div
                      key={option.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex justify-between items-center py-2 border-b border-slate-100
last:border-b-0"
                    >
                      <span className="text-sm text-slate-600">{option.name}</span>
                      <span className="font-medium text-slate-900">+₺{option.price}</span>
                    </motion.div>
                  ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>

      <Button className="w-full bg-[#7a8fa5] hover:bg-[#5a6f85] text-white py-3 rounded-lg font-medium">
        Get Detailed Quote
      </Button>
    </motion.div>
  )
}