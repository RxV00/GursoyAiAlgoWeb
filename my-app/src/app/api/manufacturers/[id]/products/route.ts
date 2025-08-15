import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = new DatabaseService()
    const products = await db.getProductsByManufacturer(params.id)
    
    return NextResponse.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('API Error - products by manufacturer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products for manufacturer' },
      { status: 500 }
    )
  }
}