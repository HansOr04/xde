'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CTAButton, IconButton } from '@/components/ui/Button'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { HeroAuroraBackground } from '@/components/backgrounds/AuroraBackground'
import { useVideoState } from '@/hooks/useVideoState'
import { useContactStore, useAppStore } from '@/lib/store'
import type { HeroContent, VideoConfig } from '@/types'

interface HeroSectionProps {
  content: HeroContent
  videoConfig: VideoConfig
  className?: string
}

// Hook personalizado para Speech Recognition
function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'es-ES'
        
        recognitionRef.current.onresult = (event: any) => {
          const result = event.results[0][0].transcript
          setTranscript(result)
          setError(null)
        }
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          
          // Manejar diferentes tipos de errores
          switch (event.error) {
            case 'not-allowed':
              setError('Acceso al micrófono denegado. Por favor, permite el acceso al micrófono y recarga la página.')
              break
            case 'no-speech':
              setError('No se detectó voz. Intenta hablar más fuerte.')
              break
            case 'audio-capture':
              setError('No se pudo acceder al micrófono. Verifica que esté conectado.')
              break
            case 'network':
              setError('Error de conexión. Verifica tu conexión a internet.')
              break
            default:
              setError(`Error de reconocimiento de voz: ${event.error}`)
          }
        }
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onstart = () => {
          setError(null)
        }
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setError(null)
      setIsListening(true)
      
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Error starting recognition:', err)
        setIsListening(false)
        setError('No se pudo iniciar el reconocimiento de voz. Intenta de nuevo.')
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    isSupported, 
    error, 
    clearError 
  }
}

// Hook personalizado para Speech Synthesis
function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        // Filtrar solo voces femeninas en español
        const femaleVoices = availableVoices.filter(voice => 
          (voice.lang.includes('es') || voice.lang.includes('ES')) &&
          (voice.name.toLowerCase().includes('female') ||
           voice.name.toLowerCase().includes('monica') ||
           voice.name.toLowerCase().includes('paloma') ||
           voice.name.toLowerCase().includes('lucia') ||
           voice.name.toLowerCase().includes('carmen') ||
           voice.name.toLowerCase().includes('elena') ||
           voice.name.toLowerCase().includes('maria'))
        )
        
        setVoices(femaleVoices.length > 0 ? femaleVoices : availableVoices.filter(voice => 
          voice.lang.includes('es') || voice.lang.includes('ES')
        ))
        
        if (femaleVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(femaleVoices[0] || null)
        } else if (!selectedVoice && availableVoices.length > 0) {
          const spanishVoice = availableVoices.find(voice => voice.lang.includes('es'))
          if (spanishVoice) {
            setSelectedVoice(spanishVoice)
          } else if (availableVoices[0]) {
            setSelectedVoice(availableVoices[0])
          }
        }
      }

      loadVoices()
      speechSynthesis.addEventListener('voiceschanged', loadVoices)
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }
  }, [selectedVoice])

  const speak = useCallback((text: string) => {
    if (!text.trim()) return

    // Cancelar cualquier síntesis previa
    speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
    
    // Configurar para voz femenina
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8
    utterance.lang = 'es-ES'

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }, [selectedVoice])

  const stop = useCallback(() => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking, voices, selectedVoice, setSelectedVoice }
}

