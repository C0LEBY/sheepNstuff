-- ══════════════════════════════════════════════════════
--  SheepTrack — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════

-- ── Profiles (mirrors auth.users) ─────────────────────
create table if not exists profiles (
  id       uuid references auth.users on delete cascade primary key,
  name     text,
  initials text,
  email    text
);

-- auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  parts text[];
  init  text;
begin
  parts := string_to_array(coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), ' ');
  init  := upper(left(parts[1],1) || coalesce(left(parts[2],1),''));
  insert into profiles (id, name, initials, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email), init, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Farms ──────────────────────────────────────────────
create table if not exists farms (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  location   text,
  season     text,
  logo       text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ── Farm Members ───────────────────────────────────────
create table if not exists farm_members (
  id      uuid default gen_random_uuid() primary key,
  farm_id uuid references farms(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role    text check (role in ('owner','admin','viewer')) default 'viewer',
  unique(farm_id, user_id)
);

-- ── Areas ──────────────────────────────────────────────
create table if not exists areas (
  id          uuid default gen_random_uuid() primary key,
  farm_id     uuid references farms(id) on delete cascade not null,
  name        text not null,
  type        text,
  capacity    integer default 0,
  description text,
  created_at  timestamptz default now()
);

-- ── Sheep ──────────────────────────────────────────────
create table if not exists sheep (
  id            uuid default gen_random_uuid() primary key,
  farm_id       uuid references farms(id) on delete cascade not null,
  tag_number    text not null,
  name          text,
  sex           text check (sex in ('ewe','ram','lamb','wether')),
  breed         text,
  date_of_birth date,
  area_id       uuid references areas(id) on delete set null,
  status        text check (status in ('healthy','sick','pregnant','sold','dead','missing')) default 'healthy',
  weight        numeric,
  notes         text,
  mother_id     uuid references sheep(id) on delete set null,
  father_id     uuid references sheep(id) on delete set null,
  created_at    timestamptz default now()
);

-- ── Health Records ─────────────────────────────────────
create table if not exists health_records (
  id             uuid default gen_random_uuid() primary key,
  farm_id        uuid references farms(id) on delete cascade not null,
  sheep_id       uuid references sheep(id) on delete cascade,
  date           date not null,
  type           text,
  treatment      text,
  vet            text,
  follow_up_date date,
  notes          text,
  created_at     timestamptz default now()
);

-- ── Births ─────────────────────────────────────────────
create table if not exists births (
  id         uuid default gen_random_uuid() primary key,
  farm_id    uuid references farms(id) on delete cascade not null,
  date       date not null,
  mother_id  uuid references sheep(id) on delete set null,
  father_id  uuid references sheep(id) on delete set null,
  lamb_count integer default 1,
  lamb_ids   text[] default '{}',
  type       text,
  stillborns integer default 0,
  notes      text,
  created_at timestamptz default now()
);

-- ── Breeding Records ───────────────────────────────────
create table if not exists breeding_records (
  id                    uuid default gen_random_uuid() primary key,
  farm_id               uuid references farms(id) on delete cascade not null,
  ewe_id                uuid references sheep(id) on delete set null,
  ram_id                uuid references sheep(id) on delete set null,
  mating_date           date,
  expected_lambing_date date,
  status                text check (status in ('mated','pregnant','lambed','failed')) default 'mated',
  lambs_produced        integer default 0,
  notes                 text,
  created_at            timestamptz default now()
);

-- ── Sales / Purchases ──────────────────────────────────
create table if not exists transactions (
  id            uuid default gen_random_uuid() primary key,
  farm_id       uuid references farms(id) on delete cascade not null,
  type          text check (type in ('sale','purchase')) not null,
  date          date not null,
  sheep_ids     text[] default '{}',
  count         integer default 0,
  price_per_head numeric,
  total_amount  numeric,
  party         text,
  notes         text,
  created_at    timestamptz default now()
);

-- ── Tasks ──────────────────────────────────────────────
create table if not exists tasks (
  id        uuid default gen_random_uuid() primary key,
  farm_id   uuid references farms(id) on delete cascade not null,
  title     text not null,
  category  text,
  due_date  date,
  priority  text check (priority in ('low','medium','high')) default 'medium',
  completed boolean default false,
  area_id   uuid references areas(id) on delete set null,
  notes     text,
  created_at timestamptz default now()
);

-- ── Deaths ─────────────────────────────────────────────
create table if not exists deaths (
  id        uuid default gen_random_uuid() primary key,
  farm_id   uuid references farms(id) on delete cascade not null,
  sheep_id  uuid references sheep(id) on delete set null,
  date      date not null,
  cause     text,
  notes     text,
  created_at timestamptz default now()
);

-- ══════════════════════════════════════════════════════
--  Row Level Security
-- ══════════════════════════════════════════════════════

alter table profiles        enable row level security;
alter table farms           enable row level security;
alter table farm_members    enable row level security;
alter table areas           enable row level security;
alter table sheep           enable row level security;
alter table health_records  enable row level security;
alter table births          enable row level security;
alter table breeding_records enable row level security;
alter table transactions    enable row level security;
alter table tasks           enable row level security;
alter table deaths          enable row level security;

-- profiles: own row
create policy "own profile" on profiles for all using (auth.uid() = id);

-- farms: use SECURITY DEFINER function to avoid recursive RLS
create policy "farm member access" on farms for all
  using (is_farm_member(id));

create policy "farm member insert" on farms for insert
  with check (true);

-- farm_members: use SECURITY DEFINER function to avoid infinite recursion
create policy "farm members access" on farm_members for all
  using (user_id = auth.uid() or is_farm_member(farm_id));

create policy "farm members insert" on farm_members for insert
  with check (true);

-- helper to check farm membership
create or replace function is_farm_member(fid uuid)
returns boolean language sql security definer as $$
  select exists(select 1 from farm_members where farm_id = fid and user_id = auth.uid());
$$;

-- all farm-scoped tables
create policy "areas access"     on areas            for all using (is_farm_member(farm_id));
create policy "sheep access"     on sheep            for all using (is_farm_member(farm_id));
create policy "health access"    on health_records   for all using (is_farm_member(farm_id));
create policy "births access"    on births           for all using (is_farm_member(farm_id));
create policy "breeding access"  on breeding_records for all using (is_farm_member(farm_id));
create policy "tx access"        on transactions     for all using (is_farm_member(farm_id));
create policy "tasks access"     on tasks            for all using (is_farm_member(farm_id));
create policy "deaths access"    on deaths           for all using (is_farm_member(farm_id));
