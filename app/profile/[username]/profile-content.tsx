"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { UserPlus, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ProfileContentProps {
  profile: {
    id: string
    username: string
    display_name: string
    avatar_url?: string
    bio?: string
    created_at: string
  }
  posts: Array<{
    id: string
    content: string
    image_url?: string
    created_at: string
    author: {
      username: string
      display_name: string
      avatar_url?: string
    }
    likes_count: number
    comments_count: number
    is_liked: boolean
  }>
  postCount: number
  friendsCount: number
  isOwnProfile: boolean
  userId: string
}

export function ProfileContent({
  profile,
  posts: initialPosts,
  postCount,
  friendsCount,
  isOwnProfile,
  userId,
}: ProfileContentProps) {
  const [posts, setPosts] = useState(initialPosts)

  const handleLike = async (postId: string) => {
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

  return (
    <main className="container max-w-4xl py-8 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-cyan-100 text-cyan-700 text-4xl">
                {profile.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{profile.display_name}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>
              {profile.bio && <p className="text-sm">{profile.bio}</p>}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold">{postCount}</span>{" "}
                  <span className="text-muted-foreground">Posts</span>
                </div>
                <div>
                  <span className="font-semibold">{friendsCount}</span>{" "}
                  <span className="text-muted-foreground">Friends</span>
                </div>
              </div>
              {!isOwnProfile && (
                <div className="flex gap-2">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Posts</h2>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
        {posts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No posts yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
