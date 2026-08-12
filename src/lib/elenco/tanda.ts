import Anthropic from '@anthropic-ai/sdk'
import { ESQUEMA_TANDA, SYSTEM_ELENCO } from './prompt.js'
import type { PersonajeId } from './personajes.js'

/** Haiku 4.5: rápido y barato. Lo que pide el producto es tono y ritmo, no razonamiento profundo. */
export const MODELO = 'claude-haiku-4-5'

/** Dólares por millón de tokens. Para medir el coste real por tanda (Fase 0 del roadmap). */
const PRECIO = { entrada: 1.0, salida: 5.0 }

export interface MensajeElenco {
  personaje: PersonajeId
  texto: string
  /** true cuando Bego suelta una estadística inventada: se muestra en monoespaciada. */
  mono: boolean
}

export interface Turno {
  rol: 'usuario' | 'grupo'
  contenido: string
}

export interface ResultadoTanda {
  mensajes: MensajeElenco[]
  coste: number
  tokens: { entrada: number; salida: number }
}

const cliente = new Anthropic()

/**
 * Genera una tanda completa: los cuatro personajes en una sola llamada.
 *
 * El historial se envía entero porque la API no tiene estado. Se reconstruye
 * como una conversación normal: los turnos del grupo van como mensajes del
 * asistente en el mismo JSON que produce.
 */
export async function generarTanda(historial: Turno[]): Promise<ResultadoTanda> {
  const respuesta = await cliente.messages.create({
    model: MODELO,
    max_tokens: 1500,
    system: SYSTEM_ELENCO,
    output_config: { format: { type: 'json_schema', schema: ESQUEMA_TANDA } },
    messages: historial.map((turno) => ({
      role: turno.rol === 'usuario' ? ('user' as const) : ('assistant' as const),
      content: turno.contenido,
    })),
  })

  if (respuesta.stop_reason === 'refusal') {
    throw new Error('El modelo ha rechazado la petición.')
  }

  const bloque = respuesta.content.find((b) => b.type === 'text')
  if (!bloque || bloque.type !== 'text') {
    throw new Error('La respuesta no traía texto.')
  }

  const { mensajes } = JSON.parse(bloque.text) as { mensajes: MensajeElenco[] }

  const entrada = respuesta.usage.input_tokens
  const salida = respuesta.usage.output_tokens

  return {
    mensajes,
    tokens: { entrada, salida },
    coste: (entrada / 1e6) * PRECIO.entrada + (salida / 1e6) * PRECIO.salida,
  }
}
