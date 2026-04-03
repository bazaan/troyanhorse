# Plan Troya — Supabase Schema

Pegar todo el bloque de abajo de una en el SQL Editor.

```sql
-- 1. profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. reportes
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

-- 3. indexes
create index if not exists reportes_user_id_idx on public.reportes(user_id);
create index if not exists reportes_fecha_idx on public.reportes(fecha);

-- 4. row level security
alter table public.profiles enable row level security;
alter table public.reportes enable row level security;

-- 5. policies profiles
create policy "profiles_select" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles_insert" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- 6. policies reportes
create policy "reportes_select" on public.reportes
  for select using (auth.role() = 'authenticated');

create policy "reportes_insert" on public.reportes
  for insert with check (auth.uid() = user_id);

create policy "reportes_update" on public.reportes
  for update using (auth.uid() = user_id);
```
