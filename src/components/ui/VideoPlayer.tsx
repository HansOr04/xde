// src/components/ui/VideoPlayer.tsx
'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useVideoState } from '@/hooks/useVideoState'
import type { VideoConfig } from '@/types/video'

interface VideoPlayerProps {
  config: VideoConfig
  className?: string
  onLoad?: () => void
  onError?: (error: string) => void
}

export function VideoPlayer({ config, className, onLoad, onError }: VideoPlayerProps) {
  const idleImageRef = useRef<HTMLImageElement>(null)
  const talkingImageRef = useRef<HTMLImageElement>(null)
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

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Function to configure an image
  const setupImage = useCallback((
    imageElement: HTMLImageElement,
    src: string,
    isActive: boolean
  ) => {
    if (!imageElement || !isClient) return

    try {
      // Configure basic properties
      imageElement.src = src
      imageElement.alt = isActive ? "Asistente virtual hablando" : "Asistente virtual en espera"
      
      // Apply styles
      imageElement.style.outline = 'none'
      imageElement.style.border = 'none'
      imageElement.style.userSelect = 'none'
      imageElement.style.pointerEvents = 'none'

      // Configure initial visibility
      imageElement.style.opacity = isActive ? '1' : '0'
      imageElement.style.zIndex = isActive ? '2' : '1'
      imageElement.style.transition = 'opacity 0.3s ease-in-out'

    } catch (error) {
      console.error('Error setting up image:', error)
      onError?.(error instanceof Error ? error.message : 'Error configurando imagen')
    }
  }, [onError, isClient])

  // Function to handle image load
  const handleImageLoad = useCallback((imageElement: HTMLImageElement) => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  // Function to handle image errors
  const handleImageError = useCallback((error: Event, imageType: 'idle' | 'talking') => {
    const errorMessage = `Error cargando imagen ${imageType}`
    setLoadError(errorMessage)
    onError?.(errorMessage)
    console.error('Image error:', error)
  }, [onError])

  // Function to switch between images
  const switchImage = useCallback((showTalking: boolean) => {
    const idleImage = idleImageRef.current
    const talkingImage = talkingImageRef.current

    if (!idleImage || !talkingImage) return

    try {
      if (showTalking) {
        // Show talking image
        talkingImage.style.opacity = '1'
        talkingImage.style.zIndex = '3'
        idleImage.style.opacity = '0'
        idleImage.style.zIndex = '1'
      } else {
        // Show idle image
        idleImage.style.opacity = '1'
        idleImage.style.zIndex = '3'
        talkingImage.style.opacity = '0'
        talkingImage.style.zIndex = '1'
      }
    } catch (error) {
      console.error('Error switching images:', error)
    }
  }, [])

  // Configure images when references change
  useEffect(() => {
    if (!isClient) return

    const idleImage = idleImageRef.current

    if (idleImage && config.idle) {
      setupImage(idleImage, config.idle, currentVideo === 'idle')
      
      const handleLoad = () => handleImageLoad(idleImage)
      const handleError = (e: Event) => handleImageError(e, 'idle')
      
      idleImage.addEventListener('load', handleLoad)
      idleImage.addEventListener('error', handleError)
      
      return () => {
        idleImage.removeEventListener('load', handleLoad)
        idleImage.removeEventListener('error', handleError)
      }
    }
  }, [config.idle, currentVideo, setupImage, handleImageLoad, handleImageError, isClient])

  useEffect(() => {
    if (!isClient) return

    const talkingImage = talkingImageRef.current

    if (talkingImage && config.talking) {
      setupImage(talkingImage, config.talking, currentVideo === 'talking')
      
      const handleLoad = () => handleImageLoad(talkingImage)
      const handleError = (e: Event) => handleImageError(e, 'talking')
      
      talkingImage.addEventListener('load', handleLoad)
      talkingImage.addEventListener('error', handleError)
      
      return () => {
        talkingImage.removeEventListener('load', handleLoad)
        talkingImage.removeEventListener('error', handleError)
      }
    }
  }, [config.talking, currentVideo, setupImage, handleImageLoad, handleImageError, isClient])

  // Handle image state changes
  useEffect(() => {
    if (isClient) {
      switchImage(shouldShowTalkingVideo)
    }
  }, [shouldShowTalkingVideo, switchImage, isClient])

  // Show error state
  if (loadError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100 rounded-lg",
        className
      )}>
        <div className="text-center p-4">
          <p className="text-sm text-gray-600 mb-2">Error cargando imagen</p>
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
      "relative w-full h-full overflow-hidden image-container",
      className
    )}>
      {/* Idle Image (GIF) */}
      <img
        ref={idleImageRef}
        className={cn(
          "absolute inset-0 w-full h-full object-cover image-element",
          "image-state-idle"
        )}
        style={{
          opacity: shouldShowIdleVideo ? 1 : 0,
          zIndex: shouldShowIdleVideo ? 3 : 1,
        }}
        alt="Asistente virtual en espera"
        loading="eager"
        decoding="async"
        draggable={false}
      />

      {/* Talking Image (GIF) */}
      <img
        ref={talkingImageRef}
        className={cn(
          "absolute inset-0 w-full h-full object-cover image-element",
          "image-state-talking"
        )}
        style={{
          opacity: shouldShowTalkingVideo ? 1 : 0,
          zIndex: shouldShowTalkingVideo ? 3 : 1,
        }}
        alt="Asistente virtual hablando"
        loading="eager"
        decoding="async"
        draggable={false}
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