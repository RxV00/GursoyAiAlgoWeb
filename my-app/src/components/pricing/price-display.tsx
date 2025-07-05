'use client'

import { Button } from '@/components/ui/button'
import { Measurements } from '@/lib/pricing'

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
  return (
    <div className="space-y-4 text-center">
      <div className="text-4xl font-bold text-gray-900">
        {price !== null ? `₺${price.toFixed(2)}` : 'Calculating...'}
      </div>
      <ul className="text-sm text-gray-500 space-y-1">
        {Object.entries(measurements)
          .filter(([k]) => k !== 'unit')
          .map(([key, value]) => (
            <li key={key}>
              {key}: {value} {unit}
            </li>
          ))}
      </ul>
      <Button className="w-full bg-accent hover:bg-accent/90 text-white">Continue</Button>
    </div>
  )
}