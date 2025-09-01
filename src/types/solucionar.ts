// Tipos para la sección Solucionar
export interface DiscountCard {
  id: number
  text: string
  value: number
  suffix: string
  color: 'red' | 'green'
}

export interface WheelConfig {
  title: string
  subtitle: string
  description: string
  buttonText: string
  discounts: DiscountCard[]
}

export interface SolucionarHero {
  title: string
  subtitle: string
  backgroundEffect: 'aurora' | 'water' | 'particles' | 'gradient'
}

export interface FormField {
  name: string
  label: string
  type: string
  required: boolean
  placeholder: string
  validation?: {
    pattern?: string
    message?: string
    minLength?: number
    maxLength?: number
  }
}

export interface SolucionarForm {
  title: string
  fields: FormField[]
  submitText: string
  successMessage: string
  errorMessage: string
}

export interface SolucionarContact {
  micIcon: boolean
  micTooltip: string
}

export interface SolucionarPageData {
  hero: SolucionarHero
  wheel: WheelConfig
  form: SolucionarForm
  contact: SolucionarContact
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
    twitterCard: string
  }
}

// Props para componentes
export interface SolucionarSectionProps {
  hero: SolucionarHero
  wheel: WheelConfig
  form: SolucionarForm
  className?: string
}

export interface SpinWheelProps {
  discounts: DiscountCard[]
  onSpin?: (result: DiscountCard) => void
  className?: string
}

export interface WheelResultModalProps {
  isOpen: boolean
  discount: DiscountCard | null
  onClose: () => void
  onContinue: () => void
  subtitle: string
  description: string
}

export interface SolucionarFormData {
  cedula: string
  fullName: string
  phone: string
  email: string
  discountWon?: number
}