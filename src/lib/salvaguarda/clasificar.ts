import Anthropic from '@anthropic-ai/sdk'

/**
 * Salvaguarda: decide si el grupo debe callarse.
 *
 * Palmaditas está diseñado para aplaudir cualquier cosa. La mayoría de las
 * veces eso es una idea de negocio regular y la coña funciona. Pero alguien, en
 * algún momento, va a escribir aquí algo que no es una idea — que está fatal,
 * una crisis, un duelo. Cuatro personajes aplaudiendo con emojis en ese momento
 * pasa de gracioso a desagradable en un segundo.
 *
 * Va en una llamada aparte, no dentro del prompt del elenco: no se le puede
 * pedir al mismo prompt que aplauda todo incondicionalmente y a la vez detecte
 * cuándo no debe. Ver docs/architecture.md.
 */

const MODELO = 'claude-haiku-4-5'

export type Categoria = 'autolesion' | 'crisis' | 'otro'

export interface Veredicto {
  sensible: boolean
  categoria: Categoria | null
}

const INSTRUCCIONES = `Decides si un mensaje escrito en un chat de humor debe recibir la respuesta normal del chat o no.

El chat es un grupo de amigos ficticios que se emocionan con las ideas que les cuentas. Es una broma: aplauden cualquier cosa. Funciona bien con ideas, proyectos, ocurrencias y planes, por raros o malos que sean.

Marca **sensible** solo cuando la persona está contando algo personal y serio sobre su propia vida, donde recibir cuatro mensajes de ánimo con emojis sería desagradable o dañino:

- Ideación suicida, autolesión o deseo de desaparecer → categoría "autolesion"
- Crisis personal real: ruptura dolorosa, despido que le ha hundido, soledad, ansiedad o depresión de la que habla en serio → categoría "crisis"
- Duelo reciente, enfermedad grave propia o de un allegado, violencia o abuso que está sufriendo → categoría "otro"

**No marques sensible** en ninguno de estos casos, aunque el tema suene oscuro:

- Humor negro, sarcasmo, exageraciones de broma ("me quiero morir con este Excel", "esto me está matando")
- Frustración normal o quejas: "estoy harto de mi trabajo", "odio los lunes", "qué asco de semana"
- Ideas de negocio sobre temas serios: funerarias, seguros de vida, apps de salud mental, residencias
- Historias de terceros, ficción, guiones, novelas
- Cualquier cosa que sea una idea, un proyecto o un plan, por mala o rara que sea

**Ante la duda, no marques.** Un falso positivo —alguien cuenta un chiste negro y le sale un mensaje de ayuda— rompe el producto y es tan grave como un falso negativo. Hace falta una señal clara de que la persona está hablando de algo real que le está pasando a ella.`

const ESQUEMA = {
  type: 'object',
  properties: {
    sensible: { type: 'boolean' },
    categoria: {
      anyOf: [{ type: 'null' }, { type: 'string', enum: ['autolesion', 'crisis', 'otro'] }],
    },
  },
  required: ['sensible', 'categoria'],
  additionalProperties: false,
} as const

const cliente = new Anthropic()

export async function clasificar(mensaje: string): Promise<Veredicto> {
  const respuesta = await cliente.messages.create({
    model: MODELO,
    max_tokens: 100,
    system: INSTRUCCIONES,
    output_config: { format: { type: 'json_schema', schema: ESQUEMA } },
    messages: [{ role: 'user', content: mensaje }],
  })

  const bloque = respuesta.content.find((b) => b.type === 'text')
  if (!bloque || bloque.type !== 'text') throw new Error('El clasificador no devolvió texto.')

  return JSON.parse(bloque.text) as Veredicto
}

/**
 * Qué se le responde. Breve y sin dramatismo: reconoce, deja claro que este no
 * es el sitio, y ofrece un recurso solo cuando corresponde.
 */
export function respuestaDelSistema(categoria: Categoria | null): string {
  if (categoria === 'autolesion') {
    return (
      'Voy a parar el grupo aquí. Lo que acabas de escribir merece algo mejor que cuatro ' +
      'personajes aplaudiendo.\n\n' +
      'Si estás pasando por un momento así, en España puedes llamar al 024 — atención a la ' +
      'conducta suicida, gratuito y las 24 horas — o al 112. Fuera de España, los servicios de ' +
      'emergencia locales.\n\n' +
      'Cuando quieras seguir con otra cosa, aquí seguimos.'
    )
  }

  return (
    'Voy a parar el grupo aquí: esto no es un sitio para lo que acabas de contar, y unos amigos ' +
    'inventados animándote no te ayudarían en nada.\n\n' +
    'Si te apetece seguir con una idea, cuando quieras.'
  )
}
