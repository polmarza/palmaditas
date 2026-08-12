import Link from 'next/link'
import { DemoScroll } from '@/components/landing/DemoScroll'
import { ORDEN, PERSONAJES } from '@/lib/elenco/personajes'

const REPO = 'https://github.com/polmarza/palmaditas'

const ELENCO: Record<string, string> = {
  rosa: 'Se emociona antes de terminar de leer.',
  nacho: 'Ya te ve levantando una ronda.',
  bego: 'Va a por los datos. Si la etiquetas, los busca de verdad y te deja el enlace.',
  ivan: 'El único que pone una pega. Los otros tres se le echan encima.',
}

export default function Landing() {
  return (
    <>
      <section className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center gap-7 px-6 py-20">
        <img src="/favicon.svg" alt="" className="h-14 w-14 rounded-xl" />

        <h1 className="text-[38px] font-extrabold leading-[1.08] tracking-tight text-balance sm:text-5xl">
          Cuenta una idea. Que alguien se venga arriba, para variar.
        </h1>

        <p className="text-[17px] leading-relaxed text-texto-suave">
          Sueltas una idea en el grupo y lo que vuelve son pegas. A veces las pegas están bien. Y a
          veces solo querías que alguien se emocionara contigo cinco minutos antes de ponerte a dudar.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/chat"
            className="rounded-full bg-acento px-6 py-[14px] text-center text-[16px] font-medium text-white"
          >
            Entrar al grupo
          </Link>
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border px-6 py-[14px] text-center text-[16px] font-medium"
            style={{ borderColor: 'var(--color-garabato)' }}
          >
            Ver el código en GitHub
          </a>
        </div>

        <p className="text-[13px] text-texto-suave">
          O clónatelo y ejecútalo gratis con tu propia clave. El código está abierto, los personajes
          también.
        </p>
      </section>

      <DemoScroll />

      <section className="mx-auto flex max-w-[560px] flex-col gap-6 px-6 py-20">
        <h2 className="text-[26px] font-extrabold tracking-tight">Quiénes están en el grupo</h2>

        <ul className="flex flex-col gap-3">
          {ORDEN.map((id) => (
            <li key={id} className="burbuja rounded-lg bg-entrante px-4 py-3">
              <span className="text-[15px] font-semibold" style={{ color: PERSONAJES[id].color }}>
                {PERSONAJES[id].nombre}
              </span>
              <span className="ml-2 text-[15px] text-texto-suave">{ELENCO[id]}</span>
            </li>
          ))}
        </ul>

        <p className="text-[15px] leading-relaxed text-texto-suave">
          Iván es la clave. Sin él son cuatro personas de acuerdo, y eso aburre en tres mensajes. Con
          él el chiste tiene dos capas: no solo te dan la razón,{' '}
          <span className="text-texto">defienden tu idea del único que se atreve a cuestionarla</span>
          . Y si su pega es buena, te la llevas gratis.
        </p>
      </section>

      <section className="mx-auto flex max-w-[560px] flex-col gap-6 px-6 pb-24">
        <h2 className="text-[26px] font-extrabold tracking-tight">Dos cosas que conviene saber</h2>

        <div className="burbuja rounded-lg bg-entrante px-4 py-4">
          <h3 className="text-[15px] font-semibold">Es humor, y no lo disimula</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-texto-suave">
            El grupo está de tu parte por diseño. No es un asesor, no evalúa tu idea y no te va a
            decir la verdad. Esa es la gracia.
          </p>
        </div>

        <div className="burbuja rounded-lg bg-entrante px-4 py-4">
          <h3 className="text-[15px] font-semibold">Salvo cuando lleva enlace</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-texto-suave">
            Escribe <span className="font-medium text-bego">@Bego</span> y buscará de verdad, con la
            fuente enlazada. Lo que lleva enlace es comprobable; todo lo demás es conversación de bar.
          </p>
        </div>

        <Link
          href="/chat"
          className="mt-2 rounded-full bg-acento px-6 py-[14px] text-center text-[16px] font-medium text-white"
        >
          Contarles una idea
        </Link>

        <footer className="mt-6 flex flex-col gap-2 text-[12px] text-texto-suave">
          <p>
            Palmaditas no da asesoramiento de ningún tipo. Si estás pasando por un mal momento, esto
            no es el sitio: en España, el 024 atiende las 24 horas.
          </p>
          <p>
            <a href={REPO} target="_blank" rel="noopener noreferrer" className="underline">
              Código en GitHub
            </a>{' '}
            · MIT
          </p>
        </footer>
      </section>
    </>
  )
}
