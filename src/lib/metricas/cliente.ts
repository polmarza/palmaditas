import type { TipoCafe } from './tipos'

/**
 * Manda un evento de la invitación al café desde el navegador.
 *
 * Con `sendBeacon` cuando existe: la petición sobrevive a que la persona se
 * vaya de la página, que es justo lo que pasa al pulsar el botón. Si falla, se
 * pierde el evento y ya está — una métrica nunca puede estropear la navegación.
 */
export function marcarCafe(tipo: TipoCafe, sesion: string, indice: number): void {
  const cuerpo = JSON.stringify({ tipo, sesion, indice })

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/evento', new Blob([cuerpo], { type: 'application/json' }))
      return
    }
    void fetch('/api/evento', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: cuerpo,
      keepalive: true,
    })
  } catch {
    // Sin red, en modo privado o con el beacon bloqueado: se ignora.
  }
}
