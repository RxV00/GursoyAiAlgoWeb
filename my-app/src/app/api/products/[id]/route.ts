import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const includeDetails = searchParams.get('includeDetails') !== 'false' // default true

    const db = new DatabaseService()
    
    if (includeDetails) {
      const product = await db.getProductWithDetails(resolvedParams.id)
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: product
      })
    } else {
      const product = await db.getProductById(resolvedParams.id)
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: product
      })
    }
  } catch (error) {
    console.error('API Error - product by id:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}