import { contar, hashIp, ipDe, METRICAS_ACTIVAS, seleccionar } from './supabase'

/**
 * Límites de uso por IP.
 *
 * Dos cosas distintas con la misma herramienta:
 *
 * 1. **Ritmo** — corta los scripts. Sin pagos, el endpoint queda abierto a
 *    internet consumiendo de una clave sin tope: el uso normal son céntimos,
 *    pero una petición por segundo son ~12 $/hora.
 * 2. **Cupo** — el producto está en fase de prueba y se reparte una cantidad
 *    de uso por cabeza. Al agotarlo se ofrece el repositorio, que es ilimitado.
 *
 * **Ninguno sustituye al tope de gasto de la cuenta de Anthropic**, que es la
 * red que protege pase lo que pase aquí.
 */

/** Generosos para una persona, mortales para un script. */
const POR_MINUTO = 8
const POR_HORA = 80

/**
 * Cupo por IP en micros de dólar (0,07 $), unos 15-18 mensajes.
 *
 * Elegido para que quepa una conversación entera hasta donde compactaría el
 * historial: es el punto en el que el elenco ya ha demostrado si aguanta, que
 * es justo lo que este lanzamiento quiere medir.
 */
export const CUPO_MICROS = 70_000

/** Ventana del cupo. Un día después se puede volver. */
const VENTANA_HORAS = 24

/**
 * La tabla guarda también los eventos de la invitación al café, que no consumen
 * API. Si contaran, ver el botón gastaría cupo.
 */
const SOLO_MENSAJES = 'tipo=eq.mensaje'

export type Motivo = 'ritmo' | 'cupo'

export interface Veredicto {
  permitido: boolean
  motivo?: Motivo
  /** Segundos que conviene esperar, para la cabecera Retry-After. */
  esperar?: number
}

export async function comprobarLimite(peticion: Request): Promise<Veredicto> {
  if (!METRICAS_ACTIVAS) return { permitido: true }

  const hash = hashIp(ipDe(peticion))
  const ahora = Date.now()

  const desdeMinuto = new Date(ahora - 60_000).toISOString()
  const desdeHora = new Date(ahora - 3_600_000).toISOString()
  const desdeVentana = new Date(ahora - VENTANA_HORAS * 3_600_000).toISOString()

  try {
    const [ultimoMinuto, ultimaHora, gastado] = await Promise.all([
      contar('eventos', `${SOLO_MENSAJES}&ip_hash=eq.${hash}&creado_en=gte.${desdeMinuto}`),
      contar('eventos', `${SOLO_MENSAJES}&ip_hash=eq.${hash}&creado_en=gte.${desdeHora}`),
      gastoDe(hash, desdeVentana),
    ])

    if (ultimoMinuto >= POR_MINUTO) return { permitido: false, motivo: 'ritmo', esperar: 60 }
    if (ultimaHora >= POR_HORA) return { permitido: false, motivo: 'ritmo', esperar: 600 }
    if (gastado >= CUPO_MICROS) return { permitido: false, motivo: 'cupo' }

    return { permitido: true }
  } catch {
    // Si el conteo falla, no se bloquea al usuario: el tope de gasto de la
    // cuenta sigue siendo la red de seguridad real.
    return { permitido: true }
  }
}

/**
 * Gasto acumulado de una IP en la ventana.
 *
 * Se suma en JavaScript en lugar de en SQL porque el límite de ritmo mantiene
 * el número de filas bajo (80 por hora como mucho) y así no hace falta crear
 * una función en la base de datos.
 */
async function gastoDe(hash: string, desde: string): Promise<number> {
  const filas = await seleccionar<{ coste_micros: number }>(
    'eventos',
    `select=coste_micros&${SOLO_MENSAJES}&ip_hash=eq.${hash}&creado_en=gte.${desde}`,
  )
  return filas.reduce((total, fila) => total + (fila.coste_micros ?? 0), 0)
}
