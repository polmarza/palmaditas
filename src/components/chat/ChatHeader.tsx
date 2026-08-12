import { ORDEN, PERSONAJES, type PersonajeId } from '@/lib/elenco/personajes'

interface Props {
  /** Quién está tecleando ahora mismo. */
  tecleando: PersonajeId[]
}

/**
 * Cabecera del chat.
 *
 * **El estado "escribiendo…" va aquí, no en una burbuja**, que es como funciona
 * de verdad en los grupos. Y tiene un regalo: cuando teclean dos a la vez pone
 * "Rosa y Bego están escribiendo…", y esa línea comunica que hay un grupo
 * entero pendiente de ti mejor que cualquier animación.
 */
export function ChatHeader({ tecleando }: Props) {
  const nombres = tecleando.map((id) => PERSONAJES[id].nombre)

  const estado =
    nombres.length === 0
      ? ORDEN.map((id) => PERSONAJES[id].nombre).join(', ')
      : nombres.length === 1
        ? `${nombres[0]} está escribiendo…`
        : `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)} están escribiendo…`

  return (
    <header className="sticky top-0 z-10 bg-barra px-3 py-2">
      {/* Alineada con la columna de mensajes, no a ancho completo. */}
      <div className="mx-auto flex max-w-[680px] items-center gap-3">
        <img src="/favicon.svg" alt="" className="h-10 w-10 rounded-full" />
        <div className="min-w-0">
          <div className="text-[16px] font-medium leading-tight">Palmaditas</div>
          <div className="truncate text-[13px] text-texto-suave">
            {nombres.length > 0 ? <span className="text-acento">{estado}</span> : estado}
          </div>
        </div>
      </div>
    </header>
  )
}
