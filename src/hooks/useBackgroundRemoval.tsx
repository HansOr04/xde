'use client'

import { useRef, useCallback } from 'react'
import { detectVideoBackground } from '@/lib/utils'

interface UseBackgroundRemovalOptions {
  type?: 'black' | 'white' | 'transparent'
  enabled?: boolean
  autoDetect?: boolean
  threshold?: number
  softness?: number
  spill?: number
  onDetectionComplete?: (backgroundType: 'black' | 'white' | 'transparent') => void
}

export function useBackgroundRemoval(options: UseBackgroundRemovalOptions = {}) {
  const {
    type = 'black',
    enabled = true,
    autoDetect = true,
    threshold = 0.1,
    softness = 0.02,
    spill = 0.1,
    onDetectionComplete,
  } = options

  const detectedTypeRef = useRef<'black' | 'white' | 'transparent'>('black')
  const isProcessingRef = useRef(false)

  // Función para aplicar remoción de fondo
  const applyRemoval = useCallback((
    videoElement: HTMLVideoElement,
    backgroundType: 'black' | 'white' | 'transparent' = type
  ) => {
    if (!enabled || !videoElement) return

    try {
      switch (backgroundType) {
        case 'black':
          videoElement.style.mixBlendMode = 'screen'
          videoElement.style.filter = `contrast(1.2) brightness(1.1) saturate(1.1)`
          break
          
        case 'white':
          videoElement.style.mixBlendMode = 'multiply'
          videoElement.style.filter = `contrast(1.3) brightness(0.9) saturate(1.2)`
          break
          
        case 'transparent':
        default:
          videoElement.style.mixBlendMode = 'normal'
          videoElement.style.filter = 'none'
          break
      }

      // Aplicar clase CSS adicional para mejor control
      videoElement.classList.remove('remove-black-background', 'remove-white-background', 'chroma-key-black')
      
      if (backgroundType === 'black') {
        videoElement.classList.add('remove-black-background')
      } else if (backgroundType === 'white') {
        videoElement.classList.add('remove-white-background')
      }

    } catch (error) {
      console.warn('Error applying background removal:', error)
    }
  }, [enabled, type])

  // Función para detectar automáticamente el tipo de fondo
  const detectBackground = useCallback((videoElement: HTMLVideoElement) => {
    if (!autoDetect || !enabled || isProcessingRef.current) return

    isProcessingRef.current = true

    try {
      // Esperar a que el video esté listo
      const handleLoadedData = () => {
        try {
          const detectedType = detectVideoBackground(videoElement)
          detectedTypeRef.current = detectedType
          onDetectionComplete?.(detectedType)
          
          // Aplicar remoción basada en detección
          applyRemoval(videoElement, detectedType)
        } catch (error) {
          console.warn('Error detecting video background:', error)
          // Fallback al tipo especificado
          applyRemoval(videoElement, type)
        } finally {
          isProcessingRef.current = false
        }
      }

      if (videoElement.readyState >= 2) {
        // Video ya está listo
        handleLoadedData()
      } else {
        // Esperar a que el video esté listo
        videoElement.addEventListener('loadeddata', handleLoadedData, { once: true })
      }
    } catch (error) {
      console.warn('Error in background detection setup:', error)
      isProcessingRef.current = false
    }
  }, [autoDetect, enabled, onDetectionComplete, applyRemoval, type])

  // Función para remover efectos de fondo
  const removeBackgroundEffects = useCallback((videoElement: HTMLVideoElement) => {
    if (!videoElement) return

    try {
      videoElement.style.mixBlendMode = 'normal'
      videoElement.style.filter = 'none'
      videoElement.classList.remove('remove-black-background', 'remove-white-background', 'chroma-key-black')
    } catch (error) {
      console.warn('Error removing background effects:', error)
    }
  }, [])

  // Función para aplicar efectos avanzados de chroma key
  const applyChromaKey = useCallback((
    videoElement: HTMLVideoElement,
    color: 'black' | 'white' | 'green' = 'black'
  ) => {
    if (!enabled || !videoElement) return

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return

      const processFrame = () => {
        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight
        
        ctx.drawImage(videoElement, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Procesar cada pixel para chroma key
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] || 0
          const g = data[i + 1] || 0
          const b = data[i + 2] || 0
          
          let shouldRemove = false
          
          switch (color) {
            case 'black':
              shouldRemove = r < 50 && g < 50 && b < 50
              break
            case 'white':
              shouldRemove = r > 200 && g > 200 && b > 200
              break
            case 'green':
              shouldRemove = g > (r + b) * 1.5
              break
          }
          
          if (shouldRemove) {
            data[i + 3] = 0 // Hacer transparente
          }
        }
        
        ctx.putImageData(imageData, 0, 0)
        
        // Aplicar el resultado al video (requiere WebGL o Canvas como overlay)
        if ('requestVideoFrameCallback' in videoElement) {
          (videoElement as any).requestVideoFrameCallback(processFrame)
        }
      }

      if ('requestVideoFrameCallback' in videoElement) {
        (videoElement as any).requestVideoFrameCallback(processFrame)
      }
    } catch (error) {
      console.warn('Error applying chroma key:', error)
    }
  }, [enabled])

  // Función para optimizar rendimiento
  const optimizeForPerformance = useCallback((videoElement: HTMLVideoElement) => {
    if (!videoElement) return

    try {
      // Aplicar optimizaciones CSS
      videoElement.style.willChange = 'transform, opacity'
      videoElement.style.transform = 'translateZ(0)' // Forzar aceleración hardware
      videoElement.style.backfaceVisibility = 'hidden'
      
      // Configurar hints de rendimiento
      if ('style' in videoElement) {
        (videoElement.style as any).imageRendering = 'optimizeSpeed'
      }
    } catch (error) {
      console.warn('Error optimizing video performance:', error)
    }
  }, [])

  return {
    // Funciones principales
    applyRemoval,
    detectBackground,
    removeBackgroundEffects,
    applyChromaKey,
    optimizeForPerformance,
    
    // Estado
    detectedType: detectedTypeRef.current,
    isProcessing: isProcessingRef.current,
    
    // Configuración actual
    config: {
      type,
      enabled,
      autoDetect,
      threshold,
      softness,
      spill,
    },
  }
}