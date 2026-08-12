# Design System

Fuente de verdad visual de Palmaditas. Consultar antes de crear cualquier componente nuevo.

---

## Dirección: clon de app de mensajería

**Palmaditas se ve como un grupo de WhatsApp.** No "inspirado en", no "con guiños": el objetivo es
que una captura del chat pase por real a primera vista y que el chiste llegue antes de leer nada.
Todo lo demás en este documento se subordina a eso.

Consecuencia directa: **la interfaz no hace humor.** Nada de Comic Sans, emojis gigantes ni
elementos de broma. Cuanto más creíble y sobria sea la carcasa, más gracia tiene el contenido. La UI
hace de recto; los personajes hacen el número.

### Qué clonamos y qué no

Copiar la forma de una interfaz de mensajería es legítimo. Copiar la marca de Meta no, y este es un
producto de pago con dominio propio, así que la línea se traza aquí de forma explícita:

| Sí | No |
|----|-----|
| Layout, proporciones y jerarquía de la pantalla | El nombre "WhatsApp" en cualquier parte del producto |
| Burbujas, colas, radios y agrupación de mensajes | El logo, el icono del teléfono o cualquier asset de marca |
| Cabecera con nombre del grupo y lista de participantes | Su verde de marca exacto como color de nuestra identidad |
| Doble check, horas, colores de nombre por participante | **El fondo de garabatos**: es un archivo suyo. Hacemos el nuestro |
| El comportamiento: "escribiendo…", scroll, entrada | Cualquier sugerencia de que el producto está afiliado a Meta |

**El fondo lo dibujamos nosotros**, en el mismo estilo de garabatos monocromos a baja opacidad,
pero con nuestros motivos: manos aplaudiendo, palmas, pulgares arriba, confeti, algún trofeo de
plástico. Igual de reconocible, propio, y encima es un chiste más.

---

## Paleta de colores

**Modo claro es el principal** — es el que produce la captura icónica y el que más se comparte. El
modo oscuro queda como variante posterior, con los tokens ya simétricos.

### Modo claro (principal)

| Rol | Hex | Uso |
|-----|-----|-----|
| Fondo del chat | `#EFE7DE` | Beige cálido, sobre él va el patrón de garabatos |
| Patrón de garabatos | `#D8CEC3` a `opacity: .35` | Nuestros motivos de palmas. Nunca protagonista |
| Burbuja entrante (elenco) | `#FFFFFF` | Los cuatro personajes |
| Burbuja saliente (tú) | `#DCF8C6` | Verde claro. Tu mensaje es el único con color de fondo |
| Cabecera y barra de entrada | `#F0F2F5` | Gris muy claro |
| Texto principal | `#111B21` | |
| Texto secundario | `#667781` | Horas, estados, "escribiendo…" |
| Acento | `#25955D` | Botones y enlaces. Verde propio, no el de su marca |
| Check leído | `#53BDEB` | El doble check azul |
| Error | `#C0392B` | |

### Modo oscuro (posterior)

| Rol | Hex |
|-----|-----|
| Fondo del chat | `#0B141A` |
| Burbuja entrante | `#202C33` |
| Burbuja saliente | `#075E54` |
| Cabecera y barra | `#1F2C34` |
| Texto principal | `#E9EDEF` |
| Texto secundario | `#8696A0` |

### Colores de nombre por participante

Las apps de mensajería asignan a cada miembro de un grupo un color distinto para su nombre. Eso ya
existía, lo aprovechamos, y aquí sirve para algo más: **Iván tiene el único color frío del grupo.**
Los tres que aplauden son cálidos y forman bloque; el aguafiestas desentona también en la paleta.

| Personaje | Hex | |
|-----------|-----|---|
| **Rosa** | `#E542A3` | Cálido |
| **Nacho** | `#DFA33B` | Cálido |
| **Bego** | `#D9603A` | Cálido |
| **Iván** | `#5E8FA8` | **Frío — el que desentona** |

> **Accesibilidad:** verificar cada par a 4.5:1 antes de dar una pantalla por buena. Los nombres de
> personaje van sobre burbuja blanca en modo claro, así que hay margen, pero conviene comprobarlo.
> El color nunca es el único indicador de quién habla: siempre va el nombre en texto.

---

## Tipografía

**Aquí no se aplica la regla habitual de evitar fuentes de sistema: la usamos a propósito.** Una
tipografía con carácter propio delataría el clon al instante. Queremos que se lea como la app que
todo el mundo tiene en el móvil.

```css
--font-chat: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif;
--font-mono: "SF Mono", "Roboto Mono", monospace;
```

