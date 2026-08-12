import Anthropic from '@anthropic-ai/sdk'
import { ESQUEMA_TANDA, systemPara } from './prompt'
import { detectarMencion } from './menciones'
import { PERSONAJES, type PersonajeId } from './personajes'

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
  /** Personaje etiquetado con @, si el usuario se dirigió a alguien. */
  mencion: PersonajeId | null
}

const cliente = new Anthropic()

/**
 * Genera una tanda: los personajes que toquen, en una sola llamada.
 *
 * **La búsqueda web solo se activa cuando el usuario etiqueta a alguien.**
 * Tenerla siempre puesta multiplicaba el coste por cinco (12.900 tokens de
 * entrada frente a 1.900) porque los resultados entran en el contexto. Ver
 * docs/architecture.md.
 *
 * Con búsqueda, la llamada puede pausarse mientras el servidor la ejecuta
 * (`stop_reason: "pause_turn"`); en ese caso se reenvía para que continúe.
 */
export async function generarTanda(historial: Turno[]): Promise<ResultadoTanda> {
  const ultimo = historial.at(-1)
  const mencion = ultimo?.rol === 'usuario' ? detectarMencion(ultimo.contenido) : null
  // Cualquiera al que etiqueten puede buscar, no solo Bego.
  const puedeBuscar = mencion !== null

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
      system: systemPara(mencion ? PERSONAJES[mencion].nombre : null),
      output_config: { format: { type: 'json_schema', schema: ESQUEMA_TANDA } },
      // Solo Bego etiquetada tiene buscador: es el tope de coste y de latencia.
      ...(puedeBuscar
        ? {
            tools: [
              { type: 'web_search_20250305' as const, name: 'web_search' as const, max_uses: MAX_BUSQUEDAS },
            ],
          }
        : {}),
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
      mencion,
      tokens: { entrada, salida },
      coste: (entrada / 1e6) * PRECIO.entrada + (salida / 1e6) * PRECIO.salida,
    }
  }

  throw new Error(`La tanda se pausó más de ${MAX_PAUSAS} veces buscando.`)
}
