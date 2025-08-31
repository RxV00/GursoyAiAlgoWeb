import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const { searchParams } = new URL(request.url)
    const includeDetails = searchParams.get('includeDetails') === 'true'

    const db = new DatabaseService()
    
    if (includeDetails) {
      const products = await db.getProductsWithDetails({
        categoryIds: [resolvedParams.id]
      })
      return NextResponse.json({
        success: true,
        data: products
      })
    } else {
      const products = await db.getProductsByCategory(resolvedParams.id)
      return NextResponse.json({
        success: true,
        data: products
      })
    }
  } catch (error) {
    console.error('API Error - products by category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products for category' },
      { status: 500 }
    )
  }
}