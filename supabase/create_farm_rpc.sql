-- Run this in Supabase Dashboard → SQL Editor
-- Creates a farm + owner membership in one atomic call, bypassing RLS

create or replace function create_farm_for_user(
  p_name     text,
  p_location text default '',
  p_season   text default 'Season 2025'
)
returns uuid
language plpgsql
security definer          -- runs as DB owner, bypasses RLS
set search_path = public
as $$
declare
  v_user_id uuid;
  v_farm_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Ensure the user has a profile row (guards against trigger failure)
  insert into profiles (id, name, initials, email)
  select
    u.id,
    coalesce(u.raw_user_meta_data->>'name', u.email),
    upper(left(coalesce(u.raw_user_meta_data->>'name', u.email), 1)),
    u.email
  from auth.users u
  where u.id = v_user_id
  on conflict (id) do nothing;

  -- Create the farm
  v_farm_id := gen_random_uuid();
  insert into farms (id, name, location, season, created_by)
  values (v_farm_id, p_name, p_location, p_season, v_user_id);

  -- Add the creator as owner
  insert into farm_members (farm_id, user_id, role)
  values (v_farm_id, v_user_id, 'owner');

  return v_farm_id;
end;
$$;
