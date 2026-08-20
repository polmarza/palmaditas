# Se registra todo el gasto, y el cupo deja de ser evitable

**Fecha:** 2026-08-20 21:25
**Tipo:** Fix

## Qué se hizo

Tras el primer lanzamiento, la factura de Anthropic marcaba 6,10 $ y la tabla `eventos` solo
1,49 $. Cuatro fugas, de mayor a menor:

1. **El registro dependía de que el cliente mandara `sesion`.** Estaba envuelto en `if (sesion)`, y
   `sesion` salía del cuerpo de la petición. Cualquier llamada directa a `/api/chat` sin ese campo
   —un script, un bot, alguien curioseando el endpoint— obtenía respuestas sin dejar fila. Y como
   el límite de uso cuenta filas de esa misma tabla, tampoco gastaba cupo: barra libre. Ahora, si
   no viene sesión, se genera en el servidor con `randomUUID()` y se registra igual.
2. **La inserción se lanzaba con `void`.** En serverless la función se congela al devolver la
   respuesta, así que parte de las inserciones no llegaban a completarse. Ahora se espera. No puede
   tumbar nada: `registrar` se traga sus propios errores.
3. **El clasificador de la salvaguarda no contaba.** Se cobra en cada mensaje. `clasificar` ahora
   devuelve `costeMicros` y se suma al de la tanda. Los eventos de nivel `alto` registraban coste
   cero pese a haber pagado la clasificación.
4. **Las búsquedas web no contaban.** Se facturan aparte de los tokens, a 0,01 $ cada una. Se suman
   al coste de la tanda.

## Qué se modificó

- `src/app/api/chat/route.ts`
- `src/lib/salvaguarda/clasificar.ts`
- `src/lib/elenco/tanda.ts`
- `src/lib/metricas/registrar.ts`
- `docs/architecture.md`

## Por qué

El cupo por IP es lo único que separa la clave de API de internet mientras no haya pagos, y estaba
midiendo con una regla incompleta. Con el gasto bien contado el cupo vuelve a significar lo que dice
que significa, y las métricas del lanzamiento sirven para poner precio en la Fase 2.
