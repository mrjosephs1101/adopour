"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Sparkles, CheckCircle2, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

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
      is_developer?: boolean
      is_admin?: boolean
      is_verified?: boolean
    }
    likes_count: number
    comments_count: number
    is_liked: boolean
  }
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  currentUserIsDeveloper?: boolean
  currentUserIsAdmin?: boolean
  onDelete?: (postId: string) => void
}

interface PostAnalysis {
  sentiment: string
  tags: string[]
  summary: string
}

export function PostCard({
  post,
  onLike,
  onComment,
  currentUserIsDeveloper,
  currentUserIsAdmin,
  onDelete,
}: PostCardProps) {
  const router = useRouter()
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysis, setAnalysis] = useState<PostAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleCommentClick = () => {
    router.push(`/post/${post.id}`)
  }

  const handleAnalyze = async () => {
    if (analysis) {
      setShowAnalysis(!showAnalysis)
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: post.content }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)
        setShowAnalysis(true)
      }
    } catch (error) {
      console.error("[v0] Error analyzing post:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50"
      case "negative":
        return "text-red-600 bg-red-50"
      case "neutral":
        return "text-gray-600 bg-gray-50"
      case "mixed":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
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
          <Link
            href={`/profile/${post.author.username}`}
            className="font-semibold hover:underline flex items-center gap-2"
          >
            {post.author.display_name}
            {post.author.is_developer && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Developer
              </Badge>
            )}
            {post.author.is_admin && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
            {post.author.is_verified && (
              <Badge className="bg-blue-500 text-white text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </Link>
          <span className="text-sm text-muted-foreground">
            @{post.author.username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>
        {(currentUserIsDeveloper || currentUserIsAdmin) && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(post.id)}
          >
            Delete
          </Button>
        )}
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

        {showAnalysis && analysis && (
          <div className="mt-3 p-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700">
              <Sparkles className="h-3 w-3" />
              AI Insights
            </div>

            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getSentimentColor(analysis.sentiment)}`}>
                {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
              </Badge>
            </div>

            {analysis.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {analysis.tags.slice(0, 4).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-600 italic">"{analysis.summary}"</p>
          </div>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="ml-auto text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {isAnalyzing ? "..." : showAnalysis ? "Hide" : "Analyze"}
        </Button>
      </CardFooter>
    </Card>
  )
}
