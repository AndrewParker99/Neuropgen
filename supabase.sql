-- Ejecutar en el SQL Editor de Supabase para preparar el proyecto.

create table if not exists public.cms (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.cms enable row level security;

create policy "cms_public_read" on public.cms
  for select using (true);

create policy "cms_authenticated_write" on public.cms
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage: crea un bucket público llamado "assets" desde el panel de Supabase
-- (Storage > New bucket > Public bucket), y aplica estas políticas sobre
-- storage.objects para permitir lectura pública y escritura autenticada.

create policy "assets_public_read" on storage.objects
  for select using (bucket_id = 'assets');

create policy "assets_authenticated_write" on storage.objects
  for insert with check (bucket_id = 'assets' and auth.role() = 'authenticated');
