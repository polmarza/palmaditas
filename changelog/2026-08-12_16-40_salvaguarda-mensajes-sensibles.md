# Salvaguarda para mensajes sensibles

**Fecha:** 2026-08-12 16:40
**Tipo:** Feature

## Qué se hizo

La pieza marcada como bloqueante desde el primer documento del proyecto: el mecanismo que hace que
el grupo se calle cuando alguien escribe algo que no es una idea.

- **`src/lib/salvaguarda/clasificar.ts`** — clasificador previo, en llamada aparte de la del elenco.
  Devuelve si el mensaje es sensible y de qué tipo, y genera la respuesta del sistema. Para
  ideación suicida incluye el 024 (atención a la conducta suicida en España) y el 112; para el resto,
  un mensaje breve sin recursos.
- **`src/lib/salvaguarda/casos.ts`** — batería de 32 casos en tres grupos: 10 que deben saltar, 6
  fáciles que no, y **16 difíciles** que no deben saltar y son donde se rompen los clasificadores
  (humor negro, hipérboles, negocios sobre funerarias o salud mental, ficción, burnout como queja).
- **`scripts/probar-salvaguarda.ts`** — ejecuta la batería contra el clasificador real y falla si hay
  falsos negativos. `pnpm test:salvaguarda`.
- **`src/components/chat/SystemNotice.tsx`** — la respuesta del sistema, visualmente separada de todo
  lo demás: sin color de personaje, sin avatar, sin cola, sin efecto de escritura.
- Integrada en `/api/chat` y en el script de terminal. **Si el clasificador falla, no se genera
  tanda**: se falla hacia el lado seguro.

Cuando salta, el mensaje del usuario se retira del historial para que no arrastre el contexto, y la
conversación puede continuar con normalidad después.

## Qué se modificó

- `src/lib/salvaguarda/clasificar.ts`, `casos.ts` — nuevos
- `scripts/probar-salvaguarda.ts` — nuevo
- `src/components/chat/SystemNotice.tsx` — nuevo
- `src/app/api/chat/route.ts` — salvaguarda antes de generar
- `src/components/chat/Chat.tsx` — tipo de mensaje 'sistema'
- `scripts/conversar.ts` — misma salvaguarda en el terminal
- `package.json` — script `test:salvaguarda`
- `docs/roadmap.md` — implementada; queda calibrarla

## Por qué

El producto está diseñado para aplaudir cualquier cosa que se escriba. La mayoría de las veces eso
es una idea de negocio regular y la coña funciona. Pero alguien va a escribir ahí algo que no es una
idea, y cuatro personajes aplaudiendo con emojis en ese momento pasa de gracioso a desagradable en
un segundo.

Va como clasificador aparte y no como instrucción dentro del prompt del elenco porque no se le puede
pedir al mismo prompt que aplauda todo incondicionalmente y a la vez detecte cuándo no debe: son
objetivos que se pelean, y el prompt está optimizado con fuerza hacia el primero.

## Pendiente

**Implementada no es calibrada.** La batería no se ha ejecutado todavía —el entorno donde se escribió
no tiene credenciales— y sigue siendo bloqueante para desplegar. El criterio es cero falsos negativos
y falsos positivos suficientemente bajos como para no aparecer en uso normal.
