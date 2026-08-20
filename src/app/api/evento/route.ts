import { registrarCafe } from '@/lib/metricas/registrar'
import { esTipoCafe } from '@/lib/metricas/tipos'

/**
 * Eventos anónimos de la invitación al café: si se vio y si se pulsó.
 *
 * Buy Me a Coffee dice cuántos cafés llegan, pero no cuántos vieron la
 * petición. Sin este par de números no se puede saber si la invitación
 * convierte, ni si la tercera tanda es el momento correcto.
 *
 * **Nada de contenido, y nada que consuma API.** Solo el tipo, el
 * identificador aleatorio de conversación y la tanda en la que ocurrió.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(peticion: Request) {
  let tipo: unknown
  let sesion: unknown
  let indice: unknown

  try {
    const cuerpo = (await peticion.json()) as Record<string, unknown>
    tipo = cuerpo.tipo
    sesion = cuerpo.sesion
    indice = cuerpo.indice
  } catch {
    return new Response(null, { status: 400 })
  }

  // Solo los tipos de café. 'mensaje' no se acepta nunca desde fuera: es lo que
  // cuenta el límite por IP, y dejarlo abierto permitiría llenarle el cupo a
  // otra persona sin gastar una sola llamada al modelo.
  if (!esTipoCafe(tipo)) return new Response(null, { status: 400 })
  if (typeof sesion !== 'string' || !UUID.test(sesion)) return new Response(null, { status: 400 })

  const tanda = typeof indice === 'number' && Number.isInteger(indice) ? indice : 0
  if (tanda < 0 || tanda > 200) return new Response(null, { status: 400 })

  await registrarCafe(peticion, tipo, sesion, tanda)

  return new Response(null, { status: 204 })
}
