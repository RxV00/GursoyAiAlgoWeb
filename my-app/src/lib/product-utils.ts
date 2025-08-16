import type { ProductWithDetails } from '@/lib/types/database'

export interface Measurements {
  [key: string]: number | string
}

/**
 * Get measurement fields for a product (client-side safe)
 * Currently returns default fields, will be enhanced when stored in database
 */
export function getProductMeasurementFields(product: ProductWithDetails): string[] {
  // If measurement_fields are stored in database, use them
  if (product.measurement_fields && Array.isArray(product.measurement_fields)) {
    return product.measurement_fields
  }
  
  // Default to width and height for all products
  return ['width', 'height']
}

/**
 * Format product display name with manufacturer (client-side safe)
 */
export function formatProductDisplayName(product: ProductWithDetails): string {
  return `${product.name} (${product.manufacturer.name})`
}

/**
 * Check if product has video content (client-side safe)
 */
export function hasProductVideos(product: ProductWithDetails): boolean {
  return !!(product.videos && product.videos.length > 0)
}

/**
 * Get primary video for a product (client-side safe)
 */
export function getPrimaryProductVideo(product: ProductWithDetails) {
  if (!product.videos || product.videos.length === 0) {
    return null
  }
  
  // Return the most recently uploaded video as primary
  return product.videos[0]
}

/**
 * Get category path for breadcrumbs (client-side safe)
 */
export function getCategoryPath(category: ProductWithDetails['category']): string {
  // This would be enhanced with parent category traversal
  // For now, just return the category name
  return category.name
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = '€'): string {
  return `${currency}${price.toFixed(2)}`
}

/**
 * Calculate area from width and height
 */
export function calculateArea(width: number, height: number, unit: string = 'cm'): number {
  if (unit === 'cm') {
    // Convert cm² to m²
    return (width * height) / 10000
  }
  // Assume meters if not cm
  return width * height
}