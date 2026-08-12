import { generarTanda, type Turno } from '@/lib/elenco/tanda'
import { clasificar, respuestaDelSistema } from '@/lib/salvaguarda/clasificar'
import { comprobarLimite } from '@/lib/metricas/limite'
import { registrar } from '@/lib/metricas/registrar'

/**
 * Genera la tanda del grupo, con la salvaguarda por delante.
 *
 * La clave de API vive solo aquí: nunca llega al cliente. El historial lo manda
 * el navegador porque no se persiste ninguna conversación (ver
 * docs/data-model.md) — un usuario podría manipularlo, pero no gana nada con
 * ello salvo gastar su propio saldo.
 */
export async function POST(peticion: Request) {
  // Sin pagos, esto es lo único que separa la clave de un script. Va lo primero:
  // un bloqueo no debe costar ni una llamada al modelo.
  const limite = await comprobarLimite(peticion)
  if (!limite.permitido) {
    return Response.json(
      { error: 'Vas muy rápido. Dales un respiro al grupo y vuelve en un momento.' },
      { status: 429, headers: { 'retry-after': String(limite.esperar ?? 60) } },
    )
  }

  let historial: Turno[]
  let traComprobacion = false
  let sesion: string | null = null

  try {
    const cuerpo = (await peticion.json()) as {
      historial?: unknown
      traComprobacion?: unknown
      sesion?: unknown
    }
    if (!Array.isArray(cuerpo.historial)) throw new Error('historial ausente')
    historial = cuerpo.historial as Turno[]
    traComprobacion = cuerpo.traComprobacion === true
    sesion = typeof cuerpo.sesion === 'string' ? cuerpo.sesion : null
  } catch {
    return Response.json({ error: 'Petición mal formada.' }, { status: 400 })
  }

  if (historial.length === 0 || historial.length > 200) {
    return Response.json({ error: 'Historial fuera de rango.' }, { status: 400 })
  }

  const ultimo = historial.at(-1)
  if (!ultimo || ultimo.rol !== 'usuario') {
    return Response.json({ error: 'El último turno debe ser del usuario.' }, { status: 400 })
  }

  const indice = historial.filter((turno) => turno.rol === 'usuario').length

  // La salvaguarda va antes de generar nada: si salta, el grupo no responde.
  // Se le pasan los mensajes previos del usuario porque nadie entra escribiendo
  // una confesión: se deriva hacia ella a lo largo de la conversación.
  const previos = historial
    .filter((turno) => turno.rol === 'usuario')
    .slice(0, -1)
    .map((turno) => turno.contenido)

  let comprobacion = false

  try {
    const { nivel, categoria } = await clasificar(ultimo.contenido, previos, traComprobacion)

    if (nivel === 'alto') {
      if (sesion) {
        void registrar(peticion, {
          sesion,
          indice,
          conMencion: false,
          salvaguarda: 'alto',
          tokensEntrada: 0,
          tokensSalida: 0,
          busquedas: 0,
          costeMicros: 0,
        })
      }
      return Response.json({ sistema: respuestaDelSistema(categoria) })
    }
    // Señal ambigua: en vez de aplaudir o de soltar un teléfono, se pregunta.
    comprobacion = nivel === 'comprobar'
  } catch (error) {
    // Se falla hacia el lado seguro: sin clasificar, no se genera tanda.
    console.error('Fallo en la salvaguarda:', error)
    return Response.json({ error: 'No he podido comprobar el mensaje.' }, { status: 503 })
  }

  try {
    const { mensajes, mencion, tokens, busquedas, coste } = await generarTanda(historial, {
      comprobacion,
    })

    if (sesion) {
      void registrar(peticion, {
        sesion,
        indice,
        conMencion: mencion !== null,
        salvaguarda: comprobacion ? 'comprobar' : null,
        tokensEntrada: tokens.entrada,
        tokensSalida: tokens.salida,
        busquedas,
        costeMicros: Math.round(coste * 1_000_000),
      })
    }

    return Response.json({ mensajes, comprobacion })
  } catch (error) {
    console.error('Fallo al generar la tanda:', error)
    return Response.json({ error: 'El grupo no ha contestado.' }, { status: 502 })
  }
}
