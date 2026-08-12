/**
 * Definición canónica del elenco.
 *
 * Tres personajes aplauden y uno pone pegas. Iván es la pieza que evita que el
 * chat se agote: sin él son cuatro personas de acuerdo, y eso aburre enseguida.
 *
 * El ritmo es carácter, no configuración. Pero **no decide el orden**: el orden
 * lo manda el modelo, que lo elige según la conversación (a veces Iván abre la
 * tanda porque está contestando a algo concreto). Estos valores solo modulan el
 * tiempo de cada mensaje en la posición que ya tiene. Ver docs/design-system.md.
 */

export type PersonajeId = 'rosa' | 'nacho' | 'bego' | 'ivan'

export interface Personaje {
  id: PersonajeId
  nombre: string
  /** Color del nombre en la interfaz. Iván es el único frío, a propósito. */
  color: string
  /** Color ANSI para el script de terminal. */
  ansi: string
  /**
   * Milisegundos de pausa antes de empezar a teclear, en la posición que le
   * haya tocado. No reordena nada: si el modelo lo pone primero, va primero.
   *
   * Se ignora cuando el personaje ya venía hablando en el mensaje anterior: en
   * ese caso se usa PAUSA_SEGUIDA, porque está escribiendo del tirón.
   */
  pausa: [min: number, max: number]
  /** Milisegundos por carácter al "escribir". La duración sale de la longitud del texto. */
  velocidad: number
}

/** Pausa entre dos mensajes consecutivos del mismo personaje: está escribiendo del tirón. */
export const PAUSA_SEGUIDA: [min: number, max: number] = [150, 450]

/** Ningún mensaje tarda más de esto en teclearse, por largo que sea. */
export const MAX_ESCRITURA_MS = 3500

/** Techo de una tanda completa. Si se pasa, se comprime todo proporcionalmente. */
export const MAX_TANDA_MS = 10_000

export const PERSONAJES: Record<PersonajeId, Personaje> = {
  rosa: {
    id: 'rosa',
    nombre: 'Rosa',
    color: '#E542A3',
    ansi: '\x1b[95m',
    // Contesta antes de terminar de leer, y teclea rápido.
    pausa: [250, 800],
    velocidad: 18,
  },
  nacho: {
    id: 'nacho',
    nombre: 'Nacho',
    color: '#DFA33B',
    ansi: '\x1b[33m',
    // Redacta con calma algo que le parece importante.
    pausa: [800, 1800],
    velocidad: 30,
  },
  bego: {
    id: 'bego',
    nombre: 'Bego',
    color: '#D9603A',
    ansi: '\x1b[31m',
    // Se toma su tiempo "buscando el dato" y luego lo suelta de golpe.
    pausa: [1100, 2400],
    velocidad: 16,
  },
  ivan: {
    id: 'ivan',
    nombre: 'Iván',
    color: '#5E8FA8',
    ansi: '\x1b[36m',
    // Se lo piensa antes de arrancar y teclea despacio.
    pausa: [1400, 3000],
    velocidad: 45,
  },
}

export const ORDEN: PersonajeId[] = ['rosa', 'nacho', 'bego', 'ivan']

export const RESET_ANSI = '\x1b[0m'
export const GRIS_ANSI = '\x1b[90m'
