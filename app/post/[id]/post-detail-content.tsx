"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { CommentSection } from "@/components/comment-section"
import { createClient } from "@/lib/supabase/client"

interface PostDetailContentProps {
  post: {
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
  }
  comments: Array<{
    id: string
    content: string
    created_at: string
    author: {
      username: string
      display_name: string
      avatar_url?: string
    }
  }>
  currentUser: {
    display_name: string
    avatar_url?: string
  }
  userId: string
}

export function PostDetailContent({
  post: initialPost,
  comments: initialComments,
  currentUser,
  userId,
}: PostDetailContentProps) {
  const [post, setPost] = useState(initialPost)
  const [comments, setComments] = useState(initialComments)
  const router = useRouter()

  const handleLike = async () => {
    const supabase = createClient()

    if (post.is_liked) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", userId)

      setPost({
        ...post,
        likes_count: post.likes_count - 1,
        is_liked: false,
      })
    } else {
      await supabase.from("likes").insert({
        post_id: post.id,
        user_id: userId,
      })

      setPost({
        ...post,
        likes_count: post.likes_count + 1,
        is_liked: true,
      })
    }
  }

  const handleAddComment = async (content: string) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: post.id,
        author_id: userId,
        content,
      })
      .select(
        `
        *,
        author:profiles!comments_author_id_fkey(username, display_name, avatar_url)
      `,
      )
      .single()

    if (!error && data) {
      setComments([...comments, data])
      setPost({
        ...post,
        comments_count: post.comments_count + 1,
      })
    }
  }

  return (
    <main className="container max-w-2xl py-8 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-4 pb-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar>
              <AvatarImage src={post.author.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-cyan-100 text-cyan-700">
                {post.author.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link href={`/profile/${post.author.username}`} className="font-semibold hover:underline">
              {post.author.display_name}
            </Link>
            <span className="text-sm text-muted-foreground">
              @{post.author.username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
          {post.image_url && (
            <img
              src={post.image_url || "/placeholder.svg"}
              alt="Post image"
              className="mt-3 rounded-lg w-full object-cover max-h-96"
            />
          )}
        </CardContent>
        <CardFooter className="flex items-center gap-4 pt-0 border-b pb-4">
          <Button variant="ghost" size="sm" className={post.is_liked ? "text-red-500" : ""} onClick={handleLike}>
            <Heart className={`h-4 w-4 mr-1 ${post.is_liked ? "fill-current" : ""}`} />
            {post.likes_count}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4 mr-1" />
            {post.comments_count}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </CardFooter>
        <CardContent className="pt-4">
          <CommentSection
            postId={post.id}
            comments={comments}
            currentUser={currentUser}
            onAddComment={handleAddComment}
          />
        </CardContent>
      </Card>
    </main>
  )
}
