import CareersClientWrapper from './CareersClientWrapper'
import contentData from '@/data/content.json'
import type { Metadata } from 'next'

// Metadata para SEO - Solo en Server Components
export const metadata: Metadata = {
  title: 'Trabaja con Nosotros - Intelcobro',
  description: '¡Destaca en Intelcobro! Si tienes talento, confianza y ambición de llegar alto, únete a nuestro equipo.',
  keywords: ['empleo', 'trabajo', 'carreras', 'recursos humanos', 'intelcobro', 'oportunidades laborales'],
  openGraph: {
    title: 'Trabaja con Nosotros - Intelcobro',
    description: 'Forma parte de nuestro equipo y desarrolla tu carrera profesional.',
    images: ['/images/careers-og.jpg'],
  },
}

export default function TrabajarPage() {
  return <CareersClientWrapper contentData={contentData} />
}