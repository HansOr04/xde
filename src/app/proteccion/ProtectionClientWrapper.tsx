'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { ProtectionSection } from '@/components/sections/ProtectionSection'

interface ProtectionClientWrapperProps {
  contentData: any
}

function ProtectionPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-20 px-4">
      <div className="container mx-auto">
        {/* Hero skeleton */}
        <div className="text-center mb-8">
          <div className="h-16 bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-8 bg-white/10 rounded-lg animate-pulse w-2/3 mx-auto mb-4" />
          <div className="h-4 bg-white/10 rounded-lg animate-pulse w-3/4 mx-auto" />
        </div>
        
        {/* Rights grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-6 space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
              <div className="h-6 bg-white/20 rounded animate-pulse" />
              <div className="h-4 bg-white/20 rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>

        {/* Download section skeleton */}
        <div className="bg-white/10 rounded-xl p-8 text-center">
          <div className="h-8 bg-white/20 rounded animate-pulse mb-4 max-w-md mx-auto" />
          <div className="h-4 bg-white/20 rounded animate-pulse mb-6 max-w-lg mx-auto" />
          <div className="h-12 bg-white/20 rounded-lg animate-pulse max-w-xs mx-auto" />
        </div>
      </div>
    </div>
  )
}

export default function ProtectionClientWrapper({ contentData }: ProtectionClientWrapperProps) {
  const { home, proteccion } = contentData

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
        <Suspense fallback={<ProtectionPageSkeleton />}>
          <ProtectionSection
            hero={proteccion.hero}
            rights={proteccion.rights}
            downloadSection={proteccion.downloadSection}
            contact={proteccion.contact}
            legalInfo={proteccion.legalInfo}
          />
        </Suspense>
      </main>
    </>
  )
}