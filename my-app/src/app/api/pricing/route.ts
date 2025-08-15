import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculatePrice } from '@/lib/pricing'
import { DatabaseService } from '@/lib/services/database'
import { mapDatabaseProductToLegacy } from '@/lib/utils/productMapping'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { productId, measurements, quantity = 1 } = await request.json()
    
    if (!productId || !measurements) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Try to get product from database first
    const db = new DatabaseService()
    const dbProduct = await db.getProductWithDetails(productId)
    
    let price = 0
    
    if (dbProduct) {
      // Use database product with legacy pricing mapping
      const legacyProduct = mapDatabaseProductToLegacy(dbProduct)
      if (legacyProduct) {
        price = calculatePrice(legacyProduct.id, measurements)
      } else {
        // Fallback calculation for unmapped products
        const basePrice = 250 // Default base price
        const area = (measurements.width * measurements.height) / 10000 // Convert cm² to m²
        price = basePrice * area
      }
    } else {
      // Fallback to legacy product-data system
      price = calculatePrice(productId, measurements)
    }

    // Apply quantity multiplier
    const totalPrice = price * quantity
    
    return NextResponse.json({ 
      success: true,
      price: totalPrice,
      pricePerUnit: price,
      quantity,
      productId,
      measurements
    })
  } catch (error) {
    console.error('Pricing calculation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate price' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    message: 'Pricing API accessible',
    user: user.email
  })
}