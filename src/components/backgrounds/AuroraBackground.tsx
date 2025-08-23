// src/components/backgrounds/AuroraBackground.tsx
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
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Configuration based on intensity
  const config = {
    low: { bands: 3, opacity: 0.2, movement: 0.5 },
    medium: { bands: 5, opacity: 0.4, movement: 1 },
    high: { bands: 7, opacity: 0.6, movement: 1.5 },
  }[intensity]

  // Speed configuration
  const speedMultiplier = {
    slow: 0.5,
    normal: 1,
    fast: 1.5,
  }[speed]

  useEffect(() => {
    if (!isClient) return

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

    // Function to resize canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const devicePixelRatio = window.devicePixelRatio || 1
      
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      
      ctx.scale(devicePixelRatio, devicePixelRatio)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }

    // Initialize aurora waves
    const initializeWaves = () => {
      waves.length = 0
      const canvasWidth = canvas.offsetWidth
      const canvasHeight = canvas.offsetHeight

      for (let i = 0; i < config.bands; i++) {
        // Ensure there's always a valid color
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

    // Animation function
    const animate = () => {
      if (!isVisible || reducedMotion) return

      const canvasWidth = canvas.offsetWidth
      const canvasHeight = canvas.offsetHeight

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Draw each aurora band
      waves.forEach((wave, index) => {
        // Update position
        wave.x += wave.speed * config.movement
        wave.angle += 0.01 * wave.speed

        // Reset wave when it goes off screen
        if (wave.x > canvasWidth + wave.width) {
          wave.x = -wave.width
          wave.y = (canvasHeight / config.bands) * index + Math.random() * 100
        }

        // Create gradient
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

        // Configure filters
        ctx.filter = `blur(${blur}px)`
        ctx.globalCompositeOperation = 'screen'

        // Draw wave
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

        // Reset filters
        ctx.filter = 'none'
        ctx.globalCompositeOperation = 'source-over'
      })

      time += 16 * speedMultiplier
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Set up intersection observer for optimization
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 }
    )

    // Initialize
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
  }, [intensity, speed, blur, reducedMotion, isVisible, colors, config, speedMultiplier, isClient])

  // Render static version if reduced motion is preferred or not client-side
  if (reducedMotion || !isClient) {
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
      
      {/* Overlay gradient to improve readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      
      {/* Additional particle effects (optional) */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => {
          // Generate consistent but random positions for SSR
          const left = (i * 17.3) % 100
          const top = (i * 23.7) % 100
          const delay = (i * 0.5) % 3
          const duration = 2 + (i % 3)
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

// Specialized component for hero sections
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

// Component for subtle backgrounds
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