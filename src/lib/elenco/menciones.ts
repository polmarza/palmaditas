import { ORDEN, PERSONAJES, type PersonajeId } from './personajes.js'

/**
 * Menciones al estilo de WhatsApp: "@Bego mírame esto".
 *
 * Cuando el usuario etiqueta a alguien, responde solo esa persona. Es la
 * mecánica que hace viable la búsqueda web: en vez de buscar en cada tanda
 * —lo que multiplicaba el coste por cinco— solo se busca cuando el usuario se
 * dirige a Bego. Ver docs/architecture.md.
 */

/** Acepta @bego, @Bego, @Iván y @ivan (sin tilde). */
export function detectarMencion(texto: string): PersonajeId | null {
  const normalizado = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

  for (const id of ORDEN) {
    if (new RegExp(`@${id}\\b`).test(normalizado)) return id
  }
  return null
}

/** Los nombres tal cual se escriben, para la ayuda del script y los avisos. */
export const MENCIONES_DISPONIBLES = ORDEN.map((id) => `@${PERSONAJES[id].nombre}`).join(' · ')