export function HeroSection({ content, videoConfig, className }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  
  // Hooks de estado de video y conversación
  const { 
    currentVideo,
    isRecording,
    startConversation: handleStartConversation,
    stopRecording: handleStopRecording,
    stopProcessing: handleStopProcessing,
    onUserInteraction: handleUserInteraction,
  } = useVideoState({
    autoReturnToIdle: true,
    idleTimeout: 3000,
  })

  // Estados del store para funciones adicionales
  const { 
    hasStartedConversation,
    stopRecording,
  } = useContactStore()

  const { setCurrentVideo } = useAppStore()

  // Hooks de voz
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    isSupported: speechRecognitionSupported,
    error: speechError,
    clearError: clearSpeechError
  } = useSpeechRecognition()
  
  const { 
    speak, 
    stop: stopSpeaking, 
    isSpeaking,
    voices 
  } = useSpeechSynthesis()

  // Función para generar UUID válido
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Estados locales
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastResponse, setLastResponse] = useState<string>('')
  const [voiceSessionId, setVoiceSessionId] = useState<string | null>(null)

  // Función principal del flujo de voz
  const handleVoiceConversation = useCallback(async () => {
    try {
      if (!speechRecognitionSupported) {
        alert('Tu navegador no soporta reconocimiento de voz. Por favor usa Chrome o Edge.')
        return
      }

      // Limpiar errores previos
      clearSpeechError()

      // Generar sessionId si no existe
      if (!voiceSessionId) {
        setVoiceSessionId(generateUUID())
      }

      // 1. Comenzar conversación usando el handler del hook
      handleStartConversation()
      
      // 2. Iniciar escucha de voz
      startListening()

    } catch (error) {
      console.error('Error iniciando conversación:', error)
      setCurrentVideo('idle')
      stopRecording()
    }
  }, [speechRecognitionSupported, clearSpeechError, voiceSessionId, handleStartConversation, startListening, setCurrentVideo, stopRecording])

  // Función para detener la conversación
  const handleStopConversation = useCallback(() => {
    stopListening()
    stopSpeaking()
    handleStopRecording()
    setCurrentVideo('idle')
  }, [stopListening, stopSpeaking, handleStopRecording, setCurrentVideo])

  // Efecto para procesar el transcript cuando esté listo
  useEffect(() => {
    const processTranscript = async () => {
      if (transcript && transcript.trim().length > 0) {
        console.log('🎤 Texto transcrito:', transcript)
        console.log('🔍 Código actualizado - usando UUID válido')
        
        try {
          // 3. Procesar transcripción
          setIsConnecting(true)
          setCurrentVideo('talking') // Mantener video hablando durante procesamiento
          
          // 4. Enviar texto transcrito al backend (usando proxy de Next.js)
          const fullUrl = '/api/assistant/chat'
          
          // Generar o reutilizar sessionId válido para la conversación
          const currentSessionId = voiceSessionId || generateUUID()
          if (!voiceSessionId) {
            setVoiceSessionId(currentSessionId)
          }
          
          const requestBody = {
            message: transcript,
            sessionId: currentSessionId
            // Quitar 'source' - el validador no lo permite
          }
          
          console.log('🔗 Enviando a:', fullUrl)
          console.log('📤 Datos enviados:', JSON.stringify(requestBody, null, 2))
          
          const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          console.log('🤖 Respuesta del backend:', data)

          if (data.success && data.data?.response) {
            // 5. Reproducir respuesta con voz femenina
            setLastResponse(data.data.response)
            speak(data.data.response)
            
            // El video se mantiene en "talking" mientras habla
            setCurrentVideo('talking')
          } else {
            console.error('Respuesta inválida del backend:', data)
            speak('Lo siento, hubo un problema procesando tu consulta.')
          }

        } catch (error) {
          console.error('Error enviando mensaje al backend:', error)
          speak('Lo siento, no pude conectar con el servidor. Por favor intenta de nuevo.')
        } finally {
          setIsConnecting(false)
        }
      }
    }

    if (transcript && isRecording) {
      // Pequeño delay para asegurar que se capturó todo el texto
      setTimeout(processTranscript, 500)
    }
  }, [transcript, isRecording, voiceSessionId, setCurrentVideo, speak])

  // Efecto para manejar cuando termina de hablar la IA
  useEffect(() => {
    if (!isSpeaking && !isListening && hasStartedConversation) {
      // Delay antes de volver al estado idle
      setTimeout(() => {
        setCurrentVideo('idle')
      }, 1000)
    }
  }, [isSpeaking, isListening, hasStartedConversation, setCurrentVideo])

  // Manejar click en botón de contacto
  const handleContactClick = () => {
    if (isListening || isRecording) {
      // Detener conversación
      handleStopConversation()
    } else {
      // Iniciar conversación
      handleVoiceConversation()
    }
  }

  // Manejar interacciones generales del usuario
  const handleUserInteractionClick = () => {
    handleUserInteraction()
  }

  // Animaciones con tipos correctos
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // easeOutExpo
      }
    }
  }

  const videoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] // easeOutExpo
      }
    }
  }

  // Obtener texto del botón según el estado
  const getButtonText = () => {
    if (speechError) return "Reintentar"
    if (isListening) return "Escuchando..."
    if (isConnecting) return "Procesando..."
    if (isSpeaking) return "Hablando..."
    return content.ctaText
  }

  // Obtener estado para mostrar
  const getStatusText = () => {
    if (isListening) return "🎤 Te estoy escuchando"
    if (isConnecting) return "🧠 Procesando tu consulta"
    if (isSpeaking) return "🗣️ Respondiendo"
    return ""
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",
        // Padding top responsive para compensar el header fijo
        "pt-14 sm:pt-16 lg:pt-20",
        // Padding responsivo general
        "px-4 sm:px-6 lg:px-8",
        className
      )}
      onClick={handleUserInteractionClick}
    >
      {/* Fondo Aurora */}
      <HeroAuroraBackground />

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          
          {/* Contenido de texto */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            {/* Título principal */}
            <motion.h1
              variants={itemVariants}
              className={cn(
                "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
                "font-bold text-white leading-tight",
                "drop-shadow-2xl"
              )}
            >
              <span className="block">Conecta con el</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                futuro de la
              </span>
              <span className="block">cobranza</span>
            </motion.h1>

            {/* Indicador de estado de voz */}
            {(isListening || isConnecting || isSpeaking || speechError) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border",
                  speechError ? "border-red-400/50 bg-red-900/20" : "border-white/20"
                )}
              >
                {speechError ? (
                  <div className="space-y-2">
                    <p className="text-red-300 text-sm font-medium">
                      ⚠️ Error de micrófono
                    </p>
                    <p className="text-red-200 text-xs">
                      {speechError}
                    </p>
                    <button
                      onClick={clearSpeechError}
                      className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-blue-200 text-sm font-medium">
                      {getStatusText()}
                    </p>
                    {transcript && (
                      <p className="text-white text-xs mt-1 opacity-80">
                        "{transcript}"
                      </p>
                    )}
                    {lastResponse && isSpeaking && (
                      <p className="text-green-200 text-xs mt-1 opacity-80">
                        Respuesta: "{lastResponse.substring(0, 100)}..."
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Botones de acción */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              {/* Botón principal CTA de voz */}
              <CTAButton
                size="xl"
                className={cn(
                  "shadow-2xl w-full sm:w-auto",
                  isListening && "shadow-red-500/25 bg-red-500/20",
                  isConnecting && "shadow-yellow-500/25 bg-yellow-500/20",
                  isSpeaking && "shadow-green-500/25 bg-green-500/20"
                )}
                onClick={handleContactClick}
                disabled={isConnecting}
                leftIcon={
                  isListening ? (
                    <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  )
                }
                animation={hasStartedConversation ? "none" : "glow"}
              >
                <span className="text-sm sm:text-base">
                  {getButtonText()}
                </span>
              </CTAButton>

              {/* Botón secundario */}
              <CTAButton
                size="xl"
                className="border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/15 w-full sm:w-auto"
                onClick={() => window.open('tel:+593-2-234-5678', '_self')}
              >
                <span className="text-sm sm:text-base">Llamar ahora</span>
              </CTAButton>
            </motion.div>

            {/* Indicadores de estado - Solo en desktop */}
            <motion.div
              variants={itemVariants}
              className="hidden sm:flex items-center justify-center lg:justify-start space-x-4"
            >
              {/* Indicador de video actual */}
              <div className="flex items-center space-x-2 text-sm text-blue-200/60">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  currentVideo === 'talking' ? "bg-green-400" : "bg-blue-400"
                )} />
                <span>
                  {currentVideo === 'talking' ? "Hablando" : "En espera"}
                </span>
              </div>

              {/* Indicador de grabación */}
              {isListening && (
                <div className="flex items-center space-x-2 text-sm text-red-300">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Escuchando</span>
                </div>
              )}

              {/* Indicador de procesamiento */}
              {isConnecting && (
                <div className="flex items-center space-x-2 text-sm text-yellow-300">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span>Procesando</span>
                </div>
              )}

              {/* Indicador de voz disponible */}
              {voices.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-purple-300">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Voz femenina lista</span>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Video de la mujer profesional */}
          <motion.div
            variants={videoVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative order-1 lg:order-2 mb-8 lg:mb-0"
          >
            <div className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              {/* Círculo decorativo de fondo */}
              <div className={cn(
                "absolute inset-0 rounded-full blur-2xl sm:blur-3xl scale-110 transition-colors duration-500",
                isListening ? "bg-gradient-to-br from-red-500/20 to-red-300/10" :
                isConnecting ? "bg-gradient-to-br from-yellow-500/20 to-yellow-300/10" :
                isSpeaking ? "bg-gradient-to-br from-green-500/20 to-green-300/10" :
                "bg-gradient-to-br from-white/10 to-white/5"
              )} />
              
              {/* Anillo exterior decorativo */}
              <div className={cn(
                "absolute inset-0 rounded-full border sm:border-2 scale-105 transition-colors duration-500",
                isListening ? "border-red-400/50 animate-pulse" :
                isConnecting ? "border-yellow-400/50 animate-pulse" :
                isSpeaking ? "border-green-400/50 animate-pulse" :
                "border-white/20 animate-pulse-slow"
              )} />
              
              {/* Contenedor del video */}
              <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30">
                <VideoPlayer
                  config={videoConfig}
                  className="w-full h-full"
                  onLoad={() => console.log('Video cargado')}
                  onError={(error) => console.error('Error en video:', error)}
                />
                
                {/* Overlay sutil para mejor integración */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Efectos de partículas alrededor del video */}
              <div className="absolute inset-0 pointer-events-none hidden lg:block">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full animate-float transition-colors duration-500",
                      isListening ? "bg-red-300/50" :
                      isConnecting ? "bg-yellow-300/50" :
                      isSpeaking ? "bg-green-300/50" :
                      "bg-white/30"
                    )}
                    style={{
                      left: `${20 + (i * 45) % 60}%`,
                      top: `${15 + (i * 23) % 70}%`,
                      animationDelay: `${i * 0.8}s`,
                      animationDuration: `${3 + (i % 3)}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Botón flotante de interacción */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4"
            >
              <IconButton
                icon={
                  isListening ? (
                    <MicOff className="w-4 h-4 sm:w-6 sm:h-6 text-red-300" />
                  ) : (
                    <Mic className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  )
                }
                onClick={handleContactClick}
                disabled={isConnecting}
                className={cn(
                  "w-12 h-12 sm:w-16 sm:h-16 shadow-2xl transition-all duration-300",
                  isListening ? "bg-red-500/20 border-red-400/50 animate-pulse" :
                  isConnecting ? "bg-yellow-500/20 border-yellow-400/50 animate-pulse" :
                  isSpeaking ? "bg-green-500/20 border-green-400/50 animate-pulse" :
                  "bg-primary/20 border-primary/50 hover:bg-primary/30"
                )}
                tooltip={
                  isListening ? "Detener grabación" : 
                  isConnecting ? "Procesando..." :
                  "Iniciar conversación por voz"
                }
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Gradiente inferior para transición suave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  )
}