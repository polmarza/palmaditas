/**
 * Mensaje del sistema cuando salta la salvaguarda.
 *
 * **Visualmente distinto de todo lo demás**: sin color de personaje, sin
 * avatar, sin cola y sin efecto de escritura. Tiene que quedar claro de un
 * vistazo que esto no lo dice el grupo — porque el grupo, precisamente, se ha
 * callado. Ver docs/user-flows.md, FLOW-04.
 */
export function SystemNotice({ texto }: { texto: string }) {
  return (
    <div className="my-3 px-3">
      <div
        className="mx-auto max-w-[420px] rounded-lg border px-4 py-3 text-[13px] leading-relaxed text-texto-suave"
        style={{ background: 'var(--color-barra)', borderColor: 'var(--color-garabato)' }}
      >
        {texto.split('\n\n').map((parrafo, indice) => (
          <p key={indice} className={indice > 0 ? 'mt-2' : ''}>
            {parrafo}
          </p>
        ))}
      </div>
    </div>
  )
}
