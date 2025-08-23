// src/components/ui/VideoPlayer.tsx
'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useVideoState } from '@/hooks/useVideoState'
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval'
import type { VideoConfig } from '@/types/video'

interface VideoPlayerProps {
  config: VideoConfig
  className?: string
  onLoad?: () => void
  onError?: (error: string) => void
}

export function VideoPlayer({ config, className, onLoad, onError }: VideoPlayerProps) {
  const idleVideoRef = useRef<HTMLVideoElement>(null)
  const talkingVideoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const {
    currentVideo,
    shouldShowTalkingVideo,
    shouldShowIdleVideo,
  } = useVideoState({
    autoReturnToIdle: true,
    idleTimeout: 3000,
  })

  const backgroundRemoval = useBackgroundRemoval({
    type: config.backgroundType || 'black',
    enabled: config.removeBackground ?? true,
    autoDetect: true,
  })

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Function to configure a video
  const setupVideo = useCallback((
    videoElement: HTMLVideoElement,
    src: string,
    isActive: boolean
  ) => {
    if (!videoElement || !isClient) return

    try {
      // Configure basic properties
      videoElement.src = src
      videoElement.autoplay = config.autoPlay ?? true
      videoElement.loop = config.loop ?? true
      videoElement.muted = config.muted ?? true
      videoElement.controls = config.controls ?? false
      videoElement.playsInline = config.playsInline ?? true
      
      // Set poster if available
      if (config.poster && !isActive) {
        videoElement.poster = config.poster
      }

      // Apply styles to completely hide controls
      videoElement.style.outline = 'none'
      videoElement.style.border = 'none'
      
      // Remove control attributes
      videoElement.removeAttribute('controls')
      videoElement.setAttribute('disablePictureInPicture', 'true')
      videoElement.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback')

      // Apply background removal if enabled
      if (config.removeBackground) {
        backgroundRemoval.optimizeForPerformance(videoElement)
        backgroundRemoval.detectBackground(videoElement)
      }

      // Configure initial visibility
      videoElement.style.opacity = isActive ? '1' : '0'
      videoElement.style.zIndex = isActive ? '2' : '1'
      videoElement.style.transition = 'opacity 0.3s ease-in-out'

    } catch (error) {
      console.error('Error setting up video:', error)
      onError?.(error instanceof Error ? error.message : 'Error configurando video')
    }
  }, [config, backgroundRemoval, onError, isClient])

  // Function to handle video load
  const handleVideoLoad = useCallback((videoElement: HTMLVideoElement) => {
    setIsLoaded(true)
    onLoad?.()
    
    // Ensure autoplay
    if (config.autoPlay) {
      videoElement.play().catch((error) => {
        console.warn('Autoplay prevented:', error)
        // Autoplay may be blocked, this is normal
      })
    }
  }, [config.autoPlay, onLoad])

  // Function to handle video errors
  const handleVideoError = useCallback((error: Event, videoType: 'idle' | 'talking') => {
    const errorMessage = `Error cargando video ${videoType}`
    setLoadError(errorMessage)
    onError?.(errorMessage)
    console.error('Video error:', error)
  }, [onError])

  // Function to switch between videos
  const switchVideo = useCallback((showTalking: boolean) => {
    const idleVideo = idleVideoRef.current
    const talkingVideo = talkingVideoRef.current

    if (!idleVideo || !talkingVideo) return

    try {
      if (showTalking) {
        // Show talking video
        talkingVideo.style.opacity = '1'
        talkingVideo.style.zIndex = '3'
        idleVideo.style.opacity = '0'
        idleVideo.style.zIndex = '1'
        
        // Ensure talking video is playing
        if (talkingVideo.paused) {
          talkingVideo.play().catch(console.warn)
        }
      } else {
        // Show idle video
        idleVideo.style.opacity = '1'
        idleVideo.style.zIndex = '3'
        talkingVideo.style.opacity = '0'
        talkingVideo.style.zIndex = '1'
        
        // Ensure idle video is playing
        if (idleVideo.paused) {
          idleVideo.play().catch(console.warn)
        }
      }
    } catch (error) {
      console.error('Error switching videos:', error)
    }
  }, [])

  // Configure videos when references change
  useEffect(() => {
    if (!isClient) return

    const idleVideo = idleVideoRef.current

    if (idleVideo && config.idle) {
      setupVideo(idleVideo, config.idle, currentVideo === 'idle')
      
      const handleLoad = () => handleVideoLoad(idleVideo)
      const handleError = (e: Event) => handleVideoError(e, 'idle')
      
      idleVideo.addEventListener('loadeddata', handleLoad)
      idleVideo.addEventListener('error', handleError)
      
      return () => {
        idleVideo.removeEventListener('loadeddata', handleLoad)
        idleVideo.removeEventListener('error', handleError)
      }
    }
  }, [config.idle, currentVideo, setupVideo, handleVideoLoad, handleVideoError, isClient])

  useEffect(() => {
    if (!isClient) return

    const talkingVideo = talkingVideoRef.current

    if (talkingVideo && config.talking) {
      setupVideo(talkingVideo, config.talking, currentVideo === 'talking')
      
      const handleLoad = () => handleVideoLoad(talkingVideo)
      const handleError = (e: Event) => handleVideoError(e, 'talking')
      
      talkingVideo.addEventListener('loadeddata', handleLoad)
      talkingVideo.addEventListener('error', handleError)
      
      return () => {
        talkingVideo.removeEventListener('loadeddata', handleLoad)
        talkingVideo.removeEventListener('error', handleError)
      }
    }
  }, [config.talking, currentVideo, setupVideo, handleVideoLoad, handleVideoError, isClient])

  // Handle video state changes
  useEffect(() => {
    if (isClient) {
      switchVideo(shouldShowTalkingVideo)
    }
  }, [shouldShowTalkingVideo, switchVideo, isClient])

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      const idleVideo = idleVideoRef.current
      const talkingVideo = talkingVideoRef.current
      
      if (idleVideo) {
        idleVideo.pause()
        idleVideo.src = ''
      }
      
      if (talkingVideo) {
        talkingVideo.pause()
        talkingVideo.src = ''
      }
    }
  }, [])

  // Show error state
  if (loadError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100 rounded-lg",
        className
      )}>
        <div className="text-center p-4">
          <p className="text-sm text-gray-600 mb-2">Error cargando video</p>
          <p className="text-xs text-gray-500">{loadError}</p>
        </div>
      </div>
    )
  }

  // Show loading state for SSR
  if (!isClient) {
    return (
      <div className={cn(
        "relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center",
        className
      )}>
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-white/20 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden video-container",
      className
    )}>
      {/* Idle Video */}
      <video
        ref={idleVideoRef}
        className={cn(
          "absolute inset-0 w-full h-full object-cover video-element",
          "video-state-idle",
          config.removeBackground && "remove-black-background"
        )}
        style={{
          opacity: shouldShowIdleVideo ? 1 : 0,
          zIndex: shouldShowIdleVideo ? 3 : 1,
        }}
        autoPlay={config.autoPlay}
        loop={config.loop}
        muted={config.muted}
        playsInline={config.playsInline}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplaybook"
      />

      {/* Talking Video */}
      <video
        ref={talkingVideoRef}
        className={cn(
          "absolute inset-0 w-full h-full object-cover video-element",
          "video-state-talking",
          config.removeBackground && "remove-black-background"
        )}
        style={{
          opacity: shouldShowTalkingVideo ? 1 : 0,
          zIndex: shouldShowTalkingVideo ? 3 : 1,
        }}
        autoPlay={config.autoPlay}
        loop={config.loop}
        muted={config.muted}
        playsInline={config.playsInline}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplaybook"
      />

      {/* Loading overlay */}
      {!isLoaded && isClient && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-300/50 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && isClient && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
          <div>Current: {currentVideo}</div>
          <div>Talking: {shouldShowTalkingVideo ? 'YES' : 'NO'}</div>
          <div>Idle: {shouldShowIdleVideo ? 'YES' : 'NO'}</div>
        </div>
      )}
    </div>
  )
}