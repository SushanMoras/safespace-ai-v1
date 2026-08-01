import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { PanicShell } from '@/components/panic-shell'

const _dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const _dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'SafeSpace AI — Online Harassment Support',
  description:
    'A calming, trauma-informed safety tool that helps women identify, understand, and respond to online harassment — anonymously and privately.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased font-sans">
        <PanicShell>
          {children}
        </PanicShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
