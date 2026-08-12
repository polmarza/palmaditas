/**
 * Ejecuta la batería de casos contra el clasificador real.
 *
 *   pnpm test:salvaguarda
 *
 * Criterio para dar la calibración por buena: **cero falsos negativos** en el
 * grupo que debe saltar, y falsos positivos suficientemente bajos en el difícil
 * como para que no aparezcan en uso normal.
 */

import { clasificar } from '../src/lib/salvaguarda/clasificar'
import { DEBE_SALTAR, NO_DEBE_SALTAR_DIFICIL, NO_DEBE_SALTAR_FACIL, type Caso } from '../src/lib/salvaguarda/casos'

const VERDE = '\x1b[32m'
const ROJO = '\x1b[31m'
const GRIS = '\x1b[90m'
const NEGRITA = '\x1b[1m'
const RESET = '\x1b[0m'

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(`\n${GRIS}Falta ANTHROPIC_API_KEY en .env.local${RESET}\n`)
  process.exit(1)
}

interface Resultado {
  caso: Caso
  obtenido: boolean
  acierto: boolean
}

async function grupo(nombre: string, casos: Caso[]): Promise<Resultado[]> {
  console.log(`\n${NEGRITA}${nombre}${RESET} ${GRIS}(${casos.length} casos)${RESET}`)

  // En serie a propósito: son pocos casos y así el orden de salida es legible.
  const resultados: Resultado[] = []
  for (const caso of casos) {
    const { sensible } = await clasificar(caso.texto)
    const acierto = sensible === caso.sensible
    resultados.push({ caso, obtenido: sensible, acierto })

    const marca = acierto ? `${VERDE}✓${RESET}` : `${ROJO}✗${RESET}`
    const recorte = caso.texto.length > 62 ? `${caso.texto.slice(0, 62)}…` : caso.texto
    console.log(`  ${marca} ${recorte}`)
    if (!acierto) {
      console.log(
        `    ${ROJO}esperado ${caso.sensible ? 'sensible' : 'normal'}, ` +
          `obtenido ${sensible ? 'sensible' : 'normal'}${RESET} ${GRIS}· ${caso.nota}${RESET}`,
      )
    }
  }
  return resultados
}

const debeSaltar = await grupo('Debe saltar', DEBE_SALTAR)
const facil = await grupo('No debe saltar — fácil', NO_DEBE_SALTAR_FACIL)
const dificil = await grupo('No debe saltar — difícil', NO_DEBE_SALTAR_DIFICIL)

const falsosNegativos = debeSaltar.filter((r) => !r.acierto).length
const falsosPositivos = [...facil, ...dificil].filter((r) => !r.acierto).length
const totalNoSensibles = facil.length + dificil.length

console.log(`\n${NEGRITA}Resumen${RESET}`)
console.log(
  `  Falsos negativos: ${falsosNegativos === 0 ? VERDE : ROJO}${falsosNegativos}/${DEBE_SALTAR.length}${RESET}` +
    `${GRIS}  (el grupo aplaudiendo algo que no debía)${RESET}`,
)
console.log(
  `  Falsos positivos: ${falsosPositivos === 0 ? VERDE : ROJO}${falsosPositivos}/${totalNoSensibles}${RESET}` +
    `${GRIS}  (salvaguarda saltando sin motivo)${RESET}`,
)

if (falsosNegativos > 0) {
  console.log(`\n${ROJO}No se puede desplegar con falsos negativos.${RESET}\n`)
  process.exit(1)
}

if (falsosPositivos > 0) {
  console.log(
    `\n${GRIS}Sin falsos negativos. Revisa los falsos positivos: cada uno es una experiencia rota.${RESET}\n`,
  )
  process.exit(1)
}

console.log(`\n${VERDE}Batería completa.${RESET}\n`)
