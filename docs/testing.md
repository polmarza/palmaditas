# Estrategia de testing

---

## Filosofía

**Se testea lo que puede costar dinero o hacer daño; el resto se juzga mirándolo.**

Este es un proyecto secundario y humorístico: llenarlo de tests sería trabajo sin retorno. Pero hay
tres cosas que no se pueden dejar a la vista de un humano, porque fallan en silencio y duelen:

1. **La salvaguarda** — un falso negativo produce la captura que hunde el producto.
2. **El saldo** — cobrar de más, o cobrar por una respuesta que no llegó, es dinero real de alguien.
3. **La idempotencia del webhook** — un cobro procesado dos veces regala saldo.

Y hay una cosa que **no se puede testear automáticamente y no se va a intentar**: si el elenco tiene
gracia. Eso se lee y se juzga. Ningún assert va a decirte si Iván es divertido.

---

## Stack de testing

| Tipo | Herramienta |
|------|-------------|
| Unitario e integración | **Vitest** |
| Componentes | **Vitest + Testing Library** (solo donde hay lógica de estado) |
| E2E | **Playwright** (solo los dos flujos que tocan dinero) |
| Evaluación de la salvaguarda | **Batería de casos propia**, ejecutada contra el clasificador real |

---

## Qué testear

### Sí testear

- **Saldo:** el descuento es atómico; no baja de cero; dos peticiones simultáneas no gastan el mismo
  mensaje; se devuelve el saldo si la llamada al modelo falla.
- **Webhook:** el mismo `referencia_pago` dos veces acredita saldo una sola vez.
- **Salvaguarda:** contra su batería de casos. Es el único test que se ejecuta contra el modelo real.
- **Orquestador de ritmo:** los personajes no empiezan a la vez; los retardos respetan la tabla de
  `design-system.md`; la agrupación de mensajes consecutivos es correcta.
- **Parseo de la tanda:** que una respuesta malformada del modelo no rompa la interfaz.
- **Arranque autohospedado:** sin `ANTHROPIC_API_KEY` falla con un error claro, no en silencio.
- **E2E (Playwright), solo dos:** comprar y llegar al chat con saldo; y **agotar el saldo, recargar y
  no perder la conversación** — el fallo más caro de FLOW-03.

### No testear (o mockear)

- **La calidad del elenco.** Se lee. No hay assert posible.
- Componentes puramente visuales (`MessageBubble`, `DoodleBackground`): se miran en la preview.
- La API de Anthropic: se mockea en todo salvo en la batería de la salvaguarda.
- La pasarela de pago: se usa su entorno de pruebas y se simulan los webhooks.
- Supabase: se mockea en unitarios; los E2E van contra un proyecto de pruebas.

---

## La batería de la salvaguarda

Es el activo de calidad más importante del proyecto y se mantiene como código, en
`lib/salvaguarda/casos.ts`. Un archivo de casos etiquetados, ejecutados contra el clasificador real.

Debe cubrir tres grupos, y **el tercero es el que más casos necesita**:

| Grupo | Ejemplos | Esperado |
|-------|----------|----------|
| Debe saltar | Crisis personal, autolesión, duelo, enfermedad grave, violencia | `sensible` |
| No debe saltar (fácil) | Ideas de negocio, proyectos, ocurrencias absurdas | `normal` |
| **No debe saltar (difícil)** | **Humor negro, sarcasmo, ideas sobre temas oscuros, frustración normal, "estoy harto de mi trabajo", quejas exageradas de broma** | `normal` |

El tercer grupo es donde se rompen los clasificadores. Un falso positivo —cuentas un chiste negro y
te sale una línea de ayuda— arruina la experiencia y es tan grave como un falso negativo. **Cada vez
que se detecte un fallo en producción, el caso entra en la batería.** Así solo crece hacia donde
duele.

Criterio para dar por buena la calibración: **cero falsos negativos** en el primer grupo, y una tasa
de falsos positivos suficientemente baja en el tercero como para que no aparezca en uso normal.

---

## Convenciones

- Archivos `nombre.test.ts` junto al archivo que prueban.
- E2E en `e2e/`.
- Describe en presente y en español: `"no permite que el saldo baje de cero"`.
- Un comportamiento por test.
- Nada de tests de nieve (snapshots) de componentes: se rompen con cada retoque visual y no detectan
  nada útil aquí.

---

## Cobertura objetivo

**No hay porcentaje objetivo, a propósito.** Un número global empujaría a escribir tests de relleno
sobre componentes visuales para subir la cifra.

El criterio es de lista, no de porcentaje: **saldo, webhook, salvaguarda y orquestador de ritmo
tienen que estar cubiertos.** El resto, lo que aporte.

---

## Cómo correr los tests

```bash
pnpm test
```

```bash
pnpm test:watch
```

```bash
pnpm test:e2e
```

La batería de la salvaguarda va aparte porque consume API y tarda:

```bash
pnpm test:salvaguarda
```
