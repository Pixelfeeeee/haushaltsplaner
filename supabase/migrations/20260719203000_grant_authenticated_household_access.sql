-- Sprint 9: Allow authenticated users to access the public household tables.
-- RLS still decides which rows they can actually see or change.

grant usage on schema public to authenticated;

grant usage on type public.member_role to authenticated;
grant usage on type public.task_priority to authenticated;
grant usage on type public.task_status to authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.households to authenticated;
grant select, insert, update, delete on public.household_members to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, delete on public.task_completions to authenticated;

revoke execute on function public.is_household_member(uuid) from public;
revoke execute on function public.is_household_owner(uuid) from public;
revoke execute on function public.can_create_initial_owner_membership(uuid, uuid, public.member_role) from public;

grant execute on function public.is_household_member(uuid) to authenticated;
grant execute on function public.is_household_owner(uuid) to authenticated;
grant execute on function public.can_create_initial_owner_membership(uuid, uuid, public.member_role) to authenticated;

