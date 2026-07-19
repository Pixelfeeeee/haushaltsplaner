-- Sprint 9: Base schema for household accounts, shared households and recurring tasks.
-- This migration is written for Supabase Postgres with auth.users available.

create extension if not exists "pgcrypto";

create type public.member_role as enum ('owner', 'member');
create type public.task_priority as enum ('low', 'medium', 'high');
create type public.task_status as enum ('open', 'paused', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  category text not null,
  room_id text not null,
  interval_days integer not null check (interval_days > 0),
  due_date date not null,
  urgency public.task_priority not null default 'medium',
  importance public.task_priority not null default 'medium',
  estimated_minutes integer not null default 15 check (estimated_minutes > 0),
  status public.task_status not null default 'open',
  postponed_until date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  completed_by uuid references auth.users(id) on delete set null,
  completed_at timestamptz not null default now()
);

create index household_members_user_id_idx on public.household_members(user_id);
create index tasks_household_id_due_date_idx on public.tasks(household_id, due_date);
create index tasks_household_id_status_idx on public.tasks(household_id, status);
create index task_completions_task_id_completed_at_idx on public.task_completions(task_id, completed_at desc);
create index task_completions_household_id_completed_at_idx on public.task_completions(household_id, completed_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_households_updated_at
before update on public.households
for each row execute function public.set_updated_at();

create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = target_household_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_household_owner(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = target_household_id
      and user_id = auth.uid()
      and role = 'owner'
  );
$$;

create or replace function public.can_create_initial_owner_membership(
  target_household_id uuid,
  target_user_id uuid,
  target_role public.member_role
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.households
    where households.id = target_household_id
      and households.created_by = auth.uid()
      and target_user_id = auth.uid()
      and target_role = 'owner'
  );
$$;

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.tasks enable row level security;
alter table public.task_completions enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
using (id = auth.uid());

create policy "Users can insert their own profile"
on public.profiles for insert
with check (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Members can read their households"
on public.households for select
using (public.is_household_member(id));

create policy "Authenticated users can create households"
on public.households for insert
with check (created_by = auth.uid());

create policy "Owners can update households"
on public.households for update
using (public.is_household_owner(id))
with check (public.is_household_owner(id));

create policy "Owners can delete households"
on public.households for delete
using (public.is_household_owner(id));

create policy "Members can read memberships"
on public.household_members for select
using (public.is_household_member(household_id));

create policy "Users can create their initial owner membership"
on public.household_members for insert
with check (
  public.can_create_initial_owner_membership(household_id, user_id, role)
);

create policy "Owners can add members"
on public.household_members for insert
with check (public.is_household_owner(household_id));

create policy "Owners can update memberships"
on public.household_members for update
using (public.is_household_owner(household_id))
with check (public.is_household_owner(household_id));

create policy "Owners can remove memberships"
on public.household_members for delete
using (public.is_household_owner(household_id));

create policy "Members can read household tasks"
on public.tasks for select
using (public.is_household_member(household_id));

create policy "Members can create household tasks"
on public.tasks for insert
with check (
  public.is_household_member(household_id)
  and created_by = auth.uid()
);

create policy "Members can update household tasks"
on public.tasks for update
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

create policy "Members can delete household tasks"
on public.tasks for delete
using (public.is_household_member(household_id));

create policy "Members can read task completions"
on public.task_completions for select
using (public.is_household_member(household_id));

create policy "Members can create task completions"
on public.task_completions for insert
with check (
  public.is_household_member(household_id)
  and completed_by = auth.uid()
);

create policy "Members can delete task completions"
on public.task_completions for delete
using (public.is_household_member(household_id));
