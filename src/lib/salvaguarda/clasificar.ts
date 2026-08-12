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

/**
 * - `normal`: el grupo responde como siempre.
 * - `comprobar`: señal ambigua. El grupo no aplaude: alguien pregunta si va en
 *   serio, y la respuesta decide. Evita el falso positivo sin taparse los ojos.
 * - `alto`: señal clara. El grupo se calla y responde el sistema.
 */
export type Nivel = 'normal' | 'comprobar' | 'alto'

export interface Veredicto {
  nivel: Nivel
  categoria: Categoria | null
}

const INSTRUCCIONES = `Decides si un mensaje escrito en un chat de humor debe recibir la respuesta normal del chat o no.

El chat es un grupo de amigos ficticios que se emocionan con las ideas que les cuentas. Es una broma: aplauden cualquier cosa. Funciona bien con ideas, proyectos, ocurrencias y planes, por raros o malos que sean.

Devuelves uno de tres niveles.

**"alto"** — la persona está contando algo personal y serio sobre su propia vida, y recibir cuatro mensajes de ánimo con emojis sería desagradable o dañino:

- Ideación suicida, autolesión o deseo de desaparecer, dicho de forma directa → categoría "autolesion"
- Crisis personal real: ruptura dolorosa, despido que le ha hundido, soledad, ansiedad o depresión de la que habla en serio → categoría "crisis"
- Duelo reciente, enfermedad grave propia o de un allegado, violencia o abuso que está sufriendo → categoría "otro"

**"comprobar"** — hay una señal que **probablemente** es una forma de hablar, pero que no se puede descartar sin más. El caso típico: una hipérbole que menciona un método concreto de hacerse daño ("esto o me tiro por la ventana", "como no salga esto me cuelgo"), dicha sobre algo trivial. En un grupo de amigos, aquí nadie aplaude ni llama a emergencias: alguien pregunta. Devuelve también la categoría que correspondería si resultara ir en serio.

Usa "comprobar" con cuentagotas: solo cuando hay una mención concreta de hacerse daño. Un "me quiero morir con este Excel" o un "esta reunión me está matando" son expresiones tan gastadas que no mencionan nada concreto — esas son "normal".

**"normal"** — todo lo demás. Aunque el tema suene oscuro:

- Humor negro, sarcasmo, exageraciones de broma ("me quiero morir con este Excel", "esto me está matando")
- Frustración normal o quejas: "estoy harto de mi trabajo", "odio los lunes", "qué asco de semana"
- **Desgaste laboral dicho como queja**, incluso con expresiones fuertes: "estoy quemadísimo", "este proyecto me está costando la salud", "no puedo más con esto". Son frases hechas sobre un trabajo, no una declaración clínica. Marca solo si describe síntomas concretos y actuales fuera del trabajo
- **Una pérdida mencionada con serenidad**, en pasado y como parte del origen de una idea: "la idea me la dio mi madre antes de morir", "monté esto después del divorcio", "yo pasé por eso y sé lo que es". Recordar algo duro no es estar en crisis. Lo que marca la diferencia es el malestar **actual**: "se murió mi padre y no sé qué hacer conmigo" sí, "mi padre me enseñó esto antes de morir" no
- Ideas de negocio sobre temas serios: funerarias, seguros de vida, apps de salud mental, residencias
- Historias de terceros, ficción, guiones, novelas
- Cualquier cosa que sea una idea, un proyecto o un plan, por mala o rara que sea

**Ante la duda entre "normal" y "alto", usa "comprobar".** Para eso está: no hace falta acertar a la primera cuando se puede preguntar. Lo que no vale es marcar "alto" por si acaso —alguien cuenta un chiste negro y le sale un mensaje de ayuda— ni dejar pasar algo real por miedo a molestar.

Puedes recibir los últimos mensajes de la conversación como contexto. **Juzga siempre el último**, pero úsalo: la gente no suele entrar escribiendo una confesión, sino que deriva hacia ella. Un "necesito que esto salga bien" después de nueve mensajes sobre un proyecto es ilusión normal; el mismo mensaje detrás de "me quedan dos meses de ahorros y no duermo" es otra cosa.

Un mensaje puede mezclar una idea con algo personal serio. Si la parte personal es real y grave, marca "alto" aunque venga envuelta en un proyecto.

**Si te avisan de que en el mensaje anterior ya se le preguntó si iba en serio:** el mensaje que juzgas es su respuesta. Si desmiente con claridad —"es broma", "no, tranquilo", "es una forma de hablar"— es "normal". Si confirma, insiste, se escurre o contesta con ambigüedad, es "alto". Ahí ya no se vuelve a preguntar.`

const ESQUEMA = {
  type: 'object',
  properties: {
    nivel: { type: 'string', enum: ['normal', 'comprobar', 'alto'] },
    categoria: {
      anyOf: [{ type: 'null' }, { type: 'string', enum: ['autolesion', 'crisis', 'otro'] }],
    },
  },
  required: ['nivel', 'categoria'],
  additionalProperties: false,
} as const

const cliente = new Anthropic()

/** Turnos previos que se le pasan como contexto. Bastan para captar una deriva. */
const CONTEXTO = 6

/**
 * @param mensaje El último mensaje del usuario, que es el que se juzga.
 * @param previos Mensajes anteriores del usuario, del más antiguo al más reciente.
 * @param traComprobacion Si en la tanda anterior el grupo ya le preguntó si iba en serio.
 */
export async function clasificar(
  mensaje: string,
  previos: string[] = [],
  traComprobacion = false,
): Promise<Veredicto> {
  const contexto = previos.slice(-CONTEXTO)

  const partes: string[] = []
  if (contexto.length > 0) {
    partes.push(
      `Mensajes anteriores de la persona, como contexto:\n${contexto.map((t) => `- ${t}`).join('\n')}`,
    )
  }
  if (traComprobacion) {
    partes.push('AVISO: en la tanda anterior el grupo ya le preguntó si lo decía en serio.')
  }
  partes.push(`Mensaje a juzgar:\n${mensaje}`)

  const contenido = partes.join('\n\n')

  const respuesta = await cliente.messages.create({
    model: MODELO,
    max_tokens: 100,
    system: INSTRUCCIONES,
    output_config: { format: { type: 'json_schema', schema: ESQUEMA } },
    messages: [{ role: 'user', content: contenido }],
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
