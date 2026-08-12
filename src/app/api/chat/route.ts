import { generarTanda, type Turno } from '@/lib/elenco/tanda'

/**
 * Genera la tanda del grupo.
 *
 * La clave de API vive solo aquí: nunca llega al cliente. El historial lo manda
 * el navegador porque no se persiste ninguna conversación (ver
 * docs/data-model.md) — un usuario podría manipularlo, pero no gana nada con
 * ello salvo gastar su propio saldo.
 */
export async function POST(peticion: Request) {
  let historial: Turno[]

  try {
    const cuerpo = (await peticion.json()) as { historial?: unknown }
    if (!Array.isArray(cuerpo.historial)) throw new Error('historial ausente')
    historial = cuerpo.historial as Turno[]
  } catch {
    return Response.json({ error: 'Petición mal formada.' }, { status: 400 })
  }

  if (historial.length === 0 || historial.length > 200) {
    return Response.json({ error: 'Historial fuera de rango.' }, { status: 400 })
  }

  try {
    const { mensajes } = await generarTanda(historial)
    return Response.json({ mensajes })
  } catch (error) {
    console.error('Fallo al generar la tanda:', error)
    return Response.json({ error: 'El grupo no ha contestado.' }, { status: 502 })
  }
}
