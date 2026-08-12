'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { DoodleBackground } from '@/components/chat/DoodleBackground'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { planificar } from '@/lib/elenco/ritmo'
import type { PersonajeId } from '@/lib/elenco/personajes'
import { GUION } from '@/lib/demo/guion'

/**
 * La conversación de la landing, reproduciéndose sola.
 *
 * **Usa el orquestador de ritmo real del producto**, no una velocidad
 * inventada: Rosa contesta rápido, Iván tarda en arrancar. Así la demo enseña
 * el producto de verdad — y si se vieran distintos, la demo mentiría.
 *
 * Arranca al entrar en pantalla. En escritorio va en el hero y se ve al cargar;
 * en móvil, cuando el usuario llega a ella. Una versión anterior la servía con
 * el scroll: se descartó al subirla al hero, porque exigir scroll para que pase
 * algo deja muerto el primer segundo, que es el único garantizado.
 */

/** Pausa antes de volver a empezar, para quien se quede mirando. */
const PAUSA_BUCLE = 4500

export function DemoChat() {
  const marco = useRef<HTMLDivElement>(null)
  const [visibles, setVisibles] = useState(0)
  const [arrancado, setArrancado] = useState(false)

  // Arranca cuando entra en pantalla, no antes.
  useEffect(() => {
    const nodo = marco.current
    if (!nodo || arrancado) return

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          setArrancado(true)
          observador.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observador.observe(nodo)
    return () => observador.disconnect()
  }, [arrancado])

  useEffect(() => {
    if (!arrancado) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibles(GUION.length)
      return
    }

    const temporizadores: ReturnType<typeof setTimeout>[] = []

    function reproducir() {
      setVisibles(0)
      const plan = planificar(GUION)

      plan.forEach((paso, indice) => {
        temporizadores.push(setTimeout(() => setVisibles(indice + 1), paso.apareceEn))
      })

      const total = plan.at(-1)?.apareceEn ?? 0
      temporizadores.push(setTimeout(reproducir, total + PAUSA_BUCLE))
    }

    reproducir()
    return () => temporizadores.forEach(clearTimeout)
  }, [arrancado])

  const mostrados = GUION.slice(0, visibles)
  const siguiente = GUION[visibles]
  const tecleando: PersonajeId[] = siguiente && !siguiente.esUsuario ? [siguiente.personaje] : []

  return (
    <div
      ref={marco}
      className="burbuja relative mx-auto flex h-[min(72dvh,560px)] w-full max-w-[380px] flex-col overflow-hidden rounded-[28px] bg-fondo"
    >
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
  )
}
