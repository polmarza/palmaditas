# Medición de la invitación al café

**Fecha:** 2026-08-20 23:45
**Tipo:** Feature

## Qué se hizo

Buy Me a Coffee dice cuántos cafés llegan, pero no cuántos vieron la petición. Se registran cuatro
eventos anónimos —visto y pulsado, en la burbuja de Iván y en el aviso de cupo— sobre la misma tabla
`eventos`, con una columna `tipo` nueva.

- **`/api/evento`**: ruta mínima que solo acepta los cuatro tipos de café. **Nunca el tipo
  `mensaje`**: es lo que cuenta el límite por IP, y dejarlo abierto permitiría llenarle el cupo a
  otra persona sin gastar una llamada al modelo. Valida además que la sesión sea un UUID.
- **El límite por IP filtra por `tipo = 'mensaje'`.** Sin ese filtro, ver el botón gastaría cupo.
- **El "visto" se dispara cuando la burbuja está en pantalla**, no cuando se programa: si no,
  contaría a quien cierra la pestaña a mitad de tanda.
- Se manda con `sendBeacon`, que sobrevive a que la persona se vaya de la página.
- El evento guarda **en qué tanda se pidió**, así que también responde si la tercera es el momento
  correcto.

## Qué se modificó

- `supabase/migrations/002_tipo_evento.sql` (nuevo)
- `src/app/api/evento/route.ts` (nuevo)
- `src/lib/metricas/tipos.ts` (nuevo), `src/lib/metricas/cliente.ts` (nuevo)
- `src/lib/metricas/registrar.ts`, `src/lib/metricas/limite.ts`
- `src/components/chat/BotonCafe.tsx`, `Chat.tsx`, `MessageBubble.tsx`, `LimiteDrawer.tsx`
- `docs/data-model.md` (documentaba solo `sesiones`, que ni siquiera existe todavía),
  `docs/business.md`, `docs/architecture.md`

## Por qué

Sin la tasa de conversión no se puede decidir nada sobre la invitación: ni si el momento es bueno, ni
si el texto funciona, ni si conviene moverla. Con la propina recién puesta en producción, es ahora
cuando hay que empezar a contar.

## Ojo al orden

**La migración va antes que el despliegue.** Si el código sale primero, la columna `tipo` no existe,
PostgREST rechaza los insert y los conteos, y el cupo se queda sin efecto — que es exactamente el
fallo que se arregló esta misma tarde.
