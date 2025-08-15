import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDetails = searchParams.get('includeDetails') === 'true'
    const categoryId = searchParams.get('categoryId') || undefined
    const manufacturerId = searchParams.get('manufacturerId') || undefined
    const searchTerm = searchParams.get('search') || undefined
    const hasVideos = searchParams.get('hasVideos') === 'true' ? true : 
                     searchParams.get('hasVideos') === 'false' ? false : undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const orderBy = searchParams.get('orderBy') || undefined
    const orderDirection = (searchParams.get('orderDirection') as 'asc' | 'desc') || 'asc'

    const db = new DatabaseService()
    
    if (includeDetails) {
      const products = await db.getProductsWithDetails({
        categoryIds: categoryId ? [categoryId] : undefined,
        manufacturerIds: manufacturerId ? [manufacturerId] : undefined,
        searchTerm,
        hasVideos,
      })
      return NextResponse.json({
        success: true,
        data: products
      })
    } else {
      const products = await db.getProducts({
        categoryId,
        manufacturerId,
        limit,
        orderBy,
        orderDirection,
      })
      return NextResponse.json({
        success: true,
        data: products
      })
    }
  } catch (error) {
    console.error('API Error - products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}