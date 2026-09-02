import type { Metadata, Viewport } from 'next'
import MetaPixel from '@/components/analytics/MetaPixel'
import { PENGATURAN_GLOBAL } from '@/lib/pengaturan-global'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: PENGATURAN_GLOBAL.metaTitleDefault,
    template: `%s | Herbal Insani`,
  },
  description: PENGATURAN_GLOBAL.metaDescriptionDefault,
  openGraph: {
    title: PENGATURAN_GLOBAL.metaTitleDefault,
    description: PENGATURAN_GLOBAL.metaDescriptionDefault,
    type: 'website',
    locale: 'id_ID',
    siteName: 'Herbal Insani',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          async
        />
        <MetaPixel />
      </body>
    </html>
  )
}
