'use client'

import { ENLACES } from '@/lib/enlaces'
import { marcarCafe } from '@/lib/metricas/cliente'

/** Marca de que esta persona ya ha pulsado. No se le vuelve a pedir. */
export const CLAVE_CAFE = 'palmaditas:cafe'

interface Props {
  /** Identificador aleatorio de la conversación, solo para agrupar la métrica. */
  sesion: string
  /** Tanda en la que se pidió. Sirve para saber si el momento es el correcto. */
  indice: number
  /** Dónde está el botón: en la burbuja de Iván o en el aviso de cupo. */
  lugar: 'chat' | 'cupo'
}

/**
 * El único botón del chat que pide algo.
 *
 * Va dentro de la burbuja de Iván, no en un banner: la petición funciona porque
 * la hace el personaje que se pasa la conversación poniendo pegas, y deja de
 * funcionar en cuanto parece un anuncio pegado encima del chat.
 */
export function BotonCafe({ sesion, indice, lugar }: Props) {
  return (
    <a
      href={ENLACES.cafe}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        marcarCafe(lugar === 'cupo' ? 'cafe_cupo_pulsado' : 'cafe_chat_pulsado', sesion, indice)
        try {
          localStorage.setItem(CLAVE_CAFE, 'pulsado')
        } catch {
          // Navegación privada o almacenamiento bloqueado: se pierde la marca y
          // como mucho se le vuelve a pedir otro día. No es motivo para fallar.
        }
      }}
      className={
        lugar === 'cupo'
          ? 'flex items-center justify-center gap-2 rounded-full bg-acento px-5 py-3 text-[15px] font-medium text-white'
          : 'mt-[8px] inline-flex items-center gap-[6px] rounded-full bg-acento px-[14px] py-[7px] text-[14px] font-medium text-white'
      }
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <path d="M6 2v3M10 2v3M14 2v3" />
      </svg>
      Invitar a Pol a un café
    </a>
  )
}
