import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const db = new DatabaseService()
    const video = await db.getVideoById(resolvedParams.id)
    
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: video
    })
  } catch (error) {
    console.error('API Error - video by id:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}