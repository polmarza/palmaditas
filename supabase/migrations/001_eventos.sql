-- Métricas anónimas del lanzamiento y control de abuso.
--
-- NO se guarda ningún contenido: ni los mensajes del usuario, ni los del grupo.
-- La landing dice públicamente que las conversaciones no se almacenan, y esta
-- tabla lo respeta. Solo hay números.
--
-- Responde a: cuántas conversaciones se abren, cuántos mensajes aguantan
-- —la pregunta del proyecto—, dónde se abandona, cuánto se usan las menciones,
-- cuántas veces salta la salvaguarda y qué cuesta todo.

create table if not exists public.eventos (
  id              bigserial primary key,

  -- Identificador aleatorio de conversación, generado en el navegador.
  -- No identifica a nadie: sirve para agrupar mensajes de una misma sesión.
  sesion          uuid        not null,

  -- Posición del mensaje dentro de la conversación (1, 2, 3…).
  -- El máximo por sesión es la métrica que dice si el elenco aguanta.
  indice          integer     not null,

  con_mencion     boolean     not null default false,

  -- 'comprobar' | 'alto' | null. Nunca el texto que lo provocó.
  salvaguarda     text,

  tokens_entrada  integer     not null default 0,
  tokens_salida   integer     not null default 0,
  busquedas       integer     not null default 0,
  coste_micros    integer     not null default 0,

  -- Hash con sal de la IP, para limitar el abuso. Nunca la IP en claro:
  -- no es reversible y no vale para identificar a nadie.
  ip_hash         text,

  creado_en       timestamptz not null default now()
);

create index if not exists eventos_sesion_idx on public.eventos (sesion);
create index if not exists eventos_creado_idx on public.eventos (creado_en desc);
create index if not exists eventos_ip_idx     on public.eventos (ip_hash, creado_en desc);

-- RLS activado y sin políticas: con eso, la clave pública no puede leer ni
-- escribir nada. Solo el servidor, con la service role, que salta RLS.
alter table public.eventos enable row level security;
