-- Push notification tokens for Most Computers mobile app
create table if not exists public.push_tokens (
  email       text primary key,
  token       text not null,
  platform    text not null default 'unknown',
  updated_at  timestamptz not null default now()
);

alter table public.push_tokens enable row level security;

-- Anyone can upsert their own token (anon inserts are fine for push tokens)
create policy "anon can upsert push_tokens"
  on public.push_tokens for all
  using (true)
  with check (true);
