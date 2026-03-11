
-- Fix: restrict competitor inserts to judges and admins only
drop policy "Authenticated can insert competitors" on public.competitors;

create policy "Judges can insert competitors" on public.competitors
  for insert to authenticated
  with check (public.has_role(auth.uid(), 'judge') or public.has_role(auth.uid(), 'admin'));
