-- Create post_analysis table to store AI analysis results
create table if not exists public.post_analysis (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade unique,
  sentiment text not null check (sentiment in ('positive', 'negative', 'neutral', 'mixed')),
  sentiment_score numeric not null check (sentiment_score >= 0 and sentiment_score <= 1),
  tags text[] not null default '{}',
  summary text,
  key_points text[],
  moderation_flags text[] not null default '{}',
  is_safe boolean not null default true,
  suggestions text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.post_analysis enable row level security;

-- Post analysis policies
create policy "Post analysis is viewable by everyone"
  on public.post_analysis for select
  using (true);

create policy "Only system can insert post analysis"
  on public.post_analysis for insert
  with check (true);

create policy "Only system can update post analysis"
  on public.post_analysis for update
  using (true);

-- Create index for faster lookups
create index if not exists idx_post_analysis_post_id on public.post_analysis(post_id);
