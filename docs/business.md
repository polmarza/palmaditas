# Modelo de negocio

---

## Propuesta de valor

Un grupo de chat donde cuatro personajes se emocionan con tu idea antes de que empiece la fase de
pegas — y donde el único que se atreve a criticarla acaba enterrado por los otros tres.

El producto se distribuye por dos vías que se refuerzan: **el repositorio público**, que cualquiera
puede ejecutar gratis con su propia clave de API y que funciona como carta de presentación, y
**palmaditas.com**, para quien no quiere montarse nada y prefiere pagar unos euros y escribir.

No es un negocio serio y no pretende serlo. El objetivo realista es que se sostenga solo, no que dé
de comer.

---

## Modelo de monetización

**Pago único que acredita saldo de consumo a una sesión anónima.** Sin suscripción, sin cuentas, sin
prueba gratuita.

| | |
|---|---|
| **Qué se compra** | 1 $ de consumo de API. Con el coste actual son unos **217 mensajes** normales |
| **Precio de partida** | 5 € |
| **Qué ve el usuario** | Una estimación en mensajes restantes. **Nunca el saldo en dinero** |
| **Recarga** | Mismo paquete, sin perder la conversación en curso |
| **Pasarela** | **Sin decidir.** No bloquea el desarrollo — ver más abajo |
| **Alternativa gratuita** | Clonar el repositorio y poner tu propia clave de API |

### Por qué se mide en coste y no en mensajes

Porque un mensaje no cuesta siempre lo mismo, y la diferencia no es pequeña: una tanda normal gasta
0,0033 $ y una con búsqueda 0,0165 $ — cinco veces más. Contar mensajes a secas obliga a elegir entre
poner el precio pensando en el peor caso (caro e injusto para quien no busca) o comerse la diferencia
cuando alguien usa mucho las menciones.

Midiendo consumo real, el modelo aguanta cualquier cambio de coste futuro sin rehacer el precio:
si una función nueva gasta más, el saldo baja más rápido y nada se rompe.

**Pero el usuario nunca ve un número en dólares.** En pantalla pone "te quedan ~180 mensajes",
estimado sobre el coste medio. Un saldo en dinero no le dice nada y le obliga a calcular si escribir
de más le sale caro, que es exactamente el cálculo que no quieres que haga alguien a quien le estás
pidiendo que suelte ideas sin pensar. Cuando tira de menciones, el contador baja más rápido y ahí sí
se le avisa de que verificar datos gasta más.

Margen bruto con estas cifras: **en torno al 80 %** (5 € ≈ 5,4 $ de ingreso frente a 1 $ de consumo
máximo), antes de comisión de pasarela e IVA.

### Los números medidos

Medidos en conversaciones reales el 2026-08-12, con Haiku 4.5 a 1 $ por millón de tokens de entrada
y 5 $ de salida:

| Tipo de tanda | Entrada | Coste |
|---|---|---|
| Normal, primera de la conversación | 1.881 tokens | 0,0033 $ |
| Normal, quinta de la conversación | 2.892 tokens | 0,0043 $ |
| **Con búsqueda web** | **12.971 tokens** | **0,0165 $** |

Dos cosas que salen de aquí:

**El coste crece con la conversación**, porque el historial entero viaja en cada llamada: la quinta
tanda cuesta un 30 % más que la primera. Es otro motivo para medir consumo y no mensajes.

**Una tanda con búsqueda cuesta cinco veces más**, porque los resultados entran en el contexto. Por
eso la búsqueda solo se activa cuando el usuario etiqueta a alguien: es él quien decide cuándo pagar
la tanda cara, y solo la paga si de verdad quiere un dato verificado.

### El coste crecía de forma cuadrática, y por eso se compacta

El historial entero viaja en cada llamada, así que sin hacer nada el coste acumulado se dispara con
la longitud de la conversación:

| Conversación de… | Entrada en la última tanda | Coste acumulado sin compactar |
|---|---|---|
| 20 mensajes | ~6.600 tokens | ~0,10 $ |
| 50 mensajes | ~14.100 tokens | ~0,45 $ |
| 100 mensajes | ~26.600 tokens | **~1,50 $** |

Cien mensajes seguidos costarían vez y media el saldo entero. **Con compactación** —resumir lo
antiguo cuando la entrada pasa de 5.000 tokens— el coste por tanda deja de crecer y esos mismos 100
mensajes bajan a **~0,50 $**.

### Cuántos mensajes da 1 $ de saldo

Con compactación activa, el coste por mensaje se estabiliza en torno a **0,0046 $**:

| Uso de menciones | Coste medio por mensaje | Mensajes por 1 $ |
|---|---|---|
| Nunca | ~0,0046 $ | ~215 |
| 1 de cada 10 | ~0,0058 $ | ~170 |
| 1 de cada 4 | ~0,0076 $ | ~130 |
| En todos | 0,0165 $ | ~60 |

Incluso en el caso extremo —etiquetar a alguien en cada mensaje, con búsqueda cada vez— salen sesenta
mensajes por 5 €, y el margen sigue en el 80 %. **No hay forma de que un usuario dispare la factura**,
porque el saldo se agota antes.

### La reserva del 5 % y la degradación

El saldo se da por agotado al llegar al **5 % del paquete**, no a cero. Esa reserva absorbe una tanda
más cara de lo previsto sin dejar el saldo en negativo.

Y al entrar en ella **no se corta la conversación: se desactiva la búsqueda web** y se avisa de qué
ha pasado. Cortar del todo es hostil y deja al usuario sin producto; quitar solo lo caro le permite
seguir usándolo y convierte el límite en un motivo concreto para recargar — sabe exactamente qué
recupera.

