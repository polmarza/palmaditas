import Anthropic from '@anthropic-ai/sdk'
import { ESQUEMA_TANDA, SYSTEM_ELENCO } from './prompt.js'
import type { PersonajeId } from './personajes.js'

/** Haiku 4.5: rápido y barato. Lo que pide el producto es tono y ritmo, no razonamiento profundo. */
export const MODELO = 'claude-haiku-4-5'

/** Dólares por millón de tokens. Para medir el coste real por tanda (Fase 0 del roadmap). */
const PRECIO = { entrada: 1.0, salida: 5.0 }

/**
 * Búsquedas por tanda. Es a la vez tope de coste y de latencia: cada búsqueda
 * añade segundos, y el techo de una tanda son 10 s (ver docs/design-system.md).
 */
const MAX_BUSQUEDAS = 3

/** Reintentos cuando el bucle de herramientas del servidor se pausa. */
const MAX_PAUSAS = 3

export interface Fuente {
  titulo: string
  url: string
}

export interface MensajeElenco {
  personaje: PersonajeId
  texto: string
  /** true cuando Bego da una cifra: se muestra en monoespaciada. */
  mono: boolean
  /** Solo en los mensajes de Bego con dato. El resto, null. */
  fuente: Fuente | null
}

export interface Turno {
  rol: 'usuario' | 'grupo'
  contenido: string
}

export interface ResultadoTanda {
  mensajes: MensajeElenco[]
  coste: number
  tokens: { entrada: number; salida: number }
  /** Búsquedas web realizadas. Tienen coste aparte del de tokens. */
  busquedas: number
}

const cliente = new Anthropic()

/**
 * Genera una tanda completa: los cuatro personajes en una sola llamada.
 *
 * Bego tiene búsqueda web de verdad, así que la llamada puede pausarse mientras
 * el servidor ejecuta las búsquedas (`stop_reason: "pause_turn"`). En ese caso
 * se reenvía la conversación para que continúe donde lo dejó.
 */
export async function generarTanda(historial: Turno[]): Promise<ResultadoTanda> {
  const mensajes: Anthropic.MessageParam[] = historial.map((turno) => ({
    role: turno.rol === 'usuario' ? ('user' as const) : ('assistant' as const),
    content: turno.contenido,
  }))

  let entrada = 0
  let salida = 0
  let busquedas = 0

  for (let intento = 0; intento < MAX_PAUSAS; intento++) {
    const respuesta = await cliente.messages.create({
      model: MODELO,
      max_tokens: 2000,
      system: SYSTEM_ELENCO,
      output_config: { format: { type: 'json_schema', schema: ESQUEMA_TANDA } },
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: MAX_BUSQUEDAS }],
      messages: mensajes,
    })

    entrada += respuesta.usage.input_tokens
    salida += respuesta.usage.output_tokens
    busquedas += respuesta.content.filter((b) => b.type === 'server_tool_use').length

    if (respuesta.stop_reason === 'refusal') {
      throw new Error('El modelo ha rechazado la petición.')
    }

    // El bucle de búsqueda del servidor llegó a su límite: se reenvía para continuar.
    if (respuesta.stop_reason === 'pause_turn') {
      mensajes.push({ role: 'assistant', content: respuesta.content })
      continue
    }

    const bloque = respuesta.content.find((b) => b.type === 'text')
    if (!bloque || bloque.type !== 'text') {
      throw new Error('La respuesta no traía texto.')
    }

    const { mensajes: tanda } = JSON.parse(bloque.text) as { mensajes: MensajeElenco[] }

    return {
      mensajes: tanda,
      busquedas,
      tokens: { entrada, salida },
      coste: (entrada / 1e6) * PRECIO.entrada + (salida / 1e6) * PRECIO.salida,
    }
  }

  throw new Error(`La tanda se pausó más de ${MAX_PAUSAS} veces buscando.`)
}
