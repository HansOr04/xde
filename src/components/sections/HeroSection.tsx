'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CTAButton, IconButton } from '@/components/ui/Button'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { HeroAuroraBackground } from '@/components/backgrounds/AuroraBackground'
import { useVideoState } from '@/hooks/useVideoState'
import { useContactStore } from '@/lib/store'
import type { HeroContent, VideoConfig } from '@/types'

interface HeroSectionProps {
  content: HeroContent
  videoConfig: VideoConfig
  className?: string
}

export function HeroSection({ content, videoConfig, className }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  
  const {
    currentVideo,
    isRecording,
    isProcessing,
    startConversation,
    stopRecording,
    onUserInteraction,
  } = useVideoState({
    autoReturnToIdle: true,
    idleTimeout: 3000,
  })

  const { hasStartedConversation } = useContactStore()

  // Manejar click en botón de contacto (micrófono)
  const handleContactClick = () => {
    if (!isRecording && !isProcessing) {
      startConversation()
    } else if (isRecording) {
      stopRecording()
    }
  }

  // Manejar interacciones generales del usuario
  const handleUserInteraction = () => {
    onUserInteraction()
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
      onClick={handleUserInteraction}
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

            {/* Subtítulo */}
            {content.subtitle && (
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl lg:text-2xl text-blue-100 font-light leading-relaxed"
              >
                {content.subtitle}
              </motion.p>
            )}

            {/* Descripción */}
            {content.description && (
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-blue-200/80 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                {content.description}
              </motion.p>
            )}

            {/* Botones de acción */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              {/* Botón principal CTA */}
              <CTAButton
                size="xl"
                className="shadow-2xl shadow-primary/25 w-full sm:w-auto"
                onClick={handleContactClick}
                leftIcon={
                  isRecording ? (
                    <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  )
                }
                animation={hasStartedConversation ? "none" : "glow"}
              >
                <span className="text-sm sm:text-base">
                  {isRecording 
                    ? "Terminar conversación" 
                    : isProcessing 
                      ? "Procesando..." 
                      : content.ctaText
                  }
                </span>
              </CTAButton>

              {/* Botón secundario */}
              <CTAButton
                size="xl"
                className="border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/15 w-full sm:w-auto"
              >
                <span className="text-sm sm:text-base">Conocer más</span>
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
              {isRecording && (
                <div className="flex items-center space-x-2 text-sm text-red-300">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Grabando</span>
                </div>
              )}

              {/* Indicador de procesamiento */}
              {isProcessing && (
                <div className="flex items-center space-x-2 text-sm text-yellow-300">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span>Procesando</span>
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
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-2xl sm:blur-3xl scale-110" />
              
              {/* Anillo exterior decorativo */}
              <div className="absolute inset-0 rounded-full border border-white/20 sm:border-2 scale-105 animate-pulse-slow" />
              
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

              {/* Efectos de partículas alrededor del video - Solo en desktop */}
              <div className="absolute inset-0 pointer-events-none hidden lg:block">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/30 rounded-full animate-float"
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
                  isRecording ? (
                    <MicOff className="w-4 h-4 sm:w-6 sm:h-6 text-red-300" />
                  ) : (
                    <Mic className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  )
                }
                onClick={handleContactClick}
                className={cn(
                  "w-12 h-12 sm:w-16 sm:h-16 shadow-2xl",
                  isRecording 
                    ? "bg-red-500/20 border-red-400/50 animate-pulse" 
                    : "bg-primary/20 border-primary/50 hover:bg-primary/30"
                )}
                tooltip={isRecording ? "Detener grabación" : "Iniciar conversación"}
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