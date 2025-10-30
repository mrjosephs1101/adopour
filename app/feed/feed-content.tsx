"use client"

import { useState } from "react"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FeedContentProps {
  profile: {
    username: string
    display_name: string
    avatar_url?: string
    is_developer?: boolean
    is_admin?: boolean
  } | null
  initialPosts: Array<{
    id: string
    content: string
    image_url?: string
    created_at: string
    author: {
      username: string
      display_name: string
      avatar_url?: string
      is_developer?: boolean
      is_admin?: boolean
      is_verified?: boolean
    }
    likes_count: number
    comments_count: number
    is_liked: boolean
  }>
  userId?: string
}

export function FeedContent({ profile, initialPosts, userId }: FeedContentProps) {
  const [posts, setPosts] = useState(initialPosts)
  const router = useRouter()

  const handleCreatePost = async (content: string, communityId?: string) => {
    if (!userId) {
      router.push("/auth/login")
      return
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("posts")
      .insert({
        content,
        author_id: userId,
        community_id: communityId,
      })
      .select(
        `
        *,
        author:profiles!posts_author_id_fkey(username, display_name, avatar_url, is_developer, is_admin, is_verified)
      `,
      )
      .single()

    if (!error && data) {
      setPosts([
        {
          id: data.id,
          content: data.content,
          image_url: data.image_url,
          created_at: data.created_at,
          author: data.author,
          likes_count: 0,
          comments_count: 0,
          is_liked: false,
        },
        ...posts,
      ])
    }
  }

  const handleLike = async (postId: string) => {
    if (!userId) {
      router.push("/auth/login")
      return
    }

    const supabase = createClient()
    const post = posts.find((p) => p.id === postId)

    if (!post) return

    if (post.is_liked) {
      await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", userId)

      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes_count: p.likes_count - 1,
                is_liked: false,
              }
            : p,
        ),
      )
    } else {
      await supabase.from("likes").insert({
        post_id: postId,
        user_id: userId,
      })

      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes_count: p.likes_count + 1,
                is_liked: true,
              }
            : p,
        ),
      )
    }
  }

  const handleDelete = async (postId: string) => {
    if (!profile?.is_developer && !profile?.is_admin) return

    const supabase = createClient()
    const { error } = await supabase.from("posts").delete().eq("id", postId)

    if (!error) {
      setPosts(posts.filter((p) => p.id !== postId))
    }
  }

  return (
    <main className="container max-w-2xl py-8 space-y-6">
      {profile ? (
        <CreatePost profile={profile} onPost={handleCreatePost} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Sign in to create posts and interact with the community</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.push("/auth/login")} className="bg-cyan-600 hover:bg-cyan-700">
                  Sign In
                </Button>
                <Button onClick={() => router.push("/auth/sign-up")} variant="outline">
                  Sign Up
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            currentUserIsDeveloper={profile?.is_developer}
            currentUserIsAdmin={profile?.is_admin}
            onDelete={handleDelete}
          />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>
    </main>
  )
}
