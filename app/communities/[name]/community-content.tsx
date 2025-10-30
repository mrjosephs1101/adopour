"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, ArrowLeft, Settings } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { CreatePost } from "@/components/create-post"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Community {
  id: string
  name: string
  display_name: string
  description: string | null
  avatar_url: string | null
  banner_url: string | null
  member_count: number
  post_count: number
  creator: {
    username: string
    display_name: string
    avatar_url: string | null
  } | null
}

interface Post {
  id: string
  content: string
  image_url: string | null
  created_at: string
  author: {
    username: string
    display_name: string
    avatar_url: string | null
    is_verified: boolean
  }
  likes: { user_id: string }[]
  comments: { count: number }[]
}

interface CommunityContentProps {
  community: Community
  posts: Post[]
  membership: { role: string } | null
  userId: string
  userProfile: any
}

export function CommunityContent({
  community,
  posts: initialPosts,
  membership,
  userId,
  userProfile,
}: CommunityContentProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [isMember, setIsMember] = useState(!!membership)
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()

  const handleJoinLeave = async () => {
    setIsJoining(true)
    const supabase = createClient()

    if (isMember) {
      // Leave community
      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", community.id)
        .eq("user_id", userId)

      if (!error) {
        setIsMember(false)
        router.refresh()
      }
    } else {
      // Join community
      const { error } = await supabase.from("community_members").insert({
        community_id: community.id,
        user_id: userId,
        role: "member",
      })

      if (!error) {
        setIsMember(true)
        router.refresh()
      }
    }

    setIsJoining(false)
  }

  const handleCreatePost = async (content: string, communityId?: string) => {
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
        author:profiles!posts_author_id_fkey(username, display_name, avatar_url, is_verified),
        likes(user_id),
        comments(count)
      `,
      )
      .single()

    if (!error && data) {
      const newPost = {
        id: data.id,
        content: data.content,
        image_url: data.image_url,
        created_at: data.created_at,
        author: data.author,
        likes: [],
        comments: [],
      }
      setPosts([newPost, ...posts])
    }
  }

  const isAdmin = membership?.role === "admin" || membership?.role === "moderator"

  return (
    <main className="container max-w-4xl py-8 space-y-6">
      <Button variant="ghost" onClick={() => router.push("/communities")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Communities
      </Button>

      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={community.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700 text-3xl">
                {community.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{community.display_name}</h1>
                  <p className="text-muted-foreground">c/{community.name}</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  )}
                  <Button
                    variant={isMember ? "outline" : "default"}
                    onClick={handleJoinLeave}
                    disabled={isJoining}
                    className={
                      !isMember
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        : ""
                    }
                  >
                    {isMember ? "Leave" : "Join"}
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm">{community.description}</p>
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{community.member_count.toLocaleString()} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{community.post_count.toLocaleString()} posts</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isMember && <CreatePost profile={userProfile} onPost={handleCreatePost} communityId={community.id} />}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={userId} />
        ))}
        {posts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No posts yet. {isMember ? "Be the first to post!" : "Join to start posting!"}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
