/**
 * Patrón de fondo del chat: manos abiertas y destellos de aplauso.
 *
 * Dibujado por nosotros. El fondo de garabatos de WhatsApp es un asset suyo con
 * derechos, así que clonamos el efecto —motivos monocromos a baja opacidad— con
 * nuestro propio motivo. Ver docs/design-system.md.
 *
 * Una mano por motivo, no dos superpuestas: a esta opacidad, dos manos rotadas
 * se funden en una mancha y dejan de leerse.
 */

/** Mano abierta: cuatro dedos en abanico sobre la palma. */
function Mano() {
  return (
    <g>
      <path d="M4 34L9 12" />
      <path d="M11 35L16 10" />
      <path d="M18 35L25 12" />
      <path d="M25 34L31 17" />
      <path d="M2 33c-2 12 6 20 17 18s14-11 12-19" />
    </g>
  )
}

/** Rayitas de impacto. */
function Destello() {
  return (
    <g>
      <path d="M14 0v10" />
      <path d="M0 5l7 7" />
      <path d="M28 5l-7 7" />
    </g>
  )
}

export function DoodleBackground() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ color: 'var(--color-garabato)', opacity: 0.45 }}
    >
      <defs>
        <pattern id="palmaditas" width="160" height="160" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <g transform="translate(18 26) rotate(-18 17 27)">
              <Mano />
            </g>
            <g transform="translate(22 8)">
              <Destello />
            </g>

            <g transform="translate(104 96) rotate(18 17 27)">
              <Mano />
            </g>
            <g transform="translate(108 78)">
              <Destello />
            </g>

            <g transform="translate(112 20) scale(0.62) rotate(24 17 27)">
              <Mano />
            </g>

            <g transform="translate(24 108) scale(0.62) rotate(-24 17 27)">
              <Mano />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#palmaditas)" />
    </svg>
  )
}
