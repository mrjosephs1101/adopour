import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { PostDetailContent } from "./post-detail-content"
// import { AdoAIButton } from "@/components/droppy-button"

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Get post with author info
  const { data: post } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!posts_author_id_fkey(username, display_name, avatar_url)
    `,
    )
    .eq("id", id)
    .single()

  if (!post) {
    notFound()
  }

  // Get likes count and check if user liked
  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", id)

  const { data: userLike } = await supabase.from("likes").select("id").eq("post_id", id).eq("user_id", user.id).single()

  // Get comments with author info
  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:profiles!comments_author_id_fkey(username, display_name, avatar_url)
    `,
    )
    .eq("post_id", id)
    .order("created_at", { ascending: true })

  const postWithCounts = {
    id: post.id,
    content: post.content,
    image_url: post.image_url,
    created_at: post.created_at,
    author: post.author,
    likes_count: likesCount || 0,
    comments_count: comments?.length || 0,
    is_liked: !!userLike,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <Navigation user={user} profile={profile} />
      <PostDetailContent post={postWithCounts} comments={comments || []} currentUser={profile} userId={user.id} />
      {/* <AdoAIButton /> */}
    </div>
  )
}
