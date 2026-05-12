-- Wishlist sync table
create table if not exists public.wishlists (
  email        text primary key,
  product_ids  integer[] not null default '{}',
  updated_at   timestamptz not null default now()
);

-- RLS
alter table public.wishlists enable row level security;

-- Allow anon to upsert/select by email (client sends email as identifier)
create policy "anon_wishlist_upsert" on public.wishlists
  for all using (true) with check (true);
