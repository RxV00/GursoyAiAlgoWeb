'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { getProductById } from '@/lib/product-data'

interface MeasurementFormProps {
  onMeasurementsChange: (measurements: Record<string, number | string>) => void
  productType: string | null
}

export function MeasurementForm({ onMeasurementsChange, productType }: MeasurementFormProps) {
  const [values, setValues] = useState<Record<string, string>>({})

  const product = productType ? getProductById(productType) : null
  const fields = product?.measurementFields || []
  const disabled = !productType
  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ready = fields.every((f) => values[f])
    if (ready) {
      const measurements: Record<string, number | string> = {}
      fields.forEach((f) => {
        measurements[f] = parseFloat(values[f])
      })
      measurements['unit'] = 'cm'
      onMeasurementsChange(measurements)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
        <div key={field}>
          <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)} (cm)</Label>
          <Input
            id={field}
            type="number"
            placeholder="0"
            value={values[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            className="mt-1"
            disabled={disabled}
          />
        </div>
      ))}
      <Button type="submit" className="w-full" disabled={disabled || fields.some((f) => !values[f])}>
        Calculate Price
      </Button>
    </form>
  )
}