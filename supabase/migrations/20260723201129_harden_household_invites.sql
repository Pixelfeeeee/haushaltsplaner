-- Sprint 13 follow-up: tighten invite function privileges and add FK indexes.

create index if not exists household_invites_created_by_idx
on public.household_invites(created_by);

create index if not exists household_invites_accepted_by_idx
on public.household_invites(accepted_by);

revoke execute on function public.get_household_invite(uuid) from public;
revoke execute on function public.accept_household_invite(uuid) from public;
revoke execute on function public.get_household_invite(uuid) from anon;
revoke execute on function public.accept_household_invite(uuid) from anon;

grant execute on function public.get_household_invite(uuid) to authenticated;
grant execute on function public.accept_household_invite(uuid) to authenticated;
