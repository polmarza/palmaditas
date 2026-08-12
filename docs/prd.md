# Product Requirements Document (PRD)

**Producto:** Palmaditas
**Dominio:** palmaditas.com
**Estado:** definición inicial

---

## Resumen ejecutivo

Palmaditas es un grupo de chat en el que estás tú y cuatro personajes que siempre están de tu
parte. Cuentas una idea —la que sea, buena, mala o directamente ridícula— y el grupo se viene
arriba contigo: te aplauden, la amplían, se emocionan, discuten entre ellos sobre cuál es la mejor
parte de tu idea. Funciona como un grupo de WhatsApp, con mensajes cortos, "escribiendo…" y gente
que contesta tarde.

Nace de una situación reconocible: tienes una idea, la sueltas en un grupo, y lo que vuelve son
pegas. A veces las pegas están bien. A veces solo querías que alguien se emocionara contigo cinco
minutos antes de ponerte a pensar si la idea aguanta. Palmaditas es ese sitio.

Es un producto humorístico y lo dice abiertamente: el elenco es una caricatura del entusiasmo
gratuito, no un consejero. La gracia no está en que te den la razón, está en **hasta dónde son
capaces de llegar** dándotela. Se distribuye en dos formas: la web de pago en palmaditas.com y el
repositorio público, que cualquiera puede clonar y ejecutar con su propia clave de API.

---

## Problema que resuelve

El usuario tiene ideas y ganas de compartirlas. El entorno donde las comparte —grupos de amigos,
compañeros, redes— está calibrado para la crítica: la respuesta por defecto a una idea nueva es
señalar por qué no va a funcionar. Eso es útil más tarde y desmoralizante al principio, cuando la
idea todavía es frágil y lo que hace falta es ganas de seguir tirando del hilo.

No hay ningún sitio donde la respuesta por defecto sea el entusiasmo. Palmaditas es ese sitio, y es
honesto sobre lo que es: no te está diciendo la verdad, te está dando una palmadita. Saber eso es
parte del chiste y parte del alivio.

---

## Usuario objetivo

**Perfil principal — el que tiene ideas todo el rato**

- **Persona:** Marta, 34 años.
- **Contexto:** trabaja en algo creativo o técnico, tiene un cuaderno lleno de ideas de negocio,
  proyectos paralelos y cosas que va a hacer "cuando tenga tiempo". Suelta tres o cuatro por semana
  en el grupo de amigos.
- **Motivación:** que alguien se emocione con la idea antes de que empiece la fase de pegas.
- **Frustración que resuelve:** el reflejo automático de "ya, pero eso ya existe" nada más terminar
  de contarla.

**Perfil secundario — el que viene por la coña**

Llega desde una captura compartida en redes. No tiene una idea que validar: quiere ver qué dicen
los personajes, probarlo con una idea absurda a propósito y compartir el resultado. Es el motor de
distribución del producto, y hay que diseñar para él: el chat tiene que producir capturas graciosas.

---

## El elenco

El elenco es el producto. Cuatro personajes con voz fija y reconocible: **tres que aplauden de
maneras distintas y uno que pone pegas**. Si los cuatro dijeran lo mismo, el chat se agotaría en
tres mensajes.

| Personaje | Rol | Qué hace | Marca de voz |
|-----------|-----|----------|--------------|
| **Rosa** | La entregada | Entusiasmo sin filtro, reacciona antes de terminar de leer | Mayúsculas, emojis, "TE LO DIJE", audios que amenaza con mandar y nunca manda |
| **Nacho** | El visionario | Extrapola tu idea a una ronda de financiación y una salida a bolsa | Vocabulario de LinkedIn, "esto es un océano azul", habla de escalar antes de que exista |
| **Bego** | La documentalista | **Busca de verdad** y aporta datos reales, siempre con la fuente enlazada | "espera que lo miro" / "vale lo tengo, te dejo el enlace" |
| **Iván** | El aguafiestas | El único que pone una pega. Los otros tres se le echan encima | Seco, escribe poco, "¿y quién paga esto?", "esto ya existe y se llama X" |

