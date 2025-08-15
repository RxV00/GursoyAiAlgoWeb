import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = new DatabaseService()
    const manufacturer = await db.getManufacturerById(params.id)
    
    if (!manufacturer) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: manufacturer
    })
  } catch (error) {
    console.error('API Error - manufacturer by id:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch manufacturer' },
      { status: 500 }
    )
  }
}