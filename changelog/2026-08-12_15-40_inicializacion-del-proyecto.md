# Inicialización del proyecto Palmaditas

**Fecha:** 2026-08-12 15:40
**Tipo:** Configuración

## Qué se hizo

Definición completa del producto y conversión del repositorio de andamiaje genérico al repositorio
de Palmaditas.

**Documentación de producto.** Se rellenaron los ocho documentos de `docs/` a partir de una sesión
de diseño. Decisiones estructurales que quedan fijadas:

- **El elenco son cuatro personajes: tres que aplauden y uno que pone pegas.** Iván, el aguafiestas,
  es la pieza que evita que el chat se agote: genera conflicto y convierte el chiste en uno de dos
  capas — el grupo no solo te da la razón, defiende tu idea de quien la cuestiona.
- **Una sola llamada a la API por tanda**, no una por personaje. Cuesta alrededor de un tercio y
  produce mejores referencias cruzadas entre personajes.
- **Sin cuentas de usuario.** El saldo vive en el servidor atado a un identificador anónimo en
  cookie firmada. No hay nada manipulable en el cliente porque el número no está en el cliente.
- **Sin prueba gratuita.** La landing enseña una demo guionizada, sin llamadas a la API. Regalar uso
  cuando el código está publicado no tiene sentido.
- **Salvaguarda para mensajes sensibles** como clasificador separado, previo a la respuesta del
  grupo. Bloqueante para el lanzamiento.
- **Interfaz clonada de una app de mensajería**, con límites explícitos sobre qué no se copia de la
  marca de un tercero. El fondo de garabatos es propio.
- **No se persisten conversaciones.** Viven en el navegador; en base de datos solo hay un
  identificador y un número.

**Inicialización del repositorio.** Reescritura del `README.md` y el `CLAUDE.md` para el producto,
licencia a nombre del autor, `.env.example` con las variables reales del stack, backlog inicial y
eliminación del andamiaje heredado.

## Qué se modificó

- `docs/prd.md`, `docs/business.md`, `docs/design-system.md`, `docs/architecture.md`,
  `docs/data-model.md`, `docs/user-flows.md`, `docs/roadmap.md`, `docs/testing.md` — rellenados
- `README.md` — reescrito para Palmaditas
- `CLAUDE.md` — rellenado con stack, estructura, convenciones y antipatrones del proyecto
- `LICENSE` — año y autor reales
- `.env.example` — solo las variables del stack elegido
- `changelog/README.md` — sin referencias al andamiaje
- `mejoras/backlog.md` — limpio, con dos entradas reales
- `.template/` — eliminada
- `.claude/commands/init-proyecto.md` — eliminado
- Remoto `origin` eliminado: apuntaba al repositorio de la plantilla

## Por qué

El repositorio arrancó desde una plantilla genérica y toda su documentación hablaba de la plantilla,
no del producto. Sin esta pasada, cualquiera que abriera el repositorio —que es público y forma
parte de la estrategia de difusión del producto— habría encontrado instrucciones sobre cómo usar una
plantilla de proyectos.

El remoto merecía atención aparte: apuntaba al repositorio de la plantilla, así que un `git push`
habría publicado Palmaditas en el repositorio equivocado.
