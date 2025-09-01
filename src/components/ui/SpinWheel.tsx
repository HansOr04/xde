'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSpinWheel } from '@/hooks/useSpinWheel'
import type { SpinWheelProps, DiscountCard } from '@/types/solucionar'

export function SpinWheel({ 
  discounts, 
  onSpin,
  className 
}: SpinWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  
  const {
    isSpinning,
    currentRotation,
    spin,
    cleanup
  } = useSpinWheel(discounts, {
    onSpinComplete: (result: DiscountCard) => {
      onSpin?.(result)
    },
    spinDuration: 2000,
    minSpins: 3,
    maxSpins: 5,
  })

  // Aplicar rotación al elemento
  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${currentRotation}deg)`
    }
  }, [currentRotation])

  // Cleanup al desmontar
  useEffect(() => {
    return cleanup
  }, [cleanup])

  const getColorClasses = (color: 'red' | 'green') => {
    return color === 'red' 
      ? 'border-red-400/50 bg-gradient-to-br from-red-500/20 to-red-600/20'
      : 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-green-600/20'
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Botón de girar - Más arriba y más grande */}
      <div className="flex justify-center mb-16">
        <motion.button
          onClick={spin}
          disabled={isSpinning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-16 py-6 bg-gradient-to-r from-yellow-400 to-yellow-600",
            "text-black font-bold text-2xl rounded-full shadow-2xl",
            "border-4 border-yellow-300 hover:shadow-3xl transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            isSpinning && "animate-pulse"
          )}
        >
          {isSpinning ? "GIRANDO..." : "GIRAR RULETA"}
        </motion.button>
      </div>

      {/* Contenedor de la ruleta - Mejor centrado */}
      <div className="relative w-full h-96 overflow-hidden flex justify-center">
        {/* Flecha indicadora - En la parte superior central */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg" />
        </div>

        {/* Círculo de la ruleta perfectamente centrado */}
        <div 
          ref={wheelRef}
          className={cn(
            "relative top-32",
            "w-[600px] h-[600px] transition-transform ease-out",
            isSpinning ? "duration-[2000ms]" : "duration-300"
          )}
        >
          {/* Tarjetas de descuento distribuidas en círculo completo */}
          {discounts.map((discount, index) => {
            const angle = (360 / discounts.length) * index - 90
            const radius = 240
            const x = Math.cos((angle) * Math.PI / 180) * radius
            const y = Math.sin((angle) * Math.PI / 180) * radius
            
            return (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className={cn(
                  "absolute w-40 h-52 rounded-tr-[25px] rounded-bl-[25px]",
                  "flex flex-col justify-center items-center text-white font-bold",
                  "backdrop-blur-xl border-2 shadow-2xl",
                  "transform-origin-center font-black",
                  getColorClasses(discount.color)
                )}
                style={{
                  left: `calc(50% + ${x}px - 80px)`,
                  top: `calc(50% + ${y}px - 104px)`,
                  transform: `rotate(${angle + 90}deg)`,
                }}
              >
                <div className="text-center">
                  <div className="text-base font-bold mb-3 tracking-wide">
                    {discount.text}
                  </div>
                  <div className={cn(
                    "text-6xl font-black mb-2",
                    discount.color === 'red' 
                      ? "text-white drop-shadow-[3px_3px_0_#7F1D1D]"
                      : "text-white drop-shadow-[3px_3px_0_#365314]"
                  )}>
                    {discount.value}
                  </div>
                  <div className={cn(
                    "text-xl font-bold",
                    discount.color === 'red' ? "text-yellow-100" : "text-yellow-100"
                  )}>
                    {discount.suffix}
                  </div>
                </div>
              </motion.div>
            )
          })}

          {/* Centro de la ruleta */}
          <div className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "w-28 h-28 rounded-full z-10",
            "bg-gradient-radial from-white/30 to-white/10 backdrop-blur-sm",
            "border-2 border-white/40 shadow-xl"
          )} />
        </div>
      </div>
    </div>
  )
}