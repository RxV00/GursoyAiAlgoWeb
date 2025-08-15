import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const orderBy = searchParams.get('orderBy') || undefined
    const orderDirection = (searchParams.get('orderDirection') as 'asc' | 'desc') || 'asc'

    const db = new DatabaseService()
    const manufacturers = await db.getManufacturers({
      limit,
      orderBy,
      orderDirection,
    })
    
    return NextResponse.json({
      success: true,
      data: manufacturers
    })
  } catch (error) {
    console.error('API Error - manufacturers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch manufacturers' },
      { status: 500 }
    )
  }
}