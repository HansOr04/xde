// src/components/layout/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, NavButton, IconButton } from '@/components/ui/Button'
import { useUIStore } from '@/lib/store'

interface HeaderProps {
  navigationItems: Array<{
    id: string
    label: string
    href: string
    active?: boolean
    submenu?: Array<{
      id: string
      label: string
      href: string
      description?: string
    }>
  }>
  logo?: string
  brand?: string
}

export function Header({ navigationItems, logo, brand = "Intelcobro" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const pathname = usePathname()

  // Suprimir warning de variables no usadas
  const _ = { sidebarOpen, setSidebarOpen }

  // Cliente cargado
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Detectar scroll para efectos de header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveSubmenu(null)
  }, [pathname])

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSubmenuToggle = (itemId: string) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId)
  }

  // Loading state para evitar hydration issues
  if (!isLoaded) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 h-16 sm:h-18 lg:h-20">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-full">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white/20 rounded-full animate-pulse" />
            <div className="hidden lg:flex space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-20 h-8 bg-white/20 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="w-24 h-10 bg-white/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          'backdrop-blur-xl border-b will-change-transform',
          isScrolled 
            ? 'glass-nav-solid bg-white/15 shadow-2xl border-white/20 backdrop-blur-2xl transform translate-y-0' 
            : 'glass-nav-transparent bg-transparent border-transparent transform translate-y-0'
        )}
      >
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 xl:h-22">
            
            {/* Logo - Mejorado y más responsive */}
            <div className="flex items-center flex-shrink-0">
              <Link 
                href="/" 
                className="group transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="relative">
                  {logo ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                      <img
                        src={logo}
                        alt={`${brand} Logo`}
                        className="w-full h-full object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                        onError={(e) => {
                          // Fallback si la imagen no carga
                          (e.target as HTMLImageElement).style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg';
                          fallback.textContent = brand.charAt(0);
                          (e.target as HTMLImageElement).parentNode?.appendChild(fallback);
                        }}
                      />
                      {/* Glow effect behind logo */}
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {brand.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Navegación Desktop - Centrada y mejorada */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-4 xl:mx-8">
              <div className="flex items-center space-x-1 xl:space-x-2">
                {navigationItems.map((item, index) => (
                  <div key={item.id} className="relative group">
                    <Link href={item.href}>
                      <NavButton
                        active={pathname === item.href}
                        className={cn(
                          "px-3 py-2 xl:px-4 xl:py-2.5 text-sm xl:text-base font-semibold",
                          "transition-all duration-300 ease-out",
                          "transform hover:scale-105 hover:-translate-y-0.5",
                          // Animación de entrada escalonada
                          "animate-slideInFromBottom",
                        )}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <span className="flex items-center gap-1 xl:gap-2">
                          {item.label}
                          {item.submenu && (
                            <ChevronDown 
                              size={14} 
                              className="transition-transform duration-300 group-hover:rotate-180" 
                            />
                          )}
                        </span>
                      </NavButton>
                    </Link>
                    
                    {/* Submenu dropdown mejorado */}
                    {item.submenu && (
                      <div className={cn(
                        "absolute top-full left-1/2 transform -translate-x-1/2 mt-2",
                        "w-64 xl:w-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl",
                        "opacity-0 invisible translate-y-2 scale-95",
                        "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100",
                        "transition-all duration-300 ease-out"
                      )}>
                        <div className="p-2">
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subItem.id}
                              href={subItem.href}
                              className={cn(
                                "block p-3 xl:p-4 rounded-lg text-white hover:bg-white/20 transition-all duration-200 group/sub",
                                "transform hover:translate-x-2",
                                "animate-slideInFromBottom"
                              )}
                              style={{
                                animationDelay: `${subIndex * 50}ms`,
                                animationFillMode: 'both'
                              }}
                            >
                              <div className="font-medium text-sm xl:text-base group-hover/sub:text-primary-200">
                                {subItem.label}
                              </div>
                              {subItem.description && (
                                <div className="text-xs xl:text-sm text-white/70 mt-1">
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Botón de acción Desktop - Mejorado */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <Button
                variant="glass"
                size="default"
                className={cn(
                  "font-semibold px-4 py-2 xl:px-6 xl:py-2.5 text-sm xl:text-base",
                  "transform hover:scale-105 hover:-translate-y-0.5",
                  "transition-all duration-300 ease-out",
                  "animate-slideInFromBottom"
                )}
                style={{
                  animationDelay: `${navigationItems.length * 100 + 200}ms`,
                  animationFillMode: 'both'
                }}
              >
                Contáctanos
              </Button>
            </div>

            {/* Botón menú móvil - Mejorado */}
            <div className="lg:hidden">
              <IconButton
                icon={
                  <div className="relative">
                    <Menu 
                      size={20} 
                      className={cn(
                        "transition-all duration-500 ease-out",
                        isMobileMenuOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                      )} 
                    />
                    <X 
                      size={20} 
                      className={cn(
                        "absolute inset-0 transition-all duration-500 ease-out",
                        isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
                      )} 
                    />
                  </div>
                }
                onClick={toggleMobileMenu}
                className={cn(
                  "text-white border-white/30 hover:bg-white/20",
                  "transform hover:scale-110 active:scale-90",
                  "transition-all duration-300 ease-out",
                  isMobileMenuOpen && "bg-white/20 scale-110"
                )}
                size="icon-sm"
                tooltip={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil overlay - Completamente rediseñado */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-out",
        isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
      )}>
        {/* Backdrop con blur */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={toggleMobileMenu}
        />
        
        {/* Panel del menú */}
        <div
          className={cn(
            'absolute top-16 sm:top-18 right-0 bottom-0',
            'w-80 sm:w-96 max-w-[85vw] bg-white/15 backdrop-blur-2xl',
            'border-l border-white/30 shadow-2xl',
            'transition-all duration-500 ease-out transform',
            isMobileMenuOpen 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0'
          )}
        >
          <div className="flex flex-col h-full">
            
            {/* Header del menú móvil */}
            <div className="p-4 sm:p-6 border-b border-white/20">
              <h2 className="text-lg sm:text-xl font-bold text-white">Menú</h2>
            </div>
            
            {/* Navegación móvil */}
            <nav className="flex-1 px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={toggleMobileMenu}
                        className={cn(
                          'flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-xl text-white font-semibold',
                          'transition-all duration-300 ease-out',
                          'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg',
                          'border border-transparent hover:border-white/30',
                          'text-sm sm:text-base transform hover:translate-x-2 hover:scale-105',
                          pathname === item.href 
                            ? 'bg-white/20 border-white/30 shadow-lg scale-105' 
                            : '',
                          // Animación de entrada escalonada
                          isMobileMenuOpen && 'animate-slideInFromBottom'
                        )}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        {item.label}
                      </Link>
                      
                      {item.submenu && (
                        <button
                          onClick={() => handleSubmenuToggle(item.id)}
                          className={cn(
                            "p-2 text-white/70 hover:text-white transition-all duration-300",
                            "transform hover:scale-110 active:scale-90"
                          )}
                        >
                          <ChevronDown 
                            size={18} 
                            className={cn(
                              "transition-transform duration-300",
                              activeSubmenu === item.id ? "rotate-180" : "rotate-0"
                            )}
                          />
                        </button>
                      )}
                    </div>
                    
                    {/* Submenu móvil */}
                    {item.submenu && (
                      <div className={cn(
                        "ml-3 sm:ml-4 space-y-1 overflow-hidden transition-all duration-500",
                        activeSubmenu === item.id 
                          ? "max-h-96 opacity-100" 
                          : "max-h-0 opacity-0"
                      )}>
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            onClick={toggleMobileMenu}
                            className={cn(
                              "block px-3 sm:px-4 py-2 sm:py-3 text-white/80 hover:text-white",
                              "bg-white/5 hover:bg-white/15 rounded-lg transition-all duration-300",
                              "text-sm transform hover:translate-x-2 hover:scale-105",
                              activeSubmenu === item.id && 'animate-slideInFromBottom'
                            )}
                            style={{
                              animationDelay: `${subIndex * 50}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="font-medium">{subItem.label}</div>
                            {subItem.description && (
                              <div className="text-xs text-white/60 mt-1">
                                {subItem.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Botón de acción móvil */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-white/20">
              <Button
                variant="glass"
                size="lg"
                className={cn(
                  "w-full justify-center font-semibold transform hover:scale-105 active:scale-95",
                  "transition-all duration-300 ease-out",
                  isMobileMenuOpen && 'animate-slideInFromBottom'
                )}
                style={{
                  animationDelay: `${navigationItems.length * 100 + 200}ms`,
                  animationFillMode: 'both'
                }}
                onClick={toggleMobileMenu}
              >
                Contáctanos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}