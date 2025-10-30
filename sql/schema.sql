-- Enable extensions as needed
create extension if not exists "uuid-ossp";

-- Events
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  share_code text unique not null,
  title text not null,
  date_start timestamptz,
  date_end timestamptz,
  location text,
  about text,
  rsvp_details text,
  manager_email text,
  theme_color text default '#4F46E5',
  accent_color text default '#F97316',
  header_image text,
  created_at timestamptz default now()
);

-- Tasks (staffing or general)
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  title text not null,
  owner_name text,
  done boolean default false,
  type text check (type in ('task','staffing')) default 'task'
);

-- Food items with recipe
create table if not exists public.food_items (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  name text not null,
  claimed_by text,
  recipe_type text check (recipe_type in ('link','notes')) default 'notes',
  recipe_link text,
  recipe_notes text,
  allergens text[]
);

-- Equipment requests
create table if not exists public.equipment (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  name text not null,
  notes text,
  claimed_by text
);

-- Time slots
create table if not exists public.slots (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  label text not null,
  helper_name text
);

-- Polls
create table if not exists public.polls (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  question text not null
);
create table if not exists public.poll_options (
  id uuid primary key default uuid_generate_v4(),
  poll_id uuid references public.polls(id) on delete cascade,
  label text not null,
  votes int default 0
);