| Nivel | Tamaño | Peso |
|-------|--------|------|
| Mensaje | `15px` | 400 |
| Nombre de participante | `13px` | 500 |
| Nombre del grupo (cabecera) | `16px` | 500 |
| Participantes (cabecera) | `13px` | 400 |
| Hora | `11px` | 400 |
| Dato de Bego | `14px` | 400, monoespaciada |

**Los datos falsos de Bego van en monoespaciada** — y en el clon esto encaja mejor todavía, porque
las apps de mensajería ya tienen formato monoespaciado. Bego presenta sus estadísticas inventadas
con el formato de un dato riguroso. Es el chiste tipográfico del producto.

**Nunca bajar de 16px en el campo de entrada.** Por debajo de eso, iOS hace zoom automático al
enfocar y rompe la experiencia en móvil.

---

## Espaciado y grid

- **Escala base 4px:** 4, 8, 12, 16, 24, 32, 48.
- **Chat:** columna única, `max-width: 680px` en escritorio, centrada. En móvil ocupa todo.
- **Burbujas:** `max-width: 75%` del contenedor. Padding `6px 9px 8px`.
- **Móvil primero.** Se diseña a 375px y se escala hacia arriba.

---

## Estilo de componentes

- **Radios:** burbujas `7.5px`. La primera de cada bloque lleva la cola en la esquina superior del
  lado del hablante; las siguientes del mismo personaje van sin cola.
- **Agrupación:** mensajes consecutivos del mismo personaje se agrupan — el nombre y el avatar solo
  aparecen en el primero. Es de las cosas que más venden la ilusión.
- **Sombra de burbuja:** `0 1px 0.5px rgba(0,0,0,.13)`. Muy sutil, es la que da el relieve
  característico.
- **Hora:** dentro de la burbuja, abajo a la derecha, con el texto haciéndole hueco.
- **Doble check:** solo en tus mensajes. Azul. Detalle de fidelidad barato y muy reconocible.
- **Avatares:** círculo con las iniciales sobre el color del personaje. Sin ilustraciones: dibujar
  cuatro personajes abre decisiones de representación que no aportan y encarecen el proyecto.
- **Iconos:** Lucide, 20px.

---

## Movimiento

**En este producto el movimiento no es decoración: es el producto.** La ilusión de grupo depende
enteramente del ritmo, así que se especifica con la misma precisión que los colores.

**El "escribiendo…" va en la cabecera, no en una burbuja.** Es como funciona de verdad en los grupos
—debajo del nombre del grupo aparece "Rosa está escribiendo…"— y clonarlo bien tiene una ventaja
inesperada: cuando escriben dos a la vez, la cabecera dice **"Rosa y Bego están escribiendo…"**, y
esa línea sola comunica que hay un grupo entero pendiente de ti mejor que cualquier animación.

| Elemento | Comportamiento |
|----------|----------------|
| Entrada de burbuja | Sube 8px y aparece, 180ms, `ease-out` |
| Estado "escribiendo…" | En la cabecera, con los nombres de quienes teclean |
| Retardo antes de escribir | Distinto por personaje (ver abajo) |
| Velocidad de escritura | Distinta por personaje |
| Scroll | Anclado al último mensaje; se suelta si el usuario sube a leer |

### El orden lo manda el modelo, no el ritmo

**Regla principal: el orquestador nunca reordena una tanda.** El modelo devuelve los mensajes en un
orden que ha elegido según la conversación —a veces Iván abre porque está contestando a algo
concreto— y ese orden es mejor que cualquier tabla que podamos escribir aquí. El ritmo solo pone el
tiempo de cada mensaje **en la posición que ya tiene**.

Un diseño anterior asignaba a cada personaje un retardo fijo desde el mensaje del usuario, lo que en
la práctica imponía el orden Rosa → Nacho → Bego → Iván en todas las tandas. Dos problemas: el chat
se veía siempre igual, y machacaba decisiones del modelo que tenían sentido. Descartado.

### Cómo se calcula el tiempo de cada mensaje

Cada mensaje aparece cuando termina el anterior, más su pausa, más lo que tarde en teclearse:

```
aparición(n) = aparición(n-1) + pausa + longitud(texto) × velocidad
```

| Personaje | Pausa antes de teclear | Velocidad | Carácter que comunica |
|-----------|------------------------|-----------|------------------------|
| **Rosa** | 250–800 ms | 18 ms/car | Contesta antes de terminar de leer, y teclea rápido |
| **Nacho** | 800–1800 ms | 30 ms/car | Redacta con calma algo que le parece importante |
| **Bego** | 1100–2400 ms | 16 ms/car | Se toma su tiempo buscando el dato y lo suelta de golpe |
| **Iván** | 1400–3000 ms | 45 ms/car | Se lo piensa antes de arrancar y teclea despacio |

Tres reglas que hacen que esto se sienta real:

