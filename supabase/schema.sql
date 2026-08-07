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
  low_stock_threshold   integer not null default 5,  -- umbral de stock crítico
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- Umbral de stock crítico para tablas 'products' ya existentes (idempotente).
alter table products add column if not exists low_stock_threshold integer not null default 5;

-- ------------------------------------------------------------
-- Categorías de productos (gestionables desde el admin)
-- Jerarquía: la MASCOTA (animal) es la categoría padre (Perros/Gatos)
-- y `name` es la subcategoría (Alimento, Arena, Snacks, ...).
-- Una misma subcategoría puede existir para perro y para gato.
-- ------------------------------------------------------------
create table if not exists categories (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  animal     text,                        -- 'dog' | 'cat' (categoría padre)
  created_at timestamptz default now()
);

-- Migración a jerarquía por mascota (idempotente).
alter table categories add column if not exists animal text;
alter table categories drop constraint if exists categories_name_key;
create unique index if not exists categories_name_animal_key on categories (name, animal);

-- Semilla: subcategorías por mascota, tomadas de los productos existentes.
insert into categories (name, animal)
  select distinct category, animal from products
  where category is not null and category <> '' and animal in ('dog', 'cat')
  on conflict (name, animal) do nothing;

-- Limpia filas planas antiguas (sin mascota) tras crear las scopeadas.
delete from categories where animal is null;

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
  shipping_cost      integer not null default 0,
  shipping_method    text,
  shipping_address   jsonb,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- Columnas de despacho para tablas 'orders' ya existentes (idempotente).
alter table orders add column if not exists shipping_cost    integer not null default 0;
alter table orders add column if not exists shipping_method  text;
alter table orders add column if not exists shipping_address jsonb;

-- ------------------------------------------------------------
-- Clientes (se registran solos al comprar; guest checkout)
-- ------------------------------------------------------------
create table if not exists customers (
  id         uuid default gen_random_uuid() primary key,
  email      text unique not null,
  name       text,
  phone      text,
  region     text,
  comuna     text,
  address    text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
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
