'use client'

import { ENLACES } from '@/lib/enlaces'

/** Marca de que esta persona ya ha pulsado. No se le vuelve a pedir. */
export const CLAVE_CAFE = 'palmaditas:cafe'

/**
 * El único botón del chat que pide algo.
 *
 * Va dentro de la burbuja de Iván, no en un banner: la petición funciona porque
 * la hace el personaje que se pasa la conversación poniendo pegas, y deja de
 * funcionar en cuanto parece un anuncio pegado encima del chat.
 */
export function BotonCafe({ variante = 'burbuja' }: { variante?: 'burbuja' | 'ancho' }) {
  return (
    <a
      href={ENLACES.cafe}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        try {
          localStorage.setItem(CLAVE_CAFE, 'pulsado')
        } catch {
          // Navegación privada o almacenamiento bloqueado: se pierde la marca y
          // como mucho se le vuelve a pedir otro día. No es motivo para fallar.
        }
      }}
      className={
        variante === 'ancho'
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
