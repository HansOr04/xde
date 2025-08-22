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
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const pathname = usePathname()

  // Suprimir warning de variables no usadas
  const _ = { sidebarOpen, setSidebarOpen }

  // Detectar scroll para efectos de header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          'backdrop-blur-xl border-b',
          isScrolled 
            ? 'glass-nav-solid bg-white/15 shadow-2xl border-white/20 backdrop-blur-2xl' 
            : 'glass-nav-transparent bg-transparent border-transparent'
        )}
      >
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-22">
            
            {/* Logo solo - Sin padding, más grande */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="group transition-all duration-300 hover:scale-105"
              >
                {logo && (
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                    <img
                      src={logo}
                      alt={`${brand} Logo`}
                      className="w-full h-full object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                    />
                    {/* Glow effect behind logo */}
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                )}
              </Link>
            </div>

            {/* Navegación Desktop - Centrada */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <Link href={item.href}>
                      <NavButton
                        active={pathname === item.href}
                        className="px-4 py-2 text-sm font-semibold"
                      >
                        <span className="flex items-center gap-1">
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
                    
                    {/* Submenu dropdown */}
                    {item.submenu && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="p-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.id}
                              href={subItem.href}
                              className="block p-3 rounded-lg text-white hover:bg-white/20 transition-all duration-200 group/sub"
                            >
                              <div className="font-medium text-sm group-hover/sub:text-primary-200">
                                {subItem.label}
                              </div>
                              {subItem.description && (
                                <div className="text-xs text-white/70 mt-1">
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

            {/* Botón de acción Desktop - Solo Glass Contáctanos */}
            <div className="hidden lg:flex items-center">
              <Button
                variant="glass"
                size="default"
                className="font-semibold px-6"
              >
                Contáctanos
              </Button>
            </div>

            {/* Botón menú móvil */}
            <div className="lg:hidden">
              <IconButton
                icon={
                  <div className="relative">
                    <Menu 
                      size={20} 
                      className={cn(
                        "transition-all duration-300",
                        isMobileMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                      )} 
                    />
                    <X 
                      size={20} 
                      className={cn(
                        "absolute inset-0 transition-all duration-300",
                        isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
                      )} 
                    />
                  </div>
                }
                onClick={toggleMobileMenu}
                className="text-white border-white/30 hover:bg-white/20"
                size="icon-sm"
                tooltip={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden",
              "animate-fadeIn"
            )}
            onClick={toggleMobileMenu}
          />
          
          {/* Panel del menú */}
          <div
            className={cn(
              'fixed top-16 sm:top-18 right-0 w-72 sm:w-80 max-w-[85vw] h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] z-50 lg:hidden',
              'glass bg-white/15 backdrop-blur-2xl border-l border-white/30',
              'transform transition-all duration-500 ease-out shadow-2xl',
              'animate-slideInRight'
            )}
          >
            <div className="flex flex-col h-full">
              
              {/* Navegación móvil */}
              <nav className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={toggleMobileMenu}
                          className={cn(
                            'flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-xl text-white font-semibold transition-all duration-300',
                            'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg',
                            'border border-transparent hover:border-white/30',
                            'text-sm sm:text-base',
                            pathname === item.href 
                              ? 'bg-white/20 border-white/30 shadow-lg' 
                              : 'hover:translate-x-2'
                          )}
                        >
                          {item.label}
                        </Link>
                        
                        {item.submenu && (
                          <button
                            onClick={() => handleSubmenuToggle(item.id)}
                            className="p-2 text-white/70 hover:text-white transition-colors"
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
                      {item.submenu && activeSubmenu === item.id && (
                        <div className="ml-3 sm:ml-4 space-y-1 animate-slideDown">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.id}
                              href={subItem.href}
                              onClick={toggleMobileMenu}
                              className="block px-3 sm:px-4 py-2 sm:py-3 text-white/80 hover:text-white bg-white/5 hover:bg-white/15 rounded-lg transition-all duration-200 text-sm"
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

              {/* Botón de acción móvil - Solo Glass Contáctanos */}
              <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-white/20">
                <Button
                  variant="glass"
                  size="lg"
                  className="w-full justify-center font-semibold"
                  onClick={toggleMobileMenu}
                >
                  Contáctanos
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer para evitar que el contenido se oculte bajo el header fijo - REMOVIDO */}
      {/* <div className="h-14 sm:h-16 lg:h-20" /> */}
    </>
  )
}