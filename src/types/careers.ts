// Tipos para el sistema de carreras/trabajar
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'select' | 'file' | 'textarea'
  required: boolean
  placeholder: string
  options?: string[]
  accept?: string
  maxSize?: string
  description?: string
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

export interface CareersForm {
  title: string
  fields: FormField[]
  submitText: string
  successMessage: string
  errorMessage: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
  color: string
}

export interface Location {
  city: string
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Benefit {
  id: string
  title: string
  description: string
  icon: string
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}

export interface Position {
  id: string
  title: string
  department: string
  type: string
  experience: string
  location: string
  description: string
  requirements: string[]
}

export interface ContactInfo {
  email: string
  phone: string
  whatsapp: string
  businessHours: string
}

export interface CareersHero {
  title: string
  subtitle: string
  description: string
  backgroundEffect: 'aurora' | 'water' | 'particles' | 'gradient'
}

export interface CareersPageData {
  hero: CareersHero
  form: CareersForm
  socialLinks: SocialLink[]
  locations: Location[]
  benefits: Benefit[]
  positions: Position[]
  contact: ContactInfo
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
    twitterCard: string
  }
}

// Props para componentes
export interface CareersSectionProps {
  hero: CareersHero
  form: CareersForm
  socialLinks: SocialLink[]
  locations: Location[]
  benefits: Benefit[]
  positions: Position[]
  contact: ContactInfo
  className?: string
}

export interface JobApplicationFormProps {
  form: CareersForm
  onSubmit: (data: JobApplicationData) => void
  isSubmitting: boolean
  className?: string
}

export interface JobApplicationData {
  fullName: string
  email: string
  position: string
  cv: File
  [key: string]: any
}

export interface BenefitCardProps {
  benefit: Benefit
  index: number
  className?: string
}

export interface PositionCardProps {
  position: Position
  onApply: (positionId: string) => void
  className?: string
}

export interface SocialLinksProps {
  links: SocialLink[]
  className?: string
}

export interface LocationsListProps {
  locations: Location[]
  className?: string
}