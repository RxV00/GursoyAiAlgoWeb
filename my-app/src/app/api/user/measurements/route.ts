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
    const dateFrom = searchParams.get('dateFrom') || searchParams.get('from') || undefined
    const dateTo = searchParams.get('dateTo') || searchParams.get('to') || undefined
    const q = searchParams.get('q') || ''
    // const status = searchParams.get('status') || 'all' // Reserved for future use
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Cap at 100

    const db = new DatabaseService()
    
    // Use existing method but we'll need to extend it for advanced filtering
    let measurements = await db.getUserMeasurements(user.id, {
      productId,
      dateFrom,
      dateTo,
    })

    // Apply search filter
    if (q.trim()) {
      const searchTerm = q.toLowerCase()
      measurements = measurements.filter(m => 
        m.product.name.toLowerCase().includes(searchTerm) ||
        m.product.manufacturer.name.toLowerCase().includes(searchTerm) ||
        m.product.category.name.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    const validSortFields = ['created_at', 'calculated_price', 'quantity', 'updated_at']
    const sortField = validSortFields.includes(sort) ? sort as keyof typeof measurements[0] : 'created_at'
    const isAscending = order === 'asc'
    
    measurements.sort((a, b) => {
      const aVal = a[sortField] as string | number | null
      const bVal = b[sortField] as string | number | null
      
      // Handle null values - put them at the end
      if (aVal === null && bVal === null) return 0
      if (aVal === null) return 1
      if (bVal === null) return -1
      
      if (aVal < bVal) return isAscending ? -1 : 1
      if (aVal > bVal) return isAscending ? 1 : -1
      return 0
    })

    // Get total count before pagination
    const total = measurements.length

    // Apply pagination
    const paginatedMeasurements = measurements.slice(offset, offset + limit)
    const hasMore = offset + limit < total

    return NextResponse.json({
      success: true,
      data: paginatedMeasurements,
      total,
      hasMore,
      offset,
      limit
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