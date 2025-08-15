import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(request: NextRequest) {
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
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { product_id, measurements, quantity = 1 } = await request.json()

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

    const db = new DatabaseService()
    const savedMeasurement = await db.saveUserMeasurement(
      user.id,
      product_id,
      measurements,
      quantity
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