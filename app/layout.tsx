import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '../src/components/analytics/GoogleAnalytics'
import CookieConsent from '../src/components/analytics/CookieConsent'

export const metadata: Metadata = {
  title: 'Grow Garden',
  description: 'Multi Run​​ is a powerful tool that allows you to run multiple accounts or applications simultaneously on a single device.',
  icons: {
    icon: '/logo.webp',
  },
  alternates: {
      canonical: `https://multirun.space/`,
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