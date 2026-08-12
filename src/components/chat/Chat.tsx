'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatHeader } from './ChatHeader'
import { DoodleBackground } from './DoodleBackground'
import { MessageBubble } from './MessageBubble'
import { SystemNotice } from './SystemNotice'
import { LimiteDrawer } from './LimiteDrawer'
import { planificar } from '@/lib/elenco/ritmo'
import type { PersonajeId } from '@/lib/elenco/personajes'
import type { Fuente, MensajeElenco, Turno } from '@/lib/elenco/tanda'

interface Visible {
  id: number
  /** 'sistema' es la salvaguarda: no lo dice el grupo, y se ve distinto. */
  personaje: PersonajeId | 'usuario' | 'sistema'
  texto: string
  hora: string
  mono?: boolean
  fuente?: Fuente | null
}

function ahora(): string {
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export function Chat() {
  const [visibles, setVisibles] = useState<Visible[]>([])
  const [tecleando, setTecleando] = useState<PersonajeId[]>([])
  const [borrador, setBorrador] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** Se ha agotado el uso de prueba: el campo se bloquea, la conversación se sigue leyendo. */
  const [cupoAgotado, setCupoAgotado] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const historial = useRef<Turno[]>([])
  const contador = useRef(0)
  /** La tanda anterior fue una comprobación: el siguiente mensaje es la respuesta. */
  const traComprobacion = useRef(false)
  /**
   * Identificador aleatorio de esta conversación, solo para agrupar métricas.
   * No identifica a nadie y se pierde al recargar; no viaja nada del contenido.
   */
  const sesion = useRef<string>('')
  if (sesion.current === '') sesion.current = crypto.randomUUID()
  const finRef = useRef<HTMLDivElement>(null)
  const temporizadores = useRef<ReturnType<typeof setTimeout>[]>([])

  // Scroll anclado al último mensaje.
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [visibles, tecleando])

  useEffect(() => () => temporizadores.current.forEach(clearTimeout), [])

  /**
   * Suelta la tanda escalonada según el plan de ritmo.
   *
   * El orden viene del modelo y no se toca; aquí solo se reparten los tiempos.
   * Ver docs/design-system.md.
   */
  function desplegar(mensajes: MensajeElenco[]) {
    const plan = planificar(mensajes)

    for (const paso of plan) {
      temporizadores.current.push(
        setTimeout(() => {
          setTecleando((previos) =>
            previos.includes(paso.mensaje.personaje) ? previos : [...previos, paso.mensaje.personaje],
          )
        }, paso.empiezaEn),
      )

      temporizadores.current.push(
        setTimeout(() => {
          setVisibles((previos) => [
            ...previos,
            {
              id: contador.current++,
              personaje: paso.mensaje.personaje,
              texto: paso.mensaje.texto,
              hora: ahora(),
              mono: paso.mensaje.mono,
              fuente: paso.mensaje.fuente,
            },
          ])
          // Se retira del indicador solo si no le queda otro mensaje por soltar.
          setTecleando((previos) => {
            const pendiente = plan.some(
              (otro) =>
                otro.mensaje.personaje === paso.mensaje.personaje && otro.apareceEn > paso.apareceEn,
            )
            return pendiente ? previos : previos.filter((id) => id !== paso.mensaje.personaje)
          })
        }, paso.apareceEn),
      )
    }

    const total = plan.at(-1)?.apareceEn ?? 0
    temporizadores.current.push(
      setTimeout(() => {
        setTecleando([])
        setOcupado(false)
      }, total + 50),
    )
  }

  async function enviar() {
    const texto = borrador.trim()
    if (texto === '' || ocupado) return

    setBorrador('')
    setError(null)
    setOcupado(true)
    setVisibles((previos) => [
      ...previos,
      { id: contador.current++, personaje: 'usuario', texto, hora: ahora() },
    ])
    historial.current.push({ rol: 'usuario', contenido: texto })

    try {
      const respuesta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          historial: historial.current,
          traComprobacion: traComprobacion.current,
          sesion: sesion.current,
        }),
      })

      if (respuesta.status === 429) {
        const { motivo } = (await respuesta.json()) as { motivo?: string }
        historial.current.pop()
        setBorrador(texto)

        if (motivo === 'cupo') {
          setCupoAgotado(true)
          setDrawerVisible(true)
        } else {
          setError('Vas muy rápido. Dales un respiro al grupo y vuelve en un momento.')
        }

        setOcupado(false)
        return
      }

      if (!respuesta.ok) throw new Error('Respuesta con error')

      const datos = (await respuesta.json()) as {
        mensajes?: MensajeElenco[]
        sistema?: string
        comprobacion?: boolean
      }

      // Ha saltado la salvaguarda: el grupo no responde y no hay tanda que desplegar.
      if (datos.sistema) {
        historial.current.pop()
        traComprobacion.current = false
        setVisibles((previos) => [
          ...previos,
          { id: contador.current++, personaje: 'sistema', texto: datos.sistema!, hora: ahora() },
        ])
        setOcupado(false)
        return
      }

      traComprobacion.current = datos.comprobacion === true
      const mensajes = datos.mensajes ?? []
      historial.current.push({ rol: 'grupo', contenido: JSON.stringify({ mensajes }) })
      desplegar(mensajes)
    } catch {
      setError('No he podido contactar con el grupo. Vuelve a intentarlo.')
      setOcupado(false)
    }
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-fondo">
      <DoodleBackground />
      <ChatHeader tecleando={tecleando} />

      <main className="relative flex-1 overflow-y-auto py-3">
        <div className="mx-auto flex max-w-[680px] flex-col gap-[3px]">
          {visibles.length === 0 && (
            <div className="burbuja mx-auto mt-4 flex max-w-[330px] flex-col gap-2 rounded-lg bg-entrante px-4 py-3 text-center text-[13px] leading-relaxed text-texto-suave">
              <p>Cuéntales una idea. Cualquiera.</p>
              <p>
                Escribe <span className="font-medium text-bego">@Bego</span> —o a quien quieras— para
                hablar solo con esa persona y que te busque datos de verdad.
              </p>
              <p>
                Es humor: el grupo está de tu parte por diseño. Solo los mensajes con enlace llevan
                datos comprobados.
              </p>
            </div>
          )}

          {visibles.map((mensaje, indice) =>
            mensaje.personaje === 'sistema' ? (
              <SystemNotice key={mensaje.id} texto={mensaje.texto} />
            ) : (
              <MessageBubble
                key={mensaje.id}
                personaje={mensaje.personaje}
                texto={mensaje.texto}
                hora={mensaje.hora}
                mono={mensaje.mono}
                fuente={mensaje.fuente}
                primeroDelBloque={visibles[indice - 1]?.personaje !== mensaje.personaje}
              />
            ),
          )}

          {error && (
            <p className="mx-3 rounded-lg bg-entrante px-3 py-2 text-[13px] text-error">{error}</p>
          )}

          <div ref={finRef} />
        </div>
      </main>

      {drawerVisible && <LimiteDrawer onCerrar={() => setDrawerVisible(false)} />}

      <footer className="relative bg-barra px-3 py-2">
        <div className="mx-auto flex max-w-[680px] items-end gap-2">
          <textarea
            value={borrador}
            onChange={(evento) => setBorrador(evento.target.value)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter' && !evento.shiftKey) {
                evento.preventDefault()
                void enviar()
              }
            }}
            onFocus={() => cupoAgotado && setDrawerVisible(true)}
            disabled={cupoAgotado}
            rows={1}
            placeholder={cupoAgotado ? 'Se ha agotado el uso de prueba' : 'Escribe una idea'}
            aria-label="Escribe una idea"
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-[21px] bg-entrante px-4 py-[11px] text-[16px] outline-none placeholder:text-texto-suave disabled:opacity-60"
          />
          <button
            onClick={() => void enviar()}
            disabled={borrador.trim() === '' || ocupado || cupoAgotado}
            aria-label="Enviar"
            className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-acento text-white transition-opacity disabled:opacity-40"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}
