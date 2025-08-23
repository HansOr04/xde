'use client'

import { useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HeroAuroraBackground } from '@/components/backgrounds/AuroraBackground'

interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  image: string
  color: string
  features: string[]
  hoverContent: {
    title: string
    description: string
    benefits: string[]
    process?: string[]
    channels?: string[]
    technology?: string[]
  }
}

interface HeroContent {
  title: string
  titleHighlight: string
  subtitle: string
  backgroundEffect: string
}

interface Certification {
  name: string
  logo: string
  description: string
}

interface ServicesSectionProps {
  hero: HeroContent
  services: ServiceItem[]
  certifications: Certification[]
  className?: string
}

export function ServicesSection({ hero, services, certifications, className }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  const [hoveredService, setHoveredService] = useState<string | null>(null)

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

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'border-purple-400/50 bg-gradient-to-br from-purple-500/20 to-purple-600/20',
      blue: 'border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      green: 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-green-600/20',
      orange: 'border-orange-400/50 bg-gradient-to-br from-orange-500/20 to-orange-600/20',
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.purple
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative py-16 sm:py-20 lg:py-24 overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",
        "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* Aurora Background */}
      <HeroAuroraBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto">
        
        {/* Hero Title - Más compacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight"
          >
            <span className="inline">Nuestros </span>
            <span className="inline bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Servicios
            </span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-blue-100 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed px-4"
          >
            {hero.subtitle}
          </motion.p>
        </motion.div>

        {/* Services Grid - Más compacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="relative group"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {/* Service Card - Más pequeño */}
              <div className={cn(
                "relative w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-xl border-2 overflow-hidden",
                "backdrop-blur-xl transition-all duration-500",
                "hover:scale-105 hover:shadow-2xl",
                getColorClasses(service.color)
              )}>
                
                {/* Background Image - Mucho más visible */}
                <div className="absolute inset-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Service Title (Always Visible) - Más pequeño */}
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg border border-white/20 px-2 py-1 sm:px-3 sm:py-1.5 max-w-[90%]">
                    <h3 className="text-white font-bold text-xs sm:text-sm md:text-base text-center leading-tight">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Hover Content Overlay - Más compacto */}
                <div className={cn(
                  "absolute inset-0 p-2 sm:p-3 flex flex-col justify-center items-center text-center",
                  "bg-gradient-to-br from-black/90 via-black/85 to-black/90",
                  "backdrop-blur-sm transition-all duration-500",
                  "opacity-0",
                  hoveredService === service.id && "opacity-100"
                )}>
                  
                  {/* Hover Title - Más pequeño */}
                  <h3 className="text-white font-bold text-xs sm:text-sm mb-1">
                    {service.hoverContent.title}
                  </h3>
                  
                  {/* Hover Description - Más compacto */}
                  <p className="text-blue-100 text-[9px] sm:text-[10px] mb-1.5 leading-tight max-w-[95%]">
                    {service.hoverContent.description}
                  </p>
                  
                  {/* Benefits - Más compacto */}
                  <div className="space-y-0.5 text-center">
                    <h4 className="text-white font-semibold text-[9px] sm:text-[10px] mb-0.5">Beneficios:</h4>
                    <div className="space-y-0.5">
                      {service.hoverContent.benefits.slice(0, 2).map((benefit, index) => (
                        <div key={index} className="text-blue-200 text-[8px] sm:text-[9px] leading-tight">
                          • {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info - Más compacto */}
                  {service.hoverContent.process && (
                    <div className="mt-1 pt-1 border-t border-white/20 text-center">
                      <div className="text-blue-200 text-[8px] sm:text-[9px] leading-tight">
                        {service.hoverContent.process[0]}
                      </div>
                    </div>
                  )}

                  {service.hoverContent.channels && (
                    <div className="mt-1 pt-1 border-t border-white/20 text-center">
                      <div className="text-blue-200 text-[8px] sm:text-[9px] leading-tight">
                        {service.hoverContent.channels[0]}
                      </div>
                    </div>
                  )}

                  {service.hoverContent.technology && (
                    <div className="mt-1 pt-1 border-t border-white/20 text-center">
                      <div className="text-blue-200 text-[8px] sm:text-[9px] leading-tight">
                        {service.hoverContent.technology[0]}
                      </div>
                    </div>
                  )}
                </div>

                {/* Glow Effect on Hover */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl transition-opacity duration-500",
                  "opacity-0 pointer-events-none",
                  hoveredService === service.id && "opacity-100",
                  service.color === 'purple' && "shadow-2xl shadow-purple-500/30",
                  service.color === 'blue' && "shadow-2xl shadow-blue-500/30",
                  service.color === 'green' && "shadow-2xl shadow-green-500/30",
                  service.color === 'orange' && "shadow-2xl shadow-orange-500/30"
                )} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications Section - Solo imágenes */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center px-4"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/10 p-4 sm:p-6 inline-block w-full max-w-5xl"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 items-center">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  variants={itemVariants}
                  className="group flex items-center justify-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Solo la imagen sin texto */}
                  <img
                    src={cert.logo}
                    alt={cert.name}
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient transition - Más sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  )
}