/**
 * Definición canónica del elenco.
 *
 * Tres personajes aplauden y uno pone pegas. Iván es la pieza que evita que el
 * chat se agote: sin él son cuatro personas de acuerdo, y eso aburre enseguida.
 *
 * El ritmo (retardo y velocidad) es carácter, no configuración. Está aquí para
 * que la web y la demo guionizada beban de la misma fuente. Ver
 * docs/design-system.md.
 */

export type PersonajeId = 'rosa' | 'nacho' | 'bego' | 'ivan'

export interface Personaje {
  id: PersonajeId
  nombre: string
  /** Color del nombre en la interfaz. Iván es el único frío, a propósito. */
  color: string
  /** Color ANSI para el script de terminal. */
  ansi: string
  /** Milisegundos antes de empezar a escribir, tras el mensaje anterior. */
  retardo: [min: number, max: number]
  /** Milisegundos por carácter al "escribir". */
  velocidad: number
}

export const PERSONAJES: Record<PersonajeId, Personaje> = {
  rosa: {
    id: 'rosa',
    nombre: 'Rosa',
    color: '#E542A3',
    ansi: '\x1b[95m',
    // Contesta antes de terminar de leer.
    retardo: [200, 700],
    velocidad: 18,
  },
  nacho: {
    id: 'nacho',
    nombre: 'Nacho',
    color: '#DFA33B',
    ansi: '\x1b[33m',
    // Está redactando algo que le parece importante.
    retardo: [1200, 2600],
    velocidad: 32,
  },
  bego: {
    id: 'bego',
    nombre: 'Bego',
    color: '#D9603A',
    ansi: '\x1b[31m',
    // Ha estado "buscando el dato" y lo suelta de golpe.
    retardo: [2600, 4500],
    velocidad: 16,
  },
  ivan: {
    id: 'ivan',
    nombre: 'Iván',
    color: '#5E8FA8',
    ansi: '\x1b[36m',
    // Se lo ha pensado. Y aun así lo dice.
    retardo: [3800, 6500],
    velocidad: 55,
  },
}

export const ORDEN: PersonajeId[] = ['rosa', 'nacho', 'bego', 'ivan']

export const RESET_ANSI = '\x1b[0m'
export const GRIS_ANSI = '\x1b[90m'
