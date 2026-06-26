-- Career applications table
create table if not exists public.career_applications (
  id             bigint generated always as identity primary key,
  job_id         text,
  job_title      text,
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text,
  cover_letter   text,
  cv_url         text,
  status         text not null default 'new',  -- new | reviewing | rejected | hired
  notes          text,
  submitted_at   timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- RLS
alter table public.career_applications enable row level security;

-- Anon can insert (submit application), cannot read others
create policy "anon_careers_insert" on public.career_applications
  for insert to anon with check (true);

-- Authenticated (admin) can read and update all
create policy "auth_careers_select" on public.career_applications
  for select to authenticated using (true);

create policy "auth_careers_update" on public.career_applications
  for update to authenticated using (true) with check (true);

create policy "auth_careers_delete" on public.career_applications
  for delete to authenticated using (true);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'career_applications_updated_at'
  ) then
    create trigger career_applications_updated_at
      before update on public.career_applications
      for each row execute function public.set_updated_at();
  end if;
end;
$$;

-- Storage bucket for CVs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'careers-cvs',
  'careers-cvs',
  false,
  5242880,  -- 5 MB
  array['application/pdf','application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

-- Storage RLS: anon can upload, authenticated can read/delete
create policy "anon_careers_upload" on storage.objects
  for insert to anon
  with check (bucket_id = 'careers-cvs');

create policy "auth_careers_read_cv" on storage.objects
  for select to authenticated
  using (bucket_id = 'careers-cvs');

create policy "auth_careers_delete_cv" on storage.objects
  for delete to authenticated
  using (bucket_id = 'careers-cvs');
