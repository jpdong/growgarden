import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '../src/components/analytics/GoogleAnalytics'
import CookieConsent from '../src/components/analytics/CookieConsent'

export const metadata: Metadata = {
  title: 'Grow Garden - Play Garden Games Online',
  description: 'Play Grow Garden and more garden games online. Free browser games about gardening, planting, and growing beautiful gardens.',
  keywords: ['garden games', 'plant games', 'gardening online', 'grow garden', 'flower games', 'free online games'],
  icons: {
    icon: '/logo.webp',
  },
  alternates: {
    canonical: `https://growgarden.space/`,
  },
  openGraph: {
    title: 'Grow Garden - Play Garden Games Online',
    description: 'Play Grow Garden and more garden games online. Free browser games about gardening, planting, and growing beautiful gardens.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Grow Garden',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grow Garden - Play Garden Games Online',
    description: 'Play Grow Garden and more garden games online. Free browser games about gardening, planting, and growing beautiful gardens.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <GoogleAnalytics />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}