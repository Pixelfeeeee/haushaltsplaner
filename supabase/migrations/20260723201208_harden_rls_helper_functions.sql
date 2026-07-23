-- Sprint 13 follow-up: keep RLS helper functions away from anonymous RPC calls.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.is_household_member(uuid) from public;
revoke execute on function public.is_household_owner(uuid) from public;
revoke execute on function public.can_create_initial_owner_membership(uuid, uuid, public.member_role) from public;

revoke execute on function public.is_household_member(uuid) from anon;
revoke execute on function public.is_household_owner(uuid) from anon;
revoke execute on function public.can_create_initial_owner_membership(uuid, uuid, public.member_role) from anon;

grant execute on function public.is_household_member(uuid) to authenticated;
grant execute on function public.is_household_owner(uuid) to authenticated;
grant execute on function public.can_create_initial_owner_membership(uuid, uuid, public.member_role) to authenticated;
