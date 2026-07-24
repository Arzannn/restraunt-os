create extension if not exists "pgcrypto";

create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

do $$ begin
  create type user_role as enum ('owner', 'manager', 'editor', 'viewer');
exception
  when duplicate_object then null;
end $$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  email text not null,
  role user_role not null default 'viewer',
  created_at timestamptz not null default now()
);

create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, slug)
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id uuid not null references menu_categories(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  image_url text,
  dietary_tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, slug)
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  public_id text not null,
  url text not null,
  alt text not null,
  folder text not null check (folder in ('menu', 'gallery', 'brand')),
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists theme_settings (
  restaurant_id uuid primary key references restaurants(id) on delete cascade,
  brand_name text not null,
  primary_color text not null default '#030303',
  accent_color text not null default '#d6a84f',
  background_color text not null default '#030303',
  typography text not null check (typography in ('serif', 'sans', 'editorial')) default 'editorial',
  updated_at timestamptz not null default now()
);

create table if not exists seo_settings (
  restaurant_id uuid primary key references restaurants(id) on delete cascade,
  title text not null,
  description text not null,
  og_image text,
  keywords text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table media_assets enable row level security;
alter table theme_settings enable row level security;
alter table seo_settings enable row level security;

create or replace function current_restaurant_id()
returns uuid language sql stable security definer as $$
  select restaurant_id from profiles where id = auth.uid()
$$;

create or replace function current_role()
returns user_role language sql stable security definer as $$
  select role from profiles where id = auth.uid()
$$;

create policy "tenant read profiles" on profiles for select using (restaurant_id = current_restaurant_id());
create policy "tenant read categories" on menu_categories for select using (restaurant_id = current_restaurant_id());
create policy "tenant write categories" on menu_categories for all using (restaurant_id = current_restaurant_id() and current_role() in ('owner', 'manager', 'editor')) with check (restaurant_id = current_restaurant_id());
create policy "tenant read menu items" on menu_items for select using (restaurant_id = current_restaurant_id());
create policy "tenant write menu items" on menu_items for all using (restaurant_id = current_restaurant_id() and current_role() in ('owner', 'manager', 'editor')) with check (restaurant_id = current_restaurant_id());
create policy "tenant read media" on media_assets for select using (restaurant_id = current_restaurant_id());
create policy "tenant write media" on media_assets for all using (restaurant_id = current_restaurant_id() and current_role() in ('owner', 'manager', 'editor')) with check (restaurant_id = current_restaurant_id());
create policy "tenant read theme" on theme_settings for select using (restaurant_id = current_restaurant_id());
create policy "owner write theme" on theme_settings for all using (restaurant_id = current_restaurant_id() and current_role() = 'owner') with check (restaurant_id = current_restaurant_id());
create policy "tenant read seo" on seo_settings for select using (restaurant_id = current_restaurant_id());
create policy "manager write seo" on seo_settings for all using (restaurant_id = current_restaurant_id() and current_role() in ('owner', 'manager')) with check (restaurant_id = current_restaurant_id());

create table if not exists builder_pages (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  slug text not null,
  title text not null,
  status text not null check (status in ('draft', 'published')) default 'draft',
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, slug)
);

create table if not exists builder_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references builder_pages(id) on delete cascade,
  version_number integer not null,
  title text not null,
  blocks jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (page_id, version_number)
);

alter table builder_pages enable row level security;
alter table builder_versions enable row level security;

create policy "tenant read builder pages" on builder_pages for select using (restaurant_id = current_restaurant_id());
create policy "tenant write builder pages" on builder_pages for all using (restaurant_id = current_restaurant_id() and current_role() in ('owner', 'manager', 'editor')) with check (restaurant_id = current_restaurant_id());
create policy "tenant read builder versions" on builder_versions for select using (exists (select 1 from builder_pages where builder_pages.id = builder_versions.page_id and builder_pages.restaurant_id = current_restaurant_id()));
create policy "tenant write builder versions" on builder_versions for insert with check (exists (select 1 from builder_pages where builder_pages.id = builder_versions.page_id and builder_pages.restaurant_id = current_restaurant_id() and current_role() in ('owner', 'manager', 'editor')));
