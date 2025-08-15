'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { getDatabaseProductMeasurementFields, getDatabaseProductBasePrice } from '@/lib/utils/productMapping'
import type { ProductWithDetails } from '@/lib/types/database'

interface MeasurementFormProps {
  product: ProductWithDetails
  isAuthenticated: boolean
  onCalculate: (price: number, measurementData: any) => void
}

export function MeasurementForm({ product, isAuthenticated, onCalculate }: MeasurementFormProps) {
  const [values, setValues] = useState<Record<string, string>>({
    width: '',
    height: '',
    quantity: '1'
  })

  const fields = getDatabaseProductMeasurementFields(product)
  const disabled = !product
  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    
    const ready = fields.every((f) => values[f])
    if (ready) {
      const measurementData = {
        width: parseFloat(values.width),
        height: parseFloat(values.height),
        quantity: parseInt(values.quantity) || 1,
        unit: 'cm'
      }
      
      // Calculate price using database product
      const basePrice = getDatabaseProductBasePrice(product)
      const area = measurementData.width * measurementData.height / 10000 // convert cm² to m²
      const totalPrice = basePrice * area * measurementData.quantity
      
      onCalculate(totalPrice, measurementData)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="width">Width (cm)</Label>
        <Input
          id="width"
          type="number"
          placeholder="Enter width in cm"
          value={values.width}
          onChange={(e) => handleChange('width', e.target.value)}
          className="mt-1"
          disabled={disabled}
          min="1"
          step="0.1"
        />
      </div>
      
      <div>
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          placeholder="Enter height in cm"
          value={values.height}
          onChange={(e) => handleChange('height', e.target.value)}
          className="mt-1"
          disabled={disabled}
          min="1"
          step="0.1"
        />
      </div>
      
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          placeholder="1"
          value={values.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          className="mt-1"
          disabled={disabled}
          min="1"
          step="1"
        />
      </div>
      
      <Button 
        type="submit" 
        className={`w-full ${isAuthenticated ? 'bg-[#7a8fa5] hover:bg-[#5a6f85]' : 'bg-amber-600 hover:bg-amber-700'}`}
        disabled={disabled || !values.width || !values.height}
      >
        {isAuthenticated ? 'Calculate Price' : 'Sign In to Calculate Price'}
      </Button>
      
      {product && (
        <div className="text-sm text-slate-600 mt-2">
          Product: {product.name} ({product.manufacturer.name})
        </div>
      )}
    </form>
  )
}