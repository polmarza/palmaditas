import { hashIp, insertar, ipDe } from './supabase'

/**
 * Registro de métricas del lanzamiento.
 *
 * **Nunca guarda contenido**: ni el mensaje del usuario, ni los del grupo. La
 * landing dice públicamente que las conversaciones no se almacenan, y esto lo
 * respeta. Solo números. Ver supabase/migrations/001_eventos.sql.
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
  try {
    await insertar('eventos', {
      sesion: evento.sesion,
      indice: evento.indice,
      con_mencion: evento.conMencion,
      salvaguarda: evento.salvaguarda,
      tokens_entrada: evento.tokensEntrada,
      tokens_salida: evento.tokensSalida,
      busquedas: evento.busquedas,
      coste_micros: evento.costeMicros,
      ip_hash: hashIp(ipDe(peticion)),
    })
  } catch (error) {
    // Una métrica que falla nunca puede tumbar una conversación.
    console.error('No se pudo registrar la métrica:', error)
  }
}
