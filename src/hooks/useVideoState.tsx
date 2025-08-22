'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { debounce } from '@/lib/utils'

interface UseVideoStateOptions {
  autoReturnToIdle?: boolean
  idleTimeout?: number
  onVideoChange?: (videoType: 'idle' | 'talking') => void
}

export function useVideoState(options: UseVideoStateOptions = {}) {
  const {
    autoReturnToIdle = true,
    idleTimeout = 3000, // 3 segundos por defecto
    onVideoChange,
  } = options

  const {
    currentVideo,
    isRecording,
    isProcessing,
    hasStartedConversation,
    lastInteraction,
    setCurrentVideo,
    startRecording,
    stopRecording,
    startProcessing,
    stopProcessing,
    startConversation,
    endConversation,
    updateLastInteraction,
  } = useAppStore()

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUserInteracting = useRef(false)

  // Función para cambiar a video hablando
  const switchToTalking = useCallback(() => {
    if (currentVideo !== 'talking') {
      setCurrentVideo('talking')
      updateLastInteraction()
      onVideoChange?.('talking')
    }
  }, [currentVideo, setCurrentVideo, updateLastInteraction, onVideoChange])

  // Función para cambiar a video idle
  const switchToIdle = useCallback(() => {
    if (currentVideo !== 'idle' && !isRecording && !isProcessing) {
      setCurrentVideo('idle')
      updateLastInteraction()
      onVideoChange?.('idle')
    }
  }, [currentVideo, isRecording, isProcessing, setCurrentVideo, updateLastInteraction, onVideoChange])

  // Función debouncada para volver a idle
  const debouncedReturnToIdle = useCallback(
    debounce(() => {
      if (!isUserInteracting.current && !isRecording && !isProcessing) {
        switchToIdle()
      }
    }, idleTimeout),
    [switchToIdle, isRecording, isProcessing, idleTimeout]
  )

  // Función para manejar inicio de conversación
  const handleStartConversation = useCallback(() => {
    isUserInteracting.current = true
    startConversation()
    startRecording()
    switchToTalking()

    // Limpiar timeout existente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [startConversation, startRecording, switchToTalking])

  // Función para manejar fin de grabación
  const handleStopRecording = useCallback(() => {
    stopRecording()
    startProcessing()
    
    // Mantener video hablando durante procesamiento
    switchToTalking()
  }, [stopRecording, startProcessing, switchToTalking])

  // Función para manejar fin de procesamiento
  const handleStopProcessing = useCallback(() => {
    stopProcessing()
    isUserInteracting.current = false
    
    // Programar retorno a idle si está habilitado
    if (autoReturnToIdle) {
      timeoutRef.current = setTimeout(() => {
        if (!isUserInteracting.current) {
          switchToIdle()
          endConversation()
        }
      }, idleTimeout)
    }
  }, [stopProcessing, autoReturnToIdle, idleTimeout, switchToIdle, endConversation])

  // Función para detectar interacción del usuario
  const handleUserInteraction = useCallback(() => {
    isUserInteracting.current = true
    updateLastInteraction()
    
    // Limpiar timeout existente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Si no está grabando, cambiar a talking temporalmente
    if (!isRecording && !isProcessing) {
      switchToTalking()
      
      // Programar retorno a idle
      if (autoReturnToIdle) {
        timeoutRef.current = setTimeout(() => {
          isUserInteracting.current = false
          switchToIdle()
        }, idleTimeout)
      }
    }
  }, [isRecording, isProcessing, switchToTalking, switchToIdle, autoReturnToIdle, idleTimeout, updateLastInteraction])

  // Función para forzar retorno a idle
  const forceReturnToIdle = useCallback(() => {
    isUserInteracting.current = false
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    switchToIdle()
    endConversation()
  }, [switchToIdle, endConversation])

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Monitorear cambios en el estado para log
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Video State Changed:', {
        currentVideo,
        isRecording,
        isProcessing,
        hasStartedConversation,
        isUserInteracting: isUserInteracting.current,
      })
    }
  }, [currentVideo, isRecording, isProcessing, hasStartedConversation])

  return {
    // Estado actual
    currentVideo,
    isRecording,
    isProcessing,
    hasStartedConversation,
    lastInteraction,
    
    // Estados derivados
    shouldShowTalkingVideo: currentVideo === 'talking',
    shouldShowIdleVideo: currentVideo === 'idle',
    isInteracting: isRecording || isProcessing || isUserInteracting.current,
    
    // Acciones principales
    startConversation: handleStartConversation,
    stopRecording: handleStopRecording,
    stopProcessing: handleStopProcessing,
    onUserInteraction: handleUserInteraction,
    forceReturnToIdle,
    
    // Acciones directas de video
    switchToTalking,
    switchToIdle,
    
    // Función debouncada (agregada para evitar warning)
    debouncedReturnToIdle,
  }
}