-- Inquiries table for the contact/inquiry form
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  business_name text,
  topic text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table inquiries enable row level security;

-- Users can insert their own inquiries
create policy "Users can insert inquiries"
  on inquiries for insert
  to authenticated
  with check (auth.uid() = user_id or user_id is null);

-- Users can read their own inquiries
create policy "Users can read own inquiries"
  on inquiries for select
  to authenticated
  using (auth.uid() = user_id);
