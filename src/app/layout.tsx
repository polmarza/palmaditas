import type { Metadata, Viewport } from 'next'
import './globals.css'

const DESCRIPCION =
  'Tu idea es buenísima. Necesitas hype, no feedback. Cuéntasela a un grupo que está de tu parte.'

export const metadata: Metadata = {
  title: 'Palmaditas',
  description: DESCRIPCION,
  // Este producto se difunde compartiendo el enlace, así que la vista previa
  // importa tanto como la propia página.
  openGraph: {
    title: 'Palmaditas',
    description: DESCRIPCION,
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    // Tarjeta grande: la imagen es el argumento de venta, no un adorno.
    card: 'summary_large_image',
    title: 'Palmaditas',
    description: DESCRIPCION,
  },
  // El favicon lo resuelve `src/app/icon.svg` por convención del App Router.
  // `public/favicon.svg` se queda como el mismo dibujo servido para el avatar del grupo.
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
