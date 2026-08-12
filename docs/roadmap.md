# Roadmap

Guía de prioridades, no un calendario. Actualizar cuando algo cambie de fase o se redefinan las
prioridades.

---

## Fase 0 — El elenco, antes que nada

**Esto va primero, y no es una fase de calentamiento.** Todo el proyecto depende de una sola
pregunta: ¿los cuatro personajes tienen gracia durante quince mensajes seguidos? Si la respuesta es
no, no hay producto — y sería absurdo descubrirlo después de construir pasarela, saldo y landing.

- [ ] Escribir los prompts de Rosa, Nacho, Bego e Iván
- [ ] Un script de terminal mínimo, sin interfaz, que mantenga una conversación con la tanda completa
- [ ] Conversar con él en serio: veinte mensajes, ideas buenas y malas, temas variados
- [ ] Ajustar hasta que las cuatro voces se distingan sin leer el nombre
- [ ] Verificar que Iván aporta pegas reales y que los otros tres se le echan encima de forma creíble
- [ ] Medir el coste real por tanda y contrastarlo con las estimaciones de `business.md`

**Objetivo de validación:** que leyendo la transcripción en bruto, sin interfaz ni ritmo, ya haga
gracia. Si solo funciona gracias a la animación, el producto es un truco y se agota.

---

## Fase 1 — MVP jugable, sin pagos

Palmaditas funcionando de verdad, en local y desplegado, con la clave de API propia. Sin cobrar
todavía.

- [x] Proyecto Next.js 16 + Tailwind v4 con los tokens del design system
- [x] Componentes del chat: `MessageBubble`, `ChatHeader`, `DoodleBackground`, `Chat`
- [x] **Favicon**: SVG propio dibujado imitando el emoji de palmadas (👏), con formas rellenas para
      que se lea a 16px. Sirve también de avatar del grupo
- [x] Orquestador de ritmo (`lib/elenco/ritmo.ts`): pausas y velocidades por personaje, sin
      reordenar la tanda, "escribiendo…" en la cabecera con varios nombres a la vez
- [x] Route handler de chat (`/api/chat`)
- [x] Aviso permanente de que es humor y de que solo los mensajes con enlace llevan datos
- [x] **Salvaguarda** (FLOW-04): clasificador previo, respuesta del sistema visualmente distinta y
      batería de 32 casos (`pnpm test:salvaguarda`)
- [x] **Salvaguarda calibrada:** 44 casos, cero fallos graves. Tres niveles — el grupo pregunta en la
      zona gris en vez de aplaudir o cortar. **Deja de ser bloqueante**
- [x] Landing con la demo guionizada servida por el scroll, el elenco y los enlaces al repositorio
- [ ] Despliegue en Vercel con el dominio

**Objetivo de validación:** enseñárselo a diez personas y ver si comparten una captura sin que se lo
pidas. Si nadie comparte nada, el problema es el contenido y volvemos a Fase 0.

---

## Fase 2 — Cobrar

Solo tiene sentido si la Fase 1 ha gustado.

- [ ] Decidir pasarela (decisión fiscal, ver `business.md`)
- [ ] Tabla `sesiones` en Supabase + RLS activado sin políticas
- [ ] Adaptador de pago: crear cobro y procesar webhook, con idempotencia
- [ ] Saldo: descuento atómico, devolución si falla el modelo, límite por IP
- [ ] Pantalla de recarga sin perder la conversación (FLOW-03)
- [ ] Landing con la demo guionizada y el elenco presentado
- [ ] README del repositorio público con instrucciones de autohospedaje
- [ ] Revisión de seguridad antes de exponerlo (`/security-review`)

**Objetivo de validación:** que alguien que no conozcas pague. Una sola vez basta para saber que el
producto se puede vender.

---

## Fase 3 — Retención y difusión

Solo si hay señales de que la gente lo usa más de una vez.

- [ ] Exportar la conversación como imagen, para compartir
- [ ] Enlace de recuperación de saldo por email (FLOW-06)
- [ ] Modo oscuro
- [ ] Reacciones con emoji
- [ ] Mensajes espontáneos del grupo cuando llevas rato callado
- [ ] Personajes desbloqueables: Quique, la madre orgullosa, el cuñado
- [ ] Elegir cuántos participantes hay en el grupo

---

## Descartado (con motivo)

| Funcionalidad | Motivo del descarte |
|---------------|---------------------|
| Prueba gratuita en la web | Regalar uso cuando el código está publicado y cualquiera puede ejecutarlo gratis no tiene sentido. La landing enseña la demo guionizada |
| Cuentas de usuario | Fricción y trabajo (auth, perfiles, recuperación) que el producto no necesita. El pago no requiere identidad |
| Suscripción mensual | El uso es esporádico, no diario |
| Modo "feedback honesto" | Mata la premisa. La única crítica es la de Iván, y siempre pierde |
| Ilustraciones de los personajes | Abre decisiones de representación que no aportan y encarecen el proyecto. Avatares con iniciales |
| Integración real con WhatsApp | Ni técnicamente sencillo ni conveniente respecto a la marca de un tercero |
| Guardar el historial de conversaciones | Contradice la privacidad del producto: la gente escribe aquí ideas que no ha contado a nadie |
| Voz o audio generado | Coste y complejidad muy por encima de lo que aporta a la broma |
