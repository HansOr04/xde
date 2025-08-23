'use client'

import { useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Upload, Send, MapPin, Users, TrendingUp, Award, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CTAButton } from '@/components/ui/Button'
import { HeroAuroraBackground } from '@/components/backgrounds/AuroraBackground'

interface FormField {
  name: string
  label: string
  type: string
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

interface SocialLink {
  platform: string
  url: string
  icon: string
  color: string
}

interface Location {
  city: string
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface Benefit {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

interface ContactInfo {
  email: string
  phone: string
  whatsapp: string
  businessHours: string
}

interface CareersHero {
  title: string
  subtitle: string
  description: string
  backgroundEffect: string
}

interface CareersForm {
  title: string
  fields: FormField[]
  submitText: string
  successMessage: string
  errorMessage: string
}

interface CareersSectionProps {
  hero: CareersHero
  form: CareersForm
  socialLinks: SocialLink[]
  locations: Location[]
  benefits: Benefit[]
  contact: ContactInfo
  className?: string
}

export function CareersSection({ 
  hero, 
  form, 
  socialLinks, 
  locations, 
  benefits, 
  contact,
  className 
}: CareersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

  // Manejar cambios en el formulario
  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Manejar selección de archivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleInputChange('cv', file)
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aquí iría la lógica real de envío
      console.log('Form data:', formData)
      console.log('File:', selectedFile)
      
      setSubmitStatus('success')
      setFormData({})
      setSelectedFile(null)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obtener icono por nombre - Con iconos reales de redes sociales
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending-up':
        return <TrendingUp className="w-4 h-4" />
      case 'users':
        return <Users className="w-4 h-4" />
      case 'lightbulb':
        return <Lightbulb className="w-4 h-4" />
      case 'award':
        return <Award className="w-4 h-4" />
      case 'map-pin':
        return <MapPin className="w-4 h-4" />
      case 'linkedin':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case 'instagram':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        )
      case 'facebook':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      case 'music':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        )
      default:
        return <Users className="w-4 h-4" />
    }
  }

  // Obtener colores por nombre
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      green: 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-green-600/20',
      yellow: 'border-yellow-400/50 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20',
      purple: 'border-purple-400/50 bg-gradient-to-br from-purple-500/20 to-purple-600/20',
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative py-8 sm:py-10 lg:py-12 overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",
        // Agregar padding top para compensar header fijo
        "pt-20 sm:pt-24 lg:pt-28",
        "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* Aurora Background */}
      <HeroAuroraBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto">
        
        {/* Hero Section - Muy compacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-6"
        >
          <motion.h1
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight"
          >
            {hero.title}
          </motion.h1>
          
          <motion.h2
            variants={itemVariants}
            className="text-base sm:text-lg text-blue-200 mb-2 font-semibold"
          >
            {hero.subtitle}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed px-4"
          >
            {hero.description}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
          
          {/* Formulario de Aplicación - Muy compacto */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="order-2 lg:order-1"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 p-3 sm:p-4 shadow-2xl"
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                {form.title}
              </h3>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-2 bg-green-500/20 border border-green-400/50 rounded text-green-200 text-xs"
                >
                  {form.successMessage}
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-2 bg-red-500/20 border border-red-400/50 rounded text-red-200 text-xs"
                >
                  {form.errorMessage}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {form.fields.map((field) => (
                  <motion.div
                    key={field.name}
                    variants={itemVariants}
                    className="space-y-1"
                  >
                    <label className="block text-xs font-medium text-white">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'text' || field.type === 'email' ? (
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-2 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all text-xs"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-2 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all text-xs"
                      >
                        <option value="" className="bg-gray-800 text-white">
                          {field.placeholder}
                        </option>
                        {field.options?.map((option) => (
                          <option key={option} value={option} className="bg-gray-800 text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'file' ? (
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="file"
                            name={field.name}
                            accept={field.accept}
                            required={field.required}
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-full px-2 py-2 bg-white/10 border-2 border-dashed border-white/30 rounded text-center hover:border-blue-400/50 transition-all cursor-pointer group">
                            <Upload className="w-4 h-4 text-white/70 mx-auto mb-1 group-hover:text-blue-400 transition-colors" />
                            {selectedFile ? (
                              <div className="space-y-1">
                                <p className="text-white font-medium text-xs">{selectedFile.name}</p>
                                <p className="text-white/70 text-xs">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-white/70 text-xs">Sin archivos seleccionados</p>
                                <p className="text-white/50 text-xs">Haz clic para seleccionar</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {field.description && (
                          <p className="text-white/60 text-xs">{field.description}</p>
                        )}
                      </div>
                    ) : null}
                  </motion.div>
                ))}

                <motion.div variants={itemVariants} className="pt-1">
                  <CTAButton
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="w-full"
                    leftIcon={isSubmitting ? undefined : <Send className="w-3 h-3" />}
                  >
                    <span className="text-xs">
                      {isSubmitting ? 'Enviando...' : form.submitText}
                    </span>
                  </CTAButton>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>

          {/* Información y Redes Sociales - Muy compacto */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="order-1 lg:order-2 space-y-4"
          >
            
            {/* Redes Sociales */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-bold text-white mb-2">Síguenos en:</h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded transition-all group text-xs"
                  >
                    {getIcon(social.icon)}
                    <span className="text-white group-hover:text-blue-200 capitalize transition-colors">
                      {social.platform}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Ubicaciones */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-bold text-white mb-2">Ubicaciones:</h3>
              <div className="space-y-2">
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="p-2 bg-white/10 border border-white/20 rounded"
                  >
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold text-xs mb-0.5">{location.city}</h4>
                        <p className="text-blue-100 text-xs leading-relaxed">{location.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Información de Contacto */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-bold text-white mb-2">Contacto:</h3>
              <div className="space-y-1 text-blue-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-400 text-sm">📧</span>
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-400 text-sm">📞</span>
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-400 text-sm">⏰</span>
                  <span>{contact.businessHours}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Beneficios - Muy compacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2
            variants={itemVariants}
            className="text-base sm:text-lg font-bold text-white text-center mb-4"
          >
            ¿Por qué trabajar con nosotros?
          </motion.h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.id}
                variants={itemVariants}
                className={cn(
                  "p-3 rounded border backdrop-blur-xl transition-all hover:scale-105",
                  getColorClasses(benefit.color)
                )}
              >
                <div className="text-center">
                  <div className="inline-flex p-1.5 rounded-full bg-white/20 mb-2">
                    {getIcon(benefit.icon)}
                  </div>
                  <h3 className="text-white font-bold text-xs mb-1">{benefit.title}</h3>
                  <p className="text-blue-100 text-xs">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gradiente inferior para transición suave */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  )
}