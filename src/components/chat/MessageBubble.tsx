import { PERSONAJES, type PersonajeId } from '@/lib/elenco/personajes'
import type { Fuente } from '@/lib/elenco/tanda'
import { BotonCafe } from './BotonCafe'

interface Props {
  personaje: PersonajeId | 'usuario'
  texto: string
  hora: string
  /** El primero de un bloque lleva nombre, avatar y cola. Los siguientes, no. */
  primeroDelBloque: boolean
  mono?: boolean
  fuente?: Fuente | null
  /** Cierra la invitación de Iván: esta burbuja lleva el botón del café. */
  cafe?: boolean
}

export function MessageBubble({
  personaje,
  texto,
  hora,
  primeroDelBloque,
  mono,
  fuente,
  cafe,
}: Props) {
  const esUsuario = personaje === 'usuario'
  const datos = esUsuario ? null : PERSONAJES[personaje]

  return (
    <div className={`flex px-3 ${esUsuario ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`burbuja burbuja-entra relative max-w-[75%] px-[9px] pt-[6px] pb-[8px] text-[15px] leading-[1.35] ${
          esUsuario ? 'bg-saliente' : 'bg-entrante'
        }`}
        style={{
          borderRadius: '7.5px',
          // La cola solo en el primero del bloque, del lado del hablante.
          ...(primeroDelBloque
            ? esUsuario
              ? { borderTopRightRadius: 0 }
              : { borderTopLeftRadius: 0 }
            : {}),
        }}
      >
        {datos && primeroDelBloque && (
          <div className="mb-[2px] text-[13px] font-medium" style={{ color: datos.color }}>
            {datos.nombre}
          </div>
        )}

        <div className={mono ? 'font-mono text-[14px]' : ''}>
          {texto}
          {/* Hueco para que la hora no se solape con la última línea. */}
          <span className="inline-block w-[52px]" />
        </div>

        {cafe && (
          // El relleno de la derecha reserva sitio para la hora, que va
          // posicionada sobre la burbuja y si no se le montaría encima.
          <div className="pr-[52px]">
            <BotonCafe />
          </div>
        )}

        {fuente && (
          <a
            href={fuente.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-[6px] block border-l-2 pl-2 text-[12px] text-texto-suave underline decoration-texto-suave/40 hover:decoration-texto-suave"
            style={{ borderColor: 'var(--color-garabato)' }}
          >
            {fuente.titulo}
          </a>
        )}

        <div className="absolute right-[8px] bottom-[5px] flex items-center gap-[3px] text-[11px] text-texto-suave">
          {hora}
          {esUsuario && (
            <svg width="15" height="11" viewBox="0 0 16 11" aria-label="Leído">
              <path
                d="M1 5.5l3 3L9 2M6.5 8.5l1 1L15 2"
                fill="none"
                stroke="var(--color-check)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
