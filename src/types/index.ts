// Tipos principales de la aplicación
export interface NavigationItem {
  id: string
  label: string
  href: string
  active?: boolean
  external?: boolean
  icon?: string
}

export interface HeroContent {
  title: string
  subtitle?: string
  description?: string
  ctaText: string
  ctaLink: string
  backgroundEffect?: 'aurora' | 'water' | 'particles' | 'gradient'
}

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  twitterCard?: string
  canonicalUrl?: string
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
}

export interface AnimationConfig {
  enabled: boolean
  duration: 'fast' | 'normal' | 'slow'
  reducedMotion: boolean
  stagger: boolean
}

export interface ContentData {
  [key: string]: any
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  service?: string
  preferredContact?: 'email' | 'phone' | 'whatsapp'
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

// Re-exportar tipos de video
export * from './video'