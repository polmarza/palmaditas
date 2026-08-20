'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatHeader } from './ChatHeader'
import { DoodleBackground } from './DoodleBackground'
import { MessageBubble } from './MessageBubble'
import { SystemNotice } from './SystemNotice'
import { LimiteDrawer } from './LimiteDrawer'
import { CLAVE_CAFE } from './BotonCafe'
import { ENLACES } from '@/lib/enlaces'
import { marcarCafe } from '@/lib/metricas/cliente'
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
  cafe?: { sesion: string; indice: number } | null
}

function ahora(): string {
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Tandas completas antes de que Iván pida el café.
 *
 * Sale de los datos del lanzamiento: la mediana es de 2 mensajes por
 * conversación, un tercio pasa de 3 y solo un 2 % llega a 10. Pedirlo más tarde
 * es no pedírselo a casi nadie; pedirlo antes es pedirlo sin que se hayan reído
 * todavía. En la tercera ya han visto el mecanismo entero un par de veces.
 */
const TANDA_DEL_CAFE = 3

/** Beat entre el final de la tanda y el corte de Iván. */
const ESPERA_DEL_CAFE = 1200

/**
 * Lo pide Iván, no Rosa.
 *
 * Rosa pidiendo dinero es más entusiasmo encima del entusiasmo, y se lee como
 * publicidad. Iván se ha pasado la conversación poniendo pegas, así que es el
 * único al que se le cree — y el chiste es que rompe el personaje justo para
 * esto, sin dejar de decir que la idea sigue sin convencerle.
 */
const INVITACION: MensajeElenco[] = [
  { personaje: 'ivan', texto: 'oye, paro un momento', mono: false, fuente: null },
  {
    personaje: 'ivan',
    texto: 'esto lo ha montado un tío que se llama Pol, y la api la paga él de su bolsillo',
    mono: false,
    fuente: null,
  },
  {
    personaje: 'ivan',
    texto: 'yo no te voy a decir que tu idea sea buena. pero si te estás riendo, invítale a un café',
    mono: false,
    fuente: null,
  },
]

/** Si no hay enlace, Iván no dice nada: mejor no pedir que pedir en falso. */
function puedePedirCafe(): boolean {
  if (ENLACES.cafe === '') return false
  try {
    return localStorage.getItem(CLAVE_CAFE) === null
  } catch {
    return true
  }
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
  /** Tandas que ha soltado el grupo. Decide cuándo corta Iván para pedir el café. */
  const tandas = useRef(0)
  const cafePedido = useRef(false)
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
  function desplegar(
    mensajes: MensajeElenco[],
    opciones: { cafe?: { sesion: string; indice: number } } = {},
  ): number {
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
              // El botón cuelga del último mensaje del bloque, no de cada uno.
              cafe: paso === plan.at(-1) ? (opciones.cafe ?? null) : null,
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

    return total
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
        // El mensaje no ha llegado a enviarse: se retira de la vista y vuelve al
        // campo. Si no, se ve dos veces y parece que sí ha salido.
        setVisibles((previos) => previos.slice(0, -1))
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
      const fin = desplegar(mensajes)

      tandas.current += 1
      const tanda = tandas.current
      if (tanda === TANDA_DEL_CAFE && !cafePedido.current && puedePedirCafe()) {
        cafePedido.current = true
        // Fuera del historial a propósito: no lo ha dicho el modelo, así que no
        // puede volver como contexto ni acabar comentado en la tanda siguiente.
        temporizadores.current.push(
          setTimeout(() => {
            const total = desplegar(INVITACION, { cafe: { sesion: sesion.current, indice: tanda } })
            // Se cuenta cuando la burbuja del botón está en pantalla, no cuando
            // se programa: si no, contaría también a quien cierra antes de verla.
            temporizadores.current.push(
              setTimeout(() => marcarCafe('cafe_chat_visto', sesion.current, tanda), total),
            )
          }, fin + ESPERA_DEL_CAFE),
        )
      }
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
          {/*
            No se menciona aquí lo de etiquetar con @: sin una idea contada
            todavía, quien lo probaba de entrada obtenía datos sobre nada.
            Una función se enseña cuando hay contexto para usarla.
          */}
          {visibles.length === 0 && (
            <div className="burbuja mx-auto mt-4 flex max-w-[330px] flex-col gap-2 rounded-lg bg-entrante px-4 py-3 text-center text-[13px] leading-relaxed text-texto-suave">
              <p className="text-[15px] font-medium text-texto">Cuéntales tu idea</p>
              <p>
                La que sea: un negocio, un proyecto de fin de semana o algo que se te acaba de
                ocurrir. El grupo se encarga del resto.
              </p>
              <p>
                Es humor: están de tu parte por diseño. Solo los mensajes con enlace llevan datos
                comprobados.
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
                cafe={mensaje.cafe}
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

      {drawerVisible && (
        <LimiteDrawer
          onCerrar={() => setDrawerVisible(false)}
          sesion={sesion.current}
          indice={tandas.current}
        />
      )}

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
