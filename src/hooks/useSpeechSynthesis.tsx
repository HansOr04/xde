'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface SpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice | null
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

interface UseSpeechSynthesisReturn {
  speak: (text: string, options?: SpeechSynthesisOptions) => void
  cancel: () => void
  pause: () => void
  resume: () => void
  stopSpeaking: () => void
  isSpeaking: boolean
  isPaused: boolean
  isSupported: boolean
  voices: SpeechSynthesisVoice[]
  currentVoice: SpeechSynthesisVoice | null
  setVoice: (voice: SpeechSynthesisVoice | null) => void
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null)
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Verificar soporte del navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)
      
      // Cargar voces
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)
        
        // Buscar voz en español por defecto
        const spanishVoice = availableVoices.find(voice => 
          voice.lang.includes('es') || voice.lang.includes('ES')
        )
        if (spanishVoice && !currentVoice) {
          setCurrentVoice(spanishVoice)
        }
      }

      // Cargar voces inmediatamente
      loadVoices()
      
      // También escuchar el evento onvoiceschanged
      speechSynthesis.addEventListener('voiceschanged', loadVoices)
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }
  }, [currentVoice])

  // Función para hablar
  const speak = useCallback((text: string, options: SpeechSynthesisOptions = {}) => {
    if (!isSupported || !text.trim()) return

    // Cancelar cualquier síntesis previa
    speechSynthesis.cancel()

    // Crear nueva utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Configurar opciones
    utterance.voice = options.voice || currentVoice
    utterance.rate = options.rate || 0.9
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 0.8
    utterance.lang = options.lang || 'es-ES'

    // Event listeners
    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      utteranceRef.current = null
    }

    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event.error)
      setIsSpeaking(false)
      setIsPaused(false)
      utteranceRef.current = null
    }

    utterance.onpause = () => {
      setIsPaused(true)
    }

    utterance.onresume = () => {
      setIsPaused(false)
    }

    // Iniciar síntesis
    speechSynthesis.speak(utterance)

    // Workaround para navegadores que pausan después de 14 segundos
    const resumeInfinity = () => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause()
        speechSynthesis.resume()
        timeoutRef.current = setTimeout(resumeInfinity, 14000)
      }
    }

    timeoutRef.current = setTimeout(resumeInfinity, 14000)
  }, [isSupported, currentVoice])

  // Función para cancelar
  const cancel = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
      utteranceRef.current = null
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isSupported])

  // Función para pausar
  const pause = useCallback(() => {
    if (isSupported && speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [isSupported])

  // Función para reanudar
  const resume = useCallback(() => {
    if (isSupported && speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [isSupported])

  // Alias para stopSpeaking
  const stopSpeaking = useCallback(() => {
    cancel()
  }, [cancel])

  // Función para cambiar voz
  const setVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setCurrentVoice(voice)
  }, [])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (isSupported) {
        speechSynthesis.cancel()
      }
    }
  }, [isSupported])

  return {
    speak,
    cancel,
    pause,
    resume,
    stopSpeaking,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    currentVoice,
    setVoice,
  }
}