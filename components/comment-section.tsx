"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    username: string
    display_name: string
    avatar_url?: string
  }
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  currentUser: {
    display_name: string
    avatar_url?: string
  }
  onAddComment: (content: string) => Promise<void>
}

export function CommentSection({ postId, comments: initialComments, currentUser, onAddComment }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment)
      setNewComment("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">
            {currentUser.display_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Link href={`/profile/${comment.author.username}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">
                  {comment.author.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 space-y-1">
              <div className="bg-muted rounded-lg p-3">
                <Link href={`/profile/${comment.author.username}`} className="font-semibold text-sm hover:underline">
                  {comment.author.display_name}
                </Link>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
              <p className="text-xs text-muted-foreground px-3">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
