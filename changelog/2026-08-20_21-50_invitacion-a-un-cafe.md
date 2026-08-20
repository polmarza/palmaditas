# Iván pide un café: primera monetización

**Fecha:** 2026-08-20 21:50
**Tipo:** Feature

## Qué se hizo

Primera vía de ingresos, sin pasarela y sin muro. Tras la tercera tanda, Iván corta la conversación
con tres mensajes suyos —el último con un botón de Buy Me a Coffee dentro de la burbuja— diciendo que
la API la paga Pol de su bolsillo. El mismo botón se añade al aviso de cupo agotado, que es el otro
momento de intención alta.

- **Lo pide Iván, no Rosa.** Es el único al que se le cree pidiendo algo: lleva toda la conversación
  poniendo pegas, así que romper el personaje una vez es el chiste, no un anuncio.
- **El texto es fijo y vive en el cliente.** No se toca el prompt del elenco: el modelo no puede
  garantizar cuándo lo diría, y meterlo ahí lo llevaría a comentarlo en tandas posteriores.
- **La invitación no entra en `historial`.** No la ha dicho el modelo, así que no vuelve como
  contexto.
- **Una vez por conversación**, y nunca más si la persona ya ha pulsado (`localStorage`).
- **Con `ENLACES.cafe` vacío no aparece nada.** Mejor no pedir que pedir con un enlace roto.

De paso, un fallo anterior: al agotar el cupo, el mensaje rechazado se quedaba en la conversación
además de volver al campo de escritura, así que se veía dos veces. Ahora se retira de la vista.

`ENLACES` deja de ser `as const`: con los literales estrechados, rellenar un enlace rompía las
comprobaciones de vacío que hay repartidas por los componentes.

## Qué se modificó

- `src/components/chat/BotonCafe.tsx` (nuevo)
- `src/components/chat/Chat.tsx`
- `src/components/chat/MessageBubble.tsx`
- `src/components/chat/LimiteDrawer.tsx`
- `src/lib/enlaces.ts`
- `docs/business.md`, `docs/design-system.md`, `docs/architecture.md`

## Por qué

El lanzamiento en LinkedIn fue mejor de lo esperado y la API la sigue pagando el autor. Los datos
desaconsejan un muro: la mediana son 2 mensajes por conversación y el gasto mediano por persona es de
0,0089 $, así que 5 € de saldo serían más de cien conversaciones que nadie va a agotar. Una propina
en el momento en que la persona se está riendo convierte mejor que un paquete que no necesita.

## Pendiente

`ENLACES.linkedin` sigue vacío, así que el botón de contacto del aviso de cupo no se muestra.
