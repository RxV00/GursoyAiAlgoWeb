import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDetails = searchParams.get('includeDetails') !== 'false' // default true

    const db = new DatabaseService()
    
    if (includeDetails) {
      const product = await db.getProductWithDetails(params.id)
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
      const product = await db.getProductById(params.id)
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