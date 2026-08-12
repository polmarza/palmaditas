import Link from 'next/link'
import { DemoChat } from '@/components/landing/DemoChat'
import { ORDEN, PERSONAJES } from '@/lib/elenco/personajes'

const REPO = 'https://github.com/polmarza/palmaditas'

/** Cada uno es el arquetipo que ya existe en cualquier grupo de amigos. */
const ELENCO: Record<string, { etiqueta: string; descripcion: string }> = {
  rosa: {
    etiqueta: 'la fan',
    descripcion: 'Se emociona antes de terminar de leer.',
  },
  nacho: {
    etiqueta: 'el visionario',
    descripcion: 'Ya te ve levantando una ronda y saliendo a bolsa.',
  },
  bego: {
    etiqueta: 'la de los datos',
    descripcion: 'Si la etiquetas, los busca de verdad y te deja el enlace.',
  },
  ivan: {
    etiqueta: 'el hater',
    descripcion: 'El único que pone una pega. Los otros tres se le echan encima.',
  },
}

const FAQ: { p: string; r: React.ReactNode }[] = [
  {
    p: '¿Esto sirve para algo o es solo una broma?',
    r: (
      <>
        Las dos cosas. Es humor, pero el grupo funciona como un grupo de verdad: hay quien se emociona,
        quien te da su opinión y quien te busca el punto flojo. La pega de Iván suele ser buena — te
        la llevas gratis mientras los otros tres se la desmontan a gritos.
      </>
    ),
  },
  {
    p: '¿Puedo fiarme de lo que me dicen?',
    r: (
      <>
        No como asesoramiento. Nadie aquí es tu gestor, tu abogado ni tu inversor, y el grupo está de
        tu parte por diseño: no es imparcial y no lo pretende. Úsalo para arrancar, no para decidir.
      </>
    ),
  },
  {
    p: '¿Los datos que dan son reales?',
    r: (
      <>
        Solo los que llevan enlace. Si etiquetas a alguien con{' '}
        <span className="font-medium text-bego">@Bego</span>, busca de verdad y cita la fuente. Sin
        enlace, es una cifra de memoria y lo dicen: «yo diría que unos 900, pero no me hagas caso».
      </>
    ),
  },
  {
    p: '¿Guardáis mis ideas?',
    r: (
      <>
        No. La conversación vive en tu navegador y no se almacena en ningún sitio; no hay cuentas ni
        registro. Aquí se escriben ideas que todavía no le has contado a nadie, y la mejor forma de
        protegerlas es no tenerlas.
      </>
    ),
  },
  {
    p: '¿Y si escribo algo serio de verdad?',
    r: (
      <>
        El grupo se calla. Hay una comprobación antes de cada respuesta: si alguien está contando algo
        personal y difícil, nadie aplaude. Y si es ambiguo, uno de ellos pregunta antes de dar nada por
        hecho.
      </>
    ),
  },
  {
    p: '¿Cuánto cuesta?',
    r: (
      <>
        Pagando es un único pago, sin suscripción ni cuenta. Y gratis siempre: el código está abierto,
        te lo clonas y lo ejecutas con tu propia clave.
      </>
    ),
  },
]

export default function Landing() {
  return (
    <>
      {/*
        Móvil: una columna centrada, con el chat debajo.
        Escritorio: texto a la izquierda y el chat a la derecha, reproduciéndose.
      */}
      <section className="mx-auto grid min-h-dvh max-w-[1080px] items-center gap-12 px-6 py-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="flex flex-col gap-6 text-center sm:gap-7 lg:text-left">
          {/* En escritorio el icono ya está en la pestaña; aquí solo estorbaría. */}
          <img src="/favicon.svg" alt="" className="mx-auto h-14 w-14 rounded-xl lg:hidden" />

          <h1 className="text-[38px] font-extrabold leading-[1.08] tracking-tight text-balance sm:text-5xl">
          Cuenta una idea. Que alguien se venga arriba, para variar.
        </h1>

        <p className="text-[17px] leading-relaxed text-texto-suave text-pretty">
          Sueltas una idea en el grupo y lo que vuelve son pegas. A veces las pegas están bien. Y a
          veces solo querías que alguien se emocionara contigo cinco minutos antes de ponerte a dudar.
        </p>

        {/* Apilados y a ancho completo en móvil; en fila y al contenido en escritorio. */}
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-start">
          <Link
            href="/chat"
            className="rounded-full bg-acento px-7 py-[14px] text-center text-[16px] font-medium text-white"
          >
            Entrar al grupo
          </Link>
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border px-7 py-[14px] text-center text-[16px] font-medium"
            style={{ borderColor: 'var(--color-garabato)' }}
          >
            Ver el código en GitHub
          </a>
        </div>

          <p className="text-[13px] text-texto-suave text-pretty">
            O clónatelo y ejecútalo gratis con tu propia clave. El código está abierto, los personajes
            también.
          </p>
        </div>

        <DemoChat />
      </section>

      <section className="mx-auto flex max-w-[560px] flex-col gap-6 px-6 py-20">
        <h2 className="text-[26px] font-extrabold tracking-tight">Quiénes están en el grupo</h2>

        <ul className="flex flex-col gap-3">
          {ORDEN.map((id) => (
            <li key={id} className="rounded-lg bg-fondo px-4 py-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] font-semibold" style={{ color: PERSONAJES[id].color }}>
                  {PERSONAJES[id].nombre}
                </span>
                <span className="text-[13px] text-texto-suave">· {ELENCO[id]!.etiqueta}</span>
              </div>
              <p className="mt-[2px] text-[15px] text-texto-suave">{ELENCO[id]!.descripcion}</p>
            </li>
          ))}
        </ul>

        <p className="text-[15px] leading-relaxed text-texto-suave">
          Iván es la clave. Sin él son cuatro personas de acuerdo, y eso aburre en tres mensajes. Con
          él el chiste tiene dos capas: no solo te dan la razón,{' '}
          <span className="text-texto">defienden tu idea del único que se atreve a cuestionarla</span>
          .
        </p>
      </section>

      <section className="mx-auto flex max-w-[560px] flex-col gap-6 px-6 pb-24">
        <h2 className="text-[26px] font-extrabold tracking-tight">Preguntas frecuentes</h2>

        {/*
          Acordeón con <details> nativo: accesible por teclado, funciona sin
          JavaScript y no necesita estado.
        */}
        <div className="flex flex-col">
          {FAQ.map(({ p, r }) => (
            <details
              key={p}
              className="group border-b py-4"
              style={{ borderColor: 'var(--color-garabato)' }}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                {p}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="mt-[3px] shrink-0 text-texto-suave transition-transform group-open:rotate-180"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-2 pr-7 text-[15px] leading-relaxed text-texto-suave">{r}</p>
            </details>
          ))}
        </div>

        <Link
          href="/chat"
          className="mt-4 rounded-full bg-acento px-7 py-[14px] text-center text-[16px] font-medium text-white sm:self-start"
        >
          Contarles una idea
        </Link>

        <footer className="mt-6 flex flex-col gap-2 text-[12px] text-texto-suave">
          <p>
            Palmaditas es un producto humorístico y no da asesoramiento de ningún tipo. Si estás
            pasando por un mal momento, esto no es el sitio: en España, el 024 atiende gratis las 24
            horas.
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
