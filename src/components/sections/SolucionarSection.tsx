'use client'

import { useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { Send, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CTAButton } from '@/components/ui/Button'
import { SpinWheel } from '@/components/ui/SpinWheel'
import { HeroAuroraBackground } from '@/components/backgrounds/AuroraBackground'
import type { SolucionarSectionProps, DiscountCard, SolucionarFormData } from '@/types/solucionar'

export function SolucionarSection({ 
  hero, 
  wheel, 
  form,
  className 
}: SolucionarSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  
  const [formData, setFormData] = useState<SolucionarFormData>({
    cedula: '',
    fullName: '',
    phone: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [wonDiscount, setWonDiscount] = useState<DiscountCard | null>(null)
  const [showForm, setShowForm] = useState(false)

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

  // Manejar resultado de la ruleta
  const handleSpinResult = (discount: DiscountCard) => {
    setWonDiscount(discount)
    // Mostrar el formulario inmediatamente después de que pare la ruleta
    setTimeout(() => {
      setShowForm(true)
    }, 500)
  }

  // Manejar cambios en el formulario
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const submitData = {
        ...formData,
        discountWon: wonDiscount?.value
      }
      
      console.log('Form data:', submitData)
      
      setSubmitStatus('success')
      setFormData({
        cedula: '',
        fullName: '',
        phone: '',
        email: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-screen flex flex-col overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",
        "pt-20 sm:pt-24 lg:pt-28",
        "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* Aurora Background */}
      <HeroAuroraBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto flex-1 flex flex-col">
        
        {/* Hero Section - Compacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-8"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            {hero.title}
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>
        </motion.div>

        <div className="flex-1 flex items-center justify-center">
          {!showForm ? (
            // Mostrar solo la ruleta hasta que se complete el giro
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="w-full max-w-4xl"
            >
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <SpinWheel
                  discounts={wheel.discounts}
                  onSpin={handleSpinResult}
                  className="w-full"
                />
              </motion.div>
            </motion.div>
          ) : (
            // Mostrar contenido del resultado y formulario
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full max-w-7xl">
              
              {/* Resultado de la ruleta */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-400/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
              >
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <PartyPopper className="w-16 h-16 text-yellow-400 animate-bounce" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white">
                    {wheel.title}
                  </h3>
                  
                  <p className="text-2xl text-green-100">
                    {wonDiscount && wheel.subtitle.replace('{discount}', wonDiscount.value.toString())}
                  </p>
                  
                  <p className="text-lg text-green-200">
                    {wheel.description}
                  </p>

                  {/* Mostrar la tarjeta ganadora */}
                  {wonDiscount && (
                    <div className="bg-white/10 rounded-xl p-4 mx-auto max-w-xs">
                      <div className="text-center">
                        <div className="text-sm font-bold mb-1 text-white">
                          {wonDiscount.text}
                        </div>
                        <div className="text-6xl font-black text-yellow-300 mb-1">
                          {wonDiscount.value}
                        </div>
                        <div className="text-lg font-bold text-yellow-200">
                          {wonDiscount.suffix}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Formulario */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  {form.title}
                </h3>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-400/50 rounded-lg text-green-200 text-sm"
                  >
                    {form.successMessage}
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 text-sm"
                  >
                    {form.errorMessage}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {form.fields.map((field) => (
                    <div key={field.name}>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name as keyof SolucionarFormData] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all text-lg"
                      />
                    </div>
                  ))}

                  <CTAButton
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full mt-6"
                    leftIcon={isSubmitting ? undefined : <Send className="w-5 h-5" />}
                  >
                    {isSubmitting ? 'Enviando...' : form.submitText}
                  </CTAButton>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Gradiente inferior para transición suave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  )
}