'use client'

import { useState, useCallback, useRef } from 'react'
import type { DiscountCard } from '@/types/solucionar'

interface UseSpinWheelOptions {
  onSpinComplete?: (result: DiscountCard) => void
  spinDuration?: number
  minSpins?: number
  maxSpins?: number
}

export function useSpinWheel(
  discounts: DiscountCard[], 
  options: UseSpinWheelOptions = {}
) {
  const {
    onSpinComplete,
    spinDuration = 3000,
    minSpins = 5,
    maxSpins = 10,
  } = options

  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [result, setResult] = useState<DiscountCard | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const spin = useCallback(() => {
    if (isSpinning || discounts.length === 0) return

    setIsSpinning(true)
    setResult(null)

    // Calcular rotación aleatoria básica
    const randomSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins
    const baseRotation = randomSpins * 360
    const randomAngle = Math.random() * 360

    // Siempre debe salir 10% - Buscar específicamente el descuento de 10%
    const targetDiscount = discounts.find(discount => discount.value === 10)
    
    if (!targetDiscount) {
      console.error('No se encontró el descuento de 10% en la configuración')
      setIsSpinning(false)
      return
    }

    // Encontrar la posición del 10% en el array
    const targetIndex = discounts.findIndex(discount => discount.value === 10)
    const segmentAngle = 360 / discounts.length
    
    // Calcular el ángulo exacto donde está el 10%
    const targetAngle = (segmentAngle * targetIndex) - 90 // -90 para empezar desde arriba
    
    // Agregar rotaciones completas + ángulo específico para caer exactamente en 10%
    const fullRotations = 3 + Math.floor(Math.random() * 3) // 3-5 vueltas
    const finalRotation = currentRotation + (fullRotations * 360) + (360 - (targetAngle % 360))
    
    setCurrentRotation(finalRotation)

    const selectedDiscount = targetDiscount

    // Timeout para finalizar el giro
    timeoutRef.current = setTimeout(() => {
      setIsSpinning(false)
      setResult(selectedDiscount)
      onSpinComplete?.(selectedDiscount)
    }, spinDuration)

  }, [isSpinning, discounts, currentRotation, minSpins, maxSpins, spinDuration, onSpinComplete])

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsSpinning(false)
    setCurrentRotation(0)
    setResult(null)
  }, [])

  const autoSpin = useCallback((delay: number = 500) => {
    setTimeout(() => {
      spin()
    }, delay)
  }, [spin])

  // Cleanup
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    isSpinning,
    currentRotation,
    result,
    spin,
    reset,
    autoSpin,
    cleanup,
  }
}