"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
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
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const router = useRouter()

  const handleCommentClick = () => {
    router.push(`/post/${post.id}`)
  }

  return (
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
      <CardFooter className="flex items-center gap-4 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className={post.is_liked ? "text-red-500" : ""}
          onClick={() => onLike?.(post.id)}
        >
          <Heart className={`h-4 w-4 mr-1 ${post.is_liked ? "fill-current" : ""}`} />
          {post.likes_count}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCommentClick}>
          <MessageCircle className="h-4 w-4 mr-1" />
          {post.comments_count}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}
