import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Función para combinar clases de Tailwind CSS de manera inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Función para formatear delays en animaciones
 */
export function formatDelay(index: number, baseDelay: number = 100): number {
  return index * baseDelay
}

/**
 * Función para detectar si un dispositivo soporta hover
 */
export function supportsHover(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover)').matches
}

/**
 * Función para verificar si el dispositivo prefiere animaciones reducidas
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Función para validar si un video puede reproducirse
 */
export function canPlayVideo(): boolean {
  if (typeof document === 'undefined') return false
  const video = document.createElement('video')
  return !!(video.canPlayType && video.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/no/, ''))
}

/**
 * Función para detectar el tipo de fondo del video
 */
export function detectVideoBackground(videoElement: HTMLVideoElement): 'black' | 'white' | 'transparent' {
  // Crear canvas temporal para analizar el primer frame
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return 'transparent'
  
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight
  
  ctx.drawImage(videoElement, 0, 0)
  
  // Analizar las esquinas del video
  const corners = [
    ctx.getImageData(0, 0, 1, 1).data,
    ctx.getImageData(canvas.width - 1, 0, 1, 1).data,
    ctx.getImageData(0, canvas.height - 1, 1, 1).data,
    ctx.getImageData(canvas.width - 1, canvas.height - 1, 1, 1).data,
  ]
  
  const isBlack = corners.every(pixel => {
    const r = pixel[0] || 0
    const g = pixel[1] || 0
    const b = pixel[2] || 0
    return r < 50 && g < 50 && b < 50
  })
  
  const isWhite = corners.every(pixel => {
    const r = pixel[0] || 0
    const g = pixel[1] || 0
    const b = pixel[2] || 0
    return r > 200 && g > 200 && b > 200
  })
  
  if (isBlack) return 'black'
  if (isWhite) return 'white'
  return 'transparent'
}

/**
 * Función para aplicar filtros de remoción de fondo
 */
export function applyBackgroundRemoval(
  element: HTMLVideoElement, 
  backgroundType: 'black' | 'white' | 'transparent'
): void {
  switch (backgroundType) {
    case 'black':
      element.style.mixBlendMode = 'screen'
      element.style.filter = 'contrast(1.2) brightness(1.1)'
      break
    case 'white':
      element.style.mixBlendMode = 'multiply'
      element.style.filter = 'contrast(1.3) brightness(0.9)'
      break
    default:
      element.style.mixBlendMode = 'normal'
      element.style.filter = 'none'
  }
}

/**
 * Función para crear un observer de intersección optimizado
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * Función para debounce de eventos
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Función para throttle de eventos
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Función para generar IDs únicos
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Función para formatear errores de manera consistente
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Ha ocurrido un error inesperado'
}

/**
 * Función para validar URLs
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

/**
 * Función para obtener el contraste de color
 */
export function getContrastRatio(foreground: string, background: string): number {
  // Implementación simplificada del contraste WCAG
  const getLuminance = (color: string): number => {
    // Convertir hex a RGB y calcular luminancia
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * (rs || 0) + 0.7152 * (gs || 0) + 0.0722 * (bs || 0)
  }
  
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}