'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DatabaseProductVideo } from '@/lib/types/database'
import { env } from '@/lib/env'

// Cross-browser fullscreen interfaces
interface VideoElementWithFullscreen extends HTMLVideoElement {
  webkitRequestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

interface DocumentWithFullscreen extends Document {
  webkitFullscreenElement?: Element
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitExitFullscreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
  webkitFullscreenEnabled?: boolean
  mozFullScreenEnabled?: boolean
  msFullscreenEnabled?: boolean
}

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
  const progressRef = useRef<HTMLInputElement>(null)
  const rafRef = useRef<number>(0)
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
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [scrubValue, setScrubValue] = useState<number | null>(null)

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

  // Smooth progress updates using RAF
  const updateProgress = useCallback(() => {
    const video = videoRef.current
    if (!video || isScrubbing || video.seeking) {
      rafRef.current = 0
      return
    }

    setVideoState(prev => ({
      ...prev,
      currentTime: video.currentTime
    }))

    if (!video.paused) {
      rafRef.current = requestAnimationFrame(updateProgress)
    }
  }, [isScrubbing])

  // Start/stop RAF updates based on play state
  useEffect(() => {
    const video = videoRef.current
    if (video && !video.paused && !isScrubbing) {
      rafRef.current = requestAnimationFrame(updateProgress)
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }
  }, [videoState.isPlaying, isScrubbing, updateProgress])