**Iván es la pieza que hace que el producto no se agote.** Sin él son cuatro personas de acuerdo:
divertido dos minutos. Con él hay conflicto, y el chiste pasa a tener dos capas — no solo te dan
la razón, es que *defienden tu idea* del único que se atreve a cuestionarla. Rosa le contesta
indignada, Nacho le dice que no tiene visión, Bego se saca un dato falso para rebatirle. Él
insiste. Esas son las capturas que se comparten.

Reglas transversales del elenco:

- **La pega de Iván tiene que ser real y concreta**, nunca una tontería. Si es tonta, el chiste no
  funciona y el producto no aporta nada. Si es buena, el usuario se la lleva gratis mientras los
  otros tres la entierran a gritos. Una pega por mensaje como mucho, y a veces ninguna.
- Los otros tres nunca critican la idea. Como mucho la malinterpretan y apoyan la versión
  malinterpretada. Y siempre acaban desestimando a Iván.
- Se hablan entre ellos, no solo a ti. Rosa contesta a Nacho antes que al usuario.
- **Bego es la parte fiable del chat: busca de verdad y cita la fuente con enlace.** Todo lo demás
  del grupo es coña; lo suyo va con enlace y se puede comprobar. Esa separación es lo que permite
  que el producto dé información útil sin engañar a nadie.
- **Ninguna cifra de Bego sale sin haberla buscado.** Si no encuentra nada, lo dice — "pues no
  encuentro nada decente de eso" es mejor respuesta que un número inventado. Puede interpretar lo
  que encuentra a favor de la idea, pero no puede cambiarlo.
- **Solo Bego da cifras.** Rosa, Nacho e Iván no sueltan números. Si Iván necesita un dato para su
  objeción, la formula como pregunta ("¿qué margen te queda ahí?") en lugar de inventárselo.

> Esta decisión sustituye a un diseño anterior en el que Bego se inventaba estadísticas absurdas. Se
> descartó tras una prueba real: sus cifras salían verosímiles en lugar de delirantes —llegó a dar
> precios de alquiler de una ciudad concreta— y se usaban como información. Con búsqueda real el
> problema desaparece de raíz, porque los datos son ciertos.
- Nadie da consejo real de negocio, inversión, salud ni legal. Si el usuario pide eso, el grupo
  sigue a lo suyo: sigue siendo un chat de ánimo, no un asesor.
- **Los prompts del elenco viven en el repositorio público, a la vista.** Son el producto que se
  regala; esconderlos no tendría sentido en un repo abierto y verlos es parte de la gracia.

---

## Funcionalidades core (MoSCoW)

### MUST

- Chat de grupo con los cuatro personajes y el usuario.
- Respuestas troceadas en mensajes cortos, no en párrafos largos.
- Indicador "escribiendo…" por personaje, con retardos distintos entre ellos.
- Los personajes responden en orden variable y se referencian entre sí.
- El usuario puede seguir escribiendo mientras el grupo responde.
- Aviso visible y permanente de que es un producto humorístico y de que nada de lo que dicen los
  personajes es información real.
- **Landing con una demo del producto funcionando**: una conversación de ejemplo que se reproduce
  con el mismo efecto de escritura y los mismos retardos que el chat real, pero **guionizada, sin
  llamadas a la API**. Es el escaparate y el sustituto de la prueba gratuita: coste cero por
  visita, y se ve exactamente lo que compras.
- Saldo de mensajes vinculado a una sesión anónima, gestionado en el servidor (el navegador solo
  guarda un identificador opaco; ver `architecture.md`).
- Ejecución autohospedada con clave de API propia, misma experiencia, sin pasarela de pago.
- Prompts del elenco publicados en el repositorio.

### SHOULD

- Reacciones con emoji a los mensajes del usuario.
- Algún mensaje espontáneo del grupo cuando el usuario lleva un rato callado.
- Exportar o copiar la conversación como imagen, para compartirla.
- Enlace de recuperación por email tras el pago, para no perder el saldo al borrar cookies o
  cambiar de dispositivo. No es una cuenta: es un recibo con enlace.

