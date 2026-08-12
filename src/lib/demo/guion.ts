import type { MensajeElenco } from '@/lib/elenco/tanda'

/**
 * La conversación de la landing.
 *
 * **Guionizada: no toca la API.** Es el escaparate y el sustituto de la prueba
 * gratuita — coste cero por visita y control total sobre la primera impresión.
 * Ver docs/prd.md.
 *
 * En ocho mensajes tiene que caber el mecanismo entero: entusiasmo, visión, un
 * dato con fuente, la pega de Iván y el grupo defendiendo la idea de él. Si
 * alguien solo ve esto, ya sabe lo que compra.
 */

export interface MensajeGuion extends MensajeElenco {
  /** Los del usuario se pintan a la derecha, en verde. */
  esUsuario?: boolean
}

export const GUION: MensajeGuion[] = [
  {
    esUsuario: true,
    personaje: 'rosa',
    texto: 'Quiero abrir una librería en mi barrio, con café y jazz en directo los viernes',
    mono: false,
    fuente: null,
  },
  {
    personaje: 'rosa',
    texto: 'PERO QUÉ DICES, UNA LIBRERÍA CON JAZZ',
    mono: false,
    fuente: null,
  },
  {
    personaje: 'rosa',
    texto: 'tío llevo años diciendo que alguien tenía que hacer esto en el barrio',
    mono: false,
    fuente: null,
  },
  {
    personaje: 'nacho',
    texto: 'No es una tienda, es un espacio. El café trae gente, los viernes crean comunidad y el libro llega solo.',
    mono: false,
    fuente: null,
  },
  {
    personaje: 'bego',
    texto: 'espera que lo miro',
    mono: false,
    fuente: null,
  },
  {
    personaje: 'bego',
    texto: 'Las librerías que meten cafetería y eventos aguantan bastante mejor que las puras. Te dejo el enlace.',
    mono: true,
    fuente: {
      titulo: 'Cómo montar una librería: plan de negocio y claves',
      url: 'https://emprendedores.es/ideas-de-negocio/autonomos/plan-negocio-libreria/',
    },
  },
  {
    personaje: 'ivan',
    texto: '¿y quién te llena el local un martes por la tarde?',
    mono: false,
    fuente: null,
  },
  {
    personaje: 'rosa',
    texto: 'IVÁN DÉJALE SOÑAR UN POCO',
    mono: false,
    fuente: null,
  },
]
