
-- 1. Growth tips
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Migration for existing data (run this if you have existing posts with string content):
-- ALTER TABLE public.posts ALTER COLUMN content TYPE jsonb USING jsonb_build_array(content);
-- ALTER TABLE public.posts ALTER COLUMN content SET DEFAULT '[]'::jsonb;


-- 2. App profiles
create table public.apps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_path text,
  monthly_revenue numeric(14, 2),
  revenue_type text not null default 'undisclosed'
    check (
      revenue_type in ('verified', 'estimated', 'undisclosed')
    ),
  revenue_currency text not null default 'USD',
  revenue_period text not null default 'mrr'
    check (
      revenue_period in ('mrr', 'arr')
    ),
  description text,
  growth_story text not null,
  website_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Enable Row Level Security
alter table public.posts enable row level security;
alter table public.apps enable row level security;

-- 4. Allow visitors to read published content only
grant select on public.posts to anon, authenticated;
grant select on public.apps to anon, authenticated;

create policy "Anyone can read published posts"
on public.posts
for select
to anon, authenticated
using (published = true);

create policy "Anyone can read published apps"
on public.apps
for select
to anon, authenticated
using (published = true);

-- 5. Allow anyone to insert, update, and delete posts
create policy "Anyone can insert posts"
on public.posts
for insert
to anon, authenticated
with check (true);

create policy "Anyone can update posts"
on public.posts
for update
to anon, authenticated
using (true)
with check (true);

create policy "Anyone can delete posts"
on public.posts
for delete
to anon, authenticated
using (true);

-- 6. Allow anyone to insert, update, and delete apps
create policy "Anyone can insert apps"
on public.apps
for insert
to anon, authenticated
with check (true);

create policy "Anyone can update apps"
on public.apps
for update
to anon, authenticated
using (true)
with check (true);

create policy "Anyone can delete apps"
on public.apps
for delete
to anon, authenticated
using (true);

-- 7. Storage policies for app-logos bucket
create policy "Allow public uploads"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'app-logos');

create policy "Allow public reads"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'app-logos');

create policy "Allow public updates"
on storage.objects
for update
to anon, authenticated
with check (bucket_id = 'app-logos');

create policy "Allow public deletes"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'app-logos');