- **La duración de escritura sale de la longitud del texto**, no del personaje. Si Iván escribe
  "vale, me atrapaste", aparece rápido: son cuatro palabras. Un retardo fijo por personaje haría que
  tres palabras tardasen lo mismo que tres frases, y eso se nota.
- **Mensajes seguidos del mismo personaje casi no tienen pausa** (150–450 ms): está escribiendo del
  tirón, no volviendo a pensárselo. Es lo que hace Rosa cuando suelta tres de golpe.
- **Topes:** ningún mensaje tarda más de **3,5 s** en teclearse por largo que sea, y una tanda
  completa no pasa de **10 s**. Si se pasa, se comprime todo proporcionalmente conservando el orden
  y las diferencias relativas — lo que comunica carácter es que Iván teclee más despacio que Rosa,
  no los milisegundos exactos.

Nunca aparecen todos de golpe ni todos en cada tanda: hablan dos o tres, y no siempre los mismos. Un
grupo que contesta en pleno y al unísono no cuela — y eso es tan responsabilidad del prompt del
elenco como del orquestador de ritmo.

**`prefers-reduced-motion`:** desactiva la entrada de burbujas y el pulso del indicador, **pero no
los retardos**. El escalonado no es una animación, es la conversación: quitarlo no lo hace
accesible, destruye el producto.

---

## Tono visual

Indistinguible de una app de mensajería real hasta que lees los mensajes. Sobrio, familiar,
absolutamente creíble. El usuario debe tener la sensación de estar mirando su propio móvil.

Todo el humor está en el contenido y en el ritmo. **Si algún día alguien propone "darle más
personalidad" a la interfaz, la respuesta es no**: la personalidad la ponen Rosa, Nacho, Bego e
Iván, y la carcasa está para que ellos parezcan reales.

---

## Componentes definidos

### MessageBubble
Un mensaje. Props: `personaje` (`rosa | nacho | bego | ivan | usuario`), `texto`, `hora`,
`primeroDelBloque`. El color del nombre y la cola salen de ahí. La variante `usuario` es la verde,
alineada a la derecha y con doble check.

### ChatHeader
Cabecera: avatar del grupo, nombre ("Palmaditas"), lista de participantes y —cuando toca— el estado
"X está escribiendo…" en su lugar. Es el componente que lleva el ritmo del grupo.

### FuenteCitada
La línea de fuente bajo un mensaje de Bego con dato: título y enlace, en texto secundario y tamaño
pequeño. **Es el elemento que separa lo verificable de la coña**, así que debe leerse sobrio y
ligeramente aparte de la burbuja, no como parte del mensaje. Solo aparece en mensajes de Bego cuyo
dato viene de una búsqueda.

### CastCard
Presentación de un personaje en la landing: avatar, nombre, una línea de descripción y una frase de
ejemplo con su voz. La de Iván se diferencia del resto.

### ScriptedDemo
Reproduce la conversación guionizada de la landing con el mismo motor de ritmo que el chat real, sin
tocar la API. **Debe compartir componentes con el chat de verdad**: si la demo y el producto se ven
distintos, la demo miente.

### DoodleBackground
Nuestro patrón de garabatos: palmas, manos aplaudiendo, confeti, trofeos. SVG propio, en mosaico,
monocromo y a baja opacidad. **No usar ningún asset de terceros aquí.**

---

## Identidad y assets

### Favicon

**Un SVG propio dibujado imitando el emoji de palmadas (👏).** Es el único elemento de identidad de
marca del producto y funciona por sí solo: en una pestaña, junto a un enlace compartido o en la
pantalla de inicio de un móvil, dos manos aplaudiendo dicen exactamente lo que hace esto.

- **Dibujado por nosotros, no exportado de un set de emojis.** Los emojis de Apple son propietarios;
  otros conjuntos tienen licencias que obligan a atribución. Dibujar dos manos aplaudiendo desde
  cero evita el problema entero y permite ajustarlo a nuestra paleta.
- SVG, legible a 16px: formas simples, sin degradados ni detalle fino que se pierda al reducir.
- Sirve también como avatar del grupo en la cabecera del chat, que es donde más se va a ver.

Encaja además con el patrón de fondo, que usa los mismos motivos: manos, palmas, confeti.

---

## Referencias visuales

- **WhatsApp, modo claro y oscuro** — la referencia directa para layout, burbujas, cabecera y
  comportamiento. Con los límites de la tabla "Qué clonamos y qué no".
- **Telegram e iMessage** — para convenciones ya interiorizadas: agrupación de mensajes
  consecutivos, posición de la hora, estados de entrega.
- **Prueba de fuego:** enseña una captura del chat a alguien un segundo y quítala. Si pregunta
  "¿quiénes son esos?" en lugar de "¿qué app es esa?", el diseño funciona.
