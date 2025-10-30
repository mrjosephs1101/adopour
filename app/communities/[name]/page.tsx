import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { CommunityContent } from "./community-content"
import { redirect, notFound } from "next/navigation"

export default async function CommunityPage({ params }: { params: { name: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch community
  const { data: community } = await supabase
    .from("communities")
    .select(
      `
      *,
      creator:creator_id(username, display_name, avatar_url)
    `,
    )
    .eq("name", params.name)
    .single()

  if (!community) {
    notFound()
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from("community_members")
    .select("role")
    .eq("community_id", community.id)
    .eq("user_id", user.id)
    .single()

  // Fetch community posts
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:author_id(username, display_name, avatar_url, is_verified),
      likes(user_id),
      comments(count)
    `,
    )
    .eq("community_id", community.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <Navigation user={user} profile={profile} />
      <CommunityContent
        community={community}
        posts={posts || []}
        membership={membership}
        userId={user.id}
        userProfile={profile}
      />
    </div>
  )
}
