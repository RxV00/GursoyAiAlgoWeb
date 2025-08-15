import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }

    if (query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const db = new DatabaseService()
    const products = await db.searchProducts(query.trim(), limit)
    
    return NextResponse.json({
      success: true,
      data: {
        query: query.trim(),
        results: products,
        count: products.length
      }
    })
  } catch (error) {
    console.error('API Error - search:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    )
  }
}