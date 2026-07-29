-- ============================================================
-- Comunidad Fungi — Schema Postgres (self-hosted, Railway)
-- Ejecutar en tu Postgres de Railway:
--   psql "$DATABASE_URL" -f supabase/schema.sql
-- Ya NO usa Supabase Auth ni RLS: la autorización se hace en el
-- código de la app (ver src/lib/auth.ts).
-- ============================================================

create extension if not exists "pgcrypto"; -- para gen_random_uuid()

-- ------------------------------------------------------------
-- Usuarios (antes gestionados por Supabase Auth)
-- ------------------------------------------------------------
create table if not exists users (
  id            uuid default gen_random_uuid() primary key,
  email         text unique not null,
  password_hash text not null,
  full_name     text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ------------------------------------------------------------
-- Productos (la app ya consultaba esta tabla; antes no estaba
-- en el schema porque se creaba en Supabase aparte)
-- ------------------------------------------------------------
create table if not exists products (
  id                    uuid default gen_random_uuid() primary key,
  slug                  text unique not null,
  name                  text not null,
  description           text,
  long_description      text,
  price                 integer not null default 0,
  image                 text,
  category              text default 'General',
  access                text default 'public',
  stock                 integer not null default 0,
  requires_prescription boolean default false,
  active                boolean default true,
  features              jsonb default '[]',
  variants              jsonb default '[]',
  animal                text,          -- 'dog' | 'cat'
  weight                text,          -- presentación, p.ej. "100 g"
  sku                   text,
  box_units             integer,       -- se vende por caja de N unidades
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ------------------------------------------------------------
-- Blog posts
-- ------------------------------------------------------------
create table if not exists blog_posts (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  slug        text unique not null,
  excerpt     text,
  content     text,
  cover_image text,
  category    text default 'General',
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- Pedidos / Órdenes
-- ------------------------------------------------------------
create table if not exists orders (
  id                 uuid default gen_random_uuid() primary key,
  user_id            uuid references users(id) on delete set null,
  user_email         text,
  items              jsonb not null default '[]',
  total              integer not null default 0,
  status             text not null default 'pending'
                       check (status in ('pending','processing','completed','cancelled')),
  external_reference text unique,
  mp_payment_id      text,
  notes              text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- ------------------------------------------------------------
-- Documentos de usuario
-- ------------------------------------------------------------
create table if not exists user_documents (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references users(id) on delete cascade unique,
  ci_url           text,
  prescription_url text,
  certificate_url  text,
  verified         boolean default false,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
