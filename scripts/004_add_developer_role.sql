-- Add is_developer column to profiles table
alter table public.profiles
add column if not exists is_developer boolean default false;

-- Update the handle_new_user function to check for developer credentials
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
  v_display_name text;
  v_is_developer boolean := false;
begin
  -- Extract username and display name from metadata
  v_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  v_display_name := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1));
  
  -- Check if this user should be marked as a developer
  if new.email = 'mrjosephgaming777@gmail.com' and v_username = 'MJOStudios' then
    v_is_developer := true;
  end if;

  insert into public.profiles (id, username, display_name, avatar_url, is_developer)
  values (
    new.id,
    v_username,
    v_display_name,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    v_is_developer
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Update RLS policies to allow developers to do anything

-- Developers can update any profile
create policy "Developers can update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );

-- Developers can delete any profile
create policy "Developers can delete any profile"
  on public.profiles for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );

-- Developers can update any post
create policy "Developers can update any post"
  on public.posts for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );

-- Developers can delete any post
create policy "Developers can delete any post"
  on public.posts for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );

-- Developers can delete any like
create policy "Developers can delete any like"
  on public.likes for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );

-- Developers can update any comment
create policy "Developers can update any comment"
  on public.comments for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );

-- Developers can delete any comment
create policy "Developers can delete any comment"
  on public.comments for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );

-- Developers can manage any friendship
create policy "Developers can update any friendship"
  on public.friendships for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );

create policy "Developers can delete any friendship"
  on public.friendships for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_developer = true
    )
  );
