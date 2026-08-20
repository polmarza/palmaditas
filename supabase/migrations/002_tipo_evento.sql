-- Distingue el mensaje de una conversación de los eventos de la invitación al
-- café, para poder medir cuántos la ven y cuántos pulsan.
--
-- Misma tabla y mismo criterio: **ningún contenido**. Un evento de café es una
-- fila con su tipo, su sesión y su hora, y nada más.
--
-- Valores:
--   'mensaje'             una tanda del grupo (lo único que consume API)
--   'cafe_chat_visto'     apareció la invitación de Iván
--   'cafe_chat_pulsado'   pulsó el botón de la invitación de Iván
--   'cafe_cupo_visto'     apareció el aviso de cupo agotado con el botón
--   'cafe_cupo_pulsado'   pulsó el botón del aviso de cupo

alter table public.eventos
  add column if not exists tipo text not null default 'mensaje';

-- Todo lo anterior a esta migración son mensajes.
update public.eventos set tipo = 'mensaje' where tipo is null;

-- El límite por IP cuenta filas de esta tabla filtrando por tipo: sin este
-- índice, cada petición al chat recorrería también las filas de café.
create index if not exists eventos_tipo_ip_idx
  on public.eventos (tipo, ip_hash, creado_en desc);
