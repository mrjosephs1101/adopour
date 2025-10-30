-- Add is_admin and is_verified columns to profiles table
alter table public.profiles
add column if not exists is_admin boolean default false,
add column if not exists is_verified boolean default false;

-- Update RLS policies to allow admins to manage content

-- Admins can update any profile
create policy "Admins can update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can delete any post
create policy "Admins can delete any post"
  on public.posts for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can delete any comment
create policy "Admins can delete any comment"
  on public.comments for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can delete any like
create policy "Admins can delete any like"
  on public.likes for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
