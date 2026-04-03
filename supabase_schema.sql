create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.reportes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  fecha date not null,
  meditacion boolean default false,
  entrenamiento boolean default false,
  correr boolean default false,
  lectura boolean default false,
  ayuno boolean default false,
  notas text,
  created_at timestamptz default now(),
  unique(user_id, fecha)
);

create index if not exists reportes_user_id_idx on public.reportes(user_id);
create index if not exists reportes_fecha_idx on public.reportes(fecha);

alter table public.profiles enable row level security;
alter table public.reportes enable row level security;

create policy "troya_profiles_select" on public.profiles for select using (auth.role() = 'authenticated');
create policy "troya_profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "troya_profiles_update" on public.profiles for update using (auth.uid() = id);

create policy "troya_reportes_select" on public.reportes for select using (auth.role() = 'authenticated');
create policy "troya_reportes_insert" on public.reportes for insert with check (auth.uid() = user_id);
create policy "troya_reportes_update" on public.reportes for update using (auth.uid() = user_id);