> ⚠️ **Sigue pendiente de medir el precio de la búsqueda en sí**, que se factura aparte de los
> tokens. El script cuenta cuántas se hacen; hay que multiplicarlas por la tarifa vigente y sumarlas
> antes de fijar el precio definitivo.

Dos supuestos que ya se han confirmado midiendo:

1. **Una sola llamada a la API por tanda, no cuatro.** Generar los cuatro mensajes en una única
   llamada cuesta cerca de un tercio que hacer una llamada por personaje, porque el historial se
   envía una vez en lugar de cuatro. Y además sale mejor: el modelo ve todo el intercambio a la vez,
   así que los personajes se contestan entre ellos con más naturalidad. Es la decisión que hace que
   los números salgan; queda registrada en `architecture.md`.
2. **No contamos con la caché de prompt.** Haiku 4.5 exige un prefijo de al menos 4.096 tokens para
   cachear, y nuestro prompt no llega ni de lejos. Los números de arriba son sin descuento por
   caché: si el elenco crece y el prompt supera ese umbral, mejorarán solos.

### La pasarela: decisión aplazada a propósito

El mecanismo es idéntico en todas: pago confirmado → webhook → el servidor acredita N mensajes a un
identificador de sesión. Lo que cambia entre proveedores no es la técnica, es la fricción del alta y
quién asume el IVA de servicios digitales en la UE:

| Opción | A favor | En contra |
|---|---|---|
| **Stripe** | El estándar, alta directa, integración sencilla | El IVA de servicios digitales es nuestro |
| **Lemon Squeezy / Paddle** | *Merchant of record*: se ponen ellos como vendedor y gestionan el IVA | Verificación de la aplicación más pesada al dar de alta |
| **Buy Me a Coffee** | Encaja con el tono, permite donaciones repetidas | **Sin verificar**: hay que confirmar en su documentación oficial si el webhook permite vincular la donación a la sesión con la limpieza necesaria |

Se construye con un adaptador de pago y se enchufa el proveedor cuando esté decidido. La decisión
fiscal es del propietario del proyecto, no técnica.

---

## Competidores y diferenciación

| Competidor | Qué hace | Diferencia nuestra |
|------------|----------|---------------------|
| Cualquier asistente de IA generalista | Te da feedback equilibrado si se lo pides | Aquí el sesgo es el producto, es explícito, y viene con personajes |
| Apps de afirmaciones y motivación | Frases positivas genéricas, sin interacción | Esto reacciona a *tu* idea concreta, en formato conversación |
| El grupo de WhatsApp de tus amigos | Gratis, real, y ahí está el problema | Este grupo está de tu parte por diseño |

La diferenciación real no es funcional, es de **tono y formato**: nadie más está haciendo un grupo
de chat satírico con elenco fijo, en español, y con el código publicado.

---

## Métricas de éxito

Para un producto de esta naturaleza, la métrica que importa es la difusión, no la conversión.

| Métrica | Objetivo | Por qué |
|---|---|---|
| Estrellas y forks del repositorio | El indicador principal | El repo es la carta de presentación y la vía de difusión |
| Capturas compartidas en redes | Cualquier señal cuenta | Es el motor de adquisición del producto |
| Conversaciones que pasan de 10 mensajes | > 40 % de las iniciadas | Mide si el elenco aguanta o se agota. **Si esto falla, el problema es el elenco** |
| Ingresos | Que cubran dominio + alojamiento + API | El listón es la autosuficiencia, no el beneficio |

---

## Riesgos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **El chat se agota tras unos pocos mensajes** | Media | Alto | Iván y el conflicto interno del grupo son la mitigación de diseño. Se mide con la métrica de conversaciones que pasan de 10 mensajes |
| **Alguien escribe algo personal serio y el grupo aplaude** | Baja, pero llegará | Alto | Es el riesgo real del producto. Requiere una comprobación antes de que el grupo responda; se dimensiona en `architecture.md` y no se lanza sin ello |
| Los datos inventados de Bego se toman en serio | Baja | Medio | Absurdos por diseño, más aviso permanente en la interfaz y en el README |
| Se toma como asesoramiento real de negocio | Baja | Medio | El elenco tiene prohibido dar consejo financiero, legal o de salud |
| El usuario pierde su saldo al borrar cookies | Media | Bajo | Enlace de recuperación por email tras el pago |
| Subida de precios o cambio en la API del modelo | Baja | Bajo | El coste por conversación es tan bajo que hay margen de sobra |
| Nadie paga porque el repo es gratis | **Alta** | Bajo | Es el modelo, no un fallo. Quien sabe clonar un repo y gestionar una clave de API no era el cliente de pago |

---

## Restricciones

- **Presupuesto:** el mínimo. Dominio ya comprado (palmaditas.com); todo lo demás debe caber en
  planes gratuitos o de coste marginal hasta que haya ingresos.
- **Tiempo:** proyecto secundario. La arquitectura debe favorecer el mantenimiento cero: sin
  servidores que vigilar, sin operativa manual, sin trabajo recurrente.
- **Fiscal:** al cobrar por un servicio digital en la UE hay obligaciones de IVA. La elección de
  pasarela depende de esa decisión, que es del propietario del proyecto y conviene consultar con un
  asesor. No bloquea el desarrollo.
- **Idioma:** el producto es en español y el humor depende de que suene a grupo de WhatsApp español.
  Traducirlo no es trivial y queda fuera de esta versión.
