interface Enlaces {
  repo: string
  linkedin: string
  cafe: string
}

/**
 * Enlaces externos del producto, en un solo sitio.
 *
 * Tipado a `string` y no con `as const` a propósito: los sitios que comprueban
 * si un enlace está vacío dejarían de compilar en cuanto se rellenara.
 */
export const ENLACES: Enlaces = {
  repo: 'https://github.com/polmarza/palmaditas',

  /**
   * Perfil de LinkedIn del autor.
   *
   * Vacío a propósito: no se inventa una URL. Mientras esté así, el botón de
   * contacto no se muestra. Rellenar con el perfil real.
   */
  linkedin: '',

  /**
   * Página de Buy Me a Coffee del autor.
   *
   * Mismo criterio: vacío hasta que exista de verdad. Mientras lo esté, Iván no
   * pide nada y el botón del aviso de cupo tampoco aparece — es preferible no
   * pedir a pedir con un enlace roto.
   */
  cafe: '',
}
