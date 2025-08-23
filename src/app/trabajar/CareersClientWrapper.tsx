'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { CareersSection } from '@/components/sections/CareersSection'

interface CareersClientWrapperProps {
  contentData: any
}

function CareersPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-20 px-4">
      <div className="container mx-auto">
        {/* Hero skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 bg-white/10 rounded-lg animate-pulse mb-4 max-w-md mx-auto" />
          <div className="h-6 bg-white/10 rounded-lg animate-pulse w-2/3 mx-auto mb-4" />
          <div className="h-4 bg-white/10 rounded-lg animate-pulse w-3/4 mx-auto" />
        </div>
        
        {/* Form skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-xl p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-white/10 rounded animate-pulse w-1/4" />
                <div className="h-8 bg-white/10 rounded-lg animate-pulse" />
              </div>
            ))}
            <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4 h-32" />
            <div className="bg-white/10 rounded-lg p-4 h-24" />
            <div className="bg-white/10 rounded-lg p-4 h-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CareersClientWrapper({ contentData }: CareersClientWrapperProps) {
  const { home, trabajar } = contentData

  return (
    <>
      {/* Header */}
      <Header
        navigationItems={home.navigation.items}
        logo={home.navigation.logo}
        brand={home.navigation.brand}
      />

      {/* Main content */}
      <Suspense fallback={<CareersPageSkeleton />}>
        <CareersSection
          hero={trabajar.hero}
          form={trabajar.form}
          socialLinks={trabajar.socialLinks}
          locations={trabajar.locations}
          benefits={trabajar.benefits}
          contact={trabajar.contact}
        />
      </Suspense>
    </>
  )
}