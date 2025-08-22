// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
} as const

// Endpoints de la API
export const API_ENDPOINTS = {
  // Contacto y formularios
  CONTACT: '/contact',
  LEADS: '/leads',
  QUOTE: '/quote',
  
  // Autenticación
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  // Recursos
  CONTENT: '/content',
  SERVICES: '/services',
  TESTIMONIALS: '/testimonials',
  
  // Archivos
  UPLOAD: '/upload',
  DOWNLOAD: '/download',
} as const

// Configuración de videos
export const VIDEO_CONFIG = {
  FORMATS: ['mp4', 'webm', 'ogg'] as const,
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  PRELOAD_STRATEGY: 'metadata' as const,
  CROSSORIGIN: 'anonymous' as const,
  
  // Configuración de fondo transparente
  BACKGROUND_REMOVAL: {
    BLACK_THRESHOLD: 50,
    WHITE_THRESHOLD: 200,
    CONTRAST_MULTIPLIER: 1.2,
    BRIGHTNESS_MULTIPLIER: 1.1,
  },
} as const

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    EXTRA_SLOW: 1000,
  },
  EASING: {
    LINEAR: 'linear',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  STAGGER_DELAY: 100, // ms entre elementos
} as const

// Configuración de glassmorphism
export const GLASS_CONFIG = {
  BACKGROUND: 'rgba(255, 255, 255, 0.1)',
  BACKDROP_BLUR: '10px',
  BORDER: '1px solid rgba(255, 255, 255, 0.2)',
  SHADOW: '0 8px 32px rgba(0, 0, 0, 0.1)',
  
  // Variantes
  SUBTLE: {
    BACKGROUND: 'rgba(255, 255, 255, 0.05)',
    BACKDROP_BLUR: '5px',
    BORDER: '1px solid rgba(255, 255, 255, 0.1)',
  },
  STRONG: {
    BACKGROUND: 'rgba(255, 255, 255, 0.15)',
    BACKDROP_BLUR: '15px',
    BORDER: '1px solid rgba(255, 255, 255, 0.3)',
  },
} as const

// Configuración de la aurora
export const AURORA_CONFIG = {
  BANDS: {
    LOW: 3,
    MEDIUM: 5,
    HIGH: 7,
  },
  OPACITY: {
    LOW: 0.2,
    MEDIUM: 0.4,
    HIGH: 0.6,
  },
  SPEED: {
    SLOW: 0.5,
    NORMAL: 1,
    FAST: 1.5,
  },
  BLUR: {
    DEFAULT: 50,
    MOBILE: 30,
    DESKTOP: 70,
  },
  COLORS: [
    'rgba(147, 197, 253, 0.3)', // blue-300
    'rgba(196, 181, 253, 0.3)', // purple-300
    'rgba(249, 168, 212, 0.3)', // pink-300
    'rgba(252, 165, 165, 0.3)', // red-300
    'rgba(253, 186, 116, 0.3)', // orange-300
    'rgba(134, 239, 172, 0.3)', // green-300
  ],
} as const

// Configuración de breakpoints
export const BREAKPOINTS = {
  XS: 475,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
  '3XL': 1600,
} as const

// Configuración de Z-index
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica tu internet.',
  TIMEOUT: 'La solicitud tardó demasiado. Intenta de nuevo.',
  UNAUTHORIZED: 'No tienes permisos para esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  VALIDATION: 'Los datos ingresados no son válidos.',
  GENERIC: 'Ha ocurrido un error inesperado.',
  
  // Específicos de video
  VIDEO_LOAD_ERROR: 'Error al cargar el video.',
  VIDEO_PLAY_ERROR: 'No se pudo reproducir el video.',
  VIDEO_FORMAT_ERROR: 'Formato de video no soportado.',
  
  // Específicos de audio
  AUDIO_PERMISSION: 'Se requiere permiso para usar el micrófono.',
  AUDIO_NOT_SUPPORTED: 'Tu navegador no soporta grabación de audio.',
} as const

// Configuración de localStorage keys
export const STORAGE_KEYS = {
  THEME: 'intelcobro-theme',
  USER_PREFERENCES: 'intelcobro-preferences',
  FORM_DATA: 'intelcobro-form-data',
  CART: 'intelcobro-cart',
  AUTH_TOKEN: 'intelcobro-auth-token',
  LAST_VISIT: 'intelcobro-last-visit',
} as const

// Configuración de cookies
export const COOKIE_CONFIG = {
  CONSENT: 'intelcobro-consent',
  SESSION: 'intelcobro-session',
  PREFERENCES: 'intelcobro-prefs',
  
  // Opciones por defecto
  OPTIONS: {
    SECURE: true,
    SAME_SITE: 'lax' as const,
    MAX_AGE: 30 * 24 * 60 * 60, // 30 días
  },
} as const

// Configuración de SEO
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Intelcobro - Conecta con el futuro de la cobranza',
  TITLE_TEMPLATE: '%s | Intelcobro',
  DEFAULT_DESCRIPTION: 'Especialistas en gestión de cobranza inteligente con tecnología avanzada.',
  SITE_NAME: 'Intelcobro',
  SITE_URL: 'https://intelcobro.com',
  TWITTER_HANDLE: '@intelcobro',
  
  // Configuración de Open Graph
  OG_IMAGE: '/images/og-image.jpg',
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,
  
  // Keywords comunes
  KEYWORDS: [
    'cobranza',
    'gestión de cartera',
    'recuperación de deuda',
    'servicios financieros',
    'Ecuador',
    'tecnología financiera',
    'cobranza inteligente',
  ],
} as const

// Configuración de contacto
export const CONTACT_CONFIG = {
  PHONE: '+593-2-345-6789',
  EMAIL: 'contacto@intelcobro.com',
  ADDRESS: 'Av. Principal 123, Quito, Ecuador',
  BUSINESS_HOURS: 'Lunes a Viernes, 8:00 AM - 6:00 PM',
  
  // Redes sociales
  SOCIAL_LINKS: {
    FACEBOOK: 'https://facebook.com/intelcobro',
    LINKEDIN: 'https://linkedin.com/company/intelcobro',
    TWITTER: 'https://twitter.com/intelcobro',
    YOUTUBE: 'https://youtube.com/@intelcobro',
  },
} as const

// Configuración de formularios
export const FORM_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  
  // Validaciones
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
  PHONE_PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
  EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
} as const

// Configuración de performance
export const PERFORMANCE_CONFIG = {
  // Intersection Observer
  INTERSECTION_THRESHOLD: 0.1,
  INTERSECTION_ROOT_MARGIN: '50px',
  
  // Lazy loading
  LAZY_LOAD_OFFSET: 100,
  
  // Debounce/throttle
  SCROLL_THROTTLE: 16, // 60fps
  RESIZE_DEBOUNCE: 250,
  SEARCH_DEBOUNCE: 300,
  
  // Cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
} as const