/**
 * Patrón de fondo del chat.
 *
 * Dibujado por nosotros. El fondo de garabatos de WhatsApp es un asset suyo con
 * derechos, así que clonamos el efecto —motivos monocromos a baja opacidad— con
 * nuestros propios motivos: manos aplaudiendo, palmas y confeti. Igual de
 * reconocible, propio, y encima es un chiste más. Ver docs/design-system.md.
 */
export function DoodleBackground() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ color: 'var(--color-garabato)', opacity: 0.35 }}
    >
      <defs>
        <pattern id="palmaditas" width="120" height="120" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {/* Dos manos aplaudiendo */}
            <path d="M18 34c-3-4-2-9 2-11l7 8" />
            <path d="M24 26c-2-4 0-8 4-9l6 10" />
            <path d="M40 34c3-4 2-9-2-11l-7 8" />
            <path d="M34 26c2-4 0-8-4-9l-6 10" />
            <path d="M20 36c2 6 8 9 14 8s8-6 6-10" />
            {/* Rayitas de impacto */}
            <path d="M14 18l-4-4M30 12v-5M46 18l4-4" />

            {/* Palma abierta */}
            <path d="M84 44V30M90 44V27M96 44v-14M78 46v-9" />
            <path d="M76 44c0 8 5 13 12 13s12-5 12-13v-4" />

            {/* Confeti */}
            <path d="M62 76l3-4M68 84l4 2M56 90l-3 3" />
            <path d="M100 92l3-3M94 100l-2 4" />

            {/* Segunda mano, desplazada para romper la retícula */}
            <path d="M26 96c-3-4-2-9 2-11l7 8" />
            <path d="M48 96c3-4 2-9-2-11l-7 8" />
            <path d="M28 98c2 6 8 9 14 8s8-6 6-10" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#palmaditas)" />
    </svg>
  )
}
