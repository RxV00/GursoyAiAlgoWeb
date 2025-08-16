import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const db = new DatabaseService()
    const measurement = await db.getUserMeasurementById(user.id, params.id)

    if (!measurement) {
      return NextResponse.json(
        { success: false, error: 'Measurement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: measurement
    })
  } catch (error) {
    console.error('API Error - user measurement by id:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch measurement' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { measurements, quantity } = await request.json()

    if (!measurements || typeof measurements !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Measurements are required and must be an object' },
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

    if (quantity !== undefined && (typeof quantity !== 'number' || quantity <= 0)) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity' },
        { status: 400 }
      )
    }

    const db = new DatabaseService()
    const updatedMeasurement = await db.updateUserMeasurement(
      user.id,
      params.id,
      measurements,
      quantity
    )

    return NextResponse.json({
      success: true,
      data: updatedMeasurement
    })
  } catch (error) {
    console.error('API Error - update measurement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update measurement' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const db = new DatabaseService()
    await db.deleteUserMeasurement(user.id, params.id)

    return NextResponse.json({
      success: true,
      message: 'Measurement deleted successfully'
    })
  } catch (error) {
    console.error('API Error - delete measurement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete measurement' },
      { status: 500 }
    )
  }
}