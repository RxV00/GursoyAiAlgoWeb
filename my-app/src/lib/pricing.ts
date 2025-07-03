import { getProductById } from '@/lib/product-data'

export interface Measurements {
  width: number
  height: number
  unit: string
}

export function calculatePrice(productId: string, measurements: Measurements): number | null {
  const product = getProductById(productId)
  if (!product) return null
  const area = (measurements.width * measurements.height) / 10000 // cm^2 -> m^2
  return area * product.basePrice
}