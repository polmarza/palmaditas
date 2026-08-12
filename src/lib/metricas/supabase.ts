import { createHash } from 'node:crypto'

/**
 * Acceso a Supabase por REST, sin cliente.
 *
 * Solo hacen falta un insert y un conteo, así que no compensa una dependencia
 * entera. La service role salta RLS y **nunca puede salir del servidor**.
 */

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
const CLAVE = process.env.SUPABASE_SERVICE_ROLE_KEY

/** Sin configuración, el proyecto funciona igual: sin métricas ni límites. */
export const METRICAS_ACTIVAS = Boolean(URL_BASE && CLAVE)

function cabeceras(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: CLAVE!,
    Authorization: `Bearer ${CLAVE!}`,
    'content-type': 'application/json',
    ...extra,
  }
}

export async function insertar(tabla: string, fila: Record<string, unknown>): Promise<void> {
  if (!METRICAS_ACTIVAS) return

  await fetch(`${URL_BASE}/rest/v1/${tabla}`, {
    method: 'POST',
    headers: cabeceras({ Prefer: 'return=minimal' }),
    body: JSON.stringify(fila),
  })
}

/** Trae filas que cumplen un filtro. El `select=` va dentro del propio filtro. */
export async function seleccionar<T>(tabla: string, filtro: string): Promise<T[]> {
  if (!METRICAS_ACTIVAS) return []

  const respuesta = await fetch(`${URL_BASE}/rest/v1/${tabla}?${filtro}`, {
    headers: cabeceras(),
  })

  if (!respuesta.ok) return []
  return (await respuesta.json()) as T[]
}

/** Cuenta filas que cumplen un filtro, sin traérselas. */
export async function contar(tabla: string, filtro: string): Promise<number> {
  if (!METRICAS_ACTIVAS) return 0

  const respuesta = await fetch(`${URL_BASE}/rest/v1/${tabla}?select=id&${filtro}`, {
    method: 'HEAD',
    headers: cabeceras({ Prefer: 'count=exact' }),
  })

  // Content-Range llega como "0-24/1234"; lo que interesa es el total.
  const total = respuesta.headers.get('content-range')?.split('/')[1]
  return total && total !== '*' ? Number(total) : 0
}

/**
 * Hash con sal de la IP. No se guarda la IP en claro en ningún sitio: solo se
 * necesita saber si dos peticiones vienen del mismo sitio, no de dónde vienen.
 */
export function hashIp(ip: string): string {
  return createHash('sha256')
    .update(`palmaditas:${process.env.COOKIE_SECRET ?? ''}:${ip}`)
    .digest('hex')
    .slice(0, 32)
}

/** La IP real detrás del proxy de Vercel. */
export function ipDe(peticion: Request): string {
  const reenviada = peticion.headers.get('x-forwarded-for')
  return reenviada?.split(',')[0]?.trim() || 'desconocida'
}
