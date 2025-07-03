'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { getProductById } from '@/lib/product-data'

interface MeasurementFormProps {
  onMeasurementsChange: (measurements: any) => void
  productType: string | null
}

export function MeasurementForm({ onMeasurementsChange, productType }: MeasurementFormProps) {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (width && height) {
      onMeasurementsChange({
        width: parseFloat(width),
        height: parseFloat(height),
        unit: 'cm'
      })
    }
  }
  const product = productType ? getProductById(productType) : null
  const disabled = !productType
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="width">Width (cm)</Label>
        <Input
          id="width"
          type="number"
          placeholder="e.g., 240"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="mt-1"
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          placeholder="e.g., 180"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="mt-1"
          disabled={disabled}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full"
        disabled={!disabled || !width || !height}
      >
        Calculate Price
      </Button>
    </form>
  )
}