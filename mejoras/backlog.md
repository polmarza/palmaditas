# Backlog de mejoras

Ideas que no entran ahora pero que no queremos perder. No es un compromiso, es un cajón de ideas.

Añadir una entrada cada vez que surja algo durante el desarrollo. Usa `/mejora`.

---

## Formato de entrada

```
### [MEJORA-XX] Título de la idea
**Área:** Frontend / Backend / UX / Infraestructura / Negocio
**Prioridad estimada:** Alta / Media / Baja
**Origen:** De dónde salió la idea (conversación, feedback de usuario, etc.)

Descripción breve de la mejora y por qué aportaría valor.
```

---

### [MEJORA-01] Integración de Supabase con GitHub para migraciones
**Área:** Infraestructura
**Prioridad estimada:** Baja
**Origen:** Conversación de diseño, 2026-08-12

Supabase permite aplicar cambios de base de datos al mergear a la rama de producción, y funciona en
cualquier plan. Valorarlo en Fase 2, cuando exista la tabla `sesiones`.

La otra mitad de esa integración —bases de datos de preview por pull request— **queda descartada**:
requiere plan Pro más 0,01344 $ por rama y hora, y el esquema del proyecto es una sola tabla.

---

### [MEJORA-02] Servidor MCP de Supabase
**Área:** Infraestructura
**Prioridad estimada:** Baja
**Origen:** Conversación de diseño, 2026-08-12

Configurar el MCP de Supabase (servidor remoto en `https://mcp.supabase.com/mcp`, alcance local)
para consultar el esquema y aplicar migraciones desde el editor.

Aplazado a Fase 2: hoy no existe proyecto de Supabase al que conectarse. El comando queda
verificado contra la documentación oficial:

```
claude mcp add --transport http supabase --scope local "https://mcp.supabase.com/mcp?read_only=true"
```

Añadir `project_ref` cuando exista el proyecto, y quitar `read_only` solo cuando toque migrar.
