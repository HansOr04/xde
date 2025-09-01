import ProtectionClientWrapper from './ProtectionClientWrapper'
import contentData from '@/data/content.json'
import type { Metadata } from 'next'

// Metadata para SEO - Solo en Server Components
export const metadata: Metadata = {
  title: 'Protección de Datos - Intelcobro',
  description: 'Ejerce tus derechos de protección de datos personales. Acceso, rectificación, eliminación y oposición.',
  keywords: ['protección de datos', 'ARCO', 'derechos digitales', 'privacidad', 'LOPD'],
  openGraph: {
    title: 'Protección de Datos - Intelcobro',
    description: 'Ejerce tus derechos de protección de datos personales de manera fácil y segura.',
    images: ['/images/data-protection-og.jpg'],
  },
}

export default function ProteccionPage() {
  return <ProtectionClientWrapper contentData={contentData} />
}