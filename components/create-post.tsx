"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon } from "lucide-react"

interface CreatePostProps {
  profile: {
    display_name: string
    avatar_url?: string
  }
  onPost: (content: string) => Promise<void>
}

export function CreatePost({ profile, onPost }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const handlePost = async () => {
    if (!content.trim()) return

    setIsPosting(true)
    try {
      await onPost(content)
      setContent("")
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-cyan-100 text-cyan-700">
              {profile.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" disabled>
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button
                onClick={handlePost}
                disabled={!content.trim() || isPosting}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {isPosting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
