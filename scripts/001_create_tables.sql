-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create likes table
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
);

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create friendships table (for following/friends)
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamp with time zone default now(),
  unique(user_id, friend_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.friendships enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Posts policies
create policy "Posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Users can create their own posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- Likes policies
create policy "Likes are viewable by everyone"
  on public.likes for select
  using (true);

create policy "Users can create their own likes"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.likes for delete
  using (auth.uid() = user_id);

-- Comments policies
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "Users can create their own comments"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own comments"
  on public.comments for update
  using (auth.uid() = author_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = author_id);

-- Friendships policies
create policy "Users can view their own friendships"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can create their own friendship requests"
  on public.friendships for insert
  with check (auth.uid() = user_id);

create policy "Users can update friendships they're part of"
  on public.friendships for update
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can delete their own friendships"
  on public.friendships for delete
  using (auth.uid() = user_id);
