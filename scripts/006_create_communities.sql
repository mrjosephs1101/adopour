-- Create communities table
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  description text,
  avatar_url text,
  banner_url text,
  creator_id uuid references public.profiles(id) on delete set null,
  member_count integer default 0,
  post_count integer default 0,
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create community_members table
create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.communities(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('member', 'moderator', 'admin')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(community_id, user_id)
);

-- Add community_id to posts table
alter table public.posts
add column if not exists community_id uuid references public.communities(id) on delete cascade;

-- Create indexes for better performance
create index if not exists idx_communities_name on public.communities(name);
create index if not exists idx_communities_creator on public.communities(creator_id);
create index if not exists idx_community_members_community on public.community_members(community_id);
create index if not exists idx_community_members_user on public.community_members(user_id);
create index if not exists idx_posts_community on public.posts(community_id);

-- Enable RLS
alter table public.communities enable row level security;
alter table public.community_members enable row level security;

-- RLS Policies for communities
create policy "Communities are viewable by everyone"
  on public.communities for select
  using (true);

create policy "Authenticated users can create communities"
  on public.communities for insert
  with check (auth.uid() is not null);

create policy "Community admins can update their communities"
  on public.communities for update
  using (
    exists (
      select 1 from public.community_members
      where community_id = id
        and user_id = auth.uid()
        and role in ('admin', 'moderator')
    )
  );

create policy "Community admins can delete their communities"
  on public.communities for delete
  using (
    exists (
      select 1 from public.community_members
      where community_id = id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

-- RLS Policies for community_members
create policy "Community members are viewable by everyone"
  on public.community_members for select
  using (true);

create policy "Users can join communities"
  on public.community_members for insert
  with check (auth.uid() = user_id);

create policy "Users can leave communities"
  on public.community_members for delete
  using (auth.uid() = user_id);

create policy "Community admins can manage members"
  on public.community_members for all
  using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_id
        and cm.user_id = auth.uid()
        and cm.role in ('admin', 'moderator')
    )
  );

-- Function to update member count
create or replace function update_community_member_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.communities
    set member_count = member_count + 1
    where id = NEW.community_id;
  elsif TG_OP = 'DELETE' then
    update public.communities
    set member_count = member_count - 1
    where id = OLD.community_id;
  end if;
  return null;
end;
$$ language plpgsql;

-- Trigger to update member count
drop trigger if exists update_community_member_count_trigger on public.community_members;
create trigger update_community_member_count_trigger
  after insert or delete on public.community_members
  for each row execute function update_community_member_count();

-- Function to update post count
create or replace function update_community_post_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' and NEW.community_id is not null then
    update public.communities
    set post_count = post_count + 1
    where id = NEW.community_id;
  elsif TG_OP = 'DELETE' and OLD.community_id is not null then
    update public.communities
    set post_count = post_count - 1
    where id = OLD.community_id;
  elsif TG_OP = 'UPDATE' then
    if OLD.community_id is not null and NEW.community_id is null then
      update public.communities
      set post_count = post_count - 1
      where id = OLD.community_id;
    elsif OLD.community_id is null and NEW.community_id is not null then
      update public.communities
      set post_count = post_count + 1
      where id = NEW.community_id;
    elsif OLD.community_id != NEW.community_id then
      update public.communities
      set post_count = post_count - 1
      where id = OLD.community_id;
      update public.communities
      set post_count = post_count + 1
      where id = NEW.community_id;
    end if;
  end if;
  return null;
end;
$$ language plpgsql;

-- Trigger to update post count
drop trigger if exists update_community_post_count_trigger on public.posts;
create trigger update_community_post_count_trigger
  after insert or update or delete on public.posts
  for each row execute function update_community_post_count();

-- Insert some default communities
insert into public.communities (name, display_name, description, creator_id)
values
  ('general', 'General Discussion', 'A place for general conversations and topics', null),
  ('pets', 'Pet Lovers', 'Share photos and stories about your furry friends', null),
  ('gaming', 'Gaming', 'Discuss your favorite games and gaming news', null),
  ('tech', 'Technology', 'All things tech, gadgets, and innovation', null),
  ('art', 'Art & Creativity', 'Share your artwork and creative projects', null)
on conflict (name) do nothing;
