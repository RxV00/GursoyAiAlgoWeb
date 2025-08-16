import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculatePriceFromDatabase } from '@/lib/database-pricing'

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

    // Calculate price using database-only approach
    const pricingResult = await calculatePriceFromDatabase(productId, measurements, quantity)
    
    if (!pricingResult) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      price: pricingResult.price,
      pricePerUnit: pricingResult.pricePerUnit,
      quantity,
      productId: pricingResult.product.id,
      measurements,
      area: pricingResult.area
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