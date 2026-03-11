
-- Create app_role enum
create type public.app_role as enum ('admin', 'judge', 'student');

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Security definer function for role checks
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Get user role function
create or replace function public.get_user_role(_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.user_roles
  where user_id = _user_id
  limit 1
$$;

-- Initialize user profile (called after first login)
create or replace function public.initialize_user_profile(
  _full_name text,
  _email text,
  _role text default 'student'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (auth.uid(), _email, _full_name)
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (auth.uid(), _role::app_role)
  on conflict (user_id, role) do nothing;
end;
$$;

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  school text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Competitors (registered + guest/manual entry)
create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  school text,
  is_guest boolean default true,
  created_at timestamptz default now()
);
alter table public.competitors enable row level security;

-- Tournaments
create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  start_date date,
  end_date date,
  status text default 'active',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.tournaments enable row level security;

-- Ballots (main judging record)
create table public.ballots (
  id uuid primary key default gen_random_uuid(),
  judge_id uuid references auth.users(id) not null,
  tournament_name text,
  session_name text,
  round_number int default 1,
  format text default 'congress',
  status text default 'draft',
  notes text,
  submitted_at timestamptz,
  created_at timestamptz default now()
);
alter table public.ballots enable row level security;

-- Ballot entries (per-competitor scores within a ballot)
create table public.ballot_entries (
  id uuid primary key default gen_random_uuid(),
  ballot_id uuid references public.ballots(id) on delete cascade not null,
  competitor_id uuid references public.competitors(id) on delete cascade not null,
  rank int,
  score numeric,
  feedback text,
  created_at timestamptz default now()
);
alter table public.ballot_entries enable row level security;

-- RLS Policies

-- user_roles
create policy "Users can read own role" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

-- profiles
create policy "Users can read own profile" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "Users can update own profile" on public.profiles
  for update to authenticated using (id = auth.uid());

create policy "Admins can read all profiles" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- competitors
create policy "Authenticated can read competitors" on public.competitors
  for select to authenticated using (true);

create policy "Authenticated can insert competitors" on public.competitors
  for insert to authenticated with check (true);

-- tournaments
create policy "Authenticated can read tournaments" on public.tournaments
  for select to authenticated using (true);

create policy "Admins can insert tournaments" on public.tournaments
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update tournaments" on public.tournaments
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ballots
create policy "Judges can read own ballots" on public.ballots
  for select to authenticated using (judge_id = auth.uid());

create policy "Judges can insert own ballots" on public.ballots
  for insert to authenticated with check (judge_id = auth.uid());

create policy "Judges can update own ballots" on public.ballots
  for update to authenticated using (judge_id = auth.uid());

create policy "Admins can read all ballots" on public.ballots
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Students can read related ballots" on public.ballots
  for select to authenticated using (
    exists (
      select 1 from public.ballot_entries be
      join public.competitors c on c.id = be.competitor_id
      where be.ballot_id = ballots.id and c.user_id = auth.uid()
    )
  );

-- ballot_entries
create policy "Judges can read own ballot entries" on public.ballot_entries
  for select to authenticated using (
    exists (select 1 from public.ballots where ballots.id = ballot_entries.ballot_id and ballots.judge_id = auth.uid())
  );

create policy "Judges can insert own ballot entries" on public.ballot_entries
  for insert to authenticated with check (
    exists (select 1 from public.ballots where ballots.id = ballot_entries.ballot_id and ballots.judge_id = auth.uid())
  );

create policy "Judges can update own ballot entries" on public.ballot_entries
  for update to authenticated using (
    exists (select 1 from public.ballots where ballots.id = ballot_entries.ballot_id and ballots.judge_id = auth.uid())
  );

create policy "Admins can read all ballot entries" on public.ballot_entries
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Students can read own ballot entries" on public.ballot_entries
  for select to authenticated using (
    exists (select 1 from public.competitors where competitors.id = ballot_entries.competitor_id and competitors.user_id = auth.uid())
  );
