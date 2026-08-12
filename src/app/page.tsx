import Link from 'next/link'
import { ORDEN, PERSONAJES } from '@/lib/elenco/personajes'

/**
 * Landing provisional.
 *
 * La definitiva lleva la demo guionizada reproduciéndose sola (ver
 * docs/prd.md). Por ahora presenta al elenco y deja pasar al chat, que es lo
 * que hace falta para probar el ritmo.
 */
const DESCRIPCIONES: Record<string, string> = {
  rosa: 'Se emociona antes de terminar de leer.',
  nacho: 'Ya te ve levantando una ronda.',
  bego: 'Va a por los datos. Si la etiquetas, los busca de verdad.',
  ivan: 'El único que pone una pega. Los otros tres se le echan encima.',
}

export default function Landing() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <img src="/favicon.svg" alt="" className="h-14 w-14 rounded-xl" />
        <h1 className="text-4xl font-extrabold tracking-tight">Palmaditas</h1>
        <p className="text-[17px] text-texto-suave">
          Cuentas una idea y un grupo de cuatro amigos se emociona contigo. Uno pone pegas, y los
          otros tres se le echan encima.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {ORDEN.map((id) => (
          <li key={id} className="burbuja rounded-lg bg-entrante px-4 py-3">
            <span className="text-[15px] font-semibold" style={{ color: PERSONAJES[id].color }}>
              {PERSONAJES[id].nombre}
            </span>
            <span className="ml-2 text-[15px] text-texto-suave">{DESCRIPCIONES[id]}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/chat"
        className="rounded-full bg-acento px-6 py-3 text-center text-[16px] font-medium text-white"
      >
        Entrar al grupo
      </Link>

      <p className="text-center text-[12px] text-texto-suave">
        Es humor. El grupo está de tu parte por diseño y nada de lo que dicen es asesoramiento. Solo
        los mensajes con enlace llevan datos comprobados.
      </p>
    </main>
  )
}
