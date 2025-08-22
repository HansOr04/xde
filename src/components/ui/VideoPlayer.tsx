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

  const {
    currentVideo,
    shouldShowTalkingVideo,
    shouldShowIdleVideo,
    isInteracting,
  } = useVideoState({
    autoReturnToIdle: true,
    idleTimeout: 3000,
  })

  const backgroundRemoval = useBackgroundRemoval({
    type: config.backgroundType || 'black',
    enabled: config.removeBackground ?? true,
    autoDetect: true,
  })

  // Suprimir warning de variable no usada
  const _ = { isInteracting, talkingVideoRef }

  // Función para configurar un video
  const setupVideo = useCallback((
    videoElement: HTMLVideoElement,
    src: string,
    isActive: boolean
  ) => {
    if (!videoElement) return

    try {
      // Configurar propiedades básicas
      videoElement.src = src
      videoElement.autoplay = config.autoPlay ?? true
      videoElement.loop = config.loop ?? true
      videoElement.muted = config.muted ?? true
      videoElement.controls = config.controls ?? false
      videoElement.playsInline = config.playsInline ?? true
      
      // Configurar poster si está disponible
      if (config.poster && !isActive) {
        videoElement.poster = config.poster
      }

      // Aplicar estilos para ocultar controles completamente
      videoElement.style.outline = 'none'
      videoElement.style.border = 'none'
      
      // Remover atributos de control
      videoElement.removeAttribute('controls')
      videoElement.setAttribute('disablePictureInPicture', 'true')
      videoElement.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback')

      // Aplicar remoción de fondo si está habilitada
      if (config.removeBackground) {
        backgroundRemoval.optimizeForPerformance(videoElement)
        backgroundRemoval.detectBackground(videoElement)
      }

      // Configurar visibilidad inicial
      videoElement.style.opacity = isActive ? '1' : '0'
      videoElement.style.zIndex = isActive ? '2' : '1'
      videoElement.style.transition = 'opacity 0.3s ease-in-out'

    } catch (error) {
      console.error('Error setting up video:', error)
      onError?.(error instanceof Error ? error.message : 'Error configurando video')
    }
  }, [config, backgroundRemoval, onError])

  // Función para manejar la carga del video
  const handleVideoLoad = useCallback((videoElement: HTMLVideoElement) => {
    setIsLoaded(true)
    onLoad?.()
    
    // Asegurar reproducción automática
    if (config.autoPlay) {
      videoElement.play().catch((error) => {
        console.warn('Autoplay prevented:', error)
        // El autoplay puede estar bloqueado, esto es normal
      })
    }
  }, [config.autoPlay, onLoad])

  // Función para manejar errores de video
  const handleVideoError = useCallback((error: Event, videoType: 'idle' | 'talking') => {
    const errorMessage = `Error cargando video ${videoType}`
    setLoadError(errorMessage)
    onError?.(errorMessage)
    console.error('Video error:', error)
  }, [onError])

  // Función para cambiar entre videos
  const switchVideo = useCallback((showTalking: boolean) => {
    const idleVideo = idleVideoRef.current
    const talkingVideo = talkingVideoRef.current

    if (!idleVideo || !talkingVideo) return

    try {
      if (showTalking) {
        // Mostrar video hablando
        talkingVideo.style.opacity = '1'
        talkingVideo.style.zIndex = '3'
        idleVideo.style.opacity = '0'
        idleVideo.style.zIndex = '1'
        
        // Asegurar que el video talking esté reproduciéndose
        if (talkingVideo.paused) {
          talkingVideo.play().catch(console.warn)
        }
      } else {
        // Mostrar video idle
        idleVideo.style.opacity = '1'
        idleVideo.style.zIndex = '3'
        talkingVideo.style.opacity = '0'
        talkingVideo.style.zIndex = '1'
        
        // Asegurar que el video idle esté reproduciéndose
        if (idleVideo.paused) {
          idleVideo.play().catch(console.warn)
        }
      }
    } catch (error) {
      console.error('Error switching videos:', error)
    }
  }, [])

  // Configurar videos cuando cambien las referencias
  useEffect(() => {
    const idleVideo = idleVideoRef.current
    const talkingVideo = talkingVideoRef.current

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
  }, [config.idle, currentVideo, setupVideo, handleVideoLoad, handleVideoError])

  useEffect(() => {
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
  }, [config.talking, currentVideo, setupVideo, handleVideoLoad, handleVideoError])

  // Manejar cambios de estado del video
  useEffect(() => {
    switchVideo(shouldShowTalkingVideo)
  }, [shouldShowTalkingVideo, switchVideo])

  // Limpiar recursos al desmontar
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

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden video-container",
      className
    )}>
      {/* Video Idle */}
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

      {/* Video Talking */}
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
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Debug info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
          <div>Current: {currentVideo}</div>
          <div>Talking: {shouldShowTalkingVideo ? 'YES' : 'NO'}</div>
          <div>Idle: {shouldShowIdleVideo ? 'YES' : 'NO'}</div>
        </div>
      )}
    </div>
  )
}