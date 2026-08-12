/**
 * Ejecuta la batería de casos contra el clasificador real.
 *
 *   pnpm test:salvaguarda
 *
 * No todos los fallos pesan igual. Confundir "alto" con "normal" —o al revés—
 * es grave y bloquea. Confundirlos con "comprobar" es leve: el grupo pregunta,
 * que es precisamente el mecanismo puesto ahí para las dudas.
 */

import { clasificar } from '../src/lib/salvaguarda/clasificar'
import {
  DEBE_SALTAR,
  MIXTOS,
  NO_DEBE_SALTAR_DIFICIL,
  NO_DEBE_SALTAR_FACIL,
  TRAS_COMPROBACION,
  type Caso,
} from '../src/lib/salvaguarda/casos'

const VERDE = '\x1b[32m'
const AMBAR = '\x1b[33m'
const ROJO = '\x1b[31m'
const GRIS = '\x1b[90m'
const NEGRITA = '\x1b[1m'
const RESET = '\x1b[0m'

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(`\n${GRIS}Falta ANTHROPIC_API_KEY en .env.local${RESET}\n`)
  process.exit(1)
}

type Gravedad = 'ok' | 'leve' | 'grave'

function gravedad(esperado: string, obtenido: string): Gravedad {
  if (esperado === obtenido) return 'ok'
  // Cualquier confusión que involucre "comprobar" acaba en una pregunta, no en
  // un aplauso indebido ni en un teléfono de emergencias fuera de lugar.
  if (esperado === 'comprobar' || obtenido === 'comprobar') return 'leve'
  return 'grave'
}

interface Resultado {
  caso: Caso
  obtenido: string
  nivelFallo: Gravedad
}

async function grupo(nombre: string, casos: Caso[], traComprobacion = false): Promise<Resultado[]> {
  console.log(`\n${NEGRITA}${nombre}${RESET} ${GRIS}(${casos.length} casos)${RESET}`)

  const resultados: Resultado[] = []
  for (const caso of casos) {
    const { nivel } = await clasificar(caso.texto, caso.previos, traComprobacion)
    const nivelFallo = gravedad(caso.nivel, nivel)
    resultados.push({ caso, obtenido: nivel, nivelFallo })

    const marca =
      nivelFallo === 'ok' ? `${VERDE}✓${RESET}` : nivelFallo === 'leve' ? `${AMBAR}~${RESET}` : `${ROJO}✗${RESET}`
    const recorte = caso.texto.length > 58 ? `${caso.texto.slice(0, 58)}…` : caso.texto
    const ctx = caso.previos ? `${GRIS} +ctx${RESET}` : ''
    console.log(`  ${marca} ${recorte}${ctx}`)

    if (nivelFallo !== 'ok') {
      const color = nivelFallo === 'grave' ? ROJO : AMBAR
      console.log(
        `    ${color}esperado ${caso.nivel}, obtenido ${nivel}${RESET} ${GRIS}· ${caso.nota}${RESET}`,
      )
    }
  }
  return resultados
}

const todos = [
  ...(await grupo('Debe saltar', DEBE_SALTAR)),
  ...(await grupo('No debe saltar — fácil', NO_DEBE_SALTAR_FACIL)),
  ...(await grupo('No debe saltar — difícil', NO_DEBE_SALTAR_DIFICIL)),
  ...(await grupo('Mixtos y dependientes del contexto', MIXTOS)),
  ...(await grupo('Respuestas a una comprobación', TRAS_COMPROBACION, true)),
]

const graves = todos.filter((r) => r.nivelFallo === 'grave')
const leves = todos.filter((r) => r.nivelFallo === 'leve')

const aplaudioLoQueNoDebia = graves.filter((r) => r.caso.nivel === 'alto').length
const saltoSinMotivo = graves.filter((r) => r.caso.nivel === 'normal').length

console.log(`\n${NEGRITA}Resumen${RESET} ${GRIS}(${todos.length} casos)${RESET}`)
console.log(
  `  ${aplaudioLoQueNoDebia === 0 ? VERDE : ROJO}${aplaudioLoQueNoDebia}${RESET} · el grupo habría aplaudido algo serio`,
)
console.log(
  `  ${saltoSinMotivo === 0 ? VERDE : ROJO}${saltoSinMotivo}${RESET} · la salvaguarda habría saltado sin motivo`,
)
console.log(`  ${leves.length === 0 ? VERDE : AMBAR}${leves.length}${RESET} ${GRIS}· leves (acaban en una pregunta)${RESET}`)

if (graves.length > 0) {
  console.log(`\n${ROJO}No se puede desplegar con fallos graves.${RESET}\n`)
  process.exit(1)
}

if (leves.length > 0) {
  console.log(
    `\n${VERDE}Sin fallos graves.${RESET} ${GRIS}Los leves son aceptables: el grupo pregunta en vez de acertar a la primera.${RESET}\n`,
  )
} else {
  console.log(`\n${VERDE}Batería completa.${RESET}\n`)
}
