-- Migration: Create Past Executives Table & Policies
-- Date: 2026-07-27
-- Target: Store archived executives after Power Transition, categorized by council_type and academic_session.

create table if not exists public.past_executives (
  id uuid default gen_random_uuid() primary key,
  slug text not null,
  name text not null,
  role text not null,
  faculty text,
  tenure_start text,
  tenure_end text,
  photo_url text,
  projects_md text,
  contacts jsonb default '{}'::jsonb,
  council_type text not null check (council_type in ('Central', 'Senate', 'Judiciary')),
  academic_session text not null,
  transitioned_at timestamptz default now()
);

-- Enable RLS
alter table public.past_executives enable row level security;

-- Policies for past_executives
drop policy if exists "select_past_executives" on public.past_executives;
drop policy if exists "Admins can insert past_executives" on public.past_executives;
drop policy if exists "Admins can update past_executives" on public.past_executives;
drop policy if exists "Admins can delete past_executives" on public.past_executives;

create policy "select_past_executives" on public.past_executives 
  for select to public using (true);

create policy "Admins can insert past_executives" on public.past_executives 
  for insert to authenticated with check (
    exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update past_executives" on public.past_executives 
  for update to authenticated using (
    exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete past_executives" on public.past_executives 
  for delete to authenticated using (
    exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin')
  );

-- Indexes for performance
create index if not exists idx_past_execs_council_session 
  on public.past_executives (council_type, academic_session);

create index if not exists idx_past_execs_academic_session 
  on public.past_executives (academic_session);
