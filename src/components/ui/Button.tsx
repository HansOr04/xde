// src/components/ui/Button.tsx
'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg',
        ghost: 'hover:bg-white/10 hover:text-white border border-transparent hover:border-white/30 backdrop-blur-sm',
        link: 'text-primary underline-offset-4 hover:underline',
        
        // Glass variants mejorados
        glass: cn(
          'glass-button text-white border-2 border-white/20 hover:border-white/40',
          'bg-white/10 hover:bg-white/20 backdrop-blur-xl',
          'shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30',
          'transform hover:scale-105 active:scale-95',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
          'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
          'after:absolute after:inset-0 after:rounded-xl after:border after:border-white/30 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300'
        ),
        
        'glass-primary': cn(
          'glass-button text-white border-2 border-primary/40 hover:border-primary/60',
          'bg-gradient-to-br from-primary/30 via-primary/20 to-primary/30',
          'hover:from-primary/40 hover:via-primary/30 hover:to-primary/40',
          'backdrop-blur-xl shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/50',
          'transform hover:scale-110 active:scale-95',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent',
          'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
          'after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-primary/20 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300'
        ),
        
        'glass-secondary': cn(
          'glass-button text-white border-2 border-secondary/40 hover:border-secondary/60',
          'bg-gradient-to-br from-secondary/30 via-secondary/20 to-secondary/30',
          'hover:from-secondary/40 hover:via-secondary/30 hover:to-secondary/40',
          'backdrop-blur-xl shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/40',
          'transform hover:scale-105 active:scale-95'
        ),
        
        'glass-accent': cn(
          'glass-button text-white border-2 border-accent/40 hover:border-accent/60',
          'bg-gradient-to-br from-accent/30 via-accent/20 to-accent/30',
          'hover:from-accent/40 hover:via-accent/30 hover:to-accent/40',
          'backdrop-blur-xl shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/40',
          'transform hover:scale-105 active:scale-95'
        ),
        
        // Variantes especiales
        'gradient-primary': cn(
          'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700',
          'hover:from-primary-400 hover:via-primary-500 hover:to-primary-600',
          'text-white shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/60',
          'transform hover:scale-105 active:scale-95',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0',
          'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
        ),
        
        'neon': cn(
          'bg-transparent border-2 border-primary-400 text-primary-400',
          'hover:bg-primary-400 hover:text-black hover:border-primary-300',
          'shadow-lg shadow-primary-400/50 hover:shadow-xl hover:shadow-primary-400/80',
          'transform hover:scale-105 active:scale-95',
          'before:absolute before:inset-0 before:bg-primary-400/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300'
        ),
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-13 rounded-xl px-8 text-base',
        xl: 'h-16 rounded-2xl px-12 text-lg font-bold',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-13 w-13',
        'icon-xl': 'h-16 w-16',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse-gentle',
        glow: 'animate-glow',
        float: 'animate-float',
        bounce: 'hover:animate-bounce-gentle',
        wiggle: 'hover:animate-wiggle',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  glowEffect?: boolean
  rippleEffect?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    glowEffect = false,
    rippleEffect = true,
    asChild = false,
    onClick,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (rippleEffect && !isDisabled) {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const newRipple = {
          id: Date.now(),
          x,
          y,
        }
        setRipples(prev => [...prev, newRipple])
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)
      }
      
      onClick?.(e)
    }

    const buttonContent = (
      <>
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute inset-0 pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
            }}
          >
            <span className="absolute w-5 h-5 bg-white/30 rounded-full animate-ping" />
          </span>
        ))}
        
        {/* Glow effect */}
        {glowEffect && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        )}
        
        {/* Loading spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center">
          {!loading && leftIcon && (
            <span className="mr-2 flex-shrink-0 transition-transform group-hover:scale-110">
              {leftIcon}
            </span>
          )}
          <span className="flex-1">{children}</span>
          {!loading && rightIcon && (
            <span className="ml-2 flex-shrink-0 transition-transform group-hover:scale-110">
              {rightIcon}
            </span>
          )}
        </span>
      </>
    )

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(buttonVariants({ variant, size, animation, className })),
        ref,
        onClick: handleClick,
        ...props,
      } as any)
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Componente especializado para CTA con efectos avanzados
export interface CTAButtonProps extends Omit<ButtonProps, 'variant'> {
  glowEffect?: boolean
  pulseOnHover?: boolean
  magneticEffect?: boolean
}

export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ 
    glowEffect = true, 
    pulseOnHover = true, 
    magneticEffect = false,
    className, 
    animation, 
    children,
    onMouseMove,
    onMouseLeave,
    ...props 
  }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current!, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (magneticEffect && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        setMousePosition({ x: x * 0.3, y: y * 0.3 })
      }
      onMouseMove?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (magneticEffect) {
        setMousePosition({ x: 0, y: 0 })
      }
      onMouseLeave?.(e)
    }

    return (
      <Button
        ref={buttonRef}
        variant="gradient-primary"
        size="lg"
        animation={animation || (pulseOnHover ? 'pulse' : 'none')}
        glowEffect={glowEffect}
        className={cn(
          'font-bold tracking-wide relative overflow-hidden',
          'shadow-2xl shadow-primary/50 hover:shadow-3xl hover:shadow-primary/70',
          'transition-all duration-500 ease-out',
          magneticEffect && 'transition-transform duration-300 ease-out',
          className
        )}
        style={magneticEffect ? {
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
        } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        
        {/* Particle effect para CTA */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </Button>
    )
  }
)
CTAButton.displayName = 'CTAButton'

