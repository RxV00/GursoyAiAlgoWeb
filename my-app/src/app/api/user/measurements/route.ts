import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(request: NextRequest) {
  // Prevent direct browser access - only allow programmatic requests
  const userAgent = request.headers.get('user-agent') || ''
  const accept = request.headers.get('accept') || ''
  
  // Block direct browser navigation (when user types URL in address bar)
  if (userAgent.includes('Mozilla') && accept.includes('text/html')) {
    return NextResponse.json(
      { success: false, error: 'Direct access not allowed' },
      { status: 403 }
    )
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId') || undefined
    const dateFrom = searchParams.get('dateFrom') || undefined
    const dateTo = searchParams.get('dateTo') || undefined

    const db = new DatabaseService()
    const measurements = await db.getUserMeasurements(user.id, {
      productId,
      dateFrom,
      dateTo,
    })

    return NextResponse.json({
      success: true,
      data: measurements
    })
  } catch (error) {
    console.error('API Error - user measurements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user measurements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Prevent direct browser access - only allow programmatic requests
  const userAgent = request.headers.get('user-agent') || ''
  const accept = request.headers.get('accept') || ''
  
  // Block direct browser navigation
  if (userAgent.includes('Mozilla') && accept.includes('text/html')) {
    return NextResponse.json(
      { success: false, error: 'Direct access not allowed' },
      { status: 403 }
    )
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { 
      product_id, 
      measurements, 
      quantity = 1, 
      calculated_price
    } = await request.json()

    if (!product_id || !measurements || typeof measurements !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid required fields' },
        { status: 400 }
      )
    }

    // Validate measurements are numbers
    for (const [key, value] of Object.entries(measurements)) {
      if (typeof value !== 'number' || value <= 0) {
        return NextResponse.json(
          { success: false, error: `Invalid measurement value for ${key}` },
          { status: 400 }
        )
      }
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity' },
        { status: 400 }
      )
    }

    // Validate price fields if provided
    if (calculated_price !== undefined && (typeof calculated_price !== 'number' || calculated_price < 0)) {
      return NextResponse.json(
        { success: false, error: 'Invalid calculated price' },
        { status: 400 }
      )
    }

    // price_per_unit removed

    const db = new DatabaseService()
    const savedMeasurement = await db.saveUserMeasurement(
      user.id,
      product_id,
      measurements,
      quantity,
      calculated_price
    )

    return NextResponse.json({
      success: true,
      data: savedMeasurement
    }, { status: 201 })
  } catch (error) {
    console.error('API Error - save measurement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save measurement' },
      { status: 500 }
    )
  }
}