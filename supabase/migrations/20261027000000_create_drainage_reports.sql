-- Drainage reports submitted anonymously by people in Nattandiya.
--
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- Security model: the public `anon` role may READ every report and INSERT new ones, but may
-- only supply latitude/longitude/category/description. id, created_at and status are always
-- set by the database, and nobody without the service role can update or delete reports.

create table public.drainage_reports (
  id          uuid             primary key default gen_random_uuid(),
  created_at  timestamptz      not null default now(),
  latitude    double precision not null,
  longitude   double precision not null,
  category    text             not null,
  description text             not null,
  status      text             not null default 'pending',

  -- Service area — keep in sync with MAP_BOUNDS in src/config/map.ts.
  constraint drainage_reports_latitude_in_area
    check (latitude between 7.38 and 7.46),
  constraint drainage_reports_longitude_in_area
    check (longitude between 79.82 and 79.92),
  -- Keep in sync with REPORT_CATEGORIES / REPORT_STATUSES in src/types/report.ts.
  constraint drainage_reports_category_valid
    check (category in ('blocked_drain', 'illegal_construction', 'canal_issue', 'other')),
  constraint drainage_reports_status_valid
    check (status in ('pending', 'in_progress', 'resolved')),
  -- Keep in sync with DESCRIPTION_MIN_LENGTH / DESCRIPTION_MAX_LENGTH (code points).
  constraint drainage_reports_description_length
    check (char_length(description) between 10 and 1000)
);

comment on table public.drainage_reports is
  'Anonymous citizen reports of drainage problems in Nattandiya, Sri Lanka.';
comment on column public.drainage_reports.category is
  'blocked_drain | illegal_construction | canal_issue | other';
comment on column public.drainage_reports.status is
  'pending | in_progress | resolved — changed only by moderators (service role).';

-- The app pages through reports ordered by (created_at, id).
create index drainage_reports_created_at_id_idx
  on public.drainage_reports (created_at, id);

-- ---------------------------------------------------------------- privileges

alter table public.drainage_reports enable row level security;

-- Supabase grants ALL on new public tables to anon/authenticated by default; start from zero.
revoke all on table public.drainage_reports from anon, authenticated;

grant select on table public.drainage_reports to anon, authenticated;
-- Column-level grant: clients cannot set id, created_at or status at all.
grant insert (latitude, longitude, category, description)
  on table public.drainage_reports to anon, authenticated;

create policy "Reports are publicly readable"
  on public.drainage_reports
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can submit a pending report"
  on public.drainage_reports
  for insert
  to anon, authenticated
  with check (status = 'pending');
