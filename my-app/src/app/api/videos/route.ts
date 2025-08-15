import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'

export async function GET() {
  try {
    const db = new DatabaseService()
    const videos = await db.getAllProductVideos()
    
    return NextResponse.json({
      success: true,
      data: videos
    })
  } catch (error) {
    console.error('API Error - all videos:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}