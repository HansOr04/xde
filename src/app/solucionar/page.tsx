import SolucionarClientWrapper from './SolucionarClientWrapper'
import contentData from '@/data/content.json'
import type { Metadata } from 'next'

// Metadata para SEO - Solo en Server Components
export const metadata: Metadata = {
  title: 'Soluciona tu Deuda - Intelcobro',
  description: 'Te ayudamos a encontrar la mejor solución para tu situación financiera. Obtén descuentos especiales en nuestros servicios.',
  keywords: ['solución de deudas', 'asesoría financiera', 'descuentos', 'refinanciamiento', 'negociación de deudas'],
  openGraph: {
    title: 'Soluciona tu Deuda - Intelcobro',
    description: 'Obtén descuentos especiales y encuentra la mejor solución para tu situación financiera.',
    images: ['/images/solucionar-og.jpg'],
  },
}

export default function SolucionarPage() {
  return <SolucionarClientWrapper contentData={contentData} />
}