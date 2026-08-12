import { contar, hashIp, ipDe, METRICAS_ACTIVAS } from './supabase'

/**
 * Límite de peticiones por IP.
 *
 * Sin pagos, el endpoint queda abierto a internet consumiendo de una clave sin
 * tope. El uso normal son céntimos; un script a una petición por segundo son
 * ~12 $/hora, y ~60 si etiqueta a alguien en cada mensaje. Esto lo corta.
 *
 * **No sustituye al tope de gasto de la cuenta de Anthropic**, que es la red
 * que protege pase lo que pase aquí.
 */

/** Generosos para una persona, mortales para un script. */
const POR_MINUTO = 8
const POR_HORA = 80

export interface Veredicto {
  permitido: boolean
  /** Segundos que conviene esperar, para la cabecera Retry-After. */
  esperar?: number
}

export async function comprobarLimite(peticion: Request): Promise<Veredicto> {
  if (!METRICAS_ACTIVAS) return { permitido: true }

  const hash = hashIp(ipDe(peticion))
  const ahora = Date.now()

  const desdeMinuto = new Date(ahora - 60_000).toISOString()
  const desdeHora = new Date(ahora - 3_600_000).toISOString()

  try {
    const [ultimoMinuto, ultimaHora] = await Promise.all([
      contar('eventos', `ip_hash=eq.${hash}&creado_en=gte.${desdeMinuto}`),
      contar('eventos', `ip_hash=eq.${hash}&creado_en=gte.${desdeHora}`),
    ])

    if (ultimoMinuto >= POR_MINUTO) return { permitido: false, esperar: 60 }
    if (ultimaHora >= POR_HORA) return { permitido: false, esperar: 600 }

    return { permitido: true }
  } catch {
    // Si el conteo falla, no se bloquea al usuario: el tope de gasto de la
    // cuenta sigue siendo la red de seguridad real.
    return { permitido: true }
  }
}
