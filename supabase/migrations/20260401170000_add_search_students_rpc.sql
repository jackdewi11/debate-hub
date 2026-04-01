-- Allow judges/admins to search registered student accounts for ballot linking.
create or replace function public.search_students(_query text, _limit integer default 5)
returns table (
  id uuid,
  full_name text,
  email text
)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.full_name, p.email
  from public.profiles p
  join public.user_roles ur
    on ur.user_id = p.id
   and ur.role = 'student'::public.app_role
  where (
    public.has_role(auth.uid(), 'judge'::public.app_role)
    or public.has_role(auth.uid(), 'admin'::public.app_role)
  )
    and coalesce(length(trim(_query)), 0) >= 2
    and (
      p.full_name ilike ('%' || trim(_query) || '%')
      or p.email ilike ('%' || trim(_query) || '%')
    )
  order by p.full_name asc nulls last
  limit greatest(1, least(coalesce(_limit, 5), 20));
$$;

revoke all on function public.search_students(text, integer) from public;
grant execute on function public.search_students(text, integer) to authenticated;
