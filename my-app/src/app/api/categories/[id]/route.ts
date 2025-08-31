import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'

    const db = new DatabaseService()
    
    if (includeProducts) {
      const categoryWithProducts = await db.getCategoryWithProducts(resolvedParams.id)
      if (!categoryWithProducts) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: categoryWithProducts
      })
    } else {
      const category = await db.getCategoryById(resolvedParams.id)
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: category
      })
    }
  } catch (error) {
    console.error('API Error - category by id:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}