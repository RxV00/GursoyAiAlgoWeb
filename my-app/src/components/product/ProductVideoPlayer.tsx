'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DatabaseProductVideo } from '@/lib/types/database'
import { env } from '@/lib/env'

interface ProductVideoPlayerProps {
  video: DatabaseProductVideo
  autoPlay?: boolean
  controls?: boolean
  className?: string
  onLoadError?: (error: Error) => void
  onVideoEnd?: () => void
  poster?: string
  muted?: boolean
}

interface VideoState {
  isPlaying: boolean
  isMuted: boolean
  isFullscreen: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  hasError: boolean
}

export function ProductVideoPlayer({ 
  video, 
  autoPlay = false, 
  controls = true,
  className = '',
  onLoadError,
  onVideoEnd,
  poster,
  muted = false
}: ProductVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: autoPlay,
    isMuted: muted,
    isFullscreen: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: true,
    hasError: false
  })

  // Update video element properties when state changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = videoState.isMuted
    video.volume = videoState.volume
    
    if (videoState.isPlaying) {
      video.play().catch(() => {
        setVideoState(prev => ({ ...prev, isPlaying: false }))
      })
    } else {
      video.pause()
    }
  }, [videoState.isPlaying, videoState.isMuted, videoState.volume])

  const togglePlayPause = (): void => {
    setVideoState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const toggleMute = (): void => {
    setVideoState(prev => ({ ...prev, isMuted: !prev.isMuted }))
  }

  const toggleFullscreen = async (): Promise<void> => {
    if (!videoRef.current) return

    try {
      if (!videoState.isFullscreen) {
        await videoRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.warn('Fullscreen not supported or failed:', error)
    }
  }

  const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement>): void => {
    const videoElement = event.currentTarget
    const error = new Error(`Video load error: ${videoElement.error?.message || 'Unknown error'}`)
    
    setVideoState(prev => ({ 
      ...prev, 
      hasError: true, 
      isLoading: false,
      isPlaying: false 
    }))
    
    onLoadError?.(error)
  }

  const handleVideoLoad = (): void => {
    const video = videoRef.current
    if (!video) return

    setVideoState(prev => ({
      ...prev,
      duration: video.duration,
      isLoading: false,
      hasError: false
    }))
  }

  const handleTimeUpdate = (): void => {
    const video = videoRef.current
    if (!video) return

    setVideoState(prev => ({
      ...prev,
      currentTime: video.currentTime
    }))
  }

  const handleVideoEnd = (): void => {
    setVideoState(prev => ({ ...prev, isPlaying: false }))
    onVideoEnd?.()
  }

  const handleFullscreenChange = (): void => {
    setVideoState(prev => ({
      ...prev,
      isFullscreen: document.fullscreenElement === videoRef.current
    }))
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const resolveVideoSrc = (filePath: string): string => {
    if (!filePath) return ''
    // Already absolute URL
    if (/^https?:\/\//i.test(filePath)) return filePath
    // Starts with storage public path
    if (filePath.startsWith('/storage/v1/object/public') || filePath.startsWith('storage/v1/object/public')) {
      const trimmed = filePath.replace(/^\//, '')
      return `${env.NEXT_PUBLIC_SUPABASE_URL}/${trimmed}`
    }
    // Treat as bucket/key or relative path inside public storage
    const trimmed = filePath.replace(/^\//, '')
    return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${trimmed}`
  }

  if (videoState.hasError) {
    return (
      <div className={`relative bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-500 mb-2">Failed to load video</div>
          <div className="text-sm text-gray-400">{video.title}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative group rounded-lg overflow-hidden bg-black aspect-video ${className}`}>
      <video
        ref={videoRef}
        src={resolveVideoSrc(video.file_path)}
        poster={poster}
        className="w-full h-full object-contain"
        onError={handleVideoError}
        onLoadedMetadata={handleVideoLoad}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        playsInline
        preload="metadata"
      />
      
      {videoState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">Loading...</div>
        </div>
      )}

      {controls && !videoState.isLoading && (
        <>
          {/* Main play/pause overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="lg"
              onClick={togglePlayPause}
              className="bg-black/60 hover:bg-black/80 text-white border-0"
            >
              {videoState.isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </Button>
          </div>

          {/* Control bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {videoState.isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {videoState.isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>

                {videoState.duration > 0 && (
                  <span className="text-white text-sm">
                    {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {videoState.isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            {videoState.duration > 0 && (
              <div className="w-full bg-white/30 rounded-full h-1 mt-2">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${(videoState.currentTime / videoState.duration) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Video title */}
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {video.title}
          </div>
        </>
      )}
    </div>
  )
}