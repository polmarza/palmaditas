import { hashIp, insertar, ipDe } from './supabase'
import type { TipoCafe } from './tipos'

/**
 * Registro de métricas del lanzamiento.
 *
 * **Nunca guarda contenido**: ni el mensaje del usuario, ni los del grupo. La
 * landing dice públicamente que las conversaciones no se almacenan, y esto lo
 * respeta. Solo números. Ver supabase/migrations/001_eventos.sql.
 *
 * Hay que esperarla antes de devolver la respuesta: en serverless la función se
 * congela en cuanto responde, así que una inserción lanzada y olvidada se pierde
 * parte de las veces. Nunca lanza —se traga sus propios errores—, de modo que
 * esperarla no puede tumbar una conversación.
 */

export interface Evento {
  /** Identificador aleatorio de conversación, generado en el navegador. */
  sesion: string
  /** Posición del mensaje en la conversación. Su máximo por sesión es la métrica clave. */
  indice: number
  conMencion: boolean
  salvaguarda: 'comprobar' | 'alto' | null
  tokensEntrada: number
  tokensSalida: number
  busquedas: number
  costeMicros: number
}

export async function registrar(peticion: Request, evento: Evento): Promise<void> {
  await escribir(peticion, {
    tipo: 'mensaje',
    sesion: evento.sesion,
    indice: evento.indice,
    con_mencion: evento.conMencion,
    salvaguarda: evento.salvaguarda,
    tokens_entrada: evento.tokensEntrada,
    tokens_salida: evento.tokensSalida,
    busquedas: evento.busquedas,
    coste_micros: evento.costeMicros,
  })
}

/**
 * Un evento de la invitación al café.
 *
 * `indice` es la tanda en la que se mostró, que es lo único interesante además
 * del propio hecho: si convierte mejor pidiéndolo antes o después, se sabrá por
 * aquí sin tocar nada más.
 */
export async function registrarCafe(
  peticion: Request,
  tipo: TipoCafe,
  sesion: string,
  indice: number,
): Promise<void> {
  await escribir(peticion, { tipo, sesion, indice })
}

async function escribir(peticion: Request, fila: Record<string, unknown>): Promise<void> {
  try {
    await insertar('eventos', { ...fila, ip_hash: hashIp(ipDe(peticion)) })
  } catch (error) {
    // Una métrica que falla nunca puede tumbar una conversación.
    console.error('No se pudo registrar la métrica:', error)
  }
}
