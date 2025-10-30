import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { CommunitiesContent } from "./communities-content"
import { redirect } from "next/navigation"

export default async function CommunitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch all communities
  const { data: communities } = await supabase
    .from("communities")
    .select(
      `
      *,
      creator:creator_id(username, display_name, avatar_url)
    `,
    )
    .order("member_count", { ascending: false })

  // Fetch user's joined communities
  const { data: userCommunities } = await supabase
    .from("community_members")
    .select("community_id")
    .eq("user_id", user.id)

  const joinedCommunityIds = new Set(userCommunities?.map((uc) => uc.community_id) || [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <Navigation user={user} profile={profile} />
      <CommunitiesContent communities={communities || []} joinedCommunityIds={joinedCommunityIds} userId={user.id} />
    </div>
  )
}
