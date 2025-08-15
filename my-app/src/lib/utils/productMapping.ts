import type { ProductWithDetails } from '@/lib/types/database'
import { getProductById, type ProductType } from '@/lib/product-data'

/**
 * Maps database product to legacy product-data format for pricing
 * This is a temporary solution until pricing is moved to database
 */
export function mapDatabaseProductToLegacy(dbProduct: ProductWithDetails): ProductType | null {
  // Mapping logic based on product names and manufacturers
  const productName = dbProduct.name.toLowerCase()
  const manufacturerName = dbProduct.manufacturer.name.toLowerCase()
  
  // Create mapping keys
  const mappings: Record<string, string> = {
    // Cortizo products
    'corvision_cortizo': 'cortizo-copision',
    'corvisionplus_cortizo': 'cortizo-copision-plus', 
    'hebeschiebe_cortizo': 'cortizo-hebeschiebe',
    'cor70_cortizo': 'cortizo-klasik-standart',
    'bi-fold katlanir kapi sistemi_cortizo': 'cortizo-katlanir-standart',
    
    // Asisim products
    'hebeschiebe(asisim)_asisim': 'asisim-hebeschiebe',
    'hebeschiebe_asisim': 'asisim-hebeschiebe',
    
    // Additional mappings as needed...
  }
  
  // Create lookup key
  const lookupKey = `${productName}_${manufacturerName}`
  const legacyId = mappings[lookupKey]
  
  if (legacyId) {
    return getProductById(legacyId)
  }
  
  // Fallback: try to find by name pattern matching
  if (productName.includes('corvision') && manufacturerName.includes('cortizo')) {
    if (productName.includes('plus')) {
      return getProductById('cortizo-copision-plus')
    }
    return getProductById('cortizo-copision')
  }
  
  if (productName.includes('hebeschiebe')) {
    if (manufacturerName.includes('cortizo')) {
      return getProductById('cortizo-hebeschiebe')
    }
    if (manufacturerName.includes('asisim')) {
      return getProductById('asisim-hebeschiebe')
    }
  }
  
  if (productName.includes('cor70') && manufacturerName.includes('cortizo')) {
    return getProductById('cortizo-klasik-standart')
  }
  
  return null
}

/**
 * Gets measurement fields for a database product
 * Currently returns default fields, will be database-driven in the future
 */
export function getDatabaseProductMeasurementFields(_dbProduct: ProductWithDetails): string[] {
  // For now, all products use width and height
  // This will be replaced with database-driven measurement fields in the future
  return ['width', 'height']
}

/**
 * Gets the base price for a database product using legacy mapping
 * Temporary solution until pricing is in database
 */
export function getDatabaseProductBasePrice(dbProduct: ProductWithDetails): number {
  const legacyProduct = mapDatabaseProductToLegacy(dbProduct)
  
  if (legacyProduct) {
    return legacyProduct.basePrice
  }
  
  // Fallback pricing based on manufacturer
  const manufacturerName = dbProduct.manufacturer.name.toLowerCase()
  
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

/**
 * Helper to check if a product has video content
 */
export function hasProductVideos(dbProduct: ProductWithDetails): boolean {
  return !!(dbProduct.videos && dbProduct.videos.length > 0)
}

/**
 * Gets the primary video for a product
 */
export function getPrimaryProductVideo(dbProduct: ProductWithDetails) {
  if (!dbProduct.videos || dbProduct.videos.length === 0) {
    return null
  }
  
  // Return the most recently uploaded video as primary
  return dbProduct.videos[0]
}

/**
 * Formats product display name with manufacturer
 */
export function formatProductDisplayName(dbProduct: ProductWithDetails): string {
  return `${dbProduct.name} (${dbProduct.manufacturer.name})`
}

/**
 * Gets category path for breadcrumbs
 */
export function getCategoryPath(category: ProductWithDetails['category']): string {
  // This would be enhanced with parent category traversal
  // For now, just return the category name
  return category.name
}