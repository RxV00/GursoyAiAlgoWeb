import { getProductById } from '@/lib/product-data'

export interface Measurements {
    [key: string]: number | string
}

export function calculatePrice(productId: string, measurements: Measurements): number | null {
  const product = getProductById(productId)
  if (!product) {
    return null
  }
  
  if ('width' in measurements && 'height' in measurements) {
    const area = ((measurements.width as number) * (measurements.height as number)) / 10000
    return area * product.basePrice
  }
  return product.basePrice
}
