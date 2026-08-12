import Anthropic from '@anthropic-ai/sdk'
import type { Turno } from './tanda.js'

/**
 * Compactación del historial.
 *
 * Cada tanda reenvía toda la conversación anterior, así que el coste crece de
 * forma cuadrática: 100 mensajes seguidos cuestan ~1,50 $ frente a los ~0,10 $
 * de veinte. Resumir lo antiguo estabiliza el coste por tanda en lugar de
 * dejarlo crecer.
 *
 * La API tiene compactación propia (`compact_20260112`) pero **no está
 * disponible en Haiku 4.5**, así que se hace aquí. Ver docs/architecture.md.
 */

/** Tokens de entrada a partir de los cuales compensa resumir. Llega sobre la tanda 13-15. */
export const UMBRAL_COMPACTAR = 5000

/** Tandas recientes que se conservan íntegras, para no perder el hilo inmediato. */
const TANDAS_RECIENTES = 4

const MODELO_RESUMEN = 'claude-haiku-4-5'

const INSTRUCCIONES = `Resume esta conversación entre una persona y un grupo de amigos que comenta sus ideas.

El resumen sustituye a los mensajes originales, así que el grupo solo va a saber lo que tú escribas aquí. Conserva:

- La idea o ideas de las que se está hablando, con los detalles concretos que ha dado la persona (lugares, cifras propias, planes).
- Las decisiones o preferencias que haya expresado.
- **Los datos verificados y sus fuentes**, tal cual, con la URL. Es lo único comprobable de la conversación y no se puede perder.
- Las objeciones que se han puesto y si quedaron resueltas.
- El tono y en qué punto va la conversación.

No conserves el detalle de quién dijo cada cosa ni las bromas: eso se regenera solo. Escribe en prosa, en segunda persona hablando de la persona ("cuenta que quiere abrir…"), y sé breve.`

const cliente = new Anthropic()

export interface ResultadoCompactar {
  historial: Turno[]
  resumen: string
  coste: number
}

/**
 * Sustituye la parte antigua del historial por un resumen, conservando las
 * últimas tandas íntegras.
 */
export async function compactar(historial: Turno[]): Promise<ResultadoCompactar> {
  // Cada tanda son dos turnos (usuario + grupo).
  const corte = Math.max(0, historial.length - TANDAS_RECIENTES * 2)
  const antiguos = historial.slice(0, corte)
  const recientes = historial.slice(corte)

  const transcripcion = antiguos
    .map((t) => (t.rol === 'usuario' ? `Persona: ${t.contenido}` : `Grupo: ${t.contenido}`))
    .join('\n')

  const respuesta = await cliente.messages.create({
    model: MODELO_RESUMEN,
    max_tokens: 1000,
    system: INSTRUCCIONES,
    messages: [{ role: 'user', content: transcripcion }],
  })

  const bloque = respuesta.content.find((b) => b.type === 'text')
  const resumen = bloque && bloque.type === 'text' ? bloque.text : ''

  const coste =
    (respuesta.usage.input_tokens / 1e6) * 1.0 + (respuesta.usage.output_tokens / 1e6) * 5.0

  return {
    resumen,
    coste,
    historial: [
      { rol: 'usuario', contenido: `[Resumen de lo hablado hasta ahora]\n\n${resumen}` },
      { rol: 'grupo', contenido: JSON.stringify({ mensajes: [] }) },
      ...recientes,
    ],
  }
}
