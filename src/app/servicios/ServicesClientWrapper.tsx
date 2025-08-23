'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { ServicesSection } from '@/components/sections/ServicesSection'

interface ServicesClientWrapperProps {
  contentData: any
}

function ServicesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center pt-20 px-4">
      <div className="container mx-auto">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-16 bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-8 bg-white/10 rounded-lg animate-pulse w-2/3 mx-auto" />
        </div>
        
        {/* Services grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ServicesClientWrapper({ contentData }: ServicesClientWrapperProps) {
  const { home, services } = contentData

  return (
    <>
      {/* Header */}
      <Header
        navigationItems={home.navigation.items}
        logo={home.navigation.logo}
        brand={home.navigation.brand}
      />

      {/* Main content */}
      <main className="relative">
        <Suspense fallback={<ServicesPageSkeleton />}>
          <ServicesSection
            hero={services.hero}
            services={services.items}
            certifications={services.certifications}
          />
        </Suspense>
      </main>
    </>
  )
}