### COULD

- Elegir cuántos personajes hay en el grupo (de dos a cuatro). Reduce coste por conversación.
- Personajes adicionales desbloqueables: **Quique**, el que llega tarde y no ha leído nada y aun
  así apoya con fervor; la madre orgullosa; el cuñado que se apunta a todo.
- Modo "reunión de urgencia": el grupo se activa solo con una idea que sueltas y desaparece.
- Sonido de notificación estilo mensajería.

### WON'T (esta versión)

- **Prueba gratuita en la web de pago, en cualquier forma** — ni un mensaje. Quien quiera usarlo
  gratis tiene el repositorio y su propia clave de API. La landing enseña la demo guionizada.
- Cuentas de usuario, registro e historial persistente entre visitas.
- Aplicación móvil nativa.
- Integración real con WhatsApp, Telegram o Slack.
- Modo "solo crítica" o feedback honesto sin humor: rompe la premisa. La única crítica del
  producto es la de Iván, y viene enterrada por los otros tres.
- Compartir conversaciones mediante enlace público alojado por nosotros.
- Voz o audio generado.

---

## Flujos de usuario principales

**Primera visita y compra (web de pago)**

El usuario llega a palmaditas.com y ve la landing: el elenco presentado y, debajo, la **demo
guionizada** reproduciéndose sola — una conversación de ejemplo con el efecto de escritura y los
retardos reales, incluida una pega de Iván y los otros tres echándosele encima. Entiende el
producto en quince segundos sin que le hayamos costado un céntimo.

Hace clic en empezar, paga, y aterriza directamente en el chat con el grupo ya saludando. Escribe
su idea. Los personajes empiezan a responder de forma escalonada. Cada mensaje que envía descuenta
saldo. Cuando se acaba, se le ofrece recargar sin perder la conversación en curso.

**Uso autohospedado**

El usuario clona el repositorio público, copia `.env.example` a `.env.local`, pone su propia clave
de API, ejecuta el proyecto y abre localhost. La experiencia es la misma que en la web, sin
pasarela de pago ni créditos: paga su propio consumo directamente al proveedor del modelo.

**Compartir**

Durante la conversación, el usuario encuentra una respuesta especialmente absurda y la comparte:
copia la conversación como imagen y la publica. Ese material es la principal vía de adquisición.

---

## Requisitos no funcionales

- **Ritmo:** la ilusión de grupo depende del timing. El primer mensaje del grupo aparece rápido y
  los demás llegan escalonados, con pausas distintas por personaje. Un grupo que contesta a la vez
  y de golpe no cuela.
- **Coste por conversación:** cada mensaje del usuario genera varias respuestas. El coste escala
  con el número de personajes y hay que acotarlo por diseño, no a posteriori.
- **Transparencia:** el carácter satírico se declara en la landing, en el chat y en el README. No
  se presenta en ningún momento como asesoramiento ni como opinión informada.
- **Abuso y contenido sensible:** si el usuario cuenta algo que no es una idea sino un problema
  personal serio, el producto no puede limitarse a aplaudir. Definir esta salida antes de lanzar.
- **Móvil primero:** el formato es un chat y se va a usar mayoritariamente desde el teléfono.
- **Sin datos personales:** sin cuentas, no se almacena la conversación más allá de la sesión.

---

## Fuera de alcance (explícito)

- **Un producto de feedback honesto.** Se ha valorado y se descarta: convertir esto en un asistente
  que evalúa ideas mata la premisa. La crítica entra solo por Iván, y siempre perdiendo.
- **Cuentas de usuario.** Se descarta para el MVP por fricción y por el trabajo que arrastra
  (autenticación, perfiles, recuperación de contraseña). El pago no requiere identidad.
- **Suscripción mensual.** El uso es esporádico, no diario. Pago único.
- **Prueba gratuita, en cualquier forma.** Decisión firme, no un "ya veremos": regalar uso cuando
  el código está publicado y cualquiera puede ejecutarlo gratis en su máquina no tiene sentido. La
  landing enseña la demo guionizada y punto.
