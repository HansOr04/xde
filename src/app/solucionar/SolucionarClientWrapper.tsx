'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { SolucionarSection } from '@/components/sections/SolucionarSection'

interface SolucionarClientWrapperProps {
  contentData: any
}

function SolucionarPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-20 px-4">
      <div className="container mx-auto">
        {/* Hero skeleton */}
        <div className="text-center mb-8">
          <div className="h-12 bg-white/10 rounded-lg animate-pulse mb-4 max-w-md mx-auto" />
          <div className="h-6 bg-white/10 rounded-lg animate-pulse w-2/3 mx-auto" />
        </div>
        
        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Ruleta skeleton */}
          <div className="aspect-square bg-white/10 rounded-full animate-pulse max-w-2xl mx-auto" />
          
          {/* Form skeleton */}
          <div className="space-y-6">
            <div className="bg-white/10 rounded-xl p-6 space-y-4">
              <div className="h-6 bg-white/10 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
            </div>
            <div className="bg-white/10 rounded-xl p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-white/10 rounded-lg animate-pulse" />
              ))}
              <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SolucionarClientWrapper({ contentData }: SolucionarClientWrapperProps) {
  const { home, solucionar } = contentData

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
        <Suspense fallback={<SolucionarPageSkeleton />}>
          <SolucionarSection
            hero={solucionar.hero}
            wheel={solucionar.wheel}
            form={solucionar.form}
          />
        </Suspense>
      </main>
    </>
  )
}