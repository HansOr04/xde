'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/sections/HeroSection'
import contentData from '@/data/content.json'
import type { VideoConfig, HeroContent } from '@/types'

// Loading component para Suspense - Completamente responsive
function HeroSectionSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center pt-14 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          {/* Skeleton del contenido - Completamente responsive */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-10 sm:h-12 md:h-14 lg:h-16 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-10 sm:h-12 md:h-14 lg:h-16 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-10 sm:h-12 md:h-14 lg:h-16 bg-white/10 rounded-lg animate-pulse" />
            </div>
            <div className="h-6 sm:h-7 lg:h-8 bg-white/10 rounded-lg animate-pulse w-3/4 mx-auto lg:mx-0" />
            <div className="h-4 sm:h-5 lg:h-6 bg-white/10 rounded-lg animate-pulse w-full" />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <div className="h-12 sm:h-14 lg:h-16 bg-white/10 rounded-lg animate-pulse w-full sm:w-40" />
              <div className="h-12 sm:h-14 lg:h-16 bg-white/10 rounded-lg animate-pulse w-full sm:w-32" />
            </div>
          </div>
          
          {/* Skeleton del video - Completamente responsive */}
          <div className="flex justify-center order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="aspect-square w-64 sm:w-72 md:w-80 lg:w-96 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  // Extraer datos del contenido
  const { home } = contentData
  const { hero, navigation } = home

  // Configuración del video desde el hero
  const videoConfig: VideoConfig = {
    idle: hero.professionalVideo.idle,
    talking: hero.professionalVideo.talking,
    poster: hero.professionalVideo.poster,
    autoPlay: hero.professionalVideo.autoPlay,
    loop: hero.professionalVideo.loop,
    muted: hero.professionalVideo.muted,
    controls: hero.professionalVideo.controls,
    playsInline: hero.professionalVideo.playsInline,
    removeBackground: hero.professionalVideo.removeBackground,
    backgroundType: hero.professionalVideo.backgroundType as 'black' | 'white' | 'transparent',
  }

  // Contenido del hero (sin el video)
  const heroContent: HeroContent = {
    title: hero.title,
    subtitle: hero.subtitle,
    description: hero.description,
    ctaText: hero.ctaText,
    ctaLink: hero.ctaLink,
    backgroundEffect: hero.backgroundEffect as 'aurora' | 'water' | 'particles' | 'gradient',
  }

  return (
    <>
      {/* Header fijo */}
      <Header
        navigationItems={navigation.items}
        logo={navigation.logo}
        brand={navigation.brand}
      />

      {/* Contenido principal - Sin spacer adicional */}
      <main className="relative">
        <Suspense fallback={<HeroSectionSkeleton />}>
          <HeroSection
            content={heroContent}
            videoConfig={videoConfig}
          />
        </Suspense>
        
        {/* Aquí irán las demás secciones cuando se implementen */}
        {/* 
        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
        */}
      </main>

      {/* Footer se agregará en futuras iteraciones */}
      {/* 
      <Footer />
      */}
    </>
  )
}