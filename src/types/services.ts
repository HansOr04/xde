// Tipos para el sistema de servicios
export interface ServiceHoverContent {
  title: string
  description: string
  benefits: string[]
  process?: string[]
  channels?: string[]
  technology?: string[]
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  image: string
  color: 'purple' | 'blue' | 'green' | 'orange'
  features: string[]
  hoverContent: ServiceHoverContent
}

export interface ServicesHero {
  title: string
  titleHighlight: string
  subtitle: string
  backgroundEffect: 'aurora' | 'water' | 'particles' | 'gradient'
}

export interface Certification {
  name: string
  logo: string
  description: string
}

export interface ServicesPageData {
  hero: ServicesHero
  items: ServiceItem[]
  certifications: Certification[]
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
    twitterCard: string
  }
}

// Props para componentes
export interface ServicesSectionProps {
  hero: ServicesHero
  services: ServiceItem[]
  certifications: Certification[]
  className?: string
}

export interface ServiceCardProps {
  service: ServiceItem
  isHovered: boolean
  onHover: (id: string | null) => void
  className?: string
}

export interface CertificationBadgeProps {
  certification: Certification
  index: number
  className?: string
}