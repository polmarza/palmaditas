# Elenco del grupo y script de conversación (Fase 0)

**Fecha:** 2026-08-12 15:53
**Tipo:** Feature

## Qué se hizo

Primera implementación: los prompts de los cuatro personajes y un script de terminal para conversar
con ellos. Sin Next.js, sin componentes y sin base de datos — Fase 0 del roadmap solo tiene que
responder si el elenco tiene gracia sostenida.

- **`src/lib/elenco/personajes.ts`** — definición canónica de Rosa, Nacho, Bego e Iván: color de
  interfaz, color de terminal, retardo antes de escribir y velocidad de escritura. El ritmo vive
  aquí para que la web y la demo guionizada beban de la misma fuente.
- **`src/lib/elenco/prompt.ts`** — el system prompt del grupo y el esquema de salida. Cada voz se
  define con ejemplos reales de cómo escribe, que pesan más que cualquier descripción.
- **`src/lib/elenco/tanda.ts`** — una sola llamada a Haiku 4.5 por tanda, con structured outputs
  para que la respuesta venga siempre bien formada. Devuelve además tokens y coste.
- **`scripts/conversar.ts`** — conversación en el terminal, con colores por personaje, coste por
  tanda y acumulado, y guardado de la transcripción al salir.

Configuración mínima: `package.json`, `tsconfig.json` estricto y `pnpm-workspace.yaml` aprobando el
script de instalación de esbuild (dependencia de tsx).

## Qué se modificó

- `src/lib/elenco/personajes.ts`, `src/lib/elenco/prompt.ts`, `src/lib/elenco/tanda.ts` — nuevos
- `scripts/conversar.ts` — nuevo
- `package.json`, `tsconfig.json`, `pnpm-workspace.yaml` — nuevos
- `.gitignore` — ignora `transcripciones/`, que puede contener ideas personales
- `README.md` — estado actualizado a Fase 0 y documentado `pnpm elenco`

## Por qué

Todo el proyecto depende de una pregunta: ¿los cuatro personajes aguantan quince mensajes seguidos?
Construir la web antes de responderla sería levantar una casa sin comprobar el terreno.

El script imprime los mensajes **sin retardos ni efecto de escritura, deliberadamente**. El criterio
de validación del roadmap es que la transcripción en bruto ya haga gracia; si solo funciona gracias
a la animación, el producto es un truco y se agota igual.

El contador de coste responde al otro objetivo de Fase 0: contrastar el coste real por tanda con las
estimaciones de `docs/business.md`, que se hicieron a mano y sin caché de prompt.

## Pendiente de verificar

El código compila y pasa `pnpm typecheck`, pero **no se ha ejecutado contra la API**: el entorno
donde se escribió no tenía credenciales. La primera ejecución real de `pnpm elenco` es la prueba de
fuego de esta fase.
