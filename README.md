# Palmaditas

Un grupo de chat donde cuatro personajes se emocionan con tu idea.

> ⚠️ **Estado: Fase 1.** El chat funciona en local (`pnpm dev`) y el elenco también se puede probar
> desde el terminal (`pnpm elenco`). Todavía **no hay pagos, ni base de datos, ni la salvaguarda para
> mensajes sensibles** — esto último es bloqueante antes de cualquier despliegue público. La
> documentación completa está en [`docs/`](./docs).

---

## Qué es esto

Tienes una idea. La sueltas en el grupo de amigos. Lo que vuelve son pegas.

A veces las pegas están bien. Y a veces solo querías que alguien se emocionara contigo cinco
minutos, antes de ponerte a pensar si la idea aguanta. **Palmaditas es ese sitio.**

Escribes tu idea y te responde un grupo de chat con cuatro personajes:

| | |
|---|---|
| **Rosa** | Entusiasmo sin filtro. Contesta antes de terminar de leer |
| **Nacho** | Ya te ve levantando una ronda y saliendo a bolsa |
| **Bego** | Aporta estadísticas espectaculares y absolutamente inventadas |
| **Iván** | El único que pone una pega. Los otros tres se le echan encima |

Iván es la clave. Sin él son cuatro personas de acuerdo, y eso aburre en tres mensajes. Con él el
chiste tiene dos capas: no solo te dan la razón, es que **defienden tu idea del único que se atreve
a cuestionarla**. Y de paso, si su pega es buena, te la llevas gratis.

Es humor. Nada de lo que dicen los personajes es información real, y el producto lo dice
abiertamente. No es un asesor.

---

## Dos formas de usarlo

**Pagando**, en [palmaditas.com](https://palmaditas.com): sin registro, sin cuenta. Pagas, escribes.

**Gratis**, clonando este repositorio y ejecutándolo con tu propia clave de API. Misma experiencia,
sin pasarela de pago. Los prompts del elenco están en `src/lib/elenco/`, a la vista — son el
producto y no tiene sentido esconderlos en un repo abierto.

---

## Requisitos previos

- **Node.js 20+**
- **pnpm v11** (no npm, no yarn)
- Una **clave de API de Anthropic** ([console.anthropic.com](https://console.anthropic.com))

---

## Instalación y desarrollo

```bash
pnpm install
```

```bash
cp .env.example .env.local
```

Pon tu `ANTHROPIC_API_KEY` en `.env.local` y arranca la web:

```bash
pnpm dev
```

En [localhost:3000](http://localhost:3000). Sin configuración de pasarela de pago arranca en modo
libre: sin saldo, sin base de datos y sin límite, consumiendo de tu clave.

También puedes hablar con el elenco desde el terminal, sin interfaz:

```bash
pnpm elenco
```

**Sin efecto de escritura ni retardos, a propósito** — sirve para juzgar si los personajes tienen
gracia, no si la animación funciona. Cada tanda muestra los tokens y el coste real, y al salir con
`/salir` se guarda la transcripción en `transcripciones/` (ignorada por git).

En ambos casos puedes etiquetar a alguien con `@`: `@Bego mírame los precios de alquiler`. Contesta
solo esa persona, y es el único caso en que el grupo busca en internet de verdad — por eso esas
respuestas llevan la fuente enlazada y cuestan unas cinco veces más.

### Variables de entorno

Están todas en [`.env.example`](./.env.example). Solo una es obligatoria para uso local:
`ANTHROPIC_API_KEY`. El resto solo hacen falta para desplegar la versión de pago.

---

## Estructura

```
docs/                 → Documentación viva del proyecto. Empieza por aquí
src/
├── app/              → Rutas y route handlers (Next.js App Router)
├── components/chat/  → Burbujas, cabecera, fondo
├── lib/
│   ├── elenco/       → Los prompts de los personajes. El corazón del producto
│   ├── salvaguarda/  → Clasificador de mensajes sensibles
│   ├── saldo/        → Sesión anónima y descuento de mensajes
│   └── pago/         → Adaptador de pasarela
changelog/            → Registro de cambios importantes
mejoras/              → Ideas que no entran ahora
```

Si vienes a cotillear el código, `src/lib/elenco/` es lo que buscas.

---

## Cómo está construido

Next.js (App Router) sobre Vercel, con Tailwind, shadcn/ui y AI Elements para la interfaz de chat.
Las respuestas las genera **Claude Haiku 4.5** en una sola llamada por tanda: los cuatro mensajes
salen juntos, que es más barato y hace que los personajes se contesten entre ellos con naturalidad.

Interfaz clonada descaradamente de una app de mensajería que ya conoces, con el fondo de garabatos
dibujado por nosotros. El detalle: la cabecera dice **"Rosa y Bego están escribiendo…"**, y eso
comunica que hay un grupo entero pendiente de ti mejor que cualquier animación.

Los detalles, en [`docs/architecture.md`](./docs/architecture.md).

---

## Una cosa que no es negociable

El producto está diseñado para aplaudir cualquier cosa que escribas. La mayoría de las veces eso es
una idea de negocio regular y la coña funciona. Pero alguien, en algún momento, va a escribir ahí
algo que no es una idea: que está fatal, una crisis personal, un duelo.

**Cuatro personajes aplaudiendo con emojis en ese momento sería desagradable.** Por eso hay un
clasificador que revisa cada mensaje antes de que el grupo responda; cuando salta, el grupo no
contesta, aparece un mensaje del sistema y **no se descuenta saldo**.

Está en [`docs/architecture.md`](./docs/architecture.md) y es bloqueante para lanzar. Si tocas esa
parte, léelo antes.

---

## Contribuir

Antes de tocar nada, lee [`CLAUDE.md`](./CLAUDE.md) y la documentación de [`docs/`](./docs). El
proyecto sigue un protocolo simple: cada cambio importante deja entrada en `changelog/` y actualiza
la documentación afectada en la misma sesión.

Los issues y las ideas para el elenco son bienvenidos. Si se te ocurre un personaje mejor que
Quique para desbloquear, cuéntalo.

---

## Licencia

MIT. Ver [`LICENSE`](./LICENSE).
