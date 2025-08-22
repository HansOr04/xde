'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/lib/store'

interface AuroraBackgroundProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  colors?: string[]
  speed?: 'slow' | 'normal' | 'fast'
  blur?: number
}

export function AuroraBackground({
  className,
  intensity = 'medium',
  colors = [
    'rgba(147, 197, 253, 0.3)', // blue-300
    'rgba(196, 181, 253, 0.3)', // purple-300
    'rgba(249, 168, 212, 0.3)', // pink-300
    'rgba(252, 165, 165, 0.3)', // red-300
    'rgba(253, 186, 116, 0.3)', // orange-300
  ],
  speed = 'normal',
  blur = 50,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const { reducedMotion } = useUIStore()
  const [isVisible, setIsVisible] = useState(true)

  // Configuración basada en intensidad
  const config = {
    low: { bands: 3, opacity: 0.2, movement: 0.5 },
    medium: { bands: 5, opacity: 0.4, movement: 1 },
    high: { bands: 7, opacity: 0.6, movement: 1.5 },
  }[intensity]

  // Configuración de velocidad
  const speedMultiplier = {
    slow: 0.5,
    normal: 1,
    fast: 1.5,
  }[speed]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reducedMotion) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    const waves: Array<{
      x: number
      y: number
      width: number
      height: number
      speed: number
      color: string
      angle: number
      opacity: number
    }> = []

    // Función para redimensionar canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const devicePixelRatio = window.devicePixelRatio || 1
      
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      
      ctx.scale(devicePixelRatio, devicePixelRatio)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }

    // Inicializar ondas aurora
    const initializeWaves = () => {
      waves.length = 0
      const canvasWidth = canvas.offsetWidth
      const canvasHeight = canvas.offsetHeight

      for (let i = 0; i < config.bands; i++) {
        // Asegurar que siempre hay un color válido
        const colorIndex = i % colors.length
        const selectedColor = colors[colorIndex] || 'rgba(147, 197, 253, 0.3)'
        
        waves.push({
          x: Math.random() * canvasWidth,
          y: (canvasHeight / config.bands) * i + Math.random() * 100,
          width: canvasWidth * (1.5 + Math.random() * 2),
          height: 80 + Math.random() * 120,
          speed: (0.5 + Math.random() * 1) * speedMultiplier,
          color: selectedColor,
          angle: Math.random() * Math.PI * 2,
          opacity: config.opacity * (0.7 + Math.random() * 0.6),
        })
      }
    }

    // Función de animación
    const animate = () => {
      if (!isVisible || reducedMotion) return

      const canvasWidth = canvas.offsetWidth
      const canvasHeight = canvas.offsetHeight

      // Limpiar canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Dibujar cada banda de aurora
      waves.forEach((wave, index) => {
        // Actualizar posición
        wave.x += wave.speed * config.movement
        wave.angle += 0.01 * wave.speed

        // Reiniciar onda cuando sale de pantalla
        if (wave.x > canvasWidth + wave.width) {
          wave.x = -wave.width
          wave.y = (canvasHeight / config.bands) * index + Math.random() * 100
        }

        // Crear gradiente
        const gradient = ctx.createLinearGradient(
          wave.x,
          wave.y,
          wave.x + wave.width,
          wave.y + wave.height
        )

        const baseColor = wave.color.replace(/[\d.]+\)$/g, `${wave.opacity})`)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(0.3, baseColor)
        gradient.addColorStop(0.7, baseColor)
        gradient.addColorStop(1, 'transparent')

        // Configurar filtros
        ctx.filter = `blur(${blur}px)`
        ctx.globalCompositeOperation = 'screen'

        // Dibujar onda
        ctx.fillStyle = gradient
        ctx.save()
        ctx.translate(wave.x + wave.width / 2, wave.y + wave.height / 2)
        ctx.rotate(Math.sin(wave.angle) * 0.1)
        ctx.scale(1 + Math.sin(time * 0.001 + index) * 0.1, 1)
        
        ctx.beginPath()
        ctx.ellipse(
          -wave.width / 2,
          -wave.height / 2,
          wave.width / 2,
          wave.height / 2,
          0,
          0,
          Math.PI * 2
        )
        ctx.fill()
        ctx.restore()

        // Resetear filtros
        ctx.filter = 'none'
        ctx.globalCompositeOperation = 'source-over'
      })

      time += 16 * speedMultiplier
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Configurar observador de intersección para optimización
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 }
    )

    // Inicializar
    resizeCanvas()
    initializeWaves()
    if (!reducedMotion) {
      animate()
    }
    observer.observe(canvas)

    // Event listeners
    const handleResize = () => {
      resizeCanvas()
      initializeWaves()
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [intensity, speed, blur, reducedMotion, isVisible, colors, config, speedMultiplier])

  // Renderizar versión estática si se prefiere movimiento reducido
  if (reducedMotion) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/10 via-red-500/10 to-blue-500/10" />
      </div>
    )
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)',
        }}
      />
      
      {/* Overlay gradient para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      
      {/* Efectos adicionales de partículas (opcional) */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Componente especializado para hero sections
export function HeroAuroraBackground({ className, ...props }: AuroraBackgroundProps) {
  return (
    <AuroraBackground
      intensity="high"
      speed="normal"
      colors={[
        'rgba(59, 130, 246, 0.4)',   // blue-500
        'rgba(147, 51, 234, 0.4)',   // purple-600
        'rgba(236, 72, 153, 0.4)',   // pink-500
        'rgba(239, 68, 68, 0.4)',    // red-500
        'rgba(245, 158, 11, 0.4)',   // amber-500
      ]}
      className={cn("z-0", className)}
      {...props}
    />
  )
}

// Componente para fondos sutiles
export function SubtleAuroraBackground({ className, ...props }: AuroraBackgroundProps) {
  return (
    <AuroraBackground
      intensity="low"
      speed="slow"
      blur={80}
      colors={[
        'rgba(147, 197, 253, 0.15)',  // blue-300
        'rgba(196, 181, 253, 0.15)',  // purple-300
        'rgba(249, 168, 212, 0.15)',  // pink-300
      ]}
      className={cn("z-0", className)}
      {...props}
    />
  )
}