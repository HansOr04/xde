import ServicesClientWrapper from './ServicesClientWrapper'
import contentData from '@/data/content.json'
import type { Metadata } from 'next'

// Metadata para SEO - Solo en Server Components
export const metadata: Metadata = {
  title: 'Nuestros Servicios - Intelcobro',
  description: 'Descubre nuestros servicios especializados: Compra de Cartera, Fábrica de Crédito, Gestión de Cobranza y Contact Center.',
  keywords: ['compra de cartera', 'fábrica de crédito', 'gestión de cobranza', 'contact center'],
  openGraph: {
    title: 'Servicios de Cobranza - Intelcobro',
    description: 'Servicios especializados en gestión de cobranza y recuperación de cartera.',
    images: ['/images/services-og.jpg'],
  },
}

export default function ServicesPage() {
  return <ServicesClientWrapper contentData={contentData} />
}