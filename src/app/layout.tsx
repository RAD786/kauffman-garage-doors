import type { Metadata, Viewport } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { StickyCallBar, StickyCallBarSpacer } from '@/components/StickyCallBar'
import { JsonLd } from '@/components/JsonLd'
import { localBusinessSchema, webSiteSchema } from '@/lib/schema'
import { business } from '@/data/business'
import { defaultMetadataBase } from '@/lib/seo'

// Self-hosted by next/font at build time -- no third-party request, no FOIT.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: defaultMetadataBase,
  title: {
    default: `${business.name} | Garage Door Repair & Installation in Gainesville, GA`,
    template: `%s | ${business.name}`,
  },
  description:
    'Family owned garage door repair, installation and opener service in Gainesville and North Georgia. In business since 1984. Call (770) 554-9990.',
  applicationName: business.name,
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  formatDetection: { telephone: true, address: true, email: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  // Favicons come from the file convention (src/app/icon.png, apple-icon.png),
  // which Next fingerprints and sizes correctly. No manual `icons` needed.
}

export const viewport: Viewport = {
  themeColor: '#0b2545',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${inter.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* Org + site schema live in the layout so every URL carries the entity. */}
        <JsonLd data={[localBusinessSchema(), webSiteSchema()]} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2.5 focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />
        <StickyCallBarSpacer />
        <StickyCallBar />
      </body>
    </html>
  )
}
