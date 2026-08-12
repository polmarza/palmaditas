'use client'

import { ENLACES } from '@/lib/enlaces'

/**
 * Aviso de cupo agotado.
 *
 * **No bloquea la vista**: se puede cerrar y seguir leyendo la conversación,
 * porque lo que la persona acaba de escribir con el grupo es suyo y no tiene
 * sentido tapárselo. Lo que queda bloqueado es el campo de escritura.
 */
export function LimiteDrawer({ onCerrar }: { onCerrar: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-3">
      <div className="burbuja w-full max-w-[420px] rounded-2xl bg-entrante p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[17px] font-semibold">Hasta aquí la prueba</h2>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="-m-1 shrink-0 p-1 text-texto-suave"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-[14px] leading-relaxed text-texto-suave">
          Palmaditas está en fase de pruebas y el uso es limitado por persona. Puedes seguir leyendo
          la conversación, pero por ahora no se pueden enviar más mensajes.
        </p>

        <p className="mt-2 text-[14px] leading-relaxed text-texto-suave">
          Si quieres usarlo sin límite, clónate el repositorio y ejecútalo con tu propia clave: el
          código está abierto, los personajes también.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={ENLACES.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-acento px-5 py-3 text-center text-[15px] font-medium text-white"
          >
            Ver el repositorio en GitHub
          </a>

          {ENLACES.linkedin && (
            <a
              href={ENLACES.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-5 py-3 text-center text-[15px] font-medium"
              style={{ borderColor: 'var(--color-garabato)' }}
            >
              Escribir a Pol en LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