  const togglePlayPause = (): void => {
    setVideoState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const toggleMute = (): void => {
    setVideoState(prev => ({ ...prev, isMuted: !prev.isMuted }))
  }

  // Progress bar scrubbing handlers
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!videoState.duration) return
    const newTime = Math.max(0, Math.min(videoState.duration, parseFloat(e.target.value)))
    setScrubValue(newTime)
  }

  const handleProgressMouseDown = (): void => {
    setIsScrubbing(true)
    setScrubValue(videoState.currentTime)
  }

  const handleProgressMouseUp = (): void => {
    const video = videoRef.current
    if (!video || !videoState.duration || scrubValue === null) return

    const clampedTime = Math.max(0, Math.min(videoState.duration, scrubValue))
    video.currentTime = clampedTime
    setVideoState(prev => ({ ...prev, currentTime: clampedTime }))
    setIsScrubbing(false)
    setScrubValue(null)
  }

  // Keyboard controls for fullscreen progress
  const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const video = videoRef.current
    if (!video || !videoState.duration) return

    let newTime = videoState.currentTime

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        newTime = Math.max(0, videoState.currentTime - (e.shiftKey ? 10 : 5))
        break
      case 'ArrowRight':
        e.preventDefault()
        newTime = Math.min(videoState.duration, videoState.currentTime + (e.shiftKey ? 10 : 5))
        break
      case 'Home':
        e.preventDefault()
        newTime = 0
        break
      case 'End':
        e.preventDefault()
        newTime = videoState.duration
        break
      case ' ':
      case 'Spacebar':
        e.preventDefault()
        togglePlayPause()
        return
      default:
        return
    }

    const clampedTime = Math.max(0, Math.min(videoState.duration, newTime))
    video.currentTime = clampedTime
    setVideoState(prev => ({ ...prev, currentTime: clampedTime }))
  }

  const toggleFullscreen = useCallback(async (): Promise<void> => {
    if (!videoRef.current) return

    try {
      if (!videoState.isFullscreen) {
        // Cross-browser fullscreen support
        const video = videoRef.current as VideoElementWithFullscreen
        if (video.requestFullscreen) {
          await video.requestFullscreen()
        } else if (video.webkitRequestFullscreen) {
          await video.webkitRequestFullscreen()
        } else if (video.msRequestFullscreen) {
          await video.msRequestFullscreen()
        } else if (video.mozRequestFullScreen) {
          await video.mozRequestFullScreen()
        } else {
          console.warn('Fullscreen not supported on this browser')
          return
        }
      } else {
        // Cross-browser exit fullscreen
        const doc = document as DocumentWithFullscreen
        if (doc.exitFullscreen) {
          await doc.exitFullscreen()
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen()
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen()
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen()
        }
      }
    } catch (error) {
      console.warn('Fullscreen operation failed:', error)
    }
  }, [videoState.isFullscreen])

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

    const duration = isNaN(video.duration) || !isFinite(video.duration) ? 0 : video.duration
    setVideoState(prev => ({
      ...prev,
      duration,
      currentTime: video.currentTime || 0,
      isLoading: false,
      hasError: false
    }))
  }

  const handleDurationChange = (): void => {
    const video = videoRef.current
    if (!video) return

    const duration = isNaN(video.duration) || !isFinite(video.duration) ? 0 : video.duration
    setVideoState(prev => ({
      ...prev,
      duration
    }))
  }

  const handleTimeUpdate = (): void => {
    const video = videoRef.current
    if (!video || isScrubbing) return

    setVideoState(prev => ({
      ...prev,
      currentTime: video.currentTime
    }))
  }

  const handleVideoEnd = (): void => {
    setVideoState(prev => ({ ...prev, isPlaying: false }))
    onVideoEnd?.()
  }

  const handleFullscreenChange = useCallback((): void => {
    const doc = document as DocumentWithFullscreen
    const fullscreenElement = doc.fullscreenElement || 
                             doc.webkitFullscreenElement || 
                             doc.msFullscreenElement || 
                             doc.mozFullScreenElement
    
    setVideoState(prev => ({
      ...prev,
      isFullscreen: fullscreenElement === videoRef.current
    }))
  }, [])

  // Check if fullscreen is supported
  const isFullscreenSupported = (): boolean => {
    const doc = document as DocumentWithFullscreen
    return !!(doc.fullscreenEnabled || 
              doc.webkitFullscreenEnabled || 
              doc.msFullscreenEnabled || 
              doc.mozFullScreenEnabled)
  }

  // Handle keyboard shortcuts for fullscreen
  const handleKeyDown = useCallback((event: KeyboardEvent): void => {
    if (event.key === 'f' || event.key === 'F') {
      // Only trigger if video player is focused or hovered
      const videoContainer = videoRef.current?.parentElement
      if (videoContainer && (videoContainer.matches(':hover') || videoContainer.contains(document.activeElement))) {
        event.preventDefault()
        toggleFullscreen()
      }
    }
  }, [toggleFullscreen])

  useEffect(() => {
    // Add cross-browser fullscreen change event listeners
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange', 
      'msfullscreenchange',
      'mozfullscreenchange'
    ]
    
    events.forEach(event => {
      document.addEventListener(event, handleFullscreenChange)
    })

    // Add keyboard shortcut listener
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange)
      })
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleFullscreenChange, handleKeyDown])

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '--:--'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
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
    <div className={`relative group rounded-lg overflow-hidden bg-black aspect-video ${className}`} 
         role="region" 
         aria-label="Video player"
    >
      <video
        ref={videoRef}
        src={resolveVideoSrc(video.file_path)}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onError={handleVideoError}
        onLoadedMetadata={handleVideoLoad}
        onDurationChange={handleDurationChange}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onDoubleClick={isFullscreenSupported() ? toggleFullscreen : undefined}
        playsInline
        preload="metadata"
        tabIndex={0}
        aria-label={`Product video: ${video.title}. Double-click to toggle fullscreen, press F for fullscreen`}
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40">
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
                {isFullscreenSupported() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleFullscreen()
                      }
                    }}
                    aria-label={videoState.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    className="text-white hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none transition-all duration-200"
                    title={videoState.isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
                  >
                    {videoState.isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </Button>
                )}
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

          {/* Fullscreen-only compact progress bar */}
          {videoState.isFullscreen && videoState.duration > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-12 sm:h-14 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
              <div className="flex items-center gap-2 sm:gap-3 h-full pointer-events-auto">
                {/* Current time */}
                <span className="text-white text-xs sm:text-sm font-mono tabular-nums min-w-[3rem] text-center">
                  {formatTime(isScrubbing && scrubValue !== null ? scrubValue : videoState.currentTime)}
                </span>
                
                {/* Progress scrubber */}
                <div className="flex-1 relative">
                  <input
                    ref={progressRef}
                    type="range"
                    min="0"
                    max={videoState.duration || 0}
                    value={isScrubbing && scrubValue !== null ? scrubValue : videoState.currentTime}
                    step="0.1"
                    onChange={handleProgressChange}
                    onMouseDown={handleProgressMouseDown}
                    onMouseUp={handleProgressMouseUp}
                    onTouchStart={handleProgressMouseDown}
                    onTouchEnd={handleProgressMouseUp}
                    onKeyDown={handleProgressKeyDown}
                    aria-label="Video progress"
                    className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                               [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-blue-400
                               [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full 
                               [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0
                               [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-all
                               [&::-moz-range-track]:bg-white/30 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-1"
                  />
                  
                  {/* Buffered indicator */}
                  {(() => {
                    try {
                      const video = videoRef.current
                      if (video?.buffered && video.buffered.length > 0 && videoState.duration > 0) {
                        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
                        const bufferedPercent = Math.min(100, (bufferedEnd / videoState.duration) * 100)
                        return (
                          <div className="absolute top-0 left-0 h-1 bg-white/50 rounded-full pointer-events-none"
                               style={{ width: `${bufferedPercent}%` }} 
                          />
                        )
                      }
                    } catch {
                      // Ignore buffered indicator errors
                    }
                    return null
                  })()}
                </div>
                
                {/* Total duration */}
                <span className="text-white text-xs sm:text-sm font-mono tabular-nums min-w-[3rem] text-center">
                  {formatTime(videoState.duration)}
                </span>
              </div>
            </div>
          )}

          {/* Video title and hints */}
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div>{video.title}</div>
            {isFullscreenSupported() && (
              <div className="text-xs opacity-75 mt-1">
                Double-click or press F for fullscreen
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}