import {
  MAX_ESCRITURA_MS,
  MAX_TANDA_MS,
  PAUSA_SEGUIDA,
  PERSONAJES,
  type PersonajeId,
} from './personajes'
import type { MensajeElenco } from './tanda'

/**
 * Orquestador de ritmo.
 *
 * **Nunca reordena la tanda.** El orden lo eligió el modelo según la
 * conversación —a veces Iván abre porque está contestando a algo concreto— y
 * ese orden es mejor que cualquier tabla. Esto solo pone el tiempo de cada
 * mensaje en la posición que ya tiene. Ver docs/design-system.md.
 */

export interface MensajePlanificado {
  mensaje: MensajeElenco
  /** ms desde el envío del usuario en que este personaje empieza a teclear. */
  empiezaEn: number
  /** ms desde el envío del usuario en que el mensaje aparece en el chat. */
  apareceEn: number
}

function entre(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * Calcula cuándo empieza a escribirse y cuándo aparece cada mensaje.
 *
 * aparición(n) = aparición(n-1) + pausa + longitud × velocidad
 *
 * Con dos matices que hacen que se sienta real: dos mensajes seguidos del mismo
 * personaje casi no tienen pausa (está escribiendo del tirón), y la duración
 * sale de la longitud del texto, no del personaje — "vale, me atrapaste"
 * aparece rápido aunque lo diga Iván.
 */
export function planificar(mensajes: MensajeElenco[]): MensajePlanificado[] {
  const plan: MensajePlanificado[] = []
  let reloj = 0
  let anterior: PersonajeId | null = null

  for (const mensaje of mensajes) {
    const personaje = PERSONAJES[mensaje.personaje]
    const seguido = anterior === mensaje.personaje

    const pausa = seguido
      ? entre(PAUSA_SEGUIDA[0], PAUSA_SEGUIDA[1])
      : entre(personaje.pausa[0], personaje.pausa[1])

    const escritura = Math.min(mensaje.texto.length * personaje.velocidad, MAX_ESCRITURA_MS)

    const empiezaEn = reloj + pausa
    const apareceEn = empiezaEn + escritura

    plan.push({ mensaje, empiezaEn, apareceEn })
    reloj = apareceEn
    anterior = mensaje.personaje
  }

  // Techo de duración: se comprime todo proporcionalmente, conservando el orden
  // y las diferencias relativas. Lo que comunica carácter es que Iván teclee
  // más despacio que Rosa, no los milisegundos exactos.
  if (reloj > MAX_TANDA_MS) {
    const factor = MAX_TANDA_MS / reloj
    for (const paso of plan) {
      paso.empiezaEn *= factor
      paso.apareceEn *= factor
    }
  }

  return plan
}

/** Quién está tecleando en un instante dado, para el estado de la cabecera. */
export function tecleandoEn(plan: MensajePlanificado[], ms: number): PersonajeId[] {
  const nombres = new Set<PersonajeId>()
  for (const paso of plan) {
    if (ms >= paso.empiezaEn && ms < paso.apareceEn) nombres.add(paso.mensaje.personaje)
  }
  return [...nombres]
}
