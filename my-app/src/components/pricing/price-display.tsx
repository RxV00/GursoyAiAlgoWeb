'use client'

import { Button } from '@/components/ui/button'

interface PriceDisplayProps {
  product: string | null
  measurements: { width: number; height: number; unit: string } | null
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

  return (
    <div className="space-y-4 text-center">
      <div className="text-4xl font-bold text-gray-900">
        {price !== null ? `₺${price.toFixed(2)}` : 'Calculating...'}
      </div>
      <p className="text-sm text-gray-500">
        {measurements.width} x {measurements.height} {measurements.unit}
      </p>
      <Button className="w-full bg-accent hover:bg-accent/90 text-white">
        Continue
      </Button>
    </div>
  )
}