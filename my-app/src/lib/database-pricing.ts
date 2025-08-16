import { DatabaseService } from '@/lib/services/database'
import type { ProductWithDetails } from '@/lib/types/database'

export interface Measurements {
  [key: string]: number | string
}

export interface PricingResult {
  price: number
  pricePerUnit: number
  area?: number
  product: ProductWithDetails
}

/**
 * Calculate price using database-only data
 * No fallback to legacy product-data.ts
 */
export async function calculatePriceFromDatabase(
  productId: string, 
  measurements: Measurements,
  quantity: number = 1
): Promise<PricingResult | null> {
  const db = new DatabaseService()
  
  // Get product with details from database
  const product = await db.getProductWithDetails(productId)
  if (!product) {
    return null
  }

  // Calculate base price from database
  const basePrice = getProductBasePrice(product)
  
  // Calculate area if width and height are provided
  let area: number | undefined
  let pricePerUnit: number

  if ('width' in measurements && 'height' in measurements) {
    // Convert cm² to m² for area-based pricing
    area = ((measurements.width as number) * (measurements.height as number)) / 10000
    pricePerUnit = basePrice * area
  } else {
    // Flat rate pricing
    pricePerUnit = basePrice
  }

  const totalPrice = pricePerUnit * quantity

  return {
    price: totalPrice,
    pricePerUnit,
    area,
    product
  }
}

/**
 * Get base price from product data
 * Uses database base_price field with fallbacks based on manufacturer
 */
function getProductBasePrice(product: ProductWithDetails): number {
  // If we have a base_price from database, use it
  if (product.base_price && product.base_price > 0) {
    return product.base_price
  }

  // Fallback pricing based on manufacturer
  const manufacturerName = product.manufacturer.name.toLowerCase()
  
  if (manufacturerName.includes('cortizo')) {
    return 300 // Cortizo base price
  }
  
  if (manufacturerName.includes('asisim')) {
    return 280 // Asisim base price  
  }
  
  if (manufacturerName.includes('rehau')) {
    return 200 // Rehau base price
  }
  
  return 250 // Default fallback price
}


// Note: Client-side utility functions have been moved to @/lib/product-utils
// to avoid server/client boundary issues