// Componente para botones de navegación mejorado
export interface NavButtonProps extends Omit<ButtonProps, 'variant'> {
  active?: boolean
  hasSubmenu?: boolean
}

export const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ active = false, hasSubmenu = false, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={active ? 'glass-primary' : 'glass'}
        size="default"
        className={cn(
          'relative font-semibold tracking-wide',
          'transition-all duration-300 group/nav',
          'hover:shadow-lg hover:shadow-white/20',
          active && 'shadow-primary/30 ring-2 ring-primary/20',
          // Efecto de línea inferior para navegación activa
          active && 'after:absolute after:bottom-0 after:left-1/2 after:w-8 after:h-0.5 after:bg-primary-300 after:transform after:-translate-x-1/2 after:rounded-full',
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {hasSubmenu && (
            <span className="opacity-70 transition-transform group-hover/nav:rotate-180 duration-300">
              ↓
            </span>
          )}
        </span>
        
        {/* Indicador de hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-500 origin-left" />
      </Button>
    )
  }
)
NavButton.displayName = 'NavButton'

// Componente para botones con iconos mejorado
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'variant'> {
  icon: React.ReactNode
  tooltip?: string
  variant?: 'glass' | 'default' | 'secondary' | 'neon' | 'glass-primary'
  hoverEffect?: 'scale' | 'rotate' | 'pulse' | 'glow'
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    icon, 
    tooltip, 
    variant = 'glass',
    hoverEffect = 'scale',
    className, 
    size = 'icon', 
    ...props 
  }, ref) => {
    const getHoverEffect = () => {
      switch (hoverEffect) {
        case 'rotate':
          return 'group-hover:rotate-180'
        case 'pulse':
          return 'group-hover:animate-pulse'
        case 'glow':
          return 'group-hover:drop-shadow-lg group-hover:brightness-125'
        default:
          return 'group-hover:scale-125'
      }
    }

    const button = (
      <Button
        ref={ref}
        variant={variant as any}
        size={size}
        className={cn(
          'group relative overflow-hidden',
          'transition-all duration-300',
          variant === 'neon' && 'hover:shadow-lg hover:shadow-primary/50',
          className
        )}
        {...props}
      >
        <span className={cn('transition-all duration-300', getHoverEffect())}>
          {icon}
        </span>
        
        {/* Ripple effect para iconos */}
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </Button>
    )

    if (tooltip) {
      return (
        <div className="relative group/tooltip">
          {button}
          <div className={cn(
            'absolute z-50 px-3 py-2 text-xs font-medium text-white',
            'bg-gray-900/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl',
            'opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible',
            'transition-all duration-300 pointer-events-none whitespace-nowrap',
            'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2',
            'before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2',
            'before:border-4 before:border-transparent before:border-t-gray-900/90'
          )}>
            {tooltip}
          </div>
        </div>
      )
    }

    return button
  }
)
IconButton.displayName = 'IconButton'

// Componente para botones flotantes (FAB)
export interface FloatingButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  icon: React.ReactNode
  label?: string
  expandOnHover?: boolean
}

export const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ 
    position = 'bottom-right',
    icon,
    label,
    expandOnHover = false,
    className,
    ...props 
  }, ref) => {
    const getPositionClasses = () => {
      switch (position) {
        case 'bottom-left':
          return 'bottom-6 left-6'
        case 'top-right':
          return 'top-6 right-6'
        case 'top-left':
          return 'top-6 left-6'
        default:
          return 'bottom-6 right-6'
      }
    }

    return (
      <Button
        ref={ref}
        variant="gradient-primary"
        size={expandOnHover && label ? 'default' : 'icon-lg'}
        className={cn(
          'fixed z-40 group shadow-2xl shadow-primary/50 hover:shadow-3xl hover:shadow-primary/70',
          'transition-all duration-500 ease-out',
          getPositionClasses(),
          expandOnHover && label && 'hover:pr-4',
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2">
          <span className="transition-transform group-hover:scale-110">
            {icon}
          </span>
          {label && expandOnHover && (
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
              {label}
            </span>
          )}
        </span>
      </Button>
    )
  }
)
FloatingButton.displayName = 'FloatingButton'

// Componente para grupo de botones
export interface ButtonGroupProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  variant?: 'attached' | 'separated'
  className?: string
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, orientation = 'horizontal', variant = 'attached', className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          variant === 'attached' 
            ? orientation === 'horizontal' 
              ? '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:border-l-0'
              : '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:border-t-0'
            : orientation === 'horizontal'
              ? 'gap-2'
              : 'gap-2',
          className
        )}
        role="group"
      >
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = 'ButtonGroup'

export { Button, buttonVariants }