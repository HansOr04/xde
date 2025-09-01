'use client'

import { useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Eye, Edit, Trash2, Shield, Download, Mail, Phone, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CTAButton } from '@/components/ui/Button'
import { HeroAuroraBackground } from '@/components/backgrounds/AuroraBackground'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'

interface Right {
  id: string
  title: string
  description: string
  icon: string
  color: 'blue' | 'green' | 'red' | 'purple'
  details: string
  processingTime: string
  requirements: string[]
  warning?: string
}

interface DownloadSection {
  title: string
  description: string
  buttonText: string
  downloadUrl: string
  alternativeText: string
  instructions: string
}

interface Contact {
  email: string
  subject: string
  phone: string
  address: string
  schedule: string
}

interface LegalInfo {
  responsibleEntity: string
  ruc: string
  address: string
  dataProtectionOfficer: string
  regulatoryFramework: string
}

interface ProtectionHero {
  title: string
  subtitle: string
  description: string
  backgroundEffect: string
}

interface ProtectionSectionProps {
  hero: ProtectionHero
  rights: Right[]
  downloadSection: DownloadSection
  contact: Contact
  legalInfo: LegalInfo
  className?: string
}

export function ProtectionSection({
  hero,
  rights,
  downloadSection,
  contact,
  legalInfo,
  className
}: ProtectionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const { speak, isSpeaking, stopSpeaking } = useSpeechSynthesis()

  // Animaciones
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  // Obtener icono por nombre
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'eye':
        return <Eye className="w-6 h-6" />
      case 'edit':
        return <Edit className="w-6 h-6" />
      case 'trash':
        return <Trash2 className="w-6 h-6" />
      case 'shield':
        return <Shield className="w-6 h-6" />
      default:
        return <Shield className="w-6 h-6" />
    }
  }

  // Obtener colores por nombre
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30',
      green: 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30',
      red: 'border-red-400/50 bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30',
      purple: 'border-purple-400/50 bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30',
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  // Función para manejar descarga del archivo
  const handleDownload = () => {
    // Si es un enlace externo, abrir en nueva pestaña
    if (downloadSection.downloadUrl.startsWith('http')) {
      window.open(downloadSection.downloadUrl, '_blank')
    } else {
      // Si es un archivo local, crear elemento para descarga
      const link = document.createElement('a')
      link.href = downloadSection.downloadUrl
      link.download = 'formulario-derechos-arco.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Función para hablar el contenido de un derecho
  const handleSpeakRight = (right: Right) => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      const text = `${right.title}. ${right.details}. Tiempo de procesamiento: ${right.processingTime}. Requisitos: ${right.requirements.join(', ')}.`
      speak(text)
    }
  }

  // Función para hablar información general
  const handleSpeakHero = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      const text = `${hero.title}. ${hero.subtitle}. ${hero.description}`
      speak(text)
    }
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative py-16 sm:py-20 lg:py-24 overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",
        // Padding top responsive para compensar header fijo
        "pt-20 sm:pt-24 lg:pt-28",
        "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* Aurora Background */}
      <HeroAuroraBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto">
        
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {hero.title}
            </h1>
            <button
              onClick={handleSpeakHero}
              className={cn(
                "p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all",
                isSpeaking && "animate-pulse bg-blue-500/30"
              )}
              title="Escuchar información"
            >
              🔊
            </button>
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-4 font-semibold"
          >
            {hero.subtitle}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-blue-100 max-w-3xl mx-auto leading-relaxed px-4"
          >
            {hero.description}
          </motion.p>
        </motion.div>

        {/* Rights Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {rights.map((right, index) => (
            <motion.div
              key={right.id}
              variants={itemVariants}
              className={cn(
                "relative group cursor-pointer p-6 rounded-xl border-2 backdrop-blur-xl transition-all duration-500",
                "hover:scale-105 hover:shadow-2xl",
                getColorClasses(right.color),
                selectedRight === right.id && "scale-105 shadow-2xl ring-2 ring-white/30"
              )}
              onClick={() => setSelectedRight(selectedRight === right.id ? null : right.id)}
            >
              {/* Icon Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  {getIcon(right.icon)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSpeakRight(right)
                  }}
                  className={cn(
                    "p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100",
                    isSpeaking && "animate-pulse bg-blue-500/30 opacity-100"
                  )}
                  title="Escuchar información del derecho"
                >
                  🔊
                </button>
              </div>

              {/* Content */}
              <h3 className="text-white font-bold text-lg mb-2">{right.title}</h3>
              <p className="text-blue-100 text-sm mb-4">{right.description}</p>

              {/* Expandable Details */}
              <div className={cn(
                "overflow-hidden transition-all duration-500",
                selectedRight === right.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pt-4 border-t border-white/20 space-y-3">
                  <p className="text-blue-100 text-xs leading-relaxed">
                    {right.details}
                  </p>
                  
                  <div>
                    <h4 className="text-white font-semibold text-xs mb-1">Tiempo de procesamiento:</h4>
                    <p className="text-blue-200 text-xs">{right.processingTime}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-xs mb-1">Requisitos:</h4>
                    <ul className="text-blue-200 text-xs space-y-1">
                      {right.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start">
                          <span className="text-blue-400 mr-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {right.warning && (
                    <div className="p-2 bg-red-500/20 border border-red-400/50 rounded text-red-200 text-xs">
                      ⚠️ {right.warning}
                    </div>
                  )}
                </div>
              </div>

              {/* Click indicator */}
              <div className="absolute bottom-2 right-2 text-white/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {selectedRight === right.id ? 'Click para cerrar' : 'Click para detalles'}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Download Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 sm:p-12 text-center shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {downloadSection.title}
            </h2>
            
            <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {downloadSection.description}
            </p>

            <CTAButton
              size="xl"
              onClick={handleDownload}
              leftIcon={<Download className="w-5 h-5" />}
              className="mb-6 shadow-2xl"
            >
              {downloadSection.buttonText}
            </CTAButton>

            <div className="text-sm text-blue-200 space-y-2">
              <p>{downloadSection.alternativeText}</p>
              <p className="font-medium">{downloadSection.instructions}</p>
              <div className="flex items-center justify-center gap-2 text-blue-300">
                <Mail className="w-4 h-4" />
                <span>{contact.email}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Contact Details */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Información de Contacto
            </h3>
            
            <div className="space-y-4 text-blue-100">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-blue-400" />
                <div>
                  <p className="font-medium">{contact.email}</p>
                  <p className="text-xs text-blue-200">Asunto: {contact.subject}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 text-blue-400" />
                <p>{contact.phone}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-blue-400" />
                <p className="text-sm">{contact.address}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-1 text-blue-400" />
                <p className="text-sm">{contact.schedule}</p>
              </div>
            </div>
          </motion.div>

          {/* Legal Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Información Legal
            </h3>
            
            <div className="space-y-3 text-blue-100 text-sm">
              <div>
                <span className="font-medium text-white">Entidad Responsable:</span>
                <p>{legalInfo.responsibleEntity}</p>
                <p className="text-blue-200">RUC: {legalInfo.ruc}</p>
              </div>
              
              <div>
                <span className="font-medium text-white">Dirección:</span>
                <p>{legalInfo.address}</p>
              </div>
              
              <div>
                <span className="font-medium text-white">Oficial de Protección de Datos:</span>
                <p>{legalInfo.dataProtectionOfficer}</p>
              </div>
              
              <div>
                <span className="font-medium text-white">Marco Regulatorio:</span>
                <p>{legalInfo.regulatoryFramework}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  )
}