-- Sprint 13: Invite links for joining a shared household.
-- Invite tokens are UUIDs. A signed-in user can accept a valid token once.

create table if not exists public.household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  token uuid not null default gen_random_uuid() unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now()
);

create index if not exists household_invites_household_id_idx
on public.household_invites(household_id);

create index if not exists household_invites_token_idx
on public.household_invites(token);

create index if not exists household_invites_created_by_idx
on public.household_invites(created_by);

create index if not exists household_invites_accepted_by_idx
on public.household_invites(accepted_by);

alter table public.household_invites enable row level security;

create policy "Members can read household invites"
on public.household_invites for select
to authenticated
using (public.is_household_member(household_id));

create policy "Owners can create household invites"
on public.household_invites for insert
to authenticated
with check (
  public.is_household_owner(household_id)
  and created_by = (select auth.uid())
);

create policy "Owners can delete household invites"
on public.household_invites for delete
to authenticated
using (public.is_household_owner(household_id));

create or replace function public.get_household_invite(invite_token uuid)
returns table (
  household_id uuid,
  household_name text,
  expires_at timestamptz,
  accepted_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    household_invites.household_id,
    households.name as household_name,
    household_invites.expires_at,
    household_invites.accepted_at
  from public.household_invites
  join public.households
    on households.id = household_invites.household_id
  where household_invites.token = invite_token
    and household_invites.expires_at > now()
  limit 1;
$$;

create or replace function public.accept_household_invite(invite_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_record public.household_invites%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select *
  into invite_record
  from public.household_invites
  where token = invite_token
    and accepted_at is null
    and expires_at > now()
  for update;

  if not found then
    raise exception 'invite_not_found';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (invite_record.household_id, auth.uid(), 'member')
  on conflict (household_id, user_id) do nothing;

  update public.household_invites
  set
    accepted_by = auth.uid(),
    accepted_at = now()
  where id = invite_record.id;

  return invite_record.household_id;
end;
$$;

revoke execute on function public.get_household_invite(uuid) from public;
revoke execute on function public.accept_household_invite(uuid) from public;
revoke execute on function public.get_household_invite(uuid) from anon;
revoke execute on function public.accept_household_invite(uuid) from anon;

grant select, insert, delete on public.household_invites to authenticated;
grant execute on function public.get_household_invite(uuid) to authenticated;
grant execute on function public.accept_household_invite(uuid) to authenticated;
