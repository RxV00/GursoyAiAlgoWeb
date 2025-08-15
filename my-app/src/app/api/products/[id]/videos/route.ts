import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = new DatabaseService()
    const videos = await db.getProductVideos(params.id)
    
    return NextResponse.json({
      success: true,
      data: videos
    })
  } catch (error) {
    console.error('API Error - product videos:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product videos' },
      { status: 500 }
    )
  }
}