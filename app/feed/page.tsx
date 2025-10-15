import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { FeedContent } from "./feed-content"

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  // Get posts with author info, likes count, and comments count
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
    .order("created_at", { ascending: false })
    .limit(50)

  let likedPostIds = new Set<string>()
  if (user) {
    const { data: userLikes } = await supabase.from("likes").select("post_id").eq("user_id", user.id)
    likedPostIds = new Set(userLikes?.map((like) => like.post_id) || [])
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <Navigation user={user} profile={profile} />
      <FeedContent profile={profile} initialPosts={postsWithCounts || []} userId={user?.id} />
    </div>
  )
}
