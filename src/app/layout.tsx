// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Intelcobro - Conecta con el futuro de la cobranza',
  description: 'Especialistas en gestión de cobranza inteligente con tecnología avanzada. Recuperamos tu cartera con estrategias personalizadas y resultados garantizados.',
  keywords: ['cobranza', 'gestión de cartera', 'recuperación', 'Ecuador', 'tecnología financiera'],
  authors: [{ name: 'Intelcobro S.A.' }],
  creator: 'Intelcobro S.A.',
  publisher: 'Intelcobro S.A.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://intelcobro.com'),
  openGraph: {
    title: 'Intelcobro - Conecta con el futuro de la cobranza',
    description: 'Especialistas en gestión de cobranza inteligente con tecnología avanzada.',
    url: 'https://intelcobro.com',
    siteName: 'Intelcobro',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Intelcobro - Gestión de cobranza inteligente',
      },
    ],
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intelcobro - Conecta con el futuro de la cobranza',
    description: 'Especialistas en gestión de cobranza inteligente con tecnología avanzada.',
    images: ['/images/twitter-image.jpg'],
    creator: '@intelcobro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
    yandex: 'yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="es" 
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect for optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#e74c3c" />
        <meta name="msapplication-TileColor" content="#e74c3c" />
        
        {/* Optimized viewport */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" 
        />
        
        {/* Preload critical resources */}
        <link 
          rel="preload" 
          href="/videos/professional-woman-idle.mp4" 
          as="video" 
          type="video/mp4"
        />
        
        {/* DNS prefetch for external APIs */}
        <link rel="dns-prefetch" href="//api.intelcobro.com" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Intelcobro S.A.",
              "url": "https://intelcobro.com",
              "logo": "https://intelcobro.com/images/logo.png",
              "description": "Empresa especializada en gestión de cobranza inteligente",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Principal 123",
                "addressLocality": "Quito",
                "addressRegion": "Pichincha",
                "postalCode": "170501",
                "addressCountry": "EC"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+593-2-345-6789",
                "contactType": "customer service",
                "availableLanguage": "Spanish"
              },
              "sameAs": [
                "https://www.linkedin.com/company/intelcobro",
                "https://www.facebook.com/intelcobro"
              ]
            })
          }}
        />
      </head>
      <body 
        className={`${inter.className} font-sans antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50"
        >
          Saltar al contenido principal
        </a>
        
        {/* Main content */}
        <div id="main-content" className="min-h-screen flex flex-col">
          {children}
        </div>
        
        {/* Analytics and tracking scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                    `,
                  }}
                />
              </>
            )}
            
            {/* Hotjar or similar for heatmaps */}
            {process.env.NEXT_PUBLIC_HOTJAR_ID && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(h,o,t,j,a,r){
                      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                      h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                      a=o.getElementsByTagName('head')[0];
                      r=o.createElement('script');r.async=1;
                      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                      a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                  `,
                }}
              />
            )}
          </>
        )}
        
        {/* Service Worker for PWA - Only run in production */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}