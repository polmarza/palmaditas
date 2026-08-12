/**
 * Fase 0: conversar con el elenco desde el terminal.
 *
 * Sin interfaz, sin retardos, sin efecto de escritura — y eso es deliberado.
 * El criterio de validación del roadmap es que la transcripción en bruto ya
 * haga gracia. Si solo funciona con la animación, el producto es un truco.
 *
 *   pnpm elenco
 */

import { createInterface } from 'node:readline/promises'
import { mkdir, writeFile } from 'node:fs/promises'
import { stdin, stdout } from 'node:process'
import { generarTanda, type Turno } from '../src/lib/elenco/tanda.js'
import { GRIS_ANSI, PERSONAJES, RESET_ANSI } from '../src/lib/elenco/personajes.js'

const NEGRITA = '\x1b[1m'
const VERDE = '\x1b[32m'

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    `\n${GRIS_ANSI}Falta ANTHROPIC_API_KEY.${RESET_ANSI}\n\n` +
      `  cp .env.example .env.local\n` +
      `  # y pon tu clave de https://console.anthropic.com\n`,
  )
  process.exit(1)
}

const historial: Turno[] = []
const transcripcion: string[] = []
let costeTotal = 0
let tandas = 0

const rl = createInterface({ input: stdin, output: stdout })

console.log(`
${NEGRITA}Palmaditas${RESET_ANSI} ${GRIS_ANSI}— Fase 0, elenco en bruto${RESET_ANSI}

${GRIS_ANSI}Escribe una idea y el grupo responde. Sin ritmo ni interfaz: esto es para
juzgar si los personajes tienen gracia, no si la animación funciona.

  /coste    resumen de gasto
  /salir    terminar y guardar la transcripción${RESET_ANSI}
`)

function resumenCoste(): string {
  const medio = tandas > 0 ? costeTotal / tandas : 0
  return (
    `${GRIS_ANSI}${tandas} tanda(s) · ${costeTotal.toFixed(4)} $ en total · ` +
    `${medio.toFixed(4)} $ por tanda · ~${(medio * 100).toFixed(2)} $ por 100 mensajes${RESET_ANSI}`
  )
}

async function guardar(): Promise<string | null> {
  if (transcripcion.length === 0) return null
  await mkdir('transcripciones', { recursive: true })
  const nombre = `transcripciones/${new Date().toISOString().replace(/[:.]/g, '-')}.md`
  await writeFile(nombre, `# Transcripción\n\n${transcripcion.join('\n')}\n`, 'utf8')
  return nombre
}

while (true) {
  const entrada = (await rl.question(`${VERDE}${NEGRITA}tú ›${RESET_ANSI} `)).trim()

  if (entrada === '') continue

  if (entrada === '/salir') break

  if (entrada === '/coste') {
    console.log(`\n${resumenCoste()}\n`)
    continue
  }

  historial.push({ rol: 'usuario', contenido: entrada })
  transcripcion.push(`**Tú:** ${entrada}\n`)

  process.stdout.write(`${GRIS_ANSI}escribiendo…${RESET_ANSI}`)

  try {
    const { mensajes, coste, tokens } = await generarTanda(historial)

    // Borra la línea de "escribiendo…"
    process.stdout.write('\r\x1b[K')

    for (const mensaje of mensajes) {
      const personaje = PERSONAJES[mensaje.personaje]
      const texto = mensaje.mono ? `\x1b[2m${mensaje.texto}${RESET_ANSI}` : mensaje.texto
      console.log(`${personaje.ansi}${NEGRITA}${personaje.nombre}${RESET_ANSI} ${texto}`)
      transcripcion.push(`- **${personaje.nombre}:** ${mensaje.texto}`)
    }

    // El grupo vuelve al historial como su JSON, que es lo que el modelo produce.
    historial.push({ rol: 'grupo', contenido: JSON.stringify({ mensajes }) })
    transcripcion.push('')

    costeTotal += coste
    tandas += 1

    console.log(
      `\n${GRIS_ANSI}${tokens.entrada} entrada · ${tokens.salida} salida · ` +
        `${coste.toFixed(4)} $ · acumulado ${costeTotal.toFixed(4)} $${RESET_ANSI}\n`,
    )
  } catch (error) {
    process.stdout.write('\r\x1b[K')
    console.error(`\n${GRIS_ANSI}Ha fallado la tanda:${RESET_ANSI}`, error instanceof Error ? error.message : error, '\n')
  }
}

rl.close()

const archivo = await guardar()
console.log(`\n${resumenCoste()}`)
if (archivo) console.log(`${GRIS_ANSI}Transcripción guardada en ${archivo}${RESET_ANSI}`)
console.log()
