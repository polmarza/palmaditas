/**
 * Tipos de evento. Vive aparte porque lo usan el cliente y el servidor, y el
 * resto del módulo de métricas importa `node:crypto`.
 */

/** Eventos de la invitación al café. Ninguno consume API. */
export const TIPOS_CAFE = [
  'cafe_chat_visto',
  'cafe_chat_pulsado',
  'cafe_cupo_visto',
  'cafe_cupo_pulsado',
] as const

export type TipoCafe = (typeof TIPOS_CAFE)[number]

export function esTipoCafe(valor: unknown): valor is TipoCafe {
  return typeof valor === 'string' && (TIPOS_CAFE as readonly string[]).includes(valor)
}
