import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Palmaditas',
  description: 'Un grupo de chat donde cuatro personajes se emocionan con tu idea.',
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#f0f2f5',
  // El chat es a pantalla completa en móvil: sin zoom accidental al enfocar el campo.
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
