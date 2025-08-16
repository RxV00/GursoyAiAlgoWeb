import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

// Public endpoint - no auth required for basic category listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hierarchy = searchParams.get('hierarchy') === 'true'
    const parentId = searchParams.get('parentId') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const orderBy = searchParams.get('orderBy') || undefined
    const orderDirection = (searchParams.get('orderDirection') as 'asc' | 'desc') || 'asc'

    const db = new DatabaseService()
    
    if (hierarchy) {
      const categories = await db.getCategoryHierarchy()
      return NextResponse.json({
        success: true,
        data: categories
      })
    } else {
      const categories = await db.getCategories({
        parentId,
        limit,
        orderBy,
        orderDirection,
      })
      return NextResponse.json({
        success: true,
        data: categories
      })
    }
  } catch (error) {
    console.error('API Error - categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}