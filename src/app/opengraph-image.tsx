import { ImageResponse } from 'next/og'

/**
 * Imagen que se ve al compartir el enlace.
 *
 * Generada por Next en lugar de mantener un PNG: así no se queda desfasada
 * cuando cambian los colores o el copy.
 *
 * Enseña el mecanismo completo en cuatro burbujas —idea, entusiasmo, la pega de
 * Iván y el grupo tapándole la boca— porque eso es lo que hace gracia y lo que
 * decide si alguien pincha. Ver docs/prd.md.
 */

export const alt = 'Palmaditas: un grupo de chat donde cuatro amigos se emocionan con tu idea'
export const contentType = 'image/png'

/**
 * Se dibuja al doble de la medida estándar (1200×630).
 *
 * Las plataformas la escalan al ancho de su tarjeta, y en pantallas de alta
 * densidad eso deja la versión de 1200 blanda. Al doble se ve nítida, y el
 * archivo sigue siendo pequeño para el tope de 8 MB que admiten.
 */
const ESCALA = 2
const px = (medida: number) => medida * ESCALA

export const size = { width: px(1200), height: px(630) }

const FONDO = '#EFE7DE'
const ENTRANTE = '#FFFFFF'
const SALIENTE = '#DCF8C6'
const TEXTO = '#111B21'
const SUAVE = '#667781'
const ACENTO = '#25955D'
const ROSA = '#E542A3'
const IVAN = '#5E8FA8'

function Burbuja({
  nombre,
  color,
  texto,
  propia = false,
}: {
  nombre?: string
  color?: string
  texto: string
  propia?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: propia ? 'flex-end' : 'flex-start',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '80%',
          background: propia ? SALIENTE : ENTRANTE,
          borderRadius: px(14),
          padding: `${px(14)}px ${px(18)}px`,
          fontSize: px(27),
          color: TEXTO,
          lineHeight: 1.3,
        }}
      >
        {nombre && (
          <div style={{ color, fontSize: px(22), fontWeight: 600, marginBottom: px(4) }}>
            {nombre}
          </div>
        )}
        {texto}
      </div>
    </div>
  )
}

export default function Imagen() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: FONDO }}>
        {/* Columna del claim */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: px(510),
            padding: `0 ${px(50)}px`,
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: px(76),
              height: px(76),
              borderRadius: px(18),
              background: ACENTO,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: px(34),
            }}
          >
            <svg width={px(46)} height={px(46)} viewBox="0 0 64 64">
              <g stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round">
                <path d="M32 10V19" />
                <path d="M16.4 16.4L22.8 22.8" />
                <path d="M10 32H19" />
                <path d="M32 54V45" />
                <path d="M47.6 47.6L41.2 41.2" />
                <path d="M54 32H45" />
              </g>
            </svg>
          </div>

          <div style={{ fontSize: px(45), fontWeight: 800, color: TEXTO, lineHeight: 1.12 }}>
            Tu idea es buenísima.
          </div>
          <div style={{ fontSize: px(45), fontWeight: 800, color: ACENTO, lineHeight: 1.12 }}>
            Necesitas hype, no feedback.
          </div>

          <div style={{ fontSize: px(26), color: SUAVE, marginTop: px(28) }}>palmaditas.com</div>
        </div>

        {/* Columna de la conversación */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: px(12),
            flex: 1,
            padding: `0 ${px(52)}px`,
          }}
        >
          <Burbuja propia texto="Quiero abrir una librería con café y jazz en directo" />
          <Burbuja nombre="Rosa" color={ROSA} texto="PERO QUÉ DICES, UNA LIBRERÍA CON JAZZ" />
          <Burbuja nombre="Iván" color={IVAN} texto="¿y quién te llena el local un martes?" />
          <Burbuja nombre="Rosa" color={ROSA} texto="IVÁN DÉJALE SOÑAR UN POCO" />
        </div>
      </div>
    ),
    size,
  )
}
