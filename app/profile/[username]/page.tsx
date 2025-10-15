import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { ProfileContent } from "./profile-content"
// import { AdoAIButton } from "@/components/droppy-button"

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get current user's profile
  const { data: currentUserProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!currentUserProfile) {
    redirect("/auth/login")
  }

  // Get profile being viewed
  const { data: viewedProfile } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (!viewedProfile) {
    notFound()
  }

  // Get posts by this user
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url),
      likes(count),
      comments(count)
    `,
    )
    .eq("author_id", viewedProfile.id)
    .order("created_at", { ascending: false })

  // Get user's likes
  const { data: userLikes } = await supabase.from("likes").select("post_id").eq("user_id", user.id)

  const likedPostIds = new Set(userLikes?.map((like) => like.post_id) || [])

  const postsWithCounts = posts?.map((post) => ({
    id: post.id,
    content: post.content,
    image_url: post.image_url,
    created_at: post.created_at,
    author: post.author,
    likes_count: post.likes[0]?.count || 0,
    comments_count: post.comments[0]?.count || 0,
    is_liked: likedPostIds.has(post.id),
  }))

  // Get post count
  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("author_id", viewedProfile.id)

  // Get friends count
  const { count: friendsCount } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .eq("user_id", viewedProfile.id)
    .eq("status", "accepted")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <Navigation user={user} profile={currentUserProfile} />
      <ProfileContent
        profile={viewedProfile}
        posts={postsWithCounts || []}
        postCount={postCount || 0}
        friendsCount={friendsCount || 0}
        isOwnProfile={user.id === viewedProfile.id}
        userId={user.id}
      />
      {/* <AdoAIButton /> */}
    </div>
  )
}
