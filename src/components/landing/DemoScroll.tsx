'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { DoodleBackground } from '@/components/chat/DoodleBackground'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { GUION } from '@/lib/demo/guion'

/**
 * La conversación de la landing, servida con el scroll.
 *
 * El marco del chat se queda fijo y los mensajes van cayendo conforme bajas.
 * Alternativa descartada: un mensaje por pantalla, que obligaría a una página
 * kilométrica para ocho mensajes.
 *
 * **Comparte componentes con el chat real** —misma burbuja, misma cabecera,
 * mismo fondo— porque si la demo y el producto se ven distintos, la demo
 * miente. Ver docs/prd.md.
 *
 * `IntersectionObserver` y `sticky` en lugar de animaciones de scroll-timeline:
 * en iOS, que es donde va a verse esto, aún no son fiables.
 */

/** Pantallas de scroll que dura la secuencia. Más = más lento. */
const ALTURA_VH = 260

export function DemoScroll() {
  const pista = useRef<HTMLDivElement>(null)
  const [visibles, setVisibles] = useState(1)

  useEffect(() => {
    // Sin movimiento, la conversación se muestra entera desde el principio.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibles(GUION.length)
      return
    }

    let pendiente = false

    function alScroll() {
      if (pendiente) return
      pendiente = true

      requestAnimationFrame(() => {
        pendiente = false
        const nodo = pista.current
        if (!nodo) return

        const { top, height } = nodo.getBoundingClientRect()
        const recorrido = height - window.innerHeight
        // 0 cuando la sección llega arriba, 1 cuando termina de pasar.
        const progreso = recorrido > 0 ? Math.min(Math.max(-top / recorrido, 0), 1) : 0

        // Se reserva el último tramo para que el final se lea sin prisa.
        setVisibles(Math.max(1, Math.ceil((progreso / 0.85) * GUION.length)))
      })
    }

    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  const mostrados = GUION.slice(0, visibles)
  // Quien acaba de escribir sigue "tecleando" hasta que aparece el siguiente.
  const siguiente = GUION[visibles]
  const tecleando = siguiente && !siguiente.esUsuario ? [siguiente.personaje] : []

  return (
    <div ref={pista} style={{ height: `${ALTURA_VH}vh` }} className="relative">
      <div className="sticky top-0 flex h-dvh items-center justify-center px-4">
        <div className="burbuja relative flex h-[min(78dvh,620px)] w-full max-w-[380px] flex-col overflow-hidden rounded-[28px] bg-fondo">
          <DoodleBackground />
          <ChatHeader tecleando={tecleando} />

          <div className="relative flex flex-1 flex-col justify-end gap-[3px] overflow-hidden py-3">
            {mostrados.map((mensaje, indice) => {
              const anterior = mostrados[indice - 1]
              const mismoBloque =
                anterior !== undefined &&
                anterior.esUsuario === mensaje.esUsuario &&
                anterior.personaje === mensaje.personaje

              return (
                // Cada uno entra por su lado: el grupo desde la izquierda, tú desde la derecha.
                <div key={indice} className={mensaje.esUsuario ? 'demo-entra-der' : 'demo-entra-izq'}>
                  <MessageBubble
                    personaje={mensaje.esUsuario ? 'usuario' : mensaje.personaje}
                    texto={mensaje.texto}
                    hora="23:41"
                    mono={mensaje.mono}
                    fuente={mensaje.fuente}
                    primeroDelBloque={!mismoBloque}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
