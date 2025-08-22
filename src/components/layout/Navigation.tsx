'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NavButton } from '@/components/ui/Button'
import type { NavigationItem } from '@/types'

interface NavigationProps {
  items: NavigationItem[]
  orientation?: 'horizontal' | 'vertical'
  variant?: 'glass' | 'solid' | 'minimal'
  className?: string
  itemClassName?: string
  onItemClick?: (item: NavigationItem) => void
}

export function Navigation({
  items,
  orientation = 'horizontal',
  variant = 'glass',
  className,
  itemClassName,
  onItemClick,
}: NavigationProps) {
  const pathname = usePathname()

  const isActiveItem = (item: NavigationItem): boolean => {
    if (item.href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(item.href)
  }

  const handleItemClick = (item: NavigationItem) => {
    onItemClick?.(item)
  }

  const getItemStyles = (item: NavigationItem) => {
    const isActive = isActiveItem(item)
    
    const baseStyles = cn(
      'transition-all duration-300 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
      itemClassName
    )

    switch (variant) {
      case 'glass':
        return cn(
          baseStyles,
          'text-white font-medium',
          'hover:bg-white/10 hover:backdrop-blur-sm',
          'border border-transparent hover:border-white/20',
          isActive && 'bg-white/20 border-white/30 shadow-lg'
        )
      
      case 'solid':
        return cn(
          baseStyles,
          'text-gray-700 dark:text-gray-200 font-medium',
          'hover:bg-primary-50 dark:hover:bg-primary-900/20',
          'hover:text-primary-600 dark:hover:text-primary-400',
          isActive && 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
        )
      
      case 'minimal':
        return cn(
          baseStyles,
          'text-gray-600 dark:text-gray-300 font-medium',
          'hover:text-gray-900 dark:hover:text-white',
          'relative',
          isActive && 'text-primary-600 dark:text-primary-400'
        )
      
      default:
        return baseStyles
    }
  }

  const containerStyles = cn(
    'flex',
    orientation === 'horizontal' 
      ? 'items-center space-x-1' 
      : 'flex-col space-y-2',
    className
  )

  return (
    <nav className={containerStyles} role="navigation">
      {items.map((item) => {
        const isActive = isActiveItem(item)
        
        const linkContent = (
          <span className={cn(
            'block px-4 py-2 rounded-lg text-sm',
            getItemStyles(item),
            // Indicador visual para item activo en variante minimal
            variant === 'minimal' && isActive && 
            'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-500'
          )}>
            {item.icon && (
              <span className="mr-2 inline-flex">{item.icon}</span>
            )}
            {item.label}
          </span>
        )

        if (item.external) {
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              onClick={() => handleItemClick(item)}
              aria-current={isActive ? 'page' : undefined}
            >
              {linkContent}
              {/* Indicador de enlace externo */}
              <span className="sr-only">(abre en nueva pestaña)</span>
            </a>
          )
        }

        if (variant === 'glass') {
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleItemClick(item)}
            >
              <NavButton
                active={isActive}
                className="text-sm font-medium"
              >
                {item.icon && (
                  <span className="mr-2">{item.icon}</span>
                )}
                {item.label}
              </NavButton>
            </Link>
          )
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className="relative group"
            onClick={() => handleItemClick(item)}
            aria-current={isActive ? 'page' : undefined}
          >
            {linkContent}
            
            {/* Efecto de hover para variante minimal */}
            {variant === 'minimal' && (
              <span className={cn(
                'absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300',
                'group-hover:w-full',
                isActive && 'w-full'
              )} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

// Componente especializado para navegación principal
export function MainNavigation({ items, className, ...props }: Omit<NavigationProps, 'variant'>) {
  return (
    <Navigation
      items={items}
      variant="glass"
      orientation="horizontal"
      className={cn('hidden lg:flex', className)}
      {...props}
    />
  )
}

// Componente para navegación móvil
export function MobileNavigation({ items, className, ...props }: Omit<NavigationProps, 'variant' | 'orientation'>) {
  return (
    <Navigation
      items={items}
      variant="glass"
      orientation="vertical"
      className={cn('lg:hidden', className)}
      itemClassName="w-full text-left"
      {...props}
    />
  )
}

// Componente para breadcrumbs
interface BreadcrumbItem {
  id: string
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

export function Breadcrumb({ 
  items, 
  separator = '/', 
  className 
}: BreadcrumbProps) {
  return (
    <nav 
      className={cn('flex items-center space-x-2 text-sm', className)}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400">{separator}</span>
          )}
          
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}