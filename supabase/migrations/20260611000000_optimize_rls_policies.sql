-- Migration: Optimize Row Level Security (RLS) Policies
-- Date: 2026-06-11
-- Target: Resolve 'auth_rls_initplan' and 'multiple_permissive_policies' performance warnings.

-- =====================================================================
-- 1. NEWS TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can insert news" on news;
drop policy if exists "Admins can update news" on news;
drop policy if exists "Admins can delete news" on news;
drop policy if exists "Allow public read news" on news;
drop policy if exists "Public read access for news" on news;
drop policy if exists "select_news" on news;

create policy "select_news" on news 
  for select to public using (true);

create policy "Admins can insert news" on news 
  for insert to authenticated with check (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update news" on news 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete news" on news 
  for delete to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );


-- =====================================================================
-- 2. COMPLAINTS TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can view all complaints" on complaints;
drop policy if exists "Public can view anonymous complaints" on complaints;
drop policy if exists "Users can view their own complaints" on complaints;
drop policy if exists "Allow public insert" on complaints;
drop policy if exists "Admins can update complaints" on complaints;
drop policy if exists "Admins can delete complaints" on complaints;
drop policy if exists "Users can delete their own complaints" on complaints;
drop policy if exists "select_complaints" on complaints;
drop policy if exists "delete_complaints" on complaints;

-- Combined SELECT policy to avoid multiple permissive policies warning
create policy "select_complaints" on complaints 
  for select to public using (
    (is_anonymous = true) OR
    ((select auth.uid()) = user_id) OR
    (exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin'))
  );

create policy "Allow public insert" on complaints 
  for insert to public with check (
    (user_id is null) OR
    (user_id = (select auth.uid()))
  );

create policy "Admins can update complaints" on complaints 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "delete_complaints" on complaints 
  for delete to authenticated using (
    ((select auth.uid()) = user_id) OR
    (exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin'))
  );


-- =====================================================================
-- 3. PARTNERS TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can manage partners" on partners;
drop policy if exists "Public read access for partners" on partners;
drop policy if exists "Admins can insert partners" on partners;
drop policy if exists "Admins can update partners" on partners;
drop policy if exists "Admins can delete partners" on partners;

create policy "Public read access for partners" on partners 
  for select to public using (true);

create policy "Admins can insert partners" on partners 
  for insert to authenticated with check (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update partners" on partners 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete partners" on partners 
  for delete to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );


-- =====================================================================
-- 4. COMPLAINT_TIMELINE TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can insert timeline" on complaint_timeline;
drop policy if exists "Admins can update timeline" on complaint_timeline;
drop policy if exists "Admins can delete timeline" on complaint_timeline;
drop policy if exists "Users can view timeline" on complaint_timeline;
drop policy if exists "Authenticated users can read timeline" on complaint_timeline;
drop policy if exists "select_timeline" on complaint_timeline;

create policy "select_timeline" on complaint_timeline 
  for select to public using (
    exists (select 1 from complaints where complaints.id = complaint_timeline.complaint_id)
  );

create policy "Admins can insert timeline" on complaint_timeline 
  for insert to authenticated with check (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update timeline" on complaint_timeline 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete timeline" on complaint_timeline 
  for delete to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );


-- =====================================================================
-- 5. EVENTS TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can insert events" on events;
drop policy if exists "Admins can update events" on events;
drop policy if exists "Admins can delete events" on events;
drop policy if exists "Allow public read events" on events;
drop policy if exists "Public read access for events" on events;
drop policy if exists "select_events" on events;

create policy "select_events" on events 
  for select to public using (true);

create policy "Admins can insert events" on events 
  for insert to authenticated with check (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update events" on events 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete events" on events 
  for delete to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );


-- =====================================================================
-- 6. EXECUTIVES TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can insert executives" on executives;
drop policy if exists "Admins can update executives" on executives;
drop policy if exists "Admins can delete executives" on executives;
drop policy if exists "Allow public read executives" on executives;
drop policy if exists "Public read access for executives" on executives;
drop policy if exists "select_executives" on executives;

create policy "select_executives" on executives 
  for select to public using (true);

create policy "Admins can insert executives" on executives 
  for insert to authenticated with check (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update executives" on executives 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete executives" on executives 
  for delete to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );


-- =====================================================================
-- 7. GLOBAL ANNOUNCEMENTS TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can insert announcements" on global_announcements;
drop policy if exists "Admins can update announcements" on global_announcements;
drop policy if exists "Admins can delete announcements" on global_announcements;
drop policy if exists "Allow public read global_announcements" on global_announcements;
drop policy if exists "Public read access for active announcements" on global_announcements;
drop policy if exists "select_global_announcements" on global_announcements;

-- Combined SELECT policy to avoid multiple permissive policies warning
create policy "select_global_announcements" on global_announcements 
  for select to public using (
    is_active = true OR
    (exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin'))
  );

create policy "Admins can insert announcements" on global_announcements 
  for insert to authenticated with check (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update announcements" on global_announcements 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete announcements" on global_announcements 
  for delete to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );


-- =====================================================================
-- 8. OPPORTUNITIES TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can insert opportunities" on opportunities;
drop policy if exists "Admins can update opportunities" on opportunities;
drop policy if exists "Admins can delete opportunities" on opportunities;
drop policy if exists "Allow public read opportunities" on opportunities;
drop policy if exists "Public read access for opportunities" on opportunities;
drop policy if exists "select_opportunities" on opportunities;

create policy "select_opportunities" on opportunities 
  for select to public using (true);

create policy "Admins can insert opportunities" on opportunities 
  for insert to authenticated with check (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update opportunities" on opportunities 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete opportunities" on opportunities 
  for delete to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );


-- =====================================================================
-- 9. STUDENT_SPOTLIGHT TABLE POLICIES
-- =====================================================================
drop policy if exists "Admins can insert student spotlight" on student_spotlight;
drop policy if exists "Admins can update student spotlight" on student_spotlight;
drop policy if exists "Admins can delete student spotlight" on student_spotlight;
drop policy if exists "Allow public read student spotlight" on student_spotlight;
drop policy if exists "Public read access for student spotlight" on student_spotlight;
drop policy if exists "select_student_spotlight" on student_spotlight;

create policy "select_student_spotlight" on student_spotlight 
  for select to public using (true);

create policy "Admins can insert student spotlight" on student_spotlight 
  for insert to authenticated with check (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can update student spotlight" on student_spotlight 
  for update to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );

create policy "Admins can delete student spotlight" on student_spotlight 
  for delete to authenticated using (
    exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
  